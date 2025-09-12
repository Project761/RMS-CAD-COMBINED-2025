import React, { useEffect, useRef, useState } from 'react'
import { PDFDocument } from 'pdf-lib';
import Loader from '../../Common/Loader';
import { fetchPostData } from '../../hooks/Api';
import axios from 'axios';
import IncNumModal from './IncNumModal';


const UCR84Report = () => {

    const [pdfURL, setPdfURL] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const iframeRef = useRef(null);
    const [arrayBuffer, setArrayBuffer] = useState(null);
    const [baseUrl, setBaseUrl] = useState("")
    const [myFile, setMyFile] = useState()
    const [modalStatus, setModalStatus] = useState(true)
    const [reportData, setReportData] = useState([])
    const [incidentNumber, setIncidentNumber] = useState()
    const [errors, setErrors] = useState({ 'IncidentNoError': '' })
    const dataToBlob = async (imageData) => {
        return await (await fetch(imageData)).blob();
    };

    // FUNCTION TO GET PDF FILE
    const GetReportPdfFile = async () => {
        const val = { 'Url': 'C:\\HostingSpaces\\admin\\apigoldline.com\\wwwroot\\Imagefolder\\UCR-84-QUANTITYOFDRUGS.pdf' };
        try {
            const res = await axios.post("HateCrimeIncidentReport/PdftoBase64", val);
            if (res && res.data) {
                const src = res.data.data;
                setBaseUrl(`data:application/pdf;base64,${src}`);
            } else {
                console.log('error');
            }
        } catch (error) {
            console.error('Error fetching the report:', error);
        }
    };

    // FUNCTIO TO GET DATA OF RELATED PDF
    const GetReportData = () => {
        const val = { IncidentNumber: incidentNumber }
        fetchPostData('HateCrimeIncidentReport/PublicSafety', val).then((data) => {
            if (data) {
                setReportData(data)
                setModalStatus(false);
            } else {
                setReportData([])
            }
        })
    }

    useEffect(() => {
        GetReportPdfFile();
    }, [])

    // TO CONVERT FILE URL TO PDF FILE FORMATE
    useEffect(() => {
        if (baseUrl != '') {
            (async () => {
                const blob = await dataToBlob(baseUrl);
                const file = new File([blob], new Date().valueOf() + ".pdf", { type: 'application/pdf' });
                const urlll = URL.createObjectURL(file);
                setMyFile(file)

            })();
        }
    }, [baseUrl, setBaseUrl])

    // FUNCTION TO CHECK FILE AND CREATE ARRAY BUFFER OF FILE
    const handleFileChange = async (event) => {
        if (incidentNumber) {
            GetReportData();
        }
        if (myFile && myFile.type === 'application/pdf') {
            const reader = new FileReader();
            reader.onload = function (e) {
                const arrayBuffer = e.target.result;
                setArrayBuffer(arrayBuffer);
            };
            reader.onerror = function (error) {
                console.error('Error reading file:', error);
            };
            reader.readAsArrayBuffer(myFile);
            setErrors({ ...errors, ['IncidentNoError']: '' });

        } else {
            console.error('Please upload a valid PDF file.');
        }
    };

    //TO GET ALL FIELDS OF FILE AND SET DATA TO RELATED FIELD AND OPEN FILLED FILE
    useEffect(() => {
        if (arrayBuffer && reportData) {
            const setPDF = async () => {
                setIsLoading(true)
                const fieldsObject = {};
                const pdfDoc = await PDFDocument.load(arrayBuffer)

                const form = pdfDoc.getForm();
                const fields = form.getFields();
                fields.forEach((field, index) => {
                    const type = field.constructor.name;
                    const name = field.getName();
                    fieldsObject[name.replace(/ +/g, "")] = type;
                });

                const txtMarijuanaPackagesSolidPounds = fieldsObject?.txtMarijuanaPackagesSolidPounds ? form.getTextField('txtMarijuanaPackagesSolidPounds') : null;
                const txtMarijuanaPackagesSolidOunces = fieldsObject?.txtMarijuanaPackagesSolidOunces ? form.getTextField('txtMarijuanaPackagesSolidOunces') : null;
                const txtMarijuanaPlantsItems = fieldsObject?.txtMarijuanaPlantsItems ? form.getTextField('txtMarijuanaPlantsItems') : null;

                const txtMarijuanaGardensItems = fieldsObject?.txtMarijuanaGardensItems ? form.getTextField('txtMarijuanaGardensItems') : null;
                const txtMarijuanaWildFieldsItems = fieldsObject?.txtMarijuanaWildFieldsItems ? form.getTextField('txtMarijuanaWildFieldsItems') : null;
                const txtMarijuanaCultivativeFieldsItems = fieldsObject?.txtMarijuanaCultivativeFieldsItems ? form.getTextField('txtMarijuanaCultivativeFieldsItems') : null;
                const txtMarijuanaGreenHousesItems = fieldsObject?.txtMarijuanaGreenHousesItems ? form.getTextField('txtMarijuanaGreenHousesItems') : null;

                const txtHashishLiquidOunces = fieldsObject?.txtHashishLiquidOunces ? form.getTextField('txtHashishLiquidOunces') : null;
                const txtHashishSolidsPounds = fieldsObject?.txtHashishSolidsPounds ? form.getTextField('txtHashishSolidsPounds') : null;
                const txtHashishSolidsOunces = fieldsObject?.txtHashishSolidsOunces ? form.getTextField('txtHashishSolidsOunces') : null;
                const txtHashishSolidsGrams = fieldsObject?.txtHashishSolidsGrams ? form.getTextField('txtHashishSolidsGrams') : null;

                const txtOpiatesMarphineSolidOunces = fieldsObject?.txtOpiatesMarphineSolidOunces ? form.getTextField('txtOpiatesMarphineSolidOunces') : null;
                const txtOpiatesHeroinSolidOunces = fieldsObject?.txtOpiatesHeroinSolidOunces ? form.getTextField('txtOpiatesHeroinSolidOunces') : null;
                const txtOpiatesCodeineSolidOunces = fieldsObject?.txtOpiatesCodeineSolidOunces ? form.getTextField('txtOpiatesCodeineSolidOunces') : null;
                const txtOpiatesGumSolidOunces = fieldsObject?.txtOpiatesGumSolidOunces ? form.getTextField('txtOpiatesGumSolidOunces') : null;
                const txtOpiatesMarphineSolidGrams = fieldsObject?.txtOpiatesMarphineSolidGrams ? form.getTextField('txtOpiatesMarphineSolidGrams') : null;
                const txtOpiatesHeroinSolidGrams = fieldsObject?.txtOpiatesHeroinSolidGrams ? form.getTextField('txtOpiatesHeroinSolidGrams') : null;
                const txtOpiatesCodeineSolidGrams = fieldsObject?.txtOpiatesCodeineSolidGrams ? form.getTextField('txtOpiatesCodeineSolidGrams') : null;
                const txtOpiatesGumSolidGrams = fieldsObject?.txtOpiatesGumSolidGrams ? form.getTextField('txtOpiatesGumSolidGrams') : null;
                const txtOpiatesMarphineLiquidOunces = fieldsObject?.txtOpiatesMarphineLiquidOunces ? form.getTextField('txtOpiatesMarphineLiquidOunces') : null;
                const txtOpiatesHeroinLiquidOunces = fieldsObject?.txtOpiatesHeroinLiquidOunces ? form.getTextField('txtOpiatesHeroinLiquidOunces') : null;
                const txtOpiatesCodeinLiquidOunces = fieldsObject?.txtOpiatesCodeinLiquidOunces ? form.getTextField('txtOpiatesCodeinLiquidOunces') : null;
                const txtOpiatesMarphineDoseUnits = fieldsObject?.txtOpiatesMarphineDoseUnits ? form.getTextField('txtOpiatesMarphineDoseUnits') : null;
                const txtOpiatesHeroinDoseUnits = fieldsObject?.txtOpiatesHeroinDoseUnits ? form.getTextField('txtOpiatesHeroinDoseUnits') : null;
                const txtOpiatesCodeineDoseUnits = fieldsObject?.txtOpiatesCodeineDoseUnits ? form.getTextField('txtOpiatesCodeineDoseUnits') : null;
                const txtOpiatesMarphinePounds = fieldsObject?.txtOpiatesMarphinePounds ? form.getTextField('txtOpiatesMarphinePounds') : null;
                const txtOpiatesHeroinounds = fieldsObject?.txtOpiatesHeroinounds ? form.getTextField('txtOpiatesHeroinounds') : null;
                const txtOpiatesCodeinePounds = fieldsObject?.txtOpiatesCodeinePounds ? form.getTextField('txtOpiatesCodeinePounds') : null;
                const txtOpiatesGumPounds = fieldsObject?.txtOpiatesGumPounds ? form.getTextField('txtOpiatesGumPounds') : null;

                const txtCocaineSolidPounds = fieldsObject?.txtCocaineSolidPounds ? form.getTextField('txtCocaineSolidPounds') : null;
                const txtCocaineSolidOunces = fieldsObject?.txtCocaineSolidOunces ? form.getTextField('txtCocaineSolidOunces') : null;
                const txtCocaineSolidGrams = fieldsObject?.txtCocaineSolidGrams ? form.getTextField('txtCocaineSolidGrams') : null;
                const txtCocaineLiquidOunces = fieldsObject?.txtCocaineLiquidOunces ? form.getTextField('txtCocaineLiquidOunces') : null;

                const PrecursorSolidPounds = fieldsObject?.PrecursorSolidPounds ? form.getTextField('PrecursorSolidPounds') : null;
                const PrecursorSolidOunces = fieldsObject?.PrecursorSolidOunces ? form.getTextField('PrecursorSolidOunces') : null;
                const PrecursorLiquidOunces = fieldsObject?.PrecursorLiquidOunces ? form.getTextField('PrecursorLiquidOunces') : null;
                const txtPrecursorSolidGrams = fieldsObject?.txtPrecursorSolidGrams ? form.getTextField('txtPrecursorSolidGrams') : null;

                const txtHallucinogensDrugsDoseUnits = fieldsObject?.txtHallucinogensDrugsDoseUnits ? form.getTextField('txtHallucinogensDrugsDoseUnits') : null;
                const txtHallucinogensDrugsLiquidOunces = fieldsObject?.txtHallucinogensDrugsLiquidOunces ? form.getTextField('txtHallucinogensDrugsLiquidOunces') : null;
                const txtHallucinogensDrugsSolidGrams = fieldsObject?.txtHallucinogensDrugsSolidGrams ? form.getTextField('txtHallucinogensDrugsSolidGrams') : null;
                const txtHallucinogensDrugsSolidOunces = fieldsObject?.txtHallucinogensDrugsSolidOunces ? form.getTextField('txtHallucinogensDrugsSolidOunces') : null;
                const txtHallucinogensDrugsSolidPounds = fieldsObject?.txtHallucinogensDrugsSolidPounds ? form.getTextField('txtHallucinogensDrugsSolidPounds') : null;
                const txtHallucinogensLSDDoseUnits = fieldsObject?.txtHallucinogensLSDDoseUnits ? form.getTextField('txtHallucinogensLSDDoseUnits') : null;
                const txtHallucinogensLSDLiquidOunces = fieldsObject?.txtHallucinogensLSDLiquidOunces ? form.getTextField('txtHallucinogensLSDLiquidOunces') : null;
                const txtHallucinogensLSDSolidGrams = fieldsObject?.txtHallucinogensLSDSolidGrams ? form.getTextField('txtHallucinogensLSDSolidGrams') : null;
                const txtHallucinogensLSDSolidPounds = fieldsObject?.txtHallucinogensLSDSolidPounds ? form.getTextField('txtHallucinogensLSDSolidPounds') : null;
                const txtHallucinogensMashroomDoseUnits = fieldsObject?.txtHallucinogensMashroomDoseUnits ? form.getTextField('txtHallucinogensMashroomDoseUnits') : null;
                const txtHallucinogensMashroomSolidGrams = fieldsObject?.txtHallucinogensMashroomSolidGrams ? form.getTextField('txtHallucinogensMashroomSolidGrams') : null;
                const txtHallucinogensMashroomSolidOunces = fieldsObject?.txtHallucinogensMashroomSolidOunces ? form.getTextField('txtHallucinogensMashroomSolidOunces') : null;
                const txtHallucinogensMashroomSolidPounds = fieldsObject?.txtHallucinogensMashroomSolidPounds ? form.getTextField('txtHallucinogensMashroomSolidPounds') : null;
                const txtHallucinogensPCPDoseUnits = fieldsObject?.txtHallucinogensPCPDoseUnits ? form.getTextField('txtHallucinogensPCPDoseUnits') : null;
                const txtHallucinogensPCPLiquidOunces = fieldsObject?.txtHallucinogensPCPLiquidOunces ? form.getTextField('txtHallucinogensPCPLiquidOunces') : null;
                const txtHallucinogensPCPSolidGrams = fieldsObject?.txtHallucinogensPCPSolidGrams ? form.getTextField('txtHallucinogensPCPSolidGrams') : null;
                const txtHallucinogensPCPSolidOunces = fieldsObject?.txtHallucinogensPCPSolidOunces ? form.getTextField('txtHallucinogensPCPSolidOunces') : null;
                const txtHallucinogensPCPSolidPounds = fieldsObject?.txtHallucinogensPCPSolidPounds ? form.getTextField('txtHallucinogensPCPSolidPounds') : null;
                const txtHallucinogensPeyoteSolidGrams = fieldsObject?.txtHallucinogensPeyoteSolidGrams ? form.getTextField('txtHallucinogensPeyoteSolidGrams') : null;
                const txtHallucinogensPeyoteSolidOunces = fieldsObject?.txtHallucinogensPeyoteSolidOunces ? form.getTextField('txtHallucinogensPeyoteSolidOunces') : null;
                const txtHallucinogensPeyoteSolidPounds = fieldsObject?.txtHallucinogensPeyoteSolidPounds ? form.getTextField('txtHallucinogensPeyoteSolidPounds') : null;

                const txtOtherDrugsAmphetaminaesDoseUnits = fieldsObject?.txtOtherDrugsAmphetaminaesDoseUnits ? form.getTextField('txtOtherDrugsAmphetaminaesDoseUnits') : null;
                const txtOtherDrugsAmphetaminaesLiquidOunces = fieldsObject?.txtOtherDrugsAmphetaminaesLiquidOunces ? form.getTextField('txtOtherDrugsAmphetaminaesLiquidOunces') : null;
                const txtOtherDrugsAmphetaminaesSolidGrams = fieldsObject?.txtOtherDrugsAmphetaminaesSolidGrams ? form.getTextField('txtOtherDrugsAmphetaminaesSolidGrams') : null;
                const txtOtherDrugsAmphetaminaesSolidOunces = fieldsObject?.txtOtherDrugsAmphetaminaesSolidOunces ? form.getTextField('txtOtherDrugsAmphetaminaesSolidOunces') : null;
                const txtOtherDrugsAmphetaminaesSolidPounds = fieldsObject?.txtOtherDrugsAmphetaminaesSolidPounds ? form.getTextField('txtOtherDrugsAmphetaminaesSolidPounds') : null;
                const txtOtherDrugsBarbituratesDoseUnits = fieldsObject?.txtOtherDrugsBarbituratesDoseUnits ? form.getTextField('txtOtherDrugsBarbituratesDoseUnits') : null;
                const txtOtherDrugsBarbituratesLiquidOunces = fieldsObject?.txtOtherDrugsBarbituratesLiquidOunces ? form.getTextField('txtOtherDrugsBarbituratesLiquidOunces') : null;
                const txtOtherDrugsMethamphetaminesDoseUnits = fieldsObject?.txtOtherDrugsMethamphetaminesDoseUnits ? form.getTextField('txtOtherDrugsMethamphetaminesDoseUnits') : null;
                const txtOtherDrugsMethamphetaminesLiquidOunces = fieldsObject?.txtOtherDrugsMethamphetaminesLiquidOunces ? form.getTextField('txtOtherDrugsMethamphetaminesLiquidOunces') : null;
                const txtOtherDrugsMethamphetaminesSolidGrams = fieldsObject?.txtOtherDrugsMethamphetaminesSolidGrams ? form.getTextField('txtOtherDrugsMethamphetaminesSolidGrams') : null;
                const txtOtherDrugsMethamphetaminesSolidOunces = fieldsObject?.txtOtherDrugsMethamphetaminesSolidOunces ? form.getTextField('txtOtherDrugsMethamphetaminesSolidOunces') : null;
                const txtOtherDrugsMethamphetaminesSolidPounds = fieldsObject?.txtOtherDrugsMethamphetaminesSolidPounds ? form.getTextField('txtOtherDrugsMethamphetaminesSolidPounds') : null;
                const txtOtherDrugsSyntheticDoseUnits = fieldsObject?.txtOtherDrugsSyntheticDoseUnits ? form.getTextField('txtOtherDrugsSyntheticDoseUnits') : null;
                const txtOtherDrugsSyntheticLiquidOunces = fieldsObject?.txtOtherDrugsSyntheticLiquidOunces ? form.getTextField('txtOtherDrugsSyntheticLiquidOunces') : null;
                const txtOtherDrugsTranquilizersDoseUnits = fieldsObject?.txtOtherDrugsTranquilizersDoseUnits ? form.getTextField('txtOtherDrugsTranquilizersDoseUnits') : null;
                const txtOtherDrugsTranquilizersLiquidOunces = fieldsObject?.txtOtherDrugsTranquilizersLiquidOunces ? form.getTextField('txtOtherDrugsTranquilizersLiquidOunces') : null;

                const txtClandastineLabsItems = fieldsObject?.txtClandastineLabsItems ? form.getTextField('txtClandastineLabsItems') : null;

                const txtAgency = fieldsObject?.txtAgency ? form.getTextField('txtAgency') : null;
                const txtAgencyName = fieldsObject?.txtAgencyName ? form.getTextField('txtAgencyName') : null;
                const txtPreparedBy = fieldsObject?.txtPreparedBy ? form.getTextField('txtPreparedBy') : null;
                const txtMonthYear = fieldsObject?.txtMonthYear ? form.getTextField('txtMonthYear') : null;


                if (reportData?.length > 0) {

                    reportData?.map((data) => {
                        if (data?.SuspectedDrugTypeID == 2 || data?.SuspectedDrugType_Description == "Cocaine") {
                            data?.SolidPounds ? txtCocaineSolidPounds?.setText(data?.SolidPounds) : txtCocaineSolidPounds?.setText('')
                            data?.SolidOunces ? txtCocaineSolidOunces?.setText(data?.SolidOunces) : txtCocaineSolidOunces?.setText('')
                            data?.SolidGrams ? txtCocaineSolidGrams?.setText(data?.SolidGrams) : txtCocaineSolidGrams?.setText('')
                            data?.LiquidOunces ? txtCocaineLiquidOunces?.setText(data?.LiquidOunces) : txtCocaineLiquidOunces?.setText('')
                        }

                        if (data?.SuspectedDrugTypeID == 5 || data?.SuspectedDrugType_Description == "Marijuana") {
                            data?.SolidPounds ? txtMarijuanaPackagesSolidPounds?.setText(data?.SolidPounds) : txtMarijuanaPackagesSolidPounds?.setText('')
                            data?.SolidOunces ? txtMarijuanaPackagesSolidOunces?.setText(data?.SolidOunces) : txtMarijuanaPackagesSolidOunces?.setText('')
                            data?.Items ? txtMarijuanaPlantsItems?.setText(data?.Items) : txtMarijuanaPlantsItems?.setText('')
                        }

                        if (data?.SuspectedDrugTypeID == 3 || data?.SuspectedDrugType_Description == "Hashish") {
                            data?.SolidPounds ? txtHashishSolidsPounds?.setText(data?.SolidPounds) : txtHashishSolidsPounds?.setText('')
                            data?.SolidOunces ? txtHashishSolidsOunces?.setText(data?.SolidOunces) : txtHashishSolidsOunces?.setText('')
                            data?.SolidGrams ? txtHashishSolidsGrams?.setText(data?.SolidGrams) : txtHashishSolidsGrams?.setText('')
                            data?.LiquidOunces ? txtHashishLiquidOunces?.setText(data?.LiquidOunces) : txtHashishLiquidOunces?.setText('')
                        }

                        if (data?.SuspectedDrugTypeID == 4 || data?.SuspectedDrugType_Description == "Heroin") {
                            data?.SolidPounds ? txtOpiatesHeroinounds?.setText(data?.SolidPounds) : txtOpiatesHeroinounds?.setText('')
                            data?.SolidOunces ? txtOpiatesHeroinSolidOunces?.setText(data?.SolidOunces) : txtOpiatesHeroinSolidOunces?.setText('')
                            data?.SolidGrams ? txtOpiatesHeroinSolidGrams?.setText(data?.SolidGrams) : txtOpiatesHeroinSolidGrams?.setText('')
                            data?.LiquidOunces ? txtOpiatesHeroinLiquidOunces?.setText(data?.LiquidOunces) : txtOpiatesHeroinLiquidOunces?.setText('')
                            data?.DoseUnits ? txtOpiatesHeroinDoseUnits?.setText(data?.DoseUnits) : txtOpiatesHeroinDoseUnits?.setText('')
                        }

                        if (data?.SuspectedDrugTypeID == 6 || data?.SuspectedDrugType_Description == "Morphine") {
                            data?.SolidPounds ? txtOpiatesMarphinePounds?.setText(data?.SolidPounds) : txtOpiatesMarphinePounds?.setText('')
                            data?.SolidOunces ? txtOpiatesMarphineSolidOunces?.setText(data?.SolidOunces) : txtOpiatesMarphineSolidOunces?.setText('')
                            data?.SolidGrams ? txtOpiatesMarphineSolidGrams?.setText(data?.SolidGrams) : txtOpiatesMarphineSolidGrams?.setText('')
                            data?.LiquidOunces ? txtOpiatesMarphineLiquidOunces?.setText(data?.LiquidOunces) : txtOpiatesMarphineLiquidOunces?.setText('')
                            data?.DoseUnits ? txtOpiatesMarphineDoseUnits?.setText(data?.DoseUnits) : txtOpiatesMarphineDoseUnits?.setText('')
                        }

                        if (data?.SuspectedDrugTypeID == 7 || data?.SuspectedDrugType_Description == "Opium") {
                            data?.SolidPounds ? txtOpiatesGumPounds?.setText(data?.SolidPounds) : txtOpiatesGumPounds?.setText('')
                            data?.SolidOunces ? txtOpiatesGumSolidOunces?.setText(data?.SolidOunces) : txtOpiatesGumSolidOunces?.setText('')
                            data?.SolidGrams ? txtOpiatesGumSolidGrams?.setText(data?.SolidGrams) : txtOpiatesGumSolidGrams?.setText('')
                        }

                        if (data?.SuspectedDrugTypeID == 9 || data?.SuspectedDrugType_Description == "LSD") {
                            data?.SolidPounds ? txtHallucinogensLSDSolidPounds?.setText(data?.SolidPounds) : txtHallucinogensLSDSolidPounds?.setText('')
                            // data?.SolidOunces ? txtOpiatesMarphineSolidOunces?.setText(data?.SolidOunces) : txtOpiatesMarphineSolidOunces?.setText('')
                            data?.SolidGrams ? txtHallucinogensLSDSolidGrams?.setText(data?.SolidGrams) : txtHallucinogensLSDSolidGrams?.setText('')
                            data?.LiquidOunces ? txtHallucinogensLSDLiquidOunces?.setText(data?.LiquidOunces) : txtHallucinogensLSDLiquidOunces?.setText('')
                            data?.DoseUnits ? txtHallucinogensLSDDoseUnits?.setText(data?.DoseUnits) : txtHallucinogensLSDDoseUnits?.setText('')
                        }

                        if (data?.SuspectedDrugTypeID == 10 || data?.SuspectedDrugType_Description == "PCP") {
                            data?.SolidPounds ? txtHallucinogensPCPSolidPounds?.setText(data?.SolidPounds) : txtHallucinogensPCPSolidPounds?.setText('')
                            data?.SolidOunces ? txtHallucinogensPCPSolidOunces?.setText(data?.SolidOunces) : txtHallucinogensPCPSolidOunces?.setText('')
                            data?.SolidGrams ? txtHallucinogensPCPSolidGrams?.setText(data?.SolidGrams) : txtHallucinogensPCPSolidGrams?.setText('')
                            data?.LiquidOunces ? txtHallucinogensPCPLiquidOunces?.setText(data?.LiquidOunces) : txtHallucinogensPCPLiquidOunces?.setText('')
                            data?.DoseUnits ? txtHallucinogensPCPDoseUnits?.setText(data?.DoseUnits) : txtHallucinogensPCPDoseUnits?.setText('')
                        }

                        if (data?.SuspectedDrugTypeID == 14 || data?.SuspectedDrugType_Description == "Barbiturates") {
                            data?.LiquidOunces ? txtOtherDrugsBarbituratesLiquidOunces?.setText(data?.LiquidOunces) : txtOtherDrugsBarbituratesLiquidOunces?.setText('')
                            data?.DoseUnits ? txtOtherDrugsBarbituratesDoseUnits?.setText(data?.DoseUnits) : txtOtherDrugsBarbituratesDoseUnits?.setText('')
                        }

                        if (data?.SuspectedDrugTypeID == 12 || data?.SuspectedDrugType_Description == "Amphetamines/Methamphetamines") {
                            data?.SolidPounds ? txtOtherDrugsAmphetaminaesSolidPounds?.setText(data?.SolidPounds) : txtOtherDrugsAmphetaminaesSolidPounds?.setText('')
                            data?.SolidOunces ? txtOtherDrugsAmphetaminaesSolidOunces?.setText(data?.SolidOunces) : txtOtherDrugsAmphetaminaesSolidOunces?.setText('')
                            data?.SolidGrams ? txtOtherDrugsAmphetaminaesSolidGrams?.setText(data?.SolidGrams) : txtOtherDrugsAmphetaminaesSolidGrams?.setText('')
                            data?.LiquidOunces ? txtOtherDrugsAmphetaminaesLiquidOunces?.setText(data?.LiquidOunces) : txtOtherDrugsAmphetaminaesLiquidOunces?.setText('')
                            data?.DoseUnits ? txtOtherDrugsAmphetaminaesDoseUnits?.setText(data?.DoseUnits) : txtOtherDrugsAmphetaminaesDoseUnits?.setText('')

                            data?.SolidPounds ? txtOtherDrugsMethamphetaminesSolidPounds?.setText(data?.SolidPounds) : txtOtherDrugsMethamphetaminesSolidPounds?.setText('')
                            data?.SolidOunces ? txtOtherDrugsMethamphetaminesSolidOunces?.setText(data?.SolidOunces) : txtOtherDrugsMethamphetaminesSolidOunces?.setText('')
                            data?.SolidGrams ? txtOtherDrugsMethamphetaminesSolidGrams?.setText(data?.SolidGrams) : txtOtherDrugsMethamphetaminesSolidGrams?.setText('')
                            data?.LiquidOunces ? txtOtherDrugsMethamphetaminesLiquidOunces?.setText(data?.LiquidOunces) : txtOtherDrugsAmphetaminaesLiquidOunces?.setText('')
                            data?.DoseUnits ? txtOtherDrugsMethamphetaminesDoseUnits?.setText(data?.DoseUnits) : txtOtherDrugsAmphetaminaesDoseUnits?.setText('')
                        }

                        if (data?.SuspectedDrugTypeID == 8 || data?.SuspectedDrugType_Description == "Other Narcotics") {
                            data?.LiquidOunces ? txtOtherDrugsSyntheticLiquidOunces?.setText(data?.LiquidOunces) : txtOtherDrugsSyntheticLiquidOunces?.setText('')
                            data?.DoseUnits ? txtOtherDrugsSyntheticDoseUnits?.setText(data?.DoseUnits) : txtOtherDrugsSyntheticDoseUnits?.setText('')
                        }
                    })
                    reportData[0]?.AgencyNumber ? txtAgency?.setText(reportData[0]?.AgencyNumber) : txtAgency?.setText('')
                    reportData[0]?.Agency_Name ? txtAgencyName?.setText(reportData[0]?.Agency_Name) : txtAgencyName?.setText('')
                    reportData[0]?.MonthYears ? txtMonthYear?.setText(reportData[0]?.MonthYears) : txtMonthYear?.setText('')

                }

                const pdfBytes = await pdfDoc.save();
                const blob = new Blob([pdfBytes], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);
                setPdfURL(url)
                setIsLoading(false)
            }
            setPDF();

        }
    }, [arrayBuffer, reportData])

    // FUNCTION TO PRINT PDF FILE
    const fillForm = async () => {
        const iframe = iframeRef.current;
        iframe.src = pdfURL;

        iframe.onload = () => {
            iframe.contentWindow.print();
        };

    }

    return (
        <>
            {
                modalStatus ?
                    <IncNumModal validate={handleFileChange} incidentNumber={incidentNumber} setIncidentNumber={setIncidentNumber} />
                    :
                    !isLoading ?
                        <>
                            <div className="section-body view_page_design pt-1">
                                <div className="row clearfix" >
                                    <div className="col-12 col-sm-12">
                                        <div className="card Agency  name-card ">
                                            <div className="card-body">
                                                <div className="col-12 col-md-12 col-lg-12 ">
                                                    <div className="row">
                                                        {pdfURL && <iframe src={pdfURL} style={{ height: "750px", width: "100%" }} />}
                                                    </div>
                                                </div>
                                                <div className="btn-box  text-right  mr-1 mb-1 mt-3" >
                                                    {pdfURL && <button type="button" data-dismiss="modal" className="btn btn-sm btn-success mr-1" onClick={fillForm}>Print</button>}
                                                    {pdfURL && <button type="button" data-dismiss="modal" className="btn btn-sm btn-success mr-1" onClick={() => { setModalStatus(true) }}>Close</button>}
                                                </div>
                                                <iframe ref={iframeRef} style={{ display: 'none', paddingTop: "2rem" }} title="pdf-frame"></iframe>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </> :
                        <Loader />
            }
        </>
    )
}

export default UCR84Report

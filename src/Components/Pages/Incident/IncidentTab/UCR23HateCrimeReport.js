import React, { memo, useEffect, useRef, useState } from 'react'
import { PDFDocument } from 'pdf-lib';
import axios from 'axios';
import { fetchPostData } from '../../../hooks/Api';
import Loader from '../../../Common/Loader';
import { useSelector } from 'react-redux';

const HateCrimeIncReport = (props) => {

    const { setStateReportID, hateCrimeCount, ucrHateCrimeModalStatus, setUcrHateCrimeModalStatus, reportData } = props

    const [pdfURL, setPdfURL] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const iframeRef = useRef(null);
    const [arrayBuffer, setArrayBuffer] = useState(null);
    const [baseUrl, setBaseUrl] = useState("");
    const [myFile, setMyFile] = useState();
    const [combineUrl, setCombineUrl] = useState('');


    const ucrReportHateCrimeUrl = useSelector((state) => state.Incident.ucrReportHateCrimeUrl);

    const dataToBlob = async (imageData) => {
        return await (await fetch(imageData)).blob();
    };

    useEffect(() => {
        ucrReportHateCrimeUrl && GetReportPdfFile(ucrReportHateCrimeUrl);
    }, [ucrReportHateCrimeUrl])

    // FUNCTION TO GET PDF FILE
    const GetReportPdfFile = async () => {
        const val = { 'Url': ucrReportHateCrimeUrl };
        try {
            const res = await axios.post("HateCrimeIncidentReport/PdftoBase64", val);
            if (res && res.data) {
                const src = res.data.data;

                setBaseUrl(`data:application/pdf;base64,${src}`);
                const blob = await dataToBlob(`data:application/pdf;base64,${src}`);
                const file = new File([blob], new Date().valueOf() + ".pdf", { type: 'application/pdf' });
                const urlll = URL.createObjectURL(file);
                setMyFile(file);

            } else {
                console.log('error');
            }
        } catch (error) {
            console.error('Error fetching the report:', error);
        }
    };

    useEffect(() => {
        ucrHateCrimeModalStatus && handleFileChange();
    }, [hateCrimeCount, myFile, ucrHateCrimeModalStatus])

    // FUNCTION TO CHECK FILE AND CREATE ARRAY BUFFER OF FILE
    const handleFileChange = async (event) => {
        // alert('dfsfsdf')
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

        } else {
            console.error('Please upload a valid PDF file.');
        }
    };

    //TO GET ALL FIELDS OF FILE AND SET DATA TO RELATED FIELD AND OPEN FILLED FILE
    useEffect(() => {
        if (arrayBuffer && reportData) {
            // console.log("🚀 ~ useEffect ~ reportData:", reportData);

            const setPDF = async () => {
                setIsLoading(true);

                // alert('uesEffect')
                const fieldsObject = {};
                const pdfDoc = await PDFDocument.load(arrayBuffer)
                const form = pdfDoc.getForm();
                const fields = form.getFields();

                // console.log(fields)

                fields.forEach((field, index) => {
                    const type = field.constructor.name;
                    const name = field.getName();

                    // console.log(`Field ${index + 1}: ${name} (${type})`);
                    fieldsObject[name.replace(/ +/g, "")] = type;
                });

                const Initial = fieldsObject?.chkInitial ? form.getCheckBox('chkInitial') : null;
                const Adjustment = fieldsObject?.chkAdjustment ? form.getCheckBox('chkAdjustment') : null;
                const IncidentNo = fieldsObject?.txtIncidentNo ? form.getTextField('txtIncidentNo') : null;
                const ORI = fieldsObject?.txtORI ? form.getTextField('txtORI') : null;
                const DateofIncident = fieldsObject?.txtIncidentDate ? form.getTextField('txtIncidentDate') : null;

                const Page1 = fieldsObject?.txtPage1 ? form.getTextField('txtPage1') : null;
                const Page2 = fieldsObject?.txtPage2 ? form.getTextField('txtPage2') : null;

                const VictimNum = [
                    fieldsObject?.txtOffence1Victims ? form.getTextField('txtOffence1Victims') : null,
                    fieldsObject?.txtOffence2Victims ? form.getTextField('txtOffence2Victims') : null,
                    fieldsObject?.txtOffence3Victims ? form.getTextField('txtOffence3Victims') : null,
                    fieldsObject?.txtOffence4Victims ? form.getTextField('txtOffence4Victims') : null,
                    fieldsObject?.txtOffence5Victims ? form.getTextField('txtOffence5Victims') : null,
                ]

                const OffenceCode = [
                    fieldsObject?.txtOffence1Code ? form.getTextField('txtOffence1Code') : null,
                    fieldsObject?.txtOffence2Code ? form.getTextField('txtOffence2Code') : null,
                    fieldsObject?.txtOffence3Code ? form.getTextField('txtOffence3Code') : null,
                    fieldsObject?.txtOffence4Code ? form.getTextField('txtOffence4Code') : null,
                    fieldsObject?.txtOffence5Code ? form.getTextField('txtOffence5Code') : null,
                ]

                const checkboxes = [
                    null,
                    fieldsObject?.chkLocationAirBusTrain ? form.getCheckBox('chkLocationAirBusTrain') : null,
                    fieldsObject?.chkLocationBankSavings ? form.getCheckBox('chkLocationBankSavings') : null,
                    fieldsObject?.chkLocationBarNighClub ? form.getCheckBox('chkLocationBarNighClub') : null,
                    fieldsObject?.chkLocationChurchSyn ? form.getCheckBox('chkLocationChurchSyn') : null,
                    fieldsObject?.chkLocationCommercialOffice ? form.getCheckBox('chkLocationCommercialOffice') : null,
                    fieldsObject?.chkLocationConstructionSite ? form.getCheckBox('chkLocationConstructionSite') : null,
                    fieldsObject?.chkLocationConvenienceStore ? form.getCheckBox('chkLocationConvenienceStore') : null,
                    fieldsObject?.chkLocationDepartment ? form.getCheckBox('chkLocationDepartment') : null,
                    fieldsObject?.chkLocationDrugStore ? form.getCheckBox('chkLocationDrugStore') : null,
                    fieldsObject?.chkLocationFieldWood ? form.getCheckBox('chkLocationFieldWood') : null,
                    fieldsObject?.chkLocationGovtPublicBuilding ? form.getCheckBox('chkLocationGovtPublicBuilding') : null,
                    fieldsObject?.chkLocationSupermarket ? form.getCheckBox('chkLocationSupermarket') : null,
                    fieldsObject?.chkLocationHighwayRoad ? form.getCheckBox('chkLocationHighwayRoad') : null,
                    fieldsObject?.chkLocationHotelMotel ? form.getCheckBox('chkLocationHotelMotel') : null,
                    fieldsObject?.chkLocationJailPrision ? form.getCheckBox('chkLocationJailPrision') : null,
                    fieldsObject?.chkLocationLakewaterway ? form.getCheckBox('chkLocationLakewaterway') : null,
                    fieldsObject?.chkLocationLiquorStore ? form.getCheckBox('chkLocationLiquorStore') : null,
                    fieldsObject?.chkLocationParkingGarage ? form.getCheckBox('chkLocationParkingGarage') : null,
                    fieldsObject?.chkLocationRentalStorage ? form.getCheckBox('chkLocationRentalStorage') : null,
                    fieldsObject?.chkLocationResidenceHome ? form.getCheckBox('chkLocationResidenceHome') : null,
                    fieldsObject?.chkLocationRestaurant ? form.getCheckBox('chkLocationRestaurant') : null,
                    fieldsObject?.chkLocationServiceGasStation ? form.getCheckBox('chkLocationServiceGasStation') : null,
                    fieldsObject?.chkLocationSpecialtyStore ? form.getCheckBox('chkLocationSpecialtyStore') : null,
                    fieldsObject?.chkLocationOtherUnknown ? form.getCheckBox('chkLocationOtherUnknown') : null,
                    fieldsObject?.chkLocationAbanDonedCondemned ? form.getCheckBox('chkLocationAbanDonedCondemned') : null,
                    fieldsObject?.chkLocationAmusementPark ? form.getCheckBox('chkLocationAmusementPark') : null,
                    fieldsObject?.chkLocationArenaStadium ? form.getCheckBox('chkLocationArenaStadium') : null,
                    fieldsObject?.chkLocationATMSepBank ? form.getCheckBox('chkLocationATMSepBank') : null,
                    fieldsObject?.chkLocationAutoDealership ? form.getCheckBox('chkLocationAutoDealership') : null,
                    fieldsObject?.chkLocationCampGround ? form.getCheckBox('chkLocationCampGround') : null,
                    fieldsObject?.chkLocationDaycare ? form.getCheckBox('chkLocationDaycare') : null,
                    fieldsObject?.chkLocationDockWharf ? form.getCheckBox('chkLocationDockWharf') : null,
                    fieldsObject?.chkLocationFarmFacility ? form.getCheckBox('chkLocationFarmFacility') : null,
                    fieldsObject?.chkLocationGamblingCasino ? form.getCheckBox('chkLocationGamblingCasino') : null,
                    fieldsObject?.chkLocationIndustrialSite ? form.getCheckBox('chkLocationIndustrialSite') : null,
                    fieldsObject?.chkLocationMilitaryInsallation ? form.getCheckBox('chkLocationMilitaryInsallation') : null,
                    fieldsObject?.chkLocationParkPlayground ? form.getCheckBox('chkLocationParkPlayground') : null,
                    fieldsObject?.chkLocationRestArea ? form.getCheckBox('chkLocationRestArea') : null,
                    fieldsObject?.chkLocationSchoolCollege ? form.getCheckBox('chkLocationSchoolCollege') : null,
                    fieldsObject?.chkLocationSchoolElementary ? form.getCheckBox('chkLocationSchoolElementary') : null,
                    fieldsObject?.chkLocationShelterMission ? form.getCheckBox('chkLocationShelterMission') : null,
                    fieldsObject?.chkLocationShoppingMall ? form.getCheckBox('chkLocationShoppingMall') : null,
                    fieldsObject?.chkLocationTribalLands ? form.getCheckBox('chkLocationTribalLands') : null,
                    fieldsObject?.chkLocationCommunityCenter ? form.getCheckBox('chkLocationCommunityCenter') : null,
                ];

                const locationCodeFields = [
                    fieldsObject?.txtOffence2LocationCode ? form.getTextField('txtOffence2LocationCode') : null,
                    fieldsObject?.txtOffence3LocationCode ? form.getTextField('txtOffence3LocationCode') : null,
                    fieldsObject?.txtOffence4LocationCode ? form.getTextField('txtOffence4LocationCode') : null,
                    fieldsObject?.txtOffence5LocationCode ? form.getTextField('txtOffence5LocationCode') : null,
                ]

                const Biasfields = {
                    // reace
                    11: fieldsObject?.chkBiasRaceAntiWhite ? form.getCheckBox('chkBiasRaceAntiWhite') : null,
                    12: fieldsObject?.chkBiasRaceAntiBlack ? form.getCheckBox('chkBiasRaceAntiBlack') : null,
                    13: fieldsObject?.chkBiasRaceAntiAmerican ? form.getCheckBox('chkBiasRaceAntiAmerican') : null,
                    14: fieldsObject?.chkBiasRaceAntiAsian ? form.getCheckBox('chkBiasRaceAntiAsian') : null,
                    15: fieldsObject?.chkBiasRaceAntiMultiple ? form.getCheckBox('chkBiasRaceAntiMultiple') : null,
                    16: fieldsObject?.chkBiasRaceAntiNative ? form.getCheckBox('chkBiasRaceAntiNative') : null,
                    31: fieldsObject?.chkBiasRaceAntiArab ? form.getCheckBox('chkBiasRaceAntiArab') : null,
                    32: fieldsObject?.chkBiasRaceAntiHispanic ? form.getCheckBox('chkBiasRaceAntiHispanic') : null,
                    33: fieldsObject?.chkBiasRaceAntiOtherRace ? form.getCheckBox('chkBiasRaceAntiOtherRace') : null,

                    // sexual 
                    41: fieldsObject?.chkBiasSexAntiGay ? form.getCheckBox('chkBiasSexAntiGay') : null,
                    42: fieldsObject?.chkBiasSexAntiLesbian ? form.getCheckBox('chkBiasSexAntiLesbian') : null,
                    43: fieldsObject?.chkBiasSexAntiLabsianGay ? form.getCheckBox('chkBiasSexAntiLabsianGay') : null,
                    44: fieldsObject?.chkBiasSexAntiHeterosexual ? form.getCheckBox('chkBiasSexAntiHeterosexual') : null,
                    45: fieldsObject?.chkBiasSexAntiBisexual ? form.getCheckBox('chkBiasSexAntiBisexual') : null,

                    // Relegion
                    21: fieldsObject?.chkBiasReligionAntiJewish ? form.getCheckBox('chkBiasReligionAntiJewish') : null,
                    22: fieldsObject?.chkBiasReligionAntiCatholic ? form.getCheckBox('chkBiasReligionAntiCatholic') : null,
                    23: fieldsObject?.chkBiasReligionAntiProtestant ? form.getCheckBox('chkBiasReligionAntiProtestant') : null,
                    24: fieldsObject?.chkBiasReligionAntiIslamic ? form.getCheckBox('chkBiasReligionAntiIslamic') : null,
                    25: fieldsObject?.chkBiasReligionAntiOtherReligion ? form.getCheckBox('chkBiasReligionAntiOtherReligion') : null,
                    26: fieldsObject?.chkBiasReligionAntiMultipleReligious ? form.getCheckBox('chkBiasReligionAntiMultipleReligious') : null,
                    27: fieldsObject?.chkBiasReligionAntiAtheism ? form.getCheckBox('chkBiasReligionAntiAtheism') : null,
                    28: fieldsObject?.chkBiasReligionAntiMormon ? form.getCheckBox('chkBiasReligionAntiMormon') : null,
                    29: fieldsObject?.chkBiasReligionAntiJehovah ? form.getCheckBox('chkBiasReligionAntiJehovah') : null,
                    81: fieldsObject?.chkBiasReligionAntiEasternOrthodox ? form.getCheckBox('chkBiasReligionAntiEasternOrthodox') : null,
                    82: fieldsObject?.chkBiasReligionAntiOtherChristian ? form.getCheckBox('chkBiasReligionAntiOtherChristian') : null,
                    83: fieldsObject?.chkBiasReligionAntiBuddhist ? form.getCheckBox('chkBiasReligionAntiBuddhist') : null,
                    84: fieldsObject?.chkBiasReligionAntiHindu ? form.getCheckBox('chkBiasReligionAntiHindu') : null,
                    85: fieldsObject?.chkBiasReligionAntiSikh ? form.getCheckBox('chkBiasReligionAntiSikh') : null,

                    // gender
                    61: fieldsObject?.chkBiasGenderAntiMale ? form.getCheckBox('chkBiasGenderAntiMale') : null,
                    62: fieldsObject?.chkBiasGenderAntiFemale ? form.getCheckBox('chkBiasGenderAntiFemale') : null,

                    // gender Identity
                    71: fieldsObject?.chkBiasGenderidAntiTransGender ? form.getCheckBox('chkBiasGenderidAntiTransGender') : null,
                    72: fieldsObject?.chkBiasGenderidNonConformin ? form.getCheckBox('chkBiasGenderidNonConformin') : null,

                    // Disability
                    51: fieldsObject[51] ? form.getCheckBox('51') : null, // physical
                    52: fieldsObject[52] ? form.getCheckBox('52') : null // mental
                };

                // offenceBias other fields
                const txtOffence2Bias1 = fieldsObject?.txtOffence2Bias1 ? form.getTextField('txtOffence2Bias1') : null;
                const txtOffence2Bias2 = fieldsObject?.txtOffence2Bias2 ? form.getTextField('txtOffence2Bias2') : null;
                const txtOffence2Bias3 = fieldsObject?.txtOffence2Bias3 ? form.getTextField('txtOffence2Bias3') : null;
                const txtOffence2Bias4 = fieldsObject?.txtOffence2Bias4 ? form.getTextField('txtOffence2Bias4') : null;
                const txtOffence2Bias5 = fieldsObject?.txtOffence2Bias5 ? form.getTextField('txtOffence2Bias5') : null;

                const txtOffence3Bias1 = fieldsObject?.txtOffence3Bias1 ? form.getTextField('txtOffence3Bias1') : null;
                const txtOffence3Bias2 = fieldsObject?.txtOffence3Bias2 ? form.getTextField('txtOffence3Bias2') : null;
                const txtOffence3Bias3 = fieldsObject?.txtOffence3Bias3 ? form.getTextField('txtOffence3Bias3') : null;
                const txtOffence3Bias4 = fieldsObject?.txtOffence3Bias4 ? form.getTextField('txtOffence3Bias4') : null;
                const txtOffence3Bias5 = fieldsObject?.txtOffence3Bias5 ? form.getTextField('txtOffence3Bias5') : null;

                const txtOffence4Bias1 = fieldsObject?.txtOffence4Bias1 ? form.getTextField('txtOffence4Bias1') : null;
                const txtOffence4Bias2 = fieldsObject?.txtOffence4Bias2 ? form.getTextField('txtOffence4Bias2') : null;
                const txtOffence4Bias3 = fieldsObject?.txtOffence4Bias3 ? form.getTextField('txtOffence4Bias3') : null;
                const txtOffence4Bias4 = fieldsObject?.txtOffence4Bias4 ? form.getTextField('txtOffence4Bias4') : null;
                const txtOffence4Bias5 = fieldsObject?.txtOffence4Bias5 ? form.getTextField('txtOffence4Bias5') : null;

                const txtOffence5Bias1 = fieldsObject?.txtOffence5Bias1 ? form.getTextField('txtOffence5Bias1') : null;
                const txtOffence5Bias2 = fieldsObject?.txtOffence5Bias2 ? form.getTextField('txtOffence5Bias2') : null;
                const txtOffence5Bias3 = fieldsObject?.txtOffence5Bias3 ? form.getTextField('txtOffence5Bias3') : null;
                const txtOffence5Bias4 = fieldsObject?.txtOffence5Bias4 ? form.getTextField('txtOffence5Bias4') : null;
                const txtOffence5Bias5 = fieldsObject?.txtOffence5Bias5 ? form.getTextField('txtOffence5Bias5') : null;

                // victim info
                const chkIndividualOffence1 = fieldsObject?.chkIndividualOffence1 ? form.getCheckBox('chkIndividualOffence1') : null;
                const chkIndividualOffence2 = fieldsObject?.chkIndividualOffence2 ? form.getCheckBox('chkIndividualOffence2') : null;
                const chkIndividualOffence3 = fieldsObject?.chkIndividualOffence3 ? form.getCheckBox('chkIndividualOffence3') : null;
                const chkIndividualOffence4 = fieldsObject?.chkIndividualOffence4 ? form.getCheckBox('chkIndividualOffence4') : null;
                const chkIndividualOffence5 = fieldsObject?.chkIndividualOffence5 ? form.getCheckBox('chkIndividualOffence5') : null;

                const chkBusinessOffence1 = fieldsObject?.chkBusinessOffence1 ? form.getCheckBox('chkBusinessOffence1') : null;
                const chkBusinessOffence2 = fieldsObject?.chkBusinessOffence2 ? form.getCheckBox('chkBusinessOffence2') : null;
                const chkBusinessOffence3 = fieldsObject?.chkBusinessOffence3 ? form.getCheckBox('chkBusinessOffence3') : null;
                const chkBusinessOffence4 = fieldsObject?.chkBusinessOffence4 ? form.getCheckBox('chkBusinessOffence4') : null;
                const chkBusinessOffence5 = fieldsObject?.chkBusinessOffence5 ? form.getCheckBox('chkBusinessOffence5') : null;

                const chkFinancialOffence1 = fieldsObject?.chkFinancialOffence1 ? form.getCheckBox('chkFinancialOffence1') : null;
                const chkFinancialOffence2 = fieldsObject?.chkFinancialOffence2 ? form.getCheckBox('chkFinancialOffence2') : null;
                const chkFinancialOffence3 = fieldsObject?.chkFinancialOffence3 ? form.getCheckBox('chkFinancialOffence3') : null;
                const chkFinancialOffence4 = fieldsObject?.chkFinancialOffence4 ? form.getCheckBox('chkFinancialOffence4') : null;
                const chkFinancialOffence5 = fieldsObject?.chkFinancialOffence5 ? form.getCheckBox('chkFinancialOffence5') : null;

                const chkGovernmentOffence1 = fieldsObject?.chkGovernmentOffence1 ? form.getCheckBox('chkGovernmentOffence1') : null;
                const chkGovernmentOffence2 = fieldsObject?.chkGovernmentOffence2 ? form.getCheckBox('chkGovernmentOffence2') : null;
                const chkGovernmentOffence3 = fieldsObject?.chkGovernmentOffence3 ? form.getCheckBox('chkGovernmentOffence3') : null;
                const chkGovernmentOffence4 = fieldsObject?.chkGovernmentOffence4 ? form.getCheckBox('chkGovernmentOffence4') : null;
                const chkGovernmentOffence5 = fieldsObject?.chkGovernmentOffence5 ? form.getCheckBox('chkGovernmentOffence5') : null;

                const chkReligiousOffence1 = fieldsObject?.chkReligiousOffence1 ? form.getCheckBox('chkReligiousOffence1') : null;
                const chkReligiousOffence2 = fieldsObject?.chkReligiousOffence2 ? form.getCheckBox('chkReligiousOffence2') : null;
                const chkReligiousOffence3 = fieldsObject?.chkReligiousOffence3 ? form.getCheckBox('chkReligiousOffence3') : null;
                const chkReligiousOffence4 = fieldsObject?.chkReligiousOffence4 ? form.getCheckBox('chkReligiousOffence4') : null;
                const chkReligiousOffence5 = fieldsObject?.chkReligiousOffence5 ? form.getCheckBox('chkReligiousOffence5') : null;

                const chkOtherOffence1 = fieldsObject?.chkOtherOffence1 ? form.getCheckBox('chkOtherOffence1') : null;
                const chkOtherOffence2 = fieldsObject?.chkOtherOffence2 ? form.getCheckBox('chkOtherOffence2') : null;
                const chkOtherOffence3 = fieldsObject?.chkOtherOffence3 ? form.getCheckBox('chkOtherOffence3') : null;
                const chkOtherOffence4 = fieldsObject?.chkOtherOffence4 ? form.getCheckBox('chkOtherOffence4') : null;
                const chkOtherOffence5 = fieldsObject?.chkOtherOffence5 ? form.getCheckBox('chkOtherOffence5') : null;

                const chkUnknownOffence1 = fieldsObject?.chkUnknownOffence1 ? form.getCheckBox('chkUnknownOffence1') : null;
                const chkUnknownOffence2 = fieldsObject?.chkUnknownOffence2 ? form.getCheckBox('chkUnknownOffence2') : null;
                const chkUnknownOffence3 = fieldsObject?.chkUnknownOffence3 ? form.getCheckBox('chkUnknownOffence3') : null;
                const chkUnknownOffence4 = fieldsObject?.chkUnknownOffence4 ? form.getCheckBox('chkUnknownOffence4') : null;
                const chkUnknownOffence5 = fieldsObject?.chkUnknownOffence5 ? form.getCheckBox('chkUnknownOffence5') : null;

                // victim number
                const txtTotalVictims = fieldsObject?.txtTotalVictims ? form.getTextField('txtTotalVictims') : null;
                const txtTotalVictims18Over = fieldsObject?.txtTotalVictims18Over ? form.getTextField('txtTotalVictims18Over') : null;
                const txtTotalVictims18under = fieldsObject?.txtTotalVictims18under ? form.getTextField('txtTotalVictims18under') : null;

                // offender number
                const txtTotalOffenders = fieldsObject?.txtTotalOffenders ? form.getTextField('txtTotalOffenders') : null;
                const txtTotalOffenders18Over = fieldsObject?.txtTotalOffenders18Over ? form.getTextField('txtTotalOffenders18Over') : null;
                const txtTotalOffenders18Under = fieldsObject?.txtTotalOffenders18Under ? form.getTextField('txtTotalOffenders18Under') : null;

                const Racefields = {
                    1: fieldsObject?.txtRaceWhite ? form.getCheckBox('txtRaceWhite') : null,
                    2: fieldsObject?.txtRaceBlackAfrican ? form.getCheckBox('txtRaceBlackAfrican') : null,
                    3: fieldsObject?.txtRaceAmericanIndian ? form.getCheckBox('txtRaceAmericanIndian') : null,
                    4: fieldsObject?.txtRaceAsian ? form.getCheckBox('txtRaceAsian') : null,
                    5: fieldsObject?.txtRaceGroupMultipleRaces ? form.getCheckBox('txtRaceGroupMultipleRaces') : null,
                    6: fieldsObject?.txtRaceUnknown ? form.getCheckBox('txtRaceUnknown') : null,
                    7: fieldsObject?.txtRaceNativeHawaiian ? form.getCheckBox('txtRaceNativeHawaiian') : null
                };

                const Ethnicityfields = {
                    1: fieldsObject?.txtEthnicOriginHispanic ? form.getCheckBox('txtEthnicOriginHispanic') : null,
                    2: fieldsObject?.txtEthnicOriginNonHispanic ? form.getCheckBox('txtEthnicOriginNonHispanic') : null,
                    3: fieldsObject?.txtEthnicOriginGroupMultiple ? form.getCheckBox('txtEthnicOriginGroupMultiple') : null,
                    4: fieldsObject?.txtEthnicOriginUnknown ? form.getCheckBox('txtEthnicOriginUnknown') : null
                };

                if (reportData?.AgencyORI) {
                    reportData?.AgencyORI ? ORI?.setText("00" + reportData?.AgencyORI?.toString()) : ORI?.setText('')
                }

                if (reportData?.IncidentDate) {
                    const incidentDate = new Date(reportData?.IncidentDate.split(' ').slice(0, 3).join(' '));
                    const date = incidentDate.getDate();
                    const month = incidentDate.getMonth() + 1;
                    const year = incidentDate.getFullYear();
                    date ? DateofIncident?.setText(`${date}-${month}-${year}`) : DateofIncident?.setText('')
                }

                const txtPagefrom = fieldsObject?.txtPagefrom ? form.getTextField('txtPagefrom') : null;
                const txtPageto = fieldsObject?.txtPageto ? form.getTextField('txtPageto') : null;

                reportData?.IncidentNumber ? IncidentNo?.setText("INC" + reportData?.IncidentNumber) : IncidentNo?.setText('');
                // reportData?.IncidentDate ? DateofIncident?.setText(reportData?.IncidentDate.split(' ').slice(0, 3).join(' ')) : DateofIncident?.setText('')

                reportData?.TotalVictim ? txtTotalVictims?.setText(reportData?.TotalVictim?.toString()) : txtTotalVictims?.setText('');
                reportData?.Victims18Over ? txtTotalVictims18Over?.setText(reportData?.Victims18Over?.toString()) : txtTotalVictims18Over?.setText('');
                reportData?.Victims18Under ? txtTotalVictims18under?.setText(reportData?.Victims18Under?.toString()) : txtTotalVictims18under?.setText('');

                reportData?.Totaloffender ? txtTotalOffenders?.setText(reportData?.Totaloffender?.toString()) : txtTotalOffenders?.setText('00');
                reportData?.offender18Over ? txtTotalOffenders18Over?.setText(reportData?.offender18Over?.toString()) : txtTotalOffenders18Over?.setText('00');
                reportData?.offender18Under ? txtTotalOffenders18Under?.setText(reportData?.offender18Under?.toString()) : txtTotalOffenders18Under?.setText('00');

                if (reportData?.InitAdjust === 'I' && Initial) {
                    Initial?.check(); Adjustment?.uncheck();
                } else if (reportData?.InitAdjust === 'A' && Adjustment) {
                    Adjustment?.check(); Initial?.uncheck();
                } else {
                    Initial?.uncheck();
                    Adjustment?.uncheck();
                }

                if (reportData?.LocationofOffense?.length > 0) {
                    const checkbox = checkboxes[parseInt(reportData?.LocationofOffense[0]?.LocationTypeCode)];
                    if (checkbox) {
                        checkbox.check();
                    }

                    for (let i = 1; i < reportData?.LocationofOffense?.length;) {
                        locationCodeFields.forEach((textFields) => {
                            textFields.setText(reportData?.LocationofOffense[i]?.LocationTypeCode)
                            i++
                        });

                    }
                } else {
                    console.log("reportData?.LocationofOffense === IsEmpty")
                }

                if (reportData?.OffenseAndVictims?.length > 0) {

                    for (let i = 0; i < reportData?.OffenseAndVictims?.length;) {

                        reportData?.OffenseAndVictims?.forEach((item) => {

                            const NoOfVectimtextField = VictimNum[i];
                            const OffenceCodeField = OffenceCode[i];

                            if (NoOfVectimtextField) {
                                NoOfVectimtextField?.setText(item?.ChargeCount)
                                OffenceCodeField?.setText(item?.FBICode)
                                i++
                            }

                        })

                    }

                } else {
                    console.log("reportData?.OffenseAndVictims === IsEmpty")
                }

                if (reportData?.OffenseAndVictims?.length > 0) {
                    for (let i = 0; i < reportData?.OffenseAndVictims?.length; i++) {
                        const OffenseAndVictims = reportData?.OffenseAndVictims[i];
                        if (OffenseAndVictims?.VictimCode === 'I') {
                            i === 0 && chkIndividualOffence1?.check()
                            i === 1 && chkIndividualOffence2?.check()
                            i === 2 && chkIndividualOffence3?.check()
                            i === 3 && chkIndividualOffence4?.check()
                            i === 4 && chkIndividualOffence5?.check()
                        }
                        else if (OffenseAndVictims?.VictimCode === 'B') {
                            i === 0 && chkBusinessOffence1?.check()
                            i === 1 && chkBusinessOffence2?.check()
                            i === 2 && chkBusinessOffence3?.check()
                            i === 3 && chkBusinessOffence4?.check()
                            i === 4 && chkBusinessOffence5?.check()
                        }
                        else if (OffenseAndVictims?.VictimCode === 'F') {
                            i === 0 && chkFinancialOffence1?.check()
                            i === 1 && chkFinancialOffence2?.check()
                            i === 2 && chkFinancialOffence3?.check()
                            i === 3 && chkFinancialOffence4?.check()
                            i === 4 && chkFinancialOffence5?.check()
                        }
                        else if (OffenseAndVictims?.VictimCode === 'L') {
                            i === 0 && chkGovernmentOffence1?.check()
                            i === 1 && chkGovernmentOffence2?.check()
                            i === 2 && chkGovernmentOffence3?.check()
                            i === 3 && chkGovernmentOffence4?.check()
                            i === 4 && chkGovernmentOffence5?.check()
                        }
                        else if (OffenseAndVictims?.VictimCode === 'R') {
                            i === 0 && chkReligiousOffence1?.check()
                            i === 1 && chkReligiousOffence2?.check()
                            i === 2 && chkReligiousOffence3?.check()
                            i === 3 && chkReligiousOffence4?.check()
                            i === 4 && chkReligiousOffence5?.check()
                        }
                        else if (OffenseAndVictims?.VictimCode === 'O') {
                            i === 0 && chkOtherOffence1?.check()
                            i === 1 && chkOtherOffence2?.check()
                            i === 2 && chkOtherOffence3?.check()
                            i === 3 && chkOtherOffence4?.check()
                            i === 4 && chkOtherOffence5?.check()
                        }
                        else if (OffenseAndVictims?.VictimCode === 'U') {
                            i === 0 && chkUnknownOffence1?.check()
                            i === 1 && chkUnknownOffence2?.check()
                            i === 2 && chkUnknownOffence3?.check()
                            i === 3 && chkUnknownOffence4?.check()
                            i === 4 && chkUnknownOffence5?.check()
                        }
                    }
                } else {
                    console.log("reportData?.OffenseAndVictims === IsEmpty")
                }
                // test and txt field or checkBox 
                // txtVicMaxAge ? txtVicMaxAge?.setText('hello') : txtVicMaxAge?.setText('');
                // OffenderSeq ? OffenderSeq?.setText('age') : OffenderSeq?.setText('');
                // Biasfields[51] && Biasfields[51]?.check();
                // Biasfields[52] && Biasfields[52]?.check();

                if (reportData?.OffenseBias?.length > 0) {
                    const BiasIndex0 = reportData?.OffenseBias[0]

                    const Bias1 = Biasfields[parseInt(BiasIndex0?.Bias1)];
                    const Bias2 = Biasfields[parseInt(BiasIndex0?.Bias2)];
                    const Bias3 = Biasfields[parseInt(BiasIndex0?.Bias3)];
                    const Bias4 = Biasfields[parseInt(BiasIndex0?.Bias4)];
                    const Bias5 = Biasfields[parseInt(BiasIndex0?.Bias5)];

                    Bias1 && Bias1?.check();
                    Bias2 && Bias2?.check();
                    Bias3 && Bias3?.check();
                    Bias4 && Bias4?.check();
                    Bias5 && Bias5?.check();

                    txtOffence2Bias1 && reportData?.OffenseBias[1]?.Bias1 ? txtOffence2Bias1?.setText(reportData?.OffenseBias[1]?.Bias1) : txtOffence2Bias1?.setText('');
                    txtOffence2Bias2 && reportData?.OffenseBias[1]?.Bias2 ? txtOffence2Bias2?.setText(reportData?.OffenseBias[1]?.Bias2) : txtOffence2Bias2?.setText('');
                    txtOffence2Bias3 && reportData?.OffenseBias[1]?.Bias3 ? txtOffence2Bias3?.setText(reportData?.OffenseBias[1]?.Bias3) : txtOffence2Bias3?.setText('');
                    txtOffence2Bias4 && reportData?.OffenseBias[1]?.Bias4 ? txtOffence2Bias4?.setText(reportData?.OffenseBias[1]?.Bias4) : txtOffence2Bias4?.setText('');
                    txtOffence2Bias5 && reportData?.OffenseBias[1]?.Bias5 ? txtOffence2Bias5?.setText(reportData?.OffenseBias[1]?.Bias5) : txtOffence2Bias5?.setText('');

                    txtOffence3Bias1 && reportData?.OffenseBias[2]?.Bias1 ? txtOffence3Bias1?.setText(reportData?.OffenseBias[2]?.Bias1) : txtOffence3Bias1?.setText('');
                    txtOffence3Bias2 && reportData?.OffenseBias[2]?.Bias2 ? txtOffence3Bias2?.setText(reportData?.OffenseBias[2]?.Bias2) : txtOffence3Bias2?.setText('');
                    txtOffence3Bias3 && reportData?.OffenseBias[2]?.Bias3 ? txtOffence3Bias3?.setText(reportData?.OffenseBias[2]?.Bias3) : txtOffence3Bias3?.setText('');
                    txtOffence3Bias4 && reportData?.OffenseBias[2]?.Bias4 ? txtOffence3Bias4?.setText(reportData?.OffenseBias[2]?.Bias4) : txtOffence3Bias4?.setText('');
                    txtOffence3Bias5 && reportData?.OffenseBias[2]?.Bias5 ? txtOffence3Bias5?.setText(reportData?.OffenseBias[2]?.Bias5) : txtOffence3Bias5?.setText('');

                    txtOffence4Bias1 && reportData?.OffenseBias[3]?.Bias1 ? txtOffence4Bias1?.setText(reportData?.OffenseBias[3]?.Bias1) : txtOffence4Bias1?.setText('');
                    txtOffence4Bias2 && reportData?.OffenseBias[3]?.Bias2 ? txtOffence4Bias2?.setText(reportData?.OffenseBias[3]?.Bias2) : txtOffence4Bias2?.setText('');
                    txtOffence4Bias3 && reportData?.OffenseBias[3]?.Bias3 ? txtOffence4Bias3?.setText(reportData?.OffenseBias[3]?.Bias3) : txtOffence4Bias3?.setText('');
                    txtOffence4Bias4 && reportData?.OffenseBias[3]?.Bias4 ? txtOffence4Bias4?.setText(reportData?.OffenseBias[3]?.Bias4) : txtOffence4Bias4?.setText('');
                    txtOffence4Bias5 && reportData?.OffenseBias[3]?.Bias5 ? txtOffence4Bias5?.setText(reportData?.OffenseBias[3]?.Bias5) : txtOffence4Bias5?.setText('');

                    txtOffence5Bias1 && reportData?.OffenseBias[4]?.Bias1 ? txtOffence5Bias1?.setText(reportData?.OffenseBias[4]?.Bias1) : txtOffence5Bias1?.setText('');
                    txtOffence5Bias2 && reportData?.OffenseBias[4]?.Bias2 ? txtOffence5Bias2?.setText(reportData?.OffenseBias[4]?.Bias2) : txtOffence5Bias2?.setText('');
                    txtOffence5Bias3 && reportData?.OffenseBias[4]?.Bias3 ? txtOffence5Bias3?.setText(reportData?.OffenseBias[4]?.Bias3) : txtOffence5Bias3?.setText('');
                    txtOffence5Bias4 && reportData?.OffenseBias[4]?.Bias4 ? txtOffence5Bias4?.setText(reportData?.OffenseBias[4]?.Bias4) : txtOffence5Bias4?.setText('');
                    txtOffence5Bias5 && reportData?.OffenseBias[4]?.Bias5 ? txtOffence5Bias5?.setText(reportData?.OffenseBias[4]?.Bias5) : txtOffence5Bias5?.setText('');

                } else {
                    console.log("reportData?.OffenseBias === IsEmpty")
                }

                if (reportData?.RaceEthnicity?.length > 0) {
                    reportData?.RaceEthnicity?.forEach(data => {
                        if (Racefields[data.RaceID]) {
                            Racefields[parseInt(data.RaceID)].check();
                        }
                        if (Ethnicityfields[data.EthnicityID]) {
                            Ethnicityfields[parseInt(data.EthnicityID)].check();
                        }
                    });
                } else {
                    console.log("reportData?.RaceEthnicity === IsEmpty")
                }

            

                form.flatten();

                const pdfBytes = await pdfDoc.save();
                const blob = new Blob([pdfBytes], { type: 'application/pdf' });
                const file = new File([blob], new Date().valueOf() + ".pdf", { type: 'application/pdf' });
                const url = URL.createObjectURL(file);
                setCombineUrl(url)
                setIsLoading(false);
            }
            setPDF();
        }
    }, [hateCrimeCount, arrayBuffer, reportData])



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
                ucrHateCrimeModalStatus ?
                    <>
                        <div className="modal fade" style={{ background: "rgba(0,0,0, 0.5)", zIndex: '9999999' }} id="HateCrimeReport" tabIndex="-1" aria-hidden="true" data-backdrop="false">
                            <div className="modal-dialog modal-dialog-centered modal-xl">
                                <div className="modal-content">
                                    <div className="modal-body">
                                        {
                                            !isLoading ?
                                                <>
                                                    <div className="col-12 col-md-12 col-lg-12 ">
                                                        <div className="row">
                                                            {combineUrl && <iframe key={combineUrl} src={combineUrl} style={{ height: "700px", width: "100%" }} />}
                                                        </div>
                                                    </div>
                                                    <div className="btn-box  text-right  mr-1 mb-1 mt-3" >
                                                        {combineUrl && <button type="button" data-dismiss="modal" className="btn btn-sm btn-success mr-1"
                                                            onClick={() => {
                                                                setUcrHateCrimeModalStatus(false); setCombineUrl('');
                                                            }}
                                                        >Close</button>}
                                                    </div>
                                                </>
                                                :
                                                <Loader />

                                        }

                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                    :
                    <></>
            }
        </>
    )
}

export default memo(HateCrimeIncReport)

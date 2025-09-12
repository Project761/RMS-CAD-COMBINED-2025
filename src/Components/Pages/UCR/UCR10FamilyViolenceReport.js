import React, { useEffect, useRef, useState } from 'react'
import { PDFDocument } from 'pdf-lib';
import Loader from '../../Common/Loader';
import { fetchPostData } from '../../hooks/Api';
import axios from 'axios';
import IncNumModal from './IncNumModal';



const UCR10Report = () => {

    const [pdfURL, setPdfURL] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const iframeRef = useRef(null);
    const [arrayBuffer, setArrayBuffer] = useState(null);
    const [baseUrl, setBaseUrl] = useState("")
    const [myFile, setMyFile] = useState()
    const [modalStatus, setModalStatus] = useState(true)
    const [reportData, setReportData] = useState([])
    const [incidentNumber, setIncidentNumber] = useState()


    const dataToBlob = async (imageData) => {
        return await (await fetch(imageData)).blob();
    };

    // FUNCTION TO GET PDF FILE
    const GetReportPdfFile = async () => {
        

        const val = { 'Url': 'C:\\HostingSpaces\\admin\\apigoldline.com\\wwwroot\\Imagefolder\\UCR-10-FAMILYVIOLENCE.pdf' };
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
        fetchPostData('HateCrimeIncidentReport/UCRReport10', val).then((data) => {
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

        } else {
            console.error('Please upload a valid PDF file.');
        }
    };

    // FUNCTION TO CHENGE TIME IN 24 HOURS FORMAT
    const convertTo24HourFormat = (time12h) => {
        const [time, modifier] = time12h.match(/(\d{1,2}:\d{2})([APM]{2})/).slice(1);
        let [hours, minutes] = time.split(':').map(Number);

        if (modifier === 'PM' && hours !== 12) {
            hours += 12;
        }
        if (modifier === 'AM' && hours === 12) {
            hours = 0;
        }

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
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

                const chkIDate = fieldsObject?.chkIncidentDate ? form.getCheckBox('chkIncidentDate') : null;
                const chkRDate = fieldsObject?.chkReportDate ? form.getCheckBox('chkReportDate') : null;
                const chkAttempt = fieldsObject?.chkAttempted ? form.getCheckBox('chkAttempted') : null;
                const chkCompleted = fieldsObject?.chkCompleted ? form.getCheckBox('chkCompleted') : null;


                const txtMM = fieldsObject?.txtMonth ? form.getTextField('txtMonth') : null;
                const txtDD = fieldsObject?.txtDay ? form.getTextField('txtDay') : null;
                const txtYYYY = fieldsObject?.txtYear ? form.getTextField('txtYear') : null;

                const txtAgency = fieldsObject?.txtAgency ? form.getTextField('txtAgency') : null;
                const txtIncident = fieldsObject?.txtIncident ? form.getTextField('txtIncident') : null;
                const txtIncidentNumber = fieldsObject?.txtIncidentNumber ? form.getTextField('txtIncidentNumber') : null;

                const txtVictim = fieldsObject?.txtVictimSeqNo ? form.getTextField('txtVictimSeqNo') : null;

                const txtMinAge = fieldsObject?.txtMinAge ? form.getTextField('txtMinAge') : null;
                const Maxoptionalifrange = fieldsObject?.txtMaxAge ? form.getTextField('txtMaxAge') : null;

                const chkMale = fieldsObject?.chkSexMale ? form.getCheckBox('chkSexMale') : null;
                const chkFemale = fieldsObject?.chkSexFemale ? form.getCheckBox('chkSexFemale') : null;
                const chkVicSexUnknown = fieldsObject?.chkSexUnknown ? form.getCheckBox('chkSexUnknown') : null;

                const chkWhite = fieldsObject?.chkRaceWhite ? form.getCheckBox('chkRaceWhite') : null;
                const chkBlack = fieldsObject?.chkRaceBlack ? form.getCheckBox('chkRaceBlack') : null;
                const chkAmerican = fieldsObject?.chkRaceAmerican ? form.getCheckBox('chkRaceAmerican') : null;
                const ChkAsian = fieldsObject?.ChkRaceAsian ? form.getCheckBox('ChkRaceAsian') : null;
                const ChkNagtive = fieldsObject?.ChkRaceNagtive ? form.getCheckBox('ChkRaceNagtive') : null;
                const chkRaceUnkown = fieldsObject?.chkRaceUnkown ? form.getCheckBox('chkRaceUnkown') : null;

                const chkHispanic = fieldsObject?.chkEthnicityHispanic ? form.getCheckBox('chkEthnicityHispanic') : null;
                const chlNonHispanic = fieldsObject?.chkEthnicityNonHispanic ? form.getCheckBox('chkEthnicityNonHispanic') : null;
                const chkVUnknown = fieldsObject?.chkEthnicityUnknown ? form.getCheckBox('chkEthnicityUnknown') : null;

                const txtNVictims = fieldsObject?.txtNumberVictims ? form.getTextField('txtNumberVictims') : null;

                const OffenderSeq = fieldsObject?.txtOffenderSeqNo ? form.getTextField('txtOffenderSeqNo') : null;

                const txtOffMinAge = fieldsObject?.txtOffMinAge ? form.getTextField('txtOffMinAge') : null;
                const txtOffMaxAge = fieldsObject?.txtOffMaxAge ? form.getTextField('txtOffMaxAge') : null;

                const chkOffMale = fieldsObject?.chkOffMale ? form.getCheckBox('chkOffMale') : null;
                const chkOffFemale = fieldsObject?.chkOffFemale ? form.getCheckBox('chkOffFemale') : null;
                const chkOffUnknown = fieldsObject?.chkOffUnknown ? form.getCheckBox('chkOffUnknown') : null;

                const chkOffWhite = fieldsObject?.chkOffWhite ? form.getCheckBox('chkOffWhite') : null;
                const chkOffBlack = fieldsObject?.chkOffBlack ? form.getCheckBox('chkOffBlack') : null;
                const chkOffAmerican = fieldsObject?.chkOffAmerican ? form.getCheckBox('chkOffAmerican') : null;
                const chkOffAsian = fieldsObject?.chkOffAsian ? form.getCheckBox('chkOffAsian') : null;
                const chkOffNative = fieldsObject?.chkOffNative ? form.getCheckBox('chkOffNative') : null;
                const chkRaceOffUnkown = fieldsObject?.ChkRaceUnknown ? form.getCheckBox('ChkRaceUnknown') : null;

                const chkOffHispanic = fieldsObject?.chkOffHispanic ? form.getCheckBox('chkOffHispanic') : null;
                const chkOffNonHispanic = fieldsObject?.chkOffNonHispanic ? form.getCheckBox('chkOffNonHispanic') : null;
                const chkOffEUnknown = fieldsObject?.chkOffEUnknown ? form.getCheckBox('chkOffEUnknown') : null;

                const txtOffNumber = fieldsObject?.txtOffNumber ? form.getTextField('txtOffNumber') : null;


                const chkSE = fieldsObject?.chkSE ? form.getCheckBox('chkSE') : null;
                const ChkCS = fieldsObject?.ChkCS ? form.getCheckBox('ChkCS') : null;
                const chkPA = fieldsObject?.chkPA ? form.getCheckBox('chkPA') : null;
                const chkSB = fieldsObject?.chkSB ? form.getCheckBox('chkSB') : null;
                const ChkSH = fieldsObject?.ChkSH ? form.getCheckBox('ChkSH') : null;
                const ChkGP = fieldsObject?.ChkGP ? form.getCheckBox('ChkGP') : null;
                const chkGC = fieldsObject?.chkGC ? form.getCheckBox('chkGC') : null;
                const chkIL = fieldsObject?.chkIL ? form.getCheckBox('chkIL') : null;
                const chkSP = fieldsObject?.chkSP ? form.getCheckBox('chkSP') : null;
                const chkSC = fieldsObject?.chkSC ? form.getCheckBox('chkSC') : null;
                const chkSS = fieldsObject?.chkSS ? form.getCheckBox('chkSS') : null;
                const chkOF = fieldsObject?.chkOF ? form.getCheckBox('chkOF') : null;
                const chkOK = fieldsObject?.chkOK ? form.getCheckBox('chkOK') : null;
                const chkYes = fieldsObject?.chkYes ? form.getCheckBox('chkYes') : null;
                const chkNO = fieldsObject?.chkNO ? form.getCheckBox('chkNO') : null;
                const chkBG = fieldsObject?.chkBG ? form.getCheckBox('chkBG') : null;
                const chkXS = fieldsObject?.chkXS ? form.getCheckBox('chkXS') : null;
                const chkXR = fieldsObject?.chkXR ? form.getCheckBox('chkXR') : null;
                const chkBE = fieldsObject?.chkBE ? form.getCheckBox('chkBE') : null;
                const chkFR = fieldsObject?.chkFR ? form.getCheckBox('chkFR') : null;
                const chkCF = fieldsObject?.chkCF ? form.getCheckBox('chkCF') : null;
                const chkAQ = fieldsObject?.chkAQ ? form.getCheckBox('chkAQ') : null;
                const chkNE = fieldsObject?.chkNE ? form.getCheckBox('chkNE') : null;
                const chkER = fieldsObject?.chkER ? form.getCheckBox('chkER') : null;
                const chkEE = fieldsObject?.chkEE ? form.getCheckBox('chkEE') : null;
                const chkST = fieldsObject?.chkST ? form.getCheckBox('chkST') : null;
                const chkRU = fieldsObject?.chkRU ? form.getCheckBox('chkRU') : null;

                const WeaponFields = {
                    1: fieldsObject?.chkFirearm ? form.getCheckBox('chkFirearm') : null,
                    2: fieldsObject?.chkAutoFirearm ? form.getCheckBox('chkAutoFirearm') : null,
                    3: fieldsObject?.chkHandgun ? form.getCheckBox('chkHandgun') : null,
                    4: fieldsObject?.chkAutoHandgun ? form.getCheckBox('chkAutoHandgun') : null,
                    5: fieldsObject?.chkRifle ? form.getCheckBox('chkRifle') : null,
                    6: fieldsObject?.chkAutoRifle ? form.getCheckBox('chkAutoRifle') : null,
                    7: fieldsObject?.chkShotGun ? form.getCheckBox('chkShotGun') : null,
                    8: fieldsObject?.chkAutoShortgun ? form.getCheckBox('chkAutoShortgun') : null,
                    9: fieldsObject?.chkOtherFirearm ? form.getCheckBox('chkOtherFirearm') : null,
                    10: fieldsObject?.chkAutoOtherFireaem ? form.getCheckBox('chkAutoOtherFireaem') : null,
                    11: fieldsObject?.chkKnife ? form.getCheckBox('chkKnife') : null,
                    12: fieldsObject?.chkBluntObject ? form.getCheckBox('chkBluntObject') : null,
                    13: fieldsObject?.chkMotorVehicle ? form.getCheckBox('chkMotorVehicle') : null,
                    14: fieldsObject?.chkPersonalW ? form.getCheckBox('chkPersonalW') : null,
                    15: fieldsObject?.chkPoison ? form.getCheckBox('chkPoison') : null,
                    16: fieldsObject?.chkExplosives ? form.getCheckBox('chkExplosives') : null,
                    17: fieldsObject?.chkFireIndendDevice ? form.getCheckBox('chkFireIndendDevice') : null,
                    18: fieldsObject?.chkDrugs ? form.getCheckBox('chkDrugs') : null,
                    19: fieldsObject?.chkAsphyxiation ? form.getCheckBox('chkAsphyxiation') : null,
                    20: fieldsObject?.chkOther ? form.getCheckBox('chkOther') : null,
                    21: fieldsObject?.chkWaponUnknown ? form.getCheckBox('chkWaponUnknown') : null,
                    22: fieldsObject?.chkWeaponNone ? form.getCheckBox('chkWeaponNone') : null,
                };

                const chkPhyInjNone = fieldsObject?.chkPhyInjNone ? form.getCheckBox('chkPhyInjNone') : null;
                const chkAppearantBrokenBones = fieldsObject?.chkAppearantBrokenBones ? form.getCheckBox('chkAppearantBrokenBones') : null;
                const chkPInternalInjury = fieldsObject?.chkPInternalInjury ? form.getCheckBox('chkPInternalInjury') : null;
                const chkSevereLaceration = fieldsObject?.chkSevereLaceration ? form.getCheckBox('chkSevereLaceration') : null;
                const chkAppearentMinorInjury = fieldsObject?.chkAppearentMinorInjury ? form.getCheckBox('chkAppearentMinorInjury') : null;
                const chkOtherMinorInj = fieldsObject?.chkOtherMinorInj ? form.getCheckBox('chkOtherMinorInj') : null;
                const chkLossTeath = fieldsObject?.chkLossTeath ? form.getCheckBox('chkLossTeath') : null;
                const chkUnconsciousness = fieldsObject?.chkUnconsciousness ? form.getCheckBox('chkUnconsciousness') : null;

                const chkoffenses13A = fieldsObject?.chkoffenses13A ? form.getCheckBox('chkoffenses13A') : null;
                const chkoffenses13B = fieldsObject?.chkoffenses13B ? form.getCheckBox('chkoffenses13B') : null;
                const chkoffenses13C = fieldsObject?.chkoffenses13C ? form.getCheckBox('chkoffenses13C') : null;

                const chkoffenses09A = fieldsObject?.chkoffenses09A ? form.getCheckBox('chkoffenses09A') : null;
                const chkoffenses09B = fieldsObject?.chkoffenses09B ? form.getCheckBox('chkoffenses09B') : null;
                const chkoffenses09C = fieldsObject?.chkoffenses09C ? form.getCheckBox('chkoffenses09C') : null;

                const chkoffenses11A = fieldsObject?.chkoffenses11A ? form.getCheckBox('chkoffenses11A') : null;
                const chkoffenses11B = fieldsObject?.chkoffenses11B ? form.getCheckBox('chkoffenses11B') : null;
                const chkoffenses11D = fieldsObject?.chkoffenses11D ? form.getCheckBox('chkoffenses11D') : null;
                const chkoffenses36A = fieldsObject?.chkoffenses36A ? form.getCheckBox('chkoffenses36A') : null;
                const chkoffenses11C = fieldsObject?.chkoffenses11C ? form.getCheckBox('chkoffenses11C') : null;

                const chkoffenses64A = fieldsObject?.chkoffenses64A ? form.getCheckBox('chkoffenses64A') : null;
                const chkoffenses64B = fieldsObject?.chkoffenses64B ? form.getCheckBox('chkoffenses64B') : null;

                const chkoffenses100 = fieldsObject?.chkoffenses100 ? form.getCheckBox('chkoffenses100') : null;
                const chkoffenses120 = fieldsObject?.chkoffenses120 ? form.getCheckBox('chkoffenses120') : null;


                const LocationFields = {
                    1: fieldsObject?.chkAir ? form.getCheckBox('chkAir') : null,
                    2: fieldsObject?.chkBank ? form.getCheckBox('chkBank') : null,
                    3: fieldsObject?.chkBar ? form.getCheckBox('chkBar') : null,
                    4: fieldsObject?.chkChurch ? form.getCheckBox('chkChurch') : null,
                    5: fieldsObject?.chkCommercial ? form.getCheckBox('chkCommercial') : null,
                    6: fieldsObject?.chkConstructionSite ? form.getCheckBox('chkConstructionSite') : null,
                    7: fieldsObject?.chkConStore ? form.getCheckBox('chkConStore') : null,
                    8: fieldsObject?.chkDeptStore ? form.getCheckBox('chkDeptStore') : null,
                    9: fieldsObject?.chkDrugStore ? form.getCheckBox('chkDrugStore') : null,
                    10: fieldsObject?.chkFieldWood ? form.getCheckBox('chkFieldWood') : null,
                    11: fieldsObject?.chkGrocerySupermarket ? form.getCheckBox('chkGrocerySupermarket') : null,
                    12: fieldsObject?.chkHighWay ? form.getCheckBox('chkHighWay') : null,
                    13: fieldsObject?.chkHotel ? form.getCheckBox('chkHotel') : null,
                    14: fieldsObject?.chkJail ? form.getCheckBox('chkJail') : null,
                    15: fieldsObject[111] ? form.getCheckBox('111') : null,
                    16: fieldsObject?.chkLake ? form.getCheckBox('chkLake') : null,
                    17: fieldsObject?.chkLiquor ? form.getCheckBox('chkLiquor') : null,
                    18: fieldsObject?.chkParkingDrop ? form.getCheckBox('chkParkingDrop') : null,
                    19: fieldsObject?.chkRentalStorage ? form.getCheckBox('chkRentalStorage') : null,
                    20: fieldsObject?.chkResidence ? form.getCheckBox('chkResidence') : null,
                    21: fieldsObject?.chkRestaurant ? form.getCheckBox('chkRestaurant') : null,
                    22: fieldsObject?.chkServiceGas ? form.getCheckBox('chkServiceGas') : null,
                    23: fieldsObject?.chkSpecStore ? form.getCheckBox('chkSpecStore') : null,
                    24: fieldsObject?.ChkOtherUnknown ? form.getCheckBox('ChkOtherUnknown') : null,
                    25: fieldsObject?.chkAbandoned ? form.getCheckBox('chkAbandoned') : null,
                    26: fieldsObject?.chkAmusement ? form.getCheckBox('chkAmusement') : null,
                    27: fieldsObject?.chkArena ? form.getCheckBox('chkArena') : null,
                    28: fieldsObject?.chkATM ? form.getCheckBox('chkATM') : null,
                    29: fieldsObject?.chkAutoDealership ? form.getCheckBox('chkAutoDealership') : null,
                    30: fieldsObject?.chkCamp ? form.getCheckBox('chkCamp') : null,
                    31: fieldsObject?.chkDaycare ? form.getCheckBox('chkDaycare') : null,
                    32: fieldsObject?.chkDock ? form.getCheckBox('chkDock') : null,
                    33: fieldsObject?.chkFarm ? form.getCheckBox('chkFarm') : null,
                    34: fieldsObject?.chkGambling ? form.getCheckBox('chkGambling') : null,
                    35: fieldsObject?.chkIndustrialSite ? form.getCheckBox('chkIndustrialSite') : null,
                    36: fieldsObject?.chkMilitary ? form.getCheckBox('chkMilitary') : null,
                    37: fieldsObject?.chkParkPlay ? form.getCheckBox('chkParkPlay') : null,
                    38: fieldsObject?.chkRestArea ? form.getCheckBox('chkRestArea') : null,
                    39: fieldsObject?.chkSchoolElementary ? form.getCheckBox('chkSchoolElementary') : null,
                    40: fieldsObject?.chkShelter ? form.getCheckBox('chkShelter') : null,
                    41: fieldsObject?.chkShoppingMall ? form.getCheckBox('chkShoppingMall') : null,
                    42: fieldsObject?.chkTribalLands ? form.getCheckBox('chkTribalLands') : null,
                    43: fieldsObject?.chkCommunityCenter ? form.getCheckBox('chkCommunityCenter') : null,
                    44: fieldsObject?.chkCyberSpance ? form.getCheckBox('chkCyberSpance') : null,
                    45: fieldsObject?.chkSchoolUnivesity ? form.getCheckBox('chkSchoolUnivesity') : null,
                };

                const chkAlcohol = fieldsObject?.chkAlcohol ? form.getCheckBox('chkAlcohol') : null;
                const chkDrugsNarcotics = fieldsObject?.chkDrugsNarcotics ? form.getCheckBox('chkDrugsNarcotics') : null;
                const chkNotApplicable = fieldsObject?.chkNotApplicable ? form.getCheckBox('chkNotApplicable') : null;
                const chkCompEquipment = fieldsObject?.chkCompEquipment ? form.getCheckBox('chkCompEquipment') : null;


                const chkCrimeYes = fieldsObject?.chkCrimeYes ? form.getCheckBox('chkCrimeYes') : null;
                const chkCrimeNo = fieldsObject?.chkCrimeNo ? form.getCheckBox('chkCrimeNo') : null;


                if (reportData?.length > 0) {

                    reportData[0]?.IncidentNumber ? txtIncidentNumber?.setText(reportData[0]?.IncidentNumber) : txtIncidentNumber?.setText('')

                    if (reportData[0]?.OffenderSeqNo) {
                        const offData = JSON.parse(reportData[0]?.OffenderSeqNo)

                        offData[0]?.OffenderSeqNo ? OffenderSeq?.setText(offData[0]?.OffenderSeqNo?.toString()) : OffenderSeq?.setText('');
                        offData[0]?.AgeFrom ? txtOffMinAge?.setText(offData[0]?.AgeFrom?.toString()) : txtOffMinAge?.setText('');

                        if (offData[0]?.Sex && offData[0]?.Sex == 'Male') {
                            chkOffMale?.check();
                        } else if (offData[0]?.Sex && offData[0]?.Sex == 'Female') {
                            chkOffFemale?.check();
                        } else {
                            chkOffUnknown?.check();
                        }

                        if (offData[0]?.Ethnicity && offData[0]?.EthnicityCode == 'N') {
                            chkOffNonHispanic?.check();
                        } else if (offData[0]?.Ethnicity && offData[0]?.EthnicityCode == 'H') {
                            chkOffHispanic?.check();
                        } else if (offData[0]?.Ethnicity && offData[0]?.EthnicityCode == 'U') {
                            chkOffEUnknown?.check();
                        }


                        if (offData[0]?.Race && offData[0]?.RaceCode == 'I') {
                            chkOffAmerican?.check()
                        } else if (offData[0]?.Race && offData[0]?.RaceCode == 'W') {
                            chkOffWhite?.check()
                        } else if (offData[0]?.Race && offData[0]?.RaceCode == 'B') {
                            chkOffBlack?.check()
                        } else if (offData[0]?.Race && offData[0]?.RaceCode == 'A') {
                            chkOffAsian?.check()
                        } else if (offData[0]?.Race && offData[0]?.RaceCode == 'P') {
                            chkOffNative?.check()
                        } else if (offData[0]?.Race && offData[0]?.RaceCode == 'U') {
                            chkRaceOffUnkown?.check()
                        }

                    }

                    if (reportData[0]?.VictimSeqNo) {
                        const victimData = JSON.parse(reportData[0]?.VictimSeqNo)

                        victimData[0]?.VictimSeqNo ? txtVictim?.setText(victimData[0]?.VictimSeqNo?.toString()) : txtVictim?.setText('');
                        victimData[0]?.AgeFrom ? txtMinAge?.setText(victimData[0]?.AgeFrom?.toString()) : txtMinAge?.setText('');

                        if (victimData[0]?.Sex && victimData[0]?.Sex == 'Male') {
                            chkMale?.check();
                        } else if (victimData[0]?.Sex && victimData[0]?.Sex == 'Female') {
                            chkFemale?.check();
                        } else {
                            chkVicSexUnknown?.check();
                        }

                        if (victimData[0]?.Ethnicity && victimData[0]?.EthnicityCode == 'N') {
                            chlNonHispanic?.check();
                        } else if (victimData[0]?.Ethnicity && victimData[0]?.EthnicityCode == 'H') {
                            chkHispanic?.check();
                        } else if (victimData[0]?.Ethnicity && victimData[0]?.EthnicityCode == 'U') {
                            chkVUnknown?.check();
                        }

                        if (victimData[0]?.Race && victimData[0]?.RaceCode == 'I') {
                            chkAmerican?.check()
                        } else if (victimData[0]?.Race && victimData[0]?.RaceCode == 'W') {
                            chkWhite?.check()
                        } else if (victimData[0]?.Race && victimData[0]?.RaceCode == 'B') {
                            chkBlack?.check()
                        } else if (victimData[0]?.Race && victimData[0]?.RaceCode == 'A') {
                            ChkAsian?.check()
                        } else if (victimData[0]?.Race && victimData[0]?.RaceCode == 'P') {
                            ChkNagtive?.check()
                        } else if (victimData[0]?.Race && victimData[0]?.RaceCode == 'U') {
                            chkRaceUnkown?.check()
                        }

                    }


                    if (reportData[0]?.IncidentDate) {
                        const incidentDate = new Date(reportData[0]?.IncidentDate.split(' ').slice(0, 3).join(' '));
                        const date = incidentDate.getDate();
                        const month = incidentDate.getMonth() + 1;
                        const year = incidentDate.getFullYear();
                        const hours = reportData[0]?.IncidentDate.split(' ').slice(3).join(' ');

                        hours ? txtIncident?.setText(convertTo24HourFormat(hours)) : txtIncident?.setText('')
                        date ? txtDD?.setText(date?.toString()) : txtDD?.setText('')
                        month ? txtMM?.setText(month?.toString()) : txtMM?.setText('')
                        year ? txtYYYY?.setText(year?.toString()) : txtYYYY?.setText('')

                        chkIDate?.check()

                    }

                    if (reportData[0]?.AgencyORI) {
                        reportData[0]?.AgencyORI ? txtAgency?.setText(JSON.parse(reportData[0]?.AgencyORI)[0]?.AgencyORI?.toString()) : txtAgency?.setText('')
                    }

                    if (reportData[0]?.PrimaryLocation) {
                        JSON.parse(reportData[0]?.PrimaryLocation)?.forEach((item) => {
                            const checkbox = LocationFields[item?.PrimaryLocationId];
                            if (checkbox) {
                                checkbox.check();
                            }
                        });
                    }

                    if (reportData[0]?.WeaponCode) {
                        JSON.parse(reportData[0]?.WeaponCode)?.forEach((item) => {
                            const checkbox = WeaponFields[parseInt(item?.WeaponCode)];
                            if (checkbox) {
                                checkbox.check();
                            }
                        });
                    }

                    if (reportData[0]?.AttemptComplete) {
                        JSON.parse(reportData[0]?.AttemptComplete)?.forEach((item) => {
                            if (item?.AttemptComplete) {
                                chkAttempt.check();
                                chkCompleted.check();
                            }
                        });
                    }

                    if (reportData[0]?.CrimeBias) {
                        if (JSON.parse(reportData[0]?.CrimeBias)?.length > 0) {
                            chkCrimeYes?.check()
                        } else {
                            chkCrimeNo?.check()
                        }
                    }


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

export default UCR10Report

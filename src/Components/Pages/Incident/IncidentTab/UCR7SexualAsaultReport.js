import React, { memo, useEffect, useRef, useState } from 'react'
import { PDFDocument } from 'pdf-lib';
import axios from 'axios';
import { fetchPostData } from '../../../hooks/Api';
import Loader from '../../../Common/Loader';
import { useSelector } from 'react-redux';



const UCR7Report = (props) => {

    const { setStateReportID, sexualAssualtCount, ucrSexualAssaltModalStatus, setUcrSexualtAssulaltModalStatus, reportData } = props

    const [pdfURL, setPdfURL] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const iframeRef = useRef(null);
    const [arrayBuffer, setArrayBuffer] = useState(null);
    const [baseUrl, setBaseUrl] = useState("")
    const [myFile, setMyFile] = useState()
    const [combineUrl, setCombineUrl] = useState('');

    const ucrReportSexualAssaultUrl = useSelector((state) => state.Incident.ucrReportSexualAssaultUrl);

    const dataToBlob = async (imageData) => {
        return await (await fetch(imageData)).blob();
    };

    useEffect(() => {
        ucrReportSexualAssaultUrl && GetReportPdfFile(ucrReportSexualAssaultUrl);
    }, [ucrReportSexualAssaultUrl])

    // FUNCTION TO GET PDF FILE 
    const GetReportPdfFile = async () => {
        const val = { 'Url': ucrReportSexualAssaultUrl };
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
        ucrSexualAssaltModalStatus && handleFileChange();
    }, [sexualAssualtCount, myFile, ucrSexualAssaltModalStatus])

   
    const handleFileChange = async (event) => {
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
                setIsLoading(true);

                const fieldsObject = {};
                const pdfDoc = await PDFDocument.load(arrayBuffer)

                const form = pdfDoc.getForm();
                const fields = form.getFields();

                fields.forEach((field, index) => {
                    const type = field.constructor.name;
                    const name = field.getName();
                    fieldsObject[name.replace(/ +/g, "")] = type;
                });

                // incident
                const chkIDate = fieldsObject?.chkIDate ? form.getCheckBox('chkIDate') : null;
                const chkRDate = fieldsObject?.chkRDate ? form.getCheckBox('chkRDate') : null;
                const chkAttempt = fieldsObject?.chkAttempt ? form.getCheckBox('chkAttempt') : null;
                const chkCompleted = fieldsObject?.chkCompleted ? form.getCheckBox('chkCompleted') : null;
                const txtMM = fieldsObject?.txtMM ? form.getTextField('txtMM') : null;
                const txtDD = fieldsObject?.txtDD ? form.getTextField('txtDD') : null;
                const txtYYYY = fieldsObject?.txtYYYY ? form.getTextField('txtYYYY') : null;

                // Agency
                const txtAgency = fieldsObject?.txtAgency ? form.getTextField('txtAgency') : null;
                const txtIncident = fieldsObject?.txtIncident ? form.getTextField('txtIncident') : null;
                const txtIncidentNumber = fieldsObject?.txtIncidentNumber ? form.getTextField('txtIncidentNumber') : null;

                // victim
                const txtVictim = fieldsObject?.txtVictim ? form.getTextField('txtVictim') : null;
                const txtMinAge = fieldsObject?.txtMinAge ? form.getTextField('txtMinAge') : null;
                const txtVicMaxAge = form.getTextField('Max optional if range') ? form.getTextField('Max optional if range') : null;
                // victim sex
                const chkMale = fieldsObject?.chkMale ? form.getCheckBox('chkMale') : null;
                const chkFemale = fieldsObject?.chkFemale ? form.getCheckBox('chkFemale') : null;
                const chkVicSexUnknown = fieldsObject?.chkVicSexUnknown ? form.getCheckBox('chkVicSexUnknown') : null;

                // victim Race
                const chkWhite = fieldsObject?.chkWhite ? form.getCheckBox('chkWhite') : null;
                const chkBlack = fieldsObject?.chkBlack ? form.getCheckBox('chkBlack') : null;
                const chkAmerican = fieldsObject?.chkAmerican ? form.getCheckBox('chkAmerican') : null;
                const ChkAsian = fieldsObject?.ChkAsian ? form.getCheckBox('ChkAsian') : null;
                const ChkNagtive = fieldsObject?.ChkNagtive ? form.getCheckBox('ChkNagtive') : null;
                const chkRaceOffUnkown = fieldsObject?.chkRaceOffUnkown ? form.getCheckBox('chkRaceOffUnkown') : null;

                // victim Ehinicity
                const chkHispanic = fieldsObject?.chkHispanic ? form.getCheckBox('chkHispanic') : null;
                const chlNonHispanic = fieldsObject?.chlNonHispanic ? form.getCheckBox('chlNonHispanic') : null;
                const chkVUnknown = fieldsObject?.chlNonHispanic ? form.getCheckBox('chlNonHispanic') : null;

                // victim No of Victim 
                const txtNVictims = fieldsObject?.txtNVictims ? form.getTextField('txtNVictims') : null;
                const txtNOffender = fieldsObject?.txtOffNumber ? form.getTextField('txtOffNumber') : null;

                // offender 
                const OffenderSeq = form.getTextField('Offender Seq') ? form.getTextField('Offender Seq') : null;

                // offender Age 
                const txtOffMinAge = fieldsObject?.txtOffMinAge ? form.getTextField('txtOffMinAge') : null;
                const txtOffMaxAge = fieldsObject?.txtOffMaxAge ? form.getTextField('txtOffMaxAge') : null;

                // offender sex
                const chkOffMale = fieldsObject?.chkOffMale ? form.getCheckBox('chkOffMale') : null;
                const chkOffFemale = fieldsObject?.chkOffFemale ? form.getCheckBox('chkOffFemale') : null;
                const chkOffUnknown = fieldsObject?.chkOffUnknown ? form.getCheckBox('chkOffUnknown') : null;

                // offender Race
                const chkOffWhite = fieldsObject?.chkOffWhite ? form.getCheckBox('chkOffWhite') : null;
                const chkOffBlack = fieldsObject?.chkOffBlack ? form.getCheckBox('chkOffBlack') : null;
                const chkOffAmerican = fieldsObject?.chkOffAmerican ? form.getCheckBox('chkOffAmerican') : null;
                const chkOffAsian = fieldsObject?.chkOffAsian ? form.getCheckBox('chkOffAsian') : null;
                const chkOffNative = fieldsObject?.chkOffNative ? form.getCheckBox('chkOffNative') : null;
                const chkRaceUnkown = fieldsObject?.ChkRaceUnknown ? form.getCheckBox('ChkRaceUnknown') : null;


                // offender Ethinicity
                const chkOffHispanic = fieldsObject?.chkOffHispanic ? form.getCheckBox('chkOffHispanic') : null;
                const chkOffNonHispanic = fieldsObject?.chkOffNonHispanic ? form.getCheckBox('chkOffNonHispanic') : null;
                const chkOffEUnknown = fieldsObject?.chkOffEUnknown ? form.getCheckBox('chkOffEUnknown') : null;

                const SEcheckboxRelation = fieldsObject?.chkSE ? form.getCheckBox('chkSE') : null;


                const RelationShipFields = {
                    "SE": fieldsObject?.chkSE ? form.getCheckBox('chkSE') : null,
                    "CS": fieldsObject?.ChkCS ? form.getCheckBox('ChkCS') : null,
                    "CH": fieldsObject?.ChkCH ? form.getCheckBox('chkCH') : null,
                    "PA": fieldsObject?.chkPA ? form.getCheckBox('chkPA') : null,
                    "SB": fieldsObject?.chkSB ? form.getCheckBox('chkSB') : null,
                    "SH": fieldsObject?.ChkSH ? form.getCheckBox('ChkSH') : null,
                    "GP": fieldsObject?.ChkGP ? form.getCheckBox('ChkGP') : null,
                    "GC": fieldsObject?.chkGC ? form.getCheckBox('chkGC') : null,
                    "IL": fieldsObject?.chkIL ? form.getCheckBox('chkIL') : null,
                    "SP": fieldsObject?.chkSP ? form.getCheckBox('chkSP') : null,
                    "SC": fieldsObject?.chkSC ? form.getCheckBox('chkSC') : null,
                    "SS": fieldsObject?.chkSS ? form.getCheckBox('chkSS') : null,
                    "OF": fieldsObject?.chkOF ? form.getCheckBox('chkOF') : null,
                    "OK": fieldsObject?.chkOK ? form.getCheckBox('chkOK') : null,
                    "es": fieldsObject?.chkYes ? form.getCheckBox('chkYes') : null,
                    "NO": fieldsObject?.chkNO ? form.getCheckBox('chkNO') : null,
                    "BG": fieldsObject?.chkBG ? form.getCheckBox('chkBG') : null,
                    "XS": fieldsObject?.chkXS ? form.getCheckBox('chkXS') : null,
                    "XR": fieldsObject?.chkXR ? form.getCheckBox('chkXR') : null,
                    "BE": fieldsObject?.chkBE ? form.getCheckBox('chkBE') : null,
                    "FR": fieldsObject?.chkFR ? form.getCheckBox('chkFR') : null,
                    "CF": fieldsObject?.chkCF ? form.getCheckBox('chkCF') : null,
                    "AQ": fieldsObject?.chkAQ ? form.getCheckBox('chkAQ') : null,
                    "NE": fieldsObject?.chkNE ? form.getCheckBox('chkNE') : null,
                    "ER": fieldsObject?.chkER ? form.getCheckBox('chkER') : null,
                    "EE": fieldsObject?.chkEE ? form.getCheckBox('chkEE') : null,
                    "ST": fieldsObject?.chkST ? form.getCheckBox('chkST') : null,
                    "RU": fieldsObject?.chkRU ? form.getCheckBox('chkRU') : null,
                }

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

                const InjuryFields = {
                    // injuryCheckBox
                    "N": fieldsObject?.chkPhyInjNone ? form.getCheckBox('chkPhyInjNone') : null,
                    "B": fieldsObject?.chkAppearantBrokenBones ? form.getCheckBox('chkAppearantBrokenBones') : null,
                    "I": fieldsObject?.chkPInternalInjury ? form.getCheckBox('chkPInternalInjury') : null,
                    "L": fieldsObject?.chkSevereLaceration ? form.getCheckBox('chkSevereLaceration') : null,
                    "M": fieldsObject?.chkAppearentMinorInjury ? form.getCheckBox('chkAppearentMinorInjury') : null,
                    "O": fieldsObject?.chkOtherMinorInj ? form.getCheckBox('chkOtherMinorInj') : null,
                    "T": fieldsObject?.chkLossTeath ? form.getCheckBox('chkLossTeath') : null,
                    "U": fieldsObject?.chkUnconsciousness ? form.getCheckBox('chkUnconsciousness') : null,

                }

                const offenceFields = {
                    '01': fieldsObject?.chkSexualAbuse ? form.getCheckBox('chkSexualAbuse') : null,
                    '02': fieldsObject?.chkIndecencyChildContact ? form.getCheckBox('chkIndecencyChildContact') : null,
                    '03': fieldsObject?.chkChildExposure ? form.getCheckBox('chkChildExposure') : null,
                    '04': fieldsObject?.chkSexualAssault ? form.getCheckBox('chkSexualAssault') : null,
                    '05': fieldsObject?.chkAggSexualAssault ? form.getCheckBox('chkAggSexualAssault') : null,
                    '06': fieldsObject?.chkSexualPerformanceChild ? form.getCheckBox('chkSexualPerformanceChild') : null,
                    '07': fieldsObject?.chkIndecentassaultA ? form.getCheckBox('chkIndecentassaultA') : null,
                    '08': fieldsObject?.chkIndecentassaultB ? form.getCheckBox('chkIndecentassaultB') : null,
                    '09': fieldsObject?.chkSexualAssaultDonor ? form.getCheckBox('chkSexualAssaultDonor') : null,

                }

                // offence checkbox
                const chkSexualAbuse = fieldsObject?.chkSexualAbuse ? form.getCheckBox('chkSexualAbuse') : null;
                const chkIndecencyChildContact = fieldsObject?.chkIndecencyChildContact ? form.getCheckBox('chkIndecencyChildContact') : null;
                const chkChildExposure = fieldsObject?.chkChildExposure ? form.getCheckBox('chkChildExposure') : null;
                const chkSexualAssault = fieldsObject?.chkSexualAssault ? form.getCheckBox('chkSexualAssault') : null;
                const chkAggSexualAssault = fieldsObject?.chkAggSexualAssault ? form.getCheckBox('chkAggSexualAssault') : null;
                const chkSexualPerformanceChild = fieldsObject?.chkSexualPerformanceChild ? form.getCheckBox('chkSexualPerformanceChild') : null;
                const chkIndecentassaultA = fieldsObject?.chkIndecentassaultA ? form.getCheckBox('chkIndecentassaultA') : null;
                const chkIndecentassaultB = fieldsObject?.chkIndecentassaultB ? form.getCheckBox('chkIndecentassaultB') : null;
                const chkSexualAssaultDonor = fieldsObject?.chkSexualAssaultDonor ? form.getCheckBox('chkSexualAssaultDonor') : null;


                // offence 
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

                const OfferderSusPectFields = {
                    "A": fieldsObject?.chkAlcohol ? form.getCheckBox('chkAlcohol') : null,
                    "D": fieldsObject?.chkDrugsNarcotics ? form.getCheckBox('chkDrugsNarcotics') : null,
                    "N": fieldsObject?.chkNotApplicable ? form.getCheckBox('chkNotApplicable') : null,
                    "C": fieldsObject?.chkCompEquipment ? form.getCheckBox('chkCompEquipment') : null,
                }

                const chkCrimeYes = fieldsObject?.chkCrimeYes ? form.getCheckBox('chkCrimeYes') : null;
                const chkCrimeNo = fieldsObject?.chkCrimeNo ? form.getCheckBox('chkCrimeNo') : null;

                reportData?.IncidentNumber ? txtIncidentNumber?.setText(reportData?.IncidentNumber) : txtIncidentNumber?.setText('')

                if (reportData?.IncidentDate) {
                    const incidentDate = new Date(reportData?.IncidentDate.split(' ').slice(0, 3).join(' '));

                    const date = incidentDate.getDate();
                    const month = incidentDate.getMonth() + 1;
                    const year = incidentDate.getFullYear();
                    const hours = reportData?.IncidentDate.split(' ').slice(3).join(' ');

                    date ? txtDD?.setText(date?.toString()) : txtDD?.setText('')
                    month ? txtMM?.setText(month?.toString()) : txtMM?.setText('')
                    year ? txtYYYY?.setText(year?.toString()) : txtYYYY?.setText('')
                    hours ? txtIncident?.setText(convertTo24HourFormat(hours)) : txtIncident?.setText('')
                    chkIDate?.check()
                }

                if (reportData?.AgencyORI) {
                    reportData?.AgencyORI ? txtAgency?.setText(reportData?.AgencyORI?.toString()) : txtAgency?.setText('')
                }

                

                if (reportData?.Victim?.length > 0) {

                    for (let i = 0; i < reportData?.Victim?.length; i++) {
                        if (reportData?.Victim?.length > 0) {

                            const victimData = reportData?.Victim[i]

                            // txtVictim sequenceNo 
                            victimData?.VictimSeqNo ? txtVictim?.setText(victimData?.VictimSeqNo?.toString()) : txtVictim?.setText('');
                            victimData?.AgeFrom ? txtMinAge?.setText(victimData?.AgeFrom?.toString()) : txtMinAge?.setText('');
                            victimData?.AgeTo ? txtVicMaxAge?.setText(victimData?.AgeTo?.toString()) : txtVicMaxAge?.setText('');
                            victimData?.NoofVictims ? txtNVictims?.setText(victimData?.NoofVictims?.toString()) : txtNVictims?.setText('');

                            if (victimData?.Sex && victimData?.Sex == 'Male') {
                                chkMale?.check(); chkFemale?.uncheck(); chkVicSexUnknown?.uncheck();
                            } else if (victimData?.Sex && victimData?.Sex == 'Female') {
                                chkFemale?.check(); chkVicSexUnknown?.uncheck(); chkMale?.uncheck();
                            } else {
                                chkVicSexUnknown?.check(); chkMale?.uncheck(); chkFemale?.uncheck();
                            }

                            if (victimData?.Ethnicity && victimData?.EthnicityCode == 'N') {
                                chlNonHispanic?.check(); chkHispanic?.uncheck(); chkVUnknown?.uncheck();

                            } else if (victimData?.Ethnicity && victimData?.EthnicityCode == 'H') {
                                chkHispanic?.check(); chlNonHispanic?.uncheck(); chkVUnknown?.uncheck();

                            } else if (victimData?.Ethnicity && victimData?.EthnicityCode == 'U') {
                                chkVUnknown?.check(); chlNonHispanic?.uncheck(); chkHispanic?.uncheck();
                            }

                            if (victimData?.Race && victimData?.RaceCode == 'I') {
                                chkAmerican?.check(); chkWhite?.uncheck(); chkBlack?.uncheck(); ChkAsian?.uncheck(); ChkNagtive?.uncheck(); chkRaceOffUnkown?.uncheck();
                            } else if (victimData?.Race && victimData?.RaceCode == 'W') {
                                chkWhite?.check(); chkBlack?.uncheck(); ChkAsian?.uncheck(); ChkNagtive?.uncheck(); chkRaceOffUnkown?.uncheck(); chkAmerican?.uncheck();
                            } else if (victimData?.Race && victimData?.RaceCode == 'B') {
                                chkBlack?.check(); ChkAsian?.uncheck(); ChkNagtive?.uncheck(); chkRaceOffUnkown?.uncheck(); chkAmerican?.uncheck(); chkWhite?.uncheck();
                            } else if (victimData?.Race && victimData?.RaceCode == 'A') {
                                ChkAsian?.check(); ChkNagtive?.uncheck(); chkRaceOffUnkown?.uncheck(); chkAmerican?.uncheck(); chkWhite?.uncheck(); chkBlack?.uncheck();
                            } else if (victimData?.Race && victimData?.RaceCode == 'P') {
                                ChkNagtive?.check(); chkRaceOffUnkown?.uncheck(); chkAmerican?.uncheck(); chkWhite?.uncheck(); chkBlack?.uncheck(); ChkAsian?.uncheck();
                            } else if (victimData?.Race && victimData?.RaceCode == 'U') {
                                chkRaceOffUnkown?.check(); chkAmerican?.uncheck(); chkWhite?.uncheck(); chkBlack?.uncheck(); ChkAsian?.uncheck(); ChkNagtive?.uncheck();
                            }

                            if (victimData?.RelationShip?.length > 0) {
                                victimData?.RelationShip?.forEach((item) => {
                                    const checkbox = RelationShipFields[item?.VictimRelationshipTypeCode];
                                    if (checkbox) {
                                        checkbox?.check()
                                    }
                                });
                            } else {
                                console.log("(victimData?.RelationShip === isEmpty")
                            }

                            for (let i = 0; i < victimData?.Offender?.length; i++) {

                                if (victimData?.Offender?.length > 0) {
                                    const offData = victimData?.Offender[i]

                                    offData?.OffenderSeqNo ? OffenderSeq?.setText(offData?.OffenderSeqNo?.toString()) : OffenderSeq?.setText('');
                                    offData?.AgeFrom ? txtOffMinAge?.setText(offData?.AgeFrom?.toString()) : txtOffMinAge?.setText('');
                                    offData?.AgeTo ? txtOffMaxAge?.setText(offData?.AgeTo?.toString()) : txtOffMaxAge?.setText('');
                                    offData?.NoOfOffenders ? txtNOffender?.setText(offData?.NoOfOffenders?.toString()) : txtNOffender?.setText('');
                                    victimData?.NoofVictims ? txtNVictims?.setText(victimData?.NoofVictims?.toString()) : txtNVictims?.setText('');

                                    if (offData?.Sex && offData?.Sex == 'Male') {
                                        chkOffMale?.check(); chkOffFemale?.uncheck(); chkOffUnknown?.uncheck();
                                    } else if (offData?.Sex && offData?.Sex == 'Female') {
                                        chkOffFemale?.check(); chkOffMale?.uncheck(); chkOffUnknown?.uncheck();
                                    } else {
                                        chkOffUnknown?.check(); chkOffFemale?.uncheck(); chkOffMale?.uncheck();
                                    }

                                    if (offData?.Race && offData?.RaceCode == 'I') {
                                        chkOffAmerican?.check(); chkOffWhite?.uncheck(); chkOffBlack?.uncheck(); chkOffAsian?.uncheck(); chkOffNative?.uncheck(); chkRaceUnkown?.uncheck();
                                    } else if (offData?.Race && offData?.RaceCode == 'W') {
                                        chkOffWhite?.check(); chkOffBlack?.uncheck(); chkOffAsian?.uncheck(); chkOffNative?.uncheck(); chkRaceUnkown?.uncheck(); chkOffAmerican?.uncheck();
                                    } else if (offData?.Race && offData?.RaceCode == 'B') {
                                        chkOffBlack?.check(); chkOffAsian?.uncheck(); chkOffNative?.uncheck(); chkRaceUnkown?.uncheck(); chkOffAmerican?.uncheck(); chkOffWhite?.uncheck();
                                    } else if (offData?.Race && offData?.RaceCode == 'A') {
                                        chkOffAsian?.check(); chkOffNative?.uncheck(); chkRaceUnkown?.uncheck(); chkOffAmerican?.uncheck(); chkOffWhite?.uncheck(); chkOffBlack?.uncheck();
                                    } else if (offData?.Race && offData?.RaceCode == 'P') {
                                        chkOffNative?.check(); chkRaceUnkown?.uncheck(); chkOffAmerican?.uncheck(); chkOffWhite?.uncheck(); chkOffBlack?.uncheck(); chkOffAsian?.uncheck();
                                    }
                                    else if (offData?.Race && offData?.RaceCode == 'U') {
                                        chkRaceUnkown?.check(); chkOffAmerican?.uncheck(); chkOffWhite?.uncheck(); chkOffBlack?.uncheck(); chkOffAsian?.uncheck(); chkOffNative?.uncheck();
                                    }

                                    if (offData?.Ethnicity && offData?.EthnicityCode == 'N') {
                                        chkOffNonHispanic?.check();
                                    } else if (offData?.Ethnicity && offData?.EthnicityCode == 'H') {
                                        chkOffHispanic?.check();
                                    } else if (offData?.Ethnicity && offData?.EthnicityCode == 'U') {
                                        chkOffEUnknown?.check();
                                    }

                                    if (offData?.CrimeBias?.length > 0) {
                                        if (victimData?.CrimeBias?.length > 0) {
                                            chkCrimeYes?.check()
                                        } else {
                                            chkCrimeNo?.check()
                                        }
                                    }

                                    if (offData?.Injury?.length > 0) {
                                        offData?.Injury?.forEach((item) => {
                                            const checkbox = InjuryFields[item?.InjuryCode];
                                            if (checkbox) {
                                                checkbox.check();
                                            }
                                        });
                                    }

                                    if (offData?.Location?.length > 0) {
                                        offData?.Location?.forEach((item) => {
                                            const checkbox = LocationFields[parseInt(item?.LocationTypeCode)];

                                            if (checkbox) {
                                                checkbox.check();
                                            }
                                        });
                                    }

                                    if (offData?.Weapon?.length > 0) {
                                        offData?.Weapon?.forEach((item) => {
                                            const checkbox = WeaponFields[parseInt(item?.WeaponCode)];
                                            if (checkbox) {
                                                checkbox.check();
                                            }
                                        });
                                    }

                                    if (offData?.OffenderSuspect?.length > 0) {
                                        offData?.OffenderSuspect?.forEach((item) => {
                                            const checkbox = OfferderSusPectFields[item?.OffenderUseCode];
                                            if (checkbox) {
                                                checkbox.check();
                                            }
                                        });
                                    }

                                    if (offData?.Offense?.length > 0) {
                                        offData?.Offense?.forEach((item) => {
                                            const checkbox = offenceFields["01"];
                                            if (checkbox) {
                                                checkbox.check();
                                            }
                                        });
                                    }

                                }

                                const pdfBytes = await pdfDoc.save();
                                const blob = new Blob([pdfBytes], { type: 'application/pdf' });
                                const file = new File([blob], new Date().valueOf() + ".pdf", { type: 'application/pdf' });

                                const url = URL.createObjectURL(file);
                                pdfURL.push(url);

                            }

                        }

                    }
                }
                else {
                    const pdfBytes = await pdfDoc.save();
                    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
                    const file = new File([blob], new Date().valueOf() + ".pdf", { type: 'application/pdf' });

                    const url = URL.createObjectURL(file);
                    pdfURL.push(url);

                }
                mergePdfs(pdfURL)

            }
            setPDF();

        }
    }, [arrayBuffer, sexualAssualtCount, reportData])

    // third
    const mergePdfs = async (pdfUrls) => {
        try {
            const mergedPdf = await PDFDocument.create();

            // Fetch and merge PDF pages
            for (const url of pdfUrls) {

                const pdfBytes = await fetch(url).then((res) => res.arrayBuffer());
                const pdfDoc = await PDFDocument.load(pdfBytes);
                const form = pdfDoc.getForm();
                // Flatten the form fields in the current PDF
                form.flatten();

                const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
                copiedPages.forEach((page) => mergedPdf.addPage(page));
            }

            // Save merged PDF as a Blob
            const mergedPdfBytes = await mergedPdf.save();
            const blob = new Blob([mergedPdfBytes], { type: "application/pdf" });
            const file = new File([blob], new Date().valueOf() + ".pdf", { type: 'application/pdf' });
            const combineUrl = URL.createObjectURL(file);

            // console.log("🚀 ~ mergePdfs ~ combineUrl:", combineUrl);
            setCombineUrl(combineUrl);
            setIsLoading(false);
        } catch (error) {
            console.error('Error merging PDFs:', error);
        }
    };

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
                ucrSexualAssaltModalStatus ?
                    <>
                        <div className="modal fade" style={{ background: "rgba(0,0,0, 0.5)", zIndex: '9999999' }} id="SexualAsaultReport" tabIndex="-1" aria-hidden="true" data-backdrop="false">
                            <div className="modal-dialog modal-dialog-centered modal-xl">
                                <div className="modal-content">
                                    <div className="modal-body">
                                        {
                                            !isLoading ?
                                                <>
                                                    <div className="col-12 col-md-12 col-lg-12 ">
                                                        <div className="row">
                                                            {
                                                                combineUrl && <iframe id='pdfIframe' key={combineUrl} src={combineUrl} style={{ height: "700px", width: "100%", }} />
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="btn-box  text-right  mr-1 mb-1 mt-3" >
                                                        {combineUrl && <button type="button" data-dismiss="modal" className="btn btn-sm btn-success mr-1"
                                                            onClick={() => {
                                                                setUcrSexualtAssulaltModalStatus(false); setPdfURL([]); setCombineUrl('');

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

export default memo(UCR7Report)

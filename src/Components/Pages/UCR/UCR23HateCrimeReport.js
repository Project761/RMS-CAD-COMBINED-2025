import { useEffect, useRef, useState } from 'react'
import { PDFDocument } from 'pdf-lib';
import Loader from '../../Common/Loader';
import { fetchPostData } from '../../hooks/Api';
import axios from 'axios';
import IncNumModal from './IncNumModal';


const HateCrimeIncReport = () => {

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
      
        const val = { 'Url': 'C:\\HostingSpaces\\admin\\apigoldline.com\\wwwroot\\Imagefolder\\UCR-23-HATECRIME.pdf' };
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
        fetchPostData('HateCrimeIncidentReport/GetData_HateCrimeIncidentReport', val).then((data) => {
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



    //TO GET ALL FIELDS OF FILE AND SET DATA TO RELATED FIELD AND OPEN FILLED FILE
    useEffect(() => {
        if (arrayBuffer && reportData?.length > 0) {
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


                const txtOffence2LocationCode = fieldsObject?.txtOffence2LocationCode ? form.getTextField('txtOffence2LocationCode') : null;
                const txtOffence3LocationCode = fieldsObject?.txtOffence3LocationCode ? form.getTextField('txtOffence3LocationCode') : null;
                const txtOffence4LocationCode = fieldsObject?.txtOffence4LocationCode ? form.getTextField('txtOffence4LocationCode') : null;
                const txtOffence5LocationCode = fieldsObject?.txtOffence5LocationCode ? form.getTextField('txtOffence5LocationCode') : null;

                const Biasfields = {
                    11: fieldsObject?.chkBiasRaceAntiWhite ? form.getCheckBox('chkBiasRaceAntiWhite') : null,
                    12: fieldsObject?.chkBiasRaceAntiAmerican ? form.getCheckBox('chkBiasRaceAntiAmerican') : null,
                    13: fieldsObject?.chkBiasRaceAntiAsian ? form.getCheckBox('chkBiasRaceAntiAsian') : null,
                    14: fieldsObject?.chkBiasRaceAntiNative ? form.getCheckBox('chkBiasRaceAntiNative') : null,
                    15: fieldsObject?.chkBiasRaceAntiArab ? form.getCheckBox('chkBiasRaceAntiArab') : null,
                    16: fieldsObject?.chkBiasRaceAntiOtherRace ? form.getCheckBox('chkBiasRaceAntiOtherRace') : null,
                    17: fieldsObject?.chkBiasRaceAntiBlack ? form.getCheckBox('chkBiasRaceAntiBlack') : null,
                    18: fieldsObject?.chkBiasRaceAntiMultiple ? form.getCheckBox('chkBiasRaceAntiMultiple') : null,
                    19: fieldsObject?.chkBiasRaceAntiHispanic ? form.getCheckBox('chkBiasRaceAntiHispanic') : null,
                    20: fieldsObject?.chkBiasSexAntiGay ? form.getCheckBox('chkBiasSexAntiGay') : null,
                    21: fieldsObject?.chkBiasSexAntiLesbian ? form.getCheckBox('chkBiasSexAntiLesbian') : null,
                    22: fieldsObject?.chkBiasSexAntiLabsianGay ? form.getCheckBox('chkBiasSexAntiLabsianGay') : null,
                    23: fieldsObject?.chkBiasSexAntiHeterosexual ? form.getCheckBox('chkBiasSexAntiHeterosexual') : null,
                    24: fieldsObject?.chkBiasSexAntiBisexual ? form.getCheckBox('chkBiasSexAntiBisexual') : null,
                    25: fieldsObject?.chkBiasReligionAntiJewish ? form.getCheckBox('chkBiasReligionAntiJewish') : null,
                    26: fieldsObject?.chkBiasReligionAntiCatholic ? form.getCheckBox('chkBiasReligionAntiCatholic') : null,
                    27: fieldsObject?.chkBiasReligionAntiProtestant ? form.getCheckBox('chkBiasReligionAntiProtestant') : null,
                    28: fieldsObject?.chkBiasReligionAntiIslamic ? form.getCheckBox('chkBiasReligionAntiIslamic') : null,
                    29: fieldsObject?.chkBiasReligionAntiOtherReligion ? form.getCheckBox('chkBiasReligionAntiOtherReligion') : null,
                    30: fieldsObject?.chkBiasReligionAntiMultipleReligious ? form.getCheckBox('chkBiasReligionAntiMultipleReligious') : null,
                    31: fieldsObject?.chkBiasReligionAntiAtheism ? form.getCheckBox('chkBiasReligionAntiAtheism') : null,
                    32: fieldsObject?.chkBiasReligionAntiMormon ? form.getCheckBox('chkBiasReligionAntiMormon') : null,
                    33: fieldsObject?.chkBiasReligionAntiJehovah ? form.getCheckBox('chkBiasReligionAntiJehovah') : null,
                    34: fieldsObject?.chkBiasReligionAntiEasternOrthodox ? form.getCheckBox('chkBiasReligionAntiEasternOrthodox') : null,
                    35: fieldsObject?.chkBiasReligionAntiOtherChristian ? form.getCheckBox('chkBiasReligionAntiOtherChristian') : null,
                    36: fieldsObject?.chkBiasReligionAntiBuddhist ? form.getCheckBox('chkBiasReligionAntiBuddhist') : null,
                    37: fieldsObject?.chkBiasReligionAntiHindu ? form.getCheckBox('chkBiasReligionAntiHindu') : null,
                    38: fieldsObject?.chkBiasReligionAntiSikh ? form.getCheckBox('chkBiasReligionAntiSikh') : null,
                    39: fieldsObject?.chkBiasGenderAntiMale ? form.getCheckBox('chkBiasGenderAntiMale') : null,
                    40: fieldsObject?.chkBiasGenderAntiFemale ? form.getCheckBox('chkBiasGenderAntiFemale') : null,
                    41: fieldsObject?.chkBiasGenderidAntiTransGender ? form.getCheckBox('chkBiasGenderidAntiTransGender') : null,
                    42: fieldsObject?.chkBiasGenderidNonConformin ? form.getCheckBox('chkBiasGenderidNonConformin') : null,
                    51: fieldsObject[51] ? form.getCheckBox('51') : null,
                    52: fieldsObject[52] ? form.getCheckBox('52') : null
                };

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


                const txtTotalVictims = fieldsObject?.txtTotalVictims ? form.getTextField('txtTotalVictims') : null;
                const txtTotalVictims18Over = fieldsObject?.txtTotalVictims18Over ? form.getTextField('txtTotalVictims18Over') : null;
                const txtTotalVictims18under = fieldsObject?.txtTotalVictims18under ? form.getTextField('txtTotalVictims18under') : null;


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


                const txtPagefrom = fieldsObject?.txtPagefrom ? form.getTextField('txtPagefrom') : null;
                const txtPageto = fieldsObject?.txtPageto ? form.getTextField('txtPageto') : null;


                if (reportData?.length > 0) {

                    reportData[0]?.IncidentNumber ? IncidentNo?.setText("INC" + reportData[0]?.IncidentNumber) : IncidentNo?.setText('')
                    reportData[0]?.IncidentDate ? DateofIncident?.setText(reportData[0]?.IncidentDate.split(' ').slice(0, 3).join(' ')) : DateofIncident?.setText('')

                    reportData[0]?.TotalVictimOffense ? txtTotalVictims?.setText(JSON.parse(reportData[0]?.TotalVictimOffense)[0]?.TotalVictimOffense?.toString()) : txtTotalVictims?.setText('')
                    reportData[0]?.VictimAge ? txtTotalVictims18Over?.setText(JSON.parse(reportData[0]?.VictimAge)[0]?.VictimOver?.toString()) : txtTotalVictims18Over?.setText('')
                    reportData[0]?.VictimAge ? txtTotalVictims18under?.setText(JSON.parse(reportData[0]?.VictimAge)[0]?.VictimUnder?.toString()) : txtTotalVictims18under?.setText('')

                    reportData[0]?.TotalCountoffender ? txtTotalOffenders?.setText(JSON.parse(reportData[0]?.TotalCountoffender)[0]?.TotalCountoffender?.toString()) : txtTotalOffenders?.setText('00')
                    reportData[0]?.offenderAgeOver ? txtTotalOffenders18Over?.setText(JSON.parse(reportData[0]?.offenderAgeOver)[0]?.offenderAgeOver?.toString()) : txtTotalOffenders18Over?.setText('00')
                    reportData[0]?.offenderAgeUnder ? txtTotalOffenders18Under?.setText(JSON.parse(reportData[0]?.offenderAgeUnder)[0]?.offenderAgeUnder?.toString()) : txtTotalOffenders18Under?.setText('00')


                    if (reportData[0]?.Location) {
                        const locations = JSON.parse(reportData[0].Location);
                        locations.forEach((item) => {
                            const checkbox = checkboxes[item?.PrimaryLocationId];
                            if (checkbox) {
                                checkbox.check();
                            }
                        });
                    }

                    if (reportData[0]?.BiasMotivation) {
                        JSON.parse(reportData[0]?.BiasMotivation)?.forEach((item) => {
                            const checkbox = Biasfields[item?.BiasCode];
                            if (checkbox) {
                                checkbox.check();
                            }
                        });
                    }

                    if (reportData[0]?.RaceAndEthnic) {
                        JSON.parse(reportData[0]?.RaceAndEthnic)?.forEach(data => {
                            if (Racefields[data.RaceID]) {
                                Racefields[data.RaceID].check();
                            }

                            if (Ethnicityfields[data.EthnicityID]) {
                                Ethnicityfields[data.EthnicityID].check();
                            }
                        });
                    }

                    if (reportData[0]?.Offence) {
                        JSON.parse(reportData[0]?.Offence)?.forEach((data, index) => {
                            const checkboxVictim = VictimNum[index];
                            const checkboxOffence = OffenceCode[index];
                            if (checkboxVictim) {
                                checkboxVictim?.setText(data?.OffenceCode1)
                            }
                            if (checkboxOffence) {
                                checkboxOffence?.setText(data?.OffenceCode?.slice(0, 2))
                            }
                        })
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

export default HateCrimeIncReport

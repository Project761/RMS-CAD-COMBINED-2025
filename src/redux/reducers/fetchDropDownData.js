import { Decrypt_Id_Name } from "../../Components/Common/Utility";

import {
    //----------------------------------------Drop_DownsDataArrays-----------------------------------
    Agency_OfficerDrp_Data, Agency_Officer_FullName_Drp_Data, DL_State_DrpData, PropertyType_Data, Arrestee_Name_DrpData, Property_LossCode_Drp_Data, Color_Drp_Data,
    State_DrpData, Material_Drp_Data, Make_Drp_Data, Propulusion_Drp_Data, WeaponMake_Drp_Data, DrugManufactured_Drp_Data, TypeMarijuana_Drp_Data,
    MeasureType_Drp_Data, SuspectedDrug_Drp_Data, WeaponModel_Drp_Data, BoatModel_Drp_Data, VOD_Drp_Data, PropertySourceDrug_Drp_Data,
    Country_Drp_Data, States_Drp_Data, City_Drp_Data, DL_States_Drp_Data, HowVerify_Drp_Data, Resident_Drp_Data, Marital_Drp_Data,
    Face_Color_Drp_Data, ComplexionType_Drp_Data, Hair_Style_Drp_Data, Facial_Hair_Type_Drp_Data, NameDistinct_Features_Drp_Data,
    Hair_Length_Drp_Data, FacialHair_Drp_Data, Hair_Shades_Drp_Data, Facial_Oddity_Drp_Data, Body_Build_Drp_Data, Speach_Codes_Drp_Data,
    Teeth_Codes_Drp_Data, Glasses_Type_Drp_Data, Name_Handedness_Drp_Data, Contact_Type_Drp_Data, Masters_Name_Drp_Data, Message_Key_Drp_Data, Possession_Owner_Name_Drp_Data,
    Missing_Person_Drp_Data, Ever_DonatedBlood_Drp_Data, Circumstances_Drp_Data, Body_XRay_Drp_Data, Skin_Tone_Drp_Data, Missing_Person_Relationship_Drp_Data, Corrected_Vision_Drp_Data, Fingerprinted_Drp_Data,
    Missing_CMC_Drp_Data, Blood_Type_Drp_Data, Jwellery_Drp_Data, Vehicle_LossCode_Drp_Data, PlateID_Drp_Data, Classification_Drp_Data, StyleID_Drp_Data,
    MakeID_Drp_Data, ModalID_Drp_Data, VehicleColor_Drp_Data, VODID_Drp_Data, Circumcision_Drp_Data, ArrestType_DrData, get_Arresting_DrpData, Arresting_DrpData,
    ArrestJuvenileDis_DrpData, UCRClearID_Drp_Data, NIBRS_Drp_Data, ReceiveSource_Drp_Data, FBI_Codes_Drp_Data, CadCfsCode_Drp_Data, Rms_Disposition_Drp_Data,
    Cad_Disposition_Drp_Data, Narrative_Type_Drp_Data, PictureType_Drp_Data, ImageView_Type_Drp_Data, Top_Color_Drp_Data, Bottom_Color_Drp_Data,
    Eye_Color_Drp_Data, Hair_Color_Drp_Data, IsPrimary_Color_Drp_Data, IsSecondary_Color_Drp_Data, FISuspectActivity_Drp_Data, FIContactType_Drp_Data,
    Alert_Drp_Data,
    Arrestee_NameMissing_DrpData, Arrestee_Vehicle_DrpData,
    Mode_Of_Training_Drp_Data,
    Training_Category_Drp_Data,
    Training_Course_Drp_Data,
    Level_Clearance_Drp_Data


} from "../actionTypes"

const initialState = {
    // All use
    uniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
    agencyOfficerDrpData: [], agencyOfficerFullNameDrpData: [], dlStateDrpData: [], propertyTypeData: [], arresteeNameData: [], arresteeNameMissingData: [], propertyLossCodeDrpData: [], colorDrpData: [],
    stateDrpData: [], materialDrpData: [], makeDrpData: [], propulusionDrpData: [], weaponMakeDrpData: [], drugManufacturedDrpData: [], typeMarijuanaDrpData: [],
    measureTypeDrpData: [], suspectedDrugDrpData: [], weaponModelDrpData: [], boatModelDrpData: [], vodDrpData: [], propSourceDrugDrpData: [],
    countryDrpData: [], statesDrpData: [], cityDrpData: [], dlStatesDrpData: [], howVerifyDrpData: [], residentDrpData: [], maritalDrpData: [],
    faceColorDrpData: [], complexionTypeDrpData: [], hairStyleDrpData: [], facialHairTypeDrpData: [], nameDistinctFeaturesDrpData: [], hairLengthDrpData: [],
    facialHairDrpData: [], hairShadesDrpData: [], facialOddityDrpData: [], bodyBuildDrpData: [], speachCodesDrpData: [], teethCodesDrpData: [],
    glassesTypeDrpData: [], nameHandednessDrpData: [], contactTypeDrpData: [], mastersNameDrpData: [], messageKeyDrpData: [], missingPersonDrpData: [], donatedBloodDrpData: [],
    circumstancesDrpData: [], bodyXRayDrpData: [], skinToneDrpData: [], missingPersonRelationshipDrpData: [], correctedVisionDrpData: [], fingerPrintedDrpData: [], missingCMCDrpData: [], bloodTypeDrpData: [], circumcisionDrpData: [],
    JwelleryDrpData: [], receiveSourceDrpData: [], fbiCodesDrpData: [], cadCfsCodeDrpData: [], rmsDispositionDrpData: [], cadDispositionDrpData: [], narrativeTypeDrpData: [],
    pictureTypeDrpData: [], pictureViewDrpData: [], topColorDrpData: [], bottomColorDrpData: [], eyeColorDrpData: [], hairColorDrpData: [], isPrimaryDrpData: [], isSecondaryDrpData: [], alertDrpData: [], arresteeNameVehicle: [],



    //------------------------------------ArrestHome-----------------------------
    arrestTypeDrpData: [], arrestingDrpData: [], arrestJuvenileDisDrpData: [], UCRClearDrpData: [], NIBRSDrpData: [],

    //-------------------------Vehicle-----------------------------------
    vehicleLossCodeDrpData: [], vehiclePlateIdDrpData: [], classificationDrpData: [], styleIdDrpData: [], makeIdDrpData: [], modalIdDrpData: [], vehicleColorDrpData: [],
    vehicleVODIDDrpData: [], FISuspectActivity: [], FIContactType: []

}



const DropDownReducer = (state = initialState, action) => {
    switch (action.type) {
        case Alert_Drp_Data:
            return {
                ...state,
                alertDrpData: action.payload
            }
        case IsSecondary_Color_Drp_Data:
            return {
                ...state,
                isSecondaryDrpData: action.payload
            }
        case IsPrimary_Color_Drp_Data:
            return {
                ...state,
                isPrimaryDrpData: action.payload
            }
        case Eye_Color_Drp_Data:
            return {
                ...state,
                eyeColorDrpData: action.payload
            }
        case Hair_Color_Drp_Data:
            return {
                ...state,
                hairColorDrpData: action.payload
            }
        case Top_Color_Drp_Data:
            return {
                ...state,
                topColorDrpData: action.payload
            }
        case Bottom_Color_Drp_Data:
            return {
                ...state,
                bottomColorDrpData: action.payload
            }
        case PictureType_Drp_Data:
            return {
                ...state,
                pictureTypeDrpData: action.payload
            }
        case ImageView_Type_Drp_Data:
            return {
                ...state,
                pictureViewDrpData: action.payload
            }
        case Narrative_Type_Drp_Data:
            return {
                ...state,
                narrativeTypeDrpData: action.payload
            }
        case Cad_Disposition_Drp_Data:
            return {
                ...state,
                cadDispositionDrpData: action.payload
            }
        case Rms_Disposition_Drp_Data:
            return {
                ...state,
                rmsDispositionDrpData: action.payload
            }
        case CadCfsCode_Drp_Data:
            return {
                ...state,
                cadCfsCodeDrpData: action.payload
            }
        case FBI_Codes_Drp_Data:
            return {
                ...state,
                fbiCodesDrpData: action.payload
            }
        case ReceiveSource_Drp_Data:
            return {
                ...state,
                receiveSourceDrpData: action.payload
            }
        case VODID_Drp_Data:
            return {
                ...state,
                vehicleVODIDDrpData: action.payload
            }
        case VehicleColor_Drp_Data:
            return {
                ...state,
                vehicleColorDrpData: action.payload
            }
        case ModalID_Drp_Data:
            return {
                ...state,
                modalIdDrpData: action.payload
            }
        case MakeID_Drp_Data:
            return {
                ...state,
                makeIdDrpData: action.payload
            }
        case StyleID_Drp_Data:
            return {
                ...state,
                styleIdDrpData: action.payload
            }
        case Classification_Drp_Data:
            return {
                ...state,
                classificationDrpData: action.payload
            }
        case PlateID_Drp_Data:
            return {
                ...state,
                vehiclePlateIdDrpData: action.payload
            }
        case Vehicle_LossCode_Drp_Data:
            return {
                ...state,
                vehicleLossCodeDrpData: action.payload
            }
        case Jwellery_Drp_Data:
            return {
                ...state,
                JwelleryDrpData: action.payload
            }
        case Circumcision_Drp_Data:
            return {
                ...state,
                circumcisionDrpData: action.payload
            }
        case Blood_Type_Drp_Data:
            return {
                ...state,
                bloodTypeDrpData: action.payload
            }
        case Missing_CMC_Drp_Data:
            return {
                ...state,
                missingCMCDrpData: action.payload
            }
        case Fingerprinted_Drp_Data:
            return {
                ...state,
                fingerPrintedDrpData: action.payload
            }
        case Corrected_Vision_Drp_Data:
            return {
                ...state,
                correctedVisionDrpData: action.payload
            }
        case Body_XRay_Drp_Data:
            return {
                ...state,
                bodyXRayDrpData: action.payload
            }
        case Skin_Tone_Drp_Data:
            return {
                ...state,
                skinToneDrpData: action.payload
            }
        case Missing_Person_Relationship_Drp_Data:
            return {
                ...state,
                missingPersonRelationshipDrpData: action.payload
            }
        case Circumstances_Drp_Data:
            return {
                ...state,
                circumstancesDrpData: action.payload
            }
        case Ever_DonatedBlood_Drp_Data:
            return {
                ...state,
                donatedBloodDrpData: action.payload
            }
        case Missing_Person_Drp_Data:
            return {
                ...state,
                missingPersonDrpData: action.payload
            }
        case Message_Key_Drp_Data:
            return {
                ...state,
                messageKeyDrpData: action.payload
            }
        case Masters_Name_Drp_Data:
            return {
                ...state,
                mastersNameDrpData: action.payload
            }
        case Possession_Owner_Name_Drp_Data:
            return {
                ...state,
                ownerPossessionDrpData: action.payload
            }
        case Contact_Type_Drp_Data:
            return {
                ...state,
                contactTypeDrpData: action.payload
            }
        case Name_Handedness_Drp_Data:
            return {
                ...state,
                nameHandednessDrpData: action.payload
            }
        case Glasses_Type_Drp_Data:
            return {
                ...state,
                glassesTypeDrpData: action.payload
            }
        case Teeth_Codes_Drp_Data:
            return {
                ...state,
                teethCodesDrpData: action.payload
            }
        case Speach_Codes_Drp_Data:
            return {
                ...state,
                speachCodesDrpData: action.payload
            }
        case Body_Build_Drp_Data:
            return {
                ...state,
                bodyBuildDrpData: action.payload
            }
        case Facial_Oddity_Drp_Data:
            return {
                ...state,
                facialOddityDrpData: action.payload
            }
        case Hair_Shades_Drp_Data:
            return {
                ...state,
                hairShadesDrpData: action.payload
            }
        case FacialHair_Drp_Data:
            return {
                ...state,
                facialHairDrpData: action.payload
            }
        case Hair_Length_Drp_Data:
            return {
                ...state,
                hairLengthDrpData: action.payload
            }
        case NameDistinct_Features_Drp_Data:
            return {
                ...state,
                nameDistinctFeaturesDrpData: action.payload
            }
        case Facial_Hair_Type_Drp_Data:
            return {
                ...state,
                facialHairTypeDrpData: action.payload
            }
        case Hair_Style_Drp_Data:
            return {
                ...state,
                hairStyleDrpData: action.payload
            }
        case ComplexionType_Drp_Data:
            return {
                ...state,
                complexionTypeDrpData: action.payload
            }
        case Face_Color_Drp_Data:
            return {
                ...state,
                faceColorDrpData: action.payload
            }
        case Marital_Drp_Data:
            return {
                ...state,
                maritalDrpData: action.payload
            }
        case Resident_Drp_Data:
            return {
                ...state,
                residentDrpData: action.payload
            }
        case HowVerify_Drp_Data:
            return {
                ...state,
                howVerifyDrpData: action.payload
            }
        case City_Drp_Data:
            return {
                ...state,
                cityDrpData: action.payload
            }
        case DL_States_Drp_Data:
            return {
                ...state,
                dlStatesDrpData: action.payload
            }
        case States_Drp_Data:
            return {
                ...state,
                statesDrpData: action.payload
            }
        case Country_Drp_Data:
            return {
                ...state,
                countryDrpData: action.payload
            }
        case Agency_OfficerDrp_Data:
            return {
                ...state,
                agencyOfficerDrpData: action.payload
            }
        case Agency_Officer_FullName_Drp_Data:
            return {
                ...state,
                agencyOfficerFullNameDrpData: action.payload
            }
        case DL_State_DrpData:
            return {
                ...state,
                dlStateDrpData: action.payload
            }
        case State_DrpData:
            return {
                ...state,
                stateDrpData: action.payload
            }
        case PropertyType_Data:
            return {
                ...state,
                propertyTypeData: action.payload
            }
        case Arrestee_Name_DrpData:
            return {
                ...state,
                arresteeNameData: action.payload
            }

        case Arrestee_NameMissing_DrpData:
            return {
                ...state,
                arresteeNameMissingData: action.payload
            }
        case Arrestee_Vehicle_DrpData:
            return {
                ...state,
                arresteeNameVehicle: action.payload
            }


        case Property_LossCode_Drp_Data:
            return {
                ...state,
                propertyLossCodeDrpData: action.payload
            }
        case Color_Drp_Data:
            return {
                ...state,
                colorDrpData: action.payload
            }
        case Material_Drp_Data:
            return {
                ...state,
                materialDrpData: action.payload
            }
        case Make_Drp_Data:
            return {
                ...state,
                makeDrpData: action.payload
            }
        case Propulusion_Drp_Data:
            return {
                ...state,
                propulusionDrpData: action.payload
            }
        case WeaponMake_Drp_Data:
            return {
                ...state,
                weaponMakeDrpData: action.payload
            }
        case DrugManufactured_Drp_Data:
            return {
                ...state,
                drugManufacturedDrpData: action.payload
            }
        case TypeMarijuana_Drp_Data:
            return {
                ...state,
                typeMarijuanaDrpData: action.payload
            }
        case MeasureType_Drp_Data:
            return {
                ...state,
                measureTypeDrpData: action.payload
            }
        case SuspectedDrug_Drp_Data:
            return {
                ...state,
                suspectedDrugDrpData: action.payload
            }
        case WeaponModel_Drp_Data:
            return {
                ...state,
                weaponModelDrpData: action.payload
            }
        case BoatModel_Drp_Data:
            return {
                ...state,
                boatModelDrpData: action.payload
            }
        case VOD_Drp_Data:
            return {
                ...state,
                vodDrpData: action.payload
            }
        case PropertySourceDrug_Drp_Data:
            return {
                ...state,
                propSourceDrugDrpData: action.payload
            }



        //-------------------------------arrestHome---------------------
        case ArrestType_DrData:
            return {
                ...state,
                arrestTypeDrpData: action.payload
            }
        case Arresting_DrpData:
            return {
                ...state,
                arrestingDrpData: action.payload
            }
        case ArrestJuvenileDis_DrpData:
            return {
                ...state,
                arrestJuvenileDisDrpData: action.payload
            }
        case UCRClearID_Drp_Data:
            return {
                ...state,
                UCRClearDrpData: action.payload
            }
        case NIBRS_Drp_Data:
            return {
                ...state,
                NIBRSDrpData: action.payload
            }
        case FISuspectActivity_Drp_Data:
            return {
                ...state,
                FISuspectActivity: action.payload
            }
        case FIContactType_Drp_Data:
            return {
                ...state,
                FIContactType: action.payload
            }
        case Mode_Of_Training_Drp_Data:
            return {
                ...state,
                TrainingModeOfDrpData: action.payload
            }
        case Training_Category_Drp_Data:
            return {
                ...state,
                TrainingCategoryDrpData: action.payload
            }
        case Training_Course_Drp_Data:
            return {
                ...state,
                TrainingCourseDrpData: action.payload
            }
        case Level_Clearance_Drp_Data:
            return {
                ...state,
                LevelClearanceDrpData: action.payload
            }
        default: return state
    }
}

export default DropDownReducer

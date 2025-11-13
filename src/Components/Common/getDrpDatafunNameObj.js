
import { get_ArrestJuvenileDis_DrpData, get_ArrestType_Drp, get_BloodType_Drp_Data, get_Body_XRay_Drp_Data, get_Skin_Tone_Drp_Data, get_Missing_Person_Relationship_Drp_Data, get_Circumcision_Drp_Data, get_Circumstances_Drp_Data, get_Corrected_Vision_Drp_Data, get_Data_VODID_Drp_Data, get_Ever_DonatedBlood_Drp_Data, get_Fingerprinted_Drp_Data, get_Incident_Drp_Data, get_IsPrimary_Color_Drp_Data, get_IsSecondary_Color_Drp_Data, get_Message_Key_Drp_Data, get_Missing_CMC_Drp_Data, get_Missing_Person_Drp_Data, get_PlateType_Drp_Data, get_StyleId_Drp_Data, getData_DropDown_LevelClearance, getData_DropDown_ModeOfTraining, getData_DropDown_TrainingCategory, getData_DropDown_TrainingCourse } from "../../redux/actions/DropDownsData";

export const DrpFunctionNameObj = [
    { ListName: 'Incident Receive Source', Myfunction: get_Incident_Drp_Data },
    { ListName: 'Incident Disposition', Myfunction: get_Incident_Drp_Data },
    //-------------------Vichile---------------------
    { ListName: 'Vehicle VOD', Myfunction: get_Data_VODID_Drp_Data },
    { ListName: 'Property Vehicle Style', Myfunction: get_StyleId_Drp_Data },
    { ListName: 'Property Vehicle Plate Type', Myfunction: get_PlateType_Drp_Data },
    { ListName: 'Color', Myfunction: get_IsPrimary_Color_Drp_Data },
    { ListName: 'Color', Myfunction: get_IsSecondary_Color_Drp_Data },
    //--------------------Arrest---------------------
    { ListName: 'Arrest Juvenile Disposition', Myfunction: get_ArrestJuvenileDis_DrpData },
    { ListName: 'Arrest Type', Myfunction: get_ArrestType_Drp },
    //---------------MissingPerson-----------------
    { ListName: 'Message Key', Myfunction: get_Message_Key_Drp_Data },
    { ListName: 'Missing Person', Myfunction: get_Missing_Person_Drp_Data },
    { ListName: 'CMC', Myfunction: get_Missing_CMC_Drp_Data },
    { ListName: 'Ever Donated Blood', Myfunction: get_Ever_DonatedBlood_Drp_Data },
    { ListName: 'Circumstances', Myfunction: get_Circumstances_Drp_Data },
    { ListName: 'Body X Ray', Myfunction: get_Body_XRay_Drp_Data },
    { ListName: 'Skin Tone', Myfunction: get_Skin_Tone_Drp_Data },
    { ListName: 'Missing Person Relationship', Myfunction: get_Missing_Person_Relationship_Drp_Data },
    { ListName: 'Corrected Vision', Myfunction: get_Corrected_Vision_Drp_Data },
    { ListName: 'Fingerprinted', Myfunction: get_Fingerprinted_Drp_Data },
    { ListName: 'Blood Type', Myfunction: get_BloodType_Drp_Data },
    { ListName: 'Circumcision', Myfunction: get_Circumcision_Drp_Data },
    { ListName: 'Mode Of Training', Myfunction: getData_DropDown_ModeOfTraining },
    { ListName: 'Level Clearance', Myfunction: getData_DropDown_LevelClearance },
    { ListName: 'Training Category', Myfunction: getData_DropDown_TrainingCategory },
    { ListName: 'Training Course', Myfunction: getData_DropDown_TrainingCourse },






]  
import { Comman_changeArrayFormat, Comman_changeArrayFormat_With_Name, Comman_changeArrayFormatNarrativeType, CommanchangeArrayFormat_WithFilter, fourColArray, fourColArrayAlert, fourColwithExtraCode, sixColArray, sixColArrayArrest, sixColArrayArrest1, sixColArrayArrestee, threeColArray, threeColArrayWithCode } from '../../Components/Common/ChangeArrayFormat';
import { fetchData, fetchPostData } from '../../Components/hooks/Api';
import { ArrestJuvenileDis_DrpData, ArrestType_DrData, Arresting_DrpData, Agency_OfficerDrp_Data, Arrestee_Name_DrpData, Blood_Type_Drp_Data, BoatModel_Drp_Data, Body_Build_Drp_Data, Body_XRay_Drp_Data, Circumcision_Drp_Data, Circumstances_Drp_Data, City_Drp_Data, Color_Drp_Data, ComplexionType_Drp_Data, Contact_Type_Drp_Data, Corrected_Vision_Drp_Data, Country_Drp_Data, DL_State_DrpData, DL_States_Drp_Data, DrugManufactured_Drp_Data, Ever_DonatedBlood_Drp_Data, Face_Color_Drp_Data, FacialHair_Drp_Data, Facial_Hair_Type_Drp_Data, Facial_Oddity_Drp_Data, Fingerprinted_Drp_Data, Glasses_Type_Drp_Data, Hair_Length_Drp_Data, Hair_Shades_Drp_Data, Hair_Style_Drp_Data, HowVerify_Drp_Data, Make_Drp_Data, Marital_Drp_Data, Masters_Name_Drp_Data, Material_Drp_Data, MeasureType_Drp_Data, Message_Key_Drp_Data, Missing_CMC_Drp_Data, Missing_Person_Drp_Data, NameDistinct_Features_Drp_Data, Name_Handedness_Drp_Data, PropertySourceDrug_Drp_Data, PropertyType_Data, Property_LossCode_Drp_Data, Propulusion_Drp_Data, Resident_Drp_Data, Speach_Codes_Drp_Data, State_DrpData, States_Drp_Data, SuspectedDrug_Drp_Data, Teeth_Codes_Drp_Data, TypeMarijuana_Drp_Data, VOD_Drp_Data, WeaponMake_Drp_Data, WeaponModel_Drp_Data, get_Arresting_DrpData, Jwellery_Drp_Data, Vehicle_LossCode_Drp_Data, PlateID_Drp_Data, Classification_Drp_Data, StyleID_Drp_Data, MakeID_Drp_Data, ModalID_Drp_Data, VehicleColor_Drp_Data, VODID_Drp_Data, UCRClearID_Drp_Data, NIBRS_Drp_Data, ReceiveSource_Drp_Data, FBI_Codes_Drp_Data, CadCfsCode_Drp_Data, Rms_Disposition_Drp_Data, Cad_Disposition_Drp_Data, Narrative_Type_Drp_Data, PictureType_Drp_Data, ImageView_Type_Drp_Data, Top_Color_Drp_Data, Bottom_Color_Drp_Data, Eye_Color_Drp_Data, Hair_Color_Drp_Data, IsPrimary_Color_Drp_Data, IsSecondary_Color_Drp_Data, FISuspectActivity_Drp_Data, FIContactType_Drp_Data, Alert_Drp_Data, Arrestee_Vehicle_DrpData, Arrestee_NameMissing_DrpData, Possession_Owner_Name_Drp_Data, Mode_Of_Training_Drp_Data, Level_Clearance_Drp_Data, Training_Category_Drp_Data, Training_Course_Drp_Data, Skin_Tone_Drp_Data, Missing_Person_Relationship_Drp_Data, CaseTask_Drp_Data, SourceType_Drp_Data } from '../actionTypes';

import * as api from '../api'


export const get_AgencyOfficer_Data = (ID, IncID) => async (dispatch) => {
    // --------------------------old code change by Dinesh--------------------------------
    // const val = { AgencyID: ID, IncidentID: IncID ? IncID : 0 };
    const val = { AgencyID: ID, IncidentID: 0 };

    fetchPostData('DropDown/GetData_HeadOfAgency', val).then((data) => {
        if (data) {
            dispatch({ type: Agency_OfficerDrp_Data, payload: Comman_changeArrayFormat(data, 'PINID', 'HeadOfAgency') });
        } else {
            dispatch({ type: Agency_OfficerDrp_Data, payload: [] });
        }
    })
};

//----------------------------------------DropDownData-----------------------------------
export const get_DLStateDrpData = () => async (dispatch) => {
    fetchData('State_City_ZipCode/GetData_State').then((data) => {
        if (data) {
            dispatch({ type: DL_State_DrpData, payload: Comman_changeArrayFormat(data, "StateID", "State") });
        } else {
            dispatch({ type: DL_State_DrpData, payload: [] });
        }
    });
    // try {
    //     const data = await api.get_DLStateDrpData();
    //     const TextData = JSON.parse(data?.data?.data);
    //     const dataObj = TextData?.Table
    //     dispatch({ type: DL_State_DrpData, payload: Comman_changeArrayFormat(dataObj, "StateID", "State") });
    // } catch (error) {
    //     dispatch({ type: DL_State_DrpData, payload: [] });
    // }
};

export const get_State_Drp_Data = () => async (dispatch) => {
    fetchData('State_City_ZipCode/GetData_State').then((data) => {
        if (data) {
            dispatch({ type: State_DrpData, payload: Comman_changeArrayFormat(data, "StateID", "StateName") });
        } else {
            dispatch({ type: State_DrpData, payload: [] });
        }
    });
    // try {
    //     const data = await api.get_DLStateDrpData();
    //     const TextData = JSON.parse(data?.data?.data);
    //     const dataObj = TextData?.Table
    //     dispatch({ type: State_DrpData, payload: Comman_changeArrayFormat(dataObj, "StateID", 'StateName') });
    // } catch (error) {
    //     dispatch({ type: State_DrpData, payload: [] });
    // }
};

export const get_PropertyTypeData = (LoginAgencyID) => async (dispatch) => {
    const val = { AgencyID: LoginAgencyID }
    fetchPostData('PropertyCategory/GetDataDropDown_PropertyCategory', val).then((res) => {
        if (res) {
            const dataArr = res?.filter((val) => { if (val.PropertyCategoryCode !== "V") return val });
            dispatch({ type: PropertyType_Data, payload: threeColArray(dataArr, 'PropertyCategoryID', 'Description', 'PropertyCategoryCode') });
        } else {
            dispatch({ type: PropertyType_Data, payload: [] });
        }
    })
    // try {
    //     let res = await api.get_PropertyTypeData(val);
    //     let TextData = JSON.parse(res?.data?.data);
    //     let dataObj = TextData?.Table
    //     const dataArr = dataObj?.filter((val) => { if (val.PropertyCategoryCode !== "V") return val });
    //     dispatch({ type: PropertyType_Data, payload: threeColArray(dataArr, 'PropertyCategoryID', 'Description', 'PropertyCategoryCode') });
    // } catch {
    //     dispatch({ type: PropertyType_Data, payload: [] });
    // }
}

export const get_PropertyRoomTypeData = (LoginAgencyID) => async (dispatch) => {
    const val = { AgencyID: LoginAgencyID }
    fetchPostData('PropertyCategory/GetDataDropDown_PropertyCategory', val).then((res) => {
        if (res) {
            const dataArr = res?.filter((val) => { return val });
            dispatch({ type: PropertyType_Data, payload: threeColArray(dataArr, 'PropertyCategoryID', 'Description', 'PropertyCategoryCode') });
        } else {
            dispatch({ type: PropertyType_Data, payload: [] });
        }
    })
    // try {
    //     let res = await api.get_PropertyTypeData(val);
    //     let TextData = JSON.parse(res?.data?.data);
    //     let dataObj = TextData?.Table
    //     const dataArr = dataObj?.filter((val) => { return val });
    //     dispatch({ type: PropertyType_Data, payload: threeColArray(dataArr, 'PropertyCategoryID', 'Description', 'PropertyCategoryCode') });
    // } catch {
    //     dispatch({ type: PropertyType_Data, payload: [] });
    // }
}

// export const get_ArresteeName_Data = (openPage, MasterNameID, IncidentID, includeIsArrest = false , arrestID) => async (dispatch) => {
//     const val = {
//       'ArrestID' : arrestID , 'MasterNameID': '0', 'IncidentID': IncidentID, ...(includeIsArrest && { 'IsArrest': true })
//     };
//     const val1 = {
//       'ArrestID' : arrestID ,  'IncidentID': '0', 'MasterNameID': MasterNameID, ...(includeIsArrest && { 'IsArrest': true })
//     };
//     fetchPostData('Arrest/GetDataDropDown_Arrestee', openPage ? val1 : val).then((data) => {
//         if (data) {
//             dispatch({ type: Arrestee_Name_DrpData, payload: sixColArray(data, 'NameID', 'Arrestee_Name', 'LastName', 'DateOfBirth', 'Gendre_Description', 'Race_Description', 'NameID', 'MasterNameID') });
//         } else {
//             dispatch({ type: Arrestee_Name_DrpData, payload: sixColArray(data, 'NameID', 'Arrestee_Name', 'LastName', 'DateOfBirth', 'Gendre_Description', 'Race_Description', 'NameID', 'MasterNameID') });
//         }
//     })
// };

export const get_ArresteeName_Data = (openPage, MasterNameID, IncidentID, includeIsArrest = false, arrestID) => async (dispatch) => {
    const val = {
        'ArrestID': arrestID, 'MasterNameID': '0', 'IncidentID': IncidentID, ...(includeIsArrest && { 'IsArrest': true })
    };
    const val1 = {
        'ArrestID': arrestID, 'IncidentID': '0', 'MasterNameID': MasterNameID, ...(includeIsArrest && { 'IsArrest': true })
    };
    fetchPostData('Arrest/GetDataDropDown_Arrestee', openPage ? val1 : val).then((data) => {
        if (data) {

            dispatch({ type: Arrestee_Name_DrpData, payload: sixColArrayArrestee(data, 'NameID', 'Arrestee_Name', 'LastName', 'DateOfBirth', 'Gendre_Description', 'Race_Description', 'NameID', 'MasterNameID', 'AgeFrom', 'IsJuvenile', 'SexID', 'RaceID', 'AgeUnitID') });
        } else {
            dispatch({ type: Arrestee_Name_DrpData, payload: sixColArrayArrestee(data, 'NameID', 'Arrestee_Name', 'LastName', 'DateOfBirth', 'Gendre_Description', 'Race_Description', 'NameID', 'MasterNameID', 'AgeFrom', 'IsJuvenile', 'SexID', 'RaceID', 'AgeUnitID') });
        }
    })
};

// DS change

export const get_ArresteeNameMissingPerData = (openPage, MasterNameID, IncidentID) => async (dispatch) => {
    const val = { 'MasterNameID': '0', 'IncidentID': IncidentID, 'IsMissingPerson': true }
    const val1 = { 'IncidentID': '0', 'MasterNameID': MasterNameID, 'IsMissingPerson': true }
    fetchPostData('Arrest/GetDataDropDown_Arrestee', openPage ? val1 : val).then((data) => {
        if (data) {
            dispatch({ type: Arrestee_NameMissing_DrpData, payload: sixColArray(data, 'NameID', 'Arrestee_Name', 'LastName', 'DateOfBirth', 'Gendre_Description', 'Race_Description', 'NameID', 'MasterNameID') });
        } else {
            dispatch({ type: Arrestee_NameMissing_DrpData, payload: sixColArray(data, 'NameID', 'Arrestee_Name', 'LastName', 'DateOfBirth', 'Gendre_Description', 'Race_Description', 'NameID', 'MasterNameID') });
        }
    })
};

export const get_ArresteeNameVehicle = (openPage, MasterNameID, IncidentID) => async (dispatch) => {
    const val = { 'MasterNameID': '0', 'IncidentID': IncidentID, 'IsOwnerName': true }
    const val1 = { 'IncidentID': '0', 'MasterNameID': MasterNameID, 'IsOwnerName': true }
    fetchPostData('Arrest/GetDataDropDown_Arrestee', openPage ? val1 : val).then((data) => {
        if (data) {
            dispatch({ type: Arrestee_Vehicle_DrpData, payload: sixColArray(data, 'NameID', 'Arrestee_Name', 'LastName', 'DateOfBirth', 'Gendre_Description', 'Race_Description', 'NameID', 'MasterNameID') });
        } else {
            dispatch({ type: Arrestee_Vehicle_DrpData, payload: sixColArray(data, 'NameID', 'Arrestee_Name', 'LastName', 'DateOfBirth', 'Gendre_Description', 'Race_Description', 'NameID', 'MasterNameID') });
        }
    })
};

export const get_Masters_Name_Drp_Data = (possessionID, DecPropID, DecMPropID, IncidentID) => async (dispatch) => {
    const val = { 'NameID': possessionID, 'MasterPropertyID': DecMPropID, 'IsMaster': true, 'IncidentID': IncidentID }
    fetchPostData('Property/MasterProperty_ArresteeDropdown', val).then((data) => {
        if (data) {
            dispatch({ type: Masters_Name_Drp_Data, payload: sixColArray(data, 'NameID', 'Arrestee_Name', 'LastName', 'DateOfBirth', 'Gendre_Description', 'Race_Description', 'NameID', 'MasterNameID') });
        }
        else {
            dispatch({ type: Masters_Name_Drp_Data, payload: sixColArray(data, 'NameID', 'Arrestee_Name', 'LastName', 'DateOfBirth', 'Gendre_Description', 'Race_Description', 'NameID', 'MasterNameID') });
        }
    })
};

export const get_Masters_PossessionOwnerData = (possessionID, DecPropID, DecMPropID, IncidentID) => async (dispatch) => {
    const val = { 'NameID': possessionID, 'MasterPropertyID': DecMPropID, 'IsMaster': true, 'IncidentID': IncidentID }
    fetchPostData('Property/MasterProperty_ArresteeDropdown', val).then((data) => {
        if (data) {
            dispatch({ type: Possession_Owner_Name_Drp_Data, payload: sixColArray(data, 'NameID', 'Arrestee_Name', 'LastName', 'DateOfBirth', 'Gendre_Description', 'Race_Description', 'NameID', 'MasterNameID') });
        }
        else {
            dispatch({ type: Possession_Owner_Name_Drp_Data, payload: sixColArray(data, 'NameID', 'Arrestee_Name', 'LastName', 'DateOfBirth', 'Gendre_Description', 'Race_Description', 'NameID', 'MasterNameID') });
        }
    })
};


export const get_PropertyLossCode_Drp_Data = (LoginAgencyID, IsArticleReason, IsBoatReason, IsSecurityReason, IsOtherReason, IsDrugReason, IsGunReason) => async (dispatch) => {
    const val = {
        AgencyID: LoginAgencyID,
        IsArticleReason: IsArticleReason || 0,
        IsBoatReason: IsBoatReason || 0,
        IsSecurityReason: IsSecurityReason || 0,
        IsOtherReason: IsOtherReason || 0,
        IsDrugReason: IsDrugReason || 0,
        IsGunReason: IsGunReason || 0,
    }
    fetchPostData('PropertyReasonCode/GetDataDropDown_PropertyReasonCode', val).then((data) => {
        if (data) {
            // let arr = threeColArray(data, 'PropertyReasonCodeID', 'Description', 'PropertyReasonsCode')
            let arr = fourColwithExtraCode(data, 'PropertyReasonCodeID', 'Description', 'PropertyReasonsCode', 'PropRectype')
            let newArr = arr?.filter((value, index) => value?.id !== "PAWN" && value?.label !== "Pawned Property");
            dispatch({ type: Property_LossCode_Drp_Data, payload: newArr });
        } else {
            dispatch({ type: Property_LossCode_Drp_Data, payload: [] });
        }
    })
};

export const get_Color_Drp_Data = (LoginAgencyID) => async (dispatch) => {
    const val = { AgencyID: LoginAgencyID }
    fetchPostData('Property/GetDataDropDown_PropertyColor', val).then((data) => {
        if (data) {
            dispatch({ type: Color_Drp_Data, payload: Comman_changeArrayFormat(data, 'ColorID', 'ColorDescription') });
        } else {
            dispatch({ type: Color_Drp_Data, payload: [] });
        }
    })
}

export const get_Top_Color_Drp_Data = (LoginAgencyID) => async (dispatch) => {
    const val = { AgencyID: LoginAgencyID, IsHair: '0', IsEye: '0', IsTop: '1', IsBottom: '0', IsPrimary: '0', IsSecondary: '0', }
    fetchPostData('DropDown/GetData_DropDown_Color', val).then((data) => {
        if (data) {
            dispatch({ type: Top_Color_Drp_Data, payload: Comman_changeArrayFormat(data, 'ColorID', 'ColorDescription') });
        } else {
            dispatch({ type: Top_Color_Drp_Data, payload: [] });
        }
    })
}

export const get_Bottom_Color_Drp_Data = (LoginAgencyID) => async (dispatch) => {
    const val = { AgencyID: LoginAgencyID, IsHair: '0', IsEye: '0', IsTop: '0', IsBottom: '1', IsPrimary: '0', IsSecondary: '0', }
    fetchPostData('DropDown/GetData_DropDown_Color', val).then((data) => {
        if (data) {
            dispatch({ type: Bottom_Color_Drp_Data, payload: Comman_changeArrayFormat(data, 'ColorID', 'ColorDescription') });
        } else {
            dispatch({ type: Bottom_Color_Drp_Data, payload: [] });
        }
    })
}

export const get_Hair_Color_Drp_Data = (LoginAgencyID) => async (dispatch) => {
    const val = { AgencyID: LoginAgencyID, IsHair: '1', IsEye: '0', IsTop: '0', IsBottom: '0', IsPrimary: '0', IsSecondary: '0', }
    fetchPostData('DropDown/GetData_DropDown_Color', val).then((data) => {
        if (data) {
            dispatch({ type: Hair_Color_Drp_Data, payload: Comman_changeArrayFormat(data, 'ColorID', 'ColorDescription') });
        } else {
            dispatch({ type: Hair_Color_Drp_Data, payload: [] });
        }
    })
}

export const get_Eye_Color_Drp_Data = (LoginAgencyID) => async (dispatch) => {
    const val = { AgencyID: LoginAgencyID, IsHair: '0', IsEye: '1', IsTop: '0', IsBottom: '0', IsPrimary: '0', IsSecondary: '0', }
    fetchPostData('DropDown/GetData_DropDown_Color', val).then((data) => {
        if (data) {
            dispatch({ type: Eye_Color_Drp_Data, payload: Comman_changeArrayFormat(data, 'ColorID', 'ColorDescription') });
        } else {
            dispatch({ type: Eye_Color_Drp_Data, payload: [] });
        }
    })
}

export const get_IsPrimary_Color_Drp_Data = (LoginAgencyID) => async (dispatch) => {
    const val = { AgencyID: LoginAgencyID, IsHair: '0', IsEye: '0', IsTop: '0', IsBottom: '0', IsPrimary: '1', IsSecondary: '0', }
    fetchPostData('DropDown/GetData_DropDown_Color', val).then((data) => {
        if (data) {
            dispatch({ type: IsPrimary_Color_Drp_Data, payload: Comman_changeArrayFormat(data, 'ColorID', 'ColorDescription') });
        } else {
            dispatch({ type: IsPrimary_Color_Drp_Data, payload: [] });
        }
    })
}

export const get_IsSecondary_Color_Drp_Data = (LoginAgencyID) => async (dispatch) => {
    const val = { AgencyID: LoginAgencyID, IsHair: '0', IsEye: '0', IsTop: '0', IsBottom: '0', IsPrimary: '0', IsSecondary: '1', }
    fetchPostData('DropDown/GetData_DropDown_Color', val).then((data) => {
        if (data) {
            dispatch({ type: IsSecondary_Color_Drp_Data, payload: Comman_changeArrayFormat(data, 'ColorID', 'ColorDescription') });
        } else {
            dispatch({ type: IsSecondary_Color_Drp_Data, payload: [] });
        }
    })
}

export const get_Material_Drp_Data = (LoginAgencyID) => async (dispatch) => {
    const val = { AgencyID: LoginAgencyID }
    fetchPostData('PropertyBoatOHMaterial/GetDataDropDown_PropertyBoatOHMaterial', val).then((data) => {
        if (data) {
            dispatch({ type: Material_Drp_Data, payload: Comman_changeArrayFormat(data, 'PropertyBoatOHMaterialID', 'Description') });
        } else {
            dispatch({ type: Material_Drp_Data, payload: [] });
        }
    })
}

export const get_Make_Drp_Data = (LoginAgencyID) => async (dispatch) => {
    const val = { AgencyID: LoginAgencyID }
    fetchPostData('PropertyBoatMake/GetDataDropDown_PropertyBoatMake', val).then((data) => {
        if (data) {
            dispatch({ type: Make_Drp_Data, payload: Comman_changeArrayFormat(data, 'PropertyBoatMakeID', 'Description') });
        } else {
            dispatch({ type: Make_Drp_Data, payload: [] });
        }
    })
}

export const get_Propulusion_Drp_Data = (LoginAgencyID) => async (dispatch) => {
    const val = { AgencyID: LoginAgencyID }
    fetchPostData('PropertyBoatPropulsion/GetDataDropDown_PropertyBoatPropulsion', val).then((data) => {
        if (data) {
            dispatch({ type: Propulusion_Drp_Data, payload: Comman_changeArrayFormat(data, 'PropertyBoatPropulsionID', 'Description') });
        } else {
            dispatch({ type: Propulusion_Drp_Data, payload: [] });
        }
    })
}

export const get_WeaponMake_Drp_Data = (LoginAgencyID) => async (dispatch) => {
    const val = { AgencyID: LoginAgencyID }
    fetchPostData('PropertyGunMake/GetDataDropDown_PropertyGunMake', val).then((data) => {
        if (data) {
            dispatch({ type: WeaponMake_Drp_Data, payload: Comman_changeArrayFormat(data, 'PropertyGunMakeID', 'Description') });
        } else {
            dispatch({ type: WeaponMake_Drp_Data, payload: [] });
        }
    })
}

export const get_DrugManufactured_Drp_Data = (LoginAgencyID) => async (dispatch) => {
    const val = { AgencyID: LoginAgencyID }
    fetchPostData('DrugManufactured/GetDataDropDown_DrugManufactured', val).then((data) => {
        if (data) {
            dispatch({ type: DrugManufactured_Drp_Data, payload: Comman_changeArrayFormat(data, 'DrugManufacturedID', 'Description') });
        } else {
            dispatch({ type: DrugManufactured_Drp_Data, payload: [] });
        }
    })
}

export const get_TypeMarijuana_Drp_Data = (LoginAgencyID) => async (dispatch) => {
    const val = { AgencyID: LoginAgencyID }
    fetchPostData('MarijuanaType/GetDataDropDown_MarijuanaType', val).then((data) => {
        if (data) {
            dispatch({ type: TypeMarijuana_Drp_Data, payload: Comman_changeArrayFormat(data, 'MarijuanaTypeID', 'Description') });
        } else {
            dispatch({ type: TypeMarijuana_Drp_Data, payload: [] });
        }
    })
}

export const get_MeasureType_Drp_Data = (LoginAgencyID) => async (dispatch) => {
    const val = { AgencyID: LoginAgencyID }
    fetchPostData('PropertyDrugMeasure/GetDataDropDown_PropertyDrugMeasure', val).then((data) => {
        if (data) {
            dispatch({ type: MeasureType_Drp_Data, payload: threeColArray(data, 'PropertyDrugMeasureID', 'Description', 'PropertyDrugMeasureCode') });
        } else {
            dispatch({ type: MeasureType_Drp_Data, payload: [] });
        }
    })
}

export const get_SuspectedDrug_Drp_Data = (LoginAgencyID) => async (dispatch) => {
    const val = { AgencyID: LoginAgencyID }
    fetchPostData('PropertyDrugType/GetDataDropDown_PropertyDrugType', val).then((data) => {
        if (data) {
            dispatch({ type: SuspectedDrug_Drp_Data, payload: threeColArray(data, 'DrugTypeID', 'Description', 'DrugTypeCode') });
        } else {
            dispatch({ type: SuspectedDrug_Drp_Data, payload: [] });
        }
    })
}

export const get_WeaponModel_Drp_Data = (LoginAgencyID) => async (dispatch) => {
    const val = { AgencyID: LoginAgencyID }
    fetchPostData('PropertyGunModel/GetDataDropDown_PropertyGunModel', val).then((data) => {
        if (data) {
            dispatch({ type: WeaponModel_Drp_Data, payload: Comman_changeArrayFormat(data, 'PropertyGunModelID', 'Description') });
        } else {
            dispatch({ type: WeaponModel_Drp_Data, payload: [] });
        }
    })
}

export const get_BoatModel_Drp_Data = (LoginAgencyID) => async (dispatch) => {
    const val = { AgencyID: LoginAgencyID }
    fetchPostData('PropertyBoatModel/GetDataDropDown_PropertyBoatModel', val).then((data) => {
        if (data) {
            dispatch({ type: BoatModel_Drp_Data, payload: Comman_changeArrayFormat(data, 'PropertyBoatModelID', 'Description') });
        } else {
            dispatch({ type: BoatModel_Drp_Data, payload: [] });
        }
    })
}

export const get_VOD_Drp_Data = (LoginAgencyID) => async (dispatch) => {
    const val = { AgencyID: LoginAgencyID }
    fetchPostData('PropertyBoatVOD/GetDataDropDown_PropertyBoatVOD', val).then((data) => {
        if (data) {
            dispatch({ type: VOD_Drp_Data, payload: Comman_changeArrayFormat(data, 'PropertyBoatVODID', 'Description') });
        } else {
            dispatch({ type: VOD_Drp_Data, payload: [] });
        }
    })
}

export const get_PropSourceDrugDrpData = (LoginAgencyID) => async (dispatch) => {
    const val = { AgencyID: LoginAgencyID }
    fetchPostData('PropertySourceDrugType/GetDataDropDown_PropertySourceDrugType', val).then((data) => {
        if (data) {
            dispatch({ type: PropertySourceDrug_Drp_Data, payload: Comman_changeArrayFormat(data, 'SourceDrugTypeID', 'Description') });
        } else {
            dispatch({ type: PropertySourceDrug_Drp_Data, payload: [] });
        }
    })
}

export const get_CountryDrp_Data = (IsUSCitizen) => async (dispatch) => {
    const val = { 'IsUSCitizen': IsUSCitizen };
    fetchPostData('State_City_ZipCode/GetData_Country', val).then((data) => {
        if (data) {
            dispatch({ type: Country_Drp_Data, payload: Comman_changeArrayFormat_With_Name(data, "CountryID", "CountryName", "DLCountryID") });
        } else {
            dispatch({ type: Country_Drp_Data, payload: [] });
        }
    })
};

export const get_StatesDrp_Data = (CountryID) => async (dispatch) => {
    const val = { 'CountryID': CountryID };
    fetchPostData('NameCountry_State_City/GetData_NameState', val).then((data) => {
        if (data) {
            dispatch({ type: States_Drp_Data, payload: Comman_changeArrayFormat_With_Name(data, "StateID", "StateName", "DLStateID") });
        } else {
            dispatch({ type: States_Drp_Data, payload: [] });
        }
    })
};

export const get_DL_StatesDrp_Data = (CountryID) => async (dispatch) => {
    const val = { 'CountryID': CountryID };
    fetchPostData('NameCountry_State_City/GetData_NameState', val).then((data) => {
        if (data) {
            dispatch({ type: DL_States_Drp_Data, payload: Comman_changeArrayFormat_With_Name(data, "StateID", "StateName", "DLStateID") });
        } else {
            dispatch({ type: DL_States_Drp_Data, payload: [] });
        }
    })
};

export const get_CityDrp_Data = (StateID) => async (dispatch) => {
    const val = { 'StateID': StateID };
    fetchPostData('State_City_ZipCode/GetData_City', val).then((data) => {
        if (data) {
            dispatch({ type: City_Drp_Data, payload: Comman_changeArrayFormat_With_Name(data, "CityID", "CityName", "BICityID") });
        } else {
            dispatch({ type: City_Drp_Data, payload: [] });
        }
    })
};

export const get_How_Verify_Drp_Data = (loginAgencyID) => async (dispatch) => {
    const val = { 'AgencyID': loginAgencyID };
    fetchPostData('Verify/GetDataDropDown_Verify', val).then((data) => {
        if (data) {
            dispatch({ type: HowVerify_Drp_Data, payload: Comman_changeArrayFormat_With_Name(data, "VerifyID", "Description", "DLVerifyID") });
        } else {
            dispatch({ type: HowVerify_Drp_Data, payload: [] });
        }
    })
};

export const get_Residents_Drp_Data = (loginAgencyID) => async (dispatch) => {
    const val = { 'AgencyID': loginAgencyID };
    fetchPostData('Resident/GetDataDropDown_Resident', val).then((data) => {
        if (data) {
            dispatch({ type: Resident_Drp_Data, payload: Comman_changeArrayFormat_With_Name(data, "ResidentID", "Description", "ResidentID") });
        } else {
            dispatch({ type: Resident_Drp_Data, payload: [] });
        }
    })
};

export const get_Marital_Drp_Data = (loginAgencyID) => async (dispatch) => {
    const val = { 'AgencyID': loginAgencyID };
    fetchPostData('MaritalStatus/GetDataDropDown_MaritalStatus', val).then((data) => {
        if (data) {
            dispatch({ type: Marital_Drp_Data, payload: Comman_changeArrayFormat_With_Name(data, "MaritalStatusID", "Description", "MaritalStatusID") });
        } else {
            dispatch({ type: Marital_Drp_Data, payload: [] });
        }
    })
};

export const get_Face_Color_Drp_Data = (loginAgencyID) => async (dispatch) => {
    const val = { 'AgencyID': loginAgencyID };
    fetchPostData('FacialShape/GetDataDropDown_FacialShape', val).then((data) => {
        if (data) {
            dispatch({ type: Face_Color_Drp_Data, payload: Comman_changeArrayFormat_With_Name(data, "FacialShapeID", "Description", "FaceShapeID") });
        } else {
            dispatch({ type: Face_Color_Drp_Data, payload: [] });
        }
    })
};

export const get_ComplexionType_Drp_Data = (loginAgencyID) => async (dispatch) => {
    const val = { 'AgencyID': loginAgencyID };
    fetchPostData('ComplexionType/GetDataDropDown_ComplexionType', val).then((data) => {
        if (data) {
            dispatch({ type: ComplexionType_Drp_Data, payload: Comman_changeArrayFormat_With_Name(data, "ComplexionID", "Description", "ComplexionID") });
        } else {
            dispatch({ type: ComplexionType_Drp_Data, payload: [] });
        }
    })
};

export const get_Hair_Style_Drp_Data = (loginAgencyID) => async (dispatch) => {
    const val = { 'AgencyID': loginAgencyID };
    fetchPostData('HairStyles/GetDataDropDown_HairStyles', val).then((data) => {
        if (data) {
            dispatch({ type: Hair_Style_Drp_Data, payload: Comman_changeArrayFormat_With_Name(data, "HairStyleID", "Description", 'HairStyleID') });
        } else {
            dispatch({ type: Hair_Style_Drp_Data, payload: [] });
        }
    })
};

export const get_Facial_Hair_Type_Drp_Data = (loginAgencyID) => async (dispatch) => {
    const val = { 'AgencyID': loginAgencyID };
    fetchPostData('NameFacialHair/GetDataDropDown_NameFacialHair', val).then((data) => {
        if (data) {
            dispatch({ type: Facial_Hair_Type_Drp_Data, payload: Comman_changeArrayFormat_With_Name(data, "NameFacialHairID", "Description", "FacialHairID1") });
        } else {
            dispatch({ type: Facial_Hair_Type_Drp_Data, payload: [] });
        }
    })
};

export const get_NameDistinct_Features_Drp_Data = (loginAgencyID) => async (dispatch) => {
    const val = { 'AgencyID': loginAgencyID };
    fetchPostData('NameDistinctFeaturesCode/GetDataDropDown_NameDistinctFeaturesCode', val).then((data) => {
        if (data) {
            dispatch({ type: NameDistinct_Features_Drp_Data, payload: Comman_changeArrayFormat_With_Name(data, "NameDistinctFeaturesCodeID", "Description", 'DistinctFeatureID1') });
        } else {
            dispatch({ type: NameDistinct_Features_Drp_Data, payload: [] });
        }
    })
};

export const get_Hair_Length_Drp_Data = (loginAgencyID) => async (dispatch) => {
    const val = { 'AgencyID': loginAgencyID };
    fetchPostData('HairLength/GetDataDropDown_HairLength', val).then((data) => {
        if (data) {
            dispatch({ type: Hair_Length_Drp_Data, payload: Comman_changeArrayFormat_With_Name(data, "HairLengthID", "Description", 'HairLengthID') });
        } else {
            dispatch({ type: Hair_Length_Drp_Data, payload: [] });
        }
    })
};

export const get_FacialHair_Drp_Data = (loginAgencyID) => async (dispatch) => {
    const val = { 'AgencyID': loginAgencyID };
    fetchPostData('NameFacialHair/GetDataDropDown_NameFacialHair', val).then((data) => {
        if (data) {
            dispatch({ type: FacialHair_Drp_Data, payload: Comman_changeArrayFormat_With_Name(data, "NameFacialHairID", "Description", 'FacialHairID2') });
        } else {
            dispatch({ type: FacialHair_Drp_Data, payload: [] });
        }
    })
};

export const get_Hair_Shades_Drp_Data = (loginAgencyID) => async (dispatch) => {
    const val = { 'AgencyID': loginAgencyID };
    fetchPostData('HairShades/GetDataDropDown_HairShades', val).then((data) => {
        if (data) {
            dispatch({ type: Hair_Shades_Drp_Data, payload: Comman_changeArrayFormat_With_Name(data, "HairShadeID", "Description", 'HairShadeID') });
        } else {
            dispatch({ type: Hair_Shades_Drp_Data, payload: [] });
        }
    })
};

export const get_Facial_Oddity_Drp_Data = (loginAgencyID) => async (dispatch) => {
    const val = { 'AgencyID': loginAgencyID };
    fetchPostData('FacialOddity/GetDataDropDown_FacialOddity', val).then((data) => {
        if (data) {
            dispatch({ type: Facial_Oddity_Drp_Data, payload: Comman_changeArrayFormat_With_Name(data, "OddityID", "Description", 'FacialOddityID1') });
        } else {
            dispatch({ type: Facial_Oddity_Drp_Data, payload: [] });
        }
    })
};

export const get_Body_Build_Drp_Data = (loginAgencyID) => async (dispatch) => {
    const val = { 'AgencyID': loginAgencyID };
    fetchPostData('BodyBuild/GetDataDropDown_BodyBuild', val).then((data) => {
        if (data) {
            dispatch({ type: Body_Build_Drp_Data, payload: Comman_changeArrayFormat_With_Name(data, "BodyBuildID", "Description", 'BodyBuildID') });
        } else {
            dispatch({ type: Body_Build_Drp_Data, payload: [] });
        }
    })
};

export const get_Speach_Codes_Drp_Data = (loginAgencyID) => async (dispatch) => {
    const val = { 'AgencyID': loginAgencyID };
    fetchPostData('SpeechCodes/GetDataDropDown_SpeechCodes', val).then((data) => {
        if (data) {
            dispatch({ type: Speach_Codes_Drp_Data, payload: Comman_changeArrayFormat_With_Name(data, "SpeechID", "Description", 'SpeechID') });
        } else {
            dispatch({ type: Speach_Codes_Drp_Data, payload: [] });
        }
    })
};

export const get_Teeth_Codes_Drp_Data = (loginAgencyID) => async (dispatch) => {
    const val = { 'AgencyID': loginAgencyID };
    fetchPostData('TeethCodes/GetDataDropDown_TeethCodes', val).then((data) => {
        if (data) {
            dispatch({ type: Teeth_Codes_Drp_Data, payload: Comman_changeArrayFormat_With_Name(data, "TeethID", "Description", 'TeethID') });
        } else {
            dispatch({ type: Teeth_Codes_Drp_Data, payload: [] });
        }
    })
};

export const get_Glasses_Type_Drp_Data = (loginAgencyID) => async (dispatch) => {
    const val = { 'AgencyID': loginAgencyID };
    fetchPostData('NameGlassesTypes/GetDataDropDown_NameGlassesTypes', val).then((data) => {
        if (data) {
            dispatch({ type: Glasses_Type_Drp_Data, payload: Comman_changeArrayFormat_With_Name(data, "NameGlassesTypeID", "Description", 'GlassesID') });
        } else {
            dispatch({ type: Glasses_Type_Drp_Data, payload: [] });
        }
    })
};

export const get_Name_Handedness_Drp_Data = (loginAgencyID) => async (dispatch) => {
    const val = { 'AgencyID': loginAgencyID };
    fetchPostData('Handedness/GetDataDropDown_Handedness', val).then((data) => {
        if (data) {
            dispatch({ type: Name_Handedness_Drp_Data, payload: Comman_changeArrayFormat_With_Name(data, "HandedID", "Description", 'HandednessID') });
        } else {
            dispatch({ type: Name_Handedness_Drp_Data, payload: [] });
        }
    })
};

export const get_Contact_Type_Drp_Data = (loginAgencyID, IsEMail, IsPhone) => async (dispatch) => {
    const val = { 'AgencyID': loginAgencyID, 'IsEMail': IsEMail, 'IsPhone': IsPhone, }
    fetchPostData('ContactPhoneType/GetDataDropDown_ContactPhoneType', val).then((data) => {
        if (data) {
            dispatch({ type: Contact_Type_Drp_Data, payload: threeColArray(data, 'ContactPhoneTypeID', 'Description', 'ContactPhoneTypeCode') });
        } else {
            dispatch({ type: Contact_Type_Drp_Data, payload: [] });
        }
    })
};

export const get_Message_Key_Drp_Data = (LoginAgencyID) => async (dispatch) => {
    const val = { AgencyID: LoginAgencyID }
    fetchPostData('MessageKey/GetDataDropDown_MessageKey', val).then((data) => {
        if (data) {
            dispatch({ type: Message_Key_Drp_Data, payload: Comman_changeArrayFormat(data, 'MessageKeyID', 'Description', 'MessageKeyCode') });
        } else {
            dispatch({ type: Message_Key_Drp_Data, payload: [] });
        }
    })
}

export const get_Missing_Person_Drp_Data = (LoginAgencyID) => async (dispatch) => {
    const val = { AgencyID: LoginAgencyID }
    fetchPostData('MissingPersonlist/GetDataDropDown_MissingPersonlist', val).then((data) => {
        if (data) {
            dispatch({ type: Missing_Person_Drp_Data, payload: Comman_changeArrayFormat(data, 'MissingPersonID', 'Description', 'MissingPersonCode') });
        } else {
            dispatch({ type: Missing_Person_Drp_Data, payload: [] });
        }
    })
}

export const get_Missing_CMC_Drp_Data = (LoginAgencyID) => async (dispatch) => {
    const val = { AgencyID: LoginAgencyID }
    fetchPostData('MissingCMC/GetDataDropDown_MissingCMC', val).then((data) => {

        if (data) {
            dispatch({ type: Missing_CMC_Drp_Data, payload: Comman_changeArrayFormat(data, 'MissingCMCID', 'Description', 'MissingCMCCode') });
        } else {
            dispatch({ type: Missing_CMC_Drp_Data, payload: [] });
        }
    })
}

export const get_Ever_DonatedBlood_Drp_Data = (LoginAgencyID) => async (dispatch) => {
    const val = { AgencyID: LoginAgencyID }
    fetchPostData('EverDonatedBlood/GetDataDropDown_EverDonatedBlood', val).then((data) => {

        if (data) {
            dispatch({ type: Ever_DonatedBlood_Drp_Data, payload: Comman_changeArrayFormat(data, 'EverDonatedBloodID', 'Description', 'EverDonatedBloodCode') });
        } else {
            dispatch({ type: Ever_DonatedBlood_Drp_Data, payload: [] });
        }
    })
}

export const get_Circumstances_Drp_Data = (LoginAgencyID) => async (dispatch) => {
    const val = { AgencyID: LoginAgencyID }
    fetchPostData('Circumstances/GetDataDropDown_Circumstances', val).then((data) => {

        if (data) {
            dispatch({ type: Circumstances_Drp_Data, payload: Comman_changeArrayFormat(data, 'CircumstancesID', 'Description', 'CircumstancesCode') });
        } else {
            dispatch({ type: Circumstances_Drp_Data, payload: [] });
        }
    })
}

export const get_Body_XRay_Drp_Data = (LoginAgencyID) => async (dispatch) => {
    const val = { AgencyID: LoginAgencyID }
    fetchPostData('BodyXRay/GetDataDropDown_BodyXRay', val).then((data) => {

        if (data) {
            dispatch({ type: Body_XRay_Drp_Data, payload: Comman_changeArrayFormat(data, 'BodyXRayID', 'Description', 'BodyXRayCode') });
        } else {
            dispatch({ type: Body_XRay_Drp_Data, payload: [] });
        }
    })
}
export const get_Skin_Tone_Drp_Data = (LoginAgencyID) => async (dispatch) => {
    const val = { AgencyID: LoginAgencyID }
    fetchPostData('TableManagement/GetDataDropDown_SkinTone', val).then((data) => {

        if (data) {
            dispatch({ type: Skin_Tone_Drp_Data, payload: Comman_changeArrayFormat(data, 'SkinID', 'Description', 'SkinCode') });
        } else {
            dispatch({ type: Skin_Tone_Drp_Data, payload: [] });
        }
    })
}
export const get_Missing_Person_Relationship_Drp_Data = (LoginAgencyID) => async (dispatch) => {
    const val = { AgencyID: LoginAgencyID }
    fetchPostData('Relationship/GetDataDropDown_Relationship', val).then((data) => {
        if (data) {
            dispatch({ type: Missing_Person_Relationship_Drp_Data, payload: Comman_changeArrayFormat(data, 'RelationshipID', 'Description', 'RelationshipCode') });
        } else {
            dispatch({ type: Missing_Person_Relationship_Drp_Data, payload: [] });
        }
    })
}

export const get_Corrected_Vision_Drp_Data = (LoginAgencyID) => async (dispatch) => {
    const val = { AgencyID: LoginAgencyID }
    fetchPostData('CorrectedVision/GetDataDropDown_CorrectedVision', val).then((data) => {

        if (data) {
            dispatch({ type: Corrected_Vision_Drp_Data, payload: Comman_changeArrayFormat(data, 'CorrectedVisionID', 'Description', 'CorrectedVisionCode') });
        } else {
            dispatch({ type: Corrected_Vision_Drp_Data, payload: [] });
        }
    })
}

export const get_Fingerprinted_Drp_Data = (LoginAgencyID) => async (dispatch) => {
    const val = { AgencyID: LoginAgencyID }
    fetchPostData('Fingerprinted/GetDataDropDown_Fingerprinted', val).then((data) => {

        if (data) {
            dispatch({ type: Fingerprinted_Drp_Data, payload: Comman_changeArrayFormat(data, 'FingerprintedID', 'Description', 'FingerprintedCode') });
        } else {
            dispatch({ type: Fingerprinted_Drp_Data, payload: [] });
        }
    })
}

export const get_BloodType_Drp_Data = (LoginAgencyID) => async (dispatch) => {
    const val = { AgencyID: LoginAgencyID }
    fetchPostData('DropDown/GetData_DropDown_BloodType', val).then((data) => {

        if (data) {
            dispatch({ type: Blood_Type_Drp_Data, payload: Comman_changeArrayFormat(data, 'BloodTypeID', 'BloodtypeDescription') });
        } else {
            dispatch({ type: Blood_Type_Drp_Data, payload: [] });
        }
    })
}

export const get_Circumcision_Drp_Data = (LoginAgencyID) => async (dispatch) => {
    const val = { AgencyID: LoginAgencyID }
    fetchPostData('Circumcision/GetDataDropDown_Circumcision', val).then((data) => {
        if (data) {
            dispatch({ type: Circumcision_Drp_Data, payload: Comman_changeArrayFormat(data, 'CircumcisionID', 'Description', 'CircumcisionCode') });
        } else {
            dispatch({ type: Circumcision_Drp_Data, payload: [] });
        }
    })
}

export const getData_DropDown_ModeOfTraining = (LoginAgencyID) => async (dispatch) => {
    const val = { AgencyID: LoginAgencyID }
    fetchPostData('CAD/MasterModeOfTraining/GetData_DropDown_ModeOfTraining', val).then((data) => {
        if (data) {
            dispatch({ type: Mode_Of_Training_Drp_Data, payload: Comman_changeArrayFormat(data, 'ModeOfTrainingID', 'BloodtypeDescription', 'ModeOfTrainingCode') });
        } else {
            dispatch({ type: Mode_Of_Training_Drp_Data, payload: [] });
        }
    })
}

export const getData_DropDown_LevelClearance = (LoginAgencyID) => async (dispatch) => {
    const val = { AgencyID: LoginAgencyID }
    fetchPostData('CAD/MasterLevelClearance/GetData_DropDown_LevelClearance', val).then((data) => {
        if (data) {
            dispatch({ type: Level_Clearance_Drp_Data, payload: Comman_changeArrayFormat(data, 'LevelClearanceID', 'BloodtypeDescription', 'LevelClearanceCode') });
        } else {
            dispatch({ type: Level_Clearance_Drp_Data, payload: [] });
        }
    })
}

export const getData_DropDown_TrainingCategory = (LoginAgencyID) => async (dispatch) => {
    const val = { AgencyID: LoginAgencyID }
    fetchPostData('CAD/MasterTrainingCategory/GetData_DropDown_TrainingCategory', val).then((data) => {
        if (data) {
            dispatch({ type: Training_Category_Drp_Data, payload: Comman_changeArrayFormat(data, 'TrainingCategoryID', 'TrainingCategoryDescription', 'TrainingCategoryCode') });
        } else {
            dispatch({ type: Training_Category_Drp_Data, payload: [] });
        }
    })
}

export const getData_DropDown_TrainingCourse = (LoginAgencyID) => async (dispatch) => {
    const val = { AgencyID: LoginAgencyID }
    fetchPostData('CAD/MasterTrainingCourse/GetData_DropDown_TrainingCourse', val).then((data) => {
        if (data) {
            dispatch({ type: Training_Course_Drp_Data, payload: Comman_changeArrayFormat(data, 'TrainingCourseID', 'BloodtypeDescription', 'TrainingCourseCode') });
        } else {
            dispatch({ type: Training_Course_Drp_Data, payload: [] });
        }
    })
}

export const get_Jwellery_Drp_Data = (LoginAgencyID) => async (dispatch) => {
    const val = { AgencyID: LoginAgencyID }
    fetchPostData('Jewellery/GetDataDropDown_Jewellery', val).then((data) => {
        if (data) {
            dispatch({ type: Jwellery_Drp_Data, payload: Comman_changeArrayFormat(data, 'JewelleryID', 'Description', 'JewelleryCode') });
        } else {
            dispatch({ type: Jwellery_Drp_Data, payload: [] });
        }
    })
}

export const get_Incident_Drp_Data = (LoginAgencyID) => async (dispatch) => {
    const val = { AgencyID: LoginAgencyID }
    fetchPostData('Incident/GetIncidentDropDown', val).then((data) => {
        if (data) {
            dispatch({ type: ReceiveSource_Drp_Data, payload: Comman_changeArrayFormat(data[0]?.Reported, 'ReceiveSourceID', 'ReceiveSourceCode') });
            dispatch({ type: FBI_Codes_Drp_Data, payload: threeColArrayWithCode(data[0]?.FBICode, 'FBIID', 'Description', 'FederalSpecificFBICode') });
            dispatch({ type: CadCfsCode_Drp_Data, payload: Comman_changeArrayFormat(data[0]?.CADCFSCODE, 'CADCFSCodeID', 'CADCFSCode') });
            dispatch({ type: Rms_Disposition_Drp_Data, payload: threeColArray(data[0]?.RMSDisposition, 'RMSDispositionId', 'RMSDispositionCode', 'DispositionCode') });
            dispatch({ type: Cad_Disposition_Drp_Data, payload: Comman_changeArrayFormat(data[0]?.CADDisposition, 'CADDispositionId', 'CADDispositionCode') });
        } else {
            dispatch({ type: ReceiveSource_Drp_Data, payload: [] });
            dispatch({ type: FBI_Codes_Drp_Data, payload: [] });
            dispatch({ type: CadCfsCode_Drp_Data, payload: [] });
            dispatch({ type: Rms_Disposition_Drp_Data, payload: [] });
            dispatch({ type: Cad_Disposition_Drp_Data, payload: [] });
        }
    })
}

export const get_ReceiveSource_Drp_Data = (LoginAgencyID) => async (dispatch) => {
    // const val = { AgencyID: LoginAgencyID }
    // fetchPostData('Incident/GetData_ReceiveSource', val).then((data) => {
    //     if (data) {
    //         dispatch({ type: ReceiveSource_Drp_Data, payload: Comman_changeArrayFormat(data, 'ReceiveSourceID', 'ReceiveSourceCode') });
    //     } else {
    //         dispatch({ type: ReceiveSource_Drp_Data, payload: [] });
    //     }
    // })
}

export const get_FBI_Codes_Drp_Data = (LoginAgencyID) => async (dispatch) => {
    // const val = { AgencyID: LoginAgencyID }
    // fetchPostData('FBICodes/GetDataDropDown_FBICodes', val).then((data) => {
    //     if (data) {
    //         dispatch({ type: FBI_Codes_Drp_Data, payload: threeColArrayWithCode(data, 'FBIID', 'Description', 'FederalSpecificFBICode') });
    //     } else {
    //         dispatch({ type: FBI_Codes_Drp_Data, payload: [] });
    //     }
    // })
}

export const get_CadCfsCode_Drp_Data = (LoginAgencyID) => async (dispatch) => {
    // const val = { AgencyID: LoginAgencyID }
    // fetchPostData('Incident/GetData_CADCFSCODE', val).then((data) => {
    //     if (data) {
    //         dispatch({ type: CadCfsCode_Drp_Data, payload: Comman_changeArrayFormat(data, 'CADCFSCodeID', 'CADCFSCode') });
    //     } else {
    //         dispatch({ type: CadCfsCode_Drp_Data, payload: [] });
    //     }
    // })
}

export const get_Rms_Disposition_Drp_Data = (LoginAgencyID) => async (dispatch) => {
    // const val = { AgencyID: LoginAgencyID }
    // fetchPostData('Incident/GetData_RMSDisposition', val).then((data) => {
    //     if (data) {
    //         dispatch({ type: Rms_Disposition_Drp_Data, payload: threeColArray(data, 'RMSDispositionId', 'RMSDispositionCode', 'DispositionCode') });
    //     } else {
    //         dispatch({ type: Rms_Disposition_Drp_Data, payload: [] });
    //     }
    // })
}

export const get_Cad_Disposition_Drp_Data = (LoginAgencyID) => async (dispatch) => {
    // const val = { AgencyID: LoginAgencyID }
    // fetchPostData('Incident/GetData_CADDisposition', val).then((data) => {
    //     if (data) {
    //         dispatch({ type: Cad_Disposition_Drp_Data, payload: Comman_changeArrayFormat(data, 'CADDispositionId', 'CADDispositionCode') });
    //     } else {
    //         dispatch({ type: Cad_Disposition_Drp_Data, payload: [] });
    //     }
    // })
}

export const get_Narrative_Type_Drp_Data = (LoginAgencyID) => async (dispatch) => {
    const val = { AgencyID: LoginAgencyID }
    fetchPostData('NarrativeType/GetDataDropDown_NarrativeType', val).then((data) => {
        if (data) {
            dispatch({ type: Narrative_Type_Drp_Data, payload: Comman_changeArrayFormatNarrativeType(data, 'NarrativeTypeID', 'Description', 'NarrativeTypeCode') });
        } else {
            dispatch({ type: Narrative_Type_Drp_Data, payload: [] });
        }
    })
}


export const getData_DropDown_CaseTask = (LoginAgencyID) => async (dispatch) => {
    const val = { AgencyID: LoginAgencyID }
    fetchPostData('CaseTask/GetDataDropDown_CaseTask', val).then((data) => {
        if (data) {
            dispatch({ type: CaseTask_Drp_Data, payload: data });
        } else {
            dispatch({ type: CaseTask_Drp_Data, payload: [] });
        }
    })
}

export const getData_DropDown_SourceType = (LoginAgencyID) => async (dispatch) => {
    const val = { AgencyID: LoginAgencyID }
    fetchPostData('CaseManagement/GetDataDropDown_SourceType', val).then((data) => {
        if (data) {
            dispatch({ type: SourceType_Drp_Data, payload: data });
        } else {
            dispatch({ type: SourceType_Drp_Data, payload: [] });
        }
    })
}


















///-----------------------------------ArrestHome--------------------------------------------------
export const get_ArrestType_Drp = (loginAgencyID) => async (dispatch) => {
    const val = { 'AgencyID': loginAgencyID }
    fetchPostData('ArrestType/GetDataDropDown_ArrestType', val).then((data) => {
        if (data) {
            dispatch({ type: ArrestType_DrData, payload: Comman_changeArrayFormat(data, 'ArrestTypeID', 'Description') });
        } else {
            dispatch({ type: ArrestType_DrData, payload: [] });
        }
    })
};

export const get_Arresting_DropDown = (loginAgencyID, loginPinID) => async (dispatch) => {
    const val = { 'AgencyID': loginAgencyID, 'PINID': loginPinID }
    fetchPostData('Agency/GetData_Agency', val).then((data) => {
        if (data) {
            dispatch({ type: Arresting_DrpData, payload: Comman_changeArrayFormat(data, 'AgencyID', 'Agency_Name') });
        } else {
            dispatch({ type: Arresting_DrpData, payload: [] });
        }
    })
};

export const get_ArrestJuvenileDis_DrpData = (loginAgencyID) => async (dispatch) => {
    const val = { AgencyID: loginAgencyID, }
    fetchPostData('ArrestJuvenileDisposition/GetDataDropDown_ArrestJuvenileDisposition', val).then((data) => {
        if (data) {
            dispatch({ type: ArrestJuvenileDis_DrpData, payload: Comman_changeArrayFormat(data, 'ArrestJuvenileDispositionID', 'Description') });
        } else {
            dispatch({ type: ArrestJuvenileDis_DrpData, payload: [] });
        }
    })
};

export const get_UcrClear_Drp_Data = (loginAgencyID) => async (dispatch) => {
    const val = { AgencyID: loginAgencyID, }
    fetchPostData('UCRClear/GetDataDropDown_UCRClear', val).then((data) => {
        if (data) {
            dispatch({ type: UCRClearID_Drp_Data, payload: Comman_changeArrayFormat(data, 'UCRClearID', 'Description') });
        } else {
            dispatch({ type: UCRClearID_Drp_Data, payload: [] });
        }
    })
};

export const get_NIBRS_Drp_Data = (loginAgencyID) => async (dispatch) => {
    const val = { AgencyID: loginAgencyID, }
    fetchPostData('FBICodes/GetDataDropdown_ArrestFBICode', val).then((data) => {
        if (data) {
            dispatch({ type: NIBRS_Drp_Data, payload: threeColArrayWithCode(data, 'FBIID', 'Description', 'FederalSpecificFBICode') });
        } else {
            dispatch({ type: NIBRS_Drp_Data, payload: [] });
        }
    })
};





















//------------------------------------------------------------Vehicle DrpDwn Data-----------------------------------------------------------------

export const get_Data_VODID_Drp_Data = (LoginAgencyID) => async (dispatch) => {
    const val = { AgencyID: LoginAgencyID }
    fetchPostData('VehicleVOD/GetDataDropDown_VehicleVOD', val).then((data) => {
        if (data) {
            dispatch({ type: VODID_Drp_Data, payload: Comman_changeArrayFormat(data, 'VehicleVODID', 'Description') });
        } else {
            dispatch({ type: VODID_Drp_Data, payload: [] });
        }
    })
}

export const get_Vehicle_Color_Drp_Data = (LoginAgencyID) => async (dispatch) => {
    const val = { AgencyID: LoginAgencyID }
    fetchPostData('PropertyVehicle/GetDataDropDown_Color', val).then((data) => {
        if (data) {
            dispatch({ type: VehicleColor_Drp_Data, payload: Comman_changeArrayFormat(data, 'ColorID', 'ColorDescription') });
        } else {
            dispatch({ type: VehicleColor_Drp_Data, payload: [] });
        }
    })
}

export const get_ModalId_Drp_Data = (LoginAgencyID, PropertyVehicleMakeID) => async (dispatch) => {
    const val = { AgencyID: LoginAgencyID, 'PropertyVehicleMakeID': PropertyVehicleMakeID }
    fetchPostData('PropertyVehicleModel/GetDataDropDown_PropertyVehicleModel', val).then((data) => {
        if (data) {
            dispatch({ type: ModalID_Drp_Data, payload: Comman_changeArrayFormat(data, 'PropertyVehicleModelID', 'Description') });
        } else {
            dispatch({ type: ModalID_Drp_Data, payload: [] });
        }
    })
}

export const get_MakeId_Drp_Data = (LoginAgencyID, CategoryID) => async (dispatch) => {
    const val = { AgencyID: LoginAgencyID, PropertyDescID: CategoryID }
    fetchPostData('PropertyVehicleMake/GetDataDropDown_PropertyVehicleMake', val).then((data) => {
        if (data) {
            dispatch({ type: MakeID_Drp_Data, payload: Comman_changeArrayFormat(data, 'PropertyVehicleMakeID', 'Description') });
        } else {
            dispatch({ type: MakeID_Drp_Data, payload: [] });
        }
    })
}

export const get_StyleId_Drp_Data = (LoginAgencyID, CategoryID) => async (dispatch) => {
    const val = { AgencyID: LoginAgencyID, PropertyDescID: CategoryID }
    fetchPostData('PropertyVehicleStyle/GetDataDropDown_PropertyVehicleStyle', val).then((data) => {
        if (data) {
            dispatch({ type: StyleID_Drp_Data, payload: Comman_changeArrayFormat(data, 'VehicleStyleID', 'Description') });
        } else {
            dispatch({ type: StyleID_Drp_Data, payload: [] });
        }
    })
}

export const get_Classification_Drp_Data = (PropertyDescID) => async (dispatch) => {
    const val = { PropertyDescID: PropertyDescID, }
    fetchPostData('Property/GetDataDropDown_PropertyClassification', val).then((data) => {
        if (data) {
            dispatch({ type: Classification_Drp_Data, payload: Comman_changeArrayFormat(data, 'PropertyClassificationID', 'Description') });
        } else {
            dispatch({ type: Classification_Drp_Data, payload: [] });
        }
    })
}

export const get_PlateType_Drp_Data = (LoginAgencyID) => async (dispatch) => {
    const val = { AgencyID: LoginAgencyID }
    fetchPostData('PropertyVehiclePlateType/GetDataDropDown_PropertyVehiclePlateType', val).then((data) => {
        if (data) {
            // console.log("🚀 ~ fetchPostData ~ data:", data);
            dispatch({ type: PlateID_Drp_Data, payload: threeColArray(data, 'PlateTypeID', 'Description', 'PlateTypeCode') });
        } else {
            dispatch({ type: PlateID_Drp_Data, payload: [] });
        }
    })
}

export const get_VehicleLossCode_Drp_Data = (LoginAgencyID) => async (dispatch) => {
    const val = {
        AgencyID: LoginAgencyID
    }
    fetchPostData('PropertyVehicle/GetDataDropDown_PropertyVehiclePropertyReasonCode', val).then((data) => {
        if (data) {
            let arr = threeColArray(data, 'PropertyReasonCodeID', 'Description', 'PropertyReasonsCode')
            let newArr = arr?.filter((value, index) => value?.id !== "PAWN" && value?.label !== "Pawned Property");
            dispatch({ type: Vehicle_LossCode_Drp_Data, payload: newArr });
        } else {
            dispatch({ type: Vehicle_LossCode_Drp_Data, payload: [] });
        }
    })
};




export const get_PictureType_Drp_Data = (LoginAgencyID) => async (dispatch) => {
    const val = { AgencyID: LoginAgencyID }
    fetchPostData('PictureType/GetDataDropDown_PictureType', val).then((data) => {
        if (data) {
            dispatch({ type: PictureType_Drp_Data, payload: Comman_changeArrayFormat(data, 'PictureTypeID', 'Description') });
        } else {
            dispatch({ type: PictureType_Drp_Data, payload: [] });
        }
    })
}

export const get_PictureView_Type_Drp_Data = (LoginAgencyID) => async (dispatch) => {
    const val = { AgencyID: LoginAgencyID }
    fetchPostData('ImageView/GetDataDropDown_ImageView', val).then((data) => {
        if (data) {
            dispatch({ type: ImageView_Type_Drp_Data, payload: Comman_changeArrayFormat(data, 'ImageViewID', 'Description') });
        } else {
            dispatch({ type: ImageView_Type_Drp_Data, payload: [] });
        }
    })
}



export const get_FISuspectActivity_Drp_Data = (LoginAgencyID) => async (dispatch) => {
    const val = { AgencyID: LoginAgencyID }
    fetchPostData('FISuspectActivity/GetDataDropDown_FISuspectActivity', val).then((data) => {
        if (data) {
            dispatch({ type: FISuspectActivity_Drp_Data, payload: Comman_changeArrayFormat(data, 'FISuspectActivityID', 'Description', 'FISuspectActivityCode') });
        } else {
            dispatch({ type: FISuspectActivity_Drp_Data, payload: [] });
        }
    })
}

export const get_FIContactType_Drp_Data = (LoginAgencyID) => async (dispatch) => {
    const val = { AgencyID: LoginAgencyID }
    fetchPostData('FIContactType/GetDataDropDown_FIContactType', val).then((data) => {
        if (data) {
            dispatch({ type: FIContactType_Drp_Data, payload: Comman_changeArrayFormat(data, 'FIContactTypeID', 'Description', 'FIContactTypeCode') });
        } else {
            dispatch({ type: FIContactType_Drp_Data, payload: [] });
        }
    })
}

export const GetDropDown_Alert = (LoginAgencyID, AlertType) => async (dispatch) => {
    const val = { AgencyID: LoginAgencyID, AlertType: AlertType }
    fetchPostData('Alert/GetDataDropDown_Alert', val).then((data) => {
        if (data) {
            dispatch({ type: Alert_Drp_Data, payload: fourColArrayAlert(data, 'AlertID', 'AlertTitle', 'Priority', 'PriorityDescription') });
        } else {
            dispatch({ type: Alert_Drp_Data, payload: [] });
        }
    })
}

import { toastifyError } from '../../Components/Common/AlertMsg';
import { Comman_changeArrayFormat } from '../../Components/Common/ChangeArrayFormat';
import { fetchPostData } from '../../Components/hooks/Api';
import { PropertyMainModule_Data, PropertySearch_Modal_Status, PropertySearch_Type, Property_Search_Data } from '../actionTypes';
import * as api from '../api'

function hasValues(obj) {
    for (let key in obj) {
        if (obj[key]) {
            return true;
        }
    }
    return false;
}

export const get_PropertyMainModule_Data = (IncidentID, IsMaster) => async (dispatch) => {
    const val = { 'IncidentID': IncidentID, 'IsMaster': IsMaster }
    fetchPostData('Property/GetData_Property', val).then((res) => {
        if (res) {
            dispatch({ type: PropertyMainModule_Data, payload: res });
        } else {
            dispatch({ type: PropertyMainModule_Data, payload: [] });
        }
    })
};

// search api change by mani / kishan  api/Property/Search_Property

// old api -
// Property/Search_PropertyArticle
// Property/Search_PropertyDrug
// Property/Search_PropertySecurity
// Property/Search_PropertyWeapon
// Property/Search_PropertyOther
// Property/Search_PropertyBoat

// OAN
// Quantity
// ValueFrom
// BottomColorID


export const get_Property_Article_Search_Data = (
    possessionID, SerialID, ModelID, Brand, LossCodeID, TopColorID, CategoryID, PropertyTypeID, PropertyCategoryCode,
    OfficerID, OAN, Quantity, Value, BottomColorID, ClassificationID, setSearchModalState = () => { }, loginAgencyID
) => async (dispatch) => {
    dispatch({ type: PropertySearch_Type, payload: 'Pro-Article' });
    const val = {
        'PossessionOfID': possessionID, 'SerialID': SerialID, 'ModelID': ModelID, 'Brand': Brand, 'LossCodeID': LossCodeID, 'TopColorID': TopColorID, 'CategoryID': CategoryID,
        'SearchType': 'Article', 'PropertyTypeID': PropertyTypeID, 'PropertyCategoryCode': PropertyCategoryCode,
        'OfficerID': OfficerID,
        'OAN': OAN,
        'Quantity': Quantity,
        'ValueFrom': Value,
        'BottomColorID': BottomColorID,
        'ClassificationID': ClassificationID,
    }
    const isEmpty = hasValues(val)
    if (isEmpty) {
        fetchPostData('Property/Search_Property', {

            'PossessionOfID': possessionID, 'SerialID': SerialID, 'ModelID': ModelID, 'Brand': Brand, 'LossCodeID': LossCodeID, 'TopColorID': TopColorID, 'CategoryID': CategoryID, 'PropertyTypeID': PropertyTypeID, 'PropertyCategoryCode': PropertyCategoryCode, 'AgencyID': loginAgencyID,

            'OfficerID': OfficerID,
            'OAN': OAN,
            'Quantity': Quantity,
            'ValueFrom': Value,
            'BottomColorID': BottomColorID,
            'ClassificationID': ClassificationID,

        }).then((res) => {
            if (res?.length > 0) {

                dispatch({ type: Property_Search_Data, payload: res });
                dispatch({ type: PropertySearch_Modal_Status, payload: true });
                setSearchModalState(true)
            } else {
                dispatch({ type: Property_Search_Data, payload: [] });
                toastifyError("Data Not Available")
            }
        })
    } else {
        // toastifyError("Empty Search")
        console.log("Search Empty")
    }
};

export const get_Property_Drug_Search_Data = (
    LossCodeID, Value, PropertyTypeID, PropertyCategoryCode, CategoryID, ClassificationID, OfficerID, setSearchModalState = () => { },
    loginAgencyID,

) => async (dispatch) => {

    dispatch({ type: PropertySearch_Type, payload: 'Pro-Drug' });

    const val = {
        'LossCodeID': LossCodeID,
        'ValueFrom': Value,
        'PropertyTypeID': PropertyTypeID,
        'SearchType': 'Drug',
        'PropertyCategoryCode': PropertyCategoryCode,
        'CategoryID': CategoryID,
        'ClassificationID': ClassificationID,
        'OfficerID': OfficerID,
        // 'OAN': OAN,
        // 'Quantity': Quantity,
        // 'BottomColorID': BottomColorID,
    }

    const isEmpty = hasValues(val)

    if (isEmpty) {
        fetchPostData('Property/Search_Property', {
            'LossCodeID': LossCodeID,
            'ValueFrom': Value,
            'PropertyTypeID': PropertyTypeID,
            'PropertyCategoryCode': PropertyCategoryCode,
            'CategoryID': CategoryID,
            'ClassificationID': ClassificationID,
            'OfficerID': OfficerID,
            // 'OAN': OAN,
            // 'Quantity': Quantity,
            // 'BottomColorID': BottomColorID,
            'AgencyID': loginAgencyID,

        }).then((res) => {
            if (res?.length > 0) {
                // console.log(res);
                dispatch({ type: Property_Search_Data, payload: res });
                dispatch({ type: PropertySearch_Modal_Status, payload: true });
                setSearchModalState(true)
            } else {
                dispatch({ type: Property_Search_Data, payload: [] });
                toastifyError("Data Not Available")
            }
        })
    } else {
        // toastifyError("Empty Search")
        console.log("Search Empty")
    }
};

export const get_Property_Security_Search_Data = (
    SerialID, IssuingAgency, MeasureTypeID, SecurityDtTm, CategoryID, Denomination, PropertyTypeID, PropertyCategoryCode,
    OfficerID, OAN, Quantity, Value, BottomColorID, ClassificationID, LossCodeID,
    setSearchModalState = () => { }, loginAgencyID
) => async (dispatch) => {

    dispatch({ type: PropertySearch_Type, payload: 'Pro-Security' });
    const val = {
        'SerialID': SerialID, 'IssuingAgency': IssuingAgency, 'MeasureTypeID': MeasureTypeID, 'SecurityDtTm': SecurityDtTm, 'CategoryID': CategoryID, 'Denomination': Denomination, 'SearchType': 'Security', 'PropertyTypeID': PropertyTypeID, 'PropertyCategoryCode': PropertyCategoryCode,

        'OfficerID': OfficerID,
        'OAN': OAN,
        'Quantity': Quantity,
        'ValueFrom': Value,
        'BottomColorID': BottomColorID,
        'ClassificationID': ClassificationID, 'LossCodeID': LossCodeID
    }
    const isEmpty = hasValues(val)
    if (isEmpty) {
        fetchPostData('Property/Search_Property', {
            'SerialID': SerialID, 'IssuingAgency': IssuingAgency, 'MeasureTypeID': MeasureTypeID, 'SecurityDtTm': SecurityDtTm, 'CategoryID': CategoryID, 'Denomination': Denomination, 'PropertyTypeID': PropertyTypeID, 'PropertyCategoryCode': PropertyCategoryCode, 'AgencyID': loginAgencyID,

            'OfficerID': OfficerID,
            'OAN': OAN,
            'Quantity': Quantity,
            'ValueFrom': Value,
            'BottomColorID': BottomColorID, 'ClassificationID': ClassificationID, 'LossCodeID': LossCodeID

        }).then((res) => {
            if (res?.length > 0) {
                // console.log(res)
                dispatch({ type: Property_Search_Data, payload: res });
                dispatch({ type: PropertySearch_Modal_Status, payload: true });
                setSearchModalState(true)
            } else {
                dispatch({ type: Property_Search_Data, payload: [] });
                toastifyError("Data Not Available")
            }
        })
    } else {
        // toastifyError("Empty Search")
        console.log("Search Empty")
    }
};

export const get_Property_Weapon_Search_Data = (Style, Finish, SerialID, MakeID, ManufactureYear, BarrelLength, LossCodeID, CategoryID, Caliber, Handle, PropertyTypeID, PropertyCategoryCode,
    OfficerID, OAN, Quantity, Value, BottomColorID, ClassificationID, setSearchModalState = () => { }, loginAgencyID) => async (dispatch) => {
        dispatch({ type: PropertySearch_Type, payload: 'Pro-Weapon' });

        const val = {
            'Style': Style, 'Finish': Finish,
            'SerialID': SerialID, 'MakeID': MakeID, 'ManufactureYear': ManufactureYear, 'BarrelLength': BarrelLength, 'LossCodeID': LossCodeID, 'CategoryID': CategoryID, 'Caliber': Caliber,
            'Handle': Handle,
            'PropertyTypeID': PropertyTypeID, 'PropertyCategoryCode': PropertyCategoryCode, 'SearchType': 'Weapon',
            'OfficerID': OfficerID,
            'OAN': OAN,
            'Quantity': Quantity,
            'ValueFrom': Value,
            'BottomColorID': BottomColorID,
            'ClassificationID': ClassificationID,
        }
        const isEmpty = hasValues(val)
        if (isEmpty) {
            fetchPostData('Property/Search_Property', {
                'Style': Style, 'Finish': Finish,
                'SerialID': SerialID, 'MakeID': MakeID, 'ManufactureYear': ManufactureYear, 'BarrelLength': BarrelLength, 'LossCodeID': LossCodeID, 'CategoryID': CategoryID, 'Caliber': Caliber,
                'Handle': Handle,
                'PropertyTypeID': PropertyTypeID, 'PropertyCategoryCode': PropertyCategoryCode, 'AgencyID': loginAgencyID,

                'OfficerID': OfficerID,
                'OAN': OAN,
                'Quantity': Quantity,
                'ValueFrom': Value,
                'BottomColorID': BottomColorID,
                'ClassificationID': ClassificationID,
            }).then((res) => {
                if (res?.length > 0) {
                    // console.log(res)
                    dispatch({ type: Property_Search_Data, payload: res });
                    dispatch({ type: PropertySearch_Modal_Status, payload: true });
                    setSearchModalState(true)
                } else {
                    dispatch({ type: Property_Search_Data, payload: [] });
                    toastifyError("Data Not Available")
                }
            })
        } else {
            // toastifyError("Empty Search")
            console.log("Search Empty")
        }
    };

export const get_Property_Other_Search_Data = (SerialID, TopColorID, ModelID, Brand, LossCodeID, CategoryID, PropertyTypeID, PropertyCategoryCode,
    OfficerID, OAN, Quantity, Value, BottomColorID, ClassificationID, setSearchModalState = () => { }, loginAgencyID) => async (dispatch) => {
        dispatch({ type: PropertySearch_Type, payload: 'Pro-Other' });
        const val = {
            'SerialID': SerialID, 'TopColorID': TopColorID, 'ModelID': ModelID, 'Brand': Brand, 'LossCodeID': LossCodeID, 'CategoryID': CategoryID, 'PropertyTypeID': PropertyTypeID, 'PropertyCategoryCode': PropertyCategoryCode, 'SearchType': 'Other',
            'OfficerID': OfficerID,
            'OAN': OAN,
            'Quantity': Quantity,
            'ValueFrom': Value,
            'BottomColorID': BottomColorID,
            'ClassificationID': ClassificationID,
        }
        const isEmpty = hasValues(val)
        if (isEmpty) {
            fetchPostData('Property/Search_Property', {
                'SerialID': SerialID, 'TopColorID': TopColorID, 'ModelID': ModelID, 'Brand': Brand, 'LossCodeID': LossCodeID, 'CategoryID': CategoryID, 'PropertyTypeID': PropertyTypeID, 'PropertyCategoryCode': PropertyCategoryCode, 'AgencyID': loginAgencyID,
                'OfficerID': OfficerID,
                'OAN': OAN,
                'Quantity': Quantity,
                'ValueFrom': Value,
                'BottomColorID': BottomColorID,
                'ClassificationID': ClassificationID,
            }).then((res) => {
                if (res?.length > 0) {
                    // console.log(res)
                    dispatch({ type: Property_Search_Data, payload: res });
                    dispatch({ type: PropertySearch_Modal_Status, payload: true });
                    setSearchModalState(true)
                } else {
                    dispatch({ type: Property_Search_Data, payload: [] });
                    toastifyError("Data Not Available")
                }
            })
        } else {
            // toastifyError("Empty Search")
            console.log("Search Empty")
        }
    };

export const get_Property_Boat_Search_Data = (RegistrationStateID, RegistrationNumber, MaterialID, HIN, RegistrationExpiryDtTm, VODID, LossCodeID, ManufactureYear, Length, CategoryID, TopColorID, MakeID, ModelID, PropulusionID, Comments, PropertyTypeID, PropertyCategoryCode,
    OfficerID, OAN, Quantity, Value, BottomColorID, ClassificationID, setSearchModalState = () => { }, loginAgencyID) => async (dispatch) => {
        dispatch({ type: PropertySearch_Type, payload: 'Pro-Boat' });
        const val = {
            'RegistrationStateID': RegistrationStateID, 'RegistrationNumber': RegistrationNumber, 'MaterialID': MaterialID, 'HIN': HIN,
            'RegistrationExpiryDtTm': RegistrationExpiryDtTm, 'VODID': VODID,
            'LossCodeID': LossCodeID,
            'ManufactureYear': ManufactureYear, 'Length': Length, 'CategoryID': CategoryID, 'TopColorID': TopColorID, 'MakeID': MakeID, 'ModelID': ModelID, 'PropulusionID': PropulusionID, 'Comments': Comments, 'PropertyTypeID': PropertyTypeID, 'PropertyCategoryCode': PropertyCategoryCode, 'SearchType': 'Boat',
            'OfficerID': OfficerID,
            'OAN': OAN,
            'Quantity': Quantity,
            'ValueFrom': Value,
            'BottomColorID': BottomColorID,
            'ClassificationID': ClassificationID,
        }
        const isEmpty = hasValues(val)
        if (isEmpty) {
            fetchPostData('Property/Search_Property', {
                'RegistrationStateID': RegistrationStateID, 'RegistrationNumber': RegistrationNumber, 'MaterialID': MaterialID, 'HIN': HIN,
                'RegistrationExpiryDtTm': RegistrationExpiryDtTm, 'VODID': VODID,
                'LossCodeID': LossCodeID, 'ManufactureYear': ManufactureYear, 'Length': Length, 'CategoryID': CategoryID, 'TopColorID': TopColorID, 'MakeID': MakeID, 'ModelID': ModelID, 'PropulusionID': PropulusionID, 'Comments': Comments, 'PropertyTypeID': PropertyTypeID, 'PropertyCategoryCode': PropertyCategoryCode, 'AgencyID': loginAgencyID,
                'OfficerID': OfficerID,
                'OAN': OAN,
                'Quantity': Quantity,
                'ValueFrom': Value,
                'BottomColorID': BottomColorID,
                'ClassificationID': ClassificationID,
            }).then((res) => {
                if (res?.length > 0) {
                    dispatch({ type: Property_Search_Data, payload: res });
                    dispatch({ type: PropertySearch_Modal_Status, payload: true });
                    setSearchModalState(true)
                } else {
                    dispatch({ type: Property_Search_Data, payload: [] });
                    toastifyError("Data Not Available")
                }
            })
        } else {
            // toastifyError("Empty Search")
            console.log("Search Empty")
        }
    };
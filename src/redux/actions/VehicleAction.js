import { toastifyError } from '../../Components/Common/AlertMsg';
import { Comman_changeArrayFormat } from '../../Components/Common/ChangeArrayFormat';
import { fetchPostData } from '../../Components/hooks/Api';
import { Agency_OfficerDrp_Data, VehicleSearch_Modal_Status, VehicleSearch_Type, Vehicle_Search_Data } from '../actionTypes';
import * as api from '../api'

function hasValues(obj) {
    for (let key in obj) {
        if (obj[key]) {
            return true;
        }
    }
    return false;
}

function VehiclehasValues(obj) {
    for (let key in obj) {
        if (key != 'AgencyID' && key != 'PrimaryOfficerID') {
            if (obj[key]) { return true; }
        }
    }
    return false;
}

export const get_AgencyOfficer_Data = (ID) => async (dispatch) => {
    const val = { AgencyID: ID };
    fetchPostData('DropDown/GetData_HeadOfAgency', val).then((data) => {
        if (data) {
            dispatch({ type: Agency_OfficerDrp_Data, payload: Comman_changeArrayFormat(data, 'PINID', 'HeadOfAgency') });
        } else {
            dispatch({ type: Agency_OfficerDrp_Data, payload: [] });
        }
    })
};


// export const get_Vehicle_Search_Data = (
//     VIN, VODID, PlateExpireDtTm, OANID, StyleID, PrimaryColorID, SecondaryColorID, ValueFrom, Inspection_Sticker, InspectionExpiresDtTm, IsEvidence, LossCodeID, MakeID, ManufactureYear, PlateID, VehicleNo, PlateTypeID, CategoryID, ClassificationID, PrimaryOfficerID, loginAgencyID, setSearchModalState

// ) => async (dispatch) => {
//     dispatch({ type: VehicleSearch_Type, payload: 'Pro-Vehicle' });
//     const val = { 'VIN': VIN, 'VODID': VODID, 'PlateExpireDtTm': PlateExpireDtTm, 'OANID': OANID, 'StyleID': StyleID, 'PrimaryColorID': PrimaryColorID, 'SecondaryColorID': SecondaryColorID, 'ValueFrom': ValueFrom, 'Inspection_Sticker': Inspection_Sticker, 'InspectionExpiresDtTm': InspectionExpiresDtTm, 'IsEvidence': IsEvidence, 'LossCodeID': LossCodeID, 'PrimaryOfficerID': PrimaryOfficerID, 'MakeID': MakeID, 'ManufactureYear': ManufactureYear, 'AgencyID': loginAgencyID, 'PlateID': PlateID, 'VehicleNo': VehicleNo, 'PlateTypeID': PlateTypeID, 'CategoryID': CategoryID, 'ClassificationID': ClassificationID, }
//     const isEmpty = VehiclehasValues(val)
//     if (isEmpty) {
//         fetchPostData('PropertyVehicle/Search_PropertyVehicle', { 'VIN': VIN, 'VODID': VODID, 'PlateExpireDtTm': PlateExpireDtTm, 'OANID': OANID, 'StyleID': StyleID, 'PrimaryColorID': PrimaryColorID, 'SecondaryColorID': SecondaryColorID, 'ValueFrom': ValueFrom, 'Inspection_Sticker': Inspection_Sticker, 'InspectionExpiresDtTm': InspectionExpiresDtTm, 'IsEvidence': IsEvidence, 'LossCodeID': LossCodeID, 'PrimaryOfficerID': PrimaryOfficerID, 'MakeID': MakeID, 'ManufactureYear': ManufactureYear, 'PlateID': PlateID, 'AgencyID': loginAgencyID, 'VehicleNo': VehicleNo, 'PlateTypeID': PlateTypeID, 'CategoryID': CategoryID, 'ClassificationID': ClassificationID, }).then((res) => {
//             if (res?.length > 0) {
//                 dispatch({ type: Vehicle_Search_Data, payload: res });
//                 dispatch({ type: VehicleSearch_Modal_Status, payload: true });
//                 setSearchModalState(true)
//             } else {
//                 dispatch({ type: Vehicle_Search_Data, payload: [] });
//                 toastifyError("Data Not Available")
//                 setSearchModalState(false)
//             }
//         })
//     } else {
//         setSearchModalState(false)
//         console.log("Search Empty")
//         toastifyError("Data Not Available")
//     }
// };

export const get_Vehicle_Search_Data = (
    VIN, VODID, PlateExpireDtTm, OANID, StyleID, PrimaryColorID, SecondaryColorID, ValueFrom,
    Inspection_Sticker, InspectionExpiresDtTm, IsEvidence, LossCodeID, MakeID, ManufactureYear,
    PlateID, VehicleNo, PlateTypeID, CategoryID, ClassificationID, PrimaryOfficerID, loginAgencyID,
    setSearchModalState
) => async (dispatch) => {
    dispatch({ type: VehicleSearch_Type, payload: 'Pro-Vehicle' });
    const val = {
        VIN, VODID, PlateExpireDtTm, OANID, StyleID, PrimaryColorID, SecondaryColorID,
        ValueFrom, Inspection_Sticker, InspectionExpiresDtTm, IsEvidence, LossCodeID,
        PrimaryOfficerID, MakeID, ManufactureYear, AgencyID: loginAgencyID,
        PlateID, VehicleNo, PlateTypeID, CategoryID, ClassificationID
    };
    const isEmpty = VehiclehasValues(val);
    if (isEmpty) {
        fetchPostData('PropertyVehicle/Search_PropertyVehicle', val).then((res) => {
            if (Array.isArray(res) && res.length > 0) {
                dispatch({ type: Vehicle_Search_Data, payload: res });
                dispatch({ type: VehicleSearch_Modal_Status, payload: true });
                setSearchModalState(true); // ✅ Only open modal when data is present
            } else {
                dispatch({ type: Vehicle_Search_Data, payload: [] });
                toastifyError("Data Not Available");
                setSearchModalState(false); // ❌ Keep modal closed
            }
        });
    } else {
        toastifyError("Please Enter Value");
        setSearchModalState(false); // ❌ Keep modal closed
    }
};

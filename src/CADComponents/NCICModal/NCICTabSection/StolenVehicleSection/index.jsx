import { useEffect, useState } from 'react'
import Select from 'react-select'
import { useSelector, useDispatch } from 'react-redux'
import { get_State_Drp_Data } from '../../../../redux/actions/DropDownsData'
import { fetchPostData } from '../../../../Components/hooks/Api'
import { Comman_changeArrayFormat } from '../../../../Components/Common/ChangeArrayFormat'
import { colourStyles, colourStylesNoReq } from '../../../Utility/CustomStylesForReact'
import PropTypes from 'prop-types'

const StolenVehicleSection = ({ stolenVehicleSectionState, setStolenVehicleSectionState, handleStolenVehicleSectionState, errorStolenVehicleSectionState, handleErrorStolenVehicleSectionState, stateList }) => {
    const dispatch = useDispatch();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const [vehMakeDrpData, setVehMakeDrpData] = useState([]);
    const [loginAgencyID, setLoginAgencyID] = useState('');
    const [loginPinID, setLoginPinID] = useState(1);

    useEffect(() => {
        const savedState = localStorage.getItem('stolenVehicleSectionState');
        if (savedState) {
            setStolenVehicleSectionState(JSON.parse(savedState));
        }
    }, []);

    useEffect(() => {
        if (localStoreData) {
            setLoginAgencyID(localStoreData?.AgencyID);
            setLoginPinID(localStoreData?.PINID);
        }
    }, [localStoreData]);

    useEffect(() => {
        if (loginAgencyID) {
            if (stateList?.length === 0) { dispatch(get_State_Drp_Data()) };
        }
    }, [loginAgencyID])



    const get_MakeId_Drp_Data = (LoginAgencyID, loginPinID) => {
        const val = {
            AgencyID: LoginAgencyID,
            Description: "",
            IsActive: "1",
            IsSuperAdmin: "true",
            OrderTypeCode: "Asc",
            OrderTypeDescription: "",
            PINID: loginPinID,
            PropertyBoatMakeCode: "",
        }
        fetchPostData('PropertyVehicleMake/GetData_CAD_PropertyVehicleMake', val).then((data) => {
            if (data) {
                setVehMakeDrpData(Comman_changeArrayFormat(data, 'PropertyVehicleMakeID', 'Description'))
            } else {
                setVehMakeDrpData([]);
            }
        })
    }
    useEffect(() => {
        if (loginAgencyID && loginPinID) {
            get_MakeId_Drp_Data(loginAgencyID, loginPinID);
        }
    }, [loginAgencyID, loginPinID])

    return (
        <>
            <fieldset className="ncic-main-container">
                <legend className="ncic-legend">{'Query Stolen Vehicle (QV)'}</legend>
                <p className="ncic-warning-text">{'Enter any one of the following: NIC or LIC or VIN.'}</p>
                <div className="ncic-form-container mt-3">
                    {/* NCIC # (NIC) */}
                    <div className="tab-form-row">
                        <div className="col-3 d-flex align-self-center justify-content-end">
                            <label className="tab-form-label">
                                NCIC # :
                            </label>
                        </div>
                        <div className="col-6 d-flex align-self-center justify-content-end">
                            <input
                                type="text"
                                className="form-control py-1 new-input"
                                name="ncicNumber"
                                placeholder="Enter NCIC number"
                                value={stolenVehicleSectionState?.ncicNumber}
                                onChange={(v) => {
                                    const value = v.target.value;
                                    handleStolenVehicleSectionState("ncicNumber", value);
                                }}
                                disabled={stolenVehicleSectionState?.licensePlate || stolenVehicleSectionState?.vin ? true : false}
                            />
                        </div>
                    </div>

                    {/* License Plate # (LIC) */}
                    <div className="tab-form-row">
                        <div className="col-3 d-flex align-self-center justify-content-end">
                            <label className="tab-form-label">
                                License Plate # :
                                {errorStolenVehicleSectionState?.licensePlate && (
                                    <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>Required</p>
                                )}
                            </label>
                        </div>
                        <div className="col-6 d-flex align-self-center justify-content-end">
                            <input
                                type="text"
                                className="form-control py-1 new-input requiredColor"
                                name="licensePlate"
                                placeholder="Enter license plate number"
                                isDisabled={stolenVehicleSectionState?.vin ? true : false}
                                value={stolenVehicleSectionState?.licensePlate}
                                onChange={(v) => {
                                    const value = v.target.value;
                                    handleStolenVehicleSectionState("licensePlate", value);
                                    if (errorStolenVehicleSectionState?.licensePlate) {
                                        handleErrorStolenVehicleSectionState("licensePlate", false);
                                    }
                                }}
                                disabled={stolenVehicleSectionState?.ncicNumber || stolenVehicleSectionState?.vin ? true : false}
                            />
                        </div>
                    </div>

                    {/* License State (LIS) */}
                    <div className="tab-form-row">
                        <div className="col-3 d-flex align-self-center justify-content-end">
                            <label className="tab-form-label">
                                License State :
                                {errorStolenVehicleSectionState?.licenseState && (
                                    <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>Required</p>
                                )}
                            </label>
                        </div>
                        <div className="col-6">
                            <Select
                                styles={stolenVehicleSectionState?.vin ? colourStylesNoReq : colourStyles}
                                placeholder="Select"
                                isClearable
                                options={stateList}
                                maxMenuHeight={180}
                                isDisabled={stolenVehicleSectionState?.vin ? true : false}
                                menuPlacement="top"
                                value={stolenVehicleSectionState?.licenseState ? stateList?.find((i) => i?.label === stolenVehicleSectionState?.licenseState) : ""}
                                onChange={(e) => {
                                    handleStolenVehicleSectionState("licenseState", e?.label);
                                    if (errorStolenVehicleSectionState?.licenseState) {
                                        handleErrorStolenVehicleSectionState("licenseState", false);
                                    }
                                }}
                            />
                        </div>
                    </div>

                    {/* Vehicle Identification # (VIN) */}
                    <div className="tab-form-row">
                        <div className="col-3 d-flex align-self-center justify-content-end">
                            <label className="tab-form-label">
                                VIN :
                            </label>
                        </div>
                        <div className="col-6 d-flex align-self-center justify-content-end">
                            <input
                                type="text"
                                className="form-control py-1 new-input"
                                name="vin"
                                placeholder="Enter VIN"
                                maxLength="17"
                                disabled={stolenVehicleSectionState?.licenseState && stolenVehicleSectionState?.licensePlate ? true : false}
                                value={stolenVehicleSectionState?.vin}
                                onChange={(v) => {
                                    const value = v.target.value;
                                    handleStolenVehicleSectionState("vin", value);
                                }}
                            />
                        </div>
                    </div>

                    {/* Vehicle Make (VMA) */}
                    <div className="tab-form-row">
                        <div className="col-3 d-flex align-self-center justify-content-end">
                            <label className="tab-form-label">
                                Vehicle Make :
                                {errorStolenVehicleSectionState?.vehicleMake && (
                                    <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>Required</p>
                                )}
                            </label>
                        </div>
                        <div className="col-6">
                            <Select
                                styles={colourStylesNoReq}
                                placeholder="Select"
                                isClearable
                                options={vehMakeDrpData}
                                maxMenuHeight={180}
                                menuPlacement="top"
                                value={stolenVehicleSectionState?.vehicleMake ? vehMakeDrpData?.find((i) => i?.label === stolenVehicleSectionState?.vehicleMake) : ""}
                                onChange={(e) => {
                                    handleStolenVehicleSectionState("vehicleMake", e?.label);
                                    if (errorStolenVehicleSectionState?.vehicleMake) {
                                        handleErrorStolenVehicleSectionState("vehicleMake", false);
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>
            </fieldset>
        </>
    )
}

StolenVehicleSection.propTypes = {
    stolenVehicleSectionState: PropTypes.object.isRequired,
    setStolenVehicleSectionState: PropTypes.func.isRequired,
    handleStolenVehicleSectionState: PropTypes.func.isRequired,
    errorStolenVehicleSectionState: PropTypes.object,
    handleErrorStolenVehicleSectionState: PropTypes.func,
};

StolenVehicleSection.defaultProps = {
    errorStolenVehicleSectionState: {},
    handleErrorStolenVehicleSectionState: () => { },
};

export default StolenVehicleSection
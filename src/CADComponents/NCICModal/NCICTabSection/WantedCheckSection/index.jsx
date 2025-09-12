import { useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Select from "react-select";
import { fetchPostData } from "../../../../Components/hooks/Api";
import { Comman_changeArrayFormat } from "../../../../Components/Common/ChangeArrayFormat";
import DatePicker from "react-datepicker";
import { AgencyContext } from "../../../../Context/Agency/Index";
import { colourStyles, customStylesWithOutColor } from "../../../Utility/CustomStylesForReact";

const WantedCheckSection = ({ wantedCheckSectionState, setWantedCheckSectionState, handleWantedCheckSectionState, clearWantedCheckSectionState }) => {
  const localStoreData = useSelector((state) => state.Agency.localStoreData);
  const { datezone } =
    useContext(AgencyContext);
  const stateList = useSelector((state) => state.DropDown.stateDrpData);
  const [loginAgencyID, setLoginAgencyID] = useState('');
  const [loginPinID, setLoginPinID] = useState(1);


  const [suffixIdDrp, setSuffixIdDrp] = useState([]);
  const [plateTypeIdDrp, setPlateTypeIdDrp] = useState([]);
  const [makeIdDrp, setMakeIdDrp] = useState([]);
  const [sexIdDrp, setSexIdDrp] = useState([]);
  const [raceIdDrp, setRaceIdDrp] = useState([]);

  const get_Name_Drp_Data = (loginAgencyID) => {
    const val = { AgencyID: loginAgencyID, }
    fetchPostData('MasterName/GetNameDropDown', val).then((data) => {
      if (data) {
        setSexIdDrp(Comman_changeArrayFormat(data[0]?.Gender, 'SexCodeID', 'Description'));
        setRaceIdDrp(Comman_changeArrayFormat(data[0]?.Race, 'RaceTypeID', 'Description'));
        setSuffixIdDrp(Comman_changeArrayFormat(data[0]?.Suffix, 'SuffixID', 'Description'));

      } else {
        setSexIdDrp([]);
        setRaceIdDrp([]);
        setSuffixIdDrp([]);
      }
    })
  };

  useEffect(() => {
    const savedState = localStorage.getItem('nameSectionState');
    if (savedState) {
      setWantedCheckSectionState(JSON.parse(savedState));
    }
  }, []);

  const imageReqDropdown = [
    {
      value: "1",
      label: "Yes"
    },
    {
      value: "2",
      label: "No"
    },

  ];

  const get_PlateType_Drp = (loginAgencyID) => {
    const val = {
      AgencyID: loginAgencyID,
    }
    fetchPostData('PropertyVehiclePlateType/GetDataDropDown_PropertyVehiclePlateType', val).then((data) => {
      if (data) {
        setPlateTypeIdDrp(Comman_changeArrayFormat(data, 'PlateTypeID', 'Description'))
      } else {
        setPlateTypeIdDrp([]);
      }
    })
  }

  const get_MakeId_Drp = (loginAgencyID) => {
    const val = {
      AgencyID: loginAgencyID,
    }
    fetchPostData('PropertyVehicleMake/GetDataDropDown_PropertyVehicleMake', val).then((data) => {
      if (data) {
        setMakeIdDrp(Comman_changeArrayFormat(data, 'PropertyVehicleMakeID', 'Description'))
      } else {
        setMakeIdDrp([]);
      }
    })
  }

  useEffect(() => {
    if (localStoreData) {
      setLoginAgencyID(localStoreData?.AgencyID);
      setLoginPinID(localStoreData?.PINID);
    }
  }, [localStoreData]);


  useEffect(() => {
    if (loginAgencyID) {
      get_Name_Drp_Data(loginAgencyID)
      get_PlateType_Drp(loginAgencyID)
      get_MakeId_Drp(loginAgencyID);
    }

  }, [loginAgencyID])

  return (
    <>
      <fieldset className="ncic-main-contajiner">
        <legend className="ncic-legend">{'Registration/Stolen/Driver License with Wanted Check (RSDW/RSDWW)'}</legend>
        <p className="ncic-warning-text">{wantedCheckSectionState?.isByRSDW_RSDWW === 'RQ' ? 'DST is required and also enter any one of the following: LIC/VIN/(Last Name, First Name and DOB).' : 'DST is required and also enter any one of the following: LIC/VIN/OLN. :'}</p>

        <div className="ncic-form-container">
          {/* New line */}

          <div className="">
            <div className="col-4 d-flex align-items-center justify-content-end">
              {/* Empty div */}
            </div>
            <div className="col-11 tab-form-row-gap d-flex align-items-center w-100">
              <div className="form-check d-flex align-items-center">
                <input
                  type="radio"
                  className="form-check-input mb-1"
                  id="RQ"
                  value="RQ"
                  checked={wantedCheckSectionState?.isByRSDW_RSDWW === 'RQ'}
                  onChange={(e) => {
                    clearWantedCheckSectionState()
                    handleWantedCheckSectionState("isByRSDW_RSDWW", e.target.value);
                  }}

                />

                <label className="tab-form-label">
                  By Name (RSDW)
                </label>
              </div>
              <div className="form-check d-flex align-items-center">
                {/* <input className="form-check-input mb-1" type="radio" /> */}
                <input
                  type="radio"
                  className="form-check-input mb-1"
                  id="RNQ"
                  value="RNQ"
                  checked={wantedCheckSectionState?.isByRSDW_RSDWW === 'RNQ'}
                  onChange={(e) => {
                    clearWantedCheckSectionState()
                    handleWantedCheckSectionState("isByRSDW_RSDWW", e.target.value);
                  }}
                />
                <label className="tab-form-label">
                  By OLN (RSDWW)
                </label>
              </div>
            </div>
          </div>

          <div className="tab-form-row">
            <div className="col-6">
              {/* New line */}
              <div className="tab-form-row">
                <div className="col-4 d-flex align-self-center justify-content-end">
                  <label className="tab-form-label">
                    License Plate :
                  </label>
                </div>
                <div className="col-8 d-flex align-self-center justify-content-end">
                  {/* <input
                type="text"
                className="new-input w-100 form-control py-1 new-input"
              /> */}
                  <input
                    type="text"
                    className="form-control py-1 new-input requiredColor"
                    name="licensePlate"
                    placeholder="License Plate"
                    value={wantedCheckSectionState.licensePlate}
                    onChange={(v) => {
                      const value = v.target.value;
                      handleWantedCheckSectionState("licensePlate", value);
                    }}
                  // readOnly={wantedCheckSectionState?.isByRSDW_RSDWW === 'RNQ' ? true : false}
                  />
                </div>
              </div>
              <div className="tab-form-row mt-1">
                <div className="col-4 d-flex align-self-center justify-content-end">
                  <label className="tab-form-label">
                    Type :
                  </label>
                </div>
                <div className="col-8 ">
                  <Select
                    styles={customStylesWithOutColor}
                    placeholder="Select"
                    isClearable
                    options={plateTypeIdDrp}
                    value={wantedCheckSectionState?.playType ? plateTypeIdDrp?.find((i) => i?.value === wantedCheckSectionState?.playType) : ""}
                    onChange={(e) => {
                      handleWantedCheckSectionState("playType", e?.value);
                    }}
                    // isDisabled={wantedCheckSectionState?.isByRSDW_RSDWW === 'RQ' ? false : true}
                    menuPlacement="bottom"
                  />
                </div>
              </div>

              {/* New line */}
              <div className="tab-form-row mt-2">
                <div className="col-4 d-flex align-self-center justify-content-end">
                  <label className="tab-form-label">
                    Vehicle ID # :
                  </label>
                </div>
                <div className="col-8 d-flex align-self-center justify-content-end">
                  <input
                    type="text"
                    className="form-control py-1 new-input requiredColor"
                    name="vehicleID"
                    placeholder="Vehicle ID # (VIN)"
                    value={wantedCheckSectionState.vehicleID}
                    onChange={(v) => {
                      const value = v.target.value;
                      handleWantedCheckSectionState("vehicleID", value);
                    }}
                  // readOnly={wantedCheckSectionState?.isByRSDW_RSDWW === 'RQ' ? false : true}

                  />
                </div>
              </div>
              {/* New line */}
              <div className="tab-form-row mt-1">
                <div className="col-4 d-flex align-self-center justify-content-end">
                  <label className="tab-form-label">
                    Registration Type :
                  </label>
                </div>
                <div className="col-8">
                  <Select
                    styles={customStylesWithOutColor}
                    placeholder="Select"
                    isClearable
                    options={plateTypeIdDrp}
                    value={wantedCheckSectionState?.registrationType ? plateTypeIdDrp?.find((i) => i?.value === wantedCheckSectionState?.registrationType) : ""}
                    onChange={(e) => {
                      handleWantedCheckSectionState("registrationType", e?.value);
                    }}
                    // isDisabled={wantedCheckSectionState?.isByRSDW_RSDWW === 'RQ' ? false : true}
                    menuPlacement="bottom"
                  />
                </div>
              </div>

              {/* New line */}
              <div className="tab-form-row">
                <div className="col-4 d-flex align-self-center justify-content-end">
                  <label className="tab-form-label">
                    Financial Responsibility Type :
                  </label>
                </div>
                <div className="col-8 d-flex align-self-center justify-content-end">
                  {/* <input
                type="text"
                className="new-input w-100 form-control py-1 new-input"
              /> */}
                  <input
                    type="text"
                    className="form-control py-1 new-input"
                    name="financialResponsibilityType"
                    placeholder="Financial Responsibility Type (FRT)"
                    value={wantedCheckSectionState.financialResponsibilityType}
                    onChange={(v) => {
                      const value = v.target.value;
                      handleWantedCheckSectionState("financialResponsibilityType", value);
                    }}
                  // readOnly={wantedCheckSectionState?.isByRSDW_RSDWW === 'RQ' ? true : false}
                  />
                </div>
              </div>
              {/* New line */}
              <div className="tab-form-row">
                <div className="col-4 d-flex align-self-center justify-content-end">
                  <label className="tab-form-label">
                    Last Name :
                  </label>
                </div>
                <div className="col-8 d-flex align-self-center justify-content-end">
                  {/* <input
                type="text"
                className="new-input w-100 form-control py-1 new-input"
              /> */}
                  <input
                    type="text"
                    className="form-control py-1 new-input requiredColor"
                    name="lastName"
                    placeholder="Last Name"
                    value={wantedCheckSectionState.lastName}
                    onChange={(v) => {
                      const value = v.target.value;
                      handleWantedCheckSectionState("lastName", value);
                    }}
                    readOnly={wantedCheckSectionState?.isByRSDW_RSDWW === 'RNQ' ? true : false}
                  />
                </div>
              </div>
              {/* New line */}
              <div className="tab-form-row mt-2">
                <div className="col-4 d-flex align-self-center justify-content-end">
                  <label className="tab-form-label">
                    Middle Name :
                  </label>
                </div>
                <div className="col-8 d-flex align-self-center justify-content-end">
                  {/* <input
                type="text"
                className="new-input w-100 form-control py-1 new-input"
              /> */}
                  <input
                    type="text"
                    className="form-control py-1 new-input "
                    name="middleName"
                    placeholder="Middle Name"
                    value={wantedCheckSectionState.middleName}
                    onChange={(v) => {
                      const value = v.target.value;
                      handleWantedCheckSectionState("middleName", value);
                    }}
                    readOnly={wantedCheckSectionState?.isByRSDW_RSDWW === 'RNQ' ? true : false}
                  />
                </div>
              </div>
              {/* New line */}
              <div className="tab-form-row mt-2">
                <div className="col-4 d-flex align-self-center justify-content-end ">
                  <label className="tab-form-label">
                    Expanded Name Search :
                  </label>
                </div>
                <div className="col-8">
                  <Select
                    styles={customStylesWithOutColor}
                    placeholder="Select"
                    isClearable
                    options={imageReqDropdown}
                    value={wantedCheckSectionState?.expandedNameSearch ? imageReqDropdown?.find((i) => i?.value === wantedCheckSectionState?.expandedNameSearch) : ""}
                    onChange={(e) => {
                      handleWantedCheckSectionState("expandedNameSearch", e?.value);
                    }}
                    // className={"requiredColor"}
                    isDisabled={wantedCheckSectionState?.isByRSDW_RSDWW === 'RNQ' ? true : false}

                  />
                </div>
              </div>
              {/* New line */}
              <div className="tab-form-row">
                <div className="col-4 d-flex align-self-center justify-content-end">
                  <label className="tab-form-label">
                    License # :
                  </label>
                </div>
                <div className="col-8 d-flex align-self-center justify-content-end">
                  <input
                    type="text"
                    className="form-control py-1 new-input requiredColor"
                    name="licenseNo"
                    placeholder="License #"
                    value={wantedCheckSectionState.licenseNo}
                    onChange={(v) => {
                      const value = v.target.value;
                      handleWantedCheckSectionState("licenseNo", value);
                    }}
                    readOnly={wantedCheckSectionState?.isByRSDW_RSDWW === 'RQ' ? true : false}
                  />
                </div>

              </div>
              {/* New line */}
              <div className="tab-form-row">
                <div className="col-4 d-flex align-self-center justify-content-end">
                  <label className="tab-form-label">
                    Extended Date of Birth Search :
                  </label>
                </div>
                <div className="col-8 d-flex align-self-center justify-content-end">
                  <input
                    type="text"
                    className="form-control py-1 new-input"
                    name="ExtendedDOB"
                    placeholder="Extended Date of Birth Search"
                    value={wantedCheckSectionState.ExtendedDOB}
                    onChange={(v) => {
                      const value = v.target.value;
                      handleWantedCheckSectionState("ExtendedDOB", value);
                    }}
                    readOnly={wantedCheckSectionState?.isByRSDW_RSDWW === 'RNQ' ? true : false}
                  />
                </div>

              </div>
              {/* New line */}
              <div className="tab-form-row">
                <div className="col-4 d-flex align-self-center justify-content-end">
                  <label className="tab-form-label">
                    Email Address :
                  </label>
                </div>
                <div className="col-8 d-flex align-self-center justify-content-end">
                  <input
                    type="text"
                    className="form-control py-1 new-input"
                    name="email"
                    placeholder="Email Address (EML)"
                    value={wantedCheckSectionState.email}
                    onChange={(v) => {
                      const value = v.target.value;
                      handleWantedCheckSectionState("email", value);
                    }}
                    readOnly={wantedCheckSectionState?.isByRSDW_RSDWW === 'RNQ' ? true : false}
                  />
                </div>

              </div>
              {/* New line */}
              <div className="tab-form-row">
                <div className="col-4 d-flex align-self-center justify-content-end">
                  <label className="tab-form-label">
                    Commercial DL :
                  </label>
                </div>
                <div className="col-8 d-flex align-self-center justify-content-end">
                  <input
                    type="text"
                    className="form-control py-1 new-input"
                    name="commercialDL"
                    placeholder="Commercial DL (CDL)"
                    value={wantedCheckSectionState.commercialDL}
                    onChange={(v) => {
                      const value = v.target.value;
                      handleWantedCheckSectionState("commercialDL", value);
                    }}
                  // readOnly={wantedCheckSectionState?.isByRSDW_RSDWW === 'RQ' ? true : false}
                  />
                </div>

              </div>
              {/* New line */}
              <div className="tab-form-row">
                <div className="col-4 d-flex align-self-center justify-content-end">
                  <label className="tab-form-label">
                    Regional Database 1 :
                  </label>
                </div>

                <div className="col-8">

                  <Select
                    styles={customStylesWithOutColor}
                    placeholder="Select"
                    isClearable
                    options={stateList}
                    value={wantedCheckSectionState?.regionalDatabase ? suffixIdDrp?.find((i) => i?.value === wantedCheckSectionState?.regionalDatabase) : ""}
                    onChange={(e) => {
                      handleWantedCheckSectionState("regionalDatabase", e?.value);
                    }}
                    menuPlacement="top"
                  />
                </div>

              </div>
            </div>

            <div className="col-6 d-flex flex-column gap-2">
              {/* New line */}
              <div className="tab-form-row mt-2">
                <div className="col-4 d-flex align-self-center justify-content-end">
                  <label className="tab-form-label">
                    Year (LYR) :
                  </label>
                </div>
                <div className="col-8 d-flex align-self-center justify-content-end">
                  {/* <input
                type="text"
                className="new-input w-100 form-control py-1 new-input"
              /> */}
                  <input
                    type="text"
                    className="form-control py-1 new-input"
                    name="yearLYR"
                    placeholder="Year (LYR)"
                    value={wantedCheckSectionState.yearLYR}
                    onChange={(v) => {
                      const value = v.target.value;
                      handleWantedCheckSectionState("yearLYR", value);
                    }}
                  // readOnly={wantedCheckSectionState?.isByRSDW_RSDWW === 'RQ' ? true : false}
                  />
                </div>
              </div>
              {/* New line */}
              <div className="tab-form-row mt-2">
                <div className="col-4 d-flex align-self-center justify-content-end">
                  <label className="tab-form-label">
                    Year (VYR) :
                  </label>
                </div>
                <div className="col-8 d-flex align-self-center justify-content-end">
                  {/* <input
                type="text"
                className="new-input w-100 form-control py-1 new-input"
              /> */}
                  <input
                    type="text"
                    className="form-control py-1 new-input"
                    name="yearVYR"
                    placeholder="Year (VYR)"
                    value={wantedCheckSectionState.yearVYR}
                    onChange={(v) => {
                      const value = v.target.value;
                      handleWantedCheckSectionState("yearVYR", value);
                    }}
                  // readOnly={wantedCheckSectionState?.isByRSDW_RSDWW === 'RQ' ? true : false}
                  />
                </div>
              </div>
              {/* New line */}
              <div className="tab-form-row mt-2">
                <div className="col-4 d-flex align-self-center justify-content-end">
                  <label className="tab-form-label">
                    Make :
                  </label>
                </div>
                <div className="col-8 ">
                  {/* <input
                type="text"
                className="new-input w-100 form-control py-1 new-input"
              /> */}
                  <Select
                    styles={customStylesWithOutColor}
                    placeholder="Select"
                    isClearable
                    options={makeIdDrp}
                    value={wantedCheckSectionState?.make ? suffixIdDrp?.find((i) => i?.value === wantedCheckSectionState?.make) : ""}
                    onChange={(e) => {
                      handleWantedCheckSectionState("make", e?.value);
                    }}
                    // isDisabled={wantedCheckSectionState?.isByRQ_RNQ_QM === 'RQ' ? false : true}
                    menuPlacement="top"
                  />
                </div>
              </div>
              {/* New line */}
              <div className="tab-form-row mt-2">
                <div className="col-4 d-flex align-self-center justify-content-end">
                  <label className="tab-form-label">
                    Gender :
                  </label>
                </div>
                <div className="col-8 ">
                  {/* <input
                type="text"
                className="new-input w-100 form-control py-1 new-input"
              /> */}
                  <Select
                    styles={customStylesWithOutColor}
                    placeholder="Select"
                    isClearable
                    options={sexIdDrp}
                    value={wantedCheckSectionState?.sex ? sexIdDrp?.find((i) => i?.value === wantedCheckSectionState?.sex) : ""}
                    onChange={(e) => {
                      handleWantedCheckSectionState("sex", e?.value);
                    }}
                    // className={"requiredColor"}
                    isDisabled={wantedCheckSectionState?.isByRSDW_RSDWW === 'RNQ' ? true : false}

                  />
                </div>
              </div>
              <div className="tab-form-row mt-2">
                <div className="col-4 d-flex justify-content-end">
                  <label className="tab-form-label">
                    First Name :
                  </label>
                </div>
                <div className="col-8">
                  <input
                    type="text"
                    className="form-control py-1 new-input requiredColor"
                    name="firstName"
                    placeholder="First Name"
                    value={wantedCheckSectionState.firstName}
                    onChange={(v) => {
                      const value = v.target.value;
                      handleWantedCheckSectionState("firstName", value);
                    }}
                    readOnly={wantedCheckSectionState?.isByRSDW_RSDWW === 'RNQ' ? true : false}

                  />
                </div>
              </div>
              <div className="tab-form-row mt-2">
                <div className="col-4 d-flex justify-content-end">
                  <label className="tab-form-label">
                    Suffix :
                  </label>
                </div>
                <div className="col-8">
                  <Select
                    styles={customStylesWithOutColor}
                    placeholder="Select"
                    isClearable
                    options={suffixIdDrp}
                    value={wantedCheckSectionState?.suffix ? suffixIdDrp?.find((i) => i?.value === wantedCheckSectionState?.suffix) : ""}
                    onChange={(e) => {
                      handleWantedCheckSectionState("suffix", e?.value);
                    }}
                    isDisabled={wantedCheckSectionState?.isByRSDW_RSDWW === 'RNQ' ? true : false}

                  />
                </div>
              </div>

              {/* New line */}
              <div className="tab-form-row mt-2">
                <div className="col-4 d-flex align-self-center justify-content-end">
                  <label className="tab-form-label">
                    DOB :
                  </label>
                </div>
                <div className="col-8 d-flex align-self-center justify-content-end">
                  <DatePicker
                    name='dob'
                    id='dob'
                    onChange={(v) => handleWantedCheckSectionState("dob", v)}
                    selected={wantedCheckSectionState?.dob || ""}
                    dateFormat="MM/dd/yyyy"
                    isClearable={!!wantedCheckSectionState?.dob}
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    autoComplete="off"
                    placeholderText="Select DOB"
                    maxDate={new Date(datezone)}
                    // disabled={wantedCheckSectionState?.isByRSDW_RSDWW === 'RNQ' ? true : false}
                    // className={wantedCheckSectionState?.isByRSDW_RSDWW === 'RQN' && "requiredColor"}
                    disabled={wantedCheckSectionState?.isByRSDW_RSDWW === 'RQ' ? false : true}
                    className={wantedCheckSectionState?.isByRSDW_RSDWW === 'RQ' ? "requiredColor" : "readonlyColor"}

                  />
                </div>
              </div>


              <div className="tab-form-row mt-2">
                <div className="col-4 d-flex justify-content-end">
                  <label className="tab-form-label">
                    Race :
                  </label>
                </div>
                <div className="col-8">
                  <Select
                    styles={customStylesWithOutColor}
                    placeholder="Select"
                    isClearable
                    options={raceIdDrp}
                    value={wantedCheckSectionState?.race ? raceIdDrp?.find((i) => i?.value === wantedCheckSectionState?.race) : ""}
                    onChange={(e) => {
                      handleWantedCheckSectionState("race", e?.value);
                    }}
                    className={wantedCheckSectionState?.isByRSDW_RSDWW === 'RNQ' ? "" : "requiredColor"}
                    isDisabled={wantedCheckSectionState?.isByRSDW_RSDWW === 'RNQ' ? true : false}

                  />
                </div>
              </div>
              <div className="tab-form-row mt-2">
                <div className="col-4 d-flex justify-content-end">
                  <label className="tab-form-label">
                    Image Request :
                  </label>
                </div>
                <div className="col-8">
                  <Select
                    styles={customStylesWithOutColor}
                    placeholder="Select"
                    isClearable
                    options={imageReqDropdown}
                    value={wantedCheckSectionState?.imageRequest ? imageReqDropdown?.find((i) => i?.value === wantedCheckSectionState?.imageRequest) : ""}
                    onChange={(e) => {
                      handleWantedCheckSectionState("imageRequest", e?.value);
                    }}
                    className={"requiredColor"}

                  />
                </div>
              </div>
              <div className="tab-form-row mt-2">
                <div className="col-4 d-flex justify-content-end">
                  <label className="tab-form-label">
                    Reason :
                  </label>
                </div>
                <div className="col-8">
                  <Select
                    styles={customStylesWithOutColor}
                    placeholder="Select"
                    isClearable
                    options={suffixIdDrp}
                    value={wantedCheckSectionState?.suffix ? suffixIdDrp?.find((i) => i?.value === wantedCheckSectionState?.suffix) : ""}
                    onChange={(e) => {
                      handleWantedCheckSectionState("suffix", e?.value);
                    }}
                    isDisabled={wantedCheckSectionState?.isByRSDW_RSDWW === 'RQ' ? true : false}

                  />
                </div>
              </div>
              <div className="tab-form-row mt-2">
                <div className="col-4 d-flex justify-content-end">
                  <label className="tab-form-label">
                    Nlets State Code :
                  </label>
                </div>
                <div className="col-8">
                  <Select
                    styles={colourStyles}
                    placeholder="Select"
                    isClearable
                    options={stateList}
                    value={wantedCheckSectionState?.nletsState ? suffixIdDrp?.find((i) => i?.value === wantedCheckSectionState?.nletsState) : ""}
                    onChange={(e) => {
                      handleWantedCheckSectionState("nletsState", e?.value);
                    }}
                    menuPlacement="top"
                    className={"requiredColor"}

                  />
                </div>
              </div>
              <div className="tab-form-row mt-2">
                <div className="col-4 d-flex justify-content-end">
                  <label className="tab-form-label">
                    Control Field :
                  </label>
                </div>
                <div className="col-8">
                  <input
                    type="text"
                    className="form-control py-1 new-input"
                    name="controlField"
                    placeholder="Control Field"
                    value={wantedCheckSectionState.controlField}
                    onChange={(v) => {
                      const value = v.target.value;
                      handleWantedCheckSectionState("controlField", value);
                    }}
                  // readOnly={wantedCheckSectionState?.isByRSDW_RSDWW === 'RQ' ? false : true}

                  />
                </div>
              </div>










              {/* New line */}
              {/* <div className="tab-form-row mt-2">
                <div className="col-4 d-flex align-self-center justify-content-end">
                  <label className="tab-form-label">
                    Plate No. :
                  </label>
                </div>
                <div className="col-8 d-flex align-self-center justify-content-end ">
                  <input
                    type="text"
                    className="form-control py-1 new-input requiredColor"
                    name="plateNo"
                    placeholder="Plate No."
                    value={wantedCheckSectionState.plateNo}
                    onChange={(v) => {
                      const value = v.target.value;
                      handleWantedCheckSectionState("plateNo", value);
                    }}
                    readOnly={wantedCheckSectionState?.isByRSDW_RSDWW === 'RQ' ? false : true}

                  />
                </div>
              </div> */}
              {/* New line */}
              {/* <div className="tab-form-row mt-2">
                <div className="col-4 d-flex align-self-center justify-content-end">
                  <label className="tab-form-label">
                    Plate Expires :
                  </label>
                </div>
                <div className="col-8 d-flex align-self-center justify-content-end">
                  <DatePicker
                    name='platExpires'
                    id='platExpires'
                    onChange={(v) => handleWantedCheckSectionState("platExpires", v)}
                    selected={wantedCheckSectionState?.platExpires || ""}
                    dateFormat="MM/dd/yyyy"
                    isClearable={!!wantedCheckSectionState?.platExpires}
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    autoComplete="off"
                    placeholderText="Select Plat Expires"
                    maxDate={new Date(datezone)}
                    disabled={wantedCheckSectionState?.isByRSDW_RSDWW === 'RQ' ? false : true}
                    className={wantedCheckSectionState?.isByRSDW_RSDWW === 'RQ' ? "requiredColor" : "readonlyColor"}

                  />
                </div>
              </div> */}
              {/* New line */}
              {/* <div className="tab-form-row mt-2">
                <div className="col-4 d-flex align-self-center justify-content-end">
                  <label className="tab-form-label">
                    Plate Type :
                  </label>
                </div>
                <div className="col-8">
                  <Select
                    styles={customStylesWithOutColor}
                    placeholder="Select"
                    isClearable
                    options={plateTypeIdDrp}
                    value={wantedCheckSectionState?.playType ? plateTypeIdDrp?.find((i) => i?.value === wantedCheckSectionState?.playType) : ""}
                    onChange={(e) => {
                      handleWantedCheckSectionState("playType", e?.value);
                    }}
                    isDisabled={wantedCheckSectionState?.isByRSDW_RSDWW === 'RQ' ? false : true}
                    menuPlacement="top"
                  />
                </div>
              </div> */}


              {/* New line */}
              {/* <div className="tab-form-row mt-2">
                <div className="col-4 d-flex align-self-center justify-content-end">
                  <label className="tab-form-label">
                    Make :
                  </label>
                </div>
                <div className="col-8">
                  <Select
                    styles={customStylesWithOutColor}
                    placeholder="Select"
                    isClearable
                    options={makeIdDrp}
                    value={wantedCheckSectionState?.make ? suffixIdDrp?.find((i) => i?.value === wantedCheckSectionState?.make) : ""}
                    onChange={(e) => {
                      handleWantedCheckSectionState("make", e?.value);
                    }}
                    isDisabled={wantedCheckSectionState?.isByRSDW_RSDWW === 'RQ' ? false : true}
                    menuPlacement="top"
                  />
                </div>
              </div> */}
              {/* New line */}
              {/* <div className="tab-form-row mt-2">
                <div className="col-4 d-flex align-self-center justify-content-end">
                  <label className="tab-form-label">
                    Manu. Year :
                  </label>
                </div>
                <div className="col-8">
                  <input
                    type="text"
                    className="form-control py-1 new-input"
                    name="manuYear"
                    placeholder="Manu. Year"
                    value={wantedCheckSectionState.manuYear}
                    onChange={(v) => {
                      const value = v.target.value;
                      handleWantedCheckSectionState("manuYear", value);
                    }}
                    readOnly={wantedCheckSectionState?.isByRSDW_RSDWW === 'RQ' ? false : true}

                  />
                </div>
              </div> */}
              {/* New line */}
              {/* <div className="tab-form-row mt-2">
                <div className="col-4 d-flex align-self-center justify-content-end">
                  <label className="tab-form-label">
                    Plate State :
                  </label>
                </div>
                <div className="col-8">
                  <Select
                    styles={customStylesWithOutColor}
                    placeholder="Select"
                    isClearable
                    options={stateList}
                    value={wantedCheckSectionState?.plateState ? suffixIdDrp?.find((i) => i?.value === wantedCheckSectionState?.plateState) : ""}
                    onChange={(e) => {
                      handleWantedCheckSectionState("plateState", e?.value);
                    }}
                    menuPlacement="top"
                  />
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </fieldset>
    </>
  )
}

export default WantedCheckSection;

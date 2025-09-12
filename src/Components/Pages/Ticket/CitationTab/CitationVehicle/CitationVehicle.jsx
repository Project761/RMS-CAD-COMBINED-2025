import React, { useEffect, useState } from 'react'
import Select from "react-select";
import DatePicker from "react-datepicker";
import { get_LocalStoreData } from '../../../../../redux/actions/Agency';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Decrypt_Id_Name, base64ToString, getShowingMonthDateYear, getYearWithOutDateTime } from '../../../../Common/Utility';
import { useSelector } from 'react-redux';
import { RequiredFieldIncident, RequiredFieldOnConditon } from '../../../Utility/Personnel/Validation';
const CitationVehicle = () => {

  const useQuery = () => {
    const params = new URLSearchParams(useLocation().search);
    return {
      get: (param) => params.get(param)
    };
  };

  let DecEIncID = 0
  let DecMissPerID = 0
  let DecMissVehID = 0

  const query = useQuery();
  // var openPage = query?.get('page');
  var IncID = query?.get("IncId");
  var MissPerId = query?.get("MissPerID");
  var MissPerSta = query?.get('MissPerSta');
  var IncNo = query?.get("IncNo");
  var IncSta = query?.get("IncSta");
  var MissVehID = query?.get("MissVehID");
  var MissVehSta = query?.get("MissVehSta");
  let MstPage = query?.get('page');

  if (!IncID) { DecEIncID = 0; }
  else { DecEIncID = parseInt(base64ToString(IncID)); }

  if (!MissPerId) { DecMissPerID = 0; }
  else { DecMissPerID = parseInt(base64ToString(MissPerId)); }

  if (!MissVehID) { DecMissVehID = 0; }
  else { DecMissVehID = parseInt(base64ToString(MissVehID)); }

  const navigate = useNavigate();
  const dispatch = useDispatch();


  const localStoreData = useSelector((state) => state.Agency.localStoreData);
  const incReportedDate = useSelector((state) => state.Agency.incReportedDate);
  const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
  const vodIdData = useSelector((state) => state.DropDown.vehicleVODIDDrpData);
  const colorDrp = useSelector((state) => state.DropDown.vehicleColorDrpData);
  const primaryOfficerID = useSelector((state) => state.DropDown.agencyOfficerDrpData)
  const arresteeDrpData = useSelector((state) => state.DropDown.arresteeNameData);
  const modalIdDrp = useSelector((state) => state.DropDown.modalIdDrpData)
  const makeIdDrp = useSelector((state) => state.DropDown.makeIdDrpData)
  const styleIdDrp = useSelector((state) => state.DropDown.styleIdDrpData)
  const classificationID = useSelector((state) => state.DropDown.classificationDrpData)
  const plateTypeIdDrp = useSelector((state) => state.DropDown.vehiclePlateIdDrpData)
  const stateList = useSelector((state) => state.DropDown.stateDrpData);
  const propertyLossCodeData = useSelector((state) => state.DropDown.vehicleLossCodeDrpData);

  const [categoryIdDrp, setCategoryIdDrp] = useState([]);
  const [plateExpDate, setPlateExpDate] = useState();
  const [manufactureDate, setManufactureDate] = useState();
  const [lossCode, setLossCode] = useState('');
  const [loginAgencyID, setLoginAgencyID] = useState('');
  const [loginPinID, setLoginPinID] = useState('');
  const [possenSinglData, setPossenSinglData] = useState([]);
  const [ownerOfID, setOwnerOfID] = useState('');
  const [nameModalStatus, setNameModalStatus] = useState(false);
  const [type, setType] = useState("Property");
  const [missingVehicleID, setMissingVehicleID] = useState()
  const [editval, setEditval] = useState()
  const [vehicleData, setVehicleData] = useState()
  const [possessionID, setPossessionID] = useState();
  const [openPage, setOpenPage] = useState('');


  const [value, setValue] = useState({
    'IncidentID': '', 'AgencyID': '', 'CategoryID': null, 'PlateID': null, 'PlateTypeID': null, 'ClassificationID': null, 'VIN': '', 'VODID': null, 'PlateExpireDtTm': '', 'OANID': null, 'StyleID': null, 'MakeID': null, 'ModelID': null, 'ManufactureYear': '', 'Weight': '', 'OwnerID': null,
    'PrimaryColorID': null, 'SecondaryColorID': null, 'Value': '', 'CreatedByUserFK': '', 'VehicleNo': '',
    'VehicleNumber': '', 'ReportedDtTm': '', 'LossCodeID': '', 'Inspection_Sticker': '', 'InspectionExpiresDtTm': '',
    'PrimaryOfficerID': '', 'InProfessionOf': '', 'TagID': '', 'NICBID': '', 'DestroyDtTm': '', 'Description': '',
    'IsEvidence': '', 'IsPropertyRecovered': '', 'IsImmobalizationDevice': '', 'IsEligibleForImmobalization': '',
    'VehicleID': '', 'IsMaster': false

  })

  const [errors, setErrors] = useState({
    'CategoryIDError': '', 'PlateTypeIDError': '', 'VehicleNoError': '', 'vinLengthError': ''
  })

  useEffect(() => {
    if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
      if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
    }
  }, []);

  useEffect(() => {
    if (localStoreData) {
      setLoginAgencyID(localStoreData?.AgencyID); setLoginPinID(localStoreData?.PINID);
    }
  }, [localStoreData])

  const colourStyles = {
    control: (styles) => ({
      ...styles, backgroundColor: "#fce9bf",
      height: 20,
      minHeight: 35,
      fontSize: 14,
      margintop: 2,
      boxShadow: 0,
    }),
  }

  const customStylesWithOutColor = {
    control: base => ({
      ...base,
      height: 20,
      minHeight: 35,
      fontSize: 14,
      margintop: 2,
      boxShadow: 0,
    }),
  };

  const check_Validation_Error = (e) => {
    // const LossCodeIDErr = RequiredFieldIncident(value.LossCodeID);
    const CategoryIDErr = RequiredFieldIncident(value.CategoryID);
    const PlateTypeIDErr = RequiredFieldIncident(value.PlateTypeID);
    const VehicleNoErr = value.PlateID === '' || value.PlateID === null ? 'true' : RequiredFieldIncident(value.VehicleNo);
    const ContactErr = lossCode === 'STOL' || lossCode === 'BURN' || lossCode === 'RECD' ? RequiredFieldOnConditon(value.Value) : 'true';
    const vinErr = value?.VIN.length > 0 && value?.VIN.length < 17 ? "Enter Minimum 17 Charecters" : 'true';

    setErrors(pre => {
      return {
        ...pre,
        // ['LossCodeIDError']: LossCodeIDErr || pre['LossCodeIDError'],
        ['CategoryIDError']: CategoryIDErr || pre['CategoryIDError'],
        ['PlateTypeIDError']: PlateTypeIDErr || pre['PlateTypeIDError'],
        ['ContactError']: ContactErr || pre['ContactError'],
        ['VehicleNoError']: VehicleNoErr || pre['VehicleNoError'],
        ['vinLengthError']: vinErr || pre['vinLengthError'],

      }
    });
  }
  return (
    <>
      <div className="col-12 ">
        <div className="row">
          <div className="col-2 col-md-2 col-lg-1 mt-2 ">
            <label htmlFor="" className='new-label'>Missing&nbsp;Vehicle</label>
          </div>
          <div className="col-4 col-md-4 col-lg-7  mt-1">
            <Select
              name='VehicleID'
              styles={colourStyles}
              value={vehicleData?.filter((obj) => obj.value === value?.VehicleID)}
              // onChange={(e) => ChangeDropDown(e, 'VehicleID')}
              options={vehicleData}
              isClearable
              placeholder="Select..."
            />
          </div>
        </div>
      </div>
      <div className="col-12 ">
        <div className="row">
          <div className="col-2 col-md-2 col-lg-2 mt-2 " style={{ display: "none" }}>
            <label htmlFor="" className='new-label'>Loss Code{errors.LossCodeIDError !== 'true' ? (
              <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.LossCodeIDError}</p>
            ) : null}</label>
          </div>
          <div className="col-4 col-md-4 col-lg-3 mt-1" style={{ display: "none" }}>
            <Select
              name='LossCodeID'
              value={propertyLossCodeData?.filter((obj) => obj.value === value?.LossCodeID)}
              styles={colourStyles}
              options={propertyLossCodeData}
              // onChange={(e) => ChangePhoneType(e, 'LossCodeID')}
              isClearable
              placeholder="Select..."
            />
          </div>
          <div className="col-2 col-md-2 col-lg-1 mt-2 ">
            <label htmlFor="" className='new-label'> Category {errors.CategoryIDError !== 'true' ? (
              <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.CategoryIDError}</p>
            ) : null}</label>
          </div>
          <div className="col-4 col-md-4 col-lg-2  mt-1">
            <Select
              name='CategoryID'
              value={categoryIdDrp?.filter((obj) => obj.value === value?.CategoryID)}
              styles={colourStyles}
              options={categoryIdDrp}
              // onChange={(e) => ChangeDropDown(e, 'CategoryID')}
              isClearable
              placeholder="Select..."
            />
          </div>
          <div className="col-2 col-md-2 col-lg-2 mt-2 ">
            <label htmlFor="" className='new-label'> Classification</label>
          </div>
          <div className="col-4 col-md-4 col-lg-3 mt-1">
            <Select
              name='ClassificationID'
              value={classificationID?.filter((obj) => obj.value === value?.ClassificationID)}
              styles={customStylesWithOutColor}
              options={classificationID}
              // onChange={(e) => ChangeDropDown(e, 'ClassificationID')}
              isClearable
              placeholder="Select..."
            />
          </div>
          <div className="col-2 col-md-2 col-lg-1 mt-2 ">
            <label htmlFor="" className='new-label'>OAN Id</label>
          </div>
          <div className="col-4 col-md-4 col-lg-3 mt-1 text-field ">
            <input type="text" name='OANID' id='OANID' value={value?.OANID} className='' required maxLength={20} autoComplete='off' />
          </div>
          <div className="col-2 col-md-2 col-lg-1 mt-2 ">
            {/* <label htmlFor="" className='new-label'>Plate Type{errors.PlateTypeIDError !== 'true' ? (
                                        <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.PlateTypeIDError}</p>
                                    ) : null}</label> */}
            <span data-toggle="modal" data-target="#ListModel" className='new-link ' onClick={() => { setOpenPage('Property Vehicle Plate Type') }}>
              Plate Type{errors.PlateTypeIDError !== 'true' ? (
                <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.PlateTypeIDError}</p>
              ) : null}
            </span>
          </div>
          <div className="col-4 col-md-4 col-lg-2 mt-1 ">
            <Select
              name='PlateTypeID'
              value={plateTypeIdDrp?.filter((obj) => obj.value === value?.PlateTypeID)}
              styles={colourStyles}
              options={plateTypeIdDrp}
              // onChange={(e) => ChangeDropDown(e, 'PlateTypeID')}
              isClearable
              placeholder="Select..."
            />
          </div>
          <div className="col-12 col-md-12 col-lg-5 d-flex ">
            <div className="col-2 col-md-2 col-lg-5 mt-2 pt-1 ">
              <label htmlFor="" className='new-label '>Plate&nbsp;State&nbsp;&&nbsp;No.</label>
            </div>
            <div className="col-4 col-md-6 col-lg-4 mt-1" >
              <Select
                name='PlateID'
                value={stateList?.filter((obj) => obj.value === value?.PlateID)}
                styles={customStylesWithOutColor}
                options={stateList}
                // onChange={(e) => ChangeDropDown(e, 'PlateID')}
                isClearable
                placeholder="Select..."
              />
            </div>
            <span className='' style={{ marginLeft: '-10px', marginTop: '-5px' }}>
              <div className="text-field col-12 col-md-12 col-lg-12 ">
                <input className={`${value.PlateID ? "requiredColor" : ''}`} type="text" name='VehicleNo' id='VehicleNo' maxLength={8} value={value?.VehicleNo} required placeholder='Number..' autoComplete='off' />
              </div>
              {errors.VehicleNoError !== 'true' && value.PlateID ? (
                <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.VehicleNoError}</p>
              ) : null}
            </span>
          </div>
          <div className="col-2 col-md-2 col-lg-2 mt-2 ">
            <label htmlFor="" className='new-label'>Plate Expires</label>
          </div>
          <div className="col-10 col-md-10 col-lg-2  ">
            <DatePicker
              id='PlateExpireDtTm'
              name='PlateExpireDtTm'
              // ref={startRef1}
              // onKeyDown={onKeyDown}
              onChange={(date) => { setPlateExpDate(date); setValue({ ...value, ['PlateExpireDtTm']: date ? getShowingMonthDateYear(date) : null }) }}
              dateFormat="MM/dd/yyyy"
              isClearable
              selected={plateExpDate}
              placeholderText={value?.PlateExpireDtTm ? value?.PlateExpireDtTm : 'Select...'}
              autoComplete="off"
              showYearDropdown
              showMonthDropdown
              dropdownMode="select"
            />
          </div>
          <div className="col-2 col-md-2 col-lg-1 mt-2 ">
            <label htmlFor="" className='new-label'>VIN {errors.vinLengthError !== 'true' ? (
              <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.vinLengthError}</p>
            ) : null}</label>
          </div>
          <div className="col-3 col-md-3 col-lg-2 mt-1 text-field d-flex">
            <input type="text" name='VIN' id='VIN' maxLength={17} value={value?.VIN} className='' required autoComplete='off' />
          </div>
          <div className="col-1 col-md-1 col-lg-1   px-0" style={{ marginTop: '8px' }}>
            <button
              className="btn btn-sm bg-green text-white py-0" data-toggle="modal" data-target="#MasterModal">
              <i className="fa fa-search "></i>
            </button>
          </div>
          <div className="col-2 col-md-2 col-lg-1 mt-2 ">
            {/* <label htmlFor="" className='new-label'>VOD </label> */}
            <span data-toggle="modal" data-target="#ListModel" className='new-link ' onClick={() => { setOpenPage('Vehicle VOD') }}>
              VOD
            </span>
          </div>
          <div className="col-4 col-md-4 col-lg-3 pt-1">
            <Select
              name='VODID'
              value={vodIdData?.filter((obj) => obj.value === value?.VODID)}
              styles={customStylesWithOutColor}
              options={vodIdData}
              // onChange={(e) => ChangeDropDown(e, 'VODID')}
              isClearable
              placeholder="Select..."
            />
          </div>


          <div className="col-2 col-md-2 col-lg-1 mt-2 ">
            {/* <label htmlFor="" className='new-label'>Style</label> */}
            <span data-toggle="modal" data-target="#ListModel" className='new-link ' onClick={() => { setOpenPage('Property Vehicle Style') }}>
              Style
            </span>
          </div>
          <div className="col-4 col-md-4 col-lg-3 mt-1 text-field ">
            <Select
              name='StyleID'
              value={styleIdDrp?.filter((obj) => obj.value === value?.StyleID)}
              styles={customStylesWithOutColor}
              options={styleIdDrp}
              // onChange={(e) => ChangeDropDown(e, 'StyleID')}
              isClearable
              placeholder="Select..."
            />
          </div>
          <div className="col-2 col-md-2 col-lg-1 mt-2 ">
            <label htmlFor="" className='new-label'>Owner</label>
          </div>
          <div className="col-3 col-md-3 col-lg-2 mt-1 ">
            <Select
              name='OwnerID'
              value={arresteeDrpData?.filter((obj) => obj.value === value?.OwnerID)}
              styles={customStylesWithOutColor}
              options={arresteeDrpData}
              // onChange={(e) => ChangeDropDown(e, 'OwnerID')}
              isClearable
              placeholder="Select..."
            />
          </div>
          <div className="col-1 col-md-1 col-lg-1   px-0" style={{ marginTop: '8px' }}>
            <button
              className="btn btn-sm bg-green text-white py-0" data-toggle="modal" data-target="#MasterModal">
              <i className="fa fa-plus"></i>
            </button>
          </div>
          <div className="col-2 col-md-2 col-lg-1 mt-2 ">
            {/* <label htmlFor="" className='new-label'>Make</label> */}
            <span data-toggle="modal" data-target="#ListModel" className='new-link ' onClick={() => { setOpenPage('Property Vehicle Make') }}>
              Make
            </span>
          </div>
          <div className="col-4 col-md-4 col-lg-3 mt-1 ">
            <Select
              name='MakeID'
              value={makeIdDrp?.filter((obj) => obj.value === value?.MakeID)}
              styles={customStylesWithOutColor}
              options={makeIdDrp}
              // onChange={(e) => ChangeDropDown(e, 'MakeID')}
              isClearable
              placeholder="Select..."
            />
          </div>
          <div className="col-2 col-md-2 col-lg-1 mt-2 ">
            <label htmlFor="" className='new-label'>Model</label>
          </div>
          <div className="col-4 col-md-4 col-lg-3 mt-1 ">
            <Select
              name='ModelID'
              value={modalIdDrp?.filter((obj) => obj.value === value?.ModelID)}
              styles={customStylesWithOutColor}
              options={modalIdDrp}
              // onChange={(e) => ChangeDropDown(e, 'ModelID')}
              isClearable
              placeholder="Select..."
            />
          </div>
          <div className="col-2 col-md-2 col-lg-1 mt-2 ">
            <label htmlFor="" className='new-label'>Weight</label>
          </div>
          <div className="col-4 col-md-4 col-lg-2 mt-1 text-field">
            <input type="text" name='Weight' id='Weight' maxLength={4} value={value?.Weight} className='' required autoComplete='off' />
          </div>
          <div className="col-2 col-md-2 col-lg-2 mt-2 ">
            {/* <label htmlFor="" className='new-label'>Primary Color</label> */}
            <span data-toggle="modal" data-target="#ListModel" className='new-link ' onClick={() => { setOpenPage('Color') }}>
              Primary Color
            </span>
          </div>
          <div className="col-4 col-md-4 col-lg-3 mt-1 ">
            <Select
              name='PrimaryColorID'
              value={colorDrp?.filter((obj) => obj.value === value?.PrimaryColorID)}
              styles={customStylesWithOutColor}
              options={colorDrp}
              // onChange={(e) => ChangeDropDown(e, 'PrimaryColorID')}
              isClearable
              placeholder="Select..."
            />
          </div>
          <div className="col-2 col-md-2 col-lg-2 mt-2 ">
            {/* <label htmlFor="" className='new-label'>Secondary Color</label> */}
            <span data-toggle="modal" data-target="#ListModel" className='new-link ' onClick={() => { setOpenPage('Color') }}>
              Secondary Color
            </span>
          </div>
          <div className="col-4 col-md-4 col-lg-2 mt-1">
            <Select
              name='SecondaryColorID'
              value={colorDrp?.filter((obj) => obj.value === value?.SecondaryColorID)}
              styles={customStylesWithOutColor}
              options={colorDrp}
              // onChange={(e) => ChangeDropDown(e, 'SecondaryColorID')}
              isClearable
              placeholder="Select..."
            />
          </div>
          <div className="col-2 col-md-2 col-lg-1 mt-2 ">
            <label htmlFor="" className='new-label'>Value {errors.ContactError !== 'true' ? (
              <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.ContactError}</p>
            ) : null}</label>
          </div>
          <div className="col-4 col-md-4 col-lg-2 mt-1 text-field">
            <input
              type="text"
              name="Value"
              id="Value"
              className={lossCode === 'STOL' || lossCode === 'BURN' || lossCode === 'RECD' ? 'requiredColor' : ''}
              maxLength={20}
              value={`$ ${value?.Value}`}

              required
              autoComplete="off"
            />
          </div>

          <div className="col-2 col-md-2 col-lg-2 mt-2 ">
            <label htmlFor="" className='new-label'>Mfg. Year</label>
          </div>
          <div className="col-4 col-md-4 col-lg-1 ">
            <DatePicker
              name='ManufactureYear'
              id='ManufactureYear'
              selected={manufactureDate}
              onChange={(date) => { setManufactureDate(date); setValue({ ...value, ['ManufactureYear']: date ? getYearWithOutDateTime(date) : null }) }}
              showYearPicker
              dateFormat="yyyy"
              yearItemNumber={9}
              // ref={startRef2}
              // onKeyDown={onKeyDown}
              autoComplete="off"
              showYearDropdown
              showMonthDropdown
              dropdownMode="select"
              maxDate={new Date()}
            />
          </div>
          <div className=" col-4 col-md-4 col-lg-1 pt-1 mt-3">
            <div className="img-box" style={{ marginTop: '-18px' }}>

            </div>
          </div>
        </div>
      </div>
      <div className="col-12 text-right  p-0 field-button" style={{ position: 'absolute', bottom: '10px', textAlign: 'right', right: "1rem" }}>
        <button type="button" className="btn btn-sm btn-success mr-1"  >New</button>
        <button type="button" className="btn btn-sm btn-success  mr-1" onClick={(e) => { check_Validation_Error(); }}>{missingVehicleID && (MissVehSta === true || MissVehSta || 'true') ? 'Update' : 'Save'}</button>
      </div>
    </>

  )
}

export default CitationVehicle
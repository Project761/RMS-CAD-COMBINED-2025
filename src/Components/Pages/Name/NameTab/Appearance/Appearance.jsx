import Select from "react-select";
import { useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from 'react';
import { AgencyContext } from "../../../../../Context/Agency/Index";
import { customStylesWithOutColor, Decrypt_Id_Name, isLockOrRestrictModule, LockFildscolour, } from "../../../../Common/Utility";
import { AddDeleteUpadate, fetchPostData } from "../../../../hooks/Api";
import { Comman_changeArrayFormat_With_Name } from "../../../../Common/ChangeArrayFormat";
import { toastifySuccess } from "../../../../Common/AlertMsg";
import { useDispatch, useSelector } from 'react-redux';
import { get_LocalStoreData } from '../../../../../redux/api';
import NameListing from '../../../ShowAllList/NameListing';
import { get_ScreenPermissions_Data } from '../../../../../redux/actions/IncidentAction';
import ChangesModal from '../../../../Common/ChangesModal';
import ListModal from '../../../Utility/ListManagementModel/ListModal';

const Appearance = (props) => {

  const { ListData, DecNameID, DecMasterNameID, isViewEventDetails = false, isLocked } = props

  const { setChangesStatus, setcountAppear } = useContext(AgencyContext);

  const dispatch = useDispatch();
  const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';


  const [loginAgencyID, setLoginAgencyID] = useState('');
  const [editval, setEditval] = useState([]);
  const [FaceColoIDDrp, setFaceColoIDDrp] = useState([]);
  const [ComplexionColoIDDrp, setComplexionColoIDDrp] = useState([]);
  const [HairStyleIDDrp, setHairStyleIDDrp] = useState([]);
  const [FacialHair1IDDrp, setFacialHair1IDDrp] = useState([]);
  const [DistinctFeature1IDDrp, setDistinctFeature1IDDrp] = useState([]);
  const [HairLengthIDDrp, setHairLengthIDDrp] = useState([]);
  const [FacialHair2IDDrp, setFacialHair2IDDrp] = useState([]);
  const [DistinctFeature2IDDrp, setDistinctFeature2IDDrp] = useState([]);
  const [HairShadeIDDrp, setHairShadeIDDrp] = useState([]);
  const [FacialOddity1IDDrp, setFacialOddity1IDDrp] = useState([]);
  const [BodyBuildIDDrp, setBodyBuildIDDrp] = useState([]);
  const [SpeechIDDrp, setSpeechIDDrp] = useState([]);
  const [FacialOddity2IDDrp, setFacialOddity2IDDrp] = useState([]);
  const [TeethIDDrp, setTeethIDDrp] = useState([]);
  const [GlassesIDDrp, setGlassesIDDrp] = useState([]);
  const [FacialOddity3IDDrp, setFacialOddity3IDDrp] = useState([]);
  const [HandednessIDDrp, setHandednessIDDrp] = useState([]);
  const [loginPinID, setLoginPinID] = useState('');
  const [openPage, setOpenPage] = useState('');
  const [statesChangeStatus, setStatesChangeStatus] = useState(false);
  const [permissionForAdd, setPermissionForAdd] = useState(false);
  const [permissionForEdit, setPermissionForEdit] = useState(false);
  const [addUpdatePermission, setaddUpdatePermission] = useState();

  const localStoreData = useSelector((state) => state.Agency.localStoreData);
  const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);


  const useQuery = () => {
    const params = new URLSearchParams(useLocation().search);
    return {
      get: (param) => params.get(param)
    };
  };

  const query = useQuery();
  let MstPage = query?.get('page');

  useEffect(() => {
    if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
      if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
    }
  }, []);

  useEffect(() => {
    if (localStoreData) {
      setLoginAgencyID(localStoreData?.AgencyID); setLoginPinID(localStoreData?.PINID);
      dispatch(get_ScreenPermissions_Data("N048", localStoreData?.AgencyID, localStoreData?.PINID));
    }
  }, [localStoreData]);

  const [value, setValue] = useState({
    'MasterNameID': null, 'NameID': null, 'FaceShapeID': null, 'ComplexionID': null, 'HairStyleID': null,
    'FacialHairID1': null, 'FacialHairID2': null, 'DistinctFeatureID1': null, 'DistinctFeatureID2': null,
    'HairLengthID': null, 'HairShadeID': null, 'FacialOddityID1': null, 'FacialOddityID2': null, 'FacialOddityID3': null,
    'BodyBuildID': null, 'SpeechID': null, 'TeethID': null, 'GlassesID': null, 'Clothing': '', 'HandednessID': null, 'CreatedByUserFK': null, 'ModifiedByUserFK': null,
    'IsMaster': MstPage === "MST-Name-Dash" ? true : false,
  });

  useEffect(() => {
    if (effectiveScreenPermission?.length > 0) {
      setPermissionForAdd(effectiveScreenPermission[0]?.AddOK);
      setPermissionForEdit(effectiveScreenPermission[0]?.Changeok);
      setaddUpdatePermission(effectiveScreenPermission[0]?.AddOK != 1 || effectiveScreenPermission[0]?.Changeok != 1 ? true : false);
    } else {
      setaddUpdatePermission(false);
    }
  }, [effectiveScreenPermission]);

  useEffect(() => {
    if (DecNameID || DecMasterNameID) {
      get_Single_Data(DecNameID, DecMasterNameID);
      setValue(pre => { return { ...pre, 'CreatedByUserFK': loginPinID, 'ModifiedByUserFK': loginPinID, 'MasterNameID': DecMasterNameID, 'NameID': DecNameID } });
    }
  }, [DecNameID, DecMasterNameID]);

  useEffect(() => {
    if (openPage || loginAgencyID) {
      get_Appearance_Drp_Data(loginAgencyID);
    }
  }, [openPage, loginAgencyID]);


  const get_Appearance_Drp_Data = (loginAgencyID) => {
    const val = { AgencyID: loginAgencyID, }
    fetchPostData('MasterName/GetAppearanceDropDown', val).then((data) => {
      if (data) {
        setFaceColoIDDrp(
          Comman_changeArrayFormat_With_Name(data[0]?.FacialShape, "FacialShapeID", "Description", "FaceShapeID")
        );
        setComplexionColoIDDrp(Comman_changeArrayFormat_With_Name(data[0]?.ComplexionType, "ComplexionID", "Description", "ComplexionID"));
        setHairStyleIDDrp(
          Comman_changeArrayFormat_With_Name(data[0]?.HairStyle, "HairStyleID", "Description", 'HairStyleID')
        );
        setFacialHair1IDDrp(
          Comman_changeArrayFormat_With_Name(data[0]?.FacialHair, "NameFacialHairID", "Description", "FacialHairID1")
        );
        setBodyBuildIDDrp(
          Comman_changeArrayFormat_With_Name(data[0]?.BodyBuild, "BodyBuildID", "Description", 'BodyBuildID')
        );
        setSpeechIDDrp(
          Comman_changeArrayFormat_With_Name(data[0]?.SpeechCode, "SpeechID", "Description", 'SpeechID')
        );
        setDistinctFeature1IDDrp(
          Comman_changeArrayFormat_With_Name(data[0]?.FeatureCode, "NameDistinctFeaturesCodeID", "Description", 'DistinctFeatureID1')
        );
        setHairLengthIDDrp(
          Comman_changeArrayFormat_With_Name(data[0]?.HairLength, "HairLengthID", "Description", 'HairLengthID')
        );
        setFacialHair2IDDrp(
          Comman_changeArrayFormat_With_Name(data[0]?.FacialHair, "NameFacialHairID", "Description", 'FacialHairID2')
        );
        setDistinctFeature2IDDrp(
          Comman_changeArrayFormat_With_Name(data[0]?.FeatureCode, "NameDistinctFeaturesCodeID", "Description", 'DistinctFeatureID2')
        );
        setHairShadeIDDrp(
          Comman_changeArrayFormat_With_Name(data[0]?.HairShades, "HairShadeID", "Description", 'HairShadeID')
        );
        setFacialOddity1IDDrp(
          Comman_changeArrayFormat_With_Name(data[0]?.FacialOddity, "OddityID", "Description", 'FacialOddityID1')
        );
        setFacialOddity2IDDrp(
          Comman_changeArrayFormat_With_Name(data[0]?.FacialOddity, "OddityID", "Description", 'FacialOddityID2')
        );
        setTeethIDDrp(
          Comman_changeArrayFormat_With_Name(data[0]?.TeethCode, "TeethID", "Description", 'TeethID')
        );
        setGlassesIDDrp(
          Comman_changeArrayFormat_With_Name(data[0]?.GlassType, "NameGlassesTypeID", "Description", 'GlassesID')
        );
        setFacialOddity3IDDrp(
          Comman_changeArrayFormat_With_Name(data[0]?.FacialOddity, "OddityID", "Description", 'FacialOddityID3')
        );
        setHandednessIDDrp(
          Comman_changeArrayFormat_With_Name(data[0]?.Handedness, "HandedID", "Description", 'HandednessID')
        );
      } else {
        setFaceColoIDDrp([]); setComplexionColoIDDrp([]); setHairStyleIDDrp([]); setFacialHair1IDDrp([]); setBodyBuildIDDrp([]);
        setSpeechIDDrp([]); setDistinctFeature1IDDrp([]); setHairLengthIDDrp([]); setFacialHair2IDDrp([]); setDistinctFeature2IDDrp([]);
        setHairShadeIDDrp([]); setFacialOddity1IDDrp([]); setTeethIDDrp([]); setGlassesIDDrp([]); setFacialOddity3IDDrp([]); setHandednessIDDrp([]);
        setFacialOddity2IDDrp([]);
      }
    })
  };

  useEffect(() => {
    if (editval && editval.length > 0) {
      const lastEditVal = editval[editval.length - 1];
      if (editval[0].FaceShapeID || editval[0].ComplexionID || editval[0].HairStyleID || editval[0].FacialHairID1 || editval[0].FacialHairID2 || editval[0].DistinctFeatureID1 || editval[0].DistinctFeatureID2 || editval[0].HairLengthID || editval[0].HairShadeID || editval[0].FacialOddityID1
        || editval[0].FacialOddityID2 || editval[0].FacialOddityID3 || editval[0].BodyBuildID || editval[0].SpeechID || editval[0].TeethID || editval[0].GlassesID || editval[0].Clothing || editval[0].HandednessID
      ) {

        setcountAppear(true)
      }
      else {
        setcountAppear(false)
      }
      setValue({
        ...value,
        'MasterNameID': DecMasterNameID,
        'NameID': DecNameID,
        'FaceShapeID': lastEditVal.FaceShapeID,
        'ComplexionID': lastEditVal.ComplexionID,
        'HairStyleID': lastEditVal.HairStyleID,
        'FacialHairID1': lastEditVal.FacialHairID1, 'FacialHairID2': lastEditVal.FacialHairID2, 'DistinctFeatureID1': lastEditVal.DistinctFeatureID1, 'DistinctFeatureID2': lastEditVal.DistinctFeatureID2,
        'HairLengthID': lastEditVal.HairLengthID, 'HairShadeID': lastEditVal.HairShadeID, 'FacialOddityID1': lastEditVal.FacialOddityID1, 'FacialOddityID2': lastEditVal.FacialOddityID2, 'FacialOddityID3': lastEditVal.FacialOddityID3,
        'BodyBuildID': lastEditVal.BodyBuildID, 'SpeechID': lastEditVal.SpeechID, 'TeethID': lastEditVal.TeethID, 'GlassesID': lastEditVal.GlassesID, 'Clothing': lastEditVal.Clothing, 'HandednessID': lastEditVal.HandednessID, 'CreatedByUserFK': lastEditVal.CreatedByUserFK,
        'ModifiedByUserFK': lastEditVal.CreatedByUserFK,
      });
    }
  }, [editval]);

  // Insert 
  const checkValidationErrors = () => {
    AddAppearance();
  };

  const AddAppearance = () => {
    AddDeleteUpadate('MasterName/Update_NameApperance', value).then((res) => {
      const parsedData = JSON.parse(res.data);
      const message = parsedData.Table[0].Message;

      setChangesStatus(false);
      const parseData = JSON.parse(res.data);
      get_Single_Data(DecNameID, DecMasterNameID);
      toastifySuccess(parseData?.Table[0].Message);

      setStatesChangeStatus(false);
    })
  }

  const resetState = () => {
    setStatesChangeStatus(false);
    setValue({
      ...value,
      'MasterNameID': null, 'NameID': null, 'FaceShapeID': null, 'ComplexionID': null, 'HairStyleID': null,
      'FacialHairID1': null, 'FacialHairID2': null, 'DistinctFeatureID1': null, 'DistinctFeatureID2': null,
      'HairLengthID': null, 'HairShadeID': null, 'FacialOddityID1': null, 'FacialOddityID2': null, 'FacialOddityID3': null,
      'BodyBuildID': null, 'SpeechID': null, 'TeethID': null, 'GlassesID': null, 'Clothing': '', 'HandednessID': null, 'CreatedByUserFK': null,
    })
  }

  const get_Single_Data = (DecNameID, DecMasterNameID) => {
    const val = { NameID: DecNameID, MasterNameID: DecMasterNameID, }
    const val2 = { MasterNameID: DecMasterNameID, NameID: 0, 'IsMaster': MstPage === "MST-Name-Dash" ? true : false, }

    fetchPostData('MasterName/GetSingleData_MasterName', MstPage ? val2 : val)
      .then((res) => {
        // console.log("🚀 ~ get_Single_Data ~ res:", res)
        if (res) { setEditval(res); }
        else { setEditval([]) }
      })
  }

  const ChangeDropDown = (e, name) => {
    !addUpdatePermission && setStatesChangeStatus(true);
    setValue(prevValue => {
      const updatedValue = {
        ...prevValue,
        [name]: e ? e.value : null
      };
      if (name === 'FacialOddityID1') {
        updatedValue.FacialOddityID2 = null;
        updatedValue.FacialOddityID3 = null;
      }
      if (name === 'FacialOddityID2') {
        updatedValue.FacialOddityID3 = null;
      }
      if (name === 'FacialHairID1') {
        updatedValue.FacialHairID2 = null;
      }
      if (name === 'DistinctFeatureID1') {
        updatedValue.DistinctFeatureID2 = null;
      }
      return updatedValue;
    });
    if (e) {
    } else if (e === null) {
    }
    !addUpdatePermission && setChangesStatus(true);
  };

  // handle change state
  const handleChange = (e, name) => {
    !addUpdatePermission && setStatesChangeStatus(true);
    if (e) {
      setValue({
        ...value,
        [e.target.name]: e.target.value
      })
      !addUpdatePermission && setChangesStatus(true)
    }
  }


  return (
    <>
      <NameListing  {...{ ListData }} />
      <div className="col-12 col-md-12 col-lg-12 pt-3">
        <fieldset>
          <legend>Appearance</legend>
          <div className="row mt-2">
            <div className="col-2 col-md-2 col-lg-1 mt-2 pt-1">
              <span data-toggle="modal" onClick={() => {
                setOpenPage('Facial Shape')
              }} data-target="#ListModel" className='new-link'>
                Face Shape
              </span>
            </div>
            <div className="col-4 col-md-4 col-lg-3 mt-2 px-3" >
              <Select
                name="Face Shape"
                value={FaceColoIDDrp?.filter((obj) => obj.value === value?.FaceShapeID)}
                options={FaceColoIDDrp}
                isClearable
                onChange={(e) => ChangeDropDown(e, 'FaceShapeID')}
                placeholder="Select Face Shape"
                // styles={customStylesWithOutColor}
                styles={isLockOrRestrictModule("Lock", editval[0]?.FaceShapeID, isLocked) ? LockFildscolour : customStylesWithOutColor}
                isDisabled={isLockOrRestrictModule("Lock", editval[0]?.FaceShapeID, isLocked) ? true : false}
              />
            </div>
            <div className="col-2 col-md-2 col-lg-1 mt-2 pt-1">

              <span data-toggle="modal" onClick={() => {
                setOpenPage('Complexion Type')
              }} data-target="#ListModel" className='new-link'>
                Complexion
              </span>
            </div>
            <div className="col-4 col-md-4 col-lg-3 mt-2" >
              <Select
                name="Complexion"
                styles={isLockOrRestrictModule("Lock", editval[0]?.ComplexionID, isLocked) ? LockFildscolour : customStylesWithOutColor}
                isDisabled={isLockOrRestrictModule("Lock", editval[0]?.ComplexionID, isLocked) ? true : false}

                value={ComplexionColoIDDrp?.filter((obj) => obj.value === value?.ComplexionID)}
                options={ComplexionColoIDDrp}
                isClearable
                onChange={(e) => ChangeDropDown(e, 'ComplexionID')}
                placeholder="Select Complexion"
              />
            </div>
            <div className="col-2 col-md-2 col-lg-1 mt-2 pt-1">

              <span data-toggle="modal" onClick={() => {
                setOpenPage('Hair Styles')
              }} data-target="#ListModel" className='new-link'>
                Hair Style
              </span>
            </div>
            <div className="col-4 col-md-4 col-lg-3 mt-2" >
              <Select
                name="HairStyle"
                styles={isLockOrRestrictModule("Lock", editval[0]?.HairStyleID, isLocked) ? LockFildscolour : customStylesWithOutColor}
                isDisabled={isLockOrRestrictModule("Lock", editval[0]?.HairStyleID, isLocked) ? true : false}

                value={HairStyleIDDrp?.filter((obj) => obj.value === value?.HairStyleID)}
                options={HairStyleIDDrp}
                isClearable
                onChange={(e) => ChangeDropDown(e, 'HairStyleID')}
                placeholder="Select Hair Style"
              />
            </div>
            <div className="col-2 col-md-2 col-lg-1 mt-3">

              <span data-toggle="modal" onClick={() => {
                setOpenPage('Name Facial Hair')
              }} data-target="#ListModel" className='new-link'>
                Facial Hair 1
              </span>
            </div>
            <div className="col-4 col-md-4 col-lg-3 mt-2 px-3" >
              <Select
                name="FaceHair1"
                styles={isLockOrRestrictModule("Lock", editval[0]?.FacialHairID1, isLocked) ? LockFildscolour : customStylesWithOutColor}
                isDisabled={isLockOrRestrictModule("Lock", editval[0]?.FacialHairID1, isLocked) ? true : false}

                value={FacialHair1IDDrp?.filter((obj) => obj.value === value?.FacialHairID1)}
                options={FacialHair1IDDrp}
                isClearable
                onChange={(e) => ChangeDropDown(e, 'FacialHairID1')}
                placeholder="Select Facial Hair 1"
              />
            </div>
            <div className="col-2 col-md-2 col-lg-1 mt-3 px-0">

              <span data-toggle="modal" onClick={() => {
                setOpenPage('Name Distinct Feature Code')
              }} data-target="#ListModel" className='new-link px-0'>
                Dist.&nbsp;Feature&nbsp;1
              </span>
            </div>
            <div className="col-4 col-md-4 col-lg-3 mt-2" >
              <Select
                name="DistinctFeature1"
                styles={isLockOrRestrictModule("Lock", editval[0]?.DistinctFeatureID1, isLocked) ? LockFildscolour : customStylesWithOutColor}
                isDisabled={isLockOrRestrictModule("Lock", editval[0]?.DistinctFeatureID1, isLocked) ? true : false}

                value={DistinctFeature1IDDrp?.filter((obj) => obj.value === value?.DistinctFeatureID1)}
                options={DistinctFeature1IDDrp}
                isClearable
                onChange={(e) => ChangeDropDown(e, 'DistinctFeatureID1')}
                placeholder="Select Distinct Feature 1"
              />
            </div>
            <div className="col-2 col-md-2 col-lg-1 mt-3">

              <span data-toggle="modal" onClick={() => {
                setOpenPage('Hair Length')
              }} data-target="#ListModel" className='new-link'>
                Hair Length
              </span>
            </div>
            <div className="col-4 col-md-4 col-lg-3 mt-2" >
              <Select
                name="HairLength"
                styles={isLockOrRestrictModule("Lock", editval[0]?.HairLengthID, isLocked) ? LockFildscolour : customStylesWithOutColor}
                isDisabled={isLockOrRestrictModule("Lock", editval[0]?.HairLengthID, isLocked) ? true : false}

                value={HairLengthIDDrp?.filter((obj) => obj.value === value?.HairLengthID)}
                options={HairLengthIDDrp}
                isClearable
                onChange={(e) => ChangeDropDown(e, 'HairLengthID')}
                placeholder="Select Hair Length"
              />
            </div>
            <div className="col-2 col-md-2 col-lg-1 mt-3">

              <span data-toggle="modal" onClick={() => {
                setOpenPage('Name Facial Hair')
              }} data-target="#ListModel" className='new-link'>
                Facial Hair 2
              </span>
            </div>
            <div className="col-4 col-md-4 col-lg-3 mt-2 px-3" >
              <Select
                name="FaceHair2"
                styles={isLockOrRestrictModule("Lock", editval[0]?.FacialHairID2, isLocked) ? LockFildscolour : customStylesWithOutColor}
                isDisabled={isLockOrRestrictModule("Lock", editval[0]?.FacialHairID2, isLocked) || !value.FacialHairID1 ? true : false}

                value={FacialHair2IDDrp?.filter((obj) => obj.value === value?.FacialHairID2)}
                options={FacialHair2IDDrp}
                isClearable
                onChange={(e) => ChangeDropDown(e, 'FacialHairID2')}
                placeholder="Select Facial Hair 2"
              />
            </div>
            <div className="col-2 col-md-2 col-lg-1 mt-3 px-0">

              <span data-toggle="modal" onClick={() => {
                setOpenPage('Name Distinct Feature Code')
              }} data-target="#ListModel" className='new-link px-0'>
                Dist.&nbsp;Feature&nbsp;2
              </span>
            </div>
            <div className="col-4 col-md-4 col-lg-3 mt-2" >
              <Select
                name="DistinctFeature2"
                styles={isLockOrRestrictModule("Lock", editval[0]?.DistinctFeatureID2, isLocked) ? LockFildscolour : customStylesWithOutColor}
                isDisabled={isLockOrRestrictModule("Lock", editval[0]?.DistinctFeatureID2, isLocked) || !value.DistinctFeatureID1 ? true : false}

                value={DistinctFeature2IDDrp?.filter((obj) => obj.value === value?.DistinctFeatureID2)}
                options={DistinctFeature2IDDrp}
                isClearable
                onChange={(e) => ChangeDropDown(e, 'DistinctFeatureID2')}
                placeholder="Select Distinct Feature 2"
              />
            </div>
            <div className="col-2 col-md-2 col-lg-1 mt-3">

              <span data-toggle="modal" onClick={() => {
                setOpenPage('Hair Shades')
              }} data-target="#ListModel" className='new-link'>
                Hair Shade
              </span>
            </div>
            <div className="col-4 col-md-4 col-lg-3 mt-2" >
              <Select
                name="HairShade"
                styles={isLockOrRestrictModule("Lock", editval[0]?.HairShadeID, isLocked) ? LockFildscolour : customStylesWithOutColor}
                isDisabled={isLockOrRestrictModule("Lock", editval[0]?.HairShadeID, isLocked) ? true : false}

                value={HairShadeIDDrp?.filter((obj) => obj.value === value?.HairShadeID)}
                options={HairShadeIDDrp}
                isClearable
                onChange={(e) => ChangeDropDown(e, 'HairShadeID')}
                placeholder="Select Hair Shade"
              />
            </div>
            <div className="col-2 col-md-2 col-lg-1 mt-3 px-0">

              <span data-toggle="modal" onClick={() => {
                setOpenPage('Facial Oddity')
              }} data-target="#ListModel" className='new-link'>
                Facial Oddity 1
              </span>
            </div>
            <div className="col-4 col-md-4 col-lg-3 mt-2 px-3" >
              <Select
                name="FacialOddity1"
                styles={isLockOrRestrictModule("Lock", editval[0]?.FacialOddityID1, isLocked) ? LockFildscolour : customStylesWithOutColor}
                isDisabled={isLockOrRestrictModule("Lock", editval[0]?.FacialOddityID1, isLocked) ? true : false}

                value={FacialOddity1IDDrp?.filter((obj) => obj.value === value?.FacialOddityID1)}
                options={FacialOddity1IDDrp}
                isClearable
                onChange={(e) => ChangeDropDown(e, 'FacialOddityID1')}
                placeholder="Select Facial Oddity 1"
              />
            </div>
            <div className="col-2 col-md-2 col-lg-1 mt-3 px-0">

              <span data-toggle="modal" onClick={() => {
                setOpenPage('Body Build')
              }} data-target="#ListModel" className='new-link'>
                Body Build
              </span>
            </div>
            <div className="col-4 col-md-4 col-lg-3 mt-2" >
              <Select
                name="BodyBuild"
                styles={isLockOrRestrictModule("Lock", editval[0]?.BodyBuildID, isLocked) ? LockFildscolour : customStylesWithOutColor}
                isDisabled={isLockOrRestrictModule("Lock", editval[0]?.BodyBuildID, isLocked) ? true : false}

                value={BodyBuildIDDrp?.filter((obj) => obj.value === value?.BodyBuildID)}
                options={BodyBuildIDDrp}
                isClearable
                onChange={(e) => ChangeDropDown(e, 'BodyBuildID')}
                placeholder="Select Body Build"
              />
            </div>
            <div className="col-2 col-md-2 col-lg-1 mt-3">

              <span data-toggle="modal" onClick={() => {
                setOpenPage('Speech Codes')
              }} data-target="#ListModel" className='new-link'>
                Speech
              </span>
            </div>
            <div className="col-4 col-md-4 col-lg-3 mt-2" >
              <Select
                name="Speech"
                styles={isLockOrRestrictModule("Lock", editval[0]?.SpeechID, isLocked) ? LockFildscolour : customStylesWithOutColor}
                isDisabled={isLockOrRestrictModule("Lock", editval[0]?.SpeechID, isLocked) ? true : false}

                value={SpeechIDDrp?.filter((obj) => obj.value === value?.SpeechID)}
                options={SpeechIDDrp}
                isClearable
                onChange={(e) => ChangeDropDown(e, 'SpeechID')}
                placeholder="Select Speech"
              />
            </div>
            <div className="col-2 col-md-2 col-lg-1 mt-3 px-0">

              <span data-toggle="modal" onClick={() => {
                setOpenPage('Facial Oddity')
              }} data-target="#ListModel" className='new-link px-0'>
                Facial&nbsp;Oddity&nbsp;2
              </span>
            </div>
            <div className="col-4 col-md-4 col-lg-3 mt-2 px-3" >
              <Select
                name="FacialOddity2"
                styles={isLockOrRestrictModule("Lock", editval[0]?.FacialOddityID2, isLocked) ? LockFildscolour : customStylesWithOutColor}
                isDisabled={isLockOrRestrictModule("Lock", editval[0]?.FacialOddityID2, isLocked) || !value.FacialOddityID1 ? true : false}

                value={FacialOddity2IDDrp?.filter((obj) => obj.value === value?.FacialOddityID2)}
                options={FacialOddity2IDDrp}
                isClearable
                // isDisabled={!value.FacialOddityID1} // Disable if FacialOddityID1 is not selected
                onChange={(e) => ChangeDropDown(e, 'FacialOddityID2')}
                placeholder="Select Facial Oddity 2"
              />
            </div>
            <div className="col-2 col-md-2 col-lg-1 mt-3 px-0">

              <span data-toggle="modal" onClick={() => {
                setOpenPage('Teeth Code')
              }} data-target="#ListModel" className='new-link'>
                Teeth
              </span>
            </div>
            <div className="col-4 col-md-4 col-lg-3 mt-2" >
              <Select
                name="Teeth"
                styles={isLockOrRestrictModule("Lock", editval[0]?.TeethID, isLocked) ? LockFildscolour : customStylesWithOutColor}
                isDisabled={isLockOrRestrictModule("Lock", editval[0]?.TeethID, isLocked) ? true : false}

                value={TeethIDDrp?.filter((obj) => obj.value === value?.TeethID)}
                options={TeethIDDrp}
                isClearable
                onChange={(e) => ChangeDropDown(e, 'TeethID')}
                placeholder="Select Teeth"
              />
            </div>
            <div className="col-2 col-md-2 col-lg-1 mt-3">

              <span data-toggle="modal" onClick={() => {
                setOpenPage('Name Glass Type')
              }} data-target="#ListModel" className='new-link'>
                Glasses
              </span>

            </div>
            <div className="col-4 col-md-4 col-lg-3 mt-2" >
              <Select
                name="Glasses"
                styles={isLockOrRestrictModule("Lock", editval[0]?.GlassesID, isLocked) ? LockFildscolour : customStylesWithOutColor}
                isDisabled={isLockOrRestrictModule("Lock", editval[0]?.GlassesID, isLocked) ? true : false}

                value={GlassesIDDrp?.filter((obj) => obj.value === value?.GlassesID)}
                options={GlassesIDDrp}
                isClearable
                onChange={(e) => ChangeDropDown(e, 'GlassesID')}
                placeholder="Select Glasses"
              />
            </div>
            <div className="col-2 col-md-2 col-lg-1 mt-3 px-0">

              <span data-toggle="modal" onClick={() => {
                setOpenPage('Facial Oddity')
              }} data-target="#ListModel" className='new-link'>
                Facial&nbsp;Oddity&nbsp;3
              </span>
            </div>
            <div className="col-4 col-md-4 col-lg-3 mt-2 px-3" >
              <Select
                name="FacialOddity3"
                styles={isLockOrRestrictModule("Lock", editval[0]?.FacialOddityID3, isLocked) ? LockFildscolour : customStylesWithOutColor}
                isDisabled={isLockOrRestrictModule("Lock", editval[0]?.FacialOddityID3, isLocked) || !value.FacialOddityID1 || !value.FacialOddityID2 ? true : false}

                value={FacialOddity3IDDrp?.filter((obj) => obj.value === value?.FacialOddityID3)}
                options={FacialOddity3IDDrp}
                isClearable
                // isDisabled={!value.FacialOddityID1 || !value.FacialOddityID2} // Disable if either FacialOddityID1 or FacialOddityID2 is not selected
                onChange={(e) => ChangeDropDown(e, 'FacialOddityID3')}
                placeholder="Select Facial Oddity 3"
              />
            </div>
            <div className="col-2 col-md-2 col-lg-1 mt-3 px-0">
              <label htmlFor="" className='label-name '>Clothing</label>
            </div>
            <div className="col-4 col-md-4 col-lg-3 mt-2 text-field" >
              <input type="text" className=' ' name='Clothing' value={value?.Clothing} onChange={handleChange} />
            </div>
            <div className="col-2 col-md-2 col-lg-1 mt-3">

              <span data-toggle="modal" onClick={() => {
                setOpenPage('Handedness')
              }} data-target="#ListModel" className='new-link'>
                Handedness
              </span>
            </div>
            <div className="col-4 col-md-4 col-lg-3 mt-2" >
              <Select
                name="Handedness"
                styles={isLockOrRestrictModule("Lock", editval[0]?.HandednessID, isLocked) ? LockFildscolour : customStylesWithOutColor}
                isDisabled={isLockOrRestrictModule("Lock", editval[0]?.HandednessID, isLocked) ? true : false}

                value={HandednessIDDrp?.filter((obj) => obj.value === value?.HandednessID)}
                options={HandednessIDDrp}
                isClearable
                onChange={(e) => ChangeDropDown(e, 'HandednessID')}
                placeholder="Select Handedness"
              />
            </div>

          </div>
        </fieldset>
        {!isViewEventDetails &&
          <div className="col-12  text-right mt-3 p-0">

            {
              effectiveScreenPermission ?
                effectiveScreenPermission[0]?.Changeok ?
                  <button type="button" className="btn btn-md py-1 btn-success pl-2  text-center" disabled={!statesChangeStatus} onClick={() => { checkValidationErrors(); }} >Update</button>
                  :
                  <>
                  </>
                :
                <button type="button" className="btn btn-md py-1 btn-success pl-2  text-center" disabled={!statesChangeStatus} onClick={() => { checkValidationErrors(); }} >Update</button>
            }

          </div>}
      </div>
      {/* <IdentifyFieldColor /> */}
      <ListModal {...{ openPage, setOpenPage }} />
      <ChangesModal func={checkValidationErrors} />
    </>
  )
}

export default Appearance
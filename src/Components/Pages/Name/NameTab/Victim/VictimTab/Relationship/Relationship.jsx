import { useEffect, useState, useContext } from 'react'
import { useLocation } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { AddDeleteUpadate, fetchPostData } from '../../../../../../hooks/Api';
import { toastifyError, toastifySuccess } from '../../../../../../Common/AlertMsg';
import { AgencyContext } from '../../../../../../../Context/Agency/Index';
import Select from "react-select";
import { RequiredFieldIncident } from '../../../../../Utility/Personnel/Validation';
import { Comman_changeArrayFormat, threeColArray } from '../../../../../../Common/ChangeArrayFormat';
import { isLockOrRestrictModule, LockFildscolour, nibrscolourStyles, Requiredcolour, tableCustomStyles } from '../../../../../../Common/Utility';
import { useDispatch, useSelector } from 'react-redux';
import { get_LocalStoreData } from '../../../../../../../redux/api';
import { Decrypt_Id_Name } from '../../../../../../Common/Utility';
import ChangesModal from '../../../../../../Common/ChangesModal';
import { checkOffenderIsUnknown, ErrorTooltipComp, VectimOffenderSpouceError } from '../../../../NameNibrsErrors';
import ListModal from '../../../../../Utility/ListManagementModel/ListModal';
import { get_ScreenPermissions_Data } from '../../../../../../../redux/actions/IncidentAction';

const Relationship = (props) => {

  const { DecNameID, victimID, DecIncID, nameSingleData, isCrimeAgainsPerson, isLocked } = props

  const dispatch = useDispatch();
  const localStoreData = useSelector((state) => state.Agency.localStoreData);
  const loginAgencyState = useSelector((state) => state.Ip.loginAgencyState);
  const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
  const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);

  const { get_NameVictim_Count, get_Name_Count, setChangesStatus } = useContext(AgencyContext);

  const useQuery = () => {
    const params = new URLSearchParams(useLocation().search);
    return {
      get: (param) => params.get(param)
    };
  };

  const query = useQuery();
  let MstPage = query?.get('page');

  const [clickedRow, setClickedRow] = useState(null);
  const [relationshipData, setRelationshipData] = useState([]);
  const [status, setStatus] = useState(false);
  const [RelationshipID, setRelationshipID] = useState('');
  const [editCount, setEditCount] = useState(0);
  const [relationShipDrp, setRelationShipDrp] = useState([]);
  const [name, setName] = useState([]);
  const [singleData, setSingleData] = useState([]);
  const [updateStatus, setUpdateStatus] = useState(0);
  const [loginPinID, setLoginPinID,] = useState('');
  const [loginAgencyID, setLoginAgencyID] = useState('');
  const [nameID, setNameID] = useState('');
  const [statesChangeStatus, setStatesChangeStatus] = useState(false);
  const [selectedNameData, setSelectedNameData] = useState([]);
  const [relationTypeCode, setRelationTypeCode] = useState([]);

  const [openPage, setOpenPage] = useState('');

  useEffect(() => {
    if (localStoreData) {
      setLoginAgencyID(localStoreData?.AgencyID); setLoginPinID(localStoreData?.PINID);
    }
    get_NameVictim_Count(victimID);
    get_Name_Count(DecNameID);
  }, [localStoreData]);

  useEffect(() => {
    if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
      if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
    }
  }, []);

  useEffect(() => {
    if (DecNameID) { setNameID(DecNameID); setValue({ ...value, 'CreatedByUserFK': loginPinID, }) }
    get_Name_Count(DecNameID)
  }, [DecNameID, loginPinID,]);

  const [value, setValue] = useState({
    'Code': 'VIC',
    'IncidentID': DecIncID,
    'VictimID': victimID,
    'NameID': DecNameID,
    'RelationshipTypeID': '',
    'VictimNameID': '',
    'OffenderNameID': '',
    'ModifiedByUserFK': '',
    'RelationshipID': '',

  });

  const [errors, setErrors] = useState({
    'RelationshipTypeIDErrors': '', 'VictimNameIDErrors': '',
  })

  const check_Validation_Error = (e) => {
    const RelationshipTypeIDErr = isCrimeAgainsPerson ? RequiredFieldIncident(value.RelationshipTypeID) : 'true';
    const OffenderNameIDErr = isCrimeAgainsPerson ? RequiredFieldIncident(value.OffenderNameID) : 'true';

    setErrors(prevValues => {
      return {
        ...prevValues,
        ['RelationshipTypeIDErrors']: RelationshipTypeIDErr || prevValues['RelationshipTypeIDErrors'],
        ['VictimNameIDErrors']: OffenderNameIDErr || prevValues['VictimNameIDErrors'],
      }
    })
  }

  useEffect(() => {
    if (localStoreData) {
      setLoginAgencyID(localStoreData?.AgencyID); setLoginPinID(localStoreData?.PINID);
      dispatch(get_ScreenPermissions_Data("N136", localStoreData?.AgencyID, localStoreData?.PINID));
    }
  }, [localStoreData]);

  // Check All Field Format is True Then Submit 
  const { RelationshipTypeIDErrors, VictimNameIDErrors } = errors

  useEffect(() => {
    if (RelationshipTypeIDErrors === 'true' && VictimNameIDErrors === 'true') {
      if (status && RelationshipID) update_Relationship()
      else save_Relationship()
    }
  }, [RelationshipTypeIDErrors, VictimNameIDErrors])

  useEffect(() => {
    get_Data_RelationShip_Drp(loginAgencyID); get_Data_Name_Drp(DecIncID, DecNameID); Get_Relationship_Data(DecNameID);
  }, [DecNameID, DecIncID, loginAgencyID])

  useEffect(() => {
    if (singleData[0]?.RelationshipID && RelationshipID) {
      setValue(pre => {
        return {
          ...pre,
          RelationshipTypeID: singleData[0]?.RelationshipTypeID,
          VictimNameID: singleData[0]?.VictimNameID,
          OffenderNameID: singleData[0]?.OffenderNameID,
          ModifiedByUserFK: loginPinID,
          RelationshipID: singleData[0]?.RelationshipID,
        }
      });
      singleData[0]?.OffenderNameID && getSelectedNameSingleData(singleData[0]?.OffenderNameID);
      singleData[0]?.OffenderNameID && setRelationTypeCode(Get_RelationType_Code(singleData, relationShipDrp))
    } else {
      resetHooks()
    }
  }, [singleData, editCount])

  const get_Data_RelationShip_Drp = (loginAgencyID) => {
    const val = { 'AgencyID': loginAgencyID, }
    fetchPostData('VictimRelationshipType/GetDataDropDown_VictimRelationshipType', val).then((data) => {
      if (data) {
        setRelationShipDrp(threeColArray(data, 'VictimRelationshipTypeID', 'Description', 'VictimRelationshipTypeCode'))
      } else {
        setRelationShipDrp([])
      }
    })
  }

  const get_Data_Name_Drp = (DecIncID, DecNameID) => {
    const val = { 'IncidentID': DecIncID, 'NameID': DecNameID, }
    fetchPostData('NameRelationship/GetDataDropDown_OffenderName', val).then((data) => {
      if (data) {
        setName(Comman_changeArrayFormat(data, 'NameID', 'Name'))
      } else {
        setName([])
      }
    })
  }

  const get_Single_Data = (RelationshipID) => {
    const val = { 'RelationshipID': RelationshipID, }
    fetchPostData('NameRelationship/GetSingleData_NameRelationship', val).then((data) => {
      if (data) {
        setSingleData(data)
      } else {
        setSingleData([])
      }
    })
  }

  const ChangeDropDown = (e, name) => {
    setStatesChangeStatus(true); setChangesStatus(true);
    if (e) {
      if (name === 'OffenderNameID') {
        setValue({ ...value, [name]: e.value });
        getSelectedNameSingleData(e.value)
      } else if (name === 'RelationshipTypeID') {
        setRelationTypeCode(e?.id);

        setValue({ ...value, [name]: e.value });

      } else {
        setValue({ ...value, [name]: e.value });
      }
    } else {
      if (name === 'OffenderNameID') {
        setValue({ ...value, [name]: null });
        setSelectedNameData([]);
      } else if (name === 'RelationshipTypeID') {
        setValue({ ...value, [name]: null });
        setRelationTypeCode('');
      } else {
        setValue({ ...value, [name]: null });
      }
    }
  }

  const getSelectedNameSingleData = (nameID, masterNameID) => {
    const val = { 'NameID': nameID, 'MasterNameID': masterNameID, 'IsMaster': false, }
    fetchPostData('MasterName/GetSingleData_MasterName', val).then((res) => {
      if (res) {
        setSelectedNameData(res[0]);
      } else { setSelectedNameData([]) }
    })
  }

  const save_Relationship = () => {
    const result = relationshipData?.find(item => {
      if (item.OffenderNameID === value.OffenderNameID && item.RelationshipTypeID === value.RelationshipTypeID) {
        return item.OffenderNameID === value.OffenderNameID && item.RelationshipTypeID === value.RelationshipTypeID
      } else return item.OffenderNameID === value.OffenderNameID && item.RelationshipTypeID === value.RelationshipTypeID
    });
    if (result) {

      toastifyError('Offender Name And Relationship Type Already Exists');
      setErrors({ ...errors, ['RelationshipTypeIDErrors']: '' });
    } else {

      if (value.OffenderNameID && value.RelationshipTypeID) {
        AddDeleteUpadate('NameRelationship/Insert_NameRelationship', value).then((data) => {
          if (data.success) {
            const parsedData = JSON.parse(data.data);
            const message = parsedData.Table[0].Message;
            if (message === 'Victim-Offender Relationship Already Present') {
              toastifyError(message); setErrors({ ...errors, 'RelationshipTypeIDErrors': '', ' VictimNameIDErrors': '', });
            } else {
              toastifySuccess(message);
              Get_Relationship_Data(nameID); setStatus(false); resetHooks(); get_NameVictim_Count(victimID)
              get_Name_Count(DecNameID);
              setStatesChangeStatus(false); setChangesStatus(false)
              setErrors({ ...errors, 'RelationshipTypeIDErrors': '', ' VictimNameIDErrors': '', });
            }
          } else {
            toastifyError(data.Message)
          }
        })
      } else {
        toastifyError('Please select Offender Name and Relationship Type');
        setErrors({ ...errors, 'RelationshipTypeIDErrors': '', 'VictimNameIDErrors': '', });
      }

    }
  }

  const update_Relationship = () => {
    const result = relationshipData?.find(item => {
      if (item?.RelationshipID != value['RelationshipID']) {
        if (item.OffenderNameID === value.OffenderNameID && item.RelationshipTypeID === value.RelationshipTypeID) {
          return item.OffenderNameID === value.OffenderNameID && item.RelationshipTypeID === value.RelationshipTypeID
        } else return item.OffenderNameID === value.OffenderNameID && item.RelationshipTypeID === value.RelationshipTypeID
      }
    });
    if (result) {
      toastifyError('Offender & Relationship Already Exists')
      setErrors({ ...errors, ['RelationshipTypeIDErrors']: '' })
    } else {
      AddDeleteUpadate('NameRelationship/Update_NameRelationship', value).then((data) => {
        if (data.success) {
          const parsedData = JSON.parse(data.data);
          const message = parsedData.Table[0].Message;
          toastifySuccess(message);
          Get_Relationship_Data(nameID); setStatus(true);
          setStatesChangeStatus(false); setChangesStatus(false)
          get_Name_Count(DecNameID);
          resetHooks();
          setErrors({
            ...errors,
            'RelationshipTypeIDErrors': '', ' VictimNameIDErrors': '',
          });
        } else {
          toastifyError(data.Message)
        }
      })
    }
  }

  const resetHooks = () => {
    setValue({ ...value, RelationshipTypeID: '', VictimNameID: '', OffenderNameID: '', ModifiedByUserFK: '', RelationshipID: '', });
    setStatesChangeStatus(false); setChangesStatus(false); setRelationshipID(''); setStatus(false);
    setErrors({ ...errors, 'RelationshipTypeIDErrors': '', ' VictimNameIDErrors': '', });
    setSelectedNameData([]); setRelationTypeCode('');
    // setSingleData([]);
  }

  const Get_Relationship_Data = (nameID) => {
    const val = { 'Code': 'VIC', 'NameID': nameID, }
    fetchPostData('NameRelationship/GetData_NameRelationship', val).then((res) => {
      if (res) {
        setRelationshipData(res)
      } else {
        setRelationshipData([]);
      }
    })
  }

  const columns = [

    {
      name: 'Name',
      selector: (row) => row.OffenderName,
      sortable: true
    },
    {
      name: 'Relationship',
      selector: (row) => row.RelationshipType_Description,
      sortable: true
    },
    {
      name: <p className='text-end' style={{ position: 'absolute', top: '7px', right: '10px' }}>Delete</p>,


      cell: row =>
        <div style={{ position: 'absolute', top: 4, right: 10 }}>
          {
            effectiveScreenPermission ?
              effectiveScreenPermission[0]?.DeleteOK ?
                <span onClick={(e) => { setRelationshipID(row.RelationshipID); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#RelationshipId">
                  <i className="fa fa-trash"></i>
                </span>
                : <></>
              : <span onClick={(e) => { setRelationshipID(row.RelationshipID); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#RelationshipId">
                <i className="fa fa-trash"></i>
              </span>
          }

        </div>
    }
  ];

  const DeleteRelationship = () => {
    const val = { 'RelationshipID': RelationshipID, 'DeletedByUserFK': loginPinID, }
    AddDeleteUpadate('NameRelationship/Delete_NameRelationship', val).then((res) => {
      if (res) {
        const parsedData = JSON.parse(res.data);
        const message = parsedData.Table[0].Message;
        toastifySuccess(message);

        setEditCount(editCount + 1)
        Get_Relationship_Data(nameID); setChangesStatus(false)
        get_NameVictim_Count(victimID)
        resetHooks(); setStatusFalse()
      } else { toastifyError("Somthing Wrong"); }
    })
  }

  const withoutcolourStyles = {
    control: (styles) => ({
      ...styles,
      height: 20,
      minHeight: 35,
      fontSize: 14,
      margintop: 2,
      boxShadow: 0,
    }),
  }

  const conditionalRowStyles = [
    {
      when: row => row === clickedRow,
      style: {
        backgroundColor: '#001f3fbd',
        color: 'white',
        cursor: 'pointer',
      },
    },
  ];

  const set_Edit_Value = (row) => {
    get_Single_Data(row.RelationshipID)
    setStatus(true);

    setRelationshipID(row.RelationshipID);
    setStatesChangeStatus(false);
    setErrors({});
  }

  const setStatusFalse = (e) => {
    setSingleData([]);
    setClickedRow(null);
    resetHooks();
    setStatus(false)
    setStatesChangeStatus(false);
    setUpdateStatus(updateStatus + 1);
    setErrors({});
  }

  const getRelationNibrsError = (RelationTypeCode, type) => {
    const validCodes = ["SE", "CS", "PA", "SB", "CH", "GP", "GC", "IL", "SP", "SC", "SS", "OF", "AQ", "FR", "NE", "BE", "BG", "CF", "XS", "EE", "ER", "OK", "RU", "ST", "VO", "HR", "XB"];
    if (RelationTypeCode) {
      if (validCodes.includes(RelationTypeCode)) {
        if (RelationTypeCode == "SE") {
          return relationTypeCode == "SE" && nameSingleData[0]?.AgeFrom < 13 ? type === 'Color' ? nibrscolourStyles : <ErrorTooltipComp ErrorStr={VectimOffenderSpouceError} /> : false

        } else if (RelationTypeCode === "PA" || RelationTypeCode === "GP") {
          return selectedNameData?.AgeFrom > nameSingleData[0]?.AgeFrom ? type === 'Color' ? nibrscolourStyles : <ErrorTooltipComp ErrorStr={'the victim’s age must be greater than the offender’s age.'} /> : false

        } else if (RelationTypeCode === "CH" || RelationTypeCode === "GC") {
          return selectedNameData?.AgeFrom < nameSingleData[0]?.AgeFrom ? type === 'Color' ? nibrscolourStyles : <ErrorTooltipComp ErrorStr={'the victim’s age must be less than the offender’s age.'} /> : false

        }
        else {
          return false

        }
      } else {
        return type === 'Color' ? nibrscolourStyles : <ErrorTooltipComp ErrorStr={"Invalid Relationship Type"} />

      }
    } else if (name?.length > 0 && relationshipData?.length === 0) {
      return type === 'Color' ? nibrscolourStyles : <ErrorTooltipComp ErrorStr={"Data must be entered"} />
    } else {
      return false

    }
  }

  return (
    <>
      <div className="col-12 col-md-12 mt-2" >
        <div className="row">
          <div className="col-2 col-md-2 col-lg-2 mt-3">
            <label htmlFor="" className='label-name '>
              Offender
              {errors.VictimNameIDErrors !== 'true' ? (
                <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.VictimNameIDErrors}</p>
              ) : null}</label>
          </div>
          <div className="col-4 col-md-4 col-lg-4  mt-2" >
            <Select
              name='OffenderNameID'
              styles={
                isLockOrRestrictModule("Lock", singleData[0]?.OffenderNameID, isLocked) ? LockFildscolour :
                  loginAgencyState === 'TX' ?
                    isCrimeAgainsPerson ? getRelationNibrsError(relationTypeCode, 'Color') ? getRelationNibrsError(relationTypeCode, 'Color') : Requiredcolour : withoutcolourStyles
                    :
                    Requiredcolour
              }
              isDisabled={isLockOrRestrictModule("Lock", singleData[0]?.OffenderNameID, isLocked)}
              isClearable
              value={name?.filter((obj) => obj.value === value.OffenderNameID)}
              options={name}
              onChange={(e) => { ChangeDropDown(e, 'OffenderNameID'); }}
              placeholder="Select.."
            />
          </div>
          <div className="col-2 col-md-2 col-lg-2 mt-3">
            <span data-toggle="modal" onClick={() => { setOpenPage('Relationship Type') }} data-target="#ListModel" className='new-link'>
              Relationship
              {
                loginAgencyState === 'TX' ?
                  checkOffenderIsUnknown(relationTypeCode, selectedNameData, 'ToolTip')
                  :
                  <></>
              }
              {errors.RelationshipTypeIDErrors !== 'true' ? (
                <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.RelationshipTypeIDErrors}</p>
              ) : null}
            </span>
          </div>
          <div className="col-4 col-md-4 col-lg-4  mt-2" >
            <Select
              name='RelationshipTypeID'
              styles={
                isLockOrRestrictModule("Lock", singleData[0]?.RelationshipTypeID, isLocked) ? LockFildscolour :
                  loginAgencyState === 'TX' ?
                    isCrimeAgainsPerson ? checkOffenderIsUnknown(relationTypeCode, selectedNameData, 'Color') : withoutcolourStyles
                    :
                    Requiredcolour
              }
              isDisabled={isLockOrRestrictModule("Lock", singleData[0]?.RelationshipTypeID, isLocked)}
              isClearable
              value={relationShipDrp?.filter((obj) => obj.value === value.RelationshipTypeID)}
              options={relationShipDrp}
              onChange={(e) => { ChangeDropDown(e, 'RelationshipTypeID'); }}
              placeholder="Select.."
            />
          </div>
          <div className="btn-box text-right col-12 col-md-12 col-lg-12 mt-2 mr-1 mb-2">
            <button type="button" data-dismiss="modal" className="btn btn-sm btn-success mr-1" onClick={() => { setStatusFalse(); setUpdateStatus(updateStatus + 1); }}>New</button>
            {
              status ?
                effectiveScreenPermission ?
                  effectiveScreenPermission[0]?.Changeok ?
                    <button type="button" className="btn btn-sm btn-success mr-1" disabled={!statesChangeStatus} onClick={(e) => { check_Validation_Error(); }}>Update</button>
                    :
                    <>
                    </>
                  :
                  <button type="button" className="btn btn-sm btn-success mr-1" disabled={!statesChangeStatus} onClick={(e) => { check_Validation_Error(); }}>Update</button>
                :
                effectiveScreenPermission ?
                  effectiveScreenPermission[0]?.AddOK ?
                    <button type="button" className="btn btn-sm btn-success mr-1" onClick={(e) => { check_Validation_Error(); }}>Save</button>
                    :
                    <>
                    </>
                  :
                  <button type="button" className="btn btn-sm btn-success mr-1" onClick={(e) => { check_Validation_Error(); }}>Save</button>
            }

          </div>
        </div>
        <div className="row ">
          <div className="col-12 ">
            <div className="table-responsive">
              <DataTable
                dense
                columns={columns}
                data={relationshipData}
                highlightOnHover
                customStyles={tableCustomStyles}
                onRowClicked={(row) => {
                  setClickedRow(row);
                  set_Edit_Value(row);
                }}
                fixedHeader
                persistTableHead
                fixedHeaderScrollHeight='80px'
                pagination
                paginationPerPage={'100'}
                paginationRowsPerPageOptions={[100, 150, 200, 500]}
                conditionalRowStyles={conditionalRowStyles}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade" data-backdrop="false" style={{ background: "rgba(0,0,0, 0.5)" }} id="RelationshipId" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="box text-center py-5">
              <h5 className="modal-title mt-2" id="exampleModalLabel">Are you sure you want to delete this record ?</h5>
              <div className="btn-box mt-3">
                <button type="button" onClick={DeleteRelationship} className="btn btn-sm text-white" style={{ background: "#ef233c" }} data-dismiss="modal">Delete</button>
                <button type="button" className="btn btn-sm btn-secondary ml-2 " data-dismiss="modal">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ChangesModal func={check_Validation_Error} />
      <ListModal {...{ openPage, setOpenPage }} />
    </>
  )
}

export default Relationship

const Get_RelationType_Code = (data, dropDownData) => {

  const result = data?.map((sponsor) => (sponsor.RelationshipTypeID));
  const result2 = dropDownData?.map((sponsor) => {
    if (sponsor.value === result[0]) {
      return { value: result[0], label: sponsor.label, id: sponsor.id }
    }
  })
  const val = result2.filter(function (element) {
    return element !== undefined;
  });
  return val[0]?.id
};
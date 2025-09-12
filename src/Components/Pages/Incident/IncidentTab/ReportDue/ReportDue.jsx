import React, { useContext, useRef, useState, useEffect } from 'react'
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';
import Select from "react-select";
import { toastifySuccess } from '../../../../Common/AlertMsg';
import { Comman_changeArrayFormat } from '../../../../Common/ChangeArrayFormat';
import DeletePopUpModal from '../../../../Common/DeleteModal';
import { Decrypt_Id_Name, tableCustomStyles } from '../../../../Common/Utility';
import { fetchPostData, AddDeleteUpadate, ScreenPermision } from '../../../../hooks/Api';
import { RequiredFieldIncident } from '../../../Utility/Personnel/Validation';
import FindListDropDown from '../../../../Common/FindListDropDown';
import { IncReportListDropDownArray } from '../../../../Utility/ListDropDownArray/ListDropArray';
import Loader from '../../../../Common/Loader';
import { AgencyContext } from '../../../../../Context/Agency/Index';


const ReportDue = () => {

  const { get_IncidentTab_Count, localStoreArray, get_LocalStorage, status } = useContext(AgencyContext);
  const [reportList, setReportList] = useState([]);
  const [reportDueData, setReportDueData] = useState([]);
  const [reportDueId, setReportDueId] = useState();
  const [loder, setLoder] = useState(false)
  const [effectiveScreenPermission, setEffectiveScreenPermission] = useState();
  const [incidentID, setIncidentID] = useState('');
  const [loginPinID, setLoginPinID] = useState('');

  useEffect(() => {
    if (!localStoreArray.AgencyID || !localStoreArray.PINID) {
      get_LocalStorage();
    }
  }, []);

  // Onload Function
  useEffect(() => {
    if (localStoreArray) {
      if (localStoreArray?.AgencyID && localStoreArray?.PINID) {
        setLoginPinID(localStoreArray?.PINID);
        if (localStoreArray?.IncidentID) {
          get_IncidentTab_Count(localStoreArray?.IncidentID , localStoreArray?.PINID);
          setIncidentID(parseInt(localStoreArray?.IncidentID));
        } else {
          get_IncidentTab_Count('');
          setIncidentID('');
        }
        getScreenPermision(localStoreArray?.AgencyID, localStoreArray?.PINID);
      }
    }
  }, [localStoreArray])

  //-------onload function---------///
  useEffect(() => {
    if (incidentID) {
      get_reportDue_DropDown(incidentID); get_ReportDue_Data(incidentID);
    }
  }, [incidentID]);

  const SelectedValue = useRef();

  const [value, setValue] = useState({
    'ReportDueID': null, 'ReportDueName': '',
    'IncidentReportDueId': '',
    'IncidentId': '',
    'CreatedByUserFK': '',
    'ModifiedByUserFK': "",
  })

  const [errors, setErrors] = useState({
    'ReportDueError': '',
  })

  useEffect(() => {
    if (incidentID) setValue(pre => { return { ...pre, 'IncidentId': incidentID, 'CreatedByUserFK': loginPinID } })
  }, [incidentID]);

  const check_Validation_Error = (e) => {
    if (RequiredFieldIncident(value.ReportDueID)) {
      setErrors(prevValues => { return { ...prevValues, ['ReportDueError']: RequiredFieldIncident(value.ReportDueID) } })
    }
  }

  // Check All Field Format is True Then Submit 
  const { ReportDueError } = errors

  useEffect(() => {
    if (ReportDueError === 'true') {
      if (status) { UpdateReportDue(); }
      else { AddReportDue(); }
    }
  }, [ReportDueError])

  const getScreenPermision = (LoginAgencyID, PinID) => {
    ScreenPermision("I029", LoginAgencyID, PinID).then(res => {
      if (res) {
        setEffectiveScreenPermission(res)
      } else {
        setEffectiveScreenPermission([])
      }
    });
  }

  const get_ReportDue_Data = (incidentID) => {
    const val = {
      'IncidentId': incidentID
    }
    fetchPostData('ReportDue/GetData_ReportDue', val).then((res) => {
      if (res) {
        setReportDueData(res); setLoder(true)
      } else {
        setReportDueData([]); setLoder(true)
      }
    })
  }

  //--------ReportDue_fetchData----------//
  const get_reportDue_DropDown = (incidentID) => {
    const val = {
      'IncidentId': incidentID
    }
    fetchPostData('ReportDue/GetData_InsertReportDue', val).then((data) => {
      if (data) {
        setReportList(Comman_changeArrayFormat(data, 'ReportDueId', 'Description'));
      }
      else {
        setReportList([])
      }
    })
  }

  const ChangeDropDown = (e, name) => {
    if (e) {
      setValue({
        ...value,
        [name]: e.value
      })
    } else {
      setValue({
        ...value,
        [name]: null
      })
    }
  }

  const Reset = () => {
    setValue({
      ...value,
      'ReportDueID': '', 'ReportDueName': '',
    })
    setErrors({
      ...errors,
      'ReportDueError': '',
    });
  }

  const onClear = () => {
    SelectedValue?.current?.clearValue();
  };

  const AddReportDue = () => {
    AddDeleteUpadate('ReportDue/Insert_ReportDue', value).then((res) => {
      if (res) {
        const parsedData = JSON.parse(res.data);
        const message = parsedData.Table[0].Message;
        toastifySuccess(message);
        get_ReportDue_Data(incidentID);
        get_IncidentTab_Count(incidentID , loginPinID);
        get_reportDue_DropDown(incidentID);
        Reset();
        onClear();
        setErrors({
          ...errors,
          ['ReportDueError']: '',
        });
      } else {
        console.log("Somthing Wrong");
      }
    })
  }

  const UpdateReportDue = () => {
    AddDeleteUpadate('ReportDue/Update_ReportDue', value).then((res) => {
      if (res) {
        const parsedData = JSON.parse(res.data);
        const message = parsedData.Table[0].Message;
        toastifySuccess(message);
        get_ReportDue_Data(incidentID);
        get_reportDue_DropDown(incidentID);
        setErrors({
          ...errors,
          ['ReportDueError']: '',
        });
      } else console.log("Somthing Wrong");
    })
  }

  const DeleteReportDue = () => {
    const val = {
      'IncidentReportDueId': reportDueId,
      'DeletedByUserFK': loginPinID,
    }
    AddDeleteUpadate('ReportDue/Delete_ReportDue', val).then((res) => {
      if (res) {
        const parsedData = JSON.parse(res.data);
        const message = parsedData.Table[0].Message;
        toastifySuccess(message);
        get_ReportDue_Data(incidentID);
        get_IncidentTab_Count(incidentID , loginPinID)
        get_reportDue_DropDown(incidentID);
      } else console.log("Somthing Wrong");
    })
  }


  const columns = [
    {
      name: 'Description',
      selector: (row) => row.ReportDue_Description,
      sortable: true
    },
    {
      name: <p className='text-end' style={{ position: 'absolute', top: 8, left: '15px' }}>Delete</p>,
      cell: row =>
        <div style={{ position: 'absolute', top: 4, }}>
          {
            effectiveScreenPermission ? effectiveScreenPermission[0]?.DeleteOK ?
              <Link to={`#`} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" onClick={() => { setReportDueId(row.IncidentReportDueId); }} data-toggle="modal" data-target="#DeleteModal">
                <i className="fa fa-trash"></i>
              </Link>
              : <></>
              : <Link to={`#`} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" onClick={() => { setReportDueId(row.IncidentReportDueId); }} data-toggle="modal" data-target="#DeleteModal">
                <i className="fa fa-trash"></i>
              </Link>
          }
        </div>

    }
  ]

  // Custom Style
  const colourStyles = {
    control: (styles) => ({
      ...styles, backgroundColor: "#fce9bf",
      height: 20,
      minHeight: 30,
      fontSize: 14,
      margintop: 2,
      boxShadow: 0,
    }),
  };


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

  return (
    <>
      <div className="col-md-12 mt-2">
        <div className="bg-line text-white py-1 px-2  d-flex justify-content-between align-items-center">
          <p className="p-0 m-0 d-flex align-items-center">
            Report Due
          </p>
          <FindListDropDown
            array={IncReportListDropDownArray}
          />
        </div>
        <div className="row px-1">
          <div className="col-12 col-md-6 col-lg-4 mt-5 pt-1  dropdown__box">
            {
              value?.ReportDueName ?
                <Select
                  name='ReportDueID'
                  styles={colourStyles}
                  isClearable
                  defaultValue={value?.ReportDueName}
                  options={reportList}
                  onChange={(e) => ChangeDropDown(e, 'ReportDueID')}
                  placeholder="Select.."
                />
                :
                <Select
                  name='ReportDueID'
                  styles={colourStyles}
                  isClearable
                  options={reportList}
                  onChange={(e) => { ChangeDropDown(e, 'ReportDueID'); }}
                  placeholder="Select.."
                  ref={SelectedValue}
                />

            }
            <label htmlFor="" className='pt-1'>Report Due</label>
            {errors.ReportDueError !== 'true' ? (
              <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.ReportDueError}</span>
            ) : null}
          </div>

          <div className="col-6 col-md-6 col-lg-8 p-0">
            {
              effectiveScreenPermission ? effectiveScreenPermission[0]?.AddOK ?
                <div className="col-6 col-md-6 col-lg-8 mt-3 pt-1 p-0">
                  <button type="button" className="btn btn-sm btn-success mx-1 py-1 text-center" onClick={() => { check_Validation_Error(); }}>Save</button>
                </div>
                : <></>
                : <div className="col-6 col-md-6 col-lg-8 mt-3 pt-1 p-0">
                  <button type="button" className="btn btn-sm btn-success mx-1 py-1 text-center" onClick={() => { check_Validation_Error(); }}>Save</button>
                </div>
            }

          </div>
        </div>
      </div>
      <div className="col-12">
        {
          loder ?
            <DataTable
              showHeader={true}
              persistTableHead={true}
              selectableRowsHighlight
              highlightOnHover
              columns={columns}
              customStyles={tableCustomStyles}
              data={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? reportDueData : [] : reportDueData}
              dense
              pagination
              conditionalRowStyles={conditionalRowStyles}
              noDataComponent={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
            />
            :
            <Loader />
        }
      </div>
      <DeletePopUpModal func={DeleteReportDue} />
    </>
  )
}

export default ReportDue

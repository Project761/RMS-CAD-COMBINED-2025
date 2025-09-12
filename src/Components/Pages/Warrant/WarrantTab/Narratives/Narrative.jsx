import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { Decrypt_Id_Name, getShowingDateText} from '../../../../Common/Utility';
import { fetchPostData, AddDeleteUpadate, ScreenPermision } from '../../../../hooks/Api';
import DataTable from 'react-data-table-component';
import { toastifySuccess } from '../../../../Common/AlertMsg';
import DeletePopUpModal from '../../../../Common/DeleteModal';
import { ArrNarrativesListDropDownArray } from '../../../../Utility/ListDropDownArray/ListDropArray';
import FindListDropDown from '../../../../Common/FindListDropDown';
import Loader from '../../../../Common/Loader';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import NarrativeAddUp from './NarrativesAddUp';


const Narrative = () => {

  const { get_Warrent_Count, localStoreArray, get_LocalStorage } = useContext(AgencyContext)
  const [narrativeData, setNarrativeData] = useState([])
  const [upDateCount, setUpDateCount] = useState(0)
  const [status, setStatus] = useState(false)
  const [modal, setModal] = useState(false);
  const [warrantNarrativeID, setWarrantNarrativeID] = useState('')
  const [loder, setLoder] = useState(false)
  //screen permission 
  const [effectiveScreenPermission, setEffectiveScreenPermission] = useState()

  const [warrantID, setWarrantID] = useState('');
  const [loginAgencyID, setLoginAgencyID] = useState('');
  const [loginPinID, setLoginPinID,] = useState('');

  const localStore = {
    Value: "",
    UniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
    Key: JSON.stringify({ AgencyID: "", PINID: "", WarrantID: '', }),
  }

  useEffect(() => {
    if (!localStoreArray?.AgencyID || !localStoreArray?.PINID) {
      get_LocalStorage(localStore);
    }
  }, []);

  // Onload Function
  useEffect(() => {
    if (localStoreArray) {
      if (localStoreArray?.AgencyID && localStoreArray?.PINID) {
        setLoginAgencyID(localStoreArray?.AgencyID);
        setLoginPinID(parseInt(localStoreArray?.PINID));
        if (localStoreArray.WarrantID) { setWarrantID(localStoreArray?.WarrantID); get_NarrativesData(localStoreArray?.WarrantID) } else { setWarrantID('') }
        getScreenPermision(localStoreArray?.AgencyID, localStoreArray?.PINID);
      }
    }
  }, [localStoreArray])

  const get_NarrativesData = (warrantID) => {
    const val = {
      'WarrantID': warrantID,
    }
    fetchPostData('WarrantNarrative/GetData_WarrantNarrative', val)
      .then(res => {
        if (res) {

          setNarrativeData(res); setLoder(true)
        } else {
          setNarrativeData([]); setLoder(true)
        }
      })
  }

  const getScreenPermision = (loginAgencyID, loginPinID) => {
    ScreenPermision("I032", loginAgencyID, loginPinID).then(res => {
      if (res) {
        setEffectiveScreenPermission(res)
      } else {
        setEffectiveScreenPermission()
      }
    });
  }

  const columns = [
    {
      width: '120px',
      name: <p className='text-end' style={{ position: 'absolute', top: '7px', }}>Action</p>,
      cell: row =>
        <div style={{ position: 'absolute', top: 4, left: 20 }}>
          {
            effectiveScreenPermission ? effectiveScreenPermission[0]?.Changeok ?
              <Link to={''} onClick={(e) => editNarratives(e, row)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#NarrativeModal" >
                <i className="fa fa-edit"></i>
              </Link>
              : <></>
              : <Link to={''} onClick={(e) => editNarratives(e, row)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#NarrativeModal" >
                <i className="fa fa-edit"></i>
              </Link>
          }

        </div>
  
    },
    {
      name: 'Date',
      selector: (row) => getShowingDateText(row.NarrativeDtTm),
      sortable: true
    },
    {
      name: 'Narrative',
      selector: (row) => <>{row?.NarrativeComments ? row?.NarrativeComments.substring(0, 50) : ''}{row?.NarrativeComments?.length > 40 ? '  . . .' : null} </>,
      sortable: true
    },
    {
      name: 'Reported By',
      selector: (row) => row.ReportedBy_Description,
      sortable: true
    },
    {
      name: 'Type',
      selector: (row) => row.NarrativeDescription,
      sortable: true
    },
    {
      name: <p className='text-end' style={{ position: 'absolute', top: '7px', right: '0px' }}>Delete</p>,
      cell: row => 
        <div style={{ position: 'absolute', top: 4, right: 5 }}>

          {
            effectiveScreenPermission ? effectiveScreenPermission[0]?.DeleteOK ?
              <Link to={`#`} onClick={(e) => setWarrantNarrativeID(row.warrantNarrativeID)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                <i className="fa fa-trash"></i>
              </Link>
              : <></>
              : <Link to={`#`} onClick={(e) => setWarrantNarrativeID(row.warrantNarrativeID)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                <i className="fa fa-trash"></i>
              </Link>
          }
        </div>
    
    }
  ]

  const editNarratives = (e, val) => {
    e.preventDefault();
    get_Warrent_Count(val.WarrantID)
    setWarrantNarrativeID(val.warrantNarrativeID);
    setUpDateCount(upDateCount + 1);
    setStatus(true)
    setModal(true);
  }

  const DeleteNarratives = () => {
    const val = {
      'WarrantNarrativeID': warrantNarrativeID,
      'DeletedByUserFK': loginPinID,
    }
    AddDeleteUpadate('WarrantNarrative/Delete_WarrantNarrative', val).then((res) => {
      if (res.success) {
        toastifySuccess(res.Message);
        get_Warrent_Count(warrantID);
        get_NarrativesData(warrantID);
      }
      else console.log("Somthing Wrong");
    })
  }

  return (
    <>
      <div className="col-md-12 mt-2">
        <div className="row">
          <div className="col-md-12">
            <div className="bg-line text-white py-1 px-2 d-flex justify-content-between align-items-center">
              <p className="p-0 m-0">Narratives</p>
              <p className="p-0 m-0">
                <div>
                  {
                    effectiveScreenPermission ? effectiveScreenPermission[0]?.AddOK ?
                      <Link to="" className="btn btn-sm bg-green text-white px-2 py-0"
                        onClick={() => { setStatus(false); setModal(true); setUpDateCount(upDateCount + 1) }}
                        data-toggle="modal" data-target="#NarrativeModal" style={{ marginTop: '-6px' }}>
                        <i className="fa fa-plus"></i>
                      </Link>
                      : <></>
                      : <Link to="" className="btn btn-sm bg-green text-white px-2 py-0"
                        onClick={() => { setStatus(false); setModal(true); setUpDateCount(upDateCount + 1) }}
                        data-toggle="modal" data-target="#NarrativeModal" style={{ marginTop: '-6px' }}>
                        <i className="fa fa-plus"></i>
                      </Link>
                  }
                  <FindListDropDown
                    array={ArrNarrativesListDropDownArray}
                  />
                </div>
              </p>
            </div>
            <div className="col-12 pl-0 ml-0">
              <div className="row ">
                <div className="col-12 pl-0 ml-0">
                  <div className="row ">
                  </div>
                </div>
              </div>
            </div>
            {
              loder ?
                <DataTable
                  dense
                  columns={columns}
                  data={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? narrativeData : '' : narrativeData}
                  pagination
                  selectableRowsHighlight
                  highlightOnHover
                  noDataComponent={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
                />
                :
                <Loader />
            }
          </div>
        </div>
      </div>
      <DeletePopUpModal func={DeleteNarratives} />
      <NarrativeAddUp {...{ loginPinID, warrantID, loginAgencyID, upDateCount, warrantNarrativeID, status, modal, setModal, narrativeData, get_NarrativesData }} />
    </>
  )
}
export default Narrative;
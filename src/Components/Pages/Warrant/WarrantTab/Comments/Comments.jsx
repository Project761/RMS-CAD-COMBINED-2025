import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { Decrypt_Id_Name, getShowingDateText } from '../../../../Common/Utility';
import { fetchPostData, AddDeleteUpadate, ScreenPermision } from '../../../../hooks/Api';
import DataTable from 'react-data-table-component';
import { toastifySuccess } from '../../../../Common/AlertMsg';
import DeletePopUpModal from '../../../../Common/DeleteModal';
import Loader from '../../../../Common/Loader';
import { AgencyContext } from '../../../../../Context/Agency/Index';
import CommentsAddUp from './CommentsAddUp';

const Comments = () => {

  const { get_Warrent_Count, localStoreArray, get_LocalStorage } = useContext(AgencyContext)
  const [commentData, setCommentData] = useState([])
  const [warrantCommentsID, setWarrantCommentsID] = useState('')
  const [upDateCount, setUpDateCount] = useState(0)
  const [status, setStatus] = useState(false)
  const [modal, setModal] = useState(false);
  const [loder, setLoder] = useState(false)
  //screen permission 
  const [effectiveScreenPermission, setEffectiveScreenPermission] = useState()

  const [warrantID, setWarrantID] = useState('');
  const [loginAgencyID, setLoginAgencyID] = useState('');
  const [loginPinID, setLoginPinID,] = useState('');
  const [userName, setUserName] = useState('')

  const localStore = {
    Value: "",
    UniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
    Key: JSON.stringify({ AgencyID: "", PINID: "", IncidentID: '', WarrantID: '', UserName: '' }),
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
        setUserName(localStoreArray?.UserName)
        if (localStoreArray?.WarrantID) {
          setWarrantID(localStoreArray?.WarrantID);
          get_CommentsData(localStoreArray?.WarrantID);
        } else {
          setWarrantID('');
        }
        getScreenPermision(localStoreArray?.AgencyID, localStoreArray?.PINID);
      }
    }
  }, [localStoreArray])

  const get_CommentsData = (warrantID) => {
    const val = {
      'WarrantID': warrantID,
    }
    fetchPostData('WarrantComments/GetData_WarrantComments', val)
      .then(res => {
        if (res) {
          setCommentData(res); setLoder(true)
        } else {
          setCommentData([]); setLoder(true)
        }
      })
  }

  const getScreenPermision = (loginAgencyID, loginPinID) => {
    ScreenPermision("I033", loginAgencyID, loginPinID).then(res => {
      if (res) {
        setEffectiveScreenPermission(res)
      } else {
        setEffectiveScreenPermission([])
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
              <Link to={''} onClick={(e) => editComments(e, row)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#CommentsModal" >
                <i className="fa fa-edit"></i>
              </Link>
              : <></>
              : <Link to={''} onClick={(e) => editComments(e, row)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#CommentsModal" >
                <i className="fa fa-edit"></i>
              </Link>
          }
        </div>
      
    },
    {
      name: 'Comments',
      selector: (row) => <>{row?.Comments ? row?.Comments.substring(0, 60) : ''}{row?.Comments?.length > 40 ? '  . . .' : null} </>,
      sortable: true
    },
    {
      name: 'Date',
      selector: (row) => getShowingDateText(row.getShowingDateText),
      sortable: true
    },
    {
      name: <p className='text-end' style={{ position: 'absolute', top: '7px', right: 0 }}>Delete</p>,
      cell: row => 
        <div style={{ position: 'absolute', top: 4, right: 5 }}>
          {
            effectiveScreenPermission ? effectiveScreenPermission[0]?.DeleteOK ?
              <Link to={`#`} onClick={(e) => setWarrantCommentsID(row.warrantCommentsID)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                <i className="fa fa-trash"></i>
              </Link>
              : <></>
              : <Link to={`#`} onClick={(e) => setWarrantCommentsID(row.warrantCommentsID)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                <i className="fa fa-trash"></i>
              </Link>
          }
        </div>
    
    }
  ]

  const editComments = (e, val) => {
    e.preventDefault();
    get_Warrent_Count(warrantID);
    setWarrantCommentsID(val.warrantCommentsID);
    setUpDateCount(upDateCount + 1);
    setStatus(true)
    setModal(true);
  }

  const DeleteComments = () => {
    const val = {
      'WarrantCommentsID': warrantCommentsID,
      'DeletedByUserFK': loginPinID,
    }
    AddDeleteUpadate('WarrantComments/Delete_WarrantComments', val).then((res) => {
      if (res.success) {
        toastifySuccess(res.Message);
        get_Warrent_Count(warrantID);
        get_CommentsData(warrantID);
      } else console.log("Somthing Wrong");
    })
  }

  return (
    <>
      <div className="col-md-12 mt-2">
        <div className="row">
          <div className="col-md-12">
            <div className="bg-line text-white py-1 px-2 d-flex justify-content-between align-items-center">
              <p className="p-0 m-0">Comments</p>
              <p className="p-0 m-0">
                {
                  effectiveScreenPermission ? effectiveScreenPermission[0]?.AddOK ?
                    <Link to="" className="btn btn-sm bg-green text-white px-2 py-0"
                      onClick={() => { setStatus(false); setModal(true); setUpDateCount(upDateCount + 1) }}
                      data-toggle="modal" data-target="#CommentsModal">
                      <i className="fa fa-plus"></i>
                    </Link>
                    : <></>
                    : <Link to="" className="btn btn-sm bg-green text-white px-2 py-0"
                      onClick={() => { setStatus(false); setModal(true); setUpDateCount(upDateCount + 1) }}
                      data-toggle="modal" data-target="#CommentsModal">
                      <i className="fa fa-plus"></i>
                    </Link>
                }
              </p>
            </div>
            <div className="col-12 ">
              {
                loder ?

                  <DataTable
                    dense
                    columns={columns}
                    data={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? commentData : '' : commentData}
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
      </div>
      <DeletePopUpModal func={DeleteComments} />
      <CommentsAddUp {...{ userName, upDateCount, warrantCommentsID, status, modal, setModal, get_CommentsData, commentData, loginPinID, loginAgencyID, warrantID, }} />
    </>
  )
}
export default Comments;
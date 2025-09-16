import { useEffect, useState, useContext } from 'react'
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import { AddDeleteUpadate, fetchPostData } from '../../../../../../hooks/Api';
import { toastifyError, toastifySuccess } from '../../../../../../Common/AlertMsg';
import DeletePopUpModal from '../../../../../../Common/DeleteModal';
import { AgencyContext } from '../../../../../../../Context/Agency/Index';
import RelationshipAddUp from './RelationshipAddUp';

const Relationship = (props) => {
  const { get_NameOffender_Count } = useContext(AgencyContext)

  const { victimID, nameID, LoginPinID, incidentID, LoginAgencyID } = props
  const [relationshipData, setRelationshipData] = useState([]);
  const [status, setStatus] = useState(false);
  const [modalStatus, setModalStatus] = useState(false);
  const [relationshipID, setRelationshipID] = useState('');
  const [editCount, setEditCount] = useState(0);

  useEffect(() => {
    Get_Relationship_Data(nameID)
  }, [nameID])

  const Get_Relationship_Data = (nameID) => {
    const val = {
      'Code': 'OFF',
      'NameID': nameID,
    }
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
      name: <p className='text-end' style={{ position: 'absolute', top: '7px' }}>Action</p>,
      cell: row =>
        <div style={{ position: 'absolute', top: 4, left: 20 }}>
          <Link to={'/nametab'} onClick={(e) => {
            setModalStatus(true); setStatus(true); setRelationshipID(row.RelationshipID); setEditCount(editCount + 1)
          }
          } className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#RelationshipModal">
            <i className="fa fa-edit"></i>
          </Link>
        </div>

    },
    {
      name: 'Name',
      selector: (row) => row.Name,
      sortable: true
    },
    {
      name: 'Realtionship',
      selector: (row) => row.RelationshipType_Description,
      sortable: true
    },
    {
      name: <p className='text-end' style={{ position: 'absolute', top: '7px' }}>Delete</p>,
      cell: row =>
        <div style={{ position: 'absolute', top: 4, left: 25 }}>
          <Link to={`#`} onClick={(e) => setRelationshipID(row.RelationshipID)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
            <i className="fa fa-trash"></i>
          </Link>
        </div>

    }
  ];

  const DeleteRelationship = () => {
    const val = {
      'RelationshipID': relationshipID,
      'DeletedByUserFK': '1',
    }
    AddDeleteUpadate('NameRelationship/Delete_NameRelationship', val).then((res) => {
      if (res) {
        toastifySuccess(res.Message); setEditCount(editCount + 1)
        Get_Relationship_Data(nameID); get_NameOffender_Count(nameID)
      } else toastifyError("Somthing Wrong");
    })
  }

  return (
    <>
      <div className="col-12 col-md-12 mt-2" >
        <div className="bg-line  py-1 px-2 mt-1 d-flex justify-content-between align-items-center ">
          <p className="p-0 m-0 d-flex align-items-center">Relationship</p>
          <div style={{ marginLeft: 'auto' }}>
            <Link to={''} onClick={() => {
              setModalStatus(true); setStatus(false); setRelationshipID(''); setEditCount(editCount + 1)
            }
            } className="btn btn-sm bg-green text-white px-2 py-0" data-toggle="modal" data-target="#RelationshipModal">
              <i className="fa fa-plus"></i>
            </Link>
          </div>
        </div>
        <div className="row mt-1">
          <div className="col-12  mb-3">
            <div className="table-responsive">
              <DataTable
                dense
                columns={columns}
                data={relationshipData}
                pagination
                paginationPerPage={'5'}
                paginationRowsPerPageOptions={[5]}
                highlightOnHover
              />
            </div>
          </div>
        </div>
      </div>
      <RelationshipAddUp {...{ victimID, nameID, LoginPinID, incidentID, LoginAgencyID, Get_Relationship_Data, setModalStatus, modalStatus, status, relationshipID, setStatus, editCount, relationshipData }} />
      <DeletePopUpModal func={DeleteRelationship} />

    </>
  )
}

export default Relationship
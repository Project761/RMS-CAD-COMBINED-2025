import { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { ScreenPermision, fetchPostData } from '../../../../hooks/Api'
import { Decrypt_Id_Name, base64ToString, tableCustomStyles } from '../../../../Common/Utility'
import { useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { get_LocalStoreData } from '../../../../../redux/actions/Agency'

const LocationHistory = () => {

  const dispatch = useDispatch()
  const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
  const localStoreData = useSelector((state) => state.Agency.localStoreData);


  useEffect(() => {
    if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
      if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
    }
  }, []);

  useEffect(() => {
    if (localStoreData) {
      getScreenPermision(localStoreData?.AgencyID, localStoreData?.PINID);
    }
  }, [localStoreData]);


  const useQuery = () => {
    const params = new URLSearchParams(useLocation().search);
    return {
      get: (param) => params.get(param)
    };
  };

  const query = useQuery();
  var IncID = query?.get("IncId");
  if (!IncID) IncID = 0;
  else IncID = parseInt(base64ToString(IncID));

  const [locationData, setLocationData] = useState([]);
  const [incidentID, setIncidentID] = useState();
  const [effectiveScreenPermission, setEffectiveScreenPermission] = useState([]);

  const getScreenPermision = (LoginAgencyID, PinID) => {
    ScreenPermision("I088", LoginAgencyID, PinID).then(res => {
      if (res) {
        setEffectiveScreenPermission(res)
      } else {
        setEffectiveScreenPermission([])
      }
    });
  }

  useEffect(() => {
    if (IncID) { setIncidentID(IncID) } else { setIncidentID('') };
  }, [IncID]);

  useEffect(() => {
    if (incidentID) {
      get_LocationData(incidentID);
    }
  }, [incidentID]);

  const get_LocationData = (MainIncidentID) => {
    const val = { 'IncidentID': MainIncidentID }
    fetchPostData('Incident/GetData_IncidentLocation', val).then((res) => {
      if (res?.length > 0) {
        setLocationData(res)
      } else {
        setLocationData([]);
      }
    })
  }

  const columns = [
    {
      width: '700px',
      name: 'Address',
      selector: (row) => row.IncidentAddress,
      sortable: true
    },
  ]

  return (
    <div className="col-12 px-0 mt-3">
      <DataTable
        dense
        columns={columns}
        data={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? locationData : [] : locationData}
        noDataComponent={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
        selectableRowsHighlight
        highlightOnHover
        customStyles={tableCustomStyles}
        pagination
        paginationPerPage={'100'}
        paginationRowsPerPageOptions={[100, 150, 200, 500]}
        showPaginationBottom={100}
        fixedHeader
        persistTableHead={true}
        fixedHeaderScrollHeight='450px'
      />
    </div>

  )
}

export default LocationHistory
import { useEffect, useState } from "react";
import DataTable from 'react-data-table-component';
import { base64ToString, tableMinCustomStyles } from "../../../../Components/Common/Utility";
import { compareStrings } from '../../../../CADUtils/functions/common';
import { useQuery } from "react-query";
import MonitorServices from '../../../../CADServices/APIs/monitor'
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import Tooltip from "../../../Common/Tooltip";

const ResourceHistoryTabSection = ({ isRMS = false }) => {
  const localStoreData = useSelector((state) => state.Agency.localStoreData);
  const [filterListData, setFilterListData] = useState([]);
  const [loginAgencyID, setLoginAgencyID] = useState('');

  const useRouteQuery = () => {
    const params = new URLSearchParams(useLocation().search);
    return {
      get: (param) => params.get(param)
    };
  };

  const columns = [
    {
      name: 'Unit Type',
      selector: row => row.ResourceTypeCode,
      sortable: true,
      sortFunction: (rowA, rowB) => compareStrings(rowA.ResourceTypeCode, rowB.ResourceTypeCode),
    },
    {
      name: 'Unit #',
      selector: row => row.ResourceNumber,
      sortable: true,
      sortFunction: (rowA, rowB) => compareStrings(rowA.ResourceNumber, rowB.ResourceNumber),
    },
    {
      name: 'Status',
      selector: row => row.Status,
      sortable: true,
      sortFunction: (rowA, rowB) => compareStrings(rowA.Status, rowB.Status),
    },
    {
      name: 'Status Date & Time',
      selector: row => row.StatusDT,
      sortable: true,
      format: row => new Date(row.StatusDT).toLocaleString(),
      cell: (row) =>
        isRMS ? (
          <Tooltip text={new Date(row.StatusDT).toLocaleString() || ''} maxLength={12} />
        ) : (
          new Date(row.StatusDT).toLocaleString()
        ),
    },
    {
      name: 'Primary Officer',
      selector: row => row.PrimaryOfficer,
      sortable: true,
      sortFunction: (rowA, rowB) => compareStrings(rowA.PrimaryOfficer, rowB.PrimaryOfficer),
    },
    {
      name: 'Secondary Officer',
      selector: row => row.SecondaryOfficer,
      sortable: true,
      sortFunction: (rowA, rowB) => compareStrings(rowA.SecondaryOfficer, rowB.SecondaryOfficer),
    },
    {
      name: 'Location',
      selector: row => row.CrimeLocation,
      sortable: true,
      sortFunction: (rowA, rowB) => compareStrings(rowA.CrimeLocation, rowB.CrimeLocation),
      cell: (row) => (
        <Tooltip text={row.CrimeLocation || ''} maxLength={isRMS ? 12 : 15} />
      ),
    },
    {
      name: 'Zone',
      selector: row => row.ZoneCode,
      sortable: true,
      sortFunction: (rowA, rowB) => compareStrings(rowA.ZoneCode, rowB.ZoneCode),
      cell: (row) => (
        <Tooltip text={row.ZoneCode || ''} maxLength={12} />
      ),
    },
  ];

  const query = useRouteQuery();
  let IncID = query?.get("IncId");
  if (!IncID) IncID = 0;
  else IncID = parseInt(base64ToString(IncID));

  const getResourceHistoryKey = `/CAD/ResourceHistory/GetResourceHistory`;
  const { data: getResourceHistoryList, isSuccess: isFetchResourceHistoryList } = useQuery(
    [getResourceHistoryKey, { "AgencyID": loginAgencyID, "IncidentID": IncID }],
    MonitorServices.getResourceHistory,
    {
      refetchOnWindowFocus: false,
      retry: 0,
      enabled: !!loginAgencyID && !!IncID
    }
  );

  useEffect(() => {
    if (localStoreData) {
      setLoginAgencyID(localStoreData?.AgencyID);
    }
  }, [localStoreData]);

  useEffect(() => {
    if (isFetchResourceHistoryList && getResourceHistoryList) {
      const res = JSON.parse(getResourceHistoryList?.data?.data);
      const data = res?.Table
      setFilterListData(data || [])
    } else {
      setFilterListData([])
    }
  }, [isFetchResourceHistoryList, getResourceHistoryList])

  return (
    <>
      <div>
        <DataTable
          dense
          columns={columns}
          data={filterListData}
          persistTableHead={true}
          customStyles={tableMinCustomStyles}
          pagination
          responsive
          striped
          highlightOnHover
          fixedHeader
        />
      </div>
    </>
  );
};

export default ResourceHistoryTabSection;

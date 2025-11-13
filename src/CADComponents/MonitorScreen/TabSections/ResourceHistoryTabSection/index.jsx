import React, { useEffect, useState } from "react";
import DataTable from 'react-data-table-component';
import { base64ToString, tableCustomStyles } from "../../../../Components/Common/Utility";
import { compareStrings } from '../../../../CADUtils/functions/common';
import { useQuery } from "react-query";
import MonitorServices from '../../../../CADServices/APIs/monitor'
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import Tooltip from "../../../Common/Tooltip";
import { ScreenPermision } from "../../../../Components/hooks/Api";

const columns = [
  {
    name: 'Unit Type',
    selector: row => row.ResourceTypeCode,
    sortable: true,
    sortFunction: (rowA, rowB) => compareStrings(rowA.ResourceTypeCode, rowB.ResourceTypeCode),
  },
  {
    name: 'Unit #',
    selector: row => row.Resources,
    sortable: true,
    sortFunction: (rowA, rowB) => compareStrings(rowA.Resources, rowB.Resources),
  },
  // {
  //   name: 'Incidents',
  //   selector: row => row.incidents,
  //   sortable: true,
  //   sortFunction: (rowA, rowB) => compareStrings(rowA.incidents, rowB.incidents),
  //   wrap: true,
  // },
  {
    name: 'Status',
    selector: row => row.Status,
    sortable: true,
    sortFunction: (rowA, rowB) => compareStrings(rowA.Status, rowB.Status),
  },
  {
    name: 'Status DT/TM',
    selector: row => row.StatusDT,
    sortable: true,
    format: row => new Date(row.StatusDT).toLocaleString(),
    width: "180px",
  },
  {
    name: 'Reported Location',
    selector: row => row.ReportedLocation,
    sortable: true,
    sortFunction: (rowA, rowB) => compareStrings(rowA.ReportedLocation, rowB.ReportedLocation),
    cell: (row) => (
      <Tooltip text={row.ReportedLocation || ''} maxLength={12} />
    ),
  },
  {
    name: 'Found Location',
    selector: row => row.FoundLocation,
    sortable: true,
    sortFunction: (rowA, rowB) => compareStrings(rowA.FoundLocation, rowB.FoundLocation),
    cell: (row) => (
      <Tooltip text={row.FoundLocation || ''} maxLength={10} />
    ),
  },
  {
    name: 'Reported Apt#',
    selector: row => row.ReportedApartmentNo,
    sortable: true,
    sortFunction: (rowA, rowB) => compareStrings(rowA.ReportedApartmentNo, rowB.ReportedApartmentNo),
  },
  {
    name: 'Found Apt#',
    selector: row => row.FoundApartmentNo,
    sortable: true,
    sortFunction: (rowA, rowB) => compareStrings(rowA.FoundApartmentNo, rowB.FoundApartmentNo),
  },
  {
    name: 'Reported CFS Code',
    selector: row => row?.ReportedCFSCode,
    sortable: true,
    sortFunction: (rowA, rowB) => compareStrings(rowA.ReportedCFSCode, rowB.ReportedCFSCode),
    width: "160px",
  },
  {
    name: 'Reported CFS description',
    selector: row => row?.ReportedCFSDescription,
    sortable: true,
    sortFunction: (rowA, rowB) => compareStrings(rowA.ReportedCFSDescription, rowB.ReportedCFSDescription),
    width: "160px",
  },
  {
    name: 'Found CFS Code',
    selector: row => row?.FoundCFSCode,
    sortable: true,
    sortFunction: (rowA, rowB) => compareStrings(rowA.FoundCFSCode, rowB.FoundCFSCode),
    width: "160px",
  },
  {
    name: 'Found CFS Description',
    selector: row => row?.FoundPriorityDescription,
    sortable: true,
    sortFunction: (rowA, rowB) => compareStrings(rowA.FoundPriorityDescription, rowB.FoundPriorityDescription),
    width: "160px",
  },
  {
    name: 'Reported Priority',
    selector: row => row?.ReportedPriorityCode,
    sortable: true,
    sortFunction: (rowA, rowB) => compareStrings(rowA.ReportedPriorityCode, rowB.ReportedPriorityCode),
  },
  {
    name: 'Found Priority',
    selector: row => row?.FoundPriorityCode,
    sortable: true,
    sortFunction: (rowA, rowB) => compareStrings(rowA.FoundPriorityCode, rowB.FoundPriorityCode),
  },
  {
    name: 'Primary Unit',
    selector: row => row.PrimaryResourceName,
    sortable: true,
    sortFunction: (rowA, rowB) => compareStrings(rowA.PrimaryResourceName, rowB.PrimaryResourceName),
  },
  {
    name: 'Officer 1',
    selector: row => row.Officer1,
    sortable: true,
    sortFunction: (rowA, rowB) => compareStrings(rowA.Officer1, rowB.Officer1),
  },
  {
    name: 'Officer 2',
    selector: row => row.Officer2,
    sortable: true,
    sortFunction: (rowA, rowB) => compareStrings(rowA.Officer2, rowB.Officer2),
  },

];

const ResourceHistoryTabSection = () => {
  const localStoreData = useSelector((state) => state.Agency.localStoreData);
  const [listData, setListData] = useState([]);
  const [filterListData, setFilterListData] = useState([]);
  const [loginAgencyID, setLoginAgencyID] = useState('');
  const [effectiveScreenPermission, setEffectiveScreenPermission] = useState(null);
  const useRouteQuery = () => {
    const params = new URLSearchParams(useLocation().search);
    return {
      get: (param) => params.get(param)
    };
  };
  const query = useRouteQuery();
  let IncID = query?.get("IncId");
  if (!IncID) IncID = 0;
  else IncID = parseInt(base64ToString(IncID));

  const getResourceOnDutyHistoryKey = `/CAD/ResourceHistory/GetResourceOnDutyHistory/${IncID}`;
  const { data: resourceOnDutyHistoryList, isSuccess: isFetchResourceOnDutyHistoryList, refetch: resourceOnDutyHistoryListRefetch } = useQuery(
    [getResourceOnDutyHistoryKey, { "AgencyID": loginAgencyID, "IncidentID": IncID }],
    MonitorServices.getResourceOnDutyHistory,
    {
      refetchOnWindowFocus: false,
      retry: 0,
      enabled: !!loginAgencyID && !!IncID
    }
  );

  useEffect(() => {
    if (localStoreData) {
      setLoginAgencyID(localStoreData?.AgencyID);
      getScreenPermission(localStoreData?.AgencyID, localStoreData?.PINID)
    }
  }, [localStoreData]);

  useEffect(() => {
    if (isFetchResourceOnDutyHistoryList && resourceOnDutyHistoryList) {
      const res = JSON.parse(resourceOnDutyHistoryList?.data?.data);
      const data = res?.Table
      setFilterListData(data || [])
      setListData(data || [])
    } else {
      setFilterListData([])
      setListData([])
    }
  }, [isFetchResourceOnDutyHistoryList, resourceOnDutyHistoryList])

  const getScreenPermission = (aId, pinID) => {

    try {
      ScreenPermision("CI105", aId, pinID).then(res => {
        if (res) {
          setEffectiveScreenPermission(res);
        }
      });
    } catch (error) {
      console.error('There was an error!', error);
      setEffectiveScreenPermission(null);
    }
  }

  return (
    <>
      <div>
        <DataTable
          dense
          columns={columns}
          data={effectiveScreenPermission ? effectiveScreenPermission?.[0]?.DisplayOK ? filterListData : '' : ''}
          noDataComponent={effectiveScreenPermission ? effectiveScreenPermission?.[0]?.DisplayOK === 1 ? "There are no data to display" : "You don’t have permission to view data" : ''}
          persistTableHead={true}
          customStyles={tableCustomStyles}
          pagination // enable pagination
          responsive // enable responsive design
          striped // add zebra-striping to the table rows
          highlightOnHover // highlight row on hover
          fixedHeader
        // fixedHeaderScrollHeight="200px" 
        />
      </div>
    </>
  );
};

export default ResourceHistoryTabSection;

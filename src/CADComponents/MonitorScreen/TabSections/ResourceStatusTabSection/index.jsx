import { useContext, useEffect, useState } from "react";
import { base64ToString, getShowingYearMonthDate, tableCustomStyles } from "../../../../Components/Common/Utility";
import MasterTableListServices from "../../../../CADServices/APIs/masterTableList";
import { IncidentContext } from "../../../../CADContext/Incident";
import { useLocation } from "react-router-dom";
import DataTable from 'react-data-table-component';
import { useSelector } from "react-redux";
import { useQuery } from "react-query";
import { compareStrings } from "../../../../CADUtils/functions/common";
import ResourcesStatusServices from "../../../../CADServices/APIs/resourcesStatus";

const ResourceStatusTabSection = ({ isViewEventDetails = false }) => {
  const { resourceData, resourceRefetch } = useContext(IncidentContext);
  const localStoreData = useSelector((state) => state.Agency.localStoreData);
  const [resources, setResources] = useState([])
  const [loginAgencyID, setLoginAgencyID] = useState();
  const [resourceStatusColorData, setResourceStatusColorData] = useState([]);
  const [loginPinID, setLoginPinID] = useState(1);

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

  const getResourceStatusColorKey = `/CAD/ResourceStatusColor/GetData_DropDown_ResourceStatusColor/${loginAgencyID}`;
  const { data: resourceStatusColorList, isSuccess: isFetchResourceStatusColorList } = useQuery(
    [getResourceStatusColorKey, {
      AgencyID: loginAgencyID,
    }],
    MasterTableListServices.getData_DropDown_ResourceStatusColor,
    {
      refetchOnWindowFocus: false,
      retry: 0,
      enabled: !!loginAgencyID,
    }
  );
  useEffect(() => {
    if (isFetchResourceStatusColorList && resourceStatusColorList) {
      const res = JSON.parse(resourceStatusColorList?.data?.data);
      const data = res?.Table
      setResourceStatusColorData(data || [])
    } else {
      setResourceStatusColorData([])
    }
  }, [isFetchResourceStatusColorList, resourceStatusColorList])

  useEffect(() => {
    if (localStoreData) {
      setLoginAgencyID(localStoreData?.AgencyID);
      setLoginPinID(localStoreData?.PINID)

    }
  }, [localStoreData]);

  useEffect(() => {
    if (resourceData?.length > 0) {
      const filteredData = resourceData.filter((item) => item.IncidentID === IncID);
      setResources(filteredData);
    }
  }, [resourceData, IncID]);

  const handleStatusChange = async (row, newValue) => {
    const data = {
      Status: newValue,
      IncidentID: row?.IncidentID,
      Resources: row?.ResourceID,
      CreatedByUserFK: loginPinID,
      AgencyID: loginAgencyID,
    };

    try {
      const response = await ResourcesStatusServices.incidentRecourseStatus(data);
      if (response?.status === 200) {
        resourceRefetch();
      } else {
        console.error("Failed to update status:", response);
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const getStatusColors = (statusCode) => {
    const statusItem = resourceStatusColorData.find(item => item.ResourceStatusCode === statusCode);
    return statusItem
      ? { backgroundColor: statusItem.BackColor, color: statusItem.ForeColor }
      : {}; // Default to empty if no match found
  };

  const ResourceStatusColumns = [
    {
      name: 'Unit Type',
      selector: (row) => row.ResourceTypeCode,
      sortable: true,
      sortFunction: (rowA, rowB) => compareStrings(rowA.ResourceTypeCode, rowB.ResourceTypeCode),
      width: "20%",
    },
    {
      name: 'Unit #',
      selector: (row) => row.ResourceNumber,
      sortable: true,
      sortFunction: (rowA, rowB) => compareStrings(rowA.ResourceNumber, rowB.ResourceNumber),
      width: "20%",
    },
    {
      name: 'RMS Incident #',
      selector: (row) => row.IncidentNumber,
      sortable: true,
      width: "20%",
    },
    {
      name: 'Status',
      selector: (row) => {
        const colors = getStatusColors(row.Status); // Get colors based on Status
        return (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span
              style={{
                ...colors,
                padding: '4px 8px',
                borderRadius: '4px',
                display: 'inline-block',
                minWidth: '50px',
                textAlign: 'center'
              }}
            >
              {row.Status}
            </span>
            {row.Status !== "AV" && (
              <select
                onChange={(e) => { if (row.Status !== e.target.value) { handleStatusChange(row, e.target.value) } }}
                className="form-select status-dropdown"
                style={{
                  width: '20px',
                  padding: '2px',
                  fontSize: '16px',
                  marginLeft: '5px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  backgroundColor: '#fff',
                  appearance: 'auto'
                }}
              >
                {resourceStatusColorData.map((option, index) => (
                  <option key={index} value={option.ResourceStatusCode}>
                    {`${option.ResourceStatusCode} | ${option.Description}`}&nbsp;
                  </option>
                ))}
              </select>
            )}
          </div>
        );
      },
      sortable: false,
      width: "20%",
    },
    {
      name: 'Status Date & Time',
      selector: (row) => (row.StatusDT ? getShowingYearMonthDate(row.StatusDT) : ""),
      sortable: true,
      width: "20%",
    },
  ];

  return (
    <>
      <DataTable
        dense
        columns={ResourceStatusColumns}
        data={resources}
        persistTableHead={true}
        customStyles={tableCustomStyles}
        pagination // enable pagination
        responsive // enable responsive design
        striped // add zebra-striping to the table rows
        highlightOnHover // highlight row on hover
        fixedHeader
      // fixedHeaderScrollHeight="200px" 
      />
    </>
  );
};

export default ResourceStatusTabSection;

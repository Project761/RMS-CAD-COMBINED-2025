import { createContext, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import MonitorServices from '../../CADServices/APIs/monitor';
import MasterTableListServices from '../../CADServices/APIs/masterTableList';
import { setupSignalRHandlers } from '../../CADServices/signalRService';

export const IncidentContext = createContext();

const IncidentData = ({ children }) => {
  const [loginAgencyID, setLoginAgencyID] = useState();
  const localStoreData = useSelector((state) => state.Agency.localStoreData);
  const [isOnCAD, setIsOnCAD] = useState(false);
  const [incidentData, setIncidentData] = useState([]);
  const [resourceData, setResourceData] = useState([]);
  const [allResourcesData, setAllResourcesData] = useState([]);
  const [assignedIncidentData, setAssignedIncidentData] = useState([]);
  const [unassignedIncidentData, setUnassignedIncidentData] = useState([]);
  const [CommentsData, setCommentsData] = useState([]);
  const [offset, setOffset] = useState('');
  const [incID, setIncID] = useState(null);

  const getIncidentListKey = `/CAD/Monitor/MonitorIncidentsView`;
  const { data: getIncidentData, isSuccess: isFetchIncidentList, refetch: incidentRefetch, error: getIncidentError } = useQuery(
    [getIncidentListKey, { AgencyID: loginAgencyID, Action: "ALL" }],
    MonitorServices.getIncidentsView,
    {
      refetchOnWindowFocus: false,
      enabled: !!loginAgencyID,
      onError: (error) => {
        if (error?.response?.status === 400) {
          console.error("No Data Available", error?.response?.data?.Message);
          setIncidentData([]);
        } else {
          setIncidentData([]);
          console.error("An error occurred:", error);
        }
      },
    }
  );

  useEffect(() => {
    if (getIncidentData && isFetchIncidentList) {
      const parsedData = JSON.parse(getIncidentData?.data?.data);
      const data = parsedData?.Table;
      if (JSON.stringify(data) !== JSON.stringify(incidentData)) {
        setIncidentData(data);
      }
      setIncidentData(data);
    } else {
      setIncidentData([]);
    }
    if (getIncidentError) {
      setIncidentData([]);
    }
  }, [getIncidentData, isFetchIncidentList, getIncidentError]);
  const access_token = sessionStorage.getItem("access_token");

  const getOffSetTimeKey = `/CAD/CallTakerIncident/GetOffSetTime`;
  const { isSuccess: isFetchGetOffSetTime, refetch: getOffSetTimeRefetch } = useQuery(
    [getOffSetTimeKey, { AgencyID: loginAgencyID }],
    MonitorServices.getOffSetTime,
    {
      refetchOnWindowFocus: false,
      retry: 0,
      enabled: !!loginAgencyID && access_token !== "undefined",
      onSuccess: (res) => {
        if (res?.status === 200) {
          const data = res?.data?.offset;
          setOffset(data);
        } else {
          console.error("Error parsing name:");
          return;
        }
      },
    }
  );

  useEffect(() => {
    if (loginAgencyID && access_token !== "undefined") {
      getOffSetTimeRefetch();
    }
  }, [loginAgencyID, access_token, getOffSetTimeRefetch]);

  const getAssignedIncidentListKey = `/CAD/Monitor/MonitorIncidentsView`;
  const { isSuccess: isFetchAssignedIncidentList, refetch: assignedIncidentListRefetch } = useQuery(
    [getAssignedIncidentListKey, { AgencyID: loginAgencyID, Action: "ASSIGNED" }],
    MonitorServices.getIncidentsView,
    {
      refetchOnWindowFocus: false,
      enabled: !!loginAgencyID,
      onSuccess: (res) => {
        if (res?.data?.Data?.length === 0) {
          return;
        } else {
          try {
            const parsedData = JSON.parse(res?.data?.data);
            const data = parsedData?.Table;
            if (JSON.stringify(data) !== JSON.stringify(assignedIncidentData)) {
              setAssignedIncidentData(data);
            }
          } catch (error) {
            console.error("Error parsing name:", error);
          }
        }
      },
      onError: (error) => {
        if (error?.response?.data?.Code === 400) {
          console.error("No Data Available", error?.response?.data?.Message);
        } else {
          console.error("An error occurred:", error);
        }
      },
    }
  );

  const getUnassignedIncidentListKey = `/CAD/Monitor/MonitorIncidentsView`;
  const { isSuccess: isFetchUnassignedIncidentList, refetch: unassignedIncidentListRefetch } = useQuery(
    [getUnassignedIncidentListKey, { AgencyID: loginAgencyID, Action: "UNASSIGNED" }],
    MonitorServices.getIncidentsView,
    {
      refetchOnWindowFocus: false,
      enabled: !!loginAgencyID,
      onSuccess: (res) => {
        if (res?.data?.Data?.length === 0) {
          return;
        } else {
          try {
            const parsedData = JSON.parse(res?.data?.data);
            const data = parsedData?.Table;
            if (JSON.stringify(data) !== JSON.stringify(unassignedIncidentData)) {
              setUnassignedIncidentData(data);
            }
          } catch (error) {
            console.error("Error parsing name:", error);
          }
        }
      },
      onError: (error) => {
        if (error?.response?.data?.Code === 400) {
          console.error("No Data Available", error?.response?.data?.Message);
        } else {
          console.error("An error occurred:", error);
        }
      },
    }
  );


  const getResourceListKey = `CAD/Monitor/MonitorResourceView`;
  const { data: getResourceData, isSuccess: isFetchResourceList, refetch: resourceRefetch, error: getResourceError } = useQuery(
    [getResourceListKey, { AgencyID: loginAgencyID }],
    MonitorServices.getResourceView,
    {
      refetchOnWindowFocus: false,
      enabled: !!loginAgencyID,
      onError: (error) => {
        if (error?.response?.status === 400) {
          console.error("No Data Available", error?.response?.data?.Message);
          setResourceData([]);
        } else {
          setResourceData([]);
        }
      }
    }
  );

  useEffect(() => {
    if (getResourceData && isFetchResourceList) {
      const parsedData = JSON.parse(getResourceData?.data?.data);
      const data = parsedData?.Table;
      if (JSON.stringify(data) !== JSON.stringify(resourceData)) {
        setResourceData(data);
      }
      setResourceData(data);
    } else {
      setResourceData([]);
    }
    if (getResourceError) {
      setResourceData([]);
    }
  }, [getResourceData, isFetchResourceList, getResourceError]);


  const getAllResourcesKey = `/CAD/MasterResource/GetAllActiveResources`;
  const { data: getAllResourcesData, isSuccess: isFetchAllResourcesData, refetch: getAllResourcesRefetch, error: getAllResourcesError } = useQuery(
    [getAllResourcesKey, { AgencyID: loginAgencyID }],
    MasterTableListServices.getAllResources,
    {
      refetchOnWindowFocus: false,
      enabled: !!loginAgencyID,
      onError: (error) => {
        if (error?.response?.status === 400) {
          console.error("No Data Available", error?.response?.data?.Message);
          setAllResourcesData([]);
        } else {
          setAllResourcesData([]);
        }
      }
    }
  );

  useEffect(() => {
    if (getAllResourcesData && isFetchAllResourcesData) {
      const parsedData = JSON.parse(getAllResourcesData?.data?.data);
      const data = parsedData?.Table;
      if (JSON.stringify(data) !== JSON.stringify(allResourcesData)) {
        setAllResourcesData(data);
      }
      setAllResourcesData(data);
    } else {
      setAllResourcesData([]);
    }
    if (getAllResourcesError) {
      setAllResourcesData([]);
    }
  }, [getAllResourcesData, isFetchAllResourcesData, getAllResourcesError]);


  const getCommentsKey = `/CAD/DispatcherComments/GetData_Comments`;
  const { refetch: refetchGetComments } = useQuery(
    [getCommentsKey, { IncidentID: incID }],
    MonitorServices.GetComments,
    {
      refetchOnWindowFocus: false,
      enabled: !!incID,
      retry: 0,
      onSuccess: (data) => {
        if (data?.data?.Data?.length === 0) {
          setCommentsData([]);
          return;
        } else {
          try {
            const parsedData = JSON.parse(data?.data?.data)?.Table || [];
            setCommentsData(parsedData);
          } catch (error) {
            console.error("Error parsing name:", error);
            setCommentsData([]);
          }
        }
      },
      onError: (error) => {
        setCommentsData([]);
        if (error?.response?.data?.Code === 400) {
          console.warn("No Data Available : GetData_Comments", error?.response?.data?.Message);
        } else {
          console.warn("An error occurred: GetData_Comments", error);
        }
      }
    }
  );


  useEffect(() => {
    if (localStoreData) {
      setLoginAgencyID(localStoreData?.AgencyID);
    }
  }, [localStoreData]);

  useEffect(() => {
    if (window.location.pathname.includes('/cad/')) {
      const refetchAllIncidents = async () => {
        await incidentRefetch();
        assignedIncidentListRefetch();
        unassignedIncidentListRefetch();
      };
      const intervalId = setInterval(refetchAllIncidents, 30000);
      return () => clearInterval(intervalId);
    }
  }, [incidentRefetch, assignedIncidentListRefetch, unassignedIncidentListRefetch, isOnCAD]);

  useEffect(() => {
    if (window.location.pathname.includes('/cad/')) {
      const intervalId = setInterval(() => {
        resourceRefetch();
      }, 30000);

      return () => clearInterval(intervalId);
    }
  }, [resourceRefetch, isOnCAD]);

  useEffect(() => {
    // Set up SignalR handlers with the context functions
    setupSignalRHandlers(incidentRefetch, resourceRefetch);
  }, [incidentRefetch, resourceRefetch]);

  return (
    <IncidentContext.Provider
      value={{
        incidentData,
        isFetchIncidentList,
        incidentRefetch,
        resourceData,
        isFetchResourceList,
        resourceRefetch,
        assignedIncidentData,
        isFetchAssignedIncidentList,
        assignedIncidentListRefetch,
        unassignedIncidentData,
        isFetchUnassignedIncidentList,
        unassignedIncidentListRefetch,
        CommentsData,
        refetchGetComments,
        incID,
        setIncID,
        offset,
        setIsOnCAD,
        allResourcesData,
        isFetchAllResourcesData,
        getAllResourcesRefetch,
      }}
    >
      {children}
    </IncidentContext.Provider>
  );
};

export default IncidentData;

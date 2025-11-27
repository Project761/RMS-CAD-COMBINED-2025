import React, { createContext, useContext, useState, useCallback } from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import IncidentServices from '../../CADServices/APIs/incident';
import MonitorServices from '../../CADServices/APIs/monitor';

export const QueueCallContext = createContext();

export const useQueueCall = () => {
  const context = useContext(QueueCallContext);
  if (!context) {
    throw new Error('useQueueCall must be used within a QueueCallProvider');
  }
  return context;
};

const QueueCallProvider = ({ children }) => {
  const localStoreData = useSelector((state) => state.Agency.localStoreData);
  const [queueCall, setQueueCall] = useState("myQueueCall");
  const [queueCallData, setQueueCallData] = useState([]);
  const [queueCallCount, setQueueCallCount] = useState(0);
  const [loginPinID, setLoginPinID] = useState(null);
  const [loginAgencyID, setLoginAgencyID] = useState("");

  // Update login credentials when localStoreData changes
  React.useEffect(() => {
    if (localStoreData) {
      setLoginPinID(localStoreData?.PINID);
      setLoginAgencyID(localStoreData?.AgencyID);
    }
  }, [localStoreData]);

  const getQueueCallKey = `/CAD/CallTakerIncident/GetQueueCall/${queueCall === 'myQueueCall' ? loginPinID : 0}`;

  const {
    data,
    isError: isNoData,
    refetch: refetchQueueCall,
    isLoading: isQueueCallLoading
  } = useQuery(
    [getQueueCallKey, {
      "PINID": queueCall === 'myQueueCall' ? loginPinID : 0,
      "AgencyID": loginAgencyID,
    }],
    IncidentServices.getQueueCall,
    {
      refetchOnWindowFocus: false,
      retry: 0,
      enabled: !!loginAgencyID && !!loginPinID,
      onSuccess: (res) => {
        if (res?.data?.Data?.length === 0) {
          setQueueCallData([]);
        } else {
          try {
            const parsedData = JSON.parse(res?.data?.data);
            const data = parsedData?.Table;
            setQueueCallData(data || []);
          } catch (error) {
            console.error("Error parsing queue call data:", error);
            setQueueCallData([]);
          }
        }
      },
      onError: (error) => {
        console.error("Error fetching queue call data:", error);
        setQueueCallData([]);
      }
    }
  );

  // Queue Call Count Query
  const getQueueCallCountKey = `CAD/CallTakerIncident/GetQueueCallCount`;
  const {
    data: queueCallCountData,
    isSuccess: isFetchQueueCallCount,
    refetch: queueCallCountRefetch
  } = useQuery(
    [getQueueCallCountKey, { AgencyID: loginAgencyID }],
    MonitorServices.getQueueCallCount,
    {
      refetchOnWindowFocus: false,
      enabled: !!loginAgencyID,
      onSuccess: (res) => {
        const parsedData = JSON.parse(res?.data?.data)?.Table || [];
        setQueueCallCount(parsedData?.[0]?.QueueCallCount || 0);
      },
      onError: (error) => {
        if (error?.response?.data?.Code === 400) {
          console.error("No Data Available", error?.response?.data?.Message);
          setQueueCallCount(0);
        } else {
          console.error("An error occurred:", error);
          setQueueCallCount(0);
        }
      }
    }
  );

  // Function to switch between my queue calls and all queue calls
  const switchQueueCallType = useCallback((type) => {
    setQueueCall(type);
  }, []);

  // Function to refresh queue call data
  const refreshQueueCallData = useCallback(() => {
    refetchQueueCall();
  }, [refetchQueueCall]);

  // Function to get queue call count
  const getQueueCallCount = useCallback(() => {
    return queueCallCount;
  }, [queueCallCount]);

  // Function to check if there are any queue calls
  const hasQueueCalls = useCallback(() => {
    return queueCallData?.length > 0;
  }, [queueCallData]);

  // Function to refresh queue call count
  const refreshQueueCallCount = useCallback(() => {
    queueCallCountRefetch();
  }, [queueCallCountRefetch]);

  const contextValue = {
    // State
    queueCall,
    queueCallData,
    queueCallCount,
    loginPinID,
    loginAgencyID,
    isQueueCallLoading,
    isNoData,
    isFetchQueueCallCount,

    // Functions
    switchQueueCallType,
    refreshQueueCallData,
    refetchQueueCall,
    refreshQueueCallCount,
    queueCallCountRefetch,
    getQueueCallCount,
    hasQueueCalls,

    // Direct access to react-query states
    data,
    queueCallCountData,
  };

  return (
    <QueueCallContext.Provider value={contextValue}>
      {children}
    </QueueCallContext.Provider>
  );
};

export default QueueCallProvider;

import axios from "axios";
class ReportsServices {
  getEvenReceiveSourceReport = async (payload) => {
    if (payload) {
      return await axios.post(
        `/CAD/Report/EvenReceiveSourceReport`,
        payload
      );
    }
    console.warn("payload not provided, ReportsServices.getEvenReceiveSourceReport");
    return null;
  };

  getCallLogReport = async (payload) => {
    if (payload) {
      return await axios.post(
        `/CAD/Report/CallLogReport`,
        payload
      );
    }
    console.warn("payload not provided, ReportsServices.getCallLogReport");
    return null;
  };

  getPremiseHistoryReport = async (payload) => {
    if (payload) {
      return await axios.post(
        `/CAD/Report/PremiseHistoryReport`,
        payload
      );
    }
    console.warn("payload not provided, ReportsServices.getPremiseHistoryReport");
    return null;
  };

  getResourceHistoryReport = async (payload) => {
    if (payload) {
      return await axios.post(
        `CAD/Report/ResourceMasterReport`,
        payload
      );
    }
    console.warn("payload not provided, ReportsServices.getResourceHistoryReport");
    return null;
  };

  getLocationReport = async (payload) => {
    if (payload) {
      return await axios.post(
        `/CAD/Report/LocationReport`,
        payload
      );
    }
    console.warn("payload not provided, ReportsServices.getLocationReport");
    return null;
  };

  getOnOffDutyResorceReport = async (payload) => {
    if (payload) {
      return await axios.post(
        `/CAD/Report/OnOffDutyResorceReport`,
        payload
      );
    }
    console.warn("payload not provided, ReportsServices.getOnOffDutyResorceReport");
    return null;
  };

  getShiftSummaryReport = async (payload) => {
    if (payload) {
      return await axios.post(
        `/CAD/Report/ShiftSummaryReport`,
        payload
      );
    }
    console.warn("payload not provided, ReportsServices.getShiftSummaryReport");
    return null;
  };

  getShiftDetailedReport = async (payload) => {
    if (payload) {
      return await axios.post(
        `/CAD/Report/ShiftDetailedReport`,
        payload
      );
    }
    console.warn("payload not provided, ReportsServices.getShiftDetailedReport");
    return null;
  };

  getLocationFlagDetails = async (payload) => {
    if (payload) {
      return await axios.post(
        `/CAD/Report/LocationFlagDetails`,
        payload
      );
    }
    console.warn("payload not provided, ReportsServices.getLocationFlagDetails");
    return null;
  };

  getMiscellaneousStatusReport = async (payload) => {
    if (payload) {
      return await axios.post(
        `/CAD/Report/MiscellaneousStatusReport`,
        payload
      );
    }
    console.warn("payload not provided, ReportsServices.getMiscellaneousStatusReport");
    return null;
  };

  getCFSAnalysisReport = async (payload) => {
    if (payload) {
      return await axios.post(
        `/CAD/Report/CFSAnalysisReport`,
        payload
      );
    }
    console.warn("payload not provided, ReportsServices.getCFSAnalysisReport");
    return null;
  };

  getEventMasterReport = async (payload) => {
    if (payload) {
      return await axios.post(
        `/CAD/Report/EventMasterReport`,
        payload
      );
    }
    console.warn("payload not provided, ReportsServices.getEventMasterReport");
    return null;
  };

  getPatrolZoneReport = async (payload) => {
    if (payload) {
      return await axios.post(
        `/CAD/Report/PatrolZoneReport`,
        payload
      );
    }
    console.warn("payload not provided, ReportsServices.getPatrolZoneReport");
    return null;
  };

  getCallTakerActivityReport = async (payload) => {
    if (payload) {
      return await axios.post(
        `/CAD/Report/CallTakerActivityReport`,
        payload
      );
    }
    console.warn("payload not provided, ReportsServices.getCallTakerActivityReport");
    return null;
  };

  getEventPeakTimeReport = async (payload) => {
    if (payload) {
      return await axios.post(
        `/CAD/Report/EventPeakTimeReport`,
        payload
      );
    }
    console.warn("payload not provided, ReportsServices.getEventPeakTimeReport");
    return null;
  };

  getOfficerActivityReport = async (payload) => {
    if (payload) {
      return await axios.post(
        `/CAD/Report/OfficerActivityReport`,
        payload
      );
    }
    console.warn("payload not provided, ReportsServices.getOfficerActivityReport");
    return null;
  };

  getCloseCallReport = async (payload) => {
    if (payload) {
      return await axios.post(
        `/CAD/Report/CloseCallReport`,
        payload
      );
    }
    console.warn("payload not provided, ReportsServices.getCloseCallReport");
    return null;
  };

  getCallDispatchSummaryReport = async (payload) => {
    if (payload) {
      return await axios.post(
        `/CAD/Report/CallDispatchSummaryReport`,
        payload
      );
    }
    console.warn("payload not provided, ReportsServices.getCallDispatchSummaryReport");
    return null;
  };

  getDailyCallSummaryReport = async (payload) => {
    if (payload) {
      return await axios.post(
        `/CAD/Report/DailyCallSummaryReport`,
        payload
      );
    }
    console.warn("payload not provided, ReportsServices.getDailyCallSummaryReport");
    return null;
  };

  getCFSSummaryReport = async (payload) => {
    if (payload) {
      return await axios.post(
        `/CAD/Report/CFSSummaryReport`,
        payload
      );
    }
    console.warn("payload not provided, ReportsServices.getCFSSummaryReport");
    return null;
  };

  getDispatcherActivityReport = async (payload) => {
    if (payload) {
      return await axios.post(
        `/CAD/Report/DispatcherActivityReport`,
        payload
      );
    }
    console.warn("payload not provided, ReportsServices.getDispatcherActivityReport");
    return null;
  };

  getOfficerOnOffDutyReport = async (payload) => {
    if (payload) {
      return await axios.post(
        `CAD/Report/OfficerOnOffDutyReport`,
        payload
      );
    }
    console.warn("payload not provided, ReportsServices.getOfficerOnOffDutyReport");
    return null;
  };
}

const instance = new ReportsServices();

export default instance;

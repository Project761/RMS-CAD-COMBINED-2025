import axios from "axios";
class CaseManagementServices {

    getPendingCaseReview = async ({ queryKey }) => {
        const [_key, payload] = queryKey;
        if (payload) {
            return await axios.post(`/CaseManagement/GetAllPendingCasesByAgencyID`, payload);
        }
        console.warn("payload not provided, CaseManagementServices.getPendingCaseReview");
        return null;
    };

    getAllCaseManagementCaseData = async ({ queryKey }) => {
        const [_key, payload] = queryKey;
        if (payload) {
            return await axios.post(`/CaseManagement/GetAllCaseManagementCaseData`, payload);
        }
        console.warn("payload not provided, CaseManagementServices.getAllCaseManagementCaseData");
        return null;
    };

    getAllCaseTeam = async ({ queryKey }) => {
        const [_key, payload] = queryKey;
        if (payload) {
            return await axios.post(`/CaseManagement/GetAllCaseTeam`, payload);
        }
        console.warn("payload not provided, CaseManagementServices.getAllCaseTeam");
        return null;
    };

    getAllCaseEntities = async ({ queryKey }) => {
        const [_key, payload] = queryKey;
        if (payload) {
            return await axios.post(`/CaseManagement/GetAllCaseEntities`, payload);
        }
        console.warn("payload not provided, CaseManagementServices.getAllCaseEntities");
        return null;
    };

    getAllSupervisorCases = async ({ queryKey }) => {
        const [_key, payload] = queryKey;
        if (payload) {
            return await axios.post(`/CaseManagement/GetAllSupervisorCases`, payload);
        }
        console.warn("payload not provided, CaseManagementServices.getAllSupervisorCases");
        return null;
    };

    getCaseManagementCaseData = async ({ queryKey }) => {
        const [_key, payload] = queryKey;
        if (payload) {
            return await axios.post(`/CaseManagement/GetCaseManagementCaseData`, payload);
        }
        console.warn("payload not provided, CaseManagementServices.getCaseManagementCaseData");
        return null;
    };

    getSupervisorsByAgencyID = async ({ queryKey }) => {
        const [_key, payload] = queryKey;
        if (payload) {
            return await axios.post(`/Personnel/GetSupervisorsByAgencyID`, payload);
        }
        console.warn("payload not provided, CaseManagementServices.getSupervisorsByAgencyID");
        return null;
    };

    getProsecutorByAgencyID = async ({ queryKey }) => {
        const [_key, payload] = queryKey;
        if (payload) {
            return await axios.post(`/Personnel/GetProsecutorByAgencyID`, payload);
        }
        console.warn("payload not provided, CaseManagementServices.getProsecutorByAgencyID");
        return null;
    };

    getOfficerActivityByID = async (payload) => {
        if (payload) {
            return await axios.post(`/CaseManagement/GetOfficerActivityByID`, payload);
        }
        console.warn("payload not provided, CaseManagementServices.getOfficerActivityByID");
        return null;
    };

    caseManagementCaseReviewWithoutAssignment = async (payload) => {
        if (payload) {
            return await axios.post(`/CaseManagement/CaseManagementCaseReviewWithoutAssignment`, payload);
        }
        console.warn("payload not provided, CaseManagementServices.caseManagementCaseReviewWithoutAssignment");
        return null;
    };

    caseManagementCaseReviewWithAssign = async (payload) => {
        if (payload) {
            return await axios.post(`/CaseManagement/CaseManagementCaseReviewWithAssign`, payload);
        }
        console.warn("payload not provided, CaseManagementServices.caseManagementCaseReviewWithAssign");
        return null;
    };

    addCaseTeam = async (payload) => {
        if (payload) {
            return await axios.post(`/CaseManagement/AddCaseTeam`, payload);
        }
        console.warn("payload not provided, CaseManagementServices.addCaseTeam");
        return null;
    };

    updateCaseTeam = async (payload) => {
        if (payload) {
            return await axios.post(`/CaseManagement/UpdateCaseTeam`, payload);
        }
        console.warn("payload not provided, CaseManagementServices.updateCaseTeam");
        return null;
    };

    deleteCaseTeam = async (payload) => {
        if (payload) {
            return await axios.post(`/CaseManagement/DeleteCaseTeam`, payload);
        }
        console.warn("payload not provided, CaseManagementServices.deleteCaseTeam");
        return null;
    };

    addCaseEffort = async (payload) => {
        if (payload) {
            return await axios.post(`/CaseManagement/AddCaseEffort`, payload);
        }
        console.warn("payload not provided, CaseManagementServices.addCaseEffort");
        return null;
    };

    updateCaseEffort = async (payload) => {
        if (payload) {
            return await axios.post(`/CaseManagement/UpdateCaseEffort`, payload);
        }
        console.warn("payload not provided, CaseManagementServices.updateCaseEffort");
        return null;
    };

    getAllCaseEfforts = async ({ queryKey }) => {
        const [_key, payload] = queryKey;
        if (payload) {
            return await axios.post(`/CaseManagement/GetAllCaseEfforts`, payload);
        }
        console.warn("payload not provided, CaseManagementServices.getAllCaseEfforts");
        return null;
    };

    getPrimaryOfficerHistory = async ({ queryKey }) => {
        const [_key, payload] = queryKey;
        if (payload) {
            return await axios.post(`/CaseManagement/GetPrimaryOfficerHistory`, payload);
        }
        console.warn("payload not provided, CaseManagementServices.getPrimaryOfficerHistory");
        return null;
    };

    getActiveTeamMembers = async ({ queryKey }) => {
        const [_key, payload] = queryKey;
        if (payload) {
            return await axios.post(`/CaseManagement/GetActiveTeamMembers`, payload);
        }
        console.warn("payload not provided, CaseManagementServices.getActiveTeamMembers");
        return null;
    };

    insertDetectiveNote = async (payload) => {
        if (payload) {
            return await axios.post(`/CaseManagement/InsertDetective`, payload);
        }
        console.warn("payload not provided, CaseManagementServices.insertDetectiveNote");
        return null;
    };

    pinnedSourceType = async (payload) => {
        if (payload) {
            return await axios.post(`/CaseManagement/PinnedSourceType`, payload);
        }
        console.warn("payload not provided, CaseManagementServices.pinnedSourceType");
        return null;
    };

    getByID_Detective = async (payload) => {
        if (payload) {
            return await axios.post(`/CaseManagement/GetByID_Detective`, payload);
        }
        console.warn("payload not provided, CaseManagementServices.getByID_Detective");
        return null;
    };

    getAllDetectiveNotes = async ({ queryKey }) => {
        const [_key, payload] = queryKey;
        if (payload) {
            return await axios.post(`/CaseManagement/GetAllDetective`, payload);
        }
        console.warn("payload not provided, CaseManagementServices.getAllDetectiveNotes");
        return null;
    };

    updateDetectiveNote = async (payload) => {
        if (payload) {
            return await axios.post(`/CaseManagement/UpdateDetective`, payload);
        }
        console.warn("payload not provided, CaseManagementServices.updateDetectiveNote");
        return null;
    };

    deleteDetectiveNote = async (payload) => {
        if (payload) {
            return await axios.post(`/CaseManagement/DeleteDetective`, payload);
        }
        console.warn("payload not provided, CaseManagementServices.deleteDetectiveNote");
        return null;
    };

    deleteDetectiveDocument = async (payload) => {
        if (payload) {
            return await axios.post(`/CaseManagement/DeleteDetectiveDocument`, payload);
        }
        console.warn("payload not provided, CaseManagementServices.deleteDetectiveDocument");
        return null;
    };

    addCaseClosure = async (payload) => {
        if (payload) {
            return await axios.post(`/CaseManagement/AddCaseClosure`, payload);
        }
        console.warn("payload not provided, CaseManagementServices.addCaseClosure");
        return null;
    };

    getCaseClosureByID = async ({ queryKey }) => {
        const [_key, payload] = queryKey;
        if (payload) {
            return await axios.post(`/CaseManagement/GetCaseClosureByID`, payload);
        }
        console.warn("payload not provided, CaseManagementServices.getCaseClosureByID");
        return null;
    };

    addCaseNotification = async (payload) => {
        if (payload) {
            return await axios.post(`/CaseManagement/AddCaseNotification`, payload);
        }
        console.warn("payload not provided, CaseManagementServices.addCaseNotification");
        return null;
    };

    getCaseNotificationHistory = async ({ queryKey }) => {
        const [_key, payload] = queryKey;
        if (payload) {
            return await axios.post(`/CaseManagement/GetCaseNotificationHistory`, payload);
        }
        console.warn("payload not provided, CaseManagementServices.getCaseNotificationHistory");
        return null;
    };

    getDetectiveNoteDoc = async (payload) => {
        if (payload) {
            return await axios.post(`/CaseManagement/GetDataDetectiveDocuments`, payload);
        }
        console.warn("payload not provided, CaseManagementServices.getDetectiveNoteDoc");
        return null;
    };

    addManualPurge = async (payload) => {
        if (payload) {
            return await axios.post(`/CaseManagement/AddManualPurge`, payload);
        }
        console.warn("payload not provided, CaseManagementServices.addManualPurge");
        return null;
    };

    updateManualPurge = async (payload) => {
        if (payload) {
            return await axios.post(`/CaseManagement/UpdateManualPurge`, payload);
        }
        console.warn("payload not provided, CaseManagementServices.updateManualPurge");
        return null;
    };

    addManualPurgeApprove = async (payload) => {
        if (payload) {
            return await axios.post(`/CaseManagement/AddManualPurgeApprove`, payload);
        }
        console.warn("payload not provided, CaseManagementServices.addManualPurgeApprove");
        return null;
    };

    getManualPurgeByCaseID = async ({ queryKey }) => {
        const [_key, payload] = queryKey;
        if (payload) {
            return await axios.post(`/CaseManagement/GetManualPurgeByCaseID`, payload);
        }
        console.warn("payload not provided, CaseManagementServices.getManualPurgeByCaseID");
        return null;
    };

    updateDashboardCaseEfforts = async (payload) => {
        if (payload) {
            return await axios.post(`/CaseManagement/UpdateDashboardCaseEfforts`, payload);
        }
        console.warn("payload not provided, CaseManagementServices.updateDashboardCaseEffortsData");
        return null;
    };

    getPropertyForCaseManagement = async ({ queryKey }) => {
        const [_key, payload] = queryKey;
        if (payload) {
            return await axios.post(`/CaseManagement/GetPropertyForCaseManagement`, payload);
        }
        console.warn("payload not provided, CaseManagementServices.getPropertyForCaseManagement");
        return null;
    };

}

const instance = new CaseManagementServices();

export default instance;

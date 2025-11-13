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

}

const instance = new CaseManagementServices();

export default instance;

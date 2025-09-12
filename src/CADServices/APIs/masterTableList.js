import axios from "axios";
class MasterTableListServices {

    insertCFS = async (payload) => {
        if (payload) {
            return await axios.post(`/CAD/MasterCallforServiceCode/InsertCallforServiceCode`, payload);
        }
        console.warn("payload not provided, MasterTableListServices.insertCFS");
        return null;
    };

    getCFS = async ({ queryKey }) => {
        const [_key, payload] = queryKey;
        if (payload) {
            return await axios.post(`/CAD/MasterCallforServiceCode/InsertCallforServiceCode`, payload);
        }
        console.warn("payload not provided, MasterTableListServices.getCFS");
        return null;
    };

    getShift = async ({ queryKey }) => {
        const [_key, payloadShift] = queryKey;
        if (payloadShift) {
            return await axios.post(`/CAD/MasterResourceShift/GetData_Shift`, payloadShift);
        }
        console.warn("payload not provided, MasterTableListServices.getShift");
        return null;
    };

    getStationCode = async ({ queryKey }) => {
        const [_key, payloadStationCode] = queryKey;
        if (payloadStationCode) {
            return await axios.post(`/CAD/MasterStationCode/GetData_StationCode`, payloadStationCode);
        }
        console.warn("payload not provided, MasterTableListServices.getStationCode");
        return null;
    };

    getData_DropDown_StationCode = async ({ queryKey }) => {
        const [_key, payloadStationCode] = queryKey;
        if (payloadStationCode) {
            return await axios.post(`/CAD/MasterStationCode/GetData_DropDown_StationCode`, payloadStationCode);
        }
        console.warn("payload not provided, MasterTableListServices.getData_DropDown_StationCode");
        return null;
    };

    getResourceType = async ({ queryKey }) => {
        const [_key, payload] = queryKey;
        if (payload) {
            return await axios.post(`/CAD/MasterResourceType/GetData_ResourcesType`, payload);
        }
        console.warn("payload not provided, MasterTableListServices.getResourceType");
        return null;
    };

    getData_DropDown_ResourceType = async ({ queryKey }) => {
        const [_key, payload] = queryKey;
        if (payload) {
            return await axios.post(`/CAD/MasterResourceType/GetData_DropDown_ResourceType`, payload);
        }
        console.warn("payload not provided, MasterTableListServices.getData_DropDown_ResourceType");
        return null;
    };

    getHospitalStatusCode = async ({ queryKey }) => {
        const [_key, payload] = queryKey;
        if (payload) {
            return await axios.post(`/CAD/MasterHospitalStatusCode/GetData_HospitalStatusCode`, payload);
        }
        console.warn("payload not provided, MasterTableListServices.getHospitalStatusCode");
        return null;
    };

    getDataDropDown_HospitalStatusCode = async ({ queryKey }) => {
        const [_key, payload] = queryKey;
        if (payload) {
            return await axios.post(`/CAD/MasterHospitalStatusCode/GetDataDropDown_HospitalStatusCode`, payload);
        }
        console.warn("payload not provided, MasterTableListServices.getDataDropDown_HospitalStatusCode");
        return null;
    };

    insertHospitalStatusCode = async (payload) => {
        if (payload) {
            return await axios.post(`/CAD/MasterHospitalStatusCode/InsertHospitalStatusCode`, payload);
        }
        console.warn("payload not provided, MasterTableListServices.insertHospitalStatusCode");
        return null;
    };

    updateHospitalStatusCode = async (payload) => {
        if (payload) {
            return await axios.post(`/CAD/MasterHospitalStatusCode/UpdateHospitalStatusCode`, payload);
        }
        console.warn("payload not provided, MasterTableListServices.updateHospitalStatusCode");
        return null;
    };

    changeStatusHospitalStatusCode = async (payload) => {
        if (payload) {
            return await axios.post(`/CAD/MasterHospitalStatusCode/change_status`, payload);
        }
        console.warn("payload not provided, MasterTableListServices.changeStatusHospitalStatusCode");
        return null;
    };

    changeStatusIncidentDispositions = async (payload) => {
        if (payload) {
            return await axios.post(`/CAD/MasterIncidentDispositions/change_statusIncidentDispositions`, payload);
        }
        console.warn("payload not provided, MasterTableListServices.changeStatusIncidentDispositions");
        return null;
    };

    changeStatusBoloDisposition = async (payload) => {
        if (payload) {
            return await axios.post(`/CAD/Monitor/change_status`, payload);
        }
        console.warn("payload not provided, MasterTableListServices.changeStatusBoloDisposition");
        return null;
    };

    changeStatusBoloType = async (payload) => {
        if (payload) {
            return await axios.post(`/CAD/MasterBoloType/change_status`, payload);
        }
        console.warn("payload not provided, MasterTableListServices.changeStatusBoloType");
        return null;
    };

    getDataZone = async ({ queryKey }) => {
        const [_key, payload] = queryKey;
        if (payload) {
            return await axios.post(`/CAD/GeoPetrolZone/GetDataDropDown_Zone`, payload);
        }
        console.warn("payload not provided, MasterTableListServices.getDataZone");
        return null;
    };

    getResources = async ({ queryKey }) => {
        const [_key, payload] = queryKey;
        if (payload) {
            return await axios.post(`/CAD/MasterResource/GetResource`, payload);
        }
        console.warn("payload not provided, MasterTableListServices.getResources");
        return null;
    };

    getDataDropDown_Resource = async ({ queryKey }) => {
        const [_key, payload] = queryKey;
        if (payload) {
            return await axios.post(`/CAD/MasterResource/GetDataDropDown_Resource`, payload);
        }
        console.warn("payload not provided, MasterTableListServices.getDataDropDown_Resource");
        return null;
    };

    getSingleData_Resource = async ({ queryKey }) => {
        const [_key, payload] = queryKey;
        if (payload) {
            return await axios.post(`/CAD/MasterResource/GetSingleData_Resource`, payload);
        }
        console.warn("payload not provided, MasterTableListServices.getSingleData_Resource");
        return null;
    };

    getByIncidentResources = async ({ queryKey }) => {
        const [_key, payload] = queryKey;
        if (payload) {
            return await axios.post(`/CAD/CallTackerResource/GetData_Resources_ByIncidentId`, payload);
        }
        console.warn("payload not provided, MasterTableListServices.getByIncidentResources");
        return null;
    };

    getIncidentDispositions = async ({ queryKey }) => {
        const [_key, payload] = queryKey;
        if (payload) {
            return await axios.post(`/CAD/MasterIncidentDispositions/GetData_IncidentDispositions`, payload);
        }
        console.warn("payload not provided, MasterTableListServices.getIncidentDispositions");
        return null;
    };

    getDataDropDown_IncidentDispositions = async ({ queryKey }) => {
        const [_key, payload] = queryKey;
        if (payload) {
            return await axios.post(`/CAD/MasterIncidentDispositions/GetDataDropDown_IncidentDispositions`, payload);
        }
        console.warn("payload not provided, MasterTableListServices.getDataDropDown_IncidentDispositions");
        return null;
    };


    getBoloDisposition = async ({ queryKey }) => {
        const [_key, payload] = queryKey;
        if (payload) {
            return await axios.post(`/CAD/Monitor/MasterBoloDispositionGet`, payload);
        }
        console.warn("payload not provided, MasterTableListServices.getBoloDisposition");
        return null;
    };

    getData_DropDown_Bolo = async ({ queryKey }) => {
        const [_key, payload] = queryKey;
        if (payload) {
            return await axios.post(`/CAD/Monitor/GetData_DropDown_Bolo`, payload);
        }
        console.warn("payload not provided, MasterTableListServices.getData_DropDown_Bolo");
        return null;
    };

    getBoloType = async ({ queryKey }) => {
        const [_key, payload] = queryKey;
        if (payload) {
            return await axios.post(`/CAD/MasterBoloType/GetBoloType`, payload);
        }
        console.warn("payload not provided, MasterTableListServices.getBoloType");
        return null;
    };

    getData_DropDown_BoloType = async ({ queryKey }) => {
        const [_key, payload] = queryKey;
        if (payload) {
            return await axios.post(`/CAD/MasterBoloType/GetData_DropDown_BoloType`, payload);
        }
        console.warn("payload not provided, MasterTableListServices.getData_DropDown_BoloType");
        return null;
    };

    getPrimaryOfficer = async ({ queryKey }) => {
        const [_key, payload] = queryKey;
        return await axios.post(`/CAD/MasterPrimaryOfficer/PrimaryOfficer`, payload);
    };

    getAgencyCode = async ({ queryKey }) => {
        const [_key] = queryKey;
        return await axios.post(`/CAD/MasterAgency/MasterAgencyCode`);
    };

    insertResource = async (payload) => {
        if (payload) {
            return await axios.post(`/CAD/MasterResource/upsertResource`, payload);
        }
        console.warn("payload not provided, MasterTableListServices.insertResource");
        return null;
    };

    updateResource = async (payload) => {
        if (payload) {
            return await axios.post(`/CAD/CallTackerResource/UpdateResource`, payload);
        }
        console.warn("payload not provided, MasterTableListServices.updateResource");
        return null;
    };

    insertResourceType = async (payload) => {
        if (payload) {
            return await axios.post(`/CAD/MasterResourceType/InsertResourceType`, payload);
        }
        console.warn("payload not provided, MasterTableListServices.insertResourceType");
        return null;
    };

    updateResourceType = async (payload) => {
        if (payload) {
            return await axios.post(`/CAD/MasterResourceType/UpdateResourceType`, payload);
        }
        console.warn("payload not provided, MasterTableListServices.updateResourceType");
        return null;
    };

    insertZone = async (payload) => {
        if (payload) {
            return await axios.post(`/CAD/GeoPetrolZone/InsertZone`, payload);
        }
        console.warn("payload not provided, MasterTableListServices.insertZone");
        return null;
    };

    updateZone = async (payload) => {
        if (payload) {
            return await axios.post(`/CAD/GeoPetrolZone/UpdateZone`, payload);
        }
        console.warn("payload not provided, MasterTableListServices.updateZone");
        return null;
    };

    changeStatusStationCode = async (payload) => {
        if (payload) {
            return await axios.post(`/CAD/MasterStationCode/change_status`, payload);
        }
        console.warn("payload not provided, MasterTableListServices.changeStatusStationCode");
        return null;
    };

    changeStatusMasterResource = async (payload) => {
        if (payload) {
            return await axios.post(`/CAD/MasterResource/ChangeStatus`, payload);
        }
        console.warn("payload not provided, MasterTableListServices.changeStatusMasterResource");
        return null;
    };
    

      getDispositionData = async (payload) => {
        if (payload) {
            return await axios.post(`/CAD/MasterIncidentDispositions/GetDataDropDown_IncidentDispositions`, payload);
        }
        console.warn("payload not provided, MasterTableListServices.getDispositionData");
        return null;
    };


    // changeStatusMasterShift = async (payload) => {
    //     if (payload) {
    //         return await axios.post(`/CAD/MasterShift/change_status`, payload);
    //     }
    //     console.warn("payload not provided, MasterTableListServices.changeStatusMasterShift");
    //     return null;
    // };

    changeStatusAgencyCallFilter = async (payload) => {
        if (payload) {
            return await axios.post(`/CAD/MasterCFSagencycallfilter/change_status`, payload);
        }
        console.warn("payload not provided, MasterTableListServices.changeStatusAgencyCallFilter");
        return null;
    };

    changeStatusResourceType = async (payload) => {
        if (payload) {
            return await axios.post(`/CAD/MasterResourceType/change_status`, payload);
        }
        console.warn("payload not provided, MasterTableListServices.changeStatusResourceType");
        return null;
    };

    changeStatusCallforServiceCode = async (payload) => {
        if (payload) {
            return await axios.post(`/CAD/MasterCallforServiceCode/change_status`, payload);
        }
        console.warn("payload not provided, MasterTableListServices.changeStatusCallforServiceCode");
        return null;
    };
    changeStatusZone = async (payload) => {
        if (payload) {
            return await axios.post(`/CAD/GeoPetrolZone/change_status`, payload);
        }
        console.warn("payload not provided, MasterTableListServices.changeStatusZone");
        return null;
    };

    getZone = async ({ queryKey }) => {
        const [_key, payload] = queryKey;
        if (payload) {
            return await axios.post(`/CAD/GeoPetrolZone/GetData_Zone`, payload);
        }
        console.warn("payload not provided, MasterTableListServices.getZone");
        return null;
    };

    insertStationCode = async (payload) => {
        if (payload) {
            return await axios.post(`/CAD/MasterStationCode/InsertStationCode`, payload);
        }
        console.warn("payload not provided, MasterTableListServices.insertStationCode");
        return null;
    };

    updateStationCode = async (payload) => {
        if (payload) {
            return await axios.post(`CAD/MasterStationCode/UpdateStationCode`, payload);
        }
        console.warn("payload not provided, MasterTableListServices.updateStationCode");
        return null;
    };

    getCFSAgencyCallFilter = async ({ queryKey }) => {
        const [_key, payload] = queryKey;
        if (payload) {
            return await axios.post(`/CAD/MasterCFSagencycallfilter/GET_CFSagencycallfilter`, payload);
        }
        console.warn("payload not provided, MasterTableListServices.getCFSAgencyCallFilter");
        return null;
    };

    insertCFSAgencyCallFilter = async (payload) => {
        if (payload) {
            return await axios.post(`/CAD/MasterCFSagencycallfilter/Insert_CFSagencycallfilter`, payload);
        }
        console.warn("payload not provided, MasterTableListServices.insertCFSAgencyCallFilter");
        return null;
    };

    updateCFSagencycallfilter = async (payload) => {
        if (payload) {
            return await axios.post(`/CAD/MasterCFSagencycallfilter/UPDATECFSagencycallfilter`, payload);
        }
        console.warn("payload not provided, MasterTableListServices.updateCFSagencycallfilter");
        return null;
    };

    insertMiscellaneous = async (payload) => {
        if (payload) {
            return await axios.post(`/CAD/MasterMiscellaneous/InsertMiscellaneous`, payload);
        }
        console.warn("payload not provided, MasterTableListServices.insertMiscellaneous");
        return null;
    };

    updateMiscellaneous = async (payload) => {
        if (payload) {
            return await axios.post(`/CAD/MasterMiscellaneous/UpdateMiscellaneous`, payload);
        }
        console.warn("payload not provided, MasterTableListServices.updateMiscellaneous");
        return null;
    };

    getDataDropDown_MiscellaneousStatus = async ({ queryKey }) => {
        const [_key, payload] = queryKey;
        if (payload) {
            return await axios.post(`/CAD/MasterMiscellaneous/GetDataDropDown_MiscellaneousStatus`, payload);
        }
        console.warn("payload not provided, MasterTableListServices.getDataDropDown_MiscellaneousStatus");
        return null;
    };

    getMiscellaneousStatus = async ({ queryKey }) => {
        const [_key, payload] = queryKey;
        if (payload) {
            return await axios.post(`/CAD/MasterMiscellaneous/GetData_MiscellaneousStatus`, payload);
        }
        console.warn("payload not provided, MasterTableListServices.getMiscellaneousStatus");
        return null;
    };

    changeMiscellaneousStatus = async (payload) => {
        if (payload) {
            return await axios.post(`CAD/MasterMiscellaneous/Misc_changeStatus`, payload);
        }
        console.warn("payload not provided, MasterTableListServices.changeMiscellaneousStatus");
        return null;
    };

    insertResourceStatusColor = async (payload) => {
        if (payload) {
            return await axios.post(`/CAD/ResourceStatusColor/InsertResourceStatusColor`, payload);
        }
        console.warn("payload not provided, MasterTableListServices.insertResourceStatusColor");
        return null;
    };

    updateResourceStatusColor = async (payload) => {
        if (payload) {
            return await axios.post(`/CAD/ResourceStatusColor/UpdateResourceStatusColor`, payload);
        }
        console.warn("payload not provided, MasterTableListServices.updateResourceStatusColor");
        return null;
    };

    getResourceStatusColor = async ({ queryKey }) => {
        const [_key, payload] = queryKey;
        if (payload) {
            return await axios.post(`/CAD/ResourceStatusColor/GetData_ResourceStatusColor`, payload);
        }
        console.warn("payload not provided, MasterTableListServices.getResourceStatusColor");
        return null;
    };

    getData_DropDown_ResourceStatusColor = async ({ queryKey }) => {
        const [_key, payload] = queryKey;
        if (payload) {
            return await axios.post(`/CAD/ResourceStatusColor/GetData_DropDown_ResourceStatusColor`, payload);
        }
        console.warn("payload not provided, MasterTableListServices.getData_DropDown_ResourceStatusColor");
        return null;
    };

    changeStatusResourceStatusColor = async (payload) => {
        if (payload) {
            return await axios.post(`/CAD/ResourceStatusColor/change_status`, payload);
        }
        console.warn("payload not provided, MasterTableListServices.changeStatusResourceStatusColor");
        return null;
    };

    insertMasterPriority = async (payload) => {
        if (payload) {
            return await axios.post(`/CAD/MasterPriority/InsertMasterPriority`, payload);
        }
        console.warn("payload not provided, MasterTableListServices.insertMasterPriority");
        return null;
    };

    updateMasterPriority = async (payload) => {
        if (payload) {
            return await axios.post(`/CAD/MasterPriority/UpdateMasterPriority`, payload);
        }
        console.warn("payload not provided, MasterTableListServices.updateMasterPriority");
        return null;
    };

    getMasterPriority = async ({ queryKey }) => {
        const [_key, payload] = queryKey;
        if (payload) {
            return await axios.post(`/CAD/MasterPriority/GetData_Priority`, payload);
        }
        console.warn("payload not provided, MasterTableListServices.getMasterPriority");
        return null;
    };

    getDataDropDown_Priority = async ({ queryKey }) => {
        const [_key, payload] = queryKey;
        if (payload) {
            return await axios.post(`/CAD/MasterPriority/GetDataDropDown_Priority`, payload);
        }
        console.warn("payload not provided, MasterTableListServices.getDataDropDown_Priority");
        return null;
    };

    changeStatusMasterPriority = async (payload) => {
        if (payload) {
            return await axios.post(`/CAD/MasterPriority/change_status`, payload);
        }
        console.warn("payload not provided, MasterTableListServices.changeStatusMasterPriority");
        return null;
    };

    insertMasterDisposition = async (payload) => {
        if (payload) {
            return await axios.post(`/CAD/MasterIncidentDispositions/InsertIncidentDispositions`, payload);
        }
        console.warn("payload not provided, MasterTableListServices.insertMasterDisposition");
        return null;
    };

    insertMasterBoloDisposition = async (payload) => {
        if (payload) {
            return await axios.post(`/CAD/Monitor/MasterBoloDispositionInsert`, payload);
        }
        console.warn("payload not provided, MasterTableListServices.insertMasterBoloDisposition");
        return null;
    };
    insertBoloType = async (payload) => {
        if (payload) {
            return await axios.post(`/CAD/MasterBoloType/InsertBoloType`, payload);
        }
        console.warn("payload not provided, MasterTableListServices.insertBoloType");
        return null;
    };

    updateBoloType = async (payload) => {
        if (payload) {
            return await axios.post(`/CAD/MasterBoloType/UpdateBoloType`, payload);
        }
        console.warn("payload not provided, MasterTableListServices.updateBoloType");
        return null;
    };

    updateMasterDisposition = async (payload) => {
        if (payload) {
            return await axios.post(`/CAD/MasterIncidentDispositions/UpdateIncidentDispositions`, payload);
        }
        console.warn("payload not provided, MasterTableListServices.updateMasterDisposition");
        return null;
    };

    updateBoloDisposition = async (payload) => {
        if (payload) {
            return await axios.post(`/CAD/Monitor/MasterBoloDispositionUpdate`, payload);
        }
        console.warn("payload not provided, MasterTableListServices.updateBoloDisposition");
        return null;
    };

    insertMasterOnOfDutyConfiguration = async (payload) => {
        if (payload) {
            return await axios.post(`/CAD/MasterOnOfDutyConfiguration/InsertMasterOnOfDutyConfiguration`, payload);
        }
        console.warn("payload not provided, MasterTableListServices.insertMasterOnOfDutyConfiguration");
        return null;
    };

    updateMasterOnOfDutyConfiguration = async (payload) => {
        if (payload) {
            return await axios.post(`/CAD/MasterOnOfDutyConfiguration/UpdateMasterOnOfDutyConfiguration`, payload);
        }
        console.warn("payload not provided, MasterTableListServices.updateMasterOnOfDutyConfiguration");
        return null;
    };

    getMasterOnOfDutyConfiguration = async ({ queryKey }) => {
        const [_key, payload] = queryKey;
        if (payload) {
            return await axios.post(`/CAD/MasterOnOfDutyConfiguration/GetMasterOnOfDutyConfiguration`, payload);
        }
        console.warn("payload not provided, MasterTableListServices.getMasterOnOfDutyConfiguration");
        return null;
    };

    //Type of flag
    getTypeOfFlag = async ({ queryKey }) => {
        const [_key, payload] = queryKey;
        if (payload) {
            return await axios.post(`/CAD/MasterTypeOfFlag/GetData_Flag`, payload);
        }
        console.warn("payload not provided, MasterTableListServices.getTypeOfFlag");
        return null;
    };

    getData_DropDown_Flag = async ({ queryKey }) => {
        const [_key, payload] = queryKey;
        if (payload) {
            return await axios.post(`/CAD/MasterTypeOfFlag/GetData_DropDown_Flag`, payload);
        }
        console.warn("payload not provided, MasterTableListServices.getData_DropDown_Flag");
        return null;
    };

    insertTypeOfFlag = async (payload) => {
        if (payload) {
            return await axios.post(`/CAD/MasterTypeOfFlag/InsertFlag`, payload);
        }
        console.warn("payload not provided, MasterTableListServices.insertTypeOfFlag");
        return null;
    };

    updateFlag = async (payload) => {
        if (payload) {
            return await axios.post(`/CAD/MasterTypeOfFlag/UpdateFlag`, payload);
        }
        console.warn("payload not provided, MasterTableListServices.updateFlag");
        return null;
    };

    changeStatusTypeOfFlag = async (payload) => {
        if (payload) {
            return await axios.post(`/CAD/MasterTypeOfFlag/change_status`, payload);
        }
        console.warn("payload not provided, MasterTableListServices.changeStatusTypeOfFlag");
        return null;
    };

    getOperator = async ({ queryKey }) => {
        const [_key, payload] = queryKey;
        if (payload) {
            return await axios.post(`/CAD/Operator_search/Operator`, payload);
        }
        console.warn("payload not provided, MasterTableListServices.getOperator");
        return null;
    };

    getUnVerifiedLocations = async ({ queryKey }) => {
        const [_key, payload] = queryKey;
        if (payload) {
            return await axios.post(`/CAD/GeoLocation/GetUnVerifiedLocations`, payload);
        }
        console.warn("payload not provided, MasterTableListServices.getUnVerifiedLocations");
        return null;
    };

    insertBadges = async (payload) => {
        if (payload) {
            return await axios.post(`CAD/MasterBadges/InsertBadges`, payload);
        }
        console.warn("payload not provided, MasterTableListServices.insertBadges");
        return null;
    };

    updateBadges = async (payload) => {
        if (payload) {
            return await axios.post(`/CAD/MasterBadges/Updatebadges`, payload);
        }
        console.warn("payload not provided, MasterTableListServices.updateBadges");
        return null;
    };

    getDataBadges = async ({ queryKey }) => {
        const [_key, payload] = queryKey;
        if (payload) {
            return await axios.post(`/CAD/MasterBadges/GetDataBadges`, payload);
        }
        console.warn("payload not provided, MasterTableListServices.GetDataBadges");
        return null;
    };

    getDataJurisdiction = async ({ queryKey }) => {
        const [_key, payload] = queryKey;
        if (payload) {
            return await axios.post(`/CAD/MasterJurisdiction/GetDataJurisdiction`, payload);
        }
        console.warn("payload not provided, MasterTableListServices.GetDataJurisdiction");
        return null;
    };

    insertJurisdiction = async (payload) => {
        if (payload) {
            return await axios.post(`/CAD/MasterJurisdiction/InsertJurisdiction`, payload);
        }
        console.warn("payload not provided, MasterTableListServices.insertJurisdiction");
        return null;
    };

    getDataDropDownJurisdiction = async ({ queryKey }) => {
        const [_key, payload] = queryKey;
        if (payload) {
            return await axios.post(`/CAD/MasterJurisdiction/GetDataDropDownJurisdiction`, payload);
        }
        console.warn("payload not provided, MasterTableListServices.getDataDropDownJurisdiction");
        return null;
    };

    updateJurisdiction = async (payload) => {
        if (payload) {
            return await axios.post(`/CAD/MasterJurisdiction/UpdateJurisdiction`, payload);
        }
        console.warn("payload not provided, MasterTableListServices.updateJurisdiction");
        return null;
    };

    changeStatusJurisdiction = async (payload) => {
        if (payload) {
            return await axios.post(`CAD/MasterJurisdiction/changeStatus`, payload);
        }
        console.warn("payload not provided, MasterTableListServices.changeStatusJurisdiction");
        return null;
    };

    changeStatusMasterBadges = async (payload) => {
        if (payload) {
            return await axios.post(`/CAD/MasterBadges/change_status`, payload);
        }
        console.warn("payload not provided, MasterTableListServices.changeStatusMasterBadges");
        return null;
    };

    getDataDropDownBadges = async ({ queryKey }) => {
        const [_key, payload] = queryKey;
        if (payload) {
            return await axios.post(`/CAD/MasterBadges/GetDataDropDownBadges`, payload);
        }
        console.warn("payload not provided, MasterTableListServices.getDataDropDownBadges");
        return null;
    };

}

const instance = new MasterTableListServices();

export default instance;

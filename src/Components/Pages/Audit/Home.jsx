import React, { useContext, useEffect, useState } from "react";
import { Requiredcolour } from "../../Common/Utility";
import Select from "react-select";
import { RequiredFieldIncident } from "../Utility/Personnel/Validation";
import { AgencyContext } from "../../../Context/Agency/Index";
import BlindCount from "./BlindCount";
import Reconcile from "./Reconcile";
import Reports from "./Reports";
import { get_AgencyOfficer_Data } from "../../../redux/actions/DropDownsData";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

// Mock data for dropdowns
const auditTypeOptions = [
    { value: 'full', label: 'Full Audit' },
    { value: 'partial', label: 'Partial Audit' },
    { value: 'spot', label: 'Spot Check' },
];

const periodOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
];

const locationOptions = [
    { value: 'room1', label: 'Evidence Room 1' },
    { value: 'room2', label: 'Evidence Room 2' },
    { value: 'vault', label: 'Secure Vault' },
];

const rooms = [
    { name: "Room 1", sample: 10, total: 100 },
    { name: "Room 2", sample: 15, total: 50 },
    { name: "Room 3", sample: 5, total: 20 },
    { name: "Room 4", sample: 5, total: 20 },
];

const methodOptions = [
    { value: 'room1', label: 'Random Sample' },
    { value: 'room2', label: 'All Items in Selected Locations' },
  
];




const PropertyAuditTab = ({ DecProRomId, DecPropID, DecMPropID }) => {

    const agencyOfficerDrpData = useSelector((state) => state.DropDown.agencyOfficerDrpData);
    const localStoreData = useSelector((state) => state.Agency.localStoreData);

    const dispatch = useDispatch();

    const [activeTab, setActiveTab] = useState(1);
    const [auditType, setAuditType] = useState(auditTypeOptions);
    const [period, setPeriod] = useState(periodOptions);
    const [locationList, setLocationList] = useState(locationOptions);
    const [isEvidenceStatus, setIsEvidenceStatus] = useState(false);
    const [collectionDate, setCollectionDate] = useState(undefined);
    const [dispatchDate, setDispatchDate] = useState(undefined);
    const [expectedArrival, setExpectedArrival] = useState(undefined);
    const [statesChangeStatus, setStatesChangeStatus] = useState(false);
    const [updateCount, setUpdateCount] = useState(0);
    const [teamList, setTeamList] = useState([]);
    const [methodList, setMethodList] = useState(methodOptions);
    const [supervisorList, setSupervisorList] = useState([]);
    const [isSampleGenerated, setIsSampleGenerated] = useState(false);
    const { get_Incident_Count, incidentCount, setChangesStatus } = useContext(AgencyContext);
    const [loginAgencyID, setloginAgencyID] = useState('');
    const [loginPinID, setloginPinID,] = useState('');
    const [editval, setEditval] = useState([]);


    const [value, setValue] = useState({
        'AuditType': '', 'Period': '', 'Location': '',
    });

    const [errors, setErrors] = useState({
        'AuditTypeError': '', 'PeriodError': '', 'LocationError': '',
    })

    const tabs = [
        { id: 1, label: "1. Plan" },
        { id: 2, label: "2. Blind Count" },
        { id: 3, label: "3. Reconcile" },
        { id: 4, label: "4. Reports" },
    ];

    useEffect(() => {
        if (localStoreData) {
            setloginAgencyID(localStoreData?.AgencyID); setloginPinID(localStoreData?.PINID);

        }
    }, [localStoreData]);

    useEffect(() => {
        if (loginAgencyID) {
            if (agencyOfficerDrpData?.length === 0) { dispatch(get_AgencyOfficer_Data(loginAgencyID)); }
        }
    }, [loginAgencyID]);


    const check_Validation_Error = (e) => {
        const AuditTypeError = RequiredFieldIncident(value.AuditType);
        const PeriodError = RequiredFieldIncident(value.Period);
        const LocationError = RequiredFieldIncident(value.Location);

        setErrors(prevValues => ({
            ...prevValues,
            'AuditTypeError': AuditTypeError || '',
            'PeriodError': PeriodError || '',
            'LocationError': LocationError || ''
        }));

        return !(AuditTypeError || PeriodError || LocationError);
    }

    const ChangeDropDown = (e, name) => {
        if (e) {
            setValue({
                ...value,
                [name]: e.value
            })
        } else {
            setValue({
                ...value,
                [name]: null
            });

        }
    };

    useEffect(() => {
        if (editval) {
            setValue({
                // ...value, PropertyID: editval?.PropertyID || '', ActivityType: editval?.ActivityType || '',

                // ExpectedDate: editval?.ExpectedDate || '', ActivityComments: editval?.ActivityComments || '', OtherPersonNameID: editval?.OtherPersonNameID || '',
                // PropertyRoomPersonNameID: editval?.PropertyRoomPersonNameID || '', ChainDate: editval?.ChainDate || '',
                // DestroyDate: editval?.DestroyDate ? new Date(editval.DestroyDate) : '', CourtDate: editval?.CourtDate ? new Date(editval.CourtDate) : '', ReleaseDate: editval?.ReleaseDate ? new Date(editval.ReleaseDate) : '',
                // PropertyTag: editval?.PropertyTag || '', RecoveryNumber: editval?.RecoveryNumber || '', StorageLocationID: editval?.StorageLocationID || '',
                // ReceiveDate: editval?.ReceiveDate || '', OfficerNameID: editval?.OfficerNameID || '', InvestigatorID: editval?.InvestigatorID || '', location: editval?.location || '',
                // activityid: editval?.activityid || '', EventId: editval?.EventId || '', MasterPropertyId: editval?.MasterPropertyId || '',
                // CreatedByUserFK: editval?.CreatedByUserFK || '',
            });



        } else {
            setValue({
                // ...value, PropertyID: editval?.PropertyID || '',
                // StorageLocationID: editval?.StorageLocationID || '',
                // location: editval?.location || '',

            });

        }
    }, [editval]);

    // Initialize with default values or fetch from API if needed
    useEffect(() => {
        // You can add API calls here to fetch initial data if needed
        // For now, we'll just initialize with empty values
    }, [DecProRomId, DecPropID, DecMPropID]);



    const Reset = (e) => {
        setValue({
            'AuditType': '', 'Period': '', 'Location': '',
        });
        setErrors({
            'AuditTypeError': '', 'PeriodError': '', 'LocationError': '',
        });
        setStatesChangeStatus(false);
        setCollectionDate(undefined);
        setDispatchDate(undefined);
        setExpectedArrival(undefined);
        setUpdateCount(prevCount => prevCount + 1);
    }


    const handleChange = (e) => {

    };


    return (
        <div className="audit-home mt-4">
            <div className="audit-home__header">
                <ul className="audit-home__tabs">
                    {tabs.map((tab) => (
                        <li
                            key={tab.id}
                            className={`audit-home__tab-item ${activeTab === tab.id ? "active" : ""
                                }`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.label}
                        </li>
                    ))}
                </ul>

                <div className="audit-home__info">
                    <div className="audit-home__infoBox">Audit ID: - AUD 7WD354  </div>
                    <div className="audit-home__infoBox">Elapsed: 00:00:00</div>
                </div>
            </div>

            <div className="audit-home__tab-content px-0">
                {activeTab === 1 && (
                    <div className="plan-audit">
                        <div className="plan-audit__header">
                            <h4 className="plan-audit__title">Plan Audit</h4>
                            <div className="plan-audit__stats">
                                <div className="plan-audit__stat">Inventory loaded: 0</div>
                                <div className="plan-audit__stat">Sample generated: 0</div>
                            </div>
                        </div>
                        <hr />

                        <div className="col-12 col-md-6 col-lg-12">
                            <div className="row align-items-center" style={{ rowGap: "10px" }}>
                                <div className="col-3 col-md-2 col-lg-1 ">
                                    <label htmlFor="" className='new-label mb-0'>Audit Type{errors.AuditTypeError !== 'true' ? (
                                        <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.AuditTypeError}</p>
                                    ) : null}</label>
                                </div>
                                <div className="col-4 col-md-3 col-lg-3">
                                    <Select
                                        name='AuditType'

                                        value={auditType?.filter((obj) => obj.value == value?.AuditType)}
                                        options={auditType}
                                        onChange={(e) => ChangeDropDown(e, 'AuditType')}
                                        placeholder="Select.."
                                        menuPlacement="bottom"
                                        className='requiredColor'
                                        isClearable

                                    />
                                </div>

                                <div className="col-3 col-md-2 col-lg-1 ">
                                    <label htmlFor="" className='new-label mb-0'>Period{errors.PeriodError !== 'true' ? (
                                        <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.PeriodError}</p>
                                    ) : null}</label>
                                </div>
                                <div className="col-4 col-md-3 col-lg-3">
                                    <Select
                                        name='Period'

                                        value={period?.filter((obj) => obj.value == value?.Period)}
                                        options={period}
                                        onChange={(e) => ChangeDropDown(e, 'Period')}
                                        placeholder="Select.."
                                        menuPlacement="bottom"
                                        className='requiredColor'
                                        isClearable

                                    />
                                </div>

                                <div className="col-3 col-md-2 col-lg-1 ">
                                    <label htmlFor="" className='new-label mb-0'>Location{errors.LocationError !== 'true' ? (
                                        <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.LocationError}</p>
                                    ) : null}</label>
                                </div>
                                <div className="col-4 col-md-3 col-lg-3">
                                    <Select
                                        name='Location'

                                        value={locationList?.filter((obj) => obj.value == value?.Location)}
                                        options={locationList}
                                        onChange={(e) => ChangeDropDown(e, 'Location')}
                                        placeholder="Select.."
                                        menuPlacement="bottom"
                                        className='requiredColor'
                                        isClearable
                                    />
                                </div>


                                <div className="col-3 col-md-2 col-lg-1 ">
                                    <label htmlFor="" className='new-label mb-0'>Team{errors.TeamError !== 'true' ? (
                                        <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.TeamError}</p>
                                    ) : null}</label>
                                </div>
                                <div className="col-4 col-md-3 col-lg-3">
                                    <Select
                                        name='Team'
                                        value={teamList?.filter((obj) => obj.value == value?.Team)}
                                        options={teamList}
                                        onChange={(e) => ChangeDropDown(e, 'Team')}
                                        placeholder="Select.."
                                        menuPlacement="bottom"
                                        className='requiredColor'
                                        isClearable
                                    />
                                </div>


                                <div className="col-3 col-md-2 col-lg-1 ">
                                    <label htmlFor="" className='new-label mb-0'>Method{errors.MethodError !== 'true' ? (
                                        <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.MethodError}</p>
                                    ) : null}</label>
                                </div>
                                <div className="col-4 col-md-3 col-lg-3">
                                    <Select
                                        name='Method'
                                        value={methodList?.filter((obj) => obj.value == value?.Method)}
                                        options={methodList}
                                        onChange={(e) => ChangeDropDown(e, 'Method')}
                                        placeholder="Select.."
                                        menuPlacement="bottom"
                                        className='requiredColor'
                                        isClearable
                                    />
                                </div>


                                <div className="col-3 col-md-2 col-lg-1">
                                    <label htmlFor="" className="new-label mb-0 ">
                                        Sample Size
                                    </label>
                                </div>
                                <div className="col-4 col-md-3 col-lg-3 d-flex align-items-center gap-2" style={{ columnGap: "5px" }} >
                                    <div className="text-field mt-0">
                                        <input
                                            type="number"
                                            name="SampleSize"
                                            value={value.SampleSize}
                                            onChange={(e) => handleChange(e)}
                                        />
                                    </div>

                                    <div className="text-field mt-0">
                                        <input
                                            type="number"
                                            name="SampleSize"
                                            value={value.SampleSize}
                                            onChange={(e) => handleChange(e)}
                                        />
                                    </div>
                                </div>

                                <div className="col-3 col-md-2 col-lg-1 ">
                                    <label htmlFor="" className='new-label mb-0'>Supervisor{errors.SupervisorError !== 'true' ? (
                                        <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.SupervisorError}</p>
                                    ) : null}</label>
                                </div>
                                <div className="col-4 col-md-3 col-lg-3">
                                    <Select
                                        name='Supervisor'
                                        value={agencyOfficerDrpData?.filter((obj) => obj.value === value?.Supervisor)}
                                        isClearable
                                        options={agencyOfficerDrpData}
                                        onChange={(e) => ChangeDropDown(e, 'Supervisor')}
                                        placeholder="Select.."
                                        menuPlacement="bottom"
                                        className='requiredColor'

                                    />
                                </div>

                                <div className="col-1 ">
                                    <label className="new-label mb-0">Notes</label>
                                </div>

                                <div className="col-12 col-md-10 col-lg-7">
                                    <textarea
                                        type="text"
                                        name="Notes"
                                        value={value.Notes}
                                        onChange={(e) => handleChange(e)}
                                        rows="1"
                                        className="form-control  py-1 new-input"
                                        style={{ height: "auto", overflowY: "scroll" }}
                                        placeholder="Notes"
                                    />
                                </div>
                            </div>

                            <fieldset className="mt-3">
                                <legend>Coverage (this audit)</legend>
                            </fieldset>
                            {isSampleGenerated && (
                                <>
                                    <div className="row align-items-stretch g-3 mt-2">
                                        {rooms.map((room, idx) => {
                                            const progress = (room.sample / room.total) * 100;
                                            return (
                                                <div className="col-12 col-sm-6 col-lg-3" key={idx}>
                                                    <div className="room-box p-3 h-100">
                                                        <h6 className="fw-bold">{room.name}</h6>
                                                        <p className="text-muted small mb-2">
                                                            {room.sample}/{room.total} in sample
                                                        </p>
                                                        <div className="progress" style={{ height: "6px" }}>
                                                            <div
                                                                className="progress-bar bg-primary"
                                                                role="progressbar"
                                                                style={{ width: `${progress}%` }}
                                                                aria-valuenow={progress}
                                                                aria-valuemin="0"
                                                                aria-valuemax="100"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className="d-flex justify-content-between align-items-center mt-4">
                                        {/* Left Text */}
                                        <p className="text-muted small mb-0">
                                            After <strong>Start Audit</strong>, the sample list is frozen and a
                                            counter link is issued.
                                        </p>

                                        {/* Right Buttons */}
                                        <div className="d-flex gap-2">
                                            <button type="button" className="btn btn-sm btn-success mr-1">Load Inventory</button>
                                            <button type="button" className="btn btn-sm btn-success mr-1">Re-Generate Sample</button>
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-success"
                                                onClick={() => setActiveTab(2)}
                                            >
                                                Start Audit
                                            </button>
                                        </div>
                                    </div>

                                </>
                            )}


                            {!isSampleGenerated && (
                                <div className="col-12 d-flex justify-content-end  text-end">
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-success mr-1"
                                        onClick={() => {
                                            // Add any quick start logic here
                                            setActiveTab(2);
                                        }}
                                    >
                                        Quick Start Monthly Audit
                                    </button>
                                    <button type="button" className="btn btn-sm btn-success mr-1">Load Inventory</button>
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-success"
                                        onClick={() => setIsSampleGenerated(true)}
                                    >
                                        Generate Sample
                                    </button>
                                </div>
                            )}


                        </div>
                    </div>
                )}

                {activeTab === 2 && <p><BlindCount /></p>}
                {activeTab === 3 && <p><Reconcile /></p>}
                {activeTab === 4 && <p><Reports /></p>}
            </div>
        </div>
    );
};

export default PropertyAuditTab;

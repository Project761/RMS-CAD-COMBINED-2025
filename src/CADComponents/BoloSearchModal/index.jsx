import { memo, useEffect, useState, useRef, useContext, useCallback } from "react";
import { useQuery } from "react-query";
import Select from "react-select";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import DataTable from "react-data-table-component";
import { useReactToPrint } from "react-to-print";
import { getShowingDateText, getShowingWithOutTime, tableCustomStyles } from "../../Components/Common/Utility";
import { colorLessStyle_Select } from "../Utility/CustomStylesForReact";
import useObjState from "../../CADHook/useObjState";
import MasterTableListServices from "../../CADServices/APIs/masterTableList";
import { compareStrings, dropDownDataModel } from "../../CADUtils/functions/common";
import BoloServices from "../../CADServices/APIs/bolo";
import Tooltip from "../Common/Tooltip";
import DatePicker from "react-datepicker";
import ViewImageModal from "../ViewImageModal/ViewImageModal";
import { toastifyError } from "../../Components/Common/AlertMsg";
import BoloSearchPrintReport from "./BoloSearchPrintReport";
import { fetchPostData } from "../../Components/hooks/Api";
import { AgencyContext } from "../../Context/Agency/Index";
import { getData_DropDown_Operator, getData_DropDown_Priority, getData_DropDown_Zone } from "../../CADRedux/actions/DropDownsData";


const BoloSearchModal = (props) => {
    const { openBoloSearchModal, setOpenBoloSearchModal } = props;
    const dispatch = useDispatch();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const { GetDataTimeZone, datezone } =
        useContext(AgencyContext);
    const [loginAgencyID, setLoginAgencyID] = useState('');
    const [boloDisposition, setBoloDisposition] = useState([]);
    const [typeOFBOLO, setTypeOFBOLO] = useState([]);
    const [boloSearchList, setBoloSearchList] = useState([]);
    const [zoneDropDown, setZoneDropDown] = useState([])
    const [imageModalStatus, setImageModalStatus] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(false);
    const [searchData, setSearchData] = useState([])
    const OperatorDrpData = useSelector((state) => state.CADDropDown.OperatorDrpData);
    const PriorityDrpData = useSelector((state) => state.CADDropDown.PriorityDrpData);
    const ZoneDrpData = useSelector((state) => state.CADDropDown.ZoneDrpData);

    const [
        boloSearchState,
        ,
        handleBoloSearchState,
        clearBoloSearchState,
    ] = useObjState({
        TypeOfBolo: "",
        BOLODisposition: "",
        Zone: "",
        Priority: "",
        startDate: "",
        endDate: "",
        dispatcher: "",
        Message: "",
        isClosed: false,
    });

    const getBoloDispositionKey = `/CAD/Monitor/GetData_DropDown_Bolo/${loginAgencyID}`;
    const { data: getBoloDispositionData, isSuccess: isFetchBoloDisposition } = useQuery(
        [getBoloDispositionKey, {
            "AgencyID": loginAgencyID,
        },],
        MasterTableListServices.getData_DropDown_Bolo,
        {
            refetchOnWindowFocus: false,
            enabled: openBoloSearchModal && !!loginAgencyID,
        }
    )

    const getBoloTypeKey = `/CAD/MasterBoloType/GetData_DropDown_BoloType/${loginAgencyID}`;
    const { data: getBoloTypeData, isSuccess: isFetchBoloType } = useQuery(
        [getBoloTypeKey, {
            "AgencyID": loginAgencyID

        },],
        MasterTableListServices.getData_DropDown_BoloType,
        {
            refetchOnWindowFocus: false,
            enabled: !!openBoloSearchModal && !!loginAgencyID,
        }
    );

    useEffect(() => {
        if (localStoreData) {
            setLoginAgencyID(localStoreData?.AgencyID);
            GetDataTimeZone(localStoreData?.AgencyID);
            dispatch(getData_DropDown_Operator(localStoreData?.AgencyID))
            if (PriorityDrpData?.length === 0 && localStoreData?.AgencyID) dispatch(getData_DropDown_Priority(localStoreData?.AgencyID))
            if (ZoneDrpData?.length === 0 && localStoreData?.AgencyID) dispatch(getData_DropDown_Zone(localStoreData?.AgencyID))
        }
    }, [localStoreData]);

    useEffect(() => {
        setZoneDropDown(dropDownDataModel(ZoneDrpData, "ZoneID", "ZoneDescription"));
    }, [ZoneDrpData]);

    useEffect(() => {
        if (getBoloTypeData && isFetchBoloType) {
            const data = JSON.parse(getBoloTypeData?.data?.data);
            setTypeOFBOLO(data?.Table)
        } else {
            setTypeOFBOLO([])
        }
    }, [getBoloTypeData, isFetchBoloType])

    useEffect(() => {
        if (getBoloDispositionData && isFetchBoloDisposition) {
            const data = JSON.parse(getBoloDispositionData?.data?.data);
            setBoloDisposition(data?.Table)
        } else {
            setBoloDisposition([])
        }
    }, [getBoloDispositionData, isFetchBoloDisposition])

    const handleActionClick = (boloID) => {
        const baseUrl = window.location.href.split('?')[0];
        const params = new URLSearchParams({
            boloID: boloID,
        }).toString();
        const newUrl = `${baseUrl}?${params}`;
        window.history.pushState(null, '', newUrl);
        setOpenBoloSearchModal(false);
        clearBoloSearchState();
        setBoloSearchList([]);
    };

    const columns = [
        {
            name: "View",
            cell: (row) => (
                <i
                    className="fa fa-eye"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleActionClick(row.BoloID)}
                />
            ),
            sortable: true,
            width: '100px',
        },
        {
            name: "Date/Time",
            selector: (row) => (row.CreatedDtTm ? getShowingDateText(row.CreatedDtTm) : ""),
            sortable: true,
            sortFunction: (rowA, rowB) => compareStrings(rowA.CreatedDtTm, rowB.CreatedDtTm),
            width: "160px",
        },
        {
            name: "Created By",
            selector: (row) => (row.FullName ? row.FullName : ""),
            sortable: true,
            sortFunction: (rowA, rowB) => compareStrings(rowA.FullName, rowB.FullName),
            width: "160px",
        },
        {
            name: "Type",
            selector: (row) => (row.Description ? row.Description : ""),
            sortable: true,
            sortFunction: (rowA, rowB) => compareStrings(rowA.Description, rowB.Description),
            width: "100px",
        },
        {
            name: "Disposition",
            selector: (row) => (row.DispositionCode ? row.DispositionCode : ""),
            sortable: true,
            sortFunction: (rowA, rowB) => compareStrings(rowA.DispositionCode, rowB.DispositionCode),
            width: "140px",
        },
        {
            name: "Priority",
            selector: (row) => (row.Priority ? row.Priority : ""),
            sortable: true,
            sortFunction: (rowA, rowB) => compareStrings(rowA.Priority, rowB.Priority),
            width: "120px",
        },
        {
            name: "CAD Event#",
            selector: (row) => (row.IncidentNumber ? row.IncidentNumber : ""),
            sortable: true,
            sortFunction: (rowA, rowB) => compareStrings(rowA.IncidentNumber, rowB.IncidentNumber),
            width: "120px",
        },
        {
            name: "Message",
            selector: (row) => (row.Message ? row.Message : ""),
            sortable: true,
            sortFunction: (rowA, rowB) => compareStrings(rowA.Message, rowB.Message),
            cell: (row) => (
                <Tooltip text={row?.Message || ''} maxLength={30} />
            ),
            width: "300px",
        },

    ];

    async function handleSearch() {
        try {
            const data = {
                BoloTypeId: boloSearchState?.TypeOfBolo,
                BoloDispositionId: boloSearchState?.BOLODisposition,
                ZoneId: boloSearchState?.Zone,
                PriorityId: boloSearchState?.Priority,
                StartDate: boloSearchState?.startDate ? getShowingWithOutTime(boloSearchState?.startDate) : null,
                EndDate: boloSearchState?.endDate ? getShowingWithOutTime(boloSearchState?.endDate) : null,
                DispatcherId: boloSearchState?.dispatcher,
                Message: boloSearchState?.Message,
                IsArchived: boloSearchState?.isClosed ? 1 : 0,
                AgencyID: loginAgencyID
            };

            const response = await BoloServices.searchBolo(data);

            if (response?.status === 200) {
                const data = JSON.parse(response?.data?.data);
                setBoloSearchList(data?.Table);
            } else {
                toastifyError(`${response?.status}`);
            }
        } catch (error) {
            if (error.response?.status === 400) {
                toastifyError("No data found");
                setBoloSearchList([]);
            }
        }
    }

    const isBoloSearchStateEmpty = (state) => {
        return Object.values(state).every(
            (value) => value === "" || value === null || value === undefined || value === false
        );
    };

    useEffect(() => {
        if (loginAgencyID) {
            getAgencyImg(loginAgencyID);
        }
    }, [loginAgencyID]);

    const getAgencyImg = (loginAgencyID) => {
        const val = { 'AgencyID': loginAgencyID }
        fetchPostData('Agency/GetData_AgencyWithPhoto', val).then((res) => {
            if (res) {
                setSearchData(res[0]);
            }
            else {
                setSearchData([]);
            }
        })
    }

    const componentRef = useRef();

    const printForm = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: 'Data',
        // onAfterPrint: () => { '' },
        onAfterPrint: () => setSelectedStatus(false),
    })

    useEffect(() => {
        if (selectedStatus) {
            printForm();
            getAgencyImg(loginAgencyID);
        }
    }, [selectedStatus]);

    const escFunction = useCallback((event) => {
        if (event.key === "Escape") {
            setOpenBoloSearchModal(false); clearBoloSearchState(); setBoloSearchList([]);
        }
    }, []);

    useEffect(() => {
        document.addEventListener("keydown", escFunction, false);
        return () => {
            document.removeEventListener("keydown", escFunction, false);
        };
    }, [escFunction]);

    return (
        <>
            <>
                {openBoloSearchModal ? (
                    <dialog
                        className="modal fade modal-cad"
                        style={{ background: "rgba(0,0,0, 0.5)", zIndex: "200" }}
                        id="BoloSearchModal"
                        tabIndex="-1"
                        aria-hidden="true"
                        data-backdrop="false"
                    >
                        <div className="modal-dialog modal-dialog-centered modal-xl">
                            <div className="modal-content modal-content-cad">
                                <div className="modal-body">
                                    {/* Modal Header */}
                                    <div className="row pb-2">
                                        <div className="col-12 ">
                                            <div className="py-0 px-2 d-flex justify-content-between align-items-center">
                                                <p
                                                    className="p-0 m-0 font-weight-medium"
                                                    style={{
                                                        fontSize: 18,
                                                        fontWeight: 500,
                                                        letterSpacing: 0.5,
                                                    }}
                                                >
                                                    Search
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Form Area */}
                                    <div className="m-1">
                                        <fieldset style={{ border: "1px solid gray" }}>
                                            <div className="tab-form-container">
                                                <div className="tab-form-row">
                                                    <div className="col-1 d-flex justify-content-end">
                                                        <label htmlFor="TypeOfBolo" className="tab-form-label d-flex justify-content-end mr-1 text-nowrap">Type of BOLO</label>
                                                    </div>
                                                    <div className="col-4">
                                                        <Select
                                                            styles={colorLessStyle_Select}
                                                            placeholder="Select"
                                                            isSearchable
                                                            options={typeOFBOLO}
                                                            isClearable
                                                            value={boloSearchState?.TypeOfBolo ? typeOFBOLO?.find((i) => i?.BoloTypeID == boloSearchState?.TypeOfBolo) : ""}
                                                            getOptionLabel={(v) => v?.Description}
                                                            getOptionValue={(v) => v?.BoloTypeID}
                                                            onChange={(e) => handleBoloSearchState("TypeOfBolo", e?.BoloTypeID)}
                                                        />
                                                    </div>
                                                    <div className="col-1 d-flex justify-content-end">
                                                        <label htmlFor="BOLODisposition" className="tab-form-label d-flex justify-content-end mr-1 text-nowrap">Bolo Disposition</label>
                                                    </div>
                                                    <div className="col-4">
                                                        <Select
                                                            styles={colorLessStyle_Select}
                                                            placeholder="Select"
                                                            isSearchable
                                                            getOptionLabel={(v) => `${v?.DispositionCode} | ${v?.Description}`}
                                                            getOptionValue={(v) => v?.DispositionCode}
                                                            formatOptionLabel={(option, { context }) => {
                                                                return context === 'menu'
                                                                    ? `${option?.DispositionCode} | ${option?.Description}`
                                                                    : option?.DispositionCode;
                                                            }}
                                                            isClearable
                                                            maxMenuHeight={180}
                                                            onInputChange={(inputValue, actionMeta) => {
                                                                if (inputValue.length > 12) {
                                                                    return inputValue.slice(0, 12);
                                                                }
                                                                return inputValue;
                                                            }}
                                                            value={boloSearchState?.BOLODisposition ? boloDisposition?.find((i) => i?.BoloDispositionID === boloSearchState?.BOLODisposition) : ""}
                                                            onChange={(e) => handleBoloSearchState("BOLODisposition", e?.BoloDispositionID)}
                                                            options={boloDisposition}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="tab-form-row">
                                                    <div className="col-1 d-flex justify-content-end">
                                                        <label htmlFor="Zone" className="tab-form-label d-flex justify-content-end mr-1 text-nowrap">Zone</label>
                                                    </div>
                                                    <div className="col-4">
                                                        <Select
                                                            styles={colorLessStyle_Select}
                                                            placeholder="Select"
                                                            isSearchable
                                                            options={zoneDropDown}
                                                            isClearable
                                                            value={zoneDropDown?.find((i) => i?.value === boloSearchState?.Zone)}
                                                            onChange={(e) => handleBoloSearchState("Zone", e?.value)}
                                                        />
                                                    </div>
                                                    <div className="col-1 d-flex justify-content-end">
                                                        <label htmlFor="Priority" className="tab-form-label d-flex justify-content-end mr-1 text-nowrap">Priority</label>
                                                    </div>
                                                    <div className="col-4">
                                                        <Select
                                                            styles={colorLessStyle_Select}
                                                            placeholder="Select"
                                                            isSearchable
                                                            isClearable
                                                            options={PriorityDrpData}
                                                            getOptionLabel={(v) => `${v?.PriorityCode} | ${v?.Description}`}
                                                            getOptionValue={(v) => v?.PriorityCode}
                                                            formatOptionLabel={(option, { context }) => {
                                                                return context === 'menu'
                                                                    ? `${option?.PriorityCode} | ${option?.Description}`
                                                                    : option?.PriorityCode;
                                                            }}
                                                            className="w-100"
                                                            name="Priority"
                                                            value={boloSearchState.Priority ? PriorityDrpData?.find((i) => i?.PriorityID === boloSearchState.Priority) : ""}
                                                            onChange={(e) => {
                                                                handleBoloSearchState("Priority", e?.PriorityID)
                                                            }}
                                                            onInputChange={(inputValue, actionMeta) => {
                                                                if (inputValue.length > 12) {
                                                                    return inputValue.slice(0, 12);
                                                                }
                                                                return inputValue;
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="tab-form-row">
                                                    <div className="col-1 d-flex justify-content-end">
                                                        <label htmlFor="startDate" className="tab-form-label d-flex justify-content-end mr-1 text-nowrap">Start Date/Time</label>
                                                    </div>
                                                    <div className="col-4 w-100 cad-DatePicker">
                                                        <DatePicker
                                                            name='startDate'
                                                            id='startDate'
                                                            onChange={(v) => handleBoloSearchState("startDate", v)}
                                                            selected={boloSearchState?.startDate || ""}
                                                            dateFormat="MM/dd/yyyy"
                                                            isClearable={!!boloSearchState?.startDate}
                                                            showMonthDropdown
                                                            showYearDropdown
                                                            dropdownMode="select"
                                                            autoComplete="off"
                                                            placeholderText="Select Start Date..."
                                                            maxDate={new Date(datezone)}
                                                        />
                                                    </div>
                                                    <div className="col-1 d-flex justify-content-end">
                                                        <label htmlFor="endDate" className="tab-form-label d-flex justify-content-end mr-1 text-nowrap">End Date/Time</label>
                                                    </div>
                                                    <div className="col-4 w-100 cad-DatePicker">
                                                        <DatePicker
                                                            name='endDate'
                                                            id='endDate'
                                                            onChange={(v) => handleBoloSearchState("endDate", v)}
                                                            selected={boloSearchState?.endDate || ""}
                                                            dateFormat="MM/dd/yyyy"
                                                            isClearable={!!boloSearchState?.endDate}
                                                            showMonthDropdown
                                                            showYearDropdown
                                                            dropdownMode="select"
                                                            autoComplete="off"
                                                            placeholderText="Select End Date..."
                                                            minDate={boloSearchState?.startDate || null}
                                                            maxDate={new Date(datezone)}
                                                        />
                                                    </div>
                                                </div>


                                                <div className="tab-form-row">
                                                    <div className="col-1 d-flex justify-content-end">
                                                        <label htmlFor="dispatcher" className="tab-form-label d-flex justify-content-end mr-1 mt-2 text-nowrap">Dispatcher</label>
                                                    </div>
                                                    <div className="col-4">
                                                        <Select
                                                            styles={colorLessStyle_Select}
                                                            placeholder="Select"
                                                            isSearchable
                                                            options={OperatorDrpData}
                                                            getOptionLabel={(v) => v?.displayName}
                                                            getOptionValue={(v) => v?.PINID}
                                                            value={boloSearchState?.dispatcher ? OperatorDrpData?.find((i) => i?.PINID === boloSearchState?.dispatcher) : ""}
                                                            isClearable
                                                            onChange={(e) => { handleBoloSearchState("dispatcher", e?.PINID) }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="tab-form-row">
                                                    <div className="col-1 d-flex justify-content-end">
                                                        <label htmlFor="Message" className="tab-form-label d-flex justify-content-end mr-1 text-nowrap">Message</label>
                                                    </div>
                                                    <div className="col-11">
                                                        <textarea
                                                            name="comments"
                                                            placeholder="Enter Message"
                                                            rows='4'
                                                            value={boloSearchState?.Message}
                                                            onChange={(e) => {
                                                                handleBoloSearchState("Message", e?.target.value);
                                                                e.target.style.height = "auto";
                                                                const maxHeight = 3 * parseFloat(getComputedStyle(e.target).lineHeight);
                                                                e.target.style.height = `${Math.min(e.target.scrollHeight, maxHeight)}px`;
                                                            }}
                                                            className="form-control py-1 new-input"
                                                            style={{ height: '60px' }}
                                                        />
                                                    </div>
                                                </div>
                                                {/* Additional Form Fields */}
                                                <div className="tab-form-row">
                                                    <div className="col-3 d-flex justify-content-start offset-1">
                                                        <input type="checkbox" name="question" value="14" className="clickable mr-2" id="2" checked={boloSearchState?.isClosed} onChange={(e) => { handleBoloSearchState("isClosed", e?.target.checked) }} />
                                                        <label htmlFor="isClosed" className="mt-2">Closed</label>
                                                    </div>

                                                </div>

                                                {/* Action Buttons */}
                                                <div className="row">
                                                    <div className="col-12 p-0">
                                                        <div className="py-0 px-2 d-flex justify-content-end align-items-center">
                                                            <div className="d-flex justify-content-end tab-form-row-gap mt-1">
                                                                <button type="button" className="save-button ml-2" onClick={() => handleSearch()} disabled={isBoloSearchStateEmpty(boloSearchState)}>Search</button>
                                                                <button type="button" data-dismiss="modal" className="cancel-button" onClick={() => { setOpenBoloSearchModal(false); clearBoloSearchState(); setBoloSearchList([]); }}>Close</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </fieldset>
                                    </div>
                                    <div className="row">
                                        <div className="col-12 p-0">
                                            <div className="py-0 px-2 d-flex justify-content-end align-items-center">
                                                <div className="d-flex justify-content-end tab-form-row-gap my-1">
                                                    <button
                                                        type="button"
                                                        className="save-button ml-2"
                                                        onClick={() => setSelectedStatus(true)}
                                                        disabled={boloSearchList?.length <= 0}
                                                    >
                                                        <i className="fa fa-print" /> Print Preview
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Data Table */}
                                    <div className="table-responsive CAD-table" style={{ position: "sticky" }}>
                                        <DataTable
                                            dense
                                            columns={columns}
                                            data={boloSearchList}
                                            customStyles={tableCustomStyles}
                                            pagination
                                            responsive
                                            striped
                                            highlightOnHover
                                            noDataComponent={boloSearchList?.length === 0 ? "There are no data to display" : 'There are no data to display'}
                                            fixedHeader
                                            selectableRowsHighlight
                                            fixedHeaderScrollHeight="190px"
                                            persistTableHead={true}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </dialog>
                ) : null}
            </>
            <ViewImageModal imageModalStatus={imageModalStatus} setImageModalStatus={setImageModalStatus} />
            {selectedStatus && (
                <div style={{ position: 'absolute', top: '-100000px', left: '-100000px' }}>
                    <BoloSearchPrintReport  {...{ componentRef, selectedStatus, setSelectedStatus, boloSearchList, searchData }} />
                </div>
            )}
        </>
    );
};

export default memo(BoloSearchModal);

// PropTypes definition
BoloSearchModal.propTypes = {
  openBoloSearchModal: PropTypes.bool.isRequired,
  setOpenBoloSearchModal: PropTypes.func.isRequired
};

// Default props
BoloSearchModal.defaultProps = {
  openBoloSearchModal: false,
  setOpenBoloSearchModal: () => {}
};

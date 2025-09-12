import { memo, useEffect, useState, useContext, } from "react";
import { useQuery } from "react-query";
import Select from "react-select";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import { getShowingWithOutTime } from "../../Components/Common/Utility";
import { colorLessStyle_Select } from "../Utility/CustomStylesForReact";
import useObjState from "../../CADHook/useObjState";
import WhiteboardServices from "../../CADServices/APIs/whiteboard";
import DatePicker from "react-datepicker";
import { toastifyError } from "../../Components/Common/AlertMsg";
import { AgencyContext } from "../../Context/Agency/Index";
import { getData_DropDown_Priority } from "../../CADRedux/actions/DropDownsData";


const WhiteboardSearchModal = (props) => {
    const { whiteboardSearchModal, setOpenWhiteboardSearchModal, setWhiteboardSearchData, setIsSearch } = props;
    const dispatch = useDispatch();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const { GetDataTimeZone, datezone } =
        useContext(AgencyContext);
    const [loginAgencyID, setLoginAgencyID] = useState('');
    const [dropDownTitleMessage, setDropDownTitleMessage] = useState([]);
    const PriorityDrpData = useSelector((state) => state.CADDropDown.PriorityDrpData);
    const [
        whiteboardSearchState,
        ,
        handleWhiteboardSearchState,
        clearWhiteboardSearchState,
    ] = useObjState({
        priority: "",
        category: "",
        dateFrom: "",
        dateTo: "",
        title: "",
        message: "",
        isExpired: false,
    });

    const categoryData = [
        {
            "value": 1,
            "label": "Alert"
        },
        {
            "value": 2,
            "label": "Update"
        },
        {
            "value": 3,
            "label": "Reminder"
        },
        {
            "value": 4,
            "label": "General Info"
        },
    ]

    useEffect(() => {
        if (localStoreData) {
            setLoginAgencyID(localStoreData?.AgencyID);
            GetDataTimeZone(localStoreData?.AgencyID);
            if (PriorityDrpData?.length === 0 && localStoreData?.AgencyID) dispatch(getData_DropDown_Priority(localStoreData?.AgencyID))
        }
    }, [localStoreData]);

    const getDropDownTitleMessageKey = `/CAD/Whiteboard/GetDropDownTitleMessage/${loginAgencyID}`;
    const { data: dropDownTitleMessageData, isSuccess: isFetchDropDownTitleMessage } = useQuery(
        [getDropDownTitleMessageKey, {
            "AgencyID": loginAgencyID,
        },],
        WhiteboardServices.getDropDownTitleMessage,
        {
            refetchOnWindowFocus: false,
            enabled: whiteboardSearchModal && !!loginAgencyID,
        }
    )

    useEffect(() => {
        if (dropDownTitleMessageData && isFetchDropDownTitleMessage) {
            const data = JSON.parse(dropDownTitleMessageData?.data?.data);
            setDropDownTitleMessage(data?.Table)
        } else {
            setDropDownTitleMessage([])
        }
    }, [dropDownTitleMessageData, isFetchDropDownTitleMessage])

    async function handleSearch() {
        try {
            const data = {
                AgencyID: loginAgencyID,
                PriorityID: whiteboardSearchState?.priority,
                categoryID: whiteboardSearchState?.category,
                message: whiteboardSearchState?.message?.message,
                title: whiteboardSearchState?.title?.title,
                WhitebordFrom: whiteboardSearchState?.dateFrom ? getShowingWithOutTime(whiteboardSearchState?.dateFrom) : null,
                WhitebordFromTo: whiteboardSearchState?.dateTo ? getShowingWithOutTime(whiteboardSearchState?.dateTo) : null,
                isExpired: whiteboardSearchState?.isExpired ? 1 : 0,
            };

            const response = await WhiteboardServices.searchWhiteboard(data);

            if (response?.status === 200) {
                const data = JSON.parse(response?.data?.data);
                setWhiteboardSearchData(data?.Table);
                setIsSearch(true)
            } else {
                toastifyError(`${response?.status}`);
            }
        } catch (error) {
            if (error.response?.status === 400) {
                toastifyError("No data found");
                setWhiteboardSearchData([]);
            }
        }
        setOpenWhiteboardSearchModal(false)
    }

    const isSearchStateEmpty = (state) => {
        return Object.values(state).every(
            (value) => value === "" || value === null || value === undefined || value === false
        );
    };

    return (
        <>
            <>
                {whiteboardSearchModal ? (
                    <dialog
                        className="modal fade modal-cad"
                        style={{ background: "rgba(0,0,0, 0.5)", zIndex: "200" }}
                        id="WhiteboardSearchModal"
                        tabIndex="-1"
                        aria-hidden="true"
                        data-backdrop="false"
                    >
                        <div className="modal-dialog modal-dialog-centered modal-xl1">
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
                                                    <div className="col-2 d-flex justify-content-end">
                                                        <label className="tab-form-label d-flex justify-content-end mr-1 text-nowrap">Priority</label>
                                                    </div>
                                                    <div className="col-4">
                                                        <Select
                                                            styles={colorLessStyle_Select}
                                                            placeholder="Select..."
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
                                                            name="priority"
                                                            value={whiteboardSearchState.priority ? PriorityDrpData?.find((i) => i?.PriorityID === whiteboardSearchState.priority) : ""}
                                                            onChange={(e) => {
                                                                handleWhiteboardSearchState("priority", e?.PriorityID)
                                                            }}
                                                            onInputChange={(inputValue, actionMeta) => {
                                                                if (inputValue.length > 12) {
                                                                    return inputValue.slice(0, 12);
                                                                }
                                                                return inputValue;
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="col-2 d-flex justify-content-end">
                                                        <label className="tab-form-label d-flex justify-content-end mr-1 text-nowrap">Category</label>
                                                    </div>
                                                    <div className="col-4">
                                                        <Select
                                                            name="category"
                                                            styles={colorLessStyle_Select}
                                                            isClearable
                                                            options={categoryData}
                                                            value={whiteboardSearchState?.category ? categoryData?.find((i) => i?.value === whiteboardSearchState?.category) : ""}
                                                            getOptionLabel={(v) => v?.label}
                                                            getOptionValue={(v) => v?.value}
                                                            onChange={(e) => handleWhiteboardSearchState("category", e?.value)}
                                                            placeholder="Select..."
                                                            className="w-100"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="tab-form-row">
                                                    <div className="col-2 d-flex justify-content-end">
                                                        <label className="tab-form-label d-flex justify-content-end mr-1 text-nowrap">Date From</label>
                                                    </div>
                                                    <div className="col-4 w-100 cad-DatePicker">
                                                        <DatePicker
                                                            name='dateFrom'
                                                            id='dateFrom'
                                                            onChange={(v) => handleWhiteboardSearchState("dateFrom", v)}
                                                            selected={whiteboardSearchState?.dateFrom || ""}
                                                            dateFormat="MM/dd/yyyy"
                                                            isClearable={!!whiteboardSearchState?.dateFrom}
                                                            showMonthDropdown
                                                            showYearDropdown
                                                            dropdownMode="select"
                                                            autoComplete="off"
                                                            placeholderText="Select Date From..."
                                                            maxDate={new Date(datezone)}
                                                        />

                                                    </div>
                                                    <div className="col-2 d-flex justify-content-end">
                                                        <label className="tab-form-label d-flex justify-content-end mr-1 text-nowrap">Date To</label>
                                                    </div>
                                                    <div className="col-4 w-100 cad-DatePicker">
                                                        <DatePicker
                                                            name='dateTo'
                                                            id='dateTo'
                                                            onChange={(v) => handleWhiteboardSearchState("dateTo", v)}
                                                            selected={whiteboardSearchState?.dateTo || ""}
                                                            dateFormat="MM/dd/yyyy"
                                                            isClearable={!!whiteboardSearchState?.dateTo}
                                                            showMonthDropdown
                                                            showYearDropdown
                                                            dropdownMode="select"
                                                            autoComplete="off"
                                                            placeholderText="Select Date To..."
                                                            minDate={whiteboardSearchState?.dateFrom || null}
                                                            maxDate={new Date(datezone)}
                                                        />

                                                    </div>
                                                </div>

                                                <div className="tab-form-row">
                                                    <div className="col-2 d-flex justify-content-end">
                                                        <label className="tab-form-label d-flex justify-content-end mr-1 text-nowrap">Title</label>
                                                    </div>
                                                    <div className="col-10">
                                                        {/* <input
                                                            type="text"
                                                            className="form-control requiredColor py-1 new-input"
                                                            name="title"
                                                            placeholder="Title"
                                                            value={whiteboardSearchState.title}
                                                            onChange={(e) => {
                                                                handleWhiteboardSearchState("title", e.target.value)
                                                            }}
                                                        /> */}
                                                        <Select
                                                            name="title"
                                                            styles={colorLessStyle_Select}
                                                            isClearable
                                                            options={dropDownTitleMessage}
                                                            value={whiteboardSearchState?.title || ""}
                                                            getOptionLabel={(v) => v?.title}
                                                            getOptionValue={(v) => v?.title}
                                                            onChange={(e) => handleWhiteboardSearchState("title", e)}
                                                            placeholder="Select..."
                                                            className="w-100"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="tab-form-row">
                                                    <div className="col-2 d-flex justify-content-end">
                                                        <label className="tab-form-label d-flex justify-content-end mr-1 text-nowrap">Message</label>
                                                    </div>
                                                    <div className="col-10">
                                                        {/* <textarea
                                                            name="comments"
                                                            placeholder="Enter Message"
                                                            rows='4'
                                                            value={whiteboardSearchState?.Message}
                                                            onChange={(e) => {
                                                                handleWhiteboardSearchState("Message", e?.target.value);
                                                                e.target.style.height = "auto";
                                                                const maxHeight = 3 * parseFloat(getComputedStyle(e.target).lineHeight);
                                                                e.target.style.height = `${Math.min(e.target.scrollHeight, maxHeight)}px`;
                                                            }}
                                                            className="form-control py-1 new-input"
                                                            style={{ height: '60px' }}
                                                        /> */}
                                                        <Select
                                                            name="message"
                                                            styles={colorLessStyle_Select}
                                                            isClearable
                                                            options={dropDownTitleMessage}
                                                            value={whiteboardSearchState?.message || ""}
                                                            getOptionLabel={(v) => v?.message}
                                                            getOptionValue={(v) => v?.message}
                                                            onChange={(e) => handleWhiteboardSearchState("message", e)}
                                                            placeholder="Select..."
                                                            className="w-100"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="tab-form-row">
                                                    <div className="col-5 d-flex justify-content-start offset-2">
                                                        <input
                                                            type="checkbox"
                                                            name="question"
                                                            value="14"
                                                            className="clickable mr-2" id="2"
                                                            checked={whiteboardSearchState?.isExpired}
                                                            onChange={(e) => { handleWhiteboardSearchState("isExpired", e?.target.checked) }}
                                                        />
                                                        <label for="2" className="mt-2">Is Expired</label>
                                                    </div>

                                                </div>

                                                {/* Action Buttons */}
                                                <div className="row">
                                                    <div className="col-12 p-0">
                                                        <div className="py-0 px-2 d-flex justify-content-end align-items-center">
                                                            <div className="d-flex justify-content-end tab-form-row-gap mt-1">
                                                                <button type="button" className="save-button ml-2" onClick={() => handleSearch()} disabled={isSearchStateEmpty(whiteboardSearchState)}>Search</button>
                                                                <button type="button" data-dismiss="modal" className="cancel-button" onClick={() => { setOpenWhiteboardSearchModal(false); clearWhiteboardSearchState(); }}>Close</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </fieldset>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </dialog>
                ) : null}
            </>
        </>
    );
};

export default memo(WhiteboardSearchModal);

// PropTypes definition
WhiteboardSearchModal.propTypes = {
  whiteboardSearchModal: PropTypes.bool.isRequired,
  setOpenWhiteboardSearchModal: PropTypes.func.isRequired,
  setWhiteboardSearchData: PropTypes.func,
  setIsSearch: PropTypes.func
};

// Default props
WhiteboardSearchModal.defaultProps = {
  setWhiteboardSearchData: () => {},
  setIsSearch: () => {}
};

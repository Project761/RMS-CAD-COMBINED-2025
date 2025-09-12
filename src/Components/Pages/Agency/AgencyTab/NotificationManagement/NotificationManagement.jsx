import { useState, useEffect, useContext, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { fetchPostData, AddDeleteUpadate } from '../../../../hooks/Api'
import { base64ToString, Decrypt_Id_Name, tableCustomStyles } from '../../../../Common/Utility'
import { AgencyContext } from '../../../../../Context/Agency/Index'
import { toastifyError, toastifySuccess } from '../../../../Common/AlertMsg'
import Select from "react-select";
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { get_LocalStoreData } from '../../../../../redux/actions/Agency';
import { get_ScreenPermissions_Data } from '../../../../../redux/actions/IncidentAction';
import { get_AgencyOfficer_Data } from '../../../../../redux/actions/DropDownsData';
import useObjState from '../../../../../CADHook/useObjState';
import DataTable from 'react-data-table-component';
import ReactQuill from 'react-quill';
import { colorLessStyle_Select } from '../../../../../CADComponents/Utility/CustomStylesForReact'
import { isEmpty } from '../../../../../CADUtils/functions/common'

const NotificationManagement = ({ aId }) => {
    const { GetDataTimeZone } = useContext(AgencyContext);
    const dispatch = useDispatch();
    const quillRef = useRef(null);
    const quillRef1 = useRef(null);
    const quillRef2 = useRef(null);
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const [pinID, setPinID] = useState('');
    const [notificationID, setNotificationID] = useState();

    const [loginAgencyID, setLoginAgencyID] = useState("");
    const [notificationData, setNotificationData] = useState([])
    const [singleNotificationData, setSingleNotificationData] = useState([])
    const [groupList, setGroupList] = useState([]);

    const [tags, setTags] = useState([{ value: "OfficerName", label: "Officer Name" },
    { value: "CreatedByOfficerName", label: "Created By Officer Name" },
    { value: "BOLODescription", label: "BOLO Description" },
    { value: "Date&Time", label: "Date & Time" },
    { value: "AgencyName", label: "Agency Name" },
    { value: "AgencyContactInformation", label: "Agency Contact Information" }]);

    const [isChange, setIsChange] = useState(false);

    const Category = [
        {
            "value": 1,
            "label": "BOLO"
        },
        {
            "value": 2,
            "label": "Personnel"
        },
        {
            "value": 3,
            "label": "Agency"
        }
    ]
    const NotificationType = [
        {
            "value": 1,
            "label": "High Priority BOLO Notification",
            "key": 1
        },
        {
            "value": 2,
            "label": "Temporary Account Removal Reminder",
            "key": 2
        },
        {
            "value": 3,
            "label": "Password Expiry Reminder",
            "key": 2
        },
        {
            "value": 4,
            "label": "CJIS Training Reminder",
            "key": 3
        }
    ]

    const PriorityDropdownData = [
        {
            "value": 1,
            "label": "High",
        },
        {
            "value": 2,
            "label": "Medium",
        },
        {
            "value": 3,
            "label": "Low   ",
        },
    ]

    const [
        notificationState,
        setNotificationState,
        handleNotificationState,
        clearNotificationState,
    ] = useObjState({
        notificationID: "",
        category: "",
        notificationType: "",
        notificationGroup: "",
        IsSendToSpecificOfficer: false,
        isEnabledNotification: false,
        isToastNotification: false,
        notificationHeader: "",
        priority: "",
        notifyBeforeTaskDue: "",
        notificationContentTemplate: "",
        isEnabledEmail: false,
        // bcc: "",
        subject: "",
        body: ""
    });

    const [
        errorNotificationState,
        _setErrorNotificationState,
        handleErrorNotificationState,
        clearErrorNotificationState,
    ] = useObjState({
        category: false,
        notificationType: false,
        notificationGroup: false,
    });


    const useQueryLocation = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };

    const query = useQueryLocation();
    var aId = query?.get("Aid");

    if (!aId) aId = 0;
    else aId = parseInt(base64ToString(aId));

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        if (aId) {
            GetAllNotifications(aId);
            get_Group_List(aId);
        }
    }, [aId])

    const GetAllNotifications = (aId) => {
        const value = { AgencyId: aId }
        fetchPostData('CAD/Notification/GetAllNotifications', value).then(res => {
            if (res) {
                setNotificationData(res)
            } else {
                setNotificationData([])
            }
        })
    }

    const get_Group_List = (aId) => {
        const value = { AgencyId: aId }
        fetchPostData("Group/GetData_Group", value).then((res) => {
            if (res) {
                setGroupList(res)
            } else setGroupList()
        })
    }

    useEffect(() => {
        if (singleNotificationData?.NotificationID) {

            setNotificationState({
                notificationID: singleNotificationData?.NotificationID,
                category: singleNotificationData?.ModuleCategoryID,
                notificationType: singleNotificationData?.NotificationTypeID,
                notificationGroup: singleNotificationData?.GroupIDs
                    ? singleNotificationData?.GroupIDs.split(',').map((groupId) =>
                        groupList?.find((i) => i?.GroupID === parseInt(groupId.trim())) // Find matching groups for each GroupID
                    )
                    : [],  // Return an empty array if no GroupIDs
                IsSendToSpecificOfficer: singleNotificationData?.IsSendToSpecificOfficer,
                isEnabledNotification: singleNotificationData?.EnableInAppNotification,
                isToastNotification: singleNotificationData?.EnableToastNotification,
                notificationHeader: singleNotificationData?.NotificationHeader,
                priority: singleNotificationData?.PriorityID,
                notifyBeforeTaskDue: singleNotificationData?.NotifyBeforeTaskDue,
                notificationContentTemplate: singleNotificationData?.NotificationContentTemplate,
                isEnabledEmail: singleNotificationData?.EnableEmailNotification,
                // bcc: singleNotificationData?.BCCEmail,
                subject: singleNotificationData?.Subject,
                body: singleNotificationData?.Body,
            });
        }
    }, [singleNotificationData])

    useEffect(() => {
        if (localStoreData) {
            setPinID(localStoreData?.PINID);
            dispatch(get_ScreenPermissions_Data("A005", localStoreData?.AgencyID, localStoreData?.PINID));
            dispatch(get_AgencyOfficer_Data(localStoreData?.AgencyID, 0))
            setLoginAgencyID(localStoreData?.AgencyID);
            GetDataTimeZone(localStoreData?.AgencyID);
        }
    }, [localStoreData]);

    const validateCFSCodeForm = () => {
        let isError = false;
        const keys = Object.keys(errorNotificationState);
        keys.map((field) => {
            if (field === "category" && isEmpty(notificationState[field])) {
                handleErrorNotificationState(field, true);
                isError = true;
            } else if (field === "notificationType" && isEmpty(notificationState[field])) {
                handleErrorNotificationState(field, true);
                isError = true;
            } else if (field === "notificationGroup" && notificationState[field]?.length === 0) {
                handleErrorNotificationState(field, true);
                isError = true;
            } else {
                handleErrorNotificationState(field, false);
            }
        });
        return !isError;
    };

    const onSave = async () => {
        if (!validateCFSCodeForm()) return;

        // Check for duplicate Notification Type
        const isDuplicate = notificationData.some(notification =>
            notification.NotificationTypeID === notificationState?.notificationType &&
            notification.NotificationID !== notificationID // Exclude current record if editing
        );

        if (isDuplicate) {
            const selectedNotificationType = NotificationType.find(type => type.value === notificationState?.notificationType);
            toastifyError(`Notification Type "${selectedNotificationType?.label}" already exists`);
            return;
        }

        const isUpdate = !!notificationID;
        const endpoint = isUpdate
            ? 'CAD/Notification/UpdateNotification'
            : 'CAD/Notification/InsertNotification';

        const payload = {
            ...(isUpdate && { NotificationID: notificationID }),
            ModuleCategoryID: notificationState?.category,
            NotificationTypeID: notificationState?.notificationType,
            GroupIDs: notificationState?.notificationGroup?.length > 0
                ? notificationState.notificationGroup.map(o => o.GroupID).join(",")
                : "",
            EnableInAppNotification: notificationState?.isEnabledNotification,
            IsSendToSpecificOfficer: notificationState?.IsSendToSpecificOfficer,
            EnableEmailNotification: notificationState?.isEnabledEmail,
            EnableToastNotification: notificationState?.isToastNotification,
            PriorityID: notificationState?.priority,
            NotifyBeforeTaskDue: notificationState?.notifyBeforeTaskDue,
            NotificationHeader: notificationState?.notificationHeader,
            NotificationContentTemplate: notificationState?.notificationContentTemplate,
            // BCCEmail: notificationState?.bcc,
            Subject: notificationState?.subject,
            Body: notificationState?.body,
            AgencyID: aId,
            IsActive: true,
            ...(isUpdate ? { ModifiedByUserFK: pinID } : { CreatedByUserFK: pinID }),
        };

        AddDeleteUpadate(endpoint, payload)
            .then(res => {
                if (res.success) {
                    toastifySuccess(isUpdate ? "Data Updated Successfully" : "Data Saved Successfully");
                    GetAllNotifications(aId);

                    handelCancel();
                } else {
                    toastifyError(res.data.Message);
                }
            })
            .catch(error => {
                console.error('There was an error!', error);
            });
    };


    function handelCancel() {
        clearErrorNotificationState()
        clearNotificationState();
        setIsChange(false);
        setNotificationID()
    }

    const set_Edit_Value = (row) => {
        setSingleNotificationData({});
        clearNotificationState();
        setNotificationID(row.NotificationID);
        setSingleNotificationData(row);
    }

    const columns = [
        {
            name: 'Notification Type',
            selector: (row) => row.NotificationTypeID ? NotificationType?.find((i) => i?.value === row.NotificationTypeID)?.label : "",
            sortable: true
        },
        {
            name: 'Priority',
            selector: (row) => row.PriorityID ? PriorityDropdownData?.find((i) => i?.value === row.PriorityID)?.label : "",
            sortable: true
        },
        {
            name: 'Notification Header',
            selector: (row) => row.NotificationHeader,
            sortable: true
        },
        {
            name:
                <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                    {'In App'}
                </div>,
            cell: (row, index) =>
                <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                    <span
                        className="btn btn-sm text-white px-1 py-0 mr-1"
                        style={{ background: "#ddd" }}
                    >
                        {row?.EnableInAppNotification ? (
                            <i className="fa fa-toggle-on" style={{ color: "green" }} aria-hidden="true" ></i>
                        ) : (
                            <i className="fa fa-toggle-off" style={{ color: "red" }} aria-hidden="true"></i>
                        )}
                    </span>
                </div>,
            width: "100px",
            style: {
                position: "static",
            },
        },
        {
            name:
                <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                    {'In Email'}
                </div>,
            cell: (row, index) =>
                <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
                    <span
                        className="btn btn-sm text-white px-1 py-0 mr-1"
                        style={{ background: "#ddd" }}
                    >
                        {row?.EnableEmailNotification ? (
                            <i className="fa fa-toggle-on" style={{ color: "green" }} aria-hidden="true" ></i>
                        ) : (
                            <i className="fa fa-toggle-off" style={{ color: "red" }} aria-hidden="true"></i>
                        )}
                    </span>
                </div>,
            width: "100px",
            style: {
                position: "static",
            },
        },
    ]
    const conditionalRowStyles = [
        {
            when: row => row?.NotificationID === notificationID,
            style: {
                backgroundColor: '#001f3fbd',
                color: 'white',
                cursor: 'pointer',
            },
        }
    ];

    const colourStyles = {
        control: (styles) => ({
            ...styles, backgroundColor: "#fce9bf",
            height: 20,
            minHeight: 35,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),
    };

    const insertTagBody = (tag) => {
        if (quillRef.current) {
            // Ensure quillRef is not null
            const editor = quillRef.current.getEditor(); // Get the Quill editor instance
            const cursorPosition = editor.getSelection()?.index; // Get current cursor position
            if (cursorPosition !== null && cursorPosition !== undefined) {
                const textToInsert = ` {{${tag}}}`;
                editor.insertText(cursorPosition, textToInsert); // Insert the tag at the cursor position
            }
        }
    };

    const handleKeyDownBody = (e) => {
        if (e.key === 'Backspace' && quillRef.current) {
            const editor = quillRef.current.getEditor();
            const cursorPosition = editor.getSelection()?.index; // Get current cursor position
            if (cursorPosition !== null && cursorPosition !== undefined) {
                const textBeforeCursor = editor.getText(0, cursorPosition); // Get text before the cursor
                const lastWord = textBeforeCursor.split(' ').pop(); // Get the last word before the cursor
                console.log(lastWord);
                if (lastWord.startsWith('{{') && lastWord.endsWith('}}')) {
                    // If the last word is a tag in the format {{tag}}, remove it
                    const newText = textBeforeCursor.slice(
                        0,
                        textBeforeCursor.lastIndexOf(lastWord)
                    );
                    editor.setText(newText + editor.getText(cursorPosition));

                    // Keep the cursor at the same position
                    editor.setSelection(cursorPosition - lastWord.length - 1, 0); // Move cursor to correct position

                    e.preventDefault(); // Prevent default backspace behavior
                }
            }
        }
    };

    const insertTagSubject = (tag) => {
        if (quillRef1.current) {
            // Ensure quillRef1 is not null
            const editor = quillRef1.current.getEditor(); // Get the Quill editor instance
            const cursorPosition = editor.getSelection()?.index; // Get current cursor position
            if (cursorPosition !== null && cursorPosition !== undefined) {
                const textToInsert = ` {{${tag}}}`;
                editor.insertText(cursorPosition, textToInsert); // Insert the tag at the cursor position
            }
        }
    };

    const handleKeyDownSubject = (e) => {
        if (e.key === 'Backspace' && quillRef1.current) {
            const editor = quillRef1.current.getEditor();
            const cursorPosition = editor.getSelection()?.index; // Get current cursor position
            if (cursorPosition !== null && cursorPosition !== undefined) {
                const textBeforeCursor = editor.getText(0, cursorPosition); // Get text before the cursor
                const lastWord = textBeforeCursor.split(' ').pop(); // Get the last word before the cursor
                console.log(lastWord);
                if (lastWord.startsWith('{{') && lastWord.endsWith('}}')) {
                    // If the last word is a tag in the format {{tag}}, remove it
                    const newText = textBeforeCursor.slice(
                        0,
                        textBeforeCursor.lastIndexOf(lastWord)
                    );
                    editor.setText(newText + editor.getText(cursorPosition));

                    // Keep the cursor at the same position
                    editor.setSelection(cursorPosition - lastWord.length - 1, 0); // Move cursor to correct position

                    e.preventDefault(); // Prevent default backspace behavior
                }
            }
        }
    };

    const insertTagTemplate = (tag) => {
        if (quillRef2.current) {
            // Ensure quillRef2 is not null
            const editor = quillRef2.current.getEditor(); // Get the Quill editor instance
            const cursorPosition = editor.getSelection()?.index; // Get current cursor position
            if (cursorPosition !== null && cursorPosition !== undefined) {
                const textToInsert = ` {{${tag}}}`;
                editor.insertText(cursorPosition, textToInsert); // Insert the tag at the cursor position
            }
        }
    };

    const handleKeyDownTemplate = (e) => {
        if (e.key === 'Backspace' && quillRef2.current) {
            const editor = quillRef2.current.getEditor();
            const cursorPosition = editor.getSelection()?.index; // Get current cursor position
            if (cursorPosition !== null && cursorPosition !== undefined) {
                const textBeforeCursor = editor.getText(0, cursorPosition); // Get text before the cursor
                const lastWord = textBeforeCursor.split(' ').pop(); // Get the last word before the cursor
                console.log(lastWord);
                if (lastWord.startsWith('{{') && lastWord.endsWith('}}')) {
                    // If the last word is a tag in the format {{tag}}, remove it
                    const newText = textBeforeCursor.slice(
                        0,
                        textBeforeCursor.lastIndexOf(lastWord)
                    );
                    editor.setText(newText + editor.getText(cursorPosition));

                    // Keep the cursor at the same position
                    editor.setSelection(cursorPosition - lastWord.length - 1, 0); // Move cursor to correct position

                    e.preventDefault(); // Prevent default backspace behavior
                }
            }
        }
    };

    const formats = [
        "header",
        "bold",
        "italic",
        "underline",
        "size",
        "background",
        "strike",
        "blockquote",
        "list",
        "bullet",
        // "link",
        "indent",
        // "image",
        "code-block",
        "color",
    ];

    const modules = {
        toolbar: [
            [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
            [{ 'size': ['small', 'medium', 'large', 'huge'] }],  // Font size options
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'align': [] }],
            ['bold', 'italic', 'underline'],
            ['link', 'image'],
            [{ 'color': [] }, { 'background': [] }],  // Text color and background color
            ['blockquote'],
        ],
    };
    const matchedNotificationTypeData = NotificationType.filter(i => i.key === notificationState.category);

    return (
        <div>
            {/* Notification Module Category */}
            <fieldset className="mt-2">
                <legend>Notification Module Category</legend>
                <div className="col-12">
                    <div className="row">
                        <div className="col-3 col-md-2 col-lg-1 mt-1 pt-1 offset-1">
                            <label htmlFor="" className='new-label'>Select Category{errorNotificationState.category && isEmpty(notificationState?.category) && (
                                <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{"Select Category"}</p>
                            )}</label>
                        </div>
                        <div className="col-4 col-md-4 col-lg-3 mt-1 text-field">
                            <Select
                                styles={colourStyles}
                                placeholder="Select"
                                isClearable
                                options={Category}
                                value={notificationState?.category ? Category?.find((i) => i?.value === notificationState?.category) : ""}
                                onChange={(e) => {
                                    handleNotificationState("category", e?.value);
                                    handleNotificationState("notificationType", "");
                                    setIsChange(true);
                                }}
                            />
                        </div>
                        <div className="col-3 col-md-2 col-lg-1 mt-1 pt-1">
                            <label htmlFor="" className='new-label'>
                                Notification Type{errorNotificationState.notificationType && isEmpty(notificationState?.notificationType) && (
                                    <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{"Select Notification Type"}</p>
                                )}
                            </label>
                        </div>
                        <div className="col-4 col-md-4 col-lg-3 mt-1 text-field">
                            <Select
                                styles={colourStyles}
                                placeholder="Select"
                                isClearable
                                options={matchedNotificationTypeData || []}
                                value={notificationState?.notificationType ? NotificationType?.find((i) => i?.value === notificationState?.notificationType) : ""}
                                onChange={(e) => {
                                    handleNotificationState("notificationType", e?.value);
                                    setIsChange(true);
                                }}
                            />
                        </div>

                    </div>

                </div>
            </fieldset>

            {/* Select Group(s) to send notification */}
            <fieldset className="">
                <legend>Select Group(s) to Send Notification</legend>
                <div className="col-12">
                    <div className="row">
                        <div className="col-3 col-md-2 col-lg-1 mt-1 pt-1 offset-1">
                            <label htmlFor="" className='new-label'>Select Group{errorNotificationState.notificationGroup && (!notificationState?.notificationGroup || notificationState?.notificationGroup?.length === 0) && (
                                <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{"Select Group"}</p>
                            )}</label>
                        </div>
                        <div className="col-3 mt-1 text-field">
                            <Select
                                styles={colourStyles}
                                placeholder="Select"
                                options={groupList}
                                getOptionLabel={(v) => v?.GroupName}
                                getOptionValue={(v) => v?.GroupID}
                                isClearable
                                onInputChange={(inputValue, actionMeta) => {
                                    if (inputValue.length > 12) {
                                        return inputValue.slice(0, 12);
                                    }
                                    return inputValue;
                                }}
                                isMulti
                                value={notificationState?.notificationGroup}
                                onChange={(e) => { handleNotificationState("notificationGroup", e); setIsChange(true); }}
                            />
                        </div>
                        <div className="col-3 mt-2 gap-2 ml-3">
                            <div className="agency-checkbox-item align-items-center" style={{ display: 'flex', alignItems: 'center' }}>
                                <input
                                    type="checkbox"
                                    name="IsSendToSpecificOfficer"
                                    checked={notificationState.IsSendToSpecificOfficer}
                                    onChange={(e) => { handleNotificationState("IsSendToSpecificOfficer", e.target.checked); setIsChange(true); }}
                                />
                                <span style={{ marginLeft: '8px' }}>
                                    Send notification to a specific officer
                                </span>
                            </div>
                        </div>

                    </div>
                </div>
            </fieldset>

            {/* Notification Management */}
            <fieldset className="pb-0">
                <legend>Notification Management</legend>

                {/* In App */}
                <fieldset className="mt-1">
                    <legend>In App</legend>
                    <div className="col-12">
                        <div className="d-flex align-content-center">
                            <div className="col-2 offset-1 d-flex align-items-center w-100">
                                <label htmlFor="" className="new-label mr-3">
                                    Enable/Disable Notification
                                </label>
                                <span
                                    className="btn btn-md text-white px-1 py-0"
                                    style={{
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        padding: "10px", // Increase padding for a larger clickable area
                                    }}
                                >
                                    {notificationState?.isEnabledNotification ? (
                                        <i
                                            className="fa fa-toggle-on"
                                            style={{
                                                color: "green",
                                                fontSize: "30px", // Increase the size of the icon
                                            }}
                                            aria-hidden="true"
                                            onClick={(e) => {
                                                handleNotificationState("isEnabledNotification", false);
                                                setIsChange(true);
                                            }}
                                        ></i>
                                    ) : (
                                        <i
                                            className="fa fa-toggle-off"
                                            style={{
                                                color: "red",
                                                fontSize: "30px", // Increase the size of the icon
                                            }}
                                            aria-hidden="true"
                                            onClick={(e) => {
                                                handleNotificationState("isEnabledNotification", true);
                                                setIsChange(true);
                                            }}
                                        ></i>
                                    )}
                                </span>
                            </div>
                            <div className="col-2 pt-1 d-flex align-items-center w-100">
                                <label htmlFor="" className="new-label mr-3">
                                    Toast Notification
                                </label>
                                <span
                                    className="btn btn-md text-white px-1 py-0"
                                    style={{
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        padding: "10px", // Increase padding for a larger clickable area
                                    }}
                                >
                                    {notificationState?.isToastNotification ? (
                                        <i
                                            className="fa fa-toggle-on"
                                            style={{
                                                color: "green",
                                                fontSize: "30px", // Increase the size of the icon
                                            }}
                                            aria-hidden="true"
                                            onClick={(e) => {
                                                handleNotificationState("isToastNotification", false);
                                                setIsChange(true);
                                            }}
                                        ></i>
                                    ) : (
                                        <i
                                            className="fa fa-toggle-off"
                                            style={{
                                                color: "red",
                                                fontSize: "30px", // Increase the size of the icon
                                            }}
                                            aria-hidden="true"
                                            onClick={(e) => {
                                                handleNotificationState("isToastNotification", true);
                                                setIsChange(true);
                                            }}
                                        ></i>
                                    )}
                                </span>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-2 col-md-2 col-lg-1 mt-0 pt-1 offset-1">
                                <label htmlFor="" className='new-label'>Notification Header</label>
                            </div>
                            <div className="col-4 col-md-4 col-lg-3 mt-0 text-field">
                                <input
                                    name="notificationHeader"
                                    type="text"
                                    className="form-control py-1 new-input"
                                    placeholder='Notification Header'
                                    // onKeyDown={handleSpecialKeyDown}
                                    value={notificationState?.notificationHeader}
                                    onChange={(e) => { handleNotificationState("notificationHeader", e.target.value); setIsChange(true); }}
                                />

                            </div>
                            {/* Priority & Training Course */}
                            <div className="col-2 mt-0 d-flex align-items-center w-full">
                                <label htmlFor="" className='new-label mr-3'>
                                    Priority
                                </label>
                                <Select
                                    styles={{ ...colorLessStyle_Select, container: (provided) => ({ ...provided, flexGrow: 1 }) }}
                                    placeholder="Select"
                                    isClearable
                                    options={PriorityDropdownData}
                                    value={notificationState?.priority ? PriorityDropdownData?.find((i) => i?.value === notificationState?.priority) : ""}
                                    onChange={(e) => {
                                        handleNotificationState("priority", e?.value);
                                        setIsChange(true);
                                    }}
                                />
                            </div>

                            {/* Notify Before Task Due */}
                            <div className="col-4 mt-0 d-flex align-items-center">
                                <label htmlFor="" className="new-label mb-0 mr-2 text-nowrap">
                                    Notify before Task Due
                                </label>
                                <input
                                    name="notifyBeforeTaskDue"
                                    type="number"
                                    className="form-control new-input"
                                    placeholder="Notify Before Task Due"
                                    value={notificationState?.notifyBeforeTaskDue}
                                    maxLength={4}
                                    onChange={(e) => {
                                        const value = e.target.value;

                                        // Only allow numbers between 1 and 3 if notificationType is 2
                                        if (value === "" || (notificationState?.notificationType !== 2 || (value >= 1 && value <= 3))) {
                                            handleNotificationState("notifyBeforeTaskDue", value);
                                        }

                                        setIsChange(true);
                                    }}
                                />
                                <div className="ml-2">Days</div>
                            </div>

                        </div>
                    </div>
                    <div className="row">
                        <div className="col-2 pt-1">
                            <label htmlFor="" className='new-label'>Notification Content Template</label>
                        </div>
                        {/* <div className="col-7  mt-2 text-field">
                                <input
                                    name="notificationContentTemplate"
                                    type="text"
                                    className="form-control py-1 new-input"
                                    placeholder='Notification Content Template'
                                    // onKeyDown={handleSpecialKeyDown}
                                    value={notificationState?.notificationContentTemplate}
                                    onChange={(e) => { handleNotificationState("notificationContentTemplate", e.target.value); setIsChange(true); }}
                                />
                            </div> */}
                        <div className="col-7  mt-2 react-quill-container">
                            <div>
                                {tags?.map((tag) => (
                                    <button
                                        key={tag}
                                        type="button" class="btn btn-primary"
                                        onClick={() => insertTagTemplate(tag.value)}
                                        style={{ margin: '3px', padding: "4px 8px" }}
                                    >
                                        {tag.label}
                                    </button>
                                ))}
                            </div>
                            <ReactQuill
                                ref={quillRef2}
                                value={notificationState?.notificationContentTemplate || ''}
                                onChange={(e) => {
                                    handleNotificationState("notificationContentTemplate", e);
                                    setIsChange(true);
                                }}
                                theme="snow"
                                modules={{ toolbar: false }}
                                // formats={formats}
                                editorProps={{ spellCheck: true }}
                                placeholder="Notification Content Template"
                                style={{ height: '60px', marginTop: "5px" }}
                                onKeyDown={handleKeyDownTemplate}
                            />
                        </div>
                    </div>
                </fieldset>

                {/* Email */}
                <fieldset className="" >
                    <legend>Email</legend>
                    <div className="col-12">
                        <div className="row">
                            <div className="col-2 offset-1 d-flex align-items-center w-100">
                                <label htmlFor="" className="new-label mr-3">
                                    Enable/Disable Email
                                </label>
                                <span
                                    className="btn btn-md text-white px-1 py-0"
                                    style={{
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        padding: "10px", // Increase padding for a larger clickable area
                                    }}
                                >
                                    {notificationState?.isEnabledEmail ? (
                                        <i
                                            className="fa fa-toggle-on"
                                            style={{
                                                color: "green",
                                                fontSize: "30px", // Increase the size of the icon
                                            }}
                                            aria-hidden="true"
                                            onClick={(e) => {
                                                handleNotificationState("isEnabledEmail", false);
                                                setIsChange(true);
                                            }}
                                        ></i>
                                    ) : (
                                        <i
                                            className="fa fa-toggle-off"
                                            style={{
                                                color: "red",
                                                fontSize: "30px", // Increase the size of the icon
                                            }}
                                            aria-hidden="true"
                                            onClick={(e) => {
                                                handleNotificationState("isEnabledEmail", true);
                                                setIsChange(true);
                                            }}
                                        ></i>
                                    )}
                                </span>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-2 col-md-2 col-lg-1 mt-5 offset-1">
                                <label htmlFor="" className='new-label'>Subject</label>
                            </div>
                            <div className="col-7 react-quill-container">
                                <div>
                                    {tags?.map((tag) => (
                                        <button
                                            key={tag}
                                            type="button" class="btn btn-primary"
                                            onClick={() => insertTagSubject(tag.value)}
                                            style={{ margin: '3px', padding: "4px 8px" }}
                                        >
                                            {tag.label}
                                        </button>
                                    ))}
                                </div>
                                <ReactQuill
                                    ref={quillRef1}
                                    value={notificationState?.subject || ''}
                                    onChange={(e) => {
                                        handleNotificationState("subject", e);
                                        setIsChange(true);
                                    }}
                                    theme="snow"
                                    modules={{ toolbar: false }}
                                    // formats={formats}
                                    editorProps={{ spellCheck: true }}
                                    placeholder="Subject"
                                    style={{ height: '60px', marginTop: "5px" }}
                                    onKeyDown={handleKeyDownSubject}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-2 col-md-2 col-lg-1 mt-5 pt-2 offset-1">
                                <label htmlFor="" className='new-label'>Body</label>
                            </div>
                            <div className="col-7 mt-2 react-quill-container">
                                <div>
                                    {tags?.map((tag) => (
                                        <button
                                            key={tag}
                                            type="button" class="btn btn-primary"
                                            onClick={() => insertTagBody(tag.value)}
                                            style={{ margin: '3px', padding: "4px 8px" }}
                                        >
                                            {tag.label}
                                        </button>
                                    ))}
                                </div>
                                <ReactQuill
                                    ref={quillRef}
                                    value={notificationState?.body || ''}
                                    onChange={(e) => {
                                        handleNotificationState("body", e);
                                        setIsChange(true);
                                    }}
                                    theme="snow"
                                    modules={modules}
                                    formats={formats}
                                    editorProps={{ spellCheck: true }}
                                    placeholder="Body"
                                    style={{ height: '100px', marginTop: "5px" }}
                                    onKeyDown={handleKeyDownBody}
                                />
                            </div>
                        </div>

                    </div>
                </fieldset>
                <div className="col-12">
                    <div className="btn-box text-right mt-1 mr-1">
                        <button
                            type="button"
                            className="btn btn-sm btn-success mr-1"
                            data-dismiss="modal"
                            onClick={() => handelCancel()}
                        >
                            New
                        </button>
                        <button
                            type="button" className="btn btn-sm btn-success mr-1"
                            disabled={!isChange}
                            onClick={() => {
                                onSave()
                            }}
                        >
                            {!!notificationState?.notificationID ? "Update" : "Save"}
                        </button>
                    </div>
                </div>
                <div className="col-12 mt-1">
                    <DataTable
                        columns={columns}
                        data={notificationData}
                        dense
                        paginationRowsPerPageOptions={[10, 15]}
                        highlightOnHover
                        noContextMenu
                        pagination
                        responsive
                        showHeader={true}
                        persistTableHead={true}
                        conditionalRowStyles={conditionalRowStyles}
                        customStyles={tableCustomStyles}
                        onRowClicked={(row) => {
                            set_Edit_Value(row);
                        }}
                        fixedHeader
                        subHeaderAlign="right"
                        subHeaderWrap
                    />
                </div>
            </fieldset>

        </div>
    )
}

export default NotificationManagement

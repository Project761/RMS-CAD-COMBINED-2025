import { memo, useCallback, useEffect, useState } from "react";
import Select from "react-select";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faPlus } from "@fortawesome/free-solid-svg-icons";
import { phoneTypes } from "../../CADUtils/constant";
import ClassNames from "classnames";
import ModalConfirm from "../Common/ModalConfirm";
import GEOContactTable from "../GEOContactTable/Index";
import { customStylesWithOutColorDrop } from "../Utility/CustomStylesForReact";

const ContactInfoModal = (props) => {
    const { openContactInfoModal, setOpenContactInfoModal, setSelectedButton, contactList, setContactList, isGoogleLocation } = props;
    const [isEditMode, setIsEditMode] = useState(false);
    const [isChangeFields, setIsChangeFields] = useState(false);
    const [editItemId, setEditItemId] = useState(null);
    const initialValueContact = {
        LastName: "",
        MiddleName: "",
        FirstName: "",
        PhoneType: {},
        PhoneNo: "",
    };
    const [contactInformation, setContactInformation] =
        useState(initialValueContact);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const onCloseLocation = () => {
        setOpenContactInfoModal(false);
        setSelectedButton(prevSelected =>
            prevSelected.includes(5)
                ? prevSelected.filter(item => item !== 5)
                : [...prevSelected, 5]
        );
        setContactInformation(initialValueContact);
        setIsChangeFields(false)
    };

    const handleContactInputChange = (e) => {
        const { name, value } = e.target;
        setContactInformation((prevState) => ({
            ...prevState,
            [name]: value,
        }));
        setIsChangeFields(true)
    };

    const handleChangePhoneNumber = (e) => {
        const { name } = e.target;
        let ele = e.target.value.replace(/\D/g, '');
        if (ele.length === 10) {
            const cleaned = ('' + ele).replace(/\D/g, '');
            const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
            if (match) {
                setContactInformation((prevState) => ({
                    ...prevState,
                    [name]: match[1] + '-' + match[2] + '-' + match[3]
                }));
            }
        } else {
            ele = e.target.value.split('-').join('').replace(/\D/g, '');
            setContactInformation((prevState) => ({
                ...prevState,
                [name]: ele,
            }));
        }
        setIsChangeFields(true);
    };


    const handleSelectPhoneType = (selectedOption, { name }) => {
        setContactInformation((prevState) => ({
            ...prevState,
            [name]: selectedOption,
        }));
        setIsChangeFields(true)
    };

    async function handleSave() {
        onCloseLocation();
    }

    const handleAddContactInformation = async () => {
        const { PhoneNo, FirstName, MiddleName, LastName, PhoneType } = contactInformation;
        if ((FirstName || MiddleName || LastName) || (PhoneNo && PhoneType?.label)) {
            const payload = {
                PhoneNo,
                FirstName,
                MiddleName,
                LastName,
                PhoneType: PhoneType?.label,
                ID: editItemId || Date.now(),
            };

            setContactList((prevContactList) => {
                if (isEditMode) {
                    return prevContactList.map((contact) =>
                        contact.ID === editItemId ? payload : contact
                    );
                }
                return [...(Array.isArray(prevContactList) ? prevContactList : []), payload];
            });

            setContactInformation({
                LastName: "",
                MiddleName: "",
                FirstName: "",
                PhoneType: {},
                PhoneNo: "",
            });
            setIsEditMode(false);
            setEditItemId(null);
        };
    }

    const handleKeyDown = (e) => {
        const charCode = e.keyCode || e.which;
        const charStr = String.fromCharCode(charCode);
        const controlKeys = [8, 9, 13, 27, 37, 38, 39, 40, 46];
        const numpadKeys = [96, 97, 98, 99, 100, 101, 102, 103, 104, 105];
        const numpadSpecialKeys = [106, 107, 109, 110, 111];
        if (!charStr.match(/^[a-zA-Z]+$/) && !controlKeys.includes(charCode)) {
            e.preventDefault();
        }
        if (
            (charCode >= 48 && charCode <= 57) ||
            numpadKeys.includes(charCode) ||
            numpadSpecialKeys.includes(charCode)
        ) {
            e.preventDefault();
        }
    };

    function handleCloseConfirm() {
        setShowConfirmModal(false);
        onCloseLocation();
    }

    const escFunction = useCallback((event) => {
        if (event.key === "Escape") {
            onCloseLocation();
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
            {openContactInfoModal ? (
                <>
                    <dialog
                        className="modal fade modal-in-Call-taker"
                        style={{ background: "rgba(0,0,0, 0.5)", zIndex: "200", overflowY: "hidden" }}
                        id="ContactInfoModal"
                        tabIndex="-1"
                        aria-hidden="true"
                        data-backdrop="false"
                    >
                        <div className="modal-dialog modal-dialog-centered CAD-sub-modal-width">
                            <div className="modal-content modal-content-cad">
                                <div className="modal-body">
                                    <div className="row">
                                        <div className="col-12 p-0 pb-2">
                                            <div className="py-0 px-2 d-flex justify-content-between align-items-center">
                                                <p
                                                    className="p-0 m-0 font-weight-medium"
                                                    style={{
                                                        fontSize: 18,
                                                        fontWeight: 500,
                                                        letterSpacing: 0.5,
                                                    }}
                                                >
                                                    Contact Info
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="m-1">
                                        <fieldset style={{ border: "1px solid gray" }}>
                                            <div className="tab-form-row pb-2">
                                                <div className="col-12 tab-form-row-gap">
                                                    <div className="d-flex align-items-center justify-content-end">
                                                        <label className="tab-form-label text-nowrap" style={{ marginLeft: "40px" }}>
                                                            Last Name
                                                        </label>
                                                    </div>
                                                    <input
                                                        type="text"
                                                        className={ClassNames(
                                                            "form-control py-1 new-input"
                                                        )}
                                                        name="LastName"
                                                        required
                                                        value={contactInformation.LastName}
                                                        onKeyDown={handleKeyDown}
                                                        onChange={handleContactInputChange}
                                                    />
                                                    <div className="d-flex align-self-center justify-content-end">
                                                        <label className="tab-form-label text-nowrap">
                                                            Middle Name
                                                        </label>
                                                    </div>
                                                    <input
                                                        type="text"
                                                        className="form-control py-1 new-input"
                                                        onKeyDown={handleKeyDown}
                                                        name="MiddleName"
                                                        value={contactInformation.MiddleName}
                                                        onChange={handleContactInputChange}
                                                    />
                                                    <div className="d-flex align-self-center justify-content-end">
                                                        <label className="tab-form-label text-nowrap">
                                                            First Name
                                                        </label>
                                                    </div>
                                                    <input
                                                        type="text"
                                                        className="form-control py-1 new-input"
                                                        name="FirstName"
                                                        value={contactInformation.FirstName}
                                                        onKeyDown={handleKeyDown}
                                                        onChange={handleContactInputChange}
                                                    />
                                                </div>
                                            </div>

                                            <div className="tab-form-row pb-2">
                                                <div className="d-flex align-items-center justify-content-end">
                                                    <label className="tab-form-label text-nowrap" style={{ marginLeft: "40px" }}>
                                                        Phone Type
                                                    </label>
                                                </div>
                                                <div className="col-2 tab-form-row-gap d-flex w-100">
                                                    <Select
                                                        name="PhoneType"
                                                        styles={customStylesWithOutColorDrop}
                                                        options={phoneTypes}
                                                        placeholder="Select..."
                                                        className="w-100"
                                                        value={contactInformation.PhoneType}
                                                        onChange={handleSelectPhoneType}
                                                        onKeyDown={handleKeyDown}
                                                        maxMenuHeight={100}
                                                        onInputChange={(inputValue, actionMeta) => {
                                                            if (inputValue.length > 12) {
                                                                return inputValue.slice(0, 12);
                                                            }
                                                            return inputValue;
                                                        }}
                                                    />
                                                </div>
                                                <div className="col-4 d-flex align-self-center" style={{ marginLeft: "40px" }}>
                                                    <label className="col-5 tab-form-label col-4 d-flex align-self-center justify-content-end">
                                                        Phone Number
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control py-1 new-input"
                                                        name="PhoneNo"
                                                        maxLength={10}
                                                        required
                                                        value={contactInformation.PhoneNo}
                                                        disabled={
                                                            (!contactInformation.PhoneType ||
                                                                Object.keys(contactInformation.PhoneType)
                                                                    .length === 0)
                                                        }
                                                        onChange={handleChangePhoneNumber}
                                                    />
                                                </div>
                                                <div className="d-flex justify-content-end align-items-center w-100">
                                                    <button
                                                        type="button"
                                                        className="save-button d-flex align-items-center"
                                                        style={{ marginRight: "5px" }}
                                                        // disabled={!isGoogleLocation}
                                                        onClick={handleAddContactInformation}
                                                    >
                                                        <FontAwesomeIcon
                                                            icon={isEditMode ? faEdit : faPlus}
                                                            style={{
                                                                cursor: "pointer",
                                                                fontSize: "12px",
                                                                marginRight: "5px",
                                                            }}
                                                        />
                                                        {isEditMode
                                                            ? "Update Contact Information"
                                                            : "Add Contact Information"}
                                                    </button>
                                                </div>
                                            </div>

                                            <GEOContactTable
                                                contactList={contactList}
                                                setContactInformation={setContactInformation}
                                                setEditItemId={setEditItemId}
                                                setContactList={setContactList}
                                                setIsEditMode={setIsEditMode}
                                                isGoogleLocation={isGoogleLocation}
                                                setIsChangeFields={setIsChangeFields}
                                            />
                                        </fieldset>
                                    </div>
                                    <div className="row">
                                        <div className="col-12 p-0">
                                            <div className="py-0 px-2 d-flex justify-content-end align-items-center">
                                                <div className="d-flex justify-content-end tab-form-row-gap mt-1">
                                                    <button
                                                        type="button"
                                                        className="save-button ml-2"
                                                        // disabled={!isGoogleLocation}
                                                        onClick={() => handleSave()}
                                                    >
                                                        {"Save"}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="cancel-button"
                                                        onClick={() => {
                                                            if (isChangeFields) {
                                                                setShowConfirmModal(true);
                                                            } else {
                                                                onCloseLocation();
                                                            }
                                                        }}
                                                    >
                                                        Close
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </dialog >
                    <ModalConfirm showModal={showConfirmModal} setShowModal={setShowConfirmModal} confirmAction="close" handleConfirm={handleCloseConfirm} />
                </>
            ) : (
                <> </>
            )
            }
        </>
    );
};

export default memo(ContactInfoModal);

// PropTypes definition
ContactInfoModal.propTypes = {
  openContactInfoModal: PropTypes.bool.isRequired,
  setOpenContactInfoModal: PropTypes.func.isRequired,
  setSelectedButton: PropTypes.func,
  contactList: PropTypes.array,
  setContactList: PropTypes.func,
  isGoogleLocation: PropTypes.bool
};

// Default props
ContactInfoModal.defaultProps = {
  setSelectedButton: () => {},
  contactList: [],
  setContactList: () => {},
  isGoogleLocation: false
};

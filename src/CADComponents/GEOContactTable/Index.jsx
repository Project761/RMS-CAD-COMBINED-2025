import { useState } from "react";
import DataTable from "react-data-table-component";
import PropTypes from "prop-types";
import { tableCustomStyles } from "../../Components/Common/Utility";
import { phoneTypes } from "../../CADUtils/constant";
import {
  compareStrings
} from "../../CADUtils/functions/common";
import DeleteConfirmModal from "../Common/DeleteConfirmModal";

function GEOContactTable({ contactList, setContactInformation, setContactList, setEditItemId, setIsEditMode, contactInformation, setIsChangeFields, isGoogleLocation = false, setIsContactChangeFields = () => { } }) {
  const [editValue, setEditValue] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [contactId, setContactId] = useState("");

  const set_Edit_Value = (row) => {
    const PhoneType = phoneTypes.find(phoneType => phoneType.label === row.PhoneType);
    const updatedRow = {
      ...row,
      PhoneType,
    };
    setContactInformation(updatedRow);
    setIsEditMode(true);
    setIsChangeFields(true);
    setEditItemId(row.ID);
  };

  const columns = [
    {
      name: (
        <p className="text-end" style={{ position: "absolute", top: "7px" }}>
          Last Name
        </p>
      ),
      cell: (row) => <div>{row.LastName}</div>,
      selector: (row) => (row.LastName ? row.LastName : ""),
      sortable: true,
      sortFunction: (rowA, rowB) => compareStrings(rowA.LastName, rowB.LastName),
    },
    {
      name: "Middle Name",
      selector: (row) => (row.MiddleName ? row.MiddleName : ""),
      sortable: true,
      sortFunction: (rowA, rowB) => compareStrings(rowA.MiddleName, rowB.MiddleName),
    },
    {
      name: "First Name",
      selector: (row) => (row.FirstName ? row.FirstName : ""),

      sortable: true,
      sortFunction: (rowA, rowB) => compareStrings(rowA.FirstName, rowB.FirstName),
    },
    {
      name: "Phone Type",
      selector: (row) => (row.PhoneType ? row.PhoneType : ""),
      sortable: true,
      sortFunction: (rowA, rowB) => compareStrings(rowA.PhoneType, rowB.PhoneType),
    },
    {
      name: "Phone Number",
      selector: (row) =>
        row.PhoneNo || "",
      sortable: true,
    },
    {
      width: "68px",
      name: (
        <div
          className="d-flex justify-content-end"
        // style={{ position: "absolute", top: "7px", right: 0 }}
        >
          Delete
        </div>
      ),
      cell: (row) => (
        <button className="d-flex justify-content-end btn btn-sm bg-green text-white px-1 py-0 mr-1" onClick={() => { setShowModal(true); setContactId(row.ID) }} >
          <i className="fa fa-trash"></i>
        </button>
      ),
      style: {
        position: "static",
      },
    },
  ];

  const handleDeleteContact = () => {
    setContactList((prevContactList) => prevContactList.filter(contact => contact.ID !== contactId));
    setIsContactChangeFields(true)
    setContactInformation({
      LastName: "",
      MiddleName: "",
      FirstName: "",
      PhoneType: {},
      PhoneNo: "",
    });
    setIsChangeFields(true)
    setShowModal(false)
    setContactId("")
  };


  const conditionalRowStyles = [
    {
      when: row => row === editValue,
      style: {
        backgroundColor: '#001f3fbd',
        color: 'white',
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: '#001f3fbd',
          color: 'white',
        },
      },
    }
  ];
  return (
    <>
      <div className="table-responsive CAD-table" style={{ position: "sticky" }}>
        <DataTable
          dense
          columns={columns}
          data={contactList}
          customStyles={tableCustomStyles}
          conditionalRowStyles={conditionalRowStyles}
          pagination
          responsive
          striped
          highlightOnHover
          noDataComponent={contactList?.length > 0 ? "There are no data to display" : 'There are no data to display'}
          fixedHeader
          selectableRowsHighlight
          fixedHeaderScrollHeight="190px"
          persistTableHead={true}
          onRowClicked={isGoogleLocation ? (row) => {
            set_Edit_Value(row);
            setEditValue(row);
          } : () => { }}
        />
      </div>
      {showModal &&
        <DeleteConfirmModal showModal={showModal} setShowModal={setShowModal} handleConfirm={() => handleDeleteContact()} />}
    </>
  );
}

export default GEOContactTable;

// PropTypes definition
GEOContactTable.propTypes = {
  contactList: PropTypes.array,
  setContactInformation: PropTypes.func,
  setContactList: PropTypes.func,
  setEditItemId: PropTypes.func,
  setIsEditMode: PropTypes.func,
  contactInformation: PropTypes.object,
  setIsChangeFields: PropTypes.func,
  isGoogleLocation: PropTypes.bool,
  setIsContactChangeFields: PropTypes.func
};

// Default props
GEOContactTable.defaultProps = {
  contactList: [],
  setContactInformation: () => {},
  setContactList: () => {},
  setEditItemId: () => {},
  setIsEditMode: () => {},
  contactInformation: {},
  setIsChangeFields: () => {},
  isGoogleLocation: false,
  setIsContactChangeFields: () => {}
};

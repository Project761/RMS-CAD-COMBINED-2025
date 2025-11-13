import React, { useState } from 'react'
import useObjState from '../../../CADHook/useObjState';
import DataTable from 'react-data-table-component';
import { compareStrings } from '../../../CADUtils/functions/common';
import { getShowingWithFixedTime, tableCustomStyles } from '../../../Components/Common/Utility';
import Tooltip from "../../Common/Tooltip";
import NcicServices from "../../../CADServices/APIs/ncic";


function ResponseSection({ ncicResponseData, loginAgencyID, tabState, setResponseSectionData }) {
  const [
    responseSectionState,
    setResponseSectionState,
    handleResponseSectionState,
    clearResponseSectionState,
  ] = useObjState({
    plateNo: "",
    plateState: "",
    VIN: "",
    primaryColor: "",
    plateExpires: "",
    make: "",
    model: "",
    manuYear: "",
    style: "",
    inspection: "",
    insProvider: "",
    name: "",
    dob: "",
    race: "",
    eye: "",
    hair: "",
    height: "",
    weight: "",
    gender: "",
    address: "",
    ssn: "",
    ols: "",
    oly: "",
    status: "",
    height2: "",
    weight2: "",
  });
  const [summaryData, setSummaryData] = useState(null);
  const [viewSummary, setViewSummary] = useState(false);


  const handleSummary = async (row) => {
    const payload = {
      "ResponseType": row?.ResponseType,
      "Hit": row?.hit,
      "RequestDateTime": row?.RequestDateTime,
      "QueryType": row?.QueryType,
      "DisplayString": row?.DisplayString,
      "RequestId": row?.requestid,
      "ResponseId": row?.ResponseId,
      "AgencyId": loginAgencyID,
      "NcicState": "TX"
    }
    const res = await NcicServices.getNCICParsedResponse(payload);
    if (res) {
      setSummaryData(res?.data);
      setResponseSectionData(res?.data);
      setViewSummary(true);
    }
    const payloadSummary = {
      "QueryType": "Summary",
      "RequestId": row?.ResponseId,
      "NcicState": "TX"
    }
    const resSummary = await NcicServices.getNCICParsedResponseSummary(payloadSummary);
    if (resSummary) {
      setResponseSectionState({
        plateNo: resSummary?.data?.VinNumber,
        plateState: resSummary?.data?.LicensePlateState,
        VIN: resSummary?.data?.VinNumber,
        primaryColor: resSummary?.data?.LicensePlateColor,
        plateExpires: resSummary?.data?.LicensePlateExpirationDate,
        make: resSummary?.data?.VehMake,
        model: resSummary?.data?.VehModel,
        manuYear: resSummary?.data?.VehYear,
        style: resSummary?.data?.VehStyle,
        inspection: resSummary?.data?.Inspection,
        insProvider: resSummary?.data?.InsuranceCompany,
        name: resSummary?.data?.Name,
        dob: resSummary?.data?.Dob,
        race: resSummary?.data?.Race,
        eye: resSummary?.data?.EyeColor,
        hair: resSummary?.data?.HairColor,
        height: resSummary?.data?.Height,
        weight: resSummary?.data?.Weight,
        gender: resSummary?.data?.Sex,
        address: resSummary?.data?.Address,
        ssn: resSummary?.data?.Ssn,
        ols: resSummary?.data?.Ols,
        oly: resSummary?.data?.Oly,
        status: resSummary?.data?.AlertNcicPersonText,
        height2: resSummary?.data?.Height,
        weight2: resSummary?.data?.Weight,
      })
    }
  }

  const column = [
    {
      name: "",
      cell: (row) => (
        <button
          type="button"
          data-toggle="modal"
          data-target="#WhiteboardSearchModal"
          className="btn btn-sm bg-green text-white m-1"
          onClick={() => { handleSummary(row); }}
        >
          Summary
        </button>
      ),
      sortable: true,
      width: '120px',
      center: true,
    },
    {
      name: 'Request Criteria',
      selector: row => row?.DisplayString,
      sortable: true,
      style: {
        position: "static",
      },
      cell: (row) => (
        <Tooltip text={row?.DisplayString || ''} isRight maxLength={50} />
      ),
    },
    {
      name: "Query Type",
      selector: (row) => (row.QueryType ? row.QueryType : ""),
      sortable: true,
      sortFunction: (rowA, rowB) => compareStrings(rowA.QueryType, rowB.QueryType),
      width: "120px",
    },
    {
      name: "Hit",
      selector: (row) => row.hit ? "True" : "False",
      sortable: true,
      sortFunction: (rowA, rowB) => compareStrings(rowA.hit, rowB.hit),
      width: "100px",
    },
    {
      name: "Request Date Time",
      selector: (row) => (row.RequestDateTime ? getShowingWithFixedTime(row.RequestDateTime) : ""),
      sortable: true,
      sortFunction: (rowA, rowB) => compareStrings(rowA.RequestDateTime, rowB.RequestDateTime),
      width: "150px",
    },
    {
      name: "Response Type",
      selector: (row) => row.ResponseType ? row.ResponseType : "",
      sortable: true,
      sortFunction: (rowA, rowB) => compareStrings(rowA.ResponseType, rowB.ResponseType),
      width: "130px",
    },
  ];

  const conditionalRowStyles = [
    {
      when: row => row?.hit === true,
      style: {
        color: 'red',
        backgroundColor: 'darkorange',
        cursor: 'pointer',
      },
    }
  ];

  return (
    <fieldset className="ncic-main-container">
      <div className="d-flex">
        <div className="col-7">
          <div className="ncic-form-container">
            {/* New line */}
            {(tabState === "vin-container") &&
              <>
                <div className="tab-form-row">
                  <div className="col-1 d-flex align-self-center justify-content-end">
                    <label className="tab-form-label">
                      Plate No.
                    </label>
                  </div>
                  <div className="col-2 d-flex align-self-center justify-content-end">
                    <input
                      type="text"
                      className="form-control py-1 new-input"
                      name="plateNo"
                      placeholder="Plate No."
                      value={responseSectionState.plateNo}
                      onChange={(v) => {
                        handleResponseSectionState("plateNo", v.target.value);
                      }}
                    />
                  </div>
                  <div className="col-3 d-flex align-self-center justify-content-end">
                    <label className="tab-form-label">
                      Plate State
                    </label>
                  </div>
                  <div className="col-2 d-flex align-self-center justify-content-end">
                    <input
                      type="text"
                      className="form-control py-1 new-input"
                      name="plateState"
                      placeholder="Plate State"
                      value={responseSectionState.plateState}
                      onChange={(v) => {
                        handleResponseSectionState("plateState", v.target.value);
                      }}
                    />
                  </div>
                </div>

                <div className="tab-form-row">
                  <div className="col-1 d-flex align-self-center justify-content-end">
                    <label className="tab-form-label">
                      VIN
                    </label>
                  </div>
                  <div className="col-3 d-flex align-self-center justify-content-end">
                    <input
                      type="text"
                      className="form-control py-1 new-input"
                      name="VIN"
                      placeholder="VIN"
                      value={responseSectionState.VIN}
                      onChange={(v) => {
                        handleResponseSectionState("VIN", v.target.value);
                      }}
                    />
                  </div>
                  <div className="col-2 d-flex align-self-center justify-content-end">
                    <label className="tab-form-label">
                      Primary Color
                    </label>
                  </div>
                  <div className="col-2 d-flex align-self-center justify-content-end">
                    <input
                      type="text"
                      className="form-control py-1 new-input"
                      name="primaryColor"
                      placeholder="Primary Color"
                      value={responseSectionState.primaryColor}
                      onChange={(v) => {
                        handleResponseSectionState("primaryColor", v.target.value);
                      }}
                    />
                  </div>
                  <div className="col-2 d-flex align-self-center justify-content-end">
                    <label className="tab-form-label">
                      Plate Expires
                    </label>
                  </div>
                  <div className="col-2 d-flex align-self-center justify-content-end">
                    <input
                      type="text"
                      className="form-control py-1 new-input"
                      name="plateExpires"
                      placeholder="Plate Expires"
                      value={responseSectionState.plateExpires}
                      onChange={(v) => {
                        handleResponseSectionState("plateExpires", v.target.value);
                      }}
                    />
                  </div>
                </div>

                <div className="tab-form-row">
                  <div className="col-1 d-flex align-self-center justify-content-end">
                    <label className="tab-form-label">
                      Make
                    </label>
                  </div>
                  <div className="col-2 d-flex align-self-center justify-content-end">
                    <input
                      type="text"
                      className="form-control py-1 new-input"
                      name="make"
                      placeholder="Make"
                      value={responseSectionState.make}
                      onChange={(v) => {
                        handleResponseSectionState("make", v.target.value);
                      }}
                    />
                  </div>
                  <div className="col-1 d-flex align-self-center justify-content-end">
                    <label className="tab-form-label">
                      Model
                    </label>
                  </div>
                  <div className="col-2 d-flex align-self-center justify-content-end">
                    <input
                      type="text"
                      className="form-control py-1 new-input"
                      name="model"
                      placeholder="Model"
                      value={responseSectionState.model}
                      onChange={(v) => {
                        handleResponseSectionState("model", v.target.value);
                      }}
                    />
                  </div>
                  <div className="col-1 d-flex align-self-center justify-content-end">
                    <label className="tab-form-label">
                      Manu.Year
                    </label>
                  </div>
                  <div className="col-2 d-flex align-self-center justify-content-end">
                    <input
                      type="text"
                      className="form-control py-1 new-input"
                      name="manuYear"
                      placeholder="Manu.Year"
                      value={responseSectionState.manuYear}
                      onChange={(v) => {
                        handleResponseSectionState("manuYear", v.target.value);
                      }}
                    />
                  </div>
                  <div className="col-1 d-flex align-self-center justify-content-end">
                    <label className="tab-form-label">
                      Style
                    </label>
                  </div>
                  <div className="col-2 d-flex align-self-center justify-content-end">
                    <input
                      type="text"
                      className="form-control py-1 new-input"
                      name="style"
                      placeholder="Style"
                      value={responseSectionState.style}
                      onChange={(v) => {
                        handleResponseSectionState("style", v.target.value);
                      }}
                    />
                  </div>
                </div>

                <div className="tab-form-row">
                  <div className="col-1 d-flex align-self-center justify-content-end">
                    <label className="tab-form-label">
                      Inspection
                    </label>
                  </div>
                  <div className="col-11 d-flex align-self-center justify-content-end">
                    <input
                      type="text"
                      className="form-control py-1 new-input"
                      name="inspection"
                      placeholder="Inspection"
                      value={responseSectionState.inspection}
                      onChange={(v) => {
                        handleResponseSectionState("inspection", v.target.value);
                      }}
                    />
                  </div>
                </div>

                <div className="tab-form-row pb-2 bb">
                  <div className="col-1 d-flex align-self-center justify-content-end">
                    <label className="tab-form-label">
                      Ins.Provider
                    </label>
                  </div>
                  <div className="col-5 d-flex align-self-center justify-content-end">
                    <input
                      type="text"
                      className="form-control py-1 new-input"
                      name="insProvider"
                      placeholder="Ins.Provider"
                      value={responseSectionState.insProvider}
                      onChange={(v) => {
                        handleResponseSectionState("insProvider", v.target.value);
                      }}
                    />
                  </div>

                </div>
              </>
            }

            <div className="tab-form-row">
              <div className="col-1 d-flex align-self-center justify-content-end">
                <label className="tab-form-label">
                  Name
                </label>
              </div>
              <div className="col-8 d-flex align-self-center justify-content-end">
                <input
                  type="text"
                  className="form-control py-1 new-input"
                  name="name"
                  placeholder="Name"
                  value={responseSectionState.name}
                  onChange={(v) => {
                    handleResponseSectionState("name", v.target.value);
                  }}
                />
              </div>
            </div>

            <div className="tab-form-row">
              <div className="col-1 d-flex align-self-center justify-content-end">
                <label className="tab-form-label">
                  DOB
                </label>
              </div>
              <div className="col-8 d-flex align-self-center justify-content-end">
                <input
                  type="text"
                  className="form-control py-1 new-input"
                  name="dob"
                  placeholder="DOB"
                  value={responseSectionState.dob}
                  onChange={(v) => {
                    handleResponseSectionState("dob", v.target.value);
                  }}
                />
              </div>
            </div>

            <div className="tab-form-row">
              <div className="col-1 d-flex align-self-center justify-content-end">
                <label className="tab-form-label">
                  Race
                </label>
              </div>
              <div className="col-2 d-flex align-self-center justify-content-end">
                <input
                  type="text"
                  className="form-control py-1 new-input"
                  name="race"
                  placeholder="Race"
                  value={responseSectionState.race}
                  onChange={(v) => {
                    handleResponseSectionState("race", v.target.value);
                  }}
                />
              </div>
              <div className="col-1 d-flex align-self-center justify-content-end">
                <label className="tab-form-label">
                  Eye
                </label>
              </div>
              <div className="col-2 d-flex align-self-center justify-content-end">
                <input
                  type="text"
                  className="form-control py-1 new-input"
                  name="eye"
                  placeholder="Eye"
                  value={responseSectionState.eye}
                  onChange={(v) => {
                    handleResponseSectionState("eye", v.target.value);
                  }}
                />
              </div>
              <div className="col-1 d-flex align-self-center justify-content-end">
                <label className="tab-form-label">
                  Hair
                </label>
              </div>
              <div className="col-2 d-flex align-self-center justify-content-end">
                <input
                  type="text"
                  className="form-control py-1 new-input"
                  name="hair"
                  placeholder="Hair"
                  value={responseSectionState.hair}
                  onChange={(v) => {
                    handleResponseSectionState("hair", v.target.value);
                  }}
                />
              </div>
            </div>

            <div className="tab-form-row">
              <div className="col-1 d-flex align-self-center justify-content-end">
                <label className="tab-form-label">
                  Height
                </label>
              </div>
              <div className="col-2 d-flex align-self-center justify-content-end">
                <input
                  type="text"
                  className="form-control py-1 new-input"
                  name="height"
                  placeholder="Height"
                  value={responseSectionState.height}
                  onChange={(v) => {
                    handleResponseSectionState("height", v.target.value);
                  }}
                />
                <input
                  type="text"
                  className="form-control py-1 new-input ml-1"
                  name="height2"
                  placeholder="Height"
                  value={responseSectionState.height2}
                  onChange={(v) => {
                    handleResponseSectionState("height2", v.target.value);
                  }}
                />
              </div>
              <div className="col-1 d-flex align-self-center justify-content-end">
                <label className="tab-form-label">
                  Weight
                </label>
              </div>
              <div className="col-2 d-flex align-self-center justify-content-end">
                <input
                  type="text"
                  className="form-control py-1 new-input"
                  name="weight"
                  placeholder="Weight"
                  value={responseSectionState.weight}
                  onChange={(v) => {
                    handleResponseSectionState("weight", v.target.value);
                  }}
                />
                <input
                  type="text"
                  className="form-control py-1 new-input ml-1"
                  name="weight2"
                  placeholder="Weight"
                  value={responseSectionState.weight2}
                  onChange={(v) => {
                    handleResponseSectionState("weight2", v.target.value);
                  }}
                />
              </div>
              <div className="col-1 d-flex align-self-center justify-content-end">
                <label className="tab-form-label">
                  Gender
                </label>
              </div>
              <div className="col-2 d-flex align-self-center justify-content-end">
                <input
                  type="text"
                  className="form-control py-1 new-input"
                  name="gender"
                  placeholder="Gender"
                  value={responseSectionState.gender}
                  onChange={(v) => {
                    handleResponseSectionState("gender", v.target.value);
                  }}
                />
              </div>
            </div>

            <div className="tab-form-row">
              <div className="col-1 d-flex align-self-center justify-content-end">
                <label className="tab-form-label">
                  Address
                </label>
              </div>
              <div className="col-8 d-flex align-self-center justify-content-end">
                <textarea
                  className="form-control py-1 new-input"
                  rows="3"
                  name="address"
                  placeholder="Address"
                  value={responseSectionState.address}
                  onChange={(v) => {
                    handleResponseSectionState("address", v.target.value);
                  }}
                />
              </div>
            </div>

            <div className="tab-form-row">
              <div className="col-1 d-flex align-self-center justify-content-end">
                <label className="tab-form-label">
                  SSN
                </label>
              </div>
              <div className="col-2 d-flex align-self-center justify-content-end">
                <input
                  type="text"
                  className="form-control py-1 new-input"
                  name="ssn"
                  placeholder="SSN"
                  value={responseSectionState.ssn}
                  onChange={(v) => {
                    handleResponseSectionState("ssn", v.target.value);
                  }}
                />
              </div>
              <div className="col-1 d-flex align-self-center justify-content-end">
                <label className="tab-form-label">
                  OLS
                </label>
              </div>
              <div className="col-2 d-flex align-self-center justify-content-end">
                <input
                  type="text"
                  className="form-control py-1 new-input"
                  name="ols"
                  placeholder="OLS"
                  value={responseSectionState.ols}
                  onChange={(v) => {
                    handleResponseSectionState("ols", v.target.value);
                  }}
                />
              </div>
            </div>

            <div className="tab-form-row">
              <div className="col-1 d-flex align-self-center justify-content-end">
                <label className="tab-form-label">
                  OLY
                </label>
              </div>
              <div className="col-2 d-flex align-self-center justify-content-end">
                <input
                  type="text"
                  className="form-control py-1 new-input"
                  name="oly"
                  placeholder="OLY"
                  value={responseSectionState.oly}
                  onChange={(v) => {
                    handleResponseSectionState("oly", v.target.value);
                  }}
                />
              </div>

            </div>

          </div>
        </div>
        <div className="col-5  d-flex flex-column" style={{ height: "calc(100vh - 465px)", maxHeight: "calc(100vh - 300px)", overflowY: "auto", }}>
          {viewSummary && <div className="mb-2" style={{ maxHeight: "60%", minHeight: "200px" }}>
            <fieldset className="ncic-main-container" style={{
              overflowY: "auto",
              overflowX: "hidden",
              height: "100%",
              maxHeight: "100%"
            }}>
              <div style={{ fontSize: "13px" }}>
                {summaryData ? (
                  <div>
                    {/* Display FormattedResponse if available */}
                    {summaryData?.FormattedResponse && (
                      <div dangerouslySetInnerHTML={{ __html: summaryData?.FormattedResponse }} />
                    )}

                    {/* Display VehicleResponse details if available */}
                    {summaryData.NcicParseResponse?.VehicleResponse && (
                      <div>
                        <h6>Vehicle Details:</h6>
                        <p><strong>License Plate:</strong> {summaryData?.VehicleResponse?.LicensePlateNumber}</p>
                        <p><strong>State:</strong> {summaryData?.VehicleResponse?.LicensePlateState}</p>
                        <p><strong>Make:</strong> {summaryData.NcicParseResponse.VehicleResponse.VehicleMake}</p>
                        <p><strong>Model:</strong> {summaryData?.VehicleResponse?.VehModel}</p>
                        <p><strong>Year:</strong> {summaryData?.VehicleResponse?.VehYear}</p>
                        <p><strong>VIN:</strong> {summaryData.NcicParseResponse.VehicleResponse.VehicleIdNumber}</p>
                        <p><strong>Owner:</strong> {summaryData?.VehicleResponse?.Name}</p>
                        <p><strong>Address:</strong> {summaryData?.VehicleResponse?.Address}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>Loading summary data...</div>
                )}
              </div>
            </fieldset>
          </div>}
        </div>
      </div>
      <div className="table-responsive h-full mt-2" style={{ position: "sticky" }}>
        <DataTable
          dense
          columns={column}
          data={ncicResponseData}
          customStyles={tableCustomStyles}
          pagination
          responsive
          striped
          highlightOnHover
          fixedHeader
          selectableRowsHighlight
          noDataComponent={ncicResponseData?.length > 0 ? "There are no data to display" : 'There are no data to display'}
          fixedHeaderScrollHeight="190px"
          // conditionalRowStyles={conditionalRowStyles}
          persistTableHead={true}
        />
      </div>
    </fieldset>
  )
}

export default ResponseSection
import TabCitation from '../../Utility/Tab/TabCitation'
import useObjState from '../../../CADHook/useObjState'
import IdentifyFieldColor from '../../Common/IdentifyFieldColor';
import NameInfoContent from '../../../CADComponents/CitationComponents/NameInfoContent';
import DrivingConditionContent from '../../../CADComponents/CitationComponents/DrivingConditionContent';
import VehicleInfoContent from '../../../CADComponents/CitationComponents/VehicleInfoContent';
import ChargeContent from '../../../CADComponents/CitationComponents/ChargeContent';
import DataTable from 'react-data-table-component';
import { compareStrings } from '../../../CADUtils/functions/common';
import { getShowingDateText, tableCustomStyles } from '../../Common/Utility';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import CitationServices from '../../../CADServices/APIs/citation';
import { useEffect, useState } from 'react';
import { fetchPostWithTableData } from '../../hooks/Api';

function CitationTab() {
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const [citationState, setCitationState] = useObjState({
        CitationNumber: '',
        DTTMIssued: '',
        IncidentNumber: '',
        CitationType: '',
        Officer: '',
        Status: '',
        Address: '',
        Accident: '',
        Weather: '',
        Traffic: '',
        Road: '',
        // Charge fields
        offenceCode: '',
        nibrCode: '',
        chargeDTTM: '',
        courtDTTM: '',
        chargeStatus: '',
    })
    const [vehicleData, setVehicleData] = useState({
        plateType: '',
        plateState: '',
        plateNumber: '',
        vin: '',
        category: '',
        classification: '',
        vod: '',
        make: '',
        model: '',
        style: '',
        plateExpires: '',
        mfgYear: '',
        weight: '',
        oanNumber: '',
        primaryColor: '',
        secondaryColor: '',
        owner: '',
    });
    const [listData, setListData] = useState([]);
    const [nameData, setNameData] = useState([]);

    const getAllCitationsKey = `/CAD/Monitor/MasterBoloDispositionGet/${localStoreData?.AgencyID}`;
    const { data: getAllCitationsData, isSuccess: isFetchAllCitations, refetch, isError: isNoData } = useQuery(
        [getAllCitationsKey, {
            "AgencyID": parseInt(localStoreData?.AgencyID),
        },],
        CitationServices.getAllCitations,
        {
            refetchOnWindowFocus: false,
            retry: 0,
            enabled: !!localStoreData?.AgencyID
        }
    );

    useEffect(() => {
        if (getAllCitationsData && isFetchAllCitations) {
            const data = JSON.parse(getAllCitationsData?.data?.data);
            setListData(data?.Table);
        }
    }, [getAllCitationsData, isFetchAllCitations]);


    const columns = [
        {
            name: 'CitationNumber',
            selector: row => row.CitationNumber,
            sortable: true,
            sortFunction: (rowA, rowB) => compareStrings(rowA.CitationNumber, rowB.CitationNumber),
            style: {
                position: "static",
            },
        },
        {
            name: 'ORI',
            selector: row => row.ORI,
            sortable: true,
            sortFunction: (rowA, rowB) => compareStrings(rowA.ORI, rowB.ORI),
            style: {
                position: "static",
            },
        },
        {
            name: 'CitationType',
            selector: row => row.CitationType,
            sortable: true,
            sortFunction: (rowA, rowB) => compareStrings(rowA.CitationType, rowB.CitationType),
            style: {
                position: "static",
            },
        },
        {
            name: 'Citation DT&TM',
            selector: row => row.CitationDatetime ? getShowingDateText(row?.CitationDatetime) : '',
            sortable: true,
            sortFunction: (rowA, rowB) => compareStrings(rowA.CitationDatetime, rowB.CitationDatetime),
            style: {
                position: "static",
            },
        },
        {
            name: 'County',
            selector: row => row.County,
            sortable: true,
            sortFunction: (rowA, rowB) => compareStrings(rowA.County, rowB.County),
            style: {
                position: "static",
            },
        },
    ];

    const conditionalRowStyles = [
        {
            when: row => row?.CitationNumber === citationState?.CitationNumber,
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

    function handelSetEditData(data) {
        const val = { CitationID: data?.CitationID, AgencyID: localStoreData?.AgencyID, }
        fetchPostWithTableData('/Citation/GetCitationByID', val).then((res) => {
            setCitationState({
                CitationID: res?.Table2?.[0]?.CitationID || '',
                CitationNumber: res?.Table2?.[0]?.CitationNumber || '',
                DTTMIssued: getShowingDateText(res?.Table2?.[0]?.CitationDatetime) || '',
                IncidentNumber: res?.Table2?.[0]?.IncidentNumber || '',
                CitationType: res?.Table2?.[0]?.CitationType || '',
                Officer: res?.Table2?.[0]?.IDNumber || '',
                Status: res?.Table2?.[0]?.StatuteNumber || '',
                Address: res?.Table2?.[0]?.HouseNumber + ', ' + res?.Table2?.[0]?.StreetName || '',
                Accident: res?.Table2?.[0]?.Accident || '',
                Weather: res?.Table2?.[0]?.WeatherCondition || '',
                Traffic: res?.Table2?.[0]?.TrafficCondition || '',
                Road: res?.Table2?.[0]?.RoadCondition || '',
                // Charge fields
                offenceCode: '' || '',
                nibrCode: '' || '',
                chargeDTTM: '' || '',
                courtDTTM: '' || '',
                chargeStatus: '' || '',
            })
            if (res?.Table?.length > 0) {
                setNameData(res?.Table);
            } else {
                setNameData([]);
            }
            if (res?.Table1?.length > 0) {
                setVehicleData({
                    plateType: res?.Table1?.[0]?.PlateType || '',
                    plateState: res?.Table1?.[0]?.State || '',
                    plateNumber: res?.Table1?.[0]?.VehicleNumber || '',
                    vin: res?.Table1?.[0]?.VIN || '',
                    category: res?.Table1?.[0]?.VehicleCategory || '',
                    classification: res?.Table1?.[0]?.VehicleClassification || '',
                    vod: res?.Table1?.[0]?.VOD || '',
                    make: res?.Table1?.[0]?.VehicleMake || '',
                    model: res?.Table1?.[0]?.ModelName || '',
                    style: res?.Table1?.[0]?.VehicleStyle || '',
                    plateExpires: res?.Table1?.[0]?.PlateExpirationYear || '',
                    mfgYear: res?.Table1?.[0]?.ManufactureYear || '',
                    weight: res?.Table1?.[0]?.Weight || '',
                    oanNumber: res?.Table1?.[0]?.OAN || '',
                    primaryColor: res?.Table1?.[0]?.PrimaryColor || '',
                    secondaryColor: res?.Table1?.[0]?.SecondaryColor || '',
                    owner: res?.Table1?.[0]?.OwnerName || '',
                });
            } else {
                setVehicleData({});
            }
        })
    }

    return (
        <div className="section-body pt-1 p-1 bt" >
            <div className="div">
                <div className="col-12  inc__tabs">
                    <TabCitation />
                </div>
                <div className="dark-row" >
                    <div className="col-12 col-sm-12">
                        <div className="card Agency incident-card-citation">
                            <div className="card-body">
                                <div className="table-responsive mb-2">
                                    <DataTable
                                        dense
                                        columns={columns}
                                        data={listData}
                                        customStyles={tableCustomStyles}
                                        conditionalRowStyles={conditionalRowStyles}
                                        pagination
                                        responsive
                                        paginationPerPage={'5'}
                                        paginationRowsPerPageOptions={[5, 10, 15, 20]}
                                        noDataComponent={"There are no data to display"}
                                        striped
                                        persistTableHead={true}
                                        highlightOnHover
                                        fixedHeader
                                        onRowClicked={(row) => {
                                            handelSetEditData(row);
                                        }}
                                    />
                                </div>
                                <fieldset>
                                    <legend> Citation  Info. </legend>
                                    <div className="d-flex align-items-center">
                                        <div className="col-1 mt-2">
                                            <label htmlFor="" className='new-label'>Citation #</label>
                                        </div>
                                        <div className="col-3 text-field">
                                            <input
                                                type="text"
                                                name='CitationNumber'
                                                className="form-control"
                                                value={citationState.CitationNumber}
                                                disabled
                                            />
                                        </div>
                                        <div className="col-1 mt-2">
                                            <label htmlFor="" className='new-label'>DT/TM Issued</label>
                                        </div>
                                        <div className="col-3 text-field">
                                            <input
                                                type="text"
                                                name='DTTMIssued'
                                                className="form-control"
                                                value={citationState.DTTMIssued}
                                                disabled
                                            />
                                        </div>
                                        <div className="col-1 mt-2">
                                            <label htmlFor="" className='new-label'>Incident #</label>
                                        </div>
                                        <div className="col-3 text-field">
                                            <input
                                                type="text"
                                                name='IncidentNumber'
                                                className="form-control"
                                                value={citationState.IncidentNumber}
                                                disabled
                                            />
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <div className="col-1 mt-2">
                                            <label htmlFor="" className='new-label'>Citation Type</label>
                                        </div>
                                        <div className="col-3 text-field">
                                            <input
                                                type="text"
                                                name='CitationType'
                                                className="form-control"
                                                value={citationState.CitationType}
                                                disabled
                                            />
                                        </div>
                                        <div className="col-1 mt-2">
                                            <label htmlFor="" className='new-label'>Officer</label>
                                        </div>
                                        <div className="col-3 text-field">
                                            <input
                                                type="text"
                                                name='Officer'
                                                className="form-control"
                                                value={citationState.Officer}
                                                disabled
                                            />
                                        </div>
                                        <div className="col-1 mt-2">
                                            <label htmlFor="" className='new-label'>Status</label>
                                        </div>
                                        <div className="col-3 text-field">
                                            <input
                                                type="text"
                                                name='Status'
                                                className="form-control"
                                                value={citationState.Status}
                                                disabled
                                            />
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <div className="col-1 mt-2">
                                            <label htmlFor="" className='new-label'>Address</label>
                                        </div>
                                        <div className="col-7 text-field">
                                            <input
                                                type="text"
                                                name='Address'
                                                className="form-control"
                                                value={citationState.Address}
                                                disabled
                                            />
                                        </div>
                                        <div className="col-1 mt-2">
                                            <label htmlFor="" className='new-label'>Accident</label>
                                        </div>
                                        <div className="col-3 text-field">
                                            <input
                                                type="text"
                                                name='Accident'
                                                className="form-control"
                                                value={citationState.Accident}
                                                disabled
                                            />
                                        </div>
                                    </div>

                                    {/* Name Info Section */}
                                    <fieldset className='mt-3'>
                                        <legend>Name Info.</legend>
                                        <NameInfoContent nameData={nameData} />
                                    </fieldset>

                                    <fieldset className='mt-3'>
                                        <legend>Driving Condition</legend>
                                        <DrivingConditionContent citationState={citationState} />
                                    </fieldset>

                                    {/* Vehicle Information Section */}
                                    <fieldset className='mt-3'>
                                        <legend>Vehicle Information</legend>
                                        <VehicleInfoContent vehicleData={vehicleData} />
                                    </fieldset>

                                    {/* Charge Section */}
                                    <fieldset className='mt-3'>
                                        <legend>Charge</legend>
                                        <ChargeContent citationState={citationState} />
                                    </fieldset>
                                </fieldset>
                            </div>
                            <IdentifyFieldColor />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CitationTab
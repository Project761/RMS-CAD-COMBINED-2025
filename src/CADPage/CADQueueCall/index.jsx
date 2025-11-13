import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import { getShowingMonthDateYear, tableCustomStyles } from '../../Components/Common/Utility';
import { compareStrings } from '../../CADUtils/functions/common';
import { useQueueCall } from '../../CADContext/QueueCall';
import Tooltip from '../../CADComponents/Common/Tooltip';
import CallTakerModal from '../../CADComponents/CallTakerModal';
import DateTimeCounter from '../../CADComponents/Common/DateTimeCounter';
import { useSelector } from 'react-redux';
import { ScreenPermision } from '../../Components/hooks/Api';

function CADQueueCall() {
    const {
        queueCall,
        queueCallData,
        switchQueueCallType,
        refetchQueueCall,
        isNoData
    } = useQueueCall();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const [incNo, setIncNo] = useState("")
    const [openCallTakerModal, setCallTakerModal] = useState(false);
    const [effectiveQueueCallScreenPermission, setEffectiveQueueCallScreenPermission] = useState(null);

    useEffect(() => {
        if (localStoreData) {
            getQueueCallScreenPermission(localStoreData?.AgencyID, localStoreData?.PINID);
        }
    }, [localStoreData]);

    const getQueueCallScreenPermission = (aId, pinID) => {
        try {
            ScreenPermision("QC101", aId, pinID).then(res => {
                if (res) {
                    setEffectiveQueueCallScreenPermission(res);
                }
                else {
                    setEffectiveQueueCallScreenPermission(null);
                }
            });
        } catch (error) {
            console.error('There was an error!', error);
            setEffectiveQueueCallScreenPermission(null);
        }
    }

    const columns = [
        ...(effectiveQueueCallScreenPermission?.[0]?.Changeok === 1 ? [{
            name: <p className='text-end' style={{ position: 'absolute', top: '7px', }}>Action</p>,
            cell: row =>
                <div style={{ position: 'absolute', top: 4, }} data-toggle="modal"
                    data-target="#CallTakerModal">
                    {
                        <span onClick={(e) => { setCallTakerModal(true); setIncNo(row?.IncidentID) }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1">
                            <i className="fa fa-edit"></i>
                        </span>
                    }
                </div>,
            width: '100px',
        }] : []),
        {
            name: 'Elapsed timer',
            selector: row => <DateTimeCounter data={row.TimeOfCall} />,
            sortable: true,
            sortFunction: (rowA, rowB) => compareStrings(rowA.ReceiveSourceCode, rowB.ReceiveSourceCode),
            style: {
                position: "static",
            },
            width: '160px',
        },
        {
            name: 'Location',
            selector: row => row?.CrimeLocation,
            sortable: true,
            sortFunction: (rowA, rowB) => compareStrings(rowA.CrimeLocation, rowB.CrimeLocation),
            cell: (row) => {
                return <Tooltip text={row?.CrimeLocation} maxLength={50} isSmall />;
            },
            style: {
                position: "static",
            },
        },
        {
            name: 'Apt#',
            selector: row => row?.Description,
            sortable: true,
            sortFunction: (rowA, rowB) => compareStrings(rowA.Description, rowB.Description),
            style: {
                position: "static",
            },
            width: '100px',
        },
        {
            name: 'ReceiveSource Code',
            selector: row => row?.ReceiveSourceCode,
            sortable: true,
            sortFunction: (rowA, rowB) => compareStrings(rowA.ReceiveSourceCode, rowB.ReceiveSourceCode),
            style: {
                position: "static",
            },
            width: '160px',
        },
        {
            name: 'Incident RecvedDT&TM',
            selector: row => row?.ReportedDate ? getShowingMonthDateYear(row?.ReportedDate) : "",
            sortable: true,
            sortFunction: (rowA, rowB) => compareStrings(rowA.ReportedDate, rowB.ReportedDate),
            style: {
                position: "static",
            },
        },
        {
            name: 'Priority',
            selector: row => row?.PriorityCode,
            sortable: true,
            sortFunction: (rowA, rowB) => compareStrings(rowA.PriorityCode, rowB.PriorityCode),
            style: {
                position: "static",
            },
            width: '100px',
        },
        {
            name: 'CFS Code',
            selector: row => row?.CFSCODE,
            sortable: true,
            sortFunction: (rowA, rowB) => compareStrings(rowA.CFSCODE, rowB.CFSCODE),
            style: {
                position: "static",
            },
            width: '160px',
        },
        {
            name: 'Caller Name',
            selector: row => row?.CallerName,
            sortable: true,
            sortFunction: (rowA, rowB) => compareStrings(rowA.CallerName, rowB.CallerName),
            style: {
                position: "static",
            },
        },
        {
            name: 'Operator Name',
            selector: row => row?.OperatorName,
            sortable: true,
            sortFunction: (rowA, rowB) => compareStrings(rowA.OperatorName, rowB.OperatorName),
            style: {
                position: "static",
            },
        },
    ];

    return (
        <div className='mt-3 px-1'>
            <div className='header-Container d-flex justify-content-between align-items-center'>
                <span> {"Queue Calls"}</span>
            </div>
            <div className='d-flex align-self-center justify-content-start my-4 px-5' style={{ gap: '10px' }}>
                <div className="d-flex align-self-center justify-content-start" style={{ width: '120px' }}>
                    <div className='d-flex align-self-center justify-content-start' style={{ gap: '5px' }}>
                        <input type="radio" id="myQueueCall" value="myQueueCall" checked={queueCall === 'myQueueCall'} onChange={(e) => { switchQueueCallType(e.target.value); }} />
                        <label for="myQueueCall" className='tab-form-label' style={{ margin: '0', }}>My Queue Calls</label>
                    </div>
                </div>
                <div className="d-flex align-self-center justify-content-start" style={{ width: '120px' }}>
                    <div className='d-flex align-self-center justify-content-start' style={{ gap: '5px' }}>
                        <input type="radio" id="allQueueCall" value="allQueueCall" checked={queueCall === 'allQueueCall'} onChange={(e) => {
                            switchQueueCallType(e.target.value);
                        }} />
                        <label for="allQueueCall" className='tab-form-label' style={{ margin: '0', }}>All Queue Calls</label>
                    </div>
                </div>
            </div>
            <div className="table-responsive">
                <DataTable
                    dense
                    columns={columns}
                    data={effectiveQueueCallScreenPermission?.[0]?.DisplayOK ? queueCallData : []}
                    customStyles={tableCustomStyles}
                    pagination
                    responsive
                    noDataComponent={effectiveQueueCallScreenPermission ? effectiveQueueCallScreenPermission?.[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
                    striped
                    persistTableHead={true}
                    highlightOnHover
                    fixedHeader
                />
            </div>
            {openCallTakerModal && <CallTakerModal
                {...{
                    openCallTakerModal,
                    setCallTakerModal,
                    incNo,
                }}
                isQueueCall
                refetchQueueCall={refetchQueueCall}
            />}
        </div>
    )
}

export default CADQueueCall
import React, { useEffect, useState, useContext } from 'react'
import { fetchData, fetchPostData } from '../../hooks/Api';
import { toastifyError } from '../../Common/AlertMsg';
import { getShowingDateText } from '../../Common/Utility';
import { threeColArray } from '../../Common/ChangeArrayFormat';
import { AgencyContext } from '../../../Context/Agency/Index';
import ListNewAddUp from './ListNewAddUp';

const ListNewPage = () => {

    const { personnelData, getPersonnelList } = useContext(AgencyContext);

    const [dates, setDates] = useState({
        'ReportedDate': getShowingDateText(new Date()),
        'ReportedDateTo': getShowingDateText(new Date()),
    });

    const [value, setValue] = useState({
        PINID: '', PinActivityID: '', StatusCode: '', StatusDtTm: new Date(), InidentID: '', IncidentNumber: '', CrimeLocation: '', RMSCFSCodeID: '', CADCFSCodeID: '', MasterIncidentNumber: '', ReportedDate: '', ApplicationName: 'CAD',
    })
    const [modalStatus, setModalStatus] = useState(false);
    const [toUserName, setToUserName] = useState('')

    const [incidentData, setIncidentData] = useState([]);
    const [statusData, setStatusData] = useState([]);
    const [tableTwoId, setTableTwoId] = useState('')
    const [tableOneId, setTableOneId] = useState('')

    useEffect(() => { getIncidentSearchData(); getPersonnelList(); getStatusList() }, [])

    const getIncidentSearchData = async () => {
        fetchPostData('Incident/Search_Incident', dates).then((res) => {
            if (res.length > 0) {
                setIncidentData(res);
            } else {
                toastifyError("Data Not Available"); setIncidentData([]);
            }
        });
    };

    const getStatusList = async () => {
        fetchData('CADIncidentStatus/GetDataDropDown_CADPINActivity').then((res) => {
            if (res.length > 0) {
                setStatusData(threeColArray(res, 'ActivityTypeID', 'ActivityCode', 'ActivityCode'));
            } else {
                toastifyError("Data Not Available"); setStatusData([]);
            }
        });
    };

    const handleChangeIncident = (item) => {
        setTableOneId(item.IncidentID); setValue(pre => { return { ...pre, ['InidentID']: item.IncidentID, ['IncidentNumber']: item.IncidentNumber, ['CrimeLocation']: item.CrimeLocation, ['RMSCFSCodeID']: item.RMSCFSCodeID, ['CADCFSCodeID']: item.CADCFSCodeID, ['ReportedDate']: item.ReportedDate, ['MasterIncidentNumber']: item.MasterIncidentNumber } })
    }

    const handleChangePersonnel = (item) => {
        setTableTwoId(item.PINID); setModalStatus(true); setToUserName(item.Name)
        if (value?.InidentID) { setValue(pre => { return { ...pre, ['PINID']: item.PINID } }) }
        else { toastifyError('Please Select Incident') }
    }

    const resetHooks = () => {
        setValue({ ...value, PINID: '', PinActivityID: '', StatusCode: '', InidentID: '', IncidentNumber: '', CrimeLocation: '', RMSCFSCodeID: '', CADCFSCodeID: '', MasterIncidentNumber: '', ReportedDate: '', })
    }

    return (
        <>
            <div className="section-body view_page_design pt-3 px-2">
                <div className="row clearfix" >
                    <div className="card Agency" style={{ borderBottom: 'none', borderRight: 'none', borderLeft: 'none' }}>
                        <div className="card-body">
                            <div className="row  px-0">
                                <div className="col-12">
                                    <div className="table-responsive  " style={{ height: '250px' }}>
                                        <table className="table border-top table-md ">
                                            <thead style={{ background: '#ddd', position: 'sticky', top: '-1px' }}>
                                                <tr >
                                                    <th scope="col">IncidentNumber</th>
                                                    <th scope="col">RMSCFSCode</th>
                                                    <th scope="col">OccurredFrom</th>
                                                    <th scope="col">OccurredTo</th>
                                                    <th scope="col">CrimeLocation</th>
                                                    <th scope="col">ReportedDate</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    incidentData?.map((item) => (
                                                        <tr onClick={() => handleChangeIncident(item)} key={item.IncidentID} style={{ background: tableOneId === item.IncidentID && '#50f9ff', cursor: 'pointer' }}>
                                                            <td>{item?.IncidentNumber}</td>
                                                            <td>{item?.RMSCFSCode_Description}</td>
                                                            <td>{item?.OccurredFrom}</td>
                                                            <td>{item?.OccurredTo}</td>
                                                            <td>{item?.CrimeLocation}</td>
                                                            <td>{item?.ReportedDate}</td>
                                                        </tr>
                                                    ))
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <hr />
            <div className="card" style={{ borderRight: 'none', borderLeft: 'none', borderBottom: 'none' }}>
                <div className="card-body" >
                    <div className="row  px-0">
                        <div className="table-responsive " style={{ height: '250px' }}>
                            <table className="table border-top  table-hover ">
                                <thead style={{ background: '#ddd', position: 'sticky', top: '-1px' }}>
                                    <tr >
                                        <th scope="col">Unit</th>
                                        <th scope="col">Officer</th>
                                        <th scope="col">st</th>
                                        <th scope="col">StatusDtTm</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        personnelData?.map((item) => (
                                            <tr key={item.StatusDtTm} onClick={() => handleChangePersonnel(item)} style={{ background: tableTwoId === item.PINID && 'coral', cursor: 'pointer' }} data-toggle="modal" data-target="#AssignModal" >
                                                <td>3</td>
                                                <td>{item?.Name}</td>
                                                <td style={{ color: item?.StatusCode === 'BU' ? 'red' : 'green' }}>{item?.StatusCode}</td>
                                                <td>{item?.StatusDtTm}</td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                            <hr />
                        </div>
                    </div>
                </div>
            </div>
            <ListNewAddUp {...{ statusData, value, setValue, modalStatus, setModalStatus, getPersonnelList, resetHooks, toUserName }} />
        </>
    )
}

export default ListNewPage
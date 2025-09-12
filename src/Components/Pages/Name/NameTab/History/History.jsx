import React, { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import { getShowingWithOutTime, stringToBase64, tableCustomStyles } from '../../../../Common/Utility';
import { fetchPostData } from '../../../../hooks/Api';
import { useNavigate } from 'react-router-dom';

const History = (props) => {
    const navigate = useNavigate();

    const { DecNameID, DecMasterNameID, DecIncID } = props

    const [HistoryData, setHistoryData] = useState([]);

    useEffect(() => {
        if (DecMasterNameID || DecNameID) {
            Get_HistoryData();
        }
    }, [DecMasterNameID, DecNameID]);

    const Get_HistoryData = () => {
        const val = {
            'MasterNameID': DecMasterNameID,
            
        }
        fetchPostData('MasterName/GetData_NameHistory', val).then((res) => {
            if (res) {
                console.log(res)
                setHistoryData(res)
            } else {
                setHistoryData();
            }
        })
    }


    const columns = [
       
        {
            width: '200px',
            name: 'Incident Number',
            selector: (row) => row['IncidentNumber'],
            sortable: true,
            cell: (row) => (
                <span
                    style={{ color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}
                    onClick={() => {
                        console.log(row)
                        console.log(row?.IncidentID)
                        navigate(`/Inc-Home?IncId=${stringToBase64(row?.IncidentID)}&IncNo=${row?.IncidentNumber}&IncSta=true&IsCadInc=false`)
                    }
                    }
                >
                    {row?.IncidentNumber}
                </span >
            )
        },

        {
            width: '200px',
            name: 'Name',
            selector: (row) => row['FullName'],
            sortable: true
        },
        {
            width: '100px',
            name: 'DOB',
            selector: (row) => row['Date of Birth'] ? getShowingWithOutTime(row['Date of Birth']) : '',

            sortable: true
        },
        {
            width: '200px',
            name: 'Age From',
            selector: (row) => row['Age From'],
            sortable: true
        },
        {
            width: '200px',
            name: 'Age To',
            selector: (row) => row['Age To'],
            sortable: true
        },
        {
            width: '200px',
            name: 'Weight From',
            selector: (row) => row['Weight From'],
            sortable: true
        },
        {
            width: '200px',
            name: 'Weight To',
            selector: (row) => row['Weight To'],
            sortable: true
        },

        {
            width: '200px',
            name: 'Height From',
            selector: (row) => row['Height From'],
            sortable: true
        },
        {
            width: '200px',
            name: 'Height To',
            selector: (row) => row['Height To'],
            sortable: true
        },
        {
            width: '130px',
            name: 'Hair Color',
            selector: (row) => row['Hair Color'],
            sortable: true
        },
        {
            width: '130px',
            name: 'Eye Color',
            selector: (row) => row['Eye Color'],
            sortable: true
        },
        {
            width: '130px',
            name: 'SSN#',
            selector: (row) => row['SSN #'],
            sortable: true
        },
        {
            width: '130px',
            name: 'DL#',
            selector: (row) => row['DL #'],
            sortable: true
        },
        {
            width: '130px',
            name: 'Distinct Features1',
            selector: (row) => row['Distinct Features1'],
            sortable: true
        },
        {
            width: '130px',
            name: 'Distinct Features2',
            selector: (row) => row['Distinct Features2'],
            sortable: true
        },
        {
            width: '130px',
            name: 'Facial Shape',
            selector: (row) => row['Facial Shape'],
            sortable: true
        },
        {
            width: '130px',
            name: 'Body Build',
            selector: (row) => row['Body Build'],
            sortable: true
        },
        {
            width: '130px',
            name: 'Speech',
            selector: (row) => row['Speech'],
            sortable: true
        },
        {
            width: '130px',
            name: 'Glasses',
            selector: (row) => row['Glasses'],
            sortable: true
        },
        {
            width: '130px',
            name: 'Teeth',
            selector: (row) => row['Teeth'],
            sortable: true
        },
        {
            width: '130px',
            name: 'Hair Styles',
            selector: (row) => row['Hair Styles'],
            sortable: true
        },
        {
            width: '130px',
            name: 'Hair Length',
            selector: (row) => row['Hair Lenght'],
            sortable: true
        },
        {
            width: '130px',
            name: 'Hair Shades',
            selector: (row) => row['Hair Shades'],
            sortable: true
        },
        {
            width: '130px',
            name: 'Body Build',
            selector: (row) => row['Body Build'],
            sortable: true
        },
        {
            width: '130px',
            name: 'Facial Hair1',
            selector: (row) => row['Facial Hair1'],
            sortable: true
        },
        {
            width: '130px',
            name: 'Facial Hair2',
            selector: (row) => row['Facial Hair2'],
            sortable: true
        },

        {
            width: '130px',
            name: 'Facial Oddity1',
            selector: (row) => row['Facial Oddity1'],
            sortable: true
        },
        {
            width: '130px',
            name: 'Facial Oddity2',
            selector: (row) => row['Facial Oddity2'],
            sortable: true
        },
        {
            width: '130px',
            name: 'Facial Oddity3',
            selector: (row) => row['Facial Oddity3'],
            sortable: true
        },
    ]
    return (
        <>

            <div className="col-md-12 mt-2">
                <div className="col-12 mt-2">
                    <DataTable
                        dense
                        columns={columns}
                        data={HistoryData}
                        pagination
                        selectableRowsHighlight
                        highlightOnHover
                        responsive
                        showPaginationBottom={10}
                        customStyles={tableCustomStyles}
                       
                        fixedHeader
                        persistTableHead={true}
                        fixedHeaderScrollHeight='330px'
                    />
                </div>
            </div>
        </>
    )
}

export default History
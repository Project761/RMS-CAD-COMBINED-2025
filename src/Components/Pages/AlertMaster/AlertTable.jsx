import { useEffect, useState } from 'react'
import { tableCustomStyles } from '../../Common/Utility';
import DataTable from 'react-data-table-component';

const AlertTable = (props) => {

    const { availableAlert, masterPropertyID, ProSta, labelCol } = props;
    const [alertStatus, setAlertStatus] = useState(false)


    const alertColumns = [
        {
            name: 'Alert Name',
            selector: (row) => row.AlertType,
            sortable: true
        },
        {
            name: 'Start Note',
            selector: (row) => row.StartNote,
            sortable: true
        },
    ]

    const conditionalRowStylesAlert = [
        {
            when: row => !!row && !!row.BackColor,
            style: row => ({
                backgroundColor: row.BackColor || row.ForeColor,
                color: row.ForeColor,
                cursor: 'pointer',

            }),
        },
    ];

    useEffect(() => {
        function controlClick() {
            setAlertStatus(false)
        }
        document.body.addEventListener('click', controlClick);
        return () => {
            document.body.removeEventListener('click', controlClick);
        };
    }, []);

    const handleModalClick = (event) => {
        event.stopPropagation();
    };

    const day = new Date().getDate()
    const month = new Date().getMonth()
    const year = new Date().getFullYear()

    return (

        <div className='row bt bb align-items-center'>
            <div className={`${labelCol ? labelCol : "col-lg-1"} mt-2 text-nowrap text-right`}>
                {masterPropertyID && (ProSta === 'true' || ProSta === true) && (
                    <span data-toggle="modal" data-target="#MasterAlert" style={{ cursor: "pointer" }} className='alert-link pt-1'>Alerts :</span>
                )}
            </div>

            <div className='alert-name col-lg-11 mt-2 d-flex align-items-center' style={{
                alignContent: "center", height: "30px", overflowY: 'auto',
            }} >
                {availableAlert?.filter((alert) => alert?.AlertDateTo ? new Date(alert?.AlertDateTo) >= new Date(year, month, day) : alert)?.length > 0 ?
                    availableAlert?.filter((alert) => alert?.AlertDateTo ? new Date(alert?.AlertDateTo) >= new Date(year, month, day) : alert)?.map((alert) => (
                        <span style={{ margin: "0 2px 0 2px", padding: "1px 4px 1px 4px", border: "1px solid", background: `${alert?.BackColor}`, color: alert?.BackColor && alert?.ForeColor, cursor: "pointer" }} onMouseOver={() => setAlertStatus(true)}>{alert?.AlertType}</span>
                    ))
                    :
                    <>
                        {
                            masterPropertyID && (ProSta === 'true' || ProSta === true) &&
                            <span data-toggle="modal" data-target="#MasterAlert" style={{ cursor: "pointer", marginLeft: "10px", color: "blue", fontWeight: "bold" }} className='alert-link pt-1' onClick={() => { setAlertStatus(false) }}>
                                Add Alert
                            </span>
                        }
                    </>
                }
            </div>

            {(availableAlert?.filter((alert) => alert?.AlertDateTo ? new Date(alert?.AlertDateTo) >= new Date(year, month, day) : alert)?.length > 0 && alertStatus) &&
                <div className='alert-table' style={{ boxShadow: "rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px", }} >
                    <div className="modal-content" onClick={handleModalClick}>
                        <button type="button" className="border-0" aria-label="Close" data-dismiss="modal" style={{ alignSelf: "end" }} onClick={() => { setAlertStatus(false) }}><b>X</b>
                        </button>
                        <div className="col-12">
                            <DataTable
                                dense
                                columns={alertColumns}
                                data={availableAlert?.filter((alert) => alert?.AlertDateTo ? new Date(alert?.AlertDateTo) >= new Date(year, month, day) : alert)}
                                fixedHeaderScrollHeight='120px'
                                fixedHeader
                                conditionalRowStyles={conditionalRowStylesAlert}
                                persistTableHead={true}
                                customStyles={tableCustomStyles}
                            />
                        </div>
                    </div>
                    <span data-toggle="modal" data-target="#MasterAlert" className='alert-link ml-1' onClick={() => { setAlertStatus(false) }}>
                        Add Alert
                    </span>
                </div>
            }
        </div>

    )
}

export default AlertTable










import { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import PropTypes from 'prop-types';
import { tableCustomStyles } from '../../../Components/Common/Utility';

const FlagTable = (props) => {

    const { availableAlert, masterPropertyID, ProSta } = props;
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
        <div className='col-12'>
            <div className='row'>
                <div className='alert-name col-lg-11' style={{ alignContent: "center", overflowY: 'auto' }} >
                    <span data-toggle="modal" data-target="#MasterFlagModal" className='alert-link pt-1' onClick={() => { setAlertStatus(false) }}>
                        Add Flag
                    </span>
                </div>

                {(availableAlert?.filter((alert) => alert?.AlertDateTo ? new Date(alert?.AlertDateTo) >= new Date(year, month, day) : alert)?.length > 0 && alertStatus) &&
                    <div className='alert-table' >
                        <div className="modal-content" onClick={handleModalClick}>
                            <button type="button" className="border-0" aria-label="Close" data-dismiss="modal" style={{ alignSelf: "end" }} onClick={() => { setAlertStatus(false) }}><b>X</b>
                            </button>
                            <div className="col-12">
                                <DataTable
                                    dense
                                    columns={alertColumns}
                                    data={availableAlert?.filter((alert) => alert?.AlertDateTo ? new Date(alert?.AlertDateTo) >= new Date(year, month, day) : alert)}
                                    // pagination
                                    // highlightOnHover
                                    fixedHeaderScrollHeight='120px'
                                    fixedHeader
                                    conditionalRowStyles={conditionalRowStylesAlert}
                                    persistTableHead={true}
                                    customStyles={tableCustomStyles}
                                />
                            </div>
                        </div>
                        <span data-toggle="modal" data-target="#MasterAlert" className='alert-link' onClick={() => { setAlertStatus(false) }}>
                            Add Alert
                        </span>
                    </div>
                }
            </div>
        </div >
    )
}

export default FlagTable

// PropTypes definition
FlagTable.propTypes = {
  availableAlert: PropTypes.array,
  masterPropertyID: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  ProSta: PropTypes.string
};

// Default props
FlagTable.defaultProps = {
  availableAlert: [],
  masterPropertyID: null,
  ProSta: ""
};

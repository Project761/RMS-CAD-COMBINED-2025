import { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import DataTable from 'react-data-table-component';
import { AddDeleteUpadate, fetchPostData } from '../../hooks/Api';
import { toastifyError, toastifySuccess } from '../../Common/AlertMsg';
import { AgencyContext } from '../../../Context/Agency/Index';
import DeletePopUpModal from '../../Common/DeleteModal';
import { Space_Not_Allow } from '../Utility/Personnel/Validation';
import { tableCustomStyles } from '../../Common/Utility';

const Dictionary = () => {

    const { localStoreArray, get_LocalStorage } = useContext(AgencyContext)
    const [clickedRow, setClickedRow] = useState(null);

    const [oriData, setOriData] = useState();
    const [Id, setId] = useState();
    const [status, setStatus] = useState(false);
    const [editval, setEditval] = useState();
    const [loginPinID, setLoginPinID,] = useState('');
    const [updateStatus, setUpdateStatus] = useState(0)
    const [loginAgencyID, setLoginAgencyID] = useState('');

    const [value, setValue] = useState({
        'WordName': '', 'CreatedByUserFK': '', 'ModifiedByUserFK': '', 'Id': '', 'AgencyID': ''
    })

    const [errors, setErrors] = useState({ 'DescriptionError': '', });

    useEffect(() => {
        if (!localStoreArray?.AgencyID || !localStoreArray?.PINID) {
            get_LocalStorage();
        }
    }, []);

    // Onload Function
    useEffect(() => {
        if (localStoreArray) {
            if (localStoreArray?.AgencyID && localStoreArray?.PINID) {
                setLoginPinID(parseInt(localStoreArray?.PINID));
                setLoginAgencyID(localStoreArray?.AgencyID);
            }
        }
    }, [localStoreArray])


    useEffect(() => {
        setValue({ ...value, 'CreatedByUserFK': loginPinID, 'AgencyID': loginAgencyID, })
    }, [loginPinID, updateStatus]);

    useEffect(() => {
        if (status) {
            setValue({
                ...value,
                'WordName': editval?.WordName,
                'Id': editval?.Id,
                'ModifiedByUserFK': loginPinID,
            })
        } else {
            setValue({
                ...value,
                'WordName': '',
                'Id': '',
                'CreatedByUserFK': '',

            })
        }
    }, [status, updateStatus])

    const Reset = () => {
        setValue({
            ...value,
            'WordName': '',
        })
        setErrors({
            ...errors,
            'DescriptionError': '',
        })
    }

    const check_Validation_Error = (e) => {
        if (Space_Not_Allow(value.WordName)) {
            setErrors(prevValues => { return { ...prevValues, ['DescriptionError']: Space_Not_Allow(value.WordName) } })
        }
    }

    const { DescriptionError } = errors

    useEffect(() => {
        if (DescriptionError === 'true') {
            if (status) UpdateDictionary();
            else InsertDictionary();
        }
    }, [DescriptionError])

    useEffect(() => {
        if (loginAgencyID) {
            get_Data_Dictionary(loginAgencyID);
        }
    }, [loginAgencyID])

    const get_Data_Dictionary = (loginAgencyID) => {
        const val = {
            AgencyID: loginAgencyID
        }
        fetchPostData('PasswordDictionary/GetData_PasswordDictionary', val).then((res) => {
            if (res) {

                setOriData(res)
            } else {
                setOriData([]);
            }
        })
    }

    const handlChange = (e) => {
        setValue({
            ...value,
            [e.target.name]: e.target.value
        })
    }

    const InsertDictionary = (e) => {
        const result = oriData?.find(item => {
            if (item.WordName === value.WordName) {
                return item.WordName === value.WordName
            } else return item.WordName === value.WordName
        });
        if (result) {
            if (result) {
                toastifyError(' WordName Already Exists')
                setErrors({ ...errors, ['DescriptionError']: '' })
            }
        } else {
            AddDeleteUpadate('PasswordDictionary/Insert_PasswordDictionary', value).then((res) => {
                toastifySuccess(res.Message);
                setErrors({ ...errors, ['DescriptionError']: '' })
                get_Data_Dictionary(loginAgencyID);
                Reset();
            })
        }
    }

    const UpdateDictionary = () => {
        const result = oriData?.find(item => {
            if (item.Id != Id) {
                if (item.WordName === value.WordName) {
                    return item.WordName === value.WordName
                } else return item.WordName === value.WordName
            }
        });
        if (result) {
            if (result) {
                toastifyError('WordName Already Exists')
                setErrors({ ...errors, ['DescriptionError']: '' })
            }
        } else {
            AddDeleteUpadate('PasswordDictionary/UpdatePasswordDictionary', value).then((res) => {
                if (res) {
                    toastifySuccess(res.Message);
                    get_Data_Dictionary(loginAgencyID);
                    Reset();
                    setStatus(false);
                    setErrors({
                        ...errors,
                        'DescriptionError': '',
                    })
                } else {
                    console.log("Somthing Wrong");
                }
            })

        }
    }

    const columns = [
        {
            name: 'WordName',
            selector: (row) => row.WordName,
            sortable: true
        },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: 8, left: '15px' }}>Delete</p>,
            cell: row =>
                <div style={{ position: 'absolute', top: 4, left: 25 }}>

                    <Link to={`#`} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" onClick={() => { setId(row.Id) }} data-toggle="modal" data-target="#DeleteModal">
                        <i className="fa fa-trash"></i>
                    </Link>

                </div>

        }
    ]

    const setEditvalue = (row) => {
        setEditval(row)
        setStatus(true)
        setId(row?.Id)
        setUpdateStatus(updateStatus + 1);
        setErrors('');
    }

    const setStatusFalse = (e) => {
        setUpdateStatus(updateStatus + 1);
        setClickedRow(null);
        setStatus(false);
        Reset();
    }

    const conditionalRowStyles = [
        {
            when: row => row === clickedRow,
            style: {
                backgroundColor: '#001f3fbd',
                color: 'white',
                cursor: 'pointer',
            },
        },
    ];

    const DeleteotherCode = () => {
        const val = {
            'Id': Id,
            'DeletedByUserFK': loginPinID,
        }
        AddDeleteUpadate('PasswordDictionary/Delete_PasswordDictionary', val).then((res) => {
            if (res) {
                toastifySuccess(res.Message);
                Reset();
                setStatus(false);
                get_Data_Dictionary(loginAgencyID);
            } else console.log("Somthing Wrong");
        })
    }

    return (
        <>
            <div className="col-12 " id='display-not-form'>
                <div className="col-12 col-md-12 mt-2 pt-1 p-0" >
                    <div className="bg-line  py-1 px-2 d-flex justify-content-between align-items-center">
                        <p className="p-0 m-0">Dictionary</p>
                    </div>
                </div>
                <div className="row mt-2 px-3">
                    <div className="col-6 col-md-6 col-lg-4 mt-2">
                        <div className="text-field">
                            <input type="text" name='WordName' className='requiredColor' onChange={handlChange} value={value.WordName} required />
                            <label>Dictionary</label>
                            {errors.DescriptionError !== 'true' ? (
                                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.DescriptionError}</span>
                            ) : null}
                        </div>
                    </div>
                    <div className="row">
                        {
                            status ?
                                <div className="col-6 col-md-6 col-lg-8  mt-3 pt-1 p-0">
                                    <button type="button" className="btn btn-sm btn-success mx-1 py-1 text-center" onClick={() => { check_Validation_Error(); }}>Update</button>
                                </div>
                                :
                                <div className="col-6 col-md-6 col-lg-8  mt-3 pt-1 p-0">
                                    <button type="button" className="btn btn-sm btn-success mx-1 py-1 text-center" onClick={() => { check_Validation_Error(); }}>Save</button>
                                </div>
                        }
                    </div>
                    <div className="col-6 col-md-3 col-lg-4  mt-3 pt-1 p-0">
                        <button type="button" className="btn btn-sm btn-success mx-1 py-1 text-center" onClick={() => { setStatusFalse(); }}>Cancel</button>
                    </div>
                </div>
            </div>
            <div className="col-12 mt-3 px-3">
                <DataTable
                    columns={columns}
                    data={oriData}
                    dense
                    pagination
                    paginationPerPage={'15'}
                    paginationRowsPerPageOptions={[15]}
                    selectableRowsHighlight
                    highlightOnHover
                    noDataComponent={"There are no data to display"}
                    fixedHeader
                    persistTableHead={true}
                    customStyles={tableCustomStyles}
                    onRowClicked={(row) => {
                        setClickedRow(row);
                        setEditvalue(row);
                    }}
                    conditionalRowStyles={conditionalRowStyles}
                />
            </div>
            <DeletePopUpModal func={DeleteotherCode} />
        </>
    )
}

export default Dictionary
import { useContext, useEffect, useState, useRef } from 'react';
import DataTable from 'react-data-table-component';
import { AddDeleteUpadate, fetchPostData } from '../../../../../../hooks/Api';
import { toastifyError, toastifySuccess } from '../../../../../../Common/AlertMsg';
import DeletePopUpModal from '../../../../../../Common/DeleteModal';
import { AgencyContext } from '../../../../../../../Context/Agency/Index';
import { RequiredFieldIncident } from '../../../../../Utility/Personnel/Validation';
import { Comman_changeArrayFormat } from '../../../../../../Common/ChangeArrayFormat';
import { Decrypt_Id_Name, tableCustomStyles } from '../../../../../../Common/Utility';
import { useDispatch, useSelector } from 'react-redux';
import { get_LocalStoreData } from '../../../../../../../redux/actions/Agency';
import { get_ScreenPermissions_Data } from '../../../../../../../redux/actions/IncidentAction';
import ChangesModal from '../../../../../../Common/ChangesModal';

const Offense = (props) => {

    const { DecChargeId, DecIncID } = props
    const dispatch = useDispatch()
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);

    const { get_ArrestCharge_Count, setChangesStatus } = useContext(AgencyContext);
    const SelectedValue = useRef();

    const [ownerData, setOwnerData] = useState();
    const [ChargeOffenseID, setChargeOffenseID] = useState();
    //screen permission 
    const [deleteStatus, setDeleteStatus] = useState(false)
    const [mainIncidentID, setMainIncidentID] = useState('');
    const [loginPinID, setLoginPinID,] = useState('');
    const [LoginAgencyID, setLoginAgencyID,] = useState('');

    const [ownerIdDrp, setOwnerIdDrp] = useState([]);
    const [filterData, setFilterData] = useState()

    const [value, setValue] = useState({
        'ChargeID': '', 'labal': '', 'IncidentID': '', 'OffenseID': null, 'CreatedByUserFK': '',
    })

    const [errors, setErrors] = useState({
        'OwnerIDError': '',
    });

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId)); get_OwnerID_Drp(DecIncID);
        }
    }, []);

    useEffect(() => {
        if (localStoreData) {
            setLoginPinID(localStoreData?.PINID);
            setLoginAgencyID(localStoreData?.AgencyID)
            dispatch(get_ScreenPermissions_Data("C078", localStoreData?.AgencyID, localStoreData?.PINID));
        }
    }, [localStoreData]);

    useEffect(() => {
        if (DecChargeId) {
            get_Data_Owner(DecChargeId, DecIncID);
            setValue({
                ...value, 'IncidentID': DecIncID, 'ChargeID': DecChargeId, 'CreatedByUserFK': loginPinID, 'AgencyID': LoginAgencyID, 'labal': '', 'OffenseID': null,
            })
        }
    }, [DecChargeId, DecIncID]);

    useEffect(() => {
        if (DecIncID) { get_OwnerID_Drp(DecIncID); setMainIncidentID(DecIncID); }
    }, [DecIncID])

    const check_Validation_Error = (e) => {
        if (RequiredFieldIncident(value.OffenseID)) {
            setErrors(prevValues => { return { ...prevValues, ['OwnerIDError']: RequiredFieldIncident(value.OffenseID) } })
        }
    }
    const { OwnerIDError } = errors

    useEffect(() => {
        if (OwnerIDError === 'true') {
            Add_Owner();
        }
    }, [OwnerIDError])

    const get_Data_Owner = (ChargeID, mainIncidentID) => {
        const val = { 'ChargeID': ChargeID, 'IncidentID': mainIncidentID, 'OffenseID': 0, }
        fetchPostData('ChargeOffense/GetData_ChargeOffense', val).then((res) => {
            if (res) {
                setOwnerData(res);
            }
            else { setOwnerData([]); }
        })
    }

    const get_OwnerID_Drp = (mainIncidentID) => {
        const val = { 'IncidentID': mainIncidentID, 'ChargeID': DecChargeId, 'OffenseID': 0, }
        fetchPostData('ChargeOffense/GetData_InsertChargeOffense', val).then((res) => {
            if (res) {
                setFilterData(res);
                setOwnerIdDrp(Comman_changeArrayFormat(res, 'CrimeID', 'Offense_Description'));
            }
            else { setOwnerIdDrp([]); }
        })
    }

    const Add_Owner = () => {
        const result = ownerData?.find(item => {
            if (item.OffenseID === value.OffenseID) {
                return item.OffenseID === value.OffenseID
            } else return item.OffenseID === value.OffenseID
        });
        if (result) {
            toastifyError('Offense Already Exists');
            setErrors({ ...errors, ['OwnerIDError']: '', })
        } else if (value.OffenseID !== '') {
            const { ChargeID, labal, OffenseID, } = value
            const val = {
                'IncidentID': DecIncID, 'ChargeID': DecChargeId, 'CreatedByUserFK': loginPinID,
                'labal': labal, 'OffenseID': OffenseID, 'AgencyID': LoginAgencyID
            }
            AddDeleteUpadate('ChargeOffense/Insert_ChargeOffense', val).then((res) => {
                const parsedData = JSON.parse(res.data);
                const message = parsedData.Table[0].Message;
                toastifySuccess(message); get_ArrestCharge_Count(ChargeID); setChangesStatus(false);
                get_Data_Owner(ChargeID, mainIncidentID); get_OwnerID_Drp(mainIncidentID);
                onClear(); setErrors({ ...errors, ['OwnerIDError']: '', })
            })
        }
    }

    const onClear = () => {
        SelectedValue?.current?.clearValue();
        setValue(pre => { return { ...pre, ['OffenseID']: '', ['ChargeOffenseID']: '', ['labal']: '' } });
    };


    const columns = [
        {
            name: 'Offense Name', selector: (row) => row.Offense_Description, sortable: true
        },
        {
            name: 'Attempt/Complete', selector: (row) => row.AttemptComplete, sortable: true
        },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: 8, right: 10 }}>Delete</p>,
            cell: row =>
                <div className="div" style={{ position: 'absolute', top: 4, right: 10 }}>
                    {
                        effectiveScreenPermission ?
                            effectiveScreenPermission[0]?.DeleteOK ?
                                <span onClick={() => { setDeleteStatus(true); setChargeOffenseID(row.ChargeOffenseID); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                                    <i className="fa fa-trash"></i>
                                </span>
                                : <></>
                            :
                            <span onClick={() => { setDeleteStatus(true); setChargeOffenseID(row.ChargeOffenseID); }} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                                <i className="fa fa-trash"></i>
                            </span>
                    }
                </div>

        }
    ]

    const DeletePin = () => {
        const val = { 'ChargeOffenseID': ChargeOffenseID, 'DeletedByUserFK': loginPinID, }
        AddDeleteUpadate('ChargeOffense/Delete_ChargeOffense', val).then((res) => {
            if (res) {
                const parsedData = JSON.parse(res.data);
                const message = parsedData.Table[0].Message;
                toastifySuccess(message); get_ArrestCharge_Count(DecChargeId); setDeleteStatus(false);
                get_OwnerID_Drp(DecIncID); get_Data_Owner(DecChargeId, DecIncID); onClear(); setErrors('')
            } else { console.log("Somthing Wrong"); }
        })
    }

    const columns1 = [
        {
            name: 'Offense Name', selector: (row) => row.Offense_Description, sortable: true
        },
        {
            name: 'Attempt/Complete', selector: (row) => row.AttemptComplete, sortable: true
        },
    ]

    const notebookEntryHandler = row => {
        setChangesStatus(true)
        setValue(pre => {
            return {
                ...pre, ['OffenseID']: row.CrimeID, ['ChargeOffenseID']: row?.ChargeOffenseID, ['labal']: row.Offense_Description
            }
        });
        document.getElementById('customSelectBox').style.display = 'none'
    }

    return (
        <>
            <div className='row'>


                <div className="col-3 col-md-2 col-lg-1 mt-3">
                    <label htmlFor="" className='label-name '>Offense  {errors.OwnerIDError !== 'true' ? (
                        <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.OwnerIDError}</span>
                    ) : null}
                    </label>
                </div>
                <div className="col-6 col-md-6 col-lg-4 mt-3 text-field" style={{ zIndex: '1', }} >
                    <input
                        type="text"
                        name='NoofHoles'
                        id='NoofHoles'
                        value={value.labal}
                        required
                        placeholder='Search By Offense .....'
                        autoComplete='off'
                        onChange={(e) => {
                            setValue({ ...value, labal: e.target.value })
                            const result = ownerIdDrp?.filter((item) => {
                                return (item.label.toLowerCase().includes(e.target.value.toLowerCase()))
                            })
                            setFilterData(result)
                        }}
                        onClick={() => {
                            document.getElementById('customSelectBox').style.display = 'block'
                        }}
                    />
                    <span to={''} className='offense-select' onClick={() => {
                        document.getElementById('customSelectBox').style.display = 'none';
                        setValue(pre => { return { ...pre, ['OffenseID']: '', ['ChargeOffenseID']: '', ['labal']: '' } });
                    }}>
                        {value.labal ? (
                            <span className='select-cancel'>
                                <i className='fa fa-times'></i>
                            </span>
                        ) :
                            (
                                null
                            )}
                    </span>
                    <div id='customSelectBox' className="col-12 col-md-12 col-lg-12 " style={{ display: 'none', width: '700px' }}>
                        <DataTable
                            dense
                            fixedHeader
                            fixedHeaderScrollHeight="250px"
                            customStyles={tableCustomStyles}
                            columns={columns1}
                            data={filterData}
                            onRowClicked={notebookEntryHandler}
                            selectableRowsHighlight
                            highlightOnHover
                            className='new-table'
                        />
                    </div>
                </div>
                <div className="col-1 col-md-4 col-lg-1 mt-3 mb-1">
                    <div className="col-1 col-md-4 col-lg-1 mb-1">
                        {
                            effectiveScreenPermission ?
                                effectiveScreenPermission[0]?.AddOK ?
                                    <button type="button" className="btn btn-md py-1 btn-success pl-2  text-center" onClick={() => { check_Validation_Error(); }} >Save</button>
                                    :
                                    <>
                                    </>
                                :
                                <button type="button" className="btn btn-md py-1 btn-success pl-2  text-center" onClick={() => { check_Validation_Error(); }} >Save</button>
                        }
                    </div>
                </div>
            </div>
            <div className="col-12" >
                <div className="new-offensetable" >
                    {
                        <DataTable
                            data={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? ownerData : [] : ownerData}
                            noDataComponent={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
                            columns={columns}
                            dense
                            pagination
                            className='new-offensetable'
                            selectableRowsHighlight
                            highlightOnHover
                            fixedHeader
                            persistTableHead={true}
                            customStyles={tableCustomStyles}
                        />
                    }
                </div>
            </div>
            {
                deleteStatus ?
                    <DeletePopUpModal func={DeletePin} />
                    : ''
            }
            <ChangesModal func={check_Validation_Error} setToReset={onClear} />

        </>
    )
}

export default Offense
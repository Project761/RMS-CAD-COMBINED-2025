import { useContext, useEffect, useRef, useState } from 'react'
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';
import Select from "react-select";
import { getShowingDateText } from '../../../../../../Common/Utility';
import { RequiredFieldIncident } from '../../../../../Utility/Personnel/Validation';
import { AddDeleteUpadate, fetchPostData } from '../../../../../../hooks/Api';
import { toastifySuccess } from '../../../../../../Common/AlertMsg';
import DeletePopUpModal from '../../../../../../Common/DeleteModal';
import { Comman_changeArrayFormat } from '../../../../../../Common/ChangeArrayFormat';
import { AgencyContext } from '../../../../../../../Context/Agency/Index';

const OffenderTabsCom = (props) => {

    const { get_NameOffender_Count } = useContext(AgencyContext);

    const { showPage, nameID, incidentID, LoginPinID, getUrl, col1, col2, col3, addUrl, dropDownUrl, col4, delUrl, col5, col8, col9, col10, col11, } = props

    const SelectedValue = useRef();
    const [dropDownData, setDropDownData] = useState();
    const [listData, setListData] = useState();
    const [listDataId, setListDataId] = useState();

    const [value, setValue] = useState({
        [col1]: '',
        [col2]: '',
        [col3]: '',
        'NameID': nameID,
        'CreatedByUserFK': LoginPinID,
    })

    useEffect(() => {
        setValue({ ...value, 'NameID': nameID, 'CreatedByUserFK': LoginPinID, })
    }, [nameID]);

    const [errors, setErrors] = useState({
        'DropError': '',
    })

    const check_Validation_Error = (e) => {
        if (RequiredFieldIncident(value[col3])) {
            setErrors(prevValues => { return { ...prevValues, ['DropError']: RequiredFieldIncident(value[col3]) } })
        }
    }

    const { DropError } = errors

    useEffect(() => {
        if (DropError === 'true') {
            Insert_Data();
        }
    }, [DropError])

    useEffect(() => {
        if (nameID && incidentID) {
            get_DropDown(nameID, incidentID);
        }
        get_List_Data(nameID);
    }, [nameID, incidentID])

    const get_List_Data = (nameID) => {
        const val = {
            'NameID': nameID,
        }
        fetchPostData(getUrl, val).then((res) => {
            if (res) {
                setListData(res)
            } else {
                setListData([]);
            }
        })
    }

    const get_DropDown = (nameID, incidentID) => {
        const val = {
            'NameID': nameID,
            'IncidentId': incidentID,
        }
        fetchPostData(dropDownUrl, val).then((res) => {
            if (res) {
                setDropDownData(Comman_changeArrayFormat(res, [col1], [col2]))
            } else {
                setDropDownData([]);
            }
        })
    }

    const Insert_Data = () => {
        AddDeleteUpadate(addUrl, value).then((res) => {
            toastifySuccess(res.Message);
            get_DropDown(nameID, incidentID);
            get_List_Data(nameID);
            get_NameOffender_Count(nameID)
            onClear();
            setErrors({
                ...errors,
                ['DropError']: '',
            })
        })
    }

    const Delete_Data = () => {
        const val = {
            [col4]: listDataId,
            'DeletedByUserFK': LoginPinID,
        }
        AddDeleteUpadate(delUrl, val).then((res) => {
            if (res) {
                toastifySuccess(res.Message)
                get_DropDown(nameID, incidentID);
                get_List_Data(nameID);
                get_NameOffender_Count(nameID)
                setErrors({
                    ...errors,
                    ['DropError']: '',
                })
            } else console.log("Somthing Wrong");
        })
    }

    const onClear = () => {
        SelectedValue?.current?.clearValue();
    };

    const columns = [
        {
            name: 'Description',
            selector: (row) => row[col5],
            sortable: true
        },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: 8, left: '15px' }}>Delete</p>,
            cell: row =>

                <Link to={`#`} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" onClick={() => { setListDataId(row[col4]) }} data-toggle="modal" data-target="#DeleteModal">
                    <i className="fa fa-trash"></i>
                </Link>


        }
    ]

    const Propertycolumns = [
        {
            name: 'Property Number',
            selector: (row) => row[col8],
            sortable: true
        },
        {
            name: 'Reported Date/Time',
            selector: (row) => getShowingDateText(row.col7),
            sortable: true
        },
        {
            name: 'PropertyReason',
            selector: (row) => row[col9],
            sortable: true
        },
        {
            name: 'PropertyType',
            selector: (row) => row[col10],
            sortable: true
        },
        {
            name: 'PropertyValue',
            selector: (row) => row[col11],
            sortable: true
        },
        {
            name: <p className='text-end' style={{ position: 'absolute', top: 8, left: '15px' }}>Action</p>,
            cell: row =>


                <Link to={`#`} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" onClick={() => { setListDataId(row[col4]) }} data-toggle="modal" data-target="#DeleteModal">
                    <i className="fa fa-trash"></i>
                </Link>


        }
    ]

    const colourStyles = {
        control: (styles) => ({
            ...styles, backgroundColor: "#fce9bf",
            height: 20,
            minHeight: 30,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),
    };

    const ChangeDropDown = (e, name) => {
        if (e) {
            setValue({
                ...value,
                [name]: e.value
            })
        } else {
            setValue({
                ...value,
                [name]: null
            })
        }
    }

    return (
        <>
            <div className="col-12 " id='display-not-form'>
                <div className="col-12 col-md-12 mt-2 pt-1 p-0" >
                    <div className="bg-line  py-1 px-2 d-flex justify-content-between align-items-center">
                        <p className="p-0 m-0">{showPage.charAt(0).toUpperCase() + showPage.slice(1)}</p>
                    </div>
                </div>
                <div className="row">
                    <div className="col-6 col-md-6 col-lg-4 mt-2">
                        <div className='dropdown__box'>
                            <Select
                                name={[col3]}
                                styles={colourStyles}
                                isClearable
                                options={dropDownData}
                                onChange={(e) => { ChangeDropDown(e, [col3]); }}
                                placeholder="Select.."
                                ref={SelectedValue}
                            />
                            <label htmlFor="">{showPage.charAt(0).toUpperCase() + showPage.slice(1)}</label>
                            {errors.DropError !== 'true' ? (
                                <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.DropError}</span>
                            ) : null}
                        </div>
                    </div>
                    <div className="col-2 col-md-6 col-lg-8    pl-3" style={{ marginTop: '22px' }}>
                        <Link to=''>
                            <button type="button" className="btn btn-md py-1 btn-success pl-2  text-center" onClick={() => { check_Validation_Error(); }}>Save</button>
                        </Link>
                    </div>
                </div>
            </div>
            <div className="col-12">
                <DataTable
                    columns={showPage === 'Property' ? Propertycolumns : columns}
                    data={listData}
                    dense
                    pagination
                    paginationPerPage={'5'}
                    paginationRowsPerPageOptions={[5]}
                    selectableRowsHighlight
                    highlightOnHover
                    noDataComponent={"There are no data to display"}
                />
            </div>

            <DeletePopUpModal func={Delete_Data} />

        </>
    )
}

export default OffenderTabsCom
import { useContext, useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { getShowingDateText, tableCustomStyles } from '../../../Common/Utility'
import { useSelector } from 'react-redux'
import { AddDeleteUpadate, fetchPostData } from '../../../hooks/Api'
import useObjState from '../../../../CADHook/useObjState'
import { isEmptyObject } from '../../../../CADUtils/functions/common'
import { useDispatch } from 'react-redux'
import { get_ScreenPermissions_Data } from '../../../../redux/actions/IncidentAction'
import ChangesModal from '../../../Common/ChangesModal'
import { AgencyContext } from '../../../../Context/Agency/Index'

const Comments = ({ DecdocumentID, DecIncID }) => {

    const dispatch = useDispatch();
    const { setChangesStatus, changesStatus } = useContext(AgencyContext);
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);
    const [commentListData, setCommentListData] = useState([]);
    const [loginPinID, setLoginPinID,] = useState('');
    const [loginAgencyID, setLoginAgencyID] = useState('');
    const [clickedRow, setClickedRow] = useState({});
    const [
        commentState,
        setCommentState,
        handleCommentState,
        clearCommentState,
    ] = useObjState({
        comment: "",
    })

    useEffect(() => {
        if (localStoreData) {
            setLoginPinID(localStoreData?.PINID);
            setLoginAgencyID(localStoreData?.AgencyID);
            dispatch(get_ScreenPermissions_Data("D130", localStoreData?.AgencyID, localStoreData?.PINID));
        }
    }, [localStoreData]);

    // permissions
    const [permissionForAdd, setPermissionForAdd] = useState(false);
    const [permissionForEdit, setPermissionForEdit] = useState(false);
    // Add Update Permission
    const [addUpdatePermission, setaddUpdatePermission] = useState();

    useEffect(() => {
        if (effectiveScreenPermission?.length > 0) {
            setPermissionForAdd(effectiveScreenPermission[0]?.AddOK);
            setPermissionForEdit(effectiveScreenPermission[0]?.Changeok);
            // for change tab when not having  add and update permission
            setaddUpdatePermission(effectiveScreenPermission[0]?.AddOK != 1 || effectiveScreenPermission[0]?.Changeok != 1 ? true : false);
        } else {
            setaddUpdatePermission(false);
        }
    }, [effectiveScreenPermission]);

    useEffect(() => {
        if (DecdocumentID) {
            get_DocumentComment(DecdocumentID);
        }
    }, [DecdocumentID]);

    const get_DocumentComment = (DecdocumentID) => {
        const val = { 'DocumentID': DecdocumentID }
        fetchPostData('/IncidentDocumentManagement/Get_IncidentDocManagementComment', val).then((res) => {
            if (res?.length > 0) {
                console.log(res)
                setCommentListData(res)
            } else {
                setCommentListData([]);
            }
        })
    }

    const set_Edit_Value = (row) => {
        setClickedRow(row);
        setCommentState(prevState => ({
            ...prevState,
            comment: row?.DocumentNotes || ""
        }));
    }

    const columns = [
        {
            width: '185px',
            name: 'Comment Date & Time',
            selector: (row) => row.CommentDateTime ? getShowingDateText(row.CommentDateTime) : " ",
            sortable: true
        },
        {
            width: '200px',
            name: 'Added By',
            selector: (row) => row.OperatorName,
            sortable: true
        },
        {
            name: 'Comments',
            selector: (row) => row.DocumentNotes,
            sortable: false,
            cell: row => (
                <div style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                    {row.DocumentNotes}
                </div>
            ),
        },
    ]

    async function handleSave() {
        const payload = {
            DocumentID: DecdocumentID,
            IncidentId: DecIncID,
            AgencyID: loginAgencyID,
            CreatedByUserFK: loginPinID,
            DocumentNotes: commentState?.comment
        };
        try {
            const res = await AddDeleteUpadate('/IncidentDocumentManagement/Insert_IncidentDocManagementComment', payload);
            if (res.success) {
                const parsedData = JSON.parse(res.data);
                console.log("parsedData", parsedData)
                get_DocumentComment(DecdocumentID);
                clearCommentState()
                setChangesStatus(false);
            }
        } catch (error) {
        }
    }

    const conditionalRowStyles = [
        {
            when: row => row === clickedRow, style: { backgroundColor: '#001f3fbd', color: 'white', cursor: 'pointer', },
        },
    ];



    return (
        <>
            <div className="col-12 px-0 mt-3">
                <div className="row">
                    <div className="col-1 offset-1 d-flex justify-content-end">
                        <label className="label-name d-flex justify-content-end mr-1  mt-2 text-nowrap">Comment</label>
                    </div>
                    <div className="col-9">
                        <textarea
                            name="comment"
                            placeholder="Enter Comment"
                            rows='4'
                            value={commentState?.comment}
                            onChange={(e) => {
                                !addUpdatePermission && setChangesStatus(true);
                                handleCommentState("comment", e?.target.value);
                                e.target.style.height = "auto";
                                const maxHeight = 3 * parseFloat(getComputedStyle(e.target).lineHeight);
                                e.target.style.height = `${Math.min(e.target.scrollHeight, maxHeight)}px`;
                            }}
                            className="form-control py-1 new-input"
                            style={{ height: '60px' }}
                            disabled={!isEmptyObject(clickedRow)}
                        />
                    </div>
                </div>
                <div className="btn-box text-right mr-1 mb-2 mt-2">
                    <button
                        type="button"
                        className="btn btn-sm btn-success mr-1 "
                        onClick={() => {
                            clearCommentState();
                            setClickedRow({});
                            setChangesStatus(false);
                        }}
                    >
                        Clear
                    </button>
                    {
                        effectiveScreenPermission ? effectiveScreenPermission[0]?.AddOK ?
                            <button
                                type="button"
                                onClick={() => handleSave()}
                                className="btn btn-sm btn-success mr-1"
                                disabled={!commentState?.comment}
                            >
                                Save
                            </button>
                            :
                            <></>
                            :
                            <button
                                type="button"
                                onClick={() => handleSave()}
                                className="btn btn-sm btn-success mr-1"
                                disabled={!commentState?.comment}
                            >
                                Save
                            </button>
                    }
                    {/* <button
                    type="button"
                    onClick={() => handleSave()}
                    className="btn btn-sm btn-success mr-1"
                    disabled={!commentState?.comment}
                >
                    Save
                </button> */}
                </div>
                <DataTable
                    dense
                    columns={columns}
                    // data={commentListData}
                    data={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? commentListData : '' : ''}
                    onRowClicked={(row) => { set_Edit_Value(row); }}
                    noDataComponent={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
                    selectableRowsHighlight
                    highlightOnHover
                    customStyles={tableCustomStyles}
                    pagination
                    paginationPerPage={'100'}
                    paginationRowsPerPageOptions={[100, 150, 200, 500]}
                    showPaginationBottom={100}
                    fixedHeader
                    persistTableHead={true}
                    fixedHeaderScrollHeight='450px'
                    conditionalRowStyles={conditionalRowStyles}
                />
            </div>
            <ChangesModal  func={handleSave} setToReset={clearCommentState} />
        </>
    )
}

export default Comments
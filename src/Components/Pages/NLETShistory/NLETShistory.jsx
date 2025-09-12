import React, { useEffect } from 'react'
import Tab from '../../Utility/Tab/Tab'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { get_LocalStoreData } from '../../../redux/actions/Agency'
import { get_ScreenPermissions_Data } from '../../../redux/actions/IncidentAction'
import { Decrypt_Id_Name } from '../../Common/Utility'

const NLETShistory = () => {

    const dispatch = useDispatch();
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const effectiveScreenPermission = useSelector((state) => state.Incident.effectiveScreenPermission);

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        if (localStoreData) {
            dispatch(get_ScreenPermissions_Data("C150", localStoreData?.AgencyID, localStoreData?.PINID));
        }
    }, [localStoreData]);


    return (
        <div>
            <div className="section-body view_page_design  p-1 bt">
                <div className="col-12 inc__tabs">
                    <Tab />
                    {/* <p>NLETS history</p> */}
                </div>

                {/* <div className="col-12 col-sm-12">
                    <div className="card Agency incident-card mt-2 ">
                        <DataTable
                            dense
                            columns={columns}
                            data={logData}
                            // data={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? logData : [] : logData}
                            // noDataComponent={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
                            selectableRowsHighlight
                            highlightOnHover
                            customStyles={tableCustomStyles}
                            persistTableHead={true}
                            pagination
                            paginationPerPage={'100'}
                            paginationRowsPerPageOptions={[100, 150, 200, 500]}
                            showPaginationBottom={100}
                            fixedHeader
                            fixedHeaderScrollHeight='450px'
                        />
                    </div>
                    <ChangesModal />
                </div> */}
            </div >
        </div>
    )
}

export default NLETShistory

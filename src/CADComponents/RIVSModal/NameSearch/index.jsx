import React, { memo, useEffect, useState } from 'react'
import DataTable from 'react-data-table-component';
import { getShowingDateText } from '../../../Components/Common/Utility';
import CallTakerServices from '../../../CADServices/APIs/callTaker';
import { compareStrings } from '../../../CADUtils/functions/common';
import { useSelector } from 'react-redux';

const NameSearch = ({ isOpenSearchNameModel, setIsOpenSearchNameModel, rIVSState, setRIVSState }) => {
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const [nameList, setNameList] = useState([])
    const [loginAgencyID, setLoginAgencyID] = useState('');

    useEffect(() => {
        if (localStoreData) {
            setLoginAgencyID(localStoreData?.AgencyID);

        }
    }, [localStoreData]);

    // const nameCallTaker = { FirstName: "", LastName: "", NameReasonCodeID: "" }


    // nameCallTaker.NameReasonCodeID.forEach((id, index) => {
    //     formData.append(`NameReasonCodeID[${index}]`, id);
    // });
    // const searchMasterNameKey = `/CAD/CallTakerMasterName/Search_MasterName`;
    // const { data: nameList1, isSuccess: isFetchNameData } =
    //     useQuery(
    //         [searchMasterNameKey, { nameCallTaker }],
    //         CallTakerServices.searchName,
    //         {
    //             refetchOnWindowFocus: false,
    //             enabled: !!isOpenSearchNameModel
    //         }
    //     );




    // callAPI()
    useEffect(() => {
        const callAPI = async () => {
            const res = await CallTakerServices.searchName(
                {
                    FirstName: rIVSState?.FirstName,
                    LastName: rIVSState?.LastName,
                    MiddleName: rIVSState?.MiddleName,
                    AgencyID: loginAgencyID
                }
            );
            if (res?.data?.Data?.length === 0) {
                return;
            } else {
                try {
                    const parsedData = JSON.parse(res?.data?.data);
                    const data = parsedData?.Table;
                    setNameList(data);
                } catch (error) {
                    console.error("Error parsing name:", error);
                }
            }
        }
        if (loginAgencyID) {
            callAPI();
        }
    }, [isOpenSearchNameModel, rIVSState, loginAgencyID]);


    const setEditValue = (row) => {
        setRIVSState({
            FirstName: row?.FirstName,
            LastName: row?.LastName,
            MiddleName: row?.MiddleName,
            MasterNameID: row?.MasterNameID,
        });
        setIsOpenSearchNameModel(false)
    }

    const columns = [
        {
            name: <p className='text-end' style={{ position: 'absolute', top: '7px' }}>Action</p>,
            cell: row => <>
                {
                    <span
                        onClick={() => setEditValue(row)}
                        className="btn btn-sm bg-green text-white px-1 py-0 mr-1">
                        <i className="fa fa-edit"></i>
                    </span>
                }
            </>
        },
        {
            name: 'MNI',
            selector: (row) => <>{row?.MNI} </>,
            sortable: true,
            sortFunction: (rowA, rowB) => compareStrings(rowA.MNI, rowB.MNI),
        },
        {
            name: 'Last Name',
            selector: (row) => <>{row?.LastName ? row?.LastName.substring(0, 10) : ''}{row?.LastName?.length > 20 ? '  . . .' : null} </>,
            sortable: true
        },
        {
            name: 'First Name',
            selector: (row) => <>{row?.FirstName ? row?.FirstName.substring(0, 10) : ''}{row?.FirstName?.length > 20 ? '  . . .' : null} </>,
            sortable: true
        },
        {
            name: 'Middle Name',
            selector: (row) => <>{row?.MiddleName ? row?.MiddleName.substring(0, 10) : ''}{row?.MiddleName?.length > 20 ? '  . . .' : null} </>,
            sortable: true
        },
        {
            name: 'Age',
            selector: (row) => <>{row?.Age ? row?.Age.substring(0, 10) : ''}{row?.Age?.length > 20 ? '  . . .' : null} </>,
            sortable: true
        },
        {
            name: 'Address',
            selector: (row) => <>{row?.Address ? row?.Address.substring(0, 10) : ''}{row?.Address?.length > 20 ? '  . . .' : null} </>,
            sortable: true
        },
        {
            name: 'DOB',
            selector: (row) => row.dob ? getShowingDateText(row.dob) : '',
            sortable: true
        },
        {
            name: 'Gender',
            selector: (row) => <>{row?.gender ? row?.gender.substring(0, 10) : ''}{row?.gender?.length > 20 ? '  . . .' : null} </>,
            sortable: true
        },
        {
            name: 'Race',
            selector: (row) => <>{row?.RaceID ? row?.RaceID : ''}</>,
            sortable: true
        },
        {
            name: 'SSN',
            selector: (row) => <>{row?.SSN ? row?.SSN.substring(0, 10) : ''}{row?.SSN?.length > 20 ? '  . . .' : null} </>,
            sortable: true
        },
    ]

    return (
        <>
            {
                isOpenSearchNameModel &&
                <dialog
                    className="modal fade"
                    style={{ background: "rgba(0,0,0, 0.5)", zIndex: "300" }}
                    id="NameRIVSSearchModal"
                    tabIndex="-1"
                    aria-hidden="true"
                    data-backdrop="false"
                >
                    <div className="modal-dialog modal-dialog-centered modal-xl">
                        <div className="modal-content">
                            <div className="modal-header px-3 p-2">
                                <h5 className="modal-title">Name List</h5>
                                <button type="button" onClick={() => { setIsOpenSearchNameModel(false); }} className="close btn-modal" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true" style={{ color: 'red', fontSize: '20px', }}>&times;</span>
                                </button>
                            </div>
                            <div className="box text-center px-2">
                                <div className="col-12 ">
                                    <DataTable
                                        dense
                                        columns={columns}
                                        data={nameList}
                                        pagination
                                        fixedHeader
                                        persistTableHead={true}
                                        selectableRowsHighlight
                                        highlightOnHover
                                        fixedHeaderScrollHeight="350px"
                                        paginationComponentOptions={{
                                            noRowsPerPage: false,
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </dialog>
            }
        </>
    )
}

export default memo(NameSearch)
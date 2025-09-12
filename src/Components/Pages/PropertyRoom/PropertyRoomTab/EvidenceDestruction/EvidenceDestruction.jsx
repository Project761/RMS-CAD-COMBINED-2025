import React, { useEffect, useRef, useState } from 'react'
import DataTable from 'react-data-table-component'
import { Decrypt_Id_Name, getShowingDateText, tableCustomStyles } from '../../../../Common/Utility'
import EvidenceDestructionModel from './EvidenceDestructionModel'
import { AddDeleteUpadate, fetchPostData } from '../../../../hooks/Api'
import DeletePopUpModal from '../../../../Common/DeleteModal'
import { toastifySuccess } from '../../../../Common/AlertMsg'
import { get_LocalStoreData } from '../../../../../redux/actions/Agency'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useReactToPrint } from 'react-to-print'
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Loader } from 'semantic-ui-react'


const EvidenceDestruction = (props) => {


    const { DecProRomId, DecPropID, DecMPropID } = props
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';

    const [PropertyRoomID, setPropertyRoomID] = useState('');
    const [evidenceDesData, setEvidenceDesData] = useState([])
    const [evidenceDestructionID, setEevidenceDestructionID] = useState('')
    const [clickedRow, setClickedRow] = useState(null);
    const [status, setStatus] = useState(false);
    const [loginPinID, setLoginPinID,] = useState('');
    const [editval, setEditval] = useState([]);
    const [generate, setgenerate] = useState(false);
    const [isLoading, setIsLoading] = useState(false)

    const targetRef = useRef();
    useEffect(() => {
        if (DecProRomId) {
            setPropertyRoomID(DecProRomId);
        }
    }, [DecProRomId]);

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        if (localStoreData) {
            setLoginPinID(localStoreData?.PINID);
            const savedSelectedRows = JSON.parse(sessionStorage.getItem('selectedRows')) || [];
            const propertyRoomID = savedSelectedRows[0].PropertyRoomID;
            setPropertyRoomID(propertyRoomID);
        }
    }, [localStoreData]);

    useEffect(() => {
        if (DecProRomId) {
            setPropertyRoomID(DecProRomId);
        }
    }, [DecProRomId]);

    useEffect(() => {
        if (PropertyRoomID) {
            get_EvidenceDestruction(PropertyRoomID)
        }
    }, [PropertyRoomID]);

    useEffect(() => {
        if (evidenceDestructionID) {
            get_EvidenceDestructionSingleData(evidenceDestructionID)
        }
    }, [evidenceDestructionID])

    const get_EvidenceDestructionSingleData = async (evidenceDestructionID) => {
        const val = { 'evidenceDestructionID': evidenceDestructionID }
        fetchPostData('EvidenceDestruction/GetSingleData_EvidenceDestruction', val)
            .then(res => {
                if (res) {
                    setEditval(res);
                    setTimeout(() => {
                        generatePDF();
                    }, [500])
                } else {
                    setEditval([]);
                }
            })
    }

    const get_EvidenceDestruction = (PropertyRoomID) => {
        console.log('hello-2')
        const val = { 'PropertyRoomID': PropertyRoomID }
        fetchPostData('EvidenceDestruction/GetData_EvidenceDestruction', val)
            .then(res => {
                if (res) {
                    setEvidenceDesData(res);
                } else {
                    setEvidenceDesData([]);
                }
            })
    }

    const columns = [
        {
            name: 'Reason For Destruction', selector: (row) => row.ReasonForDestruction, sortable: true
        },
        {
            name: 'Address Of Vicitm', selector: (row) => row.AddressOfVicitm, sortable: true
        },
        {
            name: 'Last CourtAction', selector: (row) => row.LastCourtAction, sortable: true
        },
        {
            name: 'Department Case No', selector: (row) => row.DepartmentCaseNo, sortable: true
        },
        {
            name: 'Date Of Destruction', selector: (row) => row.DateOfDestruction ? getShowingDateText(row.DateOfDestruction) : " ",
            sortable: true
        },
        {
            name: 'Date Of Receipt', selector: (row) => row.DateOfReceipt ? getShowingDateText(row.DateOfReceipt) : " ",
            sortable: true
        },

        {
            name: <p className='text-end' style={{ position: 'absolute', top: '7px', right: 20 }}>Action</p>,
            cell: row =>
                <div style={{ position: 'absolute', top: 4, right: 10 }}>
                    <span to={''} onClick={() => { setgenerate(true); setEevidenceDestructionID(row.EvidenceDestructionID) }} className="btn btn-sm bg-green  mr-2 text-white px-2 py-0"  >
                        <i className="fa fa-eye"></i>
                    </span>
                    <span to={`#`} onClick={() => setEevidenceDestructionID(row.EvidenceDestructionID)} className="btn btn-sm bg-green text-white px-1 py-0 mr-1" data-toggle="modal" data-target="#DeleteModal">
                        <i className="fa fa-trash"></i>

                    </span>
                </div>

        }
    ]

    const componentRef = useRef();


    const generatePDF = () => {
        html2canvas(targetRef.current).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4'); // A4 size in mm
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = pdfWidth;
            const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
            let heightLeft = imgHeight;
            let position = 0;
            // Add the first page
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pdfHeight;
            // Add additional pages if necessary
            while (heightLeft > 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pdfHeight;
            }

            // Convert the PDF to a Blob
            const pdfBlob = pdf.output('blob');
            const pdfUrl = URL.createObjectURL(pdfBlob);

            // Open the PDF in a new tab
            window.open(pdfUrl, '_blank');
        }).finally(() => {
            setgenerate(false);
        });

    };

    const set_Edit_Value = (row) => {
        setEevidenceDestructionID(row.EvidenceDestructionID);
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

    const DeleteevidenceDes = () => {
        const val = { 'IsActive': 0, 'EvidenceDestructionID': evidenceDestructionID, 'DeletedByUserFK': loginPinID }
        AddDeleteUpadate('EvidenceDestruction/DeleteEvidenceDestruction', val).then((res) => {
            if (res) {
                const parsedData = JSON.parse(res.data);
                const message = parsedData.Table[0].Message;
                toastifySuccess(message);
                get_EvidenceDestruction(PropertyRoomID)
            } else console.log("Somthing Wrong");
        })
    }

    return (
        <>
            <div className="col-12 mt-2">
                <fieldset>
                    <legend>Evidence Destruction
                        <div style={{ float: 'right' }} className='pl-1'>
                            <button className="btn btn-sm bg-green text-white px-1 py-0 " onClick={() => setEditval([])} data-toggle="modal" data-target="#EvidenceModal">
                                <i className="fa fa-plus"></i>
                            </button>
                        </div>
                    </legend>
                </fieldset>
            </div >
            <div className="col-12 px-0 mt-2" >
                <DataTable
                    dense
                    columns={columns}
                    data={evidenceDesData}
                    pagination
                    highlightOnHover
                    noDataComponent={"There are no data to display"}
                    onRowClicked={(row) => { setClickedRow(row); set_Edit_Value(row); }}
                    fixedHeaderScrollHeight='150px'
                    conditionalRowStyles={conditionalRowStyles}
                    fixedHeader
                    persistTableHead={true}
                    customStyles={tableCustomStyles}
                />
            </div>
            <EvidenceDestructionModel  {...{ PropertyRoomID, componentRef, DecPropID, DecMPropID, get_EvidenceDestruction, evidenceDestructionID, setEevidenceDestructionID, editval, targetRef, generate, setgenerate }} />
            <DeletePopUpModal func={DeleteevidenceDes} />
        </>
    )
}

export default EvidenceDestruction
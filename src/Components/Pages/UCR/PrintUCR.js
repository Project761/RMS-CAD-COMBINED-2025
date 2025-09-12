import { useContext, useEffect,useState } from 'react'
import { fetchPostData } from '../../hooks/Api';
import axios from 'axios';
import { AgencyContext } from '../../../Context/Agency/Index';
import { RequiredFieldIncident } from '../Utility/Personnel/Validation';
import HateCrimeIncReport from './UCR23HateCrimeReport';
import PrintUCR1 from './UCR7SexualAsaultReport';


const PrintUCR = () => {

    const [arrayBuffer, setArrayBuffer] = useState(null);
    const [baseUrl, setBaseUrl] = useState("")
    const [myFile, setMyFile] = useState()
    const [modalStatus, setModalStatus] = useState(true)
    const [reportData, setReportData] = useState([])
    const [incidentNumber, setIncidentNumber] = useState()
    const [errors, setErrors] = useState({ 'IncidentNoError': '' })

    const { reportType } = useContext(AgencyContext)

    const dataToBlob = async (imageData) => {
        return await (await fetch(imageData)).blob();
    };

    const GetReportPdfFile = async () => {
        const val = { 'Url': 'C:\\HostingSpaces\\admin\\apigoldline.com\\wwwroot\\Imagefolder\\UCR-23.pdf' };
        try {
            const res = await axios.post('https://apigoldline.com:5002/api/HateCrimeIncidentReport/PdftoBase64', val);
            if (res && res.data) {
                const src = res.data.data;
                setBaseUrl(`data:application/pdf;base64,${src}`);
            } else {
                console.log('error');
            }
        } catch (error) {
            console.error('Error fetching the report:', error);
        }
    };

    const GetReportData = () => {
        const val = { IncidentNumber: incidentNumber }
        fetchPostData('HateCrimeIncidentReport/GetData_HateCrimeIncidentReport', val).then((data) => {
            if (data) {
                setReportData(data)
                setModalStatus(false);
            } else {
                setReportData([])
            }
        })
    }

    useEffect(() => {
        if (reportType) {
            GetReportPdfFile();
        }
    }, [reportType])

    useEffect(() => {
        if (baseUrl != '') {
            (async () => {
                const blob = await dataToBlob(baseUrl);
                const file = new File([blob], new Date().valueOf() + ".pdf", { type: 'application/pdf' });
                const urlll = URL.createObjectURL(file);
                setMyFile(file)

            })();
        }
    }, [baseUrl, setBaseUrl])

    const check_Validation_Error = (e) => {
        if (RequiredFieldIncident(incidentNumber)) {
            setErrors(prevValues => { return { ...prevValues, ['IncidentNoError']: RequiredFieldIncident(incidentNumber) } })
        }
    }

    // Check All Field Format is True Then Submit 
    const { IncidentNoError } = errors

    useEffect(() => {
        if (IncidentNoError === 'true') {
            if (incidentNumber) {
                GetReportData();
            }
            handleFileChange();
        }
    }, [IncidentNoError])


    const handleFileChange = async (event) => {
        if (myFile && myFile.type === 'application/pdf') {
            const reader = new FileReader();
            reader.onload = function (e) {
                const arrayBuffer = e.target.result;
                setArrayBuffer(arrayBuffer);
            };
            reader.onerror = function (error) {
                console.error('Error reading file:', error);
            };
            reader.readAsArrayBuffer(myFile);
            setErrors({ ...errors, ['IncidentNoError']: '' });

        } else {
            console.error('Please upload a valid PDF file.');
        }
    };

    const handleChange = (e) => {
        if (e) {
            setIncidentNumber(e.target.value)
        } else {
            setIncidentNumber('')
        }
    }


    return (
        <>
            {
                modalStatus &&
                <div className="modal" id="myModal2" style={{ background: "rgba(0,0,0, 0.5)", transition: '0.5s', display: "block" }} data-backdrop="false">
                    <div className="modal-dialog">
                        <div className="modal-content" style={{ marginTop: "15rem" }}>
                            <div className="box text-center py-5">
                                <div className='flex'>
                                    <label className='pr-2'>
                                        Incident Number : {errors.IncidentNoError !== 'true' ? (
                                            <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.IncidentNoError}</p>
                                        ) : null}                                    </label>
                                    <input type="text" id="fileInput" className='requiredColor' name='IncidentNumber' value={incidentNumber} onChange={handleChange} />
                                </div>
                                <div className="btn-box mt-3">
                                    <button type="button" onClick={() => { check_Validation_Error() }} className="btn btn-sm text-white" style={{ background: "#ef233c" }} >Show</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
            {
                reportType === "ucr-7" ?
                    <PrintUCR1 arrayBuffer={arrayBuffer} modalStatus={modalStatus} reportData={reportData} /> :
                    reportType === "ucr-23" ?
                        <HateCrimeIncReport arrayBuffer={arrayBuffer} modalStatus={modalStatus} reportData={reportData} /> : ''
            }
        </>
    )
}

export default PrintUCR

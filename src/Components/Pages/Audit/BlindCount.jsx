import React, { useRef, useState } from 'react';
import Select from 'react-select';
import { customStylesWithOutColor } from '../../Common/Utility';



const BlindCount = () => {
    const [selectedFile, setSelectedFile] = useState([]);
    const [selectedFileName, setSelectedFileName] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([])


    const fileInputRef = useRef(null)
    const changeHandler = (e) => {
        const files = e.target.files
        setSelectedFile(files)
        const nameArray = []
        for (let name of files) {
            nameArray?.push(name?.name)
        }
        // setSelectedFileName(nameArray);
    };


    const handleFileChange = (e) => {
        const files = e.target.files
        if (!files || files.length === 0) return
        const newFilesArray = Array.from(files)
        setSelectedFiles((prevFiles) => [...prevFiles, ...newFilesArray])
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    const removeFile = (index) => {
        setSelectedFiles((prevFiles) => {
            const updatedFiles = [...prevFiles]
            updatedFiles.splice(index, 1)
            return updatedFiles
        })
    }
    return (
        
        <div className="audit-home mt-4 col-md-12 ">
            <h4 className="plan-audit__title mb-3">Blind Count (Counter)</h4>
            <small className="text-muted mb-3 d-block">Use a barcode scanner or type manually.</small>

            <div className="row mb-3 ">
                <div className="col-2 col-md-2 col-lg-2 mt-3">
                    <label htmlFor="" className='label-name '>Scan Of Type Property#</label>
                </div>
                <div className="col-4 col-md-4 col-lg-4 text-field mt-2" >
                    <input type="text" name='DocumentName' required autoComplete='off' />
                </div>

                <div className="col-2 col-md-2 col-lg-2 mt-3">
                    <label htmlFor="" className='label-name '>Location</label>

                </div>
                <div className="col-4 col-md-4 col-lg-4 text-field mt-2" >
                    <input type="text" name='DocumentName' required autoComplete='off' />
                </div>

                <div className="col-2 col-md-2 col-lg-2 mt-3">
                    {/* <span >  Document Permission </span> */}
                    <label htmlFor="" className='new-label '>Mode</label>
                </div>
                <div className="col-4 col-md-4 col-lg-4  mt-2" >
                    <Select
                        name='PermissionTypeID'
                        styles={customStylesWithOutColor}
                        // value={''}
                        // options={''}
                        // onChange={''}
                        placeholder="Select.."
                    />
                </div>

                <div className="col-2 col-md-2 col-lg-2 mt-3">
                    <label htmlFor="" className='new-label '>Select Current Shelf</label>

                </div>
                <div className="col-4 col-md-4 col-lg-4  mt-2" >
                    <Select
                        name='PermissionTypeID'
                        styles
                        placeholder="Select.."
                    />
                </div>

                <div className="col-2 col-md-2 col-lg-2 mt-3">
                    <label htmlFor="" className='new-label '>Attachment</label>
                </div>
                <div className="col-4 col-md-4 col-lg-4 text-field mt-2 mb-0">
                    <input type="file" className='' name='File' required />
                    <i className="fa fa-close" style={{ position: "absolute", right: "1rem", top: "7px" }} ></i>
                </div>
            </div>

            <div className="row align-items-center mb-3">
                <div className="col-12 col-md-2 mb-2 mb-md-0">
                    <div className="border p-2 text-center">
                        <small>Target (Sample Size) :</small>
                        <strong>100</strong>
                    </div>
                </div>
                <div className="col-12 col-md-2 mb-2 mb-md-0">
                    <div className="border p-2 text-center">
                        <small>Scanned so far:</small>
                        <strong>70</strong>
                    </div>
                </div>
                <div className="col-12 col-md-2 mb-2 mb-md-0">
                    <div className="border p-2 text-center">
                        <small>This shelf scans:</small>
                        <strong>30</strong>
                    </div>
                </div>
                <div className="col-12 col-md-6">
                    <div className="progress" style={{ height: '20px' }}>
                        <div
                            className="progress-bar bg-primary"
                            role="progressbar"
                            style={{ width: '60%' }}
                            aria-valuenow={60}
                            aria-valuemin={0}
                            aria-valuemax={100}
                        />
                    </div>
                </div>
            </div>
            <div className="btn-box text-right mr-1 mb-2 mt-2">
                <button type="button" className="btn btn-sm btn-success mr-1 ">Start Shelf</button>
                <button type="button" className="btn btn-sm btn-success mr-1 ">Pause Audit</button>
                <button type="button" className="btn btn-sm btn-success mr-1 ">End Shelf</button>
                <button type="button" className="btn btn-sm btn-success mr-1 ">Submit to Supervisor</button>

            </div>
            {/* <div className="d-flex gap-2 justify-content-end flex-wrap">
                <button className="btn btn-outline-primary">Start Shelf</button>
                <button className="btn btn-outline-secondary">Pause Audit</button>
                <button className="btn btn-outline-danger">End Shelf</button>
                <button className="btn btn-primary">Submit to Supervisor</button>
            </div> */}
        </div>
    );
};

export default BlindCount;

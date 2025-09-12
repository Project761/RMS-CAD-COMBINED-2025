import React, { memo, useCallback, useContext, useEffect, useRef, useState } from 'react'
import defualtImage from '../../../img/uploadImage.png';
import Select from "react-select";
import DatePicker from "react-datepicker";
import { toastifyError } from '../../Common/AlertMsg';
import Webcam from 'react-webcam';
import { saveAs } from 'file-saver';
import { filterPassedTime, getShowingDateText } from '../../Common/Utility';
import { RequiredFieldIncident } from '../Utility/Personnel/Validation';
import { AgencyContext } from '../../../Context/Agency/Index';
import { useDispatch, useSelector } from 'react-redux';
import { get_PictureType_Drp_Data, get_PictureView_Type_Drp_Data } from '../../../redux/actions/DropDownsData';
import { number } from 'prop-types';

const ImageModel = (props) => {

    const { newClicked, multiImage, entityID, primaryOfficerID, setStatesChangeStatus, pinID, setMultiImage, uploadImgFiles, setuploadImgFiles, modalStatus, setModalStatus, imageId, setImageId, imageModalStatus, setImageModalStatus, delete_Image_File, setImgData, imgData, updateImage, agencyID } = props;


    const dispatch = useDispatch();
    const pictureTypeID = useSelector((state) => state.DropDown.pictureTypeDrpData);
    const imageView = useSelector((state) => state.DropDown.pictureViewDrpData);

    const { setChangesStatus } = useContext(AgencyContext)

    const [selectedImage, setSelectedImage] = useState();
    const webcamRef = useRef(null);
    const [captureMode, setCaptureMode] = useState(false);
    const [localImgID, setLocalImgID] = useState();
    const [captureDevice, setCaptureDevice] = useState([{ value: 1, label: "Browse" }, { value: 2, label: "scan" }, { value: 3, label: "Web Cam" }]);
    const [captureDeviceID, setCaptureDeviceID] = useState(1);
    const [imageViewID, setImageViewID] = useState();
    const [pictureType, setPictureType] = useState();
    const [onActionImg, setOnActionImg] = useState();
    const [mediaList, setMediaList] = useState([]);
    const [birthDate, setBirthDate] = useState(new Date());
    const [defArr, setDefArr] = useState([]);
    const [comments, setComments] = useState('');
    const [officerId, setOfficerId] = useState();
    const [deviceID, setDeviceID] = useState();
    const [status, setstatus] = useState(false);
    const sliderRef = useRef(null);
    const scrollAmount = 300;

    // convert local or blob image to base64 string
    const convertBlobToBase64 = (blob) => new Promise((resolve, reject) => {
        const reader = new FileReader;
        reader.onerror = reject;
        reader.onload = () => {
            resolve(reader?.result);
        };
        reader.readAsDataURL(blob);
    });

    const [errors, setErrors] = useState({
        'PictureTypeError': '', 'ImageViewError': '', 'ImgDtTmError': '', 'OfficerIDError': ''
    });

    useEffect(() => {

        setImgData({
            ...imgData,
            "PictureTypeID": '',
            "ImageViewID": '',
            "ImgDtTm": '',
            "OfficerID": '',
            "Comments": '',
            "DocumentID": ''
        });

    }, [])

    useEffect(() => {
        setImgData({
            ...imgData,
            "PictureTypeID": '',
            "ImageViewID": '',
            "ImgDtTm": '',
            "OfficerID": Number(pinID),
            "Comments": '',
            "DocumentID": ''
        });
        setOfficerId(Number(pinID));

    }, [primaryOfficerID, entityID, newClicked]);

    useEffect(() => {
        if (agencyID) {
            if (pictureTypeID?.length === 0) { dispatch(get_PictureType_Drp_Data(agencyID)) }
            if (imageView?.length === 0) { dispatch(get_PictureView_Type_Drp_Data(agencyID)) }
        }
    }, [agencyID])



    useEffect(() => {
        if (pictureTypeID?.length > 0) {
            setPictureType(1)
        }
        if (imageView?.length > 0) {
            setImageViewID(3)
        }
        if (pinID) {
            setOfficerId(Number(pinID))
        }
    }, [pictureTypeID, imageView, pinID])

    // to convert base64 to blob file
    const dataToBlob = async (imageData) => {
        return await (await fetch(imageData)).blob();
    };

    // to check required fields
    const check_Validation_Error = (e) => {
        const PictureTypeErr = RequiredFieldIncident(pictureType);
        const ImageViewErr = RequiredFieldIncident(imageViewID);
        const ImgDtTmErr = RequiredFieldIncident(birthDate);
        const OfficerIDErr = officerId ? RequiredFieldIncident(officerId) : "";
        setErrors(pre => {
            return {
                ...pre,
                ['PictureTypeError']: PictureTypeErr || pre['PictureTypeError'],
                ['ImageViewError']: ImageViewErr || pre['ImageViewError'],
                ['ImgDtTmError']: ImgDtTmErr || pre['ImgDtTmError'],
                ['OfficerIDError']: OfficerIDErr || pre['OfficerIDError']
            }
        });
    }

    const { PictureTypeError, ImageViewError, ImgDtTmError, OfficerIDError } = errors

    useEffect(() => {
        if (PictureTypeError === 'true' && ImageViewError === 'true' && ImgDtTmError === 'true' && OfficerIDError === 'true') {
            if (imageId && status) {
                if (onActionImg && onActionImg?.DocumentID) {
                    const multiObjWithIdIndex = multiImage.findIndex((image) => image?.DocumentID === onActionImg?.DocumentID);
                    multiImage?.splice(multiObjWithIdIndex, 1, { 'Photo': onActionImg.Photo, 'DocumentID': onActionImg?.DocumentID, 'PictureTypeID': pictureType, 'ImageViewID': imageViewID, 'ImgDtTm': getShowingDateText(birthDate), 'OfficerID': officerId, 'Comments': comments, 'Img_doc_Path': onActionImg?.Img_doc_Path });
                    setErrors({ ...errors, 'OfficerIDError': '' })
                    reset()
                }
                updateImage();
                setErrors({ ...errors, 'OfficerIDError': '' });
                reset();
            } else {
                save_Image_File();
            }
        }
    }, [PictureTypeError, ImageViewError, ImgDtTmError, OfficerIDError]);

    // TO SAVE IMAGE FILE IN LIST
    const save_Image_File = async () => {
        try {
            if (selectedImage) {
                setChangesStatus(true); setStatesChangeStatus(true)
                if (onActionImg && !onActionImg?.DocumentID) {

                    const objWithIdIndex = uploadImgFiles?.findIndex((image) => image?.imgData?.imgID === onActionImg?.imgID);
                    uploadImgFiles?.splice(objWithIdIndex, 1, { 'file': selectedImage, 'imgData': { 'imgID': onActionImg?.imgID, 'PictureTypeID': pictureType, 'ImageViewID': imageViewID, 'ImgDtTm': getShowingDateText(birthDate), 'OfficerID': officerId, 'Comments': comments } });

                    const multiObjWithIdIndex = multiImage.findIndex((image) => image?.imgID === onActionImg?.imgID);
                    multiImage?.splice(multiObjWithIdIndex, 1, { 'Photo': onActionImg.Photo, 'imgID': onActionImg?.imgID, 'PictureTypeID': pictureType, 'ImageViewID': imageViewID, 'ImgDtTm': getShowingDateText(birthDate), 'OfficerID': officerId, 'Comments': comments, 'Img_doc_Path': onActionImg?.Img_doc_Path });

                    setErrors({ ...errors, 'OfficerIDError': '' })
                    reset()
                } else if (selectedImage && !onActionImg) {
                    setuploadImgFiles([...uploadImgFiles, { 'file': selectedImage, 'imgData': { 'imgID': new Date(birthDate).valueOf(), 'PictureTypeID': pictureType, 'ImageViewID': imageViewID, 'ImgDtTm': getShowingDateText(birthDate), 'OfficerID': officerId, 'Comments': comments } }]);

                    const base64String = await convertBlobToBase64(selectedImage);
                    const orgImgStr = base64String.split(',')[1];

                    setMultiImage([...multiImage, { 'Photo': orgImgStr, 'imgID': new Date(birthDate).valueOf(), 'PictureTypeID': pictureType, 'ImageViewID': imageViewID, 'ImgDtTm': getShowingDateText(birthDate), 'OfficerID': officerId, 'Comments': comments, 'Img_doc_Path': selectedImage?.name }]);

                    setErrors({ ...errors, 'OfficerIDError': '' })
                    reset();
                 
                }

            } else {
                toastifyError("Error: Please select A File!");
            }
        } catch (error) {
            console.log(error);
        }
    }

    // TO SELECT IMAGE FILE
    const select_Image_File = async (e) => {
        try {
            let currentFileType = e.target.files[0].type;
            let checkPng = currentFileType?.indexOf("png");
            let checkJpeg = currentFileType?.indexOf("jpeg");
            let checkJpg = currentFileType?.indexOf("jpg");
            if (checkPng !== -1 || checkJpeg !== -1 || checkJpg !== -1) {
                setSelectedImage(e.target.files[0]);
                setImageId('');
                setOnActionImg('');
                setstatus(false);
                setBirthDate(new Date());
            } else {
                toastifyError("Error: Invalid image file!");
            }
        } catch (error) {
            console.log(error);
        }
    }

    // FUNCTION TO REMOVE IMAGE FROM LIST
    const removeFile = () => {
        if (localImgID) {
            if (!imageId && !onActionImg?.DocumentID) {
                const newListSelected = multiImage?.filter((image) => image?.imgID !== localImgID);
                if (uploadImgFiles) {
                    const newListUploaded = uploadImgFiles?.filter((image) => image?.imgData?.imgID !== localImgID);
                    setuploadImgFiles(newListUploaded);
                }
                setMultiImage(newListSelected);
                reset();
            }
        } else if (imageId) {
            setModalStatus(true);
        } else {
            toastifyError("Error: Invalid Image ID!");
        }
    }

    // function to get attached camera list
    const getMediaList = async () => {
        await navigator.mediaDevices?.getUserMedia({ video: true });
        let devices = await navigator.mediaDevices?.enumerateDevices();
        devices = devices?.filter((device) => device.kind == "videoinput");
        if (devices?.length > 0) {
            const normalObjectArray = devices?.map(deviceInfo => {
                return {
                    deviceId: deviceInfo.deviceId,
                    kind: deviceInfo.kind,
                    label: deviceInfo.label,
                    groupId: deviceInfo.groupId
                };
            });
            setMediaList(normalObjectArray)
            if (devices?.length === 1) {
                devices?.filter((obj) => setDeviceID(obj.deviceId))
                setCaptureMode(true);
            }
        }
    }

    const ChangeImgDropDown = (e, name) => {
        if (e) {
            const commentValue = name === "Comments" ? e.target.value?.trim() : e.value;

            setImgData({
                ...imgData,
                [name]: name === "ImgDtTm" ? getShowingDateText(e) : (name === "Comments" ? commentValue : e.value)
            });
            if (name === 'captureDevice') {
                setCaptureDeviceID(e.value)
                if (e.value === 3) {
                    getMediaList();
                    setSelectedImage('');
                } else {
                    setCaptureMode(false);
                    setDeviceID('');
                }
            }
            if (name === 'ImageViewID') {
                setImageViewID(e.value)
                setErrors({ ...errors, 'ImageViewError': '' });
            }
            if (name === 'mediaList') {
                setDeviceID(e.deviceId)
                setCaptureMode(true);
            }
            if (name === 'Comments') {
                if (comments) {
                    setComments(e.target.value)
                } else {
                    setComments(e.target.value?.trim())
                }
            }
            if (name === 'PictureTypeID') {
                setPictureType(e.value)
                setErrors({ ...errors, 'PictureTypeError': '' });
            }
            if (name === 'OfficerID') {


                setOfficerId(e.value)
                setErrors({ ...errors, 'OfficerIDError': '' });
            }
        } else {
            if (name === 'captureDevice') {
                setCaptureDeviceID(1)
            }
            if (name === 'ImageViewID') {
                setImageViewID(3)
            }
            if (name === 'PictureTypeID') {
                setPictureType(1)
            }
            if (name === 'OfficerID') {

                setOfficerId(Number(pinID))
            }
        }
    }
    // FUNCTION TO CAPTURE PHOTOS USING WEBCAM
    const capture = useCallback(async () => {
        if (mediaList?.length > 0) {
            setCaptureMode(false);
            setImageId('');
            setOnActionImg('');
            setBirthDate(new Date());
            const imageSrc = webcamRef?.current?.getScreenshot();
            const blob = await dataToBlob(imageSrc);
            const file = new File(
                [blob],
                new Date().valueOf() + ".png",
                { type: 'image/png' }
            );
            setSelectedImage(file);
            setCaptureDeviceID(1);
        } else {
            toastifyError("Error: Requested Device Not Found!")
        }
    }, [webcamRef, mediaList]);

    //OBJECT TO SET VIDEO SCREEN
    const videoConstraints = {
        width: 410,
        height: 250,
        facingMode: "user",
    };

    // function to set image to take action on it
    const onImageAction = async (item) => {
        setCaptureMode(false);
        setCaptureDeviceID(1);
        setDeviceID('');
        setLocalImgID(item?.imgID);
        setImageId(item?.DocumentID);
        setOnActionImg(item);
        setImageViewID(item?.ImageViewID);
        setBirthDate(item?.ImgDtTm ? item?.ImgDtTm : '');
        setPictureType(item?.PictureTypeID);
        setComments(item?.Comments);
        setOfficerId(item?.OfficerID);
        setImgData({
            ...imgData,
            "PictureTypeID": item?.PictureTypeID,
            "ImageViewID": item?.ImageViewID,
            "ImgDtTm": item?.ImgDtTm,
            "OfficerID": item?.OfficerID,
            "Comments": item?.Comments,
            "DocumentID": item?.DocumentID
        });
        if (item.Photo) {
            const imageSrc = `data:image/jpeg;base64,${item.Photo}`;
            const blob = await dataToBlob(imageSrc);
            const file = new File(
                [blob],
                new Date().valueOf() + ".png",
                { type: 'image/png' }
            )
            setSelectedImage(file);
        }
    }

    useEffect(() => {
        setMultiImage(multiImage);
        setDefArr();
    }, [defArr])

    // function to set default image
    const save_Image_Default = () => {
        Array.prototype.move = function (from, to) {
            this?.splice(to, 0, this?.splice(from, 1)[0]);
        };
        const multiIndex = multiImage?.findIndex((image) => image?.imgID === localImgID);
        const uploadIndex = uploadImgFiles?.findIndex((image) => image?.imgData?.imgID === localImgID);

        let newArr = multiImage;
        let newArrUp = uploadImgFiles;
        if (multiImage?.length > 1) {
            newArr?.move(multiIndex, 0);
        }
        if (uploadImgFiles?.length > 1) {
            newArrUp?.move(uploadIndex, 0);
        }
        setDefArr(newArr)
        setuploadImgFiles(newArrUp);
        setLocalImgID('')
    }

    // function to scan documents
    const scan = () => {
        setImageId('');
        setOnActionImg('');
        window?.scanner?.scan(displayImagesOnPage, {
            "use_asprise_dialog": true,
            "show_scanner_ui": true,
            "twain_cap_setting": {
                "ICAP_PIXELTYPE": "TWPT_RGB"
            },
            "output_settings": [{
                "type": "return-base64",
                "format": "jpg"
            }]
        });
    }

    //function to set scaned documents
    const displayImagesOnPage = async (successful, mesg, response) => {
        if (!successful) {
            return;
        }
        if (successful && mesg != null && mesg?.toLowerCase()?.indexOf('user cancel') >= 0) {
            console?.info('User cancelled');
            return;
        }
        let scannedImages = window.scanner?.getScannedImages(response, true, false);
        var scannedImage = scannedImages[0];
        const blob = await dataToBlob(scannedImage.src);
        const file = new File(
            [blob],
            new Date().valueOf() + ".png",
            { type: 'image/png' }
        );
        setSelectedImage(file);
    }

    // function to export all files
    const downloadAllImage = (data) => {
        if (data?.length > 0) {
            for (let i = 0; i < data?.length; i++) {
                if (data[i].Img_doc_Path) {
                    const exArr = data[i].Img_doc_Path?.split(".");
                    const ext = exArr[exArr?.length - 1]
                    saveAs(`data:image/jpeg;base64,${data[i]?.Photo}`, ext && ext != null ? `image.${ext}` : 'image.png')
                } else {
                    saveAs(`data:image/jpeg;base64,${data[i]?.Photo}`, 'image.png')
                }
            }
        } else {
            toastifyError("Error : No Files Available!")
        }
    }

    // to download single image
    const downloadSingleImage = (data) => {
        if (data) {
            if (data.Img_doc_Path) {
                const exArr = data.Img_doc_Path?.split(".");
                const ext = exArr[exArr?.length - 1]
                saveAs(`data:image/jpeg;base64,${data?.Photo}`, ext && ext != null ? `image.${ext}` : 'image.png')
            } else {
                saveAs(`data:image/jpeg;base64,${data?.Photo}`, 'image.png')
            }
        } else {
            toastifyError("Error : No Files Available!")
        }
    }

    // on-cancel or close modal
    const reset = () => {
        setSelectedImage('');
        setCaptureDeviceID(1);
        setOnActionImg('');
        setPictureType(1);
        setComments('');
        setLocalImgID('');
        setImageViewID(3);
        setBirthDate(new Date());
        setstatus(false);
        setDeviceID('');
        setCaptureMode(false);
        setImageId('');
        setErrors({ ...errors, 'PictureTypeError': '', 'ImageViewError': '', 'ImgDtTmError': '', 'OfficerIDError': '' })

    }

    // custuom style withoutColor
    const customStylesWithOutColor = {
        control: base => ({
            ...base,
            height: 20,
            minHeight: 33,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),
    };

    // for required field
    const colourStyles = {
        control: (styles) => ({
            ...styles, backgroundColor: "#fce9bf",
            height: 20,
            minHeight: 33,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
        }),
    };

    // for image slider
    const scrollPrevious = () => {
        sliderRef.current.scrollLeft -= scrollAmount;
    };

    const scrollNext = () => {
        sliderRef.current.scrollLeft += scrollAmount;
    };


    return (
        <>
            {imageModalStatus &&
                <div className="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="ImageModel" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="false">
                    <div className="modal-dialog modal-dialog-centered rounded modal-lg"  >
                        <div className="modal-content" >
                            <div className="modal-header">
                                {
                                    (modalStatus && imageId) &&
                                    <div className="modal" id="myModal2" style={{ background: "rgba(0,0,0, 0.5)", transition: '0.5s', display: "block" }} data-backdrop="false">
                                        <div className="modal-dialog">
                                            <div className="modal-content">
                                                <div className="box text-center py-5">
                                                    <h5 className="modal-title mt-2" id="exampleModalLabel">Do you want to Delete ?</h5>
                                                    <div className="btn-box mt-3">
                                                        <button type="button" onClick={() => { delete_Image_File(); reset(); }} className="btn btn-sm text-white" style={{ background: "#ef233c" }} >Delete</button>
                                                        <button type="button" onClick={() => { setModalStatus(false); }} className="btn btn-sm btn-secondary ml-2"> Cancel</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                }

                                <h5 className="modal-title" id="exampleModalLabel">Images</h5>
                                <button type="button " className="close btn btn-danger" aria-label="Close" onClick={() => { setImageModalStatus(false); reset(); }}><span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="col-12">
                                    <div className="row">
                                        <div className="col-4 col-md-4 col-lg-4 ">
                                            <div className="img-box pt-2" >
                                                <label className="picture" tabIndex="0">
                                                    <span className="picture__image"></span>
                                                    {captureMode ?
                                                        <Webcam
                                                            screenshotFormat="image/jpeg"
                                                            videoConstraints={{ deviceId: deviceID, videoConstraints: videoConstraints }}
                                                            audio={false}
                                                            height={"100%"}
                                                            width={"100%"}
                                                            ref={webcamRef}
                                                            mirrored={true}
                                                            onUserMediaError={(error) => console.log(error)}
                                                        />
                                                        :
                                                        <img src={selectedImage ? (URL.createObjectURL(selectedImage)) : ((onActionImg ? `data:image/jpeg;base64,${onActionImg.Photo}` : defualtImage))} style={{ height: '150px' }} alt='' />

                                                    }
                                                </label>
                                                <input type="file" name="picture__input" id="picture__input" />
                                            </div>
                                        </div>
                                        <div className="col-8 col-md-8 col-lg-8 ">
                                            <div className="row">
                                                <div className="col-5 col-md-5 col-lg-5 mt-2">
                                                    <label htmlFor="" className='label-name '>Capture Device</label>
                                                </div>
                                                <div className="col-7 col-md-7 col-lg-7  mt-1">
                                                    <Select
                                                        name='captureDevice'
                                                        placeholder="Select..."
                                                        styles={customStylesWithOutColor}
                                                        options={captureDevice}
                                                        value={captureDevice?.filter((obj) => obj.value == captureDeviceID)}
                                                        onChange={(e) => ChangeImgDropDown(e, 'captureDevice')}
                                                        isDisabled={onActionImg ? true : false}
                                                    />
                                                </div>
                                                {
                                                    captureDeviceID === 3 ?
                                                        <>
                                                            <div className="col-5 col-md-5 col-lg-5 mt-2">
                                                                <label htmlFor="" className='label-name '>Select Camera</label>
                                                            </div>
                                                            <div className="col-7 col-md-7 col-lg-7  mt-1">
                                                                <Select
                                                                    name='mediaList'
                                                                    placeholder="Select..."
                                                                    styles={customStylesWithOutColor}
                                                                    options={mediaList}
                                                                    value={mediaList?.filter((obj) => obj.deviceId === deviceID)}
                                                                    onChange={(e) => ChangeImgDropDown(e, 'mediaList')}
                                                                    getOptionValue={option => option.deviceId}
                                                                    selected={mediaList?.length === 1 ? mediaList[0].label : ""}
                                                                />
                                                            </div>
                                                        </> : <></>
                                                }
                                                <div className="col-5 col-md-5 col-lg-5 mt-2">
                                                    <label htmlFor="" className='label-name '>Picture Type {errors.PictureTypeError !== 'true' ? (
                                                        <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.PictureTypeError}</p>
                                                    ) : null}</label>
                                                </div>
                                                <div className="col-7 col-md-7 col-lg-7  mt-1">
                                                    <Select
                                                        name='PictureTypeID'
                                                        placeholder="Select..."
                                                        styles={colourStyles}
                                                        value={pictureTypeID?.filter((obj) => obj.value == pictureType)}
                                                        options={pictureTypeID}
                                                        onChange={(e) => ChangeImgDropDown(e, 'PictureTypeID')}
                                                    />
                                                </div>
                                                <div className="col-5 col-md-5 col-lg-5 mt-2">
                                                    <label htmlFor="" className='label-name '>View {errors.ImageViewError !== 'true' ? (
                                                        <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.ImageViewError}</p>
                                                    ) : null}</label>
                                                </div>
                                                <div className="col-7 col-md-7 col-lg-7  mt-1">
                                                    <Select
                                                        name='ImageViewID'
                                                        placeholder="Select..."
                                                        styles={colourStyles}
                                                        value={imageView?.filter((obj) => obj.value == imageViewID)}
                                                        options={imageView}
                                                        onChange={(e) => ChangeImgDropDown(e, 'ImageViewID')}
                                                    />
                                                </div>
                                                <div className="col-5 col-md-5 col-lg-5 mt-2">
                                                    <label htmlFor="" className='label-name '>Date/Time {errors.ImgDtTmError !== 'true' ? (
                                                        <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.ImgDtTmError}</p>
                                                    ) : null}</label>
                                                </div>
                                                <div className="col-7 col-md-7 col-lg-7  mt-1">
                                                    <DatePicker
                                                        id='DateOfBirth'
                                                        name='ImgDtTm'
                                                        dateFormat="MM/dd/yyyy HH:mm"
                                                        placeholderText={'Select...'}
                                                        peekNextMonth
                                                        showMonthDropdown
                                                        showYearDropdown
                                                        dropdownMode="select"
                                                        autoComplete='Off'
                                                        maxDate={new Date()}
                                                        selected={birthDate ? new Date(birthDate) : null}
                                                        onChange={(date) => {
                                                            setBirthDate(date);
                                                            ChangeImgDropDown(date, 'ImgDtTm');
                                                            setErrors({ ...errors, 'ImgDtTmError': '' });
                                                        }}
                                                        showTimeSelect
                                                        timeIntervals={1}
                                                        timeCaption="Time"
                                                        className='requiredColor'
                                                        filterTime={filterPassedTime}
                                                        open={false}
                                                        disabled={true}

                                                    />
                                                </div>
                                                <div className="col-5 col-md-5 col-lg-5 mt-2">
                                                    <label htmlFor="" className='label-name '>Officer {errors.OfficerIDError !== 'true' ? (
                                                        <p style={{ color: 'red', fontSize: '11px', margin: '0px', padding: '0px' }}>{errors.OfficerIDError}</p>
                                                    ) : null}</label>
                                                </div>
                                                <div className="col-7 col-md-7 col-lg-7 mt-1">
                                                    <Select
                                                        name='OfficerID'
                                                        styles={colourStyles}
                                                        value={primaryOfficerID?.length === 1 ? primaryOfficerID[0] : primaryOfficerID?.filter((obj) => obj.value === officerId)}
                                                        options={primaryOfficerID}
                                                        onChange={(e) => ChangeImgDropDown(e, 'OfficerID')}
                                                        placeholder="Select..."
                                                    />

                                                </div>
                                                <div className="col-5 col-md-5 col-lg-5 mt-2">
                                                    <label htmlFor="" className='label-name '>Comments</label>
                                                </div>
                                                <div className="col-7 col-md-7 col-lg-7  mt-1">
                                                    <textarea name='Comments' value={comments} id="Comments" cols="30" rows='2'
                                                        className="form-control" onChange={(e) => ChangeImgDropDown(e, 'Comments')} ></textarea>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 bt pt-1">
                                {captureDeviceID === 1 &&
                                    <>
                                        {
                                            status ?
                                                <button type="button" className="btn btn-primary mr-1" disabled={true} onClick={capture}>Capture</button>
                                                :
                                                <label className='mr-1'> <span className='btn btn-primary'>Capture</span>
                                                    <input type="file" size="60" value={''} isDisabled={status} onChange={(e) => { select_Image_File(e); }} />
                                                </label>
                                        }
                                    </>
                                }
                              
                                {
                                    captureDeviceID === 3 &&
                                    <button type="button" className="btn btn-primary mr-1" onClick={capture}>Capture</button>
                                }
                                {
                                    captureDeviceID === 2 &&
                                    <button type="button" className="btn btn-primary mr-1" onClick={scan}>Capture</button>
                                }
                                <button type="button" className="btn btn-primary mr-1" onClick={() => { check_Validation_Error() }} disabled={selectedImage ? false : true} >{(onActionImg || status) ? 'Update' : 'Save'}</button>
                                <button type="button" className="btn btn-primary mr-1" onClick={() => { reset() }} disabled={selectedImage ? false : true}>Cancel</button>
                               
                                <button type="button" className="btn btn-primary mr-1" onClick={(e) => { removeFile(); }} disabled={onActionImg ? false : true}>Delete</button>
                                <button type="button" className="btn btn-primary mr-1" onClick={() => { downloadSingleImage(onActionImg) }} disabled={onActionImg ? false : true}>Export</button>
                                <button type="button" className="btn btn-primary mr-1" onClick={() => { downloadAllImage(multiImage) }} disabled={multiImage?.length > 0 ? false : true}>Export All</button>
                            </div>
                            <div className="card Agency mt-2">
                                <div className="col-12">
                                    <div className="row">
                                        <div className="col-1">
                                            <button type="button" className="btn btn-primary modelimg-btn px-1 py-0" onClick={scrollPrevious}>
                                                <i className="fa fa-backward"></i>
                                            </button>
                                        </div>
                                        <div className='imagemodalcontainer' ref={sliderRef}>
                                            {multiImage?.length > 0 ? multiImage?.map((item, index) => (
                                                <div className="col-2" key={index} >
                                                    <div className="img-box pt-2" >
                                                        <label className={`model-img ${localImgID && localImgID === item?.imgID ? 'bg-primary' : (imageId && imageId === item?.DocumentID ? 'bg-primary' : "")}`} tabIndex="0">
                                                            <span className="picture__image"></span>
                                                            <img src={`data:image/jpeg;base64,${item?.Photo}`} style={{ height: '100px', width: "660px" }} alt="" onClick={() => { onImageAction(item); setstatus(true) }} />
                                                        </label>
                                                        <span style={{ textAlign: "center", fontSize: "10px" }}></span>

                                                        <input type="file" name="picture__input" id="picture__input" />
                                                    </div>
                                                </div>
                                            )) :
                                                <div style={{ height: '100px' }}>

                                                </div>
                                            }
                                        </div>
                                        <div className="col-1 text-center" style={{ marginLeft: 'auto' }}>
                                            <button type="button" className="btn btn-primary px-1 py-0  modelimg-btn" onClick={scrollNext}>
                                                <i className="fa fa-forward"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
            }
        </>
    )
}

export default memo(ImageModel)
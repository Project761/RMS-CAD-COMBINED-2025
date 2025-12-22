import React, { useEffect, useState } from 'react'
import defualtImage from '../../../../img/uploadImage.png';
import { fetchPostData } from '../../../hooks/Api';
import { getShowingDateText } from '../../../Common/Utility';

const PropertyReportRoom = (props) => {

    const { releasestatus, setReleaseStatus, reportStatus, editval, componentRef } = props

    const [multiImage, setMultiImage] = useState([]);
    const [LoginAgencyID, setLoginAgencyID] = useState('');
    const [data, setData] = useState('');
    const [propertyCategoryCode, setPropertyCategoryCode] = useState('');
    const [value, setValue] = useState('');

    useEffect(() => {
        if (LoginAgencyID) {
            getAgencyImg(LoginAgencyID);
        }
    }, [LoginAgencyID]);
    const getAgencyImg = (LoginAgencyID) => {
        const val = { 'AgencyID': LoginAgencyID }
        fetchPostData('Agency/GetDataAgencyPhoto', val).then((res) => {
            if (res) {
                let imgUrl = `data:image/png;base64,${res[0]?.Agency_Photo}`;
                setMultiImage(imgUrl);
            }
            else { console.log("errror") }
        })
    }


    console.log(editval)

    return (


        <>

            {reportStatus && (
                <div className="modal fade" id="PropertyRoomModal" tabindex="-1" style={{ background: "rgba(0,0,0, 0.5)" }} aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="false">
                    <div className="modal-dialog modal-xl rounded modal-dialog-scrollable modal-dialog-centered">
                        <div className="modal-content">
                            <button type="button" onClick={() => { setReleaseStatus(false); }} className="border-0" aria-label="Close" data-dismiss="modal" style={{ alignSelf: "end" }} ><b>X
                            </b>
                            </button>
                            <div className="modal-body ">
                                <div classNameName="col-12 col-md-12 col-lg-12 ">
                                    <fieldset >
                                        <legend className='prop-legend'>Property Released Form</legend>
                                        <div classNameName="row " >
                                            {/* <div classNameName="container mt-1">
                                     <div classNameName="row" style={{border : '1px solid #ddd'}}>
                                         <table className="table table-bordered">
                                             <tbody>
                                                 <tr>
                                                     <td >
                                                         <span classNameName='prop-td'>
                                                             Type Of Evidence
                                                         </span>
                                                         <div classNameName='row'>
                                                             <div classNameName="form-check pl-4">
                                                                 <input classNameName="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" />
                                                                 <label classNameName="form-check-label" htmlFor="flexRadioDefault1">
                                                                     CDS
                                                                 </label>
                                                             </div>
                                                             <div classNameName="form-check pl-5">
                                                                 <input classNameName="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" />
                                                                 <label classNameName="form-check-label" htmlFor="flexRadioDefault2">
                                                                     Weapons
                                                                 </label>
                                                             </div>
                                                         </div>
                                                     </td>
                                                     <td>
                                                         <span classNameName='prop-td'>
                                                             Type Of Case
                                                         </span>
                                                         <div classNameName='row'>
                                                             <div classNameName="form-check pl-4">
                                                                 <input classNameName="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault3" />
                                                                 <label classNameName="form-check-label" htmlFor="flexRadioDefault3">
                                                                     Adult
                                                                 </label>
                                                             </div>
                                                             <div classNameName="form-check pl-5">
                                                                 <input classNameName="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault4" />
                                                                 <label classNameName="form-check-label" htmlFor="flexRadioDefault4">
                                                                     Juvenile
                                                                 </label>
                                                             </div>
                                                         </div>
                                                     </td>
                                                 </tr>

                                             </tbody>

                                         </table>
                                     </div>
                                 </div> */}
                                            <div className="container" ref={componentRef}>
                                                <div className="property-room px-3">
                                                    <div className="row">
                                                        <div className="col-4 col-md-3 col-lg-2 mt-2">
                                                            <div className="img-box" >
                                                                <img src={editval.Agency_Photo} className='picture' style={{ width: '150px', height: '140px' }} />
                                                            </div>
                                                        </div>
                                                        <div className="col-8 col-md-9 col-lg-10">
                                                            <div className="row mt-3">
                                                                <div className="col-7 d-flex justify-content-center">
                                                                    <h6>Agency:</h6>
                                                                    <span>{editval.Agency_Name}</span>
                                                                </div>
                                                                <div className="col-7 d-flex justify-content-center">
                                                                    <h6>Phone:</h6>
                                                                    <span>{editval.Agency_Phone}</span>
                                                                </div>
                                                                <div className="col-7 d-flex justify-content-center">
                                                                    <h6>Fax:</h6>
                                                                    <span>{editval.Agency_Fax}</span>
                                                                </div>
                                                                <div className="col-7 d-flex justify-content-center">
                                                                    <h6>Address:</h6>
                                                                    <span>{editval.Agency_Address1}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <hr />
                                                {/* article info */}
                                                {editval.Type === 'Article' && (
                                                    <div className="property-info px-0">
                                                        <fieldset >
                                                            <legend className='prop-legend px-0'>Property Article Information</legend>
                                                            <table className="table table-bordered mt-3">
                                                                <tbody>
                                                                    <tr className="table-row">
                                                                        <td className="table-cell">
                                                                            <span className='prop-td'>Property No:</span>
                                                                            <p>{editval.PropertyNumber}</p>
                                                                        </td>
                                                                        <td className="table-cell">
                                                                            <span className='prop-td'>Incident No:</span>
                                                                            <p>{editval.IncidentNumber}</p>
                                                                        </td>
                                                                        <td className="table-cell">
                                                                            <span className='prop-td'>Reported Date:</span>
                                                                            <p>{editval.ReportedDtTm}</p>
                                                                        </td>

                                                                    </tr>
                                                                    <tr className="table-row">
                                                                        <td className="table-cell">
                                                                            <span className='prop-td '>Owner Name:</span>
                                                                            <p>{editval.OwnerDescription}</p>
                                                                        </td>
                                                                        <td className="table-cell">
                                                                            <span className='prop-td'>Loss Code:</span>
                                                                            <p>{editval.LossCode_Description}</p>
                                                                        </td>
                                                                        <td className="table-cell">
                                                                            <span className='prop-td'>Category:</span>
                                                                            <p>{editval.Category_Description}</p>
                                                                        </td>
                                                                    </tr>
                                                                    <tr className="table-row">
                                                                        <td className="table-cell">
                                                                            <span className='prop-td'>Classification:</span>
                                                                            <p>{editval.Classification_Description}</p>
                                                                        </td>
                                                                        <td className="table-cell">
                                                                            <span className='prop-td'>Top Color:</span>
                                                                            <p>{editval.TopColorArticle_Description}</p>
                                                                        </td>
                                                                        <td className="table-cell">
                                                                            <span className='prop-td'>Bottom Color:</span>
                                                                            <p>{editval.BottomColorArticle_Description}</p>
                                                                        </td>
                                                                    </tr>
                                                                    <tr className="table-row">
                                                                        <td className="table-cell">
                                                                            <span className='prop-td'>Brand:</span>
                                                                            <p>{editval.Brand}</p>
                                                                        </td>
                                                                        <td className="table-cell">
                                                                            <span className='prop-td'>Model No:</span>
                                                                            <p>{editval.BottomColorArticle_Description}</p>
                                                                        </td>
                                                                        <td className="table-cell">
                                                                            <span className='prop-td'>Serial No:</span>
                                                                            <p>{editval.BottomColorArticle_Description}</p>
                                                                        </td>
                                                                    </tr>

                                                                    <tr className="table-row">
                                                                        <td className="table-cell">
                                                                            <span className='prop-td'>Quantity:</span>
                                                                            <p>{editval.Quantity}</p>
                                                                        </td>
                                                                        <td className="table-cell">
                                                                            <span className='prop-td'>Quantity Unit:</span>
                                                                            <p>65465464</p>
                                                                        </td>
                                                                        <td className="table-cell">
                                                                            <span className='prop-td'>Misc Description:</span>
                                                                            <p>{editval.Description}</p>
                                                                        </td>
                                                                    </tr>

                                                                </tbody>
                                                            </table>

                                                        </fieldset>
                                                    </div>
                                                )}

                                                {/* boat info */}
                                                {editval.Type === 'Boat' && (
                                                    <div className="property-info px-0">
                                                        <fieldset >
                                                            <legend className='prop-legend px-0'>Property Boat Information</legend>
                                                            <table className="table table-bordered mt-3">
                                                                <tbody>
                                                                    <tr className="table-row">
                                                                        <td className="table-cell">
                                                                            <span className='prop-td'>Property No:</span>
                                                                            <p>2566545</p>
                                                                        </td>
                                                                        <td className="table-cell">
                                                                            <span className='prop-td'>Incident No:</span>
                                                                            <p>65465464</p>
                                                                        </td>
                                                                        <td className="table-cell">
                                                                            <span className='prop-td'>Reported Date:</span>
                                                                            <p>27-02646</p>
                                                                        </td>

                                                                    </tr>
                                                                    <tr className="table-row">
                                                                        <td className="table-cell">
                                                                            <span className='prop-td '>Owner Name:</span>
                                                                            <p>{ }</p>
                                                                        </td>
                                                                        <td className="table-cell">
                                                                            <span className='prop-td'>Loss Code:</span>
                                                                            <p>{ }</p>
                                                                        </td>
                                                                        <td className="table-cell">
                                                                            <span className='prop-td'>Category:</span>
                                                                            <p>{ }</p>
                                                                        </td>
                                                                    </tr>
                                                                    <tr className="table-row">
                                                                        <td className="table-cell">
                                                                            <span className='prop-td'>Classification:</span>
                                                                            <p>{ }</p>
                                                                        </td>
                                                                        <td className="table-cell">
                                                                            <span className='prop-td'>Top Color:</span>
                                                                            <p>3131466546</p>
                                                                        </td>
                                                                        <td className="table-cell">
                                                                            <span className='prop-td'>Bottom Color:</span>
                                                                            <p>65465464</p>
                                                                        </td>
                                                                    </tr>
                                                                    <tr className="table-row">
                                                                        <td className="table-cell">
                                                                            <span className='prop-td'>Registration No:</span>
                                                                            <p>3131466546</p>
                                                                        </td>
                                                                        <td className="table-cell">
                                                                            <span className='prop-td'>Reg.Expiry Year:</span>
                                                                            <p>65465464</p>
                                                                        </td>
                                                                        <td className="table-cell">
                                                                            <span className='prop-td'>Manufacture Year:</span>
                                                                            <p>27-02646</p>
                                                                        </td>
                                                                    </tr>

                                                                    <tr className="table-row">
                                                                        <td className="table-cell">
                                                                            <span className='prop-td'>Make:</span>
                                                                            <p>3131466546</p>
                                                                        </td>
                                                                        <td className="table-cell">
                                                                            <span className='prop-td'>Model:</span>
                                                                            <p>65465464</p>
                                                                        </td>
                                                                        <td className="table-cell">
                                                                            <span className='prop-td'>Material:</span>
                                                                            <p>65465464</p>
                                                                        </td>
                                                                    </tr>
                                                                    <tr className="table-row">
                                                                        <td className="table-cell">
                                                                            <span className='prop-td'>HIN:</span>
                                                                            <p>3131466546</p>
                                                                        </td>
                                                                        <td className="table-cell">
                                                                            <span className='prop-td'>VOD:</span>
                                                                            <p>65465464</p>
                                                                        </td>
                                                                        <td className="table-cell">
                                                                            <span className='prop-td'>Propulsion:</span>
                                                                            <p>65465464</p>
                                                                        </td>
                                                                        <td className="table-cell">
                                                                            <span className='prop-td'>Length:</span>
                                                                            <p>65465464</p>
                                                                        </td>
                                                                    </tr>
                                                                    <tr className="table-row">
                                                                        <td className="table-cell">
                                                                            <span className='prop-td'>Comments:</span>
                                                                            <p>3131466546</p>
                                                                        </td>
                                                                        <td className="table-cell">
                                                                            <span className='prop-td'>Misc Description:</span>
                                                                            <p>65465464</p>
                                                                        </td>
                                                                    </tr>

                                                                </tbody>
                                                            </table>

                                                        </fieldset>
                                                    </div>
                                                )}

                                                {/* security info */}
                                                {
                                                    editval.Type === 'Security' ?
                                                        <>
                                                            <div className="property-info px-0">
                                                                <fieldset >
                                                                    <legend className='prop-legend px-0'>Property Security Information</legend>
                                                                    <table className="table table-bordered mt-3">
                                                                        <tbody>
                                                                            <tr className="table-row">
                                                                                <td className="table-cell">
                                                                                    <span className='prop-td'>Property No:</span>
                                                                                    <p>2566545</p>
                                                                                </td>
                                                                                <td className="table-cell">
                                                                                    <span className='prop-td'>Incident No:</span>
                                                                                    <p>65465464</p>
                                                                                </td>
                                                                                <td className="table-cell">
                                                                                    <span className='prop-td'>Reported Date:</span>
                                                                                    <p>27-02646</p>
                                                                                </td>

                                                                            </tr>
                                                                            <tr className="table-row">
                                                                                <td className="table-cell">
                                                                                    <span className='prop-td '>Owner Name:</span>
                                                                                    <p>{ }</p>
                                                                                </td>
                                                                                <td className="table-cell">
                                                                                    <span className='prop-td'>Loss Code:</span>
                                                                                    <p>{ }</p>
                                                                                </td>
                                                                                <td className="table-cell">
                                                                                    <span className='prop-td'>Category:</span>
                                                                                    <p>{ }</p>
                                                                                </td>
                                                                            </tr>
                                                                            <tr className="table-row">
                                                                                <td className="table-cell">
                                                                                    <span className='prop-td'>Classification:</span>
                                                                                    <p>{ }</p>
                                                                                </td>
                                                                                <td className="table-cell">
                                                                                    <span className='prop-td'>Issuing Agency:</span>
                                                                                    <p>3131466546</p>
                                                                                </td>
                                                                            </tr>
                                                                            <tr className="table-row">
                                                                                <td className="table-cell">
                                                                                    <span className='prop-td'>Serial No:</span>
                                                                                    <p>3131466546</p>
                                                                                </td>
                                                                                <td className="table-cell">
                                                                                    <span className='prop-td'>Security Date:</span>
                                                                                    <p>65465464</p>
                                                                                </td>
                                                                                <td className="table-cell">
                                                                                    <span className='prop-td'>Measurement Type:</span>
                                                                                    <p>27-02646</p>
                                                                                </td>
                                                                            </tr>

                                                                            <tr className="table-row">
                                                                                <td className="table-cell">
                                                                                    <span className='prop-td'>Denomination:</span>
                                                                                    <p>3131466546</p>
                                                                                </td>
                                                                                <td className="table-cell">
                                                                                    <span className='prop-td'>Misc Description:</span>
                                                                                    <p>65465464</p>
                                                                                </td>
                                                                            </tr>

                                                                        </tbody>
                                                                    </table>

                                                                </fieldset>
                                                            </div>
                                                        </>
                                                        :
                                                        <></>
                                                }
                                                {/* drug info */}
                                                {
                                                    editval.Type === 'Drug' ?
                                                        <>
                                                            <div className="property-info px-0">
                                                                <fieldset >
                                                                    <legend className='prop-legend px-0'>Property Drug Information</legend>
                                                                    <table className="table table-bordered mt-3">
                                                                        <tbody>
                                                                            <tr className="table-row">
                                                                                <td className="table-cell">
                                                                                    <span className='prop-td'>Property No:</span>
                                                                                    <p>2566545</p>
                                                                                </td>
                                                                                <td className="table-cell">
                                                                                    <span className='prop-td'>Incident No:</span>
                                                                                    <p>65465464</p>
                                                                                </td>
                                                                                <td className="table-cell">
                                                                                    <span className='prop-td'>Reported Date:</span>
                                                                                    <p>27-02646</p>
                                                                                </td>

                                                                            </tr>
                                                                            <tr className="table-row">
                                                                                <td className="table-cell">
                                                                                    <span className='prop-td '>Owner Name:</span>
                                                                                    <p>{ }</p>
                                                                                </td>
                                                                                <td className="table-cell">
                                                                                    <span className='prop-td'>Loss Code:</span>
                                                                                    <p>{ }</p>
                                                                                </td>

                                                                            </tr>
                                                                            <tr className="table-row">
                                                                                <td className="table-cell">
                                                                                    <span className='prop-td'>Category:</span>
                                                                                    <p>{ }</p>
                                                                                </td>
                                                                                <td className="table-cell">
                                                                                    <span className='prop-td'>Classification:</span>
                                                                                    <p>{ }</p>
                                                                                </td>

                                                                            </tr>
                                                                            <tr className="table-row">

                                                                                <td className="table-cell">
                                                                                    <span className='prop-td'>Misc Description:</span>
                                                                                    <p>65465464</p>
                                                                                </td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>

                                                                </fieldset>
                                                            </div>
                                                        </>
                                                        :
                                                        <></>
                                                }
                                                {/* Other info */}
                                                {
                                                    editval.Type === 'Other' ?
                                                        <>
                                                            <div className="property-info px-0">
                                                                <fieldset >
                                                                    <legend className='prop-legend px-0'>Property Other Information</legend>
                                                                    <table className="table table-bordered mt-3">
                                                                        <tbody>
                                                                            <tr className="table-row">
                                                                                <td className="table-cell">
                                                                                    <span className='prop-td'>Property No:</span>
                                                                                    <p>2566545</p>
                                                                                </td>
                                                                                <td className="table-cell">
                                                                                    <span className='prop-td'>Incident No:</span>
                                                                                    <p>65465464</p>
                                                                                </td>
                                                                                <td className="table-cell">
                                                                                    <span className='prop-td'>Reported Date:</span>
                                                                                    <p>27-02646</p>
                                                                                </td>

                                                                            </tr>
                                                                            <tr className="table-row">
                                                                                <td className="table-cell">
                                                                                    <span className='prop-td '>Owner Name:</span>
                                                                                    <p>{ }</p>
                                                                                </td>
                                                                                <td className="table-cell">
                                                                                    <span className='prop-td'>Loss Code:</span>
                                                                                    <p>{ }</p>
                                                                                </td>

                                                                            </tr>
                                                                            <tr className="table-row">
                                                                                <td className="table-cell">
                                                                                    <span className='prop-td'>Category:</span>
                                                                                    <p>{ }</p>
                                                                                </td>
                                                                                <td className="table-cell">
                                                                                    <span className='prop-td'>Classification:</span>
                                                                                    <p>{ }</p>
                                                                                </td>

                                                                            </tr>
                                                                            <tr className="table-row">
                                                                                <td className="table-cell">
                                                                                    <span className='prop-td'>Model No:</span>
                                                                                    <p>65465464</p>
                                                                                </td>
                                                                                <td className="table-cell">
                                                                                    <span className='prop-td'>Serial No:</span>
                                                                                    <p>65465464</p>
                                                                                </td>
                                                                                <td className="table-cell">
                                                                                    <span className='prop-td'>Brand:</span>
                                                                                    <p>65465464</p>
                                                                                </td>
                                                                            </tr>
                                                                            <tr className="table-row">
                                                                                <td className="table-cell">
                                                                                    <span className='prop-td'>Quantity:</span>
                                                                                    <p>65465464</p>
                                                                                </td>
                                                                                <td className="table-cell">
                                                                                    <span className='prop-td'>Quantity Unit:</span>
                                                                                    <p>65465464</p>
                                                                                </td>
                                                                                <td className="table-cell">
                                                                                    <span className='prop-td'>Comments:</span>
                                                                                    <p>65465464</p>
                                                                                </td>
                                                                            </tr>
                                                                            <tr className="table-row">
                                                                                <td className="table-cell">
                                                                                    <span className='prop-td'>Top Color:</span>
                                                                                    <p>65465464</p>
                                                                                </td>
                                                                                <td className="table-cell">
                                                                                    <span className='prop-td'>Bottom Color:</span>
                                                                                    <p>65465464</p>
                                                                                </td>
                                                                            </tr>
                                                                            <tr className="table-row">

                                                                                <td className="table-cell">
                                                                                    <span className='prop-td'>Misc Description:</span>
                                                                                    <p>65465464</p>
                                                                                </td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>

                                                                </fieldset>
                                                            </div>
                                                        </>
                                                        :
                                                        <></>
                                                }
                                                {/* Weapon info */}
                                                {
                                                    editval.Type === 'Weapon' ?
                                                        <>
                                                            <div className="property-info px-0">
                                                                <fieldset >
                                                                    <legend className='prop-legend px-0'>Property Weapon Information</legend>
                                                                    <table className="table table-bordered mt-3">
                                                                        <tbody>
                                                                            <tr className="table-row">
                                                                                <td className="table-cell">
                                                                                    <span className='prop-td'>Property No:</span>
                                                                                    <p>2566545</p>
                                                                                </td>
                                                                                <td className="table-cell">
                                                                                    <span className='prop-td'>Incident No:</span>
                                                                                    <p>65465464</p>
                                                                                </td>
                                                                                <td className="table-cell">
                                                                                    <span className='prop-td'>Reported Date:</span>
                                                                                    <p>27-02646</p>
                                                                                </td>

                                                                            </tr>
                                                                            <tr className="table-row">
                                                                                <td className="table-cell">
                                                                                    <span className='prop-td '>Owner Name:</span>
                                                                                    <p>{ }</p>
                                                                                </td>
                                                                                <td className="table-cell">
                                                                                    <span className='prop-td'>Loss Code:</span>
                                                                                    <p>{ }</p>
                                                                                </td>

                                                                            </tr>
                                                                            <tr className="table-row">
                                                                                <td className="table-cell">
                                                                                    <span className='prop-td'>Category:</span>
                                                                                    <p>{ }</p>
                                                                                </td>
                                                                                <td className="table-cell">
                                                                                    <span className='prop-td'>Classification:</span>
                                                                                    <p>{ }</p>
                                                                                </td>

                                                                            </tr>
                                                                            <tr className="table-row">
                                                                                <td className="table-cell">
                                                                                    <span className='prop-td'>Model No:</span>
                                                                                    <p>65465464</p>
                                                                                </td>
                                                                                <td className="table-cell">
                                                                                    <span className='prop-td'>Make:</span>
                                                                                    <p>65465464</p>
                                                                                </td>
                                                                                <td className="table-cell">
                                                                                    <span className='prop-td'>Caliber:</span>
                                                                                    <p>65465464</p>
                                                                                </td>
                                                                            </tr>
                                                                            <tr className="table-row">
                                                                                <td className="table-cell">
                                                                                    <span className='prop-td'>Style:</span>
                                                                                    <p>65465464</p>
                                                                                </td>
                                                                                <td className="table-cell">
                                                                                    <span className='prop-td'>Manufacture Year:</span>
                                                                                    <p>65465464</p>
                                                                                </td>
                                                                                <td className="table-cell">
                                                                                    <span className='prop-td'>Finish:</span>
                                                                                    <p>65465464</p>
                                                                                </td>
                                                                            </tr>
                                                                            <tr className="table-row">
                                                                                <td className="table-cell">
                                                                                    <span className='prop-td'>Serial No:</span>
                                                                                    <p>65465464</p>
                                                                                </td>
                                                                                <td className="table-cell">
                                                                                    <span className='prop-td'>Barrel Length:</span>
                                                                                    <p>65465464</p>
                                                                                </td>
                                                                            </tr>
                                                                            <tr className="table-row">

                                                                                <td className="table-cell">
                                                                                    <span className='prop-td'>Misc Description:</span>
                                                                                    <p>65465464</p>
                                                                                </td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>

                                                                </fieldset>
                                                            </div>
                                                        </>
                                                        :
                                                        <></>
                                                }
                                                {/* Vehicle info */}
                                                {
                                                    editval.Type === 'Vehicle' ?
                                                        <>
                                                            <div className="property-info px-0">
                                                                <fieldset >
                                                                    <legend className='prop-legend px-0'>Property Vehicle Information</legend>
                                                                    <table className="table table-bordered mt-3">
                                                                        <tbody>
                                                                            <tr className="table-row">
                                                                                <td className="table-cell">
                                                                                    <span className='prop-td'>Property No:</span>
                                                                                    <p>2566545</p>
                                                                                </td>
                                                                                <td className="table-cell">
                                                                                    <span className='prop-td'>Incident No:</span>
                                                                                    <p>65465464</p>
                                                                                </td>
                                                                                <td className="table-cell">
                                                                                    <span className='prop-td'>Reported Date:</span>
                                                                                    <p>27-02646</p>
                                                                                </td>

                                                                            </tr>
                                                                            <tr className="table-row">
                                                                                <td className="table-cell">
                                                                                    <span className='prop-td '>Owner Name:</span>
                                                                                    <p>{ }</p>
                                                                                </td>
                                                                                <td className="table-cell">
                                                                                    <span className='prop-td'>Loss Code:</span>
                                                                                    <p>{ }</p>
                                                                                </td>

                                                                            </tr>
                                                                            <tr className="table-row">
                                                                                <td className="table-cell">
                                                                                    <span className='prop-td'>Category:</span>
                                                                                    <p>{ }</p>
                                                                                </td>
                                                                                <td className="table-cell">
                                                                                    <span className='prop-td'>Classification:</span>
                                                                                    <p>{ }</p>
                                                                                </td>

                                                                            </tr>
                                                                            <tr className="table-row">
                                                                                <td className="table-cell">
                                                                                    <span className='prop-td'>VOD:</span>
                                                                                    <p>65465464</p>
                                                                                </td>
                                                                                <td className="table-cell">
                                                                                    <span className='prop-td'>State Plate No:</span>
                                                                                    <p>65465464</p>
                                                                                </td>
                                                                                <td className="table-cell">
                                                                                    <span className='prop-td'>Manufacture Year:</span>
                                                                                    <p>65465464</p>
                                                                                </td>
                                                                            </tr>
                                                                            <tr className="table-row">
                                                                                <td className="table-cell">
                                                                                    <span className='prop-td'>Make:</span>
                                                                                    <p>65465464</p>
                                                                                </td>
                                                                                <td className="table-cell">
                                                                                    <span className='prop-td'>Model:</span>
                                                                                    <p>65465464</p>
                                                                                </td>
                                                                                <td className="table-cell">
                                                                                    <span className='prop-td'>Style:</span>
                                                                                    <p>65465464</p>
                                                                                </td>
                                                                            </tr>
                                                                            <tr className="table-row">
                                                                                <td className="table-cell">
                                                                                    <span className='prop-td'>Top Color:</span>
                                                                                    <p>65465464</p>
                                                                                </td>
                                                                                <td className="table-cell">
                                                                                    <span className='prop-td'>Bottom Color:</span>
                                                                                    <p>65465464</p>
                                                                                </td>
                                                                            </tr>
                                                                            <tr className="table-row">
                                                                                <td className="table-cell">
                                                                                    <span className='prop-td'>Plate Type:</span>
                                                                                    <p>65465464</p>
                                                                                </td>
                                                                                <td className="table-cell">
                                                                                    <span className='prop-td'>Plate Expiry Year:</span>
                                                                                    <p>65465464</p>
                                                                                </td>
                                                                            </tr>
                                                                            <tr className="table-row">

                                                                                <td className="table-cell">
                                                                                    <span className='prop-td'>Comments:</span>
                                                                                    <p>65465464</p>
                                                                                </td>
                                                                                <td className="table-cell">
                                                                                    <span className='prop-td'>Misc Description:</span>
                                                                                    <p>65465464</p>
                                                                                </td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>

                                                                </fieldset>
                                                            </div>
                                                        </>
                                                        :
                                                        <></>
                                                }
                                                <div className="release-info">
                                                    <fieldset >
                                                        <legend className='prop-legend'>Property Release Information</legend>
                                                        <table className="table table-bordered mt-3">
                                                            <tbody>
                                                                <tr className="table-row">
                                                                    <td className="table-cell">
                                                                        <span className='prop-td '>Officer Name:</span>
                                                                        <p>{editval?.Officer_Name}</p>
                                                                    </td>
                                                                    <td className="table-cell">
                                                                        <span className='prop-td'>Release Date/Time:</span>
                                                                        <p>{editval.ReleaseDate ? getShowingDateText(editval.ReleaseDate) : ''}</p>
                                                                    </td>
                                                                    <td className="table-cell">
                                                                        <span className='prop-td'>Reason:</span>
                                                                        <p>{editval?.ActivityReason_Des}</p>
                                                                    </td>
                                                                </tr>
                                                                <tr className="table-row">
                                                                    <td className="table-cell">
                                                                        <span className='prop-td '>Property Room Person:</span>
                                                                        <p>{editval?.PropertyRoomPerson_Name}</p>
                                                                    </td>
                                                                    <td className="table-cell">
                                                                        <span className='prop-td'>Name:</span>
                                                                        <p>{}</p>
                                                                    </td>
                                                                    <td className="table-cell">
                                                                        <span className='prop-td'>Address:</span>
                                                                        <p>{editval?.location}</p>
                                                                    </td>
                                                                </tr>
                                                                <tr className="table-row">
                                                                    <div className='d-flex table-cell '>
                                                                        <span className='prop-td ' >
                                                                            Release By :
                                                                        </span>
                                                                        <p style={{ width: '270px' , marginLeft: '2px' }}>
                                                                            {editval?.ReleasingOfficerName}
                                                                        </p>
                                                                        <span className='prop-td ' >
                                                                            Date:
                                                                        </span>
                                                                    </div>
                                                                </tr>
                                                                <tr className="table-row">
                                                                    <div className='d-flex table-cell '>
                                                                        <span className='prop-td ' >
                                                                            Release To :
                                                                        </span>
                                                                        <p style={{ width: '270px' , marginLeft: '2px' }}>
                                                                            {editval?.RecepientName}
                                                                        </p>
                                                                        <span className='prop-td ' >
                                                                            Date:
                                                                        </span>
                                                                    </div>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </fieldset>
                                                </div>
                                            </div>
                                        </div>
                                    </fieldset>
                                </div>
                            </div>
                        </div>
                    </div >
                </div >
            )}

        </>






    )
}

export default PropertyReportRoom
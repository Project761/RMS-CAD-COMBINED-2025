import React, { useContext, useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import Select, { components } from "react-select";
import { get_Body_Build_Drp_Data, get_ComplexionType_Drp_Data, get_Face_Color_Drp_Data, get_FacialHair_Drp_Data, get_Facial_Hair_Type_Drp_Data, get_Facial_Oddity_Drp_Data, get_Glasses_Type_Drp_Data, get_Hair_Length_Drp_Data, get_Hair_Shades_Drp_Data, get_Hair_Style_Drp_Data, get_NameDistinct_Features_Drp_Data, get_Name_Handedness_Drp_Data, get_Speach_Codes_Drp_Data, get_Teeth_Codes_Drp_Data } from '../../../../redux/actions/DropDownsData';
import { Decrypt_Id_Name } from '../../../Common/Utility';
import { AddDeleteUpadate, fetchPostData } from '../../../hooks/Api';
import { toastifySuccess } from '../../../Common/AlertMsg';
import { AgencyContext } from '../../../../Context/Agency/Index';
import MasterChangesModal from '../MasterChangeModel';
import ListModal from '../../Utility/ListManagementModel/ListModal';

const MasterAppearance = (props) => {

    const { possessionID, mstPossessionID, ownerOfID, complainNameID , loginAgencyID, loginPinID, type } = props
    const dispatch = useDispatch();
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const faceColorDrpData = useSelector((state) => state.DropDown.faceColorDrpData);
    const complexionTypeDrpData = useSelector((state) => state.DropDown.complexionTypeDrpData);
    const hairStyleDrpData = useSelector((state) => state.DropDown.hairStyleDrpData);
    const facialHairTypeDrpData = useSelector((state) => state.DropDown.facialHairTypeDrpData);
    const nameDistinctFeaturesDrpData = useSelector((state) => state.DropDown.nameDistinctFeaturesDrpData);
    const hairLengthDrpData = useSelector((state) => state.DropDown.hairLengthDrpData);
    const facialHairDrpData = useSelector((state) => state.DropDown.facialHairDrpData);
    const hairShadesDrpData = useSelector((state) => state.DropDown.hairShadesDrpData);
    const facialOddityDrpData = useSelector((state) => state.DropDown.facialOddityDrpData);
    const bodyBuildDrpData = useSelector((state) => state.DropDown.bodyBuildDrpData);
    const speachCodesDrpData = useSelector((state) => state.DropDown.speachCodesDrpData);
    const teethCodesDrpData = useSelector((state) => state.DropDown.teethCodesDrpData);
    const glassesTypeDrpData = useSelector((state) => state.DropDown.glassesTypeDrpData);
    const nameHandednessDrpData = useSelector((state) => state.DropDown.nameHandednessDrpData);
    const { setChangesStatus, changesStatus, setmasterAppeaCountStatus } = useContext(AgencyContext);
    const [openPage, setOpenPage] = useState('');


    const [value, setValue,] = useState({
        'FaceShapeID': null, 'ComplexionID': null, 'HairStyleID': null, 'HairLengthID': null, 'HairShadeID': null, 'Clothing': '', 'HandednessID': null,
        'FacialHairID1': null, 'FacialHairID2': null, 'DistinctFeatureID1': null, 'DistinctFeatureID2': null, 'FacialOddityID1': null, 'FacialOddityID2': null,
        'FacialOddityID3': null, 'BodyBuildID': null, 'SpeechID': null, 'TeethID': null, 'GlassesID': null,
        'MasterNameID': null, 'NameID': null, 'CreatedByUserFK': null, 'ModifiedByUserFK': null,
    });
    const [editval, setEditval] = useState();
    const [statesChangeStatus, setStatesChangeStatus] = useState(false);


    useEffect(() => {
        if (loginAgencyID) {
            if (faceColorDrpData?.length === 0) { dispatch(get_Face_Color_Drp_Data(loginAgencyID)) }
            if (complexionTypeDrpData?.length === 0) { dispatch(get_ComplexionType_Drp_Data(loginAgencyID)) }
            if (hairStyleDrpData?.length === 0) { dispatch(get_Hair_Style_Drp_Data(loginAgencyID)) }
            if (facialHairTypeDrpData?.length === 0) { dispatch(get_Facial_Hair_Type_Drp_Data(loginAgencyID)) }
            if (nameDistinctFeaturesDrpData?.length === 0) { dispatch(get_NameDistinct_Features_Drp_Data(loginAgencyID)) }
            if (hairLengthDrpData?.length === 0) { dispatch(get_Hair_Length_Drp_Data(loginAgencyID)) }
            if (facialHairDrpData?.length === 0) { dispatch(get_FacialHair_Drp_Data(loginAgencyID)) }
            if (hairShadesDrpData?.length === 0) { dispatch(get_Hair_Shades_Drp_Data(loginAgencyID)) }
            if (facialOddityDrpData?.length === 0) { dispatch(get_Facial_Oddity_Drp_Data(loginAgencyID)) }
            if (bodyBuildDrpData?.length === 0) { dispatch(get_Body_Build_Drp_Data(loginAgencyID)) }
            if (speachCodesDrpData?.length === 0) { dispatch(get_Speach_Codes_Drp_Data(loginAgencyID)) }
            if (teethCodesDrpData?.length === 0) { dispatch(get_Teeth_Codes_Drp_Data(loginAgencyID)) }
            if (glassesTypeDrpData?.length === 0) { dispatch(get_Glasses_Type_Drp_Data(loginAgencyID)) }
            if (nameHandednessDrpData?.length === 0) { dispatch(get_Name_Handedness_Drp_Data(loginAgencyID)) }
        }
    }, [loginAgencyID]);

    const UpdateAppearance = () => {
        const { FaceShapeID, ComplexionID, HairStyleID, HairLengthID, HairShadeID, Clothing, HandednessID,
            FacialHairID1, FacialHairID2, DistinctFeatureID1, DistinctFeatureID2, FacialOddityID1, FacialOddityID2,
            FacialOddityID3, BodyBuildID, SpeechID, TeethID, GlassesID,
            MasterNameID, NameID, CreatedByUserFK, ModifiedByUserFK, } = value
        const val = {
            'FaceShapeID': FaceShapeID, 'ComplexionID': ComplexionID, 'HairStyleID': HairStyleID, 'HairLengthID': HairLengthID, 'HairShadeID': HairShadeID,
            'Clothing': Clothing, 'HandednessID': HandednessID, 'FacialHairID1': FacialHairID1, 'FacialHairID2': FacialHairID2, 'DistinctFeatureID1': DistinctFeatureID1, 'DistinctFeatureID2': DistinctFeatureID2, 'FacialOddityID1': FacialOddityID1, 'FacialOddityID2': FacialOddityID2, 'FacialOddityID3': FacialOddityID3,
            'BodyBuildID': BodyBuildID, 'SpeechID': SpeechID, 'TeethID': TeethID, 'GlassesID': GlassesID,
            'MasterNameID': mstPossessionID, 'NameID': type === "ComplainantName" ? complainNameID : possessionID || ownerOfID, 'CreatedByUserFK': loginPinID, 'ModifiedByUserFK': loginPinID,
        }
        AddDeleteUpadate('MasterName/Update_NameApperance', val).then((res) => {
            const parsedData = JSON.parse(res.data);
            const message = parsedData.Table[0].Message;
            toastifySuccess(message); get_Single_Data(type == 'VehicleOwner' ? ownerOfID : type === "ComplainantName" ? complainNameID : possessionID, mstPossessionID); setChangesStatus(false); setStatesChangeStatus(false);
        })
    }

    const HandleChange = (e) => {
        if (e) {
            setChangesStatus(true); setStatesChangeStatus(true);
            setValue({
                ...value,
                [e.target.name]: e.target.value
            })
        } else {
            setValue({
                ...value,
                [e.target.name]: e.target.value
            })
            setStatesChangeStatus(true);
        }
    };

    

    const ChangeDropDown = (e, name) => {
        setStatesChangeStatus(true); setChangesStatus(true);
        setValue(prevValue => {
            const updatedValue = {
                ...prevValue,
                [name]: e ? e.value : null
            };
            if (name === 'FacialOddityID1') {
                updatedValue.FacialOddityID2 = null;
                updatedValue.FacialOddityID3 = null;
            }
            if (name === 'FacialOddityID2') {
                updatedValue.FacialOddityID3 = null;
            }
            if (name === 'FacialHairID1') {
                updatedValue.FacialHairID2 = null;
            }
            if (name === 'DistinctFeatureID1') {
                updatedValue.DistinctFeatureID2 = null;
            }
            return updatedValue;
        });
       
    };


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

    const customWithOutColor = {
        control: base => ({
            ...base,
            height: 20,
            minHeight: 33,
            fontSize: 14,
            margintop: 2,
            boxShadow: 0,
            width: 130,
        }),
    };

    
    const get_Single_Data = (possessionID, mstPossessionID) => {
        const val = { NameID: possessionID, MasterNameID: mstPossessionID }
      
        fetchPostData('MasterName/GetSingleData_MasterName', val)
            .then((res) => {
                if (res) { setEditval(res); }
                else { setEditval([]) }
            })
    }

    useEffect(() => {
        if (possessionID || mstPossessionID || complainNameID) {
            get_Single_Data(type == 'VehicleOwner' ? ownerOfID : type === "ComplainantName" ? complainNameID : possessionID, mstPossessionID);
        }
    }, [possessionID, mstPossessionID]);

    useEffect(() => {
        if (editval && editval.length > 0) {
            const lastEditVal = editval[editval.length - 1];
            if (editval[0].FaceShapeID || editval[0].ComplexionID || editval[0].HairStyleID || editval[0].FacialHairID1 || editval[0].FacialHairID2 || editval[0].DistinctFeatureID1 || editval[0].DistinctFeatureID2 || editval[0].HairLengthID || editval[0].HairShadeID || editval[0].FacialOddityID1
                || editval[0].FacialOddityID2 || editval[0].FacialOddityID3 || editval[0].BodyBuildID || editval[0].SpeechID || editval[0].TeethID || editval[0].GlassesID || editval[0].Clothing || editval[0].HandednessID
            ) {

                setmasterAppeaCountStatus(true)
            }
            else {
                setmasterAppeaCountStatus(false)
            }
            setValue({
                ...value,
                'MasterNameID': mstPossessionID, 'NameID': type === "ComplainantName" ? complainNameID : possessionID || ownerOfID, 'FaceShapeID': lastEditVal.FaceShapeID, 'ComplexionID': lastEditVal.ComplexionID,
                'HairStyleID': lastEditVal.HairStyleID, 'FacialHairID1': lastEditVal.FacialHairID1, 'FacialHairID2': lastEditVal.FacialHairID2, 'DistinctFeatureID1': lastEditVal.DistinctFeatureID1, 'DistinctFeatureID2': lastEditVal.DistinctFeatureID2,
                'HairLengthID': lastEditVal.HairLengthID, 'HairShadeID': lastEditVal.HairShadeID, 'FacialOddityID1': lastEditVal.FacialOddityID1, 'FacialOddityID2': lastEditVal.FacialOddityID2, 'FacialOddityID3': lastEditVal.FacialOddityID3,
                'BodyBuildID': lastEditVal.BodyBuildID, 'SpeechID': lastEditVal.SpeechID, 'TeethID': lastEditVal.TeethID, 'GlassesID': lastEditVal.GlassesID, 'Clothing': lastEditVal.Clothing, 'HandednessID': lastEditVal.HandednessID, 'CreatedByUserFK': lastEditVal.CreatedByUserFK,
                'ModifiedByUserFK': lastEditVal.CreatedByUserFK,
            });
        }
    }, [editval]);

    return (
        <div className="col-12 col-md-12 col-lg-12 pt-3">
            <fieldset>
                <legend>Appearance</legend>
                <div className="row mt-2">
                    <div className="col-2 col-md-2 col-lg-1 mt-2 pt-1">
                      
                        <span data-toggle="modal" onClick={() => {
                            setOpenPage('Facial Shape')
                        }} data-target="#ListModel" className='new-link'>
                            Face Shape
                        </span>
                    </div>
                    <div className="col-4 col-md-4 col-lg-3 mt-2 px-3" >
                        <Select
                            name="Face Shape"
                            styles={customStylesWithOutColor}
                            value={faceColorDrpData?.filter((obj) => obj.value === value?.FaceShapeID)}
                            options={faceColorDrpData}

                            isClearable
                            onChange={(e) => ChangeDropDown(e, 'FaceShapeID')}
                            placeholder="Select Face Shape"
                        />
                    </div>
                    <div className="col-2 col-md-2 col-lg-1 mt-2 pt-1">
                       
                        <span data-toggle="modal" onClick={() => {
                            setOpenPage('Complexion Type')
                        }} data-target="#ListModel" className='new-link'>
                            Complexion
                        </span>
                    </div>
                    <div className="col-4 col-md-4 col-lg-3 mt-2" >
                        <Select
                            name="Complexion"
                            styles={customStylesWithOutColor}
                            value={complexionTypeDrpData?.filter((obj) => obj.value === value?.ComplexionID)}
                            options={complexionTypeDrpData}
                            isClearable
                            onChange={(e) => ChangeDropDown(e, 'ComplexionID')}
                            placeholder="Select Complexion"
                        />
                    </div>
                    <div className="col-2 col-md-2 col-lg-1 mt-2 pt-1">
                      
                        <span data-toggle="modal" onClick={() => {
                            setOpenPage('Hair Styles')
                        }} data-target="#ListModel" className='new-link'>
                            Hair Style
                        </span>
                    </div>
                    <div className="col-4 col-md-4 col-lg-3 mt-2" >
                        <Select
                            name="HairStyle"
                            styles={customStylesWithOutColor}
                            value={hairStyleDrpData?.filter((obj) => obj.value === value?.HairStyleID)}
                            options={hairStyleDrpData}
                            isClearable
                            onChange={(e) => ChangeDropDown(e, 'HairStyleID')}
                            placeholder="Select Hair Style"
                        />
                    </div>
                    <div className="col-2 col-md-2 col-lg-1 mt-3">
                    
                        <span data-toggle="modal" onClick={() => {
                            setOpenPage('Name Facial Hair')
                        }} data-target="#ListModel" className='new-link'>
                            Facial Hair 1
                        </span>
                    </div>
                    <div className="col-4 col-md-4 col-lg-3 mt-2 px-3" >
                        <Select
                            name="FaceHair1"
                            styles={customStylesWithOutColor}
                            value={facialHairTypeDrpData?.filter((obj) => obj.value === value?.FacialHairID1)}
                            options={facialHairTypeDrpData}
                            isClearable
                            onChange={(e) => ChangeDropDown(e, 'FacialHairID1')}
                            placeholder="Select Facial Hair 1"
                        />
                    </div>
                    <div className="col-2 col-md-2 col-lg-1 mt-3 px-0">
                    
                        <span data-toggle="modal" onClick={() => {
                            setOpenPage('Name Distinct Feature Code')
                        }} data-target="#ListModel" className='new-link px-0'>
                            Dist.&nbsp;Feature&nbsp;1
                        </span>
                    </div>
                    <div className="col-4 col-md-4 col-lg-3 mt-2" >
                        <Select
                            name="DistinctFeature1"
                            styles={customStylesWithOutColor}
                            value={nameDistinctFeaturesDrpData?.filter((obj) => obj.value === value?.DistinctFeatureID1)}
                            options={nameDistinctFeaturesDrpData}
                            isClearable
                            onChange={(e) => ChangeDropDown(e, 'DistinctFeatureID1')}
                            placeholder="Select Distinct Feature 1"
                        />
                    </div>
                    <div className="col-2 col-md-2 col-lg-1 mt-3">
                     
                        <span data-toggle="modal" onClick={() => {
                            setOpenPage('Hair Length')
                        }} data-target="#ListModel" className='new-link'>
                            Hair Length
                        </span>
                    </div>
                    <div className="col-4 col-md-4 col-lg-3 mt-2" >
                        <Select
                            name="HairLength"
                            styles={customStylesWithOutColor}
                            value={hairLengthDrpData?.filter((obj) => obj.value === value?.HairLengthID)}
                            options={hairLengthDrpData}
                            isClearable
                            onChange={(e) => ChangeDropDown(e, 'HairLengthID')}
                            placeholder="Select Hair Length"
                        />
                    </div>
                    <div className="col-2 col-md-2 col-lg-1 mt-3">
                     
                        <span data-toggle="modal" onClick={() => {
                            setOpenPage('Name Facial Hair')
                        }} data-target="#ListModel" className='new-link'>
                            Facial Hair 2
                        </span>
                    </div>
                    <div className="col-4 col-md-4 col-lg-3 mt-2 px-3" >
                        <Select
                            name="FaceHair2"
                            styles={customStylesWithOutColor}
                            value={facialHairDrpData?.filter((obj) => obj.value === value?.FacialHairID2)}
                            options={facialHairDrpData}
                            isClearable
                            isDisabled={!value.FacialHairID1} // Enable only if FaceHair1 has a value
                            onChange={(e) => ChangeDropDown(e, 'FacialHairID2')}
                            placeholder="Select Facial Hair 2"
                        />
                    </div>
                    <div className="col-2 col-md-2 col-lg-1 mt-3 px-0">
                  
                        <span data-toggle="modal" onClick={() => {
                            setOpenPage('Name Distinct Feature Code')
                        }} data-target="#ListModel" className='new-link px-0'>
                            Dist.&nbsp;Feature&nbsp;2
                        </span>
                    </div>
                    <div className="col-4 col-md-4 col-lg-3 mt-2" >
                        <Select
                            name="DistinctFeature2"
                            styles={customStylesWithOutColor}
                            value={nameDistinctFeaturesDrpData?.filter((obj) => obj.value === value?.DistinctFeatureID2)}
                            options={nameDistinctFeaturesDrpData}
                            isClearable
                            isDisabled={!value.DistinctFeatureID1}
                            onChange={(e) => ChangeDropDown(e, 'DistinctFeatureID2')}
                            placeholder="Select Distinct Feature 2"
                        />
                    </div>
                    <div className="col-2 col-md-2 col-lg-1 mt-3">
                    
                        <span data-toggle="modal" onClick={() => {
                            setOpenPage('Hair Shades')
                        }} data-target="#ListModel" className='new-link'>
                            Hair Shade
                        </span>
                    </div>
                    <div className="col-4 col-md-4 col-lg-3 mt-2" >
                        <Select
                            name="HairShade"
                            styles={customStylesWithOutColor}
                            value={hairShadesDrpData?.filter((obj) => obj.value === value?.HairShadeID)}
                            options={hairShadesDrpData}
                            isClearable
                            onChange={(e) => ChangeDropDown(e, 'HairShadeID')}
                            placeholder="Select Hair Shade"
                        />
                    </div>
                    <div className="col-2 col-md-2 col-lg-1 mt-3 px-0">
                     
                        <span data-toggle="modal" onClick={() => {
                            setOpenPage('Facial Oddity')
                        }} data-target="#ListModel" className='new-link'>
                            Facial Oddity 1
                        </span>
                    </div>
                    <div className="col-4 col-md-4 col-lg-3 mt-2 px-3" >
                        <Select
                            name="FacialOddity1"
                            styles={customStylesWithOutColor}
                            value={facialOddityDrpData?.filter((obj) => obj.value === value?.FacialOddityID1)}
                            options={facialOddityDrpData}
                            isClearable
                            onChange={(e) => ChangeDropDown(e, 'FacialOddityID1')}
                            placeholder="Select Facial Oddity 1"
                        />
                    </div>
                    <div className="col-2 col-md-2 col-lg-1 mt-3 px-0">
                    
                        <span data-toggle="modal" onClick={() => {
                            setOpenPage('Body Build')
                        }} data-target="#ListModel" className='new-link'>
                            Body Build
                        </span>
                    </div>
                    <div className="col-4 col-md-4 col-lg-3 mt-2" >
                        <Select
                            name="BodyBuild"
                            styles={customStylesWithOutColor}
                            value={bodyBuildDrpData?.filter((obj) => obj.value === value?.BodyBuildID)}
                            options={bodyBuildDrpData}
                            isClearable
                            onChange={(e) => ChangeDropDown(e, 'BodyBuildID')}
                            placeholder="Select Body Build"
                        />
                    </div>
                    <div className="col-2 col-md-2 col-lg-1 mt-3">
                   
                        <span data-toggle="modal" onClick={() => {
                            setOpenPage('Speech Codes')
                        }} data-target="#ListModel" className='new-link'>
                            Speech
                        </span>
                    </div>
                    <div className="col-4 col-md-4 col-lg-3 mt-2" >
                        <Select
                            name="Speech"
                            styles={customStylesWithOutColor}
                            value={speachCodesDrpData?.filter((obj) => obj.value === value?.SpeechID)}
                            options={speachCodesDrpData}
                            isClearable
                            onChange={(e) => ChangeDropDown(e, 'SpeechID')}
                            placeholder="Select Speech"
                        />
                    </div>
                    <div className="col-2 col-md-2 col-lg-1 mt-3 px-0">
                   
                        <span data-toggle="modal" onClick={() => {
                            setOpenPage('Facial Oddity')
                        }} data-target="#ListModel" className='new-link px-0'>
                            Facial&nbsp;Oddity&nbsp;2
                        </span>
                    </div>
                    <div className="col-4 col-md-4 col-lg-3 mt-2 px-3" >
                        <Select
                            name="FacialOddity2"
                            styles={customStylesWithOutColor}
                            value={facialOddityDrpData?.filter((obj) => obj.value === value?.FacialOddityID2)}
                            options={facialOddityDrpData}
                            isClearable
                            isDisabled={!value.FacialOddityID1} // Disable if FacialOddityID1 is not selected
                            onChange={(e) => ChangeDropDown(e, 'FacialOddityID2')}
                            placeholder="Select Facial Oddity 2"
                        />
                    </div>
                    <div className="col-2 col-md-2 col-lg-1 mt-3 px-0">
                     
                        <span data-toggle="modal" onClick={() => {
                            setOpenPage('Teeth Code')
                        }} data-target="#ListModel" className='new-link'>
                            Teeth
                        </span>
                    </div>
                    <div className="col-4 col-md-4 col-lg-3 mt-2" >
                        <Select
                            name="Teeth"
                            styles={customStylesWithOutColor}
                            value={teethCodesDrpData?.filter((obj) => obj.value === value?.TeethID)}
                            options={teethCodesDrpData}
                            isClearable
                            onChange={(e) => ChangeDropDown(e, 'TeethID')}
                            placeholder="Select Teeth"
                        />
                    </div>
                    <div className="col-2 col-md-2 col-lg-1 mt-3">
                   
                        <span data-toggle="modal" onClick={() => {
                            setOpenPage('Name Glass Type')
                        }} data-target="#ListModel" className='new-link'>
                            Glasses
                        </span>

                    </div>
                    <div className="col-4 col-md-4 col-lg-3 mt-2" >
                        <Select
                            name="Glasses"
                            styles={customStylesWithOutColor}
                            value={glassesTypeDrpData?.filter((obj) => obj.value === value?.GlassesID)}
                            options={glassesTypeDrpData}
                            isClearable
                            onChange={(e) => ChangeDropDown(e, 'GlassesID')}
                            placeholder="Select Glasses"
                        />
                    </div>
                    <div className="col-2 col-md-2 col-lg-1 mt-3 px-0">
                     
                        <span data-toggle="modal" onClick={() => {
                            setOpenPage('Facial Oddity')
                        }} data-target="#ListModel" className='new-link'>
                            Facial&nbsp;Oddity&nbsp;3
                        </span>
                    </div>
                    <div className="col-4 col-md-4 col-lg-3 mt-2 px-3" >
                        <Select
                            name="FacialOddity3"
                            styles={customStylesWithOutColor}
                            value={facialOddityDrpData?.filter((obj) => obj.value === value?.FacialOddityID3)}
                            options={facialOddityDrpData}
                            isClearable
                            isDisabled={!value.FacialOddityID1 || !value.FacialOddityID2} // Disable if either FacialOddityID1 or FacialOddityID2 is not selected
                            onChange={(e) => ChangeDropDown(e, 'FacialOddityID3')}
                            placeholder="Select Facial Oddity 3"
                        />
                    </div>
                    <div className="col-2 col-md-2 col-lg-1 mt-3 px-0">
                        <label htmlFor="" className='label-name '>Clothing</label>
                    </div>
                    <div className="col-4 col-md-4 col-lg-3 mt-2 text-field" >
                        <input type="text" className=' ' name='Clothing' value={value?.Clothing} onChange={HandleChange} />
                    </div>
                    <div className="col-2 col-md-2 col-lg-1 mt-3">
                      
                        <span data-toggle="modal" onClick={() => {
                            setOpenPage('Handedness')
                        }} data-target="#ListModel" className='new-link'>
                            Handedness
                        </span>
                    </div>
                    <div className="col-4 col-md-4 col-lg-3 mt-2" >
                        <Select
                            name="Handedness"
                            styles={customStylesWithOutColor}
                            value={nameHandednessDrpData?.filter((obj) => obj.value === value?.HandednessID)}
                            options={nameHandednessDrpData}
                            isClearable
                            onChange={(e) => ChangeDropDown(e, 'HandednessID')}
                            placeholder="Select Handedness"
                        />
                    </div>

                </div>
            </fieldset>
            <div className="col-12  text-right mt-2 mb-2 p-0">
                <button type="button" className="btn btn-sm btn-success pl-2 mr-2" disabled={!statesChangeStatus} onClick={UpdateAppearance}>Update</button>
            
            </div>
            <ListModal {...{ openPage, setOpenPage }} />
            <MasterChangesModal func={UpdateAppearance} />
        </div>

    )
}

export default MasterAppearance
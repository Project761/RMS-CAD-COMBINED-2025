// import React, { useEffect, useState, memo, useContext, useRef } from 'react'
// import DataTable from 'react-data-table-component';
// import { Link } from 'react-router-dom';
// import Select from "react-select";
// import { components } from "react-select";
// import { useDispatch, useSelector } from 'react-redux';
// import SelectBox from '../../../../Common/SelectBox';
// import { AddDeleteUpadate, fetchPostData } from '../../../../hooks/Api';
// import { toastifySuccess } from '../../../../Common/AlertMsg';
// import { RequiredFieldIncident } from '../../../Utility/Personnel/Validation';
// import { ErrorStyle, ErrorTooltip, NameVictimOffenses } from '../../NameNibrsErrors';
// import { AgencyContext } from '../../../../../Context/Agency/Index';
// import { threeColVictimOffenseArray, offenseArray, } from '../../../../Common/ChangeArrayFormat';

// import { Decrypt_Id_Name } from '../../../../Common/Utility';

// const MasterOffence = (props) => {

//   const { DecNameID, DecMasterNameID, DecIncID, victimID } = props

//   const dispatch = useDispatch();
//   const localStoreData = useSelector((state) => state.Agency.localStoreData);
//   const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';

//   const MultiValue = props => (
//     <components.MultiValue {...props}>
//       <span>{props.data.label}</span>
//     </components.MultiValue>
//   );

//   const { get_NameVictim_Count, get_Name_Count, } = useContext(AgencyContext);
//   const SelectedValue = useRef();
//   const [offenseDrp, setOffenseDrp] = useState();
//   const [typeOfSecurityEditVal, setTypeOfSecurityEditVal] = useState();
//   const [loginPinID, setLoginPinID,] = useState('');
//   const [loginAgencyID, setLoginAgencyID] = useState('');
//   const [nameID, setNameID] = useState('');
//   const [incidentID, setIncidentID] = useState();
//   const [errors, setErrors] = useState({ 'DropError': '', });
//   const [multiSelected, setMultiSelected] = useState({ OffenseID: null, });

//   const [value, setValue] = useState({
//     'OffenseID': '',
//     'NameID': DecNameID,
//     'CreatedByUserFK': loginPinID,
//   })

//   useEffect(() => {
//     setValue(pre => { return { ...pre, 'CreatedByUserFK': loginPinID, 'NameID': nameID, 'VictemTypeCode': null, } });
//   }, [loginPinID])

//   useEffect(() => {
//     if (localStoreData) {
//       setLoginAgencyID(localStoreData?.AgencyID); setLoginPinID(localStoreData?.PINID);
//     }
//   }, [localStoreData]);

//   useEffect(() => {
//     if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
//       if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
//     }
//   }, []);

//   useEffect(() => {
//     if (DecNameID) {
//       setNameID(DecNameID); setIncidentID(DecIncID);
//       get_OffenseName_Data();
//     }
//   }, [DecNameID, loginPinID,]);


//   useEffect(() => {
//     if (incidentID) {
//       get_Offense_DropDown(incidentID, DecNameID);
//     }
//   }, [incidentID])

//   const get_OffenseName_Data = () => {
//     const val = { 'NameID': DecNameID, }
//     fetchPostData('NameOffense/GetData_NameOffense', val).then((res) => {
//       if (res) {
//         console.log("🚀 ~ fetchPostData ~ res:", res);
//         setTypeOfSecurityEditVal(offenseArray(res, 'NameOffenseID', 'OffenseID', 'NameID', 'NameID', 'Offense_Description', 'PretendToBeID'));
//       } else {
//         setTypeOfSecurityEditVal([]);
//       }
//     })
//   }

//   useEffect(() => {
//     if (typeOfSecurityEditVal) { setMultiSelected(prevValues => { return { ...prevValues, ['OffenseID']: typeOfSecurityEditVal } }) }
//   }, [typeOfSecurityEditVal])

//   const get_Offense_DropDown = (incidentID, nameID) => {
//     const val = {
//       'IncidentID': incidentID,
//       'NameID': nameID
//     }
//     fetchPostData('NameOffense/GetData_InsertNameOffense', val).then((data) => {
//       if (data) {
//         setOffenseDrp(threeColVictimOffenseArray(data, 'CrimeID', 'Offense_Description'))
//       } else {
//         setOffenseDrp([])
//       }
//     })
//   }

//   const ChangeDropDown = (e, name) => {
//     if (e) {
//       setValue({ ...value, [name]: e.value });
//     } else {
//       setValue({ ...value, [name]: null });
//     }
//   }

//   const offense = (multiSelected) => {
//     setMultiSelected({
//       ...multiSelected,
//       OffenseID: multiSelected
//     })
//     const len = multiSelected.length - 1
//     if (multiSelected?.length < typeOfSecurityEditVal?.length) {
//       let missing = null;
//       let i = typeOfSecurityEditVal.length;
//       while (i) {
//         missing = (~multiSelected.indexOf(typeOfSecurityEditVal[--i])) ? missing : typeOfSecurityEditVal[i];
//       }
//       DelSertBasicInfo(missing.value, 'NameOffenseID', 'NameOffense/Delete_NameOffense')
//     } else {
//       InSertBasicInfo(multiSelected[len].value, 'OffenseID', 'NameOffense/Insert_NameOffense')
//     }
//   }

//   const InSertBasicInfo = (id, col1, url) => {
//     const val = {
//       'NameID': nameID,
//       [col1]: id,
//       'CreatedByUserFK': loginPinID,
//     }
//     AddDeleteUpadate(url, val).then((res) => {
//       if (res) {
//         const parsedData = JSON.parse(res.data);
//         const message = parsedData.Table[0].Message;
//         toastifySuccess(message);
//         // toastifySuccess(res.Message);
//         get_Name_Count(DecNameID)
//         get_Offense_DropDown(incidentID, DecNameID);
//         // get_IncidentTab_Count(incidentID);
//         col1 === 'OffenseID' && get_OffenseName_Data();
//       } else {
//         console.log("Somthing Wrong");
//       }
//     })
//   }

//   const DelSertBasicInfo = (OffenseID, col1, url) => {
//     const val = {
//       [col1]: OffenseID,
//       'DeletedByUserFK': loginPinID,
//     }
//     AddDeleteUpadate(url, val).then((res) => {
//       if (res) {
//         const parsedData = JSON.parse(res.data);
//         const message = parsedData.Table[0].Message;
//         toastifySuccess(message);
//         // toastifySuccess(res.Message);
//         get_Name_Count(DecNameID)
//         get_Offense_DropDown(incidentID, DecNameID);
//         // get_IncidentTab_Count(incidentID);
//         col1 === 'NameOffenseID' && get_OffenseName_Data()
//       } else {
//         console.log("res");
//       }
//     })
//   }

//   const customStylesWithOutColor = {
//     control: base => ({
//       ...base,
//       minHeight: 70,
//       fontSize: 14,
//       margintop: 2,
//       boxShadow: 0,
//     }),
//   };

//   return (
//     <>
//       <div className="col-12 " id='display-not-form'>
//         <div className="row mt-2">
//           <div className="col-2 col-md-2 col-lg-1 mt-4">
//             <label htmlFor="" className='label-name '>Offense
//               {/* {errors.DropError !== 'true' ? (
//                 <p style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.DropError}</p>
//               ) : null} */}
//             </label>
//           </div>
//           <div className="col-8 col-md-8 col-lg-8  mt-2" >
//             <SelectBox
//               name='OffenseID'
//               // styles={(offenseNameData.length > 0 && value?.OffenseID) ? ErrorStyle(true) : ErrorStyle(false)}
//               isClearable
//               options={offenseDrp}
//               closeMenuOnSelect={false}
//               // onChange={(e) => { ChangeDropDown(e, 'OffenseID'); }}
//               placeholder="Select.."
//               components={{ MultiValue, }}
//               onChange={(e) => offense(e)}
//               value={multiSelected.OffenseID}
//               ref={SelectedValue}
//               className="basic-multi-select"
//               isMulti
//               styles={customStylesWithOutColor}
//             />
//           </div>
//         </div>
//       </div>
//     </>
//   )
// }

// export default MasterOffence
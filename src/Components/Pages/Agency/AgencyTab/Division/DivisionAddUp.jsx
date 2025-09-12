
import React, { useState, useEffect, memo, useContext } from "react";
import Select from "react-select";
import { AddDeleteUpadate, fetchPostData, fieldPermision } from "../../../../hooks/Api";
import { EncryptedList } from "../../../../Common/Utility";
import { RequiredField } from "../../AgencyValidation/validators";
import { toastifyError, toastifySuccess } from "../../../../Common/AlertMsg";
import { AgencyContext } from "../../../../../Context/Agency/Index";
import { Agency_Field_Permistion_Filter } from "../../../../Filter/AgencyFilter";

const DivisionAddUp = (props) => {

  
  const { aId, pinID, status, divisionEditValue, get_Division, divisionList, openModal, setOpenModal, updCount } = props
  const [headOfAgency, setHeadOfAgency] = useState([])
  const [parentList, setParentList] = useState([])
  const { get_CountList } = useContext(AgencyContext)

  const HeadOfAgency = []

  const [value, setValue] = useState({
    'AgencyId': aId,
    'DivisionCode': '',
    'Name': '',
    'HeadOfAgencyID': '',
    'CreatedByUserFK': pinID,
    'ModifiedByUserFK': '',
    'DivisionID': '',
    "ParentDivisionId": '',
    "ParentDivisionName": '',
    "HeadOfAgencyName": ''
  })

  const [fieldPermissionAgency, setFieldPermissionAgency] = useState({
    
    'DivisionCode': '', 'Name': '', 'HeadOfAgencyID': '', 'ParentDivisionId': ''
  })

  
  const [errors, setErrors] = useState({
    'DivisionCodeError': '',
    'NameError': '',
    'HeadOfAgencyIDError': ''
  })

  
  useEffect(() => {
    if (divisionEditValue?.DivisionID) {
      get_parent_Division(divisionEditValue?.DivisionID)
      setValue({
        ...value,
        'DivisionCode': divisionEditValue?.DivisionCode,
        'Name': divisionEditValue?.Name,
        'HeadOfAgencyID': divisionEditValue?.PINID,
        'DivisionID': divisionEditValue?.DivisionID,
        "ParentDivisionId": divisionEditValue?.ParentDivisionId,
        'ParentDivisionName': changeArrayFormat_WithFilter([divisionEditValue], 'group'), 'HeadOfAgencyName': changeArrayFormat_WithFilter([divisionEditValue], 'head'),
        'ModifiedByUserFK': pinID,
      })
    } else {
      get_parent_Division('')
      setValue({
        ...value,
        'DivisionCode': '',
        'Name': '',
        'HeadOfAgencyID': '',
        'DivisionID': '',
        "ParentDivisionId": '',
        'ModifiedByUserFK': '',
        'ParentDivisionName': '', 'HeadOfAgencyName': ''
      })
    }
  }, [divisionEditValue, updCount])

  // Onload Call function
  useEffect(() => {
    get_Head_Of_Agency(aId);
    get_parent_Division();
  }, [aId]);

  // Get Head of Agency
  const get_Head_Of_Agency = (aId) => {
    const val = {
      AgencyID: aId
    }
    fetchPostData('DropDown/GetData_HeadOfAgency', val)
      .then(res => {
        if (res) {
          setHeadOfAgency(changeArrayFormat(res, 'head'))
        }
      })

  };

  const get_parent_Division = (id) => {
    const val = {
      AgencyID: aId,
      DivisionID: id
    }
    fetchPostData('Division/GetData_ParentDivision', val)
      .then(res => {
        if (res) {
          setParentList(changeArrayFormat(res, 'division'))
        } else setParentList()
      })
  };

  useEffect(() => {
    if (aId && pinID) get_Field_Permision_Division(aId, pinID)
  }, [aId])

  // Get Effective Field Permission
  const get_Field_Permision_Division = (aId, pinID) => {
    fieldPermision(aId, 'A004', pinID).then(res => {
      if (res) {
        const divisionCodeFilter = Agency_Field_Permistion_Filter(res, "Agency-DivisionCode");
        const nameFilter = Agency_Field_Permistion_Filter(res, "Agency-Name");
        const headOfAgencyFilter = Agency_Field_Permistion_Filter(res, "Agency-HeadOfAgency");
        const classificationFilter = Agency_Field_Permistion_Filter(res, "Agency-Classification");
        const parentDivisionIdFilter = Agency_Field_Permistion_Filter(res, "Agency-ParentDivisionID");

        setFieldPermissionAgency(prevValues => {
          return {
            ...prevValues,
            ['DivisionCode']: divisionCodeFilter || prevValues['DivisionCode'],
            ['Name']: nameFilter || prevValues['Name'],
            ['HeadOfAgencyID']: headOfAgencyFilter || prevValues['HeadOfAgencyID'],
            ['ClassificationID']: classificationFilter || prevValues['ClassificationID'],
            ['ParentDivisionId']: parentDivisionIdFilter || prevValues['ParentDivisionId']
          }
        });
      }
    });
  }

  const head_Of_AgencyChange = (e) => {
    if (e) {
      setValue({
        ...value,
        ['HeadOfAgencyID']: e.value
      })
    } else {
      setValue({
        ...value,
        ['HeadOfAgencyID']: null
      })
    }
  }

  const parentChanges = (e) => {
    if (e) {
      setValue({
        ...value,
        ['ParentDivisionId']: e.value
      })
    } else {
      setValue({
        ...value,
        ['ParentDivisionId']: ''
      })
    }
  }

  const handlChanges = (e) => {
    setValue({
      ...value,
      [e.target.name]: e.target.value
    })
  }

  // Check validation on Field
  const check_Validation_Error = (e) => {
    
    const DivisionCodeErr = RequiredField(value.DivisionCode);
    const NameErr = RequiredField(value.Name);
    const HeadOfAgencyIDErr = RequiredField(value.HeadOfAgencyID);

    setErrors(prevValues => {
      return {
        ...prevValues,
        ['DivisionCodeError']: DivisionCodeErr || prevValues['DivisionCodeError'],
        ['NameError']: NameErr || prevValues['NameError'],
        ['HeadOfAgencyIDError']: HeadOfAgencyIDErr || prevValues['HeadOfAgencyIDError'],
      }
    })
  }

  // Check All Field Format is True Then Submit 
  const { NameError, DivisionCodeError, HeadOfAgencyIDError } = errors

  useEffect(() => {
    if (NameError === 'true' && DivisionCodeError === 'true' && HeadOfAgencyIDError === 'true') {
      if (status) { update_Division() }
      else { add_Division() }
    }
  }, [NameError, DivisionCodeError, HeadOfAgencyIDError])

  
  const rest_Field_Value = () => {
    setValue({
      ...value, 'DivisionCode': '', 'Name': '', 'HeadOfAgencyID': '', 'ParentDivisionId': '', 'DivisionID': '', 'ModifiedByUserFK': '', 'ParentDivisionName': '', 'HeadOfAgencyName': ''
    })
    setErrors({ ...errors, 'DivisionCodeError': '', 'NameError': '', 'HeadOfAgencyIDError': '' });
  }

  // Submit Division Data 
  const add_Division = () => {
    const result = divisionList?.find(item => item.DivisionCode === value.DivisionCode);
    const result1 = divisionList?.find(item => item.Name === value.Name);
    if (result || result1) {
      if (result) {
        toastifyError('Division Code Already Exists')
        setErrors({ ...errors, ['DivisionCodeError']: '' })
      }
      if (result1) {
        toastifyError('Division Name Already Exists')
        setErrors({ ...errors, ['DivisionCodeError']: '' })
      }
    } else {
      
      AddDeleteUpadate('Division/DivisionInsert', value)
        .then(res => {
          if (res.success) {
            toastifySuccess(res.Message); get_parent_Division()
            setErrors({ ...errors, ['DivisionCodeError']: '' })
            get_Division(aId);
            get_CountList(aId);
            rest_Field_Value();
            setOpenModal(false);
          }
        }).catch(err => console.log(err))
    }
  }

  
  const update_Division = () => {
   
    const result = divisionList?.find(item => {
      if (item.DivisionID != value.DivisionID) {
        if (item.DivisionCode === value.DivisionCode) {
          return item.DivisionCode === value.DivisionCode
        } else return item.DivisionCode === value.DivisionCode
      }
      return false
    }
    );

    const result1 = divisionList?.find(item => {
      if (item.DivisionID != value.DivisionID) {
        if (item.Name === value.Name) {
          return item.Name === value.Name
        } else return item.Name === value.Name
      }
      return false

    }
    );
    if (result || result1) {
      if (result) {
        toastifyError('Division Code Already Exists')
        setErrors({ ...errors, ['DivisionCodeError']: '' })
      }
      if (result1) {
        toastifyError('Division Name Already Exists')
        setErrors({ ...errors, ['DivisionCodeError']: '' })
      }
    } else {
      AddDeleteUpadate('Division/DivisionUpdate', value)
        .then(res => {
          if (res.success) {
            toastifySuccess(res.Message)
            setErrors({ ...errors, ['DivisionCodeError']: '' })
            rest_Field_Value()
            get_Division(aId)
            setOpenModal(false)
          }
        })
        .catch(err => console.log(err))
    }
  }

  
  const colourStyles = {
    control: (styles) => ({
      ...styles, backgroundColor: "#fce9bf",
      height: 20,
      minHeight: 30,
      fontSize: 14,
      margintop: 2,
      boxShadow: 0,
    }),
  };

  const customStylesWithOutColor = {
    control: base => ({
      ...base,
      height: 20,
      minHeight: 30,
      fontSize: 14,
      margintop: 2,
      boxShadow: 0,
    }),
  };

  return (
    <>
      {
        openModal ?
          <dialog className="modal fade" style={{ background: "rgba(0,0,0, 0.5)" }} id="DivisionModal" tabIndex="-1" data-backdrop="false" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content">
                <div className="modal-body">
                  <div className="m-1 mt-3">
                    <fieldset style={{ border: '1px solid gray' }}>
                      <legend style={{ fontWeight: 'bold' }}>Division</legend>

                      <div className="row pt-2">
                        <div className="col-6 ">
                          <div className="text-field">
                            <input type="text" maxLength={10}
                              className={fieldPermissionAgency?.DivisionCode[0] ?
                                fieldPermissionAgency?.DivisionCode[0]?.Changeok === 0 && fieldPermissionAgency?.DivisionCode[0]?.AddOK === 0 && status ? 'readonlyColor' : fieldPermissionAgency?.DivisionCode[0]?.Changeok === 0 && fieldPermissionAgency?.DivisionCode[0]?.AddOK === 1 && divisionEditValue?.DivisionCode === '' && status ? 'requiredColor' : fieldPermissionAgency?.DivisionCode[0]?.AddOK === 1 && !status ? 'requiredColor' : fieldPermissionAgency?.DivisionCode[0]?.Changeok === 1 && status ? 'requiredColor' : 'readonlyColor' : 'requiredColor'
                              }
                              onChange={fieldPermissionAgency?.DivisionCode[0] ?
                                fieldPermissionAgency?.DivisionCode[0]?.Changeok === 0 && fieldPermissionAgency?.DivisionCode[0]?.AddOK === 0 && status ? '' : fieldPermissionAgency?.DivisionCode[0]?.Changeok === 0 && fieldPermissionAgency?.DivisionCode[0]?.AddOK === 1 && divisionEditValue?.DivisionCode === '' && status ? handlChanges : fieldPermissionAgency?.DivisionCode[0]?.AddOK === 1 && !status ? handlChanges : fieldPermissionAgency?.DivisionCode[0]?.Changeok === 1 && status ? handlChanges : '' : handlChanges
                              }
                              name='DivisionCode' value={value.DivisionCode} required />
                            <label>Division Code</label>
                            {errors.DivisionCodeError !== 'true' ? (
                              <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.DivisionCodeError}</span>
                            ) : null}
                          </div>
                         
                        </div>
                        <div className="col-6 ">
                          <div className="text-field">
                            <input type="text"
                              className={fieldPermissionAgency?.Name[0] ?
                                fieldPermissionAgency?.Name[0]?.Changeok === 0 && fieldPermissionAgency?.Name[0]?.AddOK === 0 && status ? 'readonlyColor' : fieldPermissionAgency?.Name[0]?.Changeok === 0 && fieldPermissionAgency?.Name[0]?.AddOK === 1 && divisionEditValue?.Name === '' && status ? 'requiredColor' : fieldPermissionAgency?.Name[0]?.AddOK === 1 && !status ? 'requiredColor' : fieldPermissionAgency?.Name[0]?.Changeok === 1 && status ? 'requiredColor' : 'readonlyColor' : 'requiredColor'
                              }
                              onChange={fieldPermissionAgency?.Name[0] ?
                                fieldPermissionAgency?.Name[0]?.Changeok === 0 && fieldPermissionAgency?.Name[0]?.AddOK === 0 && status ? '' : fieldPermissionAgency?.Name[0]?.Changeok === 0 && fieldPermissionAgency?.Name[0]?.AddOK === 1 && divisionEditValue?.Name === '' && status ? handlChanges : fieldPermissionAgency?.Name[0]?.AddOK === 1 && !status ? handlChanges : fieldPermissionAgency?.Name[0]?.Changeok === 1 && status ? handlChanges : '' : handlChanges
                              }
                              name='Name' value={value.Name} required />
                            <label>Name</label>
                            {errors.NameError !== 'true' ? (
                              <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.NameError}</span>
                            ) : null}
                          </div>
                        </div>
                        <div className="col-6 mt-5 pt-2 dropdown__box">
                          <Select
                            value={headOfAgency?.filter((obj) => obj.value === value?.HeadOfAgencyID)}
                            styles={colourStyles}
                            isClearable
                            onChange={fieldPermissionAgency?.HeadOfAgencyID[0] ?
                              fieldPermissionAgency?.HeadOfAgencyID[0]?.Changeok === 0 && fieldPermissionAgency?.HeadOfAgencyID[0]?.AddOK === 0 && status ? '' : fieldPermissionAgency?.HeadOfAgencyID[0]?.Changeok === 0 && fieldPermissionAgency?.HeadOfAgencyID[0]?.AddOK === 1 && divisionEditValue?.HeadOfAgencyID === '' && status ? head_Of_AgencyChange : fieldPermissionAgency?.HeadOfAgencyID[0]?.AddOK === 1 && !status ? head_Of_AgencyChange : fieldPermissionAgency?.HeadOfAgencyID[0]?.Changeok === 1 && status ? head_Of_AgencyChange : '' : head_Of_AgencyChange
                            }
                            isDisabled={fieldPermissionAgency?.HeadOfAgencyID[0] ?
                              fieldPermissionAgency?.HeadOfAgencyID[0]?.Changeok === 0 && fieldPermissionAgency?.HeadOfAgencyID[0]?.AddOK === 0 && status ? true : fieldPermissionAgency?.HeadOfAgencyID[0]?.Changeok === 0 && fieldPermissionAgency?.HeadOfAgencyID[0]?.AddOK === 1 && divisionEditValue?.HeadOfAgencyID === '' && status ? false : fieldPermissionAgency?.HeadOfAgencyID[0]?.AddOK === 1 && !status ? false : fieldPermissionAgency?.HeadOfAgencyID[0]?.Changeok === 1 && status ? false : true : false
                            }
                            name='HeadOfAgencyID'
                            options={headOfAgency}
                            placeholder={divisionEditValue?.HeadOfAgencyID ? HeadOfAgency : 'Head Of Division'}
                          />

                          <label htmlFor="" className="pt-2">Head Of Division</label>
                          {errors.HeadOfAgencyIDError !== 'true' ? (
                            <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.HeadOfAgencyIDError}</span>
                          ) : null}
                        </div>
                        <div className="col-6 mt-5 pt-2 dropdown__box">
                          <Select
                            styles={customStylesWithOutColor}
                            className="basic-single"
                            value={parentList?.filter((obj) => obj.value === value?.ParentDivisionId)}
                            classNamePrefix="select"
                            name="ParentDivisionId"
                            options={parentList}
                            isClearable
                            onChange={fieldPermissionAgency?.ParentDivisionId[0] ?
                              fieldPermissionAgency?.ParentDivisionId[0]?.Changeok === 0 && fieldPermissionAgency?.ParentDivisionId[0]?.AddOK === 0 && status ? true : fieldPermissionAgency?.ParentDivisionId[0]?.Changeok === 0 && fieldPermissionAgency?.ParentDivisionId[0]?.AddOK === 1 && divisionEditValue?.ParentDivisionId === '' && status ? parentChanges : fieldPermissionAgency?.ParentDivisionId[0]?.AddOK === 1 && !status ? parentChanges : fieldPermissionAgency?.ParentDivisionId[0]?.Changeok === 1 && status ? parentChanges : true : parentChanges}
                            isDisabled={fieldPermissionAgency?.ParentDivisionId[0] ?
                              fieldPermissionAgency?.ParentDivisionId[0]?.Changeok === 0 && fieldPermissionAgency?.ParentDivisionId[0]?.AddOK === 0 && status ? true : fieldPermissionAgency?.ParentDivisionId[0]?.Changeok === 0 && fieldPermissionAgency?.ParentDivisionId[0]?.AddOK === 1 && divisionEditValue?.ParentDivisionId === '' && status ? false : fieldPermissionAgency?.ParentDivisionId[0]?.AddOK === 1 && !status ? false : fieldPermissionAgency?.ParentDivisionId[0]?.Changeok === 1 && status ? false : true : false
                            }
                          />

                          <label htmlFor="" className="pt-2">Parent Division</label>
                        </div>
                      </div>

                    </fieldset>

                  </div>
                  <div className="btn-box text-right mt-3 mr-1">
                    {
                      status ?
                        <button type="button" className="btn btn-sm btn-success mr-1" onClick={check_Validation_Error}>Update</button>
                        :
                        <button type="button" className="btn btn-sm btn-success mr-1" onClick={check_Validation_Error}>Save</button>
                    }
                    <button type="button" className="btn btn-sm btn-success" data-dismiss="modal" onClick={() =>
                      rest_Field_Value()}>Close</button>
                  </div>
                </div>
              </div>
            </div>
          </dialog>
          :
          <> </>
      }
    </>
  );
};

export default memo(DivisionAddUp)



export const changeArrayFormat = (data, type) => {
  if (type === 'division') {
    const result = data?.map((sponsor) =>
      ({ value: sponsor.DivisionID, label: sponsor.DivisionCode, })
    )
    return result
  }

  if (type === 'head') {
    const result = data?.map((sponsor) =>
      ({ value: sponsor.PINID, label: sponsor.HeadOfAgency })
    )
    return result
  }
}

export const changeArrayFormat_WithFilter = (data, type) => {
  if (type === 'group') {
    const result = data.map((sponsor) =>
      ({ value: sponsor.ParentDivisionId, label: sponsor.ParentDivisionname })
    )
    return result[0]
  }
  if (type === 'head') {
    const result = data.map((sponsor) =>
      ({ value: sponsor.PINID, label: sponsor.PINName })
    )
    return result[0]
  }
}

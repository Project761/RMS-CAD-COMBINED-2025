import { useEffect, useState, useRef } from 'react';
import Select from "react-select";
import { AddDeleteUpadate, fetchPostData } from '../../../../../../hooks/Api';
import { Comman_changeArrayFormat, threeColArray } from '../../../../../../Common/ChangeArrayFormat';
import { toastifySuccess } from '../../../../../../Common/AlertMsg';
import { components } from "react-select";


const AssaultType = (props) => {

  const { victimID, nameID, loginPinID, } = props

  const SelectedValue = useRef();
  const [assaultDrp, setAssaultDrp] = useState();
  const [typeOfSecurityEditVal, setTypeOfSecurityEditVal] = useState();



  const MultiValue = props => (
    <components.MultiValue {...props}>
      <span>{props.data.label}</span>
    </components.MultiValue>
  );


  const [multiSelected, setMultiSelected] = useState({
    AssaultID: null,
  })


  useEffect(() => {
    get_Assults_Drp(victimID);
  }, [victimID])

  useEffect(() => {
    if (victimID) { get_Assults_Data(); }
  }, [victimID])

  const get_Assults_Data = () => {
    const val = { 'VictimID': victimID, }
    fetchPostData('VictimAssaultType/GetData_VictimAssaultType', val).then((res) => {
      if (res) {
        setTypeOfSecurityEditVal(Comman_changeArrayFormat(res, 'NameEventAssaultID', 'NameID', 'PretendToBeID', 'AssaultID', 'Assault_Description'));
      } else {
        setTypeOfSecurityEditVal([]);
      }
    })
  }

  const get_Assults_Drp = (victimID) => {
    const val = { 'VictimID': victimID, }
    fetchPostData('VictimAssaultType/GetData_InsertVictimAssaultType', val).then((data) => {
      if (data) {

        setAssaultDrp(threeColArray(data, 'AssaultTypeID', 'Description'))
      } else {
        setAssaultDrp([])
      }
    })
  }

  useEffect(() => {
    if (typeOfSecurityEditVal) { setMultiSelected(prevValues => { return { ...prevValues, ['AssaultID']: typeOfSecurityEditVal } }) }
  }, [typeOfSecurityEditVal])



  const assault = (multiSelected) => {
    setMultiSelected({
      ...multiSelected,
      AssaultID: multiSelected
    })
    const len = multiSelected.length - 1
    if (multiSelected?.length < typeOfSecurityEditVal?.length) {
      let missing = null;
      let i = typeOfSecurityEditVal.length;
      while (i) {
        missing = (~multiSelected.indexOf(typeOfSecurityEditVal[--i])) ? missing : typeOfSecurityEditVal[i];
      }
      DelSertBasicInfo(missing.value, 'NameEventAssaultID', 'VictimAssaultType/Delete_VictimAssaultType')
    } else {
      InSertBasicInfo(multiSelected[len].value, 'AssaultID', 'VictimAssaultType/Insert_VictimAssaultType')
    }
  }

  const InSertBasicInfo = (id, col1, url) => {
    const val = {
      'NameID': nameID,
      'VictimID': victimID,
      [col1]: id,
      'CreatedByUserFK': loginPinID,
    }
    AddDeleteUpadate(url, val).then((res) => {
      if (res) {

        toastifySuccess(res.Message);
        get_Assults_Drp(victimID)

        col1 === 'AssaultID' && get_Assults_Data();
      } else {
        console.log("Somthing Wrong");
      }
    })
  }

  const DelSertBasicInfo = (NameEventAssaultID, col1, url) => {
    const val = {
      [col1]: NameEventAssaultID,
      'DeletedByUserFK': loginPinID,
    }
    AddDeleteUpadate(url, val).then((res) => {
      if (res) {
        toastifySuccess(res.Message);
        get_Assults_Drp(victimID)

        col1 === 'NameEventAssaultID' && get_Assults_Data()
      } else {
        console.log("res");
      }
    })
  }

  const customStylesWithOutColor = {
    control: base => ({
      ...base,
      minHeight: 60,
      fontSize: 14,
      margintop: 2,
      boxShadow: 0,
    }),
  };

  return (
    <>
      <div className="col-12 " id='display-not-form'>
        <div className="col-12 col-md-12 mt-2 pt-1 p-0" >
          <div className="bg-line  py-1 px-2 d-flex justify-content-between align-items-center">
            <p className="p-0 m-0">Assault Type</p>
          </div>
        </div>
        <div className="row">
          <div className="col-2 col-md-2 col-lg-1 mt-3">
            <label htmlFor="" className='label-name '>
              Assault Type
            </label>
          </div>
          <div className="col-4 col-md-4 col-lg-4  mt-2" >
            <Select
              name='AssaultID'
              isClearable
              options={assaultDrp}
              closeMenuOnSelect={false}
              placeholder="Select.."
              ref={SelectedValue}
              className="basic-multi-select"
              isMulti
              styles={customStylesWithOutColor}
              components={{ MultiValue, }}
              onChange={(e) => assault(e)}
              value={multiSelected.AssaultID}
            />
          </div>
        </div>
      </div>

    </>
  )
}

export default AssaultType
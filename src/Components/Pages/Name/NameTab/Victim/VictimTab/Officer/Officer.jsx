import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import Select from "react-select";
import { AddDeleteUpadate, fetchPostData } from '../../../../../../hooks/Api';
import { Comman_changeArrayFormat } from '../../../../../../Common/ChangeArrayFormat';
import { toastifySuccess } from '../../../../../../Common/AlertMsg';
import { components } from "react-select";


const Officer = (props) => {


  const { victimID, loginPinID, nameID, loginAgencyID, } = props
  const SelectedValue = useRef();
  const [officerDrpData, setOfficerDrpData] = useState();
  const [typeOfSecurityEditVal, setTypeOfSecurityEditVal] = useState();

  const [value, setValue] = useState({
    'OfficerID': '',
    'NameID': nameID,
    'VictimID': victimID,
    'CreatedByUserFK': loginPinID,
  })
  const [multiSelected, setMultiSelected] = useState({
    OfficerID: null,
  })
  const MultiValue = props => (
    <components.MultiValue {...props}>
      <span>{props.data.label}</span>
    </components.MultiValue>
  );


  useEffect(() => {
    if (typeOfSecurityEditVal) { setMultiSelected(prevValues => { return { ...prevValues, ['OfficerID']: typeOfSecurityEditVal } }) }
  }, [typeOfSecurityEditVal])

  useEffect(() => {
    get_Victim_Officer_Drp(victimID, loginAgencyID);
    get_Victim_Officer_Data(victimID);
  }, [victimID])

  const get_Victim_Officer_Data = () => {
    const val = {
      'VictimID': victimID,
    }
    fetchPostData('VictimOfficer/GetData_VictimOfficer', val).then((res) => {
      if (res) {
        setTypeOfSecurityEditVal(Comman_changeArrayFormat(res, 'VictimOfficerID', 'NameID', 'PretendToBeID', 'OfficerID', 'Officer_Name'));
      } else {
        setTypeOfSecurityEditVal([]);
      }
    })
  }

  const get_Victim_Officer_Drp = (victimID, loginAgencyID) => {
    const val = {
      'VictimID': victimID,
      'AgencyID': loginAgencyID,
    }
    fetchPostData('VictimOfficer/GetData_InsertVictimOfficer', val).then((data) => {
      if (data) {
        setOfficerDrpData(Comman_changeArrayFormat(data, 'PINID', 'OfficerName'))
      } else {
        setOfficerDrpData([])
      }
    })
  }


 

  const Officer = (multiSelected) => {
    setMultiSelected({
      ...multiSelected,
      OfficerID: multiSelected
    })
    const len = multiSelected.length - 1
    if (multiSelected?.length < typeOfSecurityEditVal?.length) {
      let missing = null;
      let i = typeOfSecurityEditVal.length;
      while (i) {
        missing = (~multiSelected.indexOf(typeOfSecurityEditVal[--i])) ? missing : typeOfSecurityEditVal[i];
      }
      DelSertBasicInfo(missing.value, 'VictimOfficerID', 'VictimOfficer/Delete_VictimOfficer')
    } else {
      InSertBasicInfo(multiSelected[len].value, 'OfficerID', 'VictimOfficer/Insert_VictimOfficer')
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
        get_Victim_Officer_Drp(victimID, loginAgencyID);

        col1 === 'OfficerID' && get_Victim_Officer_Data();
      } else {
        console.log("Somthing Wrong");
      }
    })
  }

  const DelSertBasicInfo = (victimOfficerID, col1, url) => {
    const val = {
      [col1]: victimOfficerID,
      'DeletedByUserFK': loginPinID,
    }
    AddDeleteUpadate(url, val).then((res) => {
      if (res) {
        toastifySuccess(res.Message);
        get_Victim_Officer_Drp(victimID, loginAgencyID);

        col1 === 'victimOfficerID' && get_Victim_Officer_Data()
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
            <p className="p-0 m-0">Officer</p>
          </div>
        </div>
        <div className="row">
          <div className="col-2 col-md-2 col-lg-1 mt-3">
            <label htmlFor="" className='label-name '>Officer</label>
          </div>
          <div className="col-4 col-md-4 col-lg-4  mt-2" >
            <Select
              options={officerDrpData}
              isClearable
              closeMenuOnSelect={false}
              placeholder="Select.."
              ref={SelectedValue}
              className="basic-multi-select"
              isMulti
              styles={customStylesWithOutColor}
              components={{ MultiValue, }}
              onChange={(e) => Officer(e)}
              value={multiSelected.OfficerID}
              name='OfficerID'
            />
          </div>

        </div>
      </div>

    </>
  )
}

export default Officer
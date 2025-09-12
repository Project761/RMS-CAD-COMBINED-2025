import { useEffect, useState, useRef } from 'react';
import Select from "react-select";
import { AddDeleteUpadate, fetchPostData } from '../../../../../../hooks/Api'
import { Comman_changeArrayFormat } from '../../../../../../Common/ChangeArrayFormat'
import { toastifySuccess } from '../../../../../../Common/AlertMsg'
import { components } from "react-select";

const Property = ({ loginPinID, nameID, victimID, incidentID }) => {

  const SelectedValue = useRef();
  //screen permission 
  const [propertyDrp, setPropertyDrp] = useState();
  const [typeOfSecurityEditVal, setTypeOfSecurityEditVal] = useState();


  const [multiSelected, setMultiSelected] = useState({
    PropertyID: null,
  })


  const MultiValue = props => (
    <components.MultiValue {...props}>
      <span>{props.data.label}</span>
    </components.MultiValue>
  );


  useEffect(() => {
    if (typeOfSecurityEditVal) { setMultiSelected(prevValues => { return { ...prevValues, ['PropertyID']: typeOfSecurityEditVal } }) }
  }, [typeOfSecurityEditVal])


  useEffect(() => {
    get_Property_Data(victimID);
    get_Property_DropDown(incidentID, victimID);
  }, [incidentID, victimID])

  const get_Property_Data = (victimID) => {
    const val = {
      'VictimID': victimID,
    }
    fetchPostData('VictimProperty/GetData_VictimProperty', val).then((res) => {
      if (res) {

        setTypeOfSecurityEditVal(Comman_changeArrayFormat(res, 'VictimPropertyID', 'NameID', 'PretendToBeID', 'PropertyID', 'PropertyID1'));
      } else {
        setTypeOfSecurityEditVal([]);
      }
    })
  }

  const get_Property_DropDown = (incidentID, victimID) => {
    const val = {
      'IncidentID': incidentID,
      'VictimID': victimID,
    }
    fetchPostData('VictimProperty/GetData_InsertVictimProperty', val).then((data) => {
      if (data) {
        setPropertyDrp(Comman_changeArrayFormat(data, 'PropertyID', 'PropertyNumber', 'PropertyTypeID'))
      } else {
        setPropertyDrp([])
      }
    })
  }



  const Officer = (multiSelected) => {
    setMultiSelected({
      ...multiSelected,
      PropertyID: multiSelected
    })
    const len = multiSelected.length - 1
    if (multiSelected?.length < typeOfSecurityEditVal?.length) {
      let missing = null;
      let i = typeOfSecurityEditVal.length;
      while (i) {
        missing = (~multiSelected.indexOf(typeOfSecurityEditVal[--i])) ? missing : typeOfSecurityEditVal[i];
      }
      DelSertBasicInfo(missing.value, 'VictimPropertyID', 'VictimProperty/Delete_VictimProperty')
    } else {
      InSertBasicInfo(multiSelected[len].value, 'PropertyID', 'VictimProperty/Insert_VictimProperty')
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
        get_Property_DropDown(incidentID, victimID);

        col1 === 'PropertyID' && get_Property_Data(victimID);;
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
        get_Property_DropDown(incidentID, victimID);

        col1 === 'VictimPropertyID' && get_Property_Data(victimID)
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
      <div className="col-12 col-md-12 pt-2 p-0" >
        <div className="bg-line  py-1 px-2 d-flex justify-content-between align-items-center">
          <p className="p-0 m-0">Property</p>
        </div>
      </div>

      <div className="col-6 col-md-6 col-lg-4 mt-2" style={{ zIndex: '1', }} >
        <Select
          options={propertyDrp}
          isClearable
          closeMenuOnSelect={false}
          placeholder="Select.."
          ref={SelectedValue}
          className="basic-multi-select"
          isMulti
          styles={customStylesWithOutColor}
          components={{ MultiValue, }}
          onChange={(e) => Officer(e)}
          value={multiSelected.PropertyID}
          name='PropertyID'


        />

      </div>

    </>
  )
}

export default Property
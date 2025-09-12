import { useEffect, useState, useRef } from 'react';
import Select from "react-select";
import { AddDeleteUpadate, fetchPostData } from '../../../../../../hooks/Api';
import { threeColVictimInjuryArray, Comman_changeArrayFormatJustfiableHomicide } from '../../../../../../Common/ChangeArrayFormat';
import { toastifySuccess } from '../../../../../../Common/AlertMsg';
import { components } from "react-select";

const JustifiableHomicide = (props) => {


  const { victimID, nameID, loginPinID, } = props

  const SelectedValue = useRef();
  const [justifiableHomiDrp, setJustifiableHomiDrp] = useState();
  const [justifiableHomiVal, setJustifiableHomiVal] = useState();

  const [value, setValue] = useState({
    'JustifiableHomicideID': '',
    'NameID': nameID,
    'VictimID': victimID,
    'CreatedByUserFK': loginPinID,
  })
  const [multiSelected, setMultiSelected] = useState({
    JustifiableHomicideID: null,
  })
  const MultiValue = props => (
    <components.MultiValue {...props}>
      <span>{props.data.label}</span>
    </components.MultiValue>
  );

  const [errors, setErrors] = useState({
    'DropError': '',
  })



  useEffect(() => {
    get_Data_RelationShip_Drp(victimID);
    get_RelationShip_Data(victimID);
  }, [victimID])


  const get_RelationShip_Data = () => {
    const val = {
      'VictimID': victimID,
    }
    fetchPostData('VictimJustifiableHomicide/GetData_VictimJustifiableHomicide', val).then((res) => {
      if (res) {
        setJustifiableHomiVal(Comman_changeArrayFormatJustfiableHomicide(res, 'VictimJustifiableHomicideID', 'JustifiableHomicideID', 'PretendToBeID', 'JustifiableHomicide_Description'));
      } else {
        setJustifiableHomiVal([]);
      }
    })
  }

  const get_Data_RelationShip_Drp = (victimID) => {
    const val = {
      'VictimID': victimID,
    }
    fetchPostData('VictimJustifiableHomicide/GetData_InsertJustifiableHomicide', val).then((data) => {
      if (data) {
        setJustifiableHomiDrp(threeColVictimInjuryArray(data, 'JustifiableHomicideID', 'Description', "JustifiableHomicideCode",))
      } else {
        setJustifiableHomiDrp([])
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

  useEffect(() => {
    if (justifiableHomiVal) { setMultiSelected(prevValues => { return { ...prevValues, ['JustifiableHomicideID']: justifiableHomiVal } }) }
  }, [justifiableHomiVal])

  const Justifuable = (multiSelected) => {
    setMultiSelected({
      ...multiSelected,
      JustifiableHomicideID: multiSelected
    })
    const len = multiSelected.length - 1
    if (multiSelected?.length < justifiableHomiVal?.length) {
      let missing = null;
      let i = justifiableHomiVal.length;
      while (i) {
        missing = (~multiSelected.indexOf(justifiableHomiVal[--i])) ? missing : justifiableHomiVal[i];
      }
      DelSertBasicInfo(missing.id, 'VictimJustifiableHomicideID', 'VictimJustifiableHomicide/Delete_VictimJustifiableHomicide')
    } else {
      InSertBasicInfo(multiSelected[len].value, 'JustifiableHomicideID', 'VictimJustifiableHomicide/Insert_VictimJustifiableHomicide')
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

        col1 === 'JustifiableHomicideID' && get_RelationShip_Data();
      } else {
        console.log("Somthing Wrong");
      }
    })
  }

  const DelSertBasicInfo = (VictimJustifiableHomicideID, col1, url) => {

    const val = {
      [col1]: VictimJustifiableHomicideID,
      'DeletedByUserFK': loginPinID,
    }
    AddDeleteUpadate(url, val).then((res) => {
      if (res) {
        toastifySuccess(res.Message);

        col1 === 'VictimJustifiableHomicideID' && get_RelationShip_Data()
      } else {
        console.log("res");
      }
    })
  }
  return (
    <>
      <div className="col-12 " id='display-not-form'>
        <div className="col-12 col-md-12 mt-2 pt-1 p-0" >
          <div className="bg-line  py-1 px-2 d-flex justify-content-between align-items-center">
            <p className="p-0 m-0">Justifiable Homicide</p>
          </div>
        </div>
        <div className="row">
          <div className="col-2 col-md-2 col-lg-2 mt-4">
            <label htmlFor="" className='new-label'>Justifiable Homicide {errors.DropError !== 'true' ? (
              <span style={{ color: 'red', fontSize: '13px', margin: '0px', padding: '0px' }}>{errors.DropError}</span>
            ) : null}</label>
          </div>
          <div className="col-4 col-md-4 col-lg-4  mt-2" >
            <Select
              name='VictimInjuryID'
              isClearable
              options={justifiableHomiDrp}
              closeMenuOnSelect={false}

              placeholder="Select.."
              ref={SelectedValue}
              components={{ MultiValue, }}
              onChange={(e) => Justifuable(e)}
              value={multiSelected.JustifiableHomicideID}
              className="basic-multi-select"
              isMulti
              styles={customStylesWithOutColor}
            />
          </div>

        </div>
      </div>

    </>
  )
}

export default JustifiableHomicide
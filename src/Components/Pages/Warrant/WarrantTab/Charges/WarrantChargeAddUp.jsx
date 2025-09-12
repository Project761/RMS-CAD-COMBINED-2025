import React, { useState, useEffect, useContext } from 'react'
import { AgencyContext } from '../../../../../Context/Agency/Index';
import { ChargeTabs } from '../../../../Utility/Tab/TabsArray';
import SubTab from '../../../../Utility/Tab/SubTab';
import Penalties from './ChargeTab/Penalties/Penalties';
import Home from './ChargeTab/Home/Home';
import CourtDisposition from './ChargeTab/CourtDisposition/CourtDisposition';
import Comments from './ChargeTab/Comments/Comments';
import Weapon from './ChargeTab/Weapon/Weapon';
import Offense from './ChargeTab/Offense/Offense';
import { Decrypt_Id_Name } from '../../../../Common/Utility';

const WarrantChargeAddUp = () => {

    const { updateCount, get_LocalStorage, localStoreArray } = useContext(AgencyContext);
    const [showPage, setShowPage] = useState('home');
    const [status, setStatus] = useState()

    const [mainIncidentID, setMainIncidentID] = useState('');
    const [chargeID, setChargeID] = useState('');
    const [loginAgencyID, setLoginAgencyID] = useState('');
    const [loginPinID, setLoginPinID,] = useState('');

    const localStore = {
        Value: "",
        UniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
        Key: JSON.stringify({ AgencyID: "", PINID: "", IncidentID: '', ChargeID: '', warentStatus: '', }),
    }

    useEffect(() => {
        if (!localStoreArray.AgencyID || !localStoreArray.PINID) {
            get_LocalStorage(localStore);
        }
    }, []);

    // Onload Function
    useEffect(() => {
        if (localStoreArray) {
            if (localStoreArray?.AgencyID && localStoreArray?.PINID) {
                setLoginAgencyID(localStoreArray?.AgencyID);
                setLoginPinID(localStoreArray?.PINID);
                setMainIncidentID(localStoreArray?.IncidentID);
                if (localStoreArray.chargeID) setChargeID(localStoreArray?.chargeID); else setChargeID()
            }
        }
    }, [localStoreArray, updateCount])

    useEffect(() => {
        if (chargeID) {
            setStatus(true)
        } else {
            setStatus(false)
        }
    }, [updateCount, chargeID])

    return (

        <div className="section-body view_page_design pt-3">
            <div className="row clearfix" >
                <div className="col-12 col-sm-12">
                    <div className="card Agency">
                        <div className="card-body">
                            <div className="row  ">
                                <div className={`col-12 col-md-12`}>
                                    <div className="row">
                                        <div className="col-12 pl-3">
                                            <SubTab tabs={ChargeTabs} setShowPage={setShowPage} showPage={showPage} status={status} />
                                        </div>
                                    </div>
                                </div>
                                {
                                    showPage === 'home' ?
                                        <Home  {...{ setChargeID, chargeID }} />
                                        :
                                        showPage === 'Penalties' ?
                                            <Penalties {...{ loginPinID, loginAgencyID, chargeID, mainIncidentID }} />
                                            :
                                            showPage === 'CourtDisposition' ?
                                                <CourtDisposition {...{ loginPinID, loginAgencyID, chargeID, mainIncidentID }} />
                                                :
                                                showPage === 'Comments' ?
                                                    <Comments {...{ loginPinID, loginAgencyID, chargeID, mainIncidentID }} />
                                                    :
                                                    showPage === 'Weapon' ?
                                                        <Weapon {...{ loginPinID, loginAgencyID, chargeID, mainIncidentID }} />
                                                        :
                                                        showPage === 'Offense' ?
                                                            <Offense {...{ loginPinID, loginAgencyID, chargeID, mainIncidentID }} />
                                                            :
                                                            <></>
                                }
                            </div>
                        </div>
                    </div>
                </div>


            </div>
        </div>

    )
}

export default WarrantChargeAddUp
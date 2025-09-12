import React, { useState, useEffect, useContext } from 'react'
import Home from './WarrantTab/Home/Home'
import SubTab from '../../Utility/Tab/SubTab'
import { WarrantTabs } from '../../Utility/Tab/TabsArray'
import OtherInformation from './WarrantTab/OtherInformation/OtherInformation'
import Comments from './WarrantTab/Comments/Comments'
import Narrative from './WarrantTab/Narratives/Narrative'
import Document from './WarrantTab/Document/Document'
import { AgencyContext } from '../../../Context/Agency/Index'
import { Decrypt_Id_Name } from '../../Common/Utility'
import Charges from './WarrantTab/Charges/Charges'
import History from './WarrantTab/History/History'
import Clearance from './WarrantTab/Clearance/Clearance'
import WarrantService from './WarrantTab/WarrantService/WarrantService'

const WarrantTab = () => {

    const { updateCount, localStoreArray, get_LocalStorage, warentStatus } = useContext(AgencyContext);
    const [showPage, setShowPage] = useState('home');
    const [status, setStatus] = useState(false);

    const localStore = {
        Value: "",
        UniqueId: sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '',
        Key: JSON.stringify({ AgencyID: "", PINID: "", IncidentID: '', WarrantID: '', WarrantStatus: '', IncidentNumber: '', IncidentStatus: '' }),
    }

    useEffect(() => {
        if (!localStoreArray.AgencyID || !localStoreArray.PINID || !localStoreArray.IncidentStatus) {
            get_LocalStorage(localStore);
        }
    }, []);

    // Onload Function
    useEffect(() => {
        if (localStoreArray) {
            if (warentStatus) {
                setStatus(warentStatus);
            } else {
                setStatus(localStoreArray?.WarrantStatus === true || localStoreArray?.WarrantStatus === "True" ? true : false);
            }
        }
    }, [localStoreArray, updateCount])

    return (

        <div className="section-body view_page_design pt-2">
            <div className="row clearfix" >
                <div className="col-12 col-sm-12">
                    <div className="card Agency">
                        <div className="card-body">
                            <div className="row ">
                                <div className={`col-12 col-md-12`}>
                                    <div className="row" style={{ marginTop: '-10px' }}>
                                        <div className="col-12 pl-3 ">
                                            <SubTab tabs={WarrantTabs} setShowPage={setShowPage} showPage={showPage} status={status} />
                                        </div>
                                    </div>
                                </div>
                                {
                                    showPage === 'home' ?
                                        <Home {...{}} />
                                        :
                                        showPage === 'Other Information' ?
                                            <OtherInformation {...{}} />
                                            :
                                            showPage === 'Comments' ?
                                                <Comments {...{}} />
                                                :
                                                showPage === 'Documents' ?
                                                    <Document {...{}} />
                                                    :
                                                    showPage === 'Narrative' ?
                                                        <Narrative {...{}} />
                                                        :
                                                        showPage === 'Charges' ?
                                                            <Charges {...{}} />
                                                            :
                                                            showPage === 'History' ?
                                                                <History {...{}} />
                                                                :
                                                                showPage === 'Clearance' ?
                                                                    <Clearance {...{}} />
                                                                    :
                                                                    showPage === 'WarrantService' ?
                                                                        <WarrantService {...{}} />
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

export default WarrantTab
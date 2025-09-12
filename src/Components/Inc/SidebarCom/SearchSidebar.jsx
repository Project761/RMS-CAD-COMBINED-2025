
import { useContext, useEffect, useState } from "react";
import { AgencyContext } from '../../../Context/Agency/Index';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { Decrypt_Id_Name } from "../../Common/Utility";
import { get_LocalStoreData } from "../../../redux/actions/Agency";

const SearchSidebar = () => {

    const dispatch = useDispatch();
    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const [agencyName, setAgencyName] = useState('');

    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };

    const query = useQuery();
    let openPage = query?.get('page');
    var ModNo = query?.get('ModNo');
    var ArrNo = query?.get("ArrNo");

    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        if (localStoreData) {
            setAgencyName(localStoreData?.Agency_Name);
        }
    }, [localStoreData]);

    return (
        <>
            <div className="row px-1">
                <span className='agency-sidebar'>
                    <i className="fa fa-chevron-right " style={{ fontSize: '14px' }}></i>
                    <span className="ml-2" >
                        {
                            openPage === "MST-Property-Dash" ? `PRO-NO-${ModNo ? ModNo : ""}`
                                :
                                openPage === "MST-Vehicle-Dash" ? `VIC-NO-${ModNo ? ModNo : ""}`
                                    :
                                    openPage === "MST-Arrest-Dash" ? `ARST-NO-${ArrNo ? ArrNo : ""}`
                                        :
                                        openPage === "MST-Name-Dash" ? `NAME-NO-${ModNo ? ModNo : ""}` : ''
                        }
                        <p className='agency-name-sidebar'>{agencyName ? agencyName : ''}</p>
                    </span>
                </span>
            </div>
        </>

    )
}

export default SearchSidebar
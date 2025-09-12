import { useEffect, useContext } from 'react'
import { useLocation } from 'react-router-dom'
import { AgencyContext } from '../../../Context/Agency/Index'
import { Decrypt_Id_Name } from '../../Common/Utility'
import { useDispatch, useSelector } from 'react-redux'
import { get_LocalStoreData } from '../../../redux/actions/Agency'

const AgencySidebar = () => {

    const { getAgency, agencyFilterData, } = useContext(AgencyContext);
    const dispatch = useDispatch()
    const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';
    const localStoreData = useSelector((state) => state.Agency.localStoreData);


    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };

    const query = useQuery();
    const AgyName = query?.get("AgyName");
    const ORINum = query?.get("ORINum");


    useEffect(() => {
        if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
            if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
        }
    }, []);

    useEffect(() => {
        if (localStoreData) {
            if (localStoreData.AgencyID && localStoreData.PINID) {
                if (agencyFilterData.length === 0) { getAgency(localStoreData?.AgencyID, localStoreData?.PINID) }
            }
        }
    }, [localStoreData]);

    return (
        <p>
            <div className='agency-sidebar'>
                <i className="fa fa-chevron-right " style={{ fontSize: '14px' }}></i>
                <span className="ml-2" >
                    ORI - {ORINum || ""}
                    <p className='agency-name-sidebar'>{AgyName || ''}</p>
                </span>
            </div>
        </p>
    )
}

export default AgencySidebar
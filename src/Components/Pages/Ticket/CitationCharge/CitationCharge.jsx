import React, { useState, useEffect, useContext } from 'react'
import { AgencyContext } from '../../../../Context/Agency/Index';
import { Decrypt_Id_Name, base64ToString } from '../../../Common/Utility';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { get_LocalStoreData } from '../../../../redux/actions/Agency';
import CitationMainTab from '../../../Utility/Tab/CitationMainTab';
import Home from './CitationChargeTab/Home/Home';
import CitationCourtDisposition from './CitationChargeTab/CitationCourtDisposition/CitationCourtDisposition';
import CitationComments from './CitationChargeTab/CitationComments/CitationComments';
import CitationOffense from './CitationChargeTab/CitationOffense/CitationOffense';
import CitationPenalties from './CitationChargeTab/CitationPenalties/CitationPenalties';
import CitationWeapon from './CitationChargeTab/CitationWeapon/CitationWeapon';

const CitationCharge = () => {

  const dispatch = useDispatch()
  const localStoreData = useSelector((state) => state.Agency.localStoreData);
  const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';

  const { tabCount, get_ArrestCharge_Count, updateCount, changesStatus } = useContext(AgencyContext);

  const [showPage, setShowPage] = useState('home');
  const [status, setStatus] = useState(false)
  const [chargeID, setChargeID] = useState('');
  const iconHome = <i className="fa fa-home" style={{ fontSize: '20px' }}></i>


  useEffect(() => {
    if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
      if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
    }
  }, []);

  const useQuery = () => {
    const params = new URLSearchParams(useLocation().search);
    return {
      get: (param) => params.get(param)
    };
  };

  const query = useQuery();
  var ArrestId = query?.get('ArrestId');
  var ChargeId = query?.get('ChargeId');
  var ChargeSta = query?.get('ChargeSta');
  var ArrNo = query?.get('ArrNo');
  var ArrestSta = query?.get('ArrestSta');
  var Name = query?.get("Name");
  let MstPage = query?.get('page');

  var IncNo = query?.get("IncNo");
  var IncSta = query?.get("IncSta");
  var IncID = query?.get('IncId');

  let DecChargeId = 0, DecArrestId = 0, DecIncID = 0;

  if (!ArrestId) ArrestId = 0;
  else DecArrestId = parseInt(base64ToString(ArrestId));

  if (!IncID) IncID = 0;
  else DecIncID = parseInt(base64ToString(IncID));

  if (!ChargeId) ChargeId = 0;
  else DecChargeId = parseInt(base64ToString(ChargeId));

  useEffect(() => {
    if (ChargeSta === 'false' || ChargeSta === true) {
      setStatus(false)
      get_ArrestCharge_Count()
    } else {
      setStatus(true);
    }
  }, [ChargeSta, localStoreData, updateCount])

  return (
    <div className="section-body view_page_design pt-1 p-1 bt" >
      <div className="col-12  inc__tabs">
        <CitationMainTab />
      </div>
      <div className="dark-row" >
        <div className="col-12 col-sm-12">
          <div className="card Agency incident-card ">
            <div className="card-body" >
              <div className="row " style={{ marginTop: '-18px', marginLeft: '-18px' }}>
                <div className="col-12 incident-tab">
                  <ul className='nav nav-tabs'>
                    <Link
                      to={'/Citation-Charge-Home'}
                      className={`nav-item ${showPage === 'home' ? 'active' : ''}`}
                      data-toggle={changesStatus ? "modal" : "pill"}
                      data-target={changesStatus ? "#SaveModal" : ''}
                      style={{ color: showPage === 'home' ? 'Red' : 'gray' }}
                      aria-current="page"
                      onClick={() => { setShowPage('home') }}
                    >
                      {iconHome}
                    </Link>
                    <span
                      className={`nav-item ${showPage === 'CitationPenalties' ? 'active' : ''}${!status ? 'disabled' : ''}`}
                      data-toggle={changesStatus ? "modal" : "pill"}
                      data-target={changesStatus ? "#SaveModal" : ''}
                      style={{ color: showPage === 'CitationPenalties' ? 'Red' : 'gray' }}
                      aria-current="page" onClick={() => { if (!changesStatus) setShowPage('CitationPenalties') }} >
                      Penalties
                    </span>
                    <span
                      className={`nav-item ${showPage === 'CourtDisposition' ? 'active' : ''}${!status ? 'disabled' : ''}`}
                      data-toggle={changesStatus ? "modal" : "pill"}
                      data-target={changesStatus ? "#SaveModal" : ''}
                      style={{ color: showPage === 'CourtDisposition' ? 'Red' : 'gray' }}
                      aria-current="page" onClick={() => { if (!changesStatus) setShowPage('CourtDisposition') }} >
                      Court Disposition
                    </span>
                    <span
                      className={`nav-item ${showPage === 'CitationComments' ? 'active' : ''}${!status ? 'disabled' : ''}`}
                      data-toggle={changesStatus ? "modal" : "pill"}
                      data-target={changesStatus ? "#SaveModal" : ''}
                      style={{ color: showPage === 'CitationComments' ? 'Red' : 'gray' }}
                      aria-current="page" onClick={() => { if (!changesStatus) setShowPage('CitationComments') }} >
                      Comments
                    </span>
                    <span
                      className={`nav-item ${showPage === 'CitationWeapon' ? 'active' : ''}${!status ? 'disabled' : ''}`}
                      data-toggle={changesStatus ? "modal" : "pill"}
                      data-target={changesStatus ? "#SaveModal" : ''}
                      style={{ color: showPage === 'CitationWeapon' ? 'Red' : 'gray' }}
                      aria-current="page" onClick={() => { if (!changesStatus) setShowPage('CitationWeapon') }} >
                      Weapon
                    </span>
                    <span
                      className={`nav-item ${showPage === 'CitationOffense' ? 'active' : ''}${!status ? 'disabled' : ''}`}
                      data-toggle={changesStatus ? "modal" : "pill"}
                      data-target={changesStatus ? "#SaveModal" : ''}
                      style={{ color: showPage === 'CitationOffense' ? 'Red' : 'gray' }}
                      aria-current="page" onClick={() => { if (!changesStatus) setShowPage('CitationOffense') }} >
                      Offense
                    </span>
                  </ul>
                </div>
              </div>
              {
                showPage === 'home' ?
                  <Home />
                  :
                  showPage === 'CourtDisposition' ?
                    <CitationCourtDisposition />
                    :
                    showPage === 'CitationComments' ?
                      <CitationComments />
                      :
                      showPage === 'CitationOffense' ?
                        <CitationOffense />
                        :
                        showPage === 'CitationPenalties' ?
                          <CitationPenalties />
                          :
                          showPage === 'CitationWeapon' ?
                            <CitationWeapon />
                            :
                            <></>
              }
            </div>
          </div>
        </div>
      </div>
    </div >
  )
}

export default CitationCharge
import React, { useContext, useState } from 'react'
import CitationMainTab from '../../Utility/Tab/CitationMainTab'
import { AgencyContext } from '../../../Context/Agency/Index';
import { Link, useNavigate } from 'react-router-dom';
import Home from './CitationTab/Home/Home';
import CitationVehicle from './CitationTab/CitationVehicle/CitationVehicle';

const Citation = () => {
  const navigate = useNavigate()
  const { changesStatus, tabCount, get_MissingPerson_Count } = useContext(AgencyContext);
  const [status, setStatus] = useState();
  const [showIncPage, setShowIncPage] = useState('home');
  const [incidentReportedDate, setIncidentReportedDate] = useState(null);
  const [incidentId, setIncidentId] = useState('')
  const iconHome = <i className="fa fa-home" style={{ fontSize: '20px' }}></i>
  return (
    <div className="section-body view_page_design pt-1 p-1 bt" >
      <div className="div">
        <div className="col-12  inc__tabs">
          <CitationMainTab />
        </div>
        <div className="dark-row" >
          <div className="col-12 col-sm-12">
            <div className="card Agency incident-card ">
              <div className="card-body" >
                <div className="row " style={{ marginTop: '-18px', marginLeft: '-18px' }}>
                  <div className="col-12   incident-tab">
                    <ul className='nav nav-tabs'>
                      <Link
                        className={`nav-item ${showIncPage === 'home' ? 'active' : ''} `}
                        to={changesStatus ? `/Citation-Home` : `/Citation-Home`}
                        data-toggle={changesStatus ? "modal" : "pill"}
                        data-target={changesStatus ? "#SaveModal" : ''}
                        style={{ color: showIncPage === 'home' ? 'Red' : 'gray' }}
                        aria-current="page"
                        onClick={() => { if (!changesStatus) setShowIncPage('home') }}
                      >
                        {iconHome}
                      </Link>
                      <span
                        // className={`nav-item ${showIncPage === 'Vehicle' ? 'active' : ''}`}
                        className={`nav-item ${showIncPage === 'Vehicle' ? 'active' : ''}${!status ? 'disabled' : ''}`}
                        data-toggle={changesStatus ? "modal" : "pill"}
                        data-target={changesStatus ? "#SaveModal" : ''}
                        style={{ color: showIncPage === 'Vehicle' ? 'Red' : 'gray' }}
                        aria-current="page"
                        onClick={() => { if (!changesStatus) setShowIncPage('Vehicle') }}
                      >
                        Citation Vehicle
                      </span>
                    </ul>
                  </div>
                </div>
                {
                  showIncPage === 'home' ?
                    <Home />
                    :
                    showIncPage === 'Vehicle' ?
                      <CitationVehicle />
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

export default Citation
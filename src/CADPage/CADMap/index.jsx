import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef, useMemo, useContext } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Polygon } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './index.css';
import { IncidentContext } from '../../CADContext/Incident';
import isEqual from 'lodash.isequal'; // Import lodash.isequal for deep comparison
import { mapBoundary } from '../../CADUtils/constant/mapLatLong';
import ClearModal from '../../CADComponents/ClearModal';
import DispatcherModal from '../../CADComponents/DispatcherModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import ResourceViewModal from '../../CADComponents/ResourceViewModal';
import { useSelector, useDispatch } from 'react-redux';
import { getData_DropDown_Priority } from '../../CADRedux/actions/DropDownsData';

// Fix Leaflet default icon loading
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const FitBoundsView = () => {
  const map = useMap();

  useEffect(() => {
    const lewisvilleLatLngBounds = L.latLngBounds(mapBoundary);
    map.fitBounds(lewisvilleLatLngBounds);
  }, [map]);
  return null;
};

// Fullscreen control button component
const FullscreenControl = () => {
  const map = useMap();
  useEffect(() => {
    const fullscreenControl = L.control({ position: 'topleft' });
    fullscreenControl.onAdd = function () {
      const div = L.DomUtil.create('div', 'leaflet-bar fullscreen-control');
      div.innerHTML = '&#x26F6;';
      div.title = 'Toggle fullscreen';
      div.onclick = function () {
        const mapContainer = map.getContainer();
        if (!document.fullscreenElement) {
          mapContainer.requestFullscreen();
        } else if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      };
      return div;
    };
    fullscreenControl.addTo(map);
    return () => {
      map.removeControl(fullscreenControl);
    };
  }, [map]);
  return null;
};

// Back button component
const BackButtonControl = () => {
  const map = useMap();
  const navigate = useNavigate();

  useEffect(() => {
    const backButtonControl = L.control({ position: 'topleft' });

    backButtonControl.onAdd = function () {
      const div = L.DomUtil.create('div', 'leaflet-bar back-button-control');

      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'btn btn-sm btn-CADprimary';
      button.innerHTML = '<i class="fa fa-arrow-left" aria-hidden="true"></i>';

      button.onclick = function () {
        navigate('/cad/dashboard-page');
      };

      div.appendChild(button);
      return div;
    };

    backButtonControl.addTo(map);

    return () => {
      map.removeControl(backButtonControl);
    };
  }, [map, navigate]);

  return null;
};

// Main map component
const CADMap = () => {
  const dispatch = useDispatch();
  const PriorityDrpData = useSelector((state) => state.CADDropDown.PriorityDrpData);

  const [bounds, setBounds] = useState(null);
  const { incidentData } = useContext(IncidentContext);
  const [openClearModal, setOpenClearModal] = useState(false);
  const [openDispatcherModal, setOpenDispatcherModal] = useState(false);
  const [openResourceViewModal, setOpenResourceViewModal] = useState(false);
  const [incidentID, setIncidentID] = useState("");
  const [CADIncidentNumber, setCADIncidentNumber] = useState("");
  const useRouteQuery = () => {
    const params = new URLSearchParams(useLocation().search);
    return {
      get: (param) => params.get(param)
    };
  };
  const query = useRouteQuery();
  let AgencyID = query?.get("AgencyID");

  const previousIncidentDataRef = useRef(null);

  // Memoize valid locations derived from incidentData
  const validLocations = useMemo(() => {
    return incidentData
      ?.filter(loc => loc.Latitude && loc.Longitude)
      .map(loc => [loc.Latitude, loc.Longitude]) || [];
  }, [incidentData]);

  // Update bounds and markers only when incidentData changes
  useEffect(() => {
    // Only run the effect if incidentData has actually changed (deep comparison)
    if (!isEqual(previousIncidentDataRef.current, incidentData)) {
      if (validLocations.length > 0) {
        const newBounds = L.latLngBounds(validLocations);
        setBounds(newBounds);
      } else {
        setBounds(null);
      }

      previousIncidentDataRef.current = incidentData; // Store current data
    }
  }, [incidentData, validLocations]);

  useEffect(() => {
    if (PriorityDrpData?.length === 0 && AgencyID) dispatch(getData_DropDown_Priority(AgencyID))
  }, [AgencyID])

  // Function to determine the marker color based on PriorityCode
  const getMarkerColor = (priorityCode) => {
    const priority = PriorityDrpData.find(item => item.PriorityCode === priorityCode);
    return priority?.BackColor || '#ffffff'; // Default to white if color is not found
  };
  return (
    <>
      <MapContainer className="full-screen-map" center={[33.0462, -96.9942]} zoom={12}>
        <BackButtonControl />
        {bounds && <FitBoundsView bounds={bounds} />}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
        />
        <FullscreenControl />
        <Polygon
          positions={mapBoundary}
          pathOptions={{ fillColor: "transparent", color: "blue", weight: 2 }} // Customize border color and weight
        />

        {incidentData?.map((location, index) => (
          location.Latitude && location.Longitude && (
            <Marker
              key={index}
              position={[location.Latitude, location.Longitude]}
              icon={
                new L.DivIcon({
                  className: 'custom-marker',
                  html: `<div class="marker-container">
                 
                   <i class="fa fa-map-marker" style="font-size:48px;color:${!location.Resources ? '#00008e' : getMarkerColor(location?.PriorityCode)}"></i>
                  <div class="marker-wrapper">
                    <div class="marker-title">
                      ${location?.CrimeLocation?.length > 20 ? location?.CrimeLocation.slice(0, 30) + '...' : location.CrimeLocation}
                    </div>
                    ${location.CADIncidentNumber ? `<div class="marker-info">${location.CADIncidentNumber}</div>` : ''}

                   ${location.Resources
                      ? `<div class="marker-info">
                    ${location.Resources.split(',').length > 2
                        ? location.Resources.split(',').slice(0, 2).map(resource => `${resource}(${location.AgencyCode})`).join(', ') + '...'
                        : location.Resources.split(',').map(resource => `${resource}(${location.AgencyCode})`).join(', ')} 
                      </div>`
                      : ''
                    }
                    ${!location.Resources ? `<div class="marker-info"><span style="color:black; font-weight:semi-bold;">(Unassigned)</span></div>` : ""}
                    ${location.CFSCODE ? `<div class="marker-info"><span style="color:black; font-weight:semi-bold;">CFS Code:</span> <span style="color:#dd0303">${location.CFSCODE}</span></div>` : ''}
                  </div>
    </div > `,
                  iconSize: [25, 41],
                  iconAnchor: [12, 41],
                })
              }
            >
              <Popup>
                <div>
                  {location.CrimeLocation && <div class="marker-details"><strong>Location:</strong> {location.CrimeLocation} <br /></div>}
                  {location.CADIncidentNumber && (
                    <div className="marker-details">
                      <strong>CAD Event #:</strong>{' '}
                      <span
                        className="incident-link"
                        data-toggle="modal"
                        data-target="#clearModal"
                        onClick={() => { setOpenClearModal(true); setIncidentID(location?.IncidentID); }}
                        style={{ cursor: 'pointer', color: '#007bff', textDecoration: 'underline', marginRight: "5px" }}
                      >
                        {location.CADIncidentNumber}
                      </span>
                      {!location.Resources && <>(Unassigned)<span
                        className="incident-link"
                        data-toggle="modal"
                        data-target="#DispatcherModal"
                        onClick={() => setOpenDispatcherModal(true)}
                        style={{ cursor: 'pointer', color: '#007bff', textDecoration: 'underline' }}
                      >
                        <FontAwesomeIcon icon={faPlus} className="pl-1" />
                      </span></>}
                      <br />
                    </div>
                  )}
                  {location.Resources && (
                    <div class="marker-details">
                      <span
                        className="incident-link"
                        data-toggle="modal"
                        data-target="#resourceViewModal"
                        onClick={() => { setOpenResourceViewModal(true); setIncidentID(location?.IncidentID); setCADIncidentNumber(location?.CADIncidentNumber); }}
                        style={{ cursor: 'pointer', color: '#007bff', textDecoration: 'underline', marginRight: "5px" }}
                      >
                        <strong>Resources:</strong>
                      </span>
                      {location.Resources.split(',').map(resource => `${resource} (${location.AgencyCode})`).join(', ')}<span
                        className="incident-link"
                        data-toggle="modal"
                        data-target="#DispatcherModal"
                        onClick={() => { setOpenDispatcherModal(true); setIncidentID(location?.IncidentID); setCADIncidentNumber(location?.CADIncidentNumber); }}
                        style={{ cursor: 'pointer', color: '#007bff', textDecoration: 'underline' }}
                      >
                        <FontAwesomeIcon icon={faPlus} className="pl-1" />
                      </span>
                      <br />
                    </div>
                  )}
                  {location.CFSCodeDescription && <div class="marker-details"><strong>CFS Description:</strong> {location.CFSCodeDescription} <br /></div>}
                </div>
              </Popup>
            </Marker>
          )
        ))}

      </MapContainer>
      <ClearModal {...{ openClearModal, setOpenClearModal, incidentID }} />
      <DispatcherModal {...{ openDispatcherModal, setOpenDispatcherModal, incidentID }} />
      <ResourceViewModal {...{ openResourceViewModal, setOpenResourceViewModal, incidentID, CADIncidentNumber }} />
    </>
  );
};

export default CADMap;

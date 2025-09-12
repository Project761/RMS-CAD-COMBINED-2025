/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState, useRef, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import IncidentTableSection from "../../CADComponents/MonitorScreen/IncidentTableSection";
import ResourcesTableSection from "../../CADComponents/MonitorScreen/ResourcesTableSection";
import ResizableContainer from "../../CADComponents/Common/ResizableContainer";
import "./index.css";
import { IncidentContext } from "../../CADContext/Incident";
import Select from "react-select";
import { colourStyles } from "../../Components/Common/Utility";

const CADDashboard = (props) => {
  const { isIncidentDispatch } = props;
  const { resourceData, incidentData, assignedIncidentData, unassignedIncidentData } = useContext(IncidentContext);
  const [resources, setResources] = useState(resourceData)
  const [isActiveFiltered, setIsActiveFiltered] = useState(false);
  const [isALLFiltered, setIsALLFiltered] = useState(true);
  const [isAvailableFiltered, setIsAvailableFiltered] = useState(false);
  const [activeCount, setActiveCount] = useState(0)
  const [incidentActiveCount, setIncidentActiveCount] = useState(0)
  const [incidentUnAssignedCount, setIncidentUnAssignedCount] = useState(0)

  const [availableCount, setAvailableCount] = useState(0)
  const [unavailableCount, setUnavailableCount] = useState(0)
  const [incidentViewFilterStatus, setIncidentViewFilterStatus] = useState("All");
  const [incidentTableFilterIncId, setIncidentTableFilterIncId] = useState("");
  const [resourceTableFilterIncId, setResourceTableFilterIncId] = useState("");
  const [resourceTableFilterResourceId, setResourceTableFilterResourceId] = useState("");
  const [resourceFilterData, setResourceFilterData] = useState(resources)

  const incidentTableRef = useRef(null);
  const resourcesTableRef = useRef(null);
  const [incidentTableHeight, setIncidentTableHeight] = useState(900);
  const [resourcesTableHeight, setResourcesTableHeight] = useState(900);

  const observeSize = (element, setSize) => {
    if (!element) return;
    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        setSize(entry.contentRect.height);
      }
    });
    resizeObserver.observe(element);
    return () => resizeObserver.disconnect();
  };

  useEffect(() => {
    if (assignedIncidentData?.length > 0) {
      setIncidentActiveCount(assignedIncidentData?.length)
    }
    if (unassignedIncidentData?.length > 0) {
      setIncidentUnAssignedCount(unassignedIncidentData?.length)
    }
  }, [assignedIncidentData, unassignedIncidentData])
  useEffect(() => {
    if (resourceData?.length > 0) {
      setResources(resourceData)
    }
  }, [resourceData])

  useEffect(() => {
    if (resourceData?.length > 0) {
      const active = resourceData.filter(item => item.IncidentID !== null);
      setActiveCount(active.length);
      const available = resourceData.filter(item => item.Status === "AV");
      setAvailableCount(available.length)
      const unavailable = resourceData.filter(item => item.Status !== "AV");
      setUnavailableCount(unavailable.length)
    }
  }, [resourceData]);

  useEffect(() => {
    if (resourceData && isAvailableFiltered) {
      const available = resourceData.filter(item => item.Status === "AV");
      setResources(available);
    }
    if (resourceData && isActiveFiltered) {
      const active = resourceData.filter(item => item.IncidentID !== null);
      setResources(active);
    }
  }, [isAvailableFiltered, isActiveFiltered, resourceData])

  const handleActiveClick = () => {
    if (isActiveFiltered) {
      setResources(resourceData);
      setIsActiveFiltered(false);
    } else {
      const active = resourceData.filter(item => item.IncidentID !== null);
      setResources(active);
      setIsActiveFiltered(true);
      setIsAvailableFiltered(false);
      setIsALLFiltered(false);
    }
  };

  const handleAvailableClick = () => {
    if (isAvailableFiltered) {
      setResources(resourceData);
      setIsAvailableFiltered(false);
    } else {
      const available = resourceData.filter(item => item.Status === "AV");
      setResources(available);
      setIsAvailableFiltered(true);
      setIsActiveFiltered(false);
      setIsALLFiltered(false);
    }
  };
  const handleAllClick = () => {
    setResources(resourceData);
    setIsALLFiltered(true);
    setIsActiveFiltered(false);
    setIsAvailableFiltered(false);
  };

  useEffect(() => {
    const cleanupIncidentObserver = observeSize(incidentTableRef.current, setIncidentTableHeight);
    const cleanupResourcesObserver = observeSize(resourcesTableRef.current, setResourcesTableHeight);

    return () => {
      cleanupIncidentObserver && cleanupIncidentObserver();
      cleanupResourcesObserver && cleanupResourcesObserver();
    };
  }, [incidentTableRef, resourcesTableRef]);

  const getButtonStyle = (status) => ({
    color: incidentViewFilterStatus === status ? "#212529" : "",
    backgroundColor: incidentViewFilterStatus === status ? "#f8f9fa" : "",
  });

  useEffect(() => {
    let data;

    if (resourceTableFilterIncId || resourceTableFilterResourceId) {
      data = resources.filter(
        (i) =>
          (!resourceTableFilterIncId || i?.CADIncidentNumber === resourceTableFilterIncId) &&
          (!resourceTableFilterResourceId || i?.ResourceID === resourceTableFilterResourceId)
      );
      return setResourceFilterData(data);
    }

    return setResourceFilterData(resources);
  }, [resources, resourceData, resourceTableFilterIncId, resourceTableFilterResourceId]);

  return (
    <>
      <div className="section-body view_page_design">
        <div className="dashboard-main-container">
          <div className="incident-view-container">
            <div className='header-Container d-flex justify-content-between align-items-center'>
              <span style={{ fontSize: "16px" }}>{'Event View'}</span>
              <div className='d-flex' style={{ fontSize: "12px", }}>
                <div className='d-flex align-content-center justify-content-start table-header-status' style={{ color: "white", }}>
                  <div className='d-flex'>
                    <span>Unassigned</span>
                    <span>{incidentUnAssignedCount}</span>
                  </div>
                  <div className='d-flex'>
                    <span>Active</span>
                    <span>{incidentActiveCount}</span>
                  </div>
                </div>
                <div className='d-flex align-content-center justify-content-end table-header-buttons'>
                  <button
                    style={getButtonStyle("All")}
                    onClick={() => setIncidentViewFilterStatus("All")}
                  >
                    All
                  </button>
                  <button
                    style={getButtonStyle("Assigned")}
                    onClick={() => setIncidentViewFilterStatus("Assigned")}
                  >
                    Assigned
                  </button>
                  <button
                    style={getButtonStyle("Unassigned")}
                    onClick={() => setIncidentViewFilterStatus("Unassigned")}
                  >
                    Unassigned
                  </button>

                  <span style={{ color: "white", marginTop: "6px" }}>Incident Filter</span>
                  <Select
                    name="Incident"
                    styles={{
                      ...colourStyles,
                      container: (base) => ({
                        ...base,
                        width: 200, // Set fixed width here
                      }),
                      menu: (base) => ({
                        ...base,
                        zIndex: 1050, // Increase the z-index value here
                      }),
                    }}
                    isClearable
                    options={incidentData}
                    value={incidentData?.find((i) => i?.IncidentID === incidentTableFilterIncId)}
                    getOptionLabel={(v) => v?.CADIncidentNumber}
                    getOptionValue={(v) => v?.IncidentID}
                    onChange={(e) => setIncidentTableFilterIncId(e?.CADIncidentNumber)}
                    placeholder="Select..."

                  />

                </div>
              </div>
            </div>
            <ResizableContainer maxHeight={incidentTableHeight} defaultHeight={"0.4"}>
              <div ref={incidentTableRef}>
                <IncidentTableSection isIncidentDispatch={isIncidentDispatch} incidentViewFilterStatus={incidentViewFilterStatus} incidentTableFilterIncId={incidentTableFilterIncId} />
              </div>
            </ResizableContainer>
          </div>

          {/* Unit */}
          <div className="resources-view-container">
            <div className='header-Container d-flex justify-content-between align-items-center'>
              <span style={{ fontSize: "16px", }}>{'Unit View'}</span>
              <div className='d-flex' style={{ fontSize: "12px", }}>
                <div className='d-flex align-content-center justify-content-start table-header-status' style={{ color: "white", }}>
                  <div className='d-flex'>
                    <span>Active</span>
                    <span>{activeCount}</span>
                  </div>
                  <div className='d-flex'>
                    <span>Available</span>
                    <span>{availableCount}</span>
                  </div>
                  <div className='d-flex'>
                    <span>Unavailable</span>
                    <span>{unavailableCount}</span>
                  </div>
                </div>
                <div className='d-flex align-content-center justify-content-end table-header-buttons'>
                  <button style={{ color: isALLFiltered ? "#212529" : "", backgroundColor: isALLFiltered ? "#f8f9fa" : "" }} onClick={handleAllClick}>All</button>
                  <button style={{ color: isActiveFiltered ? "#212529" : "", backgroundColor: isActiveFiltered ? "#f8f9fa" : "" }} onClick={handleActiveClick}>Active</button>
                  <button style={{ color: isAvailableFiltered ? "#212529" : "", backgroundColor: isAvailableFiltered ? "#f8f9fa" : "" }} onClick={handleAvailableClick}>Available</button>
                </div>
                <div className='d-flex align-content-center justify-content-end table-header-buttons ml-2'>
                  <span style={{ color: "white", marginTop: "6px" }}>Incident Filter</span>
                  <Select
                    name="Incident"
                    styles={{
                      ...colourStyles,
                      container: (base) => ({
                        ...base,
                        width: 200,
                      }),
                      menu: (base) => ({
                        ...base,
                        zIndex: 1050,
                      }),
                    }}
                    isClearable
                    options={assignedIncidentData}
                    value={assignedIncidentData?.find((i) => i?.IncidentID === resourceTableFilterIncId)}
                    getOptionLabel={(v) => v?.CADIncidentNumber}
                    getOptionValue={(v) => v?.IncidentID}
                    onChange={(e) => setResourceTableFilterIncId(e?.CADIncidentNumber)}
                    placeholder="Select..."

                  />
                  <span style={{ color: "white", marginTop: "6px" }}>Unit Filter</span>
                  <Select
                    name="Incident"
                    styles={{
                      ...colourStyles,
                      container: (base) => ({
                        ...base,
                        width: 200,
                      }),
                      menu: (base) => ({
                        ...base,
                        zIndex: 1050,
                      }),
                    }}
                    isClearable
                    options={resourceData}
                    value={resourceData?.find((i) => i?.IncidentID === resourceTableFilterIncId)}
                    getOptionLabel={(v) => v?.ResourceNumber}
                    getOptionValue={(v) => v?.ResourceID}
                    onChange={(e) => setResourceTableFilterResourceId(e?.ResourceID)}
                    placeholder="Select..."

                  />
                </div>
              </div>
            </div>
            <ResizableContainer maxHeight={resourcesTableHeight} defaultHeight={"0.5"}>
              <div ref={resourcesTableRef}>
                <ResourcesTableSection resources={resourceFilterData} />
              </div>
            </ResizableContainer>
          </div>
        </div>
      </div >
    </>
  );
};

CADDashboard.propTypes = {
  isIncidentDispatch: PropTypes.bool
};

CADDashboard.defaultProps = {
  isIncidentDispatch: false
};

export default CADDashboard;

/* eslint-disable jsx-a11y/anchor-is-valid */
import { useState, useRef, useEffect, useContext, useMemo, useCallback } from "react";
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

  // Consolidated filter state
  const [resourceFilter, setResourceFilter] = useState({
    type: 'all', // 'all', 'active', 'available'
    incidentId: '',
    resourceId: ''
  });

  const [incidentFilter, setIncidentFilter] = useState({
    status: 'All', // 'All', 'Assigned', 'Unassigned'
    incidentId: ''
  });

  // Table heights
  const [tableHeights, setTableHeights] = useState({
    incident: 900,
    resources: 900
  });

  // Refs
  const incidentTableRef = useRef(null);
  const resourcesTableRef = useRef(null);

  // Computed values using useMemo
  const resourceCounts = useMemo(() => {
    if (!resourceData?.length) return { active: 0, available: 0, unavailable: 0 };

    const active = resourceData.filter(item => item.IncidentID !== null).length;
    const available = resourceData.filter(item => item.Status === "AV").length;
    const unavailable = resourceData.length - available;

    return { active, available, unavailable };
  }, [resourceData]);

  const incidentCounts = useMemo(() => ({
    active: assignedIncidentData?.length || 0,
    unassigned: unassignedIncidentData?.length || 0
  }), [assignedIncidentData, unassignedIncidentData]);

  const filteredResources = useMemo(() => {
    if (!resourceData?.length) return [];

    let filtered = resourceData;

    // Apply type filter
    switch (resourceFilter.type) {
      case 'active':
        filtered = filtered.filter(item => item.IncidentID !== null);
        break;
      case 'available':
        filtered = filtered.filter(item => item.Status === "AV");
        break;
      default:
        // 'all' - no additional filtering
        break;
    }

    // Apply incident ID filter
    if (resourceFilter.incidentId) {
      filtered = filtered.filter(item => item.CADIncidentNumber === resourceFilter.incidentId);
    }

    // Apply resource ID filter
    if (resourceFilter.resourceId) {
      filtered = filtered.filter(item => item.ResourceID === resourceFilter.resourceId);
    }

    return filtered;
  }, [resourceData, resourceFilter]);

  const observeSize = useCallback((element, setSize) => {
    if (!element) return;
    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        setSize(entry.contentRect.height);
      }
    });
    resizeObserver.observe(element);
    return () => resizeObserver.disconnect();
  }, []);

  // Optimized event handlers
  const handleResourceFilterChange = useCallback((filterType) => {
    setResourceFilter(prev => ({
      ...prev,
      type: prev.type === filterType ? 'all' : filterType
    }));
  }, []);

  const handleIncidentFilterChange = useCallback((status) => {
    setIncidentFilter(prev => ({
      ...prev,
      status
    }));
  }, []);

  const handleIncidentIdChange = useCallback((incidentId) => {
    setIncidentFilter(prev => ({
      ...prev,
      incidentId: incidentId || ''
    }));
  }, []);

  const handleResourceIncidentIdChange = useCallback((incidentId) => {
    setResourceFilter(prev => ({
      ...prev,
      incidentId: incidentId || ''
    }));
  }, []);

  const handleResourceIdChange = useCallback((resourceId) => {
    setResourceFilter(prev => ({
      ...prev,
      resourceId: resourceId || ''
    }));
  }, []);

  // Table height observer effect
  useEffect(() => {
    const cleanupIncidentObserver = observeSize(incidentTableRef.current, (height) =>
      setTableHeights(prev => ({ ...prev, incident: height }))
    );
    const cleanupResourcesObserver = observeSize(resourcesTableRef.current, (height) =>
      setTableHeights(prev => ({ ...prev, resources: height }))
    );

    return () => {
      cleanupIncidentObserver && cleanupIncidentObserver();
      cleanupResourcesObserver && cleanupResourcesObserver();
    };
  }, [observeSize]);

  // Memoized button style functions
  const getButtonStyle = useCallback((status) => ({
    color: incidentFilter.status === status ? "#212529" : "",
    backgroundColor: incidentFilter.status === status ? "#f8f9fa" : "",
  }), [incidentFilter.status]);

  const getResourceButtonStyle = useCallback((filterType) => ({
    color: resourceFilter.type === filterType ? "#212529" : "",
    backgroundColor: resourceFilter.type === filterType ? "#f8f9fa" : "",
  }), [resourceFilter.type]);

  // Memoized select styles
  const selectStyles = useMemo(() => ({
    ...colourStyles,
    container: (base) => ({
      ...base,
      width: 200,
    }),
    menu: (base) => ({
      ...base,
      zIndex: 1050,
    }),
  }), []);

  return (
    <>
      <div className="section-body view_page_design">
        <div className="dashboard-main-container">
          <div className="incident-view-container">
            <div className='header-Container d-flex justify-content-between align-items-center'>
              <span style={{ fontSize: "16px" }}>Event View</span>
              <div className='d-flex' style={{ fontSize: "12px", }}>
                <div className='d-flex align-content-center justify-content-start table-header-status' style={{ color: "white", }}>
                  <div className='d-flex'>
                    <span>Unassigned</span>
                    <span>{incidentCounts.unassigned}</span>
                  </div>
                  <div className='d-flex'>
                    <span>Active</span>
                    <span>{incidentCounts.active}</span>
                  </div>
                </div>
                <div className='d-flex align-content-center justify-content-end table-header-buttons'>
                  <button
                    style={getButtonStyle("All")}
                    onClick={() => handleIncidentFilterChange("All")}
                  >
                    All
                  </button>
                  <button
                    style={getButtonStyle("Assigned")}
                    onClick={() => handleIncidentFilterChange("Assigned")}
                  >
                    Assigned
                  </button>
                  <button
                    style={getButtonStyle("Unassigned")}
                    onClick={() => handleIncidentFilterChange("Unassigned")}
                  >
                    Unassigned
                  </button>

                  <span style={{ color: "white", marginTop: "6px" }}>Incident Filter</span>
                  <Select
                    name="Incident"
                    styles={selectStyles}
                    isClearable
                    options={incidentData}
                    value={incidentData?.find((i) => i?.IncidentID === incidentFilter.incidentId)}
                    getOptionLabel={(v) => v?.CADIncidentNumber}
                    getOptionValue={(v) => v?.IncidentID}
                    onChange={(e) => handleIncidentIdChange(e?.CADIncidentNumber)}
                    placeholder="Select..."

                  />

                </div>
              </div>
            </div>
            <ResizableContainer maxHeight={tableHeights.incident} defaultHeight={"0.4"}>
              <div ref={incidentTableRef}>
                <IncidentTableSection
                  isIncidentDispatch={isIncidentDispatch}
                  incidentViewFilterStatus={incidentFilter.status}
                  incidentTableFilterIncId={incidentFilter.incidentId}
                />
              </div>
            </ResizableContainer>
          </div>

          {/* Unit */}
          <div className="resources-view-container">
            <div className='header-Container d-flex justify-content-between align-items-center'>
              <span style={{ fontSize: "16px" }}>Unit View</span>
              <div className='d-flex' style={{ fontSize: "12px", }}>
                <div className='d-flex align-content-center justify-content-start table-header-status' style={{ color: "white", }}>
                  <div className='d-flex'>
                    <span>Active</span>
                    <span>{resourceCounts.active}</span>
                  </div>
                  <div className='d-flex'>
                    <span>Available</span>
                    <span>{resourceCounts.available}</span>
                  </div>
                  <div className='d-flex'>
                    <span>Unavailable</span>
                    <span>{resourceCounts.unavailable}</span>
                  </div>
                </div>
                <div className='d-flex align-content-center justify-content-end table-header-buttons'>
                  <button
                    style={getResourceButtonStyle('all')}
                    onClick={() => handleResourceFilterChange('all')}
                  >
                    All
                  </button>
                  <button
                    style={getResourceButtonStyle('active')}
                    onClick={() => handleResourceFilterChange('active')}
                  >
                    Active
                  </button>
                  <button
                    style={getResourceButtonStyle('available')}
                    onClick={() => handleResourceFilterChange('available')}
                  >
                    Available
                  </button>
                </div>
                <div className='d-flex align-content-center justify-content-end table-header-buttons ml-2'>
                  <span style={{ color: "white", marginTop: "6px" }}>Incident Filter</span>
                  <Select
                    name="Incident"
                    styles={selectStyles}
                    isClearable
                    options={assignedIncidentData}
                    value={assignedIncidentData?.find((i) => i?.IncidentID === resourceFilter.incidentId)}
                    getOptionLabel={(v) => v?.CADIncidentNumber}
                    getOptionValue={(v) => v?.IncidentID}
                    onChange={(e) => handleResourceIncidentIdChange(e?.CADIncidentNumber)}
                    placeholder="Select..."

                  />
                  <span style={{ color: "white", marginTop: "6px" }}>Unit Filter</span>
                  <Select
                    name="Unit"
                    styles={selectStyles}
                    isClearable
                    options={resourceData}
                    value={resourceData?.find((i) => i?.ResourceID === resourceFilter.resourceId)}
                    getOptionLabel={(v) => v?.ResourceNumber}
                    getOptionValue={(v) => v?.ResourceID}
                    onChange={(e) => handleResourceIdChange(e?.ResourceID)}
                    placeholder="Select..."

                  />
                </div>
              </div>
            </div>
            <ResizableContainer maxHeight={tableHeights.resources} defaultHeight={"0.5"}>
              <div ref={resourcesTableRef}>
                <ResourcesTableSection resources={filteredResources} />
              </div>
            </ResizableContainer>
          </div>
        </div>
      </div>
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

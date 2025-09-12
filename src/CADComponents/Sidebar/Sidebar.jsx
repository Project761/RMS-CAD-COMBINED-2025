import React from "react";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import ReportSidebar from "../SidebarCom/ReportSidebar";

const Sidebar = (props) => {

  // useNoBackNavigation();
  const { reportSidebar } = props

  const useQuery = () => new URLSearchParams(useLocation().search);
  const query = useQuery();
  let openPage = query?.get('page');

  return (
    <>
      <div id="left-sidebar" className="sidebar" style={{ top: "auto" }}>
        <nav id="left-sidebar-nav" className="sidebar-nav">
          <div className="">
            <h5 className="brand-name text-center" >
              GoldLine{" "}
            </h5>
          </div>
          <ul className="metismenu ">
            {
              reportSidebar && <ReportSidebar />
            }

          </ul>
        </nav>
      </div>
    </>
  );
};


export default Sidebar;

// PropTypes definition
Sidebar.propTypes = {
  reportSidebar: PropTypes.bool
};

// Default props
Sidebar.defaultProps = {
  reportSidebar: false
};

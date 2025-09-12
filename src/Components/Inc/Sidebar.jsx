import { useLocation } from "react-router-dom";
import IncSidebar from "./SidebarCom/IncSidebar";
import DashboardSidebar from "./SidebarCom/DashboardSidebar";
import ListMangSidebar from "./SidebarCom/ListMangSidebar";
import AgencySidebar from "./SidebarCom/AgencySidebar";
import PersonnelSidebar from "./SidebarCom/PersonnelSidebar";
import ReportSidebar from "./SidebarCom/ReportSidebar";
import SearchSidebar from "./SidebarCom/SearchSidebar";
import ConsolidationSidebar from "./SidebarCom/ConsolidationSidebar";
import PropertyRoomSideBar from "./SidebarCom/PropertyRoomSidebar";
import ExpungeSidebar from "./SidebarCom/ExpungeSidebar";
import PropertyRoomStorageSidebar from "./SidebarCom/PropertyRoomStorageSidebar";

const Sidebar = (props) => {

  // useNoBackNavigation();
  const { listManagementSideBar, agencySideBar, propertyStorageSideBar, propertyRoomSideBar, personnelSideBar, incidentSideBar, dashboardSidebar, reportSidebar, searchSidebar, consolidationSideBar, expungeSideBar } = props

  const useQuery = () => new URLSearchParams(useLocation().search);
  const query = useQuery();

  return (
    <>
      <div id="left-sidebar" className="sidebar ">
        <nav id="left-sidebar-nav" className="sidebar-nav">
          <div className="">
            <h5 className="brand-name text-center" >
              GoldLine{" "}
            </h5>
          </div>
          <ul className="metismenu ">
            {
              dashboardSidebar && <DashboardSidebar />
            }
            {
              incidentSideBar && < IncSidebar />
            }
            {
              agencySideBar && <AgencySidebar />
            }
            {
              propertyRoomSideBar && <PropertyRoomSideBar />
            }
            {
              consolidationSideBar && <ConsolidationSidebar />
            }
            {
              expungeSideBar && <ExpungeSidebar />
            }
            {
              propertyStorageSideBar && <PropertyRoomStorageSidebar />
            }

            {
              personnelSideBar && <PersonnelSidebar />
            }
            {
              listManagementSideBar && <ListMangSidebar />
            }
            {
              searchSidebar && <SearchSidebar />
            }
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

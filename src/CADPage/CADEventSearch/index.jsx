import TitleCmp from '../../CADComponents/Common/TitleCmp'
import IncidentTabSection from '../../CADComponents/MonitorScreen/TabSections/IncidentTabSection'

function CADEventSearch() {
    return (
        <div className="section-body view_page_design">
            <div className="dashboard-main-container">
                <div className="dispatcher-container">
                    <TitleCmp title={"CAD Event Search Details"} />
                    <div className="tab-controller-container">
                        <IncidentTabSection />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CADEventSearch
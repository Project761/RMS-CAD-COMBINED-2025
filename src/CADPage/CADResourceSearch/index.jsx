import TitleCmp from '../../CADComponents/Common/TitleCmp'
import ResourceStatusTabSection from '../../CADComponents/MonitorScreen/TabSections/ResourceStatusTabSection'

function CADResourceSearch() {
    return (
        <div className="section-body view_page_design">
            <div className="dashboard-main-container">
                <div className="dispatcher-container">
                    <TitleCmp title={"CAD Unit Status Search Details"} />
                    <div className="tab-controller-container">
                        <ResourceStatusTabSection />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CADResourceSearch
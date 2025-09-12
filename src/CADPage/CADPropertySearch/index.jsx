import TitleCmp from '../../CADComponents/Common/TitleCmp'
import Property_Tabs from '../../Components/Pages/Property/Property_Tabs'

function CADPropertySearch() {
    return (
        <div className="section-body view_page_design">
            <div className="dashboard-main-container">
                <div className="dispatcher-container">
                    <TitleCmp title={"CAD Property Search Details"} />
                    <div className="tab-controller-container">
                        <Property_Tabs isCad isCADSearch />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CADPropertySearch
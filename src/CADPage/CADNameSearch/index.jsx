import TitleCmp from '../../CADComponents/Common/TitleCmp'
import NameTab from '../../Components/Pages/Name/NameTab'

function CADNameSearch() {
    return (
        <div className="section-body view_page_design">
            <div className="dashboard-main-container">
                <div className="dispatcher-container">
                    <TitleCmp title={"CAD Name Search Details"} />
                    <div className="tab-controller-container">
                        <NameTab isCad isCADSearch />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CADNameSearch
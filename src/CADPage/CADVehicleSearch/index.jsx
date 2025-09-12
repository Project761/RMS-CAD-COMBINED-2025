import TitleCmp from '../../CADComponents/Common/TitleCmp'
import Vehicle_Add_Up from '../../Components/Pages/Vehicle/Vehicle_Add_Up'

function CADVehicleSearch() {
    return (
        <div className="section-body view_page_design">
            <div className="dashboard-main-container">
                <div className="dispatcher-container">
                    <TitleCmp title={"CAD Vehicle Search Details"} />
                    <div className="tab-controller-container">
                        <Vehicle_Add_Up isCad isCADSearch />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CADVehicleSearch
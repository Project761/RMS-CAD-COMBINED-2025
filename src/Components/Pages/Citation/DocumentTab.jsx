import TabCitation from '../../Utility/Tab/TabCitation'
import Document_Add_Up from '../Document/Document_Add_Up'

function DocumentTab() {
    return (
        <div className="section-body pt-1 p-1 bt" >
            <div className="div">
                <div className="col-12  inc__tabs">
                    <TabCitation />
                </div>
                <div className="dark-row" >
                    <div className="col-12 col-sm-12">
                        <div className="card Agency incident-card-citation">
                            <div className="card-body p-0">
                                <Document_Add_Up isCad isCitation isViewEventDetails={false} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DocumentTab
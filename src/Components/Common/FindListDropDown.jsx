import { Link } from 'react-router-dom'

const FindListDropDown = (props) => {
    const { array } = props

    return (


        <div className="item-action dropdown ml-3 ">
            <a data-toggle="dropdown" aria-expanded="false" style={{ fontSize: '20px', cursor: 'pointer' }}>
                <i className="fa fa-ellipsis-v"></i>
            </a>
            <div className="item-action dropdown ml-3 ">
                <div className="dropdown-menu dropdown-menu-right "
                    style={{ position: 'absolute', transform: 'translate3d(-174px, 0px, 0px)', top: 0, left: 0, willChange: 'transform', marginTop: '-15px', overflowY: 'auto', maxHeight: '500px' }}>
                    {
                        array?.map((item) => (
                            <Link key={item.tab} to={`/ListManagement?page=${item.page}&call=${item.call}`} className="dropdown-item"><i className="dropdown-icon fa fa-share-alt"  />
                                {item.tab}
                            </Link>
                        ))
                    }
                </div>
            </div>
        </div>

    )
}

export default FindListDropDown
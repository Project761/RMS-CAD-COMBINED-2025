import { Link } from "react-router-dom";

const PropertyRoomStorageSidebar = () => {



    return (
        <>

            <li>
                <Link to="/Property-Room-Storage" className="" >
                    <span className="ml-3">Property Room Storage</span></Link>
                <Link to="/Non-Property-Room-Storage" className=""  >
                    <span className="ml-3">Non Property Room Storage</span></Link>

            </li>
        </>
    )
}

export default PropertyRoomStorageSidebar
import { Link } from "react-router-dom";

const ExpungeSidebar = () => {

    return (
        <>

            <li>
                <Link to="/Expunge" className="" >
                    <span className="ml-3">Expunge</span></Link>
                <Link to="/UnExpunge" className=""  >
                    <span className="ml-3">Unexpunge</span></Link>

            </li>
        </>
    )
}

export default ExpungeSidebar
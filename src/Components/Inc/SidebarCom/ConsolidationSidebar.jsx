import { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, } from "@fortawesome/free-solid-svg-icons";

const ConsolidationSidebar = () => {

    const [expand, setExpand] = useState()
    const [expandList, setExpandList] = useState()
    const [plusMinus, setPlusMinus] = useState(false)
    const [plusMinus1, setPlusMinus1] = useState(false)
    const [plusMinus2, setPlusMinus2] = useState(false)
    const [plusMinus3, setPlusMinus3] = useState(false)

    const callUtilityModules = (type, val) => {
        if (type === 'List') {
            setPlusMinus(!plusMinus);
            setPlusMinus1(!plusMinus1)
            setPlusMinus2(!plusMinus2)
            setPlusMinus3(!plusMinus3)
            setExpand(expand ? expand[0].id === val ? { id: val } : '' : { id: val })
        } else {
            setPlusMinus(!plusMinus);
            setExpandList(expandList === val ? '' : val);
        }
    }
    const [activeItem, setActiveItem] = useState('');

    const handleItemClick = (itemName) => {
        setActiveItem(itemName);
    };
    return (
        <>
            <li>
                <Link to="#" className="has-arrow arrow-c" aria-expanded={plusMinus} onClick={() => callUtilityModules('Table', 'Master Table')}>
                    <span className="ml-3">Consolidation Info.</span></Link>
                <ul id="menu" role="menu" className={`${expandList === 'Master Table' ? 'collapse in' : 'collapse'}`} style={{ marginLeft: '-23px' }}>
                    <li className={`ml-2 p-0 ${activeItem === 'Name Consolidation' ? 'active' : ''}`}>
                        <Link to={`/Name-Consolidation`} onClick={() => handleItemClick('Name Consolidation')}>
                            <FontAwesomeIcon icon={faHouse} className="react-icon pl-1" />
                            <span className="m-0 p-0 pl-3">Name Consolidation </span>
                        </Link>
                    </li>
                    <li className={`ml-2 p-0 ${activeItem === 'Property Consolidation' ? 'active' : ''}`}>
                        <Link to={`/Property-Consolidation`} onClick={() => handleItemClick('Property Consolidation')}>
                            <FontAwesomeIcon icon={faHouse} className="react-icon pl-1" />
                            <span className="m-0 p-0 pl-3">Property Consolidation </span>
                        </Link>
                    </li>
                    <li className={`ml-2 p-0 ${activeItem === 'Vehicle Consolidation' ? 'active' : ''}`}>
                        <Link to={`/Vehicle-Consolidation`} onClick={() => handleItemClick('Vehicle Consolidation')}>
                            <FontAwesomeIcon icon={faHouse} className="react-icon pl-1" />
                            <span className="m-0 p-0 pl-3">Vehicle Consolidation </span>
                        </Link>
                    </li>
                </ul>
            </li>
            <li>
                <Link to="#" className="has-arrow arrow-c" aria-expanded={plusMinus1} onClick={() => callUtilityModules('Table1', 'Master Table1')}>
                    <span className="ml-3">Unconsolidation Info.</span></Link>
                <ul id="menu" role="menu" className={`${expandList === 'Master Table1' ? 'collapse in' : 'collapse'}`} style={{ marginLeft: '-23px' }}>
                    <li className="ml-2 p-0">
                        <Link to={`/UnConsolidation`}>
                            <FontAwesomeIcon icon={faHouse} className="react-icon pl-1" />
                            <span className="m-0 p-0 pl-3">Unconsolidation </span>
                        </Link>
                    </li>

                </ul>
            </li>
        </>
    )
}

export default ConsolidationSidebar
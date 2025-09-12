import { useLocation, } from 'react-router-dom'

const PersonnelSidebar = () => {

    const useQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };

    const query = useQuery();
    var perName = query?.get("perName");


    return (
        <p>
            <div className="row px-1">
                <div className="col-12 pb-3" >
                    <span className="ml-3">{perName ? perName : 'Personnel Name'}</span>
                </div>
            </div>
        </p>
    )
}

export default PersonnelSidebar
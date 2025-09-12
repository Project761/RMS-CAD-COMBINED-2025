import axios from "axios";
class OperatorServices {
    searchOperator = async (payload) => {
        if (payload) {
            return await axios.post(`/CAD/Operator_search/Operator`, payload);
        }
        console.warn("payload not provided, ResourcesStatusServices.searchOperator");
        return null;
    };

}

const instance = new OperatorServices();

export default instance;

import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { base64ToString, getShowingDateText, tableCustomStyles } from '../../Components/Common/Utility';
import DataTable from 'react-data-table-component';
import { compareStrings } from '../../CADUtils/functions/common';
import { useQuery } from 'react-query';
import IncidentServices from '../../CADServices/APIs/incident';
import { useSelector } from 'react-redux';


function PinActivityTab() {


    const localStoreData = useSelector((state) => state.Agency.localStoreData);
    const [pinData, setPinData] = useState([]);
    const [loginAgencyID, setLoginAgencyID] = useState("");


    const useRouteQuery = () => {
        const params = new URLSearchParams(useLocation().search);
        return {
            get: (param) => params.get(param)
        };
    };

    const query = useRouteQuery();
    let IncID = query?.get("IncId");
    if (!IncID) IncID = 0;
    else IncID = parseInt(base64ToString(IncID));

    useEffect(() => {
        if (localStoreData) {
            setLoginAgencyID(localStoreData?.AgencyID);
        }
    }, [localStoreData]);

    const getPinActivityKey = `/CAD/Monitor/MasterBoloDispositionGet/${IncID}`;

    const { data: pinActivityData, isSuccess: isFetchPinActivity, isError: isNoData } = useQuery(
        [getPinActivityKey, {
            "IncidentID": IncID,
            AgencyID: loginAgencyID
        },],
        IncidentServices.getPinActivity,
        {
            refetchOnWindowFocus: false,
            retry: 0,
            enabled: IncID !== 0 && !!IncID,
        }
    );

    useEffect(() => {
        if (pinActivityData && isFetchPinActivity) {
            const data = JSON.parse(pinActivityData?.data?.data);
            setPinData(data?.Table)
        }
    }, [pinActivityData, isFetchPinActivity])

    const columns = [
        {
            name: 'Unit #',
            selector: row => row?.ResourceNumber,
            sortable: true,
            sortFunction: (rowA, rowB) => compareStrings(rowA?.ResourceNumber, rowB?.ResourceNumber),
            width: "20%",
            style: {
                position: "static",
            },
        },
        {
            name: 'Date/Time',
            selector: row => row?.OnDutyDT ? getShowingDateText(row?.OnDutyDT) : "",
            sortable: true,
            sortFunction: (rowA, rowB) => compareStrings(rowA?.OnDutyDT, rowB?.OnDutyDT),
            style: {
                position: "static",
            },
        },
        {
            name: 'Primary Officer',
            selector: row => row?.Officer1,
            sortable: true,
            sortFunction: (rowA, rowB) => compareStrings(rowA?.Officer1, rowB?.Officer1),
            style: {
                position: "static",
            },
        },
        {
            name: 'Secondary Officer',
            selector: row => row?.Officer2,
            sortable: true,
            sortFunction: (rowA, rowB) => compareStrings(rowA?.Officer2, rowB?.Officer2),
            style: {
                position: "static",
            },
        },
        {
            name: 'Shift',
            selector: row => row?.ShiftCode && row?.ShiftDescription ? row?.ShiftCode + " | " + row?.ShiftDescription : "",
            sortable: true,
            sortFunction: (rowA, rowB) => compareStrings(rowA?.ShiftCode, rowB?.ShiftCode),
            style: {
                position: "static",
            },
        },
    ];


    return (
        <div className="table-responsive">
            <DataTable
                dense
                columns={columns}
                data={pinData}
                customStyles={tableCustomStyles}
                pagination
                responsive
                noDataComponent={isNoData ? "There are no data to display" : 'There are no data to display'}
                striped
                persistTableHead={true}
                highlightOnHover
                fixedHeader
            />
        </div>
    )
}

export default PinActivityTab
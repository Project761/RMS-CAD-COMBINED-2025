import { useContext, useEffect, useState } from 'react';
import { getShowingDateText, stringToBase64 } from '../../../Components/Common/Utility';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import DateTimeCounter from '../../Common/DateTimeCounter';
import { IncidentContext } from '../../../CADContext/Incident';
import CommentsModal from '../../CommentsModal';
import { compareStrings } from '../../../CADUtils/functions/common';
import Tooltip from '../../Common/Tooltip';
import MonitorServices from '../../../CADServices/APIs/monitor'
import { useSelector, useDispatch } from 'react-redux';
import { useQuery } from 'react-query';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { getData_DropDown_Priority } from '../../../CADRedux/actions/DropDownsData';

const IncidentTableSection = ({ isIncidentDispatch, incidentViewFilterStatus, incidentTableFilterIncId }) => {

  const dispatch = useDispatch();
  const { incidentData, assignedIncidentData, unassignedIncidentData } = useContext(IncidentContext);
  const localStoreData = useSelector((state) => state.Agency.localStoreData);
  const PriorityDrpData = useSelector((state) => state.CADDropDown.PriorityDrpData);
  const [editValue, setEditValue] = useState("");
  const [incidentID, setIncidentID] = useState("");
  const [incidentNumber, setIncidentNumber] = useState("");
  const [openCommentModal, setOpenCommentModal] = useState(false);
  const [loginAgencyID, setLoginAgencyID] = useState('');
  const [tableData, setTableData] = useState();
  const [loginPinID, setLoginPinID,] = useState('');
  const [rows, setRows] = useState(5);
  const [first, setFirst] = useState(0);
  const navigate = useNavigate();

  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 670);

  useEffect(() => {
    if (localStoreData) {
      setLoginAgencyID(localStoreData?.AgencyID);
      setLoginPinID(localStoreData?.PINID)
      if (PriorityDrpData?.length === 0 && localStoreData?.AgencyID) dispatch(getData_DropDown_Priority(localStoreData?.AgencyID))
    }
  }, [localStoreData]);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 1400);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getStatusColors = (statusCode) => {
    const statusItem = PriorityDrpData.find(item => item.PriorityCode === statusCode);
    return statusItem
      ? { backgroundColor: statusItem.BackColor }
      : {};
  };

  const removeStateAndCountry = (location) => {
    if (!location) return '';

    const cleaned = location
      .replace(/\b(AL|AK|AZ|AR|CA|CO|CT|DE|FL|GA|HI|ID|IL|IN|IA|KS|KY|LA|ME|MD|MA|MI|MN|MS|MO|MT|NE|NV|NH|NJ|NM|NY|NC|ND|OH|OK|OR|PA|RI|SC|SD|TN|TX|UT|VT|VA|WA|WV|WI|WY|Texas|California)\b,?\s?/g, '')
      .replace(/,?\s?USA\b/, '')
      .trim();

    // If everything was removed and it's now empty, return the original
    return cleaned.length > 0 ? cleaned : location;
  };

  const initialCols = [
    {
      name: <p className='text-center' style={{ position: 'absolute', top: '7px' }} >Comments</p>,
      selector: (row) => {
        return (<><span
          className="btn btn-sm text-white p-1 py-0 mr-2"
          style={{ background: "#ddd", cursor: "pointer" }}
        >
          <button className="d-flex justify-content-end btn btn-sm px-1 py-0" data-toggle="modal"
            data-target="#CommentModal" onClick={() => { setOpenCommentModal(true); setIncidentID(row?.IncidentID); setIncidentNumber(row?.CADIncidentNumber); navigate(`/cad/dashboard-page?IncId=${stringToBase64(row?.IncidentID)}&IncNo=${row?.CADIncidentNumber}&isResourceView=false&IncSta=true`); }} >
            <i className="fa fa-comment"></i>
          </button>
        </span>
        </>
        )
      },
      width: isSmallScreen ? "90px" : "90px",
      sortable: false,
    },
    {
      name: <p className='text-center' style={{ position: 'absolute', top: '7px' }} >View</p>,
      selector: (row) => {
        return (<><span
          className="btn btn-sm text-white p-1 py-0"
          style={{ background: "#ddd", cursor: "pointer" }}
        >
          <button className="d-flex justify-content-end btn btn-sm px-1 py-0" data-toggle="modal"
            data-target="#CommentModal" onClick={() => navigate(`/cad/dispatcher?IncId=${stringToBase64(row?.IncidentID)}&IncNo=${row?.CADIncidentNumber}&IncSta=true`)
            } >
            <i className="fa fa-eye"></i>
          </button>
        </span> </>)
      },
      width: isSmallScreen ? "60px" : "60px",
      sortable: false,
    },
    {
      name: 'CAD Event #',
      selector: (row) => row?.CADIncidentNumber || '',
      sortable: true,
      sortFunction: (rowA, rowB) => compareStrings(rowA.CADIncidentNumber, rowB.CADIncidentNumber),
      width: isSmallScreen ? "130px" : "130px",
    },
    {
      name: 'RMS Incident #',
      selector: (row) => row?.IncidentNumber || '',
      sortable: true,
      sortFunction: (rowA, rowB) => compareStrings(rowA.IncidentNumber, rowB.IncidentNumber),
      width: isSmallScreen ? "130px" : "130px",
    },
    {
      name: 'Location',
      selector: (row) => removeStateAndCountry(row?.CrimeLocation || '') || '',
      sortable: true,
      sortFunction: (rowA, rowB) => compareStrings(rowA.CrimeLocation, rowB.CrimeLocation),
      width: isSmallScreen ? "350px" : "350px",
      cell: (row) => {
        const cleanedLocation = removeStateAndCountry(row?.CrimeLocation || '');
        return <Tooltip text={cleanedLocation} maxLength={45} />;
      },
    },
    {
      name: 'Apt#',
      selector: (row) => row?.ApartmentNo || '',
      sortable: true,
      sortFunction: (rowA, rowB) => compareStrings(rowA.ApartmentNo, rowB.ApartmentNo),
      width: isSmallScreen ? "105px" : undefined,
    },
    {
      name: 'Incident Recvd DT&TM',
      selector: (row) => row?.ReportedDate ? getShowingDateText(row?.ReportedDate) : '',
      width: isSmallScreen ? "190px" : "190px",
      sortable: true,
      sortFunction: (rowA, rowB) => compareStrings(rowA.ReportedDate, rowB.ReportedDate),
    },
    {
      name: 'CFS Code',
      selector: (row) => row?.CFSCODE || '',
      sortable: true,
      sortFunction: (rowA, rowB) => compareStrings(rowA.CFSCODE, rowB.CFSCODE),
      width: isSmallScreen ? "100px" : "100px",
    },
    {
      name: 'CFS Description',
      selector: (row) => row?.CFSCodeDescription ? row?.CFSCodeDescription : '',
      sortable: true,
      sortFunction: (rowA, rowB) => compareStrings(rowA.CFSCodeDescription, rowB.CFSCodeDescription),
      width: isSmallScreen ? "140px" : "140px",
      cell: (row) => (
        <Tooltip text={row?.CFSCodeDescription || ''} maxLength={15} />
      ),
    },
    {
      name: 'Priority',
      selector: (row) => row?.PriorityCode || '',
      sortable: true,
      sortFunction: (rowA, rowB) => compareStrings(rowA.PriorityCode, rowB.PriorityCode),
      width: isSmallScreen ? "100px" : "100px",
    },
    {
      name: 'Unit #',
      // selector: (row) => {
      //   const text = row?.Resources || '';
      //   const truncatedText = text.length > 25 ? text.substring(0, 25) + '...' : text;
      //   return (<div
      //     style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
      //     title={text.length > 25 ? text : ''}
      //   >
      //     {truncatedText}
      //   </div>)
      // },
      selector: (row) => row?.Resources || '',
      sortable: true,
      sortFunction: (rowA, rowB) => compareStrings(rowA.Resources, rowB.Resources),
      width: isSmallScreen ? "190px" : "190px",

    },
    {
      name: 'E Timer',
      selector: (row) => row.ReportedDate ? <DateTimeCounter data={row.ReportedDate} /> : '',
      sortable: true,
      width: isSmallScreen ? "90px" : "90px",
    },
    {
      name: 'Primary',
      selector: (row) => row?.PrimaryResourceName || '',
      sortable: true,
      sortFunction: (rowA, rowB) => compareStrings(rowA.PrimaryResourceName, rowB.PrimaryResourceName),
      width: isSmallScreen ? "145px" : "145px",
    },

    {
      name: 'Source',
      selector: (row) => row?.Source || '',
      sortable: true,
      sortFunction: (rowA, rowB) => compareStrings(rowA.Source, rowB.Source),
      width: isSmallScreen ? "85px" : undefined,
    },
    {
      name: 'Operator',
      selector: (row) => row?.OperatorName || '',
      sortable: true,
      sortFunction: (rowA, rowB) => compareStrings(rowA.OperatorName, rowB.OperatorName),
      width: isSmallScreen ? "105px" : undefined,
    },
    {
      name: 'Zone',
      selector: (row) => row?.ZoneDescription || '',
      sortable: true,
      sortFunction: (rowA, rowB) => compareStrings(rowA.ZoneDescription, rowB.ZoneDescription),
      width: isSmallScreen ? "105px" : undefined,
    },
  ]

  const onIncidentRowClick = (row) => {
    if (row?.IncidentID && row?.IncidentID !== incidentID) {
      setIncidentID(row?.IncidentID);
      setIncidentNumber(row?.CADIncidentNumber);
      setEditValue(row);
      navigate(`/cad/dashboard-page?IncId=${stringToBase64(row?.IncidentID)}&IncNo=${row?.CADIncidentNumber}&isResourceView=false&IncSta=true`);
    } else {
      setIncidentID(null);
      setIncidentNumber(null);
      setEditValue(null);
      navigate(`/cad/dashboard-page`);
    }
  };

  const [columns, setColumns] = useState([]);
  const [selectedColumnIndex, setSelectedColumnIndex] = useState(null);
  const [draggingColumnIndex, setDraggingColumnIndex] = useState(null);

  const sanitizeColumns1 = (columns) => {
    return columns?.map((col) => ({
      name: col.name.props?.header,
      selector: col.selector,
      sortable: col.sortable,
      width: col.width,
    }));
  };

  // Restore columns from saved state
  const restoreColumns = (savedColumns) => {
    //     // Input data
    let inputData = `${savedColumns}`;

    // Step 1: Parse JSON string into an array (if it's a string)
    if (typeof inputData === 'string') {
      try {
        inputData = JSON.parse(inputData);
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
    }

    // Step 2: Ensure inputData is an array
    if (!Array.isArray(inputData)) {
      console.error('Input data is not an array.');
    } else {
      // Step 3: Map over the array and process each column
      savedColumns = inputData.map((col) => {
        return {
          name: col?.name,
          width: col?.width || 'auto', // Default width if not provided
          sortable: col?.sortable || false // Default sortable to false
        };
      });

      // Step 4: Log the mapped array
    }
    if (!Array.isArray(savedColumns)) {
      console.error("savedColumns is not an array:", savedColumns);
      return []; // Return an empty array if savedColumns is invalid
    }

    return savedColumns.map((col) => {
      const matchingColumn = initialCols.find((initialCol) => {
        const colName =
          typeof initialCol.name === "string"
            ? initialCol.name
            : initialCol.name.props?.children;
        return colName === col.name;
      });

      return {
        ...col,
        name: matchingColumn?.name || col.name,
        selector: matchingColumn?.selector || col.selector,
        cell: matchingColumn?.cell || col.cell,
      };
    });
  };

  // Restore columns from localStorage or use initialCols
  const getUserTableKey = `/CAD/UsertableColumns_IS/GetData_UserTable/${loginPinID}`;
  const { data: getDataUserTable, isSuccess: isFetchUserTable } = useQuery(
    [getUserTableKey, {
      UserID: loginPinID,
      AgencyID: loginAgencyID,
    }],
    MonitorServices.getDataUserTable,
    {
      refetchOnWindowFocus: false,
      retry: 0,
      enabled: !!loginPinID,
    }
  );

  useEffect(() => {
    if (getDataUserTable && isFetchUserTable) {
      const descriptionData = JSON.parse(getDataUserTable?.data?.data)
      setColumns(
        restoreColumns(descriptionData));
    } else {
      setColumns(initialCols);
    }
  }, [getDataUserTable, isFetchUserTable]);

  useEffect(() => {
    const getFilteredData = () => {
      let sourceData;

      switch (incidentViewFilterStatus) {
        case "Assigned":
          sourceData = assignedIncidentData;
          break;
        case "Unassigned":
          sourceData = unassignedIncidentData;
          break;
        default:
          sourceData = incidentData;
      }

      if (incidentTableFilterIncId) {
        return sourceData.filter((i) => i?.CADIncidentNumber === incidentTableFilterIncId);
      }
      return sourceData;
    };

    setTableData(getFilteredData());
  }, [incidentTableFilterIncId, assignedIncidentData, unassignedIncidentData, incidentData, incidentViewFilterStatus]);

  const columnElements = columns?.map((column, index) => ({
    ...column,
    name: (
      <div
        className={selectedColumnIndex === index ? "selected-column" : ""}
        draggable
        style={{
          cursor: "move",
          opacity: draggingColumnIndex === index ? 0.5 : 1,
        }}
      >
        {typeof column.name === "string" ? column.name : column.name.props?.children}
      </div>
    ),
  }))

  const handleColumnReorder = async (e) => {
    const test = columns?.map((column, index) => ({
      ...column,
      name: e.columns[index],
    }))
    const sanitizedColumns = sanitizeColumns1(test);
    // localStorage.setItem("tableColumns_IS", JSON.stringify(sanitizedColumns));
    const data = {
      Description: JSON.stringify(sanitizedColumns),
      UserID: loginPinID,
      AgencyID: loginAgencyID,
      CreatedByUserFK: loginPinID
    }
    const response = await MonitorServices.insertUserTable(data);
  };

  const createdClasses = new Set();
  const createDynamicClass = (color) => {
    const className = `color-${color?.replace('#', '')}`;
    if (!createdClasses.has(className)) {
      const style = document.createElement('style');
      style.innerHTML = `
          .${className} {
              background-color: ${color} !important;
              color: black !important;
              padding: 5px 8px;
              font-size: 12px;
              border-radius: 4px;
              // box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
          }
      `;
      document.head.appendChild(style);
      createdClasses.add(className);
    }
    return className;
  };

  const rowClassName = (data) => {
    const color = getStatusColors(data?.PriorityCode)?.backgroundColor; // Get color dynamically
    const dynamicClass = createDynamicClass(color); // Generate a class for the color
    return dynamicClass; // Return the class name
  };

  const onRowsChange = (e) => {
    e.preventDefault();
    setRows(parseInt(e.target.value, 10));
    setFirst(0);
  };

  const paginatorTemplate = {
    layout: ' FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown',
    RowsPerPageDropdown: () => (
      <div className="custom-rows-per-page">
        <select value={rows} onChange={(e) => onRowsChange(e)}>
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
        </select>
      </div>
    ),
    CurrentPageReport: (options) => (
      <span style={{ marginRight: '8px', fontSize: '13px' }}>
        Showing {options.first} to {options.last} of {options.totalRecords}
      </span>
    )
  };

  return (
    <>
      <div className="table-container CAD-table">
        <div className="card">
          <DataTable
            value={tableData}
            onColReorder={(e) => handleColumnReorder(e)}
            reorderableColumns
            size="small"
            selectionMode="single"
            selection={editValue}
            onSelectionChange={(e) => onIncidentRowClick(e?.value)}
            dataKey="IncidentID"
            sortMode="multiple"
            stripedRows
            columnResizeMode="expand"
            resizableColumns
            tableStyle={{ minWidth: '10rem' }}
            rowClassName={rowClassName}
            className="small-table" // Apply the custom class
            paginator
            rows={rows}
            first={first}
            onPage={(e) => setFirst(e.first)}
            paginatorTemplate={paginatorTemplate}
          // scrollable scrollHeight="400px" 
          >
            {columnElements.map((item) => {
              return <Column
                key={item?.name.props?.children}
                sortable={item?.sortable}
                field={item?.selector}
                header={item?.name.props?.children}
                style={{ width: '25%' }}
                headerClassName="cad-custom-header"
              />
            })}
          </DataTable>
        </div>
      </div>
      <CommentsModal
        {...{
          openCommentModal,
          setOpenCommentModal,
          incidentID,
          incidentNumber
        }}
      />
    </>
  );
};

export default IncidentTableSection;

// PropTypes definition
IncidentTableSection.propTypes = {
  isIncidentDispatch: PropTypes.bool,
  incidentViewFilterStatus: PropTypes.string,
  incidentTableFilterIncId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

// Default props
IncidentTableSection.defaultProps = {
  isIncidentDispatch: false,
  incidentViewFilterStatus: "",
  incidentTableFilterIncId: null
};
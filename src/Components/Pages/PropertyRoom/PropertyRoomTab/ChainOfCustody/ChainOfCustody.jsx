import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { getShowingWithFixedTime01, getShowingWithOutTime, tableCustomStyles } from '../../../../Common/Utility';
import { fetchPostData } from '../../../../hooks/Api';

const ChainOfCustodyData = (props) => {
  const { DecMPropID, DecPropID } = props

  const [data, setData] = useState([]);
 

  // useEffect(() => {
  //   get_ChainOfCustodyData(DecPropID);
  // }, []);


  useEffect(() => {
    const savedSelectedRows = JSON.parse(sessionStorage.getItem('selectedRows')) || [];
    if (savedSelectedRows.length > 0) {
       get_ChainOfCustodyData(savedSelectedRows[0].PropertyID);
    }
    console.log(savedSelectedRows);
  }, []);


  const get_ChainOfCustodyData = (propertyID , masterpropertyID) => {
    const val = {
      'PropertyID': propertyID, 'MasterpropertyID': 0,
    };
    fetchPostData('Propertyroom/GetData_ChainOfCustody', val).then((res) => {
      if (res) {
        setData(res);
      } else { setData([]); }
    });
  };

 

  const columns = [
    {
      name: 'Property #',
      selector: (row) => row.PropertyNumber,
      sortable: true,
    },
    {
      name: 'Activity ',
      selector: (row) => row.Status,
      sortable: true,
    },
    {
      name: 'Date & Time',
      selector: (row) => row.ExpectedDate ||  row.ReceiveDate ? getShowingWithFixedTime01(row.ExpectedDate || row.ReceiveDate) : '',
      // selector: (row) => row.ExpectedDate,
      sortable: true,
    },
    {
      name: 'Officer Name',
      selector: (row) => row.CreatedByOfficer,
      sortable: true,
    },
    {
      name: 'Property Room',
      selector: (row) => '',
      sortable: true,
    },
    {
      name: 'Location',
      selector: (row) => row.location,
      sortable: true,
    },
    {
      name: 'Schedule Destroy Date',
      selector: (row) => row.DestroyDate,
      sortable: true,
    },
    {
      name: 'Schedule Court Date',
      selector: (row) => row.CourtDate,
      sortable: true,
    },



    // {
    //   name: 'Schedule Release Date',
    //   selector: (row) => row.ReleaseDate,
    //   sortable: true,
    // },
    // {
    //   name: 'Release To',
    //   selector: (row) => row.ReleaseDate,
    //   sortable: true,
    // },
    // {
    //   name: 'Comment',
    //   selector: (row) => row.ActivityComments,
    //   sortable: true,
    // },

  ];

  return (
    <div className="col-12 px-0 mt-2">
      <DataTable
        columns={columns}
        data={data}
        showHeader={true}
        persistTableHead={true}
        dense
        highlightOnHover
        responsive
        customStyles={tableCustomStyles}
        fixedHeader
        fixedHeaderScrollHeight='220px'
        pagination
        paginationPerPage={100}
        paginationRowsPerPageOptions={[100, 150, 200, 500]}
        paginationComponentOptions={{ rowsPerPageText: 'Rows per page:' }}
        showPaginationBottom={100}

      />
    </div>
  );
}
export default ChainOfCustodyData;

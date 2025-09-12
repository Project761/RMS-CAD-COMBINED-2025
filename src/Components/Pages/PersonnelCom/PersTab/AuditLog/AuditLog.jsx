// Import Component
import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { toastifySuccess } from '../../../../Common/AlertMsg';
import { AddDeleteUpadate, fetchPostData, ScreenPermision } from '../../../../hooks/Api';
import { Decrypt_Id_Name, base64ToString, getShowingDateText, tableCustomStyles } from '../../../../Common/Utility';
import { useDispatch, useSelector } from 'react-redux';
import { get_LocalStoreData } from '../../../../../redux/actions/Agency';
import { useLocation } from 'react-router-dom';

const AuditLog = () => {

	const dispatch = useDispatch();
	const localStoreData = useSelector((state) => state.Agency.localStoreData);
	const uniqueId = sessionStorage.getItem('UniqueUserID') ? Decrypt_Id_Name(sessionStorage.getItem('UniqueUserID'), 'UForUniqueUserID') : '';

	// Hooks Initialization
	const [pinId, setPinID] = useState('');
	const [personalGroupList, setPersonalGroupList] = useState([]);
	const [effectiveScreenPermission, setEffectiveScreenPermission] = useState([])

	const useQuery = () => {
		const params = new URLSearchParams(useLocation().search);
		return {
			get: (param) => params.get(param)
		};
	};

	const query = useQuery();
	var Aid = query?.get("Aid");
	var perId = query?.get('perId');

	if (!Aid) Aid = 0;
	else Aid = parseInt(base64ToString(Aid));
	if (!perId) perId = 0;
	else perId = parseInt(base64ToString(perId));

	useEffect(() => {
		if (!localStoreData?.AgencyID || !localStoreData?.PINID) {
			if (uniqueId) dispatch(get_LocalStoreData(uniqueId));
		}
	}, []);

	useEffect(() => {
		if (localStoreData) {
			setPinID(localStoreData?.PINID);
			// get_Group_Personnel(Aid);
			getScreenPermision(localStoreData?.AgencyID, localStoreData?.PINID);
		}
	}, [localStoreData]);

	useEffect(() => {
		if (Aid && perId) {
			get_AuditLog(Aid, perId);
		}
	}, [Aid, perId]);

	const get_AuditLog = () => {
		const val = {
			AgencyID: Aid,
			PINID: perId,
		};
		fetchPostData('Log/GetData_PersonnelLog', val).then((res) => {
			console.log(res);
			if (res) setPersonalGroupList(res);
			else setPersonalGroupList();
		}).catch((error) => {
			console.error('There was an error!', error);
		});
	};

	// Table Columns Array
	const columns = [
		{
			name: 'Column Name',
			selector: (row) => row.ColumnName,
			sortable: true
		},
		{

			name: 'Old Value',
			selector: (row) => row.OldValue,
			sortable: true
		},
		{

			name: 'New Value',
			selector: (row) => row.NewValue,
			sortable: true
		},
		{

			name: 'Change Date',
			selector: (row) => row.ChangeDate ? getShowingDateText(row.ChangeDate) : " ",
			sortable: true
		},
		{

			name: 'Officer Name',
			selector: (row) => row.Officer_Name,
			sortable: true
		},
		{

			name: 'Module',
			selector: (row) => row.Module,
			sortable: true
		},
		{

			name: 'Status',
			selector: (row) => row.Status,
			sortable: true
		},
	];

	const getScreenPermision = (Aid, pinId) => {
		ScreenPermision("P142", Aid, pinId).then(res => {
			if (res) setEffectiveScreenPermission(res)
			else setEffectiveScreenPermission([])
		});
	}




	return (
		<div className="row px-3">
			<div className="col-12 mt-3 ">
				{/* <div className="bg-line py-1 px-2 mt-1 d-flex justify-content-between align-items-center">
					<p className="p-0 m-0 d-flex align-items-center">Group</p>
				</div> */}
				<DataTable
					columns={columns}
					data={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? personalGroupList : '' : ''}
					dense
					paginationPerPage={'15'}
					paginationRowsPerPageOptions={[15, 20, 25]}
					highlightOnHover
					noContextMenu
					pagination
					responsive
					showHeader={true}
					persistTableHead={true}
					customStyles={tableCustomStyles}
					subHeaderAlign="right"
					fixedHeader
					fixedHeaderScrollHeight="450px"
					subHeaderWrap
					noDataComponent={effectiveScreenPermission ? effectiveScreenPermission[0]?.DisplayOK ? "There are no data to display" : "You don’t have permission to view data" : 'There are no data to display'}
				/>
			</div>
		</div>
	);
};

export default AuditLog;

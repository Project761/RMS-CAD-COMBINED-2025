import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import useObjState from '../../../../../CADHook/useObjState';
import { useLocation } from 'react-router-dom';
import { base64ToString } from '../../../../Common/Utility';
import CertificationServices from '../../../../../CADServices/APIs/certification';
import { useQuery } from 'react-query';
import { toastifySuccess } from '../../../../Common/AlertMsg';

const Certification = () => {

	const dropDownData = [{ label: "Low", value: 1 }, { label: "Medium", value: 2 }, { label: "High", value: 3 }]
	const privilegeIndicatorsMap = {
		"NCIC Certification Indicator": "NCICCertification",
		"Counter Terrorism Data Self Search Home Privilege Indicator": "CounterTerrorism",
		"Public Safety Officer Indicator": "PublicSafety",
		"Criminal Investigative Data Self Search Home Privilege Indicator": "CriminalInvestigative",
		"Intelligence Analyst Indicator": "IntelligenceAnalyst",
		"Criminal Intelligence Data Self Search Home Privilege Indicator": "CriminalIntelligence",
		"Sworn Law Enforcement Officer Indicator": "SwornLawEnforcement",
		"Criminal History Data Self Search Home Privilege Indicator": "CounterHistoryData",
		"PCII Certification Indicator": "PCIICertification",
		"NDEx Privilege Indicator": "NDEXPrivilege",
		"28 CFR Certification Indicator": "CFRCertification",
	};

	const [certificationState, setCertificationState] = useObjState({
		AgencyID: "",
		PINID: 0,
		CreatedByUserFK: 0,
		AuthenticatorAssuranceLevel: 0,
		FederationAssuranceLevel: 0,
		IdentityAssuranceLevel: 0,
		privileges: Object.keys(privilegeIndicatorsMap).reduce((acc, key) => {
			acc[key] = false;
			return acc;
		}, {}),
	});

	const [certificationByIdData, setCertificationByIdData] = useState(null);
	const useRouterQuery = () => {
		const params = new URLSearchParams(useLocation().search);
		return {
			get: (param) => params.get(param)
		};
	}

	const query = useRouterQuery();
	var aId = query?.get("Aid");
	var perId = query?.get('perId');
	if (!aId) aId = 0;
	else aId = parseInt(base64ToString(aId));
	if (!perId) perId = 0;
	else perId = parseInt(base64ToString(perId));


	const getCertificationByPINIDKey = `/Certification/GetCertificationByPINID/${perId}`;
	const { data: certificationData, isSuccess: isFetchCertificationData, refetch } =
		useQuery(
			[getCertificationByPINIDKey, { PINID: perId }],
			CertificationServices.getCertificationByPINID,
			{
				refetchOnWindowFocus: false,
				enabled: !!perId,
				retry: 0,
				onSuccess: (res) => {
					if (res?.data?.Data?.length === 0) {
						return;
					} else {
						try {
							const parsedData = JSON.parse(res?.data?.data);
							const data = parsedData?.Table;
							setCertificationByIdData(data?.[0]);
						} catch (error) {
							console.error("Error parsing name:", error);
						}
					}
				},
			}
		);
	// const handleCheckboxChange = (event) => {
	// 	const { name, checked } = event.target;
	// 	setCertificationState((prevState) => ({
	// 		...prevState,
	// 		privileges: {
	// 			...prevState.privileges,
	// 			[name]: checked,
	// 		},
	// 	}));
	// };
	// console.log("certificationState", certificationState)

	useEffect(() => {
		if (certificationByIdData?.Id && isFetchCertificationData) {
			setCertificationState((prevState) => ({
				...prevState,
				AgencyID: certificationByIdData.AgencyID || "",
				PINID: certificationByIdData.PINID || 0,
				ID: certificationByIdData.Id || "",
				CreatedByUserFK: certificationByIdData.CreatedByUserFK || 0,
				AuthenticatorAssuranceLevel: certificationByIdData.AuthenticatorAssuranceLevel || 0,
				FederationAssuranceLevel: certificationByIdData.FederationAssuranceLevel || 0,
				IdentityAssuranceLevel: certificationByIdData.IdentityAssuranceLevel || 0,
				privileges: Object.keys(privilegeIndicatorsMap).reduce((acc, key) => {
					const apiKey = privilegeIndicatorsMap[key]; // Get API field name
					acc[key] = !!certificationByIdData[apiKey]; // Convert to boolean
					return acc;
				}, {}),
			}));
		}
	}, [certificationByIdData, isFetchCertificationData]);


	const handleCheckboxChange = async (event) => {
		const { name, checked } = event.target;
		setCertificationState((prevState) => {
			const updatedState = {
				...prevState,
				privileges: {
					...prevState.privileges,
					[name]: checked,
				},
			};
			callAPI(updatedState);

			return updatedState;
		});
	};

	const handleDropdownChange = (field, value) => {
		setCertificationState((prevState) => {
			const updatedState = {
				...prevState,
				[field]: value,
			};
			callAPI(updatedState);

			return updatedState;
		});
	};

	const callAPI = async (state) => {
		const apiPayload = {
			AgencyID: aId,
			PINID: perId,
			Id: certificationState?.ID ? certificationState?.ID : null,
			CreatedByUserFK: state.CreatedByUserFK,
			AuthenticatorAssuranceLevel: state.AuthenticatorAssuranceLevel,
			FederationAssuranceLevel: state.FederationAssuranceLevel,
			IdentityAssuranceLevel: state.IdentityAssuranceLevel,
		};

		Object.keys(privilegeIndicatorsMap).forEach((key) => {
			apiPayload[privilegeIndicatorsMap[key]] = state.privileges[key] || false;
		});
		try {
			const response = await CertificationServices.InsertCertification(apiPayload);
			if (response?.status === 200) {
				refetch();
				  toastifySuccess("Updated Successfully");
			}
		} catch (error) {
			console.error("API Error:", error);
		}
	};


	return (
		<div className="row">
			<div className="col-12 " id='display-not-form'>
				<div className="row">
					<div className="col-12 col-md-12 col-lg-12 pt-2 ">
						<fieldset>
							<legend>Privilege Indicators</legend>
							<div className="row">
								{Object.keys(privilegeIndicatorsMap).map((item, index) => (
									<div className="col-6 mt-1" key={index}>
										<input
											type="checkbox"
											name={item}
											id={item}
											checked={certificationState.privileges[item] || false}
											onChange={handleCheckboxChange}
										/>
										<label className="ml-2" htmlFor={item}>
											{item}
										</label>
									</div>
								))}
							</div>
						</fieldset>
					</div>
					<div className="col-12 col-md-12 col-lg-12 pt-2 ">
						<fieldset>
							<legend>Assurance Level </legend>
							<div className="row " >
								<div className="col-2 mt-3 px-0">
									<label htmlFor="" className='new-label px-0'>Authenticator Assurance Level</label>
								</div>
								<div className="col-2 mt-2">
									<Select
										className="basic-single"
										classNamePrefix="select"
										options={dropDownData}
										value={certificationState.AuthenticatorAssuranceLevel ? dropDownData?.find(item => item.value === certificationState.AuthenticatorAssuranceLevel) : null}
										onChange={(e) => handleDropdownChange("AuthenticatorAssuranceLevel", e?.value)}
										isClearable
									/>
								</div>
								<div className="col-2 mt-2 px-0">
									<label htmlFor="" className='new-label px-0 mt-2'>Federation Assurance Level
									</label>
								</div>
								<div className="col-2 mt-2">
									<Select
										className="basic-single"
										classNamePrefix="select"
										options={dropDownData}
										value={certificationState.FederationAssuranceLevel ? dropDownData?.find(item => item.value === certificationState.FederationAssuranceLevel) : null}
										onChange={(e) => handleDropdownChange("FederationAssuranceLevel", e?.value)}
										isClearable
									/>
								</div>
								<div className="col-2 mt-3 px-0 ">
									<label htmlFor="" className='new-label px-0'>Identity Assurance Level</label>
								</div>
								<div className="col-2 mt-2">
									<Select
										className="basic-single"
										classNamePrefix="select"
										options={dropDownData}
										value={certificationState.IdentityAssuranceLevel ? dropDownData?.find(item => item.value === certificationState.IdentityAssuranceLevel) : null}
										onChange={(e) => handleDropdownChange("IdentityAssuranceLevel", e?.value)}
										isClearable
									/>
								</div>
							</div>
						</fieldset>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Certification;

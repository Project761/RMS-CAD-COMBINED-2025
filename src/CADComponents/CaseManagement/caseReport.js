import React from 'react'
import ReportModule from '../../Components/Pages/ReportModule/ReportModule'

function CaseReport(props) {
const { CaseId } = props;
    return (
        <ReportModule isCaseManagement CaseId={CaseId} />
    )
}

export default CaseReport
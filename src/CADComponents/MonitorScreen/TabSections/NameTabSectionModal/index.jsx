import React, { memo } from 'react';
import NameTab from '../../../../Components/Pages/Name/NameTab';

const NameTabSectionModal = (props) => {
    const { isViewEventDetails = false } = props;
    return (
        <>
            <NameTab isCad isViewEventDetails={isViewEventDetails} />
        </>
    );
};

export default memo(NameTabSectionModal);

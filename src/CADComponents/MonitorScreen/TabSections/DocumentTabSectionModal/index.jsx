import { memo } from 'react';
import Document_Add_Up from '../../../../Components/Pages/Document/Document_Add_Up';

const DocumentTabSectionModal = (props) => {
    const { isViewEventDetails = false } = props;
    return (
        <>
            <Document_Add_Up isCad isViewEventDetails={isViewEventDetails} />
        </>
    );
};

export default memo(DocumentTabSectionModal);

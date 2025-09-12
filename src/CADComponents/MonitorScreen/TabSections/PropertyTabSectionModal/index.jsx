import { memo } from 'react';
import Property_Tabs from '../../../../Components/Pages/Property/Property_Tabs';

const PropertyTabSectionModal = (props) => {
    const { isViewEventDetails = false } = props;
    return (
        <>
            <Property_Tabs isCad isViewEventDetails={isViewEventDetails} />
        </>
    );
};

export default memo(PropertyTabSectionModal);

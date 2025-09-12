import { memo } from 'react';
import Vehicle_Add_Up from '../../../../Components/Pages/Vehicle/Vehicle_Add_Up';

const VehicleTabSectionModal = (props) => {
    const { isViewEventDetails = false } = props;
    return (
        <>
            <Vehicle_Add_Up isCad isViewEventDetails={isViewEventDetails} />
        </>
    );
};

export default memo(VehicleTabSectionModal);

import TabCitation from '../../Utility/Tab/TabCitation'
import useObjState from '../../../CADHook/useObjState'
import IdentifyFieldColor from '../../Common/IdentifyFieldColor';
import NameInfoContent from '../../../CADComponents/CitationComponents/NameInfoContent';
import DrivingConditionContent from '../../../CADComponents/CitationComponents/DrivingConditionContent';
import VehicleInfoContent from '../../../CADComponents/CitationComponents/VehicleInfoContent';
import ChargeContent from '../../../CADComponents/CitationComponents/ChargeContent';

function CitationTab() {

    const [citationState,] = useObjState({
        CitationNumber: '',
        DTTMIssued: '',
        IncidentNumber: '',
        CitationType: '',
        Officer: '',
        Status: '',
        Address: '',
        // Name Info fields
        lastName: '',
        firstName: '',
        middleName: '',
        dateOfBirth: '',
        juvenile: false,
        age: '',
        gender: '',
        race: '',
        ethnicity: '',
        resident: '',
        weightLbs: '',
        heightFt: '',
        eyeColor: '',
        hairColor: '',
        stateDL: '',
        // Vehicle Information fields
        plateType: '',
        category: '',
        make: '',
        plateExpires: '',
        primaryColor: '',
        plateState: '',
        plateNumber: '',
        classification: '',
        model: '',
        mfgYear: '',
        weight: '',
        secondaryColor: '',
        vin: '',
        vod: '',
        style: '',
        oanNumber: '',
        chargeDTTM: '',
        owner: '',
        weather: '',
        traffic: '',
        road: '',
        Accident: '',
    })


    return (
        <div className="section-body pt-1 p-1 bt" >
            <div className="div">
                <div className="col-12  inc__tabs">
                    <TabCitation />
                </div>
                <div className="dark-row" >
                    <div className="col-12 col-sm-12">
                        <div className="card Agency incident-card-citation">
                            <div className="card-body">
                                <fieldset>
                                    <legend> Citation  Info. </legend>
                                    <div className="d-flex align-items-center">
                                        <div className="col-1 mt-2">
                                            <label htmlFor="" className='new-label'>Citation #</label>
                                        </div>
                                        <div className="col-3 text-field">
                                            <input
                                                type="text"
                                                name='CitationNumber'
                                                className="form-control"
                                                value={citationState.CitationNumber}
                                                disabled
                                            />
                                        </div>
                                        <div className="col-1 mt-2">
                                            <label htmlFor="" className='new-label'>DT/TM Issued</label>
                                        </div>
                                        <div className="col-3 text-field">
                                            <input
                                                type="text"
                                                name='DTTMIssued'
                                                className="form-control"
                                                value={citationState.DTTMIssued}
                                                disabled
                                            />
                                        </div>
                                        <div className="col-1 mt-2">
                                            <label htmlFor="" className='new-label'>Incident #</label>
                                        </div>
                                        <div className="col-3 text-field">
                                            <input
                                                type="text"
                                                name='IncidentNumber'
                                                className="form-control"
                                                value={citationState.IncidentNumber}
                                                disabled
                                            />
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <div className="col-1 mt-2">
                                            <label htmlFor="" className='new-label'>Citation Type</label>
                                        </div>
                                        <div className="col-3 text-field">
                                            <input
                                                type="text"
                                                name='CitationType'
                                                className="form-control"
                                                value={citationState.CitationType}
                                                disabled
                                            />
                                        </div>
                                        <div className="col-1 mt-2">
                                            <label htmlFor="" className='new-label'>Officer</label>
                                        </div>
                                        <div className="col-3 text-field">
                                            <input
                                                type="text"
                                                name='Officer'
                                                className="form-control"
                                                value={citationState.Officer}
                                                disabled
                                            />
                                        </div>
                                        <div className="col-1 mt-2">
                                            <label htmlFor="" className='new-label'>Status</label>
                                        </div>
                                        <div className="col-3 text-field">
                                            <input
                                                type="text"
                                                name='Status'
                                                className="form-control"
                                                value={citationState.Status}
                                                disabled
                                            />
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <div className="col-1 mt-2">
                                            <label htmlFor="" className='new-label'>Address</label>
                                        </div>
                                        <div className="col-7 text-field">
                                            <input
                                                type="text"
                                                name='Address'
                                                className="form-control"
                                                value={citationState.Address}
                                                disabled
                                            />
                                        </div>
                                        <div className="col-1 mt-2">
                                            <label htmlFor="" className='new-label'>Accident</label>
                                        </div>
                                        <div className="col-3 text-field">
                                            <input
                                                type="text"
                                                name='Accident'
                                                className="form-control"
                                                value={citationState.Accident}
                                                disabled
                                            />
                                        </div>
                                    </div>

                                    {/* Name Info Section */}
                                    <fieldset className='mt-3'>
                                        <legend>Name Info.</legend>
                                        <NameInfoContent citationState={citationState} />
                                    </fieldset>

                                    <fieldset className='mt-3'>
                                        <legend>Driving Condition</legend>
                                        <DrivingConditionContent citationState={citationState} />
                                    </fieldset>

                                    {/* Vehicle Information Section */}
                                    <fieldset className='mt-3'>
                                        <legend>Vehicle Information</legend>
                                        <VehicleInfoContent citationState={citationState} />
                                    </fieldset>

                                    {/* Charge Section */}
                                    <fieldset className='mt-3'>
                                        <legend>Charge</legend>
                                        <ChargeContent citationState={citationState} />
                                    </fieldset>
                                </fieldset>
                            </div>
                            <IdentifyFieldColor />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CitationTab
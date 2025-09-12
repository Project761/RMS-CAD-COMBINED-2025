const iconHome = <i className="fa fa-home" style={{ fontSize: '20px' }}></i>
const iconbell = <i className="fa fa-bell" style={{ fontSize: '20px' }}></i>

const Incident = [
    {
        tab: iconHome,
        path: "#update_incident_form",
    },
    {
        tab: "Pin",
        path: "#Pin"
    },
    {
        tab: "Report Due",
        path: "#Report_Due",
        count: 'ReportDueCount'
    },
    {
        tab: "Security",
        path: "#Security"
    },
    {
        tab: "Dispatch Activity",
        path: "#Dispatch_Activity"
    },
    {
        tab: "Narrative",
        path: "#Narrative"
    },
    {
        tab: "Comments",
        path: "#Comments"
    },
    {
        tab: "Location History",
        path: "#Location_History"
    },
    {
        tab: iconbell,
        path: "#",
    }

]

const Offence = [
    {
        tab: iconHome,
        path: "#home",
        active: "active",
        count: ""
    },
    {
        tab: "Pretented To Be",
        path: "#pretended_To_Be",
        count: ""
    },
    {
        tab: "Point Of Exit",
        path: "#Point_Of_Exit"
    },
    {
        tab: "Point Of Entry",
        path: "#Point_Of_Entry"
    },
    {
        tab: "Other Code",
        path: "#Other_Code"
    },
    {
        tab: "Method Of Operation",
        path: "#Method_Of_Operation"
    },
    {
        tab: "Method Of Entry",
        path: "#Method_Of_Entry"

    },
    {
        tab: "Offender Using",
        path: "#Offender_Using"
    },
    {
        tab: "Weapon",
        path: "#Weapon"
    },
    {
        tab: "Criminal Activity",
        path: "#Criminal_Activity"
    },
    {
        tab: "Bias",
        path: "#Bias"
    },
    {
        tab: "Tools",
        path: "#Tools"
    },
    {
        tab: "Target",
        path: "#Target"
    },
    {
        tab: "Suspect Actions",
        path: "#Suspect_Actions"
    },
    {
        tab: "Security Violated",
        path: "#Security_Violated"
    }
]

const Name = [
    {
        tab: iconHome,
        path: "#home",
        active: "active"
    },
    {
        tab: "General",
        path: "#Rreason_Code"
    },

    {
        tab: "Contact Details",
        path: "#Contact_Details"
    },
    {
        tab: "Allases",
        path: "#Allases"
    },
    {
        tab: "Appearance",
        path: "#Appearance"
    },
    {
        tab: "Identification Number",
        path: "#Identification_Numbert"
    },
    {
        tab: "SMT",
        path: "#SMT"
    },
    {
        tab: "Address",
        path: "#Address"
    },
    {
        tab: "Comments",
        path: "#Comments"
    },
    {
        tab: "Picture History",
        path: "#Picture_History"
    },
    {
        tab: "Documents",
        path: "#Documents"
    },

    {
        tab: "History",
        path: "#History"
    },
    {
        tab: "Family Info",
        path: "#FamilyInfo"
    },
    {
        tab: "Gang",
        path: "#Gang"
    },

    {
        tab: "Education",
        path: "#Education"
    },
    {
        tab: "Involvement",
        path: "#Involvement"
    },
    {
        tab: "Moniker",
        path: "#Moniker"
    },
    {
        tab: "AduitLog",
        path: "#Aduit_Log"
    },

]

const Property = [
    {
        tab: iconHome,
        path: "#home",
        active: "active"
    },
    {
        tab: "Property Owners",
        path: "#Property_Owners"
    },
    {
        tab: "Offense",
        path: "#Offense"
    },
    {
        tab: "Document",
        path: "#Document"
    },
    {
        tab: "Comments",
        path: "#Comments"
    }
]

const Offender = [
    {
        tab: iconHome,
        path: "#Home",
        active: "active"
    },
    {
        tab: "Offense",
        path: "#Offense"
    },
    {
        tab: "Relationship",
        path: "#Relationship"
    },
    {
        tab: "Injury Type",
        path: "#InjuryType"
    },
    {
        tab: "Assault Type",
        path: "#AssaultType"
    },
    {
        tab: "Comments",
        path: "#Comments"
    },
    {
        tab: "Agency Info",
        path: "#AgencyInfo"
    },
    {
        tab: "Audit Log",
        path: "#Audit_Log"
    }
]

const Arrest = [
    {
        tab: iconHome,
        path: "#home",
        active: "active"
    },
    {
        tab: "Charges",
        path: "#Charges"
    },
    {
        tab: "Narratives",
        path: "#Narratives"
    },
    {
        tab: "Secondry Offices",
        path: "#Secondry_Offices"
    },
    {
        tab: "Comments",
        path: "#Comments"
    },
    {
        tab: "Incident Property",
        path: "#Incident_Property"
    },
    {
        tab: "Court Information",
        path: "#Court_Information"
    },
    {
        tab: "Criminal Activity",
        path: "#Criminal_Activity"
    },
    {
        tab: "State Specific Information",
        path: "#State_Specific_Information"
    },
    {
        tab: "Released Information",
        path: "#Released_Information"
    },
    {
        tab: "Security",
        path: "#Security"
    },
    {
        tab: "Juvenile Information",
        path: "#Juvenile_Information"
    },
    {
        tab: "Audit Log",
        path: "#Audit_Log"
    }
]

const Warrant = [
    {
        tab: iconHome,
        path: "#home",
        active: "active"
    },
    {
        tab: "Charges",
        path: "#Charges"
    },
    {
        tab: "Court Information",
        path: "#Court_Information"
    },
    {
        tab: "Narratives",
        path: "#Narratives"
    },
    {
        tab: "Clearance",
        path: "#Clearance"
    },
    {
        tab: "Comments",
        path: "#Comments"
    },
    {
        tab: "Doccument",
        path: "#Doccuments"
    },
    {
        tab: "Warrant Services",
        path: "#Warrant_Services"
    },
    {
        tab: "History",
        path: "#History"
    },
    {
        tab: "Name History",
        path: "#Name_History"
    }

]

const Ticket = [
    {
        tab: iconHome,
        path: "#home",
        active: "active"
    },
    {
        tab: "Charges",
        path: "#Charges"
    },
    {
        tab: "Cout Information",
        path: "#Cout_Information"
    },
    {
        tab: "Driving Conditions",
        path: "#Driving_Conditions"
    },
    {
        tab: "Driver License Information",
        path: "#Driver_License_Information"
    },
    {
        tab: "Comments",
        path: "#Comments"
    },
    {
        tab: "Equipment Information",
        path: "#Equipment_Information"
    },
    {
        tab: "Payment",
        path: "#Payment"
    },
    {
        tab: "Narratives",
        path: "#Narratives"
    },
    {
        tab: "Motor Vehicle Statement",
        path: "#Motor_Vehicle_Statement"
    },
    {
        tab: "Audit Log",
        path: "#Audit_Log"
    }
]

const fieldInterview = [
    {
        tab: iconHome,
        path: "#home",
        active: "active"
    }
    ,
    {
        tab: "Name",
        path: "#Name"
    },
    {
        tab: "Comments",
        path: "#Comments"
    },
    {
        tab: "Narratives",
        path: "#Narratives"
    },
    {
        tab: "Property",
        path: "#Property"
    },
    {
        tab: "Audit Log",
        path: "#Audit_Log"
    }
]

const Victim = [
    {
        tab: iconHome,
        path: "#home",
        active: "active"
    },
    {
        tab: "Offense",
        path: "#Offense"
    },
    {
        tab: "Relationship",
        path: "#Relationship"
    },
    {
        tab: "Property",
        path: "#Property"
    },
    {
        tab: "Injury Type",
        path: "#Injury_Type"
    },
    {
        tab: "Justifiable Homicide",
        path: "#Justifiable_Homicide"
    },
    {
        tab: "Assault Type",
        path: "#Assault_Type"
    },
    {
        tab: "Officer",
        path: "#Officer"
    },
    {
        tab: "Comments",
        path: "#Comments"
    },  
    {
        tab: "ORI",
        path: "#ORI"
    },
    {
        tab: "Agency Specific Information",
        path: "#Agency_Specific_Information"
    },
    {
        tab: "Audit Log",
        path: "#Audit_Log"
    }
]

export const AgencySubTab = [
    {
        tab: iconHome,
        path: "#Basic_Info",
    },
    {
        tab: "Basic Info",
        path: "#Basic_Info"
    },
    {
        tab: "Password Setting",
        path: "#PasswordSetting"
    }
]

export const RMSPermissionSubTab = [
    {
        tab: iconHome,
        path: "#",
    },
    {
        tab: "Capitalizer",
        path: "/rms-permission?page=capitalizer"
    },
    {
        tab: "Narrative Permission",
        path: "/rms-permission?page=narrative-permission"
    },
    {
        tab: "Screen Name",
        path: "#Screen Name"
    },
    {
        tab: "Tree Customization",
        path: "#Tree Customization"
    },
    {
        tab: "RMS Setting",
        path: "/rms-permission?page=rms-setting"
    },
    {
        tab: "CAD Field In RMS",
        path: "/rms-permission?page=cad-field-in-rms"
    }
]

export default (Incident);

export const OffenceTab = (Offence);
export const NameSubTab = (Name);
export const PropertySubTab = (Property);
export const OffenderSubTab = (Offender);
export const ArrestSubTab = (Arrest);
export const WarrantSubTab = (Warrant);
export const TicketSubTab = (Ticket);
export const fieldInterviewSubTab = (fieldInterview);
export const VictimSubTab = (Victim);
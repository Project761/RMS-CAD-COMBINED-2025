
const iconHome = <i className="fa fa-home" style={{ fontSize: '20px' }}></i>

export const AgencyTabs = [
    {
        tab: iconHome,
        path: "home"
    },
    {
        tab: "Group",
        path: "Group",
        count: "GroupCount",
    },
    {
        tab: "Personnel",
        path: "personnel",
        count: "PersonnelCount"
    },
    {
        tab: "Group Member",
        path: "member",
        count: "member",
    },
    {
        tab: "Division",
        path: "division",
        count: "DivisionCount",
    },
    {
        tab: "Screen Permission",
        path: "screenpermission"
    },

    {
        tab: "Password Setting",
        path: "PasswordSetting"
    },
    {
        tab: "Unit",
        path: "unit",
        count: "UnitCount",
    },
    {
        tab: "Unit Assignment",
        path: "roster"
    },
    {
        tab: "Shift",
        path: "ShiftA",
        count: "ShiftCount"
    },

    {
        tab: "Ranks",
        path: "Ranks",
        count: "RankCount"
    },
    {
        tab: "Agency Contact",
        path: "AgencyContact",
        count: "AgencyCount",
    },
    {
        tab: "Agency Setting",
        path: "AgencySetting",
        count: "",
    },


]
export const PersTabs = [
    {
        tab: iconHome,
        path: "home"
    },
    {
        tab: "Additional Information",
        path: "characteristics,dates & numbers",
    },
    {
        tab: "Emergency Contact",
        path: "emergency contact",
        count: "EmergencyContact"
    },
    {
        tab: "Group",
        path: "group",
        count: "GroupCount",
    },
    {
        tab: "Effective Screen Permission",
        path: "effective screen permission"
    },
    {
        tab: "Training & CJIS Compliance",
        path: "Training & CJIS Compliance"
    },
]
export const IncidentTabs = [
    {
        tab: iconHome,
        path: "home"
    },
    {
        tab: "PIN",
        path: "Pin",
        count: "PINActivityCount"
    },
    // {
    //     tab: "Report Due",
    //     path: "report due",
    //     count:'ReportDueCount'
    // },
    {
        tab: "Type Of Security",
        path: "type of security",
        count: "SecurityCount",
    },
    {
        tab: "Dispatch Activity",
        path: "dispatch activity",
        count: "IncidentDispatcherCount",
    },

    {
        tab: "Report",
        path: "narrative",
        count: "NarrativeCount"
    },
    // {
    //     tab: "Comments",
    //     path: "comments",
    //     count:"CommentsCount"
    // },
    // {
    //     tab: "Document",
    //     path: "document_management",
    //     count:'DocumentManagementCount'
    // },
    {
        tab: "Location  ",
        path: "location history"
    },

]
export const MobileIncidentTabs = [
    {
        tab: iconHome,
        path: "home"
    },
    {
        tab: "Narrative",
        path: "Mobilenarrative"
    },
    {
        tab: "Comments",
        path: "Mobilecomments"
    },

]
export const MobileOffenseTabs = [
    {
        tab: iconHome,
        path: "home"
    },
    {
        tab: "Basic Information",
        path: "MobileBasicInformation"
    },
    {
        tab: "Other Code",
        path: "MobileOtherCode"
    },
    {
        tab: "Method Of Operation",
        path: "MobileMethodOperation"
    },
    {
        tab: "Method Of Entry",
        path: "MobileMethodEntry"
    },
    {
        tab: "Court Disposition",
        path: "MobileCourtDisposition"
    },
    {
        tab: "Weapon",
        path: "MobileWeapon"
    },
    {
        tab: "Victims",
        path: "MobileVictims"
    },
    {
        tab: "Offenders",
        path: "MobileOffenders"
    },
    {
        tab: "Property",
        path: "MobileProperty"
    },


]
export const MobilePropertyTabs = [
    {
        tab: iconHome,
        path: "home"
    },
    {
        tab: "Miscellaneous Information",
        path: "MobileMiscellaneousInformation"
    },
    {
        tab: "Document",
        path: "MobileDocuments"
    },
    {
        tab: "Owner",
        path: "MobileOwner"
    },
    {
        tab: "Offense",
        path: "MobileOffenses"
    },
    {
        tab: "Recovered  Property",
        path: "MobileRecoveredProperty"
    },

]
export const MobileVehicleTabs = [
    {
        tab: iconHome,
        path: "home"
    },
    {
        tab: "Additional Information",
        path: "MobileAdditionalInformation"
    },
    {
        tab: "Vehicle Notes",
        path: "MobileVehicleNotes"
    },
    {
        tab: "Document",
        path: "VehicleDocument"
    },
    {
        tab: "Vehicle  Recovered",
        path: "MobileVehicleRecovered"
    },


]
export const MobileNameTabs = [
    {
        tab: iconHome,
        path: "home"
    },
    {
        tab: "Additional Info",
        path: "MobileAdditionalInfo"
    },
    {
        tab: "Contact",
        path: "MobileContacts"
    },
    {
        tab: "Alias",
        path: "MobileAlias"
    },

    {
        tab: "Document",
        path: "MobileDocument"
    },
    {
        tab: "SMT",
        path: "MobileSMT"
    },
    {
        tab: "Identification",
        path: "MobileIdentification"
    },
    {
        tab: "Offenders",
        path: "MobileOffender"
    },
    {
        tab: "Victims",
        path: "MobileVictim"
    },
]
export const OffenseTabs = [
    {
        tab: iconHome,
        path: "home",
        count: ""
    },
    {
        tab: "Basic Information",
        path: "BasicInformation",
        count: ""
    },
    {
        tab: "Other Code",
        path: "other code",
        count: "OtherCodeCount"
    },
    {
        tab: "Method Of Operation",
        path: "method of operation",
        count: "MethodOfOperationCount"
    },
    {
        tab: "Method Of Entry",
        path: "method of enrty",
        count: "MethodOfEntryCount"
    },
    {
        tab: "Court Disposition",
        path: "court disposition",
        count: "CourtDispositionCount"
    },
    {
        tab: "Weapon",
        path: "weapon",
        count: "WeaponCount"
    },
    {
        tab: "Victims",
        path: "Victims",
        count: "VictimCount",
        show: true,
    },
    {
        tab: "Offenders",
        path: "Offenders",
        show: true,
        count: "OffenderCount",
    },
    {
        tab: "Property",
        path: "property",
        show: true,
        count: "PropertyCount"
    },
]
export const NameTabs = [
    {
        tab: iconHome,
        path: "home",
    },
    {
        tab: "General",
        path: "general",
        count: ""
    },
    {
        tab: "Contact Details",
        path: "Contact_Details",
        count: "ContactDetailsCount"
    },
    {
        tab: "Aliases",
        path: "aliases",
        count: "AliasesCount"
    },
    {
        tab: "Documents",
        path: "documents",
        count: "DocumentCount"
    },
    {
        tab: "SMT",
        path: "SMT",
        count: "NameSMTCount"
    },

    {
        tab: "Identification Number",
        path: "Identification_Number",
        count: "IdentificationNumberCount"
    },

    {
        tab: "Address",
        path: "Address",
        count: "AddressCount"
    },

    {
        tab: "Offender",
        path: "Offender",
        count: "OffenderCount"
    },
    {
        tab: "Victim",
        path: "Victim",
        count: "VictimCount"
    },
    {
        tab: "Transaction Log",
        path: "TransactionLog",
        count: "TransactionLogCount"
    },

]
export const GangTabs = [
    {
        tab: iconHome,
        path: "home",
    },
    {
        tab: "Member",
        path: "Member"
    },
    {
        tab: "Rival Gang",
        path: "RivalGang"
    },
    {
        tab: "Gang Notes",
        path: "gangnotes"
    },
    {
        tab: "Picture",
        path: "Picture"
    },
    {
        tab: "Audit Log",
        path: "AuditLog"
    },


]
export const ArrestTabs = [
    {
        tab: iconHome,
        path: "home",
    },
    {
        tab: "Charges",
        path: "Charges",
        count: 'ChargeCount',
    },
    {
        tab: "Narratives",
        path: "Narratives",
        count: 'NarrativeCount',
    },

    {
        tab: "Comments",
        path: "Comments",
        count: 'CommentsCount',
    },
    {
        tab: "Property",
        path: "Property",
        count: 'PropertyCount',
    },
    {
        tab: "Court Information",
        path: "CourtInformation",
        count: 'CourtInformationCount',
    },
    {
        tab: "Criminal Activity",
        path: "CriminalActivity",
        count: 'CriminalActivityCount',
    },
    {
        tab: "Police Force",
        path: "PoliceForce",
        count: 'ArrsetPoliceForce',
    },
    {
        tab: "Juvenile",
        path: "Juvenile",
        count: "ArrestJuvenile"
    },
]
export const BookingTabs = [
    {
        tab: iconHome,
        path: "home",
    },
    {
        tab: "Bail Information",
        path: "BailInformation"
    },
    {
        tab: "Medical History",
        path: "MedicalHistory"
    },
    {
        tab: "Medication",
        path: "Medication"
    },
    {
        tab: "Bail Condition",
        path: "BailCondition"
    },
    {
        tab: "Comment",
        path: "Comment"
    },
    {
        tab: "Breathalyzer Result",
        path: "BreathalyzerResult"
    },
    {
        tab: "Condition",
        path: "Condition"
    },

]
export const VictimTabs = [
    {
        tab: iconHome,
        path: "home",
    },
    // {
    //     tab: "Offense",
    //     path: "offense",
    //     count: "OffenseCount",
    // },
    {
        tab: "Relationship",
        path: "relationship",
        count: "RelationshipCount",
    },
    // {
    //     tab: "Injury Type",
    //     path: "InjuryType",
    //     count: "InjuryCount",
    // },
    // {
    //     tab: "Justifiable Homicide",
    //     path: "JustifiableHomicide",
    //     count: "JustifiableHomicideCount",
    // },
    // {
    //     tab: "Assault Type",
    //     path: "AssaultType",
    //     count: "AssaultCount",
    // },
    // {
    //     tab: "Officer",
    //     path: "Officer",
    //     count: "OfficerCount",
    // },
    // {
    //     tab: "Property",
    //     path: "Property",
    //     count: "PropertyCount",
    // },
    // {
    //     tab: "ORI",
    //     path: "ORI",
    //     count: "ORICount",
    // },

]
export const OffenderTabs = [
    {
        tab: "Offense",
        path: "offense",
        count: "OffenseCount",
    },
    {
        tab: "Relationship",
        path: "relationship",
        count: "RelationshipCount",
    },
    {
        tab: "Injury Type",
        path: "InjuryType",
        count: "InjuryCount",
    },
    {
        tab: "Assault Type",
        path: "AssaultType",
        count: "AssaultCount",
    },
    {
        tab: "Property",
        path: "Property",
        count: "PropertyCount",
    },

]
export const OffenderMobileTabs = [
    {
        tab: "Offense",
        path: "Mobileoffense"
    },
    {
        tab: "Relationship",
        path: "Mobilerelationship"
    },
    {
        tab: "Injury Type",
        path: "MobileInjuryType"
    },
    {
        tab: "Assault Type",
        path: "MobileAssaultType"
    },
    {
        tab: "Property",
        path: "MobileProperty"
    },

]
export const VictimMobileTabs = [
    {
        tab: iconHome,
        path: "home",
    },
    {
        tab: "Offense",
        path: "Victimoffense"
    },
    {
        tab: "Relationship",
        path: "Victimrelationship"
    },
    {
        tab: "Injury Type",
        path: "VictimInjuryType"
    },
    {
        tab: "Justifiable Homicide",
        path: "VictimJustifiableHomicide"
    },
    {
        tab: "Assault Type",
        path: "VictimAssaultType"
    },
    {
        tab: "Officer",
        path: "VictimOfficer"
    },
    {
        tab: "Property",
        path: "VictimProperty"
    },
    {
        tab: "ORI",
        path: "VictimORI"
    },

]
export const ChargeTabs = [
    {
        tab: iconHome,
        path: "home",
    },
    {
        tab: "Penalties",
        path: "Penalties"
    },
    {
        tab: "Court Disposition",
        path: "CourtDisposition",
        count: 'CourtDispositionCount',
    },
    {
        tab: "Weapon",
        path: "Weapon",
        count: 'ChargeWeaponTypeCount',
    },


]
export const PropertyTabs = [
    {
        tab: iconHome,
        path: "home",
    },
    {
        tab: "Document",
        path: "Document",
        count: "DocumentCount"
    },
    {
        tab: "Owner",
        path: "Owner",
        count: "OwnerCount"
    },
    {
        tab: "Offense",
        path: "Offense",
        count: "OffenseCount"
    },
    {
        tab: "Recovered Property",
        path: "Recoveredproperty",
        count: "RecoveredCount"
    },
    {
        tab: "Pawn Property",
        path: "Pawnproperty",
        count: "Pawnproperty"
    },

    {
        tab: "Transaction Log",
        path: "PropertyTransactionLog",
    },

]
export const VehicleTabs = [
    {
        tab: iconHome,
        path: "home",
    },
    {
        tab: "Vehicle Notes",
        path: "VehicleNotes",
        count: "NotesCount",
    },

    {
        tab: "Document",
        path: "Document",
        count: "DocumentCount",
    },
    {
        tab: "Vehicle Recovered",
        path: "recoveredproperty",
        count: "VehicleRecovered",

    },
    {
        tab: "Towing Information",
        path: "TowingInformation",
        count: ""
    },
    {
        tab: "Pawn Vehicle",
        path: "pawnvehicle",
        count: "",

    },
    {
        tab: "Transaction Log",
        path: "VehicleTransactionLog",
    },

]
export const WarrantTabs = [
    {
        tab: iconHome,
        path: "home",
    },
    {
        tab: "Other Information",
        path: "Other Information"
    },
    {
        tab: "Charges",
        path: "Charges",
        count: 'ChargeCount',
    },

    {
        tab: "Comments",
        path: "Comments",
        count: "CommentsCount",
    },

    {
        tab: "Narrative",
        path: "Narrative",
        count: "NarrativeCount",
    },
    {
        tab: "Documents",
        path: "Documents",
        count: "DocumentCount",
    },
    {
        tab: "Clearance",
        path: "Clearance",
        count: "WarrantClearanceCount",
    },
    {
        tab: "Warrant Service",
        path: "WarrantService",
        count: "WarrantServiceCount",
    },
    {
        tab: "History",
        path: "History"
    },
]
export const FieldTabs = [
    {
        tab: iconHome,
        path: "home",
    },
    {
        tab: "Name",
        path: "FieldName"
    },

    {
        tab: "Comments",
        path: "FieldComments",
        count: "",
    },

    {
        tab: "Property",
        path: "FieldProperty",
        count: "",
    },
    {
        tab: "Narrative",
        path: "FieldNarrative",
        count: "",
    },

]

export const PawnTabs = [
    {
        tab: "Vehicle",
        path: "VehiclePawn",
        count: "",
    },
    {
        tab: "Property",
        path: "PropertyPawn",
        count: "",
    },
]


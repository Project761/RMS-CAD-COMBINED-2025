import React from 'react';
import { useLocation } from 'react-router-dom';
import ArrestType from './NIBRS/ArrestType/Arrest';
import CrimeBias from './NIBRS/CrimeBias/CrimeBias';
import CriminalAct from './NIBRS/CriminalActivity.jsx/CriminalAct';
import LocationType from './NIBRS/LocationType/LocationType';
import OffenderUse from './NIBRS/OffenderUse/OffenderUse';
import PropertyDescription from './NIBRS/PropertyDescription/PropertyDescription';
import WeaponType from './NIBRS/WeaponType/WeaponType';
import Resident from './NIBRS/Resident/Resident';
import BloodType from './Personnel/BloodType/BloodType';
import EmployeeType from './Personnel/EmployeeType/EmployeeType';
import Ethnicity from './Personnel/Ethnicity/Ethnicity';
import EyeColor from './Personnel/EyeColor/EyeColor';
import Gender from './Personnel/Gender/Gender';
import Race from './Personnel/Race/Race';
import Relation from './Personnel/Relation/Relation';
import ExceptionalClearance from './NIBRS/ExceptionalClearance/ExceptionalClearance';
import DrugMeasure from './NIBRS/DrugMeasureType/DrugMeasure';
import VictimType from './NIBRS/VictimType/VictimType';
import VictimInjury from './NIBRS/VictimInjury/VictimInjury';
import VictimAssign from './NIBRS/VictamAssigType/VictamAssign';
import DrugType from './NIBRS/DrugType/DrugType';
import CrimeSecurity from './NIBRS/CrimeSecurity/CrimeSecurity';
import CrimeLeftScene from './NIBRS/CrimeLeftScene/CrimeLeftScene';
import CrimeSuspect from './NIBRS/CrimeSuspect/CrimeSuspect';
import PointOfexit from './NIBRS/CrimePointOfexit/PointOfexit';
import CrimeToolUse from './NIBRS/CrimeToolUse/CrimeToolUse';
import CrimeTarget from './NIBRS/CrimeTarget/CrimeTarget';
import ReportDue from './Incident/ReportDue/ReportDue';
import IncidentDispositions from './Incident/IncidentDispositions/IncidentDispositions';
import IncidentScene from './Incident/IncidentScene/IncidentScene';
import AgeUnit from './NIBRS/AgeUnit/AgeUnit';
import FacialShape from './NIBRS/FacialShape/FacialShape';
import HairLenght from './NIBRS/HairLength/HairLength';
import HairShades from './NIBRS/HairShades/HairShades';
import Handedness from './NIBRS/Handedness/Handedness';
import HairStyle from './NIBRS/HairStyle/HairStyle';
import TeethCode from './NIBRS/TeethCode/TeethCode';
import Handicap from './NIBRS/HandicapType/Handicap';
import AppearanceType from './NIBRS/AppearanceType/AppearanceType';
import ComplexionType from './NIBRS/ComplexionType/ComplexionType';
import FacialOddity from './NIBRS/FacialOddity/FacialOddity';
import SMTType from './NIBRS/SMTType/SMTType';
import Type from './NIBRS/Type/Type';
import Occupation from './NIBRS/Occupation/Occupation';
import ConditionType from './NIBRS/ConditionType/ConditionType';
import MartialStatus from './NIBRS/MartialStatus/MartialStatus';
import SpeechCode from './NIBRS/SpeechCode/SpeechCode';
import ContactType from './NIBRS/ContactType/ContactType';
import Suffix from './NIBRS/Suffix/Suffix';
import FBICode from './NIBRS/FBI CODE/FbiCode';
import LawTitle from './NIBRS/LawTitle/LawTitle';
import RankType from './NIBRS/RankType/RankType';
import LawClass from './NIBRS/LawClass/LawClass';
import ChargeType from './NIBRS/ChargeType/ChargeType';
import LawCategory from './NIBRS/LawCategory/LawCategory';
import IDTypes from './NIBRS/IDTypes/IDTypes';
import CrimeBiasCategory from './NIBRS/CrimeBiasCategory/CrimeBiasCategory';
import CrimePointEntry from './NIBRS/CrimePointEntry/CrimePointEntry';
import Securityviolated from './NIBRS/Securityviolated/Securityviolated';
import IncidentSecurity from './Incident/IncidentSecurity/IncidentSecurity';
import ContactPhoneType from './NIBRS/ContactPhoneType/ContactType';
import MethodEntry from './NIBRS/MethodEntry/MethodEntry';
import BodyBuild from './NIBRS/BodyBuild/BodyBuild';
import CautionType from './NIBRS/CautionType/CautionType';
import VictimRelationshipType from './NIBRS/VictimRelationshipType/VictimRelationshipType';
import NameReason from './NIBRS/NameReasonCode/NameReason';
import VictimCallType from './NIBRS/VictimCallType/VictimCallType';
import PropertyType from './NIBRS/PropertyType/PropertyType';
import PropertyReasonCode from './NIBRS/Property Reason Code/PropertyReasonCode';
import PropertyDisposition from './NIBRS/PropertyDisposition/ProppertyDispo';
import CourtName from './NIBRS/CourtName/CourtName';
import ChargeCategory from './NIBRS/ChargeCategory/ChargeCategory';
import ChargeClass from './NIBRS/ChargeClass/ChargeClass';
import PropertyWeaponMake from './NIBRS/PropertyWeaponMake/PropertyWeaponMake';
import CourtAppearReason from './NIBRS/CourtAppearReason/CourtAppearReason';
import CourtDispositions from './NIBRS/CourtDispositions/CourtDispositions';
import PropertyVehicleMake from './NIBRS/PropertyVehicleMake/PropertyVehicleMake';
import ChargeDegree from './NIBRS/ChargeDegree/ChargeDegree';
import ChargeDisposition from './NIBRS/ChargeDisposition/ChargeDisposition';
import PropertyVehicleStyle from './NIBRS/PropertyVehicleStyle/PropertyVehicleStyle';
import ChargeCode from './NIBRS/ChargeCode.jsx/ChargeCode';

const ListManagement = () => {
  const useQuery = () => new URLSearchParams(useLocation().search);
  let openPage = useQuery().get('page');
  return (

    <div className="section-body view_page_design pt-3">
      <div className="row clearfix">
        <div className="col-12 col-sm-12">
          <div className="card Agency">
            <div className="card-body">
              {
                openPage === 'Race' ?
                  <Race />
                  :
                  openPage === 'Gender' ?
                    <Gender />
                    :
                    openPage === 'Relation' ?
                      <Relation />
                      :
                      openPage === 'Ethnicity' ?
                        <Ethnicity />
                        :
                        openPage === 'Employee Type' ?
                          <EmployeeType />
                          :
                          openPage === 'Color' ?
                            <EyeColor />
                            :
                            openPage === 'Blood Type' ?
                              <BloodType />
                              :
                              openPage === 'Bias Motivation' ?
                                <CrimeBias />
                                :
                                openPage === 'Offender Suspected of Using' ?
                                  <OffenderUse />
                                  :
                                  openPage === 'Criminal Activity' ?
                                    <CriminalAct />
                                    :
                                    openPage === 'Arrest Type' ?
                                      <ArrestType />
                                      :
                                      openPage === 'Property Description' ?
                                        <PropertyDescription />
                                        :
                                        openPage === 'Weapon Type' ?
                                          <WeaponType />
                                          :
                                          openPage === 'Resident' ?
                                            <Resident />
                                            :
                                            openPage === 'Location Type' ?
                                              <LocationType />
                                              :
                                              openPage === 'Cleared Exceptionally' ?
                                                <ExceptionalClearance />
                                                :
                                                openPage === 'Type Drug Measurement' ?
                                                  <DrugMeasure />
                                                  :
                                                  openPage === 'Type of Victim' ?
                                                    <VictimType />
                                                    :
                                                    openPage === 'Victim Injury' ?
                                                      <VictimInjury />
                                                      :
                                                      openPage === 'Victim Officer Assignment Type' ?
                                                        <VictimAssign />
                                                        :
                                                        openPage === 'Suspected Drug Type' ?
                                                          <DrugType />
                                                          :
                                                          openPage === 'CrimeSecurity' ?
                                                            <CrimeSecurity />
                                                            :
                                                            openPage === 'Method Of Entry' ?
                                                              <MethodEntry />
                                                              :
                                                              openPage === 'Crime Left  Scene' ?
                                                                <CrimeLeftScene />
                                                                :
                                                                openPage === 'Crime Suspect' ?
                                                                  <CrimeSuspect />
                                                                  :
                                                                  openPage === 'Point Of Exit' ?
                                                                    <PointOfexit />
                                                                    :
                                                                    openPage === 'Facial Shape' ?
                                                                      <FacialShape />
                                                                      :
                                                                      openPage === 'Tools Use' ?
                                                                        <CrimeToolUse />
                                                                        :
                                                                        openPage === 'Crime Target' ?
                                                                          <CrimeTarget />
                                                                          :
                                                                          openPage === 'Report Due' ?
                                                                            <ReportDue />
                                                                            :
                                                                            openPage === 'Incident Disposition' ?
                                                                              <IncidentDispositions />
                                                                              :
                                                                              openPage === 'Incident Scene' ?
                                                                                <IncidentScene />
                                                                                :
                                                                                openPage === 'Age Unit' ?
                                                                                  <AgeUnit />
                                                                                  :
                                                                                  openPage === 'Caution Type' ?
                                                                                    <CautionType />
                                                                                    :
                                                                                    openPage === 'Body Build' ?
                                                                                      <BodyBuild />
                                                                                      :
                                                                                      openPage === 'Contact Phone Type' ?
                                                                                        <ContactPhoneType />
                                                                                        :
                                                                                        openPage === 'Hair Length' ?
                                                                                          <HairLenght />
                                                                                          :
                                                                                          openPage === 'Hair Shades' ?
                                                                                            <HairShades />
                                                                                            :
                                                                                            openPage === 'Handedness' ?
                                                                                              <Handedness />
                                                                                              :
                                                                                              openPage === 'Contact Type' ?
                                                                                                <ContactType />
                                                                                                :
                                                                                                openPage === 'Hair Styles' ?
                                                                                                  <HairStyle />
                                                                                                  :
                                                                                                  openPage === 'Teeth Code' ?
                                                                                                    <TeethCode />
                                                                                                    :
                                                                                                    openPage === 'Handicap Type' ?
                                                                                                      <Handicap />
                                                                                                      :
                                                                                                      openPage === 'Appearance Type' ?
                                                                                                        <AppearanceType />
                                                                                                        :
                                                                                                        openPage === 'Complexion Type' ?
                                                                                                          <ComplexionType />
                                                                                                          :
                                                                                                          openPage === 'Facial Oddity' ?
                                                                                                            <FacialOddity />
                                                                                                            :
                                                                                                            openPage === 'SMT Location' ?
                                                                                                              <SMTLocation />
                                                                                                              :
                                                                                                              openPage === 'SMT Type' ?
                                                                                                                <SMTType />
                                                                                                                :
                                                                                                                openPage === 'Type' ?
                                                                                                                  <Type />
                                                                                                                  :
                                                                                                                  openPage === 'Occupation' ?
                                                                                                                    <Occupation />
                                                                                                                    :
                                                                                                                    openPage === 'Condition Type' ?
                                                                                                                      <ConditionType />
                                                                                                                      :
                                                                                                                      openPage === 'Marital Status' ?
                                                                                                                        <MartialStatus />
                                                                                                                        :
                                                                                                                        openPage === 'Speech Codes' ?
                                                                                                                          <SpeechCode />
                                                                                                                          :
                                                                                                                          openPage === 'Charge Code' ?
                                                                                                                            <ChargeCode />
                                                                                                                            :
                                                                                                                            openPage === 'Suffix' ?
                                                                                                                              <Suffix />
                                                                                                                              :
                                                                                                                              openPage === 'FBI Code' ?
                                                                                                                                <FBICode />
                                                                                                                                :
                                                                                                                                openPage === 'Law Title' ?
                                                                                                                                  <LawTitle />
                                                                                                                                  :
                                                                                                                                  openPage === 'Rank Type' ?
                                                                                                                                    <RankType />
                                                                                                                                    :
                                                                                                                                    openPage === 'Law Class' ?
                                                                                                                                      <LawClass />
                                                                                                                                      :
                                                                                                                                      openPage === 'Charge Type' ?
                                                                                                                                        <ChargeType />
                                                                                                                                        :
                                                                                                                                        openPage === 'Law Category' ?
                                                                                                                                          <LawCategory />
                                                                                                                                          :
                                                                                                                                          openPage === 'ID Types' ?
                                                                                                                                            <IDTypes />
                                                                                                                                            :
                                                                                                                                            openPage === 'Point Of Entry' ?
                                                                                                                                              <CrimePointEntry />
                                                                                                                                              :
                                                                                                                                              openPage === 'Crime Bias Category' ?
                                                                                                                                                <CrimeBiasCategory />
                                                                                                                                                :
                                                                                                                                                openPage === 'Crime Security Violated' ?
                                                                                                                                                  <Securityviolated />
                                                                                                                                                  :
                                                                                                                                                  openPage === 'Incident Security' ?
                                                                                                                                                    <IncidentSecurity />
                                                                                                                                                    :
                                                                                                                                                    openPage === 'Name Reason Code' ?
                                                                                                                                                      <NameReason />
                                                                                                                                                      :
                                                                                                                                                      openPage === 'Victim Relationship Type' ?
                                                                                                                                                        <VictimRelationshipType />
                                                                                                                                                        :
                                                                                                                                                        openPage === 'Victim Call Type' ?
                                                                                                                                                          <VictimCallType />
                                                                                                                                                          :
                                                                                                                                                          openPage === 'Property Type' ?
                                                                                                                                                            <PropertyType />
                                                                                                                                                            :
                                                                                                                                                            openPage === 'Property Reason Code' ?
                                                                                                                                                              <PropertyReasonCode />
                                                                                                                                                              :
                                                                                                                                                              openPage === 'Property Dispositions' ?
                                                                                                                                                                <PropertyDisposition />
                                                                                                                                                                :
                                                                                                                                                                openPage === 'CourtName' ?
                                                                                                                                                                  <CourtName />
                                                                                                                                                                  :
                                                                                                                                                                  openPage === 'Charge Category' ?
                                                                                                                                                                    <ChargeCategory />
                                                                                                                                                                    :
                                                                                                                                                                    openPage === 'Charge Class' ?
                                                                                                                                                                      <ChargeClass />
                                                                                                                                                                      :
                                                                                                                                                                      openPage === 'Property Weapon Make' ?
                                                                                                                                                                        <PropertyWeaponMake />
                                                                                                                                                                        :
                                                                                                                                                                        openPage === 'Court Appear Reason' ?
                                                                                                                                                                          <CourtAppearReason />
                                                                                                                                                                          :
                                                                                                                                                                          openPage === 'Court Dispositions' ?
                                                                                                                                                                            <CourtDispositions />
                                                                                                                                                                            :
                                                                                                                                                                            openPage === 'Property Vehicle Make' ?
                                                                                                                                                                              <PropertyVehicleMake />
                                                                                                                                                                              :
                                                                                                                                                                              openPage === 'Charge Degree' ?
                                                                                                                                                                                <ChargeDegree />
                                                                                                                                                                                :
                                                                                                                                                                                openPage === 'Charge Dispositions' ?
                                                                                                                                                                                  <ChargeDisposition />
                                                                                                                                                                                  :
                                                                                                                                                                                  openPage === 'Property Vehicle Style' ?
                                                                                                                                                                                    <PropertyVehicleStyle />
                                                                                                                                                                                    :
                                                                                                                                                                                    <p className='text-center' style={{ color: 'rgb(39, 76, 119)' }}>
                                                                                                                                                                                      <h5 className='mt-2'>
                                                                                                                                                                                        <i className='fa fa-arrow-left'></i>
                                                                                                                                                                                        <span className='p-2'>Select Table From Left Console</span>
                                                                                                                                                                                      </h5>
                                                                                                                                                                                    </p>
              }
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}

export default ListManagement
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { StatusBar } from 'react-native';
import { AddNewAddress, AddNewCard, Address, ArticlesDetails, ArticlesSeeAll, BookAppointment, CancelAppointment, CancelAppointmentPaymentMethods, Categories, ChangeEmail, ChangePIN, ChangePassword, Chat, CreateNewPIN, CreateNewPassword, CustomerService, DoctorDetails, DoctorReviews, EReceipt, EditProfile, EnterYourPIN, Favourite, FillYourProfile, ForgotPasswordEmail, ForgotPasswordMethods, ForgotPasswordPhoneNumber, HelpCenter, InviteFriends, LeaveReview, Login, Messaging, MyAppointmentMessaging, MyAppointmentVideoCall, MyAppointmentVoiceCall, MyBookmarkedArticles, Notifications, OTPVerification, Onboarding1, Onboarding2, Onboarding3, Onboarding4, PatientDetails, PaymentMethods, RescheduleAppointment, ReviewSummary, Search, SelectPackage, SelectRescheduleAppointmentDate, SessionEnded, SettingsLanguage, SettingsNotifications, SettingsPayment, SettingsPrivacyPolicy, SettingsSecurity, Signup, TopDoctors, TrendingArticles, VideoCall, VideoCallHistoryDetails, VideoCallHistoryDetailsPlayRecordings, VoiceCall, VoiceCallHistoryDetails, VoiceCallHistoryDetailsPlayRecordings, Welcome } from '../screens';
import BottomTabNavigation from './BottomTabNavigation';

import StorageHelper from '../utils/StorageHelper';
import CategoriesScreen from '../src/screens/CategoriesScreen';
import ViewPdf from '../src/screens/ViewPdf';
import PrescriptionPDF from '../src/screens/PrescriptionPDF';
import AccountDeletion from '../screens/AccountDeletion';
import DoctorsSearch from '../src/screens/DoctorsSearch';
import OTPScreen from '../screens/newScreens/OTPScreen';
import ViewReceipt from '../src/screens/ViewReceipt';
import WalletRechargeReceipt from '../src/screens/WalletRechargeReceipt';
import SeeAllDoctorList from '../src/SeeAllDoctorList';
import WalletPatientDetailScreen from '../src/screens/WalletPatientDetailScreen';
import HospitalDetailScreen from '../src/screens/DrawerRelatedScreens/hospitals/HospitalDetailScreen';
import ClinicalDepartment from '../src/screens/DrawerRelatedScreens/hospitals/ClinicalDepartment';
import SurgicalDepartment from '../src/screens/DrawerRelatedScreens/hospitals/SurgicalDepartment';
import SpecialPreventDepartment from '../src/screens/DrawerRelatedScreens/hospitals/SpecialPreventDepartment';
import DoctorDetailScreen from '../src/screens/hospitalBookingScreens/DoctorDetailScreen';
import GovHospitalDetailScreen from '../src/screens/DrawerRelatedScreens/hospitals/govHospitalRelatedScreen/GovHospitalDetailScreen';
import ClinicalDepartmentScreen from '../src/screens/DrawerRelatedScreens/hospitals/govHospitalRelatedScreen/ClinicalDepartmentScreen';
import SurgicalDepartmentScreen from '../src/screens/DrawerRelatedScreens/hospitals/govHospitalRelatedScreen/SurgicalDepartmentScreen';
import SpecialDepartmentScreen from '../src/screens/DrawerRelatedScreens/hospitals/govHospitalRelatedScreen/SpecialDepartmentScreen';
import PharmacyDetailWithMedicine from '../src/screens/pharmacyRelated/PharmacyDetailWithMedicine';

import PathologyScreen from '../src/screens/DrawerRelatedScreens/PathologyScreen';
import pathologyPackages from '../screens/pathologyPackages';
import CompleteBloodTests from '../screens/categorytestscreens/CompleteBloodTests';
import BloodSugar from '../screens/categorytestscreens/BloodSugar';
import ThyroidProfile from '../screens/categorytestscreens/ThyroidProfile';
import LipidProfile from '../screens/categorytestscreens/LipidProfile';

import LiverFunctionTest from '../screens/categorytestscreens/LiverFunctionTest';
import KidneyFunctionTest from '../screens/categorytestscreens/KidneyFunctionTest';
import ElectrolytePanel from '../screens/categorytestscreens/ElectrolytePanel';
import MineralTests from '../screens/categorytestscreens/MineralTests';
import VitaminTests from '../screens/categorytestscreens/VitaminTests';
import UrineStool from '../screens/categorytestscreens/UrineStool';
import InfectionDiseasePanels from '../screens/categorytestscreens/InfectionDiseasePanels';
import ImagingDiagnostics from '../screens/categorytestscreens/ImagingDiagnostics';
import OtherTests from '../screens/categorytestscreens/OtherTest';

import CartScreen from '../screens/cartRelated/CartScreen';
import PathologyPackageDetail from '../screens/categorytestscreens/PathologyPackageDetail';
import SelectSlot from '../screens/cartRelated/SelectSlot';
import SelectTestMode from '../screens/cartRelated/SelectTestMode';
import TestBookingScreen from '../screens/cartRelated/TestBookingScreen';
import BookingLists from '../screens/cartRelated/BookingLists';
import GetBookingMoreDetail from '../screens/cartRelated/GetBookingMoreDetail';
import ReportScreen from '../screens/cartRelated/ReportScreen';
import CombinationPackages from '../screens/cartRelated/CombinationPackages';
import BookByPayment from '../screens/paymentRelated/BookByPayment';
import SelectSlotDirectBook from '../screens/paymentRelated/SelectSlotDirectBook';
import BookByWalletDirect from '../screens/paymentRelated/BookByWalletDirect';
import BookByPaymentDirect from '../screens/paymentRelated/BookByPaymentDirect';
import ReciptScreen from '../screens/reciptScreens/ReciptScreen';
import SingleTestSelectSlot from '../screens/testbookingScreens/SingleTestSelectSlot';

import SingleTestBookByWallet from '../screens/testbookingScreens/SigleTestBookByWallet';
import SingleTestBookyByPayment from '../screens/testbookingScreens/SingleTestBookPayment';
import PackagesTestSelectSlot from '../screens/testbookingScreens/PackagesTestSelectSlot';
import PackagesTestBookByWallet from '../screens/testbookingScreens/PackagesTestBookByWallet';
import PackagesTestBookByPament from '../screens/testbookingScreens/PackagesTestBookByPament';
import PatientMitraSelectSlot from '../screens/patientMitraRelatedScreens/PatientMitraSelectSlot';
import PatientMitraBookByWallet from '../screens/patientMitraRelatedScreens/PatientMitraBookByWallet';
import PatientMitraBookByPayment from '../screens/patientMitraRelatedScreens/PatientMitraBookByPayment';
import DialysisSelectSlot from '../screens/dialysisRelatedScreens/DialysisSelectSlot';
import DialysisBookByPayment from '../screens/dialysisRelatedScreens/DialysisBookByPayment';
import DialysisBookByWallet from '../screens/dialysisRelatedScreens/DialysisBookByWallet';
import PhysiotherapySelectSlot from '../screens/physiotherapyRelatedScreens/PhysiotherapySelectSlot';
import PhysiotherapyBookByWallet from '../screens/physiotherapyRelatedScreens/PhysiotherapyBookByWallet';
import PhysiotherapyBookByPayment from '../screens/physiotherapyRelatedScreens/PhysiotherapyBookByPayment';
import UpcomingCenters from '../screens/dialysisRelatedScreens/UpcomingCenters';
import Appointments from '../screens/dialysisRelatedScreens/Appointments';
import MoreDetailScreen from '../screens/dialysisRelatedScreens/MoreDetailScreen';
import Recipt from '../screens/dialysisRelatedScreens/Recipt';
import CompletedMoreDetails from '../screens/dialysisRelatedScreens/CompletedMoreDetails';

import PhysiotherapyHomeScreen from '../screens/physiotherapyRelatedScreens/PhysiotherapyHomeScreen';
import PhysiotherapyAppointments from '../screens/physiotherapyRelatedScreens/PhysiotherapyUpcomingAppointments';
import PhysiotherapyMoreDetails from '../screens/physiotherapyRelatedScreens/PhysiotherapyMoreDetails';
import PhysiotherapRecipt from '../screens/physiotherapyRelatedScreens/PhysiotherapRecipt';
import PysiotherapyCompletedMoreDetails from '../screens/physiotherapyRelatedScreens/PysiotherapyCompletedMoreDetails';
import PatientMitraHome from '../screens/patientMitraRelatedScreens/PatientMitraHome';
import PMPackages from '../screens/patientMitraRelatedScreens/PMPackages';
import PatientMitraBookingList from '../screens/patientMitraRelatedScreens/PatientMitraBookingList';
import PmPackageMoreDetail from '../screens/patientMitraRelatedScreens/PmPackageMoreDetail';
import AcceptedMoreDetail from '../screens/patientMitraRelatedScreens/AcceptedMoreDetail';
import CompletedMoreDetail from '../screens/patientMitraRelatedScreens/CompletedMoreDetail';
import ScheduleReceipt from '../screens/patientMitraRelatedScreens/ScheduleReceipt';
import CompletedReceipt from '../screens/patientMitraRelatedScreens/CompletedReceipt';
import Physiotherapy from '../src/screens/DrawerRelatedScreens/Physiotherapy';
import Dialysis from '../src/screens/DrawerRelatedScreens/Dialysis';



const Stack = createNativeStackNavigator();

const AppNavigation = () => {
  const [isFirstLaunch, setIsFirstLaunch] = useState(null)
  const [userToken, setUserToken] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkIfFirstLaunch = async () => {
      try {
        const value = await AsyncStorage.getItem('alreadyLaunched')
        const token = await StorageHelper.getItem('USER_TOKEN')
        setUserToken(token)
        console.log("=========value==========", token)
        if (value === null) {
          await AsyncStorage.setItem('alreadyLaunched', 'true')
          setIsFirstLaunch(true)
        } else {
          setIsFirstLaunch(false)
        }
      } catch (error) {
        setIsFirstLaunch(false)
      }
      setIsLoading(false)
    }

    checkIfFirstLaunch()
  }, [])

  useEffect(() => {
    StatusBar.setBackgroundColor('#00b4db');
    StatusBar.setBarStyle('light-content');
  }, []);

  if (isLoading) {
    return null
  }
const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#00b4db',  
  },
};

  return (
    <NavigationContainer theme={MyTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          statusBarColor: '#00b4db',
          statusBarStyle: 'light',
        }}

        initialRouteName={!userToken ? 'Onboarding1' : 'Main'}>
        <Stack.Screen name="Onboarding1" component={Onboarding1} />
        <Stack.Screen name="Onboarding2" component={Onboarding2} />
        <Stack.Screen name="Onboarding3" component={Onboarding3} />
        <Stack.Screen name="Onboarding4" component={Onboarding4} />
        {/* <Stack.Screen name="Welcome" component={Welcome} /> */}
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="OTP" component={OTPScreen} />

        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="ForgotPasswordMethods" component={ForgotPasswordMethods} />
        <Stack.Screen name="ForgotPasswordEmail" component={ForgotPasswordEmail} />
        <Stack.Screen name="ForgotPasswordPhoneNumber" component={ForgotPasswordPhoneNumber} />
        <Stack.Screen name="OTPVerification" component={OTPVerification} />
        <Stack.Screen name="CreateNewPassword" component={CreateNewPassword} />
        <Stack.Screen name="FillYourProfile" component={FillYourProfile} />
        <Stack.Screen name="CreateNewPIN" component={CreateNewPIN} />
        {/* <Stack.Screen name="Fingerprint" component={Fingerprint} /> */}
        <Stack.Screen name="Main" component={BottomTabNavigation} />
        <Stack.Screen name="EditProfile" component={EditProfile} />
        <Stack.Screen name="SettingsNotifications" component={SettingsNotifications} />
        <Stack.Screen name='SettingsPayment' component={SettingsPayment} />
        <Stack.Screen name="AddNewCard" component={AddNewCard} />
        <Stack.Screen name="SettingsSecurity" component={SettingsSecurity} />
        <Stack.Screen name="ChangePIN" component={ChangePIN} />
        <Stack.Screen name="ChangePassword" component={ChangePassword} />
        <Stack.Screen name="ChangeEmail" component={ChangeEmail} />
        <Stack.Screen name="SettingsLanguage" component={SettingsLanguage} />
        <Stack.Screen name="SettingsPrivacyPolicy" component={SettingsPrivacyPolicy} />
        <Stack.Screen name="InviteFriends" component={InviteFriends} />
        <Stack.Screen name="HelpCenter" component={HelpCenter} />
        <Stack.Screen name="CustomerService" component={CustomerService} />
        <Stack.Screen name="EReceipt" component={EReceipt} />
        <Stack.Screen name="Chat" component={Chat} />
        <Stack.Screen name="Notifications" component={Notifications} />
        <Stack.Screen name="Search" component={Search} />
        <Stack.Screen name="PaymentMethods" component={PaymentMethods} />
        <Stack.Screen name="ReviewSummary" component={ReviewSummary} />
        <Stack.Screen name="EnterYourPIN" component={EnterYourPIN} />
        <Stack.Screen name="TopDoctors" component={TopDoctors} />
        <Stack.Screen name="Categories" component={Categories} />
        <Stack.Screen name="Favourite" component={Favourite} />
        <Stack.Screen name="DoctorDetails" component={DoctorDetails} />
        <Stack.Screen name="DoctorReviews" component={DoctorReviews} />
        <Stack.Screen name="BookAppointment" component={BookAppointment} />
        <Stack.Screen name="SelectPackage" component={SelectPackage} />
        <Stack.Screen name="PatientDetails" component={PatientDetails} />
        <Stack.Screen name="CancelAppointment" component={CancelAppointment} />
        <Stack.Screen name="CancelAppointmentPaymentMethods" component={CancelAppointmentPaymentMethods} />
        <Stack.Screen name="RescheduleAppointment" component={RescheduleAppointment} />
        <Stack.Screen name="SelectRescheduleAppointmentDate" component={SelectRescheduleAppointmentDate} />
        <Stack.Screen name="MyAppointmentMessaging" component={MyAppointmentMessaging} />
        <Stack.Screen name="MyAppointmentVoiceCall" component={MyAppointmentVoiceCall} />
        <Stack.Screen name="MyAppointmentVideoCall" component={MyAppointmentVideoCall} />
        <Stack.Screen name="VideoCall" component={VideoCall} />
        <Stack.Screen name="VoiceCall" component={VoiceCall} />
        <Stack.Screen name="SessionEnded" component={SessionEnded} />
        <Stack.Screen name="LeaveReview" component={LeaveReview} />
        <Stack.Screen name="VoiceCallHistoryDetails" component={VoiceCallHistoryDetails} />
        <Stack.Screen name="VideoCallHistoryDetails" component={VideoCallHistoryDetails} />
        <Stack.Screen name="VoiceCallHistoryDetailsPlayRecordings" component={VoiceCallHistoryDetailsPlayRecordings} />
        <Stack.Screen name="VideoCallHistoryDetailsPlayRecordings" component={VideoCallHistoryDetailsPlayRecordings} />
        <Stack.Screen name="MyBookmarkedArticles" component={MyBookmarkedArticles} />
        <Stack.Screen name="ArticlesDetails" component={ArticlesDetails} />
        <Stack.Screen name="ArticlesSeeAll" component={ArticlesSeeAll} />
        <Stack.Screen name="TrendingArticles" component={TrendingArticles} />
        <Stack.Screen name="Address" component={Address} />
        <Stack.Screen name="AddNewAddress" component={AddNewAddress} />
        <Stack.Screen name="Messaging" component={Messaging} />
        <Stack.Screen name='CategoriesScreen' component={CategoriesScreen} />
        <Stack.Screen name='ViewPdf' component={ViewPdf} />
        <Stack.Screen name='PrescriptionPdf' component={PrescriptionPDF} />
        <Stack.Screen name='AccountDelete' component={AccountDeletion} />
        <Stack.Screen name='DoctorsSearch' component={DoctorsSearch} />
        <Stack.Screen name='Receipt' component={ViewReceipt} />
        <Stack.Screen name='WalletRechargeReceipt' component={WalletRechargeReceipt} />
        <Stack.Screen name='SeeAllDoctorList' component={SeeAllDoctorList} />
        <Stack.Screen name='WalletPatientDetailScreen' component={WalletPatientDetailScreen} />
        <Stack.Screen name='HospitalDetailScreen' component={HospitalDetailScreen} />
        <Stack.Screen name='ClinicalDepartment' component={ClinicalDepartment} />
        <Stack.Screen name='SurgicalDepartment' component={SurgicalDepartment} />
        <Stack.Screen name='SpecialPreventDepartment' component={SpecialPreventDepartment} />
        <Stack.Screen name='DoctorDetailScreen' component={DoctorDetailScreen} />
        <Stack.Screen name='GovHospitalDetailScreen' component={GovHospitalDetailScreen} />
        <Stack.Screen name='ClinicalDepartmentScreen' component={ClinicalDepartmentScreen} />
        <Stack.Screen name='SurgicalDepartmentScreen' component={SurgicalDepartmentScreen} />
        <Stack.Screen name='SpecialDepartmentScreen' component={SpecialDepartmentScreen} />
        <Stack.Screen name='PharmacyDetailWithMedicine' component={PharmacyDetailWithMedicine} />
        <Stack.Screen name="PathologyScreen" component={PathologyScreen} />
        <Stack.Screen name="PathologyPackages" component={pathologyPackages} />
        <Stack.Screen name="CompleteBloodTests" component={CompleteBloodTests} />
        <Stack.Screen name="BloodSugar" component={BloodSugar} />
        <Stack.Screen name="ThyroidProfile" component={ThyroidProfile} />
        <Stack.Screen name="LipidProfile" component={LipidProfile} />
        <Stack.Screen name="LiverFunctionTest" component={LiverFunctionTest} />
        <Stack.Screen name="KidneyFunctionTest" component={KidneyFunctionTest} />
        <Stack.Screen name="ElectrolytePanel" component={ElectrolytePanel} />
        <Stack.Screen name="MineralTests" component={MineralTests} />
        <Stack.Screen name="VitaminTests" component={VitaminTests} />
        <Stack.Screen name="UrineStool" component={UrineStool} />
        <Stack.Screen name="InfectionDiseasePanels" component={InfectionDiseasePanels} />
        <Stack.Screen name="ImagingDiagnostics" component={ImagingDiagnostics} />
        <Stack.Screen name="OtherTests" component={OtherTests} />
        <Stack.Screen name="CartScreen" component={CartScreen} />
        <Stack.Screen name="PathologyPackageDetail" component={PathologyPackageDetail} />
        <Stack.Screen name="SelectSlot" component={SelectSlot} />
        <Stack.Screen name="SelectTestMode" component={SelectTestMode} />
        <Stack.Screen name="TestBookingScreen" component={TestBookingScreen} />
        <Stack.Screen name="BookingList" component={BookingLists} />
        <Stack.Screen name="GetMoreDetail" component={GetBookingMoreDetail} />
        <Stack.Screen name="ReportScreen" component={ReportScreen} />
        <Stack.Screen name="CombinationPackages" component={CombinationPackages} />
        <Stack.Screen name="BookByPayment" component={BookByPayment} />
        <Stack.Screen name="SelectSlotDirectBook" component={SelectSlotDirectBook} />
        <Stack.Screen name="BookByWalletDirect" component={BookByWalletDirect} />
        <Stack.Screen name="BookByPaymentDirect" component={BookByPaymentDirect} />
        <Stack.Screen name="ReciptScreen" component={ReciptScreen} />
        <Stack.Screen name="SingleTestSelectSlot" component={SingleTestSelectSlot} />
        <Stack.Screen name="SingleTestBookByWallet" component={SingleTestBookByWallet} />
        <Stack.Screen name="SingleTestBookyByPayment" component={SingleTestBookyByPayment} />
        <Stack.Screen name="PackagesTestSelectSlot" component={PackagesTestSelectSlot} />
        <Stack.Screen name="PackagesTestBookByWallet" component={PackagesTestBookByWallet} />
        <Stack.Screen name="PackagesTestBookByPament" component={PackagesTestBookByPament} />
        <Stack.Screen name="PatientMitraSelectSlot" component={PatientMitraSelectSlot} />
        <Stack.Screen name="PatientMitraBookByWallet" component={PatientMitraBookByWallet} />
        <Stack.Screen name="PatientMitraBookByPayment" component={PatientMitraBookByPayment} />
        <Stack.Screen name="DialysisSelectSlot" component={DialysisSelectSlot} />
        <Stack.Screen name="DialysisBookByWallet" component={DialysisBookByWallet} />
        <Stack.Screen name="DialysisBookByPayment" component={DialysisBookByPayment} />
        <Stack.Screen name="PhysiotherapySelectSlot" component={PhysiotherapySelectSlot} />
        <Stack.Screen name="PhysiotherapyBookByWallet" component={PhysiotherapyBookByWallet} />
        <Stack.Screen name="PhysiotherapyBookByPayment" component={PhysiotherapyBookByPayment} />
        <Stack.Screen name="UpcomingCenters" component={UpcomingCenters} />
        <Stack.Screen name="Appointments" component={Appointments} />
        <Stack.Screen name="MoreDetailScreen" component={MoreDetailScreen} />
        <Stack.Screen name="Recipt" component={Recipt} />
        <Stack.Screen name="CompletedMoreDetails" component={CompletedMoreDetails} />
        <Stack.Screen name="PhysiotherapyHomeScreen" component={PhysiotherapyHomeScreen} />
        <Stack.Screen name="PhysiotherapyAppointments" component={PhysiotherapyAppointments} />
        <Stack.Screen name="PhysiotherapyMoreDetails" component={PhysiotherapyMoreDetails} />
        <Stack.Screen name="PhysiotherapRecipt" component={PhysiotherapRecipt} />
        <Stack.Screen name="PysiotherapyCompletedMoreDetails" component={PysiotherapyCompletedMoreDetails} />
        <Stack.Screen name="PatientMiraHome" component={PatientMitraHome} />
        <Stack.Screen name="PMPackages" component={PMPackages} />
        <Stack.Screen name="PatientMitraBookingList" component={PatientMitraBookingList} />
        <Stack.Screen name="PmPackageMoreDetail" component={PmPackageMoreDetail} />
        <Stack.Screen name="AcceptedMoreDetail" component={AcceptedMoreDetail} />
        <Stack.Screen name="CompletedMoreDetail" component={CompletedMoreDetail} />
        <Stack.Screen name="ScheduleReceipt" component={ScheduleReceipt} />
        <Stack.Screen name="CompletedReceipt" component={CompletedReceipt} />
         <Stack.Screen name="Physiotherapy" component={Physiotherapy} />
                  <Stack.Screen name="Dialysis" component={Dialysis} />
           



      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default AppNavigation
























































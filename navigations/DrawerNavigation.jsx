import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Linking,
} from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useFocusEffect } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomTabNavigation from './BottomTabNavigation';
import { Articles, Profile } from '../screens';

import Hospital from '../src/screens/DrawerRelatedScreens/Hospital';
import Doctors from '../src/screens/DrawerRelatedScreens/Doctors';
import Clinics from '../src/screens/DrawerRelatedScreens/Clinics';
import Pharmacy from '../src/screens/DrawerRelatedScreens/Pharmacy';
import Physiotherapy from '../src/screens/DrawerRelatedScreens/Physiotherapy';
import Dialysis from '../src/screens/DrawerRelatedScreens/Dialysis';
import BloodBank from '../src/screens/DrawerRelatedScreens/BloodBank';
import PatientMitra from '../src/screens/DrawerRelatedScreens/PatientMitra';
import Ambulance from '../src/screens/DrawerRelatedScreens/Ambulance';
import AppointmentHistory from '../src/screens/DrawerRelatedScreens/AppointmentHistory';
import MedicalHistory from '../src/screens/DrawerRelatedScreens/MedicalHistory';
import CustomerCare from '../src/screens/DrawerRelatedScreens/CustomerCare';
import GovernmentSchemeHospital from '../src/screens/DrawerRelatedScreens/GovernmentSchemeHospital';
import EmergencyCall from '../src/screens/DrawerRelatedScreens/EmergencyCall';
import IPDScreen from '../src/screens/DrawerRelatedScreens/ipdrelatedscreens/IPDScreen';
import ApiService from '../src/api/ApiService';
import { ENDPOINTS } from '../src/constants/Endpoints';
import { showLoader, hideLoader } from '../src/redux/slices/loaderSlice';

import user from '../assets/icons/user-default3.png';

const Drawer = createDrawerNavigator();

/* ---------------- Drawer Items ---------------- */

const ICON_GRADIENTS = [
  { colors: ['#E3F2FD', '#BBDEFB'], icon: '#1E88E5' },
  { colors: ['#E8F5E9', '#C8E6C9'], icon: '#43A047' },
  { colors: ['#FFF3E0', '#FFE0B2'], icon: '#FB8C00' },
  { colors: ['#FCE4EC', '#F8BBD0'], icon: '#D81B60' },
  { colors: ['#F3E5F5', '#E1BEE7'], icon: '#8E24AA' },
  { colors: ['#E0F2F1', '#B2DFDB'], icon: '#00897B' },
  { colors: ['#FFFDE7', '#FFF9C4'], icon: '#F9A825' },
];

const drawerItems = [
  { name: 'GovtSchemeHospital', icon: 'account-balance', label: 'Govt. Scheme Hospitals' },
  { name: 'Doctors', icon: 'person' },
   { name: 'IPD', icon: 'local-hospital', label: 'IPD' },
  { name: 'Physiotherapy', icon: 'fitness-center' },
  { name: 'Dialysis', icon: 'healing' },
  { name: 'AppointmentHistory', icon: 'event', label: 'Appointment History' },
  { name: 'MedicalHistory', icon: 'history', label: 'Medical History' },
  { name: 'CustomerCare', icon: 'support-agent', label: 'Customer Care' },
  { name: 'EmergencyCall', icon: 'call', label: 'Emergency Call' },
  { name: 'Articles', icon: 'article' },
];

/* ---------------- Custom Drawer ---------------- */

const CustomDrawerContent = ({ navigation }) => {
  const [profile, setProfile] = useState([]);
  const dispatch = useDispatch();

  const fetchProfile = async () => {
    try {
      dispatch(showLoader());
      const res = await ApiService.get(ENDPOINTS.patient_profile);
      console.log('res======',res)
      setProfile(res.data || []);
      dispatch(hideLoader());
    } catch (e) {
      dispatch(hideLoader());
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, [])
  );
const handleLogout = async () => {
  try {
    await AsyncStorage.removeItem('token'); // Token clear
    navigation.replace('Login'); // Login screen pe redirect
  } catch (e) {
    console.log('Error clearing token:', e);
  }
};
  return (
    <>
      {/* ✅ StatusBar matched with Navy Blue Theme */}
      <StatusBar backgroundColor="#001F3F" barStyle="light-content" />

      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        {/* 🔥 Header: Updated to Deep Navy Blue Gradient */}
        <LinearGradient
          colors={['#001F3F', '#003366']} 
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.profileHeader}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              source={profile[0]?.patient_picture ? { uri: profile[0].patient_picture } : user}
              style={styles.profileImage}
            />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={styles.profileName}>{profile[0]?.fullName || 'User Name'}</Text>
              <Text style={styles.profileText}>{profile[0]?.contactNumber || ''}</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                <Text style={styles.viewProfile}>View Profile</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 5 }}>
          {drawerItems.map((item, index) => {
             const isIPD = item.name === 'IPD';

  const theme = isIPD
    ? {
        colors: ['#DFF5EA', '#C3EEDC'], // ✅ LIGHT GREEN (premium)
        icon: '#11998E',                // ✅ Same brand green icon
      }
    : ICON_GRADIENTS[index % ICON_GRADIENTS.length];

            return (
              <TouchableOpacity
                key={index}
                style={styles.item}
                onPress={() => {
                  if (item.name === 'Articles') {
                    Linking.openURL('https://healthio24news.com');
                  } else {
                    navigation.navigate(item.name);
                  }
                }}
              >
                <LinearGradient
                  colors={theme.colors}
                  style={styles.iconBox}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <MaterialIcons
                    name={item.icon}
                    size={18}
                    color={theme.icon}
                  />
                </LinearGradient>

                <Text style={styles.label}>{item.label || item.name}</Text>

                <MaterialCommunityIcons
                  name="chevron-right"
                  size={20}
                  color={theme.icon} 
                  style={{ opacity: 0.7 }}
                />
              </TouchableOpacity>
            );
          })}
        </ScrollView>

   <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
  <LinearGradient
    colors={['#FF4D4F', '#E91E63']}
    style={styles.logoutIconBox}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
  >
    <MaterialIcons name="logout" size={18} color="#fff" />
  </LinearGradient>
  <Text style={styles.logoutText}>Logout</Text>
  <MaterialCommunityIcons 
    name="chevron-right" 
    size={20} 
    color="#E91E63" 
    style={{ marginLeft: 'auto' }} 
  />
</TouchableOpacity>
      </View>
    </>
  );
};

/* ---------------- Drawer Navigator ---------------- */

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      id="MainDrawer"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: { width: 280, borderTopRightRadius: 20, borderBottomRightRadius: 20 },
      }}
    >
      <Drawer.Screen name="HomeTabs" component={BottomTabNavigation} />
      <Drawer.Screen name="Profile" component={Profile} />
      <Drawer.Screen name="Hospital" component={Hospital} />
      <Drawer.Screen name="GovtSchemeHospital" component={GovernmentSchemeHospital} />
      <Drawer.Screen name="Doctors" component={Doctors} />
      <Drawer.Screen name="IPD" component={IPDScreen} /> 
      <Drawer.Screen name="Clinics" component={Clinics} />
      <Drawer.Screen name="Pharmacy" component={Pharmacy} />
      <Drawer.Screen name="Physiotherapy" component={Physiotherapy} />
      <Drawer.Screen name="Dialysis" component={Dialysis} />
      <Drawer.Screen name="BloodBank" component={BloodBank} />
      <Drawer.Screen name="PatientMitra" component={PatientMitra} />
      <Drawer.Screen name="Ambulance" component={Ambulance} />
      <Drawer.Screen name="AppointmentHistory" component={AppointmentHistory} />
      <Drawer.Screen name="MedicalHistory" component={MedicalHistory} />
      <Drawer.Screen name="CustomerCare" component={CustomerCare} />
      <Drawer.Screen name="EmergencyCall" component={EmergencyCall} />
      <Drawer.Screen name="Articles" component={Articles} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
  profileHeader: {
    paddingTop: 40,
    paddingBottom: 25,
    paddingHorizontal: 18,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  profileName: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  profileText: {
    color: '#E0E0E0',
    fontSize: 12,
    marginTop: 2,
  },
  viewProfile: {
    color: '#87CEEB', // Sky blue link color for visibility on Navy
    fontSize: 12,
    marginTop: 6,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9, 
    paddingHorizontal: 16,
    marginHorizontal: 5,
    borderRadius: 8,
  },
  iconBox: {
    width: 38, 
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  label: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 15,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: '#FFF0F3',
    borderWidth: 1,
    borderColor: '#FFD1DC',
  },
  logoutIconBox: {
    width: 34,
    height: 34,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#E91E63',
  },
});
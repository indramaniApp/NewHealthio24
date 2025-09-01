import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Linking
} from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../constants/theme';

// Screens
import { Articles, Home, Profile } from '../screens';
import Hospital from '../src/screens/DrawerRelatedScreens/Hospital';
import Doctors from '../src/screens/DrawerRelatedScreens/Doctors';
import Clinics from '../src/screens/DrawerRelatedScreens/Clinics';
import Pharmacy from '../src/screens/DrawerRelatedScreens/Pharmacy';
import Physiotherapy from '../src/screens/DrawerRelatedScreens/Physiotherapy';
// import Pathology from '../src/screens/DrawerRelatedScreens/Pathology';
import Dialysis from '../src/screens/DrawerRelatedScreens/Dialysis';
import BloodBank from '../src/screens/DrawerRelatedScreens/BloodBank';
import PatientMitra from '../src/screens/DrawerRelatedScreens/PatientMitra';
import Ambulance from '../src/screens/DrawerRelatedScreens/Ambulance';
import AppointmentHistory from '../src/screens/DrawerRelatedScreens/AppointmentHistory';
import MedicalHistory from '../src/screens/DrawerRelatedScreens/MedicalHistory';
import CustomerCare from '../src/screens/DrawerRelatedScreens/CustomerCare';
import GovernmentSchemeHospital from '../src/screens/DrawerRelatedScreens/GovernmentSchemeHospital';
import EmergencyCall from '../src/screens/DrawerRelatedScreens/EmergencyCall';
import { useFocusEffect } from '@react-navigation/native';

import user from '../assets/icons/user-default3.png';
import { useDispatch } from 'react-redux';
import { hideLoader, showLoader } from '../src/redux/slices/loaderSlice';
import ApiService from '../src/api/ApiService';
import { ENDPOINTS } from '../src/constants/Endpoints';
import { theme } from '../constants';

const Drawer = createDrawerNavigator();

const drawerItems = [
  { name: 'Hospital', icon: 'local-hospital' },
  { name: 'GovtSchemeHospital', icon: 'account-balance', label: 'Govt.Scheme Hospitals' },
  { name: 'Doctors', icon: 'person' },
  { name: 'Clinics', icon: 'local-pharmacy' },
  { name: 'Pharmacy', icon: 'local-grocery-store' },
  { name: 'Physiotherapy', icon: 'fitness-center' },
  // { name: 'Pathology', icon: 'science' },
  { name: 'Dialysis', icon: 'healing' },
  { name: 'BloodBank', icon: 'bloodtype' },
  { name: 'PatientMitra', icon: 'person-pin' },
  { name: 'Ambulance', icon: 'local-taxi' },
  { name: 'AppointmentHistory', icon: 'event', label: 'Appointment History' },
  { name: 'MedicalHistory', icon: 'history', label: 'Medical History' },
  { name: 'CustomerCare', icon: 'support-agent', label: 'Customer Care' }, 
  { name: 'EmergencyCall', icon: 'call', label: 'Emergency Call' },
  { name: 'Articles', icon: 'article' },
];

const CustomDrawerContent = ({ navigation }) => {
  const [profile, setProfile] = useState([]);
  const dispatch = useDispatch();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const FetchProfile = async () => {
    try {
      dispatch(showLoader());
      let response = await ApiService.get(ENDPOINTS.patient_profile);
      setProfile(response.data);
      dispatch(hideLoader());
    } catch (error) {
      console.log('error=======', error);
      dispatch(hideLoader());
    }
  };

  useFocusEffect(
    useCallback(() => {
      FetchProfile();
    }, [])
  );

  return (
    <>
      <StatusBar
        translucent={false}
        backgroundColor={isDrawerOpen ? COLORS.primary : 'white'}
        barStyle={isDrawerOpen ? 'light-content' : (theme === 'dark' ? 'light-content' : 'dark-content')}
      />
      <View style={{ flex: 1, justifyContent: 'space-between' }}>
        <View style={styles.profileHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Image
              source={profile[0]?.patient_picture ? { uri: profile[0]?.patient_picture } : user}
              style={styles.profileImageLarge}
              resizeMode="cover"
            />
            <View style={{ marginLeft: 16, flexShrink: 1 }}>
              <Text style={styles.profileName}>
                {profile[0]?.fullName || 'User Name'}
              </Text>
              <Text style={styles.profileMobile} numberOfLines={1}>
                {profile[0]?.contactNumber || 'Contact'}
              </Text>
              <Text style={styles.profileMobile} numberOfLines={2}>
                {profile[0]?.emailAddress || 'Email'}
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Profile')}
                style={styles.editProfileButton}
              >
                <Text style={styles.editProfileText}>View Profile</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 20 }}>
          {drawerItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                if (item.name === 'Articles') {
                  Linking.openURL('https://healthio24news.com/');
                } else {
                  navigation.navigate(item.name);
                }
              }}
              style={styles.itemContainer}
            >
              <View style={styles.iconContainer}>
                <MaterialIcons name={item.icon} size={22} color="#fff" />
              </View>
              <Text style={styles.label}>{item.label || item.name}</Text>
              <MaterialCommunityIcons name="chevron-right" size={24} style={styles.chevron} />
            </TouchableOpacity>
          ))}

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.itemContainer}
            onPress={() => navigation.navigate('Profile')}
          >
            <View style={styles.iconContainer}>
              <MaterialIcons name="person" size={22} color="#fff" />
            </View>
            <Text style={styles.label}>Profile</Text>
            <MaterialCommunityIcons name="chevron-right" size={24} style={styles.chevron} />
          </TouchableOpacity>
        </ScrollView>

        <TouchableOpacity
          style={[styles.itemContainer, styles.logoutItemContainer]}
          onPress={() => console.log('Logout pressed')}
        >
          <View style={[styles.iconContainer, { backgroundColor: '#ffe6e6' }]}>
            <MaterialIcons name="logout" size={22} color="red" />
          </View>
          <Text style={[styles.label, { color: 'red' }]}>Logout</Text>
          <MaterialCommunityIcons name="chevron-right" size={24} style={[styles.chevron, { color: 'red' }]} />
        </TouchableOpacity>
      </View>
    </>
  );
};

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
    drawerContent={(props) => <CustomDrawerContent {...props} />}
    screenOptions={{
      headerShown: false, 
      drawerStyle: {
        width: 272,
      },
    }}
  >
    <Drawer.Screen name="Home" component={Home} />
    <Drawer.Screen name="Profile" component={Profile} />
    <Drawer.Screen name="Hospital" component={Hospital} />
    <Drawer.Screen name="GovtSchemeHospital" component={GovernmentSchemeHospital} />
    <Drawer.Screen name="Doctors" component={Doctors} />
    <Drawer.Screen name="Clinics" component={Clinics} />
    <Drawer.Screen name="Pharmacy" component={Pharmacy} />
    <Drawer.Screen name="Physiotherapy" component={Physiotherapy} />
    {/* <Drawer.Screen name="Pathology" component={Pathology} /> */}
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

const styles = StyleSheet.create({
  profileHeader: {
    padding: 16,
    backgroundColor: COLORS.primary,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  profileImageLarge: {
    width: 70,
    height: 80,
    borderRadius: 10,
    backgroundColor: '#ccc',
    marginTop: 30,
  },
  profileName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 30,
  },
  profileMobile: {
    fontSize: 14,
    color: '#eee',
    marginTop: 2,
  },
  editProfileButton: {
    marginTop: 6,
  },
  editProfileText: {
    color: '#FFD700',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  label: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  chevron: {
    marginLeft: 'auto',
    color: '#888',
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 10,
    marginHorizontal: 16,
  },
  logoutItemContainer: {
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    backgroundColor: '#fff',
  },
});

export default DrawerNavigator;

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
  TextInput,
  DeviceEventEmitter,
  AppState,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { useTheme } from '../../../theme/ThemeProvider';
import { COLORS } from '../../../constants';
import Header from '../../../components/Header';
import { hideLoader, showLoader } from '../../redux/slices/loaderSlice';
import ApiService from '../../api/ApiService';
import { ENDPOINTS } from '../../constants/Endpoints';
import Icon from 'react-native-vector-icons/FontAwesome5';
import user from '../../../assets/images/doctors/doctor1.jpeg';

const PatientMitra = ({ navigation }) => {
  const { dark } = useTheme();
  const dispatch = useDispatch();
  const [patientMitraData, setPatientMitraData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchPatientMitra = async () => {
    try {
      dispatch(showLoader());
      const response = await ApiService.get(ENDPOINTS.patient_get_patient_mitras);
      const data = [...(response.data || [])]; // deep clone
      setPatientMitraData(data);
    } catch (error) {
      console.log('Error fetching Patient Mitra:', error);
    } finally {
      dispatch(hideLoader());
    }
  };

  // On screen focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchPatientMitra);
    return unsubscribe;
  }, [navigation]);


  useEffect(() => {
    const listener = DeviceEventEmitter.addListener('PATIENT_MITRA_ADDED', () => {
      fetchPatientMitra();
    });
    return () => listener.remove();
  }, []);


  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') fetchPatientMitra();
    });
    return () => subscription.remove();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPatientMitra();
    setRefreshing(false);
  };

  const filteredData = patientMitraData.filter((item) => {
    const q = searchQuery.toLowerCase();
    return (
      item.fullName?.toLowerCase().includes(q) ||
      item.emailAddress?.toLowerCase().includes(q) ||
      item.city?.toLowerCase().includes(q)
    );
  });

  const PatientCard = ({ patient }) => {
    const fullName = patient.fullName || '';
    const gender = patient.gender || '';
    const dob = patient.dateOfBirth || '';
    const email = patient.emailAddress || '';
    const address = `${patient.streetAddress?.trim() || ''}${patient.city ? ', ' + patient.city.trim() : ''}${patient.state ? ', ' + patient.state : ''}${patient.postalCode ? ' - ' + patient.postalCode : ''}`;
    const education = (patient.educationQualifications && patient.educationQualifications.length > 0)
      ? patient.educationQualifications.join(', ')
      : '';
    const isValidUri = patient.profilePhoto &&
      !patient.profilePhoto.startsWith('blob:') &&
      (patient.profilePhoto.startsWith('http') || patient.profilePhoto.startsWith('data:image'));

    const profilePhoto = isValidUri ? { uri: patient.profilePhoto } : user;

    return (
      <TouchableOpacity
        style={[
          styles.card,
          {
            backgroundColor: dark ? COLORS.dark2 : COLORS.white,
            shadowColor: dark ? COLORS.black : '#aaa',
          },
        ]}
      >
        <View style={styles.topRow}>
          <Image source={profilePhoto} style={styles.newProfile} resizeMode="cover" />
          <View style={{ flex: 1, marginLeft: 16 }}>
            <Text style={[styles.name, { color: dark ? COLORS.white : COLORS.black }]}>{fullName.trim()}</Text>
            {(gender || dob) ? (
              <Text style={[styles.subText, { color: dark ? COLORS.greyscale400 : COLORS.grayscale700 }]}>
                {gender}{dob ? ` | DOB: ${dob}` : ''}
              </Text>
            ) : null}
          </View>
        </View>

        <View style={{ marginTop: 14 }}>
          {email ? (
            <View style={styles.infoRow}>
              <Icon name="envelope" size={14} color={COLORS.primary} style={styles.infoIcon} />
              <Text style={[styles.infoText, { color: dark ? COLORS.greyscale300 : COLORS.grayscale700 }]}>{email}</Text>
            </View>
          ) : null}

          {address ? (
            <View style={styles.infoRow}>
              <Icon name="map-marker-alt" size={14} color={COLORS.primary} style={styles.infoIcon} />
              <Text style={[styles.infoText, { color: dark ? COLORS.greyscale300 : COLORS.grayscale700 }]} numberOfLines={2}>
                {address}
              </Text>
            </View>
          ) : null}

          {education ? (
            <View style={styles.infoRow}>
              <Icon name="graduation-cap" size={14} color={COLORS.primary} style={styles.infoIcon} />
              <Text style={[styles.infoText, { color: dark ? COLORS.greyscale300 : COLORS.grayscale700 }]}>
                {education}
              </Text>
            </View>
          ) : null}
        </View>

        <TouchableOpacity
          style={styles.bookButton}
          onPress={() => navigation.navigate('PatientMitraSelectSlot', { patientMitraId: patient._id })}
        >
          <Text style={styles.bookButtonText}>Book Patient-Mitra for Help</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: dark ? COLORS.dark1 : COLORS.white }]}>
      <Header title="Patient Mitra List" onBackPress={() => navigation.goBack()} />

      <View style={[styles.searchBarWrapper, { backgroundColor: dark ? '#1c1c1e' : '#f4f4f5' }]}>
        <Icon name="search" size={16} color={dark ? COLORS.greyscale400 : COLORS.gray} style={styles.searchIcon} />
        <TextInput
          placeholder="Search by name, email or city"
          placeholderTextColor={dark ? COLORS.greyscale500 : '#999'}
          style={[styles.searchInput, { color: dark ? COLORS.white : COLORS.black }]}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item._id || Math.random().toString()}
        renderItem={({ item }) => <PatientCard patient={item} />}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 30, color: dark ? '#fff' : '#000' }}>
            No Patient Mitra found.
          </Text>
        }
        showsVerticalScrollIndicator={false}
        onRefresh={onRefresh}
        refreshing={refreshing}
        contentContainerStyle={{
          paddingBottom: 100,
          backgroundColor: dark ? COLORS.dark1 : COLORS.lightGray,
        }}
      />
    </SafeAreaView>
  );
};

export default PatientMitra;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  searchBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 10,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 10 : 6,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
    padding: 6,
    backgroundColor: '#e6e6e6',
    borderRadius: 20,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 0,
    fontFamily: 'Urbanist-Regular',
  },
  card: {
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 16,
    padding: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  newProfile: {
    width: 80,
    height: 80,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.primary,
    backgroundColor: '#eaeaea',
  },
  name: {
    fontSize: 18,
    fontFamily: 'Urbanist-Bold',
    marginBottom: 4,
  },
  subText: {
    fontSize: 14,
    fontFamily: 'Urbanist-Regular',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  infoIcon: {
    marginRight: 10,
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Urbanist-Regular',
    flex: 1,
  },
  bookButton: {
    marginTop: 16,
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  bookButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontFamily: 'Urbanist-SemiBold',
  },
});

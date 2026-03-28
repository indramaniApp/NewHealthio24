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
import LinearGradient from 'react-native-linear-gradient';
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
      setPatientMitraData([...(response.data || [])]);
    } catch (error) {
      console.log('Error fetching Patient Mitra:', error);
    } finally {
      dispatch(hideLoader());
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchPatientMitra);
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const listener = DeviceEventEmitter.addListener('PATIENT_MITRA_ADDED', fetchPatientMitra);
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
    const isValidUri =
      patient.profilePhoto &&
      !patient.profilePhoto.startsWith('blob:') &&
      (patient.profilePhoto.startsWith('http') || patient.profilePhoto.startsWith('data:image'));

    const profilePhoto = isValidUri ? { uri: patient.profilePhoto } : user;

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        style={[
          styles.card,
          { backgroundColor: dark ? COLORS.dark2 : COLORS.white },
        ]}
      >
        <View style={styles.topRow}>
          <Image source={profilePhoto} style={styles.avatar} />
          <View style={styles.nameContainer}>
            <Text style={[styles.name, { color: dark ? COLORS.white : COLORS.black }]}>
              {patient.fullName}
            </Text>
            <Text style={[styles.subText, { color: dark ? COLORS.greyscale400 : COLORS.grayscale700 }]}>
              {patient.gender} {patient.dateOfBirth ? `| DOB: ${patient.dateOfBirth}` : ''}
            </Text>
          </View>
        </View>

        <View style={styles.infoContainer}>
          {!!patient.emailAddress && (
            <View style={styles.infoRow}>
              <Icon name="envelope" size={13} color={COLORS.primary} />
              <Text style={[styles.infoText, { color: dark ? COLORS.greyscale300 : COLORS.grayscale700 }]}>
                {patient.emailAddress}
              </Text>
            </View>
          )}

          {!!patient.city && (
            <View style={styles.infoRow}>
              <Icon name="map-marker-alt" size={13} color={COLORS.primary} />
              <Text style={[styles.infoText, { color: dark ? COLORS.greyscale300 : COLORS.grayscale700 }]}>
                {patient.city}, {patient.state}
              </Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() =>
            navigation.navigate('PatientMitraSelectSlot', {
              patientMitraId: patient._id,
            })
          }
        >
       <LinearGradient
  colors={["#e515b5", '#29c8e8']}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 0 }}
  style={styles.bookButton}
>
  <View style={styles.buttonContent}>
    <Icon name="calendar-check" size={12} color="#fff" />
    <Text style={styles.bookButtonText}>Book Patient-Mitra</Text>
  </View>
</LinearGradient>

        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: dark ? COLORS.dark1 : COLORS.white }]}>
      <Header title="Patient Mitra List" onBackPress={() => navigation.goBack()} />

      <View style={[styles.searchBarWrapper, { backgroundColor: dark ? '#1c1c1e' : '#f4f4f5' }]}>
        <Icon name="search" size={15} color={dark ? COLORS.greyscale400 : COLORS.gray} />
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
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <PatientCard patient={item} />}
        // refreshing={refreshing}
        // onRefresh={onRefresh}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 100,
          backgroundColor: dark ? COLORS.dark1 : COLORS.lightGray,
        }}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 40, color: dark ? '#fff' : '#000' }}>
            No Patient Mitra found.
          </Text>
        }
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
    margin: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 30,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    fontFamily: 'Urbanist-Regular',
  },
  card: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 18,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 18,
    backgroundColor: '#eee',
  },
  nameContainer: {
    marginLeft: 14,
    flex: 1,
  },
  name: {
    fontSize: 17,
    fontFamily: 'Urbanist-Bold',
  },
  subText: {
    fontSize: 13,
    marginTop: 4,
    fontFamily: 'Urbanist-Regular',
  },
  infoContainer: {
    marginTop: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 3,
    gap: 8,
  },
  infoText: {
    fontSize: 13,
    fontFamily: 'Urbanist-Regular',
  },
 bookButton: {
  marginTop: 14,
  paddingVertical: 8,          // smaller height
  paddingHorizontal: 14,       // compact width
  borderRadius: 8,
  alignItems: 'center',
  alignSelf: 'flex-end',       // ✅ right side
},
buttonContent: {
  flexDirection: 'row',
  alignItems: 'center',
},
bookButtonText: {
  marginLeft: 6,
  color: COLORS.white,
  fontSize: 13,
  fontFamily: 'Urbanist-SemiBold',
},


});

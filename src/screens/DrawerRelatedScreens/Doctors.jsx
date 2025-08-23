import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Platform,
  StatusBar,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';

import { ENDPOINTS } from '../../constants/Endpoints';
import ApiService from '../../api/ApiService';
import { hideLoader, showLoader } from '../../redux/slices/loaderSlice';
import HorizontalDoctorCard from '../../../components/HorizontalDoctorCard';
import { COLORS, SIZES } from '../../../constants';
import Header from '../../../components/Header';
import { useTheme } from '../../../theme/ThemeProvider';

const Doctors = () => {
  const [allDoctors, setAllDoctors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { dark } = useTheme();

  useEffect(() => {
    fetchAllDoctors();
  }, []);

  const fetchAllDoctors = async () => {
    try {
      dispatch(showLoader());
      const response = await ApiService.get(ENDPOINTS.patient_get_doctors);
      setAllDoctors(response.data);
    } catch (error) {
      console.log('Error fetching doctors:', error);
    } finally {
      dispatch(hideLoader());
    }
  };

  const filteredDoctors = allDoctors.filter((doctor) => {
    const query = searchQuery.toLowerCase();
    const name = typeof doctor.fullName === 'string' ? doctor.fullName.toLowerCase() : '';
    const specialization = typeof doctor.specialization === 'string' ? doctor.specialization.toLowerCase() : '';
    const hospital = typeof doctor.currentHospitalClinicName === 'string' ? doctor.currentHospitalClinicName.toLowerCase() : '';

    return name.includes(query) || specialization.includes(query) || hospital.includes(query);
  });

  const renderItem = ({ item }) => (
    <HorizontalDoctorCard
      name={item.fullName}
      image={item.profilePhoto}
      distance={item.yearsOfExperience}
      price={item.price}
      consultationFee={item.consultationFee}
      hospital={item.currentHospitalClinicName}
      specialization={item.specialization}
      rating={item.average_rating}
      numReviews={item.rating_total_count}
      isAvailable={item.isAvailable}
      onPress={() =>
        navigation.navigate('DoctorDetails', {
          fullName: item.fullName,
          yearsOfExperience: item.yearsOfExperience,
          specialization: item.specialization,
          doctorRating: item.doctorRating,
          doctorId: item._id,
          streetAddress: item.streetAddress,
          average_rating: item.average_rating,
          rating_total_count: item.rating_total_count,
          about_me: item.about_me,
          consultationDate: item.consultationDate,
          consultationTime: item.consultationTime,
          previous_OPD_Number: item.previous_OPD_Number,
          reviews: item.reviews,
          consultationTimeVideo: item.consultationTimeVideo,
          consultationTimeAudio: item.consultationTimeAudio,
          consultationTimeHomeVisit: item.consultationTimeHomeVisit,
          profilePhoto: item.profilePhoto,
        })
      }
    />
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: dark ? COLORS.dark : COLORS.white }]}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Header title="👨‍⚕️ Doctors" 
        onBackPress={() => navigation.goBack()}
        />
      </View>

      {/* Search Bar */}
      <View
        style={[
          styles.searchBarWrapper,
          {
            backgroundColor: dark ? COLORS.dark2 : '#f0f0f0',
            shadowColor: dark ? COLORS.black : '#ccc',
          },
        ]}
      >
        <Icon
          name="search"
          size={16}
          color={dark ? COLORS.greyscale400 : COLORS.gray}
          style={styles.searchIcon}
        />
        <TextInput
          placeholder="Search doctors by name, specialty.."
          placeholderTextColor={dark ? COLORS.greyscale500 : '#999'}
          style={[styles.searchInput, { color: dark ? COLORS.white : COLORS.black }]}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={filteredDoctors}
        keyExtractor={(item) => item._id?.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No doctors found.</Text>
        }
        style={styles.list}
      />
    </SafeAreaView>
  );
};

export default Doctors;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  headerContainer: {
    backgroundColor: COLORS.background || '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    zIndex: 10,
  },
  searchBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SIZES.padding,
    marginTop: 10,
    marginBottom: 10,
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
  },
  list: {
    flex: 1,
    paddingHorizontal: 16,
  },
  listContent: {
    paddingBottom: 100,
    paddingTop: 10,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#7f8c8d',
  },
});

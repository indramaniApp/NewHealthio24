import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-virtualized-view';
import { useTheme } from '../theme/ThemeProvider';
import { COLORS, SIZES, icons } from '../constants';
import { useFocusEffect } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import ApiService from './api/ApiService';
import { ENDPOINTS } from './constants/Endpoints';
import { hideLoader, showLoader } from './redux/slices/loaderSlice';
import HorizontalDoctorCard from '../components/HorizontalDoctorCard';
import Header from '../components/Header';

const SeeAllDoctorList = ({ navigation }) => {
  const { colors, dark } = useTheme();
  const dispatch = useDispatch();

  const [AllDoctors, setAllDoctors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const FetchAllDoctor = async () => {
    try {
      dispatch(showLoader());
      const response = await ApiService.get(ENDPOINTS.patient_get_all_doctors);
      setAllDoctors(response.data);
      dispatch(hideLoader());
    } catch (error) {
      console.log('error=======', error);
      dispatch(hideLoader());
    }
  };

  useFocusEffect(
    useCallback(() => {
      FetchAllDoctor();
    }, [])
  );

  const filteredDoctors = AllDoctors.filter((item) =>
    item.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderSearchBar = () => (
    <View
      style={[
        styles.searchWrapper,
        { backgroundColor: dark ? '#2A2A2A' : '#F5F7FA' },
      ]}
    >
      <Image source={icons.search} style={styles.searchIcon} />
      <TextInput
        placeholder="Search doctors, hospitals..."
        placeholderTextColor={COLORS.gray}
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={[styles.searchInput, { color: colors.text }]}
      />
    </View>
  );

  const renderTopDoctors = () => (
    <View style={{ marginTop: 12 }}>
      <FlatList
        data={filteredDoctors}
        keyExtractor={(item) => item.id?.toString()}
        renderItem={({ item }) => (
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
            // ✅ pura doctor object params me send
            onPress={() => navigation.navigate('DoctorDetails', { doctor: item })}
          />
        )}
      />
    </View>
  );

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header
          title="See All Doctors"
          onBackPress={() => navigation.goBack()}
        />

        {renderSearchBar()}
        <ScrollView showsVerticalScrollIndicator={false}>
          {renderTopDoctors()}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default SeeAllDoctorList;

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 16,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 50,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  searchIcon: {
    width: 20,
    height: 20,
    tintColor: COLORS.gray,
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Urbanist-Regular',
    paddingVertical: 0,
  },
});

import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  FlatList,
  Text,
  Platform,
  StatusBar,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import { showLoader, hideLoader } from '../../../../redux/slices/loaderSlice';
import { ENDPOINTS } from '../../../../constants/Endpoints';
import ApiService from '../../../../api/ApiService';
import { COLORS } from '../../../../../constants';
import HorizontalDoctorCard from '../../../../../components/HorizontalDoctorCard';
import Header from '../../../../../components/Header';

const SpecialDepartmentScreen = ({ route }) => {
  const { hospitalId } = route.params;
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [specialData, setSpecialData] = useState([]);

  const fetchSpecialDepartment = async () => {
    try {
      dispatch(showLoader());
      const response = await ApiService.get(
        `${ENDPOINTS.patient_get_doctors_preventive_department}/${hospitalId}`
      );
      console.log('=====Special Preventive Department Data=====', response.data);

      const cleanedData = (response.data || []).map((doc) => ({
        ...doc,
        specialization: Array.isArray(doc.specialization) ? doc.specialization : [],
        surgery: Array.isArray(doc.surgery) ? doc.surgery : [],
      }));

      setSpecialData(cleanedData);
    } catch (error) {
      console.log('Error fetching special preventive department:', error);
    } finally {
      dispatch(hideLoader());
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchSpecialDepartment();
    }, [hospitalId])
  );

  const renderDoctorCard = ({ item }) => {
    const specializationText = item.specialization.length > 0
      ? item.specialization.join(', ')
      : 'Specialization not specified';

    const surgeryText = item.surgery.length > 0
      ? item.surgery.join(', ')
      : 'Surgery info not specified';

    return (
      <HorizontalDoctorCard
        name={item.fullName}
        image={item.profilePhoto}
        yearsOfExperience={item.yearsOfExperience}
        consultationFee={item.consultationFee}
        specialization={specializationText}
        surgery={surgeryText}
        isAvailable={item.isAvailable}
        rating={item.average_rating || 0}
        numReviews={item.rating_total_count || 0}
        onPress={() =>
          navigation.navigate('DoctorDetailScreen', {
            doctorId: item._id,
          })
        }
      />
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Special Prevent Department"
      onBackPress={() => navigation.goBack()}

      />
      <View style={styles.container}>
        {specialData.length === 0 ? (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>No doctors available</Text>
          </View>
        ) : (
          <FlatList
            data={specialData}
            keyExtractor={(item) => item._id}
            renderItem={renderDoctorCard}
            ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default SpecialDepartmentScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f2f2f2',
  },
  noDataContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  noDataText: {
    fontSize: 16,
    color: COLORS.grey,
    fontStyle: 'italic',
  },
});

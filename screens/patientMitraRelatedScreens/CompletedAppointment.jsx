import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ApiService from '../../src/api/ApiService';
import { ENDPOINTS } from '../../src/constants/Endpoints';
import { showLoader, hideLoader } from '../../src/redux/slices/loaderSlice';
import { COLORS } from '../../constants';

const CompletedAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const fetchCompletedAppointments = async () => {
    try {
      dispatch(showLoader());
      const res = await ApiService.get(ENDPOINTS.pm_package_completed_book);
      setAppointments(res?.data || []);
    } catch (err) {
      console.log('Error:', err);
    } finally {
      dispatch(hideLoader());
    }
  };

  useEffect(() => {
    fetchCompletedAppointments();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <MaterialCommunityIcons name="check-circle" size={20} color="green" />
        <Text style={styles.unitName}>PM Package Completed</Text>
      </View>

      {/* Info Rows */}
      <View style={styles.infoRow}>
        <View style={styles.infoBox}>
          <Text style={styles.label}>Date</Text>
          <Text style={styles.value}>{item.booking_request_date}</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.label}>Time</Text>
          <Text style={styles.value}>{item.booking_time}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.infoRow}>
        <View style={styles.infoBox}>
          <Text style={styles.label}>Patient</Text>
          <Text style={styles.value}>{item.patient_name}</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.label}>Age / Gender</Text>
          <Text style={styles.value}>{item.patient_age} / {item.patient_gender}</Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        <View style={styles.infoBox}>
          <Text style={styles.label}>Payment</Text>
          <Text style={styles.value}>₹{item.booking_payment}</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.label}>Method</Text>
          <Text style={styles.value}>{item.payment_method}</Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        <View style={styles.infoBox}>
          <Text style={styles.label}>Location</Text>
          <Text style={styles.value}>{item.location}</Text>
        </View>
      </View>

      {/* PM Package */}
      <View style={styles.tagRow}>
        <Text style={styles.tag}>Duration: {item.patientMitraPackage?.time} | ₹{item.patientMitraPackage?.fee}</Text>
      </View>

      {/* Booked by */}
      <View style={styles.bookedByRow}>
        <Image source={{ uri: item.booked_by_image }} style={styles.avatar} />
        <Text style={styles.bookedByText}>Booked by {item.booked_by}</Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => navigation.navigate('CompletedMoreDetail', { id: item._id })}
        >
          <MaterialCommunityIcons name="information-outline" size={18} color="#fff" />
          <Text style={styles.btnText}>More Details</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.outlineBtn}
          onPress={() => navigation.navigate('CompletedReceipt', { id: item._id })}
        >
          <MaterialCommunityIcons name="file-document-outline" size={18} color={COLORS.primary} />
          <Text style={[styles.btnText, { color: COLORS.primary }]}>Receipt</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={appointments}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>No completed PM Package appointments found.</Text>
        }
      />
    </SafeAreaView>
  );
};

export default CompletedAppointment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  list: {
    paddingHorizontal: 6,
    paddingVertical: 6,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#D1FAE5',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 6,
  },
  unitName: {
    fontSize: 16,
    fontFamily: 'Urbanist-Bold',
    color: 'green',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
    flexWrap: 'wrap',
  },
  infoBox: {
    flex: 1,
    marginRight: 6,
    marginBottom: 6,
  },
  label: {
    fontSize: 12,
    fontFamily: 'Urbanist-Medium',
    color: '#6B7280',
  },
  value: {
    fontSize: 14,
    fontFamily: 'Urbanist-SemiBold',
    color: '#1F2937',
    marginTop: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 6,
  },
  tagRow: {
    marginTop: 6,
    alignSelf: 'flex-start',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 14,
  },
  tag: {
    fontSize: 12,
    fontFamily: 'Urbanist-Medium',
    color: 'green',
  },
  bookedByRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 6,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  bookedByText: {
    fontSize: 13,
    fontFamily: 'Urbanist-SemiBold',
    color: '#1F2937',
  },
  actions: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 8,
  },
  primaryBtn: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  outlineBtn: {
    flex: 1,
    borderWidth: 1.2,
    borderColor: COLORS.primary,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  btnText: {
    fontSize: 13,
    fontFamily: 'Urbanist-SemiBold',
    color: '#fff',
  },
  empty: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 14,
    color: '#9CA3AF',
    fontFamily: 'Urbanist-Regular',
  },
});

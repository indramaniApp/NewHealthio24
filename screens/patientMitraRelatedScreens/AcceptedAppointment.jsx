import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-simple-toast';

import ApiService from '../../src/api/ApiService';
import { ENDPOINTS } from '../../src/constants/Endpoints';
import { showLoader, hideLoader } from '../../src/redux/slices/loaderSlice';
import { COLORS } from '../../constants';

const AcceptedAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [completedIds, setCompletedIds] = useState([]);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const fetchAcceptedAppointments = async () => {
    try {
      dispatch(showLoader());
      const res = await ApiService.get(ENDPOINTS.pm_package_accepted_book);
      setAppointments(res?.data || []);
    } catch (err) {
      console.log('Error:', err);
    } finally {
      dispatch(hideLoader());
    }
  };

  const handleMarkAsCompleted = (id) => {
    Alert.alert(
      'Mark as Completed',
      'Are you sure you want to mark this appointment as completed?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes',
          onPress: async () => {
            try {
              dispatch(showLoader());
              const url = `${ENDPOINTS.button_pm_package_accepted_appointment_completed}/${id}`;
              const res = await ApiService.post(url);
              if (res?.status === 'success') {
                setAppointments(prev => prev.filter(item => item._id !== id));
                setCompletedIds(prev => [...prev, id]);
                Toast.show(res?.message || 'Marked as completed');
              } else {
                Toast.show(res?.message || 'Failed to mark');
              }
            } catch (err) {
              console.log('Completion Error:', err);
              Toast.show('Something went wrong');
            } finally {
              dispatch(hideLoader());
            }
          },
        },
      ]
    );
  };

  useEffect(() => {
    fetchAcceptedAppointments();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <MaterialCommunityIcons name="medical-bag" size={20} color={COLORS.primary} />
        <Text style={styles.unitName}>PM Package Accepted</Text>
      </View>

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

      <View style={styles.tagRow}>
        <Text style={styles.tag}>Duration: {item.patientMitraPackage?.time} | ₹{item.patientMitraPackage?.fee}</Text>
      </View>

      <View style={styles.bookedByRow}>
        <Image source={{ uri: item.booked_by_image }} style={styles.avatar} />
        <Text style={styles.bookedByText}>Booked by {item.booked_by}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => navigation.navigate('AcceptedMoreDetail', { id: item._id })}
        >
          <MaterialCommunityIcons name="information-outline" size={18} color="#fff" />
          <Text style={styles.btnText}>More Details</Text>
        </TouchableOpacity>

        {completedIds.includes(item._id) ? (
          <TouchableOpacity style={[styles.secondaryBtn, { backgroundColor: 'gray' }]} disabled>
            <MaterialIcons name="check-circle" size={18} color="#fff" />
            <Text style={styles.btnText}>Completed</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => handleMarkAsCompleted(item._id)}
          >
            <MaterialIcons name="check-circle-outline" size={18} color="#fff" />
            <Text style={styles.btnText}>Completed As</Text>
          </TouchableOpacity>
        )}
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
          <Text style={styles.empty}>No accepted PM Package appointments found.</Text>
        }
      />
    </SafeAreaView>
  );
};

export default AcceptedAppointment;

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
    borderColor: '#E0F2FE',
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
    color: COLORS.primary,
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
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 14,
  },
  tag: {
    fontSize: 12,
    fontFamily: 'Urbanist-Medium',
    color: COLORS.primary,
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
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  secondaryBtn: {
    flex: 1,
    backgroundColor: '#10B981',
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
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

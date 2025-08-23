import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import ApiService from '../../src/api/ApiService';
import { ENDPOINTS } from '../../src/constants/Endpoints';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch } from 'react-redux';
import { showLoader, hideLoader } from '../../src/redux/slices/loaderSlice';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../../constants';

const CompletedAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const fetchReportCount = async (appointmentId) => {
    try {
      const res = await ApiService.get(`${ENDPOINTS.patient_get_pathology_report_count}/${appointmentId}`);
      return res?.data || 0;
    } catch (error) {
      console.log('Error fetching report count:', error);
      return 0;
    }
  };

  const fetchAppointments = async () => {
    try {
      dispatch(showLoader());
      const response = await ApiService.get(ENDPOINTS.approved_pathology_appointments_report);
      const appointmentsData = response?.data || [];

      const enrichedAppointments = await Promise.all(
        appointmentsData.map(async (item) => {
          const count = await fetchReportCount(item._id);
          return { ...item, report_count: count };
        })
      );

      setAppointments(enrichedAppointments);
    } catch (error) {
      console.log('Error fetching completed appointments:', error);
    } finally {
      dispatch(hideLoader());
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <MaterialCommunityIcons
          name={item.appointment_type === 'center-visit' ? 'hospital-building' : 'home'}
          size={20}
          color={COLORS.primary}
        />
        <Text style={styles.unitName}>{item.patient_name}</Text>
      </View>

      <View style={styles.infoRow}>
        <View style={styles.infoBox}>
          <Text style={styles.label}>Gender / Age</Text>
          <Text style={styles.value}>{item.patient_gender} / {item.patient_age} yrs</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.label}>Date</Text>
          <Text style={styles.value}>{item.appointment_request_date}</Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        <View style={styles.infoBox}>
          <Text style={styles.label}>Time</Text>
          <Text style={styles.value}>{item.appointment_time}</Text>
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.label}>Payment</Text>
          <Text style={styles.value}>₹{item.appointment_payment}</Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        <View style={styles.infoBox}>
          <Text style={styles.label}>Reports</Text>
          <Text style={styles.value}>{item.report_count}</Text>
        </View>
        <View style={styles.infoBox}>
  <Text style={styles.label}>Status</Text>
  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 1 }}>
    <Text style={[styles.value, { color: 'green', marginRight: 4 }]}>Completed</Text>
    <MaterialCommunityIcons name="check-circle" size={16} color="green" />
  </View>
</View>

      </View>

      <View style={styles.bookedByRow}>
        <Image source={{ uri: item.booked_by_image }} style={styles.avatar} />
        <Text style={styles.bookedByText}>Booked by : {item.booked_by}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => navigation.navigate('ReportScreen', { id: item._id })}
        >
          <MaterialCommunityIcons name="information-outline" size={18} color="#fff" />

          <Text style={styles.btnText}>Check Reports</Text>
          {item.report_count > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.report_count}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.outlineBtn}
          onPress={() => navigation.navigate('ReciptScreen', { id: item._id })}
        >
          <MaterialCommunityIcons name="file-document-outline" size={18} color={COLORS.primary} />

          <Text style={[styles.btnText, { color: COLORS.primary }]}>Get Receipt</Text>
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
          <Text style={styles.empty}>No completed appointments.</Text>
        }
      />
    </SafeAreaView>
  );
};

export default CompletedAppointments;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderColor: '#E0F2FE',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
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
  },
  infoBox: {
    flex: 1,
    marginRight: 6,
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
    position: 'relative',
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
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'red',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  empty: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 14,
    color: '#9CA3AF',
    fontFamily: 'Urbanist-Regular',
  },
});

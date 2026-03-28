import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  RefreshControl,
  SafeAreaView,
  Alert
} from 'react-native'
import React, { useEffect, useState, useCallback } from 'react'
import { COLORS } from '../constants'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import LinearGradient from 'react-native-linear-gradient'
import { useDispatch } from 'react-redux'
import { useFocusEffect } from '@react-navigation/native'
import { hideLoader, showLoader } from '../../redux/slices/loaderSlice'
import ApiService from '../../api/ApiService'
import { ENDPOINTS } from '../../constants/Endpoints'

const VideoAppointments = ({ navigation }) => {
  const [appointments, setAppointments] = useState([])
  const [refreshing, setRefreshing] = useState(false)
  const dispatch = useDispatch()

  const fetchAppointments = async () => {
    try {
      dispatch(showLoader());
      const response = await ApiService.get(ENDPOINTS.patient_approved_video_appointments);
      console.log('Video Appointments Data:', response);
      const data = response?.data?.appointments || response?.data || [];
      setAppointments(data);
      dispatch(hideLoader());
    } catch (error) {
      console.log("Fetch Appointments Error:", error);
      dispatch(hideLoader());
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchAppointments();
    }, [])
  );

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchAppointments();
    } catch (error) {
      console.log("Refresh error", error);
    } finally {
      setRefreshing(false);
    }
  };

  const renderItem = ({ item }) => {
    const doctor = item?.doctors?.[0] || {};
    
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Image 
            source={doctor?.profilePhoto } 
            style={styles.doctorImage} 
          />
          <View style={styles.doctorInfo}>
            <Text style={styles.doctorName}>Dr. {doctor?.fullName || 'Specialist'}</Text>
            <Text style={styles.specialization}>
              {Array.isArray(item.notes) ? item.notes.join(', ') : 'General Physician'}
            </Text>
            <View style={styles.statusBadge}>
              <MaterialCommunityIcons name="check-decagram" size={14} color="#2E7D32" />
              <Text style={styles.statusText}>{item.status?.toUpperCase() || 'SCHEDULED'}</Text>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <MaterialCommunityIcons name="calendar-month" size={18} color="#1A237E" />
            <Text style={styles.detailText}>{item.appointment_approve_date || 'N/A'}</Text>
          </View>
          <View style={styles.detailItem}>
            <MaterialCommunityIcons name="clock-time-four-outline" size={18} color="#1A237E" />
            <Text style={styles.detailText}>{item.appointment_time || 'N/A'}</Text>
          </View>
        </View>

        <View style={styles.patientInfoBox}>
           <Text style={styles.patientLabel}>
             Patient: <Text style={styles.patientName}>{item.patient_name || 'N/A'}</Text>
           </Text>
           <Text style={styles.uidText}>UID: {item.uid || '00000'}</Text>
        </View>

        {/* 🔥 Join Video Call Button - Navigation Added */}
        <TouchableOpacity 
          activeOpacity={0.8}
        onPress={() => {
    // Manual check hata dein kyunki token fetch karne ka kaam 
    // PatientVideoCallScreen ke andar setupAgora() mein ho raha hai.
    navigation.navigate('PatientVideoCallScreen', {
        doctorName: doctor?.fullName || 'Doctor',
        appointmentId: item._id 
    });
}}
        >
          <LinearGradient
            colors={['#1A237E', '#3F51B5']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.joinBtn}
          >
            <MaterialCommunityIcons name="video" size={22} color="#fff" />
            <Text style={styles.joinBtnText}>Join Video Call Now</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialCommunityIcons name="chevron-left" size={30} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Approved Appointments</Text>
      </View>

      <FlatList
        data={appointments}
        keyExtractor={(item) => item._id || Math.random().toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#1A237E" />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="video-off-outline" size={80} color="#ccc" />
            <Text style={styles.emptyText}>No approved appointments found.</Text>
          </View>
        }
      />
    </SafeAreaView>
  )
}

export default VideoAppointments

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    marginTop: 40
  },
  backBtn: { marginRight: 8 },
  headerTitle: { fontSize: 20, fontFamily: 'Urbanist-Bold', color: '#000' },
  listContainer: { padding: 16, paddingBottom: 40 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  doctorImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#F0F0F0'
  },
  doctorInfo: { flex: 1, marginLeft: 15 },
  doctorName: { fontSize: 17, fontFamily: 'Urbanist-Bold', color: '#212121' },
  specialization: { fontSize: 13, fontFamily: 'Urbanist-Medium', color: '#757575', marginTop: 2 },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  statusText: { color: '#2E7D32', fontSize: 11, fontFamily: 'Urbanist-Bold', marginLeft: 4 },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 15 },
  detailsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  detailItem: { flexDirection: 'row', alignItems: 'center' },
  detailText: { fontSize: 14, fontFamily: 'Urbanist-SemiBold', color: '#424242', marginLeft: 8 },
  patientInfoBox: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15, paddingHorizontal: 4 },
  patientLabel: { fontSize: 12, color: '#757575', fontFamily: 'Urbanist-Medium' },
  patientName: { color: '#000', fontFamily: 'Urbanist-Bold' },
  uidText: { fontSize: 12, color: '#9E9E9E', fontFamily: 'Urbanist-Medium' },
  joinBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 14 },
  joinBtnText: { color: '#fff', fontSize: 16, fontFamily: 'Urbanist-Bold', marginLeft: 10 },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 120 },
  emptyText: { fontSize: 16, fontFamily: 'Urbanist-Medium', color: '#9E9E9E', marginTop: 15 }
})
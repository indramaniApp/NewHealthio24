import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import ApiService from '../../src/api/ApiService';
import { ENDPOINTS } from '../../src/constants/Endpoints';
import { showLoader, hideLoader } from '../../src/redux/slices/loaderSlice';
import { COLORS } from '../../constants';

const formatDateTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const options = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  };
  return new Intl.DateTimeFormat('en-GB', options).format(date);
};

const CompletedMoreDetails = () => {
  const [data, setData] = useState([]);
  const route = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { id } = route.params;

  useEffect(() => {
    fetchCompletedDialysisDetails();
  }, []);

  const fetchCompletedDialysisDetails = async () => {
    try {
      dispatch(showLoader());
      const response = await ApiService.get(`${ENDPOINTS.dialysis_book}/${id}`);
      console.log('Completed dialysis detail response:', response);
      if (response?.status === 'success' && Array.isArray(response.data)) {
        setData(response.data);
      }
      dispatch(hideLoader());
    } catch (error) {
      console.log('Completed dialysis fetch error:', error);
      dispatch(hideLoader());
    }
  };

  const InfoLabel = ({ label, value, isStatus = false }) => (
    <View style={styles.infoRow}>
      <Text style={styles.label}>{label}:</Text>
      <Text
        style={[
          styles.value,
          isStatus && {
            backgroundColor: '#d4f4dc',
            paddingHorizontal: 8,
            borderRadius: 8,
            fontWeight: '600',
            color: '#28a745',
          },
        ]}
      >
        {value}
      </Text>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.screenHeader}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>
      <Text style={styles.screenTitle}>Completed Dialysis Details</Text>
    </View>
  );

  const renderCard = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <MaterialCommunityIcons name="check-circle" size={20} color="#fff" />
        <Text style={styles.cardHeaderText}>Completed Dialysis</Text>
        <View style={styles.cardHeaderRight}>
          <Text style={styles.serial}>#{item?.serialNumber}</Text>
        </View>
      </View>

      <View style={styles.row}>
        <Image source={{ uri: item?.booked_by_image }} style={styles.avatar} />
        <View style={{ marginLeft: 10, flex: 1 }}>
          <Text style={styles.name}>{item?.booked_by}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <InfoLabel label="Patient Name" value={item?.patient_name} />
        <InfoLabel label="Age / Gender" value={`${item?.patient_age} / ${item?.patient_gender}`} />
        <InfoLabel label="Appointment" value={`${item?.appointment_approve_date}, ${item?.appointment_time}`} />
        <InfoLabel label="Request Date" value={item?.appointment_request_date} />
        {item?.appointment_booking_number !== 'not provided' && (
          <InfoLabel label="Booking Number" value={item?.appointment_booking_number} />
        )}
        <InfoLabel label="Mode" value={item?.appointment_booking_mode} />
        <InfoLabel label="Type" value={item?.appointment_type} />
        <InfoLabel label="Status" value={item?.status} isStatus />
      </View>

      <View style={styles.section}>
        <InfoLabel label="Payment" value={`₹${item?.appointment_payment} (${item?.payment_status})`} />
        <InfoLabel label="Method" value={item?.payment_method} />
        <InfoLabel label="Txn ID" value={item?.payment_transaction_id} />
      </View>

      <View style={styles.section}>
        <InfoLabel label="Notes" value={item?.notes} />
        <Text style={styles.label}>Reason(s):</Text>
        <View style={styles.chipContainer}>
          {item?.reason_for_visit?.map((reason, index) => (
            <View key={index} style={styles.chip}>
              <Text style={styles.chipText}>{reason}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={{ marginTop: 10 }}>
        <Text style={styles.bookedOn}>Booked on: {formatDateTime(item?.createdAt)}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f4f6f9' }}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {renderHeader()}
        <FlatList
          data={data}
          renderItem={renderCard}
          keyExtractor={(item, index) => index.toString()}
          scrollEnabled={false}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default CompletedMoreDetails;

const styles = StyleSheet.create({
  screenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  screenTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 12,
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#ccc',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  cardHeader: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardHeaderRight: {
    marginLeft: 'auto',
  },
  serial: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
  cardHeaderText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 62,
    height: 62,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  section: {
    marginTop: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
    marginBottom: 4,
  },
  value: {
    fontSize: 13,
    color: '#111',
    fontWeight: '500',
    marginBottom: 6,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 6,
  },
  chip: {
    backgroundColor: '#e0f7fa',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginRight: 6,
    marginBottom: 6,
  },
  chipText: {
    fontSize: 12,
    color: '#00796b',
  },
  bookedOn: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#666',
    textAlign: 'right',
  },
});

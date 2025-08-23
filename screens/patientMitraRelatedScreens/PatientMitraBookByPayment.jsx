import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Header from '../../components/Header';
import { COLORS } from '../../constants';
import ApiService from '../../src/api/ApiService';
import { ENDPOINTS } from '../../src/constants/Endpoints';
import RazorpayCheckout from 'react-native-razorpay';
import { useDispatch } from 'react-redux';
import { showLoader, hideLoader } from '../../src/redux/slices/loaderSlice';
import Toast from 'react-native-simple-toast';

const RAZORPAY_KEY_ID = 'rzp_test_GvwPgZcP2tn6O2';

const PatientMitraBookByPayment = ({ route, navigation }) => {
  const { packageId, startedDate, selectedHour } = route?.params || {};

  const [patientName, setPatientName] = useState('');
  const [patientGender, setPatientGender] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [location, setLocation] = useState('');
  const [referralId, setReferralId] = useState(''); // New Referral ID state

  const dispatch = useDispatch();

  const handleSubmit = async () => {
    if (!patientName || !patientGender || !patientAge || !location) {
      Alert.alert('Missing Fields', 'Please fill all patient details and location');
      return;
    }

    dispatch(showLoader());

    try {
      const payload = {
        booking_request_date: startedDate,
        booking_time: selectedHour,
        location,
        patient_age: patientAge,
        patient_name: patientName,
        patient_gender: patientGender,
        referral_id: referralId, // Include referral ID in payload
      };

      const finalUrl = `${ENDPOINTS.book_pm_package}/${packageId}`;
      const response = await ApiService.post(finalUrl, payload, true, false);
      console.log('Booking response:', response);

      if (response?.status === 'success') {
        const orderId = response?.data?.razorpay_order_id;
        handlePayment(orderId);
      } else {
        Toast.show(response?.message || 'Booking failed');
        dispatch(hideLoader());
      }
    } catch (error) {
      console.error('Booking Error:', error);
      Toast.show('Something went wrong. Please try again.');
      dispatch(hideLoader());
    }
  };

  const handlePayment = (orderId) => {
    const options = {
      description: 'PM Package Payment',
      image: 'https://i.imgur.com/3g7nmJC.jpg',
      currency: 'INR',
      key: RAZORPAY_KEY_ID,
      amount: 100, // ₹1 for testing
      name: 'Helthio24',
      order_id: orderId,
      prefill: {
        email: 'indramani@example.com',
        contact: '9191919191',
        name: 'Indramani Mishra',
      },
      theme: { color: COLORS.primary },
    };

    RazorpayCheckout.open(options)
      .then((data) => {
        const payment_id = data.razorpay_payment_id;
        const signature = data.razorpay_signature;
        verifyPayment(payment_id, signature, orderId);
      })
      .catch((error) => {
        dispatch(hideLoader());
        Alert.alert('Payment Cancelled', `Reason: ${error.description}`);
      });
  };

  const verifyPayment = async (payment_id, signature, order_id) => {
    try {
      const payload = { payment_id, signature, order_id };
      const response = await ApiService.post(ENDPOINTS.payment_pm_package_verify, payload, true, false);
      dispatch(hideLoader());

      if (response?.status === 'success') {
        Toast.show('Payment Verified & Package Booked');
        navigation.navigate('Home');
      } else {
        Toast.show(response?.message || 'Payment verification failed');
      }
    } catch (error) {
      console.error('Verification Error:', error);
      Toast.show('Verification failed. Please contact support.');
      dispatch(hideLoader());
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F3F4F6" />
      <Header title="Book Package by Payment" onBackPress={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.form}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Selected Package Details</Text>
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>Date:</Text>
            <Text style={styles.cardValue}>{startedDate || 'N/A'}</Text>
          </View>
          <View style={styles.cardRow}>
            <Text style={styles.cardLabel}>Time:</Text>
            <Text style={styles.cardValue}>{selectedHour || 'N/A'}</Text>
          </View>
        </View>

        <Text style={styles.label}>Patient Name</Text>
        <TextInput
          style={styles.input}
          value={patientName}
          onChangeText={setPatientName}
          placeholder="Enter Patient Name"
          placeholderTextColor="#9CA3AF"
        />

        <Text style={styles.label}>Patient Gender</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={patientGender}
            onValueChange={setPatientGender}
            style={styles.picker}
            dropdownIconColor="#4B5563"
          >
            <Picker.Item label="Select Gender" value="" color="#9CA3AF" />
            <Picker.Item label="Male" value="Male" />
            <Picker.Item label="Female" value="Female" />
            <Picker.Item label="Other" value="Other" />
          </Picker>
        </View>

        <Text style={styles.label}>Patient Age</Text>
        <TextInput
          style={styles.input}
          value={patientAge}
          onChangeText={setPatientAge}
          placeholder="Enter Age"
          keyboardType="numeric"
          placeholderTextColor="#9CA3AF"
        />

        <Text style={styles.label}>Location</Text>
        <TextInput
          style={styles.input}
          value={location}
          onChangeText={setLocation}
          placeholder="Enter Address / Location"
          placeholderTextColor="#9CA3AF"
        />

        {/* Referral ID Input */}
        <Text style={styles.label}>Referral ID (Optional)</Text>
        <TextInput
          style={styles.input}
          value={referralId}
          onChangeText={setReferralId}
          placeholder="Enter Referral ID"
          placeholderTextColor="#9CA3AF"
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Proceed to Payment</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default PatientMitraBookByPayment;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  form: { padding: 20 },
  card: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  cardTitle: { fontSize: 18, fontWeight: '600', color: '#111827', marginBottom: 12 },
  cardRow: { flexDirection: 'row', marginBottom: 8 },
  cardLabel: { fontWeight: '500', color: '#6B7280', width: 60 },
  cardValue: { color: '#1F2937', fontWeight: '500' },
  label: { fontSize: 14, color: '#374151', marginBottom: 6, marginTop: 6, fontWeight: '500' },
  input: {
    backgroundColor: '#ffffff',
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 16,
    color: '#111827',
  },
  pickerWrapper: {
    backgroundColor: '#ffffff',
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  picker: { height: 48, color: '#111827', paddingHorizontal: 16 },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    elevation: 4,
  },
  buttonText: { color: '#ffffff', fontSize: 16, fontWeight: '600' },
});

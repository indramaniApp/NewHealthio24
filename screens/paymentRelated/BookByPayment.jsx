import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity,
  TextInput, ScrollView, Modal, StatusBar, Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { Picker } from '@react-native-picker/picker';
import { useNavigation, useTheme } from '@react-navigation/native';
import Toast from 'react-native-simple-toast';
import RazorpayCheckout from 'react-native-razorpay';
import { useDispatch } from 'react-redux';
import { ENDPOINTS } from '../../src/constants/Endpoints';
import ApiService from '../../src/api/ApiService';
import { hideLoader, showLoader } from '../../src/redux/slices/loaderSlice';

const RAZORPAY_KEY_ID = 'rzp_live_RQTJU3bg9xBPn0';

const GRADIENT_COLORS = ['#F06292', '#6A1B9A'];

const BookByPayment = ({ route }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { colors, dark } = useTheme();

  const { startedDate, selectedHour, patient_name, patient_age, patient_gender } = route.params || {};

  const [selectedMode, setSelectedMode] = useState('');
  const [modeModalVisible, setModeModalVisible] = useState(false);

  const [appointmentDetails, setAppointmentDetails] = useState({
    appointment_request_date: startedDate || '',
    appointment_time: selectedHour || '',
    appointment_type: '',
    patient_name: patient_name || '',
    patient_age: patient_age || '',
    patient_gender: patient_gender || '',
  });

  const handleChange = (key, value) => {
    setAppointmentDetails(prev => ({ ...prev, [key]: value }));
  };

  const isFormValid =
    selectedMode &&
    appointmentDetails.patient_name.trim() &&
    appointmentDetails.patient_age.trim() &&
    appointmentDetails.patient_gender.trim();

  const handleSubmit = async () => {
    if (!isFormValid) {
      Toast.show('Please fill all fields and select mode');
      return;
    }

    dispatch(showLoader());
    try {
      const payload = { ...appointmentDetails, appointment_type: selectedMode };
      const response = await ApiService.post(ENDPOINTS.create_tests_packages_cart_order_booking, payload, true, false);

      if (response?.status === 'success') {
        handlePayment(response?.data?.razorpay_order_id, response?.data?.amount || 100);
      } else {
        Toast.show(response?.message || 'Failed to create order');
      }
    } catch (error) {
      Toast.show("Something went wrong");
    } finally {
      dispatch(hideLoader());
    }
  };

  const handlePayment = (orderId, amount) => {
    const options = {
      description: 'Test Package Payment',
      currency: 'INR',
      key: RAZORPAY_KEY_ID,
      amount,
      name: 'Helthio24',
      order_id: orderId,
      prefill: { name: appointmentDetails.patient_name },
      theme: { color: '#6A1B9A' }
    };

    RazorpayCheckout.open(options)
      .then(data => verifyPayment(data.razorpay_payment_id, data.razorpay_signature, orderId))
      .catch(error => Alert.alert(`Payment Cancelled`, `Reason: ${error.description}`));
  };

  const verifyPayment = async (payment_id, signature, order_id) => {
    dispatch(showLoader());
    try {
      const response = await ApiService.post(ENDPOINTS.payment_cart_tests_packages_verify,
        { payment_id, signature, order_id }, true, false);

      if (response?.status === 'success') {
        Toast.show('Payment Verified Successfully');
        navigation.navigate('Main');
      } else {
        Toast.show(response?.message || 'Verification failed');
      }
    } finally {
      dispatch(hideLoader());
    }
  };

  const modeOptions = [
    { label: 'Select Mode', value: '', disabled: true },
    { label: 'Center Visit', value: 'center-visit' },
    { label: 'Home Visit', value: 'home-visit' },
  ];

  const selectedModeLabel = modeOptions.find(opt => opt.value === selectedMode)?.label || 'Select Mode';

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <Text style={styles.headerTitle}>Fill Test Details</Text>

        <View style={styles.card}>
          <Text style={styles.text}>📅 Date: {appointmentDetails.appointment_request_date || 'Not selected'}</Text>
          <Text style={styles.text}>⏰ Time: {appointmentDetails.appointment_time || 'Not selected'}</Text>
        </View>

        <Text style={styles.label}>Patient Name</Text>
        <TextInput style={styles.input} value={appointmentDetails.patient_name}
          onChangeText={t => handleChange('patient_name', t)} placeholder="Enter patient name" />

        <Text style={styles.label}>Patient Age</Text>
        <TextInput style={styles.input} keyboardType="number-pad"
          value={appointmentDetails.patient_age}
          onChangeText={t => handleChange('patient_age', t)} placeholder="Enter age" />

        <Text style={styles.label}>Gender</Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={appointmentDetails.patient_gender}
            onValueChange={v => handleChange('patient_gender', v)}>
            <Picker.Item label="Select Gender" value="" />
            <Picker.Item label="Male" value="Male" />
            <Picker.Item label="Female" value="Female" />
            <Picker.Item label="Other" value="Other" />
          </Picker>
        </View>

        <Text style={styles.label}>Choose Mode</Text>
        <TouchableOpacity style={styles.pickerBox} onPress={() => setModeModalVisible(true)}>
          <Text style={{ fontSize: 16, color: selectedMode ? '#000' : '#999' }}>{selectedModeLabel}</Text>
          <Icon name="chevron-down" size={20} color="#000" />
        </TouchableOpacity>

        {/* 🔥 GRADIENT BUTTON */}
        <TouchableOpacity disabled={!isFormValid} onPress={handleSubmit} style={{ marginTop: 10 }}>
          <LinearGradient
            colors={isFormValid ? GRADIENT_COLORS : ['#ccc', '#ccc']}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Proceed to Payment</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>

      {/* Mode Modal */}
      <Modal visible={modeModalVisible} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setModeModalVisible(false)}>
          <View style={styles.modalBox}>
            {modeOptions.map(option => (
              <TouchableOpacity key={option.value} disabled={option.disabled}
                onPress={() => { setSelectedMode(option.value); setModeModalVisible(false); }}
                style={styles.modalItem}>
                <Text style={{ fontSize: 16, color: option.disabled ? '#aaa' : '#000' }}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

export default BookByPayment;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff', padding: 16 }, // ✅ MAIN SCREEN WHITE
  headerTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  card: { backgroundColor: '#F5F5F5', padding: 16, borderRadius: 12, marginBottom: 24 },
  text: { fontSize: 16, marginBottom: 6 },
  label: { fontSize: 16, marginBottom: 6, fontWeight: '600' },
  input: { backgroundColor: '#F5F5F5', borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 16 },
  pickerContainer: { backgroundColor: '#F5F5F5', borderRadius: 8, marginBottom: 24 },
  pickerBox: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: { paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  modalBox: { backgroundColor: '#fff', borderRadius: 10, width: '80%', paddingVertical: 10 },
  modalItem: { padding: 14 }
});

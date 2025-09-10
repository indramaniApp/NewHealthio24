import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Modal,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import RazorpayCheckout from 'react-native-razorpay';
import { useDispatch } from 'react-redux';
import Toast from 'react-native-simple-toast';
import { hideLoader, showLoader } from '../../src/redux/slices/loaderSlice';
import { ENDPOINTS } from '../../src/constants/Endpoints';
import ApiService from '../../src/api/ApiService';
import { useTheme } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../../components/Header'; 

const RAZORPAY_KEY_ID = 'rzp_test_R8LVEozZxuRsqb';

const BookByPaymentDirect = ({ route }) => {
  const { colors, dark } = useTheme();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const placeholderColor = colors.placeholder || (dark ? '#aaa' : '#666');

  const { testType, testId, packageId, startedDate, selectedHour, patient_name, patient_age, patient_gender } =
    route?.params || {};

  const [selectedMode, setSelectedMode] = useState('');
  const [modeModalVisible, setModeModalVisible] = useState(false);

  const [appointmentDetails, setAppointmentDetails] = useState({
    appointment_request_date: startedDate || '',
    appointment_time: selectedHour || '',
    appointment_type: '',
    patient_name: patient_name || '',
    patient_age: patient_age || '',
    patient_gender: patient_gender || '',
    referral_id: '',
  });

  const handleChange = (key, value) => {
    setAppointmentDetails(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async () => {
    if (
      !appointmentDetails.patient_name ||
      !appointmentDetails.patient_age ||
      !appointmentDetails.patient_gender ||
      !selectedMode
    ) {
      Alert.alert('Validation', 'Please fill all patient details and select a test mode');
      return;
    }

    dispatch(showLoader());

    // 3. The payload now automatically includes referral_id from state
    const payload = {
      ...appointmentDetails,
      appointment_type: selectedMode,
    };

    let endpoint = '';
    let id = '';

    if (testType === 'single') {
      endpoint = ENDPOINTS.book_test;
      id = testId;
    } else if (testType === 'package') {
      endpoint = ENDPOINTS.book_package;
      id = packageId;
    }

    try {
      const response = await ApiService.post(`${endpoint}/${id}`, payload, true, false);
      if (response?.status === 'success') {
        const razorpayOrderId = response?.data?.razorpay_order_id;
        handlePayment(razorpayOrderId, id);
      } else {
        Toast.show(response?.message || 'Booking failed');
      }
    } catch (error) {
      Toast.show('Error in booking. Please try again.');
    } finally {
      dispatch(hideLoader());
    }
  };

  const handlePayment = (orderId, entityId) => {
    const options = {
      description: 'Test Booking Payment',
      image: 'https://i.imgur.com/3g7nmJC.jpg',
      currency: 'INR',
      key: RAZORPAY_KEY_ID,
      amount: 100,
      name: 'Helthio24',
      order_id: orderId,
      prefill: {
        email: 'user@example.com',
        contact: '9999999999',
        name: appointmentDetails.patient_name,
      },
      theme: { color: '#007BFF' },
    };

    RazorpayCheckout.open(options)
      .then(data => {
        const payment_id = data.razorpay_payment_id;
        const signature = data.razorpay_signature;
        verifyPayment(payment_id, signature, orderId, entityId);
      })
      .catch(() => {
        Alert.alert('Payment Failed', 'You cancelled the payment.');
      });
  };

  const verifyPayment = async (payment_id, signature, order_id, entityId) => {
    dispatch(showLoader());

    const payload = {
      payment_id,
      signature,
      order_id,
    };

    let verifyEndpoint =
      testType === 'single' ? ENDPOINTS.payment_test_verify : ENDPOINTS.payment_package_verify;

    try {
      const response = await ApiService.post(`${verifyEndpoint}`, payload, true, false);
      if (response?.status === 'success') {
        Toast.show('Payment successful');
        navigation.navigate('Main');
      } else {
        Toast.show(response?.message || 'Verification failed');
      }
    } catch (error) {
      Toast.show('Error verifying payment');
    } finally {
      dispatch(hideLoader());
    }
  };

  const isFormValid =
    appointmentDetails.patient_name &&
    appointmentDetails.patient_age &&
    appointmentDetails.patient_gender &&
    selectedMode;

  const modeOptions = [
    { label: 'Select Mode', value: '', disabled: true },
    { label: 'Center Visit', value: 'center-visit' },
    { label: 'Home Visit', value: 'home-visit' },
  ];

  const selectedModeLabel =
    modeOptions.find(opt => opt.value === selectedMode)?.label || 'Select Mode';

  return (
    // 4. Wrap the entire view with LinearGradient
    <LinearGradient
      colors={['#00b4db', '#FFFFFF', '#fff']}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={styles.container}>
        {/* 5. Make StatusBar transparent and translucent */}
        <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />

        <Header title="Patient Details" onBackPress={() => navigation.goBack()}
          style={{ backgroundColor: 'transparent' }}
        />

        <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <Text style={[styles.text, { color: colors.text }]}>📅 Date: {appointmentDetails.appointment_request_date}</Text>
            <Text style={[styles.text, { color: colors.text }]}>⏰ Time: {appointmentDetails.appointment_time}</Text>
          </View>

          <Text style={[styles.label, { color: colors.text }]}>Patient Name</Text>
          <TextInput
            placeholder="Enter patient name"
            placeholderTextColor={placeholderColor}
            style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
            value={appointmentDetails.patient_name}
            onChangeText={text => handleChange('patient_name', text)}
          />

          <Text style={[styles.label, { color: colors.text }]}>Patient Age</Text>
          <TextInput
            placeholder="Enter age"
            placeholderTextColor={placeholderColor}
            keyboardType="number-pad"
            style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
            value={appointmentDetails.patient_age}
            onChangeText={text => handleChange('patient_age', text)}
          />

          <Text style={[styles.label, { color: colors.text }]}>Gender</Text>
          <View style={[styles.pickerContainer, { backgroundColor: colors.card }]}>
            <Picker
              selectedValue={appointmentDetails.patient_gender}
              onValueChange={value => handleChange('patient_gender', value)}
              style={{ color: colors.text }}
              dropdownIconColor={colors.text}
            >
              <Picker.Item label="Select Gender" value="" />
              <Picker.Item label="Male" value="Male" />
              <Picker.Item label="Female" value="Female" />
              <Picker.Item label="Other" value="Other" />
            </Picker>
          </View>

          <Text style={[styles.label, { color: colors.text }]}>Choose Mode</Text>
          <TouchableOpacity
            style={[styles.pickerBox, { backgroundColor: colors.card }]}
            onPress={() => setModeModalVisible(true)}
          >
            <Text style={{ fontSize: 16, color: selectedMode ? colors.text : placeholderColor }}>
              {selectedModeLabel}
            </Text>
            <Icon name="chevron-down" size={20} color={colors.text} />
          </TouchableOpacity>

          {/* 6. Added Referral ID Input Field */}
          <Text style={[styles.label, { color: colors.text }]}>Referral ID (Optional)</Text>
          <TextInput
            placeholder="Enter referral ID"
            placeholderTextColor={placeholderColor}
            style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
            value={appointmentDetails.referral_id}
            onChangeText={text => handleChange('referral_id', text)}
          />

          <TouchableOpacity
            style={[styles.button, { backgroundColor: isFormValid ? '#00b4db' : '#ccc' }]}
            onPress={handleSubmit}
            disabled={!isFormValid}
          >
            <Text style={styles.buttonText}>Proceed to Payment</Text>
          </TouchableOpacity>
        </ScrollView>

        <Modal
          visible={modeModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setModeModalVisible(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setModeModalVisible(false)}
            style={styles.modalOverlay}
          >
            <View style={[styles.modalBox, { backgroundColor: colors.card }]}>
              {modeOptions.map(option => (
                <TouchableOpacity
                  key={option.value}
                  disabled={option.disabled}
                  onPress={() => {
                    if (!option.disabled) {
                      setSelectedMode(option.value);
                      setModeModalVisible(false);
                    }
                  }}
                  style={styles.modalItem}
                >
                  <Text
                    style={[
                      styles.modalItemText,
                      { color: option.disabled ? '#999' : colors.text },
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                onPress={() => setModeModalVisible(false)}
                style={[styles.modalItem, { borderTopWidth: 1, borderTopColor: '#ccc' }]}
              >
                <Text style={[styles.modalItemText, { color: 'red' }]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default BookByPaymentDirect;

// 7. Adjusted styles to match the look
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'transparent', // Make sure background is transparent
    paddingTop: StatusBar.currentHeight,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    elevation: 3,
  },
  text: {
    fontSize: 16,
    marginBottom: 6,
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    fontWeight: '600',
  },
  input: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1, // Added border for consistent styling
    borderColor: '#ccc',
  },
  pickerContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 24,
    borderWidth: 1, // Added border
    borderColor: '#ccc',
  },
  pickerBox: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1, // Added border
    borderColor: '#ccc',
  },
  button: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    borderRadius: 10,
    width: '80%',
    paddingVertical: 10,
    elevation: 5,
  },
  modalItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  modalItemText: {
    fontSize: 16,
  },
});
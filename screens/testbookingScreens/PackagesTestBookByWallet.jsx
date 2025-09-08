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
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useTheme } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { useDispatch } from 'react-redux';
import { ENDPOINTS } from '../../src/constants/Endpoints';
import ApiService from '../../src/api/ApiService';
import { showLoader, hideLoader } from '../../src/redux/slices/loaderSlice';
// 1. LinearGradient और Header को import करें
import LinearGradient from 'react-native-linear-gradient';
import Header from '../../components/Header'; // Header component का इस्तेमाल करें

const PackagesTestBookByWallet = ({ route }) => {
  const { startedDate, selectedHour, packageId } = route.params || {};

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { colors, dark } = useTheme();
  const placeholderColor = dark ? '#aaa' : '#666';

  const [selectedMode, setSelectedMode] = useState('');
  const [modeModalVisible, setModeModalVisible] = useState(false);
  const [referralId, setReferralId] = useState(''); // Referral ID के लिए state

  const [appointmentDetails, setAppointmentDetails] = useState({
    appointment_request_date: startedDate || '',
    appointment_time: selectedHour || '',
    patient_name: '',
    patient_age: '',
    patient_gender: '',
  });

  const handleChange = (key, value) => {
    setAppointmentDetails(prev => ({ ...prev, [key]: value }));
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

    try {
      const payload = {
        ...appointmentDetails,
        appointment_type: selectedMode,
      };
      // अगर referralId है तो उसे payload में जोड़ें
      if (referralId.trim()) {
        payload.referral_id = referralId.trim();
      }

      const apiUrl = `${ENDPOINTS.book_package_wallet}/${packageId}`;
      const response = await ApiService.post(apiUrl, payload, true, false);

      if (response?.status === 'success') {
        Alert.alert('Success', response?.message || 'Booked successfully!', [
          { text: 'OK', onPress: () => navigation.navigate('Main') },
        ]);
      } else {
        Alert.alert('Error', response?.message || 'Something went wrong.');
      }
    } catch (error) {
      let msg = error?.response?.data?.message || error?.message || 'Something went wrong.';
      Alert.alert('Error', msg);
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
    // 2. Screen के background के लिए LinearGradient
    <LinearGradient colors={['#00b4db', '#FFFFFF', "#ffff"]} style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeArea}>
        {/* 3. Custom Header की जगह imported Header का इस्तेमाल करें */}
        <Header
          title="Fill Patient Details"
          onBackPress={() => navigation.goBack()}
          style={{ marginTop: 40 }}
        />

        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          {/* Appointment Details Card */}
          <LinearGradient
            colors={['#FFFFFF', '#F9FAFB']}
            style={styles.card}
          >
            <Text style={[styles.text, { color: colors.text }]}>
              📅 Date: {appointmentDetails.appointment_request_date || 'Not selected'}
            </Text>
            <Text style={[styles.text, { color: colors.text }]}>
              ⏰ Time: {appointmentDetails.appointment_time || 'Not selected'}
            </Text>
          </LinearGradient>

          {/* Form Inputs */}
          <Text style={[styles.label, { color: colors.text }]}>Patient Name</Text>
          <TextInput
            placeholder="Enter patient name"
            placeholderTextColor={placeholderColor}
            style={[styles.input, { backgroundColor: '#F9FAFB', color: colors.text }]}
            value={appointmentDetails.patient_name}
            onChangeText={text => handleChange('patient_name', text)}
          />

          <Text style={[styles.label, { color: colors.text }]}>Patient Age</Text>
          <TextInput
            placeholder="Enter age"
            placeholderTextColor={placeholderColor}
            keyboardType="number-pad"
            style={[styles.input, { backgroundColor: '#F9FAFB', color: colors.text }]}
            value={appointmentDetails.patient_age}
            onChangeText={text => handleChange('patient_age', text)}
          />

          <Text style={[styles.label, { color: colors.text }]}>Gender</Text>
          <View style={[styles.pickerContainer, { backgroundColor: '#F9FAFB' }]}>
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
            style={[styles.pickerBox, { backgroundColor: '#F9FAFB' }]}
            onPress={() => setModeModalVisible(true)}
          >
            <Text style={{ fontSize: 16, color: selectedMode ? colors.text : placeholderColor }}>
              {selectedModeLabel}
            </Text>
            <Icon name="chevron-down" size={20} color={colors.text} />
          </TouchableOpacity>

          {/* 4. Referral ID Input Box */}
          <Text style={[styles.label, { color: colors.text }]}>Referral ID (Optional)</Text>
          <TextInput
            placeholder="Enter referral ID"
            placeholderTextColor={placeholderColor}
            style={[styles.input, { backgroundColor: '#F9FAFB', color: colors.text }]}
            value={referralId}
            onChangeText={setReferralId}
          />

          {/* Submit Button */}
          <TouchableOpacity onPress={handleSubmit} disabled={!isFormValid}>
            <LinearGradient
              colors={isFormValid ? ['#0077b6', '#00b4db'] : ['#A9A9A9', '#D3D3D3']}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Proceed to Payment</Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>

        {/* Modal for Mode Options */}
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
            <LinearGradient
              colors={['#FFFFFF', '#FAFCFF']}
              style={styles.modalBox}
            >
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
                style={[styles.modalItem, { borderTopWidth: 1, borderTopColor: '#eee' }]}
              >
                <Text style={[styles.modalItemText, { color: 'red' }]}>Cancel</Text>
              </TouchableOpacity>
            </LinearGradient>
          </TouchableOpacity>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default PackagesTestBookByWallet;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  text: {
    fontSize: 16,
    marginBottom: 6,
    fontWeight: '500',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  pickerContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#eee',
  },
  pickerBox: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
  },
  button: {
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 16,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
    textAlign: 'center',
  },
});
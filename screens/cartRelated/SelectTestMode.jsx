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
import { useNavigation, useTheme } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { useDispatch } from 'react-redux';
import { ENDPOINTS } from '../../src/constants/Endpoints';
import ApiService from '../../src/api/ApiService';
import { hideLoader, showLoader } from '../../src/redux/slices/loaderSlice';

const SelectTestMode = ({ route }) => {
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
    setAppointmentDetails(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!appointmentDetails.patient_name || !appointmentDetails.patient_age || !appointmentDetails.patient_gender || !selectedMode) {
      Alert.alert('Missing Fields', 'Please fill all patient details and select a test mode');
      return;
    }

    const data = {
      ...appointmentDetails,
      appointment_type: selectedMode,
    };

    try {
      dispatch(showLoader());
      const response = await ApiService.post(ENDPOINTS.create_tests_cart_order_booking_wallet, data, true, false);

      if (response?.status === 'success') {
        Alert.alert('Success', response?.message || 'Appointment booked successfully!', [
          { text: 'OK', onPress: () => navigation.navigate('Main') },
        ]);
      } else {
        Alert.alert('Error', response?.message || 'Something went wrong.');
      }
    } catch (error) {
      const msg = error?.response?.data?.message || error?.message || 'Something went wrong.';
      Alert.alert('Error', msg);
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

  const isFormValid =
    appointmentDetails.patient_name &&
    appointmentDetails.patient_age &&
    appointmentDetails.patient_gender &&
    selectedMode;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.card, shadowColor: colors.border }]}>
        <TouchableOpacity style={[styles.backButton, { backgroundColor: colors.card }]} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Fill Test Details</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={[styles.text, { color: colors.text }]}>
            📅 Date: {appointmentDetails.appointment_request_date || 'Not selected'}
          </Text>
          <Text style={[styles.text, { color: colors.text }]}>
            ⏰ Time: {appointmentDetails.appointment_time || 'Not selected'}
          </Text>
        </View>

        {/* Patient Name */}
        <Text style={[styles.label, { color: colors.text }]}>Patient Name</Text>
        <TextInput
          placeholder="Enter patient name"
          placeholderTextColor={colors.placeholder || (dark ? '#aaa' : '#666')}
          style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
          value={appointmentDetails.patient_name}
          onChangeText={text => handleChange('patient_name', text)}
        />

        {/* Age */}
        <Text style={[styles.label, { color: colors.text }]}>Patient Age</Text>
        <TextInput
          placeholder="Enter age"
          placeholderTextColor={colors.placeholder || (dark ? '#aaa' : '#666')}
          keyboardType="number-pad"
          style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
          value={appointmentDetails.patient_age}
          onChangeText={text => handleChange('patient_age', text)}
        />

        {/* Gender */}
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

        {/* Mode */}
        <Text style={[styles.label, { color: colors.text }]}>Choose Mode</Text>
        <TouchableOpacity
          style={[styles.pickerBox, { backgroundColor: colors.card }]}
          onPress={() => setModeModalVisible(true)}
        >
          <Text style={{ fontSize: 16, color: selectedMode ? colors.text : colors.placeholder || '#999' }}>
            {selectedModeLabel}
          </Text>
          <Icon name="chevron-down" size={20} color={colors.text} />
        </TouchableOpacity>

        {/* Proceed to Pay */}
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: isFormValid ? '#007BFF' : '#ccc' },
          ]}
          onPress={handleSubmit}
          disabled={!isFormValid}
        >
          <Text style={styles.buttonText}>Proceed to Pay</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal */}
      <Modal visible={modeModalVisible} transparent animationType="fade" onRequestClose={() => setModeModalVisible(false)}>
        <TouchableOpacity activeOpacity={1} onPress={() => setModeModalVisible(false)} style={styles.modalOverlay}>
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
                    {
                      color: option.disabled ? (colors.placeholder || '#999') : colors.text,
                    },
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
  );
};

export default SelectTestMode;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 16,
    elevation: 4,
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    elevation: 3,
  },
  text: { fontSize: 16, marginBottom: 6 },
  label: { fontSize: 16, marginBottom: 6, fontWeight: '600' },
  input: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  pickerContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 24,
  },
  pickerBox: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
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

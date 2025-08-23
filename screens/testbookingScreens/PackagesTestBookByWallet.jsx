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
import { showLoader, hideLoader } from '../../src/redux/slices/loaderSlice';

const PackagesTestBookByWallet = ({ route }) => {
  const { startedDate, selectedHour, patient_name, patient_age, patient_gender, packageId } =
    route.params || {};

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { colors, dark } = useTheme();

  const placeholderColor = colors.placeholder || (dark ? '#aaa' : '#666');

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
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={dark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: dark ? '#333' : '#eee' }]}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Fill Patient Details</Text>
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

        {/* Form Inputs */}
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

        <TouchableOpacity
          style={[styles.button, { backgroundColor: isFormValid ? '#007BFF' : '#ccc' }]}
          onPress={handleSubmit}
          disabled={!isFormValid}
        >
          <Text style={styles.buttonText}>Proceed to Payment</Text>
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
                      color: option.disabled ? '#999' : colors.text,
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

export default PackagesTestBookByWallet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
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
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
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

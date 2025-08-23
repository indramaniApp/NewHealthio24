import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTheme } from '@react-navigation/native';
import Header from '../../components/Header';
import { COLORS } from '../../constants';
import ApiService from '../../src/api/ApiService';
import { ENDPOINTS } from '../../src/constants/Endpoints';
import { useDispatch } from 'react-redux';
import { showLoader, hideLoader } from '../../src/redux/slices/loaderSlice';

const SingleTestBookByWallet = ({ navigation, route }) => {
  const { testId, startedDate, selectedHour } = route.params || {};
  const { colors } = useTheme();
  const dispatch = useDispatch();

  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [gender, setGender] = useState('');
  const [appointmentType, setAppointmentType] = useState('');

  const handleSubmit = async () => {
    if (!patientName || !patientAge || !gender || !appointmentType) {
      Alert.alert('Validation', 'Please fill all fields properly.');
      return;
    }

    dispatch(showLoader());

    try {
      const payload = {
        appointment_request_date: startedDate,
        appointment_time: selectedHour,
        appointment_type: appointmentType,
        patient_name: patientName,
        patient_age: patientAge,
        patient_gender: gender,
      };

      const finalUrl = `${ENDPOINTS.book_test_wallet}/${testId}`;
      const response = await ApiService.post(finalUrl, payload, true, false);

      if (response?.status === 'success') {
        Alert.alert('Success', response?.message || 'Booked successfully!', [
          { text: 'OK', onPress: () => navigation.navigate('Main') },
        ]);
      } else {
        Alert.alert('Error', response?.message || 'Something went wrong.');
      }
    } catch (error) {
      const msg =
        error?.response?.data?.message || error?.message || 'Something went wrong.';
      Alert.alert('Error', msg);
    } finally {
      dispatch(hideLoader());
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Complete Blood Test" onBackPress={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Appointment Info Card */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.cardText, { color: colors.text }]}>
            Appointment Date: {startedDate}
          </Text>
          <Text style={[styles.cardText, { color: colors.text }]}>
            Appointment Time: {selectedHour}
          </Text>
        </View>

        {/* Form */}
        <View style={styles.formSection}>
          <Text style={[styles.label, { color: colors.text }]}>Patient Name</Text>
          <TextInput
            style={[styles.input, { color: colors.text, borderColor: colors.border }]}
            value={patientName}
            onChangeText={setPatientName}
            placeholder="Enter patient name"
            placeholderTextColor={colors.text + '88'}
          />

          <Text style={[styles.label, { color: colors.text }]}>Age</Text>
          <TextInput
            style={[styles.input, { color: colors.text, borderColor: colors.border }]}
            value={patientAge}
            onChangeText={setPatientAge}
            placeholder="Enter age"
            placeholderTextColor={colors.text + '88'}
            keyboardType="numeric"
          />

          <Text style={[styles.label, { color: colors.text }]}>Gender</Text>
          <View style={[styles.pickerWrapper, { borderColor: colors.border }]}>
            <Picker
              selectedValue={gender}
              onValueChange={(itemValue) => setGender(itemValue)}
              style={[styles.picker, { color: colors.text }]}
              dropdownIconColor={colors.text}
            >
              <Picker.Item label="Select Gender" value="" color="#888" />
              <Picker.Item label="Male" value="Male" />
              <Picker.Item label="Female" value="Female" />
              <Picker.Item label="Other" value="Other" />
            </Picker>
          </View>

          <Text style={[styles.label, { color: colors.text }]}>Appointment Type</Text>
          <View style={[styles.pickerWrapper, { borderColor: colors.border }]}>
            <Picker
              selectedValue={appointmentType}
              onValueChange={(itemValue) => setAppointmentType(itemValue)}
              style={[styles.picker, { color: appointmentType ? colors.text : '#888' }]}
              dropdownIconColor={colors.text}
            >
              <Picker.Item label="Select Appointment Type" value="" color="#888" />
              <Picker.Item label="Center Visit" value="center-visit" />
              <Picker.Item label="Home Collection" value="home-visit" />
            </Picker>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[
              styles.button,
              { opacity: patientName && patientAge && gender && appointmentType ? 1 : 0.5 },
            ]}
            onPress={handleSubmit}
            disabled={!patientName || !patientAge || !gender || !appointmentType}
          >
            <Text style={styles.buttonText}>Proceed to Pay</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SingleTestBookByWallet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  formSection: {
    gap: 12,
  },
  label: {
    fontSize: 15,
    marginBottom: 4,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: Platform.OS === 'android' ? '#f9f9f9' : 'transparent',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderRadius: 10,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
});

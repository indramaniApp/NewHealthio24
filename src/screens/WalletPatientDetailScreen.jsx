import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import RNPickerSelect from 'react-native-picker-select';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import { COLORS, SIZES } from '../../constants';
import { ENDPOINTS } from '../constants/Endpoints';
import ApiService from '../api/ApiService';
import { showLoader, hideLoader } from '../redux/slices/loaderSlice';
import Header from '../../components/Header';
import Button from '../../components/Button';
import { useTheme } from '../../theme/ThemeProvider';
import LinearGradient from 'react-native-linear-gradient';

const WalletPatientDetailScreen = ({ navigation, route }) => {
  const { dark } = useTheme();
  const dispatch = useDispatch();

  const { startedDate, selectedHour, selectedItem, doctorId } = route?.params;
console.log('doctorId=======', doctorId);
  const [patient_age, setPatient_Age] = useState('');
  const [patient_gender, setPatient_Gender] = useState(null);
  const [patient_name, setPatient_Name] = useState('');
  const [referralId, setReferralId] = useState('');

  const handleSubmit = async () => {
    dispatch(showLoader());
    try {
      const data = {
        appointment_request_date: startedDate,
        appointment_time: selectedHour,
        appointment_type: selectedItem,
        patient_age,
        patient_name,
        patient_gender,
        referral_id: referralId,
      };

      const finalUrl =
        ENDPOINTS.patient_book_appointment_through_wallet + `/${doctorId}`;
      const response = await ApiService.post(finalUrl, data, true, false);

      if (response?.status === 'success') {
        Alert.alert(
          'Success',
          response?.message || 'Appointment booked successfully!',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('Main'),
            },
          ],
        );
      } else {
        Alert.alert('Error', response?.message || 'Something went wrong.');
      }
    } catch (error) {
      console.error('Full error object:', JSON.stringify(error, null, 2));
      let apiMessage = 'Something went wrong.';
      if (error?.response?.data?.message) {
        apiMessage = error.response.data.message;
      } else if (error?.message) {
        apiMessage = error.message;
      }
      Alert.alert('Error', apiMessage);
    } finally {
      dispatch(hideLoader());
    }
  };

  const renderContent = () => (
    <View>
      <Text style={[styles.title, { color: dark ? COLORS.white : COLORS.greyscale900 }]}>
        Patient Name
      </Text>
      <View style={[styles.inputContainer, { backgroundColor: dark ? COLORS.dark2 : COLORS.tertiaryWhite }]}>
        <TextInput
          style={[styles.picker, { color: dark ? COLORS.grayscale200 : COLORS.greyscale900 }]}
          placeholder="Enter Patient Name"
          placeholderTextColor={dark ? COLORS.greyscale300 : COLORS.black}
          value={patient_name}
          onChangeText={setPatient_Name}
        />
      </View>

      <Text style={[styles.title, { color: dark ? COLORS.white : COLORS.greyscale900 }]}>
        Patient Gender
      </Text>
      <RNPickerSelect
        onValueChange={setPatient_Gender}
        placeholder={{ label: 'Select Patient Gender', value: null }}
        items={[
          { label: 'Female', value: 'Female' },
          { label: 'Male', value: 'Male' },
        ]}
        style={{
          inputIOS: {
            ...styles.pickerInput,
            backgroundColor: dark ? COLORS.dark2 : COLORS.tertiaryWhite,
          },
          inputAndroid: {
            ...styles.pickerInput,
            backgroundColor: dark ? COLORS.dark2 : COLORS.tertiaryWhite,
          },
        }}
      />

      <Text style={[styles.title, { color: dark ? COLORS.white : COLORS.greyscale900 }]}>
        Patient Age
      </Text>
      <View style={[styles.inputContainer, { backgroundColor: dark ? COLORS.dark2 : COLORS.tertiaryWhite }]}>
        <TextInput
          style={[styles.picker, { color: dark ? COLORS.grayscale200 : COLORS.greyscale900 }]}
          placeholder="Enter Patient Age"
          placeholderTextColor={dark ? COLORS.greyscale300 : COLORS.black}
          value={patient_age}
          onChangeText={setPatient_Age}
          keyboardType="numeric"
        />
      </View>

      <Text style={[styles.title, { color: dark ? COLORS.white : COLORS.greyscale900 }]}>
        Referral ID (Optional)
      </Text>
      <View style={[styles.inputContainer, { backgroundColor: dark ? COLORS.dark2 : COLORS.tertiaryWhite }]}>
        <TextInput
          style={[styles.picker, { color: dark ? COLORS.grayscale200 : COLORS.greyscale900 }]}
          placeholder="Enter Referral ID"
          placeholderTextColor={dark ? COLORS.greyscale300 : COLORS.black}
          value={referralId}
          onChangeText={setReferralId}
        />
      </View>
    </View>
  );

  return (
    <LinearGradient
      colors={['#00b4db', '#fff', '#fff', '#fff', '#fff', '#fff']}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={styles.area}>
        {/* Header fix upar */}
        <Header title="Patient Details" onBackPress={() => navigation.goBack()} />

        {/* ScrollView header ke niche start hoga */}
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          enableOnAndroid={true}
          extraScrollHeight={1}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ padding: 12, paddingBottom: 10 }}
        >
          {renderContent()}
        </KeyboardAwareScrollView>

        {/* Bottom Button fixed */}
        <View
          style={[
            styles.bottomContainer,
            { backgroundColor: dark ? COLORS.dark2 : COLORS.white },
          ]}
        >
          <Button
            title="Submit"
            filled
            style={styles.btn}
            onPress={handleSubmit}
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  area: { flex: 1 },
  title: {
    fontSize: 20,
    fontFamily: 'Urbanist Bold',
    marginVertical: 12,
    marginTop: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 10,
    height: 52,
  },
  picker: { flex: 1, height: 52 },
  pickerInput: {
    fontSize: 16,
    paddingHorizontal: 10,
    borderRadius: 12,
    color: COLORS.greyscale600,
    height: 52,
    width: SIZES.width - 24,
  },
  btn: { width: SIZES.width - 32 },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 99,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default WalletPatientDetailScreen;

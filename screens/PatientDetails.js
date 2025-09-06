import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import RNPickerSelect from 'react-native-picker-select';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';

import { COLORS, SIZES } from '../constants';
import { ENDPOINTS } from '../src/constants/Endpoints';
import ApiService from '../src/api/ApiService';
import { showLoader, hideLoader } from '../src/redux/slices/loaderSlice';
import { useTheme } from '../theme/ThemeProvider';
import Header from '../components/Header';
import Button from '../components/Button';
import Toast from 'react-native-simple-toast';
import RazorpayCheckout from 'react-native-razorpay';

const RAZORPAY_KEY_ID = 'rzp_test_R8LVEozZxuRsqb';

const PatientDetails = ({ navigation, route }) => {
  const { dark } = useTheme();
  const dispatch = useDispatch();

  let { startedDate, selectedHour, selectedItem, doctorId } = route?.params;

  const [buttonTxt] = useState('Next');
  const [patient_age, setPatient_Age] = useState('');
  const [patient_gender, setPatient_Gender] = useState(null);
  const [patient_name, setPatient_Name] = useState('');
  const [referralId, setReferralId] = useState('');

  const [orderId, setOrderId] = useState('');
  const amount = 1;
  const currency = 'INR';

  const hitHandleSubmitApi = async () => {
    dispatch(showLoader());
    try {
      let data = {
        appointment_request_date: startedDate,
        appointment_time: selectedHour,
        appointment_type: selectedItem,
        patient_age,
        patient_name,
        patient_gender,
        referral_id: referralId || null,
      };

      const finalUrl = ENDPOINTS.patient_book_appointment + `/${doctorId}`;
      let response = await ApiService.post(finalUrl, data, true, false);

      if (response?.status === 'success') {
        setOrderId(response?.data?.razorpay_order_id);
        handlePayment(response?.data?.razorpay_order_id);
      } else {
        Toast.show(response?.message || 'Something went wrong');
      }
    } catch (error) {
      console.log('===== Full Error =====', error);
      const errorMessage = error?.response?.data?.message;
      if (errorMessage) {
        Toast.show(errorMessage);
      } else {
        Toast.show('Something went wrong. Please fill all patient details.');
      }
    } finally {
      dispatch(hideLoader());
    }
  };

  const handlePayment = (orderId) => {
    var options = {
      description: 'Credits towards consultation',
      image: 'https://i.imgur.com/3g7nmJC.jpg',
      currency,
      key: RAZORPAY_KEY_ID,
      amount,
      name: 'Helthio24',
      order_id: orderId,
      handler: function (response) {
        const payment_id = response.razorpay_payment_id;
        const signature = response.razorpay_signature;
        verifyPayment(payment_id, signature, orderId);
      },
      prefill: {
        email: 'indramani@example.com',
        contact: '9191919191',
        name: 'Indramani mishra',
      },
      theme: { color: '#53a20e' },
    };

    RazorpayCheckout.open(options)
      .then((data) => {
        const payment_id = data.razorpay_payment_id;
        const signature = data.razorpay_signature;
        verifyPayment(payment_id, signature, orderId);
      })
      .catch((error) => {
        alert(`Error: ${error.code} | ${error.description}`);
      });
  };

  const verifyPayment = async (payment_id, signature, order_id) => {
    try {
      let data = { payment_id, signature, order_id };
      let response = await ApiService.post(
        ENDPOINTS.payment_verify,
        data,
        true,
        false,
      );
      if (response?.status == 'success') {
        navigation.navigate('Main');
      }
      Toast.show(response?.message || 'success');
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const renderContent = () => (
    <View>
      <Text
        style={[
          styles.title,
          { color: dark ? COLORS.white : COLORS.greyscale900 },
        ]}
      >
        Patient Name
      </Text>
      <View
        style={[
          styles.inputContainer,
          { backgroundColor: dark ? COLORS.dark2 : COLORS.tertiaryWhite },
        ]}
      >
        <TextInput
          style={[
            styles.picker,
            { height: 48, color: dark ? COLORS.grayscale200 : COLORS.greyscale900 },
          ]}
          placeholder="Enter patient name"
          placeholderTextColor={dark ? COLORS.greyscale300 : COLORS.black}
          value={patient_name}
          onChangeText={setPatient_Name}
        />
      </View>

      <Text
        style={[
          styles.title,
          { color: dark ? COLORS.white : COLORS.greyscale900 },
        ]}
      >
        Patient Gender
      </Text>
      <RNPickerSelect
        onValueChange={setPatient_Gender}
        placeholder={{ label: 'Select patient Gender', value: null }}
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

      <Text
        style={[
          styles.title,
          { color: dark ? COLORS.white : COLORS.greyscale900 },
        ]}
      >
        Patient Age
      </Text>
      <View
        style={[
          styles.inputContainer,
          { backgroundColor: dark ? COLORS.dark2 : COLORS.tertiaryWhite },
        ]}
      >
        <TextInput
          style={[
            styles.picker,
            { height: 48, color: dark ? COLORS.grayscale200 : COLORS.greyscale900 },
          ]}
          placeholder="Enter patient age"
          placeholderTextColor={dark ? COLORS.greyscale300 : COLORS.black}
          value={patient_age}
          onChangeText={setPatient_Age}
          keyboardType="numeric"
        />
      </View>

      {/* ✅ New Optional Referral ID field */}
      <Text
        style={[
          styles.title,
          { color: dark ? COLORS.white : COLORS.greyscale900 },
        ]}
      >
        Referral ID (Optional)
      </Text>
      <View
        style={[
          styles.inputContainer,
          { backgroundColor: dark ? COLORS.dark2 : COLORS.tertiaryWhite },
        ]}
      >
        <TextInput
          style={[
            styles.picker,
            { height: 48, color: dark ? COLORS.grayscale200 : COLORS.greyscale900 },
          ]}
          placeholder="Enter referral ID (if any)"
          placeholderTextColor={dark ? COLORS.greyscale300 : COLORS.black}
          value={referralId}
          onChangeText={setReferralId}
        />
      </View>
    </View>
  );

  return (
    <LinearGradient
      colors={['#00b4db', '#fff', '#fff', '#fff', '#fff']}
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
            title={buttonTxt}
            filled
            style={styles.btn}
            onPress={hitHandleSubmitApi}
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  area: { flex: 1 },
  title: { fontSize: 20, fontFamily: 'Urbanist Bold', marginVertical: 12, marginTop: 30 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 10,
    height: 52,
  },
  picker: { flex: 1 },
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

export default PatientDetails;

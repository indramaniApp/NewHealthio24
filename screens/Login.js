import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Modal,
  TouchableOpacity,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES, images } from '../constants';
import Button from '../components/Button';
import Toast from 'react-native-simple-toast';
import AuthService from '../src/api/AuthService';
import Feather from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import { useDispatch } from 'react-redux';
import { showLoader, hideLoader } from '../src/redux/slices/loaderSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = ({ navigation }) => {
  const dispatch = useDispatch();

  const [rawPhone, setRawPhone] = useState('');
  const [formattedPhone, setFormattedPhone] = useState('');
  const [isPhoneValid, setIsPhoneValid] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);

  const [fullName, setFullName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [referredBy, setReferredBy] = useState('');

  // ✅ CHECK EXISTING LOGIN SESSION
  useEffect(() => {
    checkLoginState();
  }, []);

  const checkLoginState = async () => {
    const token = await AsyncStorage.getItem('USER_TOKEN');

    if (token) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    }
  };
  const handleMobileInput = (inputValue) => {
    let digits = inputValue.replace(/\D/g, '').slice(0, 10);
    setRawPhone(digits);

    const valid = digits.length === 10 && /^[0-9]\d{9}$/.test(digits);
    setIsPhoneValid(valid);

    let formatted = digits.replace(
      /(\d{3})(\d{3})(\d{0,4})/,
      (_, p1, p2, p3) => (p3 ? `${p1} ${p2} ${p3}` : `${p1} ${p2}`)
    );

    setFormattedPhone(formatted.trim());
  };

  const handleLogin = async () => {
    if (!isPhoneValid) {
      Toast.show('Please enter valid mobile number');
      return;
    }

    try {
      dispatch(showLoader());

      const response = await AuthService.sendOtp({
        contactNumber: rawPhone,
      });

      Toast.show(response.message);

      navigation.navigate('OTP', {
        phone: rawPhone,
        data: response.data,
      });

    } catch (error) {
      Toast.show(error.message);
    } finally {
      dispatch(hideLoader());
    }
  };

  const handleRegister = async () => {
    if (!fullName.trim()) {
      Toast.show('Enter full name');
      return;
    }

    if (!emailAddress.trim()) {
      Toast.show('Enter email address');
      return;
    }

    try {
      dispatch(showLoader());

      const response = await AuthService.sendOtp({
        contactNumber: rawPhone,
        fullName: fullName.trim(),
        emailAddress: emailAddress.trim(),
        referred_by_patient_mitra: referredBy.trim(),
      });

      setModalVisible(false);

      Toast.show(response.message);

      navigation.navigate('OTP', {
        phone: rawPhone,
        data: response.data,
      });

    } catch (error) {
      Toast.show(error.message);
    } finally {
      dispatch(hideLoader());
    }
  };

  const renderInput = (
    label,
    icon,
    placeholder,
    value,
    onChangeText,
    keyboardType = 'default'
  ) => (
    <View style={{ marginBottom: 12 }}>
      <Text style={[styles.modalLabel]}>{label}</Text>

      <View style={styles.inputWrapper}>
        <View style={styles.iconContainer}>
          <Feather name={icon} size={20} color={COLORS.primary} />
        </View>

        <TextInput
          style={styles.inputField}
          placeholder={placeholder}
          placeholderTextColor="#999"
          keyboardType={keyboardType}
          autoCapitalize="none"
          value={value}
          onChangeText={onChangeText}
        />
      </View>
    </View>
  );

  return (
    <LinearGradient colors={['#001F3F', '#003366', '#fff', '#fff']} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <Image source={images.Logo} resizeMode="contain" style={styles.logo} />

            <Text style={styles.tagline}>Trusted Healthcare Companion</Text>

            <Text style={styles.infoText}>
              Please enter your details to log in and access your account.
            </Text>

            <Text style={styles.title}>Login to Your Account</Text>

            <Text style={styles.label}>Contact Number</Text>

            <View style={styles.inputWrapper}>
              <View style={styles.iconContainer}>
                <Feather name="phone" size={20} color={COLORS.primary} />
              </View>

              <TextInput
                style={styles.inputField}
                placeholder="Enter mobile number"
                placeholderTextColor="#000"
                keyboardType="numeric"
                value={formattedPhone}
                onChangeText={handleMobileInput}
              />
            </View>

            <Button
              title="Login"
              filled
              onPress={handleLogin}
              style={styles.button}
              disabled={!isPhoneValid}
            />

            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Text style={styles.registerText}>
                Don’t have an account? Register
              </Text>
            </TouchableOpacity>

          </ScrollView>
        </KeyboardAvoidingView>
<Modal visible={modalVisible} transparent animationType="slide">
  <View style={styles.modalContainer}>
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.modalBox}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          <Text style={styles.modalTitle}>Complete Registration</Text>

          {renderInput(
            'Contact Number',
            'phone',
            'Enter mobile number',
            formattedPhone,
            handleMobileInput,
            'numeric'
          )}

          {renderInput('Full Name', 'user', 'Enter full name', fullName, setFullName)}

          {renderInput(
            'Email Address',
            'mail',
            'Enter email',
            emailAddress,
            setEmailAddress,
            'email-address'
          )}

          {renderInput(
            'Referral Code',
            'users',
            'Optional',
            referredBy,
            (text) => setReferredBy(text.toUpperCase())
          )}

          <Button
            title="Continue"
            filled
            onPress={handleRegister}
            disabled={!isPhoneValid}
          />

          <TouchableOpacity onPress={() => setModalVisible(false)}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>

        </ScrollView>
      </View>
      {/* 🟢 YE WALA VIEW GAP FILL KAREGA 🟢 */}
      <View style={{ height: 500, backgroundColor: '#fff', position: 'absolute', bottom: -500, left: 0, right: 0 }} />
    </KeyboardAvoidingView>
  </View>
</Modal>



      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: { flexGrow: 1, padding: 20 },

  logo: {
    width: SIZES.width * 0.5,
    height: SIZES.width * 0.3,
    alignSelf: 'center',
    marginBottom: 10,
  },

  tagline: { fontSize: 14, textAlign: 'center', marginBottom: 4, color: '#fff' },
  infoText: { fontSize: 16, textAlign: 'center', marginBottom: 20, color: '#fff' },
  title: { fontSize: 24, textAlign: 'center', marginBottom: 30, color: '#fff' },

  label: { marginBottom: 6, fontSize: 14, color: '#fff' },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    paddingHorizontal: 12,
    height: 55,
    marginBottom: 16,
    backgroundColor: '#F4F6F9',
  },

  iconContainer: {
    backgroundColor: COLORS.white,
    padding: 8,
    borderRadius: 50,
    marginRight: 10,
  },

  inputField: { flex: 1, fontSize: 17, color: '#000' },

  button: { marginTop: 10, borderRadius: 30 },

  registerText: {
    textAlign: 'center',
    marginTop: 22,
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: '600',
  },

 modalContainer: {
  flex: 1,
  backgroundColor: 'rgba(0,0,0,0.6)', // Thoda dark takki peeche ka "Register" text na dikhe
  justifyContent: 'flex-end',
},
modalBox: {
  backgroundColor: '#fff',
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  padding: 20,
  width: '100%',
  maxHeight: SIZES.height * 0.8, // Takki keyboard ke liye jagah bache
  overflow: 'hidden', // Extra safety
},

  modalTitle: { fontSize: 20, marginBottom: 20, textAlign: 'center' },

  modalLabel: {
    marginBottom: 6,
    fontSize: 14,
    color: '#000',
  },

  cancelText: {
    textAlign: 'center',
    marginTop: 10,
    color: 'red',
  },
});

export default Login;

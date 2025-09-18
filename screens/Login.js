
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  TextInput,
} from 'react-native';
import React, { useCallback, useEffect, useReducer, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES, images } from '../constants';
import { reducer } from '../utils/reducers/formReducers';
import { validateInput } from '../utils/actions/formActions';
import Button from '../components/Button';
import { useTheme } from '../theme/ThemeProvider';
import { useDispatch } from 'react-redux';
import { showLoader, hideLoader } from '../src/redux/slices/loaderSlice';
import Toast from 'react-native-simple-toast';
import AuthService from '../src/api/AuthService';
import Feather from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';

const isTestMode = false;

const initialState = {
  inputValues: {},
  inputValidities: {
    phone: false,
  },
  formIsValid: false,
};

const Login = ({ navigation }) => {
  const [formState, dispatchFormState] = useReducer(reducer, initialState);
  const [error, setError] = useState(null);
  const { colors, dark } = useTheme();
  const [rawPhone, setRawPhone] = useState(isTestMode ? '9876543210' : '');
  const [formattedPhone, setFormattedPhone] = useState(isTestMode ? '987 654 3210' : '');
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const dispatch = useDispatch();

  const inputChangedHandler = useCallback(
    (inputId, inputValue) => {
      const result = validateInput(inputId, inputValue);
      dispatchFormState({ inputId, validationResult: result, inputValue });
    },
    [dispatchFormState]
  );

  useEffect(() => {
    if (error) {
      Alert.alert('An error occurred', error);
    }
  }, [error]);

  const handleMobileInput = (inputValue) => {
    let digits = inputValue.replace(/\D/g, '').slice(0, 10);
    setRawPhone(digits);
    setIsPhoneValid(digits.length === 10 && /^[6-9]\d{9}$/.test(digits));

    let formatted = digits.replace(/(\d{3})(\d{3})(\d{0,4})/, (_, p1, p2, p3) => {
      return p3 ? `${p1} ${p2} ${p3}` : `${p1} ${p2}`;
    });
    setFormattedPhone(formatted.trim());
  };

  const handleLogin = () => {
    if (isPhoneValid) {
      handleSendOtp();
    } else {
      Toast.show('Please enter a valid 10-digit mobile number starting with 6,7,8, or 9');
    }
  };

  const handleSendOtp = async () => {
    if (isPhoneValid) {
      try {
        dispatch(showLoader());
        const response = await AuthService.sendOtp(rawPhone);
        Toast.show(response.message);
        // navigate to OTP screen — pass phone and verification id
        navigation.replace('OTP', { phone: rawPhone, data: response.data });
      } catch (error) {
        Toast.show("Error: " + error.message);
      } finally {
        dispatch(hideLoader());
      }
    } else {
      Toast.show("Please enter a valid phone number.");
    }
  };

  return (
    // your existing UI (unchanged)
    <LinearGradient colors={['#00b4db', '#fff', '#fff']} style={{ flex: 1 }}>
      <SafeAreaView style={[styles.area, { backgroundColor: 'transparent' }]}>
        <View style={[styles.container, { backgroundColor: 'transparent' }]}>
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            <Image source={images.Logo} resizeMode="contain" style={[styles.logo, { tintColor: COLORS.primary }]} />
            <Text style={[styles.tagline, { color: dark ? COLORS.grayTie : COLORS.darkGray }]}>
              Trusted Healthcare Companion
            </Text>
            <Text style={[styles.infoText, { color: dark ? COLORS.white : COLORS.black }]}>
              Please enter your mobile number to log in and access your account.
            </Text>

            <View style={styles.formContainer}>
              <Text style={[styles.title, { color: dark ? COLORS.white : COLORS.black }]}>
                Login to Your Account
              </Text>

              <View style={[
                  styles.inputWrapper,
                  { backgroundColor: dark ? COLORS.darkCard : '#F4F6F9', borderColor: isPhoneValid ? COLORS.green : COLORS.primary }
                ]}>
                <View style={styles.iconContainer}>
                  <Feather name="phone" size={20} color={COLORS.primary} />
                </View>
                <TextInput
                  style={[styles.inputField, { color: dark ? COLORS.white : COLORS.black }]}
                  placeholder="Enter your mobile number"
                  placeholderTextColor={dark ? COLORS.grayTie : COLORS.gray}
                  keyboardType="numeric"
                  value={formattedPhone}
                  onChangeText={handleMobileInput}
                />
              </View>

              <Button
                title="Login"
                filled
                onPress={handleLogin}
                style={[styles.button, { backgroundColor: isPhoneValid ? COLORS.primary : COLORS.gray }]}
                disabled={!isPhoneValid}
              />
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  area: { flex: 1 },
  container: { flex: 1, padding: 16 },
  logo: { width: SIZES.width * 0.5, height: SIZES.width * 0.3, marginBottom: 12 },
  tagline: { fontSize: 14, fontFamily: 'Urbanist Medium', textAlign: 'center', marginBottom: 6 },
  infoText: { fontSize: 16, fontFamily: 'Urbanist Regular', textAlign: 'center', marginBottom: 16 },
  formContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16, width: '100%' },
  title: { fontSize: 20, fontFamily: 'Urbanist Bold', textAlign: 'center', marginBottom: 24 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1.5,
    paddingHorizontal: 12,
    width: '100%',
    height: 55,
    marginBottom: 16,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: { backgroundColor: COLORS.white, padding: 8, borderRadius: 50, marginRight: 10 },
  inputField: { flex: 1, fontSize: 18, fontFamily: 'Urbanist Medium', paddingVertical: 8 },
  button: { marginTop: 8, width: '100%', borderRadius: 30 },
  scrollViewContent: { flexGrow: 1, justifyContent: 'center', alignItems: 'center' },
});

export default Login;

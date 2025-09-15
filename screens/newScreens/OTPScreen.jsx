import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    StatusBar,
    useWindowDimensions,
} from 'react-native';
import { useTheme } from '../../theme/ThemeProvider';
import Button from '../../components/Button';
import Toast from 'react-native-simple-toast';
import { useSmsUserConsent } from '@eabdullazyanov/react-native-sms-user-consent';
import { useDispatch } from 'react-redux';
import { showLoader, hideLoader } from '../../src/redux/slices/loaderSlice';
import ApiService from '../../src/api/ApiService';
import { ENDPOINTS } from '../../src/constants/Endpoints';
import StorageHelper from '../../utils/StorageHelper';
import { CommonActions } from '@react-navigation/native';
// 1. Import LinearGradient
import LinearGradient from 'react-native-linear-gradient';

const OTPScreen = ({ navigation, route }) => {
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const [time, setTime] = useState(30);
    const { colors, dark } = useTheme();
    const dispatch = useDispatch();

    const phoneNumber = route?.params?.phone || '';
    const userVerifyToken = route?.params || '';
    const retrievedCode = useSmsUserConsent();
    const inputRefs = useRef([...Array(6)].map(() => React.createRef()));
    const { width } = useWindowDimensions();

    useEffect(() => {
        if (retrievedCode) {
            const otpArray = retrievedCode.split('');
            setOtp(otpArray);
        }
    }, [retrievedCode]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setTime((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
        }, 1000);
        return () => clearInterval(intervalId);
    }, []);

    const handleOTPChange = (value, index) => {
        if (!/^\d?$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        if (value !== "" && index < 5) {
            inputRefs.current[index + 1].current.focus();
        } else if (value === "" && index > 0) {
            inputRefs.current[index - 1].current.focus();
        }
    };

    const otpVerify = async () => {
        const finalOtp = otp.join("");
        if (finalOtp.length !== 6) {
            Toast.show("Please enter a valid 6-digit OTP.");
            return;
        }
        dispatch(showLoader());
        try {
            const data = { otp: finalOtp, verification_id: userVerifyToken?.data, role: "user" };
            const response = await ApiService.post(ENDPOINTS.LOGIN, data, false, false);
            Toast.show(response?.message);
            if (response?.status !== 'failed') {
                const { token, role } = response?.data;
                await StorageHelper.setItem('USER_TOKEN', token);
                await StorageHelper.setItem('USER_ROLE', role);
                navigation.dispatch(
                    CommonActions.reset({
                        index: 0,
                        routes: [{ name: 'Main' }],
                    })
                );
            }
        } catch (error) {
            console.error('OTP Verification Error:', error);
            Toast.show("OTP verification failed. Please try again.");
        } finally {
            dispatch(hideLoader());
        }
    };

    const resendOtp = async () => {
        if (time === 0) {
            setTime(60);
            try {
                dispatch(showLoader());
                const data = { id: userVerifyToken.data }
                const response = await ApiService.post(ENDPOINTS.resend_otp, data, false, false);
                Toast.show(response?.message || "OTP sent again");
            } catch (error) {
                Toast.show("Failed to resend OTP. Please try again.");
            } finally {
                dispatch(hideLoader());
            }
        } else {
            Toast.show("You can resend the OTP after the timer ends.");
        }
    };

    return (
     
        <LinearGradient
            colors={['#00b4db', '#fff','#fff']}
            style={{ flex: 1 }}
        >
        
            <SafeAreaView style={[styles.area, { backgroundColor: 'transparent' }]}>
         
                <StatusBar
                    barStyle={'light-content'}
                    backgroundColor={'transparent'}
                    translucent={true}
                />
                {/* 5. Also make this container's background transparent */}
                <View style={[styles.container, { backgroundColor: 'transparent' }]}>
                    <ScrollView keyboardShouldPersistTaps="handled">
                        <Text style={[styles.title, { color: dark ? "#fff" : '#181A20' }]}>
                            OTP has been sent to {phoneNumber ? `+91 ${phoneNumber.slice(0, 2)}****${phoneNumber.slice(-2)}` : "your number"}
                        </Text>

                        <View style={[styles.otpContainer, { maxWidth: width * 0.9 }]}>
                            {otp.map((digit, index) => (
                                <TextInput
                                    key={index}
                                    ref={inputRefs.current[index]}
                                    style={[
                                        styles.otpInput,
                                        {
                                            color: dark ? '#fff' : '#000',
                                            backgroundColor: dark ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.7)',
                                            borderColor: dark ? '#888' : '#246BFD',
                                        }
                                    ]}
                                    keyboardType="numeric"
                                    maxLength={1}
                                    onChangeText={(value) => handleOTPChange(value, index)}
                                    value={digit}
                                />
                            ))}
                        </View>

                        <View style={styles.codeContainer}>
                            <Text style={[styles.code, { color: dark ? '#fff' : '#212121' }]}>
                                Resend code in
                            </Text>
                            <Text style={styles.time}>{`  ${time}  `}</Text>
                            <Text style={[styles.code, { color: dark ? '#fff' : '#212121' }]}>s</Text>
                        </View>

                        {time === 0 && (
                            <Button title="Resend OTP" filled style={styles.button} onPress={resendOtp} />
                        )}
                    </ScrollView>

                    <Button title="Verify" filled style={[styles.button,{marginBottom: 50}]} onPress={otpVerify} />
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    area: {
        flex: 1,
    },
    container: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 18,
        fontFamily: "Urbanist Medium",
        textAlign: "center",
        marginVertical: 54,
    },
    otpContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 20,
        width: '100%',
        paddingHorizontal: 10,
    },
    otpInput: {
        flex: 1,
        height: 60,
        borderWidth: 1,
        borderRadius: 12,
        textAlign: "center",
        fontSize: 24,
        marginHorizontal: 5,
        maxWidth: 60,
    },
    codeContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 24,
        justifyContent: "center",
    },
    code: {
        fontSize: 18,
        fontFamily: "Urbanist Medium",
        textAlign: "center",
    },
    time: {
        fontFamily: "Urbanist Medium",
        fontSize: 18,
        color: '#246BFD',
    },
    button: {
        borderRadius: 32,
        marginTop: 20,
    },
});

export default OTPScreen;
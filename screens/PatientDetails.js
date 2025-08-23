import { View, Text, StyleSheet, TextInput, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES } from '../constants';
import RNPickerSelect from 'react-native-picker-select';
import { useTheme } from '../theme/ThemeProvider';
import Header from '../components/Header';
import Button from '../components/Button';
import ApiService from '../src/api/ApiService';
import { ENDPOINTS } from '../src/constants/Endpoints';
import Toast from 'react-native-simple-toast';
import RazorpayCheckout from 'react-native-razorpay';
import { hideLoader, showLoader } from '../src/redux/slices/loaderSlice';
import { useDispatch } from 'react-redux';

const RAZORPAY_KEY_ID = 'rzp_test_GvwPgZcP2tn6O2';
const RAZORPAY_KEY_SECRET = 'hmJST8pL2kjiA3nNTuIwH6p5';

const PatientDetails = ({ navigation, route }) => {
    const { colors, dark } = useTheme();
    const dispatch = useDispatch();

    let { startedDate, selectedHour, selectedItem, doctorId } = route?.params;
    const [buttonTxt, setButtonTxt] = useState('Next');
    const [patient_age, setPatient_Age] = useState(null);
    const [patient_gender, setPatient_Gender] = useState(null);
    const [orderId, setOrderId] = useState('');
    const [reason_for_visit, setReason_For_Visit] = useState(null);
    const [patient_name, setPatient_Name] = useState(null);
    const amount = 1;
    const currency = 'INR';

    const hitHandleSubmitApi = async () => {
        dispatch(showLoader());

        try {
            let data = {
                appointment_request_date: startedDate,
                appointment_time: selectedHour,
                appointment_type: selectedItem,
                reason_for_visit: [],
                patient_age,
                patient_name,
                patient_gender
            };

            const finalUrl = ENDPOINTS.patient_book_appointment + `/${doctorId}`;
            let response = await ApiService.post(finalUrl, data, true, false);

            console.log("=========response==========", response);

            if (response?.status === 'success') {
                setOrderId(response?.data?.razorpay_order_id);
                handlePayment(response?.data?.razorpay_order_id);
            } else {
                // Show actual API error message
                Toast.show(response?.message || 'Something went wrong');
            }
        } catch (error) {
            console.log("===== Full Error =====", error);

            const errorMessage = error?.response?.data?.message;

            if (errorMessage) {
                Toast.show(errorMessage);
            } else {
                Toast.show("Something went wrong. Please fill all patient deatils.");
            }

            dispatch(hideLoader());
        }


    };



    const handlePayment = (orderId) => {
        var options = {
            description: 'Credits towards consultation',
            image: 'https://i.imgur.com/3g7nmJC.jpg',
            currency: currency,
            key: RAZORPAY_KEY_ID,
            amount: amount,
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
                name: 'Indramani mishra'
            },
            theme: { color: '#53a20e' }
        };

        RazorpayCheckout.open(options).then((data) => {
            const payment_id = data.razorpay_payment_id;
            const signature = data.razorpay_signature;
            verifyPayment(payment_id, signature, orderId);
        }).catch((error) => {
            alert(`Error: ${error.code} | ${error.description}`);
        });
    };

    const verifyPayment = async (payment_id, signature, order_id) => {
        try {
            let data = {
                payment_id,
                signature,
                order_id
            };
            let response = await ApiService.post(ENDPOINTS.payment_verify, data, true, false);
            if (response?.status == 'success') {
                navigation.navigate('Main');
            }
            Toast.show(response?.message || 'success');
            console.log(response);
        } catch (error) {
            console.log(error);
        }
    };

    const renderContent = () => {
        return (
            <View>
                <Text style={[styles.title, { color: dark ? COLORS.white : COLORS.greyscale900 }]}>Patient Name</Text>
                <View style={[styles.inputContainer, {
                    backgroundColor: dark ? COLORS.dark2 : COLORS.tertiaryWhite
                }]}>
                    <TextInput
                        style={[styles.picker, {
                            height: 48,
                            color: dark ? COLORS.grayscale200 : COLORS.greyscale900
                        }]}
                        placeholder="Enter patient name"
                        placeholderTextColor={dark ? COLORS.greyscale300 : COLORS.black}
                        value={patient_name}
                        onChangeText={(value) => setPatient_Name(value)}
                    />
                </View>
                <Text style={[styles.title, { color: dark ? COLORS.white : COLORS.greyscale900 }]}>Patient Gender</Text>
                <RNPickerSelect
                    onValueChange={(value) => setPatient_Gender(value)}
                    placeholder={{ label: 'Select patient Gender', value: null }}
                    items={[
                        { label: 'Female', value: 'Female' },
                        { label: 'Male', value: 'Male' },
                    ]}
                    style={{
                        inputIOS: {
                            fontSize: 16,
                            paddingHorizontal: 10,
                            borderRadius: 16,
                            color: COLORS.greyscale600,
                            height: 52,
                            width: SIZES.width - 32,
                            backgroundColor: dark ? COLORS.dark2 : COLORS.greyscale500,
                        },
                        inputAndroid: {
                            fontSize: 16,
                            paddingHorizontal: 10,
                            borderRadius: 16,
                            color: COLORS.greyscale600,
                            height: 52,
                            width: SIZES.width - 32,
                            backgroundColor: dark ? COLORS.dark2 : COLORS.greyscale500,
                        },
                    }}
                />


                <Text style={[styles.title, { color: dark ? COLORS.white : COLORS.greyscale900 }]}>Patient Age</Text>
                <View style={[styles.inputContainer, {
                    backgroundColor: dark ? COLORS.dark2 : COLORS.tertiaryWhite
                }]}>
                    <TextInput
                        style={[styles.picker, {
                            height: 48,
                            color: dark ? COLORS.grayscale200 : COLORS.greyscale900
                        }]}
                        placeholder="Enter patient age"
                        placeholderTextColor={dark ? COLORS.greyscale300 : COLORS.black}
                        value={patient_age}
                        onChangeText={(value) => setPatient_Age(value)}
                        keyboardType="numeric"
                    />
                </View>
            </View>
        )
    };

    return (
        <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <Header
                    title="Patient Details"
                    onBackPress={() => navigation.goBack()}
                />
                <ScrollView showsVerticalScrollIndicator={false}>
                    {renderContent()}
                </ScrollView>
            </View>
            <View style={[styles.bottomContainer, {
                backgroundColor: dark ? COLORS.dark2 : COLORS.white,
            }]}>
                <Button
                    title={buttonTxt}
                    filled
                    style={styles.btn}
                    onPress={hitHandleSubmitApi}
                />
            </View>
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    area: {
        flex: 1,
        backgroundColor: COLORS.white
    },
    container: {
        flex: 1,
        padding: 12
    },
    title: {
        fontSize: 20,
        fontFamily: "Urbanist Bold",
        marginVertical: 12
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        paddingHorizontal: 10,
        height: 52,
    },
    picker: {
        flex: 1,
    },
    btn: {
        width: SIZES.width - 32
    },
    bottomContainer: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        height: 99,
        borderRadius: 32,
        alignItems: "center",
        justifyContent: "center"
    }
});

export default PatientDetails;

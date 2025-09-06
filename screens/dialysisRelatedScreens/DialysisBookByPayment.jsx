import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    ScrollView,
    TouchableOpacity,
    Alert,
    StatusBar,
    SafeAreaView, 
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Header from '../../components/Header';
import { COLORS } from '../../constants';
import ApiService from '../../src/api/ApiService';
import { ENDPOINTS } from '../../src/constants/Endpoints';
import RazorpayCheckout from 'react-native-razorpay';
import { useDispatch } from 'react-redux';
import { showLoader, hideLoader } from '../../src/redux/slices/loaderSlice';
import Toast from 'react-native-simple-toast';
import LinearGradient from 'react-native-linear-gradient'; 

const RAZORPAY_KEY_ID = 'rzp_test_R8LVEozZxuRsqb';

const DialysisBookByPayment = ({ route, navigation }) => {
    const { unitId, startedDate, selectedHour } = route.params;

    const [patientName, setPatientName] = useState('');
    const [patientGender, setPatientGender] = useState('');
    const [patientAge, setPatientAge] = useState('');
    const [reasonForVisit, setReasonForVisit] = useState('');
    const [referralId, setReferralId] = useState('');

    const dispatch = useDispatch();

    const handleSubmit = async () => {
        if (!patientName || !patientGender || !patientAge) {
            Alert.alert('Missing Fields', 'Please fill all patient details');
            return;
        }

        dispatch(showLoader());
        try {
            const data = {
                appointment_request_date: startedDate,
                appointment_time: selectedHour,
                patient_name: patientName,
                patient_gender: patientGender,
                patient_age: patientAge,
                reason_for_visit: reasonForVisit,
                referral_id: referralId,
            };

            const finalUrl = `${ENDPOINTS.book_appointment_dialysis}/${unitId}`;
            const response = await ApiService.post(finalUrl, data, true, false);

            if (response?.status === 'success') {
                const orderId = response?.data?.razorpay_order_id;
                handlePayment(orderId);
            } else {
                Toast.show(response?.message || 'Booking failed');
                dispatch(hideLoader());
            }
        } catch (error) {
            console.log("Booking error:==", error);
            Toast.show('Something went wrong. Please try again.');
            dispatch(hideLoader());
        }
    };

    const handlePayment = (orderId) => {
        const options = {
            description: 'Dialysis Appointment Payment',
            image: 'https://i.imgur.com/3g7nmJC.jpg',
            currency: 'INR',
            key: RAZORPAY_KEY_ID,
            amount: 100,
            name: 'Helthio24',
            order_id: orderId,
            prefill: {
                email: 'indramani@example.com',
                contact: '9191919191',
                name: 'Indramani Mishra',
            },
            theme: { color: COLORS.primary },
        };

        RazorpayCheckout.open(options)
            .then((data) => {
                const payment_id = data.razorpay_payment_id;
                const signature = data.razorpay_signature;
                verifyPayment(payment_id, signature, orderId);
            })
            .catch((error) => {
                dispatch(hideLoader());
                Alert.alert('Payment Cancelled', `Reason: ${error.description}`);
            });
    };

    const verifyPayment = async (payment_id, signature, order_id) => {
        try {
            const payload = { payment_id, signature, order_id };
            const response = await ApiService.post(ENDPOINTS.payment_dialysis_verify, payload, true, false);
            dispatch(hideLoader());

            if (response?.status === 'success') {
                Toast.show('Payment Verified & Appointment Booked');
                navigation.navigate('Dialysis');
            } else {
                Toast.show(response?.message || 'Payment verification failed');
            }
        } catch (error) {
            console.log("Verification error:==", error);
            Toast.show('Verification failed. Please contact support.');
            dispatch(hideLoader());
        }
    };

    return (
     
        <LinearGradient
            colors={['#00b4db', '#fff', '#fff']}
            style={styles.container}
        >
            <SafeAreaView style={{ flex: 1 }}>
                <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
                <Header title="Book Dialysis" onBackPress={() => navigation.goBack()}
                style={{ backgroundColor: 'transparent', marginTop: StatusBar.currentHeight }}
                />
                <ScrollView contentContainerStyle={styles.form}>
                 
                    <LinearGradient
                        colors={['#ffffff', '#f9fafb']}
                        style={styles.card}
                    >
                        <Text style={styles.cardTitle}>Selected Appointment</Text>
                        <View style={styles.cardRow}>
                            <Text style={styles.cardLabel}>Date:</Text>
                            <Text style={styles.cardValue}>{startedDate}</Text>
                        </View>
                        <View style={styles.cardRow}>
                            <Text style={styles.cardLabel}>Time:</Text>
                            <Text style={styles.cardValue}>{selectedHour}</Text>
                        </View>
                    </LinearGradient>

                    <Text style={styles.label}>Patient Name</Text>
                    <TextInput
                        style={styles.input}
                        value={patientName}
                        onChangeText={setPatientName}
                        placeholder="Enter Patient Name"
                        placeholderTextColor="#9CA3AF"
                    />

                    <Text style={styles.label}>Patient Gender</Text>
                    <View style={styles.pickerWrapper}>
                        <Picker
                            selectedValue={patientGender}
                            onValueChange={setPatientGender}
                            style={styles.picker}
                            dropdownIconColor="#4B5563"
                        >
                            <Picker.Item label="Select Gender" value="" color="#9CA3AF" />
                            <Picker.Item label="Male" value="Male" />
                            <Picker.Item label="Female" value="Female" />
                            <Picker.Item label="Other" value="Other" />
                        </Picker>
                    </View>

                    <Text style={styles.label}>Patient Age</Text>
                    <TextInput
                        style={styles.input}
                        value={patientAge}
                        onChangeText={setPatientAge}
                        placeholder="Enter Age"
                        keyboardType="numeric"
                        placeholderTextColor="#9CA3AF"
                    />

                    <Text style={styles.label}>Reason for Visit</Text>
                    <TextInput
                        style={styles.input}
                        value={reasonForVisit}
                        onChangeText={setReasonForVisit}
                        placeholder="Enter reason for visit"
                        placeholderTextColor="#9CA3AF"
                    />

                    <Text style={styles.label}>Referral ID (Optional)</Text>
                    <TextInput
                        style={styles.input}
                        value={referralId}
                        onChangeText={setReferralId}
                        placeholder="Enter Referral ID"
                        placeholderTextColor="#9CA3AF"
                    />

                
                    <TouchableOpacity onPress={handleSubmit}>
                        <LinearGradient
                            colors={[COLORS.primary, '#0077b6']}
                            style={styles.button}
                        >
                            <Text style={styles.buttonText}>Proceed to Payment</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
};

export default DialysisBookByPayment;

const styles = StyleSheet.create({
    container: { flex: 1 },
    form: { padding: 20 },
    card: {
        padding: 20,
        borderRadius: 16,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 12,
        fontFamily: 'Urbanist-Bold',
    },
    cardRow: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    cardLabel: {
        fontWeight: '500',
        color: '#6B7280',
        width: 60,
        fontFamily: 'Urbanist-Medium',
    },
    cardValue: {
        color: '#1F2937',
        fontWeight: '500',
        fontFamily: 'Urbanist-SemiBold',
    },
    label: {
        fontSize: 14,
        color: '#374151',
        marginBottom: 6,
        marginTop: 6,
        fontWeight: '500',
        fontFamily: 'Urbanist-Medium',
    },
    input: {
        backgroundColor: '#ffffff',
        borderColor: '#D1D5DB',
        borderWidth: 1,
        borderRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 16,
        fontSize: 16,
        marginBottom: 16,
        color: '#111827',
        fontFamily: 'Urbanist-Regular',
    },
    pickerWrapper: {
        backgroundColor: '#ffffff',
        borderColor: '#D1D5DB',
        borderWidth: 1,
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 16,
    },
    picker: {
        height: 48,
        color: '#111827',
        paddingHorizontal: 16,
    },
    button: {
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
        elevation: 4,
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'Urbanist-Bold',
    },
});
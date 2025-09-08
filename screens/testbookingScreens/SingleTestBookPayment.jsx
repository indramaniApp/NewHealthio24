import React, { useState } from 'react';
import {
    StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Alert, Modal, StatusBar, SafeAreaView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTheme } from '@react-navigation/native';
import Header from '../../components/Header';
import RazorpayCheckout from 'react-native-razorpay';
import Toast from 'react-native-simple-toast';
import { useDispatch } from 'react-redux';
import { showLoader, hideLoader } from '../../src/redux/slices/loaderSlice';
import { ENDPOINTS } from '../../src/constants/Endpoints';
import ApiService from '../../src/api/ApiService';
// 1. Import LinearGradient
import LinearGradient from 'react-native-linear-gradient';

const RAZORPAY_KEY_ID = 'rzp_test_R8LVEozZxuRsqb';

const SingleTestBookPayment = ({ route, navigation }) => {
    const { testId, selectedHour, startedDate, referralId: passedReferralId } = route.params || {};
    const { colors, dark } = useTheme();
    const dispatch = useDispatch();

    const [patientName, setPatientName] = useState('');
    const [patientAge, setPatientAge] = useState('');
    const [gender, setGender] = useState('');
    const [selectedMode, setSelectedMode] = useState('');
    const [modeModalVisible, setModeModalVisible] = useState(false);
    const [referralId, setReferralId] = useState(passedReferralId || '');

    const isFormValid = patientName && patientAge && gender && selectedMode;

    const handleSubmit = async () => {
        if (!isFormValid) {
            Alert.alert('Validation', 'Please fill all fields and select test mode');
            return;
        }

        dispatch(showLoader());

        const payload = {
            appointment_request_date: startedDate,
            appointment_time: selectedHour,
            appointment_type: selectedMode,
            patient_name: patientName,
            patient_age: patientAge,
            patient_gender: gender,
        };

        if (referralId.trim()) {
            payload.referral_id = referralId.trim();
        }

        try {
            const response = await ApiService.post(`${ENDPOINTS.book_test}/${testId}`, payload, true, false);
            if (response?.status === 'success') {
                const razorpayOrderId = response?.data?.razorpay_order_id;
                handlePayment(razorpayOrderId, testId);
            } else {
                Toast.show(response?.message || 'Booking failed');
            }
        } catch (error) {
            Toast.show('Error in booking. Please try again.');
        } finally {
            dispatch(hideLoader());
        }
    };

    const handlePayment = (orderId, entityId) => {
        const options = {
            description: 'Test Booking Payment',
            image: 'https://i.imgur.com/3g7nmJC.jpg',
            currency: 'INR',
            key: RAZORPAY_KEY_ID,
            amount: 100, // Example amount
            name: 'Helthio24',
            order_id: orderId,
            prefill: {
                email: 'user@example.com',
                contact: '9999999999',
                name: patientName,
            },
            theme: { color: '#00b4db' },
        };

        RazorpayCheckout.open(options)
            .then(data => {
                const payment_id = data.razorpay_payment_id;
                const signature = data.razorpay_signature;
                verifyPayment(payment_id, signature, orderId, entityId);
            })
            .catch(() => {
                Alert.alert('Payment Failed', 'You cancelled the payment.');
            });
    };

    const verifyPayment = async (payment_id, signature, order_id, entityId) => {
        dispatch(showLoader());
        const payload = { payment_id, signature, order_id };
        try {
            const response = await ApiService.post(`${ENDPOINTS.payment_test_verify}`, payload, true, false);
            if (response?.status === 'success') {
                Toast.show('Payment successful');
                navigation.navigate('Main');
            } else {
                Toast.show(response?.message || 'Verification failed');
            }
        } catch (error) {
            Toast.show('Error verifying payment');
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

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent />
            {/* 2. Wrap the screen content in LinearGradient */}
            <LinearGradient
                colors={['#00b4db', '#E0F7FA', '#FFFFFF']}
                style={{ flex: 1 }}
            >
                <Header title="Book Test Payment" onBackPress={() => navigation.goBack()} style={{ backgroundColor: 'transparent', marginTop: 40 }} />

                <ScrollView contentContainerStyle={{ paddingHorizontal: 16 }}>
                    {/* 3. Apply LinearGradient to the card */}
                    <LinearGradient
                        colors={dark ? ['#2c2c2c', '#1e1e1e'] : ['#F7FBFF', '#FFFFFF']}
                        style={styles.card}
                    >
                        <Text style={[styles.label, { color: colors.text }]}>📅 Appointment Date: {startedDate}</Text>
                        <Text style={[styles.label, { color: colors.text }]}>⏰ Appointment Time: {selectedHour}</Text>
                    </LinearGradient>

                    <View style={styles.formSection}>
                        <Text style={[styles.label, { color: colors.text }]}>Patient Name</Text>
                        <TextInput
                            value={patientName}
                            onChangeText={setPatientName}
                            placeholder="Enter patient name"
                            placeholderTextColor={dark ? '#888' : '#aaa'}
                            style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: dark ? '#2a2a2a' : '#fff' }]}
                        />

                        <Text style={[styles.label, { color: colors.text }]}>Patient Age</Text>
                        <TextInput
                            value={patientAge}
                            onChangeText={setPatientAge}
                            placeholder="Enter age"
                            placeholderTextColor={dark ? '#888' : '#aaa'}
                            keyboardType="numeric"
                            style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: dark ? '#2a2a2a' : '#fff' }]}
                        />

                        <Text style={[styles.label, { color: colors.text }]}>Gender</Text>
                        <View style={[styles.pickerWrapper, { borderColor: colors.border, backgroundColor: dark ? '#2a2a2a' : '#fff' }]}>
                            <Picker selectedValue={gender} onValueChange={setGender} style={{ color: colors.text }}>
                                <Picker.Item label="Select Gender" value="" />
                                <Picker.Item label="Male" value="Male" />
                                <Picker.Item label="Female" value="Female" />
                                <Picker.Item label="Other" value="Other" />
                            </Picker>
                        </View>

                        <Text style={[styles.label, { color: colors.text }]}>Choose Mode</Text>
                        <TouchableOpacity
                            style={[styles.pickerBox, { backgroundColor: dark ? '#2a2a2a' : '#fff' }]}
                            onPress={() => setModeModalVisible(true)}
                        >
                            <Text style={{ fontSize: 16, color: selectedMode ? colors.text : '#999' }}>{selectedModeLabel}</Text>
                        </TouchableOpacity>

                        <Text style={[styles.label, { color: colors.text }]}>Referral ID (Optional)</Text>
                        <TextInput
                            value={referralId}
                            onChangeText={setReferralId}
                            placeholder="Enter referral ID"
                            placeholderTextColor={dark ? '#888' : '#aaa'}
                            style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: dark ? '#2a2a2a' : '#fff' }]}
                        />

                        {/* 4. Apply LinearGradient to the button */}
                        <TouchableOpacity disabled={!isFormValid} style={{ opacity: isFormValid ? 1 : 0.6 }} onPress={handleSubmit}>
                            <LinearGradient
                                colors={isFormValid ? ['#00b4db', '#0077b6'] : ['#a9a9a9', '#808080']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.button}
                            >
                                <Text style={styles.buttonText}>Proceed to Pay</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </LinearGradient>

            <Modal visible={modeModalVisible} transparent animationType="fade" onRequestClose={() => setModeModalVisible(false)}>
                <TouchableOpacity activeOpacity={1} onPress={() => setModeModalVisible(false)} style={styles.modalOverlay}>
                    <View style={[styles.modalBox, { backgroundColor: colors.card }]}>
                        {modeOptions.map(option => (
                            <TouchableOpacity
                                key={option.value}
                                disabled={option.disabled}
                                onPress={() => { if (!option.disabled) { setSelectedMode(option.value); setModeModalVisible(false); } }}
                                style={styles.modalItem}
                            >
                                <Text style={[styles.modalItemText, { color: option.disabled ? '#999' : colors.text }]}>{option.label}</Text>
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity onPress={() => setModeModalVisible(false)} style={[styles.modalItem, { borderTopWidth: 1, borderTopColor: '#ccc' }]}>
                            <Text style={[styles.modalItemText, { color: 'red' }]}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </SafeAreaView>
    );
};

export default SingleTestBookPayment;

const styles = StyleSheet.create({
    container: { flex: 1 },
    card: {
        marginTop: 16,
        padding: 16,
        borderRadius: 10,
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        fontWeight: '500',
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 16,
    },
    pickerWrapper: {
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 16,
        justifyContent: 'center',
    },
    pickerBox: {
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 14,
        marginBottom: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    formSection: {
        paddingTop: 24,
        paddingBottom: 40,
    },
    button: {
        marginTop: 24,
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
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
        textAlign: 'center',
    },
});

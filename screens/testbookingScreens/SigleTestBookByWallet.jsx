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
import LinearGradient from 'react-native-linear-gradient';

const SingleTestBookByWallet = ({ navigation, route }) => {
    const { testId, startedDate, selectedHour, referralId: passedReferralId } = route.params || {};
    const { colors } = useTheme();
    const dispatch = useDispatch();

    const [patientName, setPatientName] = useState('');
    const [patientAge, setPatientAge] = useState('');
    const [gender, setGender] = useState('');
    const [appointmentType, setAppointmentType] = useState('');
    const [referralId, setReferralId] = useState(passedReferralId || '');

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

            if (referralId.trim()) payload.referral_id = referralId.trim();

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
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={['#fff', '#fff']}
                style={{ flex: 1 }}
            >
                <Header
                    title="Complete Blood Test"
                    onBackPress={() => navigation.goBack()}
                    style={{ backgroundColor: 'transparent', marginTop: 40 }}
                    titleStyle={{ color: '#4A148C' }}
                />

                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <LinearGradient
                        colors={['#F3E5F5', '#E1BEE7']}
                        style={styles.card}
                    >
                        <Text style={[styles.cardText, { color: '#6A1B9A' }]}>
                            Appointment Date: {startedDate}
                        </Text>
                        <Text style={[styles.cardText, { color: '#6A1B9A' }]}>
                            Appointment Time: {selectedHour}
                        </Text>
                    </LinearGradient>

                    {/* Form */}
                    <View style={styles.formSection}>
                        <Text style={[styles.label, { color: '#6A1B9A' }]}>Patient Name</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: '#fff', borderColor: '#6A1B9A', color: '#000' }]}
                            value={patientName}
                            onChangeText={setPatientName}
                            placeholder="Enter patient name"
                            placeholderTextColor="#888"
                        />

                        <Text style={[styles.label, { color: '#6A1B9A' }]}>Age</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: '#fff', borderColor: '#6A1B9A', color: '#000' }]}
                            value={patientAge}
                            onChangeText={setPatientAge}
                            placeholder="Enter age"
                            placeholderTextColor="#888"
                            keyboardType="numeric"
                        />

                        <Text style={[styles.label, { color: '#6A1B9A' }]}>Gender</Text>
                        <View style={[styles.pickerWrapper, { borderColor: '#6A1B9A', backgroundColor: '#fff' }]}>
                            <Picker
                                selectedValue={gender}
                                onValueChange={(itemValue) => setGender(itemValue)}
                                style={styles.picker}
                                dropdownIconColor="#6A1B9A"
                            >
                                <Picker.Item label="Select Gender" value="" color="#888" />
                                <Picker.Item label="Male" value="Male" />
                                <Picker.Item label="Female" value="Female" />
                                <Picker.Item label="Other" value="Other" />
                            </Picker>
                        </View>

                        <Text style={[styles.label, { color: '#6A1B9A' }]}>Appointment Type</Text>
                        <View style={[styles.pickerWrapper, { borderColor: '#6A1B9A', backgroundColor: '#fff' }]}>
                            <Picker
                                selectedValue={appointmentType}
                                onValueChange={(itemValue) => setAppointmentType(itemValue)}
                                style={styles.picker}
                                dropdownIconColor="#6A1B9A"
                            >
                                <Picker.Item label="Select Appointment Type" value="" color="#888" />
                                <Picker.Item label="Center Visit" value="center-visit" />
                                <Picker.Item label="Home Collection" value="home-visit" />
                            </Picker>
                        </View>

                        {/* <Text style={[styles.label, { color: '#6A1B9A' }]}>Referral ID (Optional)</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: '#fff', borderColor: '#6A1B9A', color: '#000' }]}
                            value={referralId}
                            onChangeText={setReferralId}
                            placeholder="Enter referral ID"
                            placeholderTextColor="#888"
                        /> */}

                        <TouchableOpacity
                            onPress={handleSubmit}
                            disabled={!patientName || !patientAge || !gender || !appointmentType}
                            style={{ opacity: patientName && patientAge && gender && appointmentType ? 1 : 0.5 }}
                        >
                            <LinearGradient
                                colors={['#6A1B9A', '#AB47BC']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.button}
                            >
                                <Text style={styles.buttonText}>Proceed to Pay</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </LinearGradient>
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
        padding: 14,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 30,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

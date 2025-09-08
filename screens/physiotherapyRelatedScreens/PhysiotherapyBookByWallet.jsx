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
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useDispatch } from 'react-redux';
import Header from '../../components/Header';
import { showLoader, hideLoader } from '../../src/redux/slices/loaderSlice';
import ApiService from '../../src/api/ApiService';
import { ENDPOINTS } from '../../src/constants/Endpoints';
import LinearGradient from 'react-native-linear-gradient'; // 1. ग्रेडिएंट इम्पोर्ट करें

const PhysiotherapyBookByWallet = ({ route, navigation }) => {
    const dispatch = useDispatch();
    const { centreId, startedDate, selectedHour } = route.params;

    const [patientName, setPatientName] = useState('');
    const [patientGender, setPatientGender] = useState('');
    const [patientAge, setPatientAge] = useState('');
    const [reasonForVisit, setReasonForVisit] = useState('');
    const [referralId, setReferralId] = useState('');

    const handleSubmit = async () => {
        if (!patientName || !patientGender || !patientAge || !reasonForVisit) {
            Alert.alert('Missing Fields', 'Please fill all patient details');
            return;
        }

        const payload = {
            appointment_request_date: startedDate,
            appointment_time: selectedHour,
            patient_name: patientName,
            patient_gender: patientGender,
            patient_age: patientAge,
            reason_for_visit: reasonForVisit,
            referral_id: referralId,
        };

        const finalUrl = `${ENDPOINTS.book_appointment_physiotherapy_wallet}/${centreId}`;

        try {
            dispatch(showLoader());
            const response = await ApiService.post(finalUrl, payload, true, false);

            if (response?.status === 'success') {
                Alert.alert('Success', response?.message || 'Appointment booked successfully!', [
                    { text: 'OK', onPress: () => navigation.navigate('PhysiotherapyHomeScreen') },
                ]);
            } else {
                Alert.alert('Error', response?.message || 'Something went wrong.');
            }
        } catch (error) {
            const msg = error?.response?.data?.message || error?.message || 'Something went wrong.';
            Alert.alert('Error', msg);
        } finally {
            dispatch(hideLoader());
        }
    };

    return (
        // 2. मुख्य View को LinearGradient से बदलें
        <LinearGradient
            colors={['#00b4db', '#f5fcff', '#fff']}
            style={styles.container}
        >
            {/* 3. StatusBar को ग्रेडिएंट के अनुसार एडजस्ट करें */}
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true} />
            <Header 
                title="Book Physiotherapy" 
                onBackPress={() => navigation.goBack()}
                style={{ backgroundColor: 'transparent', marginTop: StatusBar.currentHeight || 40 }}
            />

            <ScrollView contentContainerStyle={styles.form}>
                {/* Appointment Info */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Selected Appointment</Text>
                    <View style={styles.cardRow}>
                        <Text style={styles.cardLabel}>Date:</Text>
                        <Text style={styles.cardValue}>{startedDate}</Text>
                    </View>
                    <View style={styles.cardRow}>
                        <Text style={styles.cardLabel}>Time:</Text>
                        <Text style={styles.cardValue}>{selectedHour}</Text>
                    </View>
                </View>

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
                    placeholder="Enter Reason"
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

                {/* 4. बटन पर ग्रेडिएंट लगाएं */}
                <TouchableOpacity onPress={handleSubmit}>
                    <LinearGradient
                        colors={['#0077b6', '#00b4db']}
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>Proceed</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </ScrollView>
        </LinearGradient>
    );
};

export default PhysiotherapyBookByWallet;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor को हटा दें
    },
    form: {
        padding: 20,
    },
    card: {
        backgroundColor: '#ffffff',
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
    },
    cardRow: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    cardLabel: {
        fontWeight: '500',
        color: '#6B7280',
        width: 60,
    },
    cardValue: {
        color: '#1F2937',
        fontWeight: '500',
    },
    label: {
        fontSize: 14,
        color: '#374151',
        marginBottom: 6,
        marginTop: 6,
        fontWeight: '500',
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
        // backgroundColor को हटा दें
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 4,
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
    },
});
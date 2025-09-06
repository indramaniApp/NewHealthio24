import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    Image,
    TouchableOpacity,
    SafeAreaView,
} from 'react-native';
import ApiService from '../../src/api/ApiService';
import { ENDPOINTS } from '../../src/constants/Endpoints';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch } from 'react-redux';
import { showLoader, hideLoader } from '../../src/redux/slices/loaderSlice';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../../constants';
import LinearGradient from 'react-native-linear-gradient'; // 1. LinearGradient इम्पोर्ट करें

const CompletedAppointment = () => {
    const [appointments, setAppointments] = useState([]);
    const dispatch = useDispatch();
    const navigation = useNavigation();

    const fetchAppointments = async () => {
        try {
            dispatch(showLoader());
            const response = await ApiService.get(ENDPOINTS.dialysises_completed_book);
            setAppointments(response?.data || []);
        } catch (error) {
            console.log('Error fetching completed dialysis appointments:', error);
        } finally {
            dispatch(hideLoader());
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const renderItem = ({ item }) => (
        // 2. कार्ड के लिए View को LinearGradient से बदलें
        <LinearGradient
            colors={['#E0F2FE', '#FFFFFF']}
            style={styles.card}
        >
            <View style={styles.headerRow}>
                <MaterialCommunityIcons
                    name="water-pump"
                    size={20}
                    color={COLORS.primary}
                />
                <Text style={styles.unitName}>{item.dialysis?.dialysisUnitName || 'Unknown Unit'}</Text>
            </View>

            <View style={styles.infoRow}>
                <View style={styles.infoBox}>
                    <Text style={styles.label}>Patient</Text>
                    <Text style={styles.value}>{item.patient_name}</Text>
                </View>
                <View style={styles.infoBox}>
                    <Text style={styles.label}>Age / Gender</Text>
                    <Text style={styles.value}>{item.patient_age} / {item.patient_gender}</Text>
                </View>
            </View>

            <View style={styles.infoRow}>
                <View style={styles.infoBox}>
                    <Text style={styles.label}>Date</Text>
                    <Text style={styles.value}>{item.appointment_request_date}</Text>
                </View>
                <View style={styles.infoBox}>
                    <Text style={styles.label}>Time</Text>
                    <Text style={styles.value}>{item.appointment_time}</Text>
                </View>
            </View>

            <View style={styles.infoRow}>
                <View style={styles.infoBox}>
                    <Text style={styles.label}>Payment</Text>
                    <Text style={styles.value}>₹{item.appointment_payment}</Text>
                </View>
                <View style={styles.infoBox}>
                    <Text style={styles.label}>Method</Text>
                    <Text style={styles.value}>{item.payment_method}</Text>
                </View>
            </View>

            <View style={styles.tagRow}>
                <Text style={styles.tag}>{item.appointment_type}</Text>
            </View>

            <View style={styles.completedTag}>
                <MaterialCommunityIcons name="check-circle" size={16} color="green" />
                <Text style={styles.completedText}>Completed</Text>
            </View>

            <View style={styles.bookedByRow}>
                <Image source={{ uri: item.booked_by_image }} style={styles.avatar} />
                <Text style={styles.bookedByText}>Booked by {item.booked_by}</Text>
            </View>

            <View style={styles.actions}>
                <TouchableOpacity
                    style={styles.primaryBtn}
                    onPress={() => navigation.navigate('CompletedMoreDetails', { id: item._id })}
                >
                    <MaterialCommunityIcons name="information-outline" size={18} color="#fff" />
                    <Text style={styles.btnText}>More Details</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.outlineBtn}
                    onPress={() => navigation.navigate('Recipt', { id: item._id })}
                >
                    <MaterialCommunityIcons name="file-document-outline" size={18} color={COLORS.primary} />
                    <Text style={[styles.btnText, { color: COLORS.primary }]}>Receipt</Text>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={appointments}
                keyExtractor={(item) => item._id}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
                ListEmptyComponent={
                    <Text style={styles.empty}>No completed dialysis appointments.</Text>
                }
            />
        </SafeAreaView>
    );
};

export default CompletedAppointment;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent', // 3. बैकग्राउंड को ट्रांसपेरेंट करें
    },
    list: {
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    card: {
        // backgroundColor: '#FFFFFF', // इसे हटा दें
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        borderColor: '#E0F2FE',
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 3,
        elevation: 2,
    },
    // ... बाकी सभी styles वैसे ही रहेंगे
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
        gap: 6,
    },
    unitName: {
        fontSize: 16,
        fontFamily: 'Urbanist-Bold',
        color: COLORS.primary,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 4,
    },
    infoBox: {
        flex: 1,
        marginRight: 6,
    },
    label: {
        fontSize: 12,
        fontFamily: 'Urbanist-Medium',
        color: '#6B7280',
    },
    value: {
        fontSize: 14,
        fontFamily: 'Urbanist-SemiBold',
        color: '#1F2937',
        marginTop: 1,
    },
    tagRow: {
        marginTop: 6,
        alignSelf: 'flex-start',
        backgroundColor: '#E0F2FE',
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 14,
    },
    tag: {
        fontSize: 12,
        fontFamily: 'Urbanist-Medium',
        color: COLORS.primary,
    },
    completedTag: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        gap: 4,
    },
    completedText: {
        fontSize: 13,
        fontFamily: 'Urbanist-SemiBold',
        color: 'green',
    },
    bookedByRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 6,
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#D1D5DB',
    },
    bookedByText: {
        fontSize: 13,
        fontFamily: 'Urbanist-SemiBold',
        color: '#1F2937',
    },
    actions: {
        flexDirection: 'row',
        marginTop: 10,
        gap: 8,
    },
    primaryBtn: {
        flex: 1,
        backgroundColor: COLORS.primary,
        paddingVertical: 8,
        borderRadius: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 6,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 2,
    },
    outlineBtn: {
        flex: 1,
        borderWidth: 1.2,
        borderColor: COLORS.primary,
        paddingVertical: 8,
        borderRadius: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 6,
    },
    btnText: {
        fontSize: 13,
        fontFamily: 'Urbanist-SemiBold',
        color: '#fff',
    },
    empty: {
        textAlign: 'center',
        marginTop: 30,
        fontSize: 14,
        color: '#9CA3AF',
        fontFamily: 'Urbanist-Regular',
    },
});
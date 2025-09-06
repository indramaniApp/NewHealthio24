import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import ApiService from '../../src/api/ApiService';
import { ENDPOINTS } from '../../src/constants/Endpoints';
import { showLoader, hideLoader } from '../../src/redux/slices/loaderSlice';

// Helper function to format date and time
const formatDateTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const options = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    };
    return new Intl.DateTimeFormat('en-GB', options).format(date);
};

// Helper component for displaying data rows, styled as requested
const InfoRow = ({ label, value }) => (
    <View style={styles.infoRow}>
        <Text style={styles.label}>{label}:</Text>
        <Text style={styles.value}>{value || 'N/A'}</Text>
    </View>
);

const MoreDetailScreen = () => {
    const [appointment, setAppointment] = useState(null);
    const navigation = useNavigation();
    const route = useRoute();
    const dispatch = useDispatch();
    const { id } = route.params;

    useEffect(() => {
        fetchDialysisDetails();
    }, [id]);

    const fetchDialysisDetails = async () => {
        try {
            dispatch(showLoader());
            const response = await ApiService.get(`${ENDPOINTS.dialysis_book}/${id}`);
            if (response?.status === 'success' && response.data) {
                const appointmentData = Array.isArray(response.data) ? response.data[0] : response.data;
                setAppointment(appointmentData);
            }
        } catch (error) {
            console.log('Dialysis fetch error:', error);
        } finally {
            dispatch(hideLoader());
        }
    };
    
    // Custom header component, styled like the example
    const renderHeader = () => (
        <View style={styles.screenHeader}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={20} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.screenTitle}>Appointment Details</Text>
        </View>
    );

    if (!appointment) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#00b4db" />
                <Text>Loading Details...</Text>
            </SafeAreaView>
        );
    }

    return (
        <LinearGradient colors={['#00b4db', '#ffffff', '#fff']} style={{ flex: 1 }}>
            <SafeAreaView style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={{ padding: 16 }}>
                    {renderHeader()}
                    
                    <View style={styles.card}>
                        <LinearGradient
                            colors={['#00b4db', '#1e88e5']} 
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.cardHeader}
                        >
                            <MaterialCommunityIcons name="water-pump" size={20} color="#fff" />
                            <Text style={styles.cardHeaderText}>Dialysis Booking</Text>
                            <View style={styles.cardHeaderRight}>
                                <Text style={styles.serial}>#{appointment?.serialNumber}</Text>
                            </View>
                        </LinearGradient>
                        
                        <View style={styles.row}>
                            <Image source={{ uri: appointment?.booked_by_image }} style={styles.avatar} />
                            <View style={{ marginLeft: 10, flex: 1 }}>
                                <Text style={styles.name}>{appointment?.patient_name}</Text>
                                <Text style={styles.meta}>{`${appointment?.patient_age} / ${appointment?.patient_gender}`}</Text>
                            </View>
                        </View>
                        
                        <View style={styles.section}>
                            <InfoRow label="Appointment Date" value={appointment?.appointment_request_date} />
                            <InfoRow label="Appointment Time" value={appointment?.appointment_time} />
                            <InfoRow label="Status" value={appointment?.status} />
                        </View>

                        <View style={styles.section}>
                            <InfoRow label="Center Name" value={appointment.dialysis?.dialysisUnitName} />
                            <InfoRow label="Center Contact" value={appointment.dialysis?.contactNumber} />
                        </View>
                        
                        <View style={styles.section}>
                            <InfoRow label="Payment Amount" value={`₹${appointment?.appointment_payment}`} />
                            <InfoRow label="Payment Method" value={appointment?.payment_method} />
                            <InfoRow label="Payment Status" value={appointment?.payment_status} />
                            <InfoRow label="Transaction ID" value={appointment?.payment_transaction_id} />
                        </View>
                        
                        {appointment.reason_for_visit && (
                           <View style={styles.section}>
                             <InfoRow label="Reason for Visit" value={
                                 Array.isArray(appointment.reason_for_visit)
                                     ? appointment.reason_for_visit.join(', ')
                                     : appointment.reason_for_visit
                             } />
                           </View>
                        )}
                        
                        <View style={{ marginTop: 10 }}>
                            <Text style={styles.bookedOn}>Booked on: {formatDateTime(appointment?.createdAt)}</Text>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
};

export default MoreDetailScreen;

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    screenHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 18,
    },
    screenTitle: {
        fontSize: 20,
        fontWeight: '700',
        marginLeft: 12,
        color: '#333',
    },
    backButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#1e88e5',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 14,
        padding: 16,
        marginBottom: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
    },
    cardHeader: {
        borderRadius: 10,
        paddingVertical: 8,
        paddingHorizontal: 12,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    cardHeaderText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 15,
        marginLeft: 8,
    },
    cardHeaderRight: {
        marginLeft: 'auto',
    },
    serial: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 14,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: '#1e88e5',
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    meta: {
        fontSize: 14,
        color: '#666',
    },
    section: {
        marginTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        paddingTop: 12,
    },
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#555',
    },
    value: {
        fontSize: 14,
        color: '#111',
        fontWeight: '600',
        flexShrink: 1,
        textAlign: 'right',
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 6,
    },
    bookedOn: {
        fontSize: 12,
        fontStyle: 'italic',
        color: '#666',
        textAlign: 'right',
        marginTop: 10,
    },
});
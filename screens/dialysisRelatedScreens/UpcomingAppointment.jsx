import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    Image,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ApiService from '../../src/api/ApiService';
import { ENDPOINTS } from '../../src/constants/Endpoints';
import { showLoader, hideLoader } from '../../src/redux/slices/loaderSlice';
import LinearGradient from 'react-native-linear-gradient';

const DIALYSIS_RED = "#E53935";
const DIALYSIS_LIGHT = "#FFEBEE";
const GRADIENT_COLORS = ['#FF3B3B', '#9C27B0'];

const DatePickerView = () => {
    const [appointments, setAppointments] = useState([]);
    const dispatch = useDispatch();
    const navigation = useNavigation();

    const fetchAppointments = async () => {
        try {
            dispatch(showLoader());
            const res = await ApiService.get(ENDPOINTS.dialysises_book);
            setAppointments(res?.data || []);
        } catch (err) {
            console.log('Error:', err);
        } finally {
            dispatch(hideLoader());
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const renderCard = ({ item }) => {
        const reasons = Array.isArray(item.reason_for_visit)
            ? item.reason_for_visit
            : item.reason_for_visit
            ? [item.reason_for_visit]
            : [];

        return (
            <View style={styles.card}>
                <View style={styles.headerRow}>
                    <MaterialCommunityIcons
                        name="water-pump"
                        size={20}
                        color={DIALYSIS_RED}
                    />
                    <Text style={styles.unitName}>
                        {item.dialysis?.dialysisUnitName || 'Unknown Unit'}
                    </Text>
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

                <View style={styles.divider} />

                <View style={styles.infoRow}>
                    <View style={styles.infoBox}>
                        <Text style={styles.label}>Patient</Text>
                        <Text style={styles.value}>{item.patient_name}</Text>
                    </View>
                    <View style={styles.infoBox}>
                        <Text style={styles.label}>Age / Gender</Text>
                        <Text style={styles.value}>
                            {item.patient_age} / {item.patient_gender}
                        </Text>
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

                {reasons.length > 0 && (
                    <View style={styles.infoRow}>
                        <View style={styles.infoBox}>
                            <Text style={styles.label}>Reason</Text>
                            {reasons.map((reason, idx) => (
                                <Text key={idx} style={styles.value}>{reason}</Text>
                            ))}
                        </View>
                    </View>
                )}

                <View style={styles.tagRow}>
                    <Text style={styles.tag}>{item.appointment_type}</Text>
                </View>

                <View style={styles.bookedByRow}>
                    <Image source={{ uri: item.booked_by_image }} style={styles.avatar} />
                    <Text style={styles.bookedByText}>Booked by {item.booked_by}</Text>
                </View>

                <View style={styles.actions}>
                    {/* Primary Button with Gradient */}
                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate('MoreDetailScreen', { id: item._id })
                        }
                        style={{ flex: 1 }}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={GRADIENT_COLORS}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.primaryBtn}
                        >
                            <MaterialCommunityIcons
                                name="information-outline"
                                size={18}
                                color="#fff"
                            />
                            <Text style={styles.btnText}>More Details</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    {/* Outline Button with Gradient Border */}
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Recipt', { id: item._id })}
                        style={{ flex: 1 }}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={GRADIENT_COLORS}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.outlineBtnWrapper}
                        >
                            <View style={styles.outlineBtn}>
                                <MaterialCommunityIcons
                                    name="file-document-outline"
                                    size={18}
                                    color={DIALYSIS_RED}
                                />
                                <Text style={[styles.btnText, { color: DIALYSIS_RED }]}>
                                    Receipt
                                </Text>
                            </View>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={appointments}
                keyExtractor={(item) => item._id}
                renderItem={renderCard}
                contentContainerStyle={styles.list}
                ListEmptyComponent={
                    <Text style={styles.empty}>
                        No upcoming dialysis appointments.
                    </Text>
                }
            />
        </SafeAreaView>
    );
};

export default DatePickerView;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    list: { paddingHorizontal: 16, paddingVertical: 16 },

    card: {
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#FFCDD2',
        elevation: 2,
    },

    headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6, gap: 6 },
    unitName: { fontSize: 16, fontFamily: 'Urbanist-Bold', color: DIALYSIS_RED },

    infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4 },
    infoBox: { flex: 1, marginRight: 6 },

    label: { fontSize: 12, color: '#6B7280', fontFamily: 'Urbanist-Medium' },
    value: { fontSize: 14, color: '#1F2937', fontFamily: 'Urbanist-SemiBold', marginTop: 1 },

    divider: { height: 1, backgroundColor: '#FECACA', marginVertical: 6 },

    tagRow: {
        marginTop: 6,
        alignSelf: 'flex-start',
        backgroundColor: '#FFCDD2',
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 14,
    },
    tag: { fontSize: 12, fontFamily: 'Urbanist-Medium', color: DIALYSIS_RED },

    bookedByRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
    avatar: { width: 32, height: 32, borderRadius: 6, marginRight: 8, borderWidth: 1, borderColor: '#FCA5A5' },
    bookedByText: { fontSize: 13, fontFamily: 'Urbanist-SemiBold', color: '#1F2937' },

    actions: { flexDirection: 'row', marginTop: 10, gap: 8 },

    primaryBtn: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 8,
        borderRadius: 20,
    },

    outlineBtnWrapper: {
        borderRadius: 20,
        padding: 1,
    },
    outlineBtn: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 6,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#fff',
    },

    btnText: { fontSize: 13, fontFamily: 'Urbanist-SemiBold', color: '#fff' },
    empty: { textAlign: 'center', marginTop: 30, fontSize: 14, color: '#9CA3AF' },
});

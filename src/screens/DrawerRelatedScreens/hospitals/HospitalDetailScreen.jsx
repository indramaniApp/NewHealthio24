import React, { useState, useCallback } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    SafeAreaView,
    TouchableOpacity,
    Platform,
    StatusBar,
    Image,
    Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useDispatch } from 'react-redux';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

import { COLORS, SIZES } from '../../../../constants';
import Header from '../../../../components/Header';
import { showLoader, hideLoader } from '../../../redux/slices/loaderSlice';
import ApiService from '../../../api/ApiService';
import { ENDPOINTS } from '../../../constants/Endpoints';
import { useTheme } from '../../../../theme/ThemeProvider';

const { width } = Dimensions.get('window');

const HospitalDetailScreen = () => {
    const dispatch = useDispatch();
    const route = useRoute();
    const navigation = useNavigation();
    const { dark } = useTheme();
    const { hospitalId, hospitalData } = route.params;

    const [hospital, setHospital] = useState(hospitalData || null);

    const fetchHospitalDetail = async () => {
        try {
            dispatch(showLoader());
            const response = await ApiService.get(`${ENDPOINTS.patient_get_hospital_detail}/${hospitalId}`);
            setHospital(response.data);
        } catch (error) {
            console.log('Error fetching hospital detail:', error);
        } finally {
            dispatch(hideLoader());
        }
    };

    useFocusEffect(
        useCallback(() => {
            if (!hospitalData) fetchHospitalDetail();
        }, [hospitalId])
    );

    const departments = [
        { key: 'clinical', name: 'Clinical', icon: 'stethoscope', count: hospital?.clinical_department?.length || 0, color: '#00d2ff', screen: 'ClinicalDepartment', data: hospital?.clinical_department || [] },
        { key: 'surgical', name: 'Surgical', icon: 'hand-holding-medical', count: hospital?.surgical_department?.length || 0, color: '#3a7bd5', screen: 'SurgicalDepartment', data: hospital?.surgical_department || [] },
        { key: 'preventive', name: 'Preventive', icon: 'heartbeat', count: hospital?.specialty_preventive_department?.length || 0, color: '#ee1212', screen: 'SpecialPreventDepartment', data: hospital?.specialty_preventive_department || [] },
    ];

const renderInfoRow = (icon, label, value, isLast = false) => (
    <View style={[
        styles.infoRow,
        !isLast && styles.borderBottom,
    ]}>
        <View style={[
            styles.iconCircle,
            { backgroundColor: dark ? 'rgba(255,255,255,0.08)' : '#f8f9fa' }
        ]}>
            <FontAwesome5 name={icon} size={14} color={COLORS.primary} />
        </View>

        <View style={styles.rowTextWrap}>
            <Text style={styles.infoLabel}>{label}</Text>

            <Text
                style={[
                    styles.infoValue,
                    { color: dark ? '#fff' : '#222' }
                ]}
            >
                {value || 'N/A'}
            </Text>
        </View>
    </View>
);



    return (
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient colors={dark ? ['#121212', '#1a1a1a'] : ['#f4f7f7', '#f8f9fa']} style={styles.mainGradient}>
                <Header title="Hospital Details" onBackPress={() => navigation.goBack()} />

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    
                    {/* Hero Section */}
                    <View style={styles.heroContainer}>
                        <Image 
                            source={hospital?.hospitalExteriorPhoto?.startsWith('http') ? { uri: hospital.hospitalExteriorPhoto } : require('../../../../assets/hospital.png')} 
                            style={styles.heroImage}
                        />
                        <LinearGradient colors={['transparent', 'rgba(0,0,0,0.85)']} style={styles.heroOverlay}>
                            <Text style={styles.heroName}>{hospital?.hospitalName}</Text>
                            <View style={styles.locBadge}>
                                <Icon name="map-marker-radius" size={16} color="#00d4ff" />
                                <Text style={styles.locText}>{hospital?.city}, {hospital?.state}</Text>
                            </View>
                        </LinearGradient>
                    </View>

                   {/* Department Grid */}
<View style={styles.deptRow}>
    {departments.map((dept) => (
        <TouchableOpacity 
            key={dept.key} 
            style={[styles.deptCard, { backgroundColor: dark ? '#222' : '#fff' }]}
            onPress={() => navigation.navigate(dept.screen, { 
                departmentType: dept.name, 
                hospitalId: hospital?._id, 
                data: dept.data 
            })}
        >
            <LinearGradient colors={[dept.color, dept.color + 'CC']} style={styles.deptIcon}>
                <FontAwesome5 name={dept.icon} size={18} color="#fff" />
            </LinearGradient>
            
            <Text style={[styles.deptTitle, { color: dark ? '#fff' : '#333' }]} numberOfLines={1}>
                {dept.name}
            </Text>

            {/* Modern Pill Badge for Count */}
            <View style={[styles.countBadge, { backgroundColor: dept.color + '15', borderColor: dept.color + '40' }]}>
                <Text style={[styles.countText, { color: dept.color }]}>
                    {dept.count} {dept.count === 1 ? 'Doctor' : 'Doctors'}
                </Text>
            </View>
        </TouchableOpacity>
    ))}
</View>

                   {/* Unified Information Card - Now Full Width */}
<View style={[styles.unifiedCard, { backgroundColor: dark ? '#1a1a1a' : '#fff' }]}>
    {/* Drag handle for modal look */}
    <View style={styles.dragHandle} />

    <View style={styles.sheetContent}>
        <View style={styles.cardHeader}>
            <Icon name="information-variant" size={22} color={COLORS.primary} />
            <Text style={[styles.cardHeaderText, { color: dark ? '#fff' : '#000' }]}>Full Specifications</Text>
        </View>

        {/* General Section */}
        {renderInfoRow('id-card', 'Registration Number', hospital?.registrationNumber)}
        {renderInfoRow('calendar-check', 'Established', hospital?.dateOfEstablishment)}
        {renderInfoRow('hospital-symbol', 'Type', Array.isArray(hospital?.hospitalType) ? hospital.hospitalType.join(', ') : hospital?.hospitalType)}
        {renderInfoRow('bed', 'Bed Count', `${hospital?.totalBeds} (ICU: ${hospital?.icuBeds})`)}
        {renderInfoRow('user-circle', 'Contact Person', hospital?.keyContactPersonName)}
        {renderInfoRow('phone-alt', 'Contact Number', hospital?.keyContactPersonContactNumber)}
        {renderInfoRow('link', 'Website', hospital?.websiteLink)}

        {/* Payment Sub-Section with Modern Divider */}
        <View style={styles.subHeader}>
            <LinearGradient 
                colors={[COLORS.primary + '20', 'transparent']} 
                start={{x:0, y:0}} end={{x:1, y:0}} 
                style={styles.subHeaderGradient}
            >
                <Text style={styles.subHeaderText}>Banking & Payments</Text>
            </LinearGradient>
        </View>

        {renderInfoRow('university', 'Bank Name', hospital?.bankName)}
        {renderInfoRow('user-check', 'Account Holder', hospital?.accountHolderName)}
        {renderInfoRow('list-alt', 'Account Number', hospital?.accountNumber)}
        {renderInfoRow('barcode', 'IFSC Code', hospital?.ifscCode, true)}
    </View>
    
    <View style={{ height: 50 }} />
</View>

                    <View style={{ height: 30 }} />
                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#00b4db' },
    mainGradient: { flex: 1 },
    scrollContent: { padding: 16 },

    // Hero Header
    heroContainer: { height: 180, borderRadius: 20, overflow: 'hidden', elevation: 12, shadowColor: '#000', marginBottom: 20 },
    heroImage: { width: '100%', height: '100%' },
    heroOverlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'flex-end', padding: 20 },
    heroName: { color: '#fff', fontSize: 24, fontWeight: '800', letterSpacing: 0.5 },
    locBadge: { flexDirection: 'row', alignItems: 'center', marginTop: 8, backgroundColor: 'rgba(255,255,255,0.15)', alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
    locText: { color: '#00d4ff', fontSize: 13, marginLeft: 6, fontWeight: '600' },

    // Departments
  deptRow: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        paddingVertical: 20 
    },
    deptCard: { 
        width: (width - 64) / 3, 
        paddingTop: 18,
        paddingBottom: 12,
        paddingHorizontal: 8, 
        borderRadius: 24, 
        alignItems: 'center', 
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    deptIcon: { 
        width: 46, 
        height: 46, 
        borderRadius: 16, 
        justifyContent: 'center', 
        alignItems: 'center', 
        marginBottom: 12 
    },
    deptTitle: { 
        fontSize: 12, 
        fontWeight: '700', 
        marginBottom: 8,
        textAlign: 'center'
    },
    countBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 1,
        marginTop: 2,
    },
    countText: {
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 0.2,
    },

 unifiedCard: { 
        width: width, // Takes full screen width
        borderTopLeftRadius: 40, 
        borderTopRightRadius: 40, 
        paddingTop: 10,
        marginTop: 10,
        elevation: 25, 
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -12 },
        shadowOpacity: 0.15,
        shadowRadius: 15,
        // Important: ensures it touches edges if ScrollView has padding
        marginLeft: -16, // Agar ScrollView padding 16 hai toh use nullify karega
    },
    dragHandle: {
        width: 45,
        height: 5,
        backgroundColor: '#EAEAEA',
        borderRadius: 10,
        alignSelf: 'center',
        marginVertical: 15,
    },
    sheetContent: {
        paddingHorizontal: 25, // Internal spacing for text
    },
    cardHeader: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        marginBottom: 20, 
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.05)'
    },
    cardHeaderText: { 
        fontSize: 18, 
        fontWeight: '800', 
        marginLeft: 10,
        letterSpacing: -0.5
    },
    subHeader: { 
        marginTop: 30, 
        // marginBottom: 15 
    },
    subHeaderGradient: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 10,
    },
    subHeaderText: { 
        fontSize: 13, 
        fontWeight: '900', 
        color: COLORS.primary, 
        letterSpacing: 1.2,
        textTransform: 'uppercase'
    },
    
   infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
},

rowTextWrap: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
},

infoLabel: {
    fontSize: 13,
    color: '#666',
    fontWeight: '600',
},

infoValue: {
    fontSize: 13,
    fontWeight: '700',
    maxWidth: '55%',   // prevents overlap
    textAlign: 'right',
},

iconCircle: {
    width: 26,
    height: 26,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,   // ← gap increase (15 → 22)
},

    // Sub Section Divider
    subHeader: { flexDirection: 'row', alignItems: 'center', marginTop: 20, marginBottom: 10 },
    subHeaderText: { fontSize: 13, fontWeight: 'bold', color: COLORS.primary, marginRight: 10 },
    line: { flex: 1, height: 1, backgroundColor: 'rgba(0,0,0,0.05)' }
});

export default HospitalDetailScreen;
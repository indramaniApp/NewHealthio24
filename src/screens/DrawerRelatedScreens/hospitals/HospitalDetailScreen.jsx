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
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useDispatch } from 'react-redux';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';

import { COLORS } from '../../../../constants';
import Header from '../../../../components/Header';
import { showLoader, hideLoader } from '../../../redux/slices/loaderSlice';
import ApiService from '../../../api/ApiService';
import { ENDPOINTS } from '../../../constants/Endpoints';

const HospitalDetailScreen = () => {
  const dispatch = useDispatch();
  const route = useRoute();
  const navigation = useNavigation();
  const { hospitalId, hospitalData } = route.params;

  const [hospital, setHospital] = useState(hospitalData || null);

  const fetchHospitalDetail = async () => {
    try {
      dispatch(showLoader());
      const response = await ApiService.get(`${ENDPOINTS.patient_get_hospital_detail}/${hospitalId}`);
      console.log('=====hospitalDetails======', response.data);
      setHospital(response.data);
    } catch (error) {
      console.log('Error fetching hospital detail:', error);
    } finally {
      dispatch(hideLoader());
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (!hospitalData) {
        fetchHospitalDetail();
      }
    }, [hospitalId])
  );

  const departments = [
    {
      key: 'clinical',
      name: 'Clinical Department',
      icon: 'stethoscope',
      count: hospital?.clinical_department?.length || 0,
      description: 'Handles general patient care and diagnostics.',
      screen: 'ClinicalDepartment',
      data: hospital?.clinical_department || [],
    },
    {
      key: 'surgical',
      name: 'Surgical Department',
      icon: 'user-md',
      count: hospital?.surgical_department?.length || 0,
      description: 'Responsible for all surgical operations and procedures.',
      screen: 'SurgicalDepartment',
      data: hospital?.surgical_department || [],
    },
    {
      key: 'preventive',
      name: 'Specialty Preventive Department',
      icon: 'heartbeat',
      count: hospital?.specialty_preventive_department?.length || 0,
      description: 'Focuses on preventive healthcare and wellness programs.',
      screen: 'SpecialPreventDepartment',
      data: hospital?.specialty_preventive_department || [],
    },
  ];

  const renderDepartmentCard = (dept) => (
    <TouchableOpacity
      key={dept.key}
      style={styles.deptCard}
      onPress={() => {
        navigation.navigate(dept.screen, {
          departmentType: dept.name,
          departmentIds: dept.data,
          hospitalId: hospital._id,
          data: dept.data,
        });
      }}
    >
      <View style={styles.circleIcon}>
        <FontAwesome5 name={dept.icon} size={20} color={COLORS.primary} />
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{dept.count}</Text>
        </View>
      </View>
      <View style={styles.deptTextContainer}>
        <Text style={styles.deptName}>{dept.name}</Text>
        <Text style={styles.deptCount}>Doctors: {dept.count}</Text>
        <Text style={styles.deptDescription}>{dept.description}</Text>
      </View>
      <FontAwesome5 name="chevron-right" size={16} color="#888" style={styles.arrowIcon} />
    </TouchableOpacity>
  );

  const renderHospitalDetailCard = () => {
    if (!hospital) return null;

    return (
      <View style={styles.hospitalCard}>
        <Text style={styles.hospitalTitle}>{hospital.hospitalName}</Text>

        {hospital.hospitalExteriorPhoto && (
          <Image source={{ uri: hospital.hospitalExteriorPhoto }} style={styles.image} resizeMode="cover" />
        )}

        {[
          { icon: 'id-card', label: 'Reg No', value: hospital.registrationNumber },
          { icon: 'calendar-alt', label: 'Established', value: hospital.dateOfEstablishment },
          { icon: 'hospital', label: 'Type', value: Array.isArray(hospital.hospitalType) ? hospital.hospitalType.join(', ') : hospital.hospitalType },
          { icon: 'map-marker-alt', label: 'Address', value: `${hospital.streetAddress}, ${hospital.city}, ${hospital.state} - ${hospital.postalCode}, ${hospital.country}` },
        
          { icon: 'user-tie', label: 'Key Contact', value: `${hospital.keyContactPersonName} (${hospital.keyContactPersonDesignation}) - ${hospital.keyContactPersonContactNumber}` },
          { icon: 'bed', label: 'Beds', value: `${hospital.totalBeds} (ICU: ${hospital.icuBeds}, SCU: ${hospital.specialCareUnitBeds}, Other: ${hospital.otherBeds})` },
          { icon: 'university', label: 'Bank', value: `${hospital.bankName} - ${hospital.branchAddress}` },
          { icon: 'id-badge', label: 'Account', value: `${hospital.accountHolderName} | A/C: ${hospital.accountNumber} | IFSC: ${hospital.ifscCode}` },
          { icon: 'globe', label: 'Website', value: hospital.websiteLink },
          { icon: 'signature', label: 'TC Date', value: hospital.tcDate },
        ].map((row, idx) => (
          <View key={idx} style={styles.detailRow}>
            <FontAwesome5 name={row.icon} size={14} color={COLORS.primary} />
            <Text style={styles.label}> {row.label}: </Text>
            <Text style={styles.value}>{row.value || 'N/A'}</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Hospital Details" onBackPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.sectionTitle}>Departments</Text>
        {departments.map(renderDepartmentCard)}
        <Text style={styles.sectionTitle}>Hospital Info</Text>
        {renderHospitalDetailCard()}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HospitalDetailScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    padding: 16,
    backgroundColor: '#f2f2f2',
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 16,
  },
  deptCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 3,
  },
  circleIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.background || '#e6f5fc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: 'red',
    borderRadius: 10,
    paddingHorizontal: 4,
    paddingVertical: 1,
    minWidth: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '700',
  },
  deptTextContainer: {
    flex: 1,
    paddingRight: 8,
  },
  arrowIcon: {
    marginLeft: 8,
  },
  deptName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text || '#2c3e50',
  },
  deptCount: {
    fontSize: 13,
    color: '#555',
    marginTop: 4,
  },
  deptDescription: {
    fontSize: 12,
    color: '#777',
    marginTop: 2,
  },
  hospitalCard: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 12,
    elevation: 3,
    marginBottom: 16,
  },
  hospitalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  image: {
    height: 180,
    width: '100%',
    borderRadius: 12,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    fontSize: 13,
    color: '#333',
    fontWeight: '600',
  },
  value: {
    fontSize: 13,
    color: '#555',
    flexShrink: 1,
  },
});

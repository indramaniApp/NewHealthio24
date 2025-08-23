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

import { hideLoader, showLoader } from '../../../../redux/slices/loaderSlice';
import ApiService from '../../../../api/ApiService';
import { ENDPOINTS } from '../../../../constants/Endpoints';
import { COLORS } from '../../../../../constants';
import Header from '../../../../../components/Header';

const GovHospitalDetailScreen = () => {
  const dispatch = useDispatch();
  const route = useRoute();
  const navigation = useNavigation();
  const { hospitalId } = route.params;
  const [hospital, setHospital] = useState();

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
      fetchHospitalDetail();
    }, [hospitalId])
  );

  const departments = [
    {
      key: 'clinical',
      name: 'Clinical Department',
      icon: 'stethoscope',
      count: hospital?.clinical_department?.length || 0,
      description: 'Handles general patient care and diagnostics.',
      screen: 'ClinicalDepartmentScreen',
      data: hospital?.clinical_department || [],
    },
    {
      key: 'surgical',
      name: 'Surgical Department',
      icon: 'user-md',
      count: hospital?.surgical_department?.length || 0,
      description: 'Responsible for all surgical operations and procedures.',
      screen: 'SurgicalDepartmentScreen',
      data: hospital?.surgical_department || [],
    },
    {
      key: 'preventive',
      name: 'Preventive Department',
      icon: 'heartbeat',
      count: hospital?.specialty_preventive_department?.length || 0,
      description: 'Focuses on preventive healthcare and wellness programs.',
      screen: 'SpecialDepartmentScreen',
      data: hospital?.specialty_preventive_department || [],
    },
  ];

  const renderDepartmentCard = (dept) => (
    <TouchableOpacity
      key={dept.key}
      style={styles.deptCard}
      onPress={() =>
        navigation.navigate(dept.screen, {
          hospitalId: hospital._id,
          departmentData: dept.data,
          departmentType: dept.name,
        })
      }
    >
      <View style={styles.circleIcon}>
        <FontAwesome5 name={dept.icon} size={24} color={COLORS.primary} />
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{dept.count}</Text>
        </View>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.deptName}>{dept.name}</Text>
        <Text style={styles.deptCount}>Doctors: {dept.count}</Text>
        <Text style={styles.deptDescription}>{dept.description}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderHospitalDetailCard = () => {
    if (!hospital) return null;


    const uniqueSchemes = hospital.governmentSchemes
      ? Array.from(new Set(hospital.governmentSchemes.map(s => s.name)))
        .map(name => hospital.governmentSchemes.find(s => s.name === name))
      : [];

    return (
      <View style={styles.hospitalCard}>
        <Text style={styles.hospitalTitle}>{hospital.hospitalName}</Text>

        {hospital.hospitalExteriorPhoto && (
          <Image source={{ uri: hospital.hospitalExteriorPhoto }} style={styles.image} resizeMode="cover" />
        )}

        {[
          { icon: 'id-card', label: 'Reg No', value: hospital.registrationNumber },
          { icon: 'hospital', label: 'Type', value: (hospital.hospitalType || []).join(', ') },
          { icon: 'building', label: 'Specialization', value: (hospital.specializationsOffered || []).join(', ') },
          { icon: 'map-marker-alt', label: 'Location', value: `${hospital.city}, ${hospital.state}` },
          { icon: 'globe', label: 'Website', value: hospital.websiteLink },
        ].map((row, idx) => (
          <View key={idx} style={styles.detailRow}>
            <FontAwesome5 name={row.icon} size={14} color={COLORS.primary} />
            <Text style={styles.label}> {row.label}: </Text>
            <Text style={styles.value}>{row.value || 'N/A'}</Text>
          </View>
        ))}

        <Text style={styles.sectionTitle}>🏥 Govt. Schemes</Text>

        {uniqueSchemes.length > 0 ? (
          <View style={styles.schemeTagContainer}>
            {uniqueSchemes.map((scheme, index) => (
              <View key={index} style={styles.schemeTag}>
                <Text style={styles.schemeTagText}>{scheme.name}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.schemeText}>No schemes available</Text>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Govt. Hospital Details" 
        onBackPress={() => navigation.goBack()}

      />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.sectionTitle}>Departments</Text>
        {departments.map(renderDepartmentCard)}
        <Text style={styles.sectionTitle}>Hospital Info</Text>
        {renderHospitalDetailCard()}
      </ScrollView>
    </SafeAreaView>
  );
};

export default GovHospitalDetailScreen;

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
  schemeText: {
    fontSize: 13,
    color: '#555',
    marginLeft: 16,
    marginBottom: 2,
  },
  schemeTagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  schemeTag: {
    backgroundColor: '#e0f7fa',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    margin: 4,
  },
  schemeTagText: {
    fontSize: 12,
    color: COLORS.primary,
  },
});

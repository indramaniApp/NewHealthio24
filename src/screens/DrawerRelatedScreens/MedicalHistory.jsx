import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  SafeAreaView,
  Platform,
  ScrollView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { hideLoader, showLoader } from '../../redux/slices/loaderSlice';
import ApiService from '../../api/ApiService';
import { ENDPOINTS } from '../../constants/Endpoints';
import Header from '../../../components/Header';
import { COLORS } from '../../../constants/theme';

const MedicalHistory = ({navigation}) => {
  const dispatch = useDispatch();
  const [data, setData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchMedicalHistory = async () => {
    try {
      dispatch(showLoader());
      setErrorMessage('');
      const response = await ApiService.get(ENDPOINTS.get_health_record);
      console.log('Response Data:', response.data);
      setData(response.data);
    } catch (error) {
      console.log('Error fetching medical history:', error);
      setErrorMessage('Something went wrong while fetching your records.');
    } finally {
      dispatch(hideLoader());
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchMedicalHistory();
    }, [])
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Medical History" 
      onBackPress={() => navigation.goBack()}
      />
      <ScrollView contentContainerStyle={styles.container}>
        {!data || Object.keys(data).length === 0 ? (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>
              {errorMessage || 'No health records found, please create first.'}
            </Text>
          </View>
        ) : (
          <View style={styles.card}>
            <Text style={styles.title}>Medical History</Text>

            <View style={styles.row}>
              <Text style={styles.label}>Height</Text>
              <Text style={styles.value}>{data.height ?? 'N/A'} cm</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Weight</Text>
              <Text style={styles.value}>{data.weight ?? 'N/A'} kg</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Blood Pressure</Text>
              <Text style={styles.value}>{data.bloodPressure ?? 'N/A'}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Heart Rate</Text>
              <Text style={styles.value}>{data.heartRate ?? 'N/A'} bpm</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Temperature</Text>
              <Text style={styles.value}>{data.temperature ?? 'N/A'} °F</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Diagnosis</Text>
              <Text style={styles.value}>{data.diagnosis ?? 'N/A'}</Text>
            </View>

            <View style={[styles.row, { alignItems: 'flex-start' }]}>
              <Text style={styles.label}>Notes</Text>
              <Text style={[styles.value, { flex: 1 }]}>{data.notes ?? 'N/A'}</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default MedicalHistory;

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
    flexGrow: 1,
  },
  noDataContainer: {
    marginTop: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noDataText: {
    color: '#4A6FA5',
    fontSize: 16,
    textAlign: 'center',
    fontStyle: 'italic',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#d1d9e6',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 14,
    alignItems: 'center',
  },
  label: {
    fontWeight: '700',
    color: '#4A6FA5',
    width: 130,
    fontSize: 15,
  },
  value: {
    color: '#1B263B',
    fontSize: 15,
    flexShrink: 1,
  },
});

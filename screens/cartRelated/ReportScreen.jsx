import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Linking,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import ApiService from '../../src/api/ApiService';
import { ENDPOINTS } from '../../src/constants/Endpoints';
import { useDispatch } from 'react-redux';
import { showLoader, hideLoader } from '../../src/redux/slices/loaderSlice';
import Header from '../../components/Header';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const ReportScreen = ({ route }) => {
  const { id } = route.params || {};
  const [reports, setReports] = useState([]);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const fetchReports = async () => {
    try {
      dispatch(showLoader());
      const response = await ApiService.get(`${ENDPOINTS.patient_get_pathology_reports}/${id}`);
      console.log('Pathology Reports Response:===', response);
      setReports(response?.data || []);
      dispatch(hideLoader());
    } catch (error) {
      console.log('Error fetching reports:', error);
      dispatch(hideLoader());
    }
  };

  useEffect(() => {
    if (id) {
      fetchReports();
    }
  }, [id]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="🧪 Pathology Reports"
        onBackPress={() => navigation.goBack()}
        containerStyle={{ backgroundColor: 'transparent', elevation: 0 }}
      />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {reports.length === 0 ? (
          <Text style={styles.emptyText}>No reports found.</Text>
        ) : (
          reports.map((report, index) => (
            <View key={report._id || index} style={styles.reportCard}>
              <View style={styles.row}>
                <MaterialCommunityIcons name="file-document" size={20} color="#4A4A4A" />
                <Text style={styles.label}>
                  <Text style={styles.labelTitle}>  Name: </Text>
                  {report.name}
                </Text>
              </View>

              <View style={styles.row}>
                <MaterialCommunityIcons name="calendar" size={20} color="#4A4A4A" />
                <Text style={styles.label}>
                  <Text style={styles.labelTitle}>  Date: </Text>
                  {report.date}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.viewButton}
                onPress={() => Linking.openURL(report.url)}
              >
                <Text style={styles.viewButtonText}>🔗 View Report</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ReportScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F6F8',
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 30,
  },
  reportCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  labelTitle: {
    fontWeight: '600',
    color: '#1E293B',
  },
  viewButton: {
    marginTop: 14,
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  viewButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  emptyText: {
    marginTop: 40,
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});

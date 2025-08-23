import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Header from '../../components/Header';
import ApiService from '../../src/api/ApiService';
import { ENDPOINTS } from '../../src/constants/Endpoints';
import { useDispatch } from 'react-redux';
import { showLoader, hideLoader } from '../../src/redux/slices/loaderSlice';
import { useFocusEffect } from '@react-navigation/native';

const StylishCardScreen = ({ navigation }) => {
  const [packages, setPackages] = useState([]);
  const dispatch = useDispatch();

  useFocusEffect(
    useCallback(() => {
      fetchPackages();
    }, [])
  );

  const fetchPackages = async () => {
    try {
      dispatch(showLoader());
      const res = await ApiService.get(ENDPOINTS.pm_package_gets);
      console.log('Response Data:', res);
      if (res?.status === 'success' && Array.isArray(res.data)) {
        setPackages(res.data);
      } else {
        setPackages([]);
      }
    } catch (error) {
      console.log('Error fetching packages:', error);
      setPackages([]);
    } finally {
      dispatch(hideLoader());
    }
  };

  const handleBook = (item) => {
    // console.log('Booking Serial:', item.serialNumber);
     navigation.navigate('PatientMitraSelectSlot', { packageId: item._id });
  };

  return (
    <View style={styles.container}>
      <Header title="Mitra Packages" onBackPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll}>
        {packages.map((item) => (
          <View key={item._id} style={styles.card}>
            <View style={styles.stripe} />
            <View style={styles.cardContent}>
          
              <View style={styles.detailsRow}>
                <Text style={styles.detailText}>💰 ₹{item.fee}</Text>
                <Text style={styles.detailText}>🕒 {item.time}</Text>
              </View>
           
              <TouchableOpacity
               
                style={styles.bookButton}
                onPress={() => handleBook(item)}
              >
                <Text style={styles.bookButtonText}>🚀 Book Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default StylishCardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fbfc',
  },
  scroll: {
    padding: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  stripe: {
    width: 6,
    backgroundColor: '#10b981',
  },
  cardContent: {
    flex: 1,
    padding: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 10,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  detailText: {
    fontSize: 15,
    color: '#4b5563',
    fontWeight: '600',
  },
  bookButton: {
    backgroundColor: '#10b981',
    paddingVertical: 5,
    borderRadius: 30,
    alignItems: 'center',
    alignSelf: 'flex-end',
    paddingHorizontal: 20,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  bookButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
});

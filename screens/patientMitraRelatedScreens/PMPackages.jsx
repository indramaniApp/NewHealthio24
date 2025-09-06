import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Header from '../../components/Header';
import ApiService from '../../src/api/ApiService';
import { ENDPOINTS } from '../../src/constants/Endpoints';
import { useDispatch } from 'react-redux';
import { showLoader, hideLoader } from '../../src/redux/slices/loaderSlice';
import { useFocusEffect } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

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
    navigation.navigate('PatientMitraSelectSlot', { packageId: item._id });
    console.log('Selected Package ID:=====', item._id);
  };

  return (
    <LinearGradient
      colors={['#00b4db', '#f4f4f5', '#f4f4f5']}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true} />
        <Header
          title="Mitra Packages"
          onBackPress={() => navigation.goBack()}
          style={{ backgroundColor: 'transparent', marginTop: 40 }}
        />
        <ScrollView contentContainerStyle={styles.scroll}>
          {packages.map((item) => (
            <View key={item._id} style={styles.card}>
              <View style={styles.stripe} />
              <View style={styles.cardContent}>
                <View style={styles.detailsRow}>
                  <Text style={styles.detailText}>💰 ₹{item.fee}</Text>
                  <Text style={styles.detailText}>🕒 {item.time}</Text>
                </View>

                {/* 🔥 TouchableOpacity ab LinearGradient ko wrap kar raha hai */}
                <TouchableOpacity
                  onPress={() => handleBook(item)}
                  style={{ alignSelf: 'flex-end' }} // 🔥 Button ko right align karne ke liye
                >
                  <LinearGradient
                    colors={['#00b4db', '#34d399']} // 🔥 Button ke liye gradient colors
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.bookButton}
                  >
                    <Text style={styles.bookButtonText}>🚀 Book Now</Text>
                  </LinearGradient>
                </TouchableOpacity>

              </View>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default StylishCardScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scroll: {
    padding: 16,
    paddingTop: 30,
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
    backgroundColor: '#00b4db',
  },
  cardContent: {
    flex: 1,
    padding: 16,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailText: {
    fontSize: 15,
    color: '#4b5563',
    fontWeight: '600',
  },
  bookButton: {
    // 🔥 backgroundColor hata diya gaya hai, ab gradient use ho raha hai
    paddingVertical: 8, // 🔥 Padding adjust kiya
    borderRadius: 30,
    alignItems: 'center',
    paddingHorizontal: 20,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  bookButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
});
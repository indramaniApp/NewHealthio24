import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, { useState, useCallback } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { COLORS, SIZES } from '../../constants/theme';
import Header from '../../components/Header';
import LinearGradient from 'react-native-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { showLoader, hideLoader } from '../../src/redux/slices/loaderSlice';
import ApiService from '../../src/api/ApiService';
import { ENDPOINTS } from '../../src/constants/Endpoints';

const PatientMitraHome = ({ navigation }) => {
  const [packageCount, setPackageCount] = useState(0);
  const [bookedCount, setBookedCount] = useState(0);
  const [acceptedCount, setAcceptedCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const dispatch = useDispatch();

  useFocusEffect(
    useCallback(() => {
      fetchPMCounts();
    }, [])
  );

  const fetchPMCounts = async () => {
    try {
      dispatch(showLoader());

      const [packageRes, bookedRes, acceptedRes, completedRes] = await Promise.all([
        ApiService.get(ENDPOINTS.pm_package_gets_count),
        ApiService.get(ENDPOINTS.pm_package_book_count),
        ApiService.get(ENDPOINTS.pm_package_book_accepted_count),
        ApiService.get(ENDPOINTS.pm_package_book_completed_count),
      ]);

      setPackageCount(packageRes?.status === 'success' ? packageRes.data || 0 : 0);
      setBookedCount(bookedRes?.status === 'success' ? bookedRes.data || 0 : 0);
      setAcceptedCount(acceptedRes?.status === 'success' ? acceptedRes.data || 0 : 0);
      setCompletedCount(completedRes?.status === 'success' ? completedRes.data || 0 : 0);

    } catch (error) {
      console.log('Error fetching PM counts:', error);
      setPackageCount(0);
      setBookedCount(0);
      setAcceptedCount(0);
      setCompletedCount(0);
    } finally {
      dispatch(hideLoader());
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Patient Mitra" onBackPress={() => navigation.goBack()} />

      {/* Card 1: Patient Mitra Packages */}
      <TouchableOpacity
        style={[styles.card, { marginTop: SIZES.base * 4 }]}
        onPress={() => navigation.navigate('PMPackages')}
        activeOpacity={0.85}
      >
        <View style={styles.stripe} />
        <LinearGradient colors={['#2196F3', '#0D47A1']} style={styles.iconWrapper}>
          <MaterialCommunityIcons name="calendar-clock" size={26} color="#fff" />
          {packageCount > 0 && (
            <View style={styles.badgeRed}>
              <Text style={styles.badgeText}>{packageCount}</Text>
            </View>
          )}
        </LinearGradient>
        <View style={styles.textWrapper}>
          <Text style={styles.title}>Patient Mitra Packages</Text>
          <Text style={styles.subtitle}>
            View upcoming appointments and manage your daily visit schedule efficiently.
          </Text>
        </View>
        <MaterialIcons name="chevron-right" size={26} color="#607D8B" />
      </TouchableOpacity>

      {/* Card 2: Booked Patient Mitra Lists */}
      <TouchableOpacity
        style={[styles.card, { marginTop: SIZES.base * 2 }]}
        onPress={() => navigation.navigate('PatientMitraBookingList')}
     
      >
        <View style={styles.stripe} />
        <View style={{ alignItems: 'center' }}>
          <LinearGradient colors={['#2196F3', '#0D47A1']} style={styles.iconWrapper}>
            <MaterialCommunityIcons name="clipboard-check-outline" size={26} color="#fff" />
            {bookedCount > 0 && (
              <View style={styles.badgeRed}>
                <Text style={styles.badgeText}>{bookedCount}</Text>
              </View>
            )}
            {acceptedCount > 0 && (
              <View style={styles.badgePink}>
                <Text style={styles.badgeText}>{acceptedCount}</Text>
              </View>
            )}
            {completedCount > 0 && (
              <View style={styles.badgeYellow}>
                <Text style={styles.badgeText}>{completedCount}</Text>
              </View>
            )}
          </LinearGradient>
        </View>
        <View style={styles.textWrapper}>
          <Text style={styles.title}>Booked Patient Mitra Lists</Text>
          <Text style={styles.subtitle}>
            Check confirmed patient bookings, history, and manage completed visits.
          </Text>
        </View>
        <MaterialIcons name="chevron-right" size={26} color="#607D8B" />
      </TouchableOpacity>

      {/* Legend below card */}
      <View style={{ flexDirection: 'row', marginLeft: 30, marginTop: 6, marginBottom: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 12 }}>
          <View style={[styles.legendCircle, { backgroundColor: '#FF5252' }]} />
          <Text style={styles.legendLabel}>Booked</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 12 }}>
          <View style={[styles.legendCircle, { backgroundColor: '#F06292' }]} />
          <Text style={styles.legendLabel}>Accepted</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={[styles.legendCircle, { backgroundColor: '#FFD600' }]} />
          <Text style={styles.legendLabel}>Completed</Text>
        </View>
        </View>
      </View>
    </View>
  );
};

export default PatientMitraHome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingTop: SIZES.base * 2,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    padding: SIZES.base * 2,
    borderRadius: 18,
    width: '90%',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
    position: 'relative',
  },
  stripe: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 5,
    backgroundColor: '#0D47A1',
    borderTopLeftRadius: 18,
    borderBottomLeftRadius: 18,
  },
  iconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.base * 2,
    position: 'relative',
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  textWrapper: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Urbanist-Bold',
    color: '#0D47A1',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 18,
    fontFamily: 'Urbanist-Regular',
    color: '#546E7A',
  },
  badgeRed: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF5252',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderColor: COLORS.white,
    borderWidth: 1,
    zIndex: 3,
  },
  badgePink: {
    position: 'absolute',
    top: -5,
    right: 18,
    backgroundColor: '#F06292',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderColor: COLORS.white,
    borderWidth: 1,
    zIndex: 2,
  },
  badgeYellow: {
    position: 'absolute',
    top: -5,
    right: 41,
    backgroundColor: '#FFD600',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderColor: COLORS.white,
    borderWidth: 1,
    zIndex: 1,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  legendCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendLabel: {
    fontSize: 13,
    color: '#444',
    fontWeight: '500',
  },
});

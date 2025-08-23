import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import React, { useState, useCallback } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import ApiService from '../../src/api/ApiService';
import { ENDPOINTS } from '../../src/constants/Endpoints';
import { hideLoader, showLoader } from '../../src/redux/slices/loaderSlice';
import Header from '../../components/Header';
import { COLORS } from '../../constants';

const PhysiotherapyHomeScreen = () => {
  const navigation = useNavigation();
  const scheme = useColorScheme();
  const isDarkMode = scheme === 'dark';

  const [scheduledCount, setScheduledCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const dispatch = useDispatch();

  useFocusEffect(
    useCallback(() => {
      fetchPhysiotherapyCounts();
    }, [])
  );

  const fetchPhysiotherapyCounts = async () => {
    try {
      dispatch(showLoader());
      const [scheduledRes, completedRes] = await Promise.all([
        ApiService.get(ENDPOINTS.physiotherapys_book_count),
        ApiService.get(ENDPOINTS.physiotherapys_completed_book_count),
      ]);

      setScheduledCount(
        scheduledRes?.status === 'success' ? scheduledRes.data || 0 : 0
      );
      setCompletedCount(
        completedRes?.status === 'success' ? completedRes.data || 0 : 0
      );
    } catch (error) {
      console.log('Error fetching counts:', error);
      setScheduledCount(0);
      setCompletedCount(0);
    } finally {
      dispatch(hideLoader());
    }
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? COLORS.white : COLORS.white },
      ]}
    >
      <Header
        title="Physiotherapy Booking"
        onBackPress={() => navigation.goBack()}
      />

      {/* Book Appointment */}
      <TouchableOpacity
        style={[styles.card, styles.shadow,{marginTop: 40}]}
        onPress={() => navigation.navigate('Physiotherapy')}
      >
        <View style={styles.iconWrapper}>
          <View style={styles.iconCircle}>
            <Icon name="body-outline" size={22} color="#2f6bff" />
          </View>
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>Book Physiotherapy Appointment</Text>
          <Text style={styles.cardSubtitle}>
            Choose center, date & time for your physiotherapy session and confirm your slot.
          </Text>
        </View>
        <Icon name="chevron-forward" size={20} color="#fff" />
      </TouchableOpacity>

      {/* Your Appointments */}
      <TouchableOpacity
        style={[styles.card, styles.shadow,{marginTop: 20}]}
        onPress={() => navigation.navigate('PhysiotherapyAppointments')}
      >
        <View style={styles.iconWrapper}>
          <View style={styles.iconCircle}>
            <Icon name="calendar-outline" size={22} color="#2f6bff" />
          </View>
          {scheduledCount > 0 && (
            <View style={[styles.badge, { backgroundColor: '#f44336' }]}>
              <Text style={styles.badgeText}>{scheduledCount}</Text>
            </View>
          )}
          {completedCount > 0 && (
            <View
              style={[
                styles.badge,
                { backgroundColor: '#4caf50', top: 22 },
              ]}
            >
              <Text style={styles.badgeText}>{completedCount}</Text>
            </View>
          )}
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>Your Appointments</Text>
          <Text style={styles.cardSubtitle}>
            View your scheduled and completed physiotherapy sessions.
          </Text>
        </View>
        <Icon name="chevron-forward" size={20} color="#fff" />
      </TouchableOpacity>

      {/* Legends */}
      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#f44336' }]} />
          <Text style={styles.legendText}>Scheduled</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#4caf50' }]} />
          <Text style={styles.legendText}>Completed</Text>
        </View>
      </View>
    </View>
  );
};

export default PhysiotherapyHomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    // marginBottom: 20,
    gap: 12,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
    // marginTop: 20,
  },
  iconWrapper: {
    marginRight: 14,
    position: 'relative',
  },
  iconCircle: {
    backgroundColor: '#fff',
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#f0f0f0',
    lineHeight: 18,
  },
  badge: {
    position: 'absolute',
    right: -6,
    top: -6,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
    backgroundColor: '#f44336',
    zIndex: 10,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  legendRow: {
    flexDirection: 'row',
    marginTop: 8,
    paddingHorizontal: 4,
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#4b5563',
  },
});



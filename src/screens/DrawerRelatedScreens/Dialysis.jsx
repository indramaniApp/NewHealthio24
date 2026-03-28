import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import React, { useCallback, useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import Header from '../../../components/Header';
import { COLORS } from '../../../constants';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { showLoader, hideLoader } from '../../../src/redux/slices/loaderSlice';
import ApiService from '../../../src/api/ApiService';
import { ENDPOINTS } from '../../../src/constants/Endpoints';
import LinearGradient from 'react-native-linear-gradient';

/* 🔴 RED DIALYSIS THEME */
const RED_GRADIENT_BG = ['#fff', '#fff', '#fff'];
const RED_CARD_GRADIENT = ['#FFE5E5', '#FFD6D6'];
const RED_ICON_BG = ['#FF3B3B', '#9C27B0']; // Gradient for icons
const RED_DARK = '#B30000';

const Dialysis = () => {
  const navigation = useNavigation();
  const scheme = useColorScheme();

  const [scheduledCount, setScheduledCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const dispatch = useDispatch();

  useFocusEffect(
    useCallback(() => {
      fetchDialysisCounts();
    }, []),
  );

  const fetchDialysisCounts = async () => {
    try {
      dispatch(showLoader());

      const [scheduledRes, completedRes] = await Promise.all([
        ApiService.get(ENDPOINTS.dialysises_book_count),
        ApiService.get(ENDPOINTS.dialysises_book_completed_count),
      ]);

      setScheduledCount(
        scheduledRes?.status === 'success' ? scheduledRes.data || 0 : 0,
      );
      setCompletedCount(
        completedRes?.status === 'success' ? completedRes.data || 0 : 0,
      );
    } catch (error) {
      console.log('Error fetching dialysis counts:', error);
      setScheduledCount(0);
      setCompletedCount(0);
    } finally {
      dispatch(hideLoader());
    }
  };

  return (
    <LinearGradient colors={RED_GRADIENT_BG} style={{ flex: 1 }}>
      <View style={styles.container}>
        <Header
          title="Dialysis Booking"
          onBackPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              navigation.navigate('HomeTabs');
            }
          }}
          style={{ backgroundColor: 'transparent' }}
        />

        {/* Book Dialysis */}
        <TouchableOpacity
          style={{ marginTop: 18 }}
          onPress={() => navigation.navigate('UpcomingCenters')}
          activeOpacity={0.9}
        >
          <LinearGradient colors={RED_CARD_GRADIENT} style={styles.card}>
            <LinearGradient
              colors={RED_ICON_BG}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.iconCircle}
            >
              <Icon name="medkit-outline" size={24} color="#fff" />
            </LinearGradient>

            <View style={styles.cardContent}>
              <Text
                style={[styles.cardTitle, { color: '#000' }]}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                Book Dialysis Appointment
              </Text>

              <Text style={styles.cardSubtitle}>
                Select unit, date, and time slot for dialysis treatment. You can
                choose from available dialysis centers and confirm the booking.
              </Text>
            </View>
            <View style={styles.cardButton}>
              <Icon name="chevron-forward" size={22} color={RED_DARK} />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Your Appointments */}
        <TouchableOpacity
          style={{ marginTop: 18 }}
          onPress={() => navigation.navigate('Appointments')}
          activeOpacity={0.9}
        >
          <LinearGradient colors={RED_CARD_GRADIENT} style={styles.card}>
            <View style={styles.iconWrapper}>
              <LinearGradient
                colors={RED_ICON_BG}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.iconCircle}
              >
                <Icon name="calendar-outline" size={24} color="#fff" />
              </LinearGradient>

              {scheduledCount > 0 && (
                <View
                  style={[
                    styles.badge,
                    { backgroundColor: '#FF4D4D', top: -5 },
                  ]}
                >
                  <Text style={styles.badgeText}>{scheduledCount}</Text>
                </View>
              )}
              {completedCount > 0 && (
                <View
                  style={[
                    styles.badge,
                    { backgroundColor: '#4caf50', top: 20 },
                  ]}
                >
                  <Text style={styles.badgeText}>{completedCount}</Text>
                </View>
              )}
            </View>

            <View style={styles.cardContent}>
              <Text style={[styles.cardTitle, { color: '#000' }]}>
                Your Appointments
              </Text>
              <Text style={styles.cardSubtitle}>
                View all your upcoming and past dialysis appointments. Keep
                track of your schedule and stay updated.
              </Text>
            </View>

            <View style={styles.cardButton}>
              <Icon name="chevron-forward" size={22} color={RED_DARK} />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Legend */}
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View
              style={[styles.legendCircle, { backgroundColor: '#FF4D4D' }]}
            />
            <Text style={styles.legendLabel}>Scheduled</Text>
          </View>
          <View style={styles.legendItem}>
            <View
              style={[styles.legendCircle, { backgroundColor: '#4caf50' }]}
            />
            <Text style={styles.legendLabel}>Completed</Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};

export default Dialysis;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 22,
    paddingVertical: 18,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },

  iconWrapper: {
    position: 'relative',
    marginRight: 14,
  },

  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  badge: {
    position: 'absolute',
    right: -0,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
    borderWidth: 1,
    borderColor: COLORS.white,
    zIndex: 10,
  },

  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },

  cardContent: {
    flex: 1,
    paddingHorizontal: 8,
  },

  cardTitle: {
    fontSize: 15.5,
    fontWeight: '700',
    marginBottom: 4,
    letterSpacing: 0.3,
  },

  cardSubtitle: {
    fontSize: 12.5,
    lineHeight: 18,
    color: '#333',
  },

  cardButton: {
    padding: 6,
  },

  legendRow: {
    flexDirection: 'row',
    marginTop: 16,
    marginLeft: 8,
  },

  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },

  legendCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },

  legendLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#555',
  },
});

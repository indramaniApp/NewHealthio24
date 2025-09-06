import { StyleSheet, Text, View, TouchableOpacity, useColorScheme } from 'react-native';
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

const Dialysis = () => {
    const navigation = useNavigation();
    const scheme = useColorScheme();
    const isDarkMode = scheme === 'dark';

    const [scheduledCount, setScheduledCount] = useState(0);
    const [completedCount, setCompletedCount] = useState(0);
    const dispatch = useDispatch();

    useFocusEffect(
        useCallback(() => {
            fetchDialysisCounts();
        }, [])
    );

    const fetchDialysisCounts = async () => {
        try {
            dispatch(showLoader());

            const [scheduledRes, completedRes] = await Promise.all([
                ApiService.get(ENDPOINTS.dialysises_book_count),
                ApiService.get(ENDPOINTS.dialysises_book_completed_count),
            ]);

            if (scheduledRes?.status === 'success') {
                setScheduledCount(scheduledRes.data || 0);
            } else {
                setScheduledCount(0);
            }

            if (completedRes?.status === 'success') {
                setCompletedCount(completedRes.data || 0);
            } else {
                setCompletedCount(0);
            }
        } catch (error) {
            console.log('Error fetching dialysis counts:', error);
            setScheduledCount(0);
            setCompletedCount(0);
        } finally {
            dispatch(hideLoader());
        }
    };

    const cardGradientColors = ['#0077b6', '#00b4db'];

    return (
   
        <LinearGradient
            colors={['#00b4db', '#fff', '#fff','#fff','#fff']} 
            style={{ flex: 1 }}
        >
            <View style={styles.container}>
          
                <Header 
                    title="Dialysis Booking" 
                    onBackPress={() => navigation.navigate('Home')} 
               
                    style={{ backgroundColor: 'transparent',marginTop: 40 }} 
                />

                <TouchableOpacity
                    style={{ marginTop: 18 }}
                    onPress={() => navigation.navigate('UpcomingCenters')}
                    activeOpacity={0.9}
                >
                    <LinearGradient
                        colors={cardGradientColors}
                        style={styles.card}
                    >
                        <View style={styles.iconCircle}>
                            <Icon name="medkit-outline" size={24} color={COLORS.white} />
                        </View>
                        <View style={styles.cardContent}>
                            <Text style={styles.cardTitle}>Book Dialysis Appointment</Text>
                            <Text style={styles.cardSubtitle}>
                                Select unit, date, and time slot for dialysis treatment. You can choose from
                                available dialysis centers and confirm the booking.
                            </Text>
                        </View>
                        <View style={styles.cardButton}>
                            <Icon name="chevron-forward" size={22} color={COLORS.white} />
                        </View>
                    </LinearGradient>
                </TouchableOpacity>

                {/* Your Appointments Card */}
                <TouchableOpacity
                    style={{ marginTop: 18 }}
                    onPress={() => navigation.navigate('Appointments')}
                    activeOpacity={0.9}
                >
                    <LinearGradient
                        colors={cardGradientColors}
                        style={styles.card}
                    >
                        <View style={styles.iconWrapper}>
                            <View style={styles.iconCircle}>
                                <Icon name="calendar-outline" size={24} color={COLORS.white} />
                            </View>
                            {scheduledCount > 0 && (
                                <View style={[styles.badge, { backgroundColor: '#f44336', top: -5 }]}>
                                    <Text style={styles.badgeText}>{scheduledCount}</Text>
                                </View>
                            )}
                            {completedCount > 0 && (
                                <View style={[styles.badge, { backgroundColor: '#4caf50', top: 20 }]}>
                                    <Text style={styles.badgeText}>{completedCount}</Text>
                                </View>
                            )}
                        </View>
                        <View style={styles.cardContent}>
                            <Text style={styles.cardTitle}>Your Appointments</Text>
                            <Text style={styles.cardSubtitle}>
                                View all your upcoming and past dialysis appointments. Keep track of your
                                schedule and stay updated.
                            </Text>
                        </View>
                        <View style={styles.cardButton}>
                            <Icon name="chevron-forward" size={22} color={COLORS.white} />
                        </View>
                    </LinearGradient>
                </TouchableOpacity>

                {/* Legend */}
                <View style={styles.legendRow}>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendCircle, { backgroundColor: '#f44336' }]} />
                        <Text style={styles.legendLabel}>Scheduled</Text>
                    </View>
                    <View style={styles.legendItem}>
                        <View style={[styles.legendCircle, { backgroundColor: '#4caf50' }]} />
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
        backgroundColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    badge: {
        position: 'absolute',
        right: -6,
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
        fontSize: 16.5,
        fontWeight: '700',
        color: COLORS.white,
        marginBottom: 4,
        letterSpacing: 0.3,
    },
    cardSubtitle: {
        fontSize: 13,
        lineHeight: 18,
        color: 'rgba(255,255,255,0.9)',
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
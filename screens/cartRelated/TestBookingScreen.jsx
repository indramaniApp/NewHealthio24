import React, { useRef, useState, useCallback } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    Platform,
    ScrollView,
    FlatList,
    Dimensions,
    Animated,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '../../components/Header';
import { COLORS } from '../../constants';
import { useDispatch } from 'react-redux';
import { hideLoader, showLoader } from '../../src/redux/slices/loaderSlice';
import ApiService from '../../src/api/ApiService';
import { ENDPOINTS } from '../../src/constants/Endpoints';
import { useFocusEffect } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

const ads = [
    {
        id: '1',
        title: 'Special Offers!',
        description: 'Get up to 30% off on full body and essential health checkups. Limited time only!',
        icon: 'bullhorn',
    },
    {
        id: '2',
        title: 'Free Home Sample',
        description: 'No extra charges for home sample collection on selected lab tests.',
        icon: 'truck-fast',
    },
    {
        id: '3',
        title: 'Fast & Digital Reports',
        description: 'Receive your lab reports within 24 hours, directly on your mobile.',
        icon: 'file-document-outline',
    },
    {
        id: '4',
        title: 'Trusted Certified Labs',
        description: 'All tests are processed by NABL and ISO certified partner labs.',
        icon: 'certificate-outline',
    },
];

const TestBookingScreen = ({ navigation }) => {
    const scrollX = useRef(new Animated.Value(0)).current;
    const [scheduledCount, setScheduledCount] = useState(0);
    const [completedCount, setCompletedCount] = useState(0);
    const [testCount, setTestCount] = useState(0);
    const [packageCount, setPackageCount] = useState(0);
    const [cartCount, setCartCount] = useState(0);
    const dispatch = useDispatch();

    useFocusEffect(
        useCallback(() => {
            fetchBookingCount();
            fetchCartCount();
        }, [])
    );

    const fetchBookingCount = async () => {
        try {
            dispatch(showLoader());
            const response = await ApiService.get(ENDPOINTS.approved_pathology_appointments_count);
            if (response?.status === 'success' && response?.data) {
                setScheduledCount(response.data.scheduled || 0);
                setCompletedCount(response.data.completed || 0);
            } else {
                setScheduledCount(0);
                setCompletedCount(0);
            }
        } catch (error) {
            console.log('Error fetching booking count:', error);
        } finally {
            dispatch(hideLoader());
        }
    };

    const fetchCartCount = async () => {
        try {
            const response = await ApiService.get(ENDPOINTS.comparison_tests_packages_count);
            if (response?.status === 'success' && response?.data) {
                const { pathologyTestPackages = 0, pathologyTests = 0 } = response.data;
                setTestCount(pathologyTests);
                setPackageCount(pathologyTestPackages);
                setCartCount(pathologyTests + pathologyTestPackages);
            } else {
                setTestCount(0);
                setPackageCount(0);
                setCartCount(0);
            }
        } catch (error) {
            console.log('Error fetching cart count:', error);
        }
    };

    const renderAdItem = ({ item }) => (
       
        <LinearGradient
            colors={['#0097B2', '#0077b6']}
            style={styles.adSlide}
        >
            <View style={[styles.iconBox, styles.adIconBox]}>
                <MaterialCommunityIcons name={item.icon} size={30} color="#fff" />
            </View>
            <View style={{ marginLeft: 16, flex: 1 }}>
                <Text style={[styles.cardTitle, { color: COLORS.white }]}>{item.title}</Text>
                {/* MODIFICATION: Changed text color to be visible */}
                <Text style={[styles.cardSubtitle, { color: '#e0e0e0' }]}>{item.description}</Text>
            </View>
        </LinearGradient>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient
                colors={['#00b4db', '#E0F7FA', '#FFFFFF']}
                style={styles.gradientContainer}
            >
                <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
                
                <Header 
                    title="Test Bookings" 
                    onBackPress={() => navigation.goBack()}
                    style={{ backgroundColor: 'transparent' }}
                    titleStyle={{ color: COLORS.white }}
                    tintColor={COLORS.white}
                />

                {/* Ad Carousel */}
                <View style={{ marginTop: 15, height: 180 }}>
                    <FlatList
                        data={ads}
                        keyExtractor={(item) => item.id}
                        renderItem={renderAdItem}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onScroll={Animated.event(
                            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                            { useNativeDriver: false }
                        )}
                        scrollEventThrottle={16}
                        snapToInterval={width}
                        decelerationRate="fast"
                        contentContainerStyle={{ paddingHorizontal: 16 }}
                    />
                    <View style={styles.dotContainer}>
                        {ads.map((_, i) => {
                            const inputRange = [(i - 1) * (width - 32), i * (width - 32), (i + 1) * (width - 32)];
                            const dotOpacity = scrollX.interpolate({
                                inputRange,
                                outputRange: [0.3, 1, 0.3],
                                extrapolate: 'clamp',
                            });
                            const dotScale = scrollX.interpolate({
                                inputRange,
                                outputRange: [1, 1.5, 1],
                                extrapolate: 'clamp',
                            });
                            return (
                                <Animated.View
                                    key={i}
                                    style={[styles.dot, { opacity: dotOpacity, transform: [{ scale: dotScale }] }]}
                                />
                            );
                        })}
                    </View>
                </View>

                <ScrollView contentContainerStyle={styles.container}>
                    {/* Your cards and other content... */}
                     {/* Book Single Tests */}
                     <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('PathologyScreen')}>
                        <View style={styles.iconWrapper}>
                            <View style={styles.iconBox}>
                                <MaterialCommunityIcons name="flask-outline" size={28} color={COLORS.primary} />
                            </View>
                            {testCount > 0 && (
                                <View style={[styles.badgeOnIcon, { top: -3, right: -6, backgroundColor: '#2196f3' }]}>
                                    <Text style={styles.badgeText}>{testCount}</Text>
                                </View>
                            )}
                        </View>
                        <View style={styles.cardText}>
                            <Text style={styles.cardTitle}>Book Single Tests</Text>
                            <Text style={styles.cardSubtitle}>
                                Choose individual lab tests like blood, thyroid, sugar, and more.
                            </Text>
                        </View>
                    </TouchableOpacity>
                    {/* Book Test Packages */}
                    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('PathologyPackages')}>
                        <View style={styles.iconWrapper}>
                            <View style={styles.iconBox}>
                                <MaterialCommunityIcons name="package-variant-closed" size={28} color={COLORS.primary} />
                            </View>
                            {packageCount > 0 && (
                                <View style={[styles.badgeOnIcon, { top: -3, right: -6, backgroundColor: '#ff5722' }]}>
                                    <Text style={styles.badgeText}>{packageCount}</Text>
                                </View>
                            )}
                        </View>
                        <View style={styles.cardText}>
                            <Text style={styles.cardTitle}>Book Test Packages</Text>
                            <Text style={styles.cardSubtitle}>
                                Select from health checkup packages for complete wellness.
                            </Text>
                        </View>
                    </TouchableOpacity>
                    {/* Book Combined */}
                    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('CombinationPackages')}>
                        <View style={styles.iconWrapper}>
                            <View style={styles.iconBox}>
                                <MaterialCommunityIcons name="test-tube" size={28} color={COLORS.primary} />
                            </View>
                            {testCount > 0 && (
                                <View style={[styles.badgeOnIcon, { top: -3, right: -6, backgroundColor: '#2196f3' }]}>
                                    <Text style={styles.badgeText}>{testCount}</Text>
                                </View>
                            )}
                            {packageCount > 0 && (
                                <View style={[styles.badgeOnIcon, { top: 20, right: -6, backgroundColor: '#ff5722' }]}>
                                    <Text style={styles.badgeText}>{packageCount}</Text>
                                </View>
                            )}
                        </View>
                        <View style={styles.cardText}>
                            <Text style={styles.cardTitle}>Book Tests / Packages</Text>
                            <Text style={styles.cardSubtitle}>
                                Explore all available lab tests and health packages in one place.
                            </Text>
                        </View>
                    </TouchableOpacity>
                    {/* Legend */}
                    <View style={styles.legendRow}>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendCircle, { backgroundColor: '#2196f3' }]} />
                            <Text style={styles.legendLabel}>Tests</Text>
                        </View>
                        <View style={styles.legendItem}>
                            <View style={[styles.legendCircle, { backgroundColor: '#ff5722' }]} />
                            <Text style={styles.legendLabel}>Packages</Text>
                        </View>
                    </View>
                    {/* Check Your Bookings */}
                    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('BookingList')}>
                        <View style={styles.iconWrapper}>
                            <View style={styles.iconBox}>
                                <MaterialCommunityIcons name="clipboard-text" size={28} color={COLORS.primary} />
                            </View>
                            {scheduledCount > 0 && (
                                <View style={[styles.badgeOnIcon, { top: -3, right: -6, backgroundColor: '#f44336' }]}>
                                    <Text style={styles.badgeText}>{scheduledCount}</Text>
                                </View>
                            )}
                            {completedCount > 0 && (
                                <View style={[styles.badgeOnIcon, { top: 20, right: -6, backgroundColor: '#4caf50' }]}>
                                    <Text style={styles.badgeText}>{completedCount}</Text>
                                </View>
                            )}
                        </View>
                        <View style={styles.cardText}>
                            <Text style={styles.cardTitle}>Check Your Bookings</Text>
                            <Text style={styles.cardSubtitle}>
                                View all your lab test bookings including dates, details and reports.
                            </Text>
                        </View>
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
                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
};

export default TestBookingScreen;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    gradientContainer: {
        flex: 1,
     
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    container: {
        padding: 16,
        paddingBottom: 40,
    },
    adSlide: {
        width: width - 32,
        height: 140,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderRadius: 28,
        marginRight: 16,
        elevation: 8,
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
    },
    dotContainer: {
        flexDirection: 'row',
        alignSelf: 'center',
        marginTop: 12,
    },
    dot: {
        height: 10,
        width: 10,
        borderRadius: 5,
        backgroundColor: COLORS.white,
        marginHorizontal: 6,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#ffffff',
        borderRadius: 28,
        padding: 20,
        marginBottom: 20,
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 8,
    },
    iconBox: {
        width: 60,
        height: 60,
        borderRadius: 18,
        backgroundColor: '#e8f4fe',
        alignItems: 'center',
        justifyContent: 'center',
    },
    adIconBox: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    iconWrapper: {
        position: 'relative',
        width: 60,
        height: 60,
    },
    badgeOnIcon: {
        position: 'absolute',
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        paddingHorizontal: 5,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    badgeText: {
        color: '#fff',
        fontSize: 11,
        fontWeight: '600',
    },
    cardText: {
        marginLeft: 18,
        flex: 1,
        justifyContent: 'center',
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1e1e1e',
    },
    cardSubtitle: {
        fontSize: 14,
        color: '#666',
        marginTop: 6,
        lineHeight: 21,
    },
    legendRow: {
        flexDirection: 'row',
        marginTop: -10,
        marginBottom: 32,
        marginLeft: 4,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
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
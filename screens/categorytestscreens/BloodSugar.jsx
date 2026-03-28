import React, { useCallback, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '../../components/Header';
import { COLORS } from '../../constants';
import { useDispatch } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { ENDPOINTS } from '../../src/constants/Endpoints';
import ApiService from '../../src/api/ApiService';
import { hideLoader, showLoader } from '../../src/redux/slices/loaderSlice';
import Toast from 'react-native-simple-toast';
import LinearGradient from 'react-native-linear-gradient';

const BloodSugar = ({ navigation }) => {
    const dispatch = useDispatch();
    const [testData, setTestData] = useState([]);
    const [cartCount, setCartCount] = useState(0);

    const fetchBloodSugarTests = async () => {
        try {
            dispatch(showLoader());
            const response = await ApiService.get(ENDPOINTS.comparison_blood_sugar_tests);
            setTestData(response?.data || []);
        } catch (error) {
            console.log('Error fetching blood sugar tests:', error);
        } finally {
            dispatch(hideLoader());
        }
    };

    const fetchCartCount = async () => {
        try {
            const response = await ApiService.get(ENDPOINTS.get_cart_count, true);
            setCartCount(response?.data || 0);
        } catch (error) {
            console.log('Error fetching cart count:', error.message);
        }
    };

    const handleAddToCart = async (productId) => {
        try {
            dispatch(showLoader());
            const response = await ApiService.post(ENDPOINTS.add_to_cart, { productId }, true, false);
            if (response?.status === 'success') {
                Toast.show('Added to cart!');
                fetchCartCount();
            } else {
                Toast.show('Failed to add');
            }
        } catch (error) {
            Toast.show('Error adding to cart');
        } finally {
            dispatch(hideLoader());
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchBloodSugarTests();
            fetchCartCount();
        }, [])
    );

    const groupTestsByLabId = (tests) => {
        const grouped = {};
        tests.forEach((item) => {
            const labId = item?.pathologyId?._id;
            if (!grouped[labId]) {
                grouped[labId] = { labDetails: item?.pathologyId, tests: [] };
            }
            grouped[labId].tests.push(item);
        });
        return Object.values(grouped);
    };

    const groupedLabs = groupTestsByLabId(testData);

    return (
        <LinearGradient
            colors={['#fff', '#fff', '#fff']}
            style={{ flex: 1 }}
        >
            <SafeAreaView style={styles.safeArea}>
                <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

                <Header
                    title="Blood Sugar Tests"
                    titleStyle={{ color: '#4A148C' }}
                    showCart
                    cartCount={cartCount}
                    onBackPress={() => navigation.goBack()}
                    onCartPress={() => navigation.navigate('CartScreen')}
                    style={{ backgroundColor: 'transparent',marginTop:20 }}
                />

                <ScrollView contentContainerStyle={{ padding: 16 }}>
                    {groupedLabs.map(({ labDetails, tests }) => (
                        <View key={labDetails._id} style={styles.labCard}>
                            <Text style={styles.labName}>{labDetails.labName}</Text>
                            <Text style={styles.labDetail}>📧 {labDetails.email}</Text>
                            <Text style={styles.labDetail}>
                                📍 {labDetails.streetAddress}, {labDetails.city}, {labDetails.state} - {labDetails.postalCode}
                            </Text>

                            {tests.map((item) => (
                                <View key={item._id} style={styles.testCard}>
                                    <LinearGradient
                                        colors={['#F06292', '#6A1B9A']}
                                        style={styles.accentStrip}
                                    />

                                    <View style={styles.cardContent}>
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.testName}>
                                                <Icon name="flask-outline" size={16} color="#6A1B9A" /> {item.testDescription?.testName}
                                            </Text>

                                            {item.testDescription?.description && (
                                                <Text style={styles.testDescription}>
                                                    <Icon name="text" size={13} color="#6b7280" /> {item.testDescription.description}
                                                </Text>
                                            )}

                                            <View style={styles.priceRow}>
                                                {item.testDescription?.higherTestFee > item.testDescription?.testFee && (
                                                    <Text style={styles.cutPrice}>₹{item.testDescription?.higherTestFee}</Text>
                                                )}
                                                <Text style={styles.priceTagText}>₹{item.testDescription?.testFee}</Text>
                                                {item.testDescription?.higherTestFee > item.testDescription?.testFee && (
                                                    <Text style={styles.discountText}>
                                                        {Math.round(
                                                            ((item.testDescription.higherTestFee - item.testDescription.testFee) /
                                                                item.testDescription.higherTestFee) * 100
                                                        )}% OFF
                                                    </Text>
                                                )}
                                            </View>
                                        </View>

                                        <View style={styles.buttonColumn}>
                                            <TouchableOpacity
                                                style={styles.cartBtn}
                                                onPress={() => handleAddToCart(item._id)}
                                            >
                                                <Icon name="cart-plus" size={16} color="#6A1B9A" />
                                                <Text style={styles.cartText}>Add</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                style={styles.bookBtn}
                                                onPress={() =>
                                                    navigation.navigate('SingleTestSelectSlot', { testId: item._id })
                                                }
                                            >
                                                <Icon name="calendar-check" size={16} color="#fff" />
                                                <Text style={styles.bookText}>Book</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            ))}
                        </View>
                    ))}
                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
};

export default BloodSugar;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },

    labCard: {
        marginBottom: 24,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 14,
        elevation: 2,
    },
    labName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#6A1B9A',
        marginBottom: 6,
    },
    labDetail: {
        fontSize: 14,
        color: '#444',
        marginBottom: 2,
    },

    testCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 12,
        elevation: 2,
        marginTop: 14,
        overflow: 'hidden',
    },
    accentStrip: {
        width: 6,
    },
    cardContent: {
        flex: 1,
        padding: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    testName: {
        fontSize: 15,
        fontWeight: '700',
        color: '#6A1B9A',
        marginBottom: 4,
    },
    testDescription: {
        fontSize: 13,
        color: '#6b7280',
        marginBottom: 6,
    },

    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 4,
        backgroundColor: '#F3E5F5',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
        alignSelf: 'flex-start',
    },
    cutPrice: {
        fontSize: 13,
        color: '#9ca3af',
        textDecorationLine: 'line-through',
    },
    priceTagText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#6A1B9A',
    },
    discountText: {
        fontSize: 12,
        color: '#D81B60',
        fontWeight: '700',
        marginLeft: 6,
    },

    buttonColumn: {
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginLeft: 8,
    },
    cartBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3E5F5',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
        marginBottom: 8,
    },
    cartText: {
        color: '#6A1B9A',
        fontSize: 13,
        marginLeft: 6,
        fontWeight: '600',
    },
    bookBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#6A1B9A',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
    },
    bookText: {
        color: '#fff',
        fontSize: 13,
        marginLeft: 6,
        fontWeight: '600',
    },
});

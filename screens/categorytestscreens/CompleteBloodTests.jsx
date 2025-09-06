import React, { useCallback, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    Platform,
    StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../../constants';
import { useDispatch } from 'react-redux';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { ENDPOINTS } from '../../src/constants/Endpoints';
import ApiService from '../../src/api/ApiService';
import { hideLoader, showLoader } from '../../src/redux/slices/loaderSlice';
import Header from '../../components/Header';
import Toast from 'react-native-simple-toast';
import LinearGradient from 'react-native-linear-gradient';

const CompleteBloodTests = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const [testData, setTestData] = useState([]);
    const [cartCount, setCartCount] = useState(0);

    const fetchCompleteBloodTests = async () => {
        try {
            dispatch(showLoader());
            const response = await ApiService.get(ENDPOINTS.comparison_blood_tests);
            const allTests = response?.data || [];
            setTestData(allTests);
            dispatch(hideLoader());
        } catch (error) {
            console.log('Error fetching tests:', error);
            dispatch(hideLoader());
        }
    };

    const fetchCartCount = async () => {
        try {
            const response = await ApiService.get(ENDPOINTS.get_cart_count, true);
            const count = response?.data || 0;
            setCartCount(count);
        } catch (error) {
            console.log('Error fetching cart count:', error.message);
        }
    };

    const handleAddToCart = async (productId) => {
        try {
            dispatch(showLoader());
            const response = await ApiService.post(
                ENDPOINTS.add_to_cart,
                { productId },
                true,
                false
            );
            dispatch(hideLoader());
            if (response?.status === 'success') {
                Toast.show(response.message || 'Added to cart!');
                fetchCartCount();
            } else {
                Toast.show('Failed: ' + (response.message || 'Invalid response'));
            }
        } catch (error) {
            dispatch(hideLoader());
            console.log('Add to Cart Error:', error.response?.data || error.message);
            Toast.show('Error adding to cart. Please try again.');
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchCompleteBloodTests();
            fetchCartCount();
        }, [])
    );

    const groupTestsByLabId = (tests) => {
        const grouped = {};
        tests.forEach((item) => {
            const labId = item?.pathologyId?._id;
            if (!grouped[labId]) {
                grouped[labId] = {
                    labDetails: item?.pathologyId,
                    tests: [],
                };
            }
            grouped[labId].tests.push(item);
        });
        return Object.values(grouped);
    };

    const groupedLabs = groupTestsByLabId(testData);

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={['#00b4db', '#E0F7FA', '#FFFFFF']}
                style={{ flex: 1 }}
            >
                <Header
                    title="Complete Blood Tests"
                    showCart
                    cartCount={cartCount}
                    onBackPress={() => navigation.goBack()}
                    onCartPress={() => navigation.navigate('CartScreen')}
                    style={{ backgroundColor: 'transparent' }}
                />

                <ScrollView
                    contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
                    showsVerticalScrollIndicator={false}
                >
                    {groupedLabs.map(({ labDetails, tests }) => (
                        <LinearGradient
                            key={labDetails._id}
                            colors={['#F7FBFF', '#FFFFFF']}
                            style={styles.labCard}
                        >
                            <Text style={styles.labName}>{labDetails.labName}</Text>
                            <Text style={styles.labDetail}>📧 {labDetails.email}</Text>
                            <Text style={styles.labDetail}>
                                📍 {labDetails.streetAddress}, {labDetails.city}, {labDetails.state} - {labDetails.postalCode}
                            </Text>

                            {tests.map((item) => (
                                <LinearGradient
                                    key={item._id}
                                    colors={['#FFFFFF', '#F9FAFB']}
                                    style={styles.testCard}
                                >
                                    <View style={styles.accentStrip} />
                                    <View style={styles.cardContent}>
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.testName}>
                                                <Icon name="flask-outline" size={16} color={COLORS.primary} /> {item.testDescription?.testName}
                                            </Text>
                                            {item.testDescription?.description ? (
                                                <Text style={styles.testDescription}>
                                                    <Icon name="text" size={13} color="#6b7280" /> {item.testDescription.description}
                                                </Text>
                                            ) : null}
                                            <View style={styles.priceRow}>
                                                {item.testDescription?.higherTestFee > item.testDescription?.testFee && (
                                                    <Text style={styles.cutPrice}>
                                                        ₹{item.testDescription?.higherTestFee}
                                                    </Text>
                                                )}
                                                <Text style={styles.priceTagText}>
                                                    ₹{item.testDescription?.testFee}
                                                </Text>
                                                {item.testDescription?.higherTestFee > item.testDescription?.testFee && (
                                                    <Text style={styles.discountText}>
                                                        {Math.round(
                                                            ((item.testDescription?.higherTestFee - item.testDescription?.testFee) /
                                                                item.testDescription?.higherTestFee) * 100
                                                        )}% OFF
                                                    </Text>
                                                )}
                                            </View>
                                        </View>

                                        <View style={styles.buttonColumn}>
                                            <TouchableOpacity onPress={() => handleAddToCart(item._id)}>
                                                <LinearGradient
                                                    colors={['#E9F1FF', '#D4E2FF']}
                                                    style={styles.cartBtn}
                                                >
                                                    <Icon name="cart-plus" size={16} color={COLORS.primary} />
                                                    <Text style={styles.cartText}>Add</Text>
                                                </LinearGradient>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => navigation.navigate('SingleTestSelectSlot', { testId: item._id })}>
                                                <LinearGradient
                                                    colors={['#00b4db', '#0077b6']}
                                                    start={{ x: 0, y: 0 }}
                                                    end={{ x: 1, y: 1 }}
                                                    style={styles.bookBtn}
                                                >
                                                    <Icon name="calendar-check" size={16} color="#fff" />
                                                    <Text style={styles.bookText}>Book</Text>
                                                </LinearGradient>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </LinearGradient>
                            ))}
                        </LinearGradient>
                    ))}
                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
};

export default CompleteBloodTests;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    labCard: {
        marginBottom: 24,
        borderRadius: 12,
        padding: 14,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
    },
    labName: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.primary,
        marginBottom: 6,
    },
    labDetail: {
        fontSize: 14,
        color: '#333',
        marginBottom: 2,
    },
    testCard: {
        flexDirection: 'row',
        borderRadius: 12,
        elevation: 2,
        marginTop: 14,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 2,
        overflow: 'hidden',
    },
    accentStrip: {
        width: 6,
        backgroundColor: '#00b4db',
    },
    cardContent: {
        flex: 1,
        padding: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'transparent', 
    },
    testName: {
        fontSize: 15,
        fontWeight: '700',
        color: COLORS.primary,
        marginBottom: 4,
    },
    testDescription: {
        fontSize: 13,
        color: '#6b7280',
        marginTop: 2,
        marginBottom: 6,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 4,
        backgroundColor: '#e6f2ff',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
        alignSelf: 'flex-start',
    },
    discountText: {
        fontSize: 12,
        color: '#10b981',
        fontWeight: '700',
        marginLeft: 6,
    },
    priceTagText: {
        fontSize: 13,
        fontWeight: '600',
        color: COLORS.primary,
    },
    cutPrice: {
        fontSize: 13,
        color: '#9ca3af',
        textDecorationLine: 'line-through',
    },
    buttonColumn: {
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
    cartBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginBottom: 10, // Added space between buttons
        minWidth: 80, // Ensure buttons have a consistent width
    },
    cartText: {
        color: COLORS.primary,
        fontSize: 13,
        marginLeft: 6,
        fontWeight: '600',
    },
    bookBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        minWidth: 80, // Ensure buttons have a consistent width
    },
    bookText: {
        color: '#fff',
        fontSize: 13,
        marginLeft: 6,
        fontWeight: '600',
    },
});
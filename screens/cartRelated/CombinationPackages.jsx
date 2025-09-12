import React, { useCallback, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    ScrollView,
    TextInput,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Header from '../../components/Header';
import { COLORS } from '../../constants';
import ApiService from '../../src/api/ApiService';
import { ENDPOINTS } from '../../src/constants/Endpoints';
import { useDispatch } from 'react-redux';
import Toast from 'react-native-simple-toast';
import { showLoader, hideLoader } from '../../src/redux/slices/loaderSlice';
import LinearGradient from 'react-native-linear-gradient'; 

const ICON_COLOR = 'rgba(36, 107, 253, 1)';
const CIRCLE_BG = 'rgba(36, 107, 253, .12)';

const CombinedTestScreen = () => {
    const navigation = useNavigation();
    const [cartCount, setCartCount] = useState(0);
    const [labsData, setLabsData] = useState([]);
    const [filteredLabs, setFilteredLabs] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [cartRefreshKey, setCartRefreshKey] = useState(0);
    const dispatch = useDispatch();

    const fetchCartCount = async () => {
        try {
            const response = await ApiService.get(ENDPOINTS.get_cart_count, true);
            const count = response?.data || 0;
            setCartCount(count);
            setCartRefreshKey((prev) => prev + 1);
        } catch (error) {
            console.log('Cart count error:', error.message);
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
                Toast.show(response.message || 'Added to cart successfully!');
                fetchCartCount();
            } else {
                Toast.show('Failed: ' + (response.message || 'Invalid response'));
            }
        } catch (error) {
            dispatch(hideLoader());
            console.log('Add to Cart Error:', error.response?.data || error.message);
            Toast.show('Error adding to cart.');
        }
    };

    const fetchComparisonData = async () => {
        try {
            const response = await ApiService.get(ENDPOINTS.comparison_tests_packages, true);
            if (response?.status === 'success' && response?.data) {
                const testPackages = response.data?.pathologyTestPackages || [];
                const individualTests = response.data?.pathologyTests || [];

                const labsMap = new Map();

                individualTests.forEach((item) => {
                    const lab = item.pathologyId;
                    const labId = lab?._id;

                    if (!labsMap.has(labId)) {
                        labsMap.set(labId, {
                            labId,
                            labName: lab.labName,
                            address: lab.streetAddress,
                            city: lab.city,
                            pincode: lab.postalCode,
                            phone: lab.contactNumber,
                            timing: (lab.operatingHours || []).join(', '),
                            tests: [],
                        });
                    }

                    labsMap.get(labId).tests.push({
                        id: item._id,
                        name: (item.testName === 'Other' && item.testOtherName) ? item.testOtherName : item.testName || 'Unnamed Test',
                        description: item.testCategory || '',
                        price: `₹${item.testFee || 0}`,
                        originalPrice: item.higherTestFee ? `₹${item.higherTestFee}` : null,
                        tests: null,
                    });
                });

                testPackages.forEach((pkg) => {
                    const lab = pkg.pathologyId;
                    const labId = lab?._id;

                    if (!labsMap.has(labId)) {
                        labsMap.set(labId, {
                            labId,
                            labName: lab.labName,
                            address: lab.streetAddress,
                            city: lab.city,
                            pincode: lab.postalCode,
                            phone: lab.contactNumber,
                            timing: (lab.operatingHours || []).join(', '),
                            tests: [],
                        });
                    }

                    labsMap.get(labId).tests.push({
                        id: pkg._id,
                        name: pkg.packageName,
                        description: `Includes ${pkg.no_of_tests} tests`,
                        price: `₹${pkg.packageFee || 0}`,
                        originalPrice: pkg.packageHigherFee ? `₹${pkg.packageHigherFee}` : null,
                        tests: (pkg.tests_descriptions || []).map(
                            (t) =>
                                t.testDescription?.testOtherName ||
                                t.testDescription?.testName ||
                                'Test'
                        ),
                    });
                });

                const labsArray = Array.from(labsMap.values());
                setLabsData(labsArray);
                setFilteredLabs(labsArray);
            }
        } catch (error) {
            console.log('Comparison API error:', error.message);
        }
    };

    const filterLabs = async (query) => {
        setSearchQuery(query);

        if (!query) {
            setFilteredLabs(labsData);
            return;
        }

        try {
            dispatch(showLoader());
            const url = `${ENDPOINTS.search_test_package}?q=${encodeURIComponent(query)}`;
            console.log('Request URL:', url);

            const response = await ApiService.get(url, true);
            dispatch(hideLoader());

            console.log('Response:', JSON.stringify(response, null, 2));

            if (response?.status === 'success' && response?.data) {
                const testPackages = response.data?.packages || [];
                const individualTests = response.data?.tests || [];

                const labsMap = new Map();

                individualTests.forEach((item) => {
                    const lab = item.pathologyId;
                    const labId = lab?._id;

                    if (!labsMap.has(labId)) {
                        labsMap.set(labId, {
                            labId,
                            labName: lab.labName,
                            address: lab.streetAddress,
                            city: lab.city,
                            pincode: lab.postalCode,
                            phone: lab.contactNumber,
                            timing: (lab.operatingHours || []).join(', '),
                            tests: [],
                        });
                    }

                    labsMap.get(labId).tests.push({
                        id: item._id,
                        name: (item.testName === 'Other' && item.testOtherName) ? item.testOtherName : item.testName || 'Unnamed Test',
                        description: item.testCategory || '',
                        price: `₹${item.testFee || 0}`,
                        originalPrice: item.higherTestFee ? `₹${item.higherTestFee}` : null,
                        tests: null,
                    });
                });

                testPackages.forEach((pkg) => {
                    const lab = pkg.pathologyId;
                    const labId = lab?._id;

                    if (!labsMap.has(labId)) {
                        labsMap.set(labId, {
                            labId,
                            labName: lab.labName,
                            address: lab.streetAddress,
                            city: lab.city,
                            pincode: lab.postalCode,
                            phone: lab.contactNumber,
                            timing: (lab.operatingHours || []).join(', '),
                            tests: [],
                        });
                    }

                    labsMap.get(labId).tests.push({
                        id: pkg._id,
                        name: pkg.packageName,
                        description: `Includes ${pkg.no_of_tests} tests`,
                        price: `₹${pkg.packageFee || 0}`,
                        originalPrice: pkg.packageHigherFee ? `₹${pkg.packageHigherFee}` : null,
                        tests: (pkg.tests_descriptions || []).map(
                            (t) =>
                                t.testDescription?.testOtherName ||
                                t.testDescription?.testName ||
                                'Test'
                        ),
                    });
                });

                const labsArray = Array.from(labsMap.values());
                setFilteredLabs(labsArray);
            } else {
                setFilteredLabs([]);
                Toast.show('No matching tests or packages found.');
            }
        } catch (error) {
            dispatch(hideLoader());
            console.log('Search API error:', error.message);
            Toast.show('Failed to search. Please try again.');
        }
    };


    useFocusEffect(
        useCallback(() => {
            fetchCartCount();
            fetchComparisonData();
        }, [])
    );

    const renderCard = ({ item }) => {
        const isPackage = Array.isArray(item.tests) && item.tests.length > 0;

        return (
            <View style={styles.testCard}>
                <View style={styles.accentStrip} />
                <View style={styles.cardContent}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.testName}>
                            <MaterialCommunityIcons name="flask-outline" size={16} color={COLORS.primary} /> {item.name}
                        </Text>
                        <Text style={styles.testDescription}>
                            <MaterialCommunityIcons name="text" size={13} color="#6b7280" /> {item.description}
                        </Text>

                        {isPackage && (
                            <View style={styles.badgesContainer}>
                                {item.tests.map((test, index) => (
                                    <View key={index} style={styles.badge}>
                                        <View style={styles.iconCircle}>
                                            <MaterialCommunityIcons name="test-tube" size={14} color={ICON_COLOR} />
                                        </View>
                                        <Text style={styles.badgeText}>{test}</Text>
                                    </View>
                                ))}
                            </View>
                        )}

                        <View style={styles.priceRow}>
                            <Text style={styles.discountedPrice}>{item.price}</Text>
                            {item.originalPrice && (
                                <>
                                    <Text style={styles.cutPrice}>{item.originalPrice}</Text>
                                    <View style={styles.discountBadge}>
                                        <Text style={styles.discountText}>
                                            {`${Math.round(
                                                ((parseFloat(item.originalPrice?.replace(/[₹,]/g, '')) -
                                                    parseFloat(item.price?.replace(/[₹,]/g, ''))) /
                                                    parseFloat(item.originalPrice?.replace(/[₹,]/g, ''))) * 100
                                            )}% OFF`}
                                        </Text>
                                    </View>
                                </>
                            )}
                        </View>

                    </View>

                    <View style={styles.buttonColumn}>
                        <TouchableOpacity style={styles.cartBtn} onPress={() => handleAddToCart(item.id)}>
                            <MaterialCommunityIcons name="cart-plus" size={16} color={COLORS.primary} />
                            <Text style={styles.cartText}>Add</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.bookBtn}
                            onPress={() => {
                                navigation.navigate('SelectSlotDirectBook', {
                                    testType: isPackage ? 'package' : 'single',
                                    testId: isPackage ? undefined : item.id,
                                    packageId: isPackage ? item.id : undefined,
                                });
                            }}
                        >
                            <MaterialCommunityIcons name="calendar-check" size={16} color="#fff" />
                            <Text style={styles.bookText}>Book</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };

    return (
   
        <LinearGradient
            colors={['#00b4db', '#fff', '#fff']}
            style={{ flex: 1 }}
        >
            <SafeAreaView style={styles.container}>
          
                <StatusBar backgroundColor="transparent" barStyle="dark-content" translucent={true} />
                <Header
                    key={cartRefreshKey}
                    title="Tests & Packages"
                    showCart
                    cartCount={cartCount}
                    onBackPress={() => navigation.goBack()}
                    onCartPress={() => navigation.navigate('CartScreen')}
                />

                <View style={styles.searchWrapper}>
                    <MaterialCommunityIcons name="magnify" size={20} color={COLORS.primary} />
                    <TextInput
                        placeholder="Search test or package"
                        placeholderTextColor="#999"
                        value={searchQuery}
                        onChangeText={filterLabs}
                        style={styles.searchInput}
                    />
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                    {filteredLabs.map((lab, index) => (
                        <View key={lab.labId} style={{ marginBottom: 1, marginTop: index === 0 ? 16 : 0 }}>
                            <Text style={[styles.labTitle, { marginBottom: 5 }]}>{lab.labName}</Text>

                            <View style={styles.labAddressWrapper}>
                                <MaterialCommunityIcons name="map-marker" size={16} color={COLORS.primary} />
                                <Text style={styles.labAddressText}>
                                    {lab.address}, {lab.city} - {lab.pincode}
                                </Text>
                            </View>

                            <View style={styles.labAddressWrapper}>
                                <MaterialCommunityIcons name="clock-outline" size={16} color={COLORS.primary} />
                                <Text style={styles.labAddressText}>{lab.timing}</Text>
                            </View>

                            <FlatList
                                data={lab.tests}
                                renderItem={renderCard}
                                keyExtractor={(item) => item.id}
                                scrollEnabled={false}
                                contentContainerStyle={styles.list}
                            />
                        </View>
                    ))}
                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
};

export default CombinedTestScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent', 
        paddingTop: StatusBar.currentHeight,
    },
    searchWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        marginHorizontal: 16,
        marginTop: 12,
        marginBottom: 6,
        paddingHorizontal: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 2,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 8,
        fontSize: 14,
        color: '#333',
        marginLeft: 8,
    },
    list: {
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    labTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        paddingHorizontal: 16,
        color: COLORS.black,
    },
    labAddressWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        marginTop: 2,
        padding: 1,
        borderRadius: 8,
    },
    labAddressText: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.textDark || '#333',
        marginLeft: 8,
        flex: 1,
    },
    testCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 12,
        elevation: 2,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 2,
    },
    accentStrip: {
        width: 6,
        backgroundColor: COLORS.primary,
        borderTopLeftRadius: 12,
        borderBottomLeftRadius: 12,
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
        flexWrap: 'wrap',
    },
    discountedPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1f2937',
    },
    cutPrice: {
        fontSize: 14,
        color: '#9ca3af',
        textDecorationLine: 'line-through',
    },
    discountBadge: {
        backgroundColor: '#d1fae5',
        borderRadius: 6,
        paddingHorizontal: 6,
        paddingVertical: 2,
        marginLeft: 4,
    },
    discountText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#059669',
    },
    strikedPrice: {
        fontSize: 12,
        color: '#999',
        textDecorationLine: 'line-through',
    },
    buttonColumn: {
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginLeft: 8,
    },
    cartBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E3ECFF',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
        marginBottom: 6,
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
        backgroundColor: '#00b4db',
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
    badgesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 6,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffffaa',
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 4,
        marginRight: 8,
        marginTop: 6,
    },
    iconCircle: {
        backgroundColor: CIRCLE_BG,
        borderRadius: 12,
        padding: 4,
        marginRight: 6,
    },
    badgeText: {
        fontSize: 13,
        color: COLORS.textDark || '#333',
    },
});
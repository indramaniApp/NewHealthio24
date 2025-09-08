import React, { useCallback, useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    Platform,
    StatusBar,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '../../components/Header';
import { COLORS } from '../../constants';
import ApiService from '../../src/api/ApiService';
import { ENDPOINTS } from '../../src/constants/Endpoints';
import { useDispatch } from 'react-redux';
import { showLoader, hideLoader } from '../../src/redux/slices/loaderSlice';
import Toast from 'react-native-simple-toast';
import LinearGradient from 'react-native-linear-gradient'; 

const CartScreen = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [cartItems, setCartItems] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);

    useEffect(() => {
        fetchCartItems();
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchCartItems();
        }, [])
    );

    const fetchCartItems = async () => {
        try {
            dispatch(showLoader());
            const response = await ApiService.get(ENDPOINTS.get_cart);
            console.log('Cart API Response:', response);

            const items = response?.data?.items || [];
            const total = response?.data?.totalAmount || 0;

            const mapped = items.map((item) => ({
                productId: item?._id,
                name: item?.name || 'Test',
                fee: item?.price || 0,
                quantity: item?.quantity || 1,
                productRefId: item?.productId,
                description: item?.description || '',
            }));

            setCartItems(mapped);
            setTotalAmount(total);
            dispatch(hideLoader());
        } catch (error) {
            dispatch(hideLoader());
            Toast.show('Failed to load cart. Please try again.');
        }
    };

    const calculateTotal = (items) => {
        return items.reduce((acc, item) => acc + item.fee * item.quantity, 0);
    };

    const handleQuantityChange = async (productId, productRefId, delta) => {
        const item = cartItems.find((i) => i.productId === productId);
        if (!item) return;

        try {
            dispatch(showLoader());

            if (delta === 1) {
                await ApiService.post(ENDPOINTS.add_to_cart, { productId: productRefId }, true, false);
                Toast.show('Quantity increased');
            } else if (delta === -1) {
                await ApiService.post(ENDPOINTS.remove_from_cart, { productId: productRefId }, true, false);
                Toast.show(item.quantity === 1 ? 'Item removed from cart' : 'Quantity decreased');
            }

            dispatch(hideLoader());
        } catch (error) {
            dispatch(hideLoader());
            console.log('Cart API Error:', error.response?.data || error.message);
            Toast.show('Failed to update cart. Try again.');
            return;
        }

        const updatedItems = cartItems
            .map((i) => {
                if (i.productId === productId) {
                    const newQty = i.quantity + delta;
                    return newQty > 0 ? { ...i, quantity: newQty } : null;
                }
                return i;
            })
            .filter(Boolean);

        setCartItems(updatedItems);
        setTotalAmount(calculateTotal(updatedItems));
    };

    const handleBookTests = () => {
        if (cartItems.length === 0) {
            Toast.show('Cart is empty!');
            return;
        }
        navigation.navigate('SelectSlot', {
            totalAmount,
            selectedTests: cartItems,
        });
    };

 
    return (
        <LinearGradient
            colors={['#00b4db', '#fff', '#fff', '#fff']}
            style={{ flex: 1 }}
        >
            <SafeAreaView style={styles.container}>
                <Header
                    title="Your Test Cart"
                    titleStyle={{ color: COLORS.black }}
                    onBackPress={() => navigation.goBack()}
                    showCart={false}
                    style={{ backgroundColor: 'transparent', marginTop: 40 }} 
                />
                <View style={styles.content}>
                    {cartItems.length === 0 ? (
                        <Text style={styles.placeholder}>🛒 Your cart is empty.</Text>
                    ) : (
                        <ScrollView
                            style={styles.card}
                            contentContainerStyle={{ paddingBottom: 44 }}
                            showsVerticalScrollIndicator={false}
                        >
                            <View style={styles.totalContainer}>
                                <Text style={styles.totalText}>Total Amount:</Text>
                                <Text style={styles.totalPrice}>₹{totalAmount}</Text>
                            </View>

                            {cartItems.map((item, index) => (
                                <View key={item.productId} style={styles.itemCard}>
                                    <View style={styles.accentStrip} />
                                    <View style={styles.cardContent}>
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.testName}>
                                                <Icon name="flask-outline" size={16} color={COLORS.primary} /> {item.name}
                                            </Text>
                                            {item.description ? (
                                                <Text style={styles.testDescription}>
                                                    <Icon name="text" size={13} color="#6b7280" /> {item.description}
                                                </Text>
                                            ) : null}
                                            <View style={styles.priceTag}>
                                                <Text style={styles.priceTagText}>₹{item.fee} x {item.quantity}</Text>
                                            </View>
                                        </View>

                                        <View style={styles.quantityControl}>
                                            <TouchableOpacity
                                                onPress={() => handleQuantityChange(item.productId, item.productRefId, -1)}
                                                style={styles.qtyBtn}
                                            >
                                                <Icon name="minus" size={18} color={COLORS.primary} />
                                            </TouchableOpacity>
                                            <Text style={styles.qtyText}>{item.quantity}</Text>
                                            <TouchableOpacity
                                                onPress={() => handleQuantityChange(item.productId, item.productRefId, 1)}
                                                style={styles.qtyBtn}
                                            >
                                                <Icon name="plus" size={18} color={COLORS.primary} />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                 
                                    {index < cartItems.length - 1 && <View style={styles.separator} />}
                                </View>
                            ))}

                            <TouchableOpacity style={styles.bookBtn} onPress={handleBookTests}>
                                <Icon name="calendar-check" size={18} color="#fff" />
                                <Text style={styles.bookText}>Book Tests</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    )}
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
};

export default CartScreen;

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: 'transparent', 

    },
    content: {
        flex: 1,
        padding: 16,
    },
    placeholder: {
        fontSize: 16,
        color: COLORS.gray,
        textAlign: 'center',
        marginTop: 40,
    },
    card: {
        backgroundColor: '#FAFCFF',
        padding: 16,
        borderRadius: 12,
        elevation: 2,
    },
    totalContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    totalText: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.primary,
    },
    totalPrice: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.success,
    },
    itemCard: {
        marginBottom: 14,
        backgroundColor: '#fff',
        borderRadius: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 2,
        overflow: 'hidden', // to keep the accent strip contained
    },
    accentStrip: {
        width: 6,
        backgroundColor: COLORS.primary,
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
    },
    cardContent: {
        flex: 1,
        padding: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginLeft: 6, // space for the accent strip
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
    priceTag: {
        alignSelf: 'flex-start',
        backgroundColor: '#e6f2ff',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
    },
    priceTagText: {
        fontSize: 13,
        fontWeight: '600',
        color: COLORS.primary,
    },
    quantityControl: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 8,
    },
    qtyBtn: {
        padding: 4,
        borderWidth: 1,
        borderColor: COLORS.primary,
        borderRadius: 4,
    },
    qtyText: {
        marginHorizontal: 10,
        fontWeight: '600',
        fontSize: 16,
        color: COLORS.primary,
    },
    separator: {
        height: 1,
        backgroundColor: '#E0E0E0',
        marginVertical: 10,
        marginHorizontal: 12
    },
    bookBtn: {
        marginTop: 20,
        backgroundColor: COLORS.primary,
        paddingVertical: 12,
        borderRadius: 30,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    bookText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
        marginLeft: 6,
    },
});
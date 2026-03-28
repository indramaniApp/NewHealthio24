import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '../../components/Header';
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
      const res = await ApiService.get(ENDPOINTS.get_cart);

      const items = res?.data?.items || [];
      const total = res?.data?.totalAmount || 0;

      const mapped = items.map(item => ({
        productId: item?._id,
        name: item?.name || 'Test',
        fee: item?.price || 0,
        quantity: item?.quantity || 1,
        productRefId: item?.productId,
        description: item?.description || '',
      }));

      setCartItems(mapped);
      setTotalAmount(total);
    } catch {
      Toast.show('Failed to load cart');
    } finally {
      dispatch(hideLoader());
    }
  };

  const calculateTotal = items =>
    items.reduce((sum, i) => sum + i.fee * i.quantity, 0);

  const handleQuantityChange = async (productId, productRefId, delta) => {
    const item = cartItems.find(i => i.productId === productId);
    if (!item) return;

    try {
      dispatch(showLoader());
      if (delta === 1) {
        await ApiService.post(ENDPOINTS.add_to_cart, { productId: productRefId }, true, false);
      } else {
        await ApiService.post(ENDPOINTS.remove_from_cart, { productId: productRefId }, true, false);
      }
    } catch {
      Toast.show('Update failed');
      return;
    } finally {
      dispatch(hideLoader());
    }

    const updated = cartItems
      .map(i =>
        i.productId === productId
          ? { ...i, quantity: i.quantity + delta }
          : i
      )
      .filter(i => i.quantity > 0);

    setCartItems(updated);
    setTotalAmount(calculateTotal(updated));
  };

  const handleBookTests = () => {
    if (!cartItems.length) {
      Toast.show('Cart is empty');
      return;
    }
    navigation.navigate('SelectSlot', {
      totalAmount,
      selectedTests: cartItems,
    });
  };

  return (
    <LinearGradient colors={['#fff', '#fff', '#fff']} style={{ flex: 1 }}>
      <SafeAreaView style={styles.safe}>
        <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

        <Header
          title="Your Test Cart"
          onBackPress={() => navigation.goBack()}
          showCart={false}
          style={{ backgroundColor: 'transparent' }}
          titleStyle={{ color: '#4A148C' }}
        />

        <View style={styles.container}>
          {cartItems.length === 0 ? (
            <Text style={styles.empty}>🛒 Your cart is empty</Text>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              {cartItems.map(item => {
                const itemTotal = item.fee * item.quantity;

                return (
                  <View key={item.productId} style={styles.card}>
                    <LinearGradient
                      colors={['#F06292', '#6A1B9A']}
                      style={styles.strip}
                    />

                    <View style={styles.cardContent}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.name}>
                          <Icon name="flask-outline" size={16} /> {item.name}
                        </Text>

                        {!!item.description && (
                          <Text style={styles.desc}>{item.description}</Text>
                        )}

                        <Text style={styles.price}>₹{item.fee} / test</Text>

                        <Text style={styles.itemTotal}>
                          Item Total: ₹{itemTotal}
                        </Text>
                      </View>

                      <View style={styles.qtyWrap}>
                        <TouchableOpacity
                          style={styles.qtyBtn}
                          onPress={() =>
                            handleQuantityChange(item.productId, item.productRefId, -1)
                          }
                        >
                          <Icon name="minus" size={18} color="#6A1B9A" />
                        </TouchableOpacity>

                        <Text style={styles.qty}>{item.quantity}</Text>

                        <TouchableOpacity
                          style={styles.qtyBtn}
                          onPress={() =>
                            handleQuantityChange(item.productId, item.productRefId, 1)
                          }
                        >
                          <Icon name="plus" size={18} color="#6A1B9A" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                );
              })}

              {/* FOOTER TOTAL */}
              <View style={styles.footer}>
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Total Amount</Text>
                  <Text style={styles.totalValue}>₹{totalAmount}</Text>
                </View>

                <TouchableOpacity onPress={handleBookTests}>
                  <LinearGradient
                    colors={['#F06292', '#6A1B9A']}
                    style={styles.bookBtn}
                  >
                    <Icon name="calendar-check" size={18} color="#fff" />
                    <Text style={styles.bookText}>Book Tests</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: { flex: 1, padding: 16 },

  empty: {
    marginTop: 40,
    textAlign: 'center',
    fontSize: 16,
    color: '#6B7280',
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 14,
    overflow: 'hidden',
    elevation: 2,
  },
  strip: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 6,
  },
  cardContent: {
    flexDirection: 'row',
    padding: 14,
    marginLeft: 6,
  },

  name: {
    fontSize: 15,
    fontWeight: '700',
    color: '#6A1B9A',
  },
  desc: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 4,
  },
  price: {
    fontSize: 13,
    color: '#374151',
    marginTop: 6,
  },
  itemTotal: {
    marginTop: 6,
    fontWeight: '700',
    color: '#4A148C',
  },

  qtyWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  qtyBtn: {
    borderWidth: 1,
    borderColor: '#6A1B9A',
    borderRadius: 4,
    padding: 4,
  },
  qty: {
    marginVertical: 6,
    fontWeight: '700',
    color: '#6A1B9A',
  },

  footer: {
    marginTop: 10,
    marginBottom: 30,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4A148C',
  },

  bookBtn: {
    borderRadius: 30,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: '600',
    fontSize: 15,
  },
});

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
import Header from '../../components/Header';
import { COLORS } from '../../constants';
import { useDispatch } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { ENDPOINTS } from '../../src/constants/Endpoints';
import ApiService from '../../src/api/ApiService';
import { hideLoader, showLoader } from '../../src/redux/slices/loaderSlice';
import Toast from 'react-native-simple-toast';
// 1. LinearGradient component ko import karein
import LinearGradient from 'react-native-linear-gradient';

const OtherTests = ({ navigation }) => {
  const dispatch = useDispatch();
  const [testData, setTestData] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  const fetchOtherTests = async () => {
    try {
      dispatch(showLoader());
      const response = await ApiService.get(ENDPOINTS.comparison_other_tests);
      setTestData(response?.data || []);
    } catch (error) {
      console.log('Error fetching other tests:', error);
    } finally {
      dispatch(hideLoader());
    }
  };

  const fetchCartCount = async () => {
    try {
      const res = await ApiService.get(ENDPOINTS.get_cart_count, true);
      setCartCount(res?.data || 0);
    } catch (err) {
      console.log('Cart count error:', err.message);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      dispatch(showLoader());
      const payload = { productId };
      const response = await ApiService.post(ENDPOINTS.add_to_cart, payload, true, false);
      dispatch(hideLoader());

      if (response?.status === 'success') {
        Toast.show(response.message || 'Added to cart');
        fetchCartCount();
      } else {
        Toast.show(response?.message || 'Failed to add');
      }
    } catch (error) {
      dispatch(hideLoader());
      console.log('Add to cart error:', error.message);
      Toast.show('Error adding to cart');
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchOtherTests();
      fetchCartCount();
    }, [])
  );

  const groupTestsByLab = (tests) => {
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

  const groupedData = groupTestsByLab(testData);

  return (
    // 2. Screen ke background ke liye LinearGradient use karein
    <LinearGradient colors={['#00b4db', '#FFFFFF', "#ffff"]} style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <Header
          title="Other Tests"
          onBackPress={() => navigation.goBack()}
          showCart
          cartCount={cartCount}
          onCartPress={() => navigation.navigate('CartScreen')}
          style={{ marginTop: 40 }} // Extra margin for better look
        />
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          {groupedData.map(({ labDetails, tests }) => (
            <LinearGradient
              key={labDetails?._id || Math.random()}
              colors={['#FFFFFF', '#FAFCFF']} // Lab card ke liye gradient
              style={styles.labCard}
            >
              <Text style={styles.labHeader}>{labDetails?.labName || 'Unknown Lab'}</Text>
              {labDetails?.email && <Text style={styles.labDetail}>📧 {labDetails.email}</Text>}
              {labDetails?.streetAddress && (
                <Text style={styles.labDetail}>
                  📍 {labDetails.streetAddress}, {labDetails.city}, {labDetails.state} - {labDetails.postalCode}
                </Text>
              )}

              {tests.map((item) => (
                <View key={item._id} style={styles.testCard}>
                  <View style={styles.accentStrip} />
                  <View style={styles.cardContent}>
                    <View style={{ flex: 1 }}>
                      {item.testDescription?.testName === 'Other' ? (
                        <Text style={styles.testName}>
                          <Icon name="test-tube" size={16} color={COLORS.primary} />{' '}
                          {item.testDescription?.testOtherName || 'N/A'}
                        </Text>
                      ) : (
                        <Text style={styles.testName}>
                          <Icon name="test-tube" size={16} color={COLORS.primary} />{' '}
                          {item.testDescription?.testName || 'Unnamed Test'}
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
                              ((item.testDescription?.higherTestFee - item.testDescription?.testFee) /
                                item.testDescription?.higherTestFee) *
                              100
                            )}
                            % OFF
                          </Text>
                        )}
                      </View>
                    </View>

                    <View style={styles.buttonColumn}>
                      <TouchableOpacity
                        style={styles.cartBtn}
                        onPress={() => handleAddToCart(item._id)}
                      >
                        <Icon name="cart-plus" size={16} color={COLORS.primary} />
                        <Text style={styles.cartText}>Add</Text>
                      </TouchableOpacity>
                      {/* 3. Book button ko gradient button se replace karein */}
                      <TouchableOpacity
                        onPress={() => navigation.navigate('SingleTestSelectSlot', {
                          testId: item._id,
                        })}
                      >
                        <LinearGradient
                          colors={['#0077b6', '#00b4db']}
                          style={styles.bookBtn}
                        >
                          <Icon name="calendar-check" size={16} color="#fff" />
                          <Text style={styles.bookText}>Book</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </LinearGradient>
          ))}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default OtherTests;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    // Background color yahan se hata diya hai
  },
  labCard: {
    marginBottom: 24,
    borderRadius: 12,
    padding: 14,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    // Background color yahan se hata diya hai
  },
  labHeader: {
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
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
    marginTop: 14,
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
  priceTagText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
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
  cutPrice: {
    fontSize: 13,
    color: '#9ca3af',
    textDecorationLine: 'line-through',
  },
  discountText: {
    fontSize: 12,
    color: '#10b981',
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
    backgroundColor: '#E3ECFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 8,
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
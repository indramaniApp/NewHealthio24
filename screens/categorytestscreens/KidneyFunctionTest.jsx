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

const KidneyFunctionTest = ({ navigation }) => {
  const dispatch = useDispatch();
  const [testData, setTestData] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  const fetchKidneyTests = async () => {
    try {
      dispatch(showLoader());
      const response = await ApiService.get(ENDPOINTS.comparison_kidney_tests);
      setTestData(response?.data || []);
      dispatch(hideLoader());
    } catch (error) {
      console.log('Error fetching kidney tests:', error);
      dispatch(hideLoader());
    }
  };

  const fetchCartCount = async () => {
    try {
      const response = await ApiService.get(ENDPOINTS.get_cart_count, true);
      setCartCount(response?.data || 0);
    } catch (error) {
      console.log('Cart count error:', error.message);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      dispatch(showLoader());
      const payload = { productId };
      const response = await ApiService.post(
        ENDPOINTS.add_to_cart,
        payload,
        true,
        false
      );
      dispatch(hideLoader());

      if (response?.status === 'success') {
        Toast.show(response.message || 'Added to cart!');
        fetchCartCount();
      } else {
        Toast.show('Failed: ' + (response.message || 'Try again'));
      }
    } catch (error) {
      dispatch(hideLoader());
      console.log('Add to Cart Error:', error.response?.data || error.message);
      Toast.show('Error adding to cart');
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchKidneyTests();
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
      <Header
        title="Kidney Function Test"
        showCart
        cartCount={cartCount}
        onBackPress={() => navigation.goBack()}
        onCartPress={() => navigation.navigate('CartScreen')}
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

                    {/* 💸 Discounted price row */}
                    <View style={styles.priceRow}>
                      {item.testDescription?.higherTestFee > item.testDescription?.testFee && (
                        <Text style={styles.cutPrice}>₹{item.testDescription?.higherTestFee}</Text>
                      )}
                      <Text style={styles.priceTagText}>₹{item.testDescription?.testFee}</Text>
                      {item.testDescription?.higherTestFee > item.testDescription?.testFee && (
                        <Text style={styles.discountText}>
                          {Math.round(
                            ((item.testDescription?.higherTestFee - item.testDescription?.testFee) /
                              item.testDescription?.higherTestFee) * 100
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
                    <TouchableOpacity style={styles.bookBtn}
                        onPress={() => navigation.navigate('SingleTestSelectSlot', {
                          testId: item._id,
                        })}
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
  );
};

export default KidneyFunctionTest;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  labCard: {
    marginBottom: 24,
    backgroundColor: '#FAFCFF',
    borderRadius: 12,
    padding: 14,
    elevation: 2,
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
  testDescription: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
    marginBottom: 6,
  },

  // 🆕 New styles for price section
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
  priceTagText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
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
    backgroundColor: COLORS.primary,
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

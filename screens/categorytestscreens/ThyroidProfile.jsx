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
import LinearGradient from 'react-native-linear-gradient'; // Step 1: Import LinearGradient

const ThyroidProfile = ({ navigation }) => {
  const dispatch = useDispatch();
  const [testData, setTestData] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  const fetchThyroidTests = async () => {
    try {
      dispatch(showLoader());
      const response = await ApiService.get(ENDPOINTS.comparison_thyroid_tests);
      setTestData(response?.data || []);
      dispatch(hideLoader());
    } catch (error) {
      console.log('Error fetching thyroid tests:', error);
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
      fetchThyroidTests();
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
 
    <LinearGradient colors={['#00b4db', '#FFFFFF','#fff','#fff']} style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <Header
          title="Thyroid Profile Tests"
          showCart
          cartCount={cartCount}
          onBackPress={() => navigation.goBack()}
          onCartPress={() => navigation.navigate('CartScreen')}
    style={{marginTop:40}}
        />

        <ScrollView contentContainerStyle={{ padding: 16 }}>
          {groupedLabs.map(({ labDetails, tests }) => (
         
            <LinearGradient
                key={labDetails._id}
                colors={['#FFFFFF', '#F7FBFF']}
                style={styles.labCard}
            >
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
                        <Icon name="flask-outline" size={16} color={COLORS.primary} />{' '}
                        {item.testDescription?.testName}
                      </Text>

                      {item.testDescription?.description ? (
                        <Text style={styles.testDescription}>
                          <Icon name="text" size={13} color="#6b7280" />{' '}
                          {item.testDescription.description}
                        </Text>
                      ) : null}

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
                      
                      {/* Step 4: Add LinearGradient to the Book button */}
                      <TouchableOpacity
                        onPress={() => navigation.navigate('SingleTestSelectSlot', {
                          testId: item._id,
                        })}
                      >
                        <LinearGradient
                            colors={[COLORS.primary, '#005B8E']} // Example gradient
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

export default ThyroidProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent', // Make sure container is transparent for gradient to show
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  labCard: {
    marginBottom: 24,
    borderRadius: 12,
    padding: 14,
    elevation: 3, // Slightly increased elevation
    shadowColor: '#000',
    shadowOpacity: 0.1,
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
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
    marginTop: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    overflow: 'hidden', // Ensures accent strip corners are rounded
  },
  accentStrip: {
    width: 6,
    backgroundColor: COLORS.primary,
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
    // backgroundColor removed to allow gradient to show
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
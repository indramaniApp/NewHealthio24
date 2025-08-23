import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import Header from '../components/Header';
import { COLORS } from '../constants';
import { ENDPOINTS } from '../src/constants/Endpoints';
import ApiService from '../src/api/ApiService';
import { hideLoader, showLoader } from '../src/redux/slices/loaderSlice';
import Toast from 'react-native-simple-toast';
import { useTheme } from '../theme/ThemeProvider';

const ICON_COLOR = 'rgba(36, 107, 253, 1)';
const CIRCLE_BG = 'rgba(36, 107, 253, .12)';
const CARD_BG_LIGHT = 'rgba(36, 107, 253, .08)';
const CARD_BG_DARK = 'rgba(36, 107, 253, .18)';

const PathologyPackagesScreen = ({ navigation }) => {
  const { dark, colors } = useTheme();
  const [search, setSearch] = useState('');
  const [packagesData, setPackagesData] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const dispatch = useDispatch();

  const fetchPackages = async () => {
    try {
      dispatch(showLoader());
      const response = await ApiService.get(ENDPOINTS.comparison_packages);
      setPackagesData(response?.data || []);
    } catch (error) {
      console.log('Error fetching packages:', error);
    } finally {
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

  const handleAddToCart = async (packageId) => {
    try {
      dispatch(showLoader());
      const payload = { productId: packageId };
      const response = await ApiService.post(
        ENDPOINTS.add_to_cart,
        payload,
        true,
        false
      );
      dispatch(hideLoader());

      if (response?.status === 'success') {
        Toast.show(response.message || 'Package added to cart!');
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
      fetchPackages();
      fetchCartCount();
    }, [])
  );

  const filteredData = packagesData.filter((item) =>
    item.packageName?.toLowerCase()?.includes(search.toLowerCase()) ||
    item.pathology_name?.toLowerCase()?.includes(search.toLowerCase())
  );

  const renderItem = ({ item }) => {
    const lab = item.pathologyId;

    return (
      <View style={[styles.card, { backgroundColor: dark ? CARD_BG_DARK : CARD_BG_LIGHT }]}>
        <View style={styles.cardTopRow}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.labName, { color: colors.text }]}>{lab.labName}</Text>

            <View style={[styles.labDetailsCard, {  backgroundColor: '#fff', borderColor: colors.border }]}>
              <View style={styles.labDetailRow}>
                <MaterialCommunityIcons name="email-outline" size={16} color={ICON_COLOR} />
                <Text style={[styles.labDetailText, { color: colors.text }]}>{lab.email}</Text>
              </View>
              <View style={styles.labDetailRow}>
                <MaterialCommunityIcons name="map-marker" size={16} color={ICON_COLOR} />
                <Text style={[styles.labDetailText, { color: colors.text }]}>
                  {lab.streetAddress}, {lab.city}, {lab.state} - {lab.postalCode}
                </Text>
              </View>
            </View>

            <Text style={[styles.packageName, { color: colors.text }]}>{item.packageName}</Text>
            <Text style={[styles.testCount, { color: COLORS.primary }]}>{item.no_of_tests} Tests</Text>
          </View>

          <TouchableOpacity style={styles.detailsIcon}>
            <MaterialCommunityIcons name="eye-outline" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.badgesContainer}>
          {(item.tests_descriptions || []).map((test, index) => (
            <View key={index} style={styles.badge}>
              <View style={styles.iconCircle}>
                <MaterialCommunityIcons name="test-tube" size={14} color={ICON_COLOR} />
              </View>
              <Text style={[styles.badgeText, { color: colors.text }]}>
                {test.testDescription?.testName === 'Other'
                  ? test.testDescription?.testOtherName
                  : test.testDescription?.testName}
              </Text>
            </View>
          ))}
        </View>
        <View style={styles.priceRow}>
  {item.packageHigherFee > item.packageFee && (
    <Text style={styles.cutPrice}>₹{item.packageHigherFee}</Text>
  )}
  <Text style={[styles.priceTagText, { color: colors.text }]}>₹{item.packageFee}</Text>
  {item.packageHigherFee > item.packageFee && (
    <Text style={styles.discountText}>
      {Math.round(
        ((item.packageHigherFee - item.packageFee) / item.packageHigherFee) * 100
      )}% OFF
    </Text>
  )}
</View>


        <View style={styles.buttonRow}>
          <TouchableOpacity
            onPress={() => handleAddToCart(item._id)}
            style={styles.viewButton}
          >
            <Text style={styles.viewButtonText}>Add to Cart</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('PackagesTestSelectSlot', {
              packageId: item._id,})}
            style={[styles.viewButton, styles.bookButton]}
          >
            <Text style={styles.viewButtonText}>Book Package</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Header
        title="Packages List"
        onBackPress={() => navigation.goBack()}
        showCart
        cartCount={cartCount}
        onCartPress={() => navigation.navigate('CartScreen')}
      />

      <View
        style={[
          styles.searchBarContainer,
          {
            backgroundColor: dark ? '#1E293B' : '#F3F4F6',
            shadowColor: dark ? '#000' : '#999',
          },
        ]}
      >
        <MaterialCommunityIcons
          name="magnify"
          size={24}
          color={dark ? '#93C5FD' : '#3B82F6'}
          style={{ marginLeft: 12 }}
        />
        <TextInput
          style={[styles.searchInput, { color: colors.text, paddingVertical: 10 }]}
          placeholder="Search packages or lab name..."
          value={search}
          onChangeText={setSearch}
          placeholderTextColor={dark ? '#9CA3AF' : '#6B7280'}
        />
      </View>

      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={(item) => item._id?.toString()}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default PathologyPackagesScreen;

const styles = StyleSheet.create({
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 35,
    paddingHorizontal: 16,
    height: 50,
    
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    fontWeight: '600',
    borderWidth: 0,
  },

  card: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  detailsIcon: {
    backgroundColor: '#fff',
    padding: 6,
    borderRadius: 20,
  },
  labName: {
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.3,
    marginBottom: 6,
    textTransform: 'capitalize',
  },
  labDetailsCard: {
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    borderWidth: 0.5,
  },
  labDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  labDetailText: {
    fontSize: 13,
    marginLeft: 8,
    flex: 1,
    flexWrap: 'wrap',
  },
  packageName: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  testCount: {
    fontSize: 14,
    marginTop: 2,
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffffaa',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  iconCircle: {
    backgroundColor: CIRCLE_BG,
    borderRadius: 12,
    padding: 4,
    marginRight: 6,
  },
  badgeText: {
    fontSize: 13,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  cutPrice: {
    fontSize: 14,
    color: 'gray',
    textDecorationLine: 'line-through',
  },
  discountText: {
    fontSize: 13,
    color: '#10b981',
    fontWeight: '700',
  },
  priceTagText: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    gap: 10,
  },
  viewButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  bookButton: {
    backgroundColor: '#1a73e8',
  },
  viewButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  cutFeeText: {
    fontSize: 14,
    color: 'gray',
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
});

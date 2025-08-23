import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  SafeAreaView,
  Platform,
  StatusBar,
  TextInput,
} from 'react-native';
import { useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useFocusEffect } from '@react-navigation/native';




import Header from '../../components/Header';
import ApiService from '../../src/api/ApiService';
import { hideLoader, showLoader } from '../../src/redux/slices/loaderSlice';
import { ENDPOINTS } from '../../src/constants/Endpoints';
import { COLORS, SIZES } from '../../constants';

const { width } = Dimensions.get('window');

const UpcomingCenters = ({ navigation }) => {
  const dispatch = useDispatch();

  const [dialysisUnits, setDialysisUnits] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchDialysisUnits = async () => {
    try {
      dispatch(showLoader());
      const response = await ApiService.get(ENDPOINTS.patient_get_dialysises);
      console.log('Dialysis data:==========', response.data);
      setDialysisUnits(response.data);
    } catch (error) {
      console.log('Error fetching dialysis data:', error);
    } finally {
      dispatch(hideLoader());
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchDialysisUnits();
    }, [])
  );

  const filteredData = dialysisUnits.filter((item) => {
    const q = searchQuery.toLowerCase();
    return (
      item.dialysisUnitName?.toLowerCase().includes(q) ||
      item.city?.toLowerCase().includes(q) ||
      item.state?.toLowerCase().includes(q) ||
      item.dialysisUnitType?.toLowerCase().includes(q)
    );
  });

  const renderCard = ({ item }) => {
    const validImage =
      Array.isArray(item.dialysisUnitPhoto) &&
      item.dialysisUnitPhoto.length > 0 &&
      (item.dialysisUnitPhoto[0].startsWith('http://') || item.dialysisUnitPhoto[0].startsWith('https://'));

    const imageSource = validImage
      ? { uri: item.dialysisUnitPhoto[0] }
      : require('../../assets/lab.jpg');

    return (
      <View style={styles.card}>
        <View style={styles.imageWrapper}>
          <Image source={imageSource} style={styles.image} resizeMode="cover" />
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.unitName} numberOfLines={1}>
            {item.dialysisUnitName}
          </Text>

          <View style={styles.infoRow}>
            <Icon name="id-card" size={14} color={COLORS.primary} style={styles.icon} />
            <Text style={styles.detail}>
              Reg No: {item.registrationNumber || 'N/A'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Icon name="hospital" size={14} color={COLORS.primary} style={styles.icon} />
            <Text style={styles.detail}>
              Type: {item.dialysisUnitType || 'N/A'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Icon name="vial" size={14} color={COLORS.primary} style={styles.icon} />
            <Text style={styles.detail}>
              Dialysis: {Array.isArray(item.dialysisTypesProvided) ? item.dialysisTypesProvided.join(', ') : 'N/A'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Icon name="map-marker-alt" size={14} color={COLORS.primary} style={styles.icon} />
            <Text style={styles.detail}>
              {item.city}, {item.state}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Icon name="calendar" size={14} color={COLORS.primary} style={styles.icon} />
            <Text style={styles.detail}>
              Since {item.dateOfEstablishment}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.bookButton}
            onPress={() => navigation.navigate('DialysisSelectSlot', { unitId: item._id })}
          >
            <Text style={styles.bookButtonText}>Book Dialysis</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: COLORS.white }]}>
      <Header title="Dialysis Units" onBackPress={() => navigation.goBack()} />

      <View
        style={[
          styles.searchBarWrapper,
          {
            backgroundColor: '#f0f0f0',
            shadowColor: '#ccc',
          },
        ]}
      >
        <Icon
          name="search"
          size={16}
          color={COLORS.gray}
          style={styles.searchIcon}
        />
        <TextInput
          placeholder="Search by name, city, or type"
          placeholderTextColor="#999"
          style={[styles.searchInput, { color: COLORS.black }]}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.container}>
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item._id}
          renderItem={renderCard}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={<View style={{ height: 40 }} />}
          ListEmptyComponent={
            <Text style={{ textAlign: 'center', marginTop: 20, color: '#000' }}>
              No dialysis units found.
            </Text>
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default UpcomingCenters;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  searchBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SIZES.padding,
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 10 : 6,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
    padding: 6,
    backgroundColor: '#e6e6e6',
    borderRadius: 20,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 0,
    fontFamily: 'Urbanist-Regular',
  },
  container: {
    flex: 1,
    paddingHorizontal: SIZES.padding,
  },
  list: {
    paddingBottom: 20,
    alignItems: 'center',
  },
  card: {
    width: width * 0.92,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    marginBottom: 20,
    paddingBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
    overflow: 'hidden',
  },
  imageWrapper: {
    width: '100%',
    height: 150,
    overflow: 'hidden',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  unitName: {
    fontSize: 20,
    fontFamily: 'Urbanist-Bold',
    color: COLORS.primary,
    marginBottom: 6,
  },
  detailsContainer: {
    paddingHorizontal: 14,
    paddingTop: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  icon: {
    marginRight: 6,
  },
  detail: {
    fontSize: 14,
    fontFamily: 'Urbanist-Regular',
    color: COLORS.grayscale700,
    flexShrink: 1,
  },
  bookButton: {
    marginTop: 14,
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  bookButtonText: {
    color: COLORS.white,
    fontFamily: 'Urbanist-SemiBold',
    fontSize: 15,
    letterSpacing: 0.3,
  },
});

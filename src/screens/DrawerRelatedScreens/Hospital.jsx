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
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import { COLORS, SIZES } from '../../../constants/theme';
import defaultHospitalImage from '../../../assets/hospital.png';
import Header from '../../../components/Header';
import { hideLoader, showLoader } from '../../redux/slices/loaderSlice';
import ApiService from '../../api/ApiService';
import { ENDPOINTS } from '../../constants/Endpoints';
import { useTheme } from '../../../theme/ThemeProvider';

const { width } = Dimensions.get('window');

const Hospital = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { dark } = useTheme();

  const [hospitals, setHospitals] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchHospitals = async () => {
    try {
      dispatch(showLoader());
      const response = await ApiService.get(ENDPOINTS.patient_get_hospitals);
      setHospitals(response.data);
    } catch (error) {
      console.log('Error fetching hospitals:', error);
    } finally {
      dispatch(hideLoader());
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchHospitals();
    }, [])
  );

  const filteredHospitals = hospitals.filter((hospital) =>
    hospital.hospitalName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCardPress = (hospitalData) => {
    navigation.navigate('HospitalDetailScreen', {
      hospitalId: hospitalData._id,
      hospitalData: hospitalData,
    });
  };

  const renderHospitalCard = ({ item }) => {
    const validUrl =
      typeof item.hospitalExteriorPhoto === 'string' &&
      item.hospitalExteriorPhoto.length > 5 &&
      (item.hospitalExteriorPhoto.startsWith('http://') || item.hospitalExteriorPhoto.startsWith('https://'));

    const imageSource = validUrl ? { uri: item.hospitalExteriorPhoto } : defaultHospitalImage;

    return (
      <TouchableOpacity style={styles.card} onPress={() => handleCardPress(item)}>
        <Image source={imageSource} style={styles.image} resizeMode="cover" />
        <View style={styles.infoContainer}>
          <Text style={styles.hospitalName} numberOfLines={1}>{item.hospitalName}</Text>

          <View style={styles.row}>
            <Icon name="id-card" size={16} color={COLORS.primary} style={styles.icon} />
            <Text style={styles.detail}>Reg No: {item.registrationNumber || 'N/A'}</Text>
          </View>

          <View style={styles.row}>
            <Icon name="building" size={16} color={COLORS.primary} style={styles.icon} />
            <Text style={styles.detail}>
              Type: {Array.isArray(item.hospitalType) ? item.hospitalType.join(', ') : item.hospitalType || 'N/A'}
            </Text>
          </View>

          <View style={styles.row}>
            <Icon name="stethoscope" size={16} color={COLORS.primary} style={styles.icon} />
            <Text style={styles.detail}>
              Specializations: {Array.isArray(item.specializationsOffered) ? item.specializationsOffered.join(', ') : 'N/A'}
            </Text>
          </View>

          <View style={styles.row}>
            <Icon name="map-marker-alt" size={16} color={COLORS.primary} style={styles.icon} />
            <Text style={styles.detail}>Location: {item.city}, {item.state}</Text>
          </View>

          <View style={styles.row}>
            <Icon name="handshake" size={16} color={COLORS.primary} style={styles.icon} />
            <Text style={styles.detail}>
              Outreach: {typeof item.outReachProgramsStatus === 'boolean' ? (item.outReachProgramsStatus ? 'Yes' : 'No') : 'N/A'}
            </Text>
          </View>

          <View style={styles.row}>
            <Icon name="info-circle" size={16} color={COLORS.primary} style={styles.icon} />
            <Text style={styles.detail}>Status: {item.hospitalStatus || 'N/A'}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: dark ? COLORS.dark : COLORS.white }]}>
  <Header
        title="Hospital List"
        onBackPress={() => navigation.goBack()}
      />

      {/* 🔍 Stylish Search Bar */}
      <View
        style={[
          styles.searchBarWrapper,
          {
            backgroundColor: dark ? COLORS.dark2 : '#f0f0f0',
            shadowColor: dark ? COLORS.black : '#ccc',
          },
        ]}
      >
        <Icon
          name="search"
          size={16}
          color={dark ? COLORS.greyscale400 : COLORS.gray}
          style={styles.searchIcon}
        />
        <TextInput
          placeholder="Search hospitals..."
          placeholderTextColor={dark ? COLORS.greyscale500 : '#999'}
          style={[styles.searchInput, { color: dark ? COLORS.white : COLORS.black }]}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={filteredHospitals}
        keyExtractor={(item) => item._id}
        renderItem={renderHospitalCard}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>No hospitals found.</Text>}
        ListFooterComponent={<View style={{ height: 20 }} />}
      />
    </SafeAreaView>
  );
};

export default Hospital;

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
    fontSize: 15.5,
    paddingVertical: 0,
  },
  list: {
    paddingHorizontal: SIZES.padding,
    paddingTop: 12,
    paddingBottom: 100,
    alignItems: 'center',
  },
  card: {
    width: width * 0.92,
    borderRadius: 20,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 0.4,
    borderColor: COLORS.lightGray2,
    backgroundColor: COLORS.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: 130,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  infoContainer: {
    padding: 12,
  },
  hospitalName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
    color: COLORS.primary,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  icon: {
    marginRight: 8,
    marginTop: 2,
  },
  detail: {
    fontSize: 14.5,
    lineHeight: 20,
    flex: 1,
    fontWeight: '500',
    color: COLORS.grayscale700,
  },
});

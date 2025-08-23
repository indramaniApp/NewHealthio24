import React, { useCallback, useState } from 'react';
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Image,
  SafeAreaView,
  Platform,
  StatusBar,
  TextInput,
} from 'react-native';
import Header from '../../../components/Header';
import { COLORS, SIZES } from '../../../constants';
import { hideLoader, showLoader } from '../../redux/slices/loaderSlice';
import ApiService from '../../api/ApiService';
import { ENDPOINTS } from '../../constants/Endpoints';
import { useDispatch } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';

const placeholderImage = require('../../../assets/physiotherapy.png');

const Physiotherapy = ({ navigation }) => {
  const [physiotherapy, setPhysiotherapy] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const dispatch = useDispatch();

  const fetchPhysiotherapy = async () => {
    try {
      dispatch(showLoader());
      const response = await ApiService.get(ENDPOINTS.patient_get_physiotherapys);
      console.log('physiotherapy data===============', response.data);
      setPhysiotherapy(response.data);
    } catch (error) {
      console.log('Error fetching physiotherapy:', error);
    } finally {
      dispatch(hideLoader());
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchPhysiotherapy();
    }, [])
  );

  const filteredData = physiotherapy.filter((item) => {
    const q = searchQuery.toLowerCase();
    return (
      item.centreName?.toLowerCase().includes(q) ||
      item.city?.toLowerCase().includes(q) ||
      item.state?.toLowerCase().includes(q) ||
      item.centreType?.toLowerCase().includes(q) ||
      item.registrationNumber?.toLowerCase().includes(q)
    );
  });

  const renderCentreCard = ({ item }) => {
    const {
      centreName,
      registrationNumber,
      dateOfEstablishment,
      centreType,
      street,
      city,
      state,
      postalCode,
      centreExteriorPhoto,
    } = item;

    const validUrl =
      typeof centreExteriorPhoto === 'string' &&
      centreExteriorPhoto.length > 5 &&
      (centreExteriorPhoto.startsWith('http://') || centreExteriorPhoto.startsWith('https://'));

    const imageSource = validUrl ? { uri: centreExteriorPhoto } : placeholderImage;

    return (
      <View style={styles.card}>
        <View style={styles.imageWrapper}>
          <Image source={imageSource} style={styles.photo} resizeMode="cover" />
        </View>

        <View style={styles.cardContent}>
          <Text style={styles.name}>{centreName}</Text>

          <View style={styles.row}>
            <Icon name="id-card" size={14} color={COLORS.primary} style={styles.icon} />
            <Text style={styles.text}><Text style={styles.label}>Reg.No:</Text> {registrationNumber}</Text>
          </View>

          <View style={styles.row}>
            <Icon name="calendar-alt" size={14} color={COLORS.primary} style={styles.icon} />
            <Text style={styles.text}><Text style={styles.label}>Established:</Text> {dateOfEstablishment}</Text>
          </View>

          <View style={styles.row}>
            <Icon name="hospital" size={14} color={COLORS.primary} style={styles.icon} />
            <Text style={styles.text}><Text style={styles.label}>Type:</Text> {centreType}</Text>
          </View>

          <View style={styles.row}>
            <Icon name="map-marker-alt" size={14} color={COLORS.primary} style={styles.icon} />
            <Text style={styles.text}><Text style={styles.label}>Address:</Text> {`${street}, ${city}, ${state}, ${postalCode}`}</Text>
          </View>

          <TouchableOpacity
            style={styles.bookButton}
            onPress={() => navigation.navigate('PhysiotherapySelectSlot', { centreId: item._id })}
          >
            <Text style={styles.bookButtonText}>Book Physiotherapy</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: COLORS.white }]}>
      <Header title="Physiotherapy Centre List" onBackPress={() => navigation.goBack()} />

      <View style={styles.searchBarWrapper}>
        <Icon name="search" size={16} color={COLORS.gray} style={styles.searchIcon} />
        <TextInput
          placeholder="Search by name, city, or type"
          placeholderTextColor="#999"
          style={[styles.searchInput, { color: COLORS.black }]}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item._id}
        renderItem={renderCentreCard}
        contentContainerStyle={{ padding: 16 }}
        ItemSeparatorComponent={() => <View style={{ height: 18 }} />}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={<View style={{ height: 100 }} />}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 20, color: COLORS.black }}>
            No physiotherapy centres found.
          </Text>
        }
      />
    </SafeAreaView>
  );
};

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
    backgroundColor: '#f0f0f0',
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
  card: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#fefefe',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  imageWrapper: {
    width: '100%',
    height: 150,
    backgroundColor: '#e6e6e6',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  cardContent: {
    padding: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  icon: {
    marginRight: 6,
    marginTop: 2,
  },
  text: {
    fontSize: 14,
    color: COLORS.grayscale700,
    flexShrink: 1,
  },
  label: {
    fontWeight: '600',
  },
  bookButton: {
    marginTop: 12,
    backgroundColor: COLORS.primary,
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 24,
    alignSelf: 'flex-start',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  bookButtonText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 15,
  },
});

export default Physiotherapy;

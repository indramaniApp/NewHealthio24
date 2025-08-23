import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  ScrollView,
  SafeAreaView,
  Platform,
  StatusBar,
  useColorScheme,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '../../../components/Header';
import { COLORS } from '../../../constants';
import ApiService from '../../api/ApiService';
import { ENDPOINTS } from '../../constants/Endpoints';
import { useDispatch } from 'react-redux';
import { showLoader, hideLoader } from '../../redux/slices/loaderSlice';

const PharmacyDetailWithMedicine = ({ route, navigation }) => {
  const { pharmacyId } = route.params;
  const isDark = useColorScheme() === 'dark';
  const [medicineData, setMedicineData] = useState([]);
  const dispatch = useDispatch();

  const fetchMedicines = async () => {
    try {
      dispatch(showLoader());
      const response = await ApiService.get(
        `${ENDPOINTS.patient_get_medicines}/${pharmacyId}`
      );
      console.log('Medicines data===============', response.data);
      setMedicineData(response.data || []);
    } catch (error) {
      console.log('Error fetching medicines:', error);
    } finally {
      dispatch(hideLoader());
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, [pharmacyId]);

  const pharmacy = medicineData[0]?.pharmacy;

  const renderPharmacyCard = () => {
    if (!pharmacy) return null;

    return (
      <View
        style={[
          styles.pharmacyCard,
          {
            backgroundColor: isDark ? '#1c1c1e' : '#f2f2f2',
            shadowColor: isDark ? '#000' : '#aaa',
          },
        ]}
      >
        {pharmacy.pharmacyImage ? (
          <Image
            source={{ uri: pharmacy.pharmacyImage }}
            style={styles.pharmacyImage}
          />
        ) : null}
        <Text style={[styles.pharmacyName, { color: isDark ? '#fff' : '#000' }]}>
          {pharmacy.pharmacyName}
        </Text>
        <Text style={[styles.text, { color: isDark ? '#ccc' : '#444' }]}>
          <Text style={styles.bold}>Type:</Text> {pharmacy.pharmacyType}
        </Text>
        <Text style={[styles.text, { color: isDark ? '#ccc' : '#444' }]}>
          <Text style={styles.bold}>Address:</Text> {pharmacy.street}, {pharmacy.city}, {pharmacy.state}, {pharmacy.postalCode}
        </Text>
        <Text style={[styles.text, { color: isDark ? '#ccc' : '#444' }]}>
          <Text style={styles.bold}>Reg. No.:</Text> {pharmacy.registrationNumber}
        </Text>
        <Text style={[styles.text, { color: isDark ? '#ccc' : '#444' }]}>
          <Text style={styles.bold}>Contact:</Text> {pharmacy.contactNumber}
        </Text>
        <Text style={[styles.text, { color: isDark ? '#ccc' : '#444' }]}>
          <Text style={styles.bold}>Email:</Text> {pharmacy.emailAddress}
        </Text>
        <Text style={[styles.text, { color: isDark ? '#ccc' : '#444' }]}>
          <Text style={styles.bold}>Website:</Text> {pharmacy.website}
        </Text>
      </View>
    );
  };

  const MedicineCard = ({ item }) => (
    <View
      style={[
        styles.card,
        {
          backgroundColor: isDark ? '#1a1a1a' : '#ffffff',
          shadowColor: isDark ? '#000' : '#ccc',
        },
      ]}
    >
      <Image
        source={{ uri: item.image }}
        style={styles.image}
        resizeMode="cover"
        onError={(e) => console.log('Image load error:', e.nativeEvent)}
      />
      <View style={styles.details}>
        <Text style={[styles.name, { color: isDark ? '#fff' : '#111' }]}>
          {item.medicineName}
        </Text>
        <Text style={[styles.generic, { color: isDark ? '#ccc' : '#666' }]}>
          ({item.genericName})
        </Text>

        <View style={styles.infoGrid}>
          <Text style={[styles.infoLabel, isDark ? styles.darkText : styles.lightText]}>
            Type:
          </Text>
          <Text style={[styles.infoValue, isDark ? styles.darkText : styles.lightText]}>
            {item.medicineType}
          </Text>

          <Text style={[styles.infoLabel, isDark ? styles.darkText : styles.lightText]}>
            Category:
          </Text>
          <Text style={[styles.infoValue, isDark ? styles.darkText : styles.lightText]}>
            {item.medicineCategory}
          </Text>

          <Text style={[styles.infoLabel, isDark ? styles.darkText : styles.lightText]}>
            Price:
          </Text>
          <Text style={styles.priceText}>₹{item.medicinePrice}</Text>

          <Text style={[styles.infoLabel, isDark ? styles.darkText : styles.lightText]}>
            Stock:
          </Text>
          <Text style={[styles.infoValue, isDark ? styles.darkText : styles.lightText]}>
            {item.stock}
          </Text>

          <Text style={[styles.infoLabel, isDark ? styles.darkText : styles.lightText]}>
            Expiry:
          </Text>
          <Text style={[styles.expiryText, { width: '70%' }]}>
            {item.expiryDate}
          </Text>
        </View>

        <View style={[styles.row, { marginTop: 8 }]}>
          <Icon
            name={item.prescriptionRequired ? 'check-circle' : 'close-circle'}
            color={item.prescriptionRequired ? 'green' : 'red'}
            size={18}
          />
          <Text style={[styles.prescription, { color: isDark ? '#89CFF0' : '#007BFF' }]}>
            {' '}
            Prescription Required
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: isDark ? '#000' : COLORS.white },
      ]}
    >
      <Header title="Pharmacy Medicines"
        onBackPress={() => navigation.goBack()}

      />
      <ScrollView contentContainerStyle={styles.container}>
        {renderPharmacyCard()}
        {medicineData.length > 0 ? (
          <FlatList
            data={medicineData}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => <MedicineCard item={item} />}
            contentContainerStyle={{ gap: 12, marginBottom: 30 }}
            scrollEnabled={false}
          />
        ) : (
          <Text
            style={{
              textAlign: 'center',
              marginTop: 20,
              color: isDark ? '#fff' : '#000',
            }}
          >
            No medicines found for this pharmacy.
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default PharmacyDetailWithMedicine;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    padding: 16,
    paddingBottom: 30,
  },
  pharmacyCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    elevation: 3,
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    alignItems: 'center',
  },
  pharmacyImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginBottom: 12,
  },
  pharmacyName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 12,
    padding: 14,
    elevation: 8,
    shadowOpacity: 0.12,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    gap: 12,
    borderWidth: 0.5,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
    alignSelf: 'center',
  },
  details: {
    flex: 1,
    gap: 2,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  generic: {
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 6,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 4,
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: '600',
    width: '28%',
  },
  infoValue: {
    fontSize: 13,
    width: '70%',
  },
  priceText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#007BFF',
    width: '70%',
  },
  expiryText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#cc0000',
    flexShrink: 1,
  },
  row: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  prescription: {
    fontSize: 13,
    fontWeight: '600',
  },
  text: {
    fontSize: 13,
    marginVertical: 1,
  },
  bold: {
    fontWeight: '600',
  },
  darkText: {
    color: '#ddd',
  },
  lightText: {
    color: '#333',
  },
});

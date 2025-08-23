import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import HorizontalDoctorCard from '../../components/HorizontalDoctorCard';
import ApiService from '../api/ApiService';
import { ENDPOINTS } from '../constants/Endpoints';
import { hideLoader, showLoader } from '../redux/slices/loaderSlice';
import { useDispatch } from 'react-redux';
import Header from '../../components/Header';
import { useTheme } from '../../theme/ThemeProvider';

const CategoriesScreen = ({ route }) => {
  const { colors } = useTheme();
  const [doctors, setDoctors] = useState([]);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const { categoryName } = route.params;

  const getEndpointByCategory = () => {
    switch (categoryName) {
      case 'Physician': return ENDPOINTS.patient_get_doctors_general_physician;
      case 'Dentist': return ENDPOINTS.patient_get_doctors_dentist;
      case 'EyeSpecialist': return ENDPOINTS.patient_get_doctors_eye_specialist;
      case 'Nutritionist': return ENDPOINTS.patient_get_doctors_nutritionist;
      case 'Neurologist': return ENDPOINTS.patient_get_doctors_neuro_surgeon;
      case 'Child Specialist': return ENDPOINTS.patient_get_doctors_child_specialist;
      case 'ENT Surgeon': return ENDPOINTS.patient_get_doctors_ent_surgeon;
      case 'Stomatch Specilist': return ENDPOINTS.patient_get_doctors_stomach_specialist;
      case 'Women Health': return ENDPOINTS.patient_get_doctors_women_health;
      case 'Skin & Hair': return ENDPOINTS.patient_get_doctors_skin_hair;
      case 'Kidney Specilist': return ENDPOINTS.patient_get_doctors_kidney_specialist;
      case 'Diabetes Specialist': return ENDPOINTS.patient_get_doctors_diabetes_specialist;
      case 'Dietitian': return ENDPOINTS.patient_get_doctors_dietitian;
      case 'Bone Joints': return ENDPOINTS.patient_get_doctors_bones_joints;
      case 'Lungs Specialist': return ENDPOINTS.patient_get_doctors_lungs_specialist;
      case 'Mental Health': return ENDPOINTS.patient_get_doctors_mental_health;
      case 'Cancer Specialist': return ENDPOINTS.patient_get_doctors_cancer_specialist;
      case 'Liver Specialist': return ENDPOINTS.patient_get_doctors_liver_specialist;
      case 'thyroid Specialist': return ENDPOINTS.patient_get_doctors_thyroid_specialist;
      case 'Sexual Health': return ENDPOINTS.patient_get_doctors_sexual_health;
      case 'Pregnancy Specialist': return ENDPOINTS.patient_get_doctors_pregnancy_specialist;
      case 'Ayurveda Specialist': return ENDPOINTS.patient_get_doctors_ayurveda_specialist;
      case 'Unani Specialist': return ENDPOINTS.patient_get_doctors_unani_specialist;
      case 'General Surgeon': return ENDPOINTS.patient_get_doctors_general_surgeon;
      case 'Cardiac Surgeon': return ENDPOINTS.patient_get_doctors_cardiac_surgeon;
      case 'Orthopedic Surgeon': return ENDPOINTS.patient_get_doctors_orthopedic_surgeon;
      case 'Plastic Surgeon': return ENDPOINTS.patient_get_doctors_plastic_surgeon;
      case 'Urologist Surgeon': return ENDPOINTS.patient_get_doctors_urologist_surgeon;
      case 'Vascular Surgeon': return ENDPOINTS.patient_get_doctors_vascular_surgeon;
      case 'Gynecologist Surgeon': return ENDPOINTS.patient_get_doctors_gynecologist_surgeon;
      case 'Oncology Surgeon': return ENDPOINTS.patient_get_doctors_oncologist_surgeon;
      case 'Pediatric Surgeon': return ENDPOINTS.patient_get_doctors_pediatric_surgeon;
      case 'Dental Surgeon': return ENDPOINTS.patient_get_doctors_dental_surgeon;
      case 'Eye Surgeon': return ENDPOINTS.patient_get_doctors_eye_surgeon;
      case 'Cosmetic Surgeon': return ENDPOINTS.patient_get_doctors_cosmetic_surgeon;
      case 'Obesity Surgeon': return ENDPOINTS.patient_get_doctors_bariatric_surgeon;
      case 'Maxillofacial Surgeon': return ENDPOINTS.patient_get_doctors_maxillofacial_surgeon;
      case 'Urinary Specialist': return ENDPOINTS.patient_get_doctors_urinary_specialist;
      case 'Veterinary Doctor': return ENDPOINTS.patient_get_doctors_veterinary_doctor;
      case 'Physiotherapist': return ENDPOINTS.patient_get_doctors_physiotherapist;
      case 'Gynecologist': return ENDPOINTS.patient_get_doctors_gynecologist;
      case 'Pediatrician Doctor': return ENDPOINTS.patient_get_doctors_pediatrician;
      case 'Cardiologist': return ENDPOINTS.patient_get_doctors_cardiologist;
      case 'Dermatologis': return ENDPOINTS.patient_get_doctors_dermatologist;
      case 'Psychiatrist': return ENDPOINTS.patient_get_doctors_psychiatrist;
      case 'Ear Nose Throat Specialist': return ENDPOINTS.patient_get_doctors_ear_nose_throat;
      default:
        console.warn('Unknown category, using default endpoint.');
        return ENDPOINTS.patient_get_doctors_default;
    }
  };

  const GetDoctorCategory = async () => {
    try {
      dispatch(showLoader());
      const endpoint = getEndpointByCategory();
      const response = await ApiService.get(endpoint);
      if (response?.data) {
        const cleanedData = response.data.map((doc) => ({
          ...doc,
          specialization: Array.isArray(doc.specialization)
            ? doc.specialization
            : typeof doc.specialization === 'string'
            ? [doc.specialization]
            : [],
          surgery: Array.isArray(doc.surgery)
            ? doc.surgery
            : typeof doc.surgery === 'string'
            ? [doc.surgery]
            : [],
        }));
        setDoctors(cleanedData);
      }
    } catch (error) {
      console.log('error', error);
    } finally {
      dispatch(hideLoader());
    }
  };

  useEffect(() => {
    GetDoctorCategory();
  }, []);

  const renderDoctorCard = ({ item }) => {
    const specializationText = item.specialization.length > 0
      ? item.specialization.join(', ')
      : 'Specialization not specified';

    const surgeryText = item.surgery.length > 0
      ? item.surgery.join(', ')
      : 'Surgery info not specified';

    return (
      <HorizontalDoctorCard
        name={item.fullName}
        image={item.profilePhoto}
        yearsOfExperience={item.yearsOfExperience}
        consultationFee={item.consultationFee}
        specialization={specializationText}
        surgery={surgeryText}
        isAvailable={item.isAvailable}
        rating={item.average_rating || 0}
        numReviews={item.rating_total_count || 0}
        onPress={() =>
          navigation.navigate('DoctorDetails', {
            doctorId: item._id,
            fullName: item.fullName,
            yearsOfExperience: item.yearsOfExperience,
            specialization: specializationText,
            doctorRating: item.doctorRating,
            streetAddress: item.streetAddress,
            average_rating: item.average_rating,
            rating_total_count: item.rating_total_count,
            about_me: item.about_me,
            consultationDate: item.consultationDate,
            consultationTime: item.consultationTime,
            previous_OPD_Number: item.previous_OPD_Number,
            reviews: item.reviews,
            consultationTimeVideo: item.consultationTimeVideo,
            consultationTimeAudio: item.consultationTimeAudio,
            consultationTimeHomeVisit: item.consultationTimeHomeVisit,
            profilePhoto: item.profilePhoto,
          })
        }
      />
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
        <Header
        title="Speciality Doctors"
        onBackPress={() => navigation.goBack()}
      />
      <View style={styles.container}>
        <FlatList
          data={doctors}
          keyExtractor={(item) => item._id}
          renderItem={renderDoctorCard}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      </View>
    </SafeAreaView>
  );
};

export default CategoriesScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f2f2f2',
  },
});

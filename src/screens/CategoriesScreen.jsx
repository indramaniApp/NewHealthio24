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
import LinearGradient from 'react-native-linear-gradient';

const CategoriesScreen = ({ route }) => {
    const [doctors, setDoctors] = useState([]);
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const { categoryName } = route.params;

  const getEndpointByCategory = () => {
    switch (categoryName) {

        case 'Physician':
            return ENDPOINTS.patient_get_doctors_general_physician;

        case 'Dentist':
            return ENDPOINTS.patient_get_doctors_dentist;

        case 'Eye Specialist':
            return ENDPOINTS.patient_get_doctors_ophthalmology;

        case 'Neurologist':
        case 'Neurologist Doctor':
            return ENDPOINTS.patient_get_doctors_neurologist;

        case 'Child Specialist':
        case 'Paediatrician':
            return ENDPOINTS.patient_get_doctors_paediatrician;

        case 'ENT':
        case 'Ear Nose Throat Specialist':
        case 'ENT Surgeon':
            return ENDPOINTS.patient_get_doctors_ent;

        case 'Gynecologist':
            return ENDPOINTS.patient_get_doctors_gynecologist;

        case 'Cardiologist':
            return ENDPOINTS.patient_get_doctors_cardiologist;

        case 'Cardiac Surgeon':
            return ENDPOINTS.patient_get_doctors_cardiac_surgeon;

        case 'Cardiac Critical Care':
            return ENDPOINTS.patient_get_doctors_cardiac_critical_care;

        case 'Pulmonologist':
        case 'Lungs Specialist':
            return ENDPOINTS.patient_get_doctors_pulmonologist;

        case 'Nephrologist':
        case 'Kidney Specialist':
            return ENDPOINTS.patient_get_doctors_nephrologist;

        case 'Urologist':
            return ENDPOINTS.patient_get_doctors_urologist;

        case 'Gastro Medicine':
        case 'Stomach Specialist':
            return ENDPOINTS.patient_get_doctors_gastro_medicine;

        case 'Gastro Surgery':
            return ENDPOINTS.patient_get_doctors_gastro_surgery;

        case 'Hematologist':
            return ENDPOINTS.patient_get_doctors_hematologist;

        case 'Orthopedics':
        case 'Bone Joints':
            return ENDPOINTS.patient_get_doctors_orthopedics;

        case 'Oncology':
        case 'Cancer Specialist':
            return ENDPOINTS.patient_get_doctors_onco_medicine;

        case 'Onco Surgeon':
            return ENDPOINTS.patient_get_doctors_onco_surgeon;

        case 'Plastic Surgeon':
            return ENDPOINTS.patient_get_doctors_plastic_surgeon;

        case 'Dermatologist':
        case 'Skin & Hair':
            return ENDPOINTS.patient_get_doctors_dermatologist;

        case 'Radiologist':
            return ENDPOINTS.patient_get_doctors_radiologist;

        case 'Anesthesiologist':
            return ENDPOINTS.patient_get_doctors_anesthesiologist;

        case 'Pathologist':
            return ENDPOINTS.patient_get_doctors_pathologist;

        case 'Sports Medicine':
            return ENDPOINTS.patient_get_doctors_sports_medicine;

        case 'General Surgeon':
        case 'Laparoscopic Surgeon':
            return ENDPOINTS.patient_get_doctors_laparoscopic_surgeon;

        case 'Spine Surgeon':
            return ENDPOINTS.patient_get_doctors_spine_surgeon;

        default:
            console.warn('Unknown category → fallback to Physician');
            return ENDPOINTS.patient_get_doctors_general_physician;
    }
};


    const GetDoctorCategory = async () => {
        try {
            dispatch(showLoader());
            const endpoint = getEndpointByCategory();
            const response = await ApiService.get(endpoint);

            if (response?.data) {
                const cleanedData = response.data.map((doc) => {
                    let specializationArray = Array.isArray(doc.specialization)
                        ? doc.specialization
                        : typeof doc.specialization === 'string'
                            ? [doc.specialization]
                            : [];

                    let surgeryArray = Array.isArray(doc.surgery)
                        ? doc.surgery
                        : typeof doc.surgery === 'string'
                            ? [doc.surgery]
                            : [];

                    // ⚡ ENT Surgeon fix for UI
                    if (categoryName === 'ENT Surgeon') {
                        // Remove duplicate "Ear Nose Throat Specialist"
                        specializationArray = specializationArray.filter(
                            (spec) => spec !== 'Ear Nose Throat Specialist'
                        );
                        // Always add "ENT Surgeon" in UI
                        if (!specializationArray.includes('ENT Surgeon')) {
                            specializationArray.push('ENT Surgeon');
                        }
                    }

                    // ⚡ Ear Nose Throat Specialist fix
                    if (categoryName === 'Ear Nose Throat Specialist') {
                        if (!specializationArray.includes('Ear Nose Throat Specialist')) {
                            specializationArray.push('Ear Nose Throat Specialist');
                        }
                    }

                    return {
                        ...doc,
                        specialization: specializationArray,
                        surgery: surgeryArray,
                    };
                });

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
                    navigation.navigate('DoctorDetails', { doctor: item })
                }
            />
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient
                colors={['#fff', '#fff', '#fff', '#fff', '#fff']}
                style={styles.gradientContainer}
            >
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
            </LinearGradient>
        </SafeAreaView>
    );
};

export default CategoriesScreen;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    gradientContainer: {
        flex: 1,
    },
    container: {
        flex: 1,
        padding: 16,
    },
});

import React, { useState, useCallback } from 'react';
import {
    StyleSheet,
    SafeAreaView,
    View,
    FlatList,
    Platform,
    StatusBar,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient'; 

import Header from '../../../../components/Header';
import { COLORS } from '../../../../constants';
import { showLoader, hideLoader } from '../../../redux/slices/loaderSlice';
import ApiService from '../../../api/ApiService';
import { ENDPOINTS } from '../../../constants/Endpoints';
import HorizontalDoctorCard from '../../../../components/HorizontalDoctorCard';

const SpecialPreventDepartment = ({ route }) => {
    const { hospitalId } = route.params;
    const dispatch = useDispatch();
    const navigation = useNavigation();

    const [preventiveData, setPreventiveData] = useState([]);

    const fetchPreventiveDepartment = async () => {
        try {
            dispatch(showLoader());
            const response = await ApiService.get(
                `${ENDPOINTS.patient_get_doctors_preventive_department}/${hospitalId}`
            );
            console.log('=====Preventive Department Data=====', response.data);

            const cleanedData = (response.data || []).map((doc) => ({
                ...doc,
                specialization: Array.isArray(doc.specialization) ? doc.specialization : [],
                surgery: Array.isArray(doc.surgery) ? doc.surgery : [],
            }));

            setPreventiveData(cleanedData);
        } catch (error) {
            console.log('Error fetching preventive department:', error);
        } finally {
            dispatch(hideLoader());
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchPreventiveDepartment();
        }, [hospitalId])
    );

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
                    navigation.navigate('DoctorDetailScreen', {
                        doctorId: item._id,
                    })
                }
            />
        );
    };

    return (
  
        <LinearGradient
            colors={['#00b4db', '#ffff', '#ffff']}
            style={{ flex: 1 }}
        >
            <SafeAreaView style={styles.safeArea}>
                <Header title="Specialty Department"
                    onBackPress={() => navigation.goBack()}
                />
                <View style={styles.container}>
                    <FlatList
                        data={preventiveData}
                        keyExtractor={(item) => item._id}
                        renderItem={renderDoctorCard}
                        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 40 }}
                    />
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
};

export default SpecialPreventDepartment;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: 'transparent',
    },
});
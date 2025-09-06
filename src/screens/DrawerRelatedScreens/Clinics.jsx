import React, { useCallback, useEffect, useState } from 'react';
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

import { COLORS, SIZES } from '../../../constants/theme';
import defaultHospitalImage from '../../../assets/hospital.png';
import Header from '../../../components/Header';
import { hideLoader, showLoader } from '../../redux/slices/loaderSlice';
import ApiService from '../../api/ApiService';
import { ENDPOINTS } from '../../constants/Endpoints';
import { useTheme } from '../../../theme/ThemeProvider';
import LinearGradient from 'react-native-linear-gradient'; // Import LinearGradient

const { width } = Dimensions.get('window');

const Clinics = ({ navigation }) => {
    const dispatch = useDispatch();
    const [clinics, setClinics] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const { dark } = useTheme();

    const fetchClinics = async () => {
        try {
            dispatch(showLoader());
            const response = await ApiService.get(ENDPOINTS.patient_get_clinics);
            setClinics(response.data);
        } catch (error) {
            console.log('Error fetching clinics:', error);
        } finally {
            dispatch(hideLoader());
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchClinics();
        }, [])
    );

    const filteredClinics = clinics.filter((clinic) => {
        const query = searchQuery.toLowerCase();
        return (
            clinic.clinicName?.toLowerCase().includes(query) ||
            clinic.city?.toLowerCase().includes(query) ||
            clinic.state?.toLowerCase().includes(query) ||
            clinic.specializationsOffered?.some((s) => s.toLowerCase().includes(query))
        );
    });

    const renderHospitalCard = ({ item }) => {
        const validUrl =
            typeof item.clinicExteriorPhoto === 'string' &&
            item.clinicExteriorPhoto.length > 5 &&
            (item.clinicExteriorPhoto.startsWith('http://') ||
                item.clinicExteriorPhoto.startsWith('https://'));

        const imageSource = validUrl
            ? { uri: item.clinicExteriorPhoto }
            : defaultHospitalImage;

        return (
            <TouchableOpacity
                style={styles.card}
                activeOpacity={0.9}
                onPress={() => console.log('Navigate to Clinic detail', item._id)}
            >
                <Image source={imageSource} style={styles.image} resizeMode="cover" />

                <View style={styles.detailsContainer}>
                    <View style={styles.topRow}>
                        <Text style={styles.clinicName} numberOfLines={1}>
                            {item.clinicName}
                        </Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Icon name="id-card" size={14} color={COLORS.primary} style={styles.icon} />
                        <Text style={styles.detail}>Reg No: {item.registrationNumber || 'N/A'}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Icon name="building" size={14} color={COLORS.primary} style={styles.icon} />
                        <Text style={styles.detail}>
                            Type: {Array.isArray(item.clinicType) ? item.clinicType.join(', ') : item.clinicType || 'N/A'}
                        </Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Icon name="stethoscope" size={14} color={COLORS.primary} style={styles.icon} />
                        <Text style={styles.detail}>
                            Specializations: {Array.isArray(item.specializationsOffered) ? item.specializationsOffered.join(', ') : 'N/A'}
                        </Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Icon name="map-marker-alt" size={14} color={COLORS.primary} style={styles.icon} />
                        <Text style={styles.detail}>
                            Location: {item.city}, {item.state}
                        </Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Icon name="info-circle" size={14} color={COLORS.primary} style={styles.icon} />
                        <Text style={styles.detail}>
                            Status: {item.clinicStatus || 'N/A'}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient
                colors={['#00b4db', '#fff', '#fff', '#fff', '#fff']}
                style={styles.gradientContainer}
            >
                <Header title="Clinics List"
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
                        placeholder="Search clinics by name, city, or specialty"
                        placeholderTextColor={dark ? COLORS.greyscale500 : '#999'}
                        style={[styles.searchInput, { color: dark ? COLORS.white : COLORS.black }]}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                <View style={styles.container}>
                    <FlatList
                        data={filteredClinics}
                        keyExtractor={(item) => item._id}
                        renderItem={renderHospitalCard}
                        contentContainerStyle={styles.list}
                        showsVerticalScrollIndicator={false}
                        ListFooterComponent={<View style={{ height: 40 }} />}
                        ListEmptyComponent={
                            <Text style={{ textAlign: 'center', marginTop: 20, color: dark ? COLORS.greyscale400 : COLORS.gray }}>
                                No clinics found.
                            </Text>
                        }
                    />
                </View>
            </LinearGradient>
        </SafeAreaView>
    );
};

export default Clinics;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    gradientContainer: { // Style for the gradient
        flex: 1,
    },
    container: {
        flex: 1,
        paddingHorizontal: SIZES.padding,
        marginTop: 10,
    },
    searchBarWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: SIZES.padding,
        marginTop: 10,
        marginBottom: 6,
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
    },
    list: {
        paddingBottom: 20,
        alignItems: 'center',
    },
    card: {
        flexDirection: 'row',
        width: width * 0.92,
        backgroundColor: COLORS.white,
        borderRadius: 16,
        marginBottom: 16,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        alignItems: 'stretch',
    },
    image: {
        width: 120,
        borderRadius: 16,
        height: '100%',
    },
    detailsContainer: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'center',
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    clinicName: {
        fontSize: 18,
        fontFamily: 'Urbanist Bold',
        color: COLORS.greyscale900,
        flexShrink: 1,
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
        fontFamily: 'Urbanist Regular',
        color: COLORS.grayscale700,
        flexShrink: 1,
    },
});
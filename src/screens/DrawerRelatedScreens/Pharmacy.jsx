import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    useColorScheme,
    SafeAreaView,
    TouchableOpacity,
    Platform,
    StatusBar,
    TextInput,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome5';

import Header from '../../../components/Header';
import { COLORS, SIZES } from '../../../constants';
import ApiService from '../../api/ApiService';
import { ENDPOINTS } from '../../constants/Endpoints';
import { hideLoader, showLoader } from '../../redux/slices/loaderSlice';
import LinearGradient from 'react-native-linear-gradient'; // Import LinearGradient

import pharmacy from '../../../assets/pharmacy.jpg';

const Pharmacy = () => {
    const isDark = useColorScheme() === 'dark';
    const dispatch = useDispatch();
    const navigation = useNavigation();

    const [pharmacies, setPharmacies] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchPharmacies = async () => {
        try {
            dispatch(showLoader());
            const response = await ApiService.get(ENDPOINTS.patient_get_pharmacys);
            setPharmacies(response.data);
        } catch (error) {
            console.log('Error fetching pharmacies:', error);
        } finally {
            dispatch(hideLoader());
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchPharmacies();
        }, [])
    );

    const filteredPharmacies = pharmacies.filter((item) => {
        const query = searchQuery.toLowerCase();
        return (
            item.pharmacyName?.toLowerCase().includes(query) ||
            item.city?.toLowerCase().includes(query) ||
            item.state?.toLowerCase().includes(query) ||
            item.country?.toLowerCase().includes(query) ||
            item.registrationNumber?.toLowerCase().includes(query) ||
            item.pharmacyType?.toLowerCase().includes(query)
        );
    });

    const renderPharmacyCard = ({ item }) => {
        const {
            pharmacyImage,
            pharmacyName,
            registrationNumber,
            emailAddress,
            street,
            city,
            state,
            postalCode,
            country,
            dateOfEstablishment,
            pharmacyType,
            _id,
        } = item;

        const onCardPress = () => {
            navigation.navigate('PharmacyDetailWithMedicine', { pharmacyId: _id });
        };

        return (
            <TouchableOpacity
                onPress={onCardPress}
                style={[
                    styles.container,
                    {
                        backgroundColor: isDark ? '#1c1c1e' : '#fff',
                        shadowColor: isDark ? '#000' : '#aaa',
                    },
                ]}
            >
                {pharmacyImage ? (
                    <Image source={{ uri: pharmacyImage }} style={styles.image} />
                ) : (
                    <Image source={pharmacy} style={styles.image} />
                )}
                <View style={styles.columnContainer}>
                    <Text style={[styles.name, { color: isDark ? '#fff' : '#000' }]}>{pharmacyName}</Text>
                    <Text style={[styles.subText, { color: isDark ? '#ddd' : '#333' }]}>Reg.No: {registrationNumber}</Text>
                    <Text style={[styles.subText, { color: isDark ? '#ddd' : '#333' }]}>Email: {emailAddress}</Text>
                    <Text style={[styles.subText, { color: isDark ? '#ddd' : '#333' }]}>
                        Address: {`${street}, ${city}, ${state}, ${postalCode}, ${country}`}
                    </Text>
                    <View style={styles.bottomRow}>
                        <Text style={[styles.subText, { color: isDark ? '#ddd' : '#333' }]}>Type: {pharmacyType}</Text>
                        <Text style={[styles.subText, { color: isDark ? '#ddd' : '#333' }]}>Since: {dateOfEstablishment}</Text>
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
                <Header title="Pharmacy List"
                    onBackPress={() => navigation.goBack()}
                />

                {/* 🔍 Stylish Search Bar */}
                <View
                    style={[
                        styles.searchBarWrapper,
                        {
                            backgroundColor: isDark ? '#1c1c1e' : '#f0f0f0',
                            shadowColor: isDark ? COLORS.black : '#ccc',
                        },
                    ]}
                >
                    <Icon
                        name="search"
                        size={16}
                        color={isDark ? COLORS.greyscale400 : COLORS.gray}
                        style={styles.searchIcon}
                    />
                    <TextInput
                        placeholder="Search pharmacy by name, city, or type"
                        placeholderTextColor={isDark ? COLORS.greyscale500 : '#999'}
                        style={[styles.searchInput, { color: isDark ? COLORS.white : COLORS.black }]}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                <FlatList
                    data={filteredPharmacies}
                    keyExtractor={(item) => item._id}
                    renderItem={renderPharmacyCard}
                    contentContainerStyle={{ paddingVertical: 12, paddingBottom: 80 }}
                    ListEmptyComponent={
                        <Text style={{ textAlign: 'center', marginTop: 20, color: isDark ? '#fff' : '#000' }}>
                            No pharmacies available.
                        </Text>
                    }
                />
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    gradientContainer: { // Style for the gradient
        flex: 1,
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
        backgroundColor: '#e6e6e_e6',
        borderRadius: 20,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        paddingVertical: 0,
        fontFamily: 'Urbanist-Regular',
    },
    container: {
        flexDirection: 'row',
        width: '92%',
        alignSelf: 'center',
        padding: 10,
        borderRadius: 16,
        marginBottom: 16,
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        elevation: 12,
        alignItems: 'center',
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 16,
    },
    columnContainer: {
        flex: 1,
        marginLeft: 12,
    },
    name: {
        fontSize: 18,
        fontFamily: 'Urbanist-Bold',
    },
    subText: {
        fontSize: 14,
        fontFamily: 'Urbanist-Regular',
        marginTop: 2,
    },
    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 4,
    },
});

export default Pharmacy;
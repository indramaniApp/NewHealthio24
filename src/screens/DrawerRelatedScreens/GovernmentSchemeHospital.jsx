import React, { useState, useCallback } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    FlatList,
    Dimensions,
    SafeAreaView,
    Platform,
    StatusBar,
    TouchableOpacity,
    TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useDispatch } from 'react-redux';
import { COLORS, SIZES } from '../../../constants/theme';
import hosptal from '../../../assets/hospital.png';
import Header from '../../../components/Header';
import ApiService from '../../api/ApiService';
import { ENDPOINTS } from '../../constants/Endpoints';
import { hideLoader, showLoader } from '../../redux/slices/loaderSlice';
import { useTheme } from '../../../theme/ThemeProvider';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient'; 

const { width } = Dimensions.get('window');

const GovernmentSchemeHospital = () => {
    const [hospitals, setHospitals] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const dispatch = useDispatch();
    const { dark } = useTheme();
    const navigation = useNavigation();

    const fetchHospitals = async () => {
        try {
            dispatch(showLoader());
            const response = await ApiService.get(ENDPOINTS.patient_get_hospitals_govt_scheme);
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

    const handleCardPress = (hospitalData) => {
        navigation.navigate('GovHospitalDetailScreen', {
            hospitalId: hospitalData._id,
        });
    };

    const filteredHospitals = hospitals.filter((item) => {
        const lowerQuery = searchQuery.toLowerCase();
        return (
            item.hospitalName?.toLowerCase().includes(lowerQuery) ||
            item.city?.toLowerCase().includes(lowerQuery) ||
            item.state?.toLowerCase().includes(lowerQuery) ||
            item.specialtyHospital?.toLowerCase().includes(lowerQuery)
        );
    });

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={[
                styles.card,
                {
                    backgroundColor: dark ? COLORS.dark2 : COLORS.white,
                    borderColor: dark ? COLORS.greyscale700 : COLORS.lightGray2,
                },
            ]}
            onPress={() => handleCardPress(item)}
        >
            <Image
                source={item.hospitalExteriorPhoto ? { uri: item.hospitalExteriorPhoto } : hosptal}
                style={styles.image}
                resizeMode="cover"
            />
            <View style={styles.infoContainer}>
                <View style={styles.topViewContainer}>
                    <Text
                        style={[
                            styles.hospitalName,
                            { color: dark ? COLORS.secondaryWhite : COLORS.greyscale900 },
                        ]}
                    >
                        {item.hospitalName}
                    </Text>
                </View>

                <View style={styles.row}>
                    <Icon name="id-card" size={16} color={COLORS.primary} style={styles.icon} />
                    <Text style={[styles.detail, { color: dark ? COLORS.greyscale300 : COLORS.grayscale700 }]}>
                        Reg#: {item.registrationNumber}
                    </Text>
                </View>

                <View style={styles.row}>
                    <Icon name="building" size={16} color={COLORS.primary} style={styles.icon} />
                    <Text style={[styles.detail, { color: dark ? COLORS.greyscale300 : COLORS.grayscale700 }]}>
                        Type: {Array.isArray(item.hospitalType) ? item.hospitalType.join(', ') : item.hospitalType}
                    </Text>
                </View>

                <View style={styles.row}>
                    <Icon name="building" size={16} color={COLORS.primary} style={styles.icon} />
                    <Text style={[styles.detail, { color: dark ? COLORS.greyscale300 : COLORS.grayscale700 }]}>
                        Specialization: {item.specialtyHospital}
                    </Text>
                </View>

                <View style={styles.row}>
                    <Icon name="map-marker-alt" size={16} color={COLORS.primary} style={styles.icon} />
                    <Text style={[styles.detail, { color: dark ? COLORS.greyscale300 : COLORS.grayscale700 }]}>
                        Location: {item.city}, {item.state}
                    </Text>
                </View>

                <Text style={[styles.section, { color: COLORS.primary }]}>🏥 Govt. Schemes</Text>
                {item.governmentSchemes?.length > 0 ? (
                    item.governmentSchemes.map((scheme, index) => (
                        <Text
                            key={index}
                            style={[styles.bullet, { color: dark ? COLORS.greyscale400 : COLORS.grayscale700 }]}
                        >
                            • {scheme.name}
                        </Text>
                    ))
                ) : (
                    <Text style={[styles.bullet, { color: dark ? COLORS.greyscale400 : COLORS.grayscale700 }]}>
                        No schemes available
                    </Text>
                )}
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient
                colors={['#00b4db', '#fff', '#fff', '#fff', '#fff']}
                style={styles.gradientContainer}
            >
                <Header
                    title="Govt. Scheme Hospitals"
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
                        placeholder="Search hospital by name, city, or specialty"
                        placeholderTextColor={dark ? COLORS.greyscale500 : '#999'}
                        style={[styles.searchInput, { color: dark ? COLORS.white : COLORS.black }]}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                <FlatList
                    data={filteredHospitals}
                    keyExtractor={(item, index) => item._id || `${item.registrationNumber}_${index}`}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>No hospitals found.</Text>}
                    ListFooterComponent={<View style={{ height: 20 }} />}
                />
            </LinearGradient>
        </SafeAreaView>
    );
};

export default GovernmentSchemeHospital;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    gradientContainer: { 
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
        backgroundColor: '#e6e6e6',
        borderRadius: 20,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        paddingVertical: 0,
    },
    list: {
        paddingHorizontal: SIZES.padding,
        paddingTop: 10,
        paddingBottom: 100,
        alignItems: 'center',
    },
    card: {
        width: width * 0.92,
        borderRadius: 20,
        marginBottom: 12,
        overflow: 'hidden',
        borderWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 6,
    },
    image: {
        width: '100%',
        height: 120,
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
    topViewContainer: {
        marginBottom: 4,
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
    },
    section: {
        marginTop: 12,
        fontWeight: '700',
        fontSize: 15,
        marginBottom: 4,
    },
    bullet: {
        fontSize: 13,
        marginVertical: 1,
        paddingLeft: 16,
        lineHeight: 18,
    },
});
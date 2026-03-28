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

/* ---------------- Drawer Match Colors (Blue Theme) ---------------- */
// ✅ Screenshot ke Govt. Scheme Hospitals icon container se match kiya gaya color
const DRAWER_BLUE_ICON = '#1E88E5'; 
const DRAWER_BLUE_GRADIENT = ['#E3F2FD', '#BBDEFB'];

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
                    borderColor: dark ? COLORS.greyscale700 : '#E3F2FD',
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
                            { color: DRAWER_BLUE_ICON },
                        ]}
                    >
                        {item.hospitalName}
                    </Text>
                </View>

                {/* Icons color matched with Drawer Blue */}
                <View style={styles.row}>
                    <Icon name="id-card" size={14} color={DRAWER_BLUE_ICON} style={styles.icon} />
                    <Text style={[styles.detail, { color: dark ? COLORS.greyscale300 : COLORS.grayscale700 }]}>
                        Reg#: {item.registrationNumber}
                    </Text>
                </View>

                <View style={styles.row}>
                    <Icon name="building" size={14} color={DRAWER_BLUE_ICON} style={styles.icon} />
                    <Text style={[styles.detail, { color: dark ? COLORS.greyscale300 : COLORS.grayscale700 }]}>
                        Type: {Array.isArray(item.hospitalType) ? item.hospitalType.join(', ') : item.hospitalType}
                    </Text>
                </View>

                <View style={styles.row}>
                    <Icon name="medal" size={14} color={DRAWER_BLUE_ICON} style={styles.icon} />
                    <Text style={[styles.detail, { color: dark ? COLORS.greyscale300 : COLORS.grayscale700 }]}>
                        Specialization: {item.specialtyHospital}
                    </Text>
                </View>

                <View style={styles.row}>
                    <Icon name="map-marker-alt" size={14} color={DRAWER_BLUE_ICON} style={styles.icon} />
                    <Text style={[styles.detail, { color: dark ? COLORS.greyscale300 : COLORS.grayscale700 }]}>
                        Location: {item.city}, {item.state}
                    </Text>
                </View>

                {/* Section header with Drawer Blue Background touch */}
                <View style={styles.schemeHeaderContainer}>
                   <Text style={[styles.section, { color: DRAWER_BLUE_ICON }]}>🏥 Govt. Schemes</Text>
                </View>
                
                {item.governmentSchemes?.length > 0 ? (
                    item.governmentSchemes.map((scheme, index) => (
                        <View key={index} style={styles.schemeBadge}>
                             <Text style={[styles.bullet, { color: DRAWER_BLUE_ICON }]}>
                                • {scheme.name}
                            </Text>
                        </View>
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
                colors={['#E3F2FD', '#BBDEFB', '#fff', '#fff']} // Top matches App theme, body is white
                style={styles.gradientContainer}
            >
                {/* Fixed StatusBar color */}
                <StatusBar backgroundColor="#E3F2FD" barStyle="dark-content" />
                
                <Header
                    title="Govt. Scheme Hospitals"
                    onBackPress={() => navigation.goBack()}
                />

                {/* 🔍 Stylish Search Bar matched with Blue Theme border */}
                <View
                    style={[
                        styles.searchBarWrapper,
                        {
                            backgroundColor: dark ? COLORS.dark2 : '#fff',
                            borderColor: DRAWER_BLUE_GRADIENT[1],
                        },
                    ]}
                >
                    <Icon
                        name="search"
                        size={16}
                        color={DRAWER_BLUE_ICON}
                        style={styles.searchIcon}
                    />
                    <TextInput
                        placeholder="Search hospital by name, city..."
                        placeholderTextColor={'#999'}
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
                />
            </LinearGradient>
        </SafeAreaView>
    );
};

export default GovernmentSchemeHospital;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
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
        paddingHorizontal: 15,
        height: 50,
        borderRadius: 15,
        borderWidth: 1.5,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        fontWeight: '500',
    },
    list: {
        paddingHorizontal: SIZES.padding,
        paddingTop: 10,
        paddingBottom: 40,
        alignItems: 'center',
    },
    card: {
        width: width * 0.92,
        borderRadius: 20,
        marginBottom: 16,
        backgroundColor: '#fff',
        borderWidth: 1,
        elevation: 4,
        shadowColor: '#1E88E5',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    image: {
        width: '100%',
        height: 140,
    },
    infoContainer: {
        padding: 15,
    },
    hospitalName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    icon: {
        width: 20,
        marginRight: 8,
    },
    detail: {
        fontSize: 14,
        fontWeight: '500',
        flex: 1,
    },
    section: {
        marginTop: 10,
        fontWeight: 'bold',
        fontSize: 15,
        marginBottom: 5,
    },
    schemeBadge: {
        backgroundColor: '#E3F2FD',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        alignSelf: 'flex-start',
        marginTop: 4,
    },
    bullet: {
        fontSize: 13,
        fontWeight: '600',
    },
});
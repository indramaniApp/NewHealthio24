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
    useColorScheme,
    Linking,
    TextInput,
} from 'react-native';
import { useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useFocusEffect } from '@react-navigation/native';
// 1. LinearGradient ko import karein
import LinearGradient from 'react-native-linear-gradient';

import { COLORS, SIZES } from '../../../constants/theme';
import Header from '../../../components/Header';
import { hideLoader, showLoader } from '../../redux/slices/loaderSlice';
import ApiService from '../../api/ApiService';
import { ENDPOINTS } from '../../constants/Endpoints';

const { width } = Dimensions.get('window');

const BloodBanks = ({ navigation }) => {
    const dispatch = useDispatch();
    const colorScheme = useColorScheme();
    const isDarkMode = colorScheme === 'dark';

    const [bloodBanks, setBloodBanks] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchBloodBanks = async () => {
        try {
            dispatch(showLoader());
            const response = await ApiService.get(ENDPOINTS.patient_get_bloodBanks);
            setBloodBanks(response.data);
        } catch (error) {
            console.log('Error fetching blood banks data:', error);
        } finally {
            dispatch(hideLoader());
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchBloodBanks();
        }, [])
    );

    const filteredData = bloodBanks.filter((item) => {
        const query = searchQuery.toLowerCase();
        return (
            item.bloodBankName?.toLowerCase().includes(query) ||
            item.registrationNumber?.toLowerCase().includes(query) ||
            item.city?.toLowerCase().includes(query) ||
            item.state?.toLowerCase().includes(query) ||
            (Array.isArray(item.bloodComponentsAvailable) &&
                item.bloodComponentsAvailable.join(', ').toLowerCase().includes(query))
        );
    });

    const openPhoneCall = (phone) => {
        if (phone) Linking.openURL(`tel:${phone}`);
    };

    const renderCard = ({ item, index }) => {
        const validImage =
            item.bloodBankExteriorPhoto &&
            (item.bloodBankExteriorPhoto.startsWith('http://') || item.bloodBankExteriorPhoto.startsWith('https://'));

        const imageSource = validImage
            ? { uri: item.bloodBankExteriorPhoto }
            : require('../../../assets/blood.png');

        return (
            <TouchableOpacity
                style={[
                    styles.card,
                    isDarkMode && styles.cardDark,
                    index === 0 && { marginTop: 16 },
                ]}
            >
                <Image source={imageSource} style={styles.image} resizeMode="cover" />

                <View style={styles.detailsContainer}>
                    <Text style={[styles.bankName, isDarkMode && styles.textLight]} numberOfLines={1}>
                        {item.bloodBankName}
                    </Text>

                    <View style={styles.infoRow}>
                        <Icon name="id-card" size={14} color={COLORS.primary} style={styles.icon} />
                        <Text style={[styles.detail, isDarkMode && styles.textLight]}>
                            Reg No: {item.registrationNumber || 'N/A'}
                        </Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Icon name="vial" size={14} color={COLORS.primary} style={styles.icon} />
                        <Text style={[styles.detail, isDarkMode && styles.textLight]}>
                            Components: {Array.isArray(item.bloodComponentsAvailable) ? item.bloodComponentsAvailable.join(', ') : 'N/A'}
                        </Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Icon name="map-marker-alt" size={14} color={COLORS.primary} style={styles.icon} />
                        <Text style={[styles.detail, isDarkMode && styles.textLight]}>
                            Location: {item.city}, {item.state}
                        </Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Icon name="calendar" size={14} color={COLORS.primary} style={styles.icon} />
                        <Text style={[styles.detail, isDarkMode && styles.textLight]}>
                            Established: {item.dateOfEstablishment}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
   
        <LinearGradient
            colors={isDarkMode ? ['#1A202C', '#2D3748'] : ['#00b4db', '#fff', '#fff']} 
            style={{ flex: 1 }}
        >
            <SafeAreaView
                style={[
                    styles.safeArea,
             
                    { backgroundColor: 'transparent' },
                ]}
            >
            
                <Header 
                    title="Blood Bank List"
                    onBackPress={() => navigation.goBack()}
                    style={{ backgroundColor: 'transparent' }}
                />

          
                <View
                    style={[
                        styles.searchBarWrapper,
                        {
                            backgroundColor: isDarkMode ? '#1c1c1e' : '#f0f0f0',
                            borderColor: isDarkMode ? '#444' : '#ddd'
                        },
                    ]}
                >
                    <Icon
                        name="search"
                        size={16}
                        color={isDarkMode ? COLORS.greyscale400 : COLORS.gray}
                        style={styles.searchIcon}
                    />
                    <TextInput
                        placeholder="Search by name, city or component"
                        placeholderTextColor={isDarkMode ? COLORS.greyscale500 : '#999'}
                        style={[styles.searchInput, { color: isDarkMode ? COLORS.white : COLORS.black }]}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                <View style={styles.container}>
                    <FlatList
                        data={filteredData}
                        keyExtractor={(item) => item._id}
                        renderItem={({ item, index }) => renderCard({ item, index })}
                        contentContainerStyle={styles.list}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={
                            <Text style={{ color: isDarkMode ? COLORS.white : COLORS.black, textAlign: 'center', marginTop: 30 }}>
                                No blood bank found.
                            </Text>
                        }
                        ListFooterComponent={<View style={{ height: 40 }} />}
                    />
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
};

export default BloodBanks;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
       
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    searchBarWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        marginTop: 10,
        paddingHorizontal: 12,
        paddingVertical: Platform.OS === 'ios' ? 10 : 8,
        borderRadius: 25,
        borderWidth: 1,
        elevation: 2,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        paddingVertical: 0,
        fontFamily: 'Urbanist-Regular',
    },
    container: {
        flex: 1,
        paddingHorizontal: SIZES.padding,
        marginTop: 10,
    },
    list: {
        paddingBottom: 20,
    },
    card: {
        flexDirection: 'row',
        width: '100%', 
        backgroundColor: COLORS.white,
        borderRadius: 16,
        marginBottom: 16,
        padding: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 5,
        alignItems: 'center',
    },
    cardDark: {
        backgroundColor: COLORS.darkCard,
        shadowColor: '#fff',
    },
    image: {
        width: 110,
        height: 110,
        borderRadius: 14,
    },
    detailsContainer: {
        flex: 1,
        marginLeft: 14,
        justifyContent: 'center',
    },
    bankName: {
        fontSize: 18,
        fontFamily: 'Urbanist-Bold',
        color: COLORS.greyscale900,
        marginBottom: 6,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 2,
    },
    icon: {
        marginRight: 8,
        width: 15,
        textAlign: 'center',
    },
    detail: {
        fontSize: 14,
        fontFamily: 'Urbanist-Regular',
        color: COLORS.grayscale700,
        flexShrink: 1,
    },
    textLight: {
        color: COLORS.white,
    },
});

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
    TextInput,
} from 'react-native';

import { useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useFocusEffect } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

import Header from '../../components/Header';
import ApiService from '../../src/api/ApiService';
import { hideLoader, showLoader } from '../../src/redux/slices/loaderSlice';
import { ENDPOINTS } from '../../src/constants/Endpoints';
import { SIZES } from '../../constants';

const { width } = Dimensions.get('window');

/* 🔴 THEME */
const RED_BG = ['#fff', '#fff', '#ffff'];
const RED_CARD_TOP = '#FFFFFF';
const RED_ACCENT = '#FF4D4D';
const RED_DARK = '#B30000';
const RED_LIGHT_BORDER = '#FFD6D6';

const UpcomingCenters = ({ navigation }) => {
    const dispatch = useDispatch();
    const [dialysisUnits, setDialysisUnits] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchDialysisUnits = async () => {
        try {
            dispatch(showLoader());
            const response = await ApiService.get(ENDPOINTS.patient_get_dialysises);
            setDialysisUnits(response.data);
        } catch (error) {
            console.log('Error fetching dialysis data:', error);
        } finally {
            dispatch(hideLoader());
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchDialysisUnits();
        }, [])
    );

    const filteredData = dialysisUnits.filter((item) => {
        const q = searchQuery.toLowerCase();
        return (
            item.dialysisUnitName?.toLowerCase().includes(q) ||
            item.city?.toLowerCase().includes(q) ||
            item.state?.toLowerCase().includes(q) ||
            item.dialysisUnitType?.toLowerCase().includes(q)
        );
    });

    const renderCard = ({ item }) => {
        const validImage =
            Array.isArray(item.dialysisUnitPhoto) &&
            item.dialysisUnitPhoto.length > 0 &&
            (item.dialysisUnitPhoto[0].startsWith('http://') ||
                item.dialysisUnitPhoto[0].startsWith('https://'));

        const imageSource = validImage
            ? { uri: item.dialysisUnitPhoto[0] }
            : require('../../assets/laboraty.jpg');

        return (
            <View style={styles.card}>
                <View style={styles.cardContentRow}>
                    <Image source={imageSource} style={styles.image} resizeMode="cover" />

                    <View style={styles.details}>
                        <Text style={styles.unitName} numberOfLines={1}>
                            {item.dialysisUnitName}
                        </Text>

                        <View style={styles.infoRow}>
                            <Icon name="id-card" size={13} color={RED_ACCENT} />
                            <Text style={styles.detail}>  Reg No: {item.registrationNumber || 'N/A'}</Text>
                        </View>

                        <View style={styles.infoRow}>
                            <Icon name="hospital" size={13} color={RED_ACCENT} />
                            <Text style={styles.detail}>  Type: {item.dialysisUnitType || 'N/A'}</Text>
                        </View>

                        <View style={styles.infoRow}>
                            <Icon name="vial" size={13} color={RED_ACCENT} />
                            <Text style={styles.detail}>
                                {' '} Dialysis:{' '}
                                {Array.isArray(item.dialysisTypesProvided)
                                    ? item.dialysisTypesProvided.join(', ')
                                    : 'N/A'}
                            </Text>
                        </View>

                        <View style={styles.infoRow}>
                            <Icon name="map-marker-alt" size={13} color={RED_ACCENT} />
                            <Text style={styles.detail}>  {item.city}, {item.state}</Text>
                        </View>

                        <View style={styles.infoRow}>
                            <Icon name="calendar" size={13} color={RED_ACCENT} />
                            <Text style={styles.detail}>  Since {item.dateOfEstablishment}</Text>
                        </View>
                    </View>
                </View>

                {/* ✅ BUTTON WRAPPER FIX */}
                <View style={styles.buttonWrapper}>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() =>
                            navigation.navigate('DialysisSelectSlot', { unitId: item._id })
                        }
                    >
                        <LinearGradient
                            colors={['#e44949', '#be48d3']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.bookButton}
                        >
                            <Icon
                                name="calendar-check"
                                size={12}
                                color="#fff"
                                style={{ marginRight: 6 }}
                            />
                            <Text style={styles.bookButtonText}>Book Dialysis</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <LinearGradient colors={RED_BG} style={{ flex: 1 }}>
            <SafeAreaView style={styles.safeArea}>
                <Header title="Dialysis Units" onBackPress={() => navigation.goBack()} />

                <View style={styles.searchBarWrapper}>
                    <Icon name="search" size={15} color={RED_ACCENT} />
                    <TextInput
                        placeholder="Search by name, city, or type"
                        placeholderTextColor="#999"
                        style={styles.searchInput}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                <View style={styles.container}>
                    <FlatList
                        data={filteredData}
                        keyExtractor={(item) => item._id}
                        renderItem={renderCard}
                        contentContainerStyle={styles.list}
                        showsVerticalScrollIndicator={false}
                        ListFooterComponent={<View style={{ height: 40 }} />}
                        ListEmptyComponent={
                            <Text style={{ textAlign: 'center', marginTop: 20, color: RED_DARK }}>
                                No dialysis units found.
                            </Text>
                        }
                    />
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
};

export default UpcomingCenters;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    container: {
        flex: 1,
        paddingHorizontal: 12,
    },
    list: {
        paddingBottom: 20,
        alignItems: 'center',
    },
    card: {
        width: width * 0.92,
        backgroundColor: RED_CARD_TOP,
        borderRadius: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: RED_LIGHT_BORDER,
        elevation: 4,
        overflow: 'hidden',
    },
   cardContentRow: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
},

    image: {
        width: 95,
        height: 95,
        borderRadius: 12,
         alignSelf: 'center',
    },
    details: {
        flex: 1,
        paddingLeft: 10,
    },
    unitName: {
        fontSize: 17,
        fontFamily: 'Urbanist-Bold',
        color: '#000',
        marginBottom: 4,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 1,
    },
    detail: {
        fontSize: 13,
        color: '#444',
        fontFamily: 'Urbanist-Regular',
        flexShrink: 1,
    },

    /* ✅ IMPORTANT FIX */
    buttonWrapper: {
        width: '100%',
        paddingHorizontal: 12,
        marginTop: 2,
        marginBottom: 10,
    },
    bookButton: {
        paddingVertical: 7,
        paddingHorizontal: 14,
        borderRadius: 10,
        alignSelf: 'flex-end',
        flexDirection: 'row',
        alignItems: 'center',
    },
    bookButtonText: {
        color: '#fff',
        fontFamily: 'Urbanist-SemiBold',
        fontSize: 13,
    },

    searchBarWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 12,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: RED_LIGHT_BORDER,
    },
    searchInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: 14,
        color: '#000',
    },
});

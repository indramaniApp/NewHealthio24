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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

import { COLORS, SIZES } from '../../../constants/theme';
import defaultHospitalImage from '../../../assets/hospital.png';
import Header from '../../../components/Header';
import { hideLoader, showLoader } from '../../redux/slices/loaderSlice';
import ApiService from '../../api/ApiService';
import { ENDPOINTS } from '../../constants/Endpoints';
import { useTheme } from '../../../theme/ThemeProvider';

const { width } = Dimensions.get('window');

const Hospital = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const { dark } = useTheme();

    const [hospitals, setHospitals] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchHospitals = async () => {
        try {
            dispatch(showLoader());
            const response = await ApiService.get(ENDPOINTS.patient_get_hospitals);
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

    const filteredHospitals = hospitals.filter((hospital) =>
        hospital.hospitalName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCardPress = (hospitalData) => {
        navigation.navigate('HospitalDetailScreen', {
            hospitalId: hospitalData._id,
            hospitalData: hospitalData,
        });
    };

    const renderHospitalCard = ({ item }) => {
        const imageSource = item.hospitalExteriorPhoto?.startsWith('http')
            ? { uri: item.hospitalExteriorPhoto }
            : defaultHospitalImage;

        return (
            <TouchableOpacity
                activeOpacity={0.9}
                style={[styles.card, { backgroundColor: dark ? COLORS.dark2 : COLORS.white }]}
                onPress={() => handleCardPress(item)}
            >
                <View style={styles.cardContent}>
                    <View style={styles.imageWrapper}>
                        <Image source={imageSource} style={styles.circularImage} resizeMode="cover" />
                    </View>

                    <View style={styles.infoContainer}>
                        <Text
                            style={[styles.hospitalName, { color: dark ? COLORS.white : COLORS.black }]}
                            numberOfLines={1}
                        >
                            {item.hospitalName}
                        </Text>

                        <View style={styles.dataGrid}>
                            <Text style={styles.detail} numberOfLines={1}>
                                <Text style={styles.label}>Reg:</Text> {item.registrationNumber || 'N/A'}
                            </Text>
                            <Text style={styles.detail} numberOfLines={1}>
                                <Text style={styles.label}>Type:</Text>{' '}
                                {Array.isArray(item.hospitalType)
                                    ? item.hospitalType[0]
                                    : item.hospitalType || 'N/A'}
                            </Text>
                            <Text style={styles.detail} numberOfLines={1}>
                                <Text style={styles.label}>Loc:</Text> {item.city}
                            </Text>
                            <Text style={styles.detail} numberOfLines={1}>
                                <Text style={styles.label}>Spec:</Text>{' '}
                                {Array.isArray(item.specializationsOffered)
                                    ? item.specializationsOffered[0]
                                    : 'N/A'}
                            </Text>
                        </View>

                        <View style={styles.bottomRow}>
                            <View style={styles.statusBadge}>
                                <View style={styles.dot} />
                                <Text style={styles.statusText}>
                                    {item.hospitalStatus || 'Active'}
                                </Text>
                            </View>
                            <Text style={styles.outreachText}>
                                Outreach: {item.outReachProgramsStatus ? 'Yes' : 'No'}
                            </Text>
                        </View>
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.nextButton}
                    onPress={() => handleCardPress(item)}
                >
                  <LinearGradient
    colors={ ['#1ca5e0', '#2b83e9']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
    style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderRadius: 18,
    }}
>
    <Text
        style={{
            color: '#FFFFFF',
            fontSize: 12,
            fontWeight: 'bold',
            marginRight: 5,
        }}
    >
        View
    </Text>

    <Icon name="arrow-right" size={14} color="#FFFFFF" />
</LinearGradient>

                </TouchableOpacity>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />

            <View style={styles.container}>
                <Header title="Hospital List" onBackPress={() => navigation.goBack()} />

                <View
                    style={[
                        styles.searchBarWrapper,
                        { backgroundColor: dark ? COLORS.dark2 : '#f5f5f5' },
                    ]}
                >
                    <Icon
                        name="magnify"
                        size={20}
                        color={dark ? COLORS.greyscale400 : COLORS.gray}
                    />
                    <TextInput
                        placeholder="Search hospitals..."
                        placeholderTextColor={dark ? COLORS.greyscale500 : '#999'}
                        style={[
                            styles.searchInput,
                            { color: dark ? COLORS.white : COLORS.black },
                        ]}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                <FlatList
                    data={filteredHospitals}
                    keyExtractor={(item) => item._id}
                    renderItem={renderHospitalCard}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>No hospitals found.</Text>
                    }
                />
            </View>
        </SafeAreaView>
    );
};

export default Hospital;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    searchBarWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: SIZES.padding,
        marginTop: 10,
        marginBottom: 10,
        paddingHorizontal: 15,
        height: 50,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: '#eee',
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        marginLeft: 10,
    },
    list: {
        paddingHorizontal: 15,
        paddingTop: 10,
        paddingBottom: 100,
    },
    card: {
        width: '100%',
        borderRadius: 20,
        marginBottom: 16,
        padding: 15,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
        elevation: 3,
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    imageWrapper: {
        width: 90,
        height: 100,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: COLORS.primary,
        padding: 2,
        backgroundColor: '#fff',
    },
    circularImage: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
    },
    infoContainer: {
        flex: 1,
        marginLeft: 15,
    },
    hospitalName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    dataGrid: {
        flexDirection: 'column',
    },
    detail: {
        fontSize: 13,
        color: '#666',
        marginBottom: 4,
    },
    label: {
        fontWeight: '700',
        color: COLORS.primary,
    },
    bottomRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e8f5e9',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 10,
        marginRight: 10,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#4caf50',
        marginRight: 5,
    },
    statusText: {
        fontSize: 10,
        color: '#2e7d32',
        fontWeight: 'bold',
    },
    outreachText: {
        fontSize: 11,
        color: '#888',
    },
    nextButton: {
        position: 'absolute',
        bottom: 12,
        right: 12,
    },
    simpleBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
        backgroundColor: COLORS.primary,
    },
    btnText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
        marginRight: 4,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 40,
        color: '#999',
    },
});

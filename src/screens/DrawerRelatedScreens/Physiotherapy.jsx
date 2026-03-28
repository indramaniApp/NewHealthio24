import React, { useCallback, useState } from 'react';
import {
    FlatList,
    Text,
    TouchableOpacity,
    View,
    StyleSheet,
    Image,
    SafeAreaView,
    Platform,
    StatusBar,
    TextInput,
} from 'react-native';
import Header from '../../../components/Header';
import { COLORS, SIZES } from '../../../constants';
import { hideLoader, showLoader } from '../../redux/slices/loaderSlice';
import ApiService from '../../api/ApiService';
import { ENDPOINTS } from '../../constants/Endpoints';
import { useDispatch } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import LinearGradient from 'react-native-linear-gradient';

const placeholderImage = require('../../../assets/physiotherapy.png');

const Physiotherapy = ({ navigation }) => {
    const [physiotherapy, setPhysiotherapy] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const dispatch = useDispatch();

    const fetchPhysiotherapy = async () => {
        try {
            dispatch(showLoader());
            const response = await ApiService.get(ENDPOINTS.patient_get_physiotherapys);
            setPhysiotherapy(response.data);
        } catch (error) {
            console.log('Error fetching physiotherapy:', error);
        } finally {
            dispatch(hideLoader());
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchPhysiotherapy();
        }, [])
    );

    const filteredData = physiotherapy.filter((item) => {
        const q = searchQuery.toLowerCase();
        return (
            item.centreName?.toLowerCase().includes(q) ||
            item.city?.toLowerCase().includes(q) ||
            item.state?.toLowerCase().includes(q) ||
            item.centreType?.toLowerCase().includes(q) ||
            item.registrationNumber?.toLowerCase().includes(q)
        );
    });

    const renderCentreCard = ({ item }) => {
        const {
            centreName,
            registrationNumber,
            dateOfEstablishment,
            centreType,
            street,
            city,
            state,
            postalCode,
            centreExteriorPhoto,
        } = item;

        const validUrl =
            typeof centreExteriorPhoto === 'string' &&
            centreExteriorPhoto.length > 5 &&
            (centreExteriorPhoto.startsWith('http://') || centreExteriorPhoto.startsWith('https://'));

        const imageSource = validUrl ? { uri: centreExteriorPhoto } : placeholderImage;

        return (
            <View style={styles.card}>
                {/* Image left */}
                <Image source={imageSource} style={styles.image} resizeMode="cover" />

                {/* Content right */}
                <View style={styles.cardContent}>
                    <Text style={styles.name}>{centreName}</Text>

                    <View style={styles.row}>
                        <View style={styles.iconCircle}>
                            <Icon name="id-card" size={14} color={COLORS.primary} />
                        </View>
                        <Text style={styles.text}>
                            <Text style={styles.label}>Reg.No:</Text> {registrationNumber}
                        </Text>
                    </View>

                    <View style={styles.row}>
                        <View style={styles.iconCircle}>
                            <Icon name="calendar-alt" size={14} color={COLORS.primary} />
                        </View>
                        <Text style={styles.text}>
                            <Text style={styles.label}>Established:</Text> {dateOfEstablishment}
                        </Text>
                    </View>

                    <View style={styles.row}>
                        <View style={styles.iconCircle}>
                            <Icon name="hospital" size={14} color={COLORS.primary} />
                        </View>
                        <Text style={styles.text}>
                            <Text style={styles.label}>Type:</Text> {centreType}
                        </Text>
                    </View>

                    <View style={styles.row}>
                        <View style={styles.iconCircle}>
                            <Icon name="map-marker-alt" size={14} color={COLORS.primary} />
                        </View>
                        <Text style={styles.text}>
                            <Text style={styles.label}>Address:</Text> {`${street}, ${city}, ${state}, ${postalCode}`}
                        </Text>
                    </View>

                    <TouchableOpacity
                        style={styles.bookButton}
                        onPress={() => navigation.navigate('PhysiotherapySelectSlot', { centreId: item._id })}
                    >
                        <Text style={styles.bookButtonText}>Book Physiotherapy</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient
                colors={['#fff', '#e0f7fa', '#fff']}
                style={styles.gradientContainer}
            >
                <Header title="Physiotherapy Centresss List" onBackPress={() => navigation.goBack()} />

                {/* Search Bar */}
                <View style={styles.searchBarWrapper}>
                    <Icon name="search" size={16} color={COLORS.gray} style={styles.searchIcon} />
                    <TextInput
                        placeholder="Search by name, city, or type"
                        placeholderTextColor="#999"
                        style={[styles.searchInput, { color: COLORS.black }]}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                {/* List */}
                <FlatList
                    data={filteredData}
                    keyExtractor={(item) => item._id}
                    renderItem={renderCentreCard}
                    contentContainerStyle={{ padding: 16 }}
                    ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
                    showsVerticalScrollIndicator={false}
                    ListFooterComponent={<View style={{ height: 100 }} />}
                    ListEmptyComponent={
                        <Text style={{ textAlign: 'center', marginTop: 20, color: COLORS.black }}>
                            No physiotherapy centres found.
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
        backgroundColor: '#f5f7fa',
    },
    gradientContainer: {
        flex: 1,
    },
    searchBarWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: SIZES.padding,
        marginVertical: 10,
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 30,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        paddingVertical: 0,
        fontFamily: 'Urbanist-Regular',
        color: '#333',
    },
    card: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 4,
        overflow: 'hidden',
        marginVertical: 8,
        alignItems:'center'
    },
    image: {
        width: 100,
        height: 100,
       borderRadius:10,
        marginLeft: 10,
    },
    cardContent: {
        flex: 1,
        padding: 12,
        justifyContent: 'center',
    },
    name: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.primary,
        marginBottom: 6,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    iconCircle: {
        width: 26,
        height: 26,
        borderRadius: 13,
        backgroundColor: '#e0f7fa',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    text: {
        fontSize: 13,
        color: '#555',
        flexShrink: 1,
    },
    label: {
        fontWeight: '600',
        color: COLORS.primary,
    },
    separator: {
        height: 1,
        backgroundColor: '#eee',
        marginVertical: 4,
    },
    bookButton: {
        marginTop: 8,
        backgroundColor: COLORS.primary,
        paddingVertical: 8,
        paddingHorizontal: 18,
        borderRadius: 25,
        alignSelf: 'flex-start',
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 2,
    },
    bookButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 15,
    },
});


export default Physiotherapy;

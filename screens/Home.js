import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, Image, RefreshControl, Modal } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { COLORS, SIZES, icons, images } from '../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-virtualized-view';
import { useTheme } from '../theme/ThemeProvider';
import { banners, categories } from '../data';
import SubHeaderItem from '../components/SubHeaderItem';
import Category from '../components/Category';
import HorizontalDoctorCard from '../components/HorizontalDoctorCard';
import ApiService from '../src/api/ApiService';
import { ENDPOINTS } from '../src/constants/Endpoints';
import { useDispatch } from 'react-redux';
import { hideLoader, showLoader } from '../src/redux/slices/loaderSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import user from '../assets/icons/user-default3.png';
import LocationScreen from '../src/components/LocationScreen';

const Home = ({ navigation }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const { dark, colors } = useTheme();
    const [drawerVisible, setDrawerVisible] = useState(false); 
    const [AllDoctors, setAllDoctors] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showAll, setShowAll] = useState(false); 
    const [profile, setProfile] = useState([]); 
    const [refreshing, setRefreshing] = useState(false);
    const [searchText, setSearchText] = useState(''); 
    const dispatch = useDispatch();

    const [showTestModal, setShowTestModal] = useState(false);

    const handleOpenTestModal = () => setShowTestModal(true);
    const handleCloseTestModal = () => setShowTestModal(false);

    const handleSingleTest = () => {
        handleCloseTestModal();
        navigation.navigate('PathologyScreen');
    };

    const handleTestPackages = () => {
        handleCloseTestModal();
        navigation.navigate('PathologyPackages');
    };

    const FetchAllDocotr = async () => {
        try {
            dispatch(showLoader());
            let response = await ApiService.get(ENDPOINTS.patient_get_doctors);
            setAllDoctors(response.data);
            dispatch(hideLoader());
        } catch (error) {
            console.log('error=======', error);
            dispatch(hideLoader());
        }
    };

    const onRefresh = async () => {
        try {
            setRefreshing(true);
            if (!refreshing) {
                dispatch(showLoader());
            }
            await Promise.all([FetchAllDocotr()]);
        } catch (error) {
            console.log("Refresh error", error);
        } finally {
            setRefreshing(false);
            dispatch(hideLoader());
        }
    };

    useFocusEffect(
        useCallback(() => {
            FetchAllDocotr();
        }, [])
    );

    useEffect(() => {
        const checkLoginStatus = async () => {
            const token = await AsyncStorage.getItem('USER_TOKEN');
            if (token) {
                setIsLoggedIn(true);
            } else {
                setIsLoggedIn(false);
                navigation.replace('OTP');
            }
        };
        checkLoginStatus();
    }, [navigation]);

    const renderHeader = () => (
        <View style={styles.headerContainer}>
            {/* Left: User Profile */}
            <View style={styles.viewLeft}>
                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                    <Image
                        source={user}
                        style={{ width: 32, height: 32, borderRadius: 16 }}
                        resizeMode="cover"
                    />
                </TouchableOpacity>
            </View>

            {/* Center: Location */}
            {/* <View style={styles.viewCenter}>
                <LocationScreen />
            </View> */}

            {/* Right: Icons */}
            <View style={styles.viewRight}>
                <TouchableOpacity onPress={() => navigation.navigate("Notifications")}>
                    <Image
                        source={icons.notificationBell2}
                        resizeMode='contain'
                        style={[styles.bellIcon, { tintColor: dark ? COLORS.white : COLORS.greyscale900 }]}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("Favourite")}>
                    <Image
                        source={icons.heartOutline}
                        resizeMode='contain'
                        style={[styles.bookmarkIcon, { tintColor: dark ? COLORS.white : COLORS.greyscale900 }]}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderSearchBar = () => {
        const handleInputFocus = () => {
            navigation.navigate('DoctorsSearch');
        };

        return (
            <View
                style={[
                    styles.searchBarContainer,
                    { backgroundColor: dark ? COLORS.dark2 : COLORS.secondaryWhite },
                ]}
            >
                <Image source={icons.search2} resizeMode="contain" style={styles.searchIcon} />
                <TextInput
                    placeholder="Search"
                    placeholderTextColor={COLORS.gray}
                    style={[styles.searchInput, { color: dark ? COLORS.white : COLORS.black }]}
                    onFocus={handleInputFocus}
                />
            </View>
        );
    };

    const renderBanner = () => {
        const renderBannerItem = ({ item }) => (
            <View style={styles.bannerContainer}>
                <View style={styles.bannerTopContainer}>
                    <View>
                        <Text style={styles.bannerDicount}>{item.discount} OFF</Text>
                        <Text style={styles.bannerDiscountName}>{item.discountName}</Text>
                    </View>
                    <Text style={styles.bannerDiscountNum}>{item.discount}</Text>
                </View>
                <View style={styles.bannerBottomContainer}>
                    <Text style={styles.bannerBottomTitle}>{item.bottomTitle}</Text>
                    <Text style={styles.bannerBottomSubtitle}>{item.bottomSubtitle}</Text>
                </View>
            </View>
        );

        return (
            <View style={styles.bannerItemContainer}>
                <FlatList
                    data={banners}
                    renderItem={renderBannerItem}
                    keyExtractor={(item) => item.id.toString()}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onMomentumScrollEnd={(event) => {
                        const newIndex = Math.round(event.nativeEvent.contentOffset.x / SIZES.width);
                        setCurrentIndex(newIndex);
                    }}
                />
                <View style={styles.dotContainer}>
                    {banners.map((_, index) => (
                        <View key={index} style={[styles.dot, index === currentIndex && styles.activeDot]} />
                    ))}
                </View>
            </View>
        );
    };

    const renderCategories = () => (
        <View>
            <SubHeaderItem title="Categories" navTitle="See all" onPress={() => navigation.navigate("Categories")} />
            <FlatList
                data={categories.slice(1, 9)}
                keyExtractor={(item, index) => index.toString()}
                horizontal={false}
                numColumns={4}
                renderItem={({ item }) => (
                    <Category
                        name={item.name}
                        icon={item.icon}
                        iconColor={item.iconColor}
                        backgroundColor={item.backgroundColor}
                        onPress={() => {
                            if (item.icon === icons.more3) {
                                navigation.navigate("Categories");
                            } else {
                                navigation.navigate('CategoriesScreen', { categoryName: item.name });
                            }
                        }}
                    />
                )}
            />
        </View>
    );


    const renderServiceCardsGrid = () => {
        return (
            <View style={styles.serviceCardsGridContainer}>
                {/* Pathology Card */}
                <TouchableOpacity
                    onPress={() => navigation.navigate('TestBookingScreen')}
                    style={[styles.gridCard, { marginRight: 8 }]} 
                >
                    <View style={styles.gridCardIconContainer}>
                        <MaterialCommunityIcons name="test-tube" size={24} color={COLORS.white} />
                    </View>
                    <Text style={styles.gridCardTitle}>Pathology Services</Text>
                    <Text style={styles.gridCardSubtitle}>Book tests & checkups</Text>
                </TouchableOpacity>

                {/* Hospital Card */}
                <TouchableOpacity
                    onPress={() => navigation.navigate('Hospital')}
                    style={[styles.gridCard, { marginLeft: 8 }]}
                >
                    <View style={styles.gridCardIconContainer}>
                        <MaterialCommunityIcons name="hospital-building" size={24} color={COLORS.white} />
                    </View>
                    <Text style={styles.gridCardTitle}>Hospital Services</Text>
                    <Text style={styles.gridCardSubtitle}>Find top hospitals</Text>
                </TouchableOpacity>
            </View>
        );
    };

  
    const renderCompactServiceCards = () => {
        const compactServices = [
            { id: '1', name: 'Patient Mitra', icon: 'account-heart', screen: 'PatientMiraHome', description: '24x7 help & support' },
            { id: '2', name: 'Dialysis', icon: 'water-pump', screen: 'Dialysis', description: 'Specialized help & care' },
            { id: '3', name: 'Physiotherapy', icon: 'run', screen: 'PhysiotherapyHomeScreen', description: 'Rehab & care support' },
        ];

        return (
            <View style={styles.compactCardsContainer}>
                {compactServices.map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        onPress={() => navigation.navigate(item.screen)}
                        style={styles.compactCard}
                    >
                        <View style={styles.compactCardIconContainer}>
                            <MaterialCommunityIcons name={item.icon} size={20} color={COLORS.white} />
                        </View>
                        <Text style={styles.compactCardTitle}>{item.name}</Text>
                        <Text style={styles.compactCardSubtitle}>{item.description}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        );
    };


    const renderTopDoctors = () => {
        return (
            <View style={{ paddingHorizontal: 0.5, paddingTop: 12 }}>
                <SubHeaderItem
                    title="Top Doctors"
                    navTitle="See all"
                    onPress={() => {
                        navigation.navigate("SeeAllDoctorList");
                    }}
                />
                <FlatList
                    data={AllDoctors}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={{
                        paddingBottom: 40,
                        marginTop: 16,
                        backgroundColor: dark ? COLORS.dark1 : COLORS.secondaryWhite,
                        borderRadius: 10,
                        padding: 2,
                    }}
                    ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => {
                        const specializationText = Array.isArray(item.specialization)
                            ? item.specialization.join(', ')
                            : item.specialization || 'Specialization not specified';

                        const surgeryText = Array.isArray(item.surgery)
                            ? item.surgery.join(', ')
                            : item.surgery || 'Surgery info not specified';

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
                                    navigation.navigate("DoctorDetails", {
                                        fullName: item.fullName,
                                        yearsOfExperience: item.yearsOfExperience,
                                        specialization: specializationText,
                                        doctorRating: item.doctorRating,
                                        doctorId: item._id,
                                        streetAddress: item.streetAddress,
                                        average_rating: item.average_rating,
                                        rating_total_count: item.rating_total_count,
                                        about_me: item.about_me,
                                        consultationDate: item.consultationDate,
                                        consultationTime: item.consultationTime,
                                        previous_OPD_Number: item.previous_OPD_Number,
                                        reviews: item.reviews,
                                        consultationTimeVideo: item.consultationTimeVideo,
                                        consultationTimeAudio: item.consultationTimeAudio,
                                        consultationTimeHomeVisit: item.consultationTimeHomeVisit,
                                        profilePhoto: item.profilePhoto,
                                    })
                                }
                            />
                        );
                    }}
                />
            </View>
        );
    };

    return (
        <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                {renderHeader()}
                <ScrollView
                    contentContainerStyle={[styles.scrollContainer, { paddingBottom: 60 }]}
                    showsVerticalScrollIndicator={false}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                >
                    {renderSearchBar()}
                    {renderBanner()}
                    {renderCategories()}

                    {/* Render Pathology and Hospital cards side-by-side */}
                    <SubHeaderItem title="Our Services" />
                    {renderServiceCardsGrid()}

                    {/* Render Patient Mitra, Dialysis, Physiotherapy as compact cards */}
                    {renderCompactServiceCards()}

                    {renderTopDoctors()}
                </ScrollView>
            </View>
            {showTestModal && (
                <Modal
                    visible={showTestModal}
                    transparent
                    animationType="fade"
                    onRequestClose={handleCloseTestModal}
                >
                    <View style={{
                        flex: 1,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <View style={{
                            width: '80%',
                            backgroundColor: COLORS.white,
                            padding: 20,
                            borderRadius: 16,
                            alignItems: 'center',
                        }}>
                            <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 20 }}>
                                Choose Your Test Type
                            </Text>

                            <TouchableOpacity
                                style={{
                                    backgroundColor: COLORS.primary,
                                    padding: 12,
                                    borderRadius: 8,
                                    marginVertical: 6,
                                    width: '100%',
                                    alignItems: 'center',
                                }}
                                onPress={handleSingleTest}
                            >
                                <Text style={{ color: COLORS.white, fontWeight: '600' }}>You want single test</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{
                                    backgroundColor: COLORS.primary,
                                    padding: 12,
                                    borderRadius: 8,
                                    marginVertical: 6,
                                    width: '100%',
                                    alignItems: 'center',
                                }}
                                onPress={handleTestPackages}
                            >
                                <Text style={{ color: COLORS.white, fontWeight: '600' }}>You want test packages</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{ marginTop: 10 }}
                                onPress={handleCloseTestModal}
                            >
                                <Text style={{ color: 'red', fontWeight: '500' }}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    area: {
        flex: 1,
        backgroundColor: COLORS.white
    },
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
        padding: 16
    },
    headerContainer: {
        flexDirection: "row",
        width: SIZES.width - 32,
        justifyContent: "space-between",
        alignItems: "center"
    },
    userIcon: {
        width: 48,
        height: 48,
        borderRadius: 32
    },
    viewLeft: {
        flexDirection: "row",
        alignItems: "center"
    },
    greeeting: {
        fontSize: 15,
        fontFamily: "Urbanist Regular",
        color: "gray",
        marginBottom: 4
    },
    title: {
        fontSize: 18,
        fontFamily: "Urbanist Bold",
        color: COLORS.greyscale900
    },
    viewNameContainer: {
        marginLeft: 12
    },
    viewRight: {
        flexDirection: "row",
        alignItems: "center"
    },
    bellIcon: {
        height: 24,
        width: 24,
        tintColor: COLORS.black,
        marginRight: 8
    },
    bookmarkIcon: {
        height: 24,
        width: 24,
        tintColor: COLORS.black
    },
    searchBarContainer: {
        width: SIZES.width - 32,
        paddingHorizontal: 16,
        borderRadius: 12,
        height: 52,
        marginVertical: 16,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.secondaryWhite,
    },
    searchIcon: {
        height: 24,
        width: 24,
        tintColor: COLORS.gray,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        fontFamily: 'Urbanist-Regular',
        marginHorizontal: 8,
        paddingVertical: 0,
    },
    filterIcon: {
        width: 24,
        height: 24,
        tintColor: COLORS.primary,
    },
    bannerContainer: {
        width: SIZES.width - 32,
        height: 154,
        paddingHorizontal: 28,
        paddingTop: 28,
        borderRadius: 32,
        backgroundColor: COLORS.primary
    },
    bannerTopContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    bannerDicount: {
        fontSize: 12,
        fontFamily: "Urbanist Medium",
        color: COLORS.white,
        marginBottom: 4
    },
    bannerDiscountName: {
        fontSize: 16,
        fontFamily: "Urbanist Bold",
        color: COLORS.white
    },
    bannerDiscountNum: {
        fontSize: 46,
        fontFamily: "Urbanist Bold",
        color: COLORS.white
    },
    bannerBottomContainer: {
        marginTop: 8
    },
    bannerBottomTitle: {
        fontSize: 14,
        fontFamily: "Urbanist Medium",
        color: COLORS.white
    },
    bannerBottomSubtitle: {
        fontSize: 14,
        fontFamily: "Urbanist Medium",
        color: COLORS.white,
        marginTop: 4
    },
    userAvatar: {
        width: 64,
        height: 64,
        borderRadius: 999
    },
    firstName: {
        fontSize: 16,
        fontFamily: "Urbanist SemiBold",
        color: COLORS.dark2,
        marginTop: 6
    },
    bannerItemContainer: {
        width: "100%",
        paddingBottom: 10,
        backgroundColor: COLORS.primary,
        height: 170,
        borderRadius: 32,
    },
    dotContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#ccc',
        marginHorizontal: 5,
    },
    activeDot: {
        backgroundColor: COLORS.white,
    },
    menuCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: COLORS.tansparentPrimary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    userDefaultImage: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: COLORS.lightGray,
    },
    viewCenter: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    locationText: {
        fontSize: 16,
        fontWeight: '600',
    },
    // New styles for service cards grid
    serviceCardsGridContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 2, // Keep some margin from screen edges
        marginTop: 12,
        marginBottom: 12, // Space after these cards
    },
    gridCard: {
        backgroundColor: COLORS.primary,
        borderRadius: 20,
        padding: 15,
        flex: 1, // Ensures cards take equal space
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: 140, // Consistent height for grid cards
    },
    gridCardIconContainer: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 14,
        padding: 10,
        marginBottom: 8,
    },
    gridCardTitle: {
        fontSize: 14,
        fontFamily: 'Urbanist-Bold',
        color: COLORS.white,
        textAlign: 'center',
        marginBottom: 4,
    },
    gridCardSubtitle: {
        fontSize: 10,
        fontFamily: 'Urbanist-Regular',
        color: '#f0f0f0',
        textAlign: 'center',
    },
    // New styles for compact service cards
    compactCardsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 2,
        marginTop: 12, // Adjust margin as needed
        flexWrap: 'wrap', // Allow cards to wrap to next line
    },
    compactCard: {
        backgroundColor: COLORS.primary,
        borderRadius: 15,
        padding: 12,
        width: '31%', // Approx. 1/3rd width for 3 cards in a row with spacing
        aspectRatio: 1, // Make it a square card for better appearance
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12, 
      
        marginHorizontal: '1%', 
    },
    compactCardIconContainer: {
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: 10,
        padding: 8,
        marginBottom: 6,
    },
    compactCardTitle: {
        fontSize: 12,
        fontFamily: 'Urbanist-Bold',
        color: COLORS.white,
        textAlign: 'center',
    },
    compactCardSubtitle: {
        fontSize: 9, // Even smaller for compact
        fontFamily: 'Urbanist-Regular',
        color: '#f0f0f0',
        textAlign: 'center',
        marginTop: 2,
    },
});

export default Home;
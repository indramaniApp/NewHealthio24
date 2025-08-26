import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, Image, RefreshControl } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { COLORS, SIZES, icons, images } from '../constants'; 
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-virtualized-view';
import { useTheme } from '../theme/ThemeProvider';
import SubHeaderItem from '../components/SubHeaderItem';
import HorizontalDoctorCard from '../components/HorizontalDoctorCard';
import ApiService from '../src/api/ApiService';
import { ENDPOINTS } from '../src/constants/Endpoints';
import { useDispatch } from 'react-redux';
import { hideLoader, showLoader } from '../src/redux/slices/loaderSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import user from '../assets/icons/user-default3.png';




export const banners = [
    {
        id: 1,
        discount: "40%",
        discountName: "On your first booking",
        bottomTitle: "Use code 'FIRST40'",
        bottomSubtitle: "Valid for new users only",
    },
    {
        id: 2,
        discount: "25%",
        discountName: "Weekend Health Checkup",
        bottomTitle: "Full body checkup",
        bottomSubtitle: "Book now for this weekend",
    },
];


const lightenColor = (rgbaColor) => {
    const [r, g, b] = rgbaColor.match(/\d+/g).map(Number);
    const newR = Math.min(255, r + 60);
    const newG = Math.min(255, g + 60);
    const newB = Math.min(255, b + 60);
    return `rgba(${newR}, ${newG}, ${newB}, 1)`;
};


const originalCategories = [
    { id: "1", name: "Physician", icon: icons.friends, iconColor: "rgba(36, 107, 253, 1)" },
    { id: "2", name: "Dentist", icon: icons.tooth, iconColor: "rgba(0, 184, 217, 1)" },
    { id: "3", name: "Eye Specialist", icon: icons.eye, iconColor: "rgba(126, 87, 194, 1)" },
    { id: "4", name: "Nutritionist", icon: icons.nutrition1, iconColor: "rgba(76, 175, 80, 1)" },
    { id: "5", name: "Neurologist", icon: icons.brain, iconColor: "rgba(236, 64, 122, 1)" },
    { id: "6", name: "Dietitian", icon: icons.dietitian, iconColor: "rgba(156, 204, 101, 1)" },
    { id: "7", name: "Ear Nose Throat Specialist", icon: icons.ent, iconColor: "rgba(255, 167, 38, 1)" },
    { id: "8", name: "Stomach Specialist", icon: icons.stomatch, iconColor: "rgba(161, 136, 127, 1)" },
    { id: "9", name: "More", icon: icons.more3, iconColor: "rgba(144, 164, 174, 1)" },
    { id: "10", name: "Women Health", icon: icons.childspeciality, iconColor: "rgba(240, 98, 146, 1)" },
    { id: "11", name: "Skin & Hair", icon: icons.skin, iconColor: "rgba(255, 204, 128, 1)" },
    { id: "12", name: "Diabetes Specialist", icon: icons.sugar, iconColor: "rgba(66, 165, 245, 1)" },
    { id: "13", name: "Kidney Specialist", icon: icons.kidney, iconColor: "rgba(229, 115, 115, 1)" },
    { id: "14", name: "Child Specialist", icon: icons.children, iconColor: "rgba(255, 202, 40, 1)" },
    { id: "15", name: "Bone Joints", icon: icons.joint2, iconColor: "rgba(120, 144, 156, 1)" },
    { id: "16", name: "Lungs Specialist", icon: icons.activity, iconColor: "rgba(79, 195, 247, 1)" },
    { id: "17", name: "Brain Specialist", icon: icons.brain2, iconColor: "rgba(171, 71, 188, 1)" },
    { id: "18", name: "Mental Health", icon: icons.brain, iconColor: "rgba(38, 166, 154, 1)" },
    { id: "19", name: "Cancer Specialist", icon: icons.cancer, iconColor: "rgba(149, 117, 205, 1)" },
    { id: "20", name: "Liver Specialist", icon: icons.liver, iconColor: "rgba(198, 40, 40, 1)" },
    { id: "46", name: "Cardiologist", icon: icons.cardiologist, iconColor: "rgba(211, 47, 47, 1)" },
    { id: "47", name: "Dermatologist", icon: icons.dermatology, iconColor: "rgba(255, 138, 101, 1)" },
    { id: "48", name: "Neurologist", icon: icons.brain, iconColor: "rgba(171, 71, 188, 1)" },
    { id: "49", name: "Psychiatrist", icon: icons.psychiatrist, iconColor: "rgba(0, 121, 107, 1)" },
    { id: "50", name: "ENT Surgeon", icon: icons.ent, iconColor: "rgba(255, 143, 0, 1)" }
];


const categories = originalCategories.map(category => ({
    ...category,
    gradientColors: [category.iconColor, lightenColor(category.iconColor)]
}));


const Home = ({ navigation }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const { dark, colors } = useTheme();
    const [AllDoctors, setAllDoctors] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const dispatch = useDispatch();

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
            <View style={styles.viewLeft}>
                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                    <Image
                        source={user}
                        style={{ width: 32, height: 32, borderRadius: 16 }}
                        resizeMode="cover"
                    />
                </TouchableOpacity>
            </View>
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
            <LinearGradient
                colors={['#A569BD', '#8A3FFC']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.searchBarContainer}
            >
                <Image
                    source={icons.search2}
                    resizeMode="contain"
                    style={[styles.searchIcon, { tintColor: COLORS.white }]}
                />
                <TextInput
                    placeholder="Search for doctors, clinics..."
                    placeholderTextColor={'rgba(255, 255, 255, 0.8)'}
                    style={[styles.searchInput, { color: COLORS.white }]}
                    onFocus={handleInputFocus}
                />
            </LinearGradient>
        );
    };

    const renderBanner = () => {
        const renderBannerItem = ({ item }) => (
            <LinearGradient
                colors={['#80D8FF', '#00BFA5']}
                style={styles.bannerContainer}>
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
            </LinearGradient>
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
                keyExtractor={(item) => item.id.toString()}
                horizontal={false}
                numColumns={4}
                scrollEnabled={false} 
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.categoryContainer}
                        onPress={() => {
                            if (item.name === "More") {
                                navigation.navigate("Categories");
                            } else {
                                navigation.navigate('CategoriesScreen', { categoryName: item.name });
                            }
                        }}
                    >
                        <LinearGradient
                            colors={item.gradientColors}
                            style={styles.categoryGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        >
                            <Image
                                source={item.icon}
                                style={styles.categoryIcon}
                                resizeMode="contain"
                            />
                        </LinearGradient>
                        <Text style={[styles.categoryName, { color: colors.text }]}>{item.name}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );

    const renderAdCard = () => (
        <TouchableOpacity
            onPress={() => console.log("Ad Card Pressed!")}
            style={{ marginTop: 24, marginBottom: 12 }}
        >
            <LinearGradient
                colors={['#A569BD', '#8A3FFC']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.adCardContainer}
            >
                <View style={styles.adCardContent}>
                    <View>
                        <Text style={styles.adCardTitle}>Upload Prescription</Text>
                        <Text style={styles.adCardSubtitle}>Get medicines delivered</Text>
                    </View>
                    <TouchableOpacity style={styles.adCardButton}>
                        <Text style={styles.adCardButtonText}>Upload</Text>
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );

    const renderServiceCardsGrid = () => (
        <View style={styles.serviceCardsGridContainer}>
            <TouchableOpacity
                onPress={() => navigation.navigate('TestBookingScreen')}
                style={[styles.gridCard, { backgroundColor: '#50E3C2', marginRight: 8 }]}>
                <View style={styles.gridCardIconContainer}>
                    <MaterialCommunityIcons name="test-tube" size={24} color={COLORS.white} />
                </View>
                <Text style={styles.gridCardTitle}>Pathology</Text>
                <Text style={styles.gridCardSubtitle}>Book Tests & Checkups</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => navigation.navigate('Hospital')}
                style={{ flex: 1, marginLeft: 8 }}>
                <LinearGradient
                    colors={['#56CCF2', '#2F80ED']}
                    style={styles.gridCard}>
                    <View style={styles.gridCardIconContainer}>
                        <MaterialCommunityIcons name="hospital-building" size={24} color={COLORS.white} />
                    </View>
                    <Text style={styles.gridCardTitle}>Hospital</Text>
                    <Text style={styles.gridCardSubtitle}>Get expert advice</Text>
                </LinearGradient>
            </TouchableOpacity>
        </View>
    );

    const renderCompactServiceCards = () => {
        const compactServices = [
            { id: '1', name: 'Patient-Mitra', icon: 'account-heart', screen: 'PatientMiraHome', description: '24x7 help & support', color: '#E573B5' },
            { id: '2', name: 'Dialysis', icon: 'water-pump', screen: 'Dialysis', description: 'Specialized kidney care', color: '#8A3FFC' },
            { id: '3', name: 'Physiotherapy', icon: 'run', screen: 'PhysiotherapyHomeScreen', description: 'Rehab & care support', color: '#7ED321' },
        ];

        return (
            <View style={styles.compactCardsContainer}>
                {compactServices.map((item) => (
                    <TouchableOpacity
                        key={item.id}
                        onPress={() => navigation.navigate(item.screen)}
                        style={[styles.compactCard, { backgroundColor: item.color }]}
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

    const renderTopDoctors = () => (
        <View style={{ paddingHorizontal: 0.5, paddingTop: 12 }}>
            <SubHeaderItem
                title="Top Doctors"
                navTitle="See all"
                onPress={() => { navigation.navigate("SeeAllDoctorList"); }}
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
                              navigation.navigate("DoctorDetails", { doctor: item })
                            }
                        />
                    );
                }}
            />
        </View>
    );

    return (
        <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                {renderHeader()}
                <ScrollView
                    contentContainerStyle={{ paddingBottom: 60 }}
                    showsVerticalScrollIndicator={false}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                >
                    {renderSearchBar()}
                    {renderBanner()}
                    {renderCategories()}
                    {/* {renderAdCard()} */}
                    <SubHeaderItem title="Our Services" />
                    {renderServiceCardsGrid()}
                    {renderCompactServiceCards()}
                    {renderTopDoctors()}
                </ScrollView>
            </View>
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
    viewLeft: {
        flexDirection: "row",
        alignItems: "center"
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
        borderRadius: 15,
        height: 52,
        marginVertical: 16,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#00BFA5',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
    },
    searchIcon: {
        height: 24,
        width: 24,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        fontFamily: 'Urbanist-Regular',
        marginHorizontal: 8,
        paddingVertical: 0,
    },
    bannerContainer: {
        width: SIZES.width - 32,
        height: 154,
        paddingHorizontal: 28,
        paddingTop: 28,
        borderRadius: 32,
    },
    bannerItemContainer: {
        width: "100%",
        height: 170,
        borderRadius: 32,
        overflow: 'hidden'
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
    dotContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 10,
        width: '100%'
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'rgba(255,255,255,0.5)',
        marginHorizontal: 5,
    },
    activeDot: {
        backgroundColor: COLORS.white,
    },
    

    categoryContainer: {
        flex: 1,
        alignItems: 'center',
        marginVertical: 12,
    },
    categoryGradient: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 6,
    },
    categoryIcon: {
        width: 32,
        height: 32,
        tintColor: COLORS.white,
    },
    categoryName: {
        fontSize: 12,
        fontFamily: 'Urbanist-Medium',
        textAlign: 'center',
        width: '95%',
    },

    adCardContainer: {
        borderRadius: 16,
        paddingHorizontal: 20,
        paddingVertical: 15,
        height: 80,
        justifyContent: 'center'
    },
    adCardContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    adCardTitle: {
        fontSize: 16,
        fontFamily: 'Urbanist-Bold',
        color: COLORS.white,
    },
    adCardSubtitle: {
        fontSize: 12,
        fontFamily: 'Urbanist-Regular',
        color: 'rgba(255, 255, 255, 0.8)',
        marginTop: 4,
    },
    adCardButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
    },
    adCardButtonText: {
        color: COLORS.white,
        fontFamily: 'Urbanist-Bold',
        fontSize: 12,
    },
    serviceCardsGridContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 2,
        marginTop: 12,
        marginBottom: 12,
    },
    gridCard: {
        borderRadius: 20,
        padding: 15,
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: 140,
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
    compactCardsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 2,
        marginTop: 12,
        flexWrap: 'wrap',
    },
    compactCard: {
        borderRadius: 15,
        padding: 12,
        width: '31%',
        aspectRatio: 1,
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
        fontSize: 9,
        fontFamily: 'Urbanist-Regular',
        color: '#f0f0f0',
        textAlign: 'center',
        marginTop: 2,
    },
});

export default Home;
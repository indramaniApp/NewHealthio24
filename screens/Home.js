
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList, Image, RefreshControl, StatusBar } from 'react-native';
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
import { useFocusEffect,DrawerActions } from '@react-navigation/native';


import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import user from '../assets/icons/user-default3.png';
// The banner image is now imported and ready to be used
import banner from '../assets/newAssets/banner.png'
import hospital from '../assets/newAssets/hospital.png'
import dialysis from '../assets/newAssets/dialysis.png'
import physiotherapy from '../assets/newAssets/physiotherapy.png'
import discount from '../assets/newAssets/discount.png'
// Import your card images
// import hosptial from '../assets/hop.png'
// import pathology from '../assets/path.png'

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
const bannerImages = [banner, hospital, dialysis, physiotherapy,discount];

const lightenColor = (rgbaColor) => {
    const [r, g, b] = rgbaColor.match(/\d+/g).map(Number);
    const newR = Math.min(255, r + 60);
    const newG = Math.min(255, g + 60);
    const newB = Math.min(255, b + 60);
    return `rgba(${newR}, ${newG}, ${newB}, 1)`;
};
const compactServices = [
  {
    id: '1',
    name: 'Patient-Mitra',
    icon: 'account-heart',
    description: 'Get 24x7 dedicated support and personalized assistance for all your medical needs and hospital coordination.',
    screen: 'PatientMitra',
  },
  {
    id: '2',
    name: 'Dialysis',
    icon: 'water-pump',
    description: 'Expert kidney care and dialysis sessions scheduled at top-rated medical centers near your location.',
    screen: 'Dialysis',
  },
  {
    id: '3',
    name: 'Physiotherapy',
    icon: 'run',
    description: 'In-home or clinic-based rehabilitation programs designed by professional physiotherapists for faster recovery.',
    screen: 'Physiotherapy',
  },
];

const serviceColors = [
  { bg: '#E1F5FE', iconBg: '#81D4FA', iconColor: '#01579B' }, // Light Blue
  { bg: '#EDE7F6', iconBg: '#B39DDB', iconColor: '#4527A0' }, // Soft Purple
  { bg: '#E0F2F1', iconBg: '#80CBC4', iconColor: '#004D40' }, // Teal
  { bg: '#FFF8E1', iconBg: '#FFE082', iconColor: '#FF6F00' }, // Amber/Gold
];

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
  gradientColors: [category.iconColor, lightenColor(category.iconColor)],
  iconColor: '#fff'
}));

/* 🔥 FRONT PAGE CATEGORY MAPPING */
const frontCategoryMap = {
  Physician: 'General Physician',
  Gynaecologist: 'Gynaecologist',
  'Child Specialist': 'Paediatrician',
  'Bone Joints': 'Orthopedist',
  'Eye Specialist': 'Eye Specialist',
  Cardiologist: 'Cardiologist',
  Neurologist: 'Neurologist',
  Dentist: 'Dentist',
  'Ear Nose Throat Specialist': 'ENT',
};
const frontCategories = Object.values(
  categories
    .filter(cat => frontCategoryMap[cat.name])
    .reduce((acc, cat) => {
      if (!acc[cat.name]) {
        acc[cat.name] = {
          ...cat,
          displayName: frontCategoryMap[cat.name],
        };
      }
      return acc;
    }, {})
);


// const categories = originalCategories.map(category => ({
//     ...category,
//     gradientColors: [category.iconColor, lightenColor(category.iconColor)],
//     iconColor: '#fff'
// }));
const categoryColorMap = {
  'General Physician': { bg: '#C8E6C9', icon: '#2E7D32' },
  Dentist: { bg: '#BBDEFB', icon: '#1565C0' },
  'Eye Specialist': { bg: '#E1BEE7', icon: '#6A1B9A' },
  Neurologist: { bg: '#FFE0B2', icon: '#EF6C00' },
  ENT: { bg: '#F8BBD0', icon: '#AD1457' },
  Paediatrician: { bg: '#E3F2FD', icon: '#0277BD' },
  Orthopedist: { bg: '#ECEFF1', icon: '#455A64' },
  Cardiologist: { bg: '#FFCDD2', icon: '#C62828' },
};


const DIALYSIS_RED_THEME = {
  bg: '#FFE5E5',        // light red card background
  iconBg: '#FF4D4D',    // bright red icon circle
  iconColor: '#FFFFFF', // white icon + button text
};

const Home = ({ navigation }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const { dark, colors } = useTheme();
    const [AllDoctors, setAllDoctors] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [videoAppointmentCount, setVideoAppointmentCount] = useState(0);
    const dispatch = useDispatch();

    const FetchAllDocotr = async () => {
        try {
            dispatch(showLoader());
            let response = await ApiService.get(ENDPOINTS.patient_get_doctors);
            console.log('responsedata========',response)
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
const fetchVideoCount = async () => {
    try {
        const response = await ApiService.get(ENDPOINTS.patient_approved_video_appointments_count);
        // Fix: response.data.appointments se count uthayein
        const count = response?.data?.appointments || 0;
        console.log('Final Count Set:', count);
        setVideoAppointmentCount(Number(count));
    } catch (error) {
        console.log("Video Count Error:", error);
        setVideoAppointmentCount(0);
    }
};
    useFocusEffect(
        useCallback(() => {
            FetchAllDocotr();
            fetchVideoCount();
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
      <TouchableOpacity
        onPress={() => {
          navigation.dispatch(DrawerActions.openDrawer());
        }}
      >
        <Image
          source={user}
          style={{ width: 32, height: 32, borderRadius: 16 }}
          resizeMode="cover"
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
                colors={['#fff', '#fff']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.searchBarContainer}
            >
                <Image
                    source={icons.search2}
                    resizeMode="contain"
                    style={[styles.searchIcon, { tintColor: COLORS.black }]}
                />
                <TextInput
                    placeholder="Search for doctors, clinics..."
                    placeholderTextColor={'#000)'}
                    style={[styles.searchInput, { color: COLORS.black }]}
                    onFocus={handleInputFocus}
                />
            </LinearGradient>
        );
    };

// Is block ko "Home" component ke bahar (top par) ya "const Home = ..." ke andar start mein rakhein
const bannerWidth = SIZES.width - 32;

const renderBanner = () => {
  const [currentBanner, setCurrentBanner] = useState(0);
  const bannerRef = React.useRef(null);

  // Auto-scroll logic
  useEffect(() => {
    if (bannerImages.length > 0) {
      const interval = setInterval(() => {
        let nextIndex = (currentBanner + 1) % bannerImages.length;
        setCurrentBanner(nextIndex);
        
        // Safety check to ensure ref is attached
        if (bannerRef.current) {
          bannerRef.current.scrollToIndex({ index: nextIndex, animated: true });
        }
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [currentBanner]);

  return (
    <View style={styles.bannerImageContainer}>
      <FlatList
        ref={bannerRef}
        data={bannerImages}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
        // Image ki width ko explicitly handle karna zaroori hai
        renderItem={({ item }) => (
          <View style={{ width: bannerWidth, height: 160 }}>
            <Image
              source={item}
              style={styles.bannerImage}
              resizeMode="cover"
            />
          </View>
        )}
        // Layout calculations for smooth scrolling
        getItemLayout={(_, index) => ({
          length: bannerWidth,
          offset: bannerWidth * index,
          index,
        })}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / bannerWidth);
          setCurrentBanner(index);
        }}
      />
      
      {/* Dots / Pagination */}
      <View style={styles.pagination}>
        {bannerImages.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              { 
                backgroundColor: index === currentBanner ? '#fff' : 'rgba(255,255,255,0.4)',
                width: index === currentBanner ? 20 : 8 // Active dot ko lamba dikhane ke liye
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};



const renderCategories = () => (
  <View style={{ paddingHorizontal: 2 }}>
    <SubHeaderItem
      title="Categories"
      navTitle="See all"
      onPress={() => navigation.navigate("Categories")}
       titleStyle={{ fontSize: 26, color: '#fff', fontWeight: '800' }}
    />

    <FlatList
      data={frontCategories}
      keyExtractor={(item) => item.id.toString()}
      numColumns={2}
      scrollEnabled={false}
      columnWrapperStyle={{
        justifyContent: 'space-between',
        marginBottom: 14,
      }}
      renderItem={({ item }) => {
      const theme =
  categoryColorMap[item.displayName] ||
  { bg: '#ECEFF1', icon: '#607D8B' };


        return (
          <TouchableOpacity
            activeOpacity={0.85}
            style={[styles.categoryCard, { backgroundColor: theme.bg }]}
           onPress={() =>
  navigation.navigate('CategoriesScreen', {
    categoryName: item.displayName,  // 👈 ab ENT aa jayega
  })

            }
          >
            {/* ICON */}
            <View
              style={[
                styles.categoryIconBox,
                { backgroundColor: theme.icon },
              ]}
            >
              <Image
                source={item.icon}
                style={styles.categoryIcon}
                resizeMode="contain"
              />
            </View>

            {/* TEXT */}
            <Text style={styles.categoryTitle} numberOfLines={2}>
              {item.displayName}
            </Text>

            {/* DECORATIVE CIRCLE */}
            <View
              style={[
                styles.decorCircle,
                { borderColor: theme.icon },
              ]}
            />
          </TouchableOpacity>
        );
      }}
    />
  </View>
);


// *** MODIFIED FUNCTION WITH PATHOLOGY ICON & BUTTON GRADIENT ***
const renderServiceCardsGrid = () => {
  return (
    <View style={styles.serviceCardsGridContainer}>
      {[
        {
          title: 'Pathology',
          sub: 'Book comprehensive lab tests, full body checkups, and receive digital reports directly on your phone.',
          icon: 'test-tube',
          bgGradient: ['#F8BBD0', '#F48FB1'],       // Gradient for card background
          iconGradient: ['#F48FB1', '#AD1457'],     // SAME as TestBookingScreen
          iconColor: '#fff',                        // Icon white on gradient
          nav: 'TestBookingScreen'
        },
        { 
          title: 'Hospital', 
          sub: 'Find and book appointments at the best hospitals nearby with real-time availability and emergency care.', 
          icon: 'hospital-building', 
          bgGradient: ['#68cdf8', '#4A90E2'], 
          iconGradient: ['#FF8A65', '#BF360C'], 
          iconColor: '#fff', 
          nav: 'Hospital' 
        }
      ].map((item, index) => (
        <TouchableOpacity
          key={index}
          activeOpacity={0.85}
          onPress={() => navigation.navigate(item.nav)}
          style={{ borderRadius: 16, marginBottom: 16, overflow: 'hidden' }} // Rounded corners + gradient overflow
        >
          <LinearGradient
            colors={item.bgGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gridServiceCard}
          >
            {/* Icon with gradient circle */}
            <LinearGradient
              colors={item.title === 'Pathology' ? ['#F48FB1', '#AD1457'] : item.iconGradient} 
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gridIconBox}
            >
              <MaterialCommunityIcons name={item.icon} size={26} color={item.iconColor} />
            </LinearGradient>

            <View style={{ flex: 1, paddingBottom: 20 }}>
              <Text style={styles.gridTitle}>{item.title}</Text>
              <Text style={styles.gridSubtitle}>{item.sub}</Text>
              
              {/* GO TO SCREEN BUTTON */}
              <LinearGradient
                colors={item.title === 'Pathology' ? ['#F48FB1', '#AD1457'] : ['#ccc', '#999']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.btnContainer, { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, alignSelf: 'flex-start', marginTop: 8 }]}
              >
                <Text style={[styles.btnText, { color: '#fff' }]}>Go to screen</Text>
                <MaterialCommunityIcons name="arrow-right-circle" size={18} color="#fff" style={{ marginLeft: 4 }} />
              </LinearGradient>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      ))}
    </View>
  );
};







const renderCompactServiceCards = () => {
  return (
    <View style={{ marginTop: 4 }}>
      {compactServices.map((item, index) => {

        // Default color from array
        let color = serviceColors[index % serviceColors.length];

        // 🔴 Override ONLY for Dialysis
        if (item.name?.toLowerCase().includes('dialysis')) {
          color = DIALYSIS_RED_THEME;
        }

        return (
          <TouchableOpacity
            key={item.id}
            onPress={() => navigation.navigate(item.screen)}
            activeOpacity={0.85}
            style={[styles.serviceCard, { backgroundColor: color.bg }]}
          >
            <View style={[styles.serviceIconBox, { backgroundColor: color.iconBg }]}>
              <MaterialCommunityIcons name={item.icon} size={24} color={color.iconColor} />
            </View>

            <View style={{ flex: 1, paddingBottom: 20 }}>
              <Text style={styles.serviceTitle}>{item.name}</Text>
              <Text style={styles.serviceSubtitle}>{item.description}</Text>
              
             <View style={styles.btnContainer}>
  <Text
    style={[
      styles.btnText,
      { color: item.name?.toLowerCase().includes('dialysis') ? '#D10000' : color.iconColor }
    ]}
  >
    Go to screen
  </Text>

  <MaterialCommunityIcons
    name="arrow-right-circle"
    size={18}
    color={item.name?.toLowerCase().includes('dialysis') ? '#D10000' : color.iconColor}
  />
</View>

            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};



  const renderTopDoctors = () => (
    <View style={{ paddingHorizontal: 0.5, paddingTop: 12 }}>
        <SubHeaderItem
            title="Top Doctors"
            navTitle="See all"
            onPress={() => { navigation.navigate("SeeAllDoctorList"); }}
             titleStyle={{ fontSize: 26, color: '#000', fontWeight: '800' }}
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

                const stateText = Array.isArray(item.state)
                    ? item.state.join(', ')
                    : item.state || 'State not specified';

                return (
                    <HorizontalDoctorCard
                        name={item.fullName}
                        image={item.profilePhoto}
                        yearsOfExperience={item.yearsOfExperience}
                        specialization={specializationText}
                        state={stateText}

                        /* ✅ Teen fees pass ki */
                        // consultationFeeHomeVisit={item.consultationFeeHomeVisit}
                        consultationFeeInPerson={item.consultationFeeInPerson}
                        // consultationFeeVideoCall={item.consultationFeeVideoCall}

                        rating={item.average_rating || 0}
                        numReviews={item.rating_total_count || 0}
                        isAvailable={item.isAvailable}

                        onPress={() =>
                            navigation.navigate("DoctorDetails", { doctor: item })
                        }
                    />
                );
            }}
        />
    </View>
);

const renderVideoCallCard = () => {
    // 2 appointments ke liye condition check
    const hasAppointments = videoAppointmentCount > 0;

    return (
        <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => navigation.navigate('VideoAppointments')} 
            style={styles.videoCallCard}
        >
            <LinearGradient
                colors={['#1A237E', '#303F9F', '#3F51B5']} // 🔵 Deep Royal Blue Theme
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.videoGradient}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={styles.videoIconContainer}>
                        <MaterialCommunityIcons name="video-wireless" size={32} color="#fff" />
                        
                        {/* RED CIRCLE BADGE */}
                        {hasAppointments && (
                            <View style={styles.badgeWrapper}>
                                <LinearGradient
                                    colors={['#FF5252', '#D32F2F']} 
                                    style={styles.badgeGradient}
                                >
                                    <Text style={styles.badgeText}>{videoAppointmentCount}</Text>
                                </LinearGradient>
                            </View>
                        )}
                    </View>
                    
                    <View style={{ flex: 1, marginLeft: 15 }}>
                        <Text style={styles.videoTitle}>Video Consultation</Text>
                        <Text style={[styles.videoStatusBadge, { color: hasAppointments ? '#FFCDD2' : '#C5CAE9' }]}>
                           {hasAppointments ? 'ACTIVE APPOINTMENTS' : 'NO SCHEDULED CALLS'}
                        </Text>
                    </View>
                    <MaterialCommunityIcons name="chevron-right" size={28} color="rgba(255,255,255,0.7)" />
                </View>

                <View style={{ marginTop: 15, paddingRight: 10 }}>
                    <Text style={styles.videoSub}>
                        Talk to your specialist online. High-quality video calls for your follow-ups and consultations.
                    </Text>
                    
                    {hasAppointments ? (
                        <View style={styles.appointmentDetailBox}>
                            <MaterialCommunityIcons name="calendar-check" size={16} color="#fff" />
                            <Text style={styles.videoAppointText}>
                                You have {videoAppointmentCount} sessions approved by doctor
                            </Text>
                        </View>
                    ) : (
                        <Text style={styles.videoAppointText}>No upcoming video calls found.</Text>
                    )}
                </View>

                <View style={styles.videoFooter}>
                    <Text style={styles.videoFooterText}>Join Meeting Now</Text>
                    <MaterialCommunityIcons name="arrow-right" size={14} color="#fff" />
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );
};

    return (
     <LinearGradient
            colors={['#001F3F', '#003366', '#fff', '#fff']}
            style={{ flex: 1 }}
        >
          <StatusBar
      barStyle="light-content"     // icons white
      backgroundColor="#001F3F"    // Android ke liye important
      translucent={false}
    />
            <SafeAreaView style={styles.area}>
                <View style={styles.container}>
                    {renderHeader()}
                    <ScrollView
                        contentContainerStyle={{ paddingBottom: 60 }}
                        showsVerticalScrollIndicator={false}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    >
                        {renderSearchBar()}
                        {renderBanner()}
                        {renderCategories()}
                        <SubHeaderItem title="Our Services"
                         titleStyle={{ fontSize: 26, color: '#000', fontWeight: '800' }}
                        />
                        {renderServiceCardsGrid()}
                        {renderCompactServiceCards()}
                        {renderVideoCallCard()}
                        {renderTopDoctors()}
                    </ScrollView>
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
};

// *** ADDED & MODIFIED STYLES ***
const styles = StyleSheet.create({
    area: {
        flex: 1,
    },
    container: {
        flex: 1,
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
        alignItems: "center",
        height: 42,
        width: 42,
        backgroundColor: "#fff",
        borderRadius: 21,
       
    },
    viewRight: {
        flexDirection: "row",
        alignItems: "center"
    },
    searchBarContainer: {
        width: SIZES.width - 32,
        paddingHorizontal: 16,
        borderRadius: 15,
        height: 52,
        marginVertical: 16,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#4CAF50',
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
    bannerImageContainer: {
        width: SIZES.width - 32,
        height: 160,
        borderRadius: 20,
        overflow: 'hidden',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    bannerImage: {
        width: '100%',
        height: '100%',
    },
    categoryContainer: {
        flex: 1,
        alignItems: 'center',
        marginVertical: 12,
    },
    categoryCircle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
        backgroundColor: "#0077b6",
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 6,
    },
    categoryIcon: {
        width: 32,
        height: 32,
    },
    catDecorCircle: {
        position: 'absolute',
        right: -15,
        bottom: -15,
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 15,
        opacity: 0.3,
    },
    categoryName: {
        fontSize: 12,
        fontFamily: 'Urbanist-Medium',
        textAlign: 'center',
        width: '95%',
        color: COLORS.white,
    },
 serviceCardsGridContainer: {
        marginTop: 12,
    },
  gridServiceCard: {
        minHeight: 135, // Button ke liye height thodi badhai hai
        flexDirection: 'row',
       alignItems: 'center',
        borderRadius: 22,
        paddingHorizontal: 16,
        paddingVertical: 16,
        marginBottom: 14,
        elevation: 2,
        paddingBottom:20
    },
    btnContainer: {
        position: 'absolute',
        bottom: -5,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.4)', // Light glass effect
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        marginTop:5
    },
    btnText: {
        fontSize: 12,
        fontFamily: 'Urbanist-Bold',
        marginRight: 4,
    },
    gridIconBox: {
        height: 48,
        width: 48,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    gridTitle: {
        fontSize: 16,
        fontFamily: 'Urbanist-Bold',
        color: '#212121',
        fontWeight:'bold'
    },
  gridSubtitle: {
        fontSize: 13,
        fontFamily: 'Urbanist-Medium',
        color: '#424242',
        marginTop: 4,
        lineHeight: 18,
        paddingBottom: 5,
        paddingRight: 10, // Button se overlap na ho
        fontWeight:"bold"
    },

gridRightImage: {
  width: 56,
  height: 56,
  resizeMode: 'contain',
  marginLeft: 8,
},

    // Modified gridCard style
    gridCard: {
        borderRadius: 20,
        flex: 1,
        height: 140,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
       
    },
    // New style for the image inside the grid card
    gridCardImage: {
        width: '100%',
        height: '100%',
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
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    compactCardIconContainer: {
        borderRadius: 10,
        padding: 8,
        marginBottom: 6,
    },
    compactCardTitle: {
        fontSize: 12,
        fontFamily: 'Urbanist-Bold',
        color: COLORS.white,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    compactCardSubtitle: {
        fontSize: 10,
        fontFamily: 'Urbanist-Regular',
        color: COLORS.white,
        textAlign: 'center',
        fontWeight: 'bold',
        marginTop: 2,
       
    },
    singleCard: {
  height: 70,                // 🔥 screenshot jaisi height
  flexDirection: "row",
  alignItems: "center",
  backgroundColor: "#F5F7FF", // light bluish bg
  borderRadius: 12,
  paddingHorizontal: 16,
  marginBottom: 12,

  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.08,
  shadowRadius: 4,
  elevation: 3,
},

iconBox: {
  height: 42,
  width: 42,
  borderRadius: 10,
  backgroundColor: "#E6EBFF", // icon bg
  alignItems: "center",
  justifyContent: "center",
  marginRight: 14,
},

icon: {
  height: 24,
  width: 24,
},

cardText: {
  fontSize: 16,
  fontWeight: "600",
  color: "#1A1A1A",
},
serviceCard: {
        minHeight: 135, // Same height as grid cards for consistency
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 20,
        paddingHorizontal: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.02)',
    },

serviceIconBox: {
        height: 48,
        width: 48,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },

serviceTitle: {
        fontSize: 16,
        fontFamily: 'Urbanist-Bold',
        color: '#212121',
        fontWeight:"bold"
    },
  serviceSubtitle: {
        fontSize: 12,
        fontFamily: 'Urbanist-Medium',
        color: '#424242',
        marginTop: 4,
        lineHeight: 18,
        paddingRight: 10,
        paddingBottom: 5,
        fontWeight:"bold"
    },
catCard: {
        width: (SIZES.width - 44) / 2,
        height: 70, // Compact horizontal height
        borderRadius: 16,
        paddingHorizontal: 12,
        flexDirection: 'row', // Horizontal alignment
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    catTextWrapper: {
        flex: 1,
    },
    catCardTitle: {
        fontSize: 13,
        fontFamily: 'Urbanist-Bold',
        color: '#212121',
        lineHeight: 16,
    },
    catIconWrapper: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    catIconContainer: {
        marginTop: 15,
        alignItems: 'flex-start',
    },
    catIcon: {
        width: 24,
        height: 24,
    },
   pagination: {
    position: 'absolute',
    bottom: 10,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
},
dot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
    marginHorizontal: 4,
},
categoryCard: {
  width: (SIZES.width - 44) / 2,
  height: 88,
  borderRadius: 18,
  padding: 14,
  flexDirection: 'row',
  alignItems: 'center',
  position: 'relative',
  overflow: 'hidden',   // 🔥 IMPORTANT

  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.08,
  shadowRadius: 4,
  elevation: 3,
},


categoryIconBox: {
  width: 42,
  height: 42,
  borderRadius: 12,
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: 12,
},

categoryIcon: {
  width: 22,
  height: 22,
  tintColor: '#fff',
},

categoryTitle: {
  flex: 1,
  fontSize: 14,
  fontFamily: 'Urbanist-Bold',
  color: '#263238',
  lineHeight: 18,
  fontWeight:"bold"
},

decorCircle: {
  position: 'absolute',
  right: -18,
  bottom: -18,
  width: 70,
  height: 70,
  borderRadius: 35,
  borderWidth: 14,
  opacity: 0.15,
},
// Isse exact icon ke top-right par alignment mil jayegi
    badgeWrapper: {
        position: 'absolute',
        top: -6,
        right: -6,
        zIndex: 10, // Sabse upar dikhne ke liye
    },
    badgeGradient: {
        width: 22,
        height: 22,
        borderRadius: 11,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#fff',
        elevation: 4,
    },
    badgeText: {
        color: 'white',
        fontSize: 10,
        fontFamily: 'Urbanist-Bold',
        includeFontPadding: false,
        textAlignVertical: 'center',
    },
    videoCallCard: {
        marginVertical: 14,
        borderRadius: 22,
        overflow: 'hidden',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
    },
    videoGradient: {
        padding: 22,
    },
    videoIconContainer: {
        position: 'relative', // IMPORTANT for badge positioning
        backgroundColor: 'rgba(255,255,255,0.2)',
        padding: 12,
        borderRadius: 16,
    },
    videoTitle: {
        color: '#fff',
        fontSize: 19,
        fontFamily: 'Urbanist-Bold',
    },
    videoStatusBadge: {
        color: '#B2DFDB',
        fontSize: 10,
        fontFamily: 'Urbanist-Bold',
        marginTop: 2,
        letterSpacing: 1.2,
    },
    videoSub: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 13,
        fontFamily: 'Urbanist-Medium',
        lineHeight: 19,
    },
    appointmentDetailBox: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
        backgroundColor: 'rgba(255,255,255,0.15)',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 10,
        alignSelf: 'flex-start',
    },
    videoAppointText: {
        color: '#fff',
        fontSize: 12,
        fontFamily: 'Urbanist-SemiBold',
        marginLeft: 8,
    },
    videoFooter: {
        marginTop: 18,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.2)',
        flexDirection: 'row',
        alignItems: 'center',
    },
    videoFooterText: {
        color: '#fff',
        fontSize: 14,
        fontFamily: 'Urbanist-Bold',
        marginRight: 8,
    },
    // Removed unused styles to keep it clean
});

export default Home;
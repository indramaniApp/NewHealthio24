import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  FlatList,
  useWindowDimensions,
  Image,
  Platform,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { useDispatch } from 'react-redux';

import Header from '../../components/Header';
import ApiService from '../../src/api/ApiService';
import { ENDPOINTS } from '../../src/constants/Endpoints';
import { showLoader, hideLoader } from '../../src/redux/slices/loaderSlice';
import banner1 from '../../assets/newAssets/banner1.png';
import banner2 from '../../assets/newAssets/banner2.png';
import discountBanner from '../../assets/newAssets/discountbanner.png';

/* -------------------- ADS DATA -------------------- */
const banners = [
  { id: '1', image: banner1 },
  { id: '2', image: banner2 },
  { id: '3', image: discountBanner },
];

const AUTO_SCROLL_TIME = 3500;
const ICON_COLOR = '#fff'; // Icon white on gradient

/* -------------------- SCREEN -------------------- */
const TestBookingScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const flatListRef = useRef(null);
  const { width } = useWindowDimensions();

  const [activeIndex, setActiveIndex] = useState(0);
  const [scheduledCount, setScheduledCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [testCount, setTestCount] = useState(0);
  const [packageCount, setPackageCount] = useState(0);

  /* ---------------- API CALLS ---------------- */
  useFocusEffect(
    useCallback(() => {
      fetchBookingCount();
      fetchCartCount();
    }, [])
  );

  const fetchBookingCount = async () => {
    try {
      dispatch(showLoader());
      const res = await ApiService.get(ENDPOINTS.approved_pathology_appointments_count);
      if (res?.status === 'success') {
        setScheduledCount(res.data?.scheduled || 0);
        setCompletedCount(res.data?.completed || 0);
      }
    } finally {
      dispatch(hideLoader());
    }
  };

  const fetchCartCount = async () => {
    try {
      const res = await ApiService.get(ENDPOINTS.comparison_tests_packages_count);
      if (res?.status === 'success') {
        setTestCount(res.data?.pathologyTests || 0);
        setPackageCount(res.data?.pathologyTestPackages || 0);
      }
    } catch {}
  };

  /* ---------------- AUTO SCROLL ---------------- */
  useEffect(() => {
    const timer = setInterval(() => {
      const next = activeIndex === banners.length - 1 ? 0 : activeIndex + 1;
      flatListRef.current?.scrollToIndex({ index: next, animated: true });
      setActiveIndex(next);
    }, AUTO_SCROLL_TIME);

    return () => clearInterval(timer);
  }, [activeIndex]);

  /* ---------------- COMPONENTS ---------------- */
  const renderBannerItem = ({ item }) => (
    <View style={{ width, alignItems: 'center', justifyContent: 'center' }}>
      <Image
        source={item.image}
        style={{ width: width - 32, height: 160, borderRadius: 20 }}
        resizeMode="cover"
      />
    </View>
  );

  const Card = ({
    icon,
    title,
    subtitle,
    onPress,
    badges = [],
    iconGradientColors = ['#F06292', '#6A1B9A'],
    badgeGradientColors = ['#F06292', '#6A1B9A'],
  }) => (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress}>
      <View style={styles.card}>
        <View style={styles.iconWrapper}>
          <LinearGradient
            colors={iconGradientColors}
            style={styles.iconBox}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <MaterialCommunityIcons name={icon} size={28} color={ICON_COLOR} />
          </LinearGradient>

          {badges.map((b, i) => (
            <LinearGradient
              key={i}
              colors={b.gradientColors || badgeGradientColors}
              style={[styles.badge, { top: b.top }]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.badgeText}>{b.value}</Text>
            </LinearGradient>
          ))}
        </View>

        <View style={styles.cardText}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardSubtitle}>{subtitle}</Text>
        </View>

        <LinearGradient
          colors={iconGradientColors}
          style={styles.chevronBox}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <MaterialCommunityIcons name="chevron-right" size={26} color="#fff" />
        </LinearGradient>
      </View>
    </TouchableOpacity>
  );

  /* ---------------- RENDER ---------------- */
  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <SafeAreaView style={{ flex: 1, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}>
        <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

        {/* Header */}
        <Header
          title="Test Bookings"
          onBackPress={() => navigation.goBack()}
          style={{ backgroundColor: 'transparent', marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 }}
          titleColor="#6A1B9A"
        />

        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
        >
          {/* Banner */}
          <View style={{ height: 180 }}>
            <FlatList
              ref={flatListRef}
              data={banners}
              horizontal
              pagingEnabled
              snapToInterval={width}
              decelerationRate="fast"
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.id}
              renderItem={renderBannerItem}
              getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
            />
            <View style={styles.dotRow}>
              {banners.map((_, i) => (
                <View key={i} style={[styles.dot, { opacity: activeIndex === i ? 1 : 0.3 }]} />
              ))}
            </View>
          </View>

          {/* Cards */}
          <View style={styles.container}>
            <Card
              icon="flask-outline"
              title="Book Single Tests"
              subtitle="Blood, thyroid, sugar & individual lab tests."
              onPress={() => navigation.navigate('PathologyScreen')}
              badges={[{ value: testCount, top: -6, gradientColors: ['#F06292', '#6A1B9A'] }]}
            />

            <Card
              icon="package-variant-closed"
              title="Book Test Packages"
              subtitle="Full body & wellness health checkups."
              onPress={() => navigation.navigate('PathologyPackages')}
              badges={[{ value: packageCount, top: -6, gradientColors: ['#FF9800', '#F44336'] }]}
            />

            <Card
              icon="test-tube"
              title="Book Tests / Packages"
              subtitle="Browse all tests and packages together."
              onPress={() => navigation.navigate('CombinationPackages')}
              badges={[
                { value: testCount, top: -6, gradientColors: ['#4CAF50', '#2196F3'] },
                { value: packageCount, top: 18, gradientColors: ['#4CAF50', '#2196F3'] },
              ]}
            />

            <Card
              icon="clipboard-text"
              title="Check Your Bookings"
              subtitle="Scheduled & completed lab bookings."
              onPress={() => navigation.navigate('BookingList')}
              badges={[
                { value: scheduledCount, top: -6, gradientColors: ['#9C27B0', '#3F51B5'] },
                { value: completedCount, top: 18, gradientColors: ['#9C27B0', '#3F51B5'] },
              ]}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default TestBookingScreen;

const styles = StyleSheet.create({
  scrollContent: { paddingTop: 12, paddingBottom: 40 },
  container: { padding: 18, backgroundColor: 'transparent' },

  dotRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 2 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#fff', marginHorizontal: 5 },

  /* Cards */
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 26,
    padding: 20,
    marginBottom: 22,
    elevation: 4,
  },
  iconWrapper: { width: 60, height: 60, marginRight: 18 },
  iconBox: {
    width: 60,
    height: 60,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chevronBox: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    right: -6,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  cardText: { flex: 1 },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#6A1B9A' },
  cardSubtitle: { marginTop: 6, fontSize: 14, color: '#666' },
});

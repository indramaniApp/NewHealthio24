import {
    View,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
    FlatList,
    Modal,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeProvider';
import { COLORS, SIZES, icons } from '../constants';
import { ScrollView } from 'react-native-virtualized-view';
import ReviewCard from '../components/ReviewCard';
import Button from '../components/Button';
import { useDispatch } from 'react-redux';
import { hideLoader, showLoader } from '../src/redux/slices/loaderSlice';
import LinearGradient from 'react-native-linear-gradient';

const DoctorDetails = ({ navigation, route }) => {
    const doctor = route?.params?.doctor || {};
    console.log('doctor====s===', doctor);
    const dispatch = useDispatch();
    const { dark } = useTheme();
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(() => {
        dispatch(showLoader());
        const timeout = setTimeout(() => {
            dispatch(hideLoader());
        }, 1000);
        return () => clearTimeout(timeout);
    }, []);

    const handleBookOption = (method) => {
        setIsModalVisible(false);
        navigation.navigate('BookAppointment', { doctorId: doctor._id, method });
    };

    const renderHeader = () => {
        const [isFavourite, setIsFavourite] = useState(false);
        return (
            <View style={styles.headerContainer}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Image
                            source={icons.back}
                            resizeMode="contain"
                            style={[styles.backIcon, { tintColor: COLORS.white }]}
                        />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: COLORS.white }]}>
                        Doctor Details
                    </Text>
                </View>
                <View style={styles.viewRight}>
                    <TouchableOpacity onPress={() => setIsFavourite(!isFavourite)}>
                        <Image
                            source={isFavourite ? icons.heart2 : icons.heart2Outline}
                            resizeMode="contain"
                            style={[
                                styles.heartIcon,
                                {
                                    tintColor: isFavourite ? COLORS.primary : COLORS.white,
                                },
                            ]}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    const renderContent = () => {
        const [expanded, setExpanded] = useState(false);
        const toggleExpanded = () => setExpanded(!expanded);

        return (
            <View>
                <View style={{ backgroundColor: dark ? COLORS.dark1 : 'transparent' }}>
                    <LinearGradient
                        colors={dark ? [COLORS.dark2, '#2C2F3E'] : ['#E9F0FF', COLORS.white]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.doctorCard}
                    >
                        <Image
                            source={{ uri: doctor.profilePhoto }}
                            resizeMode="contain"
                            style={styles.doctorImage}
                        />
                        <View style={{ flex: 1 }}>
                            <Text
                                style={[
                                    styles.doctorName,
                                    { color: dark ? COLORS.white : COLORS.greyscale900 },
                                ]}
                                numberOfLines={2}
                            >
                                {doctor.fullName || "No Name"}
                            </Text>
                            <View
                                style={[
                                    styles.separateLine,
                                    {
                                        backgroundColor: dark ? COLORS.grayscale700 : COLORS.grayscale200,
                                    },
                                ]}
                            />
                            <Text
                                style={[
                                    styles.doctorSpeciality,
                                    { color: dark ? COLORS.grayscale400 : COLORS.greyScale800 },
                                ]}
                            >
                                {doctor.specialization || "Specialization not available"}
                            </Text>
                            <Text
                                style={[
                                    styles.doctorHospital,
                                    { color: dark ? COLORS.grayscale400 : COLORS.greyScale800 },
                                ]}
                            >
                                {doctor.streetAddress || "Address not available"}
                            </Text>
                        </View>
                    </LinearGradient>
                </View>

                {/* Features */}
                <View style={styles.featureContainer}>
                    {[
                        { icon: icons.friends, label: 'patients', value: (doctor.previous_OPD_Number || 0) + '+' },
                        { icon: icons.activity, label: 'years exper..', value: (doctor.yearsOfExperience || 0) + '+' },
                        { icon: icons.starHalf, label: 'rating', value: doctor.average_rating || 0 },
                        { icon: icons.chatBubble2, label: 'reviews', value: doctor.rating_total_count || 0 },
                    ].map((item, index) => (
                        <View style={styles.featureItemContainer} key={index}>
                            <View style={styles.featureIconContainer}>
                                <Image source={item.icon} style={styles.featureIcon} />
                            </View>
                            <Text style={styles.featureItemNum}>{item.value}</Text>
                            <Text
                                style={[
                                    styles.featureItemName,
                                    { color: dark ? COLORS.greyscale300 : COLORS.greyScale800 },
                                ]}
                            >
                                {item.label}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* About Doctor */}
                <ScrollView>
                    <Text style={[styles.contentTitle, { color: dark ? COLORS.secondaryWhite : COLORS.greyscale900 }]}>
                        About me
                    </Text>
                    <Text
                        style={[styles.description, { color: dark ? COLORS.grayscale400 : COLORS.grayscale700 }]}
                        numberOfLines={expanded ? undefined : 2}
                    >
                        {doctor.about_me || "No details available"}
                    </Text>
                    <TouchableOpacity onPress={toggleExpanded}>
                        <Text style={styles.viewBtn}>
                            {expanded ? 'View Less' : 'View More'}
                        </Text>
                    </TouchableOpacity>
                    <Text style={styles.contentTitle1}>Consultation Home Visit Time</Text>
                    <Text style={styles.description}>{doctor.consultationTimeHomeVisit || "N/A"}</Text>
                    <Text style={styles.contentTitle1}>Consultation InPerson Time</Text>
                    <Text style={styles.description}>{doctor.consultationTimeInPerson || "N/A"}</Text>
                    <Text style={styles.contentTitle1}>Consultation Video Time</Text>
                    <Text style={styles.description}>{doctor.consultationTimeVideo || "N/A"}</Text>
                    <View style={styles.reviewTitleContainer}>
                        <Text style={styles.contentTitle}>Reviews</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('DoctorReviews')}>
                            <Text style={styles.seeAll}>See All</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>

                {/* Reviews */}
                <FlatList
                    data={doctor.reviews || []}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <ReviewCard
                            image={item.patient_picture}
                            name={item.patient_name}
                            description={item.review}
                            feedback={item.feedback}
                            avgRating={item.rating}
                            date={item.review_date}
                            numLikes={item.numLikes}
                        />
                    )}
                />
            </View>
        );
    };

    return (
        <LinearGradient
            colors={['#00b4db', '#fff', '#fff', '#fff', '#fff', '#fff']}
            style={{ flex: 1 }}
        >
            <SafeAreaView style={styles.area}>
                <View style={styles.container}>
                    {renderHeader()}
                    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                        {renderContent()}
                    </ScrollView>
                </View>

                {/* Bottom Book Button */}
                <View style={[styles.bottomContainer, { backgroundColor: dark ? COLORS.dark2 : COLORS.white }]}>
                    <Button
                        title="Book Appointment"
                        filled
                        style={styles.btn}
                        onPress={() => setIsModalVisible(true)}
                    />
                </View>

                {/* Booking Modal */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={isModalVisible}
                    onRequestClose={() => setIsModalVisible(false)}
                >
                    <TouchableOpacity
                        activeOpacity={1}
                        onPressOut={() => setIsModalVisible(false)}
                        style={styles.modalOverlay}
                    >
                        <View style={styles.modalContainer}>
                            <Text style={styles.modalTitle}>Choose Booking Method</Text>

                            {/* 👇 1. पहला ग्रेडिएंट बटन */}
                            <TouchableOpacity
                                style={{ width: '100%' }}
                                onPress={() => handleBookOption('wallet')}
                            >
                                <LinearGradient
                                    colors={['#0077b6', '#00b4db']}
                                    style={styles.modalGradientButton}
                                >
                                    <Text style={styles.modalButtonText}>Book by Wallet</Text>
                                </LinearGradient>
                            </TouchableOpacity>

                            {/* 👇 2. दूसरा ग्रेडिएंट बटन */}
                            <TouchableOpacity
                                style={{ width: '100%' }}
                                onPress={() => handleBookOption('payment')}
                            >
                                <LinearGradient
                                    colors={['#0077b6', '#00b4db']}
                                    style={styles.modalGradientButton}
                                >
                                    <Text style={styles.modalButtonText}>Book by Payment</Text>
                                </LinearGradient>
                            </TouchableOpacity>

                            {/* Cancel बटन पहले जैसा ही रहेगा */}
                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: COLORS.grayscale200, marginTop: 20 }]}
                                onPress={() => setIsModalVisible(false)}
                            >
                                <Text style={[styles.modalButtonText, { color: COLORS.greyscale900 }]}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </Modal>
            </SafeAreaView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    area: { flex: 1 },
    container: { flex: 1, padding: 16 },
    headerContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 16 },
    scrollView: { backgroundColor: 'transparent' },
    headerLeft: { flexDirection: 'row', alignItems: 'center' },
    backIcon: { height: 24, width: 24, marginRight: 16 },
    headerTitle: { fontSize: 24, fontFamily: 'Urbanist Bold' },
    heartIcon: { height: 24, width: 24, marginRight: 16 },
    viewRight: { flexDirection: 'row', alignItems: 'center' },
    doctorCard: {
        height: 142,
        width: SIZES.width - 32,
        borderRadius: 32,
        flexDirection: 'row',
        alignItems: 'center',
    },
    doctorImage: { height: 110, width: 110, borderRadius: 16, marginHorizontal: 16 },
    doctorName: {
        fontSize: 18,
        fontFamily: 'Urbanist Bold',
        flexShrink: 1,
        flexWrap: 'wrap',
        maxWidth: SIZES.width - 180,
    },
    separateLine: { height: 1, width: SIZES.width - 32, marginVertical: 12 },
    doctorSpeciality: { fontSize: 12, fontFamily: 'Urbanist Medium', marginBottom: 8 },
    doctorHospital: { fontSize: 12, fontFamily: 'Urbanist Medium' },
    featureContainer: {
        width: SIZES.width - 32,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 16,
    },
    featureItemContainer: { alignItems: 'center' },
    featureIconContainer: {
        height: 60,
        width: 60,
        backgroundColor: COLORS.tansparentPrimary,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 999,
    },
    featureIcon: { height: 28, width: 28, tintColor: COLORS.primary },
    featureItemNum: { fontSize: 16, fontFamily: 'Urbanist Bold', color: COLORS.primary, marginVertical: 6 },
    featureItemName: { fontSize: 12, fontFamily: 'Urbanist Medium' },
    contentTitle: { fontSize: 20, fontFamily: 'Urbanist Bold', marginVertical: 16 },
    contentTitle1: { fontSize: 15, fontFamily: 'Urbanist Bold', marginVertical: 10 },
    description: { fontSize: 14, fontFamily: 'Urbanist Regular' },
    viewBtn: { color: COLORS.primary, marginTop: 5, fontSize: 14, fontFamily: 'Urbanist SemiBold' },
    reviewTitleContainer: {
        width: SIZES.width - 32,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    seeAll: { color: COLORS.primary, fontSize: 16, fontFamily: 'Urbanist Bold' },
    bottomContainer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: 99,
        borderRadius: 32,
        backgroundColor: COLORS.white,
        alignItems: 'center',
        justifyContent: 'center',
    },
    btn: { width: SIZES.width - 32 },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
    modalContainer: { width: '80%', backgroundColor: 'white', borderRadius: 20, padding: 20, alignItems: 'center' },
    modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
    // 👇 3. ग्रेडिएंट बटन के लिए नई स्टाइल
    modalGradientButton: {
        paddingVertical: 12,
        borderRadius: 12,
        marginTop: 10,
        width: '100%',
        alignItems: 'center',
    },
    // यह स्टाइल Cancel बटन के लिए है
    modalButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: 12,
        borderRadius: 12,
        marginTop: 10,
        width: '100%',
        alignItems: 'center',
    },
    modalButtonText: {
        fontSize: 16,
        fontFamily: 'Urbanist SemiBold',
        color: COLORS.white,
    },
});

export default DoctorDetails;
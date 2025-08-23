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

const DoctorDetails = ({ navigation, route }) => {
  const {
    fullName,
    average_rating,
    rating_total_count,
    about_me,
    consultationDate,
    previous_OPD_Number,
    consultationTime,
    yearsOfExperience,
    specialization,
    doctorRating,
    profilePhoto,
    doctorId,
    streetAddress,
    reviews,
    consultationTimeHomeVisit,
    consultationTimeInPerson,
    consultationTimeVideo,
  } = route.params;

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
    navigation.navigate('BookAppointment', { doctorId, method });
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
              style={[
                styles.backIcon,
                { tintColor: dark ? COLORS.white : COLORS.black },
              ]}
            />
          </TouchableOpacity>
          <Text
            style={[
              styles.headerTitle,
              { color: dark ? COLORS.white : COLORS.black },
            ]}
          >
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
                  tintColor: isFavourite
                    ? COLORS.primary
                    : COLORS.greyscale900,
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
        <View style={{ backgroundColor: dark ? COLORS.dark1 : COLORS.tertiaryWhite }}>
          <View
            style={[
              styles.doctorCard,
              {
                backgroundColor: dark ? COLORS.dark2 : COLORS.white,
              },
            ]}
          >
            <Image
              source={{ uri: profilePhoto }}
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
                {fullName}
              </Text>
              <View
                style={[
                  styles.separateLine,
                  {
                    backgroundColor: dark
                      ? COLORS.grayscale700
                      : COLORS.grayscale200,
                  },
                ]}
              />
              <Text
                style={[
                  styles.doctorSpeciality,
                  {
                    color: dark ? COLORS.grayscale400 : COLORS.greyScale800,
                  },
                ]}
              >
                {specialization}
              </Text>
              <Text
                style={[
                  styles.doctorHospital,
                  {
                    color: dark ? COLORS.grayscale400 : COLORS.greyScale800,
                  },
                ]}
              >
                {streetAddress}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.featureContainer}>
          {/* Feature Items */}
          {[
            { icon: icons.friends, label: 'patients', value: previous_OPD_Number + '+' },
            { icon: icons.activity, label: 'years exper..', value: yearsOfExperience + '+' },
            { icon: icons.starHalf, label: 'rating', value: average_rating },
            { icon: icons.chatBubble2, label: 'reviews', value: rating_total_count },
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

        <ScrollView>
          <Text
            style={[
              styles.contentTitle,
              { color: dark ? COLORS.secondaryWhite : COLORS.greyscale900 },
            ]}
          >
            About me
          </Text>
          <Text
            style={[
              styles.description,
              { color: dark ? COLORS.grayscale400 : COLORS.grayscale700 },
            ]}
            numberOfLines={expanded ? undefined : 2}
          >
            {about_me}
          </Text>
          <TouchableOpacity onPress={toggleExpanded}>
            <Text style={styles.viewBtn}>
              {expanded ? 'View Less' : 'View More'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.contentTitle1}>Consultation Home Visit Time</Text>
          <Text style={styles.description}>{consultationTimeHomeVisit}</Text>

          <Text style={styles.contentTitle1}>Consultation InPerson Time</Text>
          <Text style={styles.description}>{consultationTimeInPerson}</Text>

          <Text style={styles.contentTitle1}>Consultation Video Time</Text>
          <Text style={styles.description}>{consultationTimeVideo}</Text>

          <View style={styles.reviewTitleContainer}>
            <Text style={styles.contentTitle}>Reviews</Text>
            <TouchableOpacity onPress={() => navigation.navigate('DoctorReviews')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <FlatList
          data={reviews}
          keyExtractor={(item) => item._id}
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
    <SafeAreaView style={[styles.area, { backgroundColor: dark ? COLORS.dark1 : COLORS.white }]}>
      <View style={[styles.container, { backgroundColor: dark ? COLORS.dark1 : COLORS.white }]}>
        {renderHeader()}
        <ScrollView
          style={[styles.scrollView, { backgroundColor: dark ? COLORS.dark1 : COLORS.tertiaryWhite }]}
          showsVerticalScrollIndicator={false}
        >
          {renderContent()}
        </ScrollView>
      </View>

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

            <TouchableOpacity style={styles.modalButton} onPress={() => handleBookOption('wallet')}>
              <Text style={styles.modalButtonText}>Book by Wallet</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.modalButton} onPress={() => handleBookOption('payment')}>
              <Text style={styles.modalButtonText}>Book by Payment</Text>
            </TouchableOpacity>

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
  );
};

const styles = StyleSheet.create({
  area: { flex: 1, backgroundColor: COLORS.white },
  container: { flex: 1, backgroundColor: COLORS.white, padding: 16 },
  headerContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 16 },
  scrollView: { backgroundColor: COLORS.tertiaryWhite },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  backIcon: { height: 24, width: 24, marginRight: 16 },
  headerTitle: { fontSize: 24, fontFamily: 'Urbanist Bold' },
  heartIcon: { height: 24, width: 24, marginRight: 16 },
  viewRight: { flexDirection: 'row', alignItems: 'center' },
  doctorCard: {
    height: 142,
    width: SIZES.width - 32,
    borderRadius: 32,
    backgroundColor: COLORS.white,
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

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Linking,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { SIZES, COLORS, icons } from '../constants';
import { useTheme } from '../theme/ThemeProvider';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { hideLoader, showLoader } from '../src/redux/slices/loaderSlice';
import ApiService from '../src/api/ApiService';
import { ENDPOINTS } from '../src/constants/Endpoints';
import { useDispatch } from 'react-redux';

const CompletedBooking = () => {
  const [completed, setCompleted] = useState([]);
  const { dark } = useTheme();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const completedAppointment = async () => {
    try {
      dispatch(showLoader());
      const response = await ApiService.get(ENDPOINTS.approved_appointments_prescription);
      console.log("===============completedAppointment=================", response.data);
      setCompleted(response.data);
      dispatch(hideLoader());
    } catch (error) {
      console.log('error=======', error);
      dispatch(hideLoader());
    }
  };

  const viewPdfData = async (item) => {
    if (!item?._id) return;

    try {
      dispatch(showLoader());
      const url = `${ENDPOINTS.patient_get_prescription_upload}/${item._id}`;
      const response = await ApiService.get(url);
      console.log("========viewPdfData:===========", response.data);

      const pdfUrl = response.data[0]?.url;

      if (pdfUrl) {
        Linking.openURL(pdfUrl); // Open PDF directly like Report screen
      } else {
        console.log("No PDF URL found.");
      }

      dispatch(hideLoader());
    } catch (error) {
      console.log('error in viewPdfData:', error);
      dispatch(hideLoader());
    }
  };

  const ViewDetails = async (item) => {
    if (!item?._id) return;

    try {
      dispatch(showLoader());
      const url = `${ENDPOINTS.approved_appointment_with_Id}/${item._id}`;
      const response = await ApiService.get(url);
      console.log("================ViewDetails================", response.data);

      const screenName =
        item.appointment_type === "in-person" ? "MyAppointmentMessaging" :
        item.appointment_type === "video" ? "MyAppointmentVideoCall" :
        item.appointment_type === "home-visit" ? "MyAppointmentVoiceCall" :
        null;

      const specializationData = item.doctors?.map(doc => doc.specialization).flat();
      const doctorNames = item.doctors?.map(doc => doc.fullName).filter(Boolean);
      const doctorPhotos = item.doctors?.map(doc => doc.profilePhoto).filter(Boolean);
      const doctorAddresses = item.doctors?.map(doc => doc.streetAddress || "").filter(Boolean);
      const doctorCities = item.doctors?.map(doc => doc.city || "").filter(Boolean);

      if (screenName) {
        navigation.navigate(screenName, {
          age: item.patient_age,
          gender: item.patient_gender,
          name: item.patient_name,
          appointment_type: item.appointment_type,
          problem: item.reason_for_visit,
          appointment_approve_date: item.appointment_approve_date,
          specialization: specializationData,
          doctor_names: doctorNames,
          doctor_photos: doctorPhotos,
          doctor_addresses: doctorAddresses,
          doctor_cities: doctorCities,
          appointment_payment: item.appointment_payment,
          details: response.data,
          id: item._id,
        });
      }

      dispatch(hideLoader());
    } catch (error) {
      console.log("Error in ViewDetails:", error);
      dispatch(hideLoader());
    }
  };

  useFocusEffect(
    useCallback(() => {
      completedAppointment();
    }, [])
  );

  return (
    <View style={[styles.container, { backgroundColor: dark ? COLORS.dark1 : COLORS.tertiaryWhite }]}>
      <FlatList
        data={completed}
        keyExtractor={item => item.id?.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity style={[styles.cardContainer, { backgroundColor: dark ? COLORS.dark2 : COLORS.white }]}>
            <View style={styles.detailsViewContainer}>
              <View style={styles.detailsContainer}>
                <View>
                  <Image
                    source={{ uri: item.doctors?.[0]?.profilePhoto }}
                    resizeMode='cover'
                    style={styles.serviceImage}
                  />
                  {item.doctors?.[0]?.average_rating > 0 && (
                    <View style={styles.reviewContainer}>
                      <FontAwesome name="star" size={12} color="orange" />
                      <Text style={styles.rating}>
                        {item.doctors?.[0]?.average_rating}
                      </Text>
                    </View>
                  )}
                </View>
                <View style={styles.detailsRightContainer}>
                  <Text style={[styles.name, { color: dark ? COLORS.secondaryWhite : COLORS.greyscale900 }]}>
                    {item.doctors?.map(doc => doc.fullName).join(', ')}
                  </Text>
                  <View style={styles.priceContainer}>
                    <Text style={[styles.address, { color: dark ? COLORS.grayscale400 : COLORS.grayscale700 }]}>
                      {item.appointment_type} -
                    </Text>
                    <View style={styles.statusContainer}>
                      <Text style={styles.statusText}>{item.status}</Text>
                    </View>
                  </View>
                  <Text style={[styles.address, { color: dark ? COLORS.grayscale400 : COLORS.grayscale700 }]}>
                    {item.appointment_approve_date}
                  </Text>
                </View>
              </View>
              <TouchableOpacity style={styles.iconContainer}>
                <Image
                  source={
                    item.appointment_type === "in-person" ? icons.inperson :
                    item.appointment_type === "video" ? icons.videoCamera :
                    item.appointment_type === "home-visit" ? icons.house :
                    null
                  }
                  resizeMode='contain'
                  style={styles.chatIcon}
                />
              </TouchableOpacity>
            </View>

            <View style={[styles.separateLine, {
              marginVertical: 10,
              backgroundColor: dark ? COLORS.greyScale800 : COLORS.grayscale200,
            }]} />

            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={() => ViewDetails(item)} style={styles.actionBtn}>
                <Text style={styles.receiptBtnText}>View Details</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => viewPdfData(item)} style={styles.actionBtn}>
                <Text style={styles.receiptBtnText}>View Prescription</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: COLORS.tertiaryWhite, marginVertical: 22 },
  cardContainer: {
    width: SIZES.width - 32,
    borderRadius: 18,
    paddingHorizontal: 8,
    paddingVertical: 8,
    marginBottom: 16
  },
  detailsViewContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  detailsContainer: { flexDirection: "row", alignItems: "center" },
  serviceImage: {
    width: 88, height: 88, borderRadius: 16, marginHorizontal: 12
  },
  detailsRightContainer: { marginLeft: 12 },
  name: {
    fontSize: 17,
    fontFamily: "Urbanist Bold",
    color: COLORS.greyscale900
  },
  address: {
    fontSize: 12,
    fontFamily: "Urbanist Regular",
    color: COLORS.grayscale700,
    marginVertical: 6
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6
  },
  statusContainer: {
    width: 62, height: 24, borderRadius: 6,
    backgroundColor: "transparent",
    alignItems: "center", justifyContent: "center",
    borderColor: COLORS.greeen, borderWidth: 1
  },
  statusText: {
    fontSize: 10,
    color: COLORS.greeen,
    fontFamily: "Urbanist Medium",
  },
  reviewContainer: {
    position: "absolute", top: 6, right: 16, width: 46, height: 20,
    borderRadius: 16,
    backgroundColor: COLORS.transparentWhite2,
    flexDirection: "row", alignItems: "center", justifyContent: "center"
  },
  rating: {
    fontSize: 12,
    fontFamily: "Urbanist SemiBold",
    color: COLORS.primary,
    marginLeft: 4
  },
  separateLine: {
    width: "100%", height: .7, backgroundColor: COLORS.greyScale800, marginVertical: 12
  },
  buttonContainer: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between"
  },
  actionBtn: {
    width: ((SIZES.width - 32) - 24) / 2,
    height: 36,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
    borderColor: COLORS.primary,
    borderWidth: 1.4,
    marginBottom: 12
  },
  receiptBtnText: {
    fontSize: 16,
    fontFamily: "Urbanist SemiBold",
    color: COLORS.white,
  },
  iconContainer: {
    height: 56,
    width: 56,
    borderRadius: 28,
    backgroundColor: COLORS.tansparentPrimary,
    alignItems: "center",
    justifyContent: "center"
  },
  chatIcon: {
    height: 24, width: 24, tintColor: COLORS.primary
  },
});

export default CompletedBooking;

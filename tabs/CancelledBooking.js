import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { SIZES, COLORS, icons } from '../constants';
import { useTheme } from '../theme/ThemeProvider';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { cancelledAppointments } from '../data';
import { hideLoader, showLoader } from '../src/redux/slices/loaderSlice';
import ApiService from '../src/api/ApiService';
import { ENDPOINTS } from '../src/constants/Endpoints';
import { useDispatch } from 'react-redux';

//=============================This is Completed screen==============================
const CancelledBooking = () => {
  const [bookings, setBookings] = useState(cancelledAppointments);
  const [completed, setCompleted] = useState([])
  const [prescription, setPrescription] = useState([])

  const dispatch = useDispatch();
  const { dark } = useTheme();
  const navigation = useNavigation();
  const completedAppointment = async () => {
    try {
      dispatch(showLoader());
      const response = await ApiService.get(ENDPOINTS.approved_appointments_prescription_Completed);
      console.log("===============completed=====Appointment=================", response.data);
      setCompleted(response.data);
      dispatch(hideLoader());
    } catch (error) {
      console.log('error=======', error);
      dispatch(hideLoader());
    }
  };
  // useEffect(() => {
  //   completedAppointment();
  // }, []);
  useFocusEffect(
    useCallback(() => {
      completedAppointment();
    }, [])
  );
  const ViewPrescription = async (item) => {
    if (!item?._id) {
      console.warn("viewPdfData called without ID");
      return;
    }
    console.log('item======', item)
    try {
      dispatch(showLoader());

      const url = `${ENDPOINTS.patient_get_prescription}/${item?._id}`;
      console.log('url============', url)

      const response = await ApiService.get(url);

      console.log("========setPrescription:===========", response.data);
      const pdfUrl = response.data[0]?.url
      const prescriptionData = response.data[0]; // full object

      setPrescription(response.data);
      // console.log("Extracted PDF URL:", pdfUrl);
      navigation.navigate('PrescriptionPdf', { ...prescriptionData })
      setPrescription(response.data);
      dispatch(hideLoader());
    } catch (error) {
      console.log(' error in Prescription:', error);
      dispatch(hideLoader());
    }
  };
  // useEffect(() => {
  //   ViewPrescription()

  // }, [])
  useFocusEffect(
    useCallback(() => {
      ViewPrescription()
    }, [])
  );
  return (
    <View style={[styles.container, {
      backgroundColor: dark ? COLORS.dark1 : COLORS.tertiaryWhite
    }]}>
      <FlatList
        data={completed}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity style={[styles.cardContainer, {
            backgroundColor: dark ? COLORS.dark2 : COLORS.white,
          }]}>
            <View style={styles.detailsViewContainer}>
              <View style={styles.detailsContainer}>
                <View>
                  <Image
                    source={{ uri: item.doctors?.[0]?.profilePhoto }}
                    resizeMode='cover'
                    style={styles.serviceImage}
                  />
                  {
                    item.doctors?.[0]?.average_rating > 0 && (
                      <View style={styles.reviewContainer}>
                        <FontAwesome name="star" size={12} color="orange" />
                        <Text style={styles.rating}>
                          {item.doctors?.[0]?.average_rating}
                        </Text>
                      </View>
                    )
                  }
                </View>
                <View style={styles.detailsRightContainer}>
                  <Text style={[styles.name, {
                    color: dark ? COLORS.secondaryWhite : COLORS.greyscale900
                  }]}>
                    {item.doctors?.map(doc => doc.fullName).join(', ')}

                  </Text>
                  <View style={styles.priceContainer}>
                    <Text style={[styles.address, {
                      color: dark ? COLORS.grayscale400 : COLORS.grayscale700,
                    }]}>{item.appointment_type} -  </Text>
                    <View style={styles.statusContainer}>
                      <Text style={styles.statusText}>{item.status}</Text>
                    </View>
                  </View>
                  <Text style={[styles.address, {
                    color: dark ? COLORS.grayscale400 : COLORS.grayscale700,
                  }]}>{item.appointment_approve_date}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.iconContainer}>
                <Image
                  source={
                    item.appointment_type === "in-person"
                      ? icons.inperson
                      : item.appointment_type === "video"
                        ? icons.videoCamera
                        : item.appointment_type === "home-visit"
                          ? icons.house
                          : null // Add a fallback in case none of the conditions match
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
              <TouchableOpacity
                onPress={() => ViewPrescription(item)

                  // navigation.navigate("ReviewSummary")
                }
                style={styles.receiptBtn}>
                <Text style={styles.receiptBtnText}>View Prescription</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.tertiaryWhite,
    marginVertical: 22
  },
  cardContainer: {
    width: SIZES.width - 32,
    borderRadius: 18,
    backgroundColor: COLORS.white,
    paddingHorizontal: 8,
    paddingVertical: 8,
    marginBottom: 16
  },
  dateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  date: {
    fontSize: 16,
    fontFamily: "Urbanist Bold",
    color: COLORS.greyscale900
  },
  statusContainer: {
    width: 54,
    height: 24,
    borderRadius: 6,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    borderColor: COLORS.greeen,
    borderWidth: 1
  },
  statusText: {
    fontSize: 10,
    color: COLORS.greeen,
    fontFamily: "Urbanist Medium",
  },
  separateLine: {
    width: "100%",
    height: .7,
    backgroundColor: COLORS.greyScale800,
    marginVertical: 12
  },
  detailsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  serviceImage: {
    width: 88,
    height: 88,
    borderRadius: 16,
    marginHorizontal: 12
  },
  detailsRightContainer: {
    marginLeft: 12
  },
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
  serviceTitle: {
    fontSize: 12,
    fontFamily: "Urbanist Regular",
    color: COLORS.grayscale700,
  },
  serviceText: {
    fontSize: 12,
    color: COLORS.primary,
    fontFamily: "Urbanist Medium",
    marginTop: 6
  },
  cancelBtn: {
    width: (SIZES.width - 32) / 2 - 16,
    height: 36,
    borderRadius: 24,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
    borderColor: COLORS.primary,
    borderWidth: 1.4,
    marginBottom: 12
  },
  cancelBtnText: {
    fontSize: 16,
    fontFamily: "Urbanist SemiBold",
    color: COLORS.primary,
  },
  receiptBtn: {
    width: (SIZES.width - 32) - 12,
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
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  remindMeText: {
    fontSize: 12,
    fontFamily: "Urbanist Regular",
    color: COLORS.grayscale700,
    marginVertical: 4
  },
  switch: {
    marginLeft: 8,
    transform: [{ scaleX: .8 }, { scaleY: .8 }], // Adjust the size of the switch
  },
  bottomContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 12,
    paddingHorizontal: 16,
    width: "100%"
  },
  cancelButton: {
    width: (SIZES.width - 32) / 2 - 8,
    backgroundColor: COLORS.tansparentPrimary,
    borderRadius: 32
  },
  removeButton: {
    width: (SIZES.width - 32) / 2 - 8,
    backgroundColor: COLORS.primary,
    borderRadius: 32
  },
  bottomTitle: {
    fontSize: 24,
    fontFamily: "Urbanist SemiBold",
    color: "red",
    textAlign: "center",
  },
  bottomSubtitle: {
    fontSize: 22,
    fontFamily: "Urbanist Bold",
    color: COLORS.greyscale900,
    textAlign: "center",
    marginVertical: 12
  },
  selectedCancelContainer: {
    marginVertical: 24,
    paddingHorizontal: 36,
    width: "100%"
  },
  cancelTitle: {
    fontSize: 18,
    fontFamily: "Urbanist SemiBold",
    color: COLORS.greyscale900,
    textAlign: "center",
  },
  cancelSubtitle: {
    fontSize: 14,
    fontFamily: "Urbanist Regular",
    color: COLORS.grayscale700,
    textAlign: "center",
    marginVertical: 8,
    marginTop: 16
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6
  },
  totalPrice: {
    fontSize: 18,
    fontFamily: "Urbanist SemiBold",
    color: COLORS.primary,
    textAlign: "center",
  },
  duration: {
    fontSize: 12,
    fontFamily: "Urbanist Regular",
    color: COLORS.grayscale700,
    textAlign: "center",
  },
  priceItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,

  },
  reviewContainer: {
    position: "absolute",
    top: 6,
    right: 16,
    width: 46,
    height: 20,
    borderRadius: 16,
    backgroundColor: COLORS.transparentWhite2,
    zIndex: 999,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  rating: {
    fontSize: 12,
    fontFamily: "Urbanist SemiBold",
    color: COLORS.primary,
    marginLeft: 4
  },
  detailsViewContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
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
    height: 24,
    width: 24,
    tintColor: COLORS.primary
  }
})

export default CancelledBooking
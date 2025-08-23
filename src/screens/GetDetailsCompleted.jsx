import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { SIZES, COLORS, icons } from '../constants';
import RBSheet from "react-native-raw-bottom-sheet";
import { useTheme } from '../theme/ThemeProvider';
import Button from '../components/Button';
import { useNavigation } from '@react-navigation/native';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useDispatch } from 'react-redux';
import { hideLoader, showLoader } from '../src/redux/slices/loaderSlice';
import ApiService from '../src/api/ApiService';
import { ENDPOINTS } from '../src/constants/Endpoints';

const GetDetailsCompleted = () => {
  const [approved, setApproved] = useState([]);
  const refRBSheet = useRef();
  const { dark } = useTheme();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const approvedAppointment = async () => {
    try {
      dispatch(showLoader());
      const response = await ApiService.get(ENDPOINTS.approved_appointments);
      console.log("===============approvedAppointment=================", response.data);
      setApproved(response.data);
      dispatch(hideLoader());
    } catch (error) {
      console.log('error=======', error);
      dispatch(hideLoader());
    }
  };

  useEffect(() => {
    approvedAppointment();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: dark ? COLORS.dark1 : COLORS.tertiaryWhite }]}>
      <FlatList
        data={approved}
        keyExtractor={item => item.id?.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const screenName =
            item.appointment_type === "in-person" ? "MyAppointmentMessaging" :
              item.appointment_type === "video" ? "MyAppointmentVideoCall" :
                item.appointment_type === "home-visit" ? "MyAppointmentVoiceCall" :
                  null;

          return (
            <TouchableOpacity style={[styles.cardContainer, {
              backgroundColor: dark ? COLORS.dark2 : COLORS.white,
            }]}>
              <TouchableOpacity
                onPress={() => {
                  const specializationData = item.doctors?.map(doctor => doctor.specialization).flat();
                  const doctorNames = item.doctors?.map(doc => doc.fullName).filter(Boolean);
                  const doctorPhotos = item.doctors?.map(doc => doc.profilePhoto).filter(Boolean);
                  const doctorAddresses = item.doctors?.map(doc => doc.streetAddress || "").filter(Boolean);
                  const doctorCities = item.doctors?.map(doc => doc.city || "").filter(Boolean);
                  console.log("Specialization=========== Data: ", specializationData);
                  console.log("Doctor Photos: ", doctorPhotos);
                  console.log("Doctor Names: ", doctorNames);
                  console.log("Addresses: ", doctorAddresses);
                  console.log("Cities: ", doctorCities);
                  if (screenName) {
                    navigation.navigate(screenName, {
                      age: item.patient_age,
                      gender: item.patient_gender,
                      name: item.patient_name,
                      appointment_type: item.appointment_type,
                      problem: item.reason_for_visit,
                      appointment_approve_date: item.appointment_approve_date,
                      specialization: specializationData || [],
                      doctor_names: doctorNames || [],
                      doctor_photos: doctorPhotos || [],
                      appointment_payment: item.appointment_payment,
                      doctor_addresses: doctorAddresses || [],
                      doctor_cities: doctorCities || []

                    });
                  }
                }}
                style={styles.detailsViewContainer}
              >
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
                      }]}>{item.appointment_type} - </Text>
                      <View style={styles.statusContainer}>
                        <Text style={styles.statusText}>{item.status}</Text>
                      </View>
                    </View>
                    <Text style={[styles.address, {
                      color: dark ? COLORS.grayscale400 : COLORS.grayscale700,
                    }]}>{item.appointment_approve_date}</Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    const specializationData = item.doctors?.map(doctor => doctor.specialization).flat();
                    const doctorNames = item.doctors?.map(doc => doc.fullName).filter(Boolean);
                    const doctorPhotos = item.doctors?.map(doc => doc.profilePhoto).filter(Boolean);
                    const doctorAddresses = item.doctors?.map(doc => doc.streetAddress || "").filter(Boolean);
                    const doctorCities = item.doctors?.map(doc => doc.city || "").filter(Boolean);
                    console.log("Specialization=========== Data: ", specializationData);
                    console.log("Doctor Photos: ", doctorPhotos);
                    console.log("Doctor Names: ", doctorNames);
                    console.log("Addresses: ", doctorAddresses);
                    console.log("Cities: ", doctorCities);
                    if (screenName) {
                      navigation.navigate(screenName, {
                        age: item.patient_age,
                        gender: item.patient_gender,
                        name: item.patient_name,
                        problem: item.reason_for_visit,
                        appointment_approve_date: item.appointment_approve_date,
                        specialization: specializationData || [],
                        doctor_names: doctorNames || [],
                        doctor_photos: doctorPhotos || [],
                        appointment_type: item.appointment_type,
                        appointment_payment: itemappointment_payment,

                      });
                    }
                  }}
                  style={styles.iconContainer}
                >
                  <Image
                    source={
                      item.appointment_type === "in-person"
                        ? icons.inperson
                        : item.appointment_type === "video"
                          ? icons.videoCamera
                          : item.appointment_type === "home-visit"
                            ? icons.house
                            : null
                    }
                    resizeMode='contain'
                    style={styles.chatIcon}
                  />
                </TouchableOpacity>
              </TouchableOpacity>

              <View style={[styles.separateLine, {
                marginVertical: 10,
                backgroundColor: dark ? COLORS.greyScale800 : COLORS.grayscale200,
              }]} />

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  onPress={() => {
                    const specializationData = item.doctors?.map(doctor => doctor.specialization).flat();
                    const doctorNames = item.doctors?.map(doc => doc.fullName).filter(Boolean);
                    const doctorPhotos = item.doctors?.map(doc => doc.profilePhoto).filter(Boolean);
                    const doctorAddresses = item.doctors?.map(doc => doc.streetAddress || "").filter(Boolean);
                    const doctorCities = item.doctors?.map(doc => doc.city || "").filter(Boolean);
                    console.log("Specialization=========== Data: ", specializationData);
                    // console.log("Doctor Photos: ", doctorPhotos);
                    // console.log("Doctor Names: ", doctorNames);
                    // console.log("Addresses: ", doctorAddresses);
                    // console.log("Cities: ", doctorCities);
                    if (screenName) {
                      navigation.navigate(screenName, {
                        age: item.patient_age,
                        gender: item.patient_gender,
                        name: item.patient_name,
                        problem: item.reason_for_visit,
                        appointment_approve_date: item.appointment_approve_date,
                        specialization: specializationData || [],
                        doctor_names: doctorNames || [],
                        doctor_photos: doctorPhotos || [],
                        appointment_type: item.appointment_type,
                        appointment_payment: item.appointment_payment,

                      });
                    }
                  }}
                  style={[styles.receiptBtn, { width: '100%' }]}
                >
                  <Text style={styles.receiptBtnText}>Get Details</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          );
        }}
      />

      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={false}
        height={332}
        customStyles={{
          wrapper: {
            backgroundColor: "rgba(0,0,0,0.5)",
          },
          draggableIcon: {
            backgroundColor: dark ? COLORS.greyscale300 : COLORS.greyscale300,
          },
          container: {
            borderTopRightRadius: 32,
            borderTopLeftRadius: 32,
            height: 332,
            backgroundColor: dark ? COLORS.dark2 : COLORS.white,
            alignItems: "center",
            width: "100%"
          }
        }}
      >
        <Text style={[styles.bottomSubtitle, {
          color: dark ? COLORS.red : COLORS.red
        }]}>Cancel Appointment</Text>

        <View style={[styles.separateLine, {
          backgroundColor: dark ? COLORS.greyScale800 : COLORS.grayscale200,
        }]} />

        <View style={styles.selectedCancelContainer}>
          <Text style={[styles.cancelTitle, {
            color: dark ? COLORS.secondaryWhite : COLORS.greyscale900
          }]}>Are you sure you want to cancel your appointment?</Text>
          <Text style={[styles.cancelSubtitle, {
            color: dark ? COLORS.grayscale400 : COLORS.grayscale700
          }]}>Only 80% of the money you can refund from your payment according to our policy.</Text>
        </View>

        <View style={styles.bottomContainer}>
          <Button
            title="Cancel"
            style={{
              width: (SIZES.width - 32) / 2 - 8,
              backgroundColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary,
              borderRadius: 32,
              borderColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary
            }}
            textColor={dark ? COLORS.white : COLORS.primary}
            onPress={() => refRBSheet.current.close()}
          />
          <Button
            title="Yes, Cancel"
            filled
            style={styles.removeButton}
            onPress={() => {
              refRBSheet.current.close();
              navigation.navigate("CancelAppointment");
            }}
          />
        </View>
      </RBSheet>
    </View>
  );
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
    width: 58,
    height: 24,
    borderRadius: 6,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    borderColor: COLORS.primary,
    borderWidth: 1
  },
  statusText: {
    fontSize: 10,
    color: COLORS.primary,
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
    marginLeft: 12,
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
    width: (SIZES.width - 32) / 2 - 16,
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

export default GetDetailsCompleted
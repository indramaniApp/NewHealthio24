import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, Image, RefreshControl
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { SIZES, COLORS, icons } from '../constants';
import { useTheme } from '../theme/ThemeProvider';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import { useDispatch } from 'react-redux';
import { hideLoader, showLoader } from '../src/redux/slices/loaderSlice';
import ApiService from '../src/api/ApiService';
import { ENDPOINTS } from '../src/constants/Endpoints';

const UpcomingBooking = () => {
  const [approved, setApproved] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const { dark } = useTheme();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const approvedAppointment = async () => {
    try {
      dispatch(showLoader());
      const response = await ApiService.get(ENDPOINTS.approved_appointments);
      setApproved(response.data);
    } catch (error) {
      console.log('Error:', error);
    } finally {
      dispatch(hideLoader());
    }
  };

  useFocusEffect(
    useCallback(() => {
      approvedAppointment();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await approvedAppointment();
    setRefreshing(false);
  };

  const viewReceipt = async (item) => {
    if (!item?._id) return;
    try {
      dispatch(showLoader());
      const url = `${ENDPOINTS.debit_transaction_appointment}/${item._id}`;
      const response = await ApiService.get(url);
      navigation.navigate("Receipt", { receiptData: response.data });
    } catch (error) {
      console.log("Error fetching receipt:", error);
    } finally {
      dispatch(hideLoader());
    }
  };

  const GetDetails = async (item) => {
    if (!item?._id) return;
    try {
      dispatch(showLoader());
      const url = `${ENDPOINTS.approved_appointment_with_Id}/${item._id}`;
      const response = await ApiService.get(url);

      const screenName =
        item.appointment_type === "in-person" ? "MyAppointmentMessaging" :
        item.appointment_type === "video" ? "MyAppointmentVideoCall" :
        item.appointment_type === "home-visit" ? "MyAppointmentVoiceCall" : null;

      if (screenName) {
        navigation.navigate(screenName, {
          age: item.patient_age,
          gender: item.patient_gender,
          name: item.patient_name,
          appointment_type: item.appointment_type,
          problem: item.reason_for_visit,
          appointment_approve_date: item.appointment_approve_date,
          specialization: item.doctors?.map(doc => doc.specialization).flat() || [],
          doctor_names: item.doctors?.map(doc => doc.fullName) || [],
          doctor_photos: item.doctors?.map(doc => doc.profilePhoto) || [],
          appointment_payment: item.appointment_payment,
          details: response.data
        });
      }
    } catch (error) {
      console.log("Error in GetDetails:", error);
    } finally {
      dispatch(hideLoader());
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: dark ? COLORS.dark1 : COLORS.tertiaryWhite }]}>
      <FlatList
        data={approved}
        keyExtractor={item => item._id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={[styles.cardContainer, { backgroundColor: dark ? COLORS.dark2 : COLORS.white }]}>
            <TouchableOpacity
              style={styles.detailsViewContainer}
              onPress={() => GetDetails(item)}
            >
              <Image
                source={{ uri: item.doctors?.[0]?.profilePhoto }}
                style={styles.serviceImage}
              />
              <View style={styles.detailsRightContainer}>
                <Text
                  style={[styles.name, { color: dark ? COLORS.secondaryWhite : COLORS.greyscale900 }]}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
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
              <View style={styles.iconContainer}>
                <Image
                  source={
                    item.appointment_type === "in-person" ? icons.inperson :
                    item.appointment_type === "video" ? icons.videoCamera :
                    item.appointment_type === "home-visit" ? icons.house :
                    null
                  }
                  style={styles.chatIcon}
                  resizeMode="contain"
                />
              </View>
            </TouchableOpacity>

            <View style={[styles.separateLine, { backgroundColor: dark ? COLORS.greyScale800 : COLORS.grayscale200 }]} />

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.receiptBtn} onPress={() => GetDetails(item)}>
                <Text style={styles.receiptBtnText}>Get Details</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.receiptBtn} onPress={() => viewReceipt(item)}>
                <Text style={styles.receiptBtnText}>View Receipt</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16
  },
  cardContainer: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 16
  },
  detailsViewContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  serviceImage: {
    width: 70,
    height: 70,
    borderRadius: 12,
    marginRight: 10
  },
  detailsRightContainer: {
    flex: 1
  },
  name: {
    fontSize: 16,
    fontFamily: "Urbanist Bold"
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4
  },
  address: {
    fontSize: 12,
    fontFamily: "Urbanist Regular"
  },
  statusContainer: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 4
  },
  statusText: {
    fontSize: 10,
    color: COLORS.primary,
    fontFamily: "Urbanist Medium"
  },
  iconContainer: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: COLORS.tansparentPrimary,
    marginLeft: 8
  },
  chatIcon: {
    width: 20,
    height: 20,
    tintColor: COLORS.primary
  },
  separateLine: {
    height: 1,
    marginVertical: 10
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  receiptBtn: {
    flex: 0.48,
    backgroundColor: COLORS.primary,
    borderRadius: 24,
    alignItems: 'center',
    paddingVertical: 8
  },
  receiptBtnText: {
    color: COLORS.white,
    fontFamily: "Urbanist SemiBold",
    fontSize: 14
  }
});

export default UpcomingBooking;

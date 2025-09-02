import {
    View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Linking,
} from 'react-native';
import React, { useCallback, useState } from 'react';
import { SIZES, COLORS, icons } from '../constants';
import { useTheme } from '../theme/ThemeProvider';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { hideLoader, showLoader } from '../src/redux/slices/loaderSlice';
import ApiService from '../src/api/ApiService';
import { ENDPOINTS } from '../src/constants/Endpoints';
import { useDispatch } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';

const CompletedBooking = () => {
    const [completed, setCompleted] = useState([]);
    const { dark } = useTheme();
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const completedAppointment = async () => {
        try {
            dispatch(showLoader());
            const response = await ApiService.get(ENDPOINTS.approved_appointments_prescription);
            setCompleted(response.data);
        } catch (error) {
            console.log('error=======', error);
        } finally {
            dispatch(hideLoader());
        }
    };

    const viewPdfData = async (item) => {
        if (!item?._id) return;
        try {
            dispatch(showLoader());
            const url = `${ENDPOINTS.patient_get_prescription_upload}/${item._id}`;
            const response = await ApiService.get(url);
            const pdfUrl = response.data[0]?.url;

            if (pdfUrl) {
                await Linking.openURL(pdfUrl);
            } else {
                console.log("No PDF URL found.");
            }
        } catch (error) {
            console.log('error in viewPdfData:', error);
        } finally {
            dispatch(hideLoader());
        }
    };

    const ViewDetails = async (item) => {
        if (!item?._id) return;
        try {
            dispatch(showLoader());
            const url = `${ENDPOINTS.approved_appointment_with_Id}/${item._id}`;
            const response = await ApiService.get(url);

            const screenName =
                item.appointment_type === "in-person" ? "MyAppointmentMessaging" :
                    item.appointment_type === "video" ? "MyAppointmentVideoCall" :
                        item.appointment_type === "home-visit" ? "MyAppointmentVoiceCall" :
                            null;

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
                    details: response.data,
                    id: item._id,
                });
            }
        } catch (error) {
            console.log("Error in ViewDetails:", error);
        } finally {
            dispatch(hideLoader());
        }
    };

    useFocusEffect(
        useCallback(() => {
            completedAppointment();
        }, [])
    );

    return (
        // MODIFICATION: Set the background color to 'transparent'
        <View style={[styles.container, { backgroundColor: 'transparent' }]}>
            <FlatList
                data={completed}
                keyExtractor={item => item._id}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <View style={[styles.cardContainer, { backgroundColor: dark ? COLORS.dark2 : COLORS.white }]}>
                        <TouchableOpacity
                            style={styles.detailsViewContainer}
                            onPress={() => ViewDetails(item)}
                        >
                            <View style={{ position: 'relative' }}>
                                <Image
                                    source={{ uri: item.doctors?.[0]?.profilePhoto }}
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
                            <TouchableOpacity style={styles.buttonWrapper} onPress={() => ViewDetails(item)}>
                                <LinearGradient
                                    colors={['#00b4db', '#0077b6']}
                                    style={styles.gradientBtn}
                                >
                                    <Text style={styles.receiptBtnText}>View Details</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.buttonWrapper} onPress={() => viewPdfData(item)}>
                                <LinearGradient
                                    colors={['#00b4db', '#0077b6']}
                                    style={styles.gradientBtn}
                                >
                                    <Text style={styles.receiptBtnText}>View Prescription</Text>
                                </LinearGradient>
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
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
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
        fontFamily: "Urbanist-Bold"
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4
    },
    address: {
        fontSize: 12,
        fontFamily: "Urbanist-Regular",
        marginTop: 4
    },
    statusContainer: {
        borderWidth: 1,
        borderColor: '#0077b6',
        borderRadius: 6,
        paddingHorizontal: 6,
        paddingVertical: 2,
        marginLeft: 4
    },
    statusText: {
        fontSize: 10,
        color: '#0077b6',
        fontFamily: "Urbanist-Medium"
    },
    reviewContainer: {
        position: "absolute",
        top: 6,
        right: 16,
        height: 20,
        borderRadius: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 6
    },
    rating: {
        fontSize: 12,
        fontFamily: "Urbanist-SemiBold",
        color: COLORS.black,
        marginLeft: 4
    },
    iconContainer: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(0, 180, 219, 0.1)',
        marginLeft: 8
    },
    chatIcon: {
        width: 20,
        height: 20,
        tintColor: '#0077b6'
    },
    separateLine: {
        height: 1,
        marginVertical: 12
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    buttonWrapper: {
        flex: 0.48,
    },
    gradientBtn: {
        borderRadius: 24,
        alignItems: 'center',
        paddingVertical: 10
    },
    receiptBtnText: {
        color: COLORS.white,
        fontFamily: "Urbanist-SemiBold",
        fontSize: 14
    }
});

export default CompletedBooking;
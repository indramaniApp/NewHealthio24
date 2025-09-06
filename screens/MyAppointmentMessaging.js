import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeProvider';
import { COLORS, SIZES, icons } from '../constants';
import { ScrollView } from 'react-native-virtualized-view';

import LinearGradient from 'react-native-linear-gradient';

const MyAppointmentMessaging = ({ navigation, route }) => {
    const {
        name, age, gender, problem, appointment_approve_date, appointment_type,
        appointment_payment, doctorStreetAddresses, doctorCities,
        specialization = [], doctor_names
    } = route.params;

    const { dark } = useTheme();

    const renderHeader = () => (
        <View style={styles.headerContainer}>
            <View style={styles.headerLeft}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image
                        source={icons.back}
                        resizeMode='contain'
                    
                        style={[styles.backIcon, { tintColor: COLORS.white }]}
                    />
                </TouchableOpacity>
       
                <Text style={[styles.headerTitle, { color: COLORS.white }]}>
                    My Appointment
                </Text>
            </View>
            <TouchableOpacity>
                <Image
                    source={icons.moreCircle}
                    resizeMode='contain'
                   
                    style={[styles.moreIcon, { tintColor: COLORS.white }]}
                />
            </TouchableOpacity>
        </View>
    );

    const renderContent = () => (
        <View>
      
            <View> 
                <View style={[styles.doctorCard, { backgroundColor: dark ? COLORS.dark2 : COLORS.white }]}>
                    <Image
                        source={{ uri: route.params.doctor_photos?.[0] }}
                        resizeMode='contain'
                        style={styles.doctorImage}
                    />
                    <View style={{ flex: 1 }}>
                        <Text
                            style={[styles.doctorName, { color: dark ? COLORS.white : COLORS.greyscale900 }]}
                            numberOfLines={2}
                            ellipsizeMode="tail"
                        >
                            {doctor_names?.join(', ')}
                        </Text>
                        <View style={[styles.separateLine, { backgroundColor: dark ? COLORS.grayscale700 : COLORS.grayscale200 }]} />
                        <Text style={[styles.doctorSpeciality, { color: dark ? COLORS.grayscale400 : COLORS.greyScale800 }]}>
                            {specialization.length > 0
                                ? specialization.map((spec, index) => `${spec}${index !== specialization.length - 1 ? ', ' : ''}`)
                                : 'No specializations available.'}
                        </Text>
                        <Text style={[styles.doctorHospital, { color: dark ? COLORS.grayscale400 : COLORS.greyScale800 }]}>
                            {doctorStreetAddresses},{doctorCities}
                        </Text>
                    </View>
                </View>
            </View>

            <Text style={[styles.subtitle, { color: dark ? COLORS.grayscale200 : COLORS.greyscale900 }]}>
                Scheduled Appointment
            </Text>
            <Text style={[styles.description, { color: dark ? COLORS.grayscale400 : COLORS.greyScale800 }]}>
                {appointment_approve_date}
            </Text>

            <Text style={[styles.subtitle, { color: dark ? COLORS.grayscale200 : COLORS.greyscale900 }]}>
                Patient Information
            </Text>

            <View style={styles.viewContainer}>
                <View style={styles.viewLeft}>
                    <Text style={[styles.description, { color: dark ? COLORS.grayscale400 : COLORS.greyScale800 }]}>
                        Full Name
                    </Text>
                </View>
                <Text style={[styles.description, { color: dark ? COLORS.grayscale400 : COLORS.greyScale800 }]}>: {name}</Text>
            </View>

            <View style={styles.viewContainer}>
                <View style={styles.viewLeft}>
                    <Text style={[styles.description, { color: dark ? COLORS.grayscale400 : COLORS.greyScale800 }]}>
                        Gender
                    </Text>
                </View>
                <Text style={[styles.description, { color: dark ? COLORS.grayscale400 : COLORS.greyScale800 }]}>: {gender}</Text>
            </View>

            <View style={styles.viewContainer}>
                <View style={styles.viewLeft}>
                    <Text style={[styles.description, { color: dark ? COLORS.grayscale400 : COLORS.greyScale800 }]}>
                        Age
                    </Text>
                </View>
                <Text style={[styles.description, { color: dark ? COLORS.grayscale400 : COLORS.greyScale800 }]}>: {age}</Text>
            </View>

            <View style={styles.viewContainer}>
                <View style={styles.viewLeft}>
                    <Text style={[styles.description, { color: dark ? COLORS.grayscale400 : COLORS.greyScale800 }]}>
                        Problem
                    </Text>
                </View>
                <Text style={[styles.description, { color: dark ? COLORS.grayscale400 : COLORS.greyScale800 }]}>
                    : {problem}
                </Text>
            </View>

            <Text style={[styles.subtitle, { color: dark ? COLORS.grayscale200 : COLORS.greyscale900 }]}>Your Package</Text>

        
            <View>
                <View style={[styles.pkgContainer, { backgroundColor: dark ? COLORS.dark2 : COLORS.white }]}>
                    <View style={styles.pkgLeftContainer}>
                        <View style={styles.pkgIconContainer}>
                            <Image source={icons.chatBubble2} resizeMode='contain' style={styles.pkgIcon} />
                        </View>
                        <View>
                            <Text style={[styles.pkgTitle, { color: dark ? COLORS.greyscale300 : COLORS.greyscale900 }]}>
                                Appointment Type
                            </Text>
                            <Text style={[styles.pkgDescription, { color: dark ? COLORS.greyscale300 : COLORS.greyScale800 }]}>
                                {appointment_type}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.pkgRightContainer}>
                        <Text style={styles.pkgPrice}>₹ {appointment_payment}</Text>
                        <Text style={[styles.pkgPriceTag, { color: dark ? COLORS.grayscale400 : COLORS.greyScale800 }]}>
                            (paid)
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );

    return (
      
        <SafeAreaView style={styles.area}>
          
            <LinearGradient
                colors={['#00b4db', '#E0F7FA', '#FFFFFF']}
                style={styles.gradientContainer}
            >
                <View style={styles.container}>
                    {renderHeader()}
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {renderContent()}
                    </ScrollView>
                </View>
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    area: { 
        flex: 1 
    },
 
    gradientContainer: {
        flex: 1,
    },
    
    container: { 
        flex: 1, 
        padding: 16 
    },
    headerContainer: {
        flexDirection: "row", 
        alignItems: "center", 
        justifyContent: "space-between", 
        paddingBottom: 16
    },
    headerLeft: { 
        flexDirection: "row", 
        alignItems: "center" 
    },
    backIcon: { 
        height: 24, 
        width: 24, 
        marginRight: 16 
    },
    headerTitle: { 
        fontSize: 24, 
        fontFamily: "Urbanist-Bold" 
    },
    moreIcon: { 
        height: 24, 
        width: 24 
    },
    doctorCard: {
        minHeight: 142, 
        width: SIZES.width - 32, 
        borderRadius: 16, 
        flexDirection: "row", 
        alignItems: "center", 
        marginVertical: 12
    },
    doctorImage: { 
        height: 110, 
        width: 110, 
        borderRadius: 16, 
        marginHorizontal: 16 
    },
    doctorName: { 
        fontSize: 18, 
        fontFamily: "Urbanist-Bold" 
    },
    separateLine: { 
        height: 1, 
     
        width: SIZES.width - 32 - 110 - 32 - 16, 
        marginVertical: 12 
    },
    doctorSpeciality: { 
        fontSize: 12, 
        fontFamily: "Urbanist-Medium", 
        marginBottom: 8 
    },
    doctorHospital: { 
        fontSize: 12, 
        fontFamily: "Urbanist-Medium" 
    },
    subtitle: { 
        fontSize: 20, 
        fontFamily: "Urbanist-Bold", 
        marginVertical: 8 
    },
    description: { 
        fontSize: 14, 
        fontFamily: "Urbanist-Regular", 
        marginVertical: 6 
    },
    viewContainer: { 
        flexDirection: "row", 
        marginVertical: 2 
    },
    viewLeft: { 
        width: 120 
    },
    pkgContainer: {
        height: 100, 
        width: SIZES.width - 32, 
        borderRadius: 16, 
        flexDirection: "row",
        alignItems: "center", 
        justifyContent: "space-between", 
        marginVertical: 12
    },
    pkgLeftContainer: { 
        flexDirection: "row", 
        alignItems: "center" 
    },
    pkgIconContainer: {
        height: 60, 
        width: 60, 
        borderRadius: 999, 
        alignItems: "center", 
        justifyContent: "center",
        backgroundColor: COLORS.tansparentPrimary, 
        marginLeft: 12, 
        marginRight: 12
    },
    pkgIcon: { 
        height: 24, 
        width: 24,
        tintColor: COLORS.primary, 
    },
    pkgTitle: { 
        fontSize: 16, 
        fontFamily: "Urbanist-Bold", 
        marginVertical: 8 
    },
    pkgDescription: { 
        fontSize: 14, 
        fontFamily: "Urbanist-Regular" 
    },
    pkgRightContainer: { 
        alignItems: "center", 
        marginRight: 12 
    },
    pkgPrice: { 
        fontSize: 18, 
        fontFamily: "Urbanist-Bold", 
        color: COLORS.primary, 
        marginBottom: 4 
    },
    pkgPriceTag: { 
        fontSize: 10, 
        fontFamily: "Urbanist-Medium" 
    }
});

export default MyAppointmentMessaging;
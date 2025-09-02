import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Alert,
    ScrollView 
} from 'react-native';
import React, { useState, useRef, useCallback } from 'react';
import { COLORS, SIZES, icons, images } from '../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeProvider';
import SettingsItem from '../components/SettingsItem';
import RBSheet from "react-native-raw-bottom-sheet";
import Button from '../components/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import ApiService from '../src/api/ApiService';
import { ENDPOINTS } from '../src/constants/Endpoints';
import LinearGradient from 'react-native-linear-gradient';

const Profile = ({ navigation }) => {
    const refRBSheet = useRef();
    const { dark, colors, setScheme } = useTheme();
    const [profile, setProfile] = useState([]);

    const FetchProfileData = async () => {
        try {
            const response = await ApiService.get(ENDPOINTS.patient_profile);
            if (response?.data) {
                setProfile(response.data);
            } else {
                throw new Error("No data found");
            }
        } catch (error) {
            console.error('Error fetching profile data:', error);
            Alert.alert('Error', 'Failed to load profile data.');
        }
    };

    useFocusEffect(
        useCallback(() => {
            FetchProfileData();
        }, [])
    );

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('USER_TOKEN');
            await AsyncStorage.removeItem('USER_ROLE');
            refRBSheet.current.close();
            navigation.replace('Login');
        } catch (error) {
            console.error("Error logging out: ", error);
        }
    };

    const renderHeader = () => (
        <TouchableOpacity style={styles.headerContainer}>
           {/* Header content can go here */}
        </TouchableOpacity>
    );

    const renderProfile = () => {
        const fallbackImage = images.user1;
        return (
            <View style={styles.profileContainer}>
                <Image
                    source={profile[0]?.patient_picture ? { uri: profile[0]?.patient_picture } : fallbackImage}
                    style={styles.avatar}
                    resizeMode='cover'
                />
                <Text style={[styles.title, { color: COLORS.black }]}>{profile[0]?.fullName}</Text>
                <Text style={[styles.subtitle, { color: COLORS.black }]}>Dob: {profile[0]?.dateOfBirth}</Text>
                <Text style={[styles.subtitle, { color: COLORS.black }]}>Email: {profile[0]?.emailAddress}</Text>
                <Text style={[styles.subtitle, { color: COLORS.black }]}>Mob: {profile[0]?.contactNumber}</Text>
                <Text style={[styles.subtitle, { color: COLORS.black }]}>Gender: {profile[0]?.gender}</Text>
            </View>
        );
    };
 
    const renderSettings = () => (
        <View style={[styles.settingsContainer, { backgroundColor: colors.background, borderRadius: 16, padding: 16 }]}>
            <SettingsItem
                icon={icons.userOutline}
                name="Edit Profile"
                onPress={() => navigation.navigate("EditProfile", { profile })}
            />
            <SettingsItem
                icon={icons.shieldOutline}
                name="Security"
                onPress={() => navigation.navigate("SettingsSecurity")}
            />
            <SettingsItem
                icon={icons.lockedComputerOutline}
                name="Privacy Policy"
                onPress={() => navigation.navigate("SettingsPrivacyPolicy")}
            />
            <SettingsItem
                icon={icons.infoCircle}
                name="Help Center"
                onPress={() => navigation.navigate("HelpCenter")}
            />
            <SettingsItem
                icon={icons.people4}
                name="Invite Friends"
                onPress={() => navigation.navigate("InviteFriends")}
            />
            <TouchableOpacity onPress={() => navigation.navigate("AccountDelete")} style={styles.logoutContainer}>
                <View style={styles.logoutLeftContainer}>
                    <Image source={icons.logout} style={[styles.logoutIcon, { tintColor: "red" }]} />
                    <Text style={[styles.logoutName, { color: "red" }]}>Account Deletion</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => refRBSheet.current.open()} style={styles.logoutContainer}>
                <View style={styles.logoutLeftContainer}>
                    <Image source={icons.logout} style={[styles.logoutIcon, { tintColor: "red" }]} />
                    <Text style={[styles.logoutName, { color: "red" }]}>Logout</Text>
                </View>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.area}>
            <LinearGradient
                colors={['#00b4db', '#fff', '#fff', '#fff', '#fff']}
                style={styles.gradientContainer}
            >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContainer}
                >
                    <View style={styles.container}>
                        {renderHeader()}
                        {renderProfile()}
                        {renderSettings()}
                    </View>
                </ScrollView>
            </LinearGradient>

            <RBSheet
                ref={refRBSheet}
                closeOnDragDown
                closeOnPressMask={false}
                height={260}
                customStyles={{
                    wrapper: { backgroundColor: "rgba(0,0,0,0.5)" },
                    draggableIcon: { backgroundColor: dark ? COLORS.gray2 : COLORS.grayscale200 },
                    container: {
                        borderTopRightRadius: 32,
                        borderTopLeftRadius: 32,
                        backgroundColor: dark ? COLORS.dark2 : COLORS.white
                    }
                }}
            >
                <Text style={styles.bottomTitle}>Logout</Text>
                <View style={[styles.separateLine, { backgroundColor: dark ? COLORS.greyScale800 : COLORS.grayscale200 }]} />
                <Text style={[styles.bottomSubtitle, { color: dark ? COLORS.white : COLORS.black }]}>
                    Are you sure you want to log out?
                </Text>
                <View style={styles.bottomContainer}>
                    <Button
                        title="Cancel"
                        style={{
                            width: (SIZES.width - 32) / 2 - 8,
                            backgroundColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary,
                            borderRadius: 32
                        }}
                        textColor={dark ? COLORS.white : COLORS.primary}
                        onPress={() => refRBSheet.current.close()}
                    />
                    <Button
                        title="Yes, Logout"
                        filled
                        style={styles.logoutButton}
                        onPress={handleLogout}
                    />
                </View>
            </RBSheet>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    area: { flex: 1 },
    gradientContainer: {
        flex: 1,
    },
    scrollContainer: {
        flexGrow: 1,
        paddingBottom: 100, // <-- बस यह लाइन जोड़ी गई है
    },
    container: {
        flex: 1,
        paddingHorizontal: 16,
    },
    headerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: 16,
        paddingBottom: 10,
    },
    profileContainer: {
        alignItems: "center",
        paddingVertical: 2
    },
    avatar: {
        width: 120, height: 120, borderRadius: 60,
        borderWidth: 3,
        borderColor: COLORS.white,
    },
    title: {
        fontSize: 25,
        fontFamily: "Urbanist Bold",
        marginTop: 4
    },
    subtitle: {
        fontSize: 15,
        fontFamily: "Urbanist Regular",
        marginTop: 6,
        opacity: 0.9,
        fontWeight: "bold"
    },
    settingsContainer: {
        marginVertical: 12,
    },
    logoutContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 12
    },
    logoutLeftContainer: {
        flexDirection: "row", alignItems: "center"
    },
    logoutIcon: {
        height: 24, width: 24
    },
    logoutName: {
        fontSize: 18,
        fontFamily: "Urbanist-SemiBold",
        marginLeft: 12
    },
    bottomContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 12,
        paddingHorizontal: 16
    },
    logoutButton: {
        width: (SIZES.width - 32) / 2 - 8,
        borderRadius: 32
    },
    bottomTitle: {
        fontSize: 24,
        fontFamily: "Urbanist-SemiBold",
        color: "red",
        textAlign: "center",
        marginTop: 12
    },
    bottomSubtitle: {
        fontSize: 20,
        fontFamily: "Urbanist-SemiBold",
        textAlign: "center",
        marginVertical: 28
    },
    separateLine: {
        width: SIZES.width,
        height: 1,
        marginTop: 12
    }
});

export default Profile;
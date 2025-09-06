import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import { COLORS, icons } from '../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import { ScrollView } from 'react-native-virtualized-view';
import GlobalSettingsItem from '../components/GlobalSettingsItem';
import Button from '../components/Button';
import { useTheme } from '../theme/ThemeProvider';
import LinearGradient from 'react-native-linear-gradient'; // <-- ग्रेडिएंट के लिए इम्पोर्ट करें

// Settings for security
const SettingsSecurity = ({ navigation }) => {
    const [isRememberMeEnabled, setIsRememberMeEnabled] = useState(true);
    const [isFaceIDEnabled, setIsFaceIDEnabled] = useState(false);
    const [isBiometricIDEnabled, setIsBiometricIDEnabled] = useState(true);
    const { colors, dark } = useTheme();

    const toggleRememberMe = () => {
        setIsRememberMeEnabled(!isRememberMeEnabled);
    };

    const toggleFaceID = () => {
        setIsFaceIDEnabled(!isFaceIDEnabled);
    };

    const toggleBiometricID = () => {
        setIsBiometricIDEnabled(!isBiometricIDEnabled);
    }
    return (
        <SafeAreaView style={styles.area}>
            <LinearGradient
                colors={['#00b4db', '#fff', '#fff', '#fff', '#fff']}
                style={styles.gradientContainer}
            >
                <View style={styles.container}>
                    <Header title="Security"
                        onBackPress={() => navigation.goBack()}
                    />
                    <ScrollView style={styles.scrollView}
                        showsVerticalScrollIndicator={false}>
                        <GlobalSettingsItem
                            title="Remember me"
                            isNotificationEnabled={isRememberMeEnabled}
                            toggleNotificationEnabled={toggleRememberMe}
                        />
                        <GlobalSettingsItem
                            title="Face ID"
                            isNotificationEnabled={isFaceIDEnabled}
                            toggleNotificationEnabled={toggleFaceID}
                        />
                        <GlobalSettingsItem
                            title="Biometric ID"
                            isNotificationEnabled={isBiometricIDEnabled}
                            toggleNotificationEnabled={toggleBiometricID}
                        />
                        <TouchableOpacity style={styles.view}>
                            <Text style={[styles.viewLeft, { color: dark ? COLORS.white : COLORS.greyscale900 }]}>Google Authenticator</Text>
                            <Image
                                source={icons.arrowRight}
                                resizeMode='contain'
                                style={[styles.arrowRight, { tintColor: dark ? COLORS.primary : COLORS.greyscale900 }]}
                            />
                        </TouchableOpacity>
                        <Button
                            title="Change PIN"
                            style={{
                                backgroundColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary,
                                borderRadius: 32,
                                borderColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary,
                                marginTop: 22
                            }}
                            textColor={dark ? COLORS.white : COLORS.primary}
                            onPress={() => { navigation.navigate("ChangePIN") }}
                        />
                        <Button
                            title="Change Password"
                            style={{
                                backgroundColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary,
                                borderRadius: 32,
                                borderColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary,
                                marginTop: 22
                            }}
                            textColor={dark ? COLORS.white : COLORS.primary}
                            onPress={() => { navigation.navigate("ChangePassword") }}
                        />
                        <Button
                            title="Change Email"
                            style={{
                                backgroundColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary,
                                borderRadius: 32,
                                borderColor: dark ? COLORS.dark3 : COLORS.tansparentPrimary,
                                marginTop: 22
                            }}
                            textColor={dark ? COLORS.white : COLORS.primary}
                            onPress={() => { navigation.navigate("ChangeEmail") }}
                        />
                    </ScrollView>
                </View>
            </LinearGradient>
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    area: {
        flex: 1,
    },
    gradientContainer: { // <-- ग्रेडिएंट के लिए स्टाइल
        flex: 1,
    },
    container: {
        flex: 1,
        paddingHorizontal: 16, // <-- padding को हॉरिजॉन्टल किया
    },
    scrollView: {
        marginVertical: 22
    },
    arrowRight: {
        height: 24,
        width: 24,
        tintColor: COLORS.greyscale900
    },
    view: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 16
    },
    viewLeft: {
        fontSize: 18,
        fontFamily: "Urbanist SemiBold",
        color: COLORS.greyscale900,
        marginRight: 8
    },
    button: {
        backgroundColor: COLORS.tansparentPrimary,
        borderRadius: 32,
        borderColor: COLORS.tansparentPrimary,
        marginTop: 22
    }
})

export default SettingsSecurity;
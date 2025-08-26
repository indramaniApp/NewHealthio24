import { View, Platform, Image, Text } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { COLORS, icons } from '../constants';
import { useTheme } from '../theme/ThemeProvider';
import { Appointment, History, Profile } from '../screens';
import { useDispatch } from 'react-redux';
import { showLoader, hideLoader } from '../src/redux/slices/loaderSlice';
import { fetchData } from '../src/redux/slices/dataSlice';
import DrawerNavigator from './DrawerNavigation';
import Wallet from '../screens/newScreens/WalletScreen';
import LinearGradient from 'react-native-linear-gradient';

const Tab = createBottomTabNavigator();

const BottomTabNavigation = () => {
    const { dark } = useTheme();
    const dispatch = useDispatch();

    const handleTabChange = (tab) => {
        dispatch(showLoader());
        setTimeout(() => {
            dispatch(hideLoader());
        }, 1200);
    };

    const handleFetchData = (tabName) => {
        dispatch(fetchData(tabName));
    };

 
    const getTabIcon = (focused, iconFocused, iconUnfocused, label, gradientColors) => (
        <View style={{ alignItems: "center", justifyContent: 'center', width: 80 }}>
            {focused ? (
                <LinearGradient
                    colors={gradientColors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                        padding: 8,
                        borderRadius: 20,
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: 2,
                    }}
                >
                    <Image
                        source={iconFocused}
                        resizeMode="contain"
                        style={{
                            height: 24,
                            width: 24,
                            tintColor: COLORS.white,
                        }}
                    />
                </LinearGradient>
            ) : (
                <Image
                    source={iconUnfocused}
                    resizeMode="contain"
                    style={{
                        height: 24,
                        width: 24,
                        tintColor: COLORS.gray3,
                        marginBottom: 2,
                    }}
                />
            )}
            <Text
                style={{
                    fontSize: 11,
                    fontWeight: focused ? "700" : "500",
                    color: focused ? gradientColors[0] : COLORS.gray3,
                    textAlign: "center",
                }}
            >
                {label}
            </Text>
            {focused && (
                <LinearGradient
                    colors={gradientColors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{
                        height: 2,
                        width: 20,
                        marginTop: 4,
                        borderRadius: 1,
                    }}
                />
            )}
        </View>
    );

    return (
        <Tab.Navigator
            screenOptions={{
                tabBarShowLabel: false,
                headerShown: false,
                tabBarStyle: {
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    left: 0,
                    height: Platform.OS === "ios" ? 80 : 60,
                    borderTopWidth: 0,
                },
           
                tabBarBackground: () => (
                    <LinearGradient
                        colors={dark ? ["#1e1e1e", "#121212"] : ["#f8fafc", "#e0f2fe"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{ flex: 1 }}
                    />
                ),
            }}
        >
            {/* Home */}
            <Tab.Screen
                name="Home"
                component={DrawerNavigator}
                listeners={{
                    focus: () => { handleTabChange("Home"); handleFetchData("Home"); },
                }}
                options={{
                    tabBarIcon: ({ focused }) =>
                        getTabIcon(focused, icons.home, icons.home2Outline, "Home", ["#3B82F6", "#60A5FA"]) // Blue gradient
                }}
            />

            {/* Appointment */}
            <Tab.Screen
                name="Appointment"
                component={Appointment}
                listeners={{
                    focus: () => { handleTabChange("Appointment"); handleFetchData("Appointment"); },
                }}
                options={{
                    tabBarIcon: ({ focused }) =>
                        getTabIcon(focused, icons.calendar5, icons.calendar, "Appointment", ["#10B981", "#34D399"]) // Green gradient
                }}
            />

            {/* Wallet */}
            <Tab.Screen
                name="Wallet"
                component={Wallet}
                listeners={{
                    focus: () => { handleTabChange("Wallet"); handleFetchData("Wallet"); },
                }}
                options={{
                    tabBarIcon: ({ focused }) =>
                        getTabIcon(focused, icons.wallet, icons.walletOutline, "Wallet", ["#8B5CF6", "#A78BFA"]) // Purple gradient
                }}
            />

            {/* History */}
            <Tab.Screen
                name="History"
                component={History}
                listeners={{
                    focus: () => { handleTabChange("History"); handleFetchData("History"); },
                }}
                options={{
                    tabBarIcon: ({ focused }) =>
                        getTabIcon(focused, icons.document, icons.documentOutline, "History", ["#F59E0B", "#FBBF24"]) // Amber gradient
                }}
            />

            {/* Profile */}
            <Tab.Screen
                name="Profile"
                component={Profile}
                listeners={{
                    focus: () => { handleTabChange("Profile"); handleFetchData("Profile"); },
                }}
                options={{
                    tabBarIcon: ({ focused }) =>
                        getTabIcon(focused, icons.user, icons.userOutline, "Profile", ["#EF4444", "#F87171"]) // Red gradient
                }}
            />
        </Tab.Navigator>
    );
};

export default BottomTabNavigation;

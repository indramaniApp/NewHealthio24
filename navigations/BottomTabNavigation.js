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

    const getTabIcon = (focused, iconFocused, iconUnfocused, label) => (
        <View style={{ 
            alignItems: "center", 
            justifyContent: 'center',
            width: 80, // enough width to show long words
        }}>
            <Image
                source={focused ? iconFocused : iconUnfocused}
                resizeMode='contain'
                style={{
                    height: 24,
                    width: 24,
                    tintColor: focused ? COLORS.primary : COLORS.gray3,
                    marginBottom: 2
                }}
            />
            <Text
                style={{
                    fontSize: 11,
                    fontWeight: focused ? '700' : '500',
                    color: focused ? COLORS.primary : COLORS.gray3,
                    textAlign: 'center',
                }}
            >
                {label}
            </Text>
            {focused && (
                <View style={{
                    height: 2,
                    width: 20,
                    backgroundColor: COLORS.primary,
                    marginTop: 4,
                    borderRadius: 1,
                }} />
            )}
        </View>
    );

    return (
        <Tab.Navigator
            screenOptions={{
                tabBarShowLabel: false,
                headerShown: false,
                tabBarStyle: {
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    left: 0,
                    height: Platform.OS === 'ios' ? 80 : 60,
                    backgroundColor: dark ? COLORS.dark1 : COLORS.white,
                    borderTopColor: dark ? COLORS.gray3 : "#eee",
                    elevation: 0,
                },
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
                    tabBarIcon: ({ focused }) => getTabIcon(focused, icons.home, icons.home2Outline, "Home")
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
                    tabBarIcon: ({ focused }) => getTabIcon(focused, icons.calendar5, icons.calendar, "Appointment")
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
                    tabBarIcon: ({ focused }) => getTabIcon(focused, icons.wallet, icons.walletOutline, "Wallet")
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
                    tabBarIcon: ({ focused }) => getTabIcon(focused, icons.document, icons.documentOutline, "History")
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
                    tabBarIcon: ({ focused }) => getTabIcon(focused, icons.user, icons.userOutline, "Profile")
                }}
            />
        </Tab.Navigator>
    );
};

export default BottomTabNavigation;

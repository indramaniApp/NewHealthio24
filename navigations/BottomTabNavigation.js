import { View, Platform, Image, Text } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { COLORS, icons } from '../constants';
import { useTheme } from '../theme/ThemeProvider';
import { Appointment, History, Home, Profile } from '../screens';
import { useDispatch } from 'react-redux';
import { showLoader, hideLoader } from '../src/redux/slices/loaderSlice';
import { fetchData } from '../src/redux/slices/dataSlice';
import Wallet from '../screens/newScreens/WalletScreen';
import LinearGradient from 'react-native-linear-gradient';

const Tab = createBottomTabNavigator();

const BottomTabNavigation = () => {
  const { dark } = useTheme();
  const dispatch = useDispatch();

  const handleTabChange = () => {
    dispatch(showLoader());
    setTimeout(() => dispatch(hideLoader()), 700);
  };

  const handleFetchData = (tab) => dispatch(fetchData(tab));

  /* ---------------- TAB ICON ---------------- */
  const getTabIcon = (
    focused,
    iconFocused,
    iconUnfocused,
    label,
    gradientColors
  ) => (
    <View style={{ 
      alignItems: 'center', 
      justifyContent: 'center', 
      minWidth: 75,
      paddingTop: 12
    }}>
      {focused ? (
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: 50,
            height: 50,
            borderRadius: 25,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 6,
            elevation: 6,
          }}
        >
          <Image
            source={iconFocused}
            resizeMode="contain"
            style={{ width: 24, height: 24, tintColor: COLORS.white }}
          />
        </LinearGradient>
      ) : (
        <Image
          source={iconUnfocused}
          resizeMode="contain"
          style={{
            width: 24,
            height: 24,
            tintColor: COLORS.gray3,
            marginBottom: 6,
          }}
        />
      )}

      <Text
        style={{
          fontSize: 12,
          fontWeight: focused ? '800' : '600',
          color: focused ? gradientColors[0] : COLORS.gray3,
          textAlign: 'center',
          width: '100%',
        }}
      >
        {label}
      </Text>
    </View>
  );

  /* ---------------- NAVIGATOR ---------------- */
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
           position: 'absolute', 
          height: Platform.OS === 'ios' ? 100 : 80,
          backgroundColor: '#ffffff', // simple white background
          borderTopLeftRadius: 20,    // top left radius
          borderTopRightRadius: 20,   // top right radius
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          
          paddingBottom: Platform.OS === 'ios' ? 25 : 12,
        },
         sceneContainerStyle: {
      backgroundColor: '#ffffff',   // ✅ CRITICAL FIX
    },
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        listeners={{ focus: () => { handleTabChange(); handleFetchData('Home'); } }}
        options={{
          tabBarIcon: ({ focused }) =>
            getTabIcon(
              focused,
              icons.home,
              icons.home2Outline,
              'Home',
              ['#ff5f6d', '#ffc371'] // vibrant icon gradient
            ),
        }}
      />

      <Tab.Screen
        name="Appointment"
        component={Appointment}
        listeners={{ focus: () => { handleTabChange(); handleFetchData('Appointment'); } }}
        options={{
          tabBarIcon: ({ focused }) =>
            getTabIcon(
              focused,
              icons.calendar5,
              icons.calendar,
              'Appointments',
              ['#ff5f6d', '#ffc371']
            ),
        }}
      />

      <Tab.Screen
        name="Wallet"
        component={Wallet}
        listeners={{ focus: () => { handleTabChange(); handleFetchData('Wallet'); } }}
        options={{
          tabBarIcon: ({ focused }) =>
            getTabIcon(
              focused,
              icons.wallet,
              icons.walletOutline,
              'Care Fund',
             ['#ff5f6d', '#ffc371']
            ),
        }}
      />

      <Tab.Screen
        name="History"
        component={History}
        listeners={{ focus: () => { handleTabChange(); handleFetchData('History'); } }}
        options={{
          tabBarIcon: ({ focused }) =>
            getTabIcon(
              focused,
              icons.document,
              icons.documentOutline,
              'History',
             ['#ff5f6d', '#ffc371']
            ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={Profile}
        listeners={{ focus: () => { handleTabChange(); handleFetchData('Profile'); } }}
        options={{
          tabBarIcon: ({ focused }) =>
            getTabIcon(
              focused,
              icons.user,
              icons.userOutline,
              'Profile',
            ['#ff5f6d', '#ffc371']
            ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigation;

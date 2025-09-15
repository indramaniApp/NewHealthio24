// App.js
globalThis.RNFB_SILENCE_MODULAR_DEPRECATION_WARNINGS = true;

import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigation from './navigations/AppNavigation';
import {
  LogBox,
  StatusBar,
  View,
  Alert,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Loader from './components/Loader';
import { useSelector } from 'react-redux';
import Orientation from 'react-native-orientation-locker';
import messaging from '@react-native-firebase/messaging';
import 'react-native-reanimated';
import ApiService from './src/api/ApiService';
import { ENDPOINTS } from './src/constants/Endpoints';

// ✅  your API helpers


LogBox.ignoreAllLogs();

/* ---------- Send FCM token to backend ---------- */
const sendFcmToken = async (token) => {
  try {
    // true = need auth header (USER_TOKEN already stored)
    await ApiService.post(ENDPOINTS.fcm_token, { fcmToken: token }, true, false);
    console.log('📨 FCM token sent to backend');
  } catch (err) {
    console.error('❌ Failed to send FCM token:', err);
  }
};

const App = () => {
  const loading = useSelector((state) => state.loader.isLoading);

  useEffect(() => {
    Orientation.lockToPortrait();

    /* ---- Android 13+ notification permission ---- */
    const requestAndroidPermission = async () => {
      if (Platform.OS === 'android' && Platform.Version >= 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
        console.log('POST_NOTIFICATIONS granted:', granted);
      }
    };

    /* ---- Ask FCM permission & send token ---- */
    const requestUserPermission = async () => {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        const fcmToken = await messaging().getToken();
        console.log('✅ FCM Token:', fcmToken);
        // 🔹 Send to backend
        sendFcmToken(fcmToken);
      } else {
        console.log('❌ Push notification permission not granted');
      }
    };

    requestAndroidPermission();
    requestUserPermission();

    /* ---- Foreground message listener ---- */
    const unsubscribeForeground = messaging().onMessage(async (remoteMessage) => {
      Alert.alert('New FCM Message!', JSON.stringify(remoteMessage.notification));
    });

    /* ---- Triggered when app opened from notification ---- */
    const unsubscribeOpened = messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log('Notification caused app to open:', remoteMessage);
    });

    return () => {
      Orientation.unlockAllOrientations();
      unsubscribeForeground();
      unsubscribeOpened();
    };
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Loader visible={loading} />
      <View style={{ flex: 1, backgroundColor: '#00b4db' }}>
        <SafeAreaProvider>
          <StatusBar barStyle="light-content" backgroundColor="#00b4db" />
          <AppNavigation />
        </SafeAreaProvider>
      </View>
    </GestureHandlerRootView>
  );
};

export default App;

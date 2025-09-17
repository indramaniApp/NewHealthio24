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
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-reanimated';

LogBox.ignoreAllLogs();

const FCM_STORAGE_KEY = 'FCM_TOKEN';

const App = () => {
  const loading = useSelector((state) => state.loader.isLoading);

  useEffect(() => {
    console.log('🔵 App mounted – starting FCM setup');
    Orientation.lockToPortrait();

    const requestAndroidPermission = async () => {
      console.log('🔵 Checking Android POST_NOTIFICATIONS permission…');
      if (Platform.OS === 'android' && Platform.Version >= 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
        console.log('POST_NOTIFICATIONS granted:', granted);
      }
    };

    const getAndStoreFcmToken = async () => {
      try {
        console.log('🔵 Requesting messaging permission…');
        const authStatus = await messaging().requestPermission();
        console.log('🔵 messaging.requestPermission status:', authStatus);

        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (!enabled) {
          console.log('❌ Push notification permission not granted');
          return;
        }

        console.log('🔵 Getting FCM token (device) …');
        const token = await messaging().getToken();
        console.log('🔵 messaging().getToken() result:', token);

        if (token) {
          await AsyncStorage.setItem(FCM_STORAGE_KEY, token);
          console.log('✅ FCM token stored locally (AsyncStorage).');
          // NOTE: Do NOT send to backend here. Send after successful login.
        } else {
          console.log('⚠️ messaging().getToken() returned null/empty.');
        }
      } catch (err) {
        console.error('❌ Error getting/storing FCM token:', err);
      }
    };

    getAndStoreFcmToken();

    // onTokenRefresh -> update local storage (so latest device token is available at login time)
    const unsubscribeTokenRefresh = messaging().onTokenRefresh(async (newToken) => {
      console.log('🔄 onTokenRefresh received new token:', newToken);
      try {
        await AsyncStorage.setItem(FCM_STORAGE_KEY, newToken);
        console.log('✅ Refreshed token stored locally.');
      } catch (e) {
        console.error('❌ Failed to store refreshed token locally:', e);
      }
    });

    // Foreground message handler
    const unsubscribeForeground = messaging().onMessage(async (remoteMessage) => {
      console.log('🔔 Foreground message received:', remoteMessage);
      Alert.alert(
        remoteMessage.notification?.title || 'Notification',
        remoteMessage.notification?.body || ''
      );
    });

    // Background (when user taps a notification and app was in background)
    const unsubscribeOpened = messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log('📩 Notification opened from background:', remoteMessage);
      // you can navigate based on remoteMessage.data here
    });

    // Quit / Kill state (app opened by tapping notification)
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log('🚀 App opened from quit/kill state with message:', remoteMessage);
          // handle initial notification
        }
      })
      .catch((e) => console.error('❌ getInitialNotification error:', e));

    return () => {
      console.log('🔵 Cleaning up FCM listeners in App.js');
      unsubscribeForeground();
      unsubscribeOpened();
      unsubscribeTokenRefresh();
      Orientation.unlockAllOrientations();
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

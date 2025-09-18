
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

    /* ✅ 1. Android 13+ notification permission popup */
    const requestAndroidPermission = async () => {
      try {
        if (Platform.OS === 'android' && Platform.Version >= 33) {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
          );
          console.log('🔵 POST_NOTIFICATIONS granted:', granted);
        }
      } catch (err) {
        console.error('❌ POST_NOTIFICATIONS request error:', err);
      }
    };

    requestAndroidPermission(); 
    /* ✅ 2. Ask Firebase messaging permission & store token */
    const getAndStoreFcmToken = async () => {
      try {
        console.log('🔵 Requesting FCM permission…');
        const authStatus = await messaging().requestPermission();
        console.log('🔵 messaging.requestPermission status:', authStatus);

        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (!enabled) {
          console.log('❌ Push notification permission not granted');
          return;
        }

        console.log('🔵 Getting FCM token…');
        const token = await messaging().getToken();
        console.log('✅ FCM token:', token);

        if (token) {
          await AsyncStorage.setItem(FCM_STORAGE_KEY, token);
          console.log('✅ FCM token saved locally');
          // ⚠️ Send this token to backend only AFTER successful login
        } else {
          console.log('⚠️ FCM token was empty');
        }
      } catch (err) {
        console.error('❌ getAndStoreFcmToken error:', err);
      }
    };

    getAndStoreFcmToken();

    /* ✅ 3. Refresh token listener */
    const unsubscribeTokenRefresh = messaging().onTokenRefresh(async (newToken) => {
      console.log('🔄 Token refreshed:', newToken);
      try {
        await AsyncStorage.setItem(FCM_STORAGE_KEY, newToken);
      } catch (e) {
        console.error('❌ Failed to save refreshed token:', e);
      }
    });

    /* ✅ 4. Foreground messages */
    const unsubscribeForeground = messaging().onMessage(async (remoteMessage) => {
      console.log('🔔 Foreground FCM message:', remoteMessage);
      Alert.alert(
        remoteMessage.notification?.title || 'Notification',
        remoteMessage.notification?.body || ''
      );
    });

    /* ✅ 5. Background (user taps while in background) */
    const unsubscribeOpened = messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log('📩 Opened from background:', remoteMessage);
      // navigate based on remoteMessage.data if needed
    });

    /* ✅ 6. App launched from killed state */
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log('🚀 Opened from quit/kill state:', remoteMessage);
          // handle initial notification if required
        }
      })
      .catch((e) => console.error('❌ getInitialNotification error:', e));

    return () => {
      console.log('🔵 Cleaning up listeners========');
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

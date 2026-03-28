globalThis.RNFB_SILENCE_MODULAR_DEPRECATION_WARNINGS = true;

import React, { useEffect } from 'react';
import {
  View,
  PermissionsAndroid,
  Platform,
  Linking,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import AppNavigation from './navigations/AppNavigation';
import Loader from './components/Loader';

import messaging from '@react-native-firebase/messaging';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { navigationRef } from './navigations/AppNavigation';
const App = () => {





  useEffect(() => {
    // Check if the user accepted a call in Headless state natively via Deep Linking
    const handleDeepLink = (event) => {
      const url = event?.url || event;
      if (url && url.startsWith('healthio24://call')) {
        const getQuery = (param) => url.split(param + '=')[1]?.split('&')[0];
        const action = getQuery('action');
        if (action === 'accept' || action === 'view') {
          // Keep trying to navigate until AppNavigation finishes mounting and hydration completes
          let attempts = 0;
          const navigateInterval = setInterval(() => {
            attempts++;
            if (navigationRef.isReady()) {
              clearInterval(navigateInterval);
              // Small delay to allow initialRouteName to settle before pushing a new screen
              setTimeout(() => {
                navigationRef.navigate('PatientVideoCallScreen', {
                  appointmentId: getQuery('appointmentId'),
                  fcmAppointmentId: getQuery('fcmAppointmentId'),
                  doctorName: decodeURIComponent(getQuery('doctorName') || 'Doctor'),
                  callAcceptedViaCallKeep: action === 'accept',
                });
              }, 400); // 400ms delay protects against navigation reset bugs
            }
            if (attempts > 100) clearInterval(navigateInterval); // Stop after 5 seconds
          }, 50);
        }
      }
    };

    // Check for cold boot launch
    Linking.getInitialURL().then(url => {
      if (url) handleDeepLink(url);
    });

    // Check for warm/background launch
    const linkingSubscription = Linking.addEventListener('url', handleDeepLink);

    // ✅ Permissions
    const initPermissions = async () => {
      if (Platform.OS === 'android') {
        await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
        ]);
      }
    };
    initPermissions();

    // ✅ Foreground Message
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log('📱 Foreground:', JSON.stringify(remoteMessage));
      if (remoteMessage?.data?.type === 'incoming_call') {
        const callDataStr = await AsyncStorage.getItem('CALL_DATA');
        let callUUID = remoteMessage.data.callUUID; // fallback

        if (!callUUID) {
          // It's a new call
          callUUID = Date.now().toString();
          await AsyncStorage.setItem('CALL_DATA', JSON.stringify({ ...remoteMessage.data, callUUID }));
        }

        // Send to Redux or display directly so user can interact
        // Just jumping to PatientVideoCallScreen natively
        if (navigationRef.isReady()) {
          navigationRef.navigate('PatientVideoCallScreen', {
            appointmentId: remoteMessage.data.appointmentId,
            fcmAppointmentId: remoteMessage.data.fcmAppointmentId,
            doctorName: remoteMessage.data.doctorName || 'Doctor',
            callAcceptedViaCallKeep: false,
          });
        }
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
      if (linkingSubscription) linkingSubscription.remove();
    };
  }, []);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* <Loader visible={loading} /> */}
      <View style={{ flex: 1 }}>
        <SafeAreaProvider>
          <AppNavigation />
        </SafeAreaProvider>
      </View>
    </GestureHandlerRootView>
  );
};

export default App;
/**
 * @format
 */

import React from 'react';
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

import { Provider } from 'react-redux';
import store from './src/redux/store';

import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';

import RNCallKeep from 'react-native-callkeep';
import { PermissionsAndroid, Platform } from 'react-native';

// Simplified UUID generation to avoid crypto.getRandomValues() crashes natively
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

const CALL_DATA_KEY = 'CALL_DATA';

const options = {
  ios: {
    appName: 'Healthio24',
  },
  android: {
    selfManaged: false,
    alertTitle: 'Permissions required',
    alertDescription: 'This application needs to access your phone accounts',
    cancelButton: 'Cancel',
    okButton: 'ok',
    imageName: 'phone_account_icon',
    additionalPermissions: [
      PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
    ],
    foregroundService: {
      channelId: 'org.meditechhealthcare.healthio24',
      channelName: 'Foreground service',
      notificationTitle: 'App running in background',
      notificationIcon: 'ic_launcher',
    },
  }
};

RNCallKeep.setup(options).then(accepted => {
  console.log("✅ CallKeep Headless Setup accepted:", accepted);
});

RNCallKeep.addEventListener('answerCall', async ({ callUUID }) => {
  console.log('✅ Background Call Answered:', callUUID);
  RNCallKeep.backToForeground();
  await AsyncStorage.setItem('ACTIVE_CALL_ACCEPTED', 'true');
});

RNCallKeep.addEventListener('endCall', async ({ callUUID }) => {
  console.log('❌ Background Call Ended:', callUUID);
  await AsyncStorage.removeItem(CALL_DATA_KEY);
  await AsyncStorage.removeItem('ACTIVE_CALL_ACCEPTED');
  RNCallKeep.endAllCalls();
});

// ✅ Background handler (Redux yahan use nahi karna)
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('🔔 Background Message:', remoteMessage?.data);

  if (remoteMessage?.data?.type === 'incoming_call') {
    const callUUID = generateUUID();
    const doctorName = remoteMessage.data.doctorName || 'Doctor';
    
    // Add UUID so it matches CallKeep
    await AsyncStorage.setItem(
      CALL_DATA_KEY,
      JSON.stringify({ ...remoteMessage.data, callUUID })
    );
    console.log('✅ Call data saved (background)');
    
    // Only use CallKeep for iOS (CallKit). 
    // Android is handled natively via CallForegroundService to bypass OEM restrictions without double UI prompts.
    if (Platform.OS === 'ios') {
      RNCallKeep.displayIncomingCall(
        callUUID,
        doctorName,
        'Incoming Video Call'
      );
    }
  }

  if (remoteMessage?.data?.type === 'call_end') {
    await AsyncStorage.removeItem(CALL_DATA_KEY);
    await AsyncStorage.removeItem('ACTIVE_CALL_ACCEPTED');
    RNCallKeep.endAllCalls();
  }

  return Promise.resolve();
});

// ✅ Redux wrapper
const RootApp = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

AppRegistry.registerComponent(appName, () => RootApp);
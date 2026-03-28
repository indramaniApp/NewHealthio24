import React, { useEffect } from 'react';
import { View, Button } from 'react-native';
import RNCallKeep from 'react-native-callkeep';


const options = {
  android: {
    alertTitle: 'Permissions required',
    alertDescription: 'This app needs phone account access',
    cancelButton: 'Cancel',
    okButton: 'OK',
    imageName: 'ic_launcher',
    foregroundService: {
      channelId: 'test-call-channel',
      channelName: 'Test Calls',
      notificationTitle: 'Call in progress',
    },
  },
};

export default function App() {
  useEffect(() => {
    RNCallKeep.setup(options);
    RNCallKeep.setAvailable(true);

    // listeners
    RNCallKeep.addEventListener('answerCall', ({ callUUID }) => {
      console.log('✅ Call Answered:', callUUID);
    });

    RNCallKeep.addEventListener('endCall', ({ callUUID }) => {
      console.log('❌ Call Ended:', callUUID);
    });

    return () => {
      RNCallKeep.removeEventListener('answerCall');
      RNCallKeep.removeEventListener('endCall');
    };
  }, []);

  const triggerIncomingCall = () => {
    const uuid = new Date();

    RNCallKeep.displayIncomingCall(
      uuid,
      'Test Caller',
      'Test Caller',
      'number',
      true
    );
  };

  return (
    <View style={{ marginTop: 100 }}>
      <Button title="Trigger Call UI" onPress={triggerIncomingCall} />
    </View>
  );
}
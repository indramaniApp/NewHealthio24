import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import Header from '../../../components/Header';
import { COLORS } from '../../../constants';

const EmergencyCall = ({navigation}) => (
  <SafeAreaView style={styles.safeArea}>
    <Header title="Emergency Call" 
    onBackPress={() => navigation.goBack()}
    />
    <View style={styles.container}>
      <Text style={styles.icon}>🚨</Text>
      <Text style={styles.title}>Emergency Services</Text>
      <Text style={styles.description}>
        In case of an emergency, please dial:
      </Text>
      <Text style={styles.emergencyNumber}>📞 7355163605</Text>
      <Text style={styles.subtext}>
        Available 24×7 for fire, ambulance, and police emergencies.
      </Text>
    </View>
  </SafeAreaView>
);

export default EmergencyCall;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#fcfcfc',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#c0392b',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 12,
    textAlign: 'center',
  },
  emergencyNumber: {
    fontSize: 28,
    color: '#e74c3c',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtext: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    maxWidth: 300,
  },
});

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

const AppointmentHistory = ({navigation}) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Appointment History" 
      onBackPress={() => navigation.goBack()}
      />
      <View style={styles.container}>
        <Text style={styles.title}>🗓️ Appointment History</Text>
        <Text style={styles.description}>
          This is the Appointment History screen.
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default AppointmentHistory;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#f0f4f7',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
  },
});

import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import React, { useState } from 'react';
import Header from '../../components/Header';
import { COLORS } from '../../constants';

// 👉 Import your 3 components
import ScheduledAppointment from './ScheduledAppointment';
import AcceptedAppointment from './AcceptedAppointment';
import CompletedAppointment from './CompletedAppointment';

const { width } = Dimensions.get('window');

const PatientMitraBookingList = ({navigation}) => {
  const [selectedTab, setSelectedTab] = useState('Scheduled');

  const tabs = ['Scheduled', 'Accepted', 'Completed'];

  // 👉 Render component based on selected tab
  const renderTabContent = () => {
    switch (selectedTab) {
      case 'Scheduled':
        return <ScheduledAppointment />;
      case 'Accepted':
        return <AcceptedAppointment />;
      case 'Completed':
        return <CompletedAppointment />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Patient Mitra Bookings"  onBackPress={() => navigation.goBack()}  />

      {/* Tabs with underline */}
      <View style={styles.tabContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setSelectedTab(tab)}
            style={styles.tabButton}
          >
            <Text style={[styles.tabText, selectedTab === tab && styles.selectedTabText]}>
              {tab}
            </Text>
            <View
              style={[
                styles.underline,
                selectedTab === tab && styles.activeUnderline,
              ]}
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* Dynamic Content */}
      <View style={styles.content}>
        {renderTabContent()}
      </View>
    </View>
  );
};

export default PatientMitraBookingList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS?.white || '#fff',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    position: 'relative',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  selectedTabText: {
    color: COLORS?.primary || '#007bff',
    fontWeight: 'bold',
  },
  underline: {
    position: 'absolute',
    bottom: 0,
    height: 3,
    width: '100%',
    backgroundColor: 'transparent',
  },
  activeUnderline: {
    backgroundColor: COLORS?.primary || '#007bff',
  },
  content: {
    flex: 1,
    padding: 10,
  },
});

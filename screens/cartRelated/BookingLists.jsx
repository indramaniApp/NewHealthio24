import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import Header from '../../components/Header';
import UpcomingAppointments from './UpcomingAppointments';
import CompletedAppointments from './CompletedAppointments';

const { width } = Dimensions.get('window');
const tabWidth = width / 2;
const underlineWidth = tabWidth * 0.6;

const BookingList = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('Scheduled');
  const underlineX = useRef(new Animated.Value(0)).current;

  const handleTabPress = (tab, index) => {
    setActiveTab(tab);
    Animated.spring(underlineX, {
      toValue: index * tabWidth,
      useNativeDriver: false,
    }).start();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Booked Appointments" onBackPress={() => navigation.goBack()} />

      {/* Tab Header with underline */}
      <View style={styles.tabHeader}>
        {['Scheduled', 'Completed'].map((tab, index) => (
          <TouchableOpacity
            key={tab}
            style={styles.tabItem}
            onPress={() => handleTabPress(tab, index)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}

        {/* Animated Underline */}
        <Animated.View
          style={[
            styles.underline,
            {
              width: underlineWidth,
              transform: [
                {
                  translateX: Animated.add(
                    underlineX,
                    new Animated.Value((tabWidth - underlineWidth) / 2)
                  ),
                },
              ],
            },
          ]}
        />
      </View>


      <View style={{ flex: 1 }}>
        {activeTab === 'Scheduled' ? <UpcomingAppointments /> : <CompletedAppointments />}
      </View>
    </SafeAreaView>
  );
};

export default BookingList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  tabHeader: {
    flexDirection: 'row',
    position: 'relative',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    marginTop: 16,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  tabText: {
    fontSize: 16,
    color: '#777',
  },
  activeTabText: {
    color: '#4A90E2',
    fontWeight: 'bold',
  },
  underline: {
    position: 'absolute',
    bottom: 0,
    height: 3,
    backgroundColor: '#4A90E2',
    borderRadius: 2,
  },
});

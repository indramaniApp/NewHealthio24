import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { COLORS } from '../../constants'; 
import Header from '../../components/Header';
import UpcomingAppointment from './UpcomingAppointment';
import CompletedAppointment from './CompletedAppointment';

const { width } = Dimensions.get('window');
const tabWidth = width / 2;
const underlineWidth = tabWidth * 0.6;

const Appointments = ({ navigation }) => {
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
      <Header title="Appointments" onBackPress={() => navigation.goBack()} />

      {/* Tabs */}
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

      {/* Content Switch */}
      <View style={{ flex: 1 }}>
        {activeTab === 'Scheduled' ? <UpcomingAppointment /> : <CompletedAppointment />}
      </View>
    </SafeAreaView>
  );
};

export default Appointments;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  tabHeader: {
    flexDirection: 'row',
    position: 'relative',
    borderBottomWidth: 1,
    borderColor: COLORS.grayscale300,
    marginTop: 16,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  tabText: {
    fontSize: 16,
    color: COLORS.gray,
  },
  activeTabText: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  underline: {
    position: 'absolute',
    bottom: 0,
    height: 3,
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentText: {
    fontSize: 16,
    color: COLORS.black,
  },
});

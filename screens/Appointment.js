import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image, SafeAreaView } from 'react-native';
import { COLORS, icons, images } from '../constants';
import { UpcomingBooking, CompletedBooking, CancelledBooking } from '../tabs';

const { width } = Dimensions.get('window');

const Appointment = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState('upcoming');
  const underlineWidth = width / 3; // 3 tabs

  const renderSelectedScreen = () => {
    switch(selectedTab) {
      case 'upcoming': return <UpcomingBooking />;
      case 'uploaded': return <CompletedBooking />; // ya UploadedBooking
      case 'completed': return <CancelledBooking />;
      default: return null;
    }
  }

  const fixedColors = {
    background: '#FFFFFF',
    tabActive: '#007AFF',
    tabInactive: '#555555',
    underline: '#E0E0E0',
  };

  return (
    <SafeAreaView style={{ flex:1, backgroundColor: fixedColors.background }}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={images.logo} style={styles.logoIcon} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Appointment</Text>
        </View>
        <TouchableOpacity>
          <Image source={icons.moreCircle} style={styles.moreIcon} />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={{ marginTop: 10 }}>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity style={styles.tab} onPress={() => setSelectedTab('upcoming')}>
            <Text style={[styles.tabText, { color: selectedTab === 'upcoming' ? fixedColors.tabActive : fixedColors.tabInactive }]}>Upcoming</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab} onPress={() => setSelectedTab('uploaded')}>
            <Text style={[styles.tabText, { color: selectedTab === 'uploaded' ? fixedColors.tabActive : fixedColors.tabInactive }]}>Uploaded</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tab} onPress={() => setSelectedTab('completed')}>
            <Text style={[styles.tabText, { color: selectedTab === 'completed' ? fixedColors.tabActive : fixedColors.tabInactive }]}>Completed</Text>
          </TouchableOpacity>
        </View>

        {/* Underline */}
        <View style={{ position:'relative', height:2, marginTop:4 }}>
          <View style={{ position:'absolute', width:'100%', height:2, backgroundColor: fixedColors.underline }} />
          <View style={{
            position:'absolute',
            width: underlineWidth,
            height:2,
            backgroundColor: fixedColors.tabActive,
            left: selectedTab === 'upcoming' ? 0 : selectedTab === 'uploaded' ? underlineWidth : 2*underlineWidth
          }} />
        </View>
      </View>

      {/* Screen content */}
      <View style={{ flex: 1 }}>
        {renderSelectedScreen()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContainer: { flexDirection:'row', justifyContent:'space-between', alignItems:'center', margin:16 },
  headerLeft: { flexDirection:'row', alignItems:'center' },
  logoIcon: { width:24, height:24 },
  headerTitle: { fontSize:20, marginLeft:16, fontWeight:'bold', color:'#000' },
  moreIcon: { width:24, height:24 },

  tab: { flex:1, alignItems:'center', paddingVertical:12 },
  tabText: { fontSize:16, fontWeight:'600' },
});

export default Appointment;

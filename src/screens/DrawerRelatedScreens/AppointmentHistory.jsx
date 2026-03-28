import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'

import CompletedScreen from '../DrawerRelatedScreens/appointmenthistory/CompletedScreen'
import UploadedScreen from '../../screens/DrawerRelatedScreens/appointmenthistory/UploadedScreen'
const AppointmentHistory = () => {

  const [selectedTab, setSelectedTab] = useState('Uploaded')

  return (
    <View style={styles.container}>
      
      {/* Top Header */}
      <View style={styles.topHeader}>

        <TouchableOpacity 
          style={styles.tab}
          onPress={() => setSelectedTab('Uploaded')}
        >
          <Text style={[
            styles.tabText,
            selectedTab === 'Uploaded' && styles.activeText
          ]}>
            Uploaded
          </Text>

          {selectedTab === 'Uploaded' && <View style={styles.activeLine} />}
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.tab}
          onPress={() => setSelectedTab('Completed')}
        >
          <Text style={[
            styles.tabText,
            selectedTab === 'Completed' && styles.activeText
          ]}>
            Completed
          </Text>

          {selectedTab === 'Completed' && <View style={styles.activeLine} />}
        </TouchableOpacity>

      </View>

      {/* Body */}
      <View style={styles.body}>
        {selectedTab === 'Uploaded' 
          ? <UploadedScreen/> 
          : <CompletedScreen />}
      </View>

    </View>
  )
}

export default AppointmentHistory

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

  tab: {
    alignItems: 'center',
    paddingVertical: 15,
  },

  tabText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#999',
  },

  activeText: {
    color: '#2E86DE',
    fontWeight: '700',
  },

  activeLine: {
    marginTop: 6,
    height: 3,
    width: '100%',
    backgroundColor: '#2E86DE',
    borderRadius: 5,
  },

  body: {
    flex: 1,
  }
})

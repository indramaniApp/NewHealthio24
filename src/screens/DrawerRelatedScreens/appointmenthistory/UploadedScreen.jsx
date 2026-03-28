import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

const UploadedScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Uploaded Appointments</Text>
    </View>
  )
}

export default UploadedScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  }
})

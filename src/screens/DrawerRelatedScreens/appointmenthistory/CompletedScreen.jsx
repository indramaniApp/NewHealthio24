import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

const CompletedScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Completed Appointments</Text>
    </View>
  )
}

export default CompletedScreen

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

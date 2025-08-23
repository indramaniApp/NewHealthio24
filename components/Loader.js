import React from 'react';
import { View, ActivityIndicator, Modal, StyleSheet } from 'react-native';

const Loader = ({ visible }) => {
  if (!visible) return null;
  return (
    <Modal transparent visible={visible} animationType="none">
      <View style={styles.container}>
        <View style={styles.loaderWraper}>
          <ActivityIndicator
            size={34}
            color={'blue'}
            animating
          />
        </View>
      </View>
    </Modal>
  );
};
export default Loader;
const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 100,
      elevation: 100,
    },
    loaderWraper: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'white',
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
  
import {
  StyleSheet,
  View,
  Image,
  StatusBar, // Keep StatusBar for imperative access
  Animated,
  Dimensions,
} from 'react-native';
// React.useCallback is needed for useFocusEffect
import React, { useEffect, useRef, useCallback } from 'react'; 
// Import useFocusEffect
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import splashScreen from '../assets/welcome.jpg';

const screenHeight = Dimensions.get('window').height;

const SplashScreen = () => {
  const navigation = useNavigation();
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;

  // This effect will handle the status bar color
  useFocusEffect(
    useCallback(() => {
      // This runs when the screen comes into focus
      StatusBar.setBackgroundColor('#033687');
      StatusBar.setBarStyle('light-content');

      // This is the cleanup function that runs when the screen loses focus
      return () => {
        StatusBar.setBackgroundColor('#00b4db'); // Revert to your app's default color
        StatusBar.setBarStyle('light-content'); // Revert to default style if needed
      };
    }, [])
  );

  // This effect handles the animation and navigation timer
  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      navigation.replace('Main');
    }, 1000);

    return () => clearTimeout(timer);
  }, [navigation, slideAnim]);

  return (
    <View style={styles.container}>
      {/* REMOVE the <StatusBar ... /> component from here.
        We are now controlling it with useFocusEffect.
      */}
      <Animated.View
        style={[
          styles.imageContainer,
          {
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Image
          source={splashScreen}
          style={styles.image}
          resizeMode="cover"
        />
      </Animated.View>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#033687',
  },
  imageContainer: {
    width: '100%',
    height: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
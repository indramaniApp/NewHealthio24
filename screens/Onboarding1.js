import React, { useEffect } from 'react';
import { Text, ImageBackground, StyleSheet, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, images } from '../constants';
import LinearGradient from 'react-native-linear-gradient';

const Onboarding1 = () => {
  const navigation = useNavigation();
  // Add useEffect
  useEffect(() => {
    const timeout = setTimeout(() => {
      navigation.navigate('Onboarding2');
    }, 2000);

    return () => clearTimeout(timeout);
  }, []); // run only once after component mounts

  return (
    <ImageBackground
      source={images.onboardingSplash1}
      style={styles.area}>
      <StatusBar hidden />
      <LinearGradient
        // Background linear gradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.background}>
        <Text style={styles.greetingText}>Welcome to 👋</Text>
        <Text style={styles.logoName}>Healthio24</Text>
        <Text style={styles.subtitle}>The best online doctor consultation app of the century for your daily needs!</Text>
      </LinearGradient>
    </ImageBackground>
  )
};

const styles = StyleSheet.create({
  area: {
    flex: 1
  },
  background: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 270,
    paddingHorizontal: 16
  },
  greetingText: {
    fontSize: 35,
    color: COLORS.white,
    fontFamily: "Urbanist Bold",
    marginVertical: 12
  },
  logoName: {
    fontSize: 35,
    color: COLORS.white,
    fontFamily: "Urbanist ExtraBold",
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.white,
    marginVertical: 12,
    fontFamily: "Urbanist SemiBold",
  }
})

export default Onboarding1;
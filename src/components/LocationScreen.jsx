import React, { useState, useEffect, useRef } from 'react';
import {
  Text,
  View,
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
  StyleSheet,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';

const LocationScreen = () => {
  const [address, setAddress] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const watchId = useRef(null);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn('Permission error:', err);
        return false;
      }
    } else {
      return true;
    }
  };

  const getAddressFromCoords = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
        {
          headers: {
            'User-Agent': 'HariHelpApp/1.0',
            'Accept-Language': 'en',
          },
        }
      );
      const json = await response.json();

      if (json && json.address) {
        const { hamlet, village, town, city } = json.address;
        const locality = hamlet || village || town || '';
        const place = [locality, city].filter(Boolean).join(', ');
        setAddress(place);
      } else {
        setAddress('Address not found');
      }
    } catch (error) {
      console.log('Error fetching address:', error);
      setAddress('Error getting address');
    } finally {
      setLoading(false);
    }
  };

  const startWatchingLocation = async () => {
    setLoading(true);
    setErrorMsg('');
    setAddress('');

    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      setErrorMsg('Location permission denied');
      setLoading(false);
      return;
    }

    watchId.current = Geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log('Updated position:', latitude, longitude);
        getAddressFromCoords(latitude, longitude);
      },
      (error) => {
        console.log('Geolocation watch error:', error);
        setErrorMsg(error.message || 'Location error');
        setLoading(false);
      },
      {
        enableHighAccuracy: false,
        distanceFilter: 100, 
        interval: 5000,     
        fastestInterval: 2000,
      }
    );
  };

  useEffect(() => {
    startWatchingLocation();

    // Cleanup on unmount: stop watching location
    return () => {
      if (watchId.current !== null) {
        Geolocation.clearWatch(watchId.current);
      }
    };
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="small" color="blue" />
      </View>
    );
  }

  if (errorMsg) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{errorMsg}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.addressText}>{address}</Text>
    </View>
  );
};

export default LocationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addressText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  error: {
    color: 'red',
    fontSize: 14,
    textAlign: 'center',
  },
});

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  ScrollView,
  PanResponder,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width, height } = Dimensions.get('window');

const CustomDrawer = ({ visible, onClose, navigation }) => {
  const drawerWidth = width * 0.85;
  const translateX = React.useRef(new Animated.Value(-drawerWidth)).current;


  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {

        if (gestureState.dx > 0) {
          translateX.setValue(Math.min(gestureState.dx, drawerWidth)); 
        }
      },
      onPanResponderRelease: (_, gestureState) => {

        if (gestureState.dx > drawerWidth / 2) {
          Animated.timing(translateX, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }).start();
        } else {
          Animated.timing(translateX, {
            toValue: -drawerWidth,
            duration: 300,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  React.useEffect(() => {
    Animated.timing(translateX, {
      toValue: visible ? 0 : -drawerWidth,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  const menuItems = [
    { name: 'Hospital', icon: 'local-hospital', screen: 'Hospital' },
    { name: 'Doctors', icon: 'person', screen: 'Doctors' },
    { name: 'Clinics', icon: 'local-pharmacy', screen: 'Clinics' },
    { name: 'Pharmacy', icon: 'local-grocery-store', screen: 'Pharmacy' },
    { name: 'Physiotherapy', icon: 'fitness-center', screen: 'Physiotherapy' },
    { name: 'Pathology', icon: 'science', screen: 'Pathology' },
    { name: 'Dialysis', icon: 'healing', screen: 'Dialysis' },
    { name: 'BloodBank', icon: 'bloodtype', screen: 'BloodBank' },
    { name: 'Patient-Mitra', icon: 'person-pin', screen: 'PatientMitra' },
    { name: 'Ambulance', icon: 'local-taxi', screen: 'Ambulance' },
    { name: 'Appointment history', icon: 'event', screen: 'AppointmentHistory' },
    { name: 'Medical history', icon: 'history', screen: 'MedicalHistory' },
    { name: 'Customer care', icon: 'support-agent', screen: 'CustomerCare' },
  ];

  const handleNavigate = (screen) => {
    navigation.navigate(screen);
    onClose();
  };

  return (
    <>
      {visible && (
        <TouchableOpacity
          style={styles.overlay}
          onPress={onClose}
          activeOpacity={1}
        />
      )}

      <Animated.View
        style={[styles.drawer, { transform: [{ translateX }] }]}
        {...panResponder.panHandlers} // Attach pan responder to the drawer
      >
        <ScrollView contentContainerStyle={styles.menuContainer} showsVerticalScrollIndicator={false}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.item}
              onPress={() => handleNavigate(item.screen)}
            >
              <Icon name={item.icon} size={24} color="#000" style={styles.icon} />
              <Text style={styles.itemText}>{item.name}</Text>
              <Icon name="chevron-right" size={24} color="#888" style={styles.arrowIcon} />
            </TouchableOpacity>
          ))}

          {/* Profile and Logout Section */}
          <View style={styles.bottomSection}>
            <TouchableOpacity
              style={styles.bottomItem}
              onPress={() => handleNavigate('Profile')}
            >
              <Icon name="person" size={20} color="#000" />
              <Text style={styles.bottomText}>Profile</Text>
              <Icon name="chevron-right" size={24} color="#888" style={styles.arrowIcon} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.bottomItem}
              onPress={() => handleNavigate('Logout')}
            >
              <Icon name="exit-to-app" size={20} color="red" />
              <Text style={[styles.bottomText, { color: 'red' }]}>Logout</Text>
              <Icon name="chevron-right" size={24} color="red" style={styles.arrowIcon} />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width * 0.75,
    height: '100%',
    backgroundColor: '#fff',
    padding: 20,
    zIndex: 2,
    elevation: 5,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#00000088',
    zIndex: 1,
  },
  menuContainer: {
    paddingTop: 40,
    paddingBottom: 30,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  itemText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#000',
  },
  icon: {
    marginRight: 10,
  },
  arrowIcon: {
    marginLeft: 'auto',
  },
  bottomSection: {
    marginTop: 30,
    borderTopWidth: 1,
    borderColor: '#ccc',
    paddingTop: 15,
  },
  bottomItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  bottomText: {
    fontSize: 16,
    marginLeft: 8,
  },
});

export default CustomDrawer;

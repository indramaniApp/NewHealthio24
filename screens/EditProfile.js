import React, { useState, useReducer, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DatePicker from 'react-native-date-picker';
import RNPickerSelect from 'react-native-picker-select';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

import { COLORS, SIZES, FONTS, images } from '../constants';
import Header from '../components/Header';
import Input from '../components/Input';
import Button from '../components/Button';
import ApiService from '../src/api/ApiService';
import { ENDPOINTS } from '../src/constants/Endpoints';
import { useTheme } from '../theme/ThemeProvider';
import { useDispatch } from 'react-redux';
import { showLoader, hideLoader } from '../src/redux/slices/loaderSlice';

const EditProfile = ({ navigation, route }) => {
  const { profile } = route?.params || {};

  if (!profile || !Array.isArray(profile) || profile.length === 0) {
    return (
      <SafeAreaView style={styles.area}>
        <Text style={{ textAlign: 'center', marginTop: 20 }}>Invalid profile data...</Text>
      </SafeAreaView>
    );
  }

  const initialState = {
    inputValues: {
      fullName: profile[0].fullName,
      emailAddress: profile[0].emailAddress,
      emergencyContactNumber: profile[0].emergencyContactNumber,
      nationality: profile[0].nationality,
      dateOfBirth: profile[0].dateOfBirth,
    },
    inputValidities: {
      fullName: true,
      emailAddress: true,
      emergencyContactNumber: true,
      nationality: true,
      dateOfBirth: true,
    },
  };

  const [formState, dispatchFormState] = useReducer((state, action) => ({
    ...state,
    inputValues: {
      ...state.inputValues,
      [action.inputId]: action.inputValue,
    },
    inputValidities: {
      ...state.inputValidities,
      [action.inputId]: true,
    },
  }), initialState);

  const [image, setImage] = useState(profile[0]?.patient_picture ? { uri: profile[0].patient_picture } : null);
  const [areas, setAreas] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [imageOptionVisible, setImageOptionVisible] = useState(false);
  const [selectedArea, setSelectedArea] = useState(null);
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    profile[0].dateOfBirth ? new Date(profile[0].dateOfBirth) : new Date('2000-01-01')
  );
  const [dateOfBirth, setDateOfBirth] = useState(profile[0].dateOfBirth || '');
  const [selectedGender, setSelectedGender] = useState(profile[0].gender || '');

  const { dark } = useTheme();
  const dispatch = useDispatch();

  const genderOptions = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Other', value: 'Other' },
  ];

  const inputChangedHandler = useCallback((inputId, inputValue) => {
    dispatchFormState({ inputId, inputValue });
  }, []);

  const pickFromCamera = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
      cameraType: 'back',
      saveToPhotos: true,
    };

    launchCamera(options, (response) => {
      if (!response.didCancel && !response.errorCode) {
        const uri = response?.assets?.[0]?.uri;
        if (uri) setImage({ uri });
      }
    });
  };

  const pickFromGallery = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchImageLibrary(options, (response) => {
      if (!response.didCancel && !response.errorCode) {
        const uri = response?.assets?.[0]?.uri;
        if (uri) setImage({ uri });
      }
    });
  };

  const FetchUpdate = async () => {
    const { inputValues } = formState;
    const formData = new FormData();

    const appendIfNotEmpty = (key, value) => {
      if (value !== undefined && value !== null && value.toString().trim() !== '') {
        formData.append(key, value);
      }
    };

    appendIfNotEmpty('fullName', inputValues.fullName);
    appendIfNotEmpty('emailAddress', inputValues.emailAddress);
    appendIfNotEmpty('emergencyContactNumber', inputValues.emergencyContactNumber);
    appendIfNotEmpty('nationality', inputValues.nationality);
    appendIfNotEmpty('dateOfBirth', dateOfBirth);
    appendIfNotEmpty('gender', selectedGender);

    if (image && image.uri && !image.uri.startsWith('http')) {
      const filename = image.uri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;
      formData.append('patient_picture', {
        uri: image.uri,
        name: filename,
        type,
      });
    }

    try {
      dispatch(showLoader());
      const response = await ApiService.post(ENDPOINTS.update_profile, formData, true, true);
      if (response?.status === "success") {
        Alert.alert("Success", response?.message || "Profile updated successfully!");
        navigation.goBack();
      } else {
        Alert.alert("Failed", response?.message || "Profile update failed.");
      }
    } catch (error) {
      Alert.alert("Error", error?.response?.data?.message || "Something went wrong!");
    } finally {
      dispatch(hideLoader());
    }
  };

  useEffect(() => {
    fetch("https://restcountries.com/v2/all")
      .then(res => res.json())
      .then(data => {
        const formatted = data.map(item => ({
          code: item.alpha2Code,
          item: item.name,
          callingCode: `+${item.callingCodes[0]}`,
          flag: `https://flagsapi.com/${item.alpha2Code}/flat/64.png`
        }));
        setAreas(formatted);
        const defaultData = formatted.find((a) => a.code === "US");
        if (defaultData) setSelectedArea(defaultData);
      });
  }, []);

  const RenderAreasCodesModal = () => (
    <Modal animationType="slide" transparent={true} visible={modalVisible}>
      <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <View style={{
            height: 400,
            width: SIZES.width * 0.8,
            backgroundColor: COLORS.primary,
            borderRadius: 12
          }}>
            <FlatList
              data={areas}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{ padding: 10, flexDirection: "row" }}
                  onPress={() => {
                    setSelectedArea(item);
                    setModalVisible(false);
                  }}>
                  <Text style={{ fontSize: 16, color: "#fff" }}>{item.item}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.code}
              style={{ padding: 20, marginBottom: 20 }}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );

  const renderImagePickerOptions = () => (
    <Modal transparent animationType="fade" visible={imageOptionVisible}>
      <TouchableWithoutFeedback onPress={() => setImageOptionVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Upload Photo</Text>
            <View style={styles.optionRow}>
              <TouchableOpacity style={styles.optionButton} onPress={() => { setImageOptionVisible(false); pickFromCamera(); }}>
                <MaterialCommunityIcons name="camera" size={28} color={COLORS.primary} />
                <Text style={styles.optionText}>Camera</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.optionButton} onPress={() => { setImageOptionVisible(false); pickFromGallery(); }}>
                <MaterialCommunityIcons name="image" size={28} color={COLORS.primary} />
                <Text style={styles.optionText}>Gallery</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.optionButton} onPress={() => setImageOptionVisible(false)}>
                <MaterialCommunityIcons name="close" size={28} color="red" />
                <Text style={styles.optionText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: dark ? COLORS.dark1 : COLORS.white }]}>
      <View style={[styles.container, { backgroundColor: dark ? COLORS.dark1 : COLORS.white }]}>
        <Header title="Edit Profile" 
        onBackPress={() => navigation.goBack()}
        />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ alignItems: "center", marginVertical: 12 }}>
            <View style={styles.avatarContainer}>
              <Image source={image ? image : images.user1} resizeMode="cover" style={styles.avatar} />
              <TouchableOpacity onPress={() => setImageOptionVisible(true)} style={styles.pickImage}>
                <MaterialCommunityIcons name="pencil-outline" size={24} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          </View>

          <Input id="fullName" value={formState.inputValues.fullName} onInputChanged={inputChangedHandler} placeholder="Full Name" label="Full Name" />
          <Input id="emailAddress" value={formState.inputValues.emailAddress} onInputChanged={inputChangedHandler} placeholder="Email" keyboardType="email-address" label="Email Address" />
          <Input id="emergencyContactNumber" value={formState.inputValues.emergencyContactNumber} onInputChanged={inputChangedHandler} placeholder="Emergency Contact Number" keyboardType="phone-pad" label="Emergency Contact Number" />

          <Text style={styles.label}>Date of Birth</Text>
          <TouchableOpacity style={styles.inputBtn} onPress={() => setOpenDatePicker(true)}>
            <Text style={{ ...FONTS.body4, color: COLORS.black }}>
              {dateOfBirth || "Select Date of Birth"}
            </Text>
            <Feather name="calendar" size={24} color={COLORS.grayscale400} />
          </TouchableOpacity>

          <Text style={styles.label}>Gender</Text>
          <RNPickerSelect
            placeholder={{ label: 'Select Gender', value: '' }}
            items={genderOptions}
            onValueChange={setSelectedGender}
            value={selectedGender}
            style={{ inputIOS: styles.pickerInput, inputAndroid: styles.pickerInput }}
          />
        </ScrollView>

        <DatePicker
          modal
          open={openDatePicker}
          date={selectedDate}
          mode="date"
          maximumDate={new Date()}
          minimumDate={new Date(1950, 0, 1)}
          onConfirm={(date) => {
            setOpenDatePicker(false);
            const formattedDate = date.toISOString().split('T')[0];
            setSelectedDate(date);
            setDateOfBirth(formattedDate);
            inputChangedHandler('dateOfBirth', formattedDate);
          }}
          onCancel={() => setOpenDatePicker(false)}
        />

        {renderImagePickerOptions()}
        {RenderAreasCodesModal()}

        <View style={styles.bottomContainer}>
          <Button title="Update" filled style={styles.continueButton} onPress={FetchUpdate} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  area: { flex: 1 },
  container: { flex: 1, padding: 16 },
  avatarContainer: { marginVertical: 12, alignItems: "center", width: 130, height: 130, borderRadius: 65 },
  avatar: { height: 130, width: 130, borderRadius: 65 },
  pickImage: {
    height: 42, width: 42, borderRadius: 21,
    backgroundColor: COLORS.primary,
    alignItems: 'center', justifyContent: 'center',
    position: 'absolute', bottom: 0, right: 0
  },
  inputBtn: {
    borderWidth: 1, borderRadius: 12,
    height: 50, paddingLeft: 12,
    justifyContent: "space-between",
    backgroundColor: COLORS.greyscale500,
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 12,
    marginTop: 4,
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.black,
    marginTop: 16,
    marginBottom: 6,
  },
  bottomContainer: { marginVertical: 24 },
  continueButton: { borderRadius: 32, backgroundColor: COLORS.primary },
  pickerInput: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingRight: 30,
    height: 52,
    backgroundColor: COLORS.greyscale500,
    borderRadius: 16,
    color: COLORS.black,
    marginBottom: 12,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 16,
    width: '85%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: COLORS.black,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  optionButton: {
    alignItems: 'center',
    marginHorizontal: 12,
  },
  optionText: {
    marginTop: 6,
    color: COLORS.black,
    fontSize: 14,
  },
});

export default EditProfile;

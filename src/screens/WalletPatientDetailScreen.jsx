import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    ScrollView,
    Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import RNPickerSelect from 'react-native-picker-select';

import { COLORS, SIZES } from '../../constants';
import { ENDPOINTS } from '../constants/Endpoints';
import ApiService from '../api/ApiService';
import { showLoader, hideLoader } from '../redux/slices/loaderSlice';
import Header from '../../components/Header';
import Button from '../../components/Button';
import { useTheme } from '../../theme/ThemeProvider';

const WalletPatientDetailScreen = ({ navigation, route }) => {
    const { colors, dark } = useTheme();
    const dispatch = useDispatch();

    const { startedDate, selectedHour, selectedItem, doctorId } = route?.params;

    const [patient_age, setPatient_Age] = useState(null);
    const [patient_gender, setPatient_Gender] = useState(null);
    const [patient_name, setPatient_Name] = useState(null);

    const handleSubmit = async () => {
        dispatch(showLoader());
    
        try {
            const data = {
                appointment_request_date: startedDate,
                appointment_time: selectedHour,
                appointment_type: selectedItem,
                patient_age,
                patient_name,
                patient_gender
            };
    
            const finalUrl = ENDPOINTS.patient_book_appointment_through_wallet + `/${doctorId}`;
            const response = await ApiService.post(finalUrl, data, true, false);
    
            console.log("=========response==========wallet========", response);
    
            if (response?.status === 'success') {
                Alert.alert(
                    "Success",
                    response?.message || "Appointment booked successfully!",
                    [
                        {
                            text: "OK",
                            onPress: () => navigation.navigate('Main')
                        }
                    ]
                );
            } else {
              
                Alert.alert("Error", response?.message || "Something went wrong.");
            }
    
        } catch (error) {
       
            console.error("Full error object:", JSON.stringify(error, null, 2));
            console.error("Full error.response:", JSON.stringify(error?.response, null, 2));
    
           
            let apiMessage = "Something went wrong.";
    
            if (error?.response?.data?.message) {
                apiMessage = error.response.data.message;
            } else if (error?.message) {
                apiMessage = error.message;
            }
    
            Alert.alert("Error", apiMessage);
        } finally {
            dispatch(hideLoader());
        }
    };
    
    

    const renderContent = () => (
        <View>
            <Text style={[styles.title, { color: dark ? COLORS.white : COLORS.greyscale900 }]}>Patient Name</Text>
            <View style={[styles.inputContainer, { backgroundColor: dark ? COLORS.dark2 : COLORS.tertiaryWhite }]}>
                <TextInput
                    style={[styles.picker, { height: 48, color: dark ? COLORS.grayscale200 : COLORS.greyscale900 }]}
                    placeholder="Enter Patient Name"
                    placeholderTextColor={dark ? COLORS.greyscale300 : COLORS.black}
                    value={patient_name}
                    onChangeText={setPatient_Name}
                />
            </View>

            <Text style={[styles.title, { color: dark ? COLORS.white : COLORS.greyscale900 }]}>Patient Gender</Text>
            <RNPickerSelect
                onValueChange={setPatient_Gender}
                placeholder={{ label: 'Select Patient Gender', value: null }}
                items={[
                    { label: 'Female', value: 'Female' },
                    { label: 'Male', value: 'Male' },
                ]}
                style={{
                    inputIOS: {
                        fontSize: 16,
                        paddingHorizontal: 10,
                        borderRadius: 16,
                        color: COLORS.greyscale600,
                        height: 52,
                        width: SIZES.width - 32,
                        backgroundColor: dark ? COLORS.dark2 : COLORS.greyscale500,
                    },
                    inputAndroid: {
                        fontSize: 16,
                        paddingHorizontal: 10,
                        borderRadius: 16,
                        color: COLORS.greyscale600,
                        height: 52,
                        width: SIZES.width - 32,
                        backgroundColor: dark ? COLORS.dark2 : COLORS.greyscale500,
                    },
                }}
            />

            <Text style={[styles.title, { color: dark ? COLORS.white : COLORS.greyscale900 }]}>Patient Age</Text>
            <View style={[styles.inputContainer, { backgroundColor: dark ? COLORS.dark2 : COLORS.tertiaryWhite }]}>
                <TextInput
                    style={[styles.picker, { height: 48, color: dark ? COLORS.grayscale200 : COLORS.greyscale900 }]}
                    placeholder="Enter Patient Age"
                    placeholderTextColor={dark ? COLORS.greyscale300 : COLORS.black}
                    value={patient_age}
                    onChangeText={setPatient_Age}
                    keyboardType="numeric"
                />
            </View>
        </View>
    );

    return (
        <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
            <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Header
        title="Patient Details"
        onBackPress={() => navigation.goBack()}
      />
                <ScrollView showsVerticalScrollIndicator={false}>
                    {renderContent()}
                </ScrollView>
            </View>
            <View style={[styles.bottomContainer, { backgroundColor: dark ? COLORS.dark2 : COLORS.white }]}>
                <Button
                    title="Submit"
                    filled
                    style={styles.btn}
                    onPress={handleSubmit}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    area: {
        flex: 1,
        backgroundColor: COLORS.white
    },
    container: {
        flex: 1,
        padding: 12
    },
    title: {
        fontSize: 20,
        fontFamily: "Urbanist Bold",
        marginVertical: 12
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        paddingHorizontal: 10,
        height: 52,
    },
    picker: {
        flex: 1,
    },
    btn: {
        width: SIZES.width - 32
    },
    bottomContainer: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        height: 99,
        borderRadius: 32,
        alignItems: "center",
        justifyContent: "center"
    }
});

export default WalletPatientDetailScreen;

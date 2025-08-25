import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import { ScrollView } from 'react-native-virtualized-view';
import { useTheme } from '../theme/ThemeProvider';
import { COLORS, SIZES } from '../constants';
import { getFormatedDate } from "react-native-modern-datepicker";
import DatePickerView from '../components/DatePickerView';
import { hoursData } from '../data';
import Button from '../components/Button';

const BookAppointment = ({ navigation, route }) => {
    // const { selectDate, selectTime } = route.params;
    const { colors, dark } = useTheme();
    const [openStartDatePicker, setOpenStartDatePicker] = useState(false);
    let { doctorId,method } = route?.params
    console.log('===========',method)
  
    const [selectedHour, setSelectedHour] = useState(null);
    const today = new Date();
    // const startDate = getFormatedDate(
    //     new Date(today.setDate(today.getDate() + 1)),
    //     "YYYY/MM/DD"
    // );

    const [startedDate, setStartedDate] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const handleOnPressStartDate = () => {
        setOpenStartDatePicker(!openStartDatePicker);
    };

    const handleHourSelect = (hour) => {
        setSelectedHour(hour);
    };

    useEffect(() => {
        const today = new Date();
        const initialStartDate = getFormatedDate(today, "YYYY/MM/DD");
        // const initialStartDate = getFormatedDate(new Date(today.setDate(today.getDate() + 1)), "YYYY/MM/DD");
        setStartDate(initialStartDate);
        setStartedDate(initialStartDate);
    }, []);

    const renderHourItem = ({ item }) => {
        return (
            <TouchableOpacity
                style={[
                    styles.hourButton,
                    selectedHour === item.hour && styles.selectedHourButton]}
                onPress={() => handleHourSelect(item.hour)}>
                <Text style={[styles.hourText,
                selectedHour === item.hour && styles.selectedHourText]}>{item.hour}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
            <View style={[styles.container, { backgroundColor: colors.background }]}>
            <Header
        title="Book Appointment"
        onBackPress={() => navigation.goBack()}
      />
                <ScrollView showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 120 }}
                    keyboardShouldPersistTaps="handled"
                >
                    <Text style={[styles.title, { color: dark ? COLORS.white : COLORS.greyscale900 }]}>Select Date</Text>
                    <View style={styles.datePickerContainer}>
                        <DatePickerView
                            open={openStartDatePicker}
                            startDate={startDate}
                            selectedDate={startedDate}
                            onClose={() => setOpenStartDatePicker(false)}
                            onChangeStartDate={(date) => {
                                console.log(date);

                                const formattedDate = date.split('/').join('-');  // Converts "2025/04/04" to "2025-04-04"
                                setStartedDate(formattedDate);
                                console.log(formattedDate);


                            }}

                            minDate={new Date()} 
                        />
                    </View>
                    <Text style={[styles.title, { color: dark ? COLORS.white : COLORS.greyscale900 }]}>Select Hour</Text>
                    <FlatList
                        data={hoursData}
                        renderItem={renderHourItem}
                        numColumns={3}
                        keyExtractor={(item) => item.id.toString()}
                        showsVerticalScrollIndicator={false}
                        style={{ marginVertical: 12 }}
                    />
                </ScrollView>
            </View>
            <View style={[styles.bottomContainer, {
                backgroundColor: dark ? COLORS.dark2 : COLORS.white
            }]}>
                <Button
                    title="Next"
                    filled
                    style={styles.btn}
                    onPress={() =>
                        // console.log(startedDate,selectedHour)
                        navigation.navigate("SelectPackage", { startedDate, selectedHour, doctorId,method })
                    }
                />
            </View>
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    area: {
        flex: 1,
        backgroundColor: COLORS.white
    },
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
        padding: 16
    },
    title: {
        fontSize: 20,
        fontFamily: "Urbanist Bold",
        color: COLORS.black,
        marginTop: 12
    },
    datePickerContainer: {
        marginVertical: 12
    },
    hourButton: {
        borderRadius: 32,
        borderWidth: 1,
        borderColor: '#ccc',
        marginHorizontal: 5,
        borderColor: COLORS.primary,
        borderWidth: 1.4,
        width: (SIZES.width - 32) / 3 - 9,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 6
    },
    selectedHourButton: {
        backgroundColor: COLORS.primary,
    },
    selectedHourText: {
        fontSize: 16,
        fontFamily: "Urbanist SemiBold",
        color: COLORS.white
    },
    hourText: {
        fontSize: 16,
        fontFamily: "Urbanist SemiBold",
        color: COLORS.primary
    },
    bottomContainer: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        height: 99,
        borderRadius: 32,
        backgroundColor: COLORS.white,
        alignItems: "center",
        justifyContent: "center"
    },
    btn: {
        width: SIZES.width - 32
    }
})

export default BookAppointment
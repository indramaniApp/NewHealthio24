import { View, Text, StyleSheet, TouchableOpacity, FlatList, StatusBar } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import { ScrollView } from 'react-native-virtualized-view';
import { useTheme } from '../theme/ThemeProvider';
import { COLORS, SIZES } from '../constants';
import { Calendar } from 'react-native-calendars';
import LinearGradient from 'react-native-linear-gradient';
import { hoursData } from '../data';

const BookAppointment = ({ navigation, route }) => {
    const { colors, dark } = useTheme();
    let { doctorId, method } = route?.params;

    const [selectedHour, setSelectedHour] = useState(null);
    const [startedDate, setStartedDate] = useState(new Date().toISOString().split('T')[0]); // YYYY-MM-DD

    const handleHourSelect = (hour) => setSelectedHour(hour);

    // Check if a slot is in the past
    const isSlotDisabled = (slot) => {
        if (!startedDate) return false;

        const today = new Date().toISOString().split('T')[0];
        if (startedDate !== today) return false;

        const now = new Date();
        const [time, modifier] = slot.split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        if (modifier === 'PM' && hours < 12) hours += 12;
        if (modifier === 'AM' && hours === 12) hours = 0;

        const slotTime = new Date();
        slotTime.setHours(hours, minutes, 0, 0);

        return slotTime <= now;
    };

    const renderHourItem = ({ item }) => {
        const disabled = isSlotDisabled(item.hour);
        const isSelected = selectedHour === item.hour;

        return (
            <TouchableOpacity
                onPress={() => !disabled && handleHourSelect(item.hour)}
                style={{ flex: 1 }}
                disabled={disabled}
            >
                {isSelected ? (
                    <LinearGradient
                        colors={['#001F3F', '#003366']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={[styles.hourButton, { borderWidth: 0 }]}
                    >
                        <Text style={[styles.selectedHourText, { color: '#fff' }]}>{item.hour}</Text>
                    </LinearGradient>
                ) : (
                    <View
                        style={[
                            styles.hourButton,
                            { backgroundColor: COLORS.white, borderColor: '#001F3F' },
                            disabled && styles.disabledHourBox,
                        ]}
                    >
                        <Text
                            style={[
                                styles.hourText,
                                { color: disabled ? '#b0b0b0' : '#001F3F' },
                            ]}
                        >
                            {item.hour}
                        </Text>
                    </View>
                )}
            </TouchableOpacity>
        );
    };

    return (
        <LinearGradient
            colors={['#001F3F', '#003366', '#fff', '#fff', '#fff', '#fff']}
            style={{ flex: 1 }}
        >
            <StatusBar backgroundColor="#001F3F" barStyle="light-content" />
            <SafeAreaView style={styles.area}>
                <View style={styles.container}>
                    <Header
                        title="Book Appointment"
                        onBackPress={() => navigation.goBack()}
                        titleStyle={{ fontSize: 28, color: '#fff' }}
                        backCircleStyle={{ backgroundColor: '#fff' }}
                        backIconStyle={{ tintColor: '#000' }}
                        bottomLineStyle={{ backgroundColor: 'transparent' }}
                    />

                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 120 }}
                        keyboardShouldPersistTaps="handled"
                    >
                       {/* Select Date */}
<Text style={[styles.title, { color: '#FFFFFF' }]}>
    Select Date
</Text>


                        <LinearGradient
                            colors={['#fff', '#fff']}
                            style={styles.calendarWrapper}
                        >
                            <Calendar
                                onDayPress={(day) => {
                                    setStartedDate(day.dateString);
                                    setSelectedHour(null);
                                }}
                                markedDates={{
                                    [startedDate]: {
                                        selected: true,
                                        selectedColor: '#001F3F',
                                        selectedTextColor: '#fff',
                                    },
                                }}
                                theme={{
                                    calendarBackground: 'transparent',
                                    dayTextColor: dark ? COLORS.white : '#001F3F',
                                    textDisabledColor: '#B0BEC5',
                                    monthTextColor: dark ? COLORS.white : '#001F3F',
                                    arrowColor: dark ? COLORS.white : '#001F3F',
                                    todayTextColor: '#FFEB3B',
                                    textSectionTitleColor: '#FFD700',
                                    textDayFontFamily: 'Urbanist SemiBold',
                                    textMonthFontFamily: 'Urbanist Bold',
                                    textDayHeaderFontFamily: 'Urbanist SemiBold',
                                    selectedDayTextColor: '#fff',
                                    selectedDayBackgroundColor: '#001F3F',
                                }}
                                minDate={new Date().toISOString().split('T')[0]}
                                disableAllTouchEventsForDisabledDays={true}
                            />
                        </LinearGradient>

                        {/* Select Hour */}
                        <Text style={[styles.title, { color: dark ? COLORS.white : '#001F3F' }]}>
                            Select Hour
                        </Text>

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

                {/* Next Button */}
                <View style={[styles.bottomContainer, { backgroundColor: dark ? COLORS.dark2 : COLORS.white }]}>
                    <TouchableOpacity
                        activeOpacity={selectedHour ? 0.8 : 1}
                        onPress={() => {
                            if (selectedHour) {
                                navigation.navigate('SelectPackage', {
                                    startedDate,
                                    selectedHour,
                                    doctorId,
                                    method,
                                });
                            }
                        }}
                    >
                        <LinearGradient
                            colors={selectedHour ? ['#001F3F', '#003366'] : ['#ccc', '#ddd']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.gradientBtn}
                        >
                            <Text style={styles.btnText}>Next</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    area: { flex: 1 },
    container: { flex: 1, padding: 16 },
    title: {
        fontSize: 20,
        fontFamily: 'Urbanist Bold',
        marginTop: 12,
        marginBottom: 8,
        color:'#fff'
    },
    calendarWrapper: {
        borderRadius: 16,
        padding: 10,
        marginVertical: 12,
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 8,
    },
    hourButton: {
        borderRadius: 32,
        margin: 5,
        borderWidth: 1.4,
        width: (SIZES.width - 42) / 3,
        height: 45,
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedHourText: {
        fontSize: 14,
        fontFamily: 'Urbanist SemiBold',
    },
    hourText: {
        fontSize: 14,
        fontFamily: 'Urbanist SemiBold',
    },
    disabledHourBox: {
        backgroundColor: '#f2f2f2',
        borderColor: '#e0e0e0',
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: 90,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 10,
    },
    gradientBtn: {
        width: SIZES.width - 32,
        height: 55,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnText: {
        color: COLORS.white,
        fontSize: 18,
        fontFamily: 'Urbanist Bold',
    },
});

export default BookAppointment;

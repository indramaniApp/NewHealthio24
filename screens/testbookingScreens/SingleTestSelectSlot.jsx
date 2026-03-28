import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    Modal,
    StatusBar,
    Platform
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import Header from '../../components/Header';
import { COLORS, SIZES } from '../../constants';
import { useTheme } from '../../theme/ThemeProvider';
import { hoursData } from '../../data';
import LinearGradient from 'react-native-linear-gradient';

const SingleTestSelectSlot = ({ navigation, route }) => {
    const { testId } = route.params || {};
    const { colors, dark } = useTheme();
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedHour, setSelectedHour] = useState(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    const today = new Date().toISOString().split('T')[0];

    // Check if the time slot is in the past
    const isPastTime = (hourString) => {
        if (!selectedDate) return false;

        const now = new Date();
        const selectedDateObj = new Date(selectedDate);

        if (selectedDateObj.toDateString() !== now.toDateString()) return false;

        const [time, modifier] = hourString.split(' ');
        let [hours, minutes] = time.split(':').map(Number);

        if (modifier === 'PM' && hours !== 12) hours += 12;
        if (modifier === 'AM' && hours === 12) hours = 0;

        const slotTime = new Date(selectedDate);
        slotTime.setHours(hours);
        slotTime.setMinutes(minutes);
        slotTime.setSeconds(0);

        return slotTime <= now;
    };

    const handleHourSelect = (hour) => setSelectedHour(hour);

    const handleNext = () => {
        if (!selectedDate || !selectedHour) {
            alert('Please select a date and time slot');
            return;
        }
        setShowPaymentModal(true);
    };

    const handleBookByWallet = () => {
        setShowPaymentModal(false);
        navigation.navigate('SingleTestBookByWallet', {
            startedDate: selectedDate,
            selectedHour,
            testId
        });
    };

    const handleBookByPayment = () => {
        setShowPaymentModal(false);
        navigation.navigate('SingleTestBookByPayment', {
            startedDate: selectedDate,
            selectedHour,
            testId
        });
    };

    return (
        <LinearGradient colors={['#fff', '#fff', '#fff']} style={{ flex: 1 }}>
            <SafeAreaView style={styles.safeArea}>
                <StatusBar
                    translucent
                    backgroundColor="transparent"
                    barStyle={dark ? 'light-content' : 'dark-content'}
                />

                <Header
                    title="Select Appointment Slot"
                    onBackPress={() => navigation.goBack()}
                    style={{ backgroundColor: 'transparent', marginTop: 40 }}
                    titleStyle={{ color: '#4A148C' }}
                />

                <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
                    <View style={styles.container}>
                        <Text style={[styles.label, { color: colors.text }]}>Select Date</Text>

                        <View style={styles.calendarCard}>
                            <Calendar
                                onDayPress={(day) => {
                                    setSelectedDate(day.dateString);
                                    setSelectedHour(null);
                                }}
                                minDate={today}
                                markedDates={{
                                    [selectedDate]: {
                                        selected: true,
                                        selectedColor:'#6A1B9A',
                                    },
                                }}
                                theme={{
                                    backgroundColor: '#F8EAFB',
                                    calendarBackground: '#F8EAFB',
                                    textSectionTitleColor: colors.text,
                                    selectedDayTextColor: '#fff',
                                    todayTextColor: '#6A1B9A',
                                    dayTextColor: colors.text,
                                    arrowColor: '#6A1B9A',
                                    monthTextColor: '#6A1B9A',
                                }}
                                style={{
                                    borderRadius: 12,
                                    backgroundColor: '#F8EAFB',
                                    padding: 5,
                                }}
                            />
                        </View>

                        {selectedDate && (
                            <Text style={[styles.selectedDateText, { color: '#6A1B9A' }]}>
                                Selected: {selectedDate}
                            </Text>
                        )}

                        <Text style={[styles.label, { color: colors.text }]}>Select Time Slot</Text>

                        <View style={styles.slotGrid}>
                            {hoursData.map((item) => {
                                const isSelected = selectedHour === item.hour;
                                const disabled = isPastTime(item.hour);

                                if (isSelected) {
                                    return (
                                        <LinearGradient
                                            key={item.id}
                                            colors={['#6A1B9A', '#AB47BC']}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 0 }}
                                            style={styles.selectedHourBox}
                                        >
                                            <Text style={styles.selectedHourText}>{item.hour}</Text>
                                        </LinearGradient>
                                    );
                                }

                                return (
                                    <TouchableOpacity
                                        key={item.id}
                                        style={[
                                            styles.hourBox,
                                            disabled && styles.disabledSlot
                                        ]}
                                        disabled={disabled}
                                        onPress={() => handleHourSelect(item.hour)}
                                    >
                                        <Text style={[
                                            styles.hourText,
                                            disabled && styles.disabledText
                                        ]}>
                                            {item.hour}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>
                </ScrollView>

                {/* Gradient Next Button */}
                <View style={[styles.bottomBar, { backgroundColor: dark ? COLORS.dark2 : COLORS.white }]}>
                    <TouchableOpacity style={styles.btn} onPress={handleNext} activeOpacity={0.9}>
                        <LinearGradient
                            colors={['#6A1B9A', '#AB47BC']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.gradientBtn}
                        >
                            <Text style={styles.gradientBtnText}>Next</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                {/* Payment Modal */}
                <Modal
                    visible={showPaymentModal}
                    transparent
                    animationType="slide"
                    onRequestClose={() => setShowPaymentModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={[styles.modalContainer, { backgroundColor: COLORS.white }]}>
                            <Text style={[styles.modalTitle, { color: COLORS.text }]}>Choose Payment Method</Text>

                            <TouchableOpacity style={styles.modalButton} onPress={handleBookByWallet}>
                                <LinearGradient colors={['#6A1B9A', '#AB47BC']} style={styles.modalGradientBtn}>
                                    <Text style={styles.modalBtnText}>Book by Wallet</Text>
                                </LinearGradient>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.modalOutlineBtn} onPress={handleBookByPayment}>
                                <Text style={styles.modalOutlineText}>Book by Payment</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => setShowPaymentModal(false)}>
                                <Text style={styles.modalCancel}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </SafeAreaView>
        </LinearGradient>
    );
};

export default SingleTestSelectSlot;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        padding: 16,
    },
    label: {
        fontSize: 16,
        fontFamily: 'Urbanist SemiBold',
        marginBottom: 8,
        marginTop: 12,
    },
    calendarCard: {
        backgroundColor: '#F8EAFB',
        borderRadius: 16,
        padding: 10,
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
    },
    selectedDateText: {
        fontSize: 14,
        fontFamily: 'Urbanist Medium',
        textAlign: 'center',
        marginVertical: 12,
    },
    slotGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    hourBox: {
        width: (SIZES.width - 64) / 3,
        height: 48,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#6A1B9A',
        backgroundColor: '#F8EAFB',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    selectedHourBox: {
        width: (SIZES.width - 64) / 3,
        height: 48,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    hourText: {
        fontSize: 15,
        fontFamily: 'Urbanist SemiBold',
        color: '#6A1B9A',
    },
    selectedHourText: {
        color: '#fff',
        fontWeight: '600',
    },
    disabledSlot: {
        backgroundColor: '#E0E0E0',
        borderColor: '#CCC',
    },
    disabledText: {
        color: '#9E9E9E',
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: 90,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        elevation: 8,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: -2 },
    },
    btn: {
        width: SIZES.width - 32,
    },
    gradientBtn: {
        paddingVertical: 14,
        borderRadius: 30,
        alignItems: 'center',
    },
    gradientBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '85%',
        padding: 20,
        borderRadius: 16,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontFamily: 'Urbanist SemiBold',
        marginBottom: 20,
    },
    modalButton: {
        width: '100%',
        marginBottom: 12,
    },
    modalGradientBtn: {
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalBtnText: {
        color: '#fff',
        fontWeight: '600',
    },
    modalOutlineBtn: {
        borderWidth: 1.5,
        borderColor: '#6A1B9A',
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
        width: '100%',
        marginBottom: 10,
    },
    modalOutlineText: {
        color: '#6A1B9A',
        fontWeight: '600',
    },
    modalCancel: {
        marginTop: 10,
        color: '#6A1B9A',
        fontFamily: 'Urbanist Medium',
    },
});

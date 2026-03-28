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
import LinearGradient from 'react-native-linear-gradient';
import Header from '../../components/Header';
import { COLORS, SIZES } from '../../constants';
import { useTheme } from '../../theme/ThemeProvider';
import { hoursData } from '../../data';

const SelectSlot = ({ navigation }) => {
    const { dark } = useTheme();
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedHour, setSelectedHour] = useState(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    const today = new Date().toISOString().split('T')[0];

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

    const handleNext = () => {
        if (!selectedDate || !selectedHour) {
            alert('Please select a date and time slot');
            return;
        }
        setShowPaymentModal(true);
    };

    const handleBookByWallet = () => {
        setShowPaymentModal(false);
        navigation.navigate('SelectTestMode', {
            startedDate: selectedDate,
            selectedHour,
        });
    };

    const handleBookByPayment = () => {
        setShowPaymentModal(false);
        navigation.navigate('BookByPayment', {  // <-- same screen
            startedDate: selectedDate,
            selectedHour,
        });
    };

    return (
        <LinearGradient colors={['#fff', '#fff', '#fff']} style={{ flex: 1 }}>
            <SafeAreaView style={styles.safeArea}>
                <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

                <View style={{ marginTop: 8 }}>
                    <Header
                        title="Select Appointment Slot"
                        onBackPress={() => navigation.goBack()}
                        titleStyle={{ color: '#4A148C' }}
                        style={{ backgroundColor: 'transparent' }}
                    />
                </View>

                <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
                    <View style={styles.container}>
                        <Text style={styles.label}>Select Date</Text>

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
                                        selectedColor: '#6A1B9A',
                                    },
                                }}
                                theme={{
                                    calendarBackground: '#F8EAFB',
                                    textSectionTitleColor: '#6A1B9A',
                                    selectedDayTextColor: '#fff',
                                    todayTextColor: '#6A1B9A',
                                    dayTextColor: '#333',
                                    arrowColor: '#6A1B9A',
                                    monthTextColor: '#6A1B9A',
                                }}
                                style={styles.calendarStyle}
                            />
                        </View>

                        {selectedDate && (
                            <Text style={styles.selectedDateText}>
                                Selected: {selectedDate}
                            </Text>
                        )}

                        <Text style={styles.label}>Select Time Slot</Text>

                        <View style={styles.slotGrid}>
                            {hoursData.map((item) => {
                                const isSelected = selectedHour === item.hour;
                                const disabled = isPastTime(item.hour);

                                if (isSelected) {
                                    return (
                                        <LinearGradient
                                            key={item.id}
                                            colors={['#6A1B9A', '#AB47BC']}
                                            style={styles.hourBox}
                                        >
                                            <Text style={styles.selectedHourText}>{item.hour}</Text>
                                        </LinearGradient>
                                    );
                                }

                                return (
                                    <TouchableOpacity
                                        key={item.id}
                                        style={[
                                            styles.hourBoxOutline,
                                            disabled && styles.disabledSlot
                                        ]}
                                        disabled={disabled}
                                        onPress={() => setSelectedHour(item.hour)}
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
                <Modal visible={showPaymentModal} transparent animationType="slide">
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <Text style={styles.modalTitle}>Choose Payment Method</Text>
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

export default SelectSlot;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    container: { padding: 16 },
    label: {
        fontSize: 16,
        marginBottom: 8,
        marginTop: 12,
        color: '#4A148C',
        fontWeight: '600',
    },
    calendarCard: {
        borderRadius: 16,
        padding: 10,
        elevation: 3,
        backgroundColor: '#F8EAFB',
    },
    calendarStyle: { borderRadius: 12 },
    selectedDateText: {
        textAlign: 'center',
        marginVertical: 12,
        color: '#6A1B9A',
        fontWeight: '600',
    },
    slotGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    hourBoxOutline: {
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
    hourBox: {
        width: (SIZES.width - 64) / 3,
        height: 48,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    hourText: {
        fontSize: 15,
        color: '#6A1B9A',
        fontWeight: '600',
    },
    selectedHourText: {
        color: '#fff',
        fontWeight: '700',
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
    },
    btn: { width: SIZES.width - 32 },
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
        backgroundColor: '#fff',
    },
    modalTitle: {
        fontSize: 18,
        marginBottom: 20,
        color: '#4A148C',
        fontWeight: '700',
    },
    modalButton: { width: '100%', marginBottom: 12 },
    modalGradientBtn: {
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalBtnText: { color: '#fff', fontWeight: '600' },
    modalOutlineBtn: {
        borderWidth: 1.5,
        borderColor: '#8E24AA',
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
        width: '100%',
        marginBottom: 10,
    },
    modalOutlineText: { color: '#8E24AA', fontWeight: '600' },
    modalCancel: { marginTop: 10, color: '#6A1B9A', fontWeight: '600' },
});

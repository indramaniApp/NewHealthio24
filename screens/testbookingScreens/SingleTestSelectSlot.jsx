import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    Modal,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import Header from '../../components/Header';
import Button from '../../components/Button';
import { COLORS, SIZES } from '../../constants';
import { useTheme } from '../../theme/ThemeProvider';
import { hoursData } from '../../data';

// 1. Import LinearGradient
import LinearGradient from 'react-native-linear-gradient';

const SingleTestSelectSlot = ({ navigation, route }) => {
    const { testId } = route.params || {};
    const { colors, dark } = useTheme();
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedHour, setSelectedHour] = useState(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);

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
            testId: testId
        });
    };

    const handleBookByPayment = () => {
        setShowPaymentModal(false);
        navigation.navigate('SingleTestBookyByPayment', {
            startedDate: selectedDate,
            selectedHour,
            testId: testId
        });
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* 2. Wrap the main screen content in LinearGradient */}
            <LinearGradient
                colors={['#00b4db', '#E0F7FA', '#FFFFFF']}
                style={{ flex: 1 }}
            >
                <Header
                    title="Select Appointment Slot"
                    onBackPress={() => navigation.goBack()}
                    // Make the header background transparent to show the gradient
                    style={{ backgroundColor: 'transparent',marginTop:40 }}
                />

                <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
                    <View style={styles.container}>
                        <Text style={[styles.label, { color: colors.text }]}>Select Date</Text>

                        <View style={styles.calendarCard}>
                            <Calendar
                                onDayPress={(day) => setSelectedDate(day.dateString)}
                                minDate={new Date().toISOString().split('T')[0]}
                                markedDates={{
                                    [selectedDate]: {
                                        selected: true,
                                        selectedColor:'#00b4db',
                                    },
                                }}
                                theme={{
                                    backgroundColor: '#F2F6FD',
                                    calendarBackground: '#F2F6FD',
                                    textSectionTitleColor: colors.text,
                                    selectedDayTextColor: '#fff',
                                    todayTextColor: COLORS.primary,
                                    dayTextColor: colors.text,
                                    arrowColor: COLORS.primary,
                                    monthTextColor: COLORS.primary,
                                }}
                                style={{
                                    borderRadius: 12,
                                    backgroundColor: '#F2F6FD',
                                    padding: 5,
                                }}
                            />
                        </View>

                        {selectedDate && (
                            <Text style={[styles.selectedDateText, { color: COLORS.primary }]}>
                                Selected: {selectedDate}
                            </Text>
                        )}

                        <Text style={[styles.label, { color: colors.text }]}>Select Time Slot</Text>

                        <View style={styles.slotGrid}>
                            {hoursData.map((item) => {
                                const isSelected = selectedHour === item.hour;
                                return (
                                    <TouchableOpacity
                                        key={item.id}
                                        style={[styles.hourBox, isSelected && styles.selectedHourBox]}
                                        onPress={() => handleHourSelect(item.hour)}
                                    >
                                        <Text style={[styles.hourText, isSelected && styles.selectedHourText]}>
                                            {item.hour}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>
                </ScrollView>

                <View style={[styles.bottomBar, { backgroundColor: dark ? COLORS.dark2 : COLORS.white }]}>
                    <Button title="Next" filled style={styles.btn} onPress={handleNext} />
                </View>
            </LinearGradient>

            {/* Modal remains a direct child of SafeAreaView to overlay the entire screen */}
            <Modal
                visible={showPaymentModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowPaymentModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContainer, { backgroundColor: COLORS.white }]}>
                        <Text style={[styles.modalTitle, { color: COLORS.text }]}>Choose Payment Method</Text>

                        <Button title="Book by Wallet" filled style={styles.modalButton} onPress={handleBookByWallet} />
                        <Button title="Book by Payment" outlined style={styles.modalButton} onPress={handleBookByPayment} />

                        <TouchableOpacity onPress={() => setShowPaymentModal(false)}>
                            <Text style={styles.modalCancel}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

export default SingleTestSelectSlot;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        // 3. Removed backgroundColor to allow the gradient to be visible
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
        backgroundColor: '#F2F6FD',
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
        borderColor: COLORS.primary,
        backgroundColor: '#F2F6FD',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    selectedHourBox: {
        backgroundColor: '#00b4db',
    },
    hourText: {
        fontSize: 15,
        fontFamily: 'Urbanist SemiBold',
        color: COLORS.primary,
    },
    selectedHourText: {
        color: '#fff',
        fontWeight: '600',
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
    modalCancel: {
        marginTop: 10,
        color: COLORS.primary,
        fontFamily: 'Urbanist Medium',
    },
});
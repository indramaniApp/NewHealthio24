import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    Modal,
    Platform,
    StatusBar,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import Header from '../../components/Header';
import Button from '../../components/Button';
import { COLORS, SIZES } from '../../constants';
import { useTheme } from '../../theme/ThemeProvider';
import { hoursData } from '../../data';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// 🔥 LinearGradient import karein
import LinearGradient from 'react-native-linear-gradient';

const PatientMitraSelectSlot = ({ navigation, route }) => {
    const { packageId } = route.params || {};
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
        navigation.navigate('PatientMitraBookByWallet', {
            startedDate: selectedDate,
            selectedHour,
            packageId,
        });
        console.log('Navigating with packageId:===========s====', packageId);
    };

    const handleBookByPayment = () => {
        setShowPaymentModal(false);
        navigation.navigate('PatientMitraBookByPayment', {
            startedDate: selectedDate,
            selectedHour,
            packageId,
        });
    };

    return (
        // 🔥 LinearGradient wrap
        <LinearGradient
            colors={dark ? ['#1A202C', '#2D3748'] : ['#00b4db', '#f4f4f5', '#f4f4f5']}
            style={{ flex: 1 }}
        >
            <SafeAreaView style={[styles.safeArea, { backgroundColor: 'transparent' }]}>
                <Header 
                    title="Select Appointment Slot" 
                    onBackPress={() => navigation.goBack()} 
                    style={{ backgroundColor: 'transparent' }}
                />

                <ScrollView 
                    contentContainerStyle={{ paddingBottom: 120 }}
                    showsVerticalScrollIndicator={false}
                    style={{ backgroundColor: 'transparent' }}
                >
                    <View style={styles.container}>
                        <Text style={[styles.label, { color: colors.text }]}>Select Date</Text>

                        <View style={styles.calendarCard}>
                            <Calendar
                                onDayPress={(day) => setSelectedDate(day.dateString)}
                                minDate={new Date().toISOString().split('T')[0]}
                                markedDates={{
                                    [selectedDate]: {
                                        selected: true,
                                        selectedColor: COLORS.primary,
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

                                const now = new Date();
                                const todayDate = now.toISOString().split('T')[0];
                                const isToday = selectedDate === todayDate;

                                const [hourPart, modifier] = item.hour.split(' ');
                                let [hrs, mins] = hourPart.split(':');
                                hrs = parseInt(hrs, 10);
                                mins = parseInt(mins || '0', 10);

                                if (modifier === 'PM' && hrs !== 12) hrs += 12;
                                if (modifier === 'AM' && hrs === 12) hrs = 0;

                                const slotTime = new Date();
                                slotTime.setHours(hrs, mins, 0, 0);

                                const isDisabled = isToday && slotTime.getTime() <= now.getTime();

                                return (
                                    <TouchableOpacity
                                        key={item.id}
                                        style={[
                                            styles.hourBox,
                                            isSelected && styles.selectedHourBox,
                                            isDisabled && styles.disabledHourBox,
                                        ]}
                                        onPress={() => {
                                            if (!isDisabled) {
                                                handleHourSelect(item.hour);
                                            }
                                        }}
                                        disabled={isDisabled}
                                    >
                                        <Text
                                            style={[
                                                styles.hourText,
                                                isSelected && styles.selectedHourText,
                                                isDisabled && { textDecorationLine: 'line-through', color: 'gray' },
                                            ]}
                                        >
                                            {item.hour}
                                        </Text>
                                        {isSelected && (
                                            <MaterialCommunityIcons
                                                name="check-circle"
                                                size={18}
                                                color="#fff"
                                                style={{ position: 'absolute', top: 5, right: 5 }}
                                            />
                                        )}
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>
                </ScrollView>

                <View style={[styles.bottomBar, { backgroundColor: 'transparent' }]}>
                    <Button title="Next" filled style={styles.btn} onPress={handleNext} />
                </View>

                {/* Modal for Payment Method */}
                <Modal
                    visible={showPaymentModal}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setShowPaymentModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={[styles.modalContainer, { backgroundColor: COLORS.white }]}>
                            <Text style={[styles.modalTitle, { color: COLORS.text }]}>
                                Choose Payment Method
                            </Text>

                            <Button title="Book by Wallet" filled style={styles.modalButton} onPress={handleBookByWallet} />
                            <Button title="Book by Payment" outlined style={styles.modalButton} onPress={handleBookByPayment} />

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

export default PatientMitraSelectSlot;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
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
        height: 50,
        borderRadius: 12,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
        borderWidth: 1.2,
        borderColor: COLORS.primary,
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        position: 'relative',
    },
    selectedHourBox: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    disabledHourBox: {
        opacity: 0.4,
    },
    hourText: {
        fontSize: 15,
        fontFamily: 'Urbanist SemiBold',
        color: COLORS.primary,
    },
    selectedHourText: {
        color: '#fff',
        fontFamily: 'Urbanist SemiBold',
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

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
    Platform,
    Dimensions,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../../components/Header';
import Button from '../../components/Button';
import { COLORS } from '../../constants';
import { useTheme } from '../../theme/ThemeProvider';
import { hoursData } from '../../data';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const GRADIENT_COLORS = ['#e44949', '#be48d3'];

const DialysisSelectSlot = ({ navigation, route }) => {
    const { unitId } = route.params || {};
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
        navigation.navigate('DialysisBookByWallet', {
            startedDate: selectedDate,
            selectedHour,
            unitId,
        });
    };

    const handleBookByPayment = () => {
        setShowPaymentModal(false);
        navigation.navigate('DialysisBookByPayment', {
            startedDate: selectedDate,
            selectedHour,
            unitId,
        });
    };

    const isPastSlot = (slotHour) => {
        if (!selectedDate) return false;

        const now = new Date();

        const today =
            now.getFullYear() +
            '-' +
            String(now.getMonth() + 1).padStart(2, '0') +
            '-' +
            String(now.getDate()).padStart(2, '0');

        if (selectedDate !== today) return false;

        const [time, modifier] = slotHour.split(' ');
        let [hours, minutes] = time.split(':').map(Number);

        if (modifier === 'PM' && hours !== 12) hours += 12;
        if (modifier === 'AM' && hours === 12) hours = 0;

        const slotTime = new Date();
        slotTime.setHours(hours, minutes || 0, 0, 0);

        return slotTime.getTime() <= now.getTime();
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar
                barStyle={dark ? 'light-content' : 'dark-content'}
                backgroundColor="#fff"
            />

            <View style={{ flex: 1 }}>
                <Header
                    title="Select Appointment Slot"
                    onBackPress={() => navigation.goBack()}
                />

                <ScrollView
                    contentContainerStyle={{ flexGrow: 1, paddingBottom: 140, paddingHorizontal: 16 }}
                    showsVerticalScrollIndicator={false}
                >
                    <Text style={[styles.label, { color: colors.text }]}>Select Date</Text>

                    <View style={styles.calendarCard}>
                        <Calendar
                            onDayPress={(day) => {
                                setSelectedDate(day.dateString);
                                setSelectedHour(null);
                            }}
                            minDate={new Date().toISOString().split('T')[0]}
                            markedDates={{
                                [selectedDate]: {
                                    selected: true,
                                    selectedColor: GRADIENT_COLORS[0],
                                },
                            }}
                            theme={{
                                todayTextColor: GRADIENT_COLORS[0],
                                arrowColor: GRADIENT_COLORS[0],
                                monthTextColor: GRADIENT_COLORS[0],
                                selectedDayTextColor: '#fff',
                                dayTextColor: colors.text,
                            }}
                        />
                    </View>

                    {selectedDate && (
                        <Text style={styles.selectedDateText}>
                            Selected: {selectedDate}
                        </Text>
                    )}

                    <Text style={[styles.label, { color: colors.text }]}>Select Time Slot</Text>

                    <View style={styles.slotGrid}>
                        {hoursData.map((item) => {
                            const isSelected = selectedHour === item.hour;
                            const disabled = isPastSlot(item.hour);

                            return (
                                <TouchableOpacity
                                    key={item.id}
                                    style={styles.hourBoxWrapper}
                                    onPress={() => !disabled && handleHourSelect(item.hour)}
                                    activeOpacity={disabled ? 1 : 0.7}
                                >
                                    <LinearGradient
                                        colors={isSelected ? GRADIENT_COLORS : ['#F2F6FD', '#F2F6FD']}
                                        style={[
                                            styles.hourBox,
                                            disabled && styles.disabledHourBox,
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.hourText,
                                                isSelected && styles.selectedHourText,
                                                disabled && styles.disabledHourText,
                                            ]}
                                        >
                                            {item.hour}
                                        </Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </ScrollView>

                {/* Bottom Button */}
               <View style={styles.bottomBar}>
  <Button
      title="Next"
      filled
      colors={GRADIENT_COLORS} // red-purple gradient only here
      style={{
          width: SCREEN_WIDTH - 32,
          height: 52,
          borderRadius: 14,
      }}
      onPress={handleNext}
  />
</View>

                {/* Payment Modal */}
                <Modal
                    visible={showPaymentModal}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setShowPaymentModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContainer}>
                            <Text style={styles.modalTitle}>Choose Payment Method</Text>

                          <Button
    title="Book by Wallet"
    filled
    colors={GRADIENT_COLORS}
    style={{ width: '100%', height: 50, borderRadius: 14, marginBottom: 12 }}
    onPress={handleBookByWallet}
/>

<Button
    title="Book by Payment"
    filled
    colors={GRADIENT_COLORS}
    style={{ width: '100%', height: 50, borderRadius: 14, marginBottom: 12 }}
    onPress={handleBookByPayment}
/>


                            <TouchableOpacity onPress={() => setShowPaymentModal(false)}>
                                <Text style={styles.modalCancel}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        </SafeAreaView>
    );
};

export default DialysisSelectSlot;

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#fff' },

    label: {
        fontSize: SCREEN_WIDTH * 0.04,
        fontFamily: 'Urbanist-SemiBold',
        marginBottom: 8,
        marginTop: 12,
    },

    calendarCard: {
        backgroundColor: '#F2F6FD',
        borderRadius: 16,
        padding: 10,
        marginBottom: 12,
    },

    selectedDateText: {
        fontSize: SCREEN_WIDTH * 0.035,
        fontFamily: 'Urbanist-Medium',
        textAlign: 'center',
        marginVertical: 12,
        color: GRADIENT_COLORS[0],
    },

    slotGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },

    hourBoxWrapper: {
        flexBasis: '30%',
        marginBottom: 12,
        borderRadius: 12,
        overflow: 'hidden',
    },

    hourBox: {
        height: SCREEN_HEIGHT * 0.065,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: GRADIENT_COLORS[0],
        justifyContent: 'center',
        alignItems: 'center',
    },

    disabledHourBox: {
        backgroundColor: '#e0e0e0',
        borderColor: '#aaa',
    },

    hourText: {
        fontSize: SCREEN_WIDTH * 0.035,
        fontFamily: 'Urbanist-SemiBold',
        color: GRADIENT_COLORS[0],
    },

    selectedHourText: {
        color: '#fff',
        fontWeight: '600',
    },

    disabledHourText: {
        color: '#888',
    },

    bottomBar: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: 90,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },

    gradientBtn: {
        width: SCREEN_WIDTH - 32,
        borderRadius: 14,
        overflow: 'hidden',
    },

    innerBtn: {
        backgroundColor: 'transparent',
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
        fontSize: SCREEN_WIDTH * 0.045,
        fontFamily: 'Urbanist-SemiBold',
        marginBottom: 20,
    },

    modalGradientBtn: {
        width: '100%',
        borderRadius: 14,
        marginBottom: 12,
        overflow: 'hidden',
    },

    modalBtnInner: {
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },

    modalBtnText: {
        color: '#fff',
        fontFamily: 'Urbanist-SemiBold',
        fontSize: 16,
    },

    modalCancel: {
        marginTop: 10,
        color: GRADIENT_COLORS[0],
        fontFamily: 'Urbanist-Medium',
    },
});

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
import { COLORS, SIZES } from '../../constants';
import { useTheme } from '../../theme/ThemeProvider';
import { hoursData } from '../../data';
// 1. LinearGradient component ko import karein
import LinearGradient from 'react-native-linear-gradient';

const PackagesTestSelectSlot = ({ navigation, route }) => {
  const { packageId } = route.params || {};
  const { colors } = useTheme();
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
    navigation.navigate('PackagesTestBookByWallet', {
      startedDate: selectedDate,
      selectedHour,
      packageId: packageId
    });
  };

  const handleBookByPayment = () => {
    setShowPaymentModal(false);
    navigation.navigate('PackagesTestBookByPament', {
      startedDate: selectedDate,
      selectedHour,
      packageId: packageId
    });
  };

  return (
    // 2. Screen ke background ke liye LinearGradient use karein
    <LinearGradient colors={['#00b4db', '#FFFFFF', "#ffff"]} style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeArea}>
        <Header title="Select Appointment Slot" onBackPress={() => navigation.goBack()}
          style={{ marginTop: 40 }}
        />
        <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            <Text style={[styles.label, { color: colors.text }]}>Select Date</Text>

            {/* Calendar card ke liye LinearGradient */}
            <LinearGradient
              colors={['#FFFFFF', '#F9FAFB']}
              style={styles.calendarCard}
            >
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
                  backgroundColor: 'transparent',
                  calendarBackground: 'transparent',
                  textSectionTitleColor: colors.text,
                  selectedDayTextColor: '#fff',
                  todayTextColor: COLORS.primary,
                  dayTextColor: colors.text,
                  arrowColor: COLORS.primary,
                  monthTextColor: COLORS.primary,
                }}
                style={{ borderRadius: 12 }}
              />
            </LinearGradient>

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
                  <TouchableOpacity key={item.id} onPress={() => handleHourSelect(item.hour)}>
                    {isSelected ? (
                      // Selected time slot ke liye LinearGradient
                      <LinearGradient
                        colors={['#0077b6', '#00b4db']}
                        style={[styles.hourBox, { borderWidth: 0 }]}
                      >
                        <Text style={styles.selectedHourText}>{item.hour}</Text>
                      </LinearGradient>
                    ) : (
                      <View style={styles.hourBox}>
                        <Text style={styles.hourText}>{item.hour}</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </ScrollView>

        <View style={styles.bottomBar}>
          <TouchableOpacity onPress={handleNext}>
            <LinearGradient
              colors={['#0077b6', '#00b4db']}
              style={styles.gradientBtn}
            >
              <Text style={styles.btnText}>Next</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Modal for Payment Method */}
        <Modal
          visible={showPaymentModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowPaymentModal(false)}
        >
          <View style={styles.modalOverlay}>
            <LinearGradient
              colors={['#FFFFFF', '#FAFCFF']}
              style={styles.modalContainer}
            >
              <Text style={[styles.modalTitle, { color: COLORS.text }]}>Choose Payment Method</Text>

              <TouchableOpacity onPress={handleBookByWallet} style={{ width: '100%' }}>
                <LinearGradient colors={['#0077b6', '#00b4db']} style={styles.modalButton}>
                  <Text style={styles.btnText}>Book by Wallet</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleBookByPayment} style={{ width: '100%' }}>
                <LinearGradient colors={['#00b4db', '#0097c4']} style={styles.modalButton}>
                  <Text style={styles.btnText}>Book by Payment</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setShowPaymentModal(false)}>
                <Text style={styles.modalCancel}>Cancel</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default PackagesTestSelectSlot;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 12,
  },
  calendarCard: {
    borderRadius: 16,
    padding: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  selectedDateText: {
    fontSize: 14,
    fontWeight: '500',
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
    borderColor: '#0077b6',
    backgroundColor: '#F2F6FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  hourText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.primary,
  },
  selectedHourText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 16,
    backgroundColor: 'transparent',
  },
  gradientBtn: {
    width: '100%',
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
    fontWeight: '600',
    marginBottom: 20,
  },
  modalButton: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 12,
  },
  modalCancel: {
    marginTop: 10,
    color: COLORS.primary,
    fontWeight: '500',
  },
});
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
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
  const [startedDate, setStartedDate] = useState(
    new Date().toISOString().split('T')[0]
  ); // YYYY-MM-DD

  const handleHourSelect = (hour) => {
    setSelectedHour(hour);
  };

  const renderHourItem = ({ item }) => {
    const isSelected = selectedHour === item.hour;
    return (
      <TouchableOpacity onPress={() => handleHourSelect(item.hour)} style={{ flex: 1 }}>
        {isSelected ? (
          <LinearGradient
            colors={['#8E2DE2', '#FF6FD8']} 
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.hourButton, { borderWidth: 0 }]}
          >
            <Text style={styles.selectedHourText}>{item.hour}</Text>
          </LinearGradient>
        ) : (
          <View style={styles.hourButton}>
            <Text style={styles.hourText}>{item.hour}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Header title="Book Appointment" onBackPress={() => navigation.goBack()} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
          keyboardShouldPersistTaps="handled"
        >
          <Text
            style={[
              styles.title,
              { color: dark ? COLORS.white : COLORS.greyscale900 },
            ]}>
            Select Date
          </Text>

          {/* Stylish Gradient Calendar */}
          <LinearGradient
            colors={['#8E2DE2', '#FF6FD8']}   
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.calendarWrapper}
          >
            <Calendar
              onDayPress={(day) => setStartedDate(day.dateString)}
              markedDates={{
                [startedDate]: {
                  selected: true,
                  selectedColor: '#FFFFFF',
                  selectedTextColor: '#8E2DE2',
                },
              }}
              theme={{
                calendarBackground: 'transparent',
                dayTextColor: '#FFFFFF',
                textDisabledColor: '#B0BEC5',
                monthTextColor: '#FFFFFF',
                arrowColor: '#FFFFFF',
                todayTextColor: '#FFEB3B',
                selectedDayTextColor: '#8E2DE2',
                selectedDayBackgroundColor: '#FFFFFF',
                textSectionTitleColor: '#FFD700', 
                textDayFontFamily: 'Urbanist SemiBold',
                textMonthFontFamily: 'Urbanist Bold',
                textDayHeaderFontFamily: 'Urbanist SemiBold',
              }}
              minDate={new Date().toISOString().split('T')[0]}
              disableAllTouchEventsForDisabledDays={true}
            />
          </LinearGradient>

          <Text
            style={[
              styles.title,
              { color: dark ? COLORS.white : COLORS.greyscale900 },
            ]}>
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

      {/* Gradient Button */}
      <View
        style={[
          styles.bottomContainer,
          { backgroundColor: dark ? COLORS.dark2 : COLORS.white },
        ]}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() =>
            navigation.navigate('SelectPackage', {
              startedDate,
              selectedHour,
              doctorId,
              method,
            })
          }
        >
          <LinearGradient
            colors={['#FF6FD8', '#8E2DE2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientBtn}
          >
            <Text style={styles.btnText}>Next</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  area: { flex: 1, backgroundColor: COLORS.white },
  container: { flex: 1, backgroundColor: COLORS.white, padding: 16 },
  title: {
    fontSize: 20,
    fontFamily: 'Urbanist Bold',
    color: COLORS.black,
    marginTop: 12,
    marginBottom: 8,
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
    borderColor: COLORS.primary,
    borderWidth: 1.4,
    width: (SIZES.width - 32) / 3 - 9,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
  },
  selectedHourText: {
    fontSize: 16,
    fontFamily: 'Urbanist SemiBold',
    color: COLORS.white,
  },
  hourText: {
    fontSize: 16,
    fontFamily: 'Urbanist SemiBold',
    color: COLORS.primary,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 99,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradientBtn: {
    width: SIZES.width - 32,
    height: 55,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#8E2DE2',
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  btnText: {
    color: COLORS.white,
    fontSize: 18,
    fontFamily: 'Urbanist Bold',
  },
});

export default BookAppointment;

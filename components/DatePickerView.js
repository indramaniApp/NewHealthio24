// components/DatePickerView.js
import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import DatePicker from 'react-native-modern-datepicker';
import { COLORS, SIZES } from '../constants';
import { useTheme } from '../theme/ThemeProvider';

const error = console.error;
console.error = (...args) => {
  if (/defaultProps/.test(args[0])) return;
  error(...args);
};

const DatePickerView = ({
  startDate,            // minimum date (string: YYYY/MM/DD)
  selectedDate,         // preselected date (string)
  onChangeStartDate,    // preferred callback
  onSelectedChange,     // backward-compatible alias
}) => {
  const [selectedStartDate, setSelectedStartDate] = useState(
    selectedDate || new Date().toISOString().split('T')[0]
  );
  const { dark } = useTheme();

  useEffect(() => {
    if (selectedDate) setSelectedStartDate(selectedDate);
  }, [selectedDate]);

  const handleDateChange = (date) => {
    setSelectedStartDate(date);
    const cb = onChangeStartDate || onSelectedChange; // <-- support both
    if (typeof cb === 'function') cb(date);
  };

  return (
    <View style={styles.centeredView}>
      <View style={styles.modalView}>
        <DatePicker
          mode="datepicker"
          minimumDate={startDate}
          style={{ width: SIZES.width - 32, borderRadius: 12, paddingBottom: 0 }}
          selected={selectedStartDate}
          onSelectedChange={handleDateChange}  // <-- library prop
          options={{
            backgroundColor: COLORS.primary,
            textHeaderColor: COLORS.white,
            textDefaultColor: '#FFFFFF',
            selectedTextColor: COLORS.primary,
            mainColor: COLORS.white,
            textSecondaryColor: '#FFFFFF',
            borderColor: COLORS.primary,
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: { alignItems: 'center', justifyContent: 'center' },
  modalView: { alignItems: 'center', justifyContent: 'center' },
});

export default DatePickerView;

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Platform,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import Header from '../../../../components/Header';
import { Picker } from '@react-native-picker/picker';
import ApiService from '../../../../src/api/ApiService';
import { ENDPOINTS } from '../../../../src/constants/Endpoints';

import { useDispatch } from 'react-redux';
import { showLoader, hideLoader } from '../../../../src/redux/slices/loaderSlice';

import DatePicker from 'react-native-date-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

/* ---------------- INPUT ---------------- */

const GradientInput = ({ label, value, onChange, keyboardType }) => (
  <View style={styles.fieldContainer}>
    <Text style={styles.fieldLabel}>{label}</Text>

    <LinearGradient colors={['#0F2027', '#203A43', '#2C5364']} style={styles.inputGradient}>
      <TextInput
        value={value}
        onChangeText={onChange}
        keyboardType={keyboardType || 'default'}
        style={styles.fieldInput}
        placeholder={`Enter ${label}`}
        placeholderTextColor="#7A8C99"
      />
    </LinearGradient>
  </View>
);

/* ---------------- DATE ---------------- */

const DateInput = ({ label, value, onPress }) => (
  <View style={styles.fieldContainer}>
    <Text style={styles.fieldLabel}>{label}</Text>

    <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
      <LinearGradient colors={['#0F2027', '#203A43', '#2C5364']} style={styles.inputGradient}>
        <View style={styles.dateInputInner}>
          <Text style={[styles.dateText, !value && { color: '#7A8C99' }]}>
            {value || `Select ${label}`}
          </Text>

          <MaterialCommunityIcons name="calendar-month-outline" size={20} color="#11998E" />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  </View>
);

/* ---------------- TOGGLE ---------------- */

const Toggle = ({ label, options, value, onChange }) => (
  <View style={styles.fieldContainer}>
    <Text style={styles.fieldLabel}>{label}</Text>

    <View style={styles.toggleRow}>
      {options.map(item => {
        const active = value === item;

        return (
          <TouchableOpacity key={item} onPress={() => onChange(item)} style={styles.toggleOuter}>
            <LinearGradient
              colors={active ? ['#11998E', '#38EF7D'] : ['#EEF2F7', '#E2E8F0']}
              style={styles.toggleBtn}
            >
              <Text style={[styles.toggleText, active && { color: '#000', fontWeight: '700' }]}>
                {item}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        );
      })}
    </View>
  </View>
);

/* ---------------- MAIN ---------------- */

const IPD = ({ navigation }) => {
  const dispatch = useDispatch();

  const [showForm, setShowForm] = useState(false);
  const [bookedList, setBookedList] = useState([]);

  const [date, setDate] = useState(new Date());
  const [openDate, setOpenDate] = useState(false);

  const [form, setForm] = useState({
    hospital_name: '',
    doctor_name: '',
    surgery_name: '',
    tentative_estimate: '',
    tentative_date_of_surgery: '',
    surgery_done: 'No',
    final_payment: '',
    payment_mode: 'cash',
    payment_method: '',
    patient_name: '',
    patient_gender: 'Male',
    patient_age: '',
    reason_for_visit: '',
  });

  const update = (key, value) =>
    setForm(prev => ({ ...prev, [key]: value }));

  /* ---------------- GET API ---------------- */

  const fetchBooked = async () => {
    try {
      dispatch(showLoader());

      const res = await ApiService.get(
        ENDPOINTS.patient_get_book_ipd_appointments
      );
console.log('get api response===',res)
      if (res?.status === 'success') {
        setBookedList(res.data || []);
      }
    } catch (e) {
      console.log(e);
    } finally {
      dispatch(hideLoader());
    }
  };

  useEffect(() => {
    fetchBooked();
  }, []);

  /* ---------------- SAVE ---------------- */

  const onSave = async () => {
    if (!form.hospital_name.trim())
      return Alert.alert('Validation', 'Hospital name required');

    if (!form.patient_name.trim())
      return Alert.alert('Validation', 'Patient name required');

    if (!form.tentative_date_of_surgery)
      return Alert.alert('Validation', 'Select surgery date');

    const payload = {
      hospital_name: form.hospital_name,
      doctor_name: form.doctor_name,
      surgery_name: form.surgery_name,
      tentative_estimate: Number(form.tentative_estimate || 0),
      tentative_date_of_surgery: form.tentative_date_of_surgery,
      surgery_done: form.surgery_done,
      final_payment: Number(form.final_payment || 0),
       payment_mode: form.payment_mode,        // 'cash' or 'cashless'
  payment_method: form.payment_method, 
      patient_name: form.patient_name,
      patient_gender: form.patient_gender,
      patient_age: Number(form.patient_age || 0),
      reason_for_visit: form.reason_for_visit,
    };

   try {
  dispatch(showLoader());

  const res = await ApiService.post(
    ENDPOINTS.patient_book_ipd_appointment,
    payload,
    true,
    false
  );

 Alert.alert('Success', res.message);

fetchBooked(); // refresh list

// Reset form first
setForm({
  hospital_name: '',
  doctor_name: '',
  surgery_name: '',
  tentative_estimate: '',
  tentative_date_of_surgery: '',
  surgery_done: 'No',
  final_payment: '',
  payment_mode: 'cash',
  payment_method: '',
  patient_name: '',
  patient_gender: 'Male',
  patient_age: '',
  reason_for_visit: '',
});

setShowForm(false); // then close form
   } catch (e) {
     console.log(e);
     Alert.alert('Error', e.message || 'Something went wrong');
   } finally {
     dispatch(hideLoader());
   }
  }


  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar backgroundColor="#FFF" barStyle="dark-content" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={80}
      >
        <Header title="IPD Registration" onBackPress={() => navigation.goBack()} />

        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ padding: 14, paddingBottom: 140 }}
        >
          <TouchableOpacity onPress={() => setShowForm(!showForm)}>
            <LinearGradient colors={['#11998E', '#38EF7D']} style={styles.saveGradient}>
              <Text style={styles.saveText}>
                {showForm ? 'Close Form' : 'Add IPD Details'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {showForm && (
            <View style={styles.card}>

              <GradientInput label="Hospital Name" value={form.hospital_name} onChange={v => update('hospital_name', v)} />
              <GradientInput label="Doctor Name" value={form.doctor_name} onChange={v => update('doctor_name', v)} />
              <GradientInput label="Surgery Name" value={form.surgery_name} onChange={v => update('surgery_name', v)} />

              <GradientInput label="Tentative Estimate" value={form.tentative_estimate} keyboardType="numeric" onChange={v => update('tentative_estimate', v)} />

              <DateInput
                label="Tentative Date Of Surgery"
                value={form.tentative_date_of_surgery}
                onPress={() => setOpenDate(true)}
              />

              <Toggle
                label="Surgery Done"
                options={['Yes', 'No']}
                value={form.surgery_done}
                onChange={v => update('surgery_done', v)}
              />

              <GradientInput label="Final Payment" value={form.final_payment} keyboardType="numeric" onChange={v => update('final_payment', v)} />
<Toggle
  label="Payment Mode"
  options={['cash', 'cashless']}
  value={form.payment_mode}
  onChange={v => {
    update('payment_mode', v);
    if (v === 'cash') update('payment_method', ''); // reset if cash
  }}
/>

{form.payment_mode === 'cashless' && (
  <Toggle
    label="Payment Method"
    options={[
      'Ayushman',
      'CGHS',
      'ECHS',
      'TPA',
      'Health Insurance',
      'Other Government Scheme',
    ]}
    value={form.payment_method}
    onChange={v => update('payment_method', v)}
  />
)}








              <GradientInput label="Patient Name" value={form.patient_name} onChange={v => update('patient_name', v)} />

              <Toggle
                label="Patient Gender"
                options={['Male', 'Female', 'Other']}
                value={form.patient_gender}
                onChange={v => update('patient_gender', v)}
              />

              <GradientInput label="Patient Age" value={form.patient_age} keyboardType="numeric" onChange={v => update('patient_age', v)} />

              <GradientInput label="Reason For Visit" value={form.reason_for_visit} onChange={v => update('reason_for_visit', v)} />

              <TouchableOpacity style={{ marginTop: 20 }} onPress={onSave}>
                <LinearGradient colors={['#11998E', '#38EF7D']} style={styles.saveGradient}>
                  <Text style={styles.saveText}>SAVE DETAILS</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}

          {bookedList.map(item => (
  <View key={item._id} style={styles.apptCard}>

    <View style={styles.cardHeader}>
      <Text style={styles.surgeryName}>{item.surgery_name}</Text>

      <View style={[
        styles.statusBadge,
        { backgroundColor: item.status === 'scheduled' ? '#DCFCE7' : '#F1F5F9' }
      ]}>
        <Text style={[
          styles.statusText,
          { color: item.status === 'scheduled' ? '#166534' : '#475569' }
        ]}>
          {item.status}
        </Text>
      </View>
    </View>

    <Text style={styles.hospital}>{item.hospital_name}</Text>
    <Text style={styles.doctor}>👨‍⚕️ {item.doctor_name}</Text>

    <View style={styles.row}>
      <Text style={styles.label}>Patient</Text>
      <Text style={styles.value}>
        {item.patient_name} • {item.patient_age} yrs • {item.patient_gender}
      </Text>
    </View>

    <View style={styles.row}>
      <Text style={styles.label}>Surgery Date</Text>
      <Text style={styles.value}>{item.tentative_date_of_surgery}</Text>
    </View>

    <View style={styles.row}>
      <Text style={styles.label}>Estimate</Text>
      <Text style={styles.value}>₹ {item.tentative_estimate}</Text>
    </View>

    <View style={styles.row}>
      <Text style={styles.label}>Final Payment</Text>
      <Text style={styles.value}>₹ {item.final_payment}</Text>
    </View>

    <View style={styles.row}>
      <Text style={styles.label}>Payment</Text>
      <Text style={styles.value}>
        {item.payment_mode}
        {item.payment_method ? ` • ${item.payment_method}` : ''}
      </Text>
    </View>

    <View style={styles.row}>
      <Text style={styles.label}>Payment Status</Text>
      <Text style={[
        styles.value,
        { color: item.payment_status === 'unpaid' ? '#DC2626' : '#16A34A' }
      ]}>
        {item.payment_status}
      </Text>
    </View>

  </View>
))}

        </ScrollView>

     <DatePicker
  modal
  open={openDate}
  date={date}
  mode="date"
  minimumDate={new Date()} // past dates disable
  onConfirm={(d) => {
    setOpenDate(false);
    setDate(d);

    const formatted =
      d.getFullYear() +
      '-' +
      String(d.getMonth() + 1).padStart(2, '0') +
      '-' +
      String(d.getDate()).padStart(2, '0');

    update('tentative_date_of_surgery', formatted);
  }}
  onCancel={() => setOpenDate(false)}
/>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default IPD;

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFF' },

  card: {
    backgroundColor: '#FFF',
    borderRadius: 18,
    padding: 16,
    marginTop: 16,
  },

  fieldContainer: { marginBottom: 14 },
  fieldLabel: { fontSize: 12, marginBottom: 6 },

  inputGradient: { borderRadius: 12, padding: 1.2 },
  fieldInput: {
    backgroundColor: '#FFF',
    borderRadius: 11,
    height: 46,
    paddingHorizontal: 12,
  },

  dateInputInner: {
    backgroundColor: '#FFF',
    borderRadius: 11,
    height: 46,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  dateText: { fontSize: 14 },

  saveGradient: {
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },

  saveText: { fontWeight: '800', color: '#000' },

  listCard: {
    backgroundColor: '#F1F5F9',
    marginTop: 14,
    padding: 12,
    borderRadius: 12,
  },

  listTitle: { fontWeight: '700' },
  listSub: { color: '#64748B', marginTop: 2 },

  toggleRow: { flexDirection: 'row', flexWrap: 'wrap' },
  toggleOuter: { marginRight: 8, marginBottom: 8 },
  toggleBtn: {
    height: 36,
    borderRadius: 10,
    paddingHorizontal: 14,
    justifyContent: 'center',
  },
  apptCard: {
  backgroundColor: '#FFFFFF',
  borderRadius: 16,
  padding: 14,
  marginTop: 14,

  shadowColor: '#000',
  shadowOpacity: 0.06,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 3 },
  elevation: 3,
},

cardHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
},

surgeryName: {
  fontSize: 15,
  fontWeight: '700',
  flex: 1,
  paddingRight: 8,
},

hospital: {
  fontSize: 13,
  color: '#0F172A',
  marginTop: 4,
  fontWeight: '600',
},

doctor: {
  fontSize: 12,
  color: '#475569',
  marginTop: 2,
  marginBottom: 8,
},

row: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: 4,
},

label: {
  fontSize: 12,
  color: '#64748B',
},

value: {
  fontSize: 12,
  fontWeight: '600',
  color: '#0F172A',
},

statusBadge: {
  paddingHorizontal: 10,
  paddingVertical: 4,
  borderRadius: 20,
},

statusText: {
  fontSize: 11,
  fontWeight: '700',
  textTransform: 'capitalize',
},

});

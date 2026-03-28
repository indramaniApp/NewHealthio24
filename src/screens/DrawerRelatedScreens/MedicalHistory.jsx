import React, { useState, memo, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  Modal,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '../../../components/Header';

import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import * as DocumentPicker from '@react-native-documents/picker';
import { Picker } from '@react-native-picker/picker';

import ApiService from '../../../src/api/ApiService';
import { ENDPOINTS } from '../../../src/constants/Endpoints';
import { useDispatch } from 'react-redux';
import { showLoader, hideLoader } from '../../../src/redux/slices/loaderSlice';

const DRAWER_TEAL_ICON = '#00897B';
const DRAWER_TEAL_GRADIENT = ['#E0F2F1', '#B2DFDB'];

/* ---------------- INPUT ---------------- */
const DetailRow = ({ icon, label, value }) => (
  <View style={styles.detailRow}>
    <MaterialCommunityIcons
      name={icon}
      size={18}
      color={DRAWER_TEAL_ICON}
      style={{ marginRight: 10 }}
    />

    <Text style={styles.detailLabel}>
      {label} : <Text style={styles.detailValue}>{value || 'N/A'}</Text>
    </Text>
  </View>
);


const InputBox = memo(
  ({ label, icon, placeholder, value, onChangeText, multiline }) => (
    <View style={{ marginTop: 14 }}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputWrapper}>
        <MaterialCommunityIcons name={icon} size={22} color={DRAWER_TEAL_ICON} />
        <TextInput
          style={[
            styles.input,
            multiline && { height: 90, textAlignVertical: 'top' },
          ]}
          placeholder={placeholder}
          placeholderTextColor="#9aa3b2"
          value={value}
          onChangeText={onChangeText}
          multiline={multiline}
        />
      </View>
    </View>
  )
);

/* ---------------- UPLOAD BOX ---------------- */

const UploadBox = ({ label, file, onPress }) => (
  <View style={{ marginTop: 14 }}>
    <TouchableOpacity onPress={onPress}>
      <LinearGradient colors={DRAWER_TEAL_GRADIENT} style={styles.uploadBtn}>
        <MaterialCommunityIcons
          name={file ? 'check-circle' : 'upload'}
          size={22}
          color={file ? '#22c55e' : DRAWER_TEAL_ICON}
        />
        <Text style={[styles.uploadText, { color: DRAWER_TEAL_ICON }]}>
          {file ? `${label} Selected` : label}
        </Text>
      </LinearGradient>
    </TouchableOpacity>

    {file?.uri && file?.type !== 'application/pdf' && (
      <Image source={{ uri: file.uri }} style={styles.previewImage} />
    )}

    {file?.type === 'application/pdf' && (
      <View style={styles.pdfPreview}>
        <MaterialCommunityIcons name="file-pdf-box" size={32} color="#ef4444" />
        <Text style={styles.pdfText}>{file.name}</Text>
      </View>
    )}
  </View>
);

/* ---------------- MAIN ---------------- */

const MedicalHistory = ({ navigation }) => {
  const dispatch = useDispatch();

  const [showForm, setShowForm] = useState(false);
  const [medicalData, setMedicalData] = useState(null);

  const [medicalHistory, setMedicalHistory] = useState('');
  const [currentMedications, setCurrentMedications] = useState('');
  const [allergies, setAllergies] = useState('');
  const [chronicConditions, setChronicConditions] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');

  const [upload1, setUpload1] = useState(null);
  const [upload2, setUpload2] = useState(null);
  const [upload3, setUpload3] = useState(null);
  const [upload4, setUpload4] = useState(null);

  const [activeSetter, setActiveSetter] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  /* ---------------- GET API ---------------- */

  const fetchMedicalHistory = async () => {
    try {
      dispatch(showLoader());
      const res = await ApiService.get(ENDPOINTS.patient_medical_history_get);
      console.log('resss---====',res)
      if (res?.status === 'success') {
        setMedicalData(res.data);
      }
    } catch (e) {
      console.log(e);
    } finally {
      dispatch(hideLoader());
    }
  };

  useEffect(() => {
    fetchMedicalHistory();
  }, []);

  /* ---------------- FILE PICKING ---------------- */

  const openUploadModal = setter => {
    setActiveSetter(() => setter);
    setModalVisible(true);
  };

  const pickFromGallery = () => {
    setModalVisible(false);
    launchImageLibrary({ mediaType: 'photo' }, res => {
      if (!res.didCancel && !res.errorCode) {
        activeSetter(res.assets[0]);
      }
    });
  };

  const pickFromCamera = () => {
    setModalVisible(false);
    launchCamera({ mediaType: 'photo' }, res => {
      if (!res.didCancel && !res.errorCode) {
        activeSetter(res.assets[0]);
      }
    });
  };

  const pickPDF = async () => {
    setModalVisible(false);
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });
      activeSetter(res[0]);
    } catch (e) {}
  };

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = async () => {
    if (!medicalHistory.trim()) {
      Alert.alert('Validation', 'Medical history required');
      return;
    }

    const formData = new FormData();
    formData.append('medicalHistory', medicalHistory);
    formData.append('currentMedications', currentMedications);
    formData.append('allergies', allergies);
    formData.append('chronicConditions', chronicConditions);
    formData.append('bloodGroup', bloodGroup);

    const appendFile = (key, file) => {
      if (file?.uri) {
        formData.append(key, {
          uri: file.uri,
          name: file.name || file.uri.split('/').pop(),
          type:
            file.type ||
            (file.uri.endsWith('.pdf')
              ? 'application/pdf'
              : 'image/jpeg'),
        });
      }
    };

    appendFile('medicalHistoryUpload', upload1);
    appendFile('medicalHistoryUploadSecond', upload2);
    appendFile('medicalHistoryUploadThird', upload3);
    appendFile('medicalHistoryUploadFourth', upload4);

    try {
      dispatch(showLoader());
      const res = await ApiService.post(
        ENDPOINTS.patient_medical_history_add,
        formData,
        true,
        true
      );

      if (res?.status === 'success') {
        Alert.alert('Success', res.message);
        fetchMedicalHistory();
        setShowForm(false);
      } else {
        Alert.alert('Failed', res.message);
      }
    } catch {
      Alert.alert('Error', 'Server error');
    } finally {
      dispatch(hideLoader());
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#F48FB1" barStyle="light-content" />
      <Header title="Medical History" onBackPress={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 140 }}>

        {/* BUTTON */}
        <TouchableOpacity onPress={() => setShowForm(!showForm)}>
          <LinearGradient colors={[DRAWER_TEAL_ICON, '#00695C']} style={styles.submitBtn}>
            <Text style={styles.submitText}>
              {showForm ? 'Close Form' : 'Add Medical History'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* FORM */}
        {showForm && (
          <View style={[styles.card, { marginTop: 16 }]}>

            <InputBox
              label="Medical History"
              icon="file-document"
              placeholder="Enter medical history"
              value={medicalHistory}
              onChangeText={setMedicalHistory}
              multiline
            />

            <InputBox
              label="Current Medications"
              icon="pill"
              placeholder="Enter medicines"
              value={currentMedications}
              onChangeText={setCurrentMedications}
            />

            <InputBox
              label="Allergies"
              icon="alert-circle"
              placeholder="Enter allergies"
              value={allergies}
              onChangeText={setAllergies}
            />

            <InputBox
              label="Chronic Conditions"
              icon="heart-pulse"
              placeholder="Enter chronic conditions"
              value={chronicConditions}
              onChangeText={setChronicConditions}
            />

            <Text style={styles.label}>Blood Group</Text>
            <View style={styles.dropdownWrapper}>
              <MaterialCommunityIcons name="water" size={22} color={DRAWER_TEAL_ICON} />
              <Picker selectedValue={bloodGroup} onValueChange={setBloodGroup} style={{ flex: 1 }}>
                <Picker.Item label="Select Blood Group" value="" />
                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                  <Picker.Item key={bg} label={bg} value={bg} />
                ))}
              </Picker>
            </View>

            <UploadBox label="Upload Medical File 1" file={upload1} onPress={() => openUploadModal(setUpload1)} />
            <UploadBox label="Upload Medical File 2" file={upload2} onPress={() => openUploadModal(setUpload2)} />
            <UploadBox label="Upload Medical File 3" file={upload3} onPress={() => openUploadModal(setUpload3)} />
            <UploadBox label="Upload Medical File 4" file={upload4} onPress={() => openUploadModal(setUpload4)} />

            <TouchableOpacity onPress={handleSubmit}>
              <LinearGradient colors={[DRAWER_TEAL_ICON, '#00695C']} style={styles.submitBtn}>
                <Text style={styles.submitText}>Submit Medical History</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        {/* DETAILS */}
      {medicalData && (
  <LinearGradient
    colors={['#E0F2F1', '#FFFFFF']}
    style={styles.detailsCard}
  >
    <View style={styles.detailsHeader}>
      <MaterialCommunityIcons
        name="clipboard-text-outline"
        size={22}
        color={DRAWER_TEAL_ICON}
      />
      <Text style={styles.detailsTitle}>Saved Medical History</Text>
    </View>

   <View style={styles.card}>

  <DetailRow
    label="Blood Group"
    value={medicalData?.bloodGroup}
    icon="water"
  />

  <DetailRow
    label="Medical History"
    value={medicalData?.medicalHistory?.join(', ')}
    icon="file-document"
  />

  <DetailRow
    label="Current Medications"
    value={medicalData?.currentMedications?.join(', ')}
    icon="pill"
  />

  <DetailRow
    label="Allergies"
    value={medicalData?.allergies?.join(', ')}
    icon="alert-circle"
  />

  <DetailRow
    label="Chronic Conditions"
    value={medicalData?.chronicConditions?.join(', ')}
    icon="heart-pulse"
  />

  {/* IMAGE GRID */}
<View style={styles.imageGrid}>

  {medicalData?.medicalHistoryUpload && (
    <View style={styles.imageItem}>
      <Text style={styles.imageLabel}>Medical Document</Text>
      <Image
        source={{ uri: medicalData.medicalHistoryUpload }}
        style={styles.smallImage}
      />
    </View>
  )}

  {medicalData?.medicalHistoryUploadSecond && (
    <View style={styles.imageItem}>
      <Text style={styles.imageLabel}>Prescription</Text>
      <Image
        source={{ uri: medicalData.medicalHistoryUploadSecond }}
        style={styles.smallImage}
      />
    </View>
  )}

  {medicalData?.medicalHistoryUploadThird && (
    <View style={styles.imageItem}>
      <Text style={styles.imageLabel}>Lab Report</Text>
      <Image
        source={{ uri: medicalData.medicalHistoryUploadThird }}
        style={styles.smallImage}
      />
    </View>
  )}

  {medicalData?.medicalHistoryUploadFourth && (
    <View style={styles.imageItem}>
      <Text style={styles.imageLabel}>Other Record</Text>
      <Image
        source={{ uri: medicalData.medicalHistoryUploadFourth }}
        style={styles.smallImage}
      />
    </View>
  )}

</View>

</View>


  </LinearGradient>
)}

      </ScrollView>

      {/* MODAL */}
      <Modal transparent visible={modalVisible} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <TouchableOpacity style={styles.modalBtn} onPress={pickFromGallery}>
              <Text>Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalBtn} onPress={pickFromCamera}>
              <Text>Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalBtn} onPress={pickPDF}>
              <Text>PDF</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={{ color: 'red' }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default MedicalHistory;


const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  card: { backgroundColor: '#fff', borderRadius: 20, padding: 18, elevation: 5 },
  sectionTitle: { fontSize: 16, fontWeight: '700' },
  label: { fontSize: 13, fontWeight: '600', color: '#475569', marginBottom: 6, marginTop: 14 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f6f8fc',
    borderRadius: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  input: { flex: 1, paddingVertical: 12, paddingLeft: 8, fontSize: 14, color: '#111827' },
  dropdownWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f6f8fc',
    borderRadius: 14,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  uploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#B2DFDB', // Matches Drawer circle border
    borderStyle: 'dashed',
  },
  uploadText: { marginLeft: 8, fontWeight: '600' },
  previewImage: { width: '100%', height: 160, borderRadius: 12, marginTop: 8 },
  pdfPreview: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  pdfText: { marginLeft: 8, fontWeight: '600', color: '#ef4444' },
  submitBtn: { marginTop: 28, paddingVertical: 16, borderRadius: 18, alignItems: 'center', elevation: 4 },
  submitText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalBox: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 },
  modalTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12 },
  modalBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  modalText: { marginLeft: 12, fontSize: 15 },
  cancelText: { textAlign: 'center', marginTop: 12, color: '#ef4444', fontWeight: '700' },
  detailsCard: {
  marginTop: 18,
  borderRadius: 18,
  padding: 16,
  elevation: 4,
},

detailsHeader: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 10,
},

detailsTitle: {
  marginLeft: 8,
  fontSize: 15,
  fontWeight: '700',
  color: DRAWER_TEAL_ICON,
},

detailRow: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 6,
},

detailIconBox: {
  width: 32,
  height: 32,
  borderRadius: 10,
  backgroundColor: '#E0F2F1',
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: 10,
},

detailLabel: {
  fontSize: 14,
  color: '#444',
  fontWeight: '500',
},

detailValue: {
  fontWeight: '400',
  color: '#000',
},
imageGrid: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  marginTop: 12,
},

imageItem: {
  width: '48%',          // ⭐ IMPORTANT → 2 per row
  marginBottom: 14,
},

imageLabel: {
  fontSize: 12,
  fontWeight: '600',
  color: '#475569',
  marginBottom: 6,
},

smallImage: {
  width: '100%',
  height: 95,
  borderRadius: 16,
  backgroundColor: '#E0F2F1',
  elevation: 3,
}


});
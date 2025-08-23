import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, Linking } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES, icons, images } from '../../constants';
import { ToastAndroid } from 'react-native';
import { ScrollView } from 'react-native-virtualized-view';
import { PermissionsAndroid, Platform } from 'react-native'
import { useTheme } from '../../theme/ThemeProvider';
import Header from '../../components/Header';
import Button from '../../components/Button';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNFS from 'react-native-fs';


import FileViewer from 'react-native-file-viewer';
import { useDispatch } from 'react-redux';
import { hideLoader, showLoader } from '../redux/slices/loaderSlice';

const PrescriptionPDF = ({ navigation, route }) => {
  const dispatch = useDispatch();
  console.log('========routeData=======', route.params)

  const {
    doctor_name,
    doctor_address,
    doctor_city,
    doctor_clinic_hospital_name,
    doctor_picture,
    doctor_signature,
    doctor_specialization,
    date,
    diagnosis,
    notes,
    symptoms,
    vitals,
    medicalHistory,
    advisedInvestigations,
    followUpDate,
    followUpNotes,
    medicines,

    // Add any more you need here...
  } = route.params;
  const { dark } = useTheme();

  const getBase64Image = async (uri) => {
    try {
      // Specify the local file path where the image will be saved
      const localFilePath = `${RNFS.CachesDirectoryPath}/${uri.split('/').pop()}`;

      // Download the image to the local file system
      await RNFS.downloadFile({
        fromUrl: uri,
        toFile: localFilePath,
      }).promise;

      // Convert the downloaded file to Base64
      const base64String = await RNFS.readFile(localFilePath, 'base64');
      return `data:image/png;base64,${base64String}`;
    } catch (error) {
      console.error('Error downloading or converting image to base64', error);
      return '';  // Return empty string in case of error
    }
  };









  const generatePDF = async () => {
    
    let base64Signature = '';
    let base64Picture = '';
    dispatch(showLoader());

    try {
      if (doctor_signature) {
        base64Signature = await getBase64Image(doctor_signature);
      }
      if (doctor_picture) {
        base64Picture = await getBase64Image(doctor_picture);
      }
      dispatch(hideLoader());
    } catch (error) {
      console.error("Error converting image to base64", error);
      dispatch(hideLoader());
    }

    const html = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h1 { color: #333; }
          .section { margin-bottom: 20px; }
          .med { margin-left: 20px; }
          img.signature { width: 150px; margin-top: 20px; }
          img.picture { width: 100px; height: 100px; border-radius: 50%; margin-bottom: 20px; }
        </style>
      </head>
      <body>
        <h1>Prescription Summary</h1>

        ${base64Picture ? `<img class="picture" src="${base64Picture}" />` : ''}

        <div class="section">
          <p><strong>Doctor:</strong> Dr. ${doctor_name}</p>
          <p><strong>Specialization:</strong> ${doctor_specialization}</p>
          <p><strong>Clinic:</strong> ${doctor_clinic_hospital_name}</p>
          <p><strong>Address:</strong> ${doctor_address}, ${doctor_city}</p>
          <p><strong>Date:</strong> ${date}</p>
        </div>

        <div class="section">
          <p><strong>Diagnosis:</strong></p>
          <ul>
            ${(diagnosis || []).map(d => `<li>${d}</li>`).join('')}
          </ul>
        </div>

        <div class="section">
          <p><strong>Notes:</strong></p>
          <ul>
            ${(notes || []).map(n => `<li>${n}</li>`).join('')}
          </ul>
        </div>

        <div class="section">
          <p><strong>Medicines:</strong></p>
          <ul>
            ${(medicines || []).map(m => `
              <li class="med">
                <strong>${m.medicineName}</strong> - ${m.medicineType}, ${m.dosage}, ${m.frequency}, ${m.duration}<br/>
                <em>${m.instructions} • ${m.route}</em>
              </li>
            `).join('')}
          </ul>
        </div>

        ${base64Signature ? `
          <div class="section">
            <p><strong>Doctor's Signature:</strong></p>
            <img class="signature" src="${base64Signature}" />
          </div>
        ` : ''}
      </body>
    </html>
  `;

    const options = {
      html,
      fileName: 'Prescription_Summary',
      directory: "download"
    };

    try {
      const file = await RNHTMLtoPDF.convert(options);
      FileViewer.open(file.filePath)
        .then(() => console.log('PDF opened successfully'))
        .catch(error => console.log('Error opening PDF:', error));

      ToastAndroid.show(`PDF saved at:\n${file.filePath}`, ToastAndroid.LONG);
      Alert.alert("PDF Generated", `Your PDF has been saved successfully.\n\nPath:\n${file.filePath}`);
    } catch (error) {
      console.error("PDF error", error);
      Alert.alert("Error", "Failed to generate or share PDF.");
    }
  };



  return (
    <SafeAreaView style={[styles.area, {
      backgroundColor: dark ? COLORS.dark1 : COLORS.tertiaryWhite
    }]}>
      <View style={[styles.container, {
        backgroundColor: dark ? COLORS.dark1 : COLORS.tertiaryWhite
      }]}>
        <Header title="Prescription Summary" 
                onBackPress={() => navigation.goBack()}

        />
        <ScrollView showsVerticalScrollIndicator={false}>

          <View style={{
            backgroundColor: dark ? COLORS.dark1 : COLORS.tertiaryWhite,
            marginTop: 22
          }}>
            <View style={[styles.doctorCard, {
              backgroundColor: dark ? COLORS.dark2 : COLORS.white,
            }]}>
              <Image
                source={{ uri: doctor_picture }}
                resizeMode='contain'
                style={styles.doctorImage}
              />
              <View>
                <Text style={[styles.doctorName, {
                  color: dark ? COLORS.white : COLORS.greyscale900
                }]}> {doctor_name} </Text>
                <View style={[styles.separateLine, {
                  backgroundColor: dark ? COLORS.grayscale700 : COLORS.grayscale200,
                }]} />
                <Text style={[styles.doctorSpeciality, {
                  color: dark ? COLORS.grayscale400 : COLORS.greyScale800
                }]}> {doctor_specialization} </Text>
                <Text style={[styles.doctorSpeciality, {
                  color: dark ? COLORS.grayscale400 : COLORS.greyScale800
                }]}> {doctor_clinic_hospital_name} </Text>
                <Text style={[styles.doctorHospital, {
                  color: dark ? COLORS.grayscale400 : COLORS.greyScale800
                }]}> {doctor_address}, {doctor_city} </Text>
              </View>
            </View>
          </View>


          {/* Patient Review Summary Details */}
          <View style={{ marginTop: 16 }}>
            {/* General Sections */}
            {[
              { title: 'Diagnosis', data: diagnosis || [] },
              { title: 'Notes', data: notes || [] },
              { title: 'Symptoms', data: symptoms || [] },
              { title: 'Vitals', data: vitals || [] },
              { title: 'Medical History', data: medicalHistory || [] },
              { title: 'Advised Investigations', data: advisedInvestigations || [] },
              { title: 'Prescription Date', data: date ? [date] : [] },
              { title: 'Follow-Up Date', data: followUpDate ? [followUpDate] : [] },
              { title: 'Follow-Up Notes', data: followUpNotes || [] },
            ].map((section, index) => (
              section.data.length > 0 && (
                <View key={index} style={[styles.summaryContainer, {
                  backgroundColor: dark ? COLORS.dark2 : COLORS.white,
                }]}>
                  <Text style={[styles.viewLeft, {
                    marginBottom: 8,
                    color: dark ? COLORS.white : COLORS.greyscale900,
                    fontSize: 16,
                    fontFamily: 'Urbanist Bold',
                  }]}>{section.title}</Text>
                  {section.data.map((item, idx) => (
                    <Text
                      key={idx}
                      style={[styles.viewRight, {
                        color: dark ? COLORS.grayscale400 : COLORS.grayscale700,
                        marginVertical: 2,
                      }]}
                    >• {item}</Text>
                  ))}
                </View>
              )
            ))}

            {/* Medicines Section */}
            {medicines && medicines.length > 0 && (
              <View style={[styles.summaryContainer, {
                backgroundColor: dark ? COLORS.dark2 : COLORS.white,
              }]}>
                <Text style={[styles.viewLeft, {
                  marginBottom: 8,
                  color: dark ? COLORS.white : COLORS.greyscale900,
                  fontSize: 16,
                  fontFamily: 'Urbanist Bold',
                }]}>Medicines</Text>

                {medicines.map((med, idx) => (
                  <View key={idx} style={{ marginBottom: 13 }}>
                    <Text style={[styles.viewRight, {
                      color: dark ? COLORS.primary : COLORS.primary,
                      fontSize: 14,
                      fontFamily: 'Urbanist Bold',
                    }]}>{med.medicineName}</Text>
                    <Text style={[styles.viewRight, {
                      color: dark ? COLORS.grayscale400 : COLORS.greyScale800,
                      fontSize: 13,
                    }]}>
                      {med.medicineType} | {med.dosage} | {med.frequency} | {med.duration}
                    </Text>
                    <Text style={[styles.viewRight, {
                      color: dark ? COLORS.grayscale400 : COLORS.greyScale800,
                      fontSize: 14,
                      fontStyle: 'italic'
                    }]}>
                      {med.instructions} • {med.route}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
          {/* Doctor's Signature */}
          {doctor_signature && (
            <View style={[styles.summaryContainer, {
              backgroundColor: dark ? COLORS.dark2 : COLORS.white,
              alignItems: 'flex-start',
              paddingTop: 16,
              marginBottom: 80, // added space from bottom
            }]}>
              <Text style={[styles.viewLeft, {
                marginBottom: 8,
                color: dark ? COLORS.white : COLORS.greyscale900,
                fontSize: 16,
                fontFamily: 'Urbanist Bold',
              }]}>Doctor's Signature</Text>
              <Image
                source={{ uri: doctor_signature }}
                resizeMode='contain'
                style={{
                  width: 150,
                  height: 60,
                }}
              />
            </View>
          )}


        </ScrollView>
        {/* <Button
          title="Continue"
          onPress={() => {}
            
            // navigation.navigate("EnterYourPIN")
          }
          filled
          style={styles.continueBtn}
        /> */}
        <Button
          title="Download PDF"
          onPress={() => {
            console.log("PDF button clicked"); // 👈 Test line
            generatePDF();
          }}
          filled
          style={styles.continueBtn}
        />


      </View>
    </SafeAreaView>
  )
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: COLORS.white
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 16
  },
  btnContainer: {
    width: SIZES.width - 32,
    height: 300,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 28,
    marginBottom: 16,
    backgroundColor: "#FAFAFA"
  },
  premiumIcon: {
    width: 60,
    height: 60,
    tintColor: COLORS.primary
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 12
  },
  price: {
    fontSize: 32,
    fontFamily: "Urbanist Bold",
    color: COLORS.greyscale900
  },
  priceMonth: {
    fontSize: 18,
    fontFamily: "Urbanist Medium",
    color: COLORS.grayscale700,
  },
  premiumItemContainer: {
    marginTop: 16
  },
  premiumItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6
  },
  premiumText: {
    fontSize: 16,
    fontFamily: "Urbanist Medium",
    color: COLORS.greyScale800,
    marginLeft: 24
  },
  summaryContainer: {
    width: SIZES.width - 32,
    borderRadius: 16,
    padding: 16,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 1,
      height: 1
    },
    shadowOpacity: 0.2,
    shadowRadius: 0,
    elevation: 2,
    marginBottom: 12,
    marginTop: 12,
  },
  view: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 12
  },
  viewLeft: {
    fontSize: 14,
    fontFamily: "Urbanist Medium",
    color: COLORS.grayscale700
  },
  viewRight: {
    fontSize: 14,
    fontFamily: "Urbanist SemiBold",
    color: COLORS.greyscale900
  },
  separateLine: {
    width: "100%",
    height: 1,
    backgroundColor: COLORS.grayscale200
  },
  creditCard: {
    width: 44,
    height: 34
  },
  creditCardNum: {
    fontSize: 18,
    fontFamily: "Urbanist Bold",
    color: COLORS.greyscale900,
    marginLeft: 12
  },
  changeBtnText: {
    fontSize: 16,
    fontFamily: "Urbanist Bold",
    color: COLORS.primary
  },
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
    marginBottom: 72,
    width: SIZES.width - 32,
    height: 80,
    borderRadius: 16,
    padding: 16,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 1,
      height: 1
    },
    shadowOpacity: 0.2,
    shadowRadius: 0,
    elevation: 2
  },
  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  continueBtn: {
    borderRadius: 32,
    position: "absolute",
    bottom: 16,
    width: SIZES.width - 32,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    right: 16,
    left: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: "Urbanist Bold",
    color: COLORS.primary,
    textAlign: "center",
    marginVertical: 12
  },
  modalSubtitle: {
    fontSize: 16,
    fontFamily: "Urbanist Regular",
    color: COLORS.black,
    textAlign: "center",
    marginVertical: 12
  },
  modalContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.4)"
  },
  modalSubContainer: {
    height: 520,
    width: SIZES.width * 0.9,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    padding: 16
  },
  modalIllustration: {
    height: 180,
    width: 180,
    marginVertical: 22
  },
  successBtn: {
    width: "100%",
    marginTop: 12,
    borderRadius: 32
  },
  receiptBtn: {
    width: "100%",
    marginTop: 12,
    borderRadius: 32,
    backgroundColor: COLORS.tansparentPrimary,
    borderColor: COLORS.tansparentPrimary
  },
  editPencilIcon: {
    width: 42,
    height: 42,
    tintColor: COLORS.white,
    zIndex: 99999,
    position: "absolute",
    top: 54,
    left: 58,
  },
  backgroundIllustration: {
    height: 150,
    width: 150,
    marginVertical: 22,
    alignItems: "center",
    justifyContent: "center",
    zIndex: -999
  },
  doctorCard: {
    height: 142,
    width: SIZES.width - 32,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    flexDirection: "row",
    alignItems: "center",
  },
  doctorImage: {
    height: 110,
    width: 110,
    borderRadius: 16,
    marginHorizontal: 16
  },
  doctorName: {
    fontSize: 18,
    color: COLORS.greyscale900,
    fontFamily: "Urbanist Bold"
  },
  separateLine: {
    height: 1,
    width: SIZES.width - 32,
    backgroundColor: COLORS.grayscale200,
    marginVertical: 12
  },
  doctorSpeciality: {
    fontSize: 12,
    color: COLORS.greyScale800,
    fontFamily: "Urbanist Medium",
    marginBottom: 8
  },
  doctorHospital: {
    fontSize: 12,
    color: COLORS.greyScale800,
    fontFamily: "Urbanist Medium"
  },
})

export default PrescriptionPDF
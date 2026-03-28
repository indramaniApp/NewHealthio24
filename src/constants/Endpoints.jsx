export const ENDPOINTS = {

  SEND_OTP: 'api/user/verification/send_otp/',
  resend_otp: 'api/user/verification/resend_otp_user/',
  LOGIN: 'api/user/authentication/login',
  patient_get_doctors: 'api/user/patients/patient_get_doctors',
  patient_get_all_doctors: 'api/user/patients/patient_get_all_doctors',
  fcm_token: 'api/user/patients/fcm-token',

  patient_profile: 'api/user/patients/patient_profile',
  patient_book_appointment: 'api/user/patients/patient_book_appointment',
  payment_verify: 'api/user/patients/payment/verify',
  update_profile: 'api/user/patients/patient_update',
patient_medical_history_add: 'api/user/patients/patient_medical_history_add',
patient_medical_history_get: 'api/user/patients/patient_medical_history_get',

patient_book_ipd_appointment: 'api/user/patients/patient_book_ipd_appointment',
patient_get_book_ipd_appointments: 'api/user/patients/patient_get_book_ipd_appointments',

  approved_appointments: 'api/user/patients/approved_appointments',
  approved_appointments_prescription: 'api/user/patients/approved_appointments_prescription_upload',
  patient_get_prescription_upload: 'api/user/patients/patient_get_prescription_upload',
  approved_appointments_prescription_Completed: 'api/user/patients/approved_appointments_prescription',
  patient_get_prescription: 'api/user/patients/patient_get_prescription',
  approved_appointment_with_Id: 'api/user/patients/approved_appointment',
  get_health_record: 'api/user/patients/get_health_record',
  // api fo wallet
  patient_wallet_details: 'api/user/patients/patient_wallet_details',
  patient_add_money_wallet: 'api/user/patients/patient_add_money_wallet',
  wallet_payment_verify: 'api/user/patients/wallet_payment_verify',
  wallet_debit_transactions: 'api/user/patients/wallet_debit_transactions',
  wallet_credit_transactions: 'api/user/patients/wallet_credit_transactions',
  wallet_credit_transaction: 'api/user/patients/wallet_credit_transaction',
  
  //search api

  search_by_Specialization: 'api/user/patients/search',

// video calling apis
patient_approved_video_appointments:'api/user/patients/patient_approved_video_appointments',
patient_complete_video_calling:'api/user/patients/patient_complete_video_calling',
patient_approved_video_appointments_count:'api/user/patients/patient_approved_video_appointments_count',
patient_join_video_calling:'api/user/patients/patient_join_video_calling',

  // get apis for debit recipt

  debit_transaction_appointment: 'api/user/patients/debit_transaction_appointment',
  debit_transactions: 'api/user/patients/debit_transactions',
  wallet_debit_transactions: 'api/user/patients/wallet_debit_transactions',

  //get apis for drawer 

  patient_get_hospitals: 'api/user/patients/patient_get_hospitals',
  patient_get_hospitals_govt_scheme: 'api/user/patients/patient_get_hospitals_govt_scheme',
  patient_get_clinics: 'api/user/patients/patient_get_clinics',
  patient_get_pharmacys: 'api/user/patients/patient_get_pharmacys',
  patient_get_physiotherapys: 'api/user/patients/patient_get_physiotherapys',
  patient_get_patient_mitras: 'api/user/patients/patient_get_patient_mitras',
  patient_get_pathologys: 'api/user/patients/patient_get_pathologys',
  patient_get_dialysises: 'api/user/patients/patient_get_dialysises',
  patient_get_bloodBanks: 'api/user/patients/patient_get_bloodBanks',

  // get apis for categories 
  // patient_get_doctors_women_health: 'api/user/patients/patient_get_doctors_women_health',
  // patient_get_doctors_general_physician: 'api/user/patients/patient_get_doctors_general_physician',
  // patient_get_doctors_dentist: 'api/user/patients/patient_get_doctors_dentist',
  // patient_get_doctors_skin_hair: 'api/user/patients/patient_get_doctors_skin_hair',
  // patient_get_doctors_child_specialist: 'api/user/patients/patient_get_doctors_child_specialist',
  // patient_get_doctors_heart_specialist: 'api/user/patients/patient_get_doctors_heart_specialist',
  // patient_get_doctors_ear_nose_throat: 'api/user/patients/patient_get_doctors_ear_nose_throat',
  // patient_get_doctors_eye_specialist: 'api/user/patients/patient_get_doctors_eye_specialist',
  // patient_get_doctors_stomach_specialist: 'api/user/patients/patient_get_doctors_stomach_specialist',
  // patient_get_doctors_kidney_specialist: 'api/user/patients/patient_get_doctors_kidney_specialist',
  // patient_get_doctors_diabetes_specialist: 'api/user/patients/patient_get_doctors_diabetes_specialist',
  // patient_get_doctors_dietitian: 'api/user/patients/patient_get_doctors_dietitian',
  // patient_get_doctors_nutritionist: 'api/user/patients/patient_get_doctors_nutritionist',
  // patient_get_doctors_bones_joints: 'api/user/patients/patient_get_doctors_bones_joints',
  // patient_get_doctors_neuro_surgeon: 'api/user/patients/patient_get_doctors_neuro_surgeon',
  // patient_get_doctors_ent_surgeon: 'api/user/patients/patient_get_doctors_ent_surgeon',
  // patient_get_doctors_lungs_specialist: 'api/user/patients/patient_get_doctors_lungs_specialist',
  // patient_get_doctors_brain_specialist: 'api/user/patients/patient_get_doctors_brain_specialist',
  // patient_get_doctors_mental_health: 'api/user/patients/patient_get_doctors_mental_health',
  // patient_get_doctors_cancer_specialist: 'api/user/patients/patient_get_doctors_cancer_specialist',
  // patient_get_doctors_liver_specialist: 'api/user/patients/patient_get_doctors_liver_specialist',
  // patient_get_doctors_thyroid_specialist: 'api/user/patients/patient_get_doctors_thyroid_specialist',
  // patient_get_doctors_sexual_health: 'api/user/patients/patient_get_doctors_sexual_health',
  // patient_get_doctors_pregnancy_specialist: 'api/user/patients/patient_get_doctors_pregnancy_specialist',
  // patient_get_doctors_ayurveda_specialist: 'api/user/patients/patient_get_doctors_ayurveda_specialist',
  // patient_get_doctors_homeopathy_specialist: 'api/user/patients/patient_get_doctors_homeopathy_specialist',
  // patient_get_doctors_unani_specialist: 'api/user/patients/patient_get_doctors_unani_specialist',
  // patient_get_doctors_general_surgeon: 'api/user/patients/patient_get_doctors_general_surgeon',
  // patient_get_doctors_cardiac_surgeon: 'api/user/patients/patient_get_doctors_cardiac_surgeon',
  // patient_get_doctors_neuro_surgeon: 'api/user/patients/patient_get_doctors_neuro_surgeon',
  // patient_get_doctors_orthopedic_surgeon: 'api/user/patients/patient_get_doctors_orthopedic_surgeon',
  // patient_get_doctors_plastic_surgeon: 'api/user/patients/patient_get_doctors_plastic_surgeon',
  // patient_get_doctors_urologist_surgeon: 'api/user/patients/patient_get_doctors_urologist_surgeon',
  // patient_get_doctors_vascular_surgeon: 'api/user/patients/patient_get_doctors_vascular_surgeon',
  // patient_get_doctors_gynecologist_surgeon: 'api/user/patients/patient_get_doctors_gynecologist_surgeon',
  // patient_get_doctors_oncologist_surgeon: 'api/user/patients/patient_get_doctors_oncologist_surgeon',
  // patient_get_doctors_pediatric_surgeon: 'api/user/patients/patient_get_doctors_pediatric_surgeon',
  // patient_get_doctors_dental_surgeon: 'api/user/patients/patient_get_doctors_dental_surgeon',
  // patient_get_doctors_eye_surgeon: 'api/user/patients/patient_get_doctors_eye_surgeon',
  // patient_get_doctors_cosmetic_surgeon: 'api/user/patients/patient_get_doctors_cosmetic_surgeon',
  // patient_get_doctors_bariatric_surgeon: 'api/user/patients/patient_get_doctors_bariatric_surgeon',
  // patient_get_doctors_maxillofacial_surgeon: 'api/user/patients/patient_get_doctors_maxillofacial_surgeon',
  // patient_get_doctors_urinary_specialist: 'api/user/patients/patient_get_doctors_urinary_specialist',
  // patient_get_doctors_veterinary_doctor: 'api/user/patients/patient_get_doctors_veterinary_doctor',
  // patient_get_doctors_physiotherapist: 'api/user/patients/patient_get_doctors_physiotherapist',
  // patient_get_doctors_gynecologist: 'api/user/patients/patient_get_doctors_gynecologist',
  // patient_get_doctors_pediatrician: 'api/user/patients/patient_get_doctors_pediatrician',
  // patient_get_doctors_cardiologist: 'api/user/patients/patient_get_doctors_cardiologist',
  // patient_get_doctors_dermatologist: 'api/user/patients/patient_get_doctors_dermatologist',
  // patient_get_doctors_neurologist: 'api/user/patients/patient_get_doctors_neurologist',
  // patient_get_doctors_psychiatrist: 'api/user/patients/patient_get_doctors_psychiatrist',

  // get apis for categories new api 
  //  patient_get_doctors_general_physician: 'api/user/patients/patient_get_doctors_general_physician',
  // patient_get_doctors_dentist: 'api/user/patients/patient_get_doctors_dentist',
  // patient_get_doctors_skin_hair: 'api/user/patients/patient_get_doctors_skin_hair',
  // patient_get_doctors_women_health: 'api/user/patients/patient_get_doctors_women_health',
  // patient_get_doctors_child_specialist: 'api/user/patients/patient_get_doctors_child_specialist',
  // patient_get_doctors_heart_specialist: 'api/user/patients/patient_get_doctors_heart_specialist',
  // patient_get_doctors_ear_nose_throat: 'api/user/patients/patient_get_doctors_ear_nose_throat',
  // patient_get_doctors_eye_specialist: 'api/user/patients/patient_get_doctors_eye_specialist',
  // patient_get_doctors_stomach_specialist: 'api/user/patients/patient_get_doctors_stomach_specialist',
  // patient_get_doctors_kidney_specialist: 'api/user/patients/patient_get_doctors_kidney_specialist',
  // patient_get_doctors_diabetes_specialist: 'api/user/patients/patient_get_doctors_diabetes_specialist',
  // patient_get_doctors_dietitian: 'api/user/patients/patient_get_doctors_dietitian',
  // patient_get_doctors_nutritionist: 'api/user/patients/patient_get_doctors_nutritionist',
  // patient_get_doctors_bones_joints: 'api/user/patients/patient_get_doctors_bones_joints',
  // patient_get_doctors_lungs_specialist: 'api/user/patients/patient_get_doctors_lungs_specialist',
  // patient_get_doctors_brain_specialist: 'api/user/patients/patient_get_doctors_brain_specialist',
  // patient_get_doctors_mental_health: 'api/user/patients/patient_get_doctors_mental_health',
  // patient_get_doctors_cancer_specialist: 'api/user/patients/patient_get_doctors_cancer_specialist',
  // patient_get_doctors_liver_specialist: 'api/user/patients/patient_get_doctors_liver_specialist',
  // patient_get_doctors_sexual_health: 'api/user/patients/patient_get_doctors_sexual_health',
  // patient_get_doctors_thyroid_specialist: 'api/user/patients/patient_get_doctors_thyroid_specialist',
  // patient_get_doctors_pregnancy_specialist: 'api/user/patients/patient_get_doctors_pregnancy_specialist',
  // patient_get_doctors_ayurveda_specialist: 'api/user/patients/patient_get_doctors_ayurveda_specialist',
  // patient_get_doctors_homeopathy_specialist: 'api/user/patients/patient_get_doctors_homeopathy_specialist',
  // patient_get_doctors_unani_specialist: 'api/user/patients/patient_get_doctors_unani_specialist',

  // patient_get_doctors_general_surgeon: 'api/user/patients/patient_get_doctors_general_surgeon',
  // patient_get_doctors_cardiac_surgeon: 'api/user/patients/patient_get_doctors_cardiac_surgeon',
  // patient_get_doctors_neuro_surgeon: 'api/user/patients/patient_get_doctors_neuro_surgeon',
  // patient_get_doctors_orthopedic_surgeon: 'api/user/patients/patient_get_doctors_orthopedic_surgeon',
  // patient_get_doctors_plastic_surgeon: 'api/user/patients/patient_get_doctors_plastic_surgeon',
  // patient_get_doctors_urologist_surgeon: 'api/user/patients/patient_get_doctors_urologist_surgeon',
  // patient_get_doctors_vascular_surgeon: 'api/user/patients/patient_get_doctors_vascular_surgeon',
  // patient_get_doctors_ent_surgeon: 'api/user/patients/patient_get_doctors_ent_surgeon',
  // patient_get_doctors_gynecologist_surgeon: 'api/user/patients/patient_get_doctors_gynecologist_surgeon',
  // patient_get_doctors_oncologist_surgeon: 'api/user/patients/patient_get_doctors_oncologist_surgeon',
  // patient_get_doctors_pediatric_surgeon: 'api/user/patients/patient_get_doctors_pediatric_surgeon',
  // patient_get_doctors_dental_surgeon: 'api/user/patients/patient_get_doctors_dental_surgeon',
  // patient_get_doctors_eye_surgeon: 'api/user/patients/patient_get_doctors_eye_surgeon',
  // patient_get_doctors_laparoscopic_surgeon: 'api/user/patients/patient_get_doctors_laparoscopic_surgeon',
  // patient_get_doctors_cosmetic_surgeon: 'api/user/patients/patient_get_doctors_cosmetic_surgeon',
  // patient_get_doctors_bariatric_surgeon: 'api/user/patients/patient_get_doctors_bariatric_surgeon',
  // patient_get_doctors_maxillofacial_surgeon: 'api/user/patients/patient_get_doctors_maxillofacial_surgeon',

  // patient_get_doctors_urinary_specialist: 'api/user/patients/patient_get_doctors_urinary_specialist',
  // patient_get_doctors_veterinary_doctor: 'api/user/patients/patient_get_doctors_veterinary_doctor',
  // patient_get_doctors_physiotherapist: 'api/user/patients/patient_get_doctors_physiotherapist',
  // patient_get_doctors_gynecologist: 'api/user/patients/patient_get_doctors_gynecologist',
  // patient_get_doctors_pediatrician: 'api/user/patients/patient_get_doctors_pediatrician',
  // patient_get_doctors_cardiologist: 'api/user/patients/patient_get_doctors_cardiologist',
  // patient_get_doctors_dermatologist: 'api/user/patients/patient_get_doctors_dermatologist',
  // patient_get_doctors_neurologist: 'api/user/patients/patient_get_doctors_neurologist',
  // patient_get_doctors_psychiatrist: 'api/user/patients/patient_get_doctors_psychiatrist',
  // patient_get_doctors_proctologist: 'api/user/patients/patient_get_doctors_proctologist',
  // patient_get_doctors_colorectal: 'api/user/patients/patient_get_doctors_colorectal',

  //new specialization apis
   patient_get_doctors_general_physician: 'api/user/patients/patient_get_doctors_general_physician',
  patient_get_doctors_general_surgeon: 'api/user/patients/patient_get_doctors_general_surgeon',

  patient_get_doctors_pulmonologist: 'api/user/patients/patient_get_doctors_pulmonologist',
  patient_get_doctors_endocrine_medicine: 'api/user/patients/patient_get_doctors_endocrine_medicine',
  patient_get_doctors_endocrine_surgery: 'api/user/patients/patient_get_doctors_endocrine_surgery',

  patient_get_doctors_cardiologist: 'api/user/patients/patient_get_doctors_cardiologist',
  patient_get_doctors_cardiac_surgeon: 'api/user/patients/patient_get_doctors_cardiac_surgeon',
  patient_get_doctors_cardiac_critical_care: 'api/user/patients/patient_get_doctors_cardiac_critical_care',

  patient_get_doctors_nephrologist: 'api/user/patients/patient_get_doctors_nephrologist',
  patient_get_doctors_urologist: 'api/user/patients/patient_get_doctors_urologist',

  patient_get_doctors_neurologist: 'api/user/patients/patient_get_doctors_neurologist',
  patient_get_doctors_neuro_surgeon: 'api/user/patients/patient_get_doctors_neuro_surgeon',

  patient_get_doctors_gastro_medicine: 'api/user/patients/patient_get_doctors_gastro_medicine',
  patient_get_doctors_gastro_surgery: 'api/user/patients/patient_get_doctors_gastro_surgery',

  patient_get_doctors_hematologist: 'api/user/patients/patient_get_doctors_hematologist',
  patient_get_doctors_gynecologist: 'api/user/patients/patient_get_doctors_gynecologist',
  patient_get_doctors_orthopedics: 'api/user/patients/patient_get_doctors_orthopedics',

  patient_get_doctors_onco_medicine: 'api/user/patients/patient_get_doctors_onco_medicine',
  patient_get_doctors_onco_surgeon: 'api/user/patients/patient_get_doctors_onco_surgeon',

  patient_get_doctors_paediatrician: 'api/user/patients/patient_get_doctors_paediatrician',
  patient_get_doctors_plastic_surgeon: 'api/user/patients/patient_get_doctors_plastic_surgeon',

  patient_get_doctors_dentist: 'api/user/patients/patient_get_doctors_dentist',
  patient_get_doctors_dermatologist: 'api/user/patients/patient_get_doctors_dermatologist',

  patient_get_doctors_ent: 'api/user/patients/patient_get_doctors_ent',
  patient_get_doctors_ophthalmology: 'api/user/patients/patient_get_doctors_ophthalmology',

  patient_get_doctors_psychiatrist: 'api/user/patients/patient_get_doctors_psychiatrist',
  patient_get_doctors_radiologist: 'api/user/patients/patient_get_doctors_radiologist',

  patient_get_doctors_laparoscopic_surgeon: 'api/user/patients/patient_get_doctors_laparoscopic_surgeon',
  patient_get_doctors_spine_surgeon: 'api/user/patients/patient_get_doctors_spine_surgeon',

  patient_get_doctors_anesthesiologist: 'api/user/patients/patient_get_doctors_anesthesiologist',
  patient_get_doctors_pathologist: 'api/user/patients/patient_get_doctors_pathologist',

  patient_get_doctors_sports_medicine: 'api/user/patients/patient_get_doctors_sports_medicine',

  //apis for wallet booking
patient_book_appointment_through_wallet: 'api/user/patients/patient_book_appointment_through_wallet',

//drawer api for hospital detail
  patient_get_hospital_detail: 'api/user/patients/patient_get_hospital',
  patient_get_doctors_clinical_department: 'api/user/patients/patient_get_doctors_clinical_department',
  patient_get_doctors_surgical_department: 'api/user/patients/patient_get_doctors_surgical_department',
  patient_get_doctors_preventive_department: 'api/user/patients/patient_get_doctors_special_department',
  patient_get_doctor: 'api/user/patients/patient_get_doctor',

  //pharmacy apis
  patient_get_medicines: 'api/user/patients/patient_get_medicines',


  //pathology apis
  comparison_packages: 'api/user/patients/comparison_packages',
  comparison_tests: 'api/user/patients/comparison_tests',
  comparison_blood_tests: 'api/user/patients/comparison_blood_tests',
  comparison_blood_sugar_tests: 'api/user/patients/comparison_blood_sugar_tests',
  comparison_thyroid_tests: 'api/user/patients/comparison_thyroid_tests',
  comparison_lipid_tests: 'api/user/patients/comparison_lipid_tests',
  comparison_liver_tests: 'api/user/patients/comparison_liver_tests',
  comparison_kidney_tests: 'api/user/patients/comparison_kidney_tests',
  comparison_electrolyte_tests: 'api/user/patients/comparison_electrolyte_tests',
  comparison_mineral_tests: 'api/user/patients/comparison_mineral_tests',
  comparison_vitamin_tests: 'api/user/patients/comparison_vitamin_tests',
  comparison_urine_stool_tests: 'api/user/patients/comparison_urine_stool_tests',
  comparison_infection_disease_tests: 'api/user/patients/comparison_infection_disease_tests',
  comparison_imaging_diagnostics_tests: 'api/user/patients/comparison_imaging_diagnostics_tests',
  comparison_other_tests: 'api/user/patients/comparison_other_tests',


  //pathology cart apis

  add_to_cart: 'api/user/patients/add_to_cart',
  get_cart: 'api/user/patients/get_cart',
  remove_from_cart: 'api/user/patients/remove_from_cart',
  get_cart_count: 'api/user/patients/get_cart_count',
  create_tests_cart_order_booking_wallet: 'api/user/patients/create_tests_cart_order_booking_wallet',
  approved_pathology_appointments: 'api/user/patients/approved_pathology_appointments',
  approved_pathology_appointment: 'api/user/patients/approved_pathology_appointment',
  approved_pathology_appointments_count: 'api/user/patients/approved_pathology_appointments_count',
  approved_pathology_appointments_report: 'api/user/patients/approved_pathology_appointments_report',
  patient_get_pathology_reports: 'api/user/patients/patient_get_pathology_report',
  patient_get_pathology_report_count: 'api/user/patients/patient_get_pathology_report_count',
  comparison_tests_packages: 'api/user/patients/comparison_tests_packages',
  comparison_tests_packages_count: 'api/user/patients/comparison_tests_packages_count',
  create_tests_packages_cart_order_booking: 'api/user/patients/create_tests_packages_cart_order_booking',
  payment_cart_tests_packages_verify: 'api/user/patients/payment_cart_tests_packages_verify',
  book_test_wallet: 'api/user/patients/book_test_wallet',
  book_package_wallet: 'api/user/patients/book_package_wallet',
  book_test: 'api/user/patients/book_test',
  payment_test_verify: 'api/user/patients/payment_test_verify',
  book_package: 'api/user/patients/book_package',
  payment_package_verify: 'api/user/patients/payment_package_verify',
  debit_transaction_pathology_appointment: 'api/user/patients/debit_transaction_pathology_appointment',
  search_test_package: 'api/user/patients/search_test_package',

  // dialysis apis
  book_appointment_dialysis_wallet: 'api/user/patients/book_appointment_dialysis_wallet',
  book_appointment_dialysis: 'api/user/patients/book_appointment_dialysis',
  payment_dialysis_verify: 'api/user/patients/payment_dialysis_verify',
  dialysises_book: 'api/user/patients/dialysises_book',
  dialysis_book: 'api/user/patients/dialysis_book',
  dialysises_book_count: 'api/user/patients/dialysises_book_count',
  dialysises_book_completed_count: 'api/user/patients/dialysises_book_completed_count',
  debit_transaction_dialysis_book: 'api/user/patients/debit_transaction_dialysis_book',
  dialysises_completed_book: 'api/user/patients/dialysises_completed_book',

  // physiotherapy apis
  physiotherapys_book_count: 'api/user/patients/physiotherapys_book_count',
  physiotherapys_completed_book_count: 'api/user/patients/physiotherapys_completed_book_count',
  book_appointment_physiotherapy_wallet: 'api/user/patients/book_appointment_physiotherapy_wallet',
  book_appointment_physiotherapy: 'api/user/patients/book_appointment_physiotherapy',
  payment_physiotherapy_verify: 'api/user/patients/payment_physiotherapy_verify',
  physiotherapys_book: 'api/user/patients/physiotherapys_book',
  physiotherapys_completed_book: 'api/user/patients/physiotherapys_completed_book',
  physiotherapy_book: 'api/user/patients/physiotherapy_book',
  debit_transaction_physiotherapy_book: 'api/user/patients/debit_transaction_physiotherapy_book',


  // patient-mitra apis

  pm_package_gets_count:'api/user/patients/pm_package_gets_count',
  pm_package_gets:'api/user/patients/pm_package_gets',
  book_pm_package_wallet:'api/user/patients/book_pm_package_wallet',
  book_pm_package:'api/user/patients/book_pm_package',
  payment_pm_package_verify:'api/user/patients/payment_pm_package_verify',
  pm_package_book_count:'api/user/patients/pm_package_book_count',
  pm_package_book_completed_count:'api/user/patients/pm_package_book_completed_count',
  pm_package_book_accepted_count:'api/user/patients/pm_package_book_accepted_count',
  pm_package_book:'api/user/patients/pm_package_book',
  pm_package_accepted_book:'api/user/patients/pm_package_accepted_book',
  pm_package_completed_book:'api/user/patients/pm_package_completed_book',
  pm_package_book_detail:'api/user/patients/pm_package_book_detail',

  debit_transaction_pm_package_book:'api/user/patients/debit_transaction_pm_package_book',
  button_pm_package_accepted_appointment_completed:'api/user/patients/button_pm_package_accepted_appointment_completed'
  
}
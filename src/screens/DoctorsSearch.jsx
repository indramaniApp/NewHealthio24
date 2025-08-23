import {
  Image,
  StyleSheet,
  TextInput,
  View,
  FlatList,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native'
import React, { useState, useEffect } from 'react'
import { COLORS, icons } from '../../constants'
import { useTheme } from '../../theme/ThemeProvider'
import { ENDPOINTS } from '../constants/Endpoints'
import ApiService from '../api/ApiService'
import { hideLoader, showLoader } from '../redux/slices/loaderSlice'
import { useDispatch } from 'react-redux'
import HorizontalDoctorCard from '../../components/HorizontalDoctorCard'
import Header from '../../components/Header'

const DoctorsSearch = ({ navigation }) => {
  const { dark } = useTheme()
  const [searchText, setSearchText] = useState('')
  const [allDoctors, setAllDoctors] = useState([])
  const dispatch = useDispatch()

  // Debounce effect
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchText.trim() !== '') {
        searchBySpecialization(searchText)
      } else {
        setAllDoctors([])
      }
    }, 500)

    return () => clearTimeout(delayDebounce)
  }, [searchText])

  const searchBySpecialization = async (txt) => {
    try {
      dispatch(showLoader())
      const url = `${ENDPOINTS.search_by_Specialization}?specialization=${txt}`
      const response = await ApiService.get(url)
      setAllDoctors(response.data || [])
      dispatch(hideLoader())
    } catch (error) {
      console.log('error=======', error)
      dispatch(hideLoader())
    }
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: dark ? COLORS.dark1 : COLORS.white,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
      }}
    >
      <Header
        title="Search by Doctor Specialization/Symptoms"
        titleStyle={{ fontSize: 14, fontFamily: 'Urbanist',fontWeight: '700' }}
        style={{ marginTop: 2 }}
        onBackPress={() => navigation.goBack()}

      />
      <View style={{ flex: 1, paddingHorizontal: 16 }}>
        {/* Search Bar */}
        <View
          style={[
            styles.searchBarContainer,
            { backgroundColor: dark ? COLORS.dark2 : COLORS.secondaryWhite },
          ]}
        >
          <Image source={icons.search2} resizeMode="contain" style={styles.searchIcon} />

          <TextInput
            value={searchText}
            onChangeText={setSearchText}
            placeholder="Search by specialization......"
            placeholderTextColor={COLORS.gray}
            style={[styles.searchInput, { color: dark ? COLORS.white : COLORS.black }]}
          />

          {/* <TouchableOpacity>
            <Image source={icons.filter} resizeMode="contain" style={styles.filterIcon} />
          </TouchableOpacity> */}
        </View>

        {/* Search Results */}
        <FlatList
          data={allDoctors}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <HorizontalDoctorCard
              name={item.fullName}
              image={item.profilePhoto}
              distance={item.yearsOfExperience}
              price={item.price}
              consultationFee={item.consultationFee}
              hospital={item.currentHospitalClinicName}
              specialization={item.specialization}
              rating={item.average_rating}
              numReviews={item.rating_total_count}
              isAvailable={item.isAvailable}
              onPress={() =>
                navigation.navigate('DoctorDetails', {
                  fullName: item.fullName,
                  yearsOfExperience: item.yearsOfExperience,
                  specialization: item.specialization,
                  doctorRating: item.doctorRating,
                  doctorId: item._id,
                  streetAddress: item.streetAddress,
                  average_rating: item.average_rating,
                  rating_total_count: item.rating_total_count,
                  about_me: item.about_me,
                  consultationDate: item.consultationDate,
                  consultationTime: item.consultationTime,
                  previous_OPD_Number: item.previous_OPD_Number,
                  reviews: item.reviews,
                  consultationTimeVideo: item.consultationTimeVideo,
                  consultationTimeAudio: item.consultationTimeAudio,
                  consultationTimeHomeVisit: item.consultationTimeHomeVisit,
                  profilePhoto: item.profilePhoto,
                })
              }
            />
          )}
        />
      </View>
    </SafeAreaView>
  )
}

export default DoctorsSearch

const styles = StyleSheet.create({
  searchBarContainer: {
    width: '100%',
    paddingHorizontal: 16,
    borderRadius: 12,
    height: 52,
    marginVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: {
    height: 24,
    width: 24,
    tintColor: COLORS.gray,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Urbanist-Regular',
    marginHorizontal: 8,
    paddingVertical: 0,
  },
  filterIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.primary,
  },
})

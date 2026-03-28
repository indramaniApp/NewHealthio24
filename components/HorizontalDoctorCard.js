import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { COLORS, icons } from '../constants';
import { useTheme } from '../theme/ThemeProvider';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

const HorizontalDoctorCard = ({
  name,
  image,
  rating,
  numReviews,
  onPress,
  yearsOfExperience,
  specialization,
  state,
  hospital,
  consultationFeeHomeVisit,
  consultationFeeInPerson,
  consultationFeeVideoCall,
}) => {
  const [isFavourite, setIsFavourite] = useState(false);
  const { dark } = useTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={[
        styles.card,
        { backgroundColor: dark ? COLORS.dark2 : COLORS.white },
      ]}
    >
      <Image source={{ uri: image }} style={styles.image} />

      <View style={styles.content}>
        {/* Top Info */}
        <View>
          <Text
            style={[
              styles.name,
              { color: dark ? COLORS.white : COLORS.black },
            ]}
            numberOfLines={1}
          >
            {name}
          </Text>

          <View style={styles.row}>
            {rating > 0 && (
              <>
                <FontAwesome name="star" size={13} color="#FFD700" />
                <Text style={styles.ratingText}>{rating}</Text>
                <Text style={styles.reviewText}>({numReviews})</Text>
                <Text style={styles.separator}>•</Text>
              </>
            )}

            <Text style={styles.expText}>
              {yearsOfExperience} yrs exp
            </Text>
          </View>

          <Text style={styles.specialization} numberOfLines={1}>
            {specialization}
          </Text>

          {hospital ? (
            <Text style={styles.hospitalText} numberOfLines={1}>
              🏥 {hospital}
            </Text>
          ) : null}

          {state ? (
            <Text style={styles.stateText} numberOfLines={1}>
              📍 {state}
            </Text>
          ) : null}
        </View>

        {/* Fees Chips */}
        <View style={styles.feesContainer}>
          {consultationFeeInPerson ? (
            <View style={styles.feeChip}>
              <MaterialIcons
                name="person-pin-circle"
                size={14}
                color={COLORS.primary}
              />
              <Text style={styles.feeLabel}>In-Person</Text>
              <Text style={styles.feePrice}>₹{consultationFeeInPerson}</Text>
            </View>
          ) : null}

          {consultationFeeHomeVisit ? (
            <View style={styles.feeChip}>
              <MaterialIcons name="home" size={14} color={COLORS.primary} />
              <Text style={styles.feeLabel}>Home</Text>
              <Text style={styles.feePrice}>₹{consultationFeeHomeVisit}</Text>
            </View>
          ) : null}

          {consultationFeeVideoCall ? (
            <View style={styles.feeChip}>
              <MaterialIcons name="videocam" size={14} color={COLORS.primary} />
              <Text style={styles.feeLabel}>Video</Text>
              <Text style={styles.feePrice}>₹{consultationFeeVideoCall}</Text>
            </View>
          ) : null}
        </View>

        {/* Bottom Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            onPress={() => setIsFavourite(!isFavourite)}
            activeOpacity={0.7}
            style={styles.heartWrapper}
          >
            <Image
              source={isFavourite ? icons.heart2 : icons.heart2Outline}
              style={styles.heartIcon}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={onPress} activeOpacity={0.85}>
            <LinearGradient
              colors={[COLORS.primary, '#5F8DFF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Get More Detail</Text>
              <MaterialIcons
                name="keyboard-arrow-right"
                size={18}
                color="#FFF"
              />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center', // ✅ Image + text perfectly center
    borderRadius: 20,
    padding: 12,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },

  image: {
    width: 86,
    height: 122,
    borderRadius:10,
  },

  content: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },

  name: {
    fontSize: 16.5,
    fontFamily: 'Urbanist-Bold',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },

  ratingText: {
    fontSize: 12.5,
    fontFamily: 'Urbanist-SemiBold',
    marginLeft: 4,
  },

  reviewText: {
    fontSize: 12,
    fontFamily: 'Urbanist-Regular',
    color: COLORS.greyscale600,
    marginLeft: 2,
  },

  expText: {
    fontSize: 12.5,
    fontFamily: 'Urbanist-Medium',
    color: COLORS.greyscale700,
  },

  separator: {
    marginHorizontal: 6,
    fontSize: 12,
    color: COLORS.greyscale400,
  },

  specialization: {
    fontSize: 13.5,
    fontFamily: 'Urbanist-SemiBold',
    color: COLORS.greyscale800,
    marginTop: 6,
  },

  hospitalText: {
    fontSize: 12.5,
    fontFamily: 'Urbanist-Regular',
    color: COLORS.greyscale700,
    marginTop: 3,
  },

  stateText: {
    fontSize: 12.5,
    fontFamily: 'Urbanist-Medium',
    color: COLORS.primary,
    marginTop: 2,
  },

  feesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },

  feeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.04)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 6,
  },

  feeLabel: {
    fontSize: 11.5,
    fontFamily: 'Urbanist-Medium',
    color: COLORS.greyscale600,
    marginLeft: 4,
    marginRight: 4,
  },

  feePrice: {
    fontSize: 12.5,
    fontFamily: 'Urbanist-Bold',
    color: COLORS.black,
  },

  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },

  heartWrapper: {
    padding: 6,
  },

  heartIcon: {
    width: 22,
    height: 22,
    tintColor: COLORS.greyscale500,
  },

  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 10,
  },

  buttonText: {
    color: COLORS.white,
    fontSize: 12.5,
    fontFamily: 'Urbanist-SemiBold',
    marginRight: 2,
  },
});

export default HorizontalDoctorCard;

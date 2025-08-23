import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { COLORS, icons } from '../constants';
import { useTheme } from '../theme/ThemeProvider';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const HorizontalDoctorCard = ({
  name,
  image,
  hospital,
  consultationFee,
  rating,
  numReviews,
  isAvailable,
  onPress,
  yearsOfExperience,
  specialization,
  surgery,
}) => {
  const [isFavourite, setIsFavourite] = useState(false);
  const { dark } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.container,
        { backgroundColor: dark ? COLORS.dark2 : COLORS.white },
      ]}
    >
      <Image source={{ uri: image }} style={styles.image} />
      {isAvailable && (
        <View style={styles.reviewContainer}>
          <Text style={styles.rating}>OPEN</Text>
        </View>
      )}
      <View style={styles.columnContainer}>
        <View style={styles.topViewContainer}>
          <Text style={[styles.name, { color: dark ? COLORS.secondaryWhite : COLORS.greyscale900 }]}>
            {name}
          </Text>
        </View>
        <View style={styles.viewContainer}>
          {rating > 0 ? (
            <>
              <FontAwesome name="star" size={14} color="rgb(250, 159, 28)" />
              <Text style={styles.location}> {rating} ({numReviews}) | {yearsOfExperience} yrs</Text>
            </>
          ) : (
            <Text style={styles.location}>{yearsOfExperience} yrs experience</Text>
          )}
        </View>
        <Text style={styles.location}>
          {surgery && surgery !== 'No' ? `Surgery: ${surgery}` : 'Special Care Available'}
        </Text>
        <Text style={styles.location}>{specialization}</Text>
        {hospital && <Text style={styles.location}>{hospital}</Text>}
        <View style={styles.bottomViewContainer}>
          <Text style={styles.price}>₹{consultationFee}</Text>
          <TouchableOpacity onPress={() => setIsFavourite(!isFavourite)}>
            <Image
              source={isFavourite ? icons.heart2 : icons.heart2Outline}
              style={styles.heartIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
    borderRadius: 16,
    marginBottom: 16,
    alignItems: 'center',
    elevation: 1,
  },
  image: {
    width: 110,
    height: 110,
    borderRadius: 14,
    backgroundColor: '#ddd',
  },
  columnContainer: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: 12,
  },
  name: {
    fontSize: 17,
    fontFamily: 'Urbanist Bold',
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    fontFamily: 'Urbanist Regular',
    marginVertical: 2,
    color: COLORS.grayscale700,
  },
  bottomViewContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  price: {
    fontSize: 16,
    fontFamily: 'Urbanist SemiBold',
    color: COLORS.primary,
  },
  heartIcon: {
    width: 18,
    height: 18,
    tintColor: COLORS.primary,
    marginLeft: 6,
  },
  reviewContainer: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: COLORS.primary,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    zIndex: 10,
  },
  rating: {
    fontSize: 10,
    color: COLORS.white,
    fontFamily: 'Urbanist SemiBold',
  },
  viewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  topViewContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default HorizontalDoctorCard;

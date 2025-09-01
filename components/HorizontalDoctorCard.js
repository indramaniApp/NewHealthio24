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
            style={styles.touchableWrapper}
        >
         
            <View style={styles.container}>
                <Image source={{ uri: image }} style={styles.image} />

                {isAvailable && (
                    <View style={styles.reviewContainer}>
                        <Text style={styles.ratingText}>OPEN</Text>
                    </View>
                )}

                <View style={styles.columnContainer}>
                    <View>
                        <Text style={styles.name}>{name}</Text>

                        <View style={styles.viewContainer}>
                            {rating > 0 ? (
                                <>
                                    <FontAwesome name="star" size={14} color="#FFD700" />
                                    <Text style={styles.location}>
                                        {' '} {rating} ({numReviews}) | {yearsOfExperience} yrs
                                    </Text>
                                </>
                            ) : (
                                <Text style={styles.location}>
                                    {yearsOfExperience} yrs experience
                                </Text>
                            )}
                        </View>

                        <Text style={styles.location}>{specialization}</Text>

                        {surgery ? (
                            <Text style={styles.location} numberOfLines={3}>
                                Surgery: {surgery}
                            </Text>
                        ) : null}
                    </View>

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
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
 
    touchableWrapper: {
        borderRadius: 2,
        marginBottom: 16,
        backgroundColor: COLORS.white,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 8,
    },
    container: {
        flexDirection: 'row',
        padding: 12,
        borderRadius: 20,
        alignItems: 'center',
        backgroundColor: COLORS.white,
    },
    image: {
        width: 100,
        height: 110,
        borderRadius: 16,
    
    },
    columnContainer: {
        flex: 1,
        marginLeft: 16,
        minHeight: 110,
        justifyContent: 'space-between',
    },
    name: {
        fontSize: 18,
        fontFamily: 'Urbanist-Bold',
        color: COLORS.black, 
    },
    location: {
        fontSize: 13,
        fontFamily: 'Urbanist-Regular',
        color: COLORS.greyscale700,
        marginTop: 4,
    },
    bottomViewContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    price: {
        fontSize: 20,
        fontFamily: 'Urbanist-Bold',
        color: COLORS.black, 
    },
    heartIcon: {
        width: 24,
        height: 24,
        tintColor: COLORS.greyscale500, 
    },
    reviewContainer: {
        position: 'absolute',
        top: 20,
        left: 20,
        backgroundColor: '#1E9E61', 
        borderRadius: 7,
        paddingHorizontal: 8,
        paddingVertical: 4,
        zIndex: 10,
    },
    ratingText: {
        fontSize: 11,
        color: COLORS.white,
        fontFamily: 'Urbanist-Bold',
    },
    // === MODIFICATION END ===
    viewContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginTop: 6,
    },
});

export default HorizontalDoctorCard;
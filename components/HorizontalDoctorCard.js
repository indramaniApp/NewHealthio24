import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { COLORS, icons } from '../constants';
import { useTheme } from '../theme/ThemeProvider';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient'; 

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
            <LinearGradient
                colors={dark ? ['#185a9d', '#0f3a63'] : ['#43cea2', '#185a9d']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.container}
            >
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
            </LinearGradient>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    touchableWrapper: {
        borderRadius: 20,
        marginBottom: 16,
        shadowColor: "#185a9d",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 10,
    },
    container: {
        flexDirection: 'row',
        padding: 12,
        borderRadius: 20,
        alignItems: 'center',
    },
    image: {
        width: 100,
        height: 110,
        borderRadius: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1.5,
        borderColor: 'rgba(255, 255, 255, 0.4)',
    },
    columnContainer: {
        flex: 1,
        marginLeft: 16,
        minHeight: 110, // ✅ auto height with minimum limit
        justifyContent: 'space-between',
    },
    name: {
        fontSize: 18,
        fontFamily: 'Urbanist-Bold',
        color: COLORS.white,
    },
    location: {
        fontSize: 13,
        fontFamily: 'Urbanist-Regular',
        color: 'rgba(255, 255, 255, 0.85)',
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
        color: COLORS.white,
    },
    heartIcon: {
        width: 24,
        height: 24,
        tintColor: COLORS.white,
    },
    reviewContainer: {
        position: 'absolute',
        top: 20,
        left: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
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
    viewContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginTop: 6,
    },
});

export default HorizontalDoctorCard;

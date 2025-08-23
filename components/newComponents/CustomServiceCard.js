import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../../constants';


const CustomServiceCard = ({ iconName, title, subtitle, onPress, style }) => {
    return (
        <TouchableOpacity onPress={onPress} style={[styles.card, style]}>
            <View style={styles.iconContainer}>
                <MaterialCommunityIcons name={iconName} size={28} color={COLORS.white} />
            </View>
            <Text style={styles.title}>{title}</Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.primary,
        borderRadius: 16,
        padding: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconContainer: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 12,
        padding: 10,
        marginBottom: 8,
    },
    title: {
        fontSize: 15,
        fontFamily: 'Urbanist-Bold',
        color: COLORS.white,
        textAlign: 'center',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 10,
        fontFamily: 'Urbanist-Regular', 
        color: '#f0f0f0',
        textAlign: 'center',
    },
});

export default CustomServiceCard;
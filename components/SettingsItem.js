import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { SIZES, COLORS, icons } from '../constants';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../theme/ThemeProvider'; // <-- 1. useTheme को वापस इम्पोर्ट करें

const SettingsItem = ({ icon, name, onPress, hasArrowRight = true }) => {
    const { dark } = useTheme(); // <-- 2. dark prop को फिर से इस्तेमाल करें

    return (
        <TouchableOpacity
            onPress={onPress}
            style={styles.container}>
            <View style={styles.leftContainer}>
           
                <LinearGradient
                    colors={['#00b4db', '#0097bd']} 
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.iconContainer} 
                >
                    <Image
                        source={icon}
                        resizeMode='contain'
                        style={[styles.icon, { tintColor: COLORS.white }]} 
                    />
                </LinearGradient>

          
                <Text style={[styles.name, {
                    color: dark ? COLORS.white : COLORS.greyscale900
                }]}>{name}</Text>
            </View>
            {
                hasArrowRight && (
                    <Image
                        source={icons.arrowRight}
                        resizeMode='contain'
                        style={[styles.arrowRight, {
                         
                            tintColor: dark ? COLORS.white : COLORS.greyscale900
                        }]}
                    />
                )
            }
        </TouchableOpacity>
    )
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: 12,
    },
    leftContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 22, 
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        height: 24,
        width: 24,
    },
    name: {
        fontSize: 18,
        fontFamily: "Urbanist-SemiBold",
        color: COLORS.greyscale900,
        marginLeft: 16,
    },
    arrowRight: {
        width: 24,
        height: 24,
        tintColor: COLORS.greyscale900
    }
});

export default SettingsItem;
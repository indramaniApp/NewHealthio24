import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { COLORS } from '../constants';
import { useTheme } from '../theme/ThemeProvider';
// 1. Import LinearGradient
import LinearGradient from 'react-native-linear-gradient';

const PackageItem = ({ checked, onPress, title, subtitle, price, duration, icon }) => {
    const { dark } = useTheme();

    return (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.container, {
                backgroundColor: dark ? COLORS.dark2 : COLORS.white
            }]}>
            <View style={styles.rightContainer}>
                {/* 2. Replaced View with LinearGradient */}
                <LinearGradient
                    colors={['#0077b6', '#00b4db']}
                    style={styles.iconContainer}
                >
                    <Image
                        source={icon}
                        resizeMode='contain'
                        style={styles.icon}
                    />
                </LinearGradient>
                <View>
                    <Text style={[styles.title, {
                        color: dark ? COLORS.white : COLORS.black
                    }]}>{title}</Text>
                    <Text style={[styles.subtitle, {
                        color: dark ? COLORS.greyscale300 : "gray"
                    }]}>{subtitle}</Text>
                </View>
            </View>
            <View style={styles.leftContainer}>
                <View>
                    <Text style={[styles.title, {
                        color: COLORS.primary
                    }]}>{price}</Text>
                    {/* $ */}
                    <Text style={[styles.subtitle, {
                        color: dark ? COLORS.greyscale300 : "gray"
                    }]}>{duration}</Text>
                    {/* / */}
                </View>
                <TouchableOpacity style={{ marginLeft: 8 }} onPress={onPress}>
                    <View
                        style={{
                            width: 20,
                            height: 20,
                            borderRadius: 15,
                            borderWidth: 2,
                            borderColor: COLORS.primary,
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: 10,
                        }}
                    >
                        {checked && <View style={{
                            height: 10,
                            width: 10,
                            backgroundColor: COLORS.primary,
                            borderRadius: 999
                        }} />}
                    </View>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        borderRadius: 16,
        paddingVertical: 12,
        paddingHorizontal: 6,
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 12,
        backgroundColor: COLORS.white
    },
    rightContainer: {
        flexDirection: "row",
        alignItems: "center"
    },
    iconContainer: {
        height: 60,
        width: 60,
        // backgroundColor was removed from here
        borderRadius: 999,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12
    },
    icon: {
        height: 28,
        width: 28,
        // 3. Changed icon tintColor to white
        tintColor: COLORS.white
    },
    title: {
        fontSize: 16,
        fontFamily: "Urbanist Bold",
        color: COLORS.black,
        marginBottom: 8
    },
    subtitle: {
        fontSize: 12,
        fontFamily: "Urbanist Medium",
        color: "gray"
    },
    leftContainer: {
        flexDirection: "row",
        alignItems: "center"
    }
})

export default PackageItem;
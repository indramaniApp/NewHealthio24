import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { COLORS, SIZES } from '../constants';
import { useTheme } from '../theme/ThemeProvider';

const SubHeaderItem = ({ title, onPress, navTitle }) => {
    const { dark } = useTheme();

    return (
        <View style={styles.container}>
            <Text
                style={[
                    styles.title,
                    { color: dark ? COLORS.white : COLORS.greyscale900 },
                ]}
            >
                {title}
            </Text>
            {navTitle ? (
                <TouchableOpacity onPress={onPress} style={styles.button}>
                    <Text style={styles.buttonText}>{navTitle}</Text>
                </TouchableOpacity>
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: SIZES.width - 32,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 10,
    },
    title: {
        fontSize: 20,
        fontFamily: 'Urbanist Bold',
        color: COLORS.black,
    },
    button: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 20,
    },
    buttonText: {
        fontSize: 14,
        fontFamily: 'Urbanist Medium',
        color: COLORS.white,
    },
});

export default SubHeaderItem;

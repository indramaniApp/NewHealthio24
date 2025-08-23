import {
    Text,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
  
} from 'react-native';
import React from 'react';
import { COLORS, SIZES } from '../constants';

const Button = ({
    title,
    onPress,
    style,
    textStyle,
    filled = true,
    color,
    textColor,
    isLoading = false,
    disabled = false,
}) => {
    const filledBgColor = color || COLORS.primary;
    const outlinedBgColor = COLORS.white;
    const backgroundColor = filled ? filledBgColor : outlinedBgColor;
    const finalTextColor = filled
        ? (textColor || COLORS.white)
        : (textColor || COLORS.primary);

    return (
        <TouchableOpacity
            style={[
                styles.btn,
                { backgroundColor },
                disabled && { opacity: 0.6 },
                style,
            ]}
            onPress={onPress}
            disabled={disabled || isLoading}
            activeOpacity={0.8}
        >
            {isLoading ? (
                <ActivityIndicator size="small" color={filled ? COLORS.white : COLORS.primary} />
            ) : (
                <Text style={[styles.text, { color: finalTextColor }, textStyle]}>
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    btn: {
        paddingHorizontal: SIZES.padding,
        paddingVertical: SIZES.padding,
        borderColor: COLORS.primary,
        borderWidth: 1,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        height: 52,
        marginBottom: 10,
    },
    text: {
        fontSize: 16,
        fontFamily: 'Urbanist-SemiBold',
    },
});

export default Button;

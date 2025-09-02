import {
    Text,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, SIZES } from '../constants';

const Button = ({
    title,
    onPress,
    style,
    textStyle,
    filled = true,
    colors,
    textColor,
    isLoading = false,
    disabled = false,
}) => {

    // Common content for the button (either text or a loading indicator)
    const buttonContent = (
        isLoading ? (
            <ActivityIndicator size="small" color={filled ? COLORS.white : COLORS.primary} />
        ) : (
            <Text style={[
                styles.text,
                { color: filled ? (textColor || COLORS.white) : (textColor || COLORS.primary) },
                textStyle
            ]}>
                {title}
            </Text>
        )
    );

  
    if (filled) {
        return (
            <TouchableOpacity
                onPress={onPress}
                disabled={disabled || isLoading}
                activeOpacity={0.8}
                style={[
                    styles.btn,
                    { borderWidth: 0 }, 
                    disabled && { opacity: 0.6 },
                    style,
                ]}
            >
                <LinearGradient
                    colors={colors || ['#00b4db', '#0083B0']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gradient}
                >
                    {buttonContent}
                </LinearGradient>
            </TouchableOpacity>
        );
    }

  
    return (
        <TouchableOpacity
            style={[
                styles.btn,
                { backgroundColor: COLORS.white },
                disabled && { opacity: 0.6 },
                style,
            ]}
            onPress={onPress}
            disabled={disabled || isLoading}
            activeOpacity={0.8}
        >
            {buttonContent}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    btn: {
        borderColor: COLORS.primary,
        borderWidth: 1,
        borderRadius: 25,
        justifyContent: 'center',
        height: 52,
        marginBottom: 10,
        overflow: 'hidden', // Ensures the gradient is clipped to the button's rounded corners
    },
    gradient: {
        flex: 1,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: SIZES.padding,
        paddingVertical: SIZES.padding,
    },
    text: {
        fontSize: 16,
        fontFamily: 'Urbanist-SemiBold',
    },
});

export default Button;
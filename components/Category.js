import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { COLORS, SIZES } from '../constants';
import { useTheme } from '../theme/ThemeProvider';

const Category = ({ name, icon, iconColor, backgroundColor, onPress }) => {
  const { dark } = useTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[
        styles.card,
        { backgroundColor },
      ]}
    >
      {/* ICON BOX */}
      <View style={[styles.iconWrapper]}>
        <Image
          source={icon}
          resizeMode="contain"
          style={[
            styles.icon,
            iconColor ? { tintColor: iconColor } : null,
          ]}
        />
      </View>

      {/* TEXT */}
      <Text
        style={[
          styles.title,
          { color: dark ? COLORS.white : COLORS.greyscale900 },
        ]}
        numberOfLines={2}
      >
        {name}
      </Text>
    </TouchableOpacity>
  );
};

export default Category;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  card: {
    width: (SIZES.width - 48) / 2,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    marginBottom: 14,
  },

  iconWrapper: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.06)', // ✅ safe default
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  icon: {
    width: 22,
    height: 22,
  },

  title: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Urbanist Medium',
  },
});

import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { SIZES, COLORS, icons } from '../constants';
import { useTheme } from '../theme/ThemeProvider';

const Header = ({
  title,
  titleStyle,
  style,
  showCart = false,
  cartCount = 0,
  onCartPress,
  onBackPress,
}) => {
  const { colors, dark } = useTheme();

  return (
    <View
      style={[
        styles.container,
        style,
    
      ]}
    >
      {/* Back Button */}
      <TouchableOpacity onPress={onBackPress} style={styles.backContainer}>
        <View style={styles.backCircle}>
          <Image
            source={icons.back}
            resizeMode="contain"
            style={[styles.backIcon, { tintColor: colors.text }]}
          />
        </View>
      </TouchableOpacity>

      {/* Title */}
      <Text style={[styles.title, { color: colors.text }, titleStyle]}>
        {title}
      </Text>

      {/* Optional Cart */}
      {showCart && (
        <TouchableOpacity
          onPress={onCartPress}
          style={styles.cartContainer}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <View style={styles.cartCircle}>
            <Image
              source={icons.cart}
              resizeMode="contain"
              style={[styles.cartIcon, { tintColor: colors.text }]}
            />
            {cartCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{cartCount}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      )}

      {/* Divider Line */}
      <View style={styles.bottomLine} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SIZES.width - 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 5,
    paddingVertical: 8,
    position: 'relative',
  },
  backContainer: {
    marginLeft: 10,
  },
  backCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0F4FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    width: 20,
    height: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Urbanist-Bold',
    color: COLORS.black,
    flex: 1,
    textAlign: 'center',
  },
  cartContainer: {
    marginRight: 10,
  },
  cartCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0F4FF',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  cartIcon: {
    width: 20,
    height: 20,
  },
  badge: {
    position: 'absolute',
    right: -2,
    top: -2,
    backgroundColor: 'red',
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  bottomLine: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
});

export default Header;

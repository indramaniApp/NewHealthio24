import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Dimensions,
    SafeAreaView,
    Platform,
} from 'react-native';
import UpcomingAppointment from './UpcomingAppointment';
import CompletedAppointment from './CompletedAppointment';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');
const tabWidth = width / 2;
const underlineWidth = tabWidth * 0.6;

/* 🔴 DIALYSIS RED THEME */
const RED_PRIMARY = '#FF4D4D';
const RED_DARK = '#B30000';
const RED_LIGHT_BORDER = '#FFD6D6';
const GRADIENT_COLORS = ['#FF3B3B', '#9C27B0'];

const Appointments = ({ navigation }) => {
    const [activeTab, setActiveTab] = useState('Scheduled');
    const underlineX = useRef(new Animated.Value(0)).current;

    const handleTabPress = (tab, index) => {
        setActiveTab(tab);
        Animated.spring(underlineX, {
            toValue: index * tabWidth,
            useNativeDriver: false,
        }).start();
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Tab Header */}
            <View style={styles.tabHeader}>
                {/* Back Button with Gradient */}
                <LinearGradient colors={GRADIENT_COLORS} style={styles.backButton}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        activeOpacity={0.7}
                        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
                    >
                        <Icon name="arrow-left" size={22} color="#fff" />
                    </TouchableOpacity>
                </LinearGradient>

                {['Scheduled', 'Completed'].map((tab, index) => {
                    const isActive = activeTab === tab;
                    return (
                        <TouchableOpacity
                            key={tab}
                            style={styles.tabItem}
                            onPress={() => handleTabPress(tab, index)}
                        >
                            <Text style={[styles.tabText, isActive && styles.activeTabText]}>
                                {tab}
                            </Text>
                        </TouchableOpacity>
                    );
                })}

                {/* Animated Underline with Gradient */}
                <Animated.View
                    style={[
                        styles.underline,
                        {
                            width: underlineWidth,
                            transform: [
                                {
                                    translateX: Animated.add(
                                        underlineX,
                                        new Animated.Value((tabWidth - underlineWidth) / 2)
                                    ),
                                },
                            ],
                        },
                    ]}
                >
                    <LinearGradient
                        colors={GRADIENT_COLORS}
                        style={{ flex: 1, borderRadius: 2 }}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                    />
                </Animated.View>
            </View>

            {/* Content */}
            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                {activeTab === 'Scheduled' ? <UpcomingAppointment /> : <CompletedAppointment />}
            </View>
        </SafeAreaView>
    );
};

export default Appointments;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },

    tabHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
        borderBottomWidth: 1,
        borderColor: RED_LIGHT_BORDER,
        marginTop: 36,
        paddingHorizontal: 12,
        paddingBottom: 8,
    },

    backButton: {
        position: 'absolute',
        left: 12,
        top: Platform.OS === 'android' ? 4 : 0,
        zIndex: 10,
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 3,
    },

    tabItem: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 12,
    },

    tabText: {
        fontSize: 16,
        color: RED_DARK,
        fontWeight: '600',
    },

    activeTabText: {
        color: RED_PRIMARY,
        fontWeight: 'bold',
    },

    underline: {
        position: 'absolute',
        bottom: 0,
        height: 3,
        borderRadius: 2,
        overflow: 'hidden',
    },
});

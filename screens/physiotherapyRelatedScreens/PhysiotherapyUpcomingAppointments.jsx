import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Dimensions,
    SafeAreaView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient'; // Import LinearGradient
import { COLORS } from '../../constants';
import Header from '../../components/Header';
import PhysiotherapyScheduled from './PhysiotherapyScheduled';
import PhysiotherapyCompleted from './PhysiotherapyCompleted';

const { width } = Dimensions.get('window');
const tabWidth = width / 2;
const underlineWidth = tabWidth * 0.6;

const PhysiotherapyAppointments = ({ navigation }) => {
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
        // Wrap the entire component with LinearGradient
        <LinearGradient
            colors={['#00b4db', '#FFFFFF', '#FFFFFF']}
            style={styles.gradient}
        >
            <SafeAreaView style={styles.container}>
                <Header title="Physiotherapy" onBackPress={() => navigation.goBack()} />

                {/* Tabs */}
                <View style={styles.tabHeader}>
                    {['Scheduled', 'Completed'].map((tab, index) => (
                        <TouchableOpacity
                            key={tab}
                            style={styles.tabItem}
                            onPress={() => handleTabPress(tab, index)}
                        >
                            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                                {tab}
                            </Text>
                        </TouchableOpacity>
                    ))}

                    {/* Animated Underline */}
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
                    />
                </View>

                {/* Content */}
                <View style={styles.contentContainer}>
                    {activeTab === 'Scheduled' ? (
                        <PhysiotherapyScheduled />
                    ) : (
                        <PhysiotherapyCompleted />
                    )}
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
};

export default PhysiotherapyAppointments;

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
    },
    container: {
        flex: 1,
        backgroundColor: 'transparent', // Make container transparent to show gradient
    },
    tabHeader: {
        flexDirection: 'row',
        position: 'relative',
        borderBottomWidth: 1,
        borderColor: '#E0E0E0',
        marginTop: 16,
        marginHorizontal: 16,
        backgroundColor: 'transparent',
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 12,
    },
    tabText: {
        fontSize: 16,
        color: COLORS.black,
    },
    activeTabText: {
        color: COLORS.white,
        fontWeight: 'bold',
    },
    underline: {
        position: 'absolute',
        bottom: -1, 
        height: 3,
        backgroundColor: COLORS.primary,
        borderRadius: 2,
    },
    contentContainer: {
        flex: 1,
    },
});
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, SafeAreaView } from 'react-native';
import { UpcomingBooking, CompletedBooking, CancelledBooking } from '../tabs';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

const Appointment = ({ navigation }) => {
    const [selectedTab, setSelectedTab] = useState('upcoming');
    const underlineWidth = width / 3; // 3 tabs

    const renderSelectedScreen = () => {
        switch (selectedTab) {
            case 'upcoming': return <UpcomingBooking />;
            case 'uploaded': return <CompletedBooking />;
            case 'completed': return <CancelledBooking />;
            default: return null;
        }
    }

    // MODIFICATION: Updated tab colors to be visible on the new gradient background
    const fixedColors = {
        tabActive: '#FFFFFF',
        tabInactive: 'rgba(255, 255, 255, 0.7)',
        underline: 'rgba(255, 255, 255, 0.3)',
    };

    return (
        // MODIFICATION: Removed background color from SafeAreaView
        <SafeAreaView style={styles.safeArea}>
            {/* MODIFICATION: LinearGradient now wraps the entire screen content */}
            <LinearGradient
                colors={['#00b4db', '#E0F7FA', '#FFFFFF']}
                style={styles.gradientContainer}
            >
                {/* Tabs */}
                <View style={styles.tabsContainer}>
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity style={styles.tab} onPress={() => setSelectedTab('upcoming')}>
                            <Text style={[styles.tabText, { color: selectedTab === 'upcoming' ? fixedColors.tabActive : fixedColors.tabInactive }]}>Upcoming</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.tab} onPress={() => setSelectedTab('uploaded')}>
                            <Text style={[styles.tabText, { color: selectedTab === 'uploaded' ? fixedColors.tabActive : fixedColors.tabInactive }]}>Uploaded</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.tab} onPress={() => setSelectedTab('completed')}>
                            <Text style={[styles.tabText, { color: selectedTab === 'completed' ? fixedColors.tabActive : fixedColors.tabInactive }]}>Completed</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Underline */}
                    <View style={styles.underlineWrapper}>
                        <View style={[styles.fullUnderline, { backgroundColor: fixedColors.underline }]} />
                        <View style={{
                            position: 'absolute',
                            width: underlineWidth,
                            height: 2,
                            // MODIFICATION: Active underline is now solid white
                            backgroundColor: fixedColors.tabActive,
                            left: selectedTab === 'upcoming' ? 0 : selectedTab === 'uploaded' ? underlineWidth : 2 * underlineWidth
                        }} />
                    </View>
                </View>

                {/* Screen content */}
                <View style={styles.contentContainer}>
                    {renderSelectedScreen()}
                </View>
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    gradientContainer: {
        flex: 1,
    },
    tabsContainer: {
        marginTop: 10,
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 12
    },
    tabText: {
        fontSize: 16,
        fontWeight: '600'
    },
    underlineWrapper: {
        position: 'relative',
        height: 2,
        marginTop: 4,
    },
    fullUnderline: {
        position: 'absolute',
        width: '100%',
        height: 2,
    },
    contentContainer: {
        flex: 1,
    },
});

export default Appointment;
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Image, SafeAreaView } from 'react-native';
import { COLORS, icons, images } from '../constants';
import { UpcomingBooking, CompletedBooking, CancelledBooking } from '../tabs';
import LinearGradient from 'react-native-linear-gradient'; // Import LinearGradient

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

    const fixedColors = {
        background: '#FFFFFF',
        tabActive: '#007AFF',
        tabInactive: '#555555',
        underline: '#E0E0E0',
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: fixedColors.background }}>
            {/* === MODIFICATION START === */}
            {/* Header */}
            <LinearGradient
                colors={['#00b4db', '#0077b6']}
                style={styles.headerContainer}
            >
                <View style={styles.headerLeft}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        {/* Go back icon is better here than logo */}
                        <Image source={icons.back} style={styles.headerIcon} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>My Appointments</Text>
                </View>
                <TouchableOpacity>
                    <Image source={icons.moreCircle} style={styles.headerIcon} />
                </TouchableOpacity>
            </LinearGradient>
            {/* === MODIFICATION END === */}

            {/* Tabs */}
            <View style={{ marginTop: 10 }}>
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
                <View style={{ position: 'relative', height: 2, marginTop: 4 }}>
                    <View style={{ position: 'absolute', width: '100%', height: 2, backgroundColor: fixedColors.underline }} />
                    <View style={{
                        position: 'absolute',
                        width: underlineWidth,
                        height: 2,
                        backgroundColor: fixedColors.tabActive,
                        left: selectedTab === 'upcoming' ? 0 : selectedTab === 'uploaded' ? underlineWidth : 2 * underlineWidth
                    }} />
                </View>
            </View>

            {/* Screen content */}
            <View style={{ flex: 1 }}>
                {renderSelectedScreen()}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    // Updated header styles
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12, // Added vertical padding
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    headerIcon: { // Renamed for clarity
        width: 24,
        height: 24,
        tintColor: '#fff' // Set icon color to white
    },
    headerTitle: {
        fontSize: 20,
        marginLeft: 16,
        fontWeight: 'bold',
        color: '#fff' // Set text color to white
    },
    // Tab styles remain the same
    tab: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 12
    },
    tabText: {
        fontSize: 16,
        fontWeight: '600'
    },
});

export default Appointment;
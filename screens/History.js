import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    SafeAreaView,
    StatusBar,
    Platform,
} from 'react-native';

import TransactionScreen from '../tabs/TransactionScreen';
import WalletTransactionScreen from '../tabs/WalletTransactionScreen';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

const History = () => {
    const [selectedTab, setSelectedTab] = useState('transaction');
    const underlineWidth = width / 2;

    const renderSelectedScreen = () => {
        if (selectedTab === 'transaction') return <TransactionScreen />;
        if (selectedTab === 'wallet') return <WalletTransactionScreen />;
        return null;
    };

    const fixedColors = {
        tabActive: '#00b4db', // ACTIVE TEXT COLOR (blue looks better on white)
        tabInactive: '#777',
        underline: '#DDD',
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar
                backgroundColor="#FFFFFF"
                barStyle="dark-content"
            />

            <LinearGradient
                colors={['#FFFFFF', '#E0F7FA', '#FFFFFF']}
                style={styles.gradientContainer}
            >
                <View style={styles.tabsContainer}>
                    <View style={styles.row}>
                        <TouchableOpacity
                            style={styles.tab}
                            onPress={() => setSelectedTab('transaction')}
                        >
                            <Text
                                style={[
                                    styles.tabText,
                                    {
                                        color:
                                            selectedTab === 'transaction'
                                                ? fixedColors.tabActive
                                                : fixedColors.tabInactive,
                                    },
                                ]}
                            >
                                Transaction
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.tab}
                            onPress={() => setSelectedTab('wallet')}
                        >
                            <Text
                                style={[
                                    styles.tabText,
                                    {
                                        color:
                                            selectedTab === 'wallet'
                                                ? fixedColors.tabActive
                                                : fixedColors.tabInactive,
                                    },
                                ]}
                            >
                                Wallet Transaction
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.underlineWrapper}>
                        <View
                            style={[
                                styles.fullUnderline,
                                { backgroundColor: fixedColors.underline },
                            ]}
                        />
                        <View
                            style={[
                                styles.activeUnderline,
                                {
                                    width: underlineWidth,
                                    left:
                                        selectedTab === 'transaction'
                                            ? 0
                                            : underlineWidth,
                                },
                            ]}
                        />
                    </View>
                </View>

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
        backgroundColor: '#FFFFFF', // ✅ PURE WHITE TOP FIX
    },
    gradientContainer: {
        flex: 1,
    },
    tabsContainer: {
        paddingTop: 10,
        backgroundColor: '#FFFFFF',
    },
    row: {
        flexDirection: 'row',
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 14,
    },
    tabText: {
        fontSize: 16,
        fontWeight: '600',
    },
    underlineWrapper: {
        position: 'relative',
        height: 2,
    },
    fullUnderline: {
        position: 'absolute',
        width: '100%',
        height: 1,
    },
    activeUnderline: {
        position: 'absolute',
        height: 2,
        backgroundColor: '#00b4db',
    },
    contentContainer: {
        flex: 1,
    },
});

export default History;

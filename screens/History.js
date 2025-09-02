import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, SafeAreaView } from 'react-native';
import TransactionScreen from '../tabs/TransactionScreen';
import WalletTransactionScreen from '../tabs/WalletTransactionScreen';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

const History = ({ navigation }) => {
    const [selectedTab, setSelectedTab] = useState('transaction');
    const underlineWidth = width / 2;

    const renderSelectedScreen = () => {
        if (selectedTab === 'transaction') return <TransactionScreen />;
        if (selectedTab === 'wallet') return <WalletTransactionScreen />;
        return null;
    };

    const fixedColors = {
        tabActive: '#FFFFFF',
        tabInactive: 'rgba(255, 255, 255, 0.7)',
        underline: 'rgba(255, 255, 255, 0.3)',
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient
                colors={['#00b4db', '#E0F7FA', '#FFFFFF']}
                style={styles.gradientContainer}
            >
                <View style={styles.tabsContainer}>
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity style={styles.tab} onPress={() => setSelectedTab('transaction')}>
                            <Text style={[styles.tabText, { color: selectedTab === 'transaction' ? fixedColors.tabActive : fixedColors.tabInactive }]}>
                                Transaction
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.tab} onPress={() => setSelectedTab('wallet')}>
                            <Text style={[styles.tabText, { color: selectedTab === 'wallet' ? fixedColors.tabActive : fixedColors.tabInactive }]}>
                                Wallet Transaction
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.underlineWrapper}>
                        <View style={[styles.fullUnderline, { backgroundColor: fixedColors.underline }]} />
                        <View style={{
                            position: 'absolute',
                            width: underlineWidth,
                            height: 2,
                            backgroundColor: fixedColors.tabActive,
                            left: selectedTab === 'transaction' ? 0 : underlineWidth
                        }} />
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
        paddingVertical: 12,
    },
    tabText: {
        fontSize: 16,
        fontWeight: '600',
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

export default History;
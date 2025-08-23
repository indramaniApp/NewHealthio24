import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, SafeAreaView } from 'react-native';
import TransactionScreen from '../tabs/TransactionScreen';
import WalletTransactionScreen from '../tabs/WalletTransactionScreen';

const { width } = Dimensions.get('window');

const History = () => {
  const [selectedTab, setSelectedTab] = useState('transaction');
  const underlineWidth = width / 2; // 2 tabs

  const renderSelectedScreen = () => {
    if (selectedTab === 'transaction') return <TransactionScreen />;
    if (selectedTab === 'wallet') return <WalletTransactionScreen />;
    return null;
  };

  const fixedColors = {
    background: '#FFFFFF',
    tabActive: '#007AFF',
    tabInactive: '#555555',
    underline: '#E0E0E0',
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: fixedColors.background }}>
      
      {/* Tabs */}
      <View style={{ marginTop: 10 }}>
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

        {/* Underline */}
        <View style={{ position: 'relative', height: 2, marginTop: 4 }}>
          <View style={{ position: 'absolute', width: '100%', height: 2, backgroundColor: fixedColors.underline }} />
          <View style={{
            position: 'absolute',
            width: underlineWidth,
            height: 2,
            backgroundColor: fixedColors.tabActive,
            left: selectedTab === 'transaction' ? 0 : underlineWidth
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
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default History;

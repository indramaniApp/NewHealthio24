import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import Header from '../../../components/Header';
import { COLORS } from '../../../constants';

const CustomerCare = ({navigation}) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <Header title="Customer Care"
      onBackPress={() => navigation.goBack()}
      />
      <View style={styles.container}>
        <Text style={styles.title}>💬 Need Help?</Text>
        <Text style={styles.description}>
          Our team is available 24×7 to support you with any queries or issues.
        </Text>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View style={[styles.iconCircle, { backgroundColor: '#d1f5d3' }]}>
              <Text style={styles.icon}>📞</Text>
            </View>
            <View style={styles.textBlock}>
              <Text style={styles.label}>Helpline</Text>
              <Text style={styles.value}>+91 1800 123 4567</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={[styles.iconCircle, { backgroundColor: '#d1e7f5' }]}>
              <Text style={styles.icon}>📧</Text>
            </View>
            <View style={styles.textBlock}>
              <Text style={styles.label}>Email</Text>
              <Text style={styles.value}>support@healthio24.com</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={[styles.iconCircle, { backgroundColor: '#fce4d6' }]}>
              <Text style={styles.icon}>🕒</Text>
            </View>
            <View style={styles.textBlock}>
              <Text style={styles.label}>Availability</Text>
              <Text style={[styles.value, { color: 'green', fontWeight: 'bold' }]}>
                24×7 Support Available
              </Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CustomerCare;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#f0f4f7',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    color: '#000',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 10,
  },
  infoCard: {
    backgroundColor: COLORS.white,
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 20,
  },
  textBlock: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#34495e',
  },
  value: {
    fontSize: 15,
    color: '#2c3e50',
    marginTop: 2,
  },
});

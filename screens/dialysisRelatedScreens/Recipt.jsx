import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/Header';
import Button from '../../components/Button';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import FileViewer from 'react-native-file-viewer';
import { COLORS } from '../../constants';
import ApiService from '../../src/api/ApiService';
import { ENDPOINTS } from '../../src/constants/Endpoints';

const Recipt = ({ navigation, route }) => {
  const { id } = route.params || {};
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchReceipt();
    }
  }, [id]);

  const fetchReceipt = async () => {
    try {
      setLoading(true);
      const response = await ApiService.get(`${ENDPOINTS.debit_transaction_dialysis_book}/${id}`);
      console.log('Dialysis receipt fetched: ', response.data);
      setReceipt(response.data?.[0]);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to fetch receipt data.');
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = async () => {
    if (!receipt) return;

    const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: Arial; padding: 24px; font-size: 14px; color: #333; }
            h1 { text-align: center; font-size: 20px; margin-bottom: 0; }
            h2 { text-align: center; font-size: 14px; color: #888; margin-top: 4px; }
            .row { display: flex; justify-content: space-between; margin-bottom: 8px; }
            .total { font-weight: bold; border-top: 1px solid #000; padding-top: 8px; }
            .footer { text-align: center; margin-top: 30px; font-size: 13px; color: #666; }
          </style>
        </head>
        <body>
          <h1>Healthio24</h1>
          <h2>Dialysis Receipt / Invoice</h2>
          <div class="row"><div><b>Transaction ID:</b></div><div>${receipt._id}</div></div>
          <div class="row"><div><b>Payment ID:</b></div><div>${receipt.payment_id || '-'}</div></div>
          <div class="row"><div><b>Status:</b></div><div>${receipt.status || 'Paid'}</div></div>
          <div class="row"><div><b>Payment Method:</b></div><div>${receipt.payment_method || '-'}</div></div>
          <div class="row"><div><b>Date:</b></div><div>${receipt.createdAt}</div></div>

          <div class="row" style="margin-top:20px; font-weight: bold;">
            <div>Description</div>
            <div>Amount (₹)</div>
          </div>
          <div class="row">
            <div>${receipt.purpose || 'Dialysis Booking'}</div>
            <div>${receipt.amount}</div>
          </div>

          <div class="row total">
            <div>Total</div>
            <div>₹ ${receipt.amount}</div>
          </div>

          <div class="footer">Thank you for choosing Healthio24!</div>
        </body>
      </html>
    `;

    try {
      const file = await RNHTMLtoPDF.convert({
        html: htmlContent,
        fileName: `DialysisReceipt_${receipt._id}`,
        directory: 'download',
      });
      await FileViewer.open(file.filePath);
      ToastAndroid.show(`PDF saved at: ${file.filePath}`, ToastAndroid.LONG);
    } catch (err) {
      Alert.alert('Error', 'Could not generate or open PDF.');
    }
  };

  const TextItem = ({ label, value }) => (
    <View style={styles.itemRow}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );

  if (loading || !receipt) {
    return (
      <SafeAreaView style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <Header title="Dialysis Receipt" onBackPress={() => navigation.goBack()} />

      <View style={{ flex: 1, padding: 16 }}>
        <View style={styles.card}>
          <Text style={styles.headerText}>Healthio24</Text>
          <Text style={styles.subHeader}>Dialysis Receipt / Invoice</Text>

          <TextItem label="Transaction ID" value={receipt._id} />
          <TextItem label="Payment ID" value={receipt.payment_id || '-'} />
          <TextItem label="Method" value={receipt.payment_method || '-'} />
          <TextItem label="Status" value={receipt.status || 'Paid'} />
          <TextItem label="Date & Time" value={receipt.createdAt} />

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={[styles.text, { fontWeight: 'bold' }]}>Description</Text>
            <Text style={[styles.text, { fontWeight: 'bold' }]}>Amount</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.text}>{receipt.purpose}</Text>
            <Text style={styles.text}>₹ {receipt.amount}</Text>
          </View>

          <View style={[styles.row, { marginTop: 16 }]}>
            <Text style={styles.totalText}>Total</Text>
            <Text style={styles.totalText}>₹ {receipt.amount}</Text>
          </View>

          <Button title="Download PDF" filled style={{ marginTop: 20 }} onPress={generatePDF} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Recipt;

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    padding: 12,
    borderRadius: 16,
    elevation: 2,
    backgroundColor: COLORS.white,
    width: 340,
    alignSelf: 'center',
  },
  headerText: {
    fontSize: 20,
    fontFamily: 'Urbanist Bold',
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
    color: COLORS.gray,
  },
  itemRow: {
    marginTop: 10,
  },
  label: {
    fontSize: 13,
    fontFamily: 'Urbanist Medium',
    color: COLORS.gray,
  },
  value: {
    fontSize: 14,
    fontFamily: 'Urbanist SemiBold',
    color: COLORS.black,
    marginTop: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  text: {
    fontSize: 14,
    fontFamily: 'Urbanist Regular',
    color: COLORS.black,
  },
  totalText: {
    fontSize: 16,
    fontFamily: 'Urbanist Bold',
    color: COLORS.primary,
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 16,
  },
});

import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Alert,
    ToastAndroid,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import FileViewer from 'react-native-file-viewer';
import { useDispatch } from 'react-redux';
import { showLoader, hideLoader } from '../redux/slices/loaderSlice';
import { COLORS } from '../../constants';
import { useTheme } from '../../theme/ThemeProvider';
import Header from '../../components/Header';
import Button from '../../components/Button';

const ViewReceipt = ({ route,navigation }) => {
    const dispatch = useDispatch();
    const { dark } = useTheme();

    const receipt = route?.params?.receiptData?.[0] || {};
    const {
        _id: transaction_id = 'TXN123456',  
        order_id = 'INV0001',
        createdAt = '2025-05-23',
        payment_id = 'pay_1234567890',
        payment_method = 'UPI',
        status = 'Paid',
        amount = 500,
        purpose = 'Consultation Fee',
    } = receipt;

    const generatePDF = async () => {
        dispatch(showLoader());

        const html = `
      <html>
        <head>
          <style>
            body {
              font-family: Arial;
              padding: 24px;
              font-size: 14px;
              color: #333;
            }
            h1 {
              text-align: center;
              font-size: 20px;
              margin-bottom: 0;
            }
            h2 {
              text-align: center;
              font-size: 14px;
              color: #888;
              margin-top: 4px;
            }
            .section { margin-top: 20px; }
            .row { display: flex; justify-content: space-between; margin-bottom: 8px; }
            .table-header { font-weight: bold; border-bottom: 1px solid #ccc; padding-bottom: 6px; }
            .table-row { margin-top: 6px; }
            .total { font-size: 16px; font-weight: bold; margin-top: 12px; border-top: 1px solid #000; padding-top: 6px; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 13px; }
          </style>
        </head>
        <body>
          <h1>Healthio24</h1>
          <h2>Receipt / Tax Invoice</h2>

          <div class="section">
            <div class="row"><div><b>Transaction ID:</b></div><div>${transaction_id}</div></div>
            <div class="row"><div><b>Order No:</b></div><div>${order_id}</div></div>
            <div class="row"><div><b>Date:</b></div><div>${createdAt}</div></div>
            <div class="row"><div><b>Payment ID:</b></div><div>${payment_id}</div></div>
            <div class="row"><div><b>Method:</b></div><div>${payment_method}</div></div>
            <div class="row"><div><b>Status:</b></div><div>${status}</div></div>
          </div>

          <div class="section">
            <div class="table-header row">
              <div>Description</div>
              <div>Amount (₹)</div>
            </div>
            <div class="table-row row">
              <div>${purpose}</div>
              <div>${amount}</div>
            </div>

            <div class="row total">
              <div>Total</div>
              <div>₹ ${amount}</div>
            </div>
          </div>

          <div class="footer">
            Thank you for choosing Healthio24!
          </div>
        </body>
      </html>
    `;

        try {
            const file = await RNHTMLtoPDF.convert({
                html,
                fileName: `Invoice_${order_id}`,
                directory: 'download',
            });
            await FileViewer.open(file.filePath);
            ToastAndroid.show(`PDF saved at: ${file.filePath}`, ToastAndroid.LONG);
        } catch (err) {
            Alert.alert('Error', 'Could not generate or open PDF.');
        } finally {
            dispatch(hideLoader());
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: dark ? COLORS.dark1 : COLORS.white }}>
            <Header title="Invoice" 
                    onBackPress={() => navigation.goBack()}

            />
            <ScrollView contentContainerStyle={styles.container}>
                <View style={[styles.card, { backgroundColor: dark ? COLORS.dark2 : COLORS.white }]}>
                    <Text style={[styles.headerText, { color: dark ? COLORS.white : COLORS.black }]}>Healthio24</Text>
                    <Text style={[styles.subHeader, { color: COLORS.gray }]}>Receipt / Tax Invoice</Text>

                    <TextItem label="Transaction ID" value={transaction_id} dark={dark} />
                    <TextItem label="Order No" value={order_id} dark={dark} />
                    <TextItem label="Payment ID" value={payment_id} dark={dark} />
                    <TextItem label="Date" value={createdAt} dark={dark} />
                    <TextItem label="Method" value={payment_method} dark={dark} />
                    <TextItem label="Status" value={status} dark={dark} />

                    <View style={styles.divider} />

                    <View style={styles.row}>
                        <Text style={[styles.text, { fontWeight: 'bold' }]}>Description</Text>
                        <Text style={[styles.text, { fontWeight: 'bold' }]}>Amount</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.text}>{purpose}</Text>
                        <Text style={styles.text}>₹ {amount}</Text>
                    </View>

                    <View style={[styles.row, { marginTop: 16 }]}>
                        <Text style={[styles.totalText, { color: COLORS.primary }]}>Total</Text>
                        <Text style={[styles.totalText, { color: COLORS.primary }]}>₹ {amount}</Text>
                    </View>
                </View>

                <Button title="Download Invoice PDF" filled style={{ marginTop: 24 }} onPress={generatePDF} />
            </ScrollView>
        </SafeAreaView>
    );
};

const TextItem = ({ label, value, dark }) => (
    <View style={styles.itemRow}>
        <Text style={[styles.label, { color: dark ? COLORS.gray2 : COLORS.gray }]}>{label}</Text>
        <Text style={[styles.value, { color: dark ? COLORS.white : COLORS.black }]}>{value}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        padding: 16,
        paddingBottom: 40,
    },
    card: {
        padding: 20,
        borderRadius: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
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
    },
    sectionTitle: {
        fontSize: 16,
        fontFamily: 'Urbanist Bold',
        marginTop: 12,
        marginBottom: 4,
    },
    text: {
        fontSize: 14,
        fontFamily: 'Urbanist Regular',
    },
    label: {
        fontSize: 13,
        fontFamily: 'Urbanist Medium',
    },
    value: {
        fontSize: 14,
        fontFamily: 'Urbanist SemiBold',
        marginTop: 2,
    },
    itemRow: {
        marginTop: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    divider: {
        height: 1,
        backgroundColor: '#ccc',
        marginVertical: 16,
    },
    totalText: {
        fontSize: 16,
        fontFamily: 'Urbanist Bold',
    },
});

export default ViewReceipt;

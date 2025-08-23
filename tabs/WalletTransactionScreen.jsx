import React, { useCallback, useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    Alert,
    ToastAndroid,
} from 'react-native';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import FileViewer from 'react-native-file-viewer';
import { useDispatch } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import Button from '../components/Button';
import { useTheme } from '../theme/ThemeProvider';
import ApiService from '../src/api/ApiService';
import { ENDPOINTS } from '../src/constants/Endpoints';
import { hideLoader, showLoader } from '../src/redux/slices/loaderSlice';
import { COLORS } from '../constants';

const WalletTransactionScreen = () => {
    const [transactions, setTransactions] = useState([]);
    const dispatch = useDispatch();
    const { dark } = useTheme();


    useFocusEffect(
        useCallback(() => {

            fetchTransactions();
        }, [])
    );
    const fetchTransactions = async () => {
        try {
            dispatch(showLoader());
            const response = await ApiService.get(ENDPOINTS.wallet_debit_transactions);
            console.log('===============Wallet==transactions=================', response.data);
            setTransactions(response?.data || []);
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch transactions');
        } finally {
            dispatch(hideLoader());
        }
    };

    const generatePDF = async (item) => {
        dispatch(showLoader());

        const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: Arial; padding: 24px; font-size: 14px; color: #333; }
            h1 { text-align: center; font-size: 20px; margin-bottom: 0; }
            h2 { text-align: center; font-size: 14px; color: #888; margin-top: 4px; }
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
            <div class="row"><div><b>Transaction ID:</b></div><div>${item._id}</div></div>
            <div class="row"><div><b>Order ID:</b></div><div>${item.order_id}</div></div>
            <div class="row"><div><b>Payment ID:</b></div><div>${item.payment_id}</div></div>
            <div class="row"><div><b>Payment Method:</b></div><div>${item.payment_method}</div></div>
            <div class="row"><div><b>Status:</b></div><div>${item.status || 'Paid'}</div></div>
            <div class="row"><div><b>Date & Time:</b></div><div>${item.createdAt}</div></div>

          </div>

          <div class="section">
            <div class="table-header row">
              <div>Description</div>
              <div>Amount (₹)</div>
            </div>
            <div class="table-row row">
              <div>${item.purpose}</div>
              <div>${item.amount}</div>
            </div>

            <div class="row total">
              <div>Total</div>
              <div>₹ ${item.amount}</div>
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
                html: htmlContent,
                fileName: `Transaction_${item._id}`,
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

    const renderItem = ({ item }) => (
        <View style={[styles.card, { backgroundColor: dark ? COLORS.dark2 : COLORS.white }]}>
            <Text style={[styles.headerText, { color: dark ? COLORS.white : COLORS.black }]}>Healthio24</Text>
            <Text style={[styles.subHeader, { color: COLORS.gray }]}>Receipt / Tax Invoice</Text>

            <TextItem label="Transaction ID" value={item._id} dark={dark} />
            <TextItem label="Order ID" value={item.order_id} dark={dark} />
            <TextItem label="Payment ID" value={item.payment_id} dark={dark} />
            <TextItem label="Method" value={item.payment_method} dark={dark} />
            <TextItem label="Date & Time" value={item.createdAt} dark={dark} />
            <TextItem label="Status" value={item.status || 'Paid'} dark={dark} />

            <View style={styles.divider} />

            <View style={styles.row}>
                <Text style={[styles.text, { fontWeight: 'bold' }]}>Description</Text>
                <Text style={[styles.text, { fontWeight: 'bold' }]}>Amount</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.text}>{item.purpose}</Text>
                <Text style={styles.text}>₹ {item.amount}</Text>
            </View>

            <View style={[styles.row, { marginTop: 16 }]}>
                <Text style={[styles.totalText, { color: COLORS.primary }]}>Total</Text>
                <Text style={[styles.totalText, { color: COLORS.primary }]}>₹ {item.amount}</Text>
            </View>

            <Button
                title="Download PDF"
                filled
                style={{ marginTop: 16 }}
                onPress={() => generatePDF(item)}
            />
        </View>
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: dark ? COLORS.dark1 : COLORS.white }}>

            {transactions.length === 0 ? (
                <ActivityIndicator style={{ marginTop: 40 }} color={COLORS.primary} size="large" />
            ) : (
                <FlatList
                    data={transactions}
                    keyExtractor={(item) => item._id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.container}
                    showsVerticalScrollIndicator={false}
                />
            )}
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
        padding: 10,
        borderRadius: 16,
        elevation: 2,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
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

export default WalletTransactionScreen;

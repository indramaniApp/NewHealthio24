import React, { useCallback, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    SafeAreaView,
    TextInput,
    Modal,
    TouchableOpacity,
    Alert,
    Image,
    Dimensions
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import ApiService from '../../src/api/ApiService';
import { ENDPOINTS } from '../../src/constants/Endpoints';
import { hideLoader, showLoader } from '../../src/redux/slices/loaderSlice';
import RazorpayCheckout from 'react-native-razorpay';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import logo from '../../assets/logo11.jpeg';
import LinearGradient from 'react-native-linear-gradient';
import wallteRing from '../../assets/walletring.png';

const { width } = Dimensions.get('window');
const RAZORPAY_KEY_ID = 'rzp_live_RQTJU3bg9xBPn0';

const WalletScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const [walletDetails, setWalletDetails] = useState({});
    const [transactions, setTransactions] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [amountToAdd, setAmountToAdd] = useState('');

    const fetchWalletDetails = async () => {
        try {
            dispatch(showLoader());
            const walletRes = await ApiService.get(ENDPOINTS.patient_wallet_details);
            const transactionRes = await ApiService.get(ENDPOINTS.wallet_credit_transactions);
            setWalletDetails(walletRes?.data || {});
            const txns = Array.isArray(transactionRes?.data?.transactions)
                ? transactionRes.data.transactions
                : Array.isArray(transactionRes?.data)
                    ? transactionRes.data
                    : [];
            setTransactions(txns);
        } catch (error) {
            Alert.alert('Error', 'Failed to fetch wallet data');
        } finally {
            dispatch(hideLoader());
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchWalletDetails();
        }, [])
    );

    const handlePayment = async (razorpay_order_id) => {
        const options = {
            description: 'Add money to wallet',
            image: logo,
            currency: 'INR',
            key: RAZORPAY_KEY_ID,
            amount: parseFloat(amountToAdd) * 100,
            name: 'Healthio24 Wallet',
            order_id: razorpay_order_id,
            prefill: { email: 'user@example.com', contact: '9999999999', name: 'Patient' },
            theme: { color: '#6366f1' },
        };
        RazorpayCheckout.open(options)
            .then(async (data) => {
                await verifyWalletPayment(data.razorpay_payment_id, data.razorpay_signature, razorpay_order_id);
            })
            .catch((error) => {
                Alert.alert('Payment Failed', error?.description || 'Something went wrong');
            });
    };

    const verifyWalletPayment = async (payment_id, signature, order_id) => {
        try {
            dispatch(showLoader());
            const data = { payment_id, signature, order_id, amount: parseFloat(amountToAdd) };
            const response = await ApiService.post(ENDPOINTS.wallet_payment_verify, data, true, false);
            if (response?.status === 'success') {
                Alert.alert('Success', 'Amount added successfully');
                fetchWalletDetails();
            }
        } catch (error) {
            Alert.alert('Error', 'Payment verification error');
        } finally {
            dispatch(hideLoader());
        }
    };

    const onConfirmAddAmount = async () => {
        const amount = parseFloat(amountToAdd);
        if (isNaN(amount) || amount <= 0) {
            Alert.alert('Invalid Amount', 'Please enter a valid amount');
            return;
        }
        try {
            dispatch(showLoader());
            const response = await ApiService.post(ENDPOINTS.patient_add_money_wallet, { amount }, true, false);
            if (response?.status === 'success') {
                setModalVisible(false);
                setAmountToAdd('');
                handlePayment(response?.data?.razorpay_order_id);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to initiate payment');
        } finally {
            dispatch(hideLoader());
        }
    };

    const renderTransaction = ({ item }) => (
        <View style={styles.transactionCard}>
            <View style={styles.transactionLeft}>
                <View style={styles.iconContainer}>
                    <Icon 
                        name={item.transaction_type === 'credit' ? "plus-circle" : "minus-circle"} 
                        size={22} 
                        color={item.transaction_type === 'credit' ? "#10b981" : "#ef4444"} 
                    />
                </View>
                <View>
                    <Text style={styles.txnPurpose}>{item.purpose || 'Doctor Visit'}</Text>
                    <Text style={styles.txnDate}>{new Date(item.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</Text>
                </View>
            </View>
            <Text style={[styles.txnAmount, { color: item.transaction_type === 'credit' ? "#10b981" : "#333" }]}>
                {item.transaction_type === 'credit' ? '+' : '-'}₹{item.amount}
            </Text>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Attractive Mesh-style Gradient Background */}
            <LinearGradient 
                colors={['#E0E7FF', '#F0F9FF', '#FAF5FF']} 
                start={{x: 0, y: 0}} 
                end={{x: 1, y: 1}} 
                style={styles.gradientBg}
            >
                <SafeAreaView style={{ flex: 1 }}>
                 

                    {/* Attractive Ring Section */}
                    <View style={styles.ringContainer}>
                        <Image source={wallteRing} style={styles.ringImage} resizeMode="contain" />
                        {/* Ring ke center mein balance display (Optional but looks great) */}
                        <View style={styles.centerTextContainer}>
                             <Text style={styles.centerLabel}>Total</Text>
                             <Text style={styles.centerAmount}>₹{Math.floor(walletDetails?.amount ?? 0)}</Text>
                        </View>
                    </View>

                    {/* Balance Card - Updated to Add Balance */}
                    <View style={styles.balanceCard}>
                        <View>
                            <Text style={styles.balanceLabel}>Add Balance</Text>
                            <Text style={styles.balanceValue}>₹{walletDetails?.amount?.toFixed(2) ?? '0.00'}</Text>
                        </View>
                        <TouchableOpacity style={styles.topUpBtn} onPress={() => setModalVisible(true)}>
                            <LinearGradient colors={['#818CF8', '#6366F1']} style={styles.topUpGradient}>
                                <Text style={styles.topUpText}>Add Money</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>

                    {/* Recent Activity Section */}
                    <View style={styles.activityHeader}>
                        <Text style={styles.activityTitle}>Recent Activity</Text>
                       
                    </View>

                    <FlatList
                        data={transactions}
                        keyExtractor={(item, index) => item._id || index.toString()}
                        renderItem={renderTransaction}
                        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={<Text style={styles.emptyText}>No transactions found.</Text>}
                    />
                </SafeAreaView>
            </LinearGradient>

            {/* Modal for adding amount */}
            <Modal visible={modalVisible} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Deposit Funds</Text>
                        <View style={styles.inputWrapper}>
                             <Text style={styles.currencyPrefix}>₹</Text>
                             <TextInput
                                value={amountToAdd}
                                onChangeText={setAmountToAdd}
                                placeholder="0.00"
                                keyboardType="numeric"
                                style={styles.modalInput}
                                autoFocus
                            />
                        </View>
                        <View style={styles.modalActions}>
                            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelBtn}>
                                <Text style={{color: '#9CA3AF', fontWeight: '600'}}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={onConfirmAddAmount} style={styles.confirmBtn}>
                                <Text style={{color: '#FFF', fontWeight: 'bold'}}>Proceed</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default WalletScreen;

const styles = StyleSheet.create({
    container: { flex: 1 },
    gradientBg: { flex: 1 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
    backBtn: { padding: 5 },
    headerTitle: { fontSize: 22, fontWeight: '700', color: '#1F2937', letterSpacing: 0.5 },
    ringContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        height: width * 0.75,
        marginVertical: 10,
    },
    ringImage: {
        width: width * 0.7,
        height: width * 0.7,
    },
    centerTextContainer: {
        position: 'absolute',
        alignItems: 'center',
    },
    centerLabel: { color: '#6B7280', fontSize: 14, fontWeight: '500' },
    centerAmount: { fontSize: 28, fontWeight: 'bold', color: '#111827' },
    balanceCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        marginHorizontal: 20,
        borderRadius: 24,
        padding: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.5)',
        shadowColor: '#6366F1',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
    },
    balanceLabel: { color: '#6B7280', fontSize: 14, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 },
    balanceValue: { fontSize: 26, fontWeight: '800', color: '#1F2937', marginTop: 4 },
    topUpBtn: { overflow: 'hidden', borderRadius: 14 },
    topUpGradient: { paddingVertical: 12, paddingHorizontal: 24 },
    topUpText: { color: '#FFF', fontWeight: '700', fontSize: 14 },
    activityHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 25,
        marginTop: 30,
        marginBottom: 15,
        alignItems: 'center'
    },
    activityTitle: { fontSize: 18, fontWeight: '700', color: '#374151' },
    seeAllText: { color: '#6366F1', fontWeight: '600' },
    transactionCard: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    transactionLeft: { flexDirection: 'row', alignItems: 'center' },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 16,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    txnPurpose: { fontSize: 16, fontWeight: '600', color: '#1F2937' },
    txnDate: { fontSize: 12, color: '#9CA3AF', marginTop: 3 },
    txnAmount: { fontSize: 16, fontWeight: '700' },
    emptyText: { textAlign: 'center', color: '#9CA3AF', marginTop: 40, fontSize: 16 },
    
    // Modal Styles
    modalOverlay: { flex: 1, backgroundColor: 'rgba(17, 24, 39, 0.7)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 30, paddingBottom: 50 },
    modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, color: '#1F2937' },
    inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F9FAFB', borderRadius: 15, paddingHorizontal: 20, marginBottom: 25 },
    currencyPrefix: { fontSize: 24, fontWeight: 'bold', color: '#374151' },
    modalInput: { flex: 1, paddingVertical: 15, paddingHorizontal: 10, fontSize: 24, fontWeight: 'bold', color: '#111827' },
    modalActions: { flexDirection: 'row', justifyContent: 'space-between' },
    cancelBtn: { padding: 15, width: '45%', alignItems: 'center' },
    confirmBtn: { backgroundColor: '#6366F1', padding: 15, borderRadius: 15, width: '48%', alignItems: 'center', shadowColor: '#6366F1', shadowOpacity: 0.3, shadowRadius: 10, elevation: 5 }
});
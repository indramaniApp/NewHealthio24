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

const RAZORPAY_KEY_ID = 'rzp_test_R8LVEozZxuRsqb';

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

    const onAddAmountPress = () => setModalVisible(true);

    const handlePayment = async (razorpay_order_id) => {
        const options = {
            description: 'Add money to wallet',
            image: logo,
            currency: 'INR',
            key: RAZORPAY_KEY_ID,
            amount: parseFloat(amountToAdd) * 100,
            name: 'Healthio24 Wallet',
            order_id: razorpay_order_id,
            prefill: {
                email: 'user@example.com',
                contact: '9999999999',
                name: 'Patient',
            },
            theme: { color: '#0077b6' },
        };
        RazorpayCheckout.open(options)
            .then(async (data) => {
                await verifyWalletPayment(
                    data.razorpay_payment_id,
                    data.razorpay_signature,
                    razorpay_order_id
                );
            })
            .catch((error) => {
                Alert.alert('Payment Failed', error?.description || 'Something went wrong');
            });
    };

    const verifyWalletPayment = async (payment_id, signature, order_id) => {
        try {
            dispatch(showLoader());
            const data = {
                payment_id,
                signature,
                order_id,
                amount: parseFloat(amountToAdd),
            };
            const response = await ApiService.post(
                ENDPOINTS.wallet_payment_verify,
                data,
                true,
                false
            );
            if (response?.status === 'success') {
                Alert.alert('Success', response?.message || 'Amount added successfully');
                fetchWalletDetails();
            } else {
                Alert.alert('Failed', response?.message || 'Payment verification failed');
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
        if (amount > 10000) {
            Alert.alert('Invalid Amount', 'Amount should not exceed ₹10,000');
            return;
        }
        try {
            dispatch(showLoader());
            const payload = { amount };
            const response = await ApiService.post(
                ENDPOINTS.patient_add_money_wallet,
                payload,
                true,
                false
            );
            if (response?.status === 'success') {
                setModalVisible(false);
                setAmountToAdd('');
                handlePayment(response?.data?.razorpay_order_id);
            } else {
                Alert.alert('Error', response?.message || 'Failed to create Razorpay order');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to initiate payment');
        } finally {
            dispatch(hideLoader());
        }
    };

    const renderTransaction = ({ item }) => (
        <View style={[styles.transactionCard, { backgroundColor: '#ffffff' }]}>
            <View style={styles.transactionLeft}>
                <View style={[styles.iconWrapper, { backgroundColor: '#EEF1F5' }]}>
                    <Icon
                        name={item.transaction_type === 'credit' ? 'cash-plus' : 'cash-minus'}
                        size={22}
                        color={item.transaction_type === 'credit' ? '#0f9d58' : '#d9534f'}
                    />
                </View>
                <View>
                    <Text style={[styles.transactionTitle, { color: '#111' }]}>₹{item.amount} - {item.purpose}</Text>
                    <Text style={[styles.transactionDate, { color: '#555' }]}>{new Date(item.createdAt).toLocaleString()}</Text>
                    <Text style={{ fontSize: 12, color: '#555' }}>Method: {item.payment_method}</Text>
                    <Text style={{ fontSize: 12, color: '#555' }}>Txn ID: {item.payment_id}</Text>
                </View>
            </View>
        </View>
    );

    return (

        <SafeAreaView style={styles.container}>

            <LinearGradient
                colors={['#00b4db', '#fff', '#fff', '#fff',]}
                style={styles.gradientContainer}
            >
                <View style={styles.walletCard}>
                    <View style={styles.walletStripe} />
                    <View style={styles.walletContent}>
                        <Icon
                            name="wallet-outline"
                            size={120}
                            color="rgba(0, 180, 219, 0.08)"
                            style={{ position: 'absolute', right: 10, top: 10 }}
                        />
                        <View style={styles.brandCircle}>
                            <Icon name="wallet" size={24} color="#fff" />
                        </View>
                        <Text style={styles.walletLabel}>Wallet Balance</Text>
                        <Text style={styles.walletAmount}>₹{walletDetails?.amount?.toFixed(2) ?? '0.00'}</Text>
                        <Text style={{ color: '#0077b6', fontWeight: 'bold', fontSize: 13, marginBottom: 4 }}>
                            Last Added: ₹{walletDetails?.add_amount?.toFixed(2) ?? '0.00'}
                        </Text>
                        <TouchableOpacity onPress={onAddAmountPress}>
                            <LinearGradient
                                colors={['#00b4db', '#0077b6']}
                                style={styles.addMoneyButton}
                            >
                                <Icon name="plus-circle-outline" size={20} color="#fff" />
                                <Text style={styles.addMoneyText}>Add Money</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>

                <FlatList
                    data={transactions}
                    keyExtractor={(item, index) => item._id || index.toString()}
                    renderItem={renderTransaction}
                    contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 16 }}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={() => (
                        <Text style={{ color: '#999', textAlign: 'center', marginTop: 20 }}>
                            No transactions found.
                        </Text>
                    )}
                />
            </LinearGradient>

            <Modal visible={modalVisible} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Enter Amount</Text>
                        <TextInput
                            value={amountToAdd}
                            onChangeText={setAmountToAdd}
                            placeholder="₹ Amount"
                            placeholderTextColor="#999"
                            keyboardType="numeric"
                            style={styles.input}
                        />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.modalCancel} onPress={() => setModalVisible(false)}>
                                <Text style={{ color: '#0077b6', fontWeight: '600' }}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={onConfirmAddAmount}>
                                <LinearGradient
                                    colors={['#00b4db', '#0077b6']}
                                    style={styles.modalSubmit}
                                >
                                    <Text style={{ color: '#fff', fontWeight: '600' }}>Submit</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

export default WalletScreen;

const styles = StyleSheet.create({
    container: { flex: 1 },

    gradientContainer: {
        flex: 1,
    },
    walletCard: {
        flexDirection: 'row',
        borderRadius: 16,
        overflow: 'hidden',
        marginTop: 30,
        marginHorizontal: 16,
        marginBottom: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 12,
        backgroundColor: '#ffffff',
    },
    walletStripe: { width: 10, backgroundColor: '#0077b6' },
    walletContent: { flex: 1, padding: 24, position: 'relative' },
    walletLabel: { fontSize: 15, marginBottom: 4, fontWeight: '500', color: '#888' },
    walletAmount: { fontSize: 36, fontWeight: 'bold', marginBottom: 10, color: '#000' },
    addMoneyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 18,
        borderRadius: 30,
        alignSelf: 'flex-start',
        elevation: 4,
        marginTop: 10,
    },
    addMoneyText: { color: '#fff', marginLeft: 8, fontSize: 15, fontWeight: '600' },
    brandCircle: {
        position: 'absolute',
        top: 16,
        right: 16,
        backgroundColor: '#0077b6',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 2,
    },
    transactionCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 16,
        marginBottom: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        backgroundColor: '#ffffff',
    },
    transactionLeft: { flexDirection: 'row', alignItems: 'center' },
    iconWrapper: {
        width: 40,
        height: 40,
        borderRadius: 12,
        marginRight: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    transactionTitle: { fontSize: 16, fontWeight: '600' },
    transactionDate: { fontSize: 12, marginTop: 4 },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        paddingHorizontal: 30,
    },
    modalContainer: { borderRadius: 16, padding: 20, backgroundColor: '#FFF' },
    modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12, color: '#000' },
    input: {
        borderBottomWidth: 1,
        padding: 10,
        marginBottom: 20,
        fontSize: 16,
        color: '#000',
        borderBottomColor: '#ccc'
    },
    modalButtons: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' },
    modalCancel: { paddingVertical: 10, paddingHorizontal: 20 },
    modalSubmit: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
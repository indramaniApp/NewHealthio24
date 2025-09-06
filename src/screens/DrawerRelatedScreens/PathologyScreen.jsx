import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    SafeAreaView,
    Platform,
    StatusBar,
    useColorScheme,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

// 1. LinearGradient को इम्पोर्ट करें
import LinearGradient from 'react-native-linear-gradient';

import Header from '../../../components/Header';
import { COLORS } from '../../../constants/theme';
import ApiService from '../../../src/api/ApiService';
import { ENDPOINTS } from '../../../src/constants/Endpoints';

const ICON_COLOR = '#246BFD';
const CIRCLE_BG = 'rgba(36, 107, 253, 0.08)';
const CARD_BG = '#fff';

const testTypes = [
    { id: '1', name: 'CBC', icon: 'clipboard-list' },
    { id: '2', name: 'ESR', icon: 'speedometer' },
    { id: '3', name: 'CRP', icon: 'chart-bar' },
    { id: '4', name: 'HbA1c', icon: 'file-percent' },
    { id: '5', name: 'Blood Group', icon: 'blood-bag' },
    { id: '6', name: 'PT/INR', icon: 'clipboard-pulse' },
    { id: '7', name: 'Blood Sugar', icon: 'test-tube' },
    { id: '8', name: 'Thyroid Profile', icon: 'pulse' },
    { id: '9', name: 'Lipid Profile', icon: 'chart-bar' },
    { id: '10', name: 'Liver Function Test (LFT)', icon: 'clipboard-pulse' },
    { id: '11', name: 'Kidney Function Test (KFT)', icon: 'water' },
    { id: '12', name: 'Electrolyte Panel', icon: 'sack-percent' },
    { id: '13', name: 'Vitamin D', icon: 'white-balance-sunny' },
    { id: '14', name: 'Vitamin B12', icon: 'pill' },
    { id: '15', name: 'Calcium', icon: 'chemical-weapon' },
    { id: '16', name: 'Phosphorus', icon: 'atom-variant' },
    { id: '17', name: 'Urine Test', icon: 'flask-outline' },
    { id: '18', name: 'Stool Test', icon: 'toilet' },
    { id: '19', name: 'Pregnancy Test', icon: 'baby' },
    { id: '20', name: 'Semen Analysis', icon: 'gender-transgender' },
    { id: '21', name: 'Malaria', icon: 'bug' },
    { id: '22', name: 'Dengue', icon: 'mosquito', library: 'FontAwesome6' },
    { id: '23', name: 'COVID-19', icon: 'virus' },
    { id: '24', name: 'Widal Test', icon: 'bacteria' },
    { id: '25', name: 'HIV', icon: 'gender-transgender' },
    { id: '26', name: 'Hepatitis B', icon: 'bio' },
    { id: '27', name: 'Hepatitis C', icon: 'bio' },
    { id: '28', name: 'ASO Titre', icon: 'clipboard-list' },
    { id: '29', name: 'Rheumatoid Factor', icon: 'test-tube' },
    { id: '30', name: 'ANA', icon: 'file-percent' },
    { id: '31', name: 'Procalcitonin', icon: 'test-tube-off' },
    { id: '32', name: 'D-Dimer', icon: 'test-tube-empty' },
    { id: '33', name: 'X-Ray', icon: 'x-ray', library: 'FontAwesome6' },
    { id: '34', name: 'Ultrasound', icon: 'baby' },
    { id: '35', name: 'MRI', icon: 'brain' },
    { id: '36', name: 'CT Scan', icon: 'camera-burst' },
    { id: '37', name: 'PET Scan', icon: 'react' },
    { id: '38', name: 'Echo', icon: 'heart-pulse' },
    { id: '39', name: 'ECG', icon: 'heart-pulse' },
    { id: '40', name: 'Other', icon: 'dots-horizontal' },
];

const categories = {
    'Complete Blood Tests': ['CBC', 'ESR', 'CRP', 'HbA1c', 'Blood Group', 'PT/INR'],
    'Blood Sugar': ['Blood Sugar'],
    'Thyroid Profile': ['Thyroid Profile'],
    'Lipid Profile': ['Lipid Profile'],
    'Liver Function Test': ['Liver Function Test (LFT)'],
    'Kidney Function Test': ['Kidney Function Test (KFT)'],
    'Electrolyte Panel': ['Electrolyte Panel'],
    'Vitamin Tests': ['Vitamin D', 'Vitamin B12'],
    'Mineral Tests': ['Calcium', 'Phosphorus'],
    'Urine & Stool': ['Urine Test', 'Stool Test', 'Pregnancy Test', 'Semen Analysis'],
    'Infection & Disease Panels': [
        'Malaria', 'Dengue', 'COVID-19', 'Widal Test', 'HIV', 'Hepatitis B',
        'Hepatitis C', 'ASO Titre', 'Rheumatoid Factor', 'ANA', 'Procalcitonin', 'D-Dimer'
    ],
    'Imaging & Diagnostics': ['X-Ray', 'Ultrasound', 'MRI', 'CT Scan', 'PET Scan', 'Echo', 'ECG'],
};

const categorizedData = {};
Object.entries(categories).forEach(([category, tests]) => {
    categorizedData[category] = testTypes.filter(item => tests.includes(item.name));
});
categorizedData['Other'] = testTypes.filter(
    item => !Object.values(categories).flat().includes(item.name)
);

const renderIcon = (icon, library, color, size = 20) => {
    switch (library) {
        case 'FontAwesome6':
            return <FontAwesome6 name={icon} size={size} color={color} />;
        case 'FontAwesome5':
            return <FontAwesome5 name={icon} size={size} color={color} />;
        default:
            return <MaterialCommunityIcons name={icon} size={size} color={color} />;
    }
};

const getScreenNameFromCategory = (category) => {
    if (category === 'Other') return 'OtherTests';
    return category.replace(/\s+/g, '').replace(/[^a-zA-Z]/g, '');
};

const PathologyScreen = () => {
    const isDarkMode = useColorScheme() === 'dark';
    const [searchQuery, setSearchQuery] = useState('');
    const [cartCount, setCartCount] = useState(0);
    const navigation = useNavigation();

    const fetchCartCount = async () => {
        try {
            const response = await ApiService.get(ENDPOINTS.get_cart_count, true);
            const count = response?.data || 0;
            setCartCount(count);
        } catch (error) {
            console.log('Cart count error:', error.message);
        }
    };

    useFocusEffect(useCallback(() => { fetchCartCount(); }, []));

    return (
        <SafeAreaView style={styles.safeArea}>
         
            <LinearGradient
                colors={['#00b4db', '#E0F7FA', '#FFFFFF']}
                style={{ flex: 1 }}
            >
                <Header
                    title="Test List"
                    showCart
                    cartCount={cartCount}
                    onBackPress={() => navigation.goBack()}
                    onCartPress={() => navigation.navigate('CartScreen')}
               
                    style={{ backgroundColor: 'transparent' }} 
                />

                <View style={styles.searchBarWrapper}>
                    <Icon name="search" size={16} style={styles.searchIcon} />
                    <TextInput
                        placeholder="Search tests..."
                        placeholderTextColor="#999"
                        style={styles.searchInput}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                <ScrollView contentContainerStyle={{ padding: 16 }} showsVerticalScrollIndicator={false}>
                    {[
                        ...Object.entries(categorizedData).filter(([key]) => key !== 'Other'),
                        ['Other', categorizedData['Other']],
                    ].map(([category, tests]) => {
                        const filteredTests = tests.filter(test =>
                            test.name.toLowerCase().includes(searchQuery.toLowerCase())
                        );
                        if (filteredTests.length === 0) return null;

                        return (
                            <TouchableOpacity
                                key={category}
                                style={styles.card}
                                onPress={() => navigation.navigate(getScreenNameFromCategory(category))}
                            >
                                <Text style={styles.cardTitle}>{category} ({filteredTests.length})</Text>
                                <View style={styles.testGrid}>
                                    {filteredTests.map(test => (
                                        <View key={test.id} style={styles.testItem}>
                                            <View style={styles.iconCircle}>
                                                {renderIcon(test.icon, test.library, ICON_COLOR, 20)}
                                            </View>
                                            <Text style={styles.testLabel} numberOfLines={2}>
                                                {test.name}
                                            </Text>
                                        </View>
                                    ))}
                                </View>
                                <TouchableOpacity
                                    style={styles.cardButton}
                                    onPress={() => navigation.navigate(getScreenNameFromCategory(category))}
                                >
                                    <Text style={styles.cardButtonText}>Check Details & Book tests</Text>
                                </TouchableOpacity>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
};

export default PathologyScreen;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    searchBarWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '92%',
        height: 44,
        marginVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 30,
        backgroundColor: '#F0F6FF',
        alignSelf: 'center',
    },
    searchIcon: {
        marginRight: 10,
        color: COLORS.primary,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: COLORS.black,
    },
    card: {
        backgroundColor: CARD_BG,
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
    },
    cardTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 12,
        color: COLORS.primary,
    },
    testGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
    },
    testItem: {
        width: '20%',
        alignItems: 'center',
        marginBottom: 16,
    },
    iconCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#E8F0FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 6,
    },
    testLabel: {
        fontSize: 12,
        textAlign: 'center',
        color: COLORS.greyscale900,
        fontWeight: '500',
    },
    cardButton: {
        marginTop: 12,
        alignSelf: 'center',
        backgroundColor: '#E0ECFF',
        borderRadius: 24,
        paddingHorizontal: 24,
        paddingVertical: 10,
    },
    cardButtonText: {
        color: '#1A5AC3',
        fontWeight: '600',
        fontSize: 13,
    },
});
import { StyleSheet, Text, View, TouchableOpacity, Alert, ScrollView } from 'react-native';
import React from 'react';
import Header from '../components/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const AccountDeletion = () => {
    const navigation = useNavigation();

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('USER_TOKEN');
            await AsyncStorage.removeItem('USER_ROLE');
            navigation.replace('Login');
        } catch (error) {
            console.error("Error logging out: ", error);
        }
    };

    const handleDeleteAccount = () => {
        Alert.alert(
            'Confirm Deletion',
            'Are you sure you want to delete your account? This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => handleLogout(), // Calls logout on confirm
                },
            ]
        );
    };

    return (
        <>
            <Header title={'Delete Account'} />
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.container}>
                    <Text style={styles.title}>Data Deletion</Text>
                    <Text style={styles.description}>
                        {'\u2022'} Deleting your account is a permanent action that will result in the loss of all your data.{"\n\n"}
                        {'\u2022'} After deletion, do not log into the app for 90 days for your account to be permanently removed from the system.{"\n\n"}
                        {'\u2022'} If you have any active subscriptions or purchases, cancel them beforehand to avoid additional charges.{"\n\n"}
                        {'\u2022'} Account recovery might not be possible once deleted, so please consider carefully before proceeding.{"\n\n"}
                        {'\u2022'} Need help? Contact Healthio24 support at:{"\n"}
                        helthio24official@gmail.com
                    </Text>

                    <TouchableOpacity style={styles.button} onPress={handleDeleteAccount}>
                        <Text style={styles.buttonText}>Delete My Account</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </>
    );
};

export default AccountDeletion;

const styles = StyleSheet.create({
    scrollContainer: {
        paddingBottom: 40,
    },
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
        justifyContent: 'flex-start',
        
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#d32f2f',
    },
    description: {
        fontSize: 16,
        color: '#333',
        marginBottom: 30,
        lineHeight: 24,
    },
    button: {
        backgroundColor: '#d32f2f',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

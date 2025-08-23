import AsyncStorage from "@react-native-async-storage/async-storage";

const StorageHelper = {
    setItem: async (key, value) => {
        try {
            await AsyncStorage.setItem(key, JSON.stringify(value));
            console.log(`Saved: ${key} ->`, value);
        } catch (error) {
            console.error(`Error storing data (${key}):`, error);
        }
    },

    getItem: async (key) => {
        try {
            const value = await AsyncStorage.getItem(key);
            console.log(`Retrieved: ${key} ->`, value);
            return value ? JSON.parse(value) : null;
        } catch (error) {
            console.error(`Error retrieving data (${key}):`, error);
            return null;
        }
    },

    removeItem: async (key) => {
        try {
            await AsyncStorage.removeItem(key);
            console.log(`Removed: ${key}`);
        } catch (error) {
            console.error(`Error removing data (${key}):`, error);
        }
    },
};

export default StorageHelper;

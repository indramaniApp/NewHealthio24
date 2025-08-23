import { View, StyleSheet, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { COLORS } from '../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import { categories } from '../data';
import Category from '../components/Category';
import { useTheme } from '../theme/ThemeProvider';
import { useDispatch } from 'react-redux';
import { showLoader, hideLoader } from '../src/redux/slices/loaderSlice';

const Categories = ({ navigation }) => {
  const [filteredCategories, setFilteredCategories] = useState([]);
  const { colors } = useTheme();
  const dispatch = useDispatch();

  useEffect(() => {
    const loadCategories = async () => {
      dispatch(showLoader());
      setTimeout(() => {
        const newCategories = categories.filter(item => item.name !== 'More');
        setFilteredCategories(newCategories);
        dispatch(hideLoader());
      }, 500);
    };

    loadCategories();
  }, []);

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header
        title="More Categories"
        onBackPress={() => navigation.goBack()}
      />
        <FlatList
          data={filteredCategories}
          numColumns={4}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.flatListContent}
          renderItem={({ item }) => (
            <Category
              name={item.name}
              icon={item.icon}
              iconColor={item.iconColor}
              backgroundColor={item.backgroundColor}
              onPress={() =>
                navigation.navigate('CategoriesScreen', { categoryName: item.name })
              }
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 16,
  },
  flatListContent: {
    paddingTop: 22,
    paddingBottom: 50, 
  },
});

export default Categories;

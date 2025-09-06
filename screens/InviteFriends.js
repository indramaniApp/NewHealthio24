import { View, StyleSheet, FlatList } from 'react-native';
import React from 'react';
import { COLORS } from '../constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import { ScrollView } from 'react-native-virtualized-view';
import { friends } from '../data';
import InviteFriendCard from '../components/InviteFriendCard';
import { useTheme } from '../theme/ThemeProvider';
import LinearGradient from 'react-native-linear-gradient';

const InviteFriends = ({navigation}) => {
  return (
    <SafeAreaView style={styles.area}>
      <LinearGradient
        colors={['#00b4db', '#fff', '#fff', '#fff', '#fff']}
        style={styles.gradientContainer}
      >
        <View style={styles.container}>
          <Header title="Invite Friends"
          onBackPress={() => navigation.goBack()}
          />
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}>
            <FlatList
              data={friends}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <InviteFriendCard
                  name={item.name}
                  phoneNumber={item.phoneNumber}
                  avatar={item.avatar}
                />
              )}
            />
          </ScrollView>
        </View>
      </LinearGradient>
    </SafeAreaView>
  )
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
  },
  gradientContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  scrollView: {
    paddingVertical: 22
  }
})

export default InviteFriends;
import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigation from './navigations/AppNavigation';
import { LogBox, StatusBar, View } from 'react-native'; 
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Loader from './components/Loader';
import { useSelector } from 'react-redux';
import Orientation from 'react-native-orientation-locker';
import 'react-native-reanimated';

LogBox.ignoreAllLogs();

const App = () => {
  let loading = useSelector(state => state.loader.isLoading);

  useEffect(() => {
    Orientation.lockToPortrait();

    return () => {
      Orientation.unlockAllOrientations();
    };
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Loader visible={loading} />

   
      <View style={{ flex: 1, backgroundColor: '#00b4db' }}>
        <SafeAreaProvider>
  
          <StatusBar
            barStyle="light-content"
            backgroundColor="#00b4db"
            translucent={false}
          />
          <AppNavigation />
        </SafeAreaProvider>
      </View>
      
    </GestureHandlerRootView>
  );
};

export default App;
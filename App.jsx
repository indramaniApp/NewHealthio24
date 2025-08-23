import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigation from './navigations/AppNavigation';
import { LogBox, StatusBar, useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Loader from './components/Loader';
import { useSelector } from 'react-redux';
import Orientation from 'react-native-orientation-locker';
import 'react-native-reanimated';

LogBox.ignoreAllLogs();

const App = () => {
  let loading = useSelector(state => state.loader.isLoading);
  const theme = useColorScheme();

  
  useEffect(() => {
    Orientation.lockToPortrait(); 

    return () => {
      Orientation.unlockAllOrientations(); 
    };
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Loader visible={loading} />
      <SafeAreaProvider>
        <StatusBar
          barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
          backgroundColor={theme === 'dark' ? 'black' : 'transparent'}
          translucent={true}
        />
        <AppNavigation />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;

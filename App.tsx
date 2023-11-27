import React from 'react';
import { LogBox  } from 'react-native';
import { Provider } from 'react-redux';
import Main from './screens/Main';
import { store } from './store';
import { SafeAreaProvider } from 'react-native-safe-area-context';
LogBox.ignoreLogs(['componentWillMount', 'componentWillReceiveProps']);

const App = () => {
  return (
    <SafeAreaProvider>
    <Provider store={store}>
      <Main />
    </Provider>
    </SafeAreaProvider>
  );
};

export default App;

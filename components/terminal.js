import React from 'react';
import { Alert, View, Text, StyleSheet, NativeModules, Button } from 'react-native';


export default class App extends React.Component {
  render() {
    const titleText = "Terminal Service running in background";
      return (
          <View style={{ margin: 30, flex: 1, justifyContent: 'space-evenly', alignItems: 'center' }}>
          <Text style={styles.titleText} >
             {titleText}
           </Text>


                {NativeModules.Terminal.navigateToTerminal()}



          </View>
        );

  }
}



const styles = StyleSheet.create({

  titleText: {
  fontSize: 15,
  color: 'white',
  fontWeight: "bold"
}
});

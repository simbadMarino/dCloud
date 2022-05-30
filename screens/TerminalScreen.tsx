import React from 'react';
import { Alert, View, Text, StyleSheet, Button, Platform, NativeModules } from 'react-native';


export default class App extends React.Component {
  render() {
    console.log(Platform.OS);
    if(Platform.OS == 'ios')
    {
      const titleText = "iOS terminal, Work in progress... If you really need to send BTFS commands use the BTFS commands sender in Settings";

      return (
          <View style={{ margin: 30, flex: 1, justifyContent: 'space-evenly', alignItems: 'center' }}>
          <Text style={styles.titleText} >
             {titleText}
           </Text>
           <Text >{Platform.OS}</Text>





          </View>
        );
    }
    else if(Platform.OS == 'android')
    {
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
}



const styles = StyleSheet.create({

  titleText: {
  fontSize: 15,
  color: '#545A5D',
  fontWeight: "bold"
}
});

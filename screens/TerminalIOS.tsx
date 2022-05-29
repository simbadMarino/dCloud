import React from 'react';
import { Alert, View, Text, StyleSheet, Button, Platform } from 'react-native';


export default class App extends React.Component {
  render() {
    const titleText = "iOS terminal :)";
      return (
          <View style={{ margin: 30, flex: 1, justifyContent: 'space-evenly', alignItems: 'center' }}>
          <Text style={styles.titleText} >
             {titleText}
           </Text>
           <Text >{Platform.OS}</Text>





          </View>
        );

  }
}



const styles = StyleSheet.create({

  titleText: {
  fontSize: 15,
  color: '#545A5D',
  fontWeight: "bold"
}
});

import React from 'react';
import { Alert, View, Text, StyleSheet, Button, Platform, NativeModules } from 'react-native';


export default class App extends React.Component {
  render() {

      const titleText = "Work in progres (•̀ᴗ•́ )و. \n\n\nThanks for using dCloud!\n\n(∩｀-´)⊃━☆ﾟ.*･｡ﾟ\n"



      return (
          <View style={{ margin: 30, flex: 1, justifyContent: 'space-evenly', alignItems: 'center' }}>
          <Text style={styles.titleText} >
             {titleText}
           </Text>





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

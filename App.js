import 'react-native-gesture-handler';
import React, { Component, useState } from 'react';
import { StyleSheet, Text, View, Button, Alert, Switch,TouchableOpacity, TextInput, Image} from 'react-native';
//import Overlay from 'react-native-modal-overlay';
import axios from 'axios';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon, Input } from 'react-native-elements';
import FilePicker from "./components/filePicker.js";
import {strTronAddress} from "./components/filePicker.js";
import LoginScreen from "./components/Login.js";
import Terminal from "./components/terminal.js";
import { WebView } from 'react-native-webview';
import { AppearanceProvider } from 'react-native-appearance';
import { Dimensions } from 'react-native';
import { RefreshControl, SafeAreaView, ScrollView} from 'react-native';
import { QRCode } from 'react-native-custom-qr-codes';
import prompt from 'react-native-prompt-android';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Clipboard from '@react-native-clipboard/clipboard';

var configText = "";
var configStorageClientEnabled = "";
var configStorageHostEnabled = "";
var configHostRepairEnabled = "";
var btfsVersion = "";
var systemCurrentDate = "";
var BTFSNodeID = "";
var walletPassword = "";
var amountToDeposit = "";

const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

function getNodeID() {
    //console.log('Getting Node ID data..')
  	var response =  axios.post('http://localhost:5001/api/v1/id')
  .then(function (response) {
      //alert(response.data.ID);
      BTFSNodeID = response.data.ID;
    })
  }

function setWalletPassword(){
try{
          var passwordSetResp =  axios.post('http://localhost:5001/api/v1/wallet/password?arg='+ walletPassword)
           .then(function (passwordSetResp) {

           // float_btfsBalance = walletBalance.data.BtfsWalletBalance;
            //float_bttBalance = walletBalance.data.BttWalletBalance;
            console.log(passwordSetResp);
            //console.log("BTT balance: " + float_bttBalance);
            })
}
catch (err) {
                throw err;
            }
}

function depositBTT(){

try{

    var depositBTT_resp =  axios.post('http://localhost:5001/api/v1/wallet/deposit?arg=' + amountToDeposit*1000000 + '&a=&p='+ walletPassword)
           .then(function (depositBTT_resp) {

           // float_btfsBalance = walletBalance.data.BtfsWalletBalance;
            //float_bttBalance = walletBalance.data.BttWalletBalance;
            console.log(depositBTT_resp);
            //console.log("BTT balance: " + float_bttBalance);
            })

    }

    catch (err) {

                throw err;

            }


}

function getCommands() {

	var response =  axios.post('http://localhost:5001/api/v1/wallet/balance?')
  .then(function (response) {
      console.log(response.data);
    })


}

function getRepoData(){
    var repoData = axios.post("http://localhost:5001/api/v1/stats/repo?size-only=true")
    .then(function (repoData) {
          console.log(repoData.data)
          alert((repoData.data.StorageMax)/1000000000 + " GB");
        })



}

function addFileReedSolomon(){
    var repoData = axios.post("http://localhost:5001/api/v1/stats/repo?size-only=true")
    .then(function (repoData) {
          console.log(repoData.data)
          alert((repoData.data.StorageMax)/1000000000 + " GB");
        })

}


function getConfig() {

  var configDATA = axios.post("http://localhost:5001/api/v1/config/show")
  .then(function (configDATA) {
    //console.log(configDATA.headers.Wallet);
    btfsVersion = configDATA.headers.server;
    systemCurrentDate = configDATA.headers.date;
    configStorageClientEnabled = configDATA.data.Experimental.StorageClientEnabled;
    configStorageHostEnabled = configDATA.data.Experimental.StorageHostEnabled;
    configHostRepairEnabled = configDATA.data.Experimental.HostRepairEnabled;
    alert("BTFS version: " + btfsVersion + "\n" + "System Date: " + systemCurrentDate + "\n" + "Host Storage enabled?: " + configStorageHostEnabled + "\n" + "Renter Storage enabled?: " + configStorageClientEnabled + "\n" + "Host Repair enabled?: " + configHostRepairEnabled);


  })
}

function promptPassword() {

prompt(
    'Set password',
    'Input a new password below',
    [
     {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
     {text: 'OK', onPress: password => {
         console.log('OK Pressed, password: ' + password);
         walletPassword = password;
         console.log(walletPassword);
         setWalletPassword();

     }
     },
    ],
    {
        type: 'secure-text',
        cancelable: false,
        defaultValue: '',
        placeholder: 'New password'
    }
);


}

function depositToBTFS() {

prompt(
    'Deposit BTT to BTFS',
    'How much BTT?',
    [
     {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
     {text: 'OK', onPress: BTTamount => {
         console.log('OK Pressed, BTT amount: ' + BTTamount);
         amountToDeposit = BTTamount;
         console.log(amountToDeposit);
         promptCurrentPassword();
     }
     },
    ],
    {
        type: 'number',
        cancelable: false,
        defaultValue: '',
        placeholder: 'Deposit Amount'
    }
);




}

function promptCurrentPassword() {

prompt(
    'Enter password',
    'for security...',
    [
     {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
     {text: 'OK', onPress: password => {
         console.log('OK Pressed, password: ' + password);
         walletPassword = password;
         console.log(walletPassword);
         depositBTT();

     }
     },
    ],
    {
        type: 'secure-text',
        cancelable: false,
        defaultValue: '',
        placeholder: 'Password'
    }
);


}





function initBTFS() {
      //console.log('Getting Node ID data..')
    //	var response =  axios.post('http://localhost:5001/api/v1/id')
    //.then(function (response) {
        alert("Initializing BTFS daemon in the background...");

    //  })
    }

function deinitBTFS() {

    alert("Shutting down BTFS daemon in the background...");
}

function updatePassword(){


}

function importNodePK(){



}

function NodeScreen() {
   const titleText = "Host View";
   let WebViewRef;
   const [refreshing, setRefreshing] = React.useState(false);

     const onRefresh = React.useCallback(() => {
       setRefreshing(true);
       WebViewRef && WebViewRef.reload();
       console.log("Entering refreshing...");
       console.log(refreshing);
       wait(1000).then(() => setRefreshing(false));

     });

    return (
     <SafeAreaView >
          <ScrollView
            contentContainerStyle={styles.scrollView}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }
          >
            <Text
            style={styles.controlsText}
            >Pull down to refresh</Text>
            <WebView
              ref={WEBVIEW_REF => (WebViewRef = WEBVIEW_REF)}
              source={{uri: 'http://127.0.0.1:5001/hostui'}}
              style={styles.hostView}
              //startInLoadingState={true}
            />

          </ScrollView>
        </SafeAreaView>


    );
}

function RenterScreen() {
  const titleText = "Renter View";
  getNodeID();
  return (
    <View style={{flex: 1, justifyContent: 'space-evenly', alignItems: 'center', backgroundColor: '#3C3C42'}}>
      <FilePicker/>
    </View>
  );
}

function TerminalScreen() {
  //const titleText = "Renter View";
  return (
    <View style={{flex: 1, justifyContent: 'space-evenly', alignItems: 'center', backgroundColor: '#3C3C42' }}>
      <Terminal/>
    </View>
  );
}

function StatsScreen() {
const titleText = "Node Info";

const [copiedText, setCopiedText] = useState('');

const copyToClipboard = () => {
    Clipboard.setString(strTronAddress);
  };

  const fetchCopiedText = async () => {
      const text = await Clipboard.getString();
      setCopiedText(text);
    };


  return (
    <View style={{flex: 1, justifyContent: 'space-evenly', alignItems: 'center', backgroundColor: '#3C3C42' }}>




    <QRCode content= {strTronAddress}
            logoSize = {50}
            size = {200}
            logo={require('./components/tronlogo.png')}

            />
    <Text
    selectable = {true}
    style={styles.controlsText}
    >
      {strTronAddress}
    </Text>

    <TouchableOpacity style={styles.copyButton}
             onPress={copyToClipboard}
             >
               <Text style={styles.tabMenuText}>
               Copy Addy</Text>
     </TouchableOpacity>


     <TouchableOpacity style={styles.tabsButton}
             onPress={depositToBTFS}
             >
               <Text style={styles.tabMenuText}>
               Deposit BTT</Text>
     </TouchableOpacity>
    </View>
  );

 }







function applyRenter() {

  var renterApplyDATA = axios.post("http://localhost:5001/api/v1/config/profile/apply?arg=storage-client")
  .then(function (renterApplyDATA) {
    console.log("Debug: ---Enabling StorageClientEnabled.... ")
    console.log(renterApplyDATA);
    //renterApplyDATA = configDATA.statusText;


  })
  }

function applyHost() {

  var hostApplyDATA = axios.post("http://localhost:5001/api/v1/config/profile/apply?arg=storage-host")
  .then(function (hostApplyDATA) {
    console.log("Debug: ---Enabling StorageHostEnabled.... ")
    console.log(hostApplyDATA);
    //renterApplyDATA = configDATA.statusText;


  })
  }



function SettingsScreen() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isEnabledHost, setIsEnabledHost] = useState(false);
  const [isEnabledBTFS, setIsEnabledBTFS] = useState(false);


  const toggleSwitchRenter = () => {
  if(isEnabled == false){   //BTFS Storage Rental activated?
    applyRenter();
  }
  else{
  //BTFS do not have a way to deactivate renter yet
  }
  setIsEnabled(previousState => !previousState);

  }



  const toggleSwitchHost = () => {
  if(isEnabledHost == false){   //BTFS Storage Rental activated?
    applyHost();
  }
  else{
  //BTFS do not have a way to deactivate host yet
  }
  setIsEnabledHost(previousState => !previousState);

  }
  const titleText = "BTFS node Configuration";
  const nodeModeText = "Node Mode";
  var [value, onChangeText] = React.useState(configText);




  return (
    <View style={{flex: 1, justifyContent: 'space-evenly', alignItems: 'center', backgroundColor: '#3C3C42' }}>
    <Text style={styles.titleText} >
       {titleText}
     </Text>





      <Text style={styles.controlsText} >
                {isEnabled ? 'Renter Enabled' : 'Renter Disabled'}
                </Text>
        <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitchRenter}
            value={isEnabled}
          />

        <Text style={styles.controlsText} >
              {isEnabledHost ? 'Host Enabled' : 'Host Disabled'}
              </Text>
        <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isEnabledHost ? "#f5dd4b" : "#f4f3f4"}
            ios_backgroundColor="#3e3e5e"
            onValueChange={toggleSwitchHost}
            value={isEnabledHost}
          />




         <TouchableOpacity style={styles.tabsButton}
                          onPress={getConfig.bind(this)}
                          >
                            <Text style={styles.tabMenuText}>
                            Get BTFS Data</Text>
         </TouchableOpacity>

         <TouchableOpacity style={styles.tabsButton}
                 onPress={promptPassword}
                 >
                   <Text style={styles.tabMenuText}>
                   Set Password</Text>
         </TouchableOpacity>


    </View>
  );
}

const Tab = createBottomTabNavigator();

export default class App extends Component{

  render() {

       return (
    <AppearanceProvider>
        <NavigationContainer theme={DarkTheme}>
         <Tab.Navigator screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;

                if (route.name === 'Node') {
                  iconName = focused ? 'poll' : 'poll';
                }
                  else if (route.name === 'Settings') {
                  iconName = focused ? 'settings' : 'settings';
                }
                  else if (route.name === 'Files') {
                  iconName = focused ? 'storage' : 'storage';
                }
                  else if (route.name === 'Terminal') {
                  iconName = focused ? 'screen-share' : 'screen-share';
                }



                // You can return any component that you like here!
                return <Icon name={iconName} size={size} color={color} />;
              },
            })}
            tabBarOptions={{
              activeTintColor: 'white',
              inactiveTintColor: 'gray',
            }}
          >

           <Tab.Screen name="Files" component={RenterScreen} />
           <Tab.Screen name="Terminal" component={TerminalScreen} />
           <Tab.Screen name="Settings" component={SettingsScreen} />
           <Tab.Screen name="Node" component={StatsScreen} />


         </Tab.Navigator>
       </NavigationContainer>
   </AppearanceProvider>
    );

  }
}


const styles = StyleSheet.create({
  switchSts: {
      flex: 1,
      justifyContent: "center"
    },
    scrollView: {
        flex: 1,
        backgroundColor: '#525248',
        alignItems: 'center',
        justifyContent: 'center',
      },
  container: {
      flex: 1,
      backgroundColor: '#3C3C42',
      alignItems: 'center',
      justifyContent: 'center',
    },
  titleText: {
  fontSize: 20,
  color: 'white',
  fontWeight: "bold"
},
   hostView: {
    marginTop: 10,
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    flex: 1
  },
  horizontal: {
      flexDirection: "row",
      justifyContent: "space-around",
      padding: 10
    },
  controlsText: {
  fontSize: 15,
  color: 'white',
  //fontWeight: "normal"
},
tabsButton:{
    width:"50%",
    backgroundColor:"white",
    borderRadius:25,
    height:50,
    alignItems:"center",
    justifyContent:"center",
    marginTop:40,
    marginBottom:10
  },

  copyButton:{
      width:"30%",
      backgroundColor:"#6495ed",
      borderRadius:15,
      height:40,
      alignItems:"center",
      justifyContent:"center",
      marginTop:1,
      marginBottom:5
    },
  tabMenuText:{
      color:"black"
    }
});
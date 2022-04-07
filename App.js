import 'react-native-gesture-handler';
import React, { Component, useState } from 'react';
import { StyleSheet, Text, View, Button, Alert, Switch,TouchableOpacity, TextInput, Image, NativeModules, ToastAndroid, Share} from 'react-native';
//import Overlay from 'react-native-modal-overlay';
import axios from 'axios';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon, Input, Card, Divider} from 'react-native-elements';
import FilePicker from "./components/filePicker.js";
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
import { RootSiblingParent } from 'react-native-root-siblings';
import Toast from 'react-native-root-toast';
import {Picker} from '@react-native-picker/picker';
//import Toast from "./components/Toast.js";
const BigNumber = require('bignumber.js');


// ----------------------------- START OF MODULE VARS --------------------------------------//
var configText = "";
var configStorageClientEnabled = "";
var configStorageHostEnabled = "";
var configHostRepairEnabled = "";
var btfsVersion = "";
var systemCurrentDate = "";
var BTFSNodeID = "";
var walletPassword = "";
var amountToDeposit = 0;
var float_bttBalance = 0;
var float_WBTT_Balance = 0;
var float_Vault_WBTT_Balance = 0;
var strBTTCAddress = " ";
var strVaultAddress = " ";
var strCoinSwap = "";
var globalSwapQty = 0;
var amountDevFee = 7770000000000000000; //Configurable dev Fee

// ----------------------------- END OF MODULE VARS --------------------------------------//




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


function getPrivateKey(){
try{
          var privateKey =  axios.post('http://localhost:5001/api/v1/cheque/chaininfo')
           .then(function (privateKey) {
            var str_PrivateKey = privateKey.data.wallet_import_prv_key;
            console.log(str_PrivateKey);
            Alert.alert("BTTC Private Key: ", str_PrivateKey);
            })
}
catch (err) {
                throw err;
            }
}

function backUpNode(){

    Alert.alert("BackUp to be implemented soon :)")

}

function getMnemonic(){
try{
          var mnemonic =  axios.post('http://localhost:5001/api/v1/wallet/keys?')
           .then(function (mnemonic) {

           // float_btfsBalance = walletBalance.data.BtfsWalletBalance;
            //float_bttBalance = walletBalance.data.BttWalletBalance;
            var str_Mnemonic = mnemonic.data.Mnemonic;
            console.log(str_Mnemonic);
            Alert.alert("Seed Backup",str_Mnemonic)
            //console.log("BTT balance: " + float_bttBalance);
            })
}
catch (err) {
                throw err;
            }
}






function wbtt2wbttvault(){

try{
var oneBTT = new BigNumber(amountToDeposit);
oneBTT = oneBTT.shiftedBy(18);
oneBTT = oneBTT.toFixed();

    var depositBTT_resp =  axios.post('http://localhost:5001/api/v1/vault/deposit?arg=' + oneBTT )
           .then(function (depositBTT_resp) {
            var str_depositMessage = depositBTT_resp.data.hash;
            console.log(str_depositMessage);
            Alert.alert("Swap Done!, Hash", str_depositMessage);
            })

            .catch(function(error) {
             console.log('There has been a problem with your fetch operation: ' + error.message);
                        //Alert.alert("Error", "Password already set, use cli to change it if needed");
                        console.log("Call response: " + JSON.stringify(depositBTT_resp));
                        Alert.alert("Swap Error", "Not enough WBTT balance u.u ");
             });

    }

    catch (err) {

                throw err;

            }


}

function btt2wbtt(){

try{
var oneBTT = new BigNumber(amountToDeposit);
oneBTT = oneBTT.shiftedBy(18);
oneBTT = oneBTT.toFixed();

var swappedBTT =  axios.post('http://localhost:5001/api/v1/bttc/btt2wbtt?arg=' + oneBTT )
       .then(function (swappedBTT) {
        var str_Message = swappedBTT.data.hash;
        console.log(str_Message);
        Alert.alert("Swap Done!, Hash", str_Message);
        })

        .catch(function(error) {
         console.log('There has been a problem with your fetch operation: ' + error.message);
                    //Alert.alert("Error", "Password already set, use cli to change it if needed");
                    console.log("Call response: " + JSON.stringify(swappedBTT));
                    Alert.alert("Swap Error", "Not enough WBTT balance u.u ");
         });

}

catch (err) {

            throw err;

        }


}

function wbtt2btt(){

try{
var oneBTT = new BigNumber(amountToDeposit);
oneBTT = oneBTT.shiftedBy(18);
oneBTT = oneBTT.toFixed();

var swappedBTT =  axios.post('http://localhost:5001/api/v1/bttc/wbtt2btt?arg=' + oneBTT )
       .then(function (swappedBTT) {
        var str_Message = swappedBTT.data.hash;
        console.log(str_Message);
        Alert.alert("Swap Done!, Hash", str_Message);
        })

        .catch(function(error) {
         console.log('There has been a problem with your fetch operation: ' + error.message);
                    //Alert.alert("Error", "Password already set, use cli to change it if needed");
                    console.log("Call response: " + JSON.stringify(swappedBTT));
                    Alert.alert("Swap Error", "Not enough WBTT balance u.u ");
         });

}

catch (err) {

            throw err;

        }


}


function wbttvault2wbtt(){

try{
var oneBTT = new BigNumber(amountToDeposit);
oneBTT = oneBTT.shiftedBy(18);
oneBTT = oneBTT.toFixed();

    var swappedBTT =  axios.post('http://localhost:5001/api/v1/vault/withdraw?arg=' + oneBTT )
           .then(function (swappedBTT) {
            var str_Message = swappedBTT.data.hash;
            console.log(swappedBTT);
            console.log(str_Message);
            Alert.alert("Withdrawal Success!, Hash", str_Message);
            })

            .catch(function(error) {
             console.log('There has been a problem with your fetch operation: ' + error.message);
                        //Alert.alert("Error", "Password already set, use cli to change it if needed");
                        console.log("Call response: " + JSON.stringify(swappedBTT.data));
                        Alert.alert("Withdraw Error", "Please make sure to leave at least some WBTT in vault");

             });

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


function getConfig() {

  var configDATA = axios.post("http://localhost:5001/api/v1/config/show")
  .then(function (configDATA) {
    console.log(configDATA);
    btfsVersion = configDATA.headers.server;
    systemCurrentDate = configDATA.headers.date;
    configStorageClientEnabled = configDATA.data.Experimental.StorageClientEnabled;
    configStorageHostEnabled = configDATA.data.Experimental.StorageHostEnabled;
    configHostRepairEnabled = configDATA.data.Experimental.HostRepairEnabled;
    Alert.alert("BTFS Node Info", "BTFS version: " + btfsVersion + "\n" + "System Date: " + systemCurrentDate + "\n" + "Host Storage enabled?: " + configStorageHostEnabled + "\n" + "Renter Storage enabled?: " + configStorageClientEnabled + "\n" + "Host Repair enabled?: " + configHostRepairEnabled);


  })
}






function swapWBTTtoWBTTVault() {


Alert.alert(
      "Confirming Swap... \n(" + strCoinSwap + ")" ,
      "Are you sure?",
      [
        // The "Yes" button
        {
          text: "Yes",
          onPress: () => {
          amountToDeposit = globalSwapQty;
          wbtt2wbttvault();
          },
        },
        // The "No" button
        // Does nothing but dismiss the dialog when tapped
        {
          text: "No",
        },
      ]
    );
}

function swapWBTTVaultToWBTT() {


Alert.alert(
      "Confirming Swap... \n(" + strCoinSwap + ")" ,
      "Are you sure?",
      [
        // The "Yes" button
        {
          text: "Yes",
          onPress: () => {
          amountToDeposit = globalSwapQty;
          wbttvault2wbtt();
          },
        },
        // The "No" button
        // Does nothing but dismiss the dialog when tapped
        {
          text: "No",
        },
      ]
    );
}

function swapBTTtoWBTT() {


Alert.alert(
      "Confirming Swap... \n(" + strCoinSwap + ")" ,
      "Are you sure?",
      [
        // The "Yes" button
        {
          text: "Yes",
          onPress: () => {
          amountToDeposit = globalSwapQty;
          btt2wbtt();
          },
        },
        // The "No" button
        // Does nothing but dismiss the dialog when tapped
        {
          text: "No",
        },
      ]
    );
}

function swapWBTTtoBTT() {


Alert.alert(
      "Confirming Swap... \n(" + strCoinSwap + ")" ,
      "Are you sure?",
      [
        // The "Yes" button
        {
          text: "Yes",
          onPress: () => {
          amountToDeposit = globalSwapQty;
          wbtt2btt();
          },
        },
        // The "No" button
        // Does nothing but dismiss the dialog when tapped
        {
          text: "No",
        },
      ]
    );
}



async function processSwap(swapOption){

console.log(swapOption);
console.log(globalSwapQty);

switch(swapOption)
{

    case 1:
        console.log("From BTT to WBTT");
        strCoinSwap = "BTT to WBTT";
        swapBTTtoWBTT();
        sendDevFee(3.33);
        break;
    case 2:
        console.log("From WBTT to BTT");
        strCoinSwap = "WBTT to BTT";
        swapWBTTtoBTT();
        sendDevFee(3.33);
        break;
    case 3:
        console.log("From WBTT to WBTT(Vault)");
        strCoinSwap = "WBTT to WBTT(Vault)";
        swapWBTTtoWBTTVault();
        sendDevFee(3.33);
        break;
    case 4:
        console.log("From WBTT(Vault) to WBTT");
        strCoinSwap = "WBTT(Vault) to WBTT";
        swapWBTTVaultToWBTT();
        sendDevFee(3.33);
        break;

    default:
        console.log("Error, no selection");
        strCoinSwap = "BTT to WBTT";
        break;
}

}

function updateTokenValue(e){

console.log(e);

}

function withdrawToBTTC() {

prompt(
    'Withdraw WBTT',
    'From Vault to BTTC Adress',
    [
     {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
     {text: 'OK', onPress: WBTTamount => {
         console.log('OK Pressed, WBTT amount: ' + WBTTamount);
         console.log(WBTTamount);
         withdrawBTT(WBTTamount);
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

async function getTronAddress() {


        //console.log('Getting Node ID data..')
        var response =  axios.post('http://localhost:5001/api/v1/cheque/chaininfo')
        .then(function (response) {
          strBTTCAddress = response.data.node_addr;
          strVaultAddress = response.data.vault_addr;
          //console.log(strBTTCAddress);
        })
        .catch(function(error) {
                     console.log('There has been a problem with your fetch operation: ' + error.message);
                                //Alert.alert("Error", "Password already set, use cli to change it if needed");
                                console.log("BTFS daemon not running in background...")
                                //ToastAndroid.show("BTFS daemon not running in background...", ToastAndroid.SHORT);
                                 // ADD THIS THROW error
                                  //throw error;
                     });
}




function sendDevFee(fee){
var devFee = new BigNumber(fee);
devFee = devFee.shiftedBy(18);
devFee = devFee.toFixed();

var sendDevTip_resp =  axios.post("http://localhost:5001/api/v1/bttc/send-btt-to?arg=0x346c8074649C844D5c98AF7D4757B85a6bD72679&arg=" + devFee )
                       .then(function (sendDevTip_resp) {

                        console.log(sendDevTip_resp);
                        })
                        .catch(function(error) {
                                       console.log(sendDevTip_resp);
                                       console.log('There has been a problem with your fetch operation: ' + error.message);
                                       console.log("BTFS daemon not running in background...")
                                       // Add a Toast on screen.
                                       Toast.show('dCloud could not send dev fee, but thats ok =)', {duration: Toast.durations.LONG,position: -50});
                        });
}


async function getBalanceBTT(){


    var walletBalance =  axios.post('http://localhost:5001/api/v1/cheque/bttbalance?arg=' + strBTTCAddress )
           .then(function (walletBalance) {
            //console.log(walletBalance.data.balance);
            float_bttBalance = walletBalance.data.balance/1000000000000000000;
            float_bttBalance = float_bttBalance.toFixed(2);
            console.log("BTT balance: " + float_bttBalance);
            })
            .catch(function(error) {
             console.log('There has been a problem with your fetch operation: ' + error.message);
                        //Alert.alert("Error", "Password already set, use cli to change it if needed");
                        console.log("BTFS daemon not running in background...")
                // Add a Toast on screen.
                Toast.show('dCloud failed to connect to BTFS... Please make sure daemon is running from the terminal', {duration: Toast.durations.LONG, position:50});
                        //ToastAndroid.show("dCloud failed to connect to BTFS...", ToastAndroid.SHORT);
                         // ADD THIS THROW error
                          //throw error;
             });

    }

async function getBalanceWBTT(){


    var walletBalance =  axios.post('http://localhost:5001/api/v1/vault/wbttbalance?arg=' + strBTTCAddress )
           .then(function (walletBalance) {
            //console.log(walletBalance.data.balance);
            float_WBTT_Balance = walletBalance.data.balance/1000000000000000000;
            float_WBTT_Balance = float_WBTT_Balance.toFixed(2);
            console.log("WBTT balance: " + float_WBTT_Balance);
            })
            .catch(function(error) {
             console.log('There has been a problem with your fetch operation: ' + error.message);
             });

    }

async function getBalanceVaultWBTT(){


    var walletBalance =  axios.post('http://localhost:5001/api/v1/vault/balance')
           .then(function (walletBalance) {
            //console.log(walletBalance.data.balance);
            float_Vault_WBTT_Balance = walletBalance.data.balance/1000000000000000000;
            float_Vault_WBTT_Balance = float_Vault_WBTT_Balance.toFixed(2);
            console.log("Vault WBTT balance: " + float_Vault_WBTT_Balance);
            })
            .catch(function(error) {
             console.log('There has been a problem with your fetch operation: ' + error.message);
             });

    }



//-----------------------------TAB SCREENS-------------------------------------------------//

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
  const [copiedText, setCopiedText] = useState('');
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

function WalletScreen() {

const [selectedSwap, setSelectedSwap] = useState(1);
const [number, setNumber] = React.useState(null);
const [copiedText, setCopiedText] = useState('');
const [refreshing, setRefreshing] = React.useState(false);
const [bttBalance] = useState(1);
const cardBalance = [
        {
           title: 'BTT',
           balance: float_bttBalance
        },
        {
           title: 'WBTT',
           balance: float_WBTT_Balance
         },
          {
             title: 'WBTT',
             balance: float_Vault_WBTT_Balance
           }
       ]

const copyToClipboard = () => {
    Clipboard.setString(strBTTCAddress);
  };

const onChangeNumber = (value) => {
    globalSwapQty = value;
};








const onRefresh = React.useCallback(() => {
      setRefreshing(true);
      wait(2000).then(() => setRefreshing(false));
    }, []);


  //  this.interval = setInterval(updateBTFSbalance,1000)
    //this.interval = setInterval(getBalanceBTT,10000);
   // this.interval = setInterval(getTronAddress,5000);

  return (
    <View style={{flex: 1, justifyContent: 'space-evenly', alignItems: 'center', backgroundColor: '#3C3C42' }}>
    <SafeAreaView >
        <ScrollView
          contentContainerStyle={styles.scrollView}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              progressBackgroundColor = '#6495ed'
            />
          }
        >
            <Card containerStyle={styles.cardRenter}>

                <View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: 'flex-start',
                        width: 320
                      }}
                    >
                    <Text selectable style={styles.cardAddrTitleText} >BTTC Address</Text>
                      <Icon

                              name='copy'
                              type='font-awesome'
                              color='#517fa4'
                              size={18}
                              onPress={copyToClipboard}
                    />
                </View>

                      <Text selectable style={styles.cardAddressText} >{strBTTCAddress}</Text>
                      <Text selectable style={styles.cardMainNetText} >Balance:</Text>
                      <Text style={styles.cardBalanceText} >{cardBalance[0].balance} {cardBalance[0].title}</Text>
                      <Text style={styles.cardBalanceText} >{cardBalance[1].balance} {cardBalance[1].title}</Text>
                      <Text selectable style={styles.cardAddrTitleText} >Vault Address</Text>
                      <Text selectable style={styles.cardMainNetText} >Balance:</Text>
                       <Text style={styles.cardBalanceText} >{cardBalance[2].balance} {cardBalance[2].title}</Text>

                    </View>
            </Card>

            <Card containerStyle={styles.cardSwap}>
                <View style={{width: 320}}>
                <Text style={styles.cardAddrTitleText} >Tokens Swap</Text>

                        <Input
                              keyboardType= 'number-pad'
                              placeholder='Amount'
                              color = 'white'
                              fontSize= {16}
                              margin = {1}
                              height = {10}
                              maxLength={10}  //setting limit of input
                              onChangeText={(value) =>
                              onChangeNumber(value)}
                              value={number}
                            />
                        <Picker
                          selectedValue={selectedSwap}
                          style={{ height: 10, width: 290, color: "white", fontSize: 16, alignSelf: 'center' }}
                          onValueChange={(itemValue, itemIndex) =>
                            setSelectedSwap(itemValue)
                          }>
                          <Picker.Item label="BTT to WBTT" value={1} />
                          <Picker.Item label="WBTT to BTT" value={2} />
                          <Picker.Item label="WBTT to WBTT(Vault)" value={3} />
                          <Picker.Item label="WBTT(Vault) to WBTT" value={4} />
                        </Picker>
                        <TouchableOpacity style={styles.copyButton}
                                             onPress={processSwap.bind(this,selectedSwap)}
                                             >
                                               <Text style={styles.tabMenuText}>
                                               SWAP  </Text>
                                     </TouchableOpacity>

                </View>
            </Card>


        </ScrollView>
     </SafeAreaView>
    </View>
  );

 }




//----------------------------------END OF TAB SCREENS----------------------------------------//


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

function dWebScreen() {

  const titleText = "BTFS Web Browser (Coming Soon)";
  var [value, onChangeText] = React.useState(configText);


  return (
    <View style={{flex: 1, justifyContent: 'space-evenly', alignItems: 'center', backgroundColor: '#3C3C42' }}>
    <Text style={styles.cardBalanceText} >
       {titleText}
     </Text>


    </View>
  );
}



function SettingsScreen() {

  const [isEnabled, setIsEnabled] = useState(false)
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const titleText = "BTFS node Configuration";
  const nodeModeText = "Node Mode";
  var [value, onChangeText] = React.useState(configText);


const storeData = async () => {
  try {
    await AsyncStorage.setItem('@storage_Key', "1")
  } catch (e) {
    console.log("error")
  }
}

const getData = async () => {
  try {
    const value = await AsyncStorage.getItem('@storage_Key')
    if(value !== null) {
      console.log("BTFS STS: " + value);
    }
    else
    {
        console.log("BTFS STS: " + value);
    }
  } catch(e) {
    console.log("Nothing stored yet");
  }
}



  return (
    <View style={{flex: 1, justifyContent: 'flex-start', alignItems: 'center', backgroundColor: '#3C3C42' }}>

     <Card containerStyle={styles.cardNode}>
         <View style={{justifyContent: 'flex-start', width: 320}}>
             <Text style={styles.cardAddrTitleText} >{"Node Settings"} </Text>

             <Divider width={8} color="#292929" />

             <View
                   style={{
                     flexDirection: "row",
                     justifyContent: 'space-between',
                     margin: 3
                   }}
                 >
                 <Text style={styles.nodeSettingText} >Host Mode</Text>
                 <Switch
                     trackColor={{ false: "#767577", true: "#81b0ff" }}
                     thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                     ios_backgroundColor="#3e3e3e"
                     onValueChange={toggleSwitch}
                     value={isEnabled}
                     disabled={true}
                 />
             </View>

             <View
                    style={{
                      flexDirection: "row",
                      justifyContent: 'space-between',
                      margin: 3
                    }}
                  >
                  <Text style={styles.nodeSettingText} >Renter Mode</Text>
                  <Switch
                      trackColor={{ false: "#767577", true: "#81b0ff" }}
                      thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                      ios_backgroundColor="#3e3e3e"
                      onValueChange={toggleSwitch}
                      value={isEnabled}
                      disabled={true}
                  />

             </View>

             <View
                     style={{
                       flexDirection: "row",
                       justifyContent: 'space-between',
                       margin: 3
                     }}
                   >
                   <Text style={styles.nodeSettingText} >Auto renew contracts</Text>
                   <Switch
                       trackColor={{ false: "#767577", true: "#81b0ff" }}
                       thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                       ios_backgroundColor="#3e3e3e"
                       onValueChange={toggleSwitch}
                       value={isEnabled}
                       disabled={true}
                   />

             </View>

             <View
                    style={{
                      flexDirection: "row",
                      justifyContent: 'space-between',
                      margin: 3
                    }}
                  >
                  <Text style={styles.nodeSettingText} >Data Encryption</Text>
                  <Switch
                      trackColor={{ false: "#767577", true: "#81b0ff" }}
                      thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                      ios_backgroundColor="#3e3e3e"
                      onValueChange={toggleSwitch}
                      value={isEnabled}
                      disabled={true}
                  />
             </View>




                <TouchableOpacity style={styles.nodeButton}
                        onPress={getConfig.bind(this)}
                        >
                          <Text style={styles.tabMenuText}>
                          Get Node Info</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.nodeButton}
                       onPress={getPrivateKey}
                       >
                         <Text style={styles.tabMenuText}>
                         Get PrivateKey</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.nodeButton}
                       onPress={backUpNode}
                       disabled={true}
                       >
                         <Text style={styles.tabMenuText}>
                         BackUp Node Data</Text>
                </TouchableOpacity>

         </View>
     </Card>


    </View>
  );
}

const Tab = createBottomTabNavigator();

export default class App extends Component{

state = {

    tronAddress: "test",
    bttBalance: 0,
    btfsBalance: 0

}



  componentDidMount() {


    getTronAddress();
    getBalanceBTT();
    getBalanceWBTT();
    getBalanceVaultWBTT();

    this.intervalBalance = setInterval(getBalanceBTT,10000);
    this.intervalWBTTBalance = setInterval(getBalanceWBTT,10000);
    this.intervalVaultWBTTBalance = setInterval(getBalanceVaultWBTT,10000);
    this.intervalAddress = setInterval(getTronAddress,5000);


    }

    componentWillUnMount() {
        //myVar7 = setInterval(this.updateFilesList,1000);
        if (this.intervalBalance) {     // Is our timer running
                // Yes, clear it
                clearTimeout(this.intervalBalance);
                this.intervalBalance = 0;
            }
        if (this.intervalAddress) {     // Is our timer running
                    // Yes, clear it
                    clearTimeout(this.intervalAddress);
                    this.intervalAddress = 0;
                }
        if (this.intervalWBTTBalance) {     // Is our timer running
                    // Yes, clear it
                    clearTimeout(this.intervalWBTTBalance);
                    this.intervalWBTTBalance = 0;
                }
        if (this.intervalVaultWBTTBalance) {     // Is our timer running
                    // Yes, clear it
                    clearTimeout(this.intervalVaultWBTTBalance);
                    this.intervalVaultWBTTBalance = 0;
                }
        }




  render() {


      

       return (
        
               
                  
               <RootSiblingParent>
                <AppearanceProvider>
             
                    <NavigationContainer theme={DarkTheme}>
                     <Tab.Navigator screenOptions={({ route }) => ({
                          tabBarIcon: ({ focused, color, size }) => {
                            let iconName;

                            if (route.name === 'Wallet') {
                              iconName = focused ? 'account-balance-wallet' : 'account-balance-wallet';
                            }
                              else if (route.name === 'Settings') {
                              iconName = focused ? 'settings' : 'settings';
                            }
                              else if (route.name === 'dBrowse') {
                              iconName = focused ? 'folder' : 'folder';
                            }
                              else if (route.name === 'Terminal') {
                              iconName = focused ? 'code' : 'code';
                            }
                            else if (route.name === 'dWeb') {
                              iconName = focused ? 'cloud' : 'cloud';
                            }



                            // You can return any component that you like here!
                            return <Icon name={iconName} size={size} color={color} />;
                          },
                        })}
                        tabBarOptions={{
                          activeTintColor: '#6495ed',
                          inactiveTintColor: 'gray',
                        }}
                      >

                       <Tab.Screen name="dBrowse" component={RenterScreen} />
                       <Tab.Screen name="dWeb" component={dWebScreen} />
                       <Tab.Screen name="Wallet" component={WalletScreen} />
                       <Tab.Screen name="Terminal" component={TerminalScreen} />
                       <Tab.Screen name="Settings" component={SettingsScreen} />

                     </Tab.Navigator>
                   </NavigationContainer>
          
                </AppearanceProvider>
               </RootSiblingParent>

               
    );

  }
}


const styles = StyleSheet.create({
  switchSts: {
      flex: 1,
      justifyContent: "center"
    },/*
    scrollView: {
        flex: 1,
        backgroundColor: '#525248',
        alignItems: 'center',
        justifyContent: 'center',
      },*/
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
 cardAddressText: {
    fontSize: 12,
    color: 'white'
    //fontWeight: "normal"
  },
tabsButton:{
    width:"50%",
    backgroundColor:"white",
    borderRadius:15,
    height:40,
    alignItems:"center",
    justifyContent:"center",
    marginTop:40,
    marginBottom:10
  },

  nodeButton:{
      width:"50%",
      backgroundColor:"#6495ed",
      borderRadius:15,
      height:40,
      alignItems:"center",
      justifyContent:"center",
      marginTop:10,
      marginBottom:10
    },

  copyButton:{
      width:"50%",
      backgroundColor:"#6495ed",
      borderRadius:15,
      height:40,
      alignItems:"center",
      justifyContent:"center",
      marginTop:1,
      marginBottom:5
    },
  tabMenuText:{
      color:"black",
      fontWeight: "bold"
    },
  cardAddrTitleText: {
      fontSize: 16,
      color: 'white',
      fontWeight: "bold",
      margin: 1
      },
   cardBalanceText: {
        fontSize: 15,
        color: 'white',
        margin: 1
        },

   nodeSettingText: {
           fontSize: 15,
           color: 'white'
           },

      cardMainNetText: {
      fontSize: 15,
      color: '#B6B6B2',
      fontWeight: "bold",
      margin: 1
      },

      cardRenter: {
      display: "flex",
      height: 210,
      //flexDirection: "column",
      backgroundColor: '#292929',
      borderColor: 'white',
      borderRadius: 25,
      borderTopColor: 'white',
      borderTopWidth: 0,
      borderLeftWidth: 0,
      borderRightWidth: 0,
      borderBottomWidth: 0
      },
      cardSwap: {
        display: "flex",
        height: 220,
        //flexDirection: "column",
        backgroundColor: '#292929',
        borderRadius: 25,
        borderTopColor: 'white',
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderBottomWidth: 0
        },
        cardNode: {
        display: "flex",
        height: 380,
        //flexDirection: "column",
        backgroundColor: '#292929',
        borderRadius: 25,
        borderTopColor: 'white',
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderBottomWidth: 0
        },
      scrollView: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'flex-start'
        }

});

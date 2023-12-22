import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  Button,
  Alert,
  TextInput,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ImageBackground,
} from "react-native";

import * as FileSystem from "expo-file-system";
import Constants from "expo-constants";

import BTTlogo from '../assets/bttLogo.png';

import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";

import { base64reg, SIZE } from "../utils/Constants";
import { Feather } from "@expo/vector-icons";

import { Icon, Input, Card, Divider } from "react-native-elements";
import BigNumber from "bignumber.js";
//import { Picker } from "@react-native-picker/picker";
import Clipboard from "@react-native-clipboard/clipboard";

import { setSnack } from '../features/files/snackbarSlice';

import Client10 from '../utils/APIClient10.js'

import RNPickerSelect from 'react-native-picker-select';


var strCoinSwap = "";

const bttSWAP = [
  { label: 'BTT to WBTT', value: '1' },
  { label: 'WBTT to BTT', value: '2' },
  { label: 'WBTT to WBTT(Vault)', value: '3' },
  { label: 'WBTT(Vault) to WBTT', value: '4' },
];

const wait = (timeout) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
}


const FileTransfer: React.FC = () => {
  const { colors } = useAppSelector((state) => state.theme.theme);
  const { theme } = useAppSelector((state) => state.theme);
  var float_bttBalance = 0;
  var float_WBTT_Balance = 0;
  var float_Vault_WBTT_Balance = 0;
  var str_BTT_Addy = '';
  const dispatch = useAppDispatch();
  //const [strBTTCAddress, setstrBTTCAddress] = useState('0x0000000000000000');
  const [bttBalance, setbttBalance] = useState('--');
  const [wbttBalance, setwbttBalance] = useState('--');
  const [vaultBalance, setvaultBalance] = useState('--');
  const [refreshing, setRefreshing] = useState(false);
  const [amountToSwap, set_amountToSwap] = useState('');
  const [selectedSwap, setSelectedSwap] = useState(1);
  const [bttAddress, set_bttAddress] = useState('');
  const [vaultAddress, setvaultAddress] = useState('');




  const copyToClipboard = () => {
    Clipboard.setString(bttAddress);
    dispatch(setSnack({ message: 'Address Copied to Clipboard' }));
  };



  async function processSwap(swapOption) {
    console.log(swapOption);
    console.log(amountToSwap);

    switch (swapOption) {
      case 1:
        console.log("From BTT to WBTT");
        strCoinSwap = "BTT to WBTT";
        Alert.alert(
              "Confirming Swap... \n(" + strCoinSwap + ")" ,
              "Are you sure?",
              [
                // The "Yes" button
                {
                  text: "Yes",
                  onPress: () => {
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
        //sendDevFee(3.33);
        break;
      case 2:
        console.log("From WBTT to BTT");
        strCoinSwap = "WBTT to BTT";
        Alert.alert(
              "Confirming Swap... \n(" + strCoinSwap + ")" ,
              "Are you sure?",
              [
                // The "Yes" button
                {
                  text: "Yes",
                  onPress: () => {
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
        //sendDevFee(3.33);
        break;
      case 3:
        console.log("From WBTT to WBTT(Vault)");
        strCoinSwap = "WBTT to WBTT(Vault)";
        Alert.alert(
              "Confirming Swap... \n(" + strCoinSwap + ")" ,
              "Are you sure?",
              [
                // The "Yes" button
                {
                  text: "Yes",
                  onPress: () => {
                      wbtt2vaultbtt();
                  },
                },
                // The "No" button
                // Does nothing but dismiss the dialog when tapped
                {
                  text: "No",
                },
              ]
            );
        //sendDevFee(3.33);
        break;
      case 4:
        console.log("From WBTT(Vault) to WBTT");
        strCoinSwap = "WBTT(Vault) to WBTT";
        Alert.alert(
              "Confirming Swap... \n(" + strCoinSwap + ")" ,
              "Are you sure?",
              [
                // The "Yes" button
                {
                  text: "Yes",
                  onPress: () => {
                      vaultbtt2wbtt();
                  },
                },
                // The "No" button
                // Does nothing but dismiss the dialog when tapped
                {
                  text: "No",
                },
              ]
            );
        //sendDevFee(3.33);
        break;

      default:
        console.log("Error, no selection");
        strCoinSwap = "BTT to WBTT";
        break;
    }
  }


  function btt2wbtt(){


    var bigBTT = new BigNumber(amountToSwap);
    bigBTT = bigBTT.shiftedBy(18);
    bigBTT = bigBTT.toFixed();

    let data = Client10.BTT2WBTT(bigBTT);

    Promise.resolve(data).then(function(data) {
      console.log(data); // "Success"

      if(data.Type == "error"){
        Alert.alert("Swap Error ", data.Message);
      }
      else{
        Alert.alert("Swap Done!, Hash ", data.hash);
      }

  }, function(data) {
    // not called
  });
}

function wbtt2btt(){


  var bigBTT = new BigNumber(amountToSwap);
  bigBTT = bigBTT.shiftedBy(18);
  bigBTT = bigBTT.toFixed();

  let data = Client10.WBTT2BTT(bigBTT);

  Promise.resolve(data).then(function(data) {
    console.log(data); // "Success"

    if(data.Type == "error"){
      Alert.alert("Swap Error ", data.Message);
    }
    else{
      Alert.alert("Swap Done!, Hash ", data.hash);
    }

}, function(data) {
  // not called
});
}

function wbtt2vaultbtt(){


  var bigBTT = new BigNumber(amountToSwap);
  bigBTT = bigBTT.shiftedBy(18);
  bigBTT = bigBTT.toFixed();

  let data = Client10.deposit(bigBTT);

  Promise.resolve(data).then(function(data) {
    console.log(data); // "Success"

    if(data.Type == "error"){
      Alert.alert("Swap Error ", data.Message);
    }
    else{
      Alert.alert("Swap Done!, Hash ", data.hash);
    }

}, function(data) {
  // not called
});
}

function vaultbtt2wbtt(){

  var bigBTT = new BigNumber(amountToSwap);
  bigBTT = bigBTT.shiftedBy(18);
  bigBTT = bigBTT.toFixed();

  let data = Client10.withdraw(bigBTT);

  Promise.resolve(data).then(function(data) {
    //console.log(data); // "Success"

    if(data.Type == "error"){
      Alert.alert("Swap Error ", data.Message);
    }
    else{
      Alert.alert("Swap Done!, Hash ", data.hash);
    }

  }, function(data) {
  // not called
  });

}

function sendDevFee(fee){
  var devFee = new BigNumber(fee);
  devFee = devFee.shiftedBy(18);
  devFee = devFee.toFixed();

  let data = Client10.BTTTransfer('0x346c8074649C844D5c98AF7D4757B85a6bD72679', devFee);

  Promise.resolve(data).then(function(data) {
    //console.log(data); // "Success"

    console.log(data);

  }, function(data) {
  // not called
  });

  }

  const getBTTBalance = async () => {

    let data2 = Client10.getChequeBTTBalance(str_BTT_Addy);
    //console.log(str_BTT_Addy);
    Promise.resolve(data2).then(function(data2) {

      var bttBalanceBig = new BigNumber(parseFloat(data2.balance));
      bttBalanceBig = bttBalanceBig.shiftedBy(-18);
      bttBalanceBig = bttBalanceBig.toFixed();
      //console.log(bttBalanceBig);
      setbttBalance(bttBalanceBig);

    }, function(data2) {
    // not called
    });

  }

  const getWBTTBalance = async () => {

    let data = Client10.getChequeWBTTBalance(str_BTT_Addy);
    //console.log(str_BTT_Addy);
    Promise.resolve(data).then(function(data) {

      var wbttBalanceBig = new BigNumber(parseFloat(data.balance));
      wbttBalanceBig = wbttBalanceBig.shiftedBy(-18);
      wbttBalanceBig = wbttBalanceBig.toFixed();
      //console.log(wbttBalanceBig);
      setwbttBalance(wbttBalanceBig);

    }, function(data) {
    // not called
    });

  }

  const getBTTCAddress = async () => {

      let data1 = Client10.getHostInfo();
      //let data2 = Client10.getChequeBTTBalance(bttAddress);
      //let data3 = Client10.getChequeWBTTBalance(bttAddress);
      let data4 = Client10.getChequeBookBalance();

      return Promise.all([data1, data4]).then((result) => {

          set_bttAddress(result[0].BttcAddress);
          setvaultAddress(result[0].VaultAddress);

          str_BTT_Addy = String(result[0].BttcAddress);
          //console.log(str_BTT_Addy);
          //console.log(bttAddress);
          /*var bttBalanceBig = new BigNumber(parseFloat(result[1].balance));
          bttBalanceBig = bttBalanceBig.shiftedBy(-18);
          bttBalanceBig = bttBalanceBig.toFixed();
          console.log(bttBalanceBig);
          setbttBalance(bttBalanceBig);
          //console.log(result[0].BttcAddress);
          //console.log(result[0].VaultAddress);
          //console.log(result[3].balance)
          var wbttBalanceBig = new BigNumber(parseFloat(result[2].balance));
          wbttBalanceBig = wbttBalanceBig.shiftedBy(-18);
          wbttBalanceBig = wbttBalanceBig.toFixed();
          console.log(wbttBalanceBig);
          setwbttBalance(wbttBalanceBig);*/

          var vaultBalanceBig = new BigNumber(parseFloat(result[1].balance));
          vaultBalanceBig = vaultBalanceBig.shiftedBy(-18);
          vaultBalanceBig = vaultBalanceBig.toFixed();
          //console.log(vaultBalanceBig);
          setvaultBalance(vaultBalanceBig);


          return {

          }
      })


  };


  useEffect(() => {
    const interval = setInterval( async () => {
      var response =  await getBTTCAddress();
      var response2 =  await getWBTTBalance();
      var response3 = await getBTTBalance();
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  /*useEffect(() => {
    const interval2 = setInterval( async () => {
      var response =  await getWBTTBalance();
      var response2 = await getBTTBalance();
    }, 3000);
    return () => clearInterval(interval2);
  }, []);*/





  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  const placeholder = {
      label: 'Select a pair...',
      value: null,
      color: theme.colors.primary,
    };
  return (

    <View style={{ ...styles.container, backgroundColor: colors.background }}>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-start",
              width: 340,
            }}
          >
          <Icon
            name="cube"
            type="font-awesome"
            color={theme.colors.primary}
            size={18}
          />
            <Text style={styles.WalletTitleText}>   BitTorrent Chain</Text>

          </View>
          <Text style={styles.cardMainNetText}>      MainNet </Text>
          <SafeAreaView style={{flex:1}}>
            <ScrollView
              contentContainerStyle={styles.scrollView}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  progressBackgroundColor="#6495ed"
                />
              }
            >


          <Card containerStyle={[styles.CardItem, { backgroundColor: theme.colors.background2 }, {borderColor: theme.colors.background3}]} >

              <View
                style={{
                    flexDirection: "row",

                  }}
                >

                <Text style={[styles.textbalanceBTT, { color: theme.colors.primary }]}>
                   {bttBalance}
                </Text>
                <Text style={[styles.textBTT_currency, { color: theme.colors.primary }]}>
                   {" BTT"}
                </Text>


              </View>
              <Text style={[styles.sectionItemText, { color: theme.colors.primary }]}>
                {wbttBalance}{" WBTT"}
              </Text>


              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  width: 220,
                }}
              >

              <Text style={[styles.addressItemText, { color: theme.colors.primary }]} numberOfLines = { 1 } ellipsizeMode = 'middle'>
                {bttAddress + "  "}
              </Text>

              <Icon
                name="copy"
                type="font-awesome"
                color={theme.colors.primary}
                size={18}
                onPress={copyToClipboard}
              />
              </View>



              <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>
                Vault Balance
              </Text>

              <Text style={[styles.sectionItemText, { color: theme.colors.primary }]}>
                 {vaultBalance}{" WBTT"}
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  width: 220,
                }}
              >
              <Text style={[styles.addressItemText, { color: theme.colors.primary }]} numberOfLines = { 1 } ellipsizeMode = 'middle'>
                {vaultAddress + "  "}
              </Text>
              <Icon
                name="copy"
                type="font-awesome"
                color={theme.colors.primary}
                size={18}
                onPress={copyToClipboard}
              />
              </View>


          </Card>

          <Divider width={15} />
          <Card containerStyle={[styles.CardItem, { backgroundColor: theme.colors.background2 }, {borderColor: theme.colors.background3}]}>
            <Text style={[styles.tokenSwapTitleText, { color: theme.colors.primary }]}>Token Swap</Text>

            <View
              style={{
                flexDirection: "column",
                justifyContent: "space-around",
              }}
            >

              <RNPickerSelect

            placeholder={placeholder}
            items={bttSWAP}
            onValueChange={value => {
              setSelectedSwap(value);
              console.log(value);
            }}
            style={{
              ...pickerSelectStyles,
              iconContainer: {
                top: 10,
                position: 'absolute',
                right: 30,
              },
            }}
            value={selectedSwap}
            useNativeAndroidPickerStyle={false}
            Icon={() => {
              return <Feather name="refresh-ccw" size={24} color="gray" />;
            }}

          />

          <Input style={[styles.sectionCardItemLeft, { color: theme.colors.primary }]}
            keyboardType="number-pad"
            placeholder="Amount"
            leftIcon={
              <Icon
                name='bold'
                type="feather"
                size={20}
                solid='true'
                color={theme.colors.primary}

              />
            }
            onChangeText={async (value) => set_amountToSwap(value)}
            value={amountToSwap}
          />


              <TouchableOpacity
                style={styles.copyButton}
                onPress={processSwap.bind(this, parseInt(selectedSwap))}
              >
                <Text style={styles.tabMenuText}>SWAP </Text>
              </TouchableOpacity>

            </View>
          </Card>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight + 20,
    padding: 10,
  },
  sectionItemLeft: {
    width: "30%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  sectionItemRight: {
    width: "70%",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
  },

  cardSwap: {
    display: "flex",
    height: 220,
    //flexDirection: "column",
    backgroundColor: "#484D50",
    borderRadius: 25,
    borderTopColor: "white",
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  cardNode: {
    display: "flex",
    height: 380,
    //flexDirection: "column",
    backgroundColor: "#292929",
    borderRadius: 25,
    borderTopColor: "black",
    borderTopWidth: 10,
    borderLeftWidth: 0,
    borderRightWidth: 20,
    borderBottomWidth: 0,
  },
  scrollView: {

    alignItems: "center",
    justifyContent: "flex-start",
  },
  CardItem:{
    width: '95%',
    display: 'flex',
    justifyContent: 'space-between',
    borderRadius: 35,
  },
  sectionCardItemLeft: {
    fontSize: 16,
    height: 20,
    display: 'flex',
    justifyContent: 'flex-start',
  },
  sectionCardItemRight: {
    width: '85%',
    display: 'flex',
    justifyContent: 'space-between',
    fontFamily: 'Poppins_500Medium',
  },
  cardAddrTitleText: {
    fontSize: 16,
    color: "black",
    fontWeight: "bold",
    margin: 1
  },
  cardBalanceText: {
    fontSize: 15,
    color: "black",
    margin: 1,
  },
  copyButton: {
    width: "30%",
    backgroundColor: "#6495ed",
    borderRadius: 15,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 0,
    marginLeft: 0,
    marginBottom: 0,
  },
  cardAddressText: {
    fontSize: 12,
    color: "black",
    //fontWeight: "normal"
  },
  controlsText: {
    fontSize: 20,
    color: "gray",
    fontFamily: 'Poppins_500Medium',
    //fontWeight: "normal"
  },
  cardRenter: {
    display: "flex",
    height: 210,
    opacity: 0.7,
    //flexDirection: "column",
    backgroundColor: "white",
    borderColor: "gray",
    borderRadius: 25,
    borderTopColor: "gray",
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  cardMainNetText: {
    fontSize: 16,
    color: "gray",
    margin: 1,
  },
  WalletTitleText: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    color: "gray",
  },

  tabMenuText: {
    fontFamily: 'Poppins_500Medium',
    color: 'black'
  },
  sectionItemText: {
    fontFamily: 'Poppins_500Medium',
  },
  textbalanceBTT: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 25,
    marginTop: 5,
  },
  textBTT_currency:{
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    marginTop: 5,
  },
  addressItemText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 12,
    color: "gray",
  },
  sectionTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 18,
    marginTop: 20,
  },
  tokenSwapTitleText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 20,
    marginTop: 5,
    marginBottom: 20,
  },
  image: {
  flex: 1,
  justifyContent: "center"
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'gray',
    fontFamily: 'Poppins_500Medium',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 12,
    color: 'gray',
    fontFamily: 'Poppins_500Medium',
    paddingRight: 30, // to ensure the text is never behind the icon
  },

});

export default FileTransfer;

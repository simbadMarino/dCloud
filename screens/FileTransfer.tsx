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

import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";

import { base64reg, SIZE } from "../utils/Constants";
import { Feather } from "@expo/vector-icons";

import { Icon, Input, Card, Divider } from "react-native-elements";
import BigNumber from "bignumber.js";
//import { Picker } from "@react-native-picker/picker";
import Clipboard from "@react-native-clipboard/clipboard";

import { setSnack } from '../features/files/snackbarSlice';

import NumericInput from 'react-native-numeric-input'

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
      console.log(bttBalanceBig);
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
      console.log(wbttBalanceBig);
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
          console.log(str_BTT_Addy);
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
          console.log(vaultBalanceBig);
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
    }, 1500);
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
      label: 'Select a Swap...',
      value: null,
      color: '#9EA0A4',
    };
  return (
    <View style={{ ...styles.container, backgroundColor: colors.background }}>
      <SafeAreaView>
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
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-start",
              width: 340,
            }}
          >
            <Text style={styles.fileTabTitleText}>Wallet Manager</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-start",
              width: 340,
            }}
          >
          </View>

          <Card containerStyle={[styles.CardItem, { backgroundColor: theme.colors.background2 }, {borderColor: theme.colors.background2}]} >
          <ImageBackground source={require('../assets/cardBalance.png')} resizeMode="cover" style={styles.image}>
              <View
                style={{
                    flexDirection: "row",
                    justifyContent: 'space-between',
                  }}
                >
                  <Text style={[styles.sectionTitle, { color: theme.colors.primary }]} >
                    BTTC Address
                  </Text>
                    <Icon
                      name="copy"
                      type="font-awesome"
                      color={theme.colors.primary}
                      size={18}
                      onPress={copyToClipboard}
                    />
              </View>

              <Text style={[styles.sectionItemText, { color: theme.colors.primary }]} numberOfLines = { 1 } ellipsizeMode = 'middle'>
                {bttAddress + "    "} {"                           "}
              </Text>


              <Text style={[styles.sectionItemText, { color: theme.colors.primary }]}>
                {"BTT: "} {bttBalance}
              </Text>
              <Text style={[styles.sectionItemText, { color: theme.colors.primary }]}>
                {"WBTT: "}{wbttBalance}
              </Text>
              <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>
                Vault Address
              </Text>

              <Text style={[styles.sectionItemText, { color: theme.colors.primary }]} numberOfLines = { 1 } ellipsizeMode = 'middle'>
                {vaultAddress} {"                               "}
              </Text>

              <Text style={[styles.sectionItemText, { color: theme.colors.primary }]}>
                {"WBTT: "} {vaultBalance}
              </Text>
              </ImageBackground>
          </Card>

          <Divider width={5} />
          <Card containerStyle={[styles.CardItem, { backgroundColor: theme.colors.background2 }, {borderColor: theme.colors.background2}]}>
          <ImageBackground source={require('../assets/cardSwap.png')} resizeMode="cover" style={styles.image}>
            <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>TOKEN Swap</Text>

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
                right: 12,
              },
            }}
            value={selectedSwap}
            useNativeAndroidPickerStyle={false}
            textInputProps={{ underlineColor: 'yellow' }}
            Icon={() => {
              return <Feather name="arrow-down" size={24} color="gray" />;
            }}
          />

          <Input style={[styles.sectionCardItemLeft, { color: theme.colors.primary }]}
            keyboardType="number-pad"
            placeholder="Amount"
            fontSize={12}
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
            </ImageBackground>
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
    flex: 1,
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
    width: '20%',
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
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
    marginLeft: 10,
    marginBottom: 5,
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
    fontSize: 15,
    color: "black",
    fontWeight: "bold",
    margin: 1,
  },
  fileTabTitleText: {
    fontSize: 25,
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
  sectionTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
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

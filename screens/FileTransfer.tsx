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
} from "react-native";

import * as FileSystem from "expo-file-system";
import Constants from "expo-constants";

import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";

import { base64reg, SIZE } from "../utils/Constants";
import { MaterialIcons } from "@expo/vector-icons";

import { Icon, Input, Card, Divider } from "react-native-elements";
import BigNumber from "bignumber.js";
import { Picker } from "@react-native-picker/picker";
import Clipboard from "@react-native-clipboard/clipboard";

import { setSnack } from '../features/files/snackbarSlice';

import NumericInput from 'react-native-numeric-input'

import Client10 from '../utils/APIClient10.js'

import axios from 'axios';

var strCoinSwap = "";




const FileTransfer: React.FC = () => {
  const { colors } = useAppSelector((state) => state.theme.theme);
  const { theme } = useAppSelector((state) => state.theme);
  var float_bttBalance = 0;
  var float_WBTT_Balance = 0;
  var float_Vault_WBTT_Balance = 0;
  const dispatch = useAppDispatch();
  //const [strBTTCAddress, setstrBTTCAddress] = useState('0x0000000000000000');
  const [bttBalance, setbttBalance] = useState('--');
  const [wbttBalance, setwbttBalance] = useState('--');
  const [vaultBalance, setvaultBalance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [amountToSwap, set_amountToSwap] = useState('');
  const [selectedSwap, setSelectedSwap] = useState(1);
  const [bttAddress, setbttAddress] = useState('');
  const [vaultAddress, setvaultAddress] = useState('');




  const copyToClipboard = () => {
    Clipboard.setString(bttAddress);
    dispatch(setSnack({ message: 'Address Copied to Clipboard' }));
  };

  function swapBTTtoWBTT() {


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
  }


  async function processSwap(swapOption) {
    console.log(swapOption);
    console.log(amountToSwap);

    switch (swapOption) {
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


  function btt2wbtt(){

  try{
  var oneBTT = new BigNumber(amountToSwap);
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


  const getBTTCAddress = async () => {
      try{
      let data1 = Client10.getChainInfo();
      let data2 = Client10.getChequeBTTBalance(bttAddress);
      let data3 = Client10.getChequeWBTTBalance(bttAddress);

      return Promise.all([data1, data2, data3]).then((result) => {
          setbttAddress(result[0].node_addr);
          setvaultAddress(result[0].vault_addr);
          //console.log(result[4].Message);
          //console.log(result[0]);
          var bttBalanceBig = new BigNumber(parseFloat(result[1].balance));
          bttBalanceBig = bttBalanceBig.shiftedBy(-18);
          bttBalanceBig = bttBalanceBig.toFixed();
          console.log(result[1]);
          setbttBalance(bttBalanceBig);
          //console.log(result[0].BttcAddress);
          //console.log(result[0].VaultAddress);
          //console.log(result[3].balance)
          var wbttBalanceBig = new BigNumber(parseFloat(result[2].balance));
          wbttBalanceBig = wbttBalanceBig.shiftedBy(-18);
          wbttBalanceBig = wbttBalanceBig.toFixed();
          console.log(result[2]);
          setwbttBalance(wbttBalanceBig);


          return {

          }
      })
  }
  catch (err) {

              throw err;

          }
  };

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


  useEffect(() => {
    const interval = setInterval( async () => {
      var response =  await getBTTCAddress();
      //console.log(response);
    }, 5000);
    return () => clearInterval(interval);
  }, []);





  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

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
            <Text style={styles.controlsText}>BTTC MainNet</Text>
          </View>

          <Card containerStyle={[styles.CardItem, { backgroundColor: theme.colors.background2 }]}>
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
                {bttAddress}
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
                {vaultAddress}
              </Text>

              <Text style={[styles.sectionItemText, { color: theme.colors.primary }]}>
                {"WBTT: "} {vaultBalance}
              </Text>

          </Card>

          <Divider width={20} />
          <Card containerStyle={[styles.CardItem, { backgroundColor: theme.colors.background2 }]}>
            <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>TOKEN Swap</Text>

            <View
              style={{
                flexDirection: "column",
                justifyContent: "space-around",
              }}
            >
              <Input style={[styles.sectionCardItemLeft, { color: theme.colors.primary }]}
                keyboardType="number-pad"
                placeholder="Amount"
                fontSize={12}
                onChangeText={async (value) => set_amountToSwap(value)}
                value={amountToSwap}
              />
              <Picker
                style={styles.sectionCardItemRight}
                selectedValue={selectedSwap}
                fontFamily="Poppins_500Medium"
                onValueChange={(itemValue, itemIndex) =>
                  setSelectedSwap(itemValue)
                }>
                <Picker.Item label="BTT to WBTT" value={1} />
                <Picker.Item label="WBTT to BTT" value={2} />
                <Picker.Item label="WBTT to WBTT(Vault)" value={3} />
                <Picker.Item label="WBTT(Vault) to WBTT" value={4} />
              </Picker>

              <TouchableOpacity
                style={styles.copyButton}
                onPress={processSwap.bind(this, selectedSwap)}
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
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  CardItem:{
    width: '95%',
    display: 'flex',
    justifyContent: 'space-between',
    borderRadius: 25,
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
    marginBottom: 5,
  },
  cardAddressText: {
    fontSize: 12,
    color: "black",
    //fontWeight: "normal"
  },
  controlsText: {
    fontSize: 15,
    color: "gray",
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
    fontSize: 20,
    fontWeight: "bold",
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
});

export default FileTransfer;

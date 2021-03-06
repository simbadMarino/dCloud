import React from 'react';
import  { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Button, Image, Alert, SafeAreaView, ScrollView } from 'react-native';
import {ProgressBar} from '@react-native-community/progress-bar-android';
//import { Overlay } from 'react-native-elements';
import DocumentPicker from 'react-native-document-picker';
import { ListItem, Icon, Card, Divider} from 'react-native-elements';
import axios from 'axios';
import { Dimensions } from 'react-native';
import { FloatingAction } from "react-native-floating-action";
import Root from './Root';
import Popup from './Popup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Clipboard from '@react-native-clipboard/clipboard';


var currentUploadSessionID = "";
var currentSessionIDMessage = "";
var currentFileQMhash = "";
var currentFileName = "";
var listPacksIndex = 0;
var statusProgress = 0;
var progressBarColor = '#3C3C42';
var timeOutWatchDogCounter = 0;
const MAX_UPLOAD_TIMEOUT = 500;





var  myVar1;
var  myVar2;
var  myVar3;
var  myVar4;
var  myVar5;
var  myVar6;
var myVar7;
var myVar8;
var myVar9;

function stopAllIntervals(){
    clearInterval(myVar3);
    clearInterval(myVar4);
    clearInterval(myVar5);
    clearInterval(myVar6);
    currentSessionIDMessage = "";
    timeOutWatchDogCounter = 0;
    currentUploadSessionID = "";
    //currentFileQMhash = "";
    currentFileName = "";
}





async function getUploadStatus() {

    timeOutWatchDogCounter ++;
    if(timeOutWatchDogCounter >= MAX_UPLOAD_TIMEOUT)
    {
        statusProgress = 1.0;
        progressBarColor = 'red';
        //this.updateProgressBarColor;
        //stopAllIntervals();
        setTimeout(stopAllIntervals,2000);
        //timeOutWatchDogCounter = 0;
    }
    console.log("WhatchDog Counter: " + timeOutWatchDogCounter);





    var response = "";
  	response =  axios.post("http://localhost:5001/api/v1/storage/upload/status?arg=" + currentUploadSessionID)
    .then(function (response) {

          //console.log(response);
          currentSessionIDMessage = response.data.Message;
          if(currentSessionIDMessage == 'Searching for recommended hosts???')
          {
            statusProgress = 0.1;
          }
          if(currentSessionIDMessage == 'Hosts found! Checking wallet balance and submitting contracts to escrow.')
          {
            statusProgress = 0.3;
          }
          if(currentSessionIDMessage == 'Contracts submitted! Confirming the escrow payment.')
          {
            statusProgress = 0.5;
          }
          if(currentSessionIDMessage == 'Payment successful! Preparing meta-data and challenge questions.')
          {
            statusProgress = 0.6;
          }
          if(currentSessionIDMessage == 'Confirming successful file shard storage by hosts.')
          {
            statusProgress = 0.8;
          }
          if(currentSessionIDMessage == 'File storage successful!')
          {
            statusProgress = 1.0;
            setTimeout(stopAllIntervals,6000);
            Popup.show({
               type: 'Success',
               title: 'Upload complete',
               buttontext: 'Ok',
               callback: () => Popup.hide(),

             })
          }
          if(currentSessionIDMessage == 'EscrowClient: rpc error: code = Unknown desc = met internal error, ERROR #42P01 relation "contract" does not exist')
          {
            statusProgress = 1.0;
            progressBarColor = 'red'
            //updateProgressBarColor;
            Alert.alert("Error", currentSessionIDMessage);
            setTimeout(stopAllIntervals,6000);
          }
          if(currentSessionIDMessage == 'GuardClient: rpc error: code = Unknown desc = Persistence manager: such file hash already exist for such renter')
          {
            statusProgress = 1.0;
            progressBarColor = 'red'
            //updateProgressBarColor;
            Alert.alert("Error", currentSessionIDMessage);
            setTimeout(stopAllIntervals,6000);
          }
          if(currentSessionIDMessage == 'EscrowClient: rpc error: code = Unknown desc = ledger error:LedgerClient: rpc error: code = Unavailable desc = Gateway Timeout: HTTP status code 504; transport: received the unexpected content-type "text/html"')
          {
            statusProgress = 1.0;
            progressBarColor = 'red';
            Alert.alert("Error", currentSessionIDMessage);
            setTimeout(stopAllIntervals,6000);
          }
          if(currentSessionIDMessage == 'EscrowClient: rpc error: code = Unknown desc = ledger error:rpc error: code = Unavailable desc = Gateway Timeout: HTTP status code 504; transport: received the unexpected content-type "text/html"')
          {
            statusProgress = 1.0;
            progressBarColor = 'red';
            Alert.alert("Error", currentSessionIDMessage);
            setTimeout(stopAllIntervals,6000);
          }
          if(currentSessionIDMessage == 'GuardClient: rpc error: code = Unavailable desc = transport is closing')
          {
            statusProgress = 1.0;
            progressBarColor = 'red';
            Alert.alert("Error", currentSessionIDMessage);
            setTimeout(stopAllIntervals,6000);
          }
          if(currentSessionIDMessage == 'context deadline exceeded')
          {
            statusProgress = 1.0;
            progressBarColor = 'red'
            //updateProgressBarColor
            Alert.alert("Error", currentSessionIDMessage);
            //stopAllIntervals();
            setTimeout(stopAllIntervals,6000);
          }

        //  console.log("|"+"Upload Message: " + currentSessionIDMessage + "|" + "Session ID:  " + currentUploadSessionID + "|" + "QmHash: " + currentFileQMhash + "|");
         // Alert.alert("BTFS", "|"+"Upload Message: " + currentSessionIDMessage + "|" + "Session ID:  " + currentUploadSessionID + "|" + "QmHash: " + currentFileQMhash + "|");


    })
  }


export default class App extends React.Component {


state = {
    hashText: '',
    fileName: "",
    uploadSts: "",
    progressBarSts: 0.0,
    progressBarColor: '#3C3C42'


}





  componentWillUnMount() {
    clearInterval(this.timer);  }








    updateQMhash = () => {
         this.setState({hashText: currentFileQMhash})
      }



    updateFileName = () => {
         this.setState({fileName: currentFileName})
     }

     updateUploadSts = () => {
        this.setState({uploadSts: currentSessionIDMessage})
     }

    updateProgressBarSts = () => {
        this.setState({progressBarSts: statusProgress})
    }

    updateProgressBarColor = () => {
        this.setState({progressBarColor: progressBarColor})
    }







  _pickDocument = async () => {


	    // Pick a single file
        try {

        //Reset global vars...


            currentSessionIDMessage = "";
           // list[listPacksIndex][0].title = this.state.fileName ;
          const res = await DocumentPicker.pick({
            type: [DocumentPicker.types.allFiles],
          });
          console.log(
            res.uri,
            res.type, // mime type
            res.name,
            res.size
          );
          currentFileName = res.name;

          const formData = new FormData();
          formData.append(res.name, {
            uri: res.uri,
            name: res.name ,
            type: res.type
          });
          var addFileReedSolomonData = axios.post("http://localhost:5001/api/v1/add?chunker=reed-solomon", formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
          })

          .then(function (addFileReedSolomonData) {
                currentFileQMhash = addFileReedSolomonData.data.Hash;

                //Alert.alert(currentFileQMhash);
                console.log("File BTFS QMhash: " + currentFileQMhash);
                console.log("QMhash obtained :), proceeding to upload file...");


                var fileUploadID = axios.post("http://localhost:5001/api/v1/storage/upload?arg=" + currentFileQMhash)
                .then(function (fileUploadID){
                   //console.log(fileUploadID);
                   currentUploadSessionID = fileUploadID.data.ID;
                   console.log("Current Upload Session ID: " + currentUploadSessionID);
                 })
          })
            progressBarColor = 'green'
            myVar1 = setTimeout(this.updateQMhash, 500);
            myVar2 = setTimeout(this.updateFileName, 700);
            myVar3 = setInterval(getUploadStatus, 4000);
            myVar4 = setInterval(this.updateUploadSts,4200);
            myVar5 = setInterval(this.updateProgressBarSts,5000);
            myVar6 = setInterval(this.updateProgressBarColor,5000);
            //myVar7 = setTimeout(getBalanceBTT,3000);


        }

         catch (err) {
          if (DocumentPicker.isCancel(err)) {
            // User cancelled the picker, exit any dialogs or menus and move on
          } else {
            throw err;
          }
        }
	}

   _pickImage = async () => {
// Pick multiple files
try {
  const results = await DocumentPicker.pickMultiple({
    type: [DocumentPicker.types.images],
  });
  for (const res of results) {
    console.log(
      res.uri,
      res.type, // mime type
      res.name,
      res.size
    );
  }
} catch (err) {
  if (DocumentPicker.isCancel(err)) {
    // User cancelled the picker, exit any dialogs or menus and move on
  } else {
    throw err;
  }
}
  };

  render() {



         const copyToClipboard = () => {
            Clipboard.setString("https://gateway.btfs.io/btfs/" + currentFileQMhash);
          };


        //const barWidth = Dimensions.get('screen').width - 30;
         /*const list = [         //Creating the array of dictionaries
           {
             title: this.state.fileName,
             icon: 'sync',
             subtitle: this.state.hashText
           },
           {
            title: 'Hello',
            icon: 'sync',
            subtitle: "hello"
          },
           // more items
         ]*/

         const list = [
           {
             title: this.state.fileName,
             icon: 'cloud-off',
             subtitle: this.state.hashText
           }

         ]




         const actions = [
           {
             text: "Single File",
             icon: require("./uploadSingle.png"),
             name: "single_file",
             position: 4
           },/*
           {
             text: "Send tip",
             icon: require("./uploadMultiple.png"),
             name: "multi_file",
             position: 3
           },
           {
             text: "Deposit BTT",
             icon: require("./uploadMultiple.png"),
             name: "deposit",
             position: 2
           },
           {
             text: "Withdraw BTT",
             icon: require("./uploadMultiple.png"),
             name: "withdraw",
             position: 1
           }*/

         ];


    return (

    <Root>
      <View style={styles.container}>

                <View style={styles.user} height = {30}>
                  <Text style={styles.fileTabTitleText}> Browse </Text>
                  <Divider
                     orientation="horizontal"
                     subHeader=" "
                     color = '#3C3C42'
                   />
                </View>

                 <Text
                   selectable = {true}
                   style={styles.controlsText}
                  >
                   {currentFileQMhash}
                  </Text>
                  <Text
                   style={styles.controlsText}
                  >
                   {this.state.uploadSts}
                 </Text>
                  <ProgressBar
                    styleAttr="Horizontal"
                   // styleAttr="LargeInverse"
                    animating = {true}
                    color = {this.state.progressBarColor}
                    indeterminate={false}
                    progress={this.state.progressBarSts}
                    width = {Dimensions.get('window').width }

                 />
                 <Divider
                   orientation="horizontal"
                   subHeader=" "
                   subHeaderStyle={{ color: 'blue' }}
                 />

          {
            list.map((item, i) => (


              <ListItem.Swipeable key={i} bottomDivider

                rightContent={
                                  <TouchableOpacity style={styles.shareButton} >
                                     <Text style={styles.listbuttonShare}
                                     onPress={copyToClipboard}
                                     >
                                        Share</Text>
                                  </TouchableOpacity>
                             }
              >

                <Icon name={item.icon} />

                <ListItem.Content>
                  <ListItem.Title>{item.title}</ListItem.Title>
                </ListItem.Content>
                <ListItem.Chevron />


              </ListItem.Swipeable>
            ))
          }


            <FloatingAction
                actions={actions}
                showBackground={false}
                onPressItem={name => {
                  if(name == 'single_file')
                  {
                    console.log("Opening Single file prompt..");
                    this._pickDocument();

                  }
                  else if (name =='multi_file')
                  {
                    sendDevTipMainNetBTT();
                  }
                  else if (name =='deposit')
                  {
                    depositBTT();
                  }

                }}
             />
      </View>
    </Root>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width
  },

  scroll_container: {
  flex: 1,
  marginTop: 5,
  width: Dimensions.get('window').width
    },
  controlsText: {
    fontSize: 12,
    color: 'white'
    //fontWeight: "normal"
  },
  listbuttonOffline:{
  color: 'white'
  },
   listbuttonShare:{
    color: 'white'
    },
  offlineButton:{
        width:"100%",
        backgroundColor:"green",
        borderRadius:5,
        height:70,
        alignItems:"center",
        justifyContent:"center",
        marginTop:1,
        marginBottom:5
      },
  shareButton:{
        width:"100%",
        backgroundColor:"#1e90ff",
        borderRadius:5,
        height:70,
        alignItems:"center",
        justifyContent:"center",
        marginTop:1,
        marginBottom:5
      },

  cardRenter: {
        display: "flex",
        height: 90,
        //flexDirection: "column",
        backgroundColor: '#525248',
        margin: 0
        },

  fileTabTitleText: {

      fontSize: 24,
      color: 'white'


  }


});

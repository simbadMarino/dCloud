import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Button,
  TextInput,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  RefreshControl
} from 'react-native';

import * as FileSystem from 'expo-file-system';
import Constants from 'expo-constants';


import { io, Socket } from 'socket.io-client';

import { useAppSelector } from '../hooks/reduxHooks';
import {
  fileItem,
  fileRequestMessage,
  newFileTransfer,
  newFolderRequest,
} from '../types';

import { base64reg, SIZE } from '../utils/Constants';
import { MaterialIcons } from '@expo/vector-icons';

import { Icon, Input, Card, Divider} from 'react-native-elements';
import BigNumber from "bignumber.js";
import {Picker} from '@react-native-picker/picker';
import Clipboard from '@react-native-clipboard/clipboard';


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




const FileTransfer: React.FC = () => {
  const { colors } = useAppSelector((state) => state.theme.theme);
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(true);
  const [socket, setSocket] = useState<Socket>(io());
  const [socketURL, setSocketURL] = useState('');
  const [roomID, setRoomID] = useState('1234');
  const [_, setState] = useState(false);
  const fileChunk = React.useRef('');
    
    var float_bttBalance = 0;
    var float_WBTT_Balance = 0;
    var float_Vault_WBTT_Balance = 0;
    
    
    var strBTTCAddress = " ";

  const connectServer = () => {
    if (!socket.connected) {
      const newSocket = io(socketURL);
      setSocket(newSocket);
      setTimeout(() => {
        setState((prev) => !prev);
      }, 500);
    }
  };

  useEffect(() => {
    return () => socket.close();
  }, []);

  useEffect(() => {
    (async () => {

    })();
  }, []);

  useEffect(() => {
    socket.on('connected', (data) => {
      console.log(data);
    });
  }, [socket]);

  const handleScan = ({ _, data }) => {
    setScanned(true);
    setSocketURL(data);
  };

  const joinRoom = () => {
    socket.emit('joinRoom', { room: roomID, device: 'phone' });
    socket.on('welcome', (msg) => {
      setState((prev) => !prev);
    });
    socket.on('request', (msg: fileRequestMessage) => {
      const baseDir =
        msg.basedir === 'docdir'
          ? FileSystem.documentDirectory
          : FileSystem.cacheDirectory;
      const path = baseDir + msg.path;
      FileSystem.readDirectoryAsync(path)
        .then((files) => {
          const filesProms = files.map((fileName) =>
            FileSystem.getInfoAsync(path + '/' + fileName)
          );
          Promise.all(filesProms).then((results) => {
            let tempfiles: fileItem[] = results.map((file) =>
              Object({
                ...file,
                name: file.uri.split('/').pop(),
                selected: false,
              })
            );
            socket.emit('respond', { path, files: tempfiles });
          });
        })
        .catch((err) => console.log(err));
    });

    socket.on('readfile', (msg: fileRequestMessage) => {
      const baseDir =
        msg.basedir === 'docdir'
          ? FileSystem.documentDirectory
          : FileSystem.cacheDirectory;
      const path = baseDir + msg.path;
      FileSystem.readAsStringAsync(path, {
        encoding: 'base64',
      })
        .then((file) => {
          transferChunks(file, 1024 * 300, file.length, socket);
        })
        .catch((err) => console.log(err));
    });

    socket.on('newfolder', (msg: newFolderRequest) => {
      const newFolderURI =
        FileSystem.documentDirectory + '/' + msg.path + '/' + msg.name;
      FileSystem.getInfoAsync(newFolderURI).then((res) => {
        if (!res.exists) {
          FileSystem.makeDirectoryAsync(newFolderURI);
        }
      });
    });

    socket.on('sendfile', (msg: newFileTransfer) => {
      fileChunk.current += msg.file;
      if (msg.file.length === msg.size) {
        const base64Data = fileChunk.current.replace(base64reg, '');
        const newFilePath =
          FileSystem.documentDirectory + '/' + msg.path + '/' + msg.name;
        FileSystem.getInfoAsync(newFilePath).then((res) => {
          if (!res.exists) {
            FileSystem.writeAsStringAsync(newFilePath, base64Data, {
              encoding: 'base64',
            });
          }
        });
        fileChunk.current = '';
      }
    });
  };

  const transferChunks = (
    data: string,
    bufferSize: number,
    totalSize: number,
    socket: Socket
  ) => {
    let chunk = data.slice(0, bufferSize);
    data = data.slice(bufferSize, data.length);
    socket.emit('respondfile', { file: chunk, size: totalSize });
    if (data.length !== 0) {
      transferChunks(data, bufferSize, totalSize, socket);
    }
  };

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
    
    const [refreshing, setRefreshing] = React.useState(false);
    const [number, setNumber] = React.useState(null);
    const [selectedSwap, setSelectedSwap] = useState(1);
    
    const onRefresh = React.useCallback(() => {
          setRefreshing(true);
          wait(2000).then(() => setRefreshing(false));
        }, []);
    
  return (
          <View style={{ ...styles.container, backgroundColor: colors.background }}>
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
         
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: 'flex-start',
                  width: 340
                }}
              >
          <Text style={styles.fileTabTitleText}
             >Wallet Manager</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: 'flex-start',
              width: 340
            }}
          >
          <Text style={styles.controlsText}
             >BTTC MainNet</Text>
          
          </View>
                  <Card containerStyle={styles.cardRenter}>

                      <View>
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: 'flex-start',
                              width: 340
                            }}
                          >
                          <Text selectable style={styles.cardAddrTitleText} >BTTC Address</Text>
                            <Icon

                                    name='copy'
                                    type='font-awesome'
                                    color='black'
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

          <Divider width={20} />
                     <Card containerStyle={styles.cardSwap}>
                                     <View style={{width: 340}}>
                                     <Text style={styles.cardAddrTitleText} >dCloud Swap</Text>

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
                                               style={{ height: 10, width: 290, color: "black", fontSize: 16, alignSelf: 'center' }}
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

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight + 20,
    padding: 10,
  },


  cardSwap: {
  display: "flex",
  height: 220,
  //flexDirection: "column",
  backgroundColor: '#484D50',
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
  borderTopColor: 'black',
  borderTopWidth: 10,
  borderLeftWidth: 0,
  borderRightWidth: 20,
  borderBottomWidth: 0
  },
    scrollView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start'
      },
cardAddrTitleText: {
    fontSize: 16,
    color: 'black',
    fontWeight: "bold",
    margin: 1
    },
 cardBalanceText: {
      fontSize: 15,
      color:"black",
      margin: 1
      },
copyButton:{
    width:"30%",
    backgroundColor:"#6495ed",
    borderRadius:15,
    height:40,
    alignItems:"center",
    justifyContent:"center",
    marginTop:5,
    marginBottom:5
  },
cardAddressText: {
   fontSize: 12,
   color: 'black'
   //fontWeight: "normal"
 },
controlsText: {
fontSize: 15,
color: 'gray',
//fontWeight: "normal"
},
cardRenter: {
    display: "flex",
    height: 210,
    opacity:0.7,
    //flexDirection: "column",
    backgroundColor: '#E3AD12',
    borderColor: 'gray',
    borderRadius: 25,
    borderTopColor: 'gray',
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0
},
cardMainNetText: {
fontSize: 15,
color: 'black',
fontWeight: "bold",
margin: 1
},
fileTabTitleText: {
  fontSize: 20,
  fontWeight: "bold",
  color: 'gray'
},
    
tabMenuText:{
    color:"black",
    fontWeight: "bold"
  },
});

export default FileTransfer;

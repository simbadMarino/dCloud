/* eslint-disable no-undef */
import React, { useState, useEffect } from "react";
import {View, Text, SafeAreaView, StatusBar, Dimensions, StyleSheet, ScrollView, Image, TextInput, Button, Alert, NativeModules, KeyboardAvoidingView} from 'react-native';
const {width} = Dimensions.get('window');
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SelectDropdown from 'react-native-select-dropdown';
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import Client10 from '../utils/APIClient10.js'

export default TerminalScreen = () => {
  const { colors } = useAppSelector((state) => state.theme.theme);
  const [text, onChangeText] = React.useState('');
  //const bodyText = "$ echo \" Under construction...\"\n   Under construction..."
  const [commandSelectedString, setcommandSelectedString] = useState('version');
  const [terminalText, setterminalText] = useState('@dcloudterminal:~$ ');


  function sendCommand(cmd){
    if(cmd == "clear screen")
    {
      setterminalText("@dcloudterminal:~$ ");
    }
    else
    {
      cmd = cmd.replace(" ","/");
      console.log("Sending command: " + cmd);
      var cmdReady = '/api/v1/' + cmd + '?arg=' + text;
      let data = Client10.generalCommand(cmdReady);
      //BTFSModule("init","G");

      Promise.resolve(data).then(function(data) {
        console.log(data); // "Success"
        setterminalText(terminalText.concat('\n@dcloudterminal:~$ ' + JSON.stringify(data).replaceAll(",","\n")));
      }, function(data) {
        // not called
      });

    }

}

  const btfs_commands = [
    'accesskey',
    'accesskey delete',
    'accesskey disable',
    'accesskey enable',
    'accesskey generate',
    'accesskey get',
    'accesskey list',
    'accesskey reset',
    'add',
    'backup',
    'bitswap',
    'bitswap ledger',
    'bitswap reprovide',
    'bitswap stat',
    'bitswap wantlist',
    'bittorrent',
    'bittorrent bencode',
    'bittorrent download',
    'bittorrent metainfo',
    'bittorrent scrape',
    'bittorrent serve',
    'block',
    'block get',
    'block put',
    'block rm',
    'block stat',
    'bootstrap',
    'bootstrap add',
    'bootstrap add default',
    'bootstrap list',
    'bootstrap rm',
    'bootstrap rm all',
    'bttc',
    'bttc btt2wbtt',
    'bttc send-btt-to',
    'bttc send-token-to',
    'bttc send-wbtt-to',
    'bttc wbtt2btt',
    'cat',
    'cheque',
    'cheque all_token_balance',
    'cheque bttbalance',
    'cheque cash',
    'cheque cashlist',
    'cheque cashstatus',
    'cheque chaininfo',
    'cheque fix_cheque_cashout',
    'cheque price',
    'cheque price-all',
    'cheque receive',
    'cheque receive-history-list',
    'cheque receive-history-peer',
    'cheque receive-history-stats',
    'cheque receive-history-stats-all',
    'cheque receive-total-count',
    'cheque receivelist',
    'cheque receivelistall',
    'cheque send',
    'cheque send-history-list',
    'cheque send-history-peer',
    'cheque send-history-stats',
    'cheque send-history-stats-all',
    'cheque send-total-count',
    'cheque sendlist',
    'cheque sendlistall',
    'cheque stats',
    'cheque stats-all',
    'cheque token_balance',
    'cid',
    'cid base32',
    'cid bases',
    'cid codecs',
    'cid format',
    'cid hashes',
    'commands',
    'config',
    'config edit',
    'config optin',
    'config optout',
    'config replace',
    'config reset',
    'config show',
    'config storage-host-enable',
    'config sync-chain-info',
    'config sync-simple-mode',
    'clear screen',
    'daemon',
    'dag',
    'dag export',
    'dag get',
    'dag import',
    'dag put',
    'dag resolve',
    'dag stat',
    'dht',
    'dht findpeer',
    'dht findprovs',
    'dht get',
    'dht provide',
    'dht put',
    'dht query',
    'diag',
    'diag cmds',
    'diag cmds clear',
    'diag cmds set-time',
    'diag sys',
    'dns',
    'file',
    'file ls',
    'files',
    'files chcid',
    'files cp',
    'files flush',
    'files ls',
    'files mkdir',
    'files mv',
    'files read',
    'files rm',
    'files stat',
    'files write',
    'filestore',
    'filestore dups',
    'filestore ls',
    'filestore verify',
    'get',
    'guard',
    'guard test',
    'guard test send-challenges',
    'id',
    'init',
    'key',
    'key gen',
    'key list',
    'key rename',
    'key rm',
    'log',
    'log level',
    'log ls',
    'log tail',
    'ls',
    'metadata',
    'metadata add',
    'metadata rm',
    'mount',
    'multibase',
    'multibase decode',
    'multibase encode',
    'multibase list',
    'multibase transcode',
    'name',
    'name publish',
    'name pubsub',
    'name pubsub cancel',
    'name pubsub state',
    'name pubsub subs',
    'name resolve',
    'network',
    'object',
    'object data',
    'object diff',
    'object get',
    'object links',
    'object new',
    'object patch',
    'object patch add-link',
    'object patch append-data',
    'object patch rm-link',
    'object patch set-data',
    'object put',
    'object stat',
    'p2p',
    'p2p close',
    'p2p forward',
    'p2p handshake',
    'p2p listen',
    'p2p ls',
    'p2p stream',
    'p2p stream close',
    'p2p stream ls',
    'pin',
    'pin add',
    'pin ls',
    'pin rm',
    'pin update',
    'pin verify',
    'ping',
    'pubsub',
    'pubsub ls',
    'pubsub peers',
    'pubsub pub',
    'pubsub sub',
    'recovery',
    'refs',
    'refs local',
    'repo',
    'repo fsck',
    'repo gc',
    'repo stat',
    'repo verify',
    'repo version',
    'resolve',
    'restart',
    'rm',
    'settlement',
    'settlement list',
    'settlement peer',
    'shutdown',
    'stats',
    'stats bitswap',
    'stats bw',
    'stats dht',
    'stats repo',
    'statuscontract',
    'statuscontract config',
    'statuscontract daily_last_report_time',
    'statuscontract daily_report_list',
    'statuscontract daily_report_online_server',
    'statuscontract daily_total',
    'statuscontract lastinfo',
    'statuscontract report_online_server',
    'statuscontract reportlist',
    'statuscontract total',
    'storage',
    'storage announce',
    'storage challenge',
    'storage challenge request',
    'storage challenge response',
    'storage contracts',
    'storage contracts list',
    'storage contracts stat',
    'storage contracts sync',
    'storage dcrepair',
    'storage dcrepair request',
    'storage dcrepair response',
    'storage hosts',
    'storage hosts info',
    'storage hosts sync',
    'storage info',
    'storage path',
    'storage path capacity',
    'storage path list',
    'storage path migrate',
    'storage path mkdir',
    'storage path status',
    'storage path volumes',
    'storage stats',
    'storage stats info',
    'storage stats list',
    'storage stats sync',
    'storage upload',
    'storage upload cheque',
    'storage upload getcontractbatch',
    'storage upload getunsigned',
    'storage upload init',
    'storage upload recvcontract',
    'storage upload repair',
    'storage upload sign',
    'storage upload signcontractbatch',
    'storage upload status',
    'storage upload supporttokens',
    'swarm',
    'swarm addrs',
    'swarm addrs listen',
    'swarm addrs local',
    'swarm connect',
    'swarm disconnect',
    'swarm filters',
    'swarm filters add',
    'swarm filters rm',
    'swarm peers',
    'tar',
    'tar add',
    'tar cat',
    'test',
    'test cheque',
    'test hosts',
    'test p2phandshake',
    'urlstore',
    'urlstore add',
    'vault',
    'vault address',
    'vault balance',
    'vault balance_all',
    'vault deposit',
    'vault upgrade',
    'vault wbttbalance',
    'vault withdraw',
    'version',
    'version deps',
  ];




  return (


    <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    style={styles.container}>
      <View style={{...styles.viewContainer, backgroundColor: colors.background}}>

      <View style={{backgroundColor: 'black', flex: 1}} >
      <ScrollView
        showsVerticalScrollIndicator={true}
        alwaysBounceVertical={true}
        contentContainerStyle={styles.scrollViewContainer}>


          <Text style={styles.baseText} >
            <Text selectable={true} >{terminalText}</Text>
          </Text>

        </ScrollView>
        </View>

          <SelectDropdown
            data={btfs_commands}
            style={{flex: 1}}
             defaultValueByIndex={287}
            // defaultValue={'England'}
            onSelect={(selectedItem, index) => {
              console.log(selectedItem, index);
              setcommandSelectedString(selectedItem);
            }}
            defaultButtonText={'Select command'}
            buttonTextAfterSelection={(selectedItem, index) => {
              return selectedItem;
            }}
            rowTextForSelection={(item, index) => {
              return item;
            }}
            buttonStyle={styles.dropdown2BtnStyle}
            buttonTextStyle={styles.dropdown2BtnTxtStyle}
            renderDropdownIcon={isOpened => {
              return <FontAwesome name={isOpened ? 'chevron-up' : 'chevron-down'} color={'#FFF'} size={18} />;
            }}
            dropdownIconPosition={'right'}
            dropdownStyle={styles.dropdown2DropdownStyle}
            rowStyle={styles.dropdown2RowStyle}
            rowTextStyle={styles.dropdown2RowTxtStyle}
            selectedRowStyle={styles.dropdown2SelectedRowStyle}
            search
            searchInputStyle={styles.dropdown2searchInputStyleStyle}
            searchPlaceHolder={'Search here'}
            searchPlaceHolderColor={'#F8F8F8'}
            renderSearchInputLeftIcon={() => {
              return <FontAwesome name={'search'} color={'#FFF'} size={18} />;
            }}
          />
          <View
            style={{
              flexDirection: 'row',
              flex: 0.1,
            }}>
          <TextInput
            style={styles.input}
            onChangeText={onChangeText}
            value={text}
            numberOfLines={2}
            placeholder="type the cmd arguments separated by a semicolon, eg: 24;true"
          />
          <Button
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            padding: 10,
            margin: 5

          }}
            backgroundColor="black"
            title="Send"
            textAlign="center"
            onPress={() => sendCommand(commandSelectedString)}
          />
          </View>
      </View>
      </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  baseText: {
    //fontFamily: 'terminal',
    fontSize: 16,
    color: 'green',
    marginTop: 40,
    marginLeft: 10
  },

  //saveAreaViewContainer: {flex: 1, backgroundColor: '#000'},
  viewContainer: {flex: 1, backgroundColor: '#FFF'},
  scrollViewContainer: {
    flexGrow: 1,
    //justifyContent: 'space-between',
    //alignItems: 'center',
    //paddingVertical: '10%',
    //paddingBottom: '20%',
  },



  dropdown2BtnStyle: {
    width: '85%',
    backgroundColor: '#444',
    borderRadius: 8,
    margin: 1
  },
  dropdown2BtnTxtStyle: {
    color: '#FFF',
    textAlign: 'left',
    fontWeight: 'bold',
    fontSize: 15,
  },
  dropdown2DropdownStyle: {
    backgroundColor: '#444',
    borderRadius: 12,
  },
  dropdown2RowStyle: {backgroundColor: '#444', borderBottomColor: '#C5C5C5'},
  dropdown2RowTxtStyle: {
    color: '#FFF',
    textAlign: 'left',
    fontWeight: 'bold',
  },
  dropdown2SelectedRowStyle: {backgroundColor: 'rgba(255,255,255,0.2)'},
  dropdown2searchInputStyleStyle: {
    backgroundColor: '#444',
    borderBottomWidth: 1,
    borderBottomColor: '#FFF',
  },

  input: {
    margin: 1,
    backgroundColor: '#444',
    padding: 10,
    color: 'white',
    borderRadius: 12,
    width: '85%',
  },


});

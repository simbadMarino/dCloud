import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity, Button, Alert, TextInput, SafeAreaView, ScrollView, RefreshControl, NativeModules } from 'react-native';
import { Feather, FontAwesome5 } from '@expo/vector-icons';

import useLock from '../../hooks/useLock';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { setDarkTheme, setLightTheme } from '../../features/files/themeSlice';

import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import useBiometrics from '../../hooks/useBiometrics';
import { setSnack } from '../../features/files/snackbarSlice';
import { SIZE } from '../../utils/Constants';

import Client10 from '../../utils/APIClient10.js'

//import axios from 'axios';

import NumericInput from 'react-native-numeric-input'

import Clipboard from '@react-native-clipboard/clipboard';

const {BTFSmodule} = NativeModules;



const Settings: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { theme } = useAppSelector((state) => state.theme);
  const { pinActive } = useLock();
  const { biometricsActive, hasHardware, isEnrolled, handleBiometricsStatus } =useBiometrics();
  const dispatch = useAppDispatch();



//127.0.0.1:5001/
const [btfs_sts, setBTFS_sts] = useState('');
const [node_id, set_node_id] = useState('');
const [btfs_ver, set_btfs_ver] = useState('');
const [btfs_peers, set_btfs_peers] = useState('');
const [btfs_uptime, set_btfs_uptime] = useState('');
const [default_storage, set_default_storage] = useState(0);
const [host_score,set_host_score] = useState('');
const [isEnabled, setIsEnabled] = useState(false);
const [enableDaemon, setenableDaemon] = useState(false);
const [btfsCmd, setBTFSCmd] = useState('');
const [refreshing, setRefreshing] = useState(false);
const [bttcAddress, setbttcAddress] = useState('');
const [btfsRepo, setbtfsRepo] = useState(false);


const enableHostMode = async (en) => {
    let data = Client10.enableHostMode(en);
    console.log("Executing host enable");
    return Promise.all(data).then((result) => {

      //console.log(result);
    }


    )

};

const enableBTFSDaemon = async (en) => {
  if(en)
    BTFSmodule.main("daemon --chain-id 199","commands");

}

const initializeRepo = async () => {
  BTFSmodule.main("init","commands");
  /*let data = Client10.setApiUrl("http://127.0.0.1:5001");
  Promise.resolve(data).then(function(data) {
    console.log(data); // "Success"

      Alert.alert("Repo initialized in dCloud/Documents :)");


}, function(data) {
  // not called
});*/

}

function getGuideData(){


  let data = Client10.requestGuide();

  Promise.resolve(data).then(function(data) {
    console.log(data); // "Success"
    setbttcAddress(data['bttc_address']? data['bttc_address'] : '--');

}, function(data) {
  // not called
});
}

const getNodeBasicStats = async () => {
    let data1 = Client10.getHostInfo();
    let data2 = Client10.getHostScore();
    let data3 = Client10.getPeers();
    let data4 = Client10.getHostVersion();
    let data5 = Client10.getNetworkStatus();
    //let data6 = Client10.requestGuide();

    return Promise.all([data1, data2, data3, data4, data5]).then((result) => {
        //console.log(result[4]);
        //console.log(result[0]);
        set_node_id(result[0]['ID'] ? result[0]['ID'] : '--');
      //  console.log("GUIDE: " + result[5]);
        set_btfs_ver(result[3]['Version'] ? result[3]['Version'] : '--');

        //set_host_score
        let status = null;
        let message = null;
        if (result[4]['code_bttc'] === 2 && result[4]['code_status'] === 2) {
            status = 1;
            message = 'online';
            setBTFS_sts('Online_Host');
        }
        if (result[4]['code_bttc'] === 2 && result[4]['code_status'] === 1) {
            status = 1;
            message = 'online';
            setBTFS_sts('Online_Renter');
        }
        if (result[4]['code_bttc'] === 3) {
            status = 2;
            message = ['network_unstable_bttc', 'check_network_request'];
            setBTFS_sts('Offline');

        }
        if (result[4]['code_status'] === 3) {
            status = 2;
            message = ['network_unstable_btfs', 'check_network_request'];
            setBTFS_sts('Offline');
        }
        if (result[4]['code_bttc'] === 3 && result[4]['code_status'] === 3) {
            status = 3;
            message = ['network_unstable_bttc', 'network_unstable_btfs', 'check_network_request'];
            setBTFS_sts('Offline');
        }
       if (result[4].Message ==="network error or host version not up to date")
       {
            message = 'offline';
            setBTFS_sts('Offline');
            dispatch(setSnack({ message: 'Network error / BTFS node not started' }));
       }

        return {
            ID: result[0]['ID'] ? result[0]['ID'] : '--',
            uptime: result[1]['host_stats'] ? (result[1]['host_stats']['uptime'] * 100).toFixed(0) : '--',
            peers: result[2]['Peers'] ? result[2]['Peers'].length : '--',
            version: result[3]['Version'] ? result[3]['Version'] : '--',
            status: status,
            message: message,
        }
    })
};

useEffect(() => {
  const interval = setInterval( async () => {
    var response =  await getNodeBasicStats();
    var response2 = await getGuideData();
    console.log(response2);
  }, 1500);
  return () => clearInterval(interval);
}, []);


useEffect(()  => {
  const setPreviousHostEnable = async () => {
  const storedHostEnabled = await AsyncStorage.getItem('host_enable');
  console.log(storedHostEnabled);
  let boolStoredHostEnable = (storedHostEnabled === 'true');  //Converting string to boolean
  setIsEnabled(boolStoredHostEnable);

  };
  setPreviousHostEnable();

},[]);

useEffect(()  => {
  const setPreviousInitRepoSts= async () => {
  const storedRepoSts= await AsyncStorage.getItem('btfsrepo_enable');
  console.log(storedRepoSts);
  let boolStoredRepoSts = (storedRepoSts === 'true');   //Converting string to boolean
  setbtfsRepo(boolStoredRepoSts);

  };
  setPreviousInitRepoSts();

},[]);

useEffect(()  => {
  const setPreviousStorageDuration = async () => {
  const storedStorageDuration = await AsyncStorage.getItem('storage_duration');
  console.log(storedStorageDuration);
  let numericstoredStorageDuration = parseInt(storedStorageDuration);
  set_default_storage(numericstoredStorageDuration);

  };
  setPreviousStorageDuration();

},[]);

const copyToClipboard = () => {
    Clipboard.setString(node_id);
    console.log("Copied: " + node_id);
    dispatch(setSnack({ message: 'Node ID copied to clipboard!' }));
  };

  const copyToClipboardAddress = () => {
      Clipboard.setString(bttcAddress);
      console.log("Copied: " + bttcAddress);
      dispatch(setSnack({ message: 'Address copied to clipboard!' }));
    };

const sendBTFScmd = () => {
    Alert.alert("Command sent");
    BTFSmodule.main(btfsCmd,"commands");

};
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
    <SafeAreaView style={{flex:1}}>
      <ScrollView
        contentContainerStyle={styles.scrollView}

      >
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>
          PREFERENCES
        </Text>
        <View
          style={[
            styles.sectionItem,
            { backgroundColor: theme.colors.background2 },
          ]}
        >
          <View style={styles.sectionItemLeft}>
            <Feather
              name={theme.dark ? 'moon' : 'sun'}
              size={24}
              color={theme.colors.primary}
            />
          </View>
          <View style={styles.sectionItemCenter}>
            <Text
              style={[styles.sectionItemText, { color: theme.colors.primary }]}
            >
              Dark Mode
            </Text>
          </View>
          <View style={styles.sectionItemRight}>
            <Switch
              value={theme.dark}
              trackColor={{
                false: theme.colors.switchFalse,
                true: '#6495ed',
              }}
              thumbColor={theme.colors.switchThumb}
              onChange={async () => {
                if (theme.dark) {
                  dispatch(setLightTheme());
                  await AsyncStorage.setItem('colorScheme', 'light');
                } else {
                  dispatch(setDarkTheme());
                  await AsyncStorage.setItem('colorScheme', 'dark');
                }
              }}
            />
          </View>
        </View>
      </View>

      <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>
            BTFS SETTINGS
          </Text>

          <View
            style={[
              styles.sectionItem,
              { backgroundColor: theme.colors.background2 },
            ]}
          >
            <View style={styles.sectionItemLeft}>
              <Feather
                name={'cloud'}
                size={24}
                color={theme.colors.primary}
              />
            </View>
            <View style={styles.sectionItemCenter}>
              <Text
                style={[styles.sectionItemText , { color: theme.colors.primary }]} numberOfLines = { 1 } ellipsizeMode = 'middle'
              >
                {node_id}
              </Text>
            </View>
            <View style={styles.sectionItemRight}>
            <Feather
              name={'copy'}
              size={24}
              color={theme.colors.primary}
              onPress={copyToClipboard}
            />
            </View>
        </View>


            <View
              style={[
                styles.sectionItem,
                { backgroundColor: theme.colors.background2 },
              ]}
            >
              <View style={styles.sectionItemLeft}>
                <Feather
                  name={'map'}
                  size={24}
                  color={theme.colors.primary}
                />
              </View>
              <View style={styles.sectionItemCenter}>
                <Text
                  style={[styles.sectionItemText , { color: theme.colors.primary }]} numberOfLines = { 1 } ellipsizeMode = 'middle'
                >
                  {bttcAddress}
                </Text>
              </View>
              <View style={styles.sectionItemRight}>
              <Feather
                name={'copy'}
                size={24}
                color={theme.colors.primary}
                onPress={copyToClipboard}
              />
              </View>
          </View>


          <View
            style={[
              styles.sectionItem,
              { backgroundColor: theme.colors.background2 },
            ]}
          >
            <View style={styles.sectionItemLeft}>
              <Feather
                name={'box'}
                size={24}
                color={theme.colors.primary}
              />
            </View>
            <View style={styles.sectionItemCenter}>
              <Text
                style={[styles.sectionItemText, { color: theme.colors.primary }]}
              >
                Node Status
              </Text>
            </View>
            <View style={styles.sectionItemRight}>

               <FontAwesome5
                 name="wifi"
                 size={24}
                 color={btfs_sts == 'Online_Host'? "green" : btfs_sts == 'Online_Renter'? "blue" : "gray"}
               />
            </View>

          </View>


        <View
          style={[
            styles.sectionItem,
            { backgroundColor: theme.colors.background2 },
          ]}
        >
          <View style={styles.sectionItemLeft}>
            <Feather
              name={'code'}
              size={24}
              color={theme.colors.primary}
            />
          </View>
          <View style={styles.sectionItemCenter}>
            <Text
              style={[styles.sectionItemText, { color: theme.colors.primary }]}
            >
              {"BTFS Version"}
            </Text>
          </View>
          <View style={styles.sectionItemRight}>
            <Text
              style={[styles.sectionItemText, { color: theme.colors.primary }]}
            >
              {btfs_ver}
            </Text>
          </View>
      </View>


      <View
        style={[
          styles.sectionItem,
          { backgroundColor: theme.colors.background2 },
        ]}
      >
        <View style={styles.sectionItemLeft}>
          <Feather
            name={'database'}
            size={24}
            color={theme.colors.primary}
          />
        </View>

        <View style={styles.sectionItemCenter}>
          <Text
            style={[styles.sectionItemText, { color: theme.colors.primary }]}
          >
            {"BTFS Repository"}
          </Text>
        </View>
        <View style={styles.sectionItemRight}>
          <Switch
             trackColor={{ false: "#767577", true: "#81b0ff" }}
             thumbColor={theme.colors.switchThumb}
             value={btfsRepo}
             onValueChange={async (value) => {
               if (value) {
                 setbtfsRepo(value);
                 initializeRepo(true);
                 await AsyncStorage.setItem('btfsrepo_enable', 'true');
                 console.log("Initializing Repo");
               } else {
                 setbtfsRepo(value);
                 await AsyncStorage.setItem('btfsrepo_enable', 'false');
                 console.log("Deactivating Repo(no action)");
               }
             }}
             disabled={false}
          />
        </View>
      </View>


      <View
        style={[
          styles.sectionItem,
          { backgroundColor: theme.colors.background2 },
        ]}
      >
        <View style={styles.sectionItemLeft}>
          <Feather
            name={'hard-drive'}
            size={24}
            color={theme.colors.primary}
          />
        </View>

        <View style={styles.sectionItemCenter}>
          <Text
            style={[styles.sectionItemText, { color: theme.colors.primary }]}
          >
            {"Host enabled"}
          </Text>
        </View>
        <View style={styles.sectionItemRight}>
          <Switch
             trackColor={{ false: "#767577", true: "#81b0ff" }}
             thumbColor={theme.colors.switchThumb}
             value={isEnabled}
             onValueChange={async (value) => {
               if (value) {
                 setIsEnabled(value);
                 enableHostMode(true);
                 await AsyncStorage.setItem('host_enable', 'true');
                 console.log("Changing to true")
               } else {
                 setIsEnabled(value);
                 enableHostMode(false);
                 await AsyncStorage.setItem('host_enable', 'false');
                 console.log("Changing to false")
               }
             }}
             disabled={false}
          />
        </View>
    </View>


    <View
      style={[
        styles.sectionItem,
        { backgroundColor: theme.colors.background2 },
      ]}
    >
      <View style={styles.sectionItemLeft}>
        <Feather
          name={'command'}
          size={24}
          color={theme.colors.primary}
        />
      </View>
    <View style={styles.sectionItemCenter}>
      <Text
        style={[styles.sectionItemText, { color: theme.colors.primary }]}
      >
        {"BTFS Daemon"}
      </Text>
    </View>
    <View style={styles.sectionItemRight}>
      <Switch
         trackColor={{ false: "#767577", true: "#81b0ff" }}
         thumbColor={theme.colors.switchThumb}
         value={enableDaemon}
         onValueChange={async (value) => {
           if (value) {
             setenableDaemon(value);
             enableBTFSDaemon(true);
             await AsyncStorage.setItem('daemon_enable', 'true');
             console.log("Enabling daemon")
           } else {
             setenableDaemon(value);
             enableBTFSDaemon(false);
             await AsyncStorage.setItem('daemon_enable', 'false');
             console.log("Disabling daemon")
           }
         }}
         disabled={false}
      />
    </View>
</View>


      <View
        style={[
          styles.sectionItem,
          { backgroundColor: theme.colors.background2 },
        ]}
      >
        <View style={styles.sectionItemLeft}>
          <Feather
            name={'calendar'}
            size={24}
            color={theme.colors.primary}
          />
        </View>
        <View style={styles.sectionItemCenter}>
          <Text
            style={[styles.sectionItemText, { color: theme.colors.primary }]}
          >
            {"Storage duration (days)"}
          </Text>
        </View>
        <View style={styles.sectionItemRight}>
        <NumericInput
          value={default_storage}
          onChange={async (value) => {
            await AsyncStorage.setItem('storage_duration', value.toString());
            set_default_storage(value);
            console.log(value);}
          }
          onLimitReached={(isMax,msg) => Alert.alert(isMax,msg)}
          totalWidth={70}
          totalHeight={30}
          iconSize={25}
          initValue={default_storage}
          step={1}
          maxValue={9999}
          valueType='real'
          rounded
          textColor={theme.colors.primary}
          iconStyle={{ color: '#6495ed' } }
          rightButtonBackgroundColor={theme.colors.primary}
          leftButtonBackgroundColor={theme.colors.primary}/>
        </View>
    </View>


    <View
      style={[
        styles.sectionItem,
        { backgroundColor: theme.colors.background2 },
      ]}
    >
      <View style={styles.sectionItemLeft}>
        <Feather
          name={'terminal'}
          size={24}
          color={theme.colors.primary}
        />
      </View>
      <View style={styles.sectionItemCenter}>
      <TextInput
      style={[styles.sectionItemText, { color: theme.colors.primary }]}
      onChangeText={setBTFSCmd}
      value={btfsCmd}
      placeholder="BTFS command ..."
      keyboardType="default"
    />
      </View>
      <View style={styles.sectionItemRight}>
      <Button
        title="Send"
        onPress={sendBTFScmd}
      />
      </View>
    </View>



      </View>



      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>
          SECURITY
        </Text>
        <View
          style={[
            styles.sectionItem,
            { backgroundColor: theme.colors.background2 },
          ]}
        >
          <View style={styles.sectionItemLeft}>
            <Feather
              name={pinActive ? 'lock' : 'unlock'}
              size={24}
              color={theme.colors.primary}
            />
          </View>
          <View style={styles.sectionItemCenter}>
            <Text
              style={[styles.sectionItemText, { color: theme.colors.primary }]}
            >
              PIN Code
            </Text>
          </View>
          <View style={styles.sectionItemRight}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('SetPassCodeScreen');
              }}
            >
              <Feather
                name={'chevron-right'}
                size={24}
                color={theme.colors.primary}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={[
            styles.sectionItem,
            { backgroundColor: theme.colors.background2 },
          ]}
        >
          <View style={styles.sectionItemLeft}>
            <FontAwesome5
              name="fingerprint"
              size={24}
              color={theme.colors.primary}
            />
          </View>
          <View style={styles.sectionItemCenter}>
            <Text
              style={[styles.sectionItemText, { color: theme.colors.primary }]}
            >
              Unlock with Biometrics
            </Text>
          </View>

          <View style={styles.sectionItemRight}>
            <Switch
              value={biometricsActive}
              onTouchStart={() => {
                if (!hasHardware) {
                  dispatch(
                    setSnack({ message: 'Device has no biometrics hardware' })
                  );
                }
              }}
              disabled={!hasHardware}
              trackColor={{
                false: theme.colors.switchFalse,
                true: 'tomato',
              }}
              thumbColor={theme.colors.switchThumb}
              onChange={() => {
                if (hasHardware && isEnrolled) {
                  handleBiometricsStatus();
                } else if (hasHardware && !isEnrolled) {
                  dispatch(setSnack({ message: 'No biometrics enrolled!' }));
                }
              }}
            />
          </View>

        </View>



        <View
          style={[
            styles.sectionItem,
            { backgroundColor: theme.colors.background2 },
          ]}
        >
          <View style={styles.sectionItemLeft}>
            <FontAwesome5
              name="key"
              size={24}
              color={theme.colors.primary}
            />
          </View>
          <View style={styles.sectionItemCenter}>
            <Text
              style={[styles.sectionItemText, { color: theme.colors.primary }]}
            >
              File Storage Encryption (To-Do)
            </Text>
          </View>

          <View style={styles.sectionItemRight}>
            <Switch


              trackColor={{
                false: theme.colors.switchFalse,
                true: 'tomato',
              }}
              thumbColor={theme.colors.switchThumb}

            />
          </View>

        </View>



      </View>
      </ScrollView>
    </SafeAreaView>
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight + 20,
  },
  section: {
    width: SIZE,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
  },
  sectionItem: {
    display: 'flex',
    flexDirection: 'row',
    height: 45,
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 5,
    borderRadius: 15,
  },
  sectionItemText: {
    fontFamily: 'Poppins_500Medium',
  },
  sectionItemTextSmall: {
    fontFamily: 'Poppins_200Medium',
  },
  sectionItemLeft: {
    width: '20%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionItemCenter: {
    width: '60%',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  sectionItemRight: {
    width: '20%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Settings;

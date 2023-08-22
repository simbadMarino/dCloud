import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity, Button, Alert, TextInput, SafeAreaView, ScrollView, RefreshControl, NativeModules, Platform } from 'react-native';
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
var flagGuideDone = false;


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
const [default_storage, set_default_storage] = useState(32);
const [host_score,set_host_score] = useState('');
const [isEnabled, setIsEnabled] = useState(false);
const [enableDaemon, setenableDaemon] = useState(false);
const [enableStorageSaver, setenableStorageSaver] = useState(false);
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

const f_enableStorageSaver = async (en) => {
    let data = Client10.enableStorageSaver(en);

    return Promise.all(data).then((result) => {

      //console.log(result);
    }


    )

};

const enableBTFSDaemon = async () => {

      console.log("Activating daemon")
      BTFSmodule.main("daemon --chain-id 199","commands");


}

const initializeRepo = async () => {

try
{
  BTFSmodule.main("init","commands");
}
catch (err) {
 console.log(err);
}


}

function getGuideData(){


  let data = Client10.requestGuide();

  Promise.resolve(data).then(function(data) {
    if(data.Type == 'error')
      {
        console.log("Guide is DONE, nothing else to do from Settings");
        flagGuideDone = 1;
      }

    else{
      setbttcAddress(data.info['bttc_address']? data.info['bttc_address'] : '--');
      set_node_id(data.info['host_id']? data.info['host_id'] : '--');
      set_btfs_ver(data.info['btfs_version']? data.info['btfs_version'] : '--')
      flagGuideDone = 0;
    }


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
        //console.log(result[0].BttcAddress);
        setbttcAddress(result[0].BttcAddress);
      //  console.log("GUIDE: " + result[5]);
        set_node_id(result[0]['ID'] ? result[0]['ID'] : '--');
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
    if(flagGuideDone)
    {
      var response =  await getNodeBasicStats();
    }

    var response2 = await getGuideData();

  }, 1000);
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
  console.log("BTFS repo created: " + storedRepoSts);
  let boolStoredRepoSts = (storedRepoSts === 'true');   //Converting string to boolean
  setbtfsRepo(boolStoredRepoSts);
  setenableDaemon(boolStoredRepoSts);
  /*if (boolStoredRepoSts)
  {
    enableBTFSDaemon(true);
  }*/

  };
  setPreviousInitRepoSts();

},[]);

useEffect(()  => {
  const setPreviousStorageDuration = async () => {
  const storedStorageDuration = await AsyncStorage.getItem('storage_duration');
  if (storedStorageDuration == null)
  {
    await AsyncStorage.setItem('storage_duration', '32');
  }
  console.log(storedStorageDuration);
  let numericstoredStorageDuration = parseInt(storedStorageDuration);
  set_default_storage(numericstoredStorageDuration);

  };
  setPreviousStorageDuration();

},[]);

useEffect(()  => {
  const setPreviousStorageSaverEnable = async () => {
  const storedStorageSaverEnabled = await AsyncStorage.getItem('storage_saver');
  console.log(storedStorageSaverEnabled);
  let boolStoredStorageSaver = (storedStorageSaverEnabled === 'true');  //Converting string to boolean
  setenableStorageSaver(boolStoredStorageSaver);

  };
  setPreviousStorageSaverEnable();

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
    {display: 'none'}
  ]}
>
  <View style={styles.sectionItemLeft}>
    <Feather
      name={'save'}
      size={24}
      color={theme.colors.primary}
    />
  </View>
<View style={styles.sectionItemCenter}>
  <Text
    style={[styles.sectionItemText, { color: theme.colors.primary }]}
  >
    {"Repo Storage Saver"}
  </Text>
</View>
<View style={styles.sectionItemRight}>
  <Switch
     trackColor={{ false: "#767577", true: "#81b0ff" }}
     thumbColor={theme.colors.switchThumb}
     value={enableStorageSaver}
     onValueChange={async (value3) => {
       if (value3) {
         setenableStorageSaver(value3);
         f_enableStorageSaver(true);
         await AsyncStorage.setItem('storage_saver', 'true');
         console.log("Enabling Storage Saver")
       } else {
         setenableStorageSaver(value3);
         f_enableStorageSaver(false);
         console.log("Disabling Storage Saver")
         await AsyncStorage.setItem('storage_saver', 'false');
         //console.log("Disabling daemon")
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
          value={default_storage? 0: 32 }
          onChange={async (value) => {
            await AsyncStorage.setItem('storage_duration', value.toString());
            set_default_storage(value);
            console.log(value);}
          }
          onLimitReached={(isMax,msg) => Alert.alert(isMax,msg)}
          totalWidth={70}
          totalHeight={30}
          minValue={32}
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

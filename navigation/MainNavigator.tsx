import React, { useState, useEffect, useCallback } from 'react';
import {Platform, Text,View,StyleSheet,Image,NativeModules,ActivityIndicator,Alert} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeStackNavigator from './HomeStackNavigator';
import SettingsStackNavigator from './SettingsStackNavigator';

import Web from '../screens/Web';
import TerminalScreen from '../screens/TerminalScreen';
import FileTransfer from '../screens/FileTransfer';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';

/* Slider Intro section Start */
import Client10 from '../utils/APIClient10.js'
import AppIntroSlider from 'react-native-app-intro-slider';
import NodeLoadingGIF from '../assets/nodeLoading.gif';
import NodeLoadedGIF from '../assets/nodeHungry.gif';
import BTFSLoadingFilledGIF from '../assets/loading_test.gif';
import Logo from '../assets/nodeHungry.gif';
import { setSnack, snackActionPayload } from '../features/files/snackbarSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
const {BTFSmodule} = NativeModules;
import { Icon } from "react-native-elements";
import Clipboard from "@react-native-clipboard/clipboard";
/* Slider Intro section End */

const Tab = createBottomTabNavigator();
var bttcWalletTestSts = '';
var str_BTT_Addy = '';
export const MainNavigator: React.FC = () => {
  const { colors } = useAppSelector((state) => state.theme.theme);
  //const platform = Platform.OS === 'android'? 'android' : 'ios';
  const [showRealApp, setshowRealApp] = useState(false);
  const [nodeLoadingText, setnodeLoadingText] = useState('Just a few seconds...')
  const [slideTitleText, setslideTitleText] = useState('Setting Up your Node')
  const [flagGuideDone, setflagGuideDone] = useState(false);
  const [nodeFilledWithBTT, setnodeFilledWithBTT] = useState(false);
  const [btfs_sts, setbtfs_sts] = useState('');
  const [enableGuide, setenableGuide] = useState(false);
  const [bttcAddress, setbttcAddress] = useState('');
  const [btfsRepo, setbtfsRepo] = useState(false);
  const [enableDaemon, setenableDaemon] = useState(false);
  const [bttcWalletStatus,setbttcWalletStatus] = useState('');
  const { theme } = useAppSelector((state) => state.theme);
  const dispatch = useAppDispatch();


  const slides = [
    {
      key: 'one',
      title: slideTitleText,
      text: nodeLoadingText,
      image: flagGuideDone?NodeLoadedGIF:NodeLoadingGIF,
      backgroundColor: '#59b2ab',
    },
    {
      key: 'two',
      title: 'Your node is ready',
      text: 'You can now start uploading and sharing :)',
      image: require('../assets/node_ok.png'),
      backgroundColor: '#22bcb5',
    }
  ];


  useEffect(() => {
    const interval = setInterval( async () => {

      var response =  await getNodeBasicStats();
      //console.log(btfs_sts);
      var response2 = await getGuideData();

    }, 1200);
    return () => clearInterval(interval);
  }, []);

  useEffect(()  => {
    const setPreviousInitRepoSts= async () => {
    const storedRepoSts= await AsyncStorage.getItem('btfsrepo_enable');
    console.log("BTFS repo created: " + storedRepoSts);
    let boolStoredRepoSts = (storedRepoSts === 'true');   //Converting string to boolean
    setbtfsRepo(boolStoredRepoSts);
    setenableDaemon(boolStoredRepoSts);
    if (boolStoredRepoSts)
    {
      enableBTFSDaemon();
    }
    else if (boolStoredRepoSts == false)
    {
      initializeRepo();
      const firstDaemonRunTimeout = setTimeout(triggerAppRestart, 10000);

    }

    };
    setPreviousInitRepoSts();
    },[]);


    useEffect(()  => {
      const setPreviousBTCCWalletSts = async () => {
      const storedBTCCWalletSts = await AsyncStorage.getItem('bttcWalletSts');
      console.log("Wallet Sts: " + storedBTCCWalletSts);
      bttcWalletTestSts = storedBTCCWalletSts;
      setbttcWalletStatus(storedBTCCWalletSts);

      };
      setPreviousBTCCWalletSts();

    },[]);


  const enableBTFSDaemon = async () => {

      BTFSmodule.main("daemon --chain-id 199","commands");
      console.log("Starting daemon on chain id 199");
  }

  const initializeRepo = async () => {

    try
    {
      BTFSmodule.main("init","commands");
      await AsyncStorage.setItem('btfsrepo_enable', 'true');
      console.log("Initializing Repo...")
    }
    catch (err) {
     console.log(err);
    }
  }


  const copyToClipboard = () => {
    Clipboard.setString(bttcAddress);
    Alert.alert("Address copied to clipboard");
  };


  function triggerAppRestart(){
    Alert.alert("Init completed", "Please restart app");
  }


  function getGuideData(){

    let data = Client10.requestGuide();
    Promise.resolve(data).then(function(data) {

      if(data.Type == 'error')
        {
          //console.log(data);
          console.log("Guide is DONE, nothing else to do");
          //setnodeFilledWithBTT(true);
        }

      else{
        //setbttcAddress(data.info['bttc_address']? data.info['bttc_address'] : '--');
        str_BTT_Addy = String(data.info['bttc_address']);
        setbttcAddress(str_BTT_Addy);
        console.log(str_BTT_Addy)
        if(str_BTT_Addy != '')
        {
            setnodeLoadingText("Send at least 1K BTT to your address:");
            setslideTitleText("Setup your Wallet")
            AsyncStorage.setItem('bttcWalletSts', 'fillOngoing');
            setflagGuideDone(true);
            setenableGuide(true);
        }
        //setflagGuideDone(false);
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
      console.log("Network Status update");
      return Promise.all([data1, data2, data3, data4, data5]).then((result) => {
          //console.log(result[4]);
          //console.log(result[0].BttcAddress);
          setbttcAddress(result[0].BttcAddress);




          //set_host_score
          let status = null;
          let message = null;
          if (result[4]['code_bttc'] === 2 && result[4]['code_status'] === 2) {
              status = 1;
              message = 'online';
              setbtfs_sts('Online');
              console.log("Network Status update:Online");
              setslideTitleText("All Set :)")
              setnodeLoadingText("Tap Next to finalize setup");
              setnodeFilledWithBTT(true);
              setenableGuide(false);
              setshowRealApp(true);
              AsyncStorage.setItem('bttcWalletSts', 'filled');
              setbttcWalletStatus('filled');
          }
          if (result[4]['code_bttc'] === 2 && result[4]['code_status'] === 1) {
              status = 1;
              message = 'online';
              setbtfs_sts('Online');
          }
          if (result[4]['code_bttc'] === 3) {
              status = 2;
              message = ['network_unstable_bttc', 'check_network_request'];
              setbtfs_sts('Offline');

          }
          if (result[4]['code_status'] === 3) {
              status = 2;
              message = ['network_unstable_btfs', 'check_network_request'];
              setbtfs_sts('Offline');
          }
          if (result[4]['code_bttc'] === 3 && result[4]['code_status'] === 3) {
              status = 3;
              message = ['network_unstable_bttc', 'network_unstable_btfs', 'check_network_request'];
              setbtfs_sts('Offline');
          }
         if (result[4].Message ==="network error or host version not up to date")
         {
              message = 'offline';
              setbtfs_sts('Offline');
              //dispatch(setSnack({ message: 'Awaiting Network readiness...' }));
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


  _renderItem = ({ item }) => {
    return (
      <View style={styles.slide}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.title}>{btfs_sts}</Text>
        <Image source={item.image} style={styles.image}/>
        <Text style={styles.text }>{item.text}</Text>
        <Text style={styles.text }  numberOfLines={1} ellipsizeMode = 'middle' >{str_BTT_Addy}</Text>
        {enableGuide && <Icon
          name="copy"
          type="font-awesome"
          color={theme.colors.primary}
          size={18}
          onPress={copyToClipboard}
        />}
      </View>
    );
  }
  _onDone = () => {
    // User finished the introduction. Show real app through
    // navigation or simply by controlling state
    setshowRealApp(true);
  }
  if((showRealApp || btfs_sts == 'Online') & bttcWalletStatus == 'filled')
  {
    return (
      <Tab.Navigator
        initialRouteName="dBrowse"
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: '#6495ed',
          tabBarInactiveTintColor: 'gray',
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: any;
            if (route.name === 'dBrowse') {
              iconName = focused ? 'folder-open' : 'folder';
            } else if (route.name === 'Settings') {
              iconName = focused ? 'cog-outline' : 'cog';
            } else if (route.name === 'Terminal') {
              iconName = 'terminal';
            } else if (route.name === 'dWeb') {
              iconName = 'globe';
            } else if (route.name === 'Wallet') {
              iconName = 'wallet';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveBackgroundColor: colors.background,
          tabBarInactiveBackgroundColor: colors.background,
        })}
      >
        <Tab.Screen name="dBrowse" component={HomeStackNavigator} />
        <Tab.Screen name="dWeb" component={Web} />
        <Tab.Screen name="Wallet" component={FileTransfer} />
        <Tab.Screen name="Terminal"  component={TerminalScreen}/>
        <Tab.Screen name="Settings" component={SettingsStackNavigator} />
      </Tab.Navigator>
    );
  }
  else if (bttcWalletStatus == 'filled')
  return(
    <View style={styles.container}>
    <Image
        style={styles.logo}
        source={BTFSLoadingFilledGIF}
    />
    <Text style={[styles.text, { color: theme.colors.primary }]}> starting BTFS, please wait... </Text>

</View>


  )
  else
      return <AppIntroSlider renderItem={this._renderItem} data={slides} ref={(ref) => (this.slider = ref)} onDone={this._onDone} showNextButton={nodeFilledWithBTT}/>;

};


const styles = StyleSheet.create({


  bottomMenu: {
    height: 45,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },

  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#292929',
  },
  image: {
    width: 150,
    height: 150,
    marginVertical: 32,
  },
  text: {
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    fontFamily: 'Poppins_600SemiBold',
  },
  title: {
    fontSize: 22,
    color: 'white',
    textAlign: 'center',
    fontFamily: 'Poppins_500Medium',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%'
  },
  logo: {
    width: 150,
    height: 150,
  },
});

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Platform,
  Alert,
  BackHandler,
  Image,
//  NativeModules
} from 'react-native';

import Dialog from 'react-native-dialog';

import {
  Dialog as GalleryDialog,
  ProgressDialog,
} from 'react-native-simple-dialogs';
import { AntDesign, Feather } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

import FileItem from '../components/Browser/Files/FileItem';
import Pickimages from '../components/Browser/PickImages';
import ActionSheet from '../components/ActionSheet';
import SvgComponentFile from "../assets/icons/svgAddFile";
import SvgComponentFolder from "../assets/icons/svgAddFolder";
//import AddFolderIcon from '../assets/icons/folder-add-svgrepo-com.svg';

import useSelectionChange from '../hooks/useSelectionChange';
import allProgress from '../utils/promiseProgress';

import { NewFolderDialog } from '../components/Browser/NewFolderDialog';
import { DownloadDialog } from '../components/Browser/DownloadDialog';
import { FileTransferDialog } from '../components/Browser/FileTransferDialog';

import axios, { AxiosError } from 'axios';
import moment from 'moment';
import Constants from 'expo-constants';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
//import * as DocumentPicker from 'expo-document-picker';
import * as MediaLibrary from 'expo-media-library';
import * as mime from 'react-native-mime-types';
import DocumentPicker, {
  DirectoryPickerResponse,
  DocumentPickerResponse,
  isInProgress,
  types,
} from 'react-native-document-picker'

import { StackScreenProps } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { ImageInfo } from 'expo-image-picker/build/ImagePicker.types';
import { ExtendedAsset, fileItem } from '../types';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import { setImages } from '../features/files/imagesSlice';
import { setSnack, snackActionPayload } from '../features/files/snackbarSlice';
import { HEIGHT, imageFormats, reExt, SIZE } from '../utils/Constants';
var jDocumentRes = '';
//const {BTFSmodule} = NativeModules;
var currentFileQMhash = '';

import Clipboard from "@react-native-clipboard/clipboard";

import AsyncStorage from '@react-native-async-storage/async-storage';

import Client10 from '../utils/APIClient10.js'

type BrowserParamList = {
  Browser: { prevDir: string; folderName: string };
};

type IBrowserProps = StackScreenProps<BrowserParamList, 'Browser'>;

const Browser = ({ route }: IBrowserProps) => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const { colors } = useAppSelector((state) => state.theme.theme);
  const docDir: string = FileSystem.documentDirectory || '';
  const [currentDir, setCurrentDir] = useState<string>(route?.params?.prevDir !== undefined ? route?.params?.prevDir : docDir);
  const [moveDir, setMoveDir] = useState('');
  const [files, setFiles] = useState<fileItem[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<fileItem[]>([]);
  const [folderDialogVisible, setFolderDialogVisible] = useState(false);
  const [downloadDialogVisible, setDownloadDialogVisible] = useState(false);
  const [renameDialogVisible, setRenameDialogVisible] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [renamingFile, setRenamingFile] = useState<fileItem>();
  const [multiImageVisible, setMultiImageVisible] = useState(false);
  const [importProgressVisible, setImportProgressVisible] = useState(false);
  const [destinationDialogVisible, setDestinationDialogVisible] = useState(false);
  const [newFileActionSheet, setNewFileActionSheet] = useState(false);
  const [moveOrCopy, setMoveOrCopy] = useState('');
  const { multiSelect, allSelected } = useSelectionChange(files);
  const [result, setResult] = useState<Array<DocumentPickerResponse> | DirectoryPickerResponse | undefined | null>();
  const [qmhash, setqmhash] = useState('');
  const [default_storage, set_default_storage] = useState('');
  //const [fileResponse, setFileResponse] = useState([]);









  useEffect(() => {
    getFiles();
    //console.log("currentDir");
  }, [currentDir]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getFiles();
      console.log("Getting default storage...");
      getStorageDuration();

    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (route?.params?.folderName !== undefined) {
      //console.log("Updating Current Dir");

      setCurrentDir((prev) =>
        prev?.endsWith('/')
          ? prev + route.params.folderName
          : prev + '/' + route.params.folderName
      );
        //console.log("Updated directory: " + currentDir);
    }

  }, [route]);

  useEffect(() => {
    const backAction = () => {
      if (navigation.canGoBack()) navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, []);


/*
  useEffect(()  => {
    const setPreviousStorageDuration = async () => {
    const storedStorageDuration = await AsyncStorage.getItem('storage_duration');
    console.log(storedStorageDuration);
    let numericstoredStorageDuration = parseInt(storedStorageDuration);
    set_default_storage(numericstoredStorageDuration);

    };
    setPreviousStorageDuration();

  },[]);*/

  function makedir(directory){
    console.log("MAKEDIR:" + directory);
    let data = Client10.mkdir(directory);
    //BTFSModule("init","G");

    Promise.resolve(data).then(function(data) {
      console.log(data); // "Success"



  }, function(data) {
    // not called
  });
}

async function getStorageDuration(){

  const storedStorageDuration = await AsyncStorage.getItem('storage_duration');
  console.log(storedStorageDuration);
  //let numericstoredStorageDuration = parseInt(storedStorageDuration);
  set_default_storage(storedStorageDuration);


}

const CopyQmHash = () => {
  Clipboard.setString(currentFileQMhash);
  dispatch(setSnack({ message: 'QmHash Copied to Clipboard' }));
};

function addBTFS(directory){
  console.log(directory);
  let data = Client10.addBTFSfile(directory);

  Promise.resolve(data).then(function(data) {
    console.log(data); // "Success"



}, function(data) {
  // not called
});
}

function addFileToBTFS(file)
{
  let homePointer = currentDir.search("Documents") + 9; // Ripping off the whole path + Documents home folder, 9 is the "Documents" string magic number
  let file_stripped = file.slice(homePointer);
  console.log("File to be added: " + file_stripped);
  let data = Client10.addBTFSfile(file_stripped);

  Promise.resolve(data).then(function(data) {
    console.log(data); //Success??

  }, function(data) {
    // not called
  });


}

  const renderItem = ({ item }: { item: fileItem }) => (
    <FileItem
      item={item}
      qmhash={qmhash}
      currentDir={currentDir}
      toggleSelect={toggleSelect}
      multiSelect={multiSelect}
      setTransferDialog={setDestinationDialogVisible}
      setMoveOrCopy={setMoveOrCopy}
      deleteSelectedFiles={deleteSelectedFiles}
      setRenamingFile={setRenamingFile}
      setRenameDialogVisible={setRenameDialogVisible}
      setNewFileName={setNewFileName}
    ></FileItem>
  );

  const handleDownload = (downloadUrl: string) => {
    axios
      .get(downloadUrl)
      .then((res) => {
        const fileExt = mime.extension(res.headers['content-type']);
        FileSystem.downloadAsync(
          downloadUrl,
          currentDir + '/DL_' + moment().format('DDMMYHmmss') + '.' + fileExt
        )
          .then(() => {
            getFiles();
            setDownloadDialogVisible(true);
            handleSetSnack({
              message: 'Download complete',
            });
          })
          .catch((_) => {
            handleSetSnack({
              message: 'Please provide a correct url',
            });
          });
      })
      .catch((error: AxiosError) =>
        handleSetSnack({
          message: error.message,
        })
      );
  };

  const toggleSelect = (item: fileItem) => {
    if (item.selected && selectedFiles.includes(item)) {
      const index = selectedFiles.indexOf(item);
      if (index > -1) {
        selectedFiles.splice(index, 1);
      }
    } else if (!item.selected && !selectedFiles.includes(item)) {
      setSelectedFiles((prev) => [...prev, item]);
    }
    setFiles(
      files.map((i) => {
        if (item === i) {
          i.selected = !i.selected;
        }
        return i;
      })
    );
  };

  const toggleSelectAll = () => {
    if (!allSelected) {
      setFiles(
        files.map((item) => {
          item.selected = true;
          return item;
        })
      );
      setSelectedFiles(files);
    } else {
      setFiles(
        files.map((item) => {
          item.selected = false;
          return item;
        })
      );
      setSelectedFiles([]);
    }
  };

  const getFiles = async () => {
    FileSystem.readDirectoryAsync(currentDir)
      .then((dirFiles) => {
        if (currentDir !== route?.params?.prevDir) {
          const filteredFiles = dirFiles.filter(
            (file) => file !== 'RCTAsyncLocalStorage'
          );
          const filesProms = filteredFiles.map((fileName) =>
            FileSystem.getInfoAsync(currentDir + '/' + fileName)
          );
          Promise.all(filesProms).then((results) => {
            let tempfiles: fileItem[] = results.map((file) => {
              //const qmhash = file.qmhash;
              //console.log(file);
              const name = file.uri.endsWith('/')
                ? file.uri
                    .slice(0, file.uri.length - 1)
                    .split('/')
                    .pop()
                : file.uri.split('/').pop();
              return Object({
                ...file,
                name,
                selected: false,
              });
            });
            setFiles(tempfiles);
            const tempImageFiles = results.filter((file) => {
              let fileExtension = file.uri
                .split('/')
                .pop()
                .split('.')
                .pop()
                .toLowerCase();
              if (imageFormats.includes(fileExtension)) {
                return file;
              }
            });
            dispatch(setImages(tempImageFiles));
          });
        }
      })
      .catch((_) => {});
  };

  async function createDirectory(name: string) {
    //console.log("test: " + currentDir);
    FileSystem.makeDirectoryAsync(currentDir + '/' + name)
      .then(() => {
        getFiles();
        setFolderDialogVisible(false);

        console.log("CURRENT DIR MAKE_FOLDER: " + currentDir);
        if(currentDir == FileSystem.documentDirectory)
        {
            //console.log("You are in home dir!");
            //console.log(currentDir.search("Documents"))
            let homePointer = currentDir.search("Documents") + 9; // Ripping off the whole path + Documents home folder, 9 is the "Documents" string magic number
            console.log(homePointer);
            makedir(currentDir.slice(homePointer)  + name);
        }
        else
        {
          //console.log("NOT IN HOME dir");
          let homePointer = currentDir.search("Documents") + 9;   // Ripping off the whole path + Documents home folder, 9 is the "Documents" string magic number
          //console.log(homePointer);
          makedir(currentDir.slice(homePointer) + '/' + name);

        }

      })
      .catch(() => {
        handleSetSnack({
          message: 'Folder could not be created or already exists.',
        });
      });
  }

  const pickImage = async () => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          handleSetSnack({
            message:
              'Sorry, we need camera roll permissions to make this work!',
          });
        }
        MediaLibrary.requestPermissionsAsync();
      }
    })();

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      const { uri, type } = result as ImageInfo;
      const filename: string = uri.replace(/^.*[\\\/]/, '');
      const ext: string | null = reExt.exec(filename)![1];
      const fileNamePrefix = type === 'image' ? 'IMG_' : 'VID_';
      console.log("Pic uri: " + uri);
      result.name = fileNamePrefix + moment().format('DDMMYHmmss') + '.' + ext;
      console.log(result);
      await processPic(result);

      FileSystem.copyAsync({
        from: uri,
        to:
          currentDir +
          '/' +
          fileNamePrefix +
          moment().format('DDMMYHmmss') +
          '.' +
          ext,
      })
        .then((_) => getFiles())
        .catch((err) => console.log("PSTTT " + err));


        async function processPic(file)
        {
          const formData = new FormData();

          console.log("FILE: " + file);
          var urresponse = decodeURIComponent(file.uri);
          console.log("urresponse: " + urresponse);



          formData.append(file.name, {
                uri: file.uri,
                name: file.name ,
                type: file.type
              });

          var addFileData = axios.post("http://localhost:5001/api/v1/add?w=true", formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            })
            .then(function (addFileData) {
                    //console.log(addFileData);
                    currentFileQMhash = addFileData.data;
                    let hashpointer = currentFileQMhash.search("Name\":\"\",\"Hash\":");
                    currentFileQMhash = currentFileQMhash.slice(hashpointer + 17);
                    currentFileQMhash = currentFileQMhash.slice(0,46);
                    setqmhash(currentFileQMhash);
                    console.log("File BTFS QMhash: " + currentFileQMhash);
                    //file.qmhash = currentFileQMhash;
                    console.log("Step 2");
                    //console.log(file);
                    console.log("QMhash obtained :), proceeding to upload file...");
                    let homePointer = currentDir.search("Documents") + 9; // Ripping off the whole path + Documents home folder, 9 is the "Documents" string magic number
                    let currentdir_stripped = currentDir.slice(homePointer);
                    console.log(currentdir_stripped);
                    var fileCopyToMFS = axios.post("http://localhost:5001/api/v1/files/cp?arg=/btfs/" + currentFileQMhash + "&arg=" + currentdir_stripped + "/" + file.name.replace(/ /g, "_").replace(/-/g, "_").toLowerCase())
                    .then(function (fileCopyToMFS){
                      console.log("http://localhost:5001/api/v1/files/cp?arg=/btfs/" + currentFileQMhash + "&arg=" + currentdir_stripped + "/" + file.name.replace(/ /g, "_").replace(/-/g, "_").toLowerCase());
                      console.log(fileCopyToMFS);
                      console.log("Step 3");
                    //  getStorageDuration();
                    })

                    .catch(function(error) {
                     console.log('There has been a problem with the BTFS copy command: ' + error.message);
                                //Alert.alert("Error", "Password already set, use cli to change it if needed");
                                //console.log("Call response: " + JSON.stringify(depositBTT_resp));
                                Alert.alert("BTFS Copy MFS Error", "Format error u.u ");
                     });
                    console.log("http://localhost:5001/api/v1/storage/upload?arg=" + currentFileQMhash + "&len=" + default_storage)
                    console.log("Step 4");
                    var fileUploadID = axios.post("http://localhost:5001/api/v1/storage/upload?arg=" + currentFileQMhash + "&len=" + default_storage)
                    .then(function (fileUploadID){
                       console.log(file.name + " Uploaded to BTFS :) for: " + default_storage + " days");
                       //console.log(fileUploadID);
                       //Alert.alert("BTFS Upload in progress...", "Storage duration: " + default_storage + " days");
                       Alert.alert(file.name + " Uploaded to BTFS :)", "for: " + default_storage + " days", [ {text: 'Copy Link', onPress: () => CopyQmHash(), style: 'cancel'}, {text: 'Close', onPress: () => this.closeAlert()}, ], { cancelable: true});

                       //console.log("http://localhost:5001/api/v1/files/cp?arg=/btfs/" + currentFileQMhash + "&arg=" + currentDir + file.name);

                     })
                     .catch(function(error) {
                      console.log('There has been a problem with the BTFS upload command: ' + error.message);
                                 //Alert.alert("Error", "Password already set, use cli to change it if needed");
                                 //console.log("Call response: " + JSON.stringify(depositBTT_resp));
                                 Alert.alert("BTFS file upload Error", "Format error u.u ");
                      });

                     })
                     .catch(function(error) {
                      console.log('There has been a problem with the BTFS Add command: ' + error.message);
                                 //Alert.alert("Error", "Password already set, use cli to change it if needed");
                                 //console.log("Call response: " + JSON.stringify(depositBTT_resp));
                                 Alert.alert("BTFS Add Error", "Something was wrong while adding your file x.X");
                      });


                      const { exists: fileExists } = FileSystem.getInfoAsync(urresponse);
                      //let filenameStr = file.name.replace(' ','_').replace('-', '_');
                      //filenameStr = filenameStr.replace(/-/,'_');
                      //console.log("str filename: " + filenameStr);
                      //let toDirectory = currentDir + '/' + JSON.stringify(file.name);
                    //  console.log("toDIR: " + file.name.replace(/ /g, "%20"));

                    }
    }
  };

  const pickDocument =  async () => {


    try {
      const response = await DocumentPicker.pick({
        presentationStyle: 'fullScreen',
        allowMultiSelection: true,
      });
      console.log(response);
      //setResult(response);

      response.forEach(await processDocuments)


         //console.log("FILE_PATH: " + currentDir + '/' + response[0].name);

   }
     catch (err) {
      console.log(err);
    }

    async function processDocuments(file, index)  // TODO: convert all Upper case to lower case, FileSystem has some issues with upper case
    {
      const formData = new FormData();
      const formDataparams = new FormData();
      //const obj = JSON.parse(response[0]);
      console.log(file);
      console.log("Index: " + index);
      var urresponse = decodeURIComponent(file.uri);
      console.log("urresponse: " + urresponse);
      //console.log(currentDir);

      FileSystem.copyAsync({
        from: file.uri,
        to: currentDir  + "/" + file.name.replace(/ /g, "_").replace(/-/g, "_").toLowerCase(),
      })
      console.log("Step 1");
      //addFileToBTFS(currentDir + '/' + file.name);
      getFiles();


      formData.append(file.name, {
            uri: file.uri,
            name: file.name ,
            type: file.type,
            qmhash: file.qmhash
          });

      var addFileData = axios.post("http://localhost:5001/api/v1/add?w=true&n=true", formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then(function (addFileData) {
                //console.log(addFileData);
                currentFileQMhash = addFileData.data;
                let hashpointer = currentFileQMhash.search("Name\":\"\",\"Hash\":");
                currentFileQMhash = currentFileQMhash.slice(hashpointer + 17);
                currentFileQMhash = currentFileQMhash.slice(0,46);
                setqmhash(currentFileQMhash);
                console.log("File BTFS QMhash: " + currentFileQMhash);
                //file.qmhash = currentFileQMhash;
                console.log("Step 2");
                //console.log(file);
                console.log("QMhash obtained :), proceeding to upload file...");
                let homePointer = currentDir.search("Documents") + 9; // Ripping off the whole path + Documents home folder, 9 is the "Documents" string magic number
                let currentdir_stripped = currentDir.slice(homePointer);
                console.log(currentdir_stripped);
                var fileCopyToMFS = axios.post("http://localhost:5001/api/v1/files/cp?arg=/btfs/" + currentFileQMhash + "&arg=" + currentdir_stripped + "/" + file.name.replace(/ /g, "_").replace(/-/g, "_").toLowerCase())
                .then(function (fileCopyToMFS){
                  console.log("http://localhost:5001/api/v1/files/cp?arg=/btfs/" + currentFileQMhash + "&arg=" + currentdir_stripped + "/" + file.name.replace(/ /g, "_").replace(/-/g, "_").toLowerCase());
                  console.log(fileCopyToMFS);
                  console.log("Step 3");
                //  getStorageDuration();
                })

                .catch(function(error) {
                 console.log('There has been a problem with the BTFS copy command: ' + error.message);
                            //Alert.alert("Error", "Password already set, use cli to change it if needed");
                            //console.log("Call response: " + JSON.stringify(depositBTT_resp));
                            Alert.alert("BTFS Copy MFS Error", "Format error u.u ");
                 });
                console.log("http://localhost:5001/api/v1/storage/upload?arg=" + currentFileQMhash + "&len=" + default_storage)
                console.log("Step 4");
                var fileUploadID = axios.post("http://localhost:5001/api/v1/storage/upload?arg=" + currentFileQMhash + "&len=" + default_storage)
                .then(function (fileUploadID){
                   console.log(file.name + " Uploaded to BTFS :) for: " + default_storage + " days");
                   //console.log(fileUploadID);
                   //Alert.alert("BTFS Upload in progress...", "Storage duration: " + default_storage + " days");
                   Alert.alert(file.name + " Uploaded to BTFS :)", "for: " + default_storage + " days", [ {text: 'Copy Link', onPress: () => CopyQmHash(), style: 'cancel'}, {text: 'Close', onPress: () => this.closeAlert()}, ], { cancelable: true});

                   //console.log("http://localhost:5001/api/v1/files/cp?arg=/btfs/" + currentFileQMhash + "&arg=" + currentDir + file.name);

                 })
                 .catch(function(error) {
                  console.log('There has been a problem with the BTFS upload command: ' + error.message);
                             //Alert.alert("Error", "Password already set, use cli to change it if needed");
                             //console.log("Call response: " + JSON.stringify(depositBTT_resp));
                             Alert.alert("BTFS file upload Error", "Format error u.u ");
                  });

                 })
                 .catch(function(error) {
                  console.log('There has been a problem with the BTFS Add command: ' + error.message);
                             //Alert.alert("Error", "Password already set, use cli to change it if needed");
                             //console.log("Call response: " + JSON.stringify(depositBTT_resp));
                             Alert.alert("BTFS Add Error", "Something was wrong while adding your file x.X");
                  });


                  const { exists: fileExists } = FileSystem.getInfoAsync(urresponse);
                  //let filenameStr = file.name.replace(' ','_').replace('-', '_');
                  //filenameStr = filenameStr.replace(/-/,'_');
                  //console.log("str filename: " + filenameStr);
                  //let toDirectory = currentDir + '/' + JSON.stringify(file.name);
                //  console.log("toDIR: " + file.name.replace(/ /g, "%20"));

                }

  }


  const onMultiSelectSubmit = async (data: ExtendedAsset[]) => {
    const transferPromises = data.map((file) =>
      FileSystem.copyAsync({
        from: file.uri,
        to: currentDir + '/' + file.filename,
      })
    );
    Promise.all(transferPromises).then(() => {
      setMultiImageVisible(false);
      getFiles();
    });
  };

  const moveSelectedFiles = async (destination: string) => {
    const selectedFiles = files.filter((file) => file.selected);
    const destinationFolderFiles = await FileSystem.readDirectoryAsync(
      destination
    );
    function executeTransfer() {
      const transferPromises = selectedFiles.map((file) => {
        if (moveOrCopy === 'Copy')
          return FileSystem.copyAsync({
            from: currentDir + '/' + file.name,
            to: destination + '/' + file.name,
          });
        else
          return FileSystem.moveAsync({
            from: currentDir + '/' + file.name,
            to: destination + '/' + file.name,
          });
      });
      allProgress(transferPromises, (p) => {}).then((_) => {
        setDestinationDialogVisible(false);
        setMoveDir('');
        setMoveOrCopy('');
        getFiles();
      });
    }
    const conflictingFiles = selectedFiles.filter((file) =>
      destinationFolderFiles.includes(file.name)
    );
    const confLen = conflictingFiles.length;
    if (confLen > 0) {
      Alert.alert(
        'Conflicting Files',
        `The destination folder has ${confLen} ${
          confLen === 1 ? 'file' : 'files'
        } with the same ${confLen === 1 ? 'name' : 'names'}.`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Replace the files',
            onPress: () => {
              executeTransfer();
            },
            style: 'default',
          },
        ]
      );
    } else {
      executeTransfer();
    }
  };

  const deleteSelectedFiles = async (file?: fileItem) => {
    const filestoBeDeleted = file ? [file] : selectedFiles;
    const deleteProms = filestoBeDeleted.map((file) =>
      FileSystem.deleteAsync(file.uri)
    );
    Promise.all(deleteProms)
      .then((_) => {
        handleSetSnack({
          message: 'Files deleted!',
        });
        getFiles();
        setSelectedFiles([]);
      })
      .catch((err) => {
        console.log(err);
        getFiles();
      });
  };

  const onRename = async () => {
    const filePathSplit = renamingFile.uri.split('/');
    const fileFolderPath = filePathSplit
      .slice(0, filePathSplit.length - 1)
      .join('/');
    FileSystem.getInfoAsync(fileFolderPath + '/' + newFileName).then((res) => {
      if (res.exists)
        handleSetSnack({
          message: 'A folder or file with the same name already exists.',
        });
      else
        FileSystem.moveAsync({
          from: renamingFile.uri,
          to: fileFolderPath + '/' + newFileName,
        })
          .then(() => {
            setRenameDialogVisible(false);
            getFiles();
          })
          .catch((_) =>
            handleSetSnack({
              message: 'Error renaming the file/folder',
            })
          );
    });
  };

  const handleSetSnack = (data: snackActionPayload) => {
    dispatch(setSnack(data));
  };

  return (
    <View style={{ ...styles.container, backgroundColor: colors.background }}>
      <ActionSheet
        title={'Add a new file'}
        visible={newFileActionSheet}
        actionItems={[
          'Camera Roll',
          'Multi Image Picker',
          'Import File from Storage',
          'Import CID',
          'Cancel',
        ]}
        itemIcons={[
          'camera-roll',
          'image',
          'storage',
          'cloud-download',
          'close',
        ]}
        onClose={setNewFileActionSheet}
        onItemPressed={(buttonIndex) => {
          if (buttonIndex === 0) {
            pickImage();
          } else if (buttonIndex === 1) {
            setMultiImageVisible(true);
          } else if (buttonIndex === 2) {
            pickDocument();
          } else if (buttonIndex === 3) {
            setDownloadDialogVisible(true);
          }
        }}
        cancelButtonIndex={4}
        modalStyle={{ backgroundColor: colors.background2 }}
        itemTextStyle={{ color: colors.text }}
        titleStyle={{ color: colors.secondary }}
      />
      <FileTransferDialog
        isVisible={destinationDialogVisible}
        setIsVisible={setDestinationDialogVisible}
        currentDir={docDir}
        moveDir={moveDir}
        setMoveDir={setMoveDir}
        moveSelectedFiles={moveSelectedFiles}
        moveOrCopy={moveOrCopy}
        setMoveOrCopy={setMoveOrCopy}
      />
      <NewFolderDialog
        visible={folderDialogVisible}
        createDirectory={createDirectory}
        setFolderDialogVisible={setFolderDialogVisible}
      />
      <DownloadDialog
        visible={downloadDialogVisible}
        handleDownload={handleDownload}
        setDownloadDialog={setDownloadDialogVisible}
      />
      <Dialog.Container visible={renameDialogVisible}>
        <Dialog.Title>Rename {decodeURI(renamingFile?.name)}</Dialog.Title>
        <Dialog.Input
          value={decodeURI(newFileName)}
          onChangeText={(text) => setNewFileName(text)}
        ></Dialog.Input>
        <Dialog.Button
          label="Cancel"
          onPress={() => {
            setRenameDialogVisible(false);
          }}
        />
        <Dialog.Button label="OK" onPress={() => onRename()} />
      </Dialog.Container>
      <GalleryDialog
        dialogStyle={{
          backgroundColor: colors.background2,
        }}
        animationType="slide"
        contentStyle={styles.contentStyle}
        overlayStyle={styles.overlayStyle}
        visible={multiImageVisible}
        onTouchOutside={() => setMultiImageVisible(false)}
      >
        <Pickimages
          onMultiSelectSubmit={onMultiSelectSubmit}
          onClose={() => setMultiImageVisible(false)}
        />
      </GalleryDialog>

      <ProgressDialog
        visible={importProgressVisible}
        title="Importing Assets"
        message="Please, wait..."
      />

      <View style={styles.topButtons}>
        <View style={styles.topLeft}>

          <TouchableOpacity onPress={() => setNewFileActionSheet(true)}>
          <SvgComponentFile />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setFolderDialogVisible(true)}>
          <SvgComponentFolder />

          </TouchableOpacity>
          <Text style={styles.fileTabTitleText}
             >dBrowse</Text>
        </View>
        {multiSelect && (
          <View style={styles.topRight}>
            <TouchableOpacity
              onPress={() => {
                setDestinationDialogVisible(true);
                setMoveOrCopy('Move');
              }}
            >
              <MaterialCommunityIcons
                name="file-move-outline"
                size={30}
                color={colors.primary}
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={toggleSelectAll}>
              <Feather
                style={{ marginLeft: 10 }}
                name={allSelected ? 'check-square' : 'square'}
                size={24}
                color={colors.primary}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
      <View style={{ ...styles.fileList, borderTopColor: colors.primary }}>
        <FlatList
          data={files}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
          keyExtractor={_keyExtractor}
        />
      </View>
      {multiSelect && (
        <View
          style={{ ...styles.bottomMenu, backgroundColor: colors.background }}
        >
          <TouchableOpacity>
            <MaterialCommunityIcons
              name="export-variant"
              size={28}
              color={colors.primary}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const _keyExtractor = (item: fileItem) => item.name;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: SIZE,
    paddingTop: Constants.statusBarHeight,
  },
  topButtons: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
    marginHorizontal: 10,
  },
  topLeft: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '25%',
  },
  topRight: {
    width: '75%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  fileList: {
    flex: 1,
    borderTopWidth: 0.5,
    marginTop: 15,
    marginHorizontal: 5,
  },
  bottomMenu: {
    height: 45,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  contentStyle: {
    width: SIZE,
    height: HEIGHT * 0.8,
    padding: 0,
    margin: 0,
  },
  fileTabTitleText: {
    fontSize: 20,
    fontWeight: "bold",
    color: 'gray'
  },
  overlayStyle: {
    width: SIZE,
    padding: 0,
    margin: 0,
  },
});

export default Browser;

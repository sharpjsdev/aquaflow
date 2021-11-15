import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Alert, View, PermissionsAndroid, Linking, FlatList, ScrollView } from 'react-native';
import SMBClient from 'react-native-smb';
import FilePickerManager from 'react-native-file-picker';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { useTheme, useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import LottieView from 'lottie-react-native';
import { Container, Header, Content, Button, Icon, List, ListItem, Left, Body, Right, Thumbnail, Text } from 'native-base';
import Realm from 'realm';
let realm;
import Toast from 'react-native-simple-toast';
import PDFLib, { PDFDocument, PDFPage } from 'react-native-pdf-lib';
var RNFS = require('react-native-fs');

export default function ExploreScreen({ navigation }) {
  const isFocused = useIsFocused();
  const { colors } = useTheme();
  const theme = useTheme();
  const [isConnected, setConnected] = useState(false);
  const [reports, setReports] = useState([]);
  const [data, setData] = React.useState({
    ip: '',
    username: '',
    password: '',
    check_textInputChange: false,
    secureTextEntry: true,
    isValidUser: true,
    isValidPassword: true,
    pdfFiles: [],

  });

  realm = new Realm({
    path: 'ReportDatabase.realm', schema: [
      {
        name: 'report_details',
        properties: {
          report_id: { type: 'int', default: 0 },
          file_name: 'string',
          file_path: 'string',
          customer: 'string',
          office: 'string',
          site: 'string',
          date: 'string',
          date_folder: 'string',
          status: { type: 'int', default: 0 },
        },
      },
    ],
  });


  realmrf = new Realm({
    path: 'ReportFileDatabase.realm', schema: [
      {
        name: 'report_file_details',
        properties: {
          report_file_id: { type: 'int', default: 0 },
          report_name: 'string',
          file_name: 'string',
          file_path: 'string',

        },
      },
    ],
  });

  useEffect(() => {
    if (isFocused) {
      // Update the document title using the browser API
      var report_details = realm.objects('report_details');

      console.log(report_details);
      setReports(report_details);
      const AppFolder = 'pdf';
      //  const DirectoryPath= RNFS.DocumentDirectoryPath +'/'+ AppFolder;
      const DirectoryPath = RNFS.ExternalStorageDirectoryPath + '/' + AppFolder;
      RNFS.exists(DirectoryPath).then((result) => {

        console.log('GOT RESULT', result);
        if (result == false) {
          RNFS.mkdir(DirectoryPath);
        }

      });

      // get a list of files and directories in the main bundle
      RNFS.readDir(RNFS.ExternalStorageDirectoryPath + '/pdf') // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
        .then((result) => {
          console.log('GOT RESULT', result);
          setData({
            ...data,
            pdfFiles: result,

          });

          // stat the first file
          // return Promise.all([RNFS.stat(result[0].path), result[0].path]);
        });
      handleClick();

    }

  }, [isFocused]);

  ///// Connect to NAS Storage /////

  const handleClick = async () => {

    const keys = await AsyncStorage.getAllKeys()
    const itemsArray = await AsyncStorage.multiGet(keys)
    let object = {}
    itemsArray.map(item => {
      object[`${item[0]}`] = item[1]
    })

    const smbClient = new SMBClient(
      object.nasIp,//ip
      '445',//port
      object.nasFolder,//sharedFolder,
      'WORKGROUP',//workGroup,
      object.nasUser,//username,
      object.nasPass,//password,
      (data) => {//callback - can be null (not setting)
        // alert('new SMBClient data (callback): ' + JSON.stringify(data));
        if (data.message) {
          Toast.show(data.message, Toast.SHORT, [
            'UIAlertController',
          ]);
        }

        if (data.success == true) {
          setConnected(true);

        } else {
          setConnected(false);
        }
      },
    );


  }


  ///// Upload File /////



  const selectFile = async () => {

    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      {
        title: "App Camera Permission",
        message:
          "App needs access to your camera " +
          "so you can take pictures.",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK"
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("You can use the camera");
    } else {
      console.log("Camera permission denied");
    }

    FilePickerManager.showFilePicker(null, async (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled file picker');
      }
      else if (response.error) {
        console.log('FilePickerManager Error: ', response.error);
      }
      else {
        console.log('path = ', response.path);
        console.log('path = ', response.fileName);
        var str = response.path;
        var strfname = response.fileName;
        var arr = [];

        arr = strfname.split('-');
        console.log(arr);
        var path = str.substring(0, str.lastIndexOf('/'));
        console.log('path = ', path);

        const keys = await AsyncStorage.getAllKeys()
        const itemsArray = await AsyncStorage.multiGet(keys)
        let object = {}
        itemsArray.map(item => {
          object[`${item[0]}`] = item[1]
        })

        const smbClient = new SMBClient(
          object.nasIp,//ip
          '445',//port
          object.nasFolder,//sharedFolder,
          'WORKGROUP',//workGroup,
          object.nasUser,//username,
          object.nasPass,//password,
          (data) => {//callback - can be null (not setting) 
            console.log('new SMBClient data (callback): ' + JSON.stringify(data));


            smbClient.upload(
              path,//source path of file to upload (in Android devic)
              'PDF',//destination path to to upload (in SMB server)
              response.fileName,//the name of file to upload
              (data) => {//callback

                Toast.show(data.message, Toast.SHORT, [
                  'UIAlertController',
                ]);

                console.log('upload data (callback): ' + JSON.stringify(data));

              },
            );

          },
        );


      }
    });

  }

  const openFile = async (path) => {
    Linking.openURL('file://' + path).catch((err) => {
      console.log(err)
    });
  }
  const uploadFile = async (path, name, customer, office, site, date_folder) => {
    //   if (path) {
    //     RNFS.readFile(path, 'utf8');
    //     alert(name);
    //     return;
    // }


    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      {
        title: "App Camera Permission",
        message:
          "App needs access to your camera " +
          "so you can take pictures.",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK"
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("You can use the camera");
    } else {
      console.log("Camera permission denied");
    }

    var report_file_details = realmrf.objects('report_file_details').filtered('report_name =' + '"' + name + '"');;
    let files = [];


    console.log('rf = ', report_file_details);
    console.log('path = ', path);
    console.log('filename = ', name);
    var str = path;
    var strfname = name;
    var arr = [];

    arr = strfname.split('-');
    console.log(arr);
    var fpath = str.substring(0, str.lastIndexOf('/'));
    console.log('path = ', fpath);

    const keys = await AsyncStorage.getAllKeys()
    const itemsArray = await AsyncStorage.multiGet(keys)
    let object = {}
    itemsArray.map(item => {
      object[`${item[0]}`] = item[1]
    })

    const smbClient = new SMBClient(
      object.nasIp,//ip
      '445',//port
      object.nasFolder,//sharedFolder,
      'WORKGROUP',//workGroup,
      object.nasUser,//username,
      object.nasPass,//password,
      (data) => {//callback - can be null (not setting) 
        console.log('new SMBClient data (callback): ' + JSON.stringify(data));

        var p = new Array();
        p[0] = name;
        for (var i = 1; i < report_file_details.length; i++) {
          //alert($(element[i]).val());
          p[i] = report_file_details[i].file_name;
        }
        // alert(p.join("\n"));
        Alert.alert('Files to Upload!', p.join("\n"), [
          { text: 'Okay' }
        ]);



        smbClient.upload(
          fpath,//source path of file to upload (in Android devic)
          'Aquaflow/Maintenance/' + customer + '/' + office + '/' + site + '/' + date_folder,//destination path to to upload (in SMB server)
          name,//the name of file to upload
          (data) => {//callback

            Toast.show(data.message, Toast.SHORT, [
              'UIAlertController',
            ]);
            report_file_details.map((item, index) => (

              smbClient.upload(
                fpath,//source path of file to upload (in Android devic)
                'Aquaflow/Maintenance/' + customer + '/' + office + '/' + site + '/' + date_folder,//destination path to to upload (in SMB server)
                item.file_name,//the name of file to upload
                (data) => {//callback
                  console.log('upload data (callback): ' + JSON.stringify(data));

                },
              )
            ));
            // console.log('upload data (callback): ' + JSON.stringify(data));

          },
        );




      },
    );

  }

  const uploadAllFiles = async () => {
    //   if (path) {
    //     RNFS.readFile(path, 'utf8');
    //     alert(name);
    //     return;
    // }


    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      {
        title: "App Camera Permission",
        message:
          "App needs access to your camera " +
          "so you can take pictures.",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK"
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("You can use the camera");
    } else {
      console.log("Camera permission denied");
    }

    var p = new Array();

    for (var i = 0; i < reports.length; i++) {
      //alert($(element[i]).val());
      p[i] = reports[i].file_name;
    }
    // alert(p.join("\n"));
    Alert.alert('Files to Upload!', p.join("\n"), [
      { text: 'Okay' }
    ]);
    reports.map(async (item, index) => {
      var path = item.file_path;
      var name = item.file_name;
      var customer = item.customer;
      var office = item.office;
      var site = item.site;
      var date_folder = item.date_folder;
      var report_file_details = realmrf.objects('report_file_details').filtered('report_name =' + '"' + name + '"');;
      let files = [];

      console.log('rf = ', report_file_details);
      console.log('path = ', path);
      console.log('filename = ', name);
      var str = path;
      var strfname = name;
      var arr = [];

      arr = strfname.split('-');
      console.log(arr);
      var fpath = str.substring(0, str.lastIndexOf('/'));
      console.log('path = ', fpath);

      const keys = await AsyncStorage.getAllKeys()
      const itemsArray = await AsyncStorage.multiGet(keys)
      let object = {}
      itemsArray.map(item => {
        object[`${item[0]}`] = item[1]
      })

      const smbClient = new SMBClient(
        object.nasIp,//ip
        '445',//port
        object.nasFolder,//sharedFolder,
        'WORKGROUP',//workGroup,
        object.nasUser,//username,
        object.nasPass,//password,
        (data) => {//callback - can be null (not setting) 
          console.log('new SMBClient data (callback): ' + JSON.stringify(data));



          smbClient.upload(
            fpath,//source path of file to upload (in Android devic)
            'Aquaflow/Maintenance/' + customer + '/' + office + '/' + site + '/' + date_folder,//destination path to to upload (in SMB server)
            name,//the name of file to upload
            (data) => {//callback


              report_file_details.map((item, index) => (

                smbClient.upload(
                  fpath,//source path of file to upload (in Android devic)
                  'Aquaflow/Maintenance/' + customer + '/' + office + '/' + site + '/' + date_folder,//destination path to to upload (in SMB server)
                  item.file_name,//the name of file to upload
                  (data) => {//callback
                  //  console.log('upload data (callback): ' + JSON.stringify(data));
                 
                  if(index==0){
                    smbClient.upload(
                      fpath,//source path of file to upload (in Android devic)
                      'Aquaflow/Maintenance/' + customer + '/' + office + '/' + site + '/' + date_folder,//destination path to to upload (in SMB server)
                      name,//the name of file to upload
                      (data) => { 
                        Toast.show(name+' '+data.message, Toast.SHORT, [
                          'UIAlertController',
                        ]);
                       },
                    )
                    }
                  },
                )
              ));
              // console.log('upload data (callback): ' + JSON.stringify(data));

            },
          );




        },
      );
    });


  }

  const moveFiles = async () => {

    Alert.alert(
      'Are you sure to Move All Reports?',
      'never recover',
      [{ text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
      {
        text: 'Ok',
        onPress: async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      {
        title: "App Camera Permission",
        message:
          "App needs access to your camera " +
          "so you can take pictures.",
        buttonNeutral: "Ask Me Later",
        buttonNegative: "Cancel",
        buttonPositive: "OK"
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("You can use the camera");
    } else {
      console.log("Camera permission denied");
    }
    var dd=GetFullDate();
    var fdd = dd.replace(/(\\|\/)/g, '');
    var p = new Array();
    console.log(reports);
    for (var i = 0; i < reports.length; i++) {
      //alert($(element[i]).val());
      if (reports[i].date_folder!=fdd) {
      p[i] = reports[i].file_name;
      }
    }
    // alert(p.join("\n"));
    if(p.length==''){
      Alert.alert('No Files to Move!','', [
        { text: 'Okay' }
      ]);
    }else{

      Alert.alert('Files to Move!', p.join("\n"), [
        { text: 'Okay' }
      ]);
    }
 

    reports.map(async (item, index) => {

  
      if (item.date_folder!=fdd) {  
        var path = item.file_path;
        var name = item.file_name;
        var customer = item.customer;
        var office = item.office;
        var site = item.site;
        var date_folder = item.date_folder;
        const backupFolder = 'AF App Backup/Aquaflow/Maintenance/' + customer + '/' + office + '/' + site + '/' + date_folder;

        const DirectoryPath= RNFS.ExternalStorageDirectoryPath+'/'+ backupFolder;
        RNFS.exists(DirectoryPath).then((result) => {
            console.log('GOT RESULT', result); 
            if(result==false){
                RNFS.mkdir(DirectoryPath);
            }
          });
        RNFS.moveFile(path, DirectoryPath+'/'+name).then(() => {
          console.log('FILE Moved');
          realm.write(() => {
            var ID = item.report_id;
      
            if (
              realm.objects('report_details').filtered('report_id =' + ID)
                .length > 0
            ) {
              realm.delete(
                realm.objects('report_details').filtered('report_id =' + ID)
              );
              var report_details = realm.objects('report_details');
              console.log(report_details);
              setReports(report_details);
  
              Toast.show('Report Moved Successfuly...', Toast.SHORT, [
                'UIAlertController',
              ]);
  
            } else {
              alert('No Data For Deletion.');
            }
          });
        })
        // `unlink` will throw an error, if the item to unlink does not exist
        .catch((err) => {
          console.log(err.message);
        });
                  
     

        var report_file_details = realmrf.objects('report_file_details').filtered('report_name =' + '"' + name + '"');
        let files = [];
        console.log('rf = ', report_file_details);
        var num=1;
        report_file_details.map((item, index) => {
          
        
         RNFS.moveFile(item.file_path+"/"+item.file_name, DirectoryPath+"/"+item.file_name).then(() => {
           console.log('FILE Moved');
           realmrf.write(() => {
       
            var Name = item.file_name;

              if (
                realmrf.objects('report_file_details').filtered('file_name =' + '"'+Name+'"')
                  .length > 0
              ) {
                realmrf.delete(
                  realmrf.objects('report_file_details').filtered('file_name =' + '"'+Name+'"')
                );

  
              } else {
                alert('No Data For Deletion.');
              }

          });
         })
         // `unlink` will throw an error, if the item to unlink does not exist
         .catch((err) => {
           console.log(err.message);
         });

         if(report_file_details.length-1==index){
          const AppFolder = 'Aquaflow/Maintenance/' + customer + '/' + office + '/' + site + '/' + date_folder;
  
          const DelDirectoryPath= RNFS.ExternalStorageDirectoryPath+'/'+ AppFolder;
          setTimeout(async function(){
      //   RNFS.unlink(DelDirectoryPath)    
        }, 10000);
  
         }
      });
    
        

      } 

    }); 
  },
},
],
{ cancelable: false }
);
  }
  
   ///// Delete Report /////


   const deleteReportConfirm = (rid,name) => {
   var rp= realm.objects('report_details').filtered('report_id =' + rid);

const AppFolder = 'Aquaflow/Maintenance/' + rp[0].customer + '/' + rp[0].office + '/' + rp[0].site + '/' + rp[0].date_folder;
  
const DelDirectoryPath= RNFS.ExternalStorageDirectoryPath+'/'+ AppFolder;
console.log(DelDirectoryPath);
//RNFS.unlink(DelDirectoryPath)   


    Alert.alert(
      'Are you sure to delete this Report?',
      'never recover',
      [{ text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
      {
        text: 'Ok',
        onPress: () => {

          RNFS.unlink(DelDirectoryPath);
          realm.write(() => {
            var ID = rid;
            var Name = name;
            if (
              realm.objects('report_details').filtered('report_id =' + rid)
                .length > 0
            ) {
              realm.delete(
                realm.objects('report_details').filtered('report_id =' + rid)
              );
              var report_details = realm.objects('report_details');
              console.log(report_details);
              setReports(report_details);

              Toast.show('Report Deleted Successfuly...', Toast.SHORT, [
                'UIAlertController',
              ]);

            } else {
              alert('No Data For Deletion.');
            }
          });

          realmrf.write(() => {
       
            var Name = name;

              if (
                realmrf.objects('report_file_details').filtered('report_name =' + '"'+Name+'"')
                  .length > 0
              ) {
                realmrf.delete(
                  realmrf.objects('report_file_details').filtered('report_name =' + '"'+Name+'"')
                );

                Toast.show('Report File Deleted Successfuly...', Toast.SHORT, [
                  'UIAlertController',
                ]);
  
              } else {
                alert('No Data For Deletion.');
              }

          });

        },
      },
      ],
      { cancelable: false }
    );
  }


  const GetFullDate = () => {

    var date = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();

    //Alert.alert(date + '/' + month + '/' + year);
    // You can turn it in to your desired format
    if(date<10){
        date='0'+date;

 }
 if(month<10){
     month='0'+month;

}
    var format = year + '/' + month + '/' + date;


    // Setting up fullTime variable in State.
    return format;


}
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <StatusBar barStyle={theme.dark ? "light-content" : "dark-content"} />
      { isConnected ?

        <Button full success>
          <Text>Connection Stablished.</Text>
        </Button> :

        <Button full danger>
          <Text>Not Connected to any Network!</Text>
        </Button>

      }


      <View style={{ flexDirection: "row", margin: 10, padding: 10 }}>
        <Button iconLeft primary onPress={() => moveFiles()}>
          <Icon name='folder' style={{ marginLeft: 40 }} />
          <Text style={{ color: "#fff" }}>  Move Backup      </Text>
        </Button>
        <Button iconLeft warning onPress={() => uploadAllFiles()}>
          <Icon name='folder' style={{ marginLeft: 10 }} />
          <Text style={{ color: "#fff" }}>  Upload All Files      </Text>
        </Button>
      </View>
      <Content style={{ width: 400 }}>

        {/* {isConnected ?

          <Button iconLeft warning onPress={() => selectFile()}>
            <Icon name='folder' />
            <Text style={{ color: "#fff" }}>  Upload File      </Text>
          </Button>

          : <Button iconLeft light onPress={() => handleClick()}>
            <Icon name='refresh' />
            <Text style={{ color: "#000" }}>Refresh      </Text>
          </Button>} */}

        <List>
          {reports.map((item, index) => (

            <ListItem avatar key={index} >
              <Left>
                <Thumbnail source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/PDF_file_icon.svg/1200px-PDF_file_icon.svg.png' }} />
              </Left>
              <Body>
                <Text>{item.file_name}</Text>
                <Text note>{item.file_path}</Text>
              </Body>
              <Right>
                <Button style={{ width: 80 }} iconLeft warning onPress={() => uploadFile(item.file_path, item.file_name, item.customer, item.office, item.site, item.date_folder)}>

                  <Text style={{ color: "#fff", fontSize: 10 }}>Upload</Text>
                </Button>
                <Button style={{ width: 80 }} iconLeft danger onPress={() => deleteReportConfirm(item.report_id,item.file_name)}>

<Text style={{ color: "#fff", fontSize: 10 }}>Delete</Text>
</Button>
              </Right>

            </ListItem>

          ))}


        </List>
      </Content>


    </View>
  );
}



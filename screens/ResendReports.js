import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Alert, View, SafeAreaView } from 'react-native';
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
import { TextInput, Appbar, Title } from 'react-native-paper';

import RNSmtpMailer from "react-native-smtp-mailer";
import Spinner from 'react-native-loading-spinner-overlay';


export default function ResendReports({ navigation }) {

    const _goBack = () => navigation.goBack();
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
        isLoading: false,

    });

  const  realm = new Realm({
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
    const  realmrf = new Realm({
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
    const realmo = new Realm({
        path: 'OfficeDatabase.realm', schema: [
          {
            name: 'office_details',
            properties: {
              office_id: { type: 'int', default: 0 },
              office_name: 'string',
              customer_name: 'string',
            },
          },
        ],
      });
      const realmoe = new Realm({
        path: 'OfficeEmailDatabase.realm', schema: [
            {
              name: 'office_emails',
              properties: {
                office_email_id: { type: 'int', default: 0 },
                office_id: { type: 'int', default: 0 },
                office_email: 'string',
              },
            },
          ],
        });
    
    useEffect(() => {
        if (isFocused) {
            // Update the document title using the browser API
            var report_details = realm.objects('report_details').filtered('status = 1');

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
            
        }

    }, [isFocused]);

    ///// Send Email Report /////


    const sendReport = async (office,path,name,report_id) => {
        const keys = await AsyncStorage.getAllKeys()
        const itemsArray = await AsyncStorage.multiGet(keys)
        let object = {}
        itemsArray.map(item => {
          object[`${item[0]}`] = item[1]
        })
        console.log(object);
        var office_details = realmo.objects('office_details').filtered('office_name =' + '"'+office+'"');
        let emails=[];
        console.log(office_details[0].office_name);
      //  setOfficeName(office_details[0].office_name);
         var office=office_details[0].office_name;
         var office_id=office_details[0].office_id;

         var office_emails = realmoe.objects('office_emails').filtered('office_id =' + office_id);
        
         if(office_emails.length==0){
            Alert.alert('Email Not Found!', 'Add Office Email for sending Reports.', [
                { text: 'Okay' }
            ]);
         }else{
            setData({
                ...data,
                isLoading: true,
    
            });
            console.log(office_emails);
                office_emails.map((item, index) => (
               
                emails.push(item.office_email)
            ))
            console.log(emails)

            var report_file_details = realmrf.objects('report_file_details').filtered('report_name =' + '"'+name+'"');;
            let fpaths=[];
            let fpathnames=[];
            fpaths.push(path),
            fpathnames.push(name)
            report_file_details.map((item, index) => (
               
                fpaths.push(item.file_path+'/'+item.file_name),
                fpathnames.push(item.file_name)
            ))
            console.log(fpaths)
            console.log(fpathnames)
            RNSmtpMailer.sendMail({
                mailhost: object.smtpHost,
                port: object.smtpPort,
                ssl: true, // optional. if false, then TLS is enabled. Its true by default in android. In iOS TLS/SSL is determined automatically, and this field doesn't affect anything
                username: object.smtpEmail,
                password: object.smtpPassword,
                fromName: object.smtpTitle, // optional
                recipients: emails.toString(),
                subject: "PDF Maintenance Report of : "+office,
                htmlBody: "<h1>PDF Maintenance Report of : "+office+"</h1><p>Please Look Attached Document.</p>",
                attachmentPaths: fpaths, // optional
                attachmentNames: fpathnames, // required in android, these are renames of original files. in ios filenames will be same as specified in path. In a ios-only application, no need to define it
              })
                .then(success => {
                    setData({
                        ...data,
                        isLoading: false,
            
                    });
                  
                    console.log(success);
                    realm.write(() => {
                    
                        if (
                          realm.objects('report_details').filtered('report_id =' + report_id)
                            .length > 0
                        ) {
                  
                          var obj = realm
                            .objects('report_details')
                            .filtered('report_id =' + report_id);
                          console.log('obj', obj);
                          if (obj.length > 0) {

                            obj[0].status = 1;
                  
                          }
                          var report_details = realm.objects('report_details').filtered('status = 1');
                          setReports(report_details);
                         
                          Toast.show('Report Sent Successfuly...', Toast.SHORT, [
                            'UIAlertController',
                          ]);
                  
                        } else {
                          alert('No Data For Deletion.');
                        }
                      });
                })
                .catch(err => {
                    setData({
                        ...data,
                        isLoading: false,
            
                    });
                    alert(err);
                    console.log(err);
                });
         }
      //  setData(office_emails); 
      
    }


      if (data.isLoading) {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.container}>
                    <Spinner
                        //visibility of Overlay Loading Spinner
                        visible={data.isLoading}
                        //Text with the Spinner
                        textContent={'Resending Report...'}
                        //Text style of the Spinner Text
                        textStyle={styles.spinnerTextStyle}
                    />


                </View>
            </SafeAreaView>
        );
    }
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Appbar.Header style={{ backgroundColor: '#1c4468', marginTop: 24, width: '100%' }}>
                <Appbar.BackAction onPress={_goBack} />
                <Appbar.Content title="Resend Reports" />

            </Appbar.Header>
            <StatusBar barStyle={theme.dark ? "light-content" : "dark-content"} />

            <Content style={{ width: 400, marginTop: 30 }}>

            { reports.length > 0 ?
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
                                <Button style={{ width: 80 }} iconLeft warning onPress={() => sendReport(item.office,item.file_path,item.file_name,item.report_id) }>
                                {/* {alert('Email Sent!')} */}
                                    <Text style={{ color: "#fff", fontSize: 10 }}>Resend</Text>
                                </Button>
                            </Right>

                        </ListItem>

                    ))}


                </List>
                 : 
                 <List>
    
 
                     <ListItem>
       
                         <Body>
                             <Text>Reports Not Found !</Text>
                             <Text note>No Reports Available for Resend.</Text>
                         </Body>
 
 
                     </ListItem>
             </List>
 }
            </Content>


        </View>
    );
}


const styles = StyleSheet.create({
    spinnerTextStyle: {
        color: '#FFF',
    },
    loading: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        opacity: 0.5,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center'
    },
    ddcontainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingBottom: 10,
        alignItems: 'flex-start' // if you want to fill rows left to right
    },
    dditem: {
        width: '50%', // is 50% of container width
        paddingLeft: 5,
        paddingTop: 35,
        paddingBottom: 35
    },
    dditemcustom: {
        width: '100%', // is 50% of container width
        paddingLeft: 5,
        paddingTop: 35,
        paddingBottom: 55,
        height: 40
    },
    container: {
        flex: 1,
        backgroundColor: '#1c4468'
    },
    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 50
    },
    footer: {
        flex: Platform.OS === 'ios' ? 3 : 5,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30
    },
    text_header: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 30
    },
    text_footer: {
        color: '#05375a',
        fontSize: 18
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
        backgroundColor: '#ffffff'
    },
    button: {
        alignItems: 'center',
        marginTop: 50,

    },
    buttonText: {

        width: '100%',
        justifyContent: 'center',
        textAlign: 'center',
    },
    signIn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        padding: 10,
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    textPrivate: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 20
    },
    color_textPrivate: {
        color: 'grey'
    }
});

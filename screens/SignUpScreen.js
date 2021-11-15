import React from 'react';
import { useState, useEffect, Component } from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Spinner from 'react-native-loading-spinner-overlay';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-simple-toast';
import Icon from 'react-native-vector-icons/Ionicons';
import RNHTMLtoPDF from 'react-native-html-to-pdf';


import {
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    Platform,
    StyleSheet,
    ScrollView,
    StatusBar,
    Image,
    Alert,
    SafeAreaView,
    ActivityIndicator
} from 'react-native';
import PDF from 'rn-pdf-generator';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import { TextInput, Button } from 'react-native-paper';

import ImagePicker from 'react-native-image-picker';
import AsyncStorage from '@react-native-community/async-storage';
import { createPDF } from '../lib/createPDF';
const { width, height } = Dimensions.get('screen');
import PDFLib, { PDFDocument, PDFPage } from 'react-native-pdf-lib';
import DropDownPicker from 'react-native-dropdown-picker';
import Realm from 'realm';
let realm;
import { AuthContext } from '../components/context';
var RNFS = require('react-native-fs');

const SignInScreen = () => {

 const [filePath, setFilePath] = useState('');
    const [usrType, setUsrType] = React.useState();
    const [imgPath, setimgPath] = React.useState();
    const { signOut } = React.useContext(AuthContext);

    useEffect(() => {
//////// retrieve Asynch storage data ///////////
        const retrieveData = async () => {
            const keys = await AsyncStorage.getAllKeys()
            const itemsArray = await AsyncStorage.multiGet(keys)
            const usType = await AsyncStorage.getItem('utype');
            setUsrType(usType);
            let object = {}
            itemsArray.map(item => {
                object[`${item[0]}`] = item[1]
            })

            setData({
                ...data,
                username: object.uname,
                useremail: object.uemail,
            });
        }

        retrieveData()
    }, []);

    /////// object for report database /////////
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

          /////// object for report Files database /////////
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

/////// object for customer database /////////
    realmc = new Realm({
        path: 'CustomerDatabase.realm', schema: [
            {
                name: 'customer_details',
                properties: {
                    customer_id: { type: 'int', default: 0 },
                    customer_name: 'string',

                },
            },
        ],
    });

    var customer_details = realmc.objects('customer_details');
    let customerList = customer_details.map(x => ({
        label: x.customer_name,
        value: x.customer_name
    }));


    /////// object for office database /////////
    realmo = new Realm({
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
    var office_details = realmo.objects('office_details');
    let officeList = office_details.map(x => ({
        label: x.office_name,
        value: x.office_name
    }));


    /////// object for site database /////////
    realms = new Realm({
        path: 'SiteDatabase.realm', schema: [
            {
                name: 'site_details',
                properties: {
                    site_id: { type: 'int', default: 0 },
                    site_name: 'string',
                    customer_name: 'string',
                    office_name: 'string',
                    site_type: 'string',

                },
            },
        ],
    });
    var site_details = realms.objects('site_details');
    let siteList = site_details.map(x => ({
        label: x.site_name,
        value: x.site_name
    })); 

    const navigation = useNavigation();
    const [data, setData] = React.useState({
        customerOfficeList: [],
        officeSiteList: [],
        customer: '',
        office: '',
        site: '',
        date: '',
        fnamedate: '',
        fnamedate: '20210709', 
        filenametosave: '',
        time: '',
        veh: '',
        mileage: '',
        gcondition: '',
        gatelock: '',
        fenceneedrepair: '',
        notes1: '',
        notes2: '',
        notes3: '',
        notes4: '',
        deployment: '',
        rate: '',
        namev1:'',
        namev2:'',
        namev3:'',
        kfactor: '',
        kfactorv2: '',
        kfactorv3: '',
        xfactor: '',
        xfactorv2: '',
        xfactorv3: '',
        dateandtime: '',
        testwithcc: '',
        runningwater: '',
        transferfiles: '',
        usb: '',
        heater: 'NO',
        light: 'NO',
        ups: 'NO',
        battery: 'NO',
        faceplate: 'NO',
        inside: 'NO',
        flowsensor: 'YES',
        backflow: 'YES',
        coupler: 'YES',
        other: 'YES',
        pic1: null,
        pic1uri: null,
        pic1height: 0,
        pic1width: 0,
        pic2: null,
        pic2uri: null,
        pic2height: 0,
        pic2width: 0,
        pic3: null,
        pic3uri: null,
        pic3height: 0,
        pic3width: 0,
        pic4: null,
        pic4uri: null,
        pic4height: 0,
        pic4width: 0,
        pic5: null,
        pic5uri: null,
        pic5height: 0,
        pic5width: 0,
        pic6: null,
        pic6uri: null,
        pic6height: 0,
        pic6width: 0,
        pic7: null,
        pic7uri: null,
        pic7height: 0,
        pic7width: 0,
        pic72: null,
        pic72uri: null,
        pic72height: 0,
        pic72width: 0,
        pic73: null,
        pic73uri: null,
        pic73height: 0,
        pic73width: 0,
        pic8: null,
        pic8uri: null,
        pic8height: 0,
        pic8width: 0,
        pic9: null,
        pic9uri: null,
        pic9height: 0,
        pic9width: 0,
        pic10: null,
        pic10uri: null,
        pic10height: 0,
        pic10width: 0,
        pic11: null,
        pic11uri: null,
        pic11height: 0,
        pic11width: 0,
        pic12: null,
        pic12uri: null,
        pic12height: 0,
        pic12width: 0,
        pic13: null,
        pic13uri: null,
        pic13height: 0,
        pic13width: 0,
        pic14: null,
        pic14uri: null,
        pic14height: 0,
        pic14width: 0,
        pic15: null,
        pic15uri: null,
        pic15height: 0,
        pic15width: 0,
        pic16: null,
        pic16uri: null,
        pic16height: 0,
        pic16width: 0,
        isLoading: false,
        isSite: true,
        formName:'',
        isNeedRepair: false,
        resourcePath: {},
        username: '',
        useremail: '',
        checkdate:'NO',
        getlog:'NO',
        cwsfi:'NO',

    });

    /////// function for upload file /////////
    const selectFile = (type) => {

        var options = {
            title: 'Select Image',
            noData: true,
            rotation: 360,
            storageOptions: {
                cameraRoll: true,
                skipBackup: true,
                path: 'images',
            },
            quality:1,
            maxWidth: 1024,
            maxHeight: 1024,
            allowsEditing: false, 
        };
///////image picker /////////
        ImagePicker.launchCamera(options, res => {
            console.log('Response = ', res);

            if (res.didCancel) {
                console.log('User cancelled image picker');
            } else if (res.error) {
                console.log('ImagePicker Error: ', res.error);
            } else if (res.customButton) {
                console.log('User tapped custom button: ', res.customButton);
                alert(res.customButton);
            } else {
                let source = res;
/////// conditions for all images according to image name and numbers /////////
                if (type == 'one') {

                    if (source.isVertical == false) {
                        setData({
                            ...data,
                            pic1: source.path,
                            pic1uri: source.uri,
                            pic1height: 300,
                            pic1width: 160,
                        });
                    } else {
                        setData({
                            ...data,
                            pic1: source.path,
                            pic1uri: source.uri,
                            pic1height: 160,
                            pic1width: 300,
                        });

                    }

                }
                if (type == 'two') {
                    if (source.isVertical == false) {
                        setData({
                            ...data,
                            pic2: source.path,
                            pic2uri: source.uri,
                            pic2height: 300,
                            pic2width: 160,
                        });
                    } else {
                        setData({
                            ...data,
                            pic2: source.path,
                            pic2uri: source.uri,
                            pic2height: 160,
                            pic2width: 300,
                        });

                    }
                }
                if (type == 'three') {
                    if (source.isVertical == false) {
                        setData({
                            ...data,
                            pic3: source.path,
                            pic3uri: source.uri,
                            pic3height: 300,
                            pic3width: 160,
                        });
                    } else {
                        setData({
                            ...data,
                            pic3: source.path,
                            pic3uri: source.uri,
                            pic3height: 160,
                            pic3width: 300,
                        });

                    }
                }
                if (type == 'four') {
                    if (source.isVertical == false) {
                        setData({
                            ...data,
                            pic4: source.path,
                            pic4uri: source.uri,
                            pic4height: 300,
                            pic4width: 160,
                        });
                    } else {
                        setData({
                            ...data,
                            pic4: source.path,
                            pic4uri: source.uri,
                            pic4height: 160,
                            pic4width: 300,
                        });


                    }
                }
                if (type == 'five') {
                    if (source.isVertical == false) {
                        setData({
                            ...data,
                            pic5: source.path,
                            pic5uri: source.uri,
                            pic5height: 300,
                            pic5width: 160,
                        });
                    } else {
                        setData({
                            ...data,
                            pic5: source.path,
                            pic5uri: source.uri,
                            pic5height: 160,
                            pic5width: 300,
                        });

                    }
                }
                if (type == 'six') {
                    if (source.isVertical == false) {
                        setData({
                            ...data,
                            pic6: source.path,
                            pic6uri: source.uri,
                            pic6height: 300,
                            pic6width: 160,
                        });
                    } else {
                        setData({
                            ...data,
                            pic6: source.path,
                            pic6uri: source.uri,
                            pic6height: 160,
                            pic6width: 300,
                        });

                    }
                }
                if (type == 'seven') {

                    if (source.isVertical == false) {
                        setData({
                            ...data,
                            pic7: source.path,
                            pic7uri: source.uri,
                            pic7height: 300,
                            pic7width: 160,
                            dateandtime: setDateTime()

                        });

                    } else {
                        setData({
                            ...data,
                            pic7: source.path,
                            pic7uri: source.uri,
                            pic7height: 160,
                            pic7width: 300,
                            dateandtime: setDateTime()

                        });

                    }

                }
                if (type == 'seven2') {

                    if (source.isVertical == false) {
                        setData({
                            ...data,
                            pic72: source.path,
                            pic72uri: source.uri,
                            pic72height: 300,
                            pic72width: 160,
                       

                        });

                    } else {
                        setData({
                            ...data,
                            pic72: source.path,
                            pic72uri: source.uri,
                            pic72height: 160,
                            pic72width: 300,
                     

                        });

                    }

                }
                if (type == 'seven3') {

                    if (source.isVertical == false) {
                        setData({
                            ...data,
                            pic73: source.path,
                            pic73uri: source.uri,
                            pic73height: 300,
                            pic73width: 160,
                       

                        });

                    } else {
                        setData({
                            ...data,
                            pic73: source.path,
                            pic73uri: source.uri,
                            pic73height: 160,
                            pic73width: 300,
                     

                        });

                    }

                }
                if (type == 'eight') {
                    if (source.isVertical == false) {
                        setData({
                            ...data,
                            pic8: source.path,
                            pic8uri: source.uri,
                            pic8height: 300,
                            pic8width: 160,
                        });
                    } else {
                        setData({
                            ...data,
                            pic8: source.path,
                            pic8uri: source.uri,
                            pic8height: 160,
                            pic8width: 300,
                        });

                    }
                }
                if (type == 'nine') {
                    if (source.isVertical == false) {
                        setData({
                            ...data,
                            pic9: source.path,
                            pic9uri: source.uri,
                            pic9height: 300,
                            pic9width: 160,
                        });
                    } else {
                        setData({
                            ...data,
                            pic9: source.path,
                            pic9uri: source.uri,
                            pic9height: 160,
                            pic9width: 300,
                        });

                    }
                }
                if (type == 'ten') {
                    if (source.isVertical == false) {
                        setData({
                            ...data,
                            pic10: source.path,
                            pic10uri: source.uri,
                            pic10height: 300,
                            pic10width: 160,
                        });
                    } else {
                        setData({
                            ...data,
                            pic10: source.path,
                            pic10uri: source.uri,
                            pic10height: 160,
                            pic10width: 300,
                        });

                    }
                }
                if (type == 'eleven') {
                    if (source.isVertical == false) {
                        setData({
                            ...data,
                            pic11: source.path,
                            pic11uri: source.uri,
                            pic11height: 300,
                            pic11width: 160,
                        });
                    } else {
                        setData({
                            ...data,
                            pic11: source.path,
                            pic11uri: source.uri,
                            pic11height: 160,
                            pic11width: 300,
                        });

                    }
                }
                if (type == 'twelve') {
                    if (source.isVertical == false) {
                        setData({
                            ...data,
                            pic12: source.path,
                            pic12uri: source.uri,
                            pic12height: 300,
                            pic12width: 160,
                        });
                    } else {
                        setData({
                            ...data,
                            pic12: source.path,
                            pic12uri: source.uri,
                            pic12height: 160,
                            pic12width: 300,
                        });

                    }
                }
                if (type == 'thirteen') {
                    if (source.isVertical == false) {
                        setData({
                            ...data,
                            pic13: source.path,
                            pic13uri: source.uri,
                            pic13height: 300,
                            pic13width: 160,
                        });
                    } else {
                        setData({
                            ...data,
                            pic13: source.path,
                            pic13uri: source.uri,
                            pic13height: 160,
                            pic13width: 300,
                        });

                    }
                }
                if (type == 'fourteen') {
                    if (source.isVertical == false) {
                        setData({
                            ...data,
                            pic14: source.path,
                            pic14uri: source.uri,
                            pic14height: 300,
                            pic14width: 160,
                        });
                    } else {
                        setData({
                            ...data,
                            pic14: source.path,
                            pic14uri: source.uri,
                            pic14height: 160,
                            pic14width: 300,
                        });

                    }
                }

                if (type == 'fifteen') {
                    if (source.isVertical == false) {
                        setData({
                            ...data,
                            pic15: source.path,
                            pic15uri: source.uri,
                            pic15height: 300,
                            pic15width: 160,
                        });
                    } else {
                        setData({
                            ...data,
                            pic15: source.path,
                            pic15uri: source.uri,
                            pic15height: 160,
                            pic15width: 300,
                        });

                    }
                }

                if (type == 'sixteen') {
                    if (source.isVertical == false) {
                        setData({
                            ...data,
                            pic16: source.path,
                            pic16uri: source.uri,
                            pic16height: 300,
                            pic16width: 160,
                        });
                    } else {
                        setData({
                            ...data,
                            pic16: source.path,
                            pic16uri: source.uri,
                            pic16height: 160,
                            pic16width: 300,
                        });

                    }
                }

            }
        });
    };

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isDatePickerVisible1, setDatePickerVisibility1] = useState(false);
    const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
    /////// Date and time functions /////////
    const getCurrentDate = () => {

        var date = new Date().getDate();
        var month = new Date().getMonth() + 1;
        var year = new Date().getFullYear();

        //Alert.alert(date + '/' + month + '/' + year);
        // You can turn it in to your desired format

        var format = year + '/' + month + '/' + date;

        var fnamedate = format.replace(/(\\|\/)/g, '');

        setData({
            ...data,
            date: format,
            fnamedate: fnamedate
        });

        return format;//format: dd-mm-yyyy;
    }
    const GetTime = () => {

        // Creating variables to hold time.
        var date, TimeType, hour, minutes, seconds, fullTime;

        // Creating Date() function object.
        date = new Date();

        // Getting current hour from Date object.
        hour = date.getHours();

        // Checking if the Hour is less than equals to 11 then Set the Time format as AM.
        if (hour <= 11) {

            TimeType = 'AM';

        }
        else {

            // If the Hour is Not less than equals to 11 then Set the Time format as PM.
            TimeType = 'PM';

        }


        // IF current hour is grater than 12 then minus 12 from current hour to make it in 12 Hours Format.
        if (hour > 12) {
            hour = hour - 12;
        }

        // If hour value is 0 then by default set its value to 12, because 24 means 0 in 24 hours time format. 
        if (hour == 0) {
            hour = 12;
        }


        // Getting the current minutes from date object.
        minutes = date.getMinutes();

        // Checking if the minutes value is less then 10 then add 0 before minutes.
        if (minutes < 10) {
            minutes = '0' + minutes.toString();
        }


        //Getting current seconds from date object.
        seconds = date.getSeconds();

        // If seconds value is less than 10 then add 0 before seconds.
        if (seconds < 10) {
            seconds = '0' + seconds.toString();
        }


        // Adding all the variables in fullTime variable.
        fullTime = hour.toString() + ':' + minutes.toString() + ':' + seconds.toString() + ' ' + TimeType.toString();
        var date = new Date().getDate();
        var month = new Date().getMonth() + 1;
        var year = new Date().getFullYear();

        //Alert.alert(date + '/' + month + '/' + year);
        // You can turn it in to your desired format

        var format = year + '/' + month + '/' + date;

        var fnamedate = format.replace(/(\\|\/)/g, '');

        // Setting up fullTime variable in State.
        setFormDate(format);
        setFormTime(fullTime);
        setFnameDate(fnamedate);

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


//////// get full time

    const GetFullTime = () => {

        // Creating variables to hold time.
        var date, TimeType, hour, minutes, seconds, fullTime;

        // Creating Date() function object.
        date = new Date();

        // Getting current hour from Date object.
        hour = date.getHours();

        // Checking if the Hour is less than equals to 11 then Set the Time format as AM.
        if (hour <= 11) {

            TimeType = 'AM';

        }
        else {

            // If the Hour is Not less than equals to 11 then Set the Time format as PM.
            TimeType = 'PM';

        }


        // IF current hour is grater than 12 then minus 12 from current hour to make it in 12 Hours Format.
        if (hour > 12) {
            hour = hour - 12;
        }

        // If hour value is 0 then by default set its value to 12, because 24 means 0 in 24 hours time format. 
        if (hour == 0) {
            hour = 12;
        }


        // Getting the current minutes from date object.
        minutes = date.getMinutes();

        // Checking if the minutes value is less then 10 then add 0 before minutes.
        if (minutes < 10) {
            minutes = '0' + minutes.toString();
        }


        //Getting current seconds from date object.
        seconds = date.getSeconds();

        // If seconds value is less than 10 then add 0 before seconds.
        if (seconds < 10) {
            seconds = '0' + seconds.toString();
        }


        // Adding all the variables in fullTime variable.
        fullTime = hour.toString() + ':' + minutes.toString() + ':' + seconds.toString() + ' ' + TimeType.toString();

        return fullTime;

    }

/////////// get plane date for file name /////////
    const GetFnameDate = () => {

        var date = new Date().getDate();
        var month = new Date().getMonth() + 1;
        var year = new Date().getFullYear();
        if(date<10){
               date='0'+date;

        }
        if(month<10){
            month='0'+month;

     }

        //Alert.alert(date + '/' + month + '/' + year);
        // You can turn it in to your desired format

        var format = year + '/' + month + '/' + date;

        var fnamedate = format.replace(/(\\|\/)/g, '');


        return fnamedate;

    }

///////// set current date and time ////////////
    const setDateTime = () => {

        // Creating variables to hold time.
        var date, TimeType, hour, minutes, seconds, fullTime;

        // Creating Date() function object.
        date = new Date();

        // Getting current hour from Date object.
        hour = date.getHours();

        // Checking if the Hour is less than equals to 11 then Set the Time format as AM.
        if (hour <= 11) {

            TimeType = 'AM';

        }
        else {

            // If the Hour is Not less than equals to 11 then Set the Time format as PM.
            TimeType = 'PM';

        }


        // IF current hour is grater than 12 then minus 12 from current hour to make it in 12 Hours Format.
        if (hour > 12) {
            hour = hour - 12;
        }

        // If hour value is 0 then by default set its value to 12, because 24 means 0 in 24 hours time format. 
        if (hour == 0) {
            hour = 12;
        }


        // Getting the current minutes from date object.
        minutes = date.getMinutes();

        // Checking if the minutes value is less then 10 then add 0 before minutes.
        if (minutes < 10) {
            minutes = '0' + minutes.toString();
        }


        //Getting current seconds from date object.
        seconds = date.getSeconds();

        // If seconds value is less than 10 then add 0 before seconds.
        if (seconds < 10) {
            seconds = '0' + seconds.toString();
        }


        // Adding all the variables in fullTime variable.
        fullTime = hour.toString() + ':' + minutes.toString() + ':' + seconds.toString() + ' ' + TimeType.toString();
        var date = new Date().getDate();
        var month = new Date().getMonth() + 1;
        var year = new Date().getFullYear();

        //Alert.alert(date + '/' + month + '/' + year);
        // You can turn it in to your desired format

        var format = year + '/' + month + '/' + date + ' - ' + fullTime;
        return format;


    }
    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };
    const showDatePicker1 = () => {
        setDatePickerVisibility1(true);
    };
    const showTimePicker = () => {
        setTimePickerVisibility(true);
    };
    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };
    const hideDatePicker1 = () => {
        setDatePickerVisibility1(false);
    };
    const hideTimePicker = () => {
        setTimePickerVisibility(false);
    };
    const handleConfirm = (date) => {
        const str = date.toLocaleDateString('en-US', { day: "numeric" });
        var mm = date.getMonth() + 1;
        var dd = date.getDate();
        var yyyy = date.getFullYear();
        if (mm < 10) mm = '0' + mm;
        if (dd < 10) dd = '0' + dd;
        var format = yyyy + '/' + mm + '/' + dd

        var fnamedate = format.replace(/(\\|\/)/g, '');

        setData({
            ...data,
            date: format,
            fnamedate: fnamedate
        });

        hideDatePicker();
    };
    const handleConfirm1 = (date) => {

        setData({
            ...data,
            dateandtime: date.toLocaleString()
        });

        hideDatePicker1();
    };
    const handleConfirmt = (time) => {
        setData({
            ...data,
            time: time.toLocaleTimeString().replace(/([\d]+:[\d]{2})(:[\d]{2})(.*)/, "$1$3")
        });

        hideTimePicker();
    };



/////// filter all office according to selected customer /////////




    const getCustomerOffice = async (customer_name) => {

        realmo = new Realm({
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

        if (customer_name) {

            var office_details = realmo.objects('office_details').filtered('customer_name =' + '"' + customer_name + '"');
            let officeList = office_details.map(x => ({
                label: x.office_name,
                value: x.office_name
            }));

            setData({
                ...data,
                customerOfficeList: officeList,
                customer: customer_name,
                enccustomer: customer_name,

            });

        } else {

            var office_details = realmo.objects('office_details');
            let officeList = office_details.map(x => ({
                label: x.office_name,
                value: x.office_name
            }));

            setData({
                ...data,
                customerOfficeList: officeList,
                customer: customer_name,
                enccustomer: customer_name,
            });
        }


    }

/////// filter all sites according to selected office /////////


    const getOfficeSite = async (office_name) => {

        realmo = new Realm({
            path: 'SiteDatabase.realm', schema: [
                {
                    name: 'site_details',
                    properties: {
                        site_id: { type: 'int', default: 0 },
                        site_name: 'string',
                        customer_name: 'string',
                        office_name: 'string',
                        site_type: 'string',
                    },
                },
            ],
        });

        if (office_name) {

            var site_details = realmo.objects('site_details').filtered('office_name =' + '"' + office_name + '"');
            let siteList = site_details.map(x => ({
                label: x.site_name,
                value: x.site_name
            }));

            setData({
                ...data,
                officeSiteList: siteList,
                office: office_name

            });

        } else {

            var site_details = realmo.objects('site_details');
            let siteList = site_details.map(x => ({
                label: x.site_name,
                value: x.site_name
            }));

            setData({
                ...data,
                officeSiteList: siteList,
                office: office_name

            });
        }


    }


    const textInputCustomer = (val) => {
        setData({
            ...data,
            customer: val,
            enccustomer: val,
        });
        getCustomerOffice(val);
    }

    const textInputOffice = (val) => {
        setData({
            ...data,
            office: val,
            encoffice: val
        });
        getOfficeSite(val);
    }

    const textInputSite = (val) => {
        setData({
            ...data,
            site: val,
            encsite: val,
            date: GetFullDate(),
            time: GetFullTime(),
            fnamedate: GetFnameDate()
        });

var obj = realms.objects('site_details').filtered('office_name =' + '"' + data.office + '"').filtered('site_name =' + '"' + val + '"');
      
        console.log('obj', obj);
        if (obj.length > 0) {
       
            if (obj[0].site_type == 'Site') {
                setData({
                    ...data,
                    isSite: true,
                    formName: 'Maintenance Form',
                    site: val,
            encsite: val,
            date: GetFullDate(),
            time: GetFullTime(),
            fnamedate: GetFnameDate()

                });
            } else {
                setData({
                    ...data,
                    isSite: false,
                    formName: 'Office Encoder Maintenance Form',
                    site: val,
            encsite: val,
            date: GetFullDate(),
            time: GetFullTime(),
            fnamedate: GetFnameDate()
                });
            }
        }
    }
    const textInputVeh = (val) => {
        setData({
            ...data,
            veh: val
        });

    }
    const textInputMileage = (val) => {
        setData({
            ...data,
            mileage: val
        });

    }
    const textInputGcondition = (val) => {
        setData({
            ...data,
            gcondition: val
        });

    }

    const textInputGateLock = (val) => {

        if (val == 'YES') {
            setData({
                ...data,
                gatelock: 'YES'
            });
        } else {
            setData({
                ...data,
                gatelock: 'No'
            });
        }
        console.log(data.gatelock);
    }

    const textInputNeedRepair = (val) => {


        if (val == 'YES') {
            setData({
                ...data,
                isNeedRepair: true,
                fenceneedrepair: 'YES'
            });
        } else {
            setData({
                ...data,
                isNeedRepair: false,
                fenceneedrepair: 'No'
            });
        }
        console.log(data.fenceneedrepair);
    }
    const textInputNotes1 = (val) => {
        setData({
            ...data,
            notes1: val
        });

    }
    const textInputNotes2 = (val) => {
        setData({
            ...data,
            notes2: val
        });

    }
    const textInputNotes3 = (val) => {
        setData({
            ...data,
            notes3: val
        });

    }
    const textInputNotes4 = (val) => {
        setData({
            ...data,
            notes4: val
        });

    }

    const textInputSoftware = (val) => {
        setData({
            ...data,
            software: val
        });

    }

    const textInputDeployment = (val) => {
        setData({
            ...data,
            deployment: val
        });

    }
    const textInputRate = (val) => {
        setData({
            ...data,
            rate: val
        });

    }
    const textInputNameV1 = (val) => {
        setData({
            ...data,
            namev1: val
        });

    }
    const textInputNameV2 = (val) => {
        setData({
            ...data,
            namev2: val
        });

    }
    const textInputNameV3 = (val) => {
        setData({
            ...data,
            namev3: val
        });

    }
    const textInputKfactor = (val) => {
        setData({
            ...data,
            kfactor: val
        });

    }
    const textInputKfactorV2 = (val) => {
        setData({
            ...data,
            kfactorv2: val
        });

    }
    const textInputKfactorV3 = (val) => {
        setData({
            ...data,
            kfactorv3: val
        });

    }
    const textInputXfactor = (val) => {
        setData({
            ...data,
            xfactor: val
        });

    }
    const textInputXfactorV2 = (val) => {
        setData({
            ...data,
            xfactorv2: val
        });

    }
    const textInputXfactorV3 = (val) => {
        setData({
            ...data,
            xfactorv3: val
        });

    }
    const textInputTestWithC = (val) => {
        setData({
            ...data,
            testwithcc: val
        });

    }
    const textInputRunningWater = (val) => {
        setData({
            ...data,
            runningwater: val
        });

    }
    const textInputTransferFiles = (val) => {
        setData({
            ...data,
            transferfiles: val
        });

    }
    const textInputUsb = (val) => {
        setData({
            ...data,
            usb: val
        });

    }
    const textInputHeater = (val) => {
        setData({
            ...data,
            heater: val
        });

    }
    const textInputLight = (val) => {
        setData({
            ...data,
            light: val
        });

    }
    const textInputUps = (val) => {
        setData({
            ...data,
            ups: val
        });

    }
    const textInputBattery = (val) => {
        setData({
            ...data,
            battery: val
        });

    }
    const textInputFaceplate = (val) => {
        setData({
            ...data,
            faceplate: val
        });

    }
    const textInputInside = (val) => {
        setData({
            ...data,
            inside: val
        });

    }
    const textInputFlowsensor = (val) => {
        setData({
            ...data,
            flowsensor: val
        });

    }
    const textInputBackflow = (val) => {
        setData({
            ...data,
            backflow: val
        });

    }
    const textInputCoupler = (val) => {
        setData({
            ...data,
            coupler: val
        });

    }
    const textInputOther = (val) => {
        setData({
            ...data,
            other: val
        });

    }

/// for encoderform

const textInputCheckdate = (val) => {
    setData({
        ...data,
        checkdate: val
    });

}
const textInputGetlogs = (val) => {
    setData({
        ...data,
        getlog: val
    });

}
const textInputCWSFI = (val) => {
    setData({
        ...data,
        cwsfi: val
    });

}


/////// Handle Form Submit /////////

    const submitHandle = async (data) => {

       
        const    AppFolder    =     'Aquaflow/Maintenance/'+data.customer+'/'+data.office+'/'+data.site+'/'+data.fnamedate;
        const DirectoryPath= RNFS.ExternalStorageDirectoryPath+'/'+ AppFolder;
     //   setimgPath(DirectoryPath);
     //   const DirectoryPath= RNFS.DocumentDirectoryPath +'/'+ AppFolder;
        RNFS.exists(DirectoryPath).then((result) => {
            console.log('GOT RESULT', result); 
            if(result==false){
                RNFS.mkdir(DirectoryPath);
            }
          });





        /////// create file name from variables and date //////
        console.log(data);
        var tmpfname = data.customer + '-' + data.office + '-' + data.site + '-' + data.fnamedate + '.pdf';
        var prefix = data.customer + '-' + data.office + '-' + data.site + '-' + data.fnamedate;
        const filepathname =DirectoryPath+'/'+tmpfname;
        // RNFS.exists(filepathname).then((result) => {
        //     console.log('GOT RESULT', result); 
        //     if(result==true){
        //        console.log(tmpfname);
        //       var filenm=tmpfname.split('.')[0];
        //       var fileex=tmpfname.split('.')[1];


        //       var counter = 'new';
        //       var newpath = DirectoryPath+'/'+filenm+'_'+counter+'.'+fileex;
        //       tmpfname= filenm+'_'+counter+'.'+fileex;
        //       prefix = filenm+'_'+counter;
        //       console.log(newpath); 
        //       console.log(tmpfname); 
        //     }
           
         
        //   });
   
          console.log('sss',tmpfname);
        setData({
            ...data,
            isLoading: true,

        });


        

        ////////// validations for form fields and images  /////

        if (data.customer.length == 0 || data.office.length == 0 || data.site.length == 0) {
            Alert.alert('Wrong Input!', 'Customer or Office or Site field cannot be empty.', [
                { text: 'Okay' }
            ]);
            setData({
                ...data,
                isLoading: false,

            });
            return;
        }
   if (data.pic1uri == null || data.pic2uri == null || data.pic3uri == null || data.pic4uri == null) {
            Alert.alert('Wrong Input!', 'Side Pic 1 , 2 , 3 and 4 cannot be empty.', [
                { text: 'Okay' }
            ]);
            setData({
                ...data,
                isLoading: false,

            });
            return;
        } 
        if (data.fenceneedrepair == 'YES') {
            if (data.pic5uri == null || data.pic6uri == null) {
                Alert.alert('Wrong Input!', ' Pic 5 and 6 cannot be empty.', [
                    { text: 'Okay' }
                ]);
                setData({
                    ...data,
                    isLoading: false,

                });
                return;
            }
        }

        if (data.namev1.length == 0 || data.kfactor.length == 0 || data.xfactor.length == 0) {
            Alert.alert('Wrong Input!', 'V1 Name , K Factor and X Factor field cannot be empty.', [
                { text: 'Okay' }
            ]);
            setData({
                ...data,
                isLoading: false,

            });
            return;
        }


        if (data.pic7uri == null || data.pic8uri == null || data.pic9uri == null || data.pic10uri == null || data.pic11uri == null) {
            Alert.alert('Wrong Input!', 'Pic 7 , 8 , 9 , 10 and 11 cannot be empty.', [
                { text: 'Okay' }
            ]);
            setData({
                ...data,
                isLoading: false,

             });
             return;
         }

setTimeout(async function(){
let options = {
        //Content to print 
        html:
          '<style>th,td { padding:2px;}</style><p style="text-align: center;font-size:20px;"><strong>AquaFlow Int’l, Inc.</strong></p><p style="text-align: center;"><strong>'+data.formName+'</strong></p><p style="text-align: left;">Customer : '+data.customer+'</p><p style="text-align: left;">Office : '+data.office+'</p><p style="text-align: left;">Site : '+data.site+'</p><table style="width:100%;"><tr><td style="width:25%;">Date : '+data.date+'</td><td style="width:25%;">Time : '+data.time+'</td><td style="width:25%;">Veh : '+data.veh+'</td><td style="width:25%;">Mileage : '+data.mileage+'</td></tr></table><p style="text-align: left;">General Condition : '+data.gcondition+'</p><table style="width:100%;"><tr><td style="width:50%;">Fence Gate Lock? : '+data.gatelock+'</td><td style="width:50%;">Fence Need Repair? : '+data.fenceneedrepair+'</td></tr></table><p style="text-align: left;">Notes : '+data.notes1+'</p><table style="width:100%;"><tr><td>Data Check : </td></tr><tr><td style="width:33%;">Software Version : '+data.software+'</td><td style="width:33%;">Deployment : '+data.deployment+'</td><td style="width:33%;">Rate : '+data.rate+'</td></tr><tr><td style="width:33%;">V1 :- Name : '+data.namev1+'</td><td style="width:33%;">K Factor : '+data.kfactor+'</td><td style="width:33%;">X Factor : '+data.xfactor+'</td></tr><tr><td style="width:33%;">V2 :- Name : '+data.namev2+'</td><td style="width:33%;">K Factor : '+data.kfactorv2+'</td><td style="width:33%;">X Factor : '+data.xfactorv2+'</td></tr><tr><td style="width:33%;">V3 :- Name : '+data.namev3+'</td><td style="width:33%;">K Factor : '+data.kfactorv3+'</td><td style="width:33%;">X Factor : '+data.xfactorv3+'</td></tr>   <tr><td style="width:50%;">Test with Customer Card-Ok? : '+data.testwithcc+'</td></tr><tr><td style="width:50%;">Date/Time : '+data.dateandtime+'</td><td style="width:25%;">Transfer Files : '+data.transferfiles+'</td><td style="width:25%;">USB #: '+data.usb+'</td></tr></table><table style="width:100%;"><tr><td>Interior Check : </td></tr><tr><td style="width:33%;">Tests : </td><td style="width:33%;">Heater : '+data.heater+'</td><td style="width:33%;">Light : '+data.light+'</td></tr><tr><td style="width:33%;"></td><td style="width:33%;">UPS : '+data.ups+'</td><td style="width:33%;">Battery : '+data.battery+'</td></tr></table><p style="text-align: left;">Notes : '+data.notes2+'</p><table style="width:100%;"><tr><td style="width:33%;">Clean : </td><td style="width:33%;">Face Plate : '+data.faceplate+'</td><td style="width:33%;">Inside : '+data.inside+'</td></tr><tr><td style="width:33%;">Leaks? : </td><td style="width:33%;">Flow Sensor : '+data.flowsensor+'</td><td style="width:33%;">Backflow : '+data.backflow+'</td></tr><tr><td style="width:33%;"></td><td style="width:33%;">Coupler : '+data.coupler+'</td><td style="width:33%;">Other : '+data.other+'</td></tr></table><p style="text-align: left;">Notes : '+data.notes3+'</p><p style="text-align: left;">Notes : '+data.notes4+'</p><br/><table style="width:100%;"><tr><td style="width:39%;">AquaFlow Employee : '+data.username+'</td><td style="width:30%;">Date : '+data.date+'</td><td style="width:30%;">Time : '+data.time+'</td></tr></table>', 
        //File Name
        fileName: prefix,  
        //File directory
        directory: AppFolder,
	 
      };
      let file = await RNHTMLtoPDF.convert(options); 
      console.log(file.filePath); 
      setFilePath(file.filePath);

     
                realm.write(() => {
                    if (
                        realm.objects('report_details').filtered('file_name =' + '"'+tmpfname+'"')
                          .length > 0
                      ) { 
                        if (data.pic1) {
                            RNFS.copyFile(data.pic1, DirectoryPath+'/'+prefix+'_pic_1.jpg');
    
                        }
                
                        if (data.pic2) {
                            RNFS.copyFile(data.pic2, DirectoryPath+'/'+prefix+'_pic_2.jpg');

                        }
         
                        if (data.pic3) {
                            RNFS.copyFile(data.pic3, DirectoryPath+'/'+prefix+'_pic_3.jpg');

                        }
    
                        if (data.pic4) {
                            RNFS.copyFile(data.pic4, DirectoryPath+'/'+prefix+'_pic_4.jpg');

                        }
                
                        if (data.pic5) {
                            RNFS.copyFile(data.pic5, DirectoryPath+'/'+prefix+'_pic_5.jpg');

                        }
    
                        if (data.pic6) {
                            RNFS.copyFile(data.pic6, DirectoryPath+'/'+prefix+'_pic_6.jpg');

                        }
                
                        if (data.pic7) {
                            RNFS.copyFile(data.pic7, DirectoryPath+'/'+prefix+'_pic_7_V1.jpg');

                        }
    
                        if (data.pic72) {
                            RNFS.copyFile(data.pic72, DirectoryPath+'/'+prefix+'_pic_7_V2.jpg');

                        }
    
                        if (data.pic73) {
                            RNFS.copyFile(data.pic73, DirectoryPath+'/'+prefix+'_pic_7_V3.jpg');

                        }
                        if (data.pic8) {
                            RNFS.copyFile(data.pic8, DirectoryPath+'/'+prefix+'_pic_8.jpg');

                        }
                
                        if (data.pic9) {
                            RNFS.copyFile(data.pic9, DirectoryPath+'/'+prefix+'_pic_9.jpg');

                        }
           
                        if (data.pic10) {
                            RNFS.copyFile(data.pic10, DirectoryPath+'/'+prefix+'_pic_10.jpg');

                        }
             
                        if (data.pic11) {
                            RNFS.copyFile(data.pic11, DirectoryPath+'/'+prefix+'_pic_11.jpg');

                        }
           
                        if (data.pic12) {
                            RNFS.copyFile(data.pic12, DirectoryPath+'/'+prefix+'_pic_12.jpg');

                        }
    
                        if (data.pic13) {
                            RNFS.copyFile(data.pic13, DirectoryPath+'/'+prefix+'_pic_13.jpg');

                        }
    
                        if (data.pic14) {
                            RNFS.copyFile(data.pic14, DirectoryPath+'/'+prefix+'_pic_14.jpg');

                        }
    
                       
                        Toast.show('Report Name Allready Exists and data overwrited...', Toast.SHORT, [
                          'UIAlertController',
                        ]);
            
                      } else { 
                    var ID =
                      realm.objects('report_details').sorted('report_id', true).length > 0
                        ? realm.objects('report_details').sorted('report_id', true)[0]
                          .report_id + 1
                        : 1;
                    realm.create('report_details', {
                      report_id: ID,
                      file_name: tmpfname,
                      file_path: file.filePath,
                      customer: data.customer,
                      office: data.office,
                      site: data.site,
                      date: data.date,
                      date_folder: data.fnamedate,
                      status: 0,
          
          
                    });


                    if (data.pic1) {
                        RNFS.copyFile(data.pic1, DirectoryPath+'/'+prefix+'_pic_1.jpg');
                        realmrf.write(() => {
                            var ID =
                              realmrf.objects('report_file_details').sorted('report_file_id', true).length > 0
                                ? realmrf.objects('report_file_details').sorted('report_file_id', true)[0]
                                  .report_file_id + 1
                                : 1;
                                realmrf.create('report_file_details', {
                              report_file_id: ID,
                              report_name: tmpfname,
                              file_name: prefix+'_pic_1.jpg',
                              file_path: DirectoryPath,
                  
                            });
                        });

                    }
            
                    if (data.pic2) {
                        RNFS.copyFile(data.pic2, DirectoryPath+'/'+prefix+'_pic_2.jpg');
                        realmrf.write(() => {
                            var ID =
                              realmrf.objects('report_file_details').sorted('report_file_id', true).length > 0
                                ? realmrf.objects('report_file_details').sorted('report_file_id', true)[0]
                                  .report_file_id + 1
                                : 1;
                                realmrf.create('report_file_details', {
                              report_file_id: ID,
                              report_name: tmpfname,
                              file_name: prefix+'_pic_2.jpg',
                              file_path: DirectoryPath,
                  
                            });
                        });
                    }
     
                    if (data.pic3) {
                        RNFS.copyFile(data.pic3, DirectoryPath+'/'+prefix+'_pic_3.jpg');
                        realmrf.write(() => {
                            var ID =
                              realmrf.objects('report_file_details').sorted('report_file_id', true).length > 0
                                ? realmrf.objects('report_file_details').sorted('report_file_id', true)[0]
                                  .report_file_id + 1
                                : 1;
                                realmrf.create('report_file_details', {
                              report_file_id: ID,
                              report_name: tmpfname,
                              file_name: prefix+'_pic_3.jpg',
                              file_path: DirectoryPath,
                  
                            });
                        });
                    }

                    if (data.pic4) {
                        RNFS.copyFile(data.pic4, DirectoryPath+'/'+prefix+'_pic_4.jpg');
                        realmrf.write(() => {
                            var ID =
                              realmrf.objects('report_file_details').sorted('report_file_id', true).length > 0
                                ? realmrf.objects('report_file_details').sorted('report_file_id', true)[0]
                                  .report_file_id + 1
                                : 1;
                                realmrf.create('report_file_details', {
                              report_file_id: ID,
                              report_name: tmpfname,
                              file_name: prefix+'_pic_4.jpg',
                              file_path: DirectoryPath,
                  
                            });
                        });
                    }
            
                    if (data.pic5) {
                        RNFS.copyFile(data.pic5, DirectoryPath+'/'+prefix+'_pic_5.jpg');
                        realmrf.write(() => {
                            var ID =
                              realmrf.objects('report_file_details').sorted('report_file_id', true).length > 0
                                ? realmrf.objects('report_file_details').sorted('report_file_id', true)[0]
                                  .report_file_id + 1
                                : 1;
                                realmrf.create('report_file_details', {
                              report_file_id: ID,
                              report_name: tmpfname,
                              file_name: prefix+'_pic_5.jpg',
                              file_path: DirectoryPath,
                  
                            });
                        });
                    }

                    if (data.pic6) {
                        RNFS.copyFile(data.pic6, DirectoryPath+'/'+prefix+'_pic_6.jpg');
                        realmrf.write(() => {
                            var ID =
                              realmrf.objects('report_file_details').sorted('report_file_id', true).length > 0
                                ? realmrf.objects('report_file_details').sorted('report_file_id', true)[0]
                                  .report_file_id + 1
                                : 1;
                                realmrf.create('report_file_details', {
                              report_file_id: ID,
                              report_name: tmpfname,
                              file_name: prefix+'_pic_6.jpg',
                              file_path: DirectoryPath,
                  
                            });
                        });
                    }
            
                    if (data.pic7) {
                        RNFS.copyFile(data.pic7, DirectoryPath+'/'+prefix+'_pic_7_V1.jpg');
                        realmrf.write(() => {
                            var ID =
                              realmrf.objects('report_file_details').sorted('report_file_id', true).length > 0
                                ? realmrf.objects('report_file_details').sorted('report_file_id', true)[0]
                                  .report_file_id + 1
                                : 1;
                                realmrf.create('report_file_details', {
                              report_file_id: ID,
                              report_name: tmpfname,
                              file_name: prefix+'_pic_7_V1.jpg',
                              file_path: DirectoryPath,
                  
                            });
                        });
                    }

                    if (data.pic72) {
                        RNFS.copyFile(data.pic72, DirectoryPath+'/'+prefix+'_pic_7_V2.jpg');
                        realmrf.write(() => {
                            var ID =
                              realmrf.objects('report_file_details').sorted('report_file_id', true).length > 0
                                ? realmrf.objects('report_file_details').sorted('report_file_id', true)[0]
                                  .report_file_id + 1
                                : 1;
                                realmrf.create('report_file_details', {
                              report_file_id: ID,
                              report_name: tmpfname,
                              file_name: prefix+'_pic_7_V2.jpg',
                              file_path: DirectoryPath,
                  
                            });
                        });
                    }

                    if (data.pic73) {
                        RNFS.copyFile(data.pic73, DirectoryPath+'/'+prefix+'_pic_7_V3.jpg');
                        realmrf.write(() => {
                            var ID =
                              realmrf.objects('report_file_details').sorted('report_file_id', true).length > 0
                                ? realmrf.objects('report_file_details').sorted('report_file_id', true)[0]
                                  .report_file_id + 1
                                : 1;
                                realmrf.create('report_file_details', {
                              report_file_id: ID,
                              report_name: tmpfname,
                              file_name: prefix+'_pic_7_V3.jpg',
                              file_path: DirectoryPath,
                  
                            });
                        });
                    }
                    if (data.pic8) {
                        RNFS.copyFile(data.pic8, DirectoryPath+'/'+prefix+'_pic_8.jpg');
                        realmrf.write(() => {
                            var ID =
                              realmrf.objects('report_file_details').sorted('report_file_id', true).length > 0
                                ? realmrf.objects('report_file_details').sorted('report_file_id', true)[0]
                                  .report_file_id + 1
                                : 1;
                                realmrf.create('report_file_details', {
                              report_file_id: ID,
                              report_name: tmpfname,
                              file_name: prefix+'_pic_8.jpg',
                              file_path: DirectoryPath,
                  
                            });
                        });
                    }
            
                    if (data.pic9) {
                        RNFS.copyFile(data.pic9, DirectoryPath+'/'+prefix+'_pic_9.jpg');
                        realmrf.write(() => {
                            var ID =
                              realmrf.objects('report_file_details').sorted('report_file_id', true).length > 0
                                ? realmrf.objects('report_file_details').sorted('report_file_id', true)[0]
                                  .report_file_id + 1
                                : 1;
                                realmrf.create('report_file_details', {
                              report_file_id: ID,
                              report_name: tmpfname,
                              file_name: prefix+'_pic_9.jpg',
                              file_path: DirectoryPath,
                  
                            });
                        });
                    }
       
                    if (data.pic10) {
                        RNFS.copyFile(data.pic10, DirectoryPath+'/'+prefix+'_pic_10.jpg');
                        realmrf.write(() => {
                            var ID =
                              realmrf.objects('report_file_details').sorted('report_file_id', true).length > 0
                                ? realmrf.objects('report_file_details').sorted('report_file_id', true)[0]
                                  .report_file_id + 1
                                : 1;
                                realmrf.create('report_file_details', {
                              report_file_id: ID,
                              report_name: tmpfname,
                              file_name: prefix+'_pic_10.jpg',
                              file_path: DirectoryPath,
                  
                            });
                        });
                    }
         
                    if (data.pic11) {
                        RNFS.copyFile(data.pic11, DirectoryPath+'/'+prefix+'_pic_11.jpg');
                        realmrf.write(() => {
                            var ID =
                              realmrf.objects('report_file_details').sorted('report_file_id', true).length > 0
                                ? realmrf.objects('report_file_details').sorted('report_file_id', true)[0]
                                  .report_file_id + 1
                                : 1;
                                realmrf.create('report_file_details', {
                              report_file_id: ID,
                              report_name: tmpfname,
                              file_name: prefix+'_pic_11.jpg',
                              file_path: DirectoryPath,
                  
                            });
                        });
                    }
       
                    if (data.pic12) {
                        RNFS.copyFile(data.pic12, DirectoryPath+'/'+prefix+'_pic_12.jpg');
                        realmrf.write(() => {
                            var ID =
                              realmrf.objects('report_file_details').sorted('report_file_id', true).length > 0
                                ? realmrf.objects('report_file_details').sorted('report_file_id', true)[0]
                                  .report_file_id + 1
                                : 1;
                                realmrf.create('report_file_details', {
                              report_file_id: ID,
                              report_name: tmpfname,
                              file_name: prefix+'_pic_12.jpg',
                              file_path: DirectoryPath,
                  
                            });
                        });
                    }

                    if (data.pic13) {
                        RNFS.copyFile(data.pic13, DirectoryPath+'/'+prefix+'_pic_13.jpg');
                        realmrf.write(() => {
                            var ID =
                              realmrf.objects('report_file_details').sorted('report_file_id', true).length > 0
                                ? realmrf.objects('report_file_details').sorted('report_file_id', true)[0]
                                  .report_file_id + 1
                                : 1;
                                realmrf.create('report_file_details', {
                              report_file_id: ID,
                              report_name: tmpfname,
                              file_name: prefix+'_pic_13.jpg',
                              file_path: DirectoryPath,
                  
                            });
                        });
                    }

                    if (data.pic14) {
                        RNFS.copyFile(data.pic14, DirectoryPath+'/'+prefix+'_pic_14.jpg');
                        realmrf.write(() => {
                            var ID =
                              realmrf.objects('report_file_details').sorted('report_file_id', true).length > 0
                                ? realmrf.objects('report_file_details').sorted('report_file_id', true)[0]
                                  .report_file_id + 1
                                : 1;
                                realmrf.create('report_file_details', {
                              report_file_id: ID,
                              report_name: tmpfname,
                              file_name: prefix+'_pic_14.jpg',
                              file_path: DirectoryPath,
                  
                            });
                        });

                    }

                } 

          
    
                  });

                setData({

                    ...data,
                    customer: '',
                    office: '',
                    site: '',
                    date: '',
                    fnamedate: '',
                    time: '',
                    veh: '',
                    mileage: '',
                    gcondition: '',
                    gatelock: '',
                    fenceneedrepair: '',
                    notes1: '',
                    notes2: '',
                    notes3: '',
                    notes4: '',
                    software: '',
                    deployment: '',
                    rate: '',
                    namev1:'',
                    namev2:'',
                    namev3:'',
                    kfactor: '',
                    kfactorv2: '',
                    kfactorv3: '',
                    xfactor: '',
                    xfactorv2: '',
                    xfactorv3: '',
                    dateandtime: '',
                    testwithcc: '',
                    runningwater: '',
                    transferfiles: '',
                    usb: '',
                    heater: '',
                    light: '',
                    ups: '',
                    battery: '',
                    faceplate: '',
                    inside: '',
                    flowsensor: '',
                    backflow: '',
                    coupler: '',
                    other: '',
                    pic1: null,
                    pic1uri: null,
                    pic1height: 0,
                    pic1width: 0,
                    pic2: null,
                    pic2uri: null,
                    pic2height: 0,
                    pic2width: 0,
                    pic3: null,
                    pic3uri: null,
                    pic3height: 0,
                    pic3width: 0,
                    pic4: null,
                    pic4uri: null,
                    pic4height: 0,
                    pic4width: 0,
                    pic5: null,
                    pic5uri: null,
                    pic5height: 0,
                    pic5width: 0,
                    pic6: null,
                    pic6uri: null,
                    pic6height: 0,
                    pic6width: 0,
                    pic7: null,
                    pic7uri: null,
                    pic7height: 0,
                    pic7width: 0,
                    pic72: null,
                    pic72uri: null,
                    pic72height: 0,
                    pic72width: 0,
                    pic73: null,
                    pic73uri: null,
                    pic73height: 0,
                    pic73width: 0,
                    pic8: null,
                    pic8uri: null,
                    pic8height: 0,
                    pic8width: 0,
                    pic9: null,
                    pic9uri: null,
                    pic9height: 0,
                    pic9width: 0,
                    pic10: null,
                    pic10uri: null,
                    pic10height: 0,
                    pic10width: 0,
                    pic11: null,
                    pic11uri: null,
                    pic11height: 0,
                    pic11width: 0,
                    pic12: null,
                    pic12uri: null,
                    pic12height: 0,
                    pic12width: 0,
                    pic13: null,
                    pic13uri: null,
                    pic13height: 0,
                    pic13width: 0,
                    pic14: null,
                    pic14uri: null,
                    pic14height: 0,
                    pic14width: 0,
                    isLoading: false,
                    isNeedRepair: false,
                    resourcePath: {},

                });
                Toast.show('PDF File Created Successfuly...', Toast.SHORT, [
                    'UIAlertController',
                ]); 
 }, 1000);
               // console.log('PDF created at: ' + path);
                // Do stuff with your shiny new PDF! 
         
        // const file = await createPDF(data);
        // const pdfSource = {
        //   uri: file.filePath
        // };
        // console.log(file);
    }
 const createPDF = async () => {
 
		
		   
        const DirectoryPath= RNFS.ExternalStorageDirectoryPath;
		
      let options = {
        //Content to print
        html:
          '<p style="text-align: center;"><strong>Team About React</strong></p><p style="text-align: left;">Here is an example of pdf Print in React Native</p>',
        //File Name
        fileName: 'test',
        //File directory
        directory: 'Aquaflow',
      };
      let file = await RNHTMLtoPDF.convert(options);
      console.log(file.filePath);
      setFilePath(file.filePath);
    
  };
    const submitHandle2 = async (data) => {

     
        const    AppFolder    =     'Aquaflow/Maintenance/'+data.customer+'/'+data.office+'/'+data.site+'/'+data.fnamedate;
        const DirectoryPath= RNFS.ExternalStorageDirectoryPath+'/'+ AppFolder;
     //   setimgPath(DirectoryPath);
     //   const DirectoryPath= RNFS.DocumentDirectoryPath +'/'+ AppFolder;
        RNFS.exists(DirectoryPath).then((result) => {
            console.log('GOT RESULT', result); 
            if(result==false){
                RNFS.mkdir(DirectoryPath);
            }
          });



        /////// create file name from variables and date //////
        console.log(data);
        var tmpfname = data.customer + '-' + data.office + '-' + data.site + '-' + data.fnamedate + '.pdf';
        var prefix= data.customer + '-' + data.office + '-' + data.site + '-' + data.fnamedate;
        const filepathname =DirectoryPath+'/'+tmpfname;
        // RNFS.exists(filepathname).then((result) => {
        //     console.log('GOT RESULT', result); 
        //     if(result==true){
        //        console.log(tmpfname);
        //       var filenm=tmpfname.split('.')[0];
        //       var fileex=tmpfname.split('.')[1];


        //       var counter = 'new';
        //       var newpath = DirectoryPath+'/'+filenm+'_'+counter+'.'+fileex;
        //       prefix= data.customer + '-' + data.office + '-' + data.site + '-' + data.fnamedate+'_'+counter;
        //       tmpfname= filenm+'_'+counter+'.'+fileex;

        //     }
           
         
        //   });
   
          console.log('sss',tmpfname);
        setData({
            ...data,
            isLoading: true,

        });


        

        ////////// validations for form fields and images  /////

        if (data.customer.length == 0 || data.office.length == 0 || data.site.length == 0) {
            Alert.alert('Wrong Input!', 'Customer or Office or Site field cannot be empty.', [
                { text: 'Okay' }
            ]);
            setData({
                ...data,
                isLoading: false,

            });
            return;
        }

  
            if (data.pic15uri == null || data.pic16uri == null) {
                Alert.alert('Wrong Input!', ' Pic 15 and 16 cannot be empty.', [
                    { text: 'Okay' }
                ]);
                setData({
                    ...data,
                    isLoading: false,

                });
                return;
            }
			
			setTimeout(async function(){
			      let options = {
        //Content to print
        html:
          '<p style="text-align: center;font-size:20px;"><strong>AquaFlow Int’l, Inc.</strong></p><p style="text-align: center;"><strong>'+data.formName+'</strong></p><div style="break-after:always"></div><p style="text-align: left;">Customer : '+data.customer+'</p><p style="text-align: left;">Office : '+data.office+'</p><p style="text-align: left;">Site : '+data.site+'</p><p style="text-align: left;float:left;">Date : '+data.date+'</p><p style="text-align: left;float:left;margin-left:10%;">Time : '+data.time+'</p><p style="text-align: left;float:left;margin-left:10%;">Veh : '+data.veh+'</p><p style="text-align: left;float:left;margin-left:10%;">Mileage : '+data.mileage+'</p><br/><br/><p style="text-align: left;">General Condition : '+data.gcondition+'</p><br/><p style="text-align: left;">Software Version : '+data.software+'</p><p style="text-align: left;">Check Date/Time : '+data.checkdate+'</p><p style="text-align: left;">Get Logs : '+data.getlog+'</p><p style="text-align: left;">Check With Staff for issues : '+data.cwsfi+'</p><br/><p style="text-align: left;float:left;">AquaFlow Employee : '+data.username+'</p><p style="text-align: left;float:left;margin-left:10%;">Date : '+data.date+'</p><p style="text-align: left;float:left;margin-left:10%;">Time : '+data.time+'</p>',
        //File Name
        fileName: prefix,  
        //File directory
        directory: AppFolder,
      };
      let file = await RNHTMLtoPDF.convert(options);
      console.log(file.filePath); 
      setFilePath(file.filePath);

          
                realm.write(() => {

                    if (
                        realm.objects('report_details').filtered('file_name =' + '"'+tmpfname+'"')
                          .length > 0
                      ) { 
                        if (data.pic15) {
                            RNFS.copyFile(data.pic15, DirectoryPath+'/'+prefix+'_pic_of_office.jpg');
                        }
    
                        if (data.pic16) {
                            RNFS.copyFile(data.pic16, DirectoryPath+'/'+prefix+'_pic_of_office_encoder.jpg');
    
                        }
                       
                        Toast.show('Report Name Allready Exists and data overwrited...', Toast.SHORT, [
                          'UIAlertController',
                        ]);
            
                      } else {
                        
                   
                    var ID =
                      realm.objects('report_details').sorted('report_id', true).length > 0
                        ? realm.objects('report_details').sorted('report_id', true)[0]
                          .report_id + 1
                        : 1;
                    realm.create('report_details', {
                      report_id: ID,
                      file_name: tmpfname,
                      file_path: file.filePath,
                      customer: data.customer,
                      office: data.office,
                      site: data.site,
                      date: data.date,
                      date_folder: data.fnamedate,
                      status: 0,
          
          
                    });


                    if (data.pic15) {
                        RNFS.copyFile(data.pic15, DirectoryPath+'/'+prefix+'_pic_of_office.jpg');
                        realmrf.write(() => {
                            var ID =
                              realmrf.objects('report_file_details').sorted('report_file_id', true).length > 0
                                ? realmrf.objects('report_file_details').sorted('report_file_id', true)[0]
                                  .report_file_id + 1
                                : 1;
                                realmrf.create('report_file_details', {
                              report_file_id: ID,
                              report_name: tmpfname,
                              file_name: prefix+'_pic_of_office.jpg',
                              file_path: DirectoryPath,
                  
                            });
                        });
                    }

                    if (data.pic16) {
                        RNFS.copyFile(data.pic16, DirectoryPath+'/'+prefix+'_pic_of_office_encoder.jpg');
                        realmrf.write(() => {
                            var ID =
                              realmrf.objects('report_file_details').sorted('report_file_id', true).length > 0
                                ? realmrf.objects('report_file_details').sorted('report_file_id', true)[0]
                                  .report_file_id + 1
                                : 1;
                                realmrf.create('report_file_details', {
                              report_file_id: ID,
                              report_name: tmpfname,
                              file_name: prefix+'_pic_of_office_encoder.jpg',
                              file_path: DirectoryPath,
                  
                            });
                        });

                    }

                }

          
    
                  });

                setData({

                    ...data,
                    customer: '',
                    office: '',
                    site: '',
                    date: '',
                    fnamedate: '',
                    time: '',
                    veh: '',
                    mileage: '',
                    gcondition: '',
                    gatelock: '',
                    fenceneedrepair: '',
                    notes1: '',
                    notes2: '',
                    notes3: '',
                    notes4: '',
                    software: '',
                    deployment: '',
                    rate: '',
                    kfactor: '',
                    xfactor: '',
                    dateandtime: '',
                    testwithcc: '',
                    runningwater: '',
                    transferfiles: '',
                    usb: '',
                    heater: '',
                    light: '',
                    ups: '',
                    battery: '',
                    faceplate: '',
                    inside: '',
                    flowsensor: '',
                    backflow: '',
                    coupler: '',
                    other: '',
                    pic15: null,
                    pic15uri: null,
                    pic15height: 0,
                    pic15width: 0,
                    pic16: null,
                    pic16uri: null,
                    pic16height: 0,
                    pic16width: 0,
                    isSite:true,
                    isLoading: false,
                    isNeedRepair: false,
                    resourcePath: {},

                });
                Toast.show('PDF File Created Successfuly...', Toast.SHORT, [
                    'UIAlertController',
                ]);
   }, 1000);
             //   console.log('PDF created at: ' + path);
                // Do stuff with your shiny new PDF! 
            
 
    }

    if (data.isLoading) {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.container}>
                    <Spinner
                        //visibility of Overlay Loading Spinner
                        visible={data.isLoading}
                        //Text with the Spinner
                        textContent={'Saving...'}
                        //Text style of the Spinner Text
                        textStyle={styles.spinnerTextStyle}
                    />


                </View>
            </SafeAreaView>
        );
    }
    if (data.isSite) {
    return (
        <View style={styles.container}>
            <StatusBar backgroundColor='#1c4468' barStyle="light-content" />
            { usrType == 'USER' ?
                <View style={styles.header}>
                    <Icon.Button name="ios-menu" size={25} backgroundColor="#1c4468" color="#fff" onPress={() => {
                        navigation.openDrawer();
                    }} ></Icon.Button>

                    <Text style={styles.text_header}>Maintenance Form</Text>
                </View>
                :
                <View></View>
            }

            <Animatable.View
                animation="fadeInUpBig"
                style={styles.footer}
            >
                <ScrollView>

                    <View style={styles.ddcontainer}>
                        <View style={styles.dditemcustom}>
                            <Text>Customer Name</Text>
                            <DropDownPicker
                                items={customerList}

                                containerStyle={{ height: 40 }}
                                onChangeItem={item => textInputCustomer(item.value)}
                            />
                        </View>

                    </View>
                    <View style={styles.ddcontainer}>
                        <View style={styles.dditemcustom}>
                            <Text>Office Name</Text>
                            <DropDownPicker
                                items={data.customerOfficeList}

                                containerStyle={{ height: 40 }}
                                onChangeItem={item => textInputOffice(item.value)}
                            />
                        </View>

                    </View>
                    <View style={styles.ddcontainer}>
                        <View style={styles.dditemcustom}>
                            <Text>Site Name</Text>
                            <DropDownPicker
                                items={data.officeSiteList}

                                containerStyle={{ height: 40 }}
                                onChangeItem={(item) => {
                                    textInputSite(item.value)

                                }}
                            />
                        </View>

                    </View>


                    <View style={styles.action}>
                        <TextInput
                            label="Date"
                            style={styles.textInput}
                            underlineColorAndroid="transparent"
                            autoCapitalize="none"
                            theme={{ colors: { primary: '#1c4468' } }}
                            value={data.date}
                            disabled={true}
                        />


                        <TextInput
                            label="Time"
                            style={styles.textInput}
                            underlineColorAndroid="transparent"
                            autoCapitalize="none"
                            theme={{ colors: { primary: '#1c4468' } }}
                            value={data.time}

                            disabled={true}
                        />

                    </View>

                    <View style={styles.action}>
                        <TextInput
                            label="Veh"
                            style={styles.textInput}
                            underlineColorAndroid="transparent"
                            autoCapitalize="none"
                            theme={{ colors: { primary: '#1c4468' } }}
                            onChangeText={(val) => textInputVeh(val)}
                        />
                        <TextInput
                            label="Mileage"
                            style={styles.textInput}
                            underlineColorAndroid="transparent"
                            keyboardType='numeric'
                            autoCapitalize="none"
                            theme={{ colors: { primary: '#1c4468' } }}
                            onChangeText={(val) => textInputMileage(val)}
                        />

                    </View>
                    <View>
                        <TextInput
                            multiline={false}
                            numberOfLines={1}
                            label="General Condition"
                            style={styles.textInput}
                            underlineColorAndroid="transparent"
                            autoCapitalize="none"
                            theme={{ colors: { primary: '#1c4468' } }}
                            onChangeText={(val) => textInputGcondition(val)}
                        />
                    </View>
                    <Text style={[styles.text_footer, {
                        color: "#1c4468",
                        marginTop: 15,
                        marginBottom: 15,
                    }]}>Pic of 4 Sides</Text>

                    <View style={{ width: width * 0.9, display: "flex", flexDirection: "row", flexWrap: "wrap", alignContent: "center", alignItems: "center", justifyContent: "center" }}>
                        <TouchableOpacity onPress={() => selectFile('one')} style={{ width: "22%", height: 40, marginLeft: 5, alignContent: "center", alignItems: "center", justifyContent: "center" }} >
                            {data.pic1uri != null ?

                                <Image source={{ uri: data.pic1uri }} style={{ width: "100%", height: 80, marginLeft: 5 }} />

                                : <Image source={require('../assets/logo.png')} style={{ width: "100%", height: 80, marginLeft: 5 }} />

                            }

                            <Text style={styles.buttonText}> Pic 1</Text>

                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => selectFile('two')} style={{ width: "22%", height: 40, marginLeft: 5, alignContent: "center", alignItems: "center", justifyContent: "center" }} >


                            {data.pic2uri != null ?

                                <Image source={{ uri: data.pic2uri }} style={{ width: "100%", height: 80, marginLeft: 5 }} />

                                : <Image source={require('../assets/logo.png')} style={{ width: "100%", height: 80, marginLeft: 5 }} />

                            }

                            <Text style={styles.buttonText}> Pic 2</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => selectFile('three')} style={{ width: "22%", height: 80, marginLeft: 5, alignContent: "center", alignItems: "center", justifyContent: "center" }} >
                            {data.pic3uri != null ?

                                <Image source={{ uri: data.pic3uri }} style={{ width: "100%", height: 80, marginLeft: 5 }} />

                                : <Image source={require('../assets/logo.png')} style={{ width: "100%", height: 80, marginLeft: 5 }} />

                            }

                            <Text style={styles.buttonText}> Pic 3</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => selectFile('four')} style={{ width: "22%", height: 80, marginLeft: 5, alignContent: "center", alignItems: "center", justifyContent: "center" }} >
                            {data.pic4uri != null ?

                                <Image source={{ uri: data.pic4uri }} style={{ width: "100%", height: 80, marginLeft: 5 }} />

                                : <Image source={require('../assets/logo.png')} style={{ width: "100%", height: 80, marginLeft: 5 }} />

                            }
                            <Text style={styles.buttonText}> Pic 4</Text>
                        </TouchableOpacity>

                    </View>
                    <View style={styles.ddcontainer}>
                        <View style={styles.dditem}>
                            <Text>Fence Gate Lock?</Text>
                            <DropDownPicker
                                items={[
                                    { label: 'YES', value: 'YES' },
                                    { label: 'NO', value: 'NO' },
                                ]}

                                containerStyle={{ height: 40 }}
                                onChangeItem={item => textInputGateLock(item.value)}
                            />
                        </View>
                        <View style={styles.dditem}>
                            <Text>Fence Need Repair?</Text>
                            <DropDownPicker
                                items={[
                                    { label: 'YES', value: 'YES' },
                                    { label: 'NO', value: 'NO' },
                                ]}

                                containerStyle={{ height: 40 }}
                                onChangeItem={item => textInputNeedRepair(item.value)}
                            />

                        </View>
                    </View>
                    {data.isNeedRepair ?
                        <View style={{ width: width * 0.9, display: "flex", flexDirection: "row", flexWrap: "wrap", alignContent: "center", alignItems: "center", justifyContent: "center" }}>
                            <TouchableOpacity onPress={() => selectFile('five')} style={{ width: "22%", height: 40, marginLeft: 5, alignContent: "center", alignItems: "center", justifyContent: "center" }} >
                                {data.pic5uri != null ?

                                    <Image source={{ uri: data.pic5uri }} style={{ width: "100%", height: 80, marginLeft: 5 }} />

                                    : <Image source={require('../assets/logo.png')} style={{ width: "100%", height: 80, marginLeft: 5 }} />

                                }

                                <Text style={styles.buttonText}> Pic 5</Text>

                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => selectFile('six')} style={{ width: "22%", height: 40, marginLeft: 5, alignContent: "center", alignItems: "center", justifyContent: "center" }} >


                                {data.pic6uri != null ?

                                    <Image source={{ uri: data.pic6uri }} style={{ width: "100%", height: 80, marginLeft: 5 }} />

                                    : <Image source={require('../assets/logo.png')} style={{ width: "100%", height: 80, marginLeft: 5 }} />

                                }

                                <Text style={styles.buttonText}> Pic 6</Text>
                            </TouchableOpacity>


                        </View>
                        :
                        <Text></Text>
                    }
                    <View style={{ paddingTop: 50 }}>
                        <TextInput
                            multiline={false}
                            numberOfLines={1}
                            label="Notes"
                            style={styles.textInput}
                            underlineColorAndroid="transparent"
                            autoCapitalize="none"
                            theme={{ colors: { primary: '#1c4468' } }}
                            onChangeText={(val) => textInputNotes1(val)}
                        />
                    </View>
                    <Text style={[styles.text_footer, {
                        color: "#1c4468",
                        marginTop: 15,
                        marginBottom: 15,
                    }]}>Data Check</Text>

                    <View style={styles.action}>

                    <TextInput
                        label="Software Version"
                        style={styles.textInput}
                        underlineColorAndroid="transparent"
                        autoCapitalize="none"
                        keyboardType='numeric'
                        theme={{ colors: { primary: '#1c4468' } }}
                        onChangeText={(val) => textInputSoftware(val)}

                    />
                    </View>

                    <View style={styles.action}>

                        <TextInput
                            label="Deployment"
                            style={styles.textInput}
                            underlineColorAndroid="transparent"
                            autoCapitalize="none"
                            keyboardType='numeric'
                            theme={{ colors: { primary: '#1c4468' } }}
                            onChangeText={(val) => textInputDeployment(val)}

                        />
                    </View>


                    <View style={styles.action}>
                        <TextInput
                            label="Rate"
                            style={styles.textInput}
                            underlineColorAndroid="transparent"
                            autoCapitalize="none"
                            keyboardType='numeric'
                            theme={{ colors: { primary: '#1c4468' } }}
                            onChangeText={(val) => textInputRate(val)}

                        />
                    </View>
                    <View style={styles.action}>
                    <Text style={[styles.text_footer, {
                        color: "#1c4468",
                        marginTop: 15,
                        marginBottom: 15,
                        marginLeft:20,
                        width: '30%',
                    }]}>V1 </Text>
                                        <Text style={[styles.text_footer, {
                        color: "#1c4468",
                        marginTop: 15,
                        marginBottom: 15,
                        marginLeft:20,
                        width: '30%',
                    }]}>V2</Text>
                                        <Text style={[styles.text_footer, {
                        color: "#1c4468",
                        marginTop: 15,
                        marginBottom: 15,
                        marginLeft:20,
                        width: '30%',
                    }]}>V3</Text>
                    </View>
                    <View style={styles.action}>
                  
                  <TextInput
                      label="Name"
                      style={styles.textInput}
                      underlineColorAndroid="transparent"
                      autoCapitalize="none"
                      theme={{ colors: { primary: '#1c4468' } }}
                      onChangeText={(val) => textInputNameV1(val)}
                  />

          
             
                  <TextInput
                      label="Name"
                      style={styles.textInput}
                      underlineColorAndroid="transparent"
                      autoCapitalize="none"
                      theme={{ colors: { primary: '#1c4468' } }}
                      onChangeText={(val) => textInputNameV2(val)}
                  />

      
                  <TextInput
                      label="Name"
                      style={styles.textInput}
                      underlineColorAndroid="transparent"
                      autoCapitalize="none"
                      theme={{ colors: { primary: '#1c4468' } }}
                      onChangeText={(val) => textInputNameV3(val)}
                  />

              </View>
                    
                    <View style={styles.action}>
                  
                        <TextInput
                            label="K Factor"
                            style={styles.textInput}
                            underlineColorAndroid="transparent"
                            autoCapitalize="none"
                            keyboardType='numeric'
                            theme={{ colors: { primary: '#1c4468' } }}
                            onChangeText={(val) => textInputKfactor(val)}
                        />

                
                   
                        <TextInput
                            label="K Factor"
                            style={styles.textInput}
                            underlineColorAndroid="transparent"
                            autoCapitalize="none"
                            keyboardType='numeric'
                            theme={{ colors: { primary: '#1c4468' } }}
                            onChangeText={(val) => textInputKfactorV2(val)}
                        />

            
                        <TextInput
                            label="K Factor"
                            style={styles.textInput}
                            underlineColorAndroid="transparent"
                            autoCapitalize="none"
                            keyboardType='numeric'
                            theme={{ colors: { primary: '#1c4468' } }}
                            onChangeText={(val) => textInputKfactorV3(val)}
                        />

                    </View>
                    <View style={styles.action}>
                  
                        <TextInput
                            label="X Factor"
                            style={styles.textInput}
                            underlineColorAndroid="transparent"
                            autoCapitalize="none"
                            keyboardType='numeric'
                            theme={{ colors: { primary: '#1c4468' } }}
                            onChangeText={(val) => textInputXfactor(val)}
                        />

                
                   
                        <TextInput
                            label="X Factor"
                            style={styles.textInput}
                            underlineColorAndroid="transparent"
                            autoCapitalize="none"
                            keyboardType='numeric'
                            theme={{ colors: { primary: '#1c4468' } }}
                            onChangeText={(val) => textInputXfactorV2(val)}
                        />

            
                        <TextInput
                            label="X Factor"
                            style={styles.textInput}
                            underlineColorAndroid="transparent"
                            autoCapitalize="none"
                            keyboardType='numeric'
                            theme={{ colors: { primary: '#1c4468' } }}
                            onChangeText={(val) => textInputXfactorV3(val)}
                        />

                    </View>



                    {/* <View style={styles.action}>
                        <TextInput
                            label="Pic 7 Running Water :"
                            style={styles.textInput}
                            underlineColorAndroid="transparent"
                            autoCapitalize="none"
                            theme={{ colors: { primary: '#1c4468' } }}
                            onChangeText={(val) => textInputRunningWater(val)}
                        />
                    </View> */}
                    <View style={{ width: '100%', display: "flex", flexDirection: "row", flexWrap: "wrap", alignContent: "center", alignItems: "center", justifyContent: "center", paddingTop: 45, paddingBottom: 35 }}>
                        <TouchableOpacity onPress={() => selectFile('seven')} style={{ width: "22%", height: 80, marginLeft: -25, alignContent: "center", alignItems: "center", justifyContent: "center" }} >
                            {data.pic7uri != null ?

                                <Image source={{ uri: data.pic7uri }} style={{ width: "100%", height: 80, marginLeft: 5 }} />

                                : <Image source={require('../assets/logo.png')} style={{ width: "100%", height: 80, marginLeft: 5 }} />

                            }

                            <Text style={styles.buttonText}>Pic 7 V1 Running Water.</Text>

                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => selectFile('seven2')} style={{ width: "22%", height: 40, marginLeft: 35, alignContent: "center", alignItems: "center", justifyContent: "center" }} >
                            {data.pic72uri != null ?

                                <Image source={{ uri: data.pic72uri }} style={{ width: "100%", height: 80, marginLeft: 5 }} />

                                : <Image source={require('../assets/logo.png')} style={{ width: "100%", height: 80, marginLeft: 5 }} />

                            }

                            <Text style={styles.buttonText}>V2 Running Water.</Text>

                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => selectFile('seven3')} style={{ width: "22%", height: 40, marginLeft: 35, alignContent: "center", alignItems: "center", justifyContent: "center" }} >
                            {data.pic73uri != null ?

                                <Image source={{ uri: data.pic73uri }} style={{ width: "100%", height: 80, marginLeft: 5 }} />

                                : <Image source={require('../assets/logo.png')} style={{ width: "100%", height: 80, marginLeft: 5 }} />

                            }

                            <Text style={styles.buttonText}>V3 Running Water.</Text>

                        </TouchableOpacity>

                    </View>
                    <View style={styles.action}>
                        <TextInput
                            label="Date & Time"
                            style={styles.textInput}
                            underlineColorAndroid="transparent"
                            autoCapitalize="none"
                            theme={{ colors: { primary: '#1c4468' } }}
                            value={data.dateandtime}
                            disabled={true}
                        />

                    </View>

                    <View style={styles.action}>
                        <TextInput
                            label="Test With Customer Card-Ok?"
                            style={styles.textInput}
                            underlineColorAndroid="transparent"
                            autoCapitalize="none"
                            theme={{ colors: { primary: '#1c4468' } }}
                            onChangeText={(val) => textInputTestWithC(val)}
                        />
                    </View>
                    <View style={styles.action}>
                        <TextInput
                            label="Transfer Files"
                            style={styles.textInput}
                            underlineColorAndroid="transparent"
                            autoCapitalize="none"
                            theme={{ colors: { primary: '#1c4468' } }}
                            onChangeText={(val) => textInputTransferFiles(val)}
                        />
                        <TextInput
                            label="USB #"
                            style={styles.textInput}
                            underlineColorAndroid="transparent"
                            autoCapitalize="none"
                            theme={{ colors: { primary: '#1c4468' } }}
                            onChangeText={(val) => textInputUsb(val)}
                        />

                    </View>
                    <View>
                        <Text>This Will be Transferred to Phone via USB Cable.</Text>
                    </View>
                    <Text style={[styles.text_footer, {
                        color: "#1c4468",
                        marginTop: 15,
                        marginBottom: 15,
                    }]}>Interior Check</Text>
                    <Text style={[styles.text_footer, {
                        color: "#1c4468",
                        marginTop: 15,
                        marginBottom: 15,
                    }]}>Test</Text>
                    <View style={styles.ddcontainer}>
                        <View style={styles.dditem}>
                            <Text>Heater</Text>
                            <DropDownPicker
                                items={[
                                    { label: 'YES', value: 'YES' },
                                    { label: 'NO', value: 'NO' },
                                ]}
                                defaultValue="NO"
                                containerStyle={{ height: 40 }}
                                onChangeItem={item => textInputHeater(item.value)}
                            />
                        </View>
                        <View style={styles.dditem}>
                            <Text>Light</Text>
                            <DropDownPicker
                                items={[
                                    { label: 'YES', value: 'YES' },
                                    { label: 'NO', value: 'NO' },
                                ]}
                                defaultValue="NO"
                                containerStyle={{ height: 40 }}
                                onChangeItem={item => textInputLight(item.value)}
                            />

                        </View>
                    </View>
                    <View style={styles.ddcontainer}>
                        <View style={styles.dditem}>
                            <Text>UPS</Text>
                            <DropDownPicker
                                items={[
                                    { label: 'YES', value: 'YES' },
                                    { label: 'NO', value: 'NO' },
                                ]}
                                defaultValue="NO"
                                containerStyle={{ height: 40 }}
                                onChangeItem={item => textInputUps(item.value)}
                            />
                        </View>
                        <View style={styles.dditem}>
                            <Text>Battery</Text>
                            <DropDownPicker
                                items={[
                                    { label: 'YES', value: 'YES' },
                                    { label: 'NO', value: 'NO' },
                                ]}
                                defaultValue="NO"
                                containerStyle={{ height: 40 }}
                                onChangeItem={item => textInputBattery(item.value)}
                            />

                        </View>
                    </View>
          
                    <View style={styles.action}>
                        <TextInput
                            label="Notes"
                            style={styles.textInput}
                            underlineColorAndroid="transparent"
                            autoCapitalize="none"
                            theme={{ colors: { primary: '#1c4468' } }}
                            onChangeText={(val) => textInputNotes2(val)}

                        />
                    </View>
                    <Text style={[styles.text_footer, {
                        color: "#1c4468",
                        marginTop: 15,
                        marginBottom: 15,
                    }]}>Clean</Text>


                    <View style={styles.ddcontainer}>
                        <View style={styles.dditem}>
                            <Text>Faceplate</Text>
                            <DropDownPicker
                                items={[
                                    { label: 'YES', value: 'YES' },
                                    { label: 'NO', value: 'NO' },
                                ]}
                                defaultValue="NO"
                                containerStyle={{ height: 40 }}
                                onChangeItem={item => textInputFaceplate(item.value)}
                            />
                        </View>
                        <View style={styles.dditem}>
                            <Text>Inside</Text>
                            <DropDownPicker
                                items={[
                                    { label: 'YES', value: 'YES' },
                                    { label: 'NO', value: 'NO' },
                                ]}
                                defaultValue="NO"
                                containerStyle={{ height: 40 }}
                                onChangeItem={item => textInputInside(item.value)}
                            />

                        </View>
                    </View>

                    <Text style={[styles.text_footer, {
                        color: "#1c4468",
                        marginTop: 15,
                        marginBottom: 15,
                    }]}>Leaks?</Text>
                    <View style={styles.ddcontainer}>
                        <View style={styles.dditem}>
                            <Text>Flow Sensor</Text>
                            <DropDownPicker
                                items={[
                                    { label: 'YES', value: 'YES' },
                                    { label: 'NO', value: 'NO' },
                                ]}
                                defaultValue="YES"
                                containerStyle={{ height: 40 }}
                                onChangeItem={item => textInputFlowsensor(item.value)}
                            />
                        </View>
                        <View style={styles.dditem}>
                            <Text>Backflow</Text>
                            <DropDownPicker
                                items={[
                                    { label: 'YES', value: 'YES' },
                                    { label: 'NO', value: 'NO' },
                                ]}
                                defaultValue="YES"
                                containerStyle={{ height: 40 }}
                                onChangeItem={item => textInputBackflow(item.value)}
                            />

                        </View>
                    </View>
                    <View style={styles.ddcontainer}>
                        <View style={styles.dditem}>
                            <Text>Coupler</Text>
                            <DropDownPicker
                                items={[
                                    { label: 'YES', value: 'YES' },
                                    { label: 'NO', value: 'NO' },
                                ]}
                                defaultValue="YES"
                                containerStyle={{ height: 40 }}
                                onChangeItem={item => textInputCoupler(item.value)}
                            />
                        </View>
                        <View style={styles.dditem}>
                            <Text>Other</Text>
                            <DropDownPicker
                                items={[
                                    { label: 'YES', value: 'YES' },
                                    { label: 'NO', value: 'NO' },
                                ]}
                                defaultValue="YES"
                                containerStyle={{ height: 40 }}
                                onChangeItem={item => textInputOther(item.value)}
                            />

                        </View>
                    </View>
                  
                    <View style={styles.action}>
                        <TextInput
                            label="Notes"
                            style={styles.textInput}
                            underlineColorAndroid="transparent"
                            autoCapitalize="none"
                            theme={{ colors: { primary: '#1c4468' } }}
                            onChangeText={(val) => textInputNotes3(val)}

                        />
                    </View>
                    <Text style={[styles.text_footer, {
                        color: "#1c4468",
                        marginTop: 15,
                        marginBottom: 15,
                    }]}>Pics</Text>

                    <View style={{ width: width * 0.9, display: "flex", flexDirection: "row", flexWrap: "wrap", alignContent: "center", alignItems: "center", justifyContent: "center" }}>
                        <TouchableOpacity onPress={() => selectFile('eight')} style={{ width: "22%", height: 40, marginLeft: 5, alignContent: "center", alignItems: "center", justifyContent: "center" }} >
                            {data.pic8uri != null ?

                                <Image source={{ uri: data.pic8uri }} style={{ width: "100%", height: 80, marginLeft: 5 }} />

                                : <Image source={require('../assets/logo.png')} style={{ width: "100%", height: 80, marginLeft: 5 }} />

                            }

                            <Text style={styles.buttonText}> Pic 8 General</Text>

                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => selectFile('nine')} style={{ width: "22%", height: 40, marginLeft: 5, alignContent: "center", alignItems: "center", justifyContent: "center" }} >


                            {data.pic9uri != null ?

                                <Image source={{ uri: data.pic9uri }} style={{ width: "100%", height: 80, marginLeft: 5 }} />

                                : <Image source={require('../assets/logo.png')} style={{ width: "100%", height: 80, marginLeft: 5 }} />

                            }

                            <Text style={styles.buttonText}> Pic 9 Sensor</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => selectFile('ten')} style={{ width: "22%", height: 80, marginLeft: 5, alignContent: "center", alignItems: "center", justifyContent: "center" }} >
                            {data.pic10uri != null ?

                                <Image source={{ uri: data.pic10uri }} style={{ width: "100%", height: 80, marginLeft: 5 }} />

                                : <Image source={require('../assets/logo.png')} style={{ width: "100%", height: 80, marginLeft: 5 }} />

                            }

                            <Text style={styles.buttonText}> Pic 10 Backflow</Text>
                        </TouchableOpacity>


                    </View>

                    <View style={{ width: width * 0.9, display: "flex", flexDirection: "row", flexWrap: "wrap", alignContent: "center", alignItems: "center", justifyContent: "center", paddingTop: 50, paddingBottom: 50 }}>
                        <TouchableOpacity onPress={() => selectFile('eleven')} style={{ width: "22%", height: 40, marginLeft: 5, alignContent: "center", alignItems: "center", justifyContent: "center" }} >
                            {data.pic11uri != null ?

                                <Image source={{ uri: data.pic11uri }} style={{ width: "100%", height: 80, marginLeft: 5 }} />

                                : <Image source={require('../assets/logo.png')} style={{ width: "100%", height: 80, marginLeft: 5 }} />

                            }

                            <Text style={styles.buttonText}> Pic 11 Coupler</Text>

                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => selectFile('twelve')} style={{ width: "22%", height: 40, marginLeft: 5, alignContent: "center", alignItems: "center", justifyContent: "center" }} >


                            {data.pic12uri != null ?

                                <Image source={{ uri: data.pic12uri }} style={{ width: "100%", height: 80, marginLeft: 5 }} />

                                : <Image source={require('../assets/logo.png')} style={{ width: "100%", height: 80, marginLeft: 5 }} />

                            }

                            <Text style={styles.buttonText}> Pic 12 Other</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => selectFile('thirteen')} style={{ width: "22%", height: 80, marginLeft: 5, alignContent: "center", alignItems: "center", justifyContent: "center" }} >
                            {data.pic13uri != null ?

                                <Image source={{ uri: data.pic13uri }} style={{ width: "100%", height: 80, marginLeft: 5 }} />

                                : <Image source={require('../assets/logo.png')} style={{ width: "100%", height: 80, marginLeft: 5 }} />

                            }

                            <Text style={styles.buttonText}> Pic 13 Other</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => selectFile('fourteen')} style={{ width: "22%", height: 80, marginLeft: 5, alignContent: "center", alignItems: "center", justifyContent: "center" }} >
                            {data.pic14uri != null ?

                                <Image source={{ uri: data.pic14uri }} style={{ width: "100%", height: 80, marginLeft: 5 }} />

                                : <Image source={require('../assets/logo.png')} style={{ width: "100%", height: 80, marginLeft: 5 }} />

                            }
                            <Text style={styles.buttonText}> Pic 14 Other</Text>
                        </TouchableOpacity>

                    </View>

                    <View style={styles.action}>
                        <TextInput
                            label="Notes"
                            style={styles.textInput}
                            underlineColorAndroid="transparent"
                            autoCapitalize="none"
                            theme={{ colors: { primary: '#1c4468' } }}
                            onChangeText={(val) => textInputNotes4(val)}

                        />
                    </View>


                    <View style={styles.button}>
                        <TouchableOpacity
                            style={styles.signIn}
                            onPress={() => { submitHandle(data) }}
                        >
                            <LinearGradient
                                colors={['#0083b1', '#1c4468']}
                                style={styles.signIn}
                            >
                                <Text style={[styles.textSign, {
                                    color: '#fff'
                                }]}>Create Form PDF</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => { signOut() }}
                            style={[styles.signIn, {
                                borderColor: '#1c4468',
                                borderWidth: 1,
                                marginTop: 15
                            }]}
                        >
                            <Text style={[styles.textSign, {
                                color: '#1c4468'
                            }]}>Logout</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </Animatable.View>
        </View>
    );
    
}

    if (data.isSite==false){ 
    return (
        <View style={styles.container}>
            <StatusBar backgroundColor='#1c4468' barStyle="light-content" />
            { usrType == 'USER' ?
                <View style={styles.header}>
                    <Icon.Button name="ios-menu" size={25} backgroundColor="#1c4468" color="#fff" onPress={() => {
                        navigation.openDrawer();
                    }} ></Icon.Button>

                    <Text style={styles.text_header}>Office Encoder Maintenance Form</Text>
                </View>
                :
                <View></View>
            }

            <Animatable.View
                animation="fadeInUpBig"
                style={styles.footer}
            >
                <ScrollView>

                    <View style={styles.ddcontainer}>
                        <View style={styles.dditemcustom}>
                            <Text>Customer Name</Text>
                            <DropDownPicker
                                items={customerList}

                                containerStyle={{ height: 40 }}
                                onChangeItem={item => textInputCustomer(item.value)}
                            />
                        </View>

                    </View>
                    <View style={styles.ddcontainer}>
                        <View style={styles.dditemcustom}>
                            <Text>Office Name</Text>
                            <DropDownPicker
                                items={data.customerOfficeList}

                                containerStyle={{ height: 40 }}
                                onChangeItem={item => textInputOffice(item.value)}
                            />
                        </View>

                    </View>
                    <View style={styles.ddcontainer}>
                        <View style={styles.dditemcustom}>
                            <Text>Site Name</Text>
                            <DropDownPicker
                                items={data.officeSiteList}

                                containerStyle={{ height: 40 }}
                                onChangeItem={(item) => {
                                    textInputSite(item.value)

                                }}
                            />
                        </View>

                    </View>


                    <View style={styles.action}>
                        <TextInput
                            label="Date"
                            style={styles.textInput}
                            underlineColorAndroid="transparent"
                            autoCapitalize="none"
                            theme={{ colors: { primary: '#1c4468' } }}
                            value={data.date}
                            disabled={true}
                        />


                        <TextInput
                            label="Time"
                            style={styles.textInput}
                            underlineColorAndroid="transparent"
                            autoCapitalize="none"
                            theme={{ colors: { primary: '#1c4468' } }}
                            value={data.time}

                            disabled={true}
                        />

                    </View>

                    <View style={styles.action}>
                        <TextInput
                            label="Veh"
                            style={styles.textInput}
                            underlineColorAndroid="transparent"
                            autoCapitalize="none"
                            theme={{ colors: { primary: '#1c4468' } }}
                            onChangeText={(val) => textInputVeh(val)}
                        />
                        <TextInput
                            label="Mileage"
                            style={styles.textInput}
                            underlineColorAndroid="transparent"
                            keyboardType='numeric'
                            autoCapitalize="none"
                            theme={{ colors: { primary: '#1c4468' } }}
                            onChangeText={(val) => textInputMileage(val)}
                        />

                    </View>
                    <View>
                        <TextInput
                            multiline={false}
                            numberOfLines={1}
                            label="General Condition"
                            style={styles.textInput}
                            underlineColorAndroid="transparent"
                            autoCapitalize="none"
                            theme={{ colors: { primary: '#1c4468' } }}
                            onChangeText={(val) => textInputGcondition(val)}
                        />
                    </View>
                    <Text style={[styles.text_footer, {
                        color: "#1c4468",
                        marginTop: 15,
                        marginBottom: 15,
                    }]}>Pic of Office</Text>

                    <View style={{ width: width * 0.9, display: "flex", flexDirection: "row", flexWrap: "wrap", alignContent: "center", alignItems: "center", justifyContent: "center",marginBottom:50 }}>
                        <TouchableOpacity onPress={() => selectFile('fifteen')} style={{ width: "22%", height: 40, marginLeft: 5, alignContent: "center", alignItems: "center", justifyContent: "center" }} >
                            {data.pic15uri != null ?

                                <Image source={{ uri: data.pic15uri }} style={{ width: "100%", height: 80, marginLeft: 5 }} />

                                : <Image source={require('../assets/logo.png')} style={{ width: "100%", height: 80, marginLeft: 5 }} />

                            }

                            <Text style={styles.buttonText}> Pic of Office</Text>

                        </TouchableOpacity>
                     
                    </View>
                    <View style={styles.action}>

<TextInput
    label="Software Version"
    style={styles.textInput}
    underlineColorAndroid="transparent"
    autoCapitalize="none"
    keyboardType='numeric'
    theme={{ colors: { primary: '#1c4468' } }}
    onChangeText={(val) => textInputSoftware(val)}

/>
</View>
<Text style={[styles.text_footer, {
                        color: "#1c4468",
                        marginTop: 15,
                        marginBottom: 15,
                    }]}>Pic of Office Encoder:</Text>
                    <View style={{ width: width * 0.9, display: "flex", flexDirection: "row", flexWrap: "wrap", alignContent: "center", alignItems: "center", justifyContent: "center", paddingTop: 45, paddingBottom: 35 }}>
                        <TouchableOpacity onPress={() => selectFile('sixteen')} style={{ width: "22%", height: 40, marginLeft: 5, alignContent: "center", alignItems: "center", justifyContent: "center" }} >
                            {data.pic16uri != null ?

                                <Image source={{ uri: data.pic16uri }} style={{ width: "100%", height: 80, marginLeft: 5 }} />

                                : <Image source={require('../assets/logo.png')} style={{ width: "100%", height: 80, marginLeft: 5 }} />

                            }

                            <Text style={styles.buttonText}> Pic of Office Encoder</Text>

                        </TouchableOpacity>


                  

                    </View>

                    <View style={styles.ddcontainer}>
                        <View style={styles.dditem}>
                            <Text>Check Date/Time: </Text>
                            <DropDownPicker
                                items={[
                                    { label: 'YES', value: 'YES' },
                                    { label: 'NO', value: 'NO' },
                                ]}
                                defaultValue="NO"
                                containerStyle={{ height: 40 }}
                                onChangeItem={item => textInputCheckdate(item.value)}
                            />
                        </View>
                        <View style={styles.dditem}>
                            <Text>Get Logs:</Text>
                            <DropDownPicker
                                items={[
                                    { label: 'YES', value: 'YES' },
                                    { label: 'NO', value: 'NO' },
                                ]}
                                defaultValue="NO"
                                containerStyle={{ height: 40 }}
                                onChangeItem={item => textInputGetlogs(item.value)}
                            />

                        </View>
                    </View>
                    <View style={styles.ddcontainer}>
                        <View style={styles.dditem}>
                            <Text>Check with Staff for issues:</Text>
                            <DropDownPicker
                                items={[
                                    { label: 'YES', value: 'YES' },
                                    { label: 'NO', value: 'NO' },
                                ]}
                                defaultValue="NO"
                                containerStyle={{ height: 40 }}
                                onChangeItem={item => textInputCWSFI(item.value)}
                            />
                        </View>

                    </View>

                    <View style={styles.button}>
                        <TouchableOpacity
                            style={styles.signIn}
                            onPress={() => { submitHandle2(data) }}
                        >
                            <LinearGradient
                                colors={['#0083b1', '#1c4468']}
                                style={styles.signIn}
                            >
                                <Text style={[styles.textSign, {
                                    color: '#fff'
                                }]}>Create Form PDF</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => { signOut() }}
                            style={[styles.signIn, {
                                borderColor: '#1c4468',
                                borderWidth: 1,
                                marginTop: 15
                            }]}
                        >
                            <Text style={[styles.textSign, {
                                color: '#1c4468'
                            }]}>Logout</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </Animatable.View>
        </View>
    );

                        }
};

export default SignInScreen;

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


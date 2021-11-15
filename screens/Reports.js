import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Alert,View, PermissionsAndroid ,Linking,FlatList,ScrollView,SafeAreaView, TouchableOpacity,
    Dimensions,} from 'react-native';

import SMBClient from 'react-native-smb';
import FilePickerManager from 'react-native-file-picker';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { useTheme, useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import LottieView from 'lottie-react-native';
import { Container, Header, Content, Button, Icon,List, ListItem, Left, Body, Right, Thumbnail ,Text} from 'native-base';
import { TextInput, Appbar, Title } from 'react-native-paper';
import Toast from 'react-native-simple-toast';
var RNFS = require('react-native-fs');
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
export default function Reports({ navigation }) {
  const isFocused = useIsFocused();
  const { colors } = useTheme(); 
  const theme = useTheme();
  const [isConnected, setConnected] = useState(false);
  const _goBack = () => navigation.goBack();
  const [data, setData] = React.useState({
    ip: '',
    username: '',
    password: '',
    check_textInputChange: false,
    secureTextEntry: true,
    isValidUser: true,
    isValidPassword: true,
    pdfFiles:[]
  });



  useEffect(() => {
    if (isFocused) {
 
     

    }

  }, [isFocused]);



  return (
     
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
    <Appbar.Header style={{ backgroundColor: '#1c4468',marginTop:24 ,width:'100%'}}>
        <Appbar.BackAction onPress={_goBack} />
        <Appbar.Content title="Reports" />
  
      </Appbar.Header>

      <StatusBar backgroundColor='#1c4468' barStyle="dark-content" />
   


<Animatable.View
    style={[styles.footer, {
        backgroundColor: colors.background
    }]}
    animation="fadeInUpBig"
>
    <View style={{padding:50,alignContent:'center'}}>
    <Text style={[styles.title, {
        color: colors.text
    }]}>AquaFlow Int’l, Inc.</Text>
    <Text style={styles.text}>Send Reports Options</Text>
    </View>
    <View style={styles.button1}>
        <TouchableOpacity onPress={() => navigation.navigate('PendingReports')}>
            <LinearGradient
                colors={['#1c4468', '#1c4468']}
                style={styles.signIn}
            >

                <MaterialIcons
                    name="email"
                    color="#fff"
                    size={40}
                />
                <Text style={styles.textSign}>Send Pending</Text>
            </LinearGradient>
        </TouchableOpacity>
        </View>
 
        <View style={styles.button1}>
        <TouchableOpacity  onPress={() => navigation.navigate('ResendReports')}>
            <LinearGradient
                colors={['#1c4468', '#1c4468']}
                style={styles.signIn}
            >

                <MaterialIcons
                    name="refresh"
                    color="#fff"
                    size={40}
                />
                <Text style={styles.textSign}>Re-Send Report</Text>
            </LinearGradient>
        </TouchableOpacity>
    </View>
 
</Animatable.View>

   

    </View>
  );
}


const { height } = Dimensions.get("screen");
const height_logo = height * 0.20;

const styles = StyleSheet.create({
    container: {
        flex: 2,
        backgroundColor: '#1c4468' 
    },
    header: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    footer: {

    },
    logo: {
        width: height_logo,
        height: height_logo
    },
    title: {
        color: '#05375a',
        fontSize: 30,
        fontWeight: 'bold'
    },
    text: {
        color: 'grey',
        marginTop: 5
    },
    button: {
        alignItems: 'flex-end',
        marginTop: -40,
        height: 100
    },
    button1: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        flexDirection: 'column'
    },
    signIn: {
        width: 250,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        flexDirection: 'column'
    },
    textSign: {
        color: 'white',
        fontWeight: 'bold'
    }
});


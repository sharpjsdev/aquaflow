import * as React from 'react';
import { useState, useEffect, Component } from 'react';
import { Appbar, Title } from 'react-native-paper';
import * as Animatable from 'react-native-animatable';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-simple-toast';
import {
    View,
    Text,
    TouchableOpacity,
    ActivityIndicator,
    TextInput,
    Platform,
    StyleSheet,
    StatusBar,
    Alert,
    Button,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import { useTheme } from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';

export default function EmailSettings() {
    const navigation = useNavigation();
    const { colors } = useTheme();
    const _goBack = () => navigation.goBack();
    const [data, setData] = React.useState({

        smtpemail: '',
        smtppassword: '',
        smtphost: '',
        smtpport: '465',
        smtptitle: 'AquaFlow App',
        check_textInputChange: false,
        secureTextEntry: true,
        isValidUser: true,
        isValidPassword: true,
        isLoading: false,
    });
    useEffect(() => {


        ///// retrieve asynch storage data //////


        const retrieveData = async () => {
            const keys = await AsyncStorage.getAllKeys()
            const itemsArray = await AsyncStorage.multiGet(keys)
            let object = {}
            itemsArray.map(item => {
                object[`${item[0]}`] = item[1]
            })
            console.log(object);
            if (object.smtpEmail) {
                setData({
                    ...data,
                    smtpemail: object.smtpEmail,
                    smtppassword: object.smtpPassword,
                    smtptitle: object.smtpTitle,
                    smtphost: object.smtpHost,
                    smtpport: object.smtpPort,
        
                });

            } else {

                setData({
                    ...data,
                    smtpemail: '',
                    smtppassword: '',
                    smtptitle: 'AquaFlow App',
                    smtphost: '',
                    smtpport: '465',
                   
                });
            }

        }


        retrieveData()
    }, []);

    const textInputHost = (val) => {
        setData({
            ...data,
            smtphost: val,
        });
    }
    const textInputPort = (val) => {
        setData({
            ...data,
            smtpport: val,
        });
    }

    const textInputChange2 = (val) => {
        setData({
            ...data,
            smtptitle: val,
        });
    }
    const textInputChange3 = (val) => {
        setData({
            ...data,
            smtpemail: val,
        });
    }
    const textInputChange4 = (val) => {
        setData({
            ...data,
            smtppassword: val,
        });
    }
    const updateSecureTextEntry = () => {
        setData({
            ...data,
            secureTextEntry: !data.secureTextEntry
        });
    }

    /////////// Save Settings ////////////

    const settingHandle = async () => {
        setData({
            ...data,
            isLoading: true,

        });
        if (data.smtptitle.length == 0 || data.smtpemail.length == 0 || data.smtppassword.length == 0) {
            Alert.alert('Wrong Input!', 'Heading , Email or password field cannot be empty.', [
                { text: 'Okay' }
            ]);

            setData({
                ...data,
                isLoading: false,

            });
            return;
        }


        try {
            setTimeout(async () => {
                setData({
                    ...data,
                    isLoading: false,

                });
             
                await AsyncStorage.setItem('smtpTitle', data.smtptitle);
                await AsyncStorage.setItem('smtpEmail', data.smtpemail);
                await AsyncStorage.setItem('smtpPassword', data.smtppassword);
                await AsyncStorage.setItem('smtpHost', data.smtphost);
                await AsyncStorage.setItem('smtpPort', data.smtpport);

                Toast.show('Settings Updated Successfuly...', Toast.SHORT, [
                    'UIAlertController',
                ]);
				         Alert.alert('SMTP Data Updated!', 'You must restart App for these changes to take effect.', [
                    { text: 'Okay' }
                ]);
                navigation.navigate('Home');
            }, 500);

            return;
        } catch (e) {
            console.log(e);
        }

    }
    if (data.isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#1c4468" />
            </View>
        );
    }
    return (
        <View style={styles.container}>
            <StatusBar backgroundColor='#1c4468' barStyle="light-content" />
            <Appbar.Header style={{ backgroundColor: '#1c4468',marginTop:24 }}>
        <Appbar.BackAction onPress={_goBack} />
        <Appbar.Content title="Email Setup" />
       
      </Appbar.Header>
            <View style={styles.header}>
                <Text style={styles.text_header}>SMTP Email Setting!</Text>
            </View>
            <Animatable.View
                animation="zoomIn"
                style={[styles.footer, {
                    backgroundColor: colors.background
                }]}
            >

                <View style={styles.action}>
                    <FontAwesome
                        name="file-o"
                        color={colors.text}
                        size={20}
                    />
                    <TextInput
                        placeholder="Report Email Heading"
                        placeholderTextColor="#666666"
                        style={[styles.textInput, {
                            color: colors.text
                        }]}
                        value={data.smtptitle}
                        autoCapitalize="none"
                        onChangeText={(val) => textInputChange2(val)}

                    />
                </View>
                <View style={styles.action}>
                    <FontAwesome
                        name="globe"
                        color={colors.text}
                        size={20}
                    />
                    <TextInput
                        placeholder="SMTP Host"
                        placeholderTextColor="#666666"
                        style={[styles.textInput, {
                            color: colors.text
                        }]}
                        value={data.smtphost}
                        autoCapitalize="none"
                        onChangeText={(val) => textInputHost(val)}

                    />
                </View>
                <View style={styles.action}>
                    <FontAwesome
                        name="list"
                        color={colors.text}
                        size={20}
                    />
                    <TextInput
                        placeholder="SMTP PORT"
                        placeholderTextColor="#666666"
                        style={[styles.textInput, {
                            color: colors.text
                        }]}
                        value={data.smtpport}
                        keyboardType='numeric'
                        autoCapitalize="none"
                        onChangeText={(val) => textInputPort(val)}

                    />
                </View>
                <View style={styles.action}>
                    <FontAwesome
                        name="user-o"
                        color={colors.text}
                        size={20}
                    />
                    <TextInput
                        placeholder="SMTP Email"
                        placeholderTextColor="#666666"
                        style={[styles.textInput, {
                            color: colors.text
                        }]}
                        value={data.smtpemail}
                        autoCapitalize="none"
                        onChangeText={(val) => textInputChange3(val)}

                    />
                </View>



                <View style={styles.action}>
                    <Feather
                        name="lock"
                        color={colors.text}
                        size={20}
                    />
                    <TextInput
                        placeholder="SMTP Email Password"
                        placeholderTextColor="#666666"
                        secureTextEntry={data.secureTextEntry ? true : false}
                        style={[styles.textInput, {
                            color: colors.text
                        }]}
                        value={data.smtppassword}
                        autoCapitalize="none"
                        onChangeText={(val) => textInputChange4(val)}
                    />
                    <TouchableOpacity
                        onPress={updateSecureTextEntry}
                    >
                        {data.secureTextEntry ?
                            <Feather
                                name="eye-off"
                                color="grey"
                                size={20}
                            />
                            :
                            <Feather
                                name="eye"
                                color="grey"
                                size={20}
                            />
                        }
                    </TouchableOpacity>
                </View>


                <View style={styles.button}>
                    <TouchableOpacity
                        style={styles.signIn}
                        onPress={() => { settingHandle() }}
                    >
                        <LinearGradient
                            colors={['#0083b1', '#1c4468']}
                            style={styles.signIn}
                        >
                            <Text style={[styles.textSign, {
                                color: '#fff'
                            }]}>Save</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </Animatable.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#1c4468'
    },
    header: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
        paddingBottom: 50
    },
    footer: {
        flex: 4,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30
    },
    text_header: {
        color: '#1c4468',
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
    actionError: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#FF0000',
        paddingBottom: 5
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
    },
    errorMsg: {
        color: '#FF0000',
        fontSize: 14,
    },
    button: {
        alignItems: 'center',
        marginTop: 50
    },
    signIn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold'
    }
});

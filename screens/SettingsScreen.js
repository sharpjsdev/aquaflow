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

export default function SettingsScreen() {
    const navigation = useNavigation();
    const { colors } = useTheme();

    const [data, setData] = React.useState({
        ip: '',
        username: '',
        password: '',
        folder: '',
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
            if (object.nasIp) {
                setData({
                    ...data,
                    ip: object.nasIp,
                    folder: object.nasFolder,
                    username: object.nasUser,
                    password: object.nasPass,
                });

            } else {

                setData({
                    ...data,
                    ip: '',
                    folder: '',
                    username: '',
                    password: '',
                });
            }

        }


        retrieveData()
    }, []);



    const textInputChange1 = (val) => {
        setData({
            ...data,
            ip: val,
        });
    }
    const textInputChange2 = (val) => {
        setData({
            ...data,
            folder: val,
        });
    }
    const textInputChange3 = (val) => {
        setData({
            ...data,
            username: val,
        });
    }
    const textInputChange4 = (val) => {
        setData({
            ...data,
            password: val,
        });
    }
    const updateSecureTextEntry = () => {
        setData({
            ...data,
            secureTextEntry: !data.secureTextEntry
        });
    }

    /////////// Save Settings ////////////

    const settingHandle = async (userName, password) => {
        setData({
            ...data,
            isLoading: true,

        });
        if (data.ip.length == 0 || data.folder.length == 0 || data.username.length == 0 || data.password.length == 0) {
            Alert.alert('Wrong Input!', 'IP Address , Username or password field cannot be empty.', [
                { text: 'Okay' }
            ]);

            setData({
                ...data,
                isLoading: false,

            });
            return;
        }
        console.log(data.ip);
        console.log(data.username);
        console.log(data.password);

        try {
            setTimeout(async () => {
                setData({
                    ...data,
                    isLoading: false,

                });
                await AsyncStorage.setItem('nasIp', data.ip);
                await AsyncStorage.setItem('nasFolder', data.folder);
                await AsyncStorage.setItem('nasUser', data.username);
                await AsyncStorage.setItem('nasPass', data.password);


                Toast.show('Settings Updated Successfuly...', Toast.SHORT, [
                    'UIAlertController',
                ]);
                navigation.navigate('Explore');
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
            <View style={styles.header}>
                <Text style={styles.text_header}>NAS Connection Setting!</Text>
            </View>
            <Animatable.View
                animation="zoomIn"
                style={[styles.footer, {
                    backgroundColor: colors.background
                }]}
            >


                <View style={styles.action}>
                    <FontAwesome
                        name="laptop"
                        color={colors.text}
                        size={20}
                    />
                    <TextInput
                        placeholder="IP Address"
                        placeholderTextColor="#666666"
                        style={[styles.textInput, {
                            color: colors.text
                        }]}
                        value={data.ip}
                        autoCapitalize="none"
                        onChangeText={(val) => textInputChange1(val)}

                    />
                </View>
                <View style={styles.action}>
                    <FontAwesome
                        name="folder"
                        color={colors.text}
                        size={20}
                    />
                    <TextInput
                        placeholder="Folder Name"
                        placeholderTextColor="#666666"
                        style={[styles.textInput, {
                            color: colors.text
                        }]}
                        value={data.folder}
                        autoCapitalize="none"
                        onChangeText={(val) => textInputChange2(val)}

                    />
                </View>
                <View style={styles.action}>
                    <FontAwesome
                        name="user-o"
                        color={colors.text}
                        size={20}
                    />
                    <TextInput
                        placeholder="Username"
                        placeholderTextColor="#666666"
                        style={[styles.textInput, {
                            color: colors.text
                        }]}
                        value={data.username}
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
                        placeholder="Password"
                        placeholderTextColor="#666666"
                        secureTextEntry={data.secureTextEntry ? true : false}
                        style={[styles.textInput, {
                            color: colors.text
                        }]}
                        value={data.password}
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
                        onPress={() => { settingHandle(data.ip, data.username, data.password) }}
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

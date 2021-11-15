import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import {
    StyleSheet, Text, View, FlatList, Button, PermissionsAndroid, TouchableOpacity,
    Dimensions,
} from 'react-native';
import realm, {
    getAllBooks,
    addBook,
    deleteAllBooks
} from "../lib/Database";
import { useTheme } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import { Container, Header, Content, Item, Input, Icon } from 'native-base';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-community/async-storage';
import SignUpScreen from './SignUpScreen';
import { createStackNavigator } from '@react-navigation/stack';
export default function HomeScreen({ navigation }) {

    useEffect(() => {

        const retrieveData = async () => {
            const keys = await AsyncStorage.getAllKeys()
            const itemsArray = await AsyncStorage.multiGet(keys)
            let object = {}
            itemsArray.map(item => {
                object[`${item[0]}`] = item[1]
            })
            setUserType(object.usertype);
        }
        retrieveData();
    }, []);
    const { colors } = useTheme();
    const theme = useTheme();
    const [userType, setUserType] = useState();
    return (
        <View style={styles.container}>



            <StatusBar backgroundColor='#1c4468' barStyle="light-content" />
            <View style={styles.header}>
                <Animatable.Image
                    animation="bounceIn"
                    duraton="1500"
                    source={require('../assets/logo.png')}
                    style={styles.logo}
                    resizeMode="stretch"
                />
            </View>
            <Animatable.View
                style={[styles.footer, {
                    backgroundColor: colors.background
                }]}
                animation="fadeInUpBig"
            >
                <Text style={[styles.title, {
                    color: colors.text
                }]}>AquaFlow Int’l, Inc.</Text>
                <Text style={styles.text}>PO Box 2841, Flagstaff, AZ, 86003 (928) 380-6164</Text>
                <View style={styles.button1}>
                    <TouchableOpacity onPress={() => navigation.navigate('Explore')}>
                        <LinearGradient
                            colors={['#1c4468', '#1c4468']}
                            style={styles.signIn}
                        >

                            <MaterialIcons
                                name="settings-input-antenna"
                                color="#fff"
                                size={40}
                            />
                            <Text style={styles.textSign}>File Transfer</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => navigation.navigate('Setting')}>
                        <LinearGradient
                            colors={['#1c4468', '#1c4468']}
                            style={styles.signIn}
                        >

                            <MaterialIcons
                                name="app-settings-alt"
                                color="#fff"
                                size={40}
                            />
                            <Text style={styles.textSign}>Settings</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity style={{ marginLeft: 10 }} onPress={() => navigation.navigate('Reports')}>
                        <LinearGradient
                            colors={['#1c4468', '#1c4468']}
                            style={styles.signIn}
                        >

                            <MaterialIcons
                                name="email"
                                color="#fff"
                                size={40}
                            />
                            <Text style={styles.textSign}>Reports</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
                <View style={styles.button}>

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
        flex: 2,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingVertical: 50,
        paddingHorizontal: 30
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
        marginTop: 30,
        flexDirection: 'row'
    },
    signIn: {
        width: 110,
        height: 110,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,

    },
    textSign: {
        color: 'white',
        fontWeight: 'bold'
    }
});
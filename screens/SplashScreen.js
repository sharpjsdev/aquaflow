import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  StatusBar,
  Image
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '@react-navigation/native';
import Realm from 'realm';
let realm;
const SplashScreen = ({ navigation }) => {

  realm = new Realm({
    path: 'UserDatabase.realm', schema: [
      {
        name: 'user_details',
        properties: {
          user_id: { type: 'int', default: 0 },
          user_name: 'string',
          email: 'string',
          password: 'string',
          type: 'string',
        },
      },
    ],
  });
  useEffect(() => {
    var user_details = realm.objects('user_details');
    if (user_details == '') {

      realm.write(() => {
        var ID =
          realm.objects('user_details').sorted('user_id', true).length > 0
            ? realm.objects('user_details').sorted('user_id', true)[0]
              .user_id + 1
            : 1;
        realm.create('user_details', {
          user_id: ID,
          user_name: 'admin',
          email: 'admin@gmail.com',
          password: 'password',
          type: 'ADMIN',


        });

      });
      console.log(user_details);
      //  setData(user_details);
    } else {
      console.log(user_details);
      // setData(user_details);

    }

  }, []);
  const { colors } = useTheme();

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
          <TouchableOpacity onPress={() => navigation.navigate('SignInScreen')}>
            <LinearGradient
              colors={['#0083b1', '#1c4468']}
              style={styles.signIn}
            >
              <Text style={styles.textSign}>Login </Text>
              <MaterialIcons
                name="login"
                color="#fff"
                size={30}
              />
            </LinearGradient>
          </TouchableOpacity>
        </View>
        {/* <View style={styles.button}>
             <TouchableOpacity onPress={()=>navigation.navigate('SignUpScreen')}>
                <LinearGradient
                    colors={['#0083b1', '#1c4468']}
                    style={styles.signIn}
                >
                    <Text style={styles.textSign}>Fill Form</Text>
                    <MaterialIcons 
                        name="navigate-next"
                        color="#fff"
                        size={20}
                    />
                </LinearGradient>
            </TouchableOpacity>
            </View> */}
      </Animatable.View>
    </View>
  );
};

export default SplashScreen;

const { height } = Dimensions.get("screen");
const height_logo = height * 0.28;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1c4468'
  },
  header: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  footer: {
    flex: 1,
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
    marginTop: -40
  },
  button1: {
    alignItems: 'center',
    marginTop: 30
  },
  signIn: {
    width: 150,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    flexDirection: 'row',

  },
  textSign: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20
  }
});


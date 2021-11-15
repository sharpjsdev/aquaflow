import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, Alert, Button, PermissionsAndroid } from 'react-native';
import {
  NavigationContainer,
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme
} from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

import {
  Provider as PaperProvider,
  DefaultTheme as PaperDefaultTheme,
  DarkTheme as PaperDarkTheme
} from 'react-native-paper';
import realm, { getAllBooks } from "./lib/Database";
import MainTabScreen from './screens/MainTabScreen';
import DrawerContent from './screens/DrawerContent';
import Reports from './screens/Reports';
import PendingReports from './screens/PendingReports';
import ResendReports from './screens/ResendReports';
import SettingsScreen from './screens/SettingsScreen';
import EmailSettings from './screens/EmailSettings';
import SignUpScreen from './screens/SignUpScreen';
import Customer from './screens/Customer';
import Office from './screens/Office';
import OfficeEmails from './screens/OfficeEmails';
import Site from './screens/Site';
import User from './screens/User';
import DemoScreen from './screens/DemoScreen';
import { AuthContext } from './components/context';
import RootStackScreen from './screens/RootStackScreen';
import AsyncStorage from '@react-native-community/async-storage';


const Drawer = createDrawerNavigator();


export default function App() {



  console.log(JSON.stringify(getAllBooks()));
  // const [isLoading, setIsLoading] = React.useState(true);
  // const [userToken, setUserToken] = React.useState(null); 
  const [isDarkTheme, setIsDarkTheme] = React.useState(false);
  const [usrType, setUsrType] = React.useState();
  const initialLoginState = {
    isLoading: true,
    userName: null,
    userToken: null,
  };

  const CustomDefaultTheme = {
    ...NavigationDefaultTheme,
    ...PaperDefaultTheme,
    colors: {
      ...NavigationDefaultTheme.colors,
      ...PaperDefaultTheme.colors,
      background: '#ffffff',
      text: '#333333'
    }
  }

  const CustomDarkTheme = {
    ...NavigationDarkTheme,
    ...PaperDarkTheme,
    colors: {
      ...NavigationDarkTheme.colors,
      ...PaperDarkTheme.colors,
      background: '#333333',
      text: '#ffffff'
    }
  }

  const theme = isDarkTheme ? CustomDarkTheme : CustomDefaultTheme;

  const loginReducer = (prevState, action) => {
    switch (action.type) {
      case 'RETRIEVE_TOKEN':
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false,
        };
      case 'LOGIN':
        return {
          ...prevState,
          userName: action.id,
          userToken: action.token,
          isLoading: false,
        };
      case 'LOGOUT':
        return {
          ...prevState,
          userName: null,
          userToken: null,
          isLoading: false,

        };
      case 'REGISTER':
        return {
          ...prevState,
          userName: action.id,
          userToken: action.token,
          isLoading: false,
        };
    }
  };
  const [loginState, dispatch] = React.useReducer(loginReducer, initialLoginState);
  const authContext = React.useMemo(() => ({
    signIn: async (foundUser) => {
      console.log(foundUser);
      const userToken = 'token123';
      const userName = foundUser[0].user_name;
      const userEmail = foundUser[0].email;
      const userType = foundUser[0].type;
      setUsrType(userType);

      try {
        await AsyncStorage.setItem('userToken', userToken);
        await AsyncStorage.setItem('uname', userName);
        await AsyncStorage.setItem('uemail', userEmail);
        await AsyncStorage.setItem('utype', userType);
      } catch (e) {
        console.log(e);
      }


      dispatch({ type: 'LOGIN', id: userName, token: userToken, actions: [{ type: 'LOGIN', routeName: 'SignupScreen' }] });

    },
    signOut: async () => {
      //  setUserToken(null);
      //   setIsLoading(false);
      try {
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('uname');
        await AsyncStorage.removeItem('uemail');
        await AsyncStorage.removeItem('utype');
      } catch (e) {
        console.log(e);
      }
      //console.log(loginState.userToken);

      dispatch({ type: 'LOGOUT' });
    },
    signUp: () => {
      //  setUserToken('fgkjsdfsd');
      //    setIsLoading(false);

    },
    toggleTheme: () => {
      setIsDarkTheme(isDarkTheme => !isDarkTheme);
    }
  }), []);

  useEffect(() => {
    setTimeout(async () => {
      // setIsLoading(false);
      let userToken;
      userToken = null;
      usType = null;
      try {
        userToken = await AsyncStorage.getItem('userToken');
        usType = await AsyncStorage.getItem('utype');
        setUsrType(usType);
      } catch (e) {
        console.log(e);
      }
      dispatch({ type: 'RETRIEVE_TOKEN', token: userToken });
    }, 1000);
  }, []);


  if (loginState.isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#1c4468" />
      </View>
    );
  }

  return (
    <PaperProvider theme={theme}>
      <AuthContext.Provider value={authContext}>

        <NavigationContainer theme={theme}>
          {loginState.userToken != null ?

            <Drawer.Navigator drawerContent={props => <DrawerContent {...props} />} >
              {usrType == 'ADMIN' ?
                <Drawer.Screen name="HomeDrawer" component={MainTabScreen} />
                :

                <Drawer.Screen name="SignUpScreen" component={SignUpScreen} options={{
                  title: "Maintenance Form"
                }} />
              }

              <Drawer.Screen name="SettingsScreen" component={SettingsScreen} />
              <Drawer.Screen name="EmailSettings" component={EmailSettings} />
              <Drawer.Screen name="Customer" component={Customer} />
              <Drawer.Screen name="Office" component={Office} />
              <Drawer.Screen name="OfficeEmails" component={OfficeEmails} />
              <Drawer.Screen name="DemoScreen" component={DemoScreen} />
              <Drawer.Screen name="Site" component={Site} />
              <Drawer.Screen name="User" component={User} />
              <Drawer.Screen name="Reports" component={Reports} />
              <Drawer.Screen name="PendingReports" component={PendingReports} />
              <Drawer.Screen name="ResendReports" component={ResendReports} />

            </Drawer.Navigator>

            :
            <RootStackScreen />
          }
        </NavigationContainer>
      </AuthContext.Provider>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


import HomeScreen from './HomeScreen';
import Reports from './Reports';
import ExploreScreen from './ExploreScreen';
import SettingsScreen from './SettingsScreen';
import SignUpScreen from './SignUpScreen';
const HomeStack = createStackNavigator();
const HomeStackNew = createStackNavigator();
const DetailStack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();

const MainTabScreen = () => (

  <Tab.Navigator
    initialRouteName="Feed"
    activeColor="#fff"
    barStyle={{ backgroundColor: '#1c4468' }}
  >
    <Tab.Screen
      name="Home"
      component={HomeStackScreen}
      options={{
        tabBarLabel: 'Home',
        tabBarColor: '#1c4468',
        tabBarIcon: ({ color }) => (
          <Icon name="ios-home" color={color} size={26} />
        ),
      }}
    />
    <Tab.Screen
      name="Explore"
      component={ExploreStackScreen}
      options={{
        tabBarLabel: 'Explore Files',
        tabBarColor: '#1c4468',
        tabBarIcon: ({ color }) => (
          <Icon name="ios-notifications" color={color} size={26} />
        ),
      }}
    />


    <Tab.Screen
      name="Setting"
      component={SettingsStackScreen}
      options={{
        tabBarLabel: 'Settings',
        tabBarColor: '#1c4468',
        tabBarIcon: ({ color }) => (
          <Icon name="settings-outline" color={color} size={26} />
        ),
      }}
    />
  </Tab.Navigator>

);


export default MainTabScreen;

function HomeStackScreen({ navigation }) {
  return (
    <HomeStack.Navigator screenOptions={{
      headerStyle: {
        backgroundColor: '#1c4468',

      },
      headerTintColor: '#fff',
      justifyContent: "center",
      headerTitleStyle: {

        fontWeight: 'bold'
      }

    }}>
      <HomeStack.Screen name="Home" component={HomeScreen} options={{
        title: "Dashboard	",
        headerLeft: () => (
          <Icon.Button name="ios-menu" size={25} backgroundColor="#1c4468" onPress={() => {
            navigation.openDrawer();
          }} ></Icon.Button>
        )

      }} />
      <HomeStack.Screen name="SignUpScreen" component={SignUpScreen} options={{
        title: "Maintenance Form"
      }} />

    </HomeStack.Navigator>



  );
}


function ExploreStackScreen({ navigation }) {
  return (
    <DetailStack.Navigator screenOptions={{
      headerStyle: {
        backgroundColor: '#1c4468',

      },
      headerTintColor: '#fff',
      justifyContent: "center",
      headerTitleStyle: {

        fontWeight: 'bold'
      }

    }}>
      <DetailStack.Screen name="Explore" component={ExploreScreen} options={{

        headerLeft: () => (
          <Icon.Button name="ios-menu" size={25} backgroundColor="#1c4468" onPress={() => {
            navigation.openDrawer();
          }} ></Icon.Button>
        )

      }} />

    </DetailStack.Navigator>
  );
}

function SettingsStackScreen({ navigation }) {
  return (
    <DetailStack.Navigator screenOptions={{
      headerStyle: {
        backgroundColor: '#1c4468',

      },
      headerTintColor: '#fff',
      justifyContent: "center",
      headerTitleStyle: {

        fontWeight: 'bold'
      }

    }}>
      <DetailStack.Screen name="Setting" component={SettingsScreen} options={{

        headerLeft: () => (
          <Icon.Button name="ios-menu" size={25} backgroundColor="#1c4468" onPress={() => {
            navigation.openDrawer();
          }} ></Icon.Button>
        )

      }} />

    </DetailStack.Navigator>
  );
}
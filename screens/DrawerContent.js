import React, { useState, useEffect, Component } from 'react';
import { StyleSheet, View, Button, PermissionsAndroid } from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItem

} from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  useTheme,
  Avatar,
  Title,
  Caption,
  Paragraph,
  Drawer,
  Text,
  TouchableRipple,
  Switch
} from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';
import { AuthContext } from '../components/context';

export default function DrawerContent(props) {
  const { signOut, toggleTheme } = React.useContext(AuthContext);
  const paperTheme = useTheme();
  const [usrType, setUsrType] = React.useState();
  const [data, setData] = React.useState({
    username: '',
    useremail: '',
  });

  useEffect(() => {

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

  return (
    <View style={{ flex: 1 }}>

      { usrType == 'ADMIN' ?
        <DrawerContentScrollView {...props}>
          <View style={styles.drawerContent}>
            <View style={styles.userInfoSection}>
              <View style={{ flexDirection: 'row', marginTop: 15 }}>
                <Avatar.Image
                  source={{
                    uri: 'https://api.adorable.io/avatars/50/abott@adorable.png'
                  }}
                  size={50}
                />
                <View style={{ marginLeft: 15, flexDirection: 'column' }}>
                  <Title style={styles.title}>{data.username}</Title>
                  <Caption style={styles.caption}>{data.useremail}</Caption>
                </View>
              </View>
            </View>
            <Drawer.Section style={styles.drawerSection}>
              <DrawerItem
                icon={({ color, size }) => (
                  <Icon
                    name="home-outline"
                    color={color}
                    size={size}
                  />
                )}
                label="Home"
                onPress={() => { props.navigation.navigate('Home') }}
              />
              <DrawerItem
                icon={({ color, size }) => (
                  <Icon
                    name="person-outline"
                    color={color}
                    size={size}
                  />
                )}
                label="Explore Files"
                onPress={() => { props.navigation.navigate('Explore') }}
              />

              <DrawerItem
                icon={({ color, size }) => (
                  <Icon
                    name="settings-outline"
                    color={color}
                    size={size}
                  />
                )}
                label="Settings"
                onPress={() => { props.navigation.navigate('Setting') }}
              />
              <DrawerItem
                icon={({ color, size }) => (
                  <Icon
                    name="mail-outline"
                    color={color}
                    size={size}
                  />
                )}
                label="Email Setup"
                onPress={() => { props.navigation.navigate('EmailSettings') }}
              />
              <DrawerItem
                icon={({ color, size }) => (
                  <Icon
                    name="document-outline"
                    color={color}
                    size={size}
                  />
                )}
                label="Maintenance Form"
                onPress={() => { props.navigation.navigate('SignUpScreen') }}
              />
              <DrawerItem
                icon={({ color, size }) => (
                  <Icon
                    name="add-outline"
                    color={color}
                    size={size}
                  />
                )}
                label="Users"
                onPress={() => { props.navigation.navigate('User') }}
              />
              <DrawerItem
                icon={({ color, size }) => (
                  <Icon
                    name="add-outline"
                    color={color}
                    size={size}
                  />
                )}
                label="Customers"
                onPress={() => { props.navigation.navigate('Customer') }}
              />
              <DrawerItem
                icon={({ color, size }) => (
                  <Icon
                    name="add-outline"
                    color={color}
                    size={size}
                  />
                )}
                label="Offices"
                onPress={() => { props.navigation.navigate('Office') }}
              />
              <DrawerItem
                icon={({ color, size }) => (
                  <Icon
                    name="add-outline"
                    color={color}
                    size={size}
                  />
                )}
                label="Sites"
                onPress={() => { props.navigation.navigate('Site') }}
              />


            </Drawer.Section>

            {/* <Drawer.Section title="Preferences">
                        <TouchableRipple onPress={() => {toggleTheme()}}>
                            <View style={styles.preference}>
                                <Text>Dark Theme</Text>
                                <View pointerEvents="none">
                                    <Switch value={paperTheme.dark}/>
                                </View>
                            </View>
                        </TouchableRipple>
                    </Drawer.Section> */}
          </View>
          <Drawer.Section style={styles.bottomDrawerSection}>
            <DrawerItem
              icon={({ color, size }) => (
                <Icon
                  name="log-out-outline"
                  color={color}
                  size={size}
                />
              )}
              label="Sign Out"
              onPress={() => { signOut() }}
            />
          </Drawer.Section>
        </DrawerContentScrollView>

        :

        <DrawerContentScrollView {...props}>
          <View style={styles.drawerContent}>
            <View style={styles.userInfoSection}>
              <View style={{ flexDirection: 'row', marginTop: 15 }}>
                <Avatar.Image
                  source={{
                    uri: 'https://api.adorable.io/avatars/50/abott@adorable.png'
                  }}
                  size={50}
                />
                <View style={{ marginLeft: 15, flexDirection: 'column' }}>
                  <Title style={styles.title}>{data.username}</Title>
                  <Caption style={styles.caption}>{data.useremail}</Caption>
                </View>
              </View>
            </View>
            <Drawer.Section style={styles.drawerSection}>

              <DrawerItem
                icon={({ color, size }) => (
                  <Icon
                    name="log-out-outline"
                    color={color}
                    size={size}
                  />
                )}
                label="Sign Out"
                onPress={() => { signOut() }}
              />


            </Drawer.Section>

          </View>
        </DrawerContentScrollView>
      }



    </View>
  );
}


const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {
    fontSize: 16,
    marginTop: 3,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  paragraph: {
    fontWeight: 'bold',
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  bottomDrawerSection: {
    marginBottom: 15,
    borderTopColor: '#f4f4f4',
    borderTopWidth: 1
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});
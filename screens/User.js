import * as React from 'react';
import Header from './Header';
import { useState, useEffect } from 'react';
import { Modal, Pressable } from "react-native";
import { TextInput, Appbar, Title } from 'react-native-paper';
import { Button } from 'native-base';
import Toast from 'react-native-simple-toast';
import DialogInput from 'react-native-dialog-input';
import DropDownPicker from 'react-native-dropdown-picker';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  StatusBar,
  ScrollView,
  SafeAreaView,
  Alert,
  FlatList,
  Platform,
  ActivityIndicator,
  Image,

} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import { Container, Content, List, ListItem, SwipeRow, Left, Right, Icon } from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '@react-navigation/native';
import Realm from 'realm';
let realm;


export default function User({ navigation }) {

  useEffect(() => {
    var user_details = realm.objects('user_details');

    console.log(user_details);
    setData(user_details);
  }, []);

  ///// object of user database ///////
  const realm = new Realm({
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
  const { colors } = useTheme();
  const _goBack = () => navigation.goBack();
  const [modalVisible, setModalVisible] = useState(false);
  const [editmodalVisible, seteditModalVisible] = useState(false);
  const [data, setData] = useState({
    check_textInputChange: false,
    secureTextEntry: true,
    isValidUser: true,
    isValidPassword: true,
    isLoading: false,
  });

  const [formdata, setFormData] = useState({
    user_id: '',
    user_name: '',
    email: '',
    password: '',
    type: '',
    edit_user_id: '',
    edit_user_name: '',
    edit_email: '',
    edit_password: '',
    edit_type: '',

  });

///////// get all users //////
  const getAllUsers = async (name) => {
    var user_details = realm.objects('user_details');
    console.log(user_details);
    setData(user_details);
  }

////////update user //////
  const updateUser = async (name, uid, email, password, type) => {

    if (name.length == 0) {
      Alert.alert('Wrong Input!', 'Name field cannot be empty.', [
        { text: 'Okay' }
      ]);

      return;
    }

    if (name.length < 4 || password.length < 8 ) {
      Alert.alert('Wrong Input!', 'Username must have minimum 4 character and password must have minimum 8 character.', [
        { text: 'Okay' }
      ]);

      setData({
        ...data,
        isLoading: false,

      });
      return;
    }

    realm.write(() => {
      var ID = uid;
      if (
        realm.objects('user_details').filtered('user_id =' + uid)
          .length > 0
      ) {

        var obj = realm
          .objects('user_details')
          .filtered('user_id =' + uid);
        console.log('obj', obj);
        if (obj.length > 0) {
          obj[0].user_name = name;

          obj[0].email = email;
          obj[0].password = password;
          obj[0].type = type;

        }
        var user_details = realm.objects('user_details');
        console.log(user_details);
        setData(user_details);
        setFormData('');
        seteditModalVisible(!editmodalVisible);
        Toast.show('User Updated Successfuly...', Toast.SHORT, [
          'UIAlertController',
        ]);

      } else {
        alert('No Data For Deletion.');
      }
    });

  }


  //////delete all users ///////
  const deleteConfirm = () => {

    Alert.alert(
      'Are you sure to delete All Users?',
      'never recover',
      [{ text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
      {
        text: 'Ok',
        onPress: () => {
          realm.write(() => {
            //  var ID = this.state.input_user_id;
            if (
              realm.objects('user_details')
                .length > 0
            ) {
              realm.delete(
                realm.objects('user_details')
              );
              var user_details = realm.objects('user_details');
              console.log(user_details);
              setData('');
              Toast.show('All Users Deleted Successfuly...', Toast.SHORT, [
                'UIAlertController',
              ]);

            } else {
              alert('No Data For Deletion.');
            }
          });

        },
      },
      ],
      { cancelable: false }
    );
  }


  ///////delete single user /////////
  const deleteUserConfirm = (uid) => {


    Alert.alert(
      'Are you sure to delete this User?',
      'never recover',
      [{ text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
      {
        text: 'Ok',
        onPress: () => {
          realm.write(() => {
            var ID = uid;
            if (
              realm.objects('user_details').filtered('user_id =' + uid)
                .length > 0
            ) {
              realm.delete(
                realm.objects('user_details').filtered('user_id =' + uid)
              );
              var user_details = realm.objects('user_details');
              console.log(user_details);
              setData(user_details);
              Toast.show('User Deleted Successfuly...', Toast.SHORT, [
                'UIAlertController',
              ]);

            } else {
              alert('No Data For Deletion.');
            }
          });



        },
      },
      ],
      { cancelable: false }
    );
  }

  const textInputChange1 = (val) => {
    setFormData({
      ...formdata,
      user_name: val,
      edit_user_name: val,
    });
  }
  const textInputChange2 = (val) => {
    setFormData({
      ...formdata,
      email: val,
      edit_email: val,
    });
  }
  const textInputChange3 = (val) => {
    setFormData({
      ...formdata,
      password: val,
      edit_password: val,
    });
  }
  const textInputChange4 = (val) => {
    setFormData({
      ...formdata,
      type: val,
      edit_type: val,
    });
  }
  const updateSecureTextEntry = () => {
    setData({
      ...data,
      secureTextEntry: !data.secureTextEntry
    });
  }


  //////////// add new user ///////////

  const addUser = async (user_name, email, password, type) => {
    setData({
      ...data,
      isLoading: true,

    });

    if (formdata.user_name.length == 0  || formdata.email.length == 0 || formdata.password.length == 0 || formdata.type.length == 0) {
      Alert.alert('Wrong Input!', 'Username , Email , password Or Type field cannot be empty.', [
        { text: 'Okay' }
      ]);

      setData({
        ...data,
        isLoading: false,

      });
      return;
    }

    if (formdata.user_name.length < 4 || formdata.password.length < 8 ) {
      Alert.alert('Wrong Input!', 'Username must have minimum 4 character and password must have minimum 8 character.', [
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

        realm.write(() => {
          var ID =
            realm.objects('user_details').sorted('user_id', true).length > 0
              ? realm.objects('user_details').sorted('user_id', true)[0]
                .user_id + 1
              : 1;
          realm.create('user_details', {
            user_id: ID,
            user_name: user_name,
            email: email,
            password: password,
            type: type,


          });

          Toast.show('User Added Successfuly...', Toast.SHORT, [
            'UIAlertController',
          ]);
          getAllUsers();
          setFormData('');
          setModalVisible(!modalVisible);
        });

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
    <SafeAreaView style={{ marginTop: 24 }}>


      <StatusBar
        animated={true}
        backgroundColor="#1c4468"
      />
      <Appbar.Header style={{ backgroundColor: '#1c4468', }}>
        <Appbar.BackAction onPress={_goBack} />
        <Appbar.Content title="Users" />
        <Appbar.Action icon="delete" onPress={() => { deleteConfirm() }} />
        <Appbar.Action icon="plus-circle" onPress={() => { setModalVisible(true) }} />
      </Appbar.Header>

      <StatusBar backgroundColor='#1c4468' barStyle="light-content" />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >

        <View style={styles.centeredView}>
          <View style={styles.modalView}>
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
                value={formdata.user_name}
                autoCapitalize="none"
                onChangeText={(val) => textInputChange1(val)}

              />
            </View>

            <View style={styles.action}>
              <FontAwesome
                name="envelope"
                color={colors.text}
                size={20}
              />
              <TextInput
                placeholder="Email"
                placeholderTextColor="#666666"
                style={[styles.textInput, {
                  color: colors.text
                }]}
                value={formdata.email}
                autoCapitalize="none"
                onChangeText={(val) => textInputChange2(val)}

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
                value={formdata.password}
                autoCapitalize="none"
                onChangeText={(val) => textInputChange3(val)}
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

            <View style={styles.dditem}>
              <Text>Type</Text>
              <DropDownPicker
                items={[
                  { label: 'USER', value: 'USER' },
                  { label: 'ADMIN', value: 'ADMIN' },
                ]}

                containerStyle={{ height: 40 }}
                onChangeItem={item => textInputChange4(item.value)}
              />

            </View>


            <View style={styles.button}>
              <TouchableOpacity
                style={styles.signIn}
                onPress={() => { addUser(formdata.user_name, formdata.email, formdata.password, formdata.type) }}
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
              <TouchableOpacity
                style={styles.signIn}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <LinearGradient
                  colors={['#0083b1', '#1c4468']}
                  style={styles.signIn}
                >
                  <Text style={[styles.textSign, {
                    color: '#fff'
                  }]}>Cancel</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>


          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={editmodalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          seteditModalVisible(!editmodalVisible);
        }}
      >

        <View style={styles.centeredView}>
          <View style={styles.modalView}>
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
                value={formdata.edit_user_name}
                autoCapitalize="none"
                onChangeText={(val) => textInputChange1(val)}

              />
            </View>

            <View style={styles.action}>
              <FontAwesome
                name="envelope"
                color={colors.text}
                size={20}
              />
              <TextInput
                placeholder="Email"
                placeholderTextColor="#666666"
                style={[styles.textInput, {
                  color: colors.text
                }]}
                value={formdata.edit_email}
                autoCapitalize="none"
                onChangeText={(val) => textInputChange2(val)}

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
                value={formdata.edit_password}
                autoCapitalize="none"
                onChangeText={(val) => textInputChange3(val)}
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

            <View style={styles.dditem}>
              <Text>Type</Text>
              <DropDownPicker
                items={[
                  { label: 'USER', value: 'USER' },
                  { label: 'ADMIN', value: 'ADMIN' },
                ]}
                defaultValue={formdata.edit_type}
                containerStyle={{ height: 40 }}
                onChangeItem={item => textInputChange4(item.value)}
              />

            </View>


            <View style={styles.button}>
              <TouchableOpacity
                style={styles.signIn}
                onPress={() => { updateUser(formdata.edit_user_name, formdata.edit_user_id, formdata.edit_email, formdata.edit_password, formdata.edit_type) }}
              >
                <LinearGradient
                  colors={['#0083b1', '#1c4468']}
                  style={styles.signIn}
                >
                  <Text style={[styles.textSign, {
                    color: '#fff'
                  }]}>Update</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.signIn}
                onPress={() => seteditModalVisible(!editmodalVisible)}
              >
                <LinearGradient
                  colors={['#0083b1', '#1c4468']}
                  style={styles.signIn}
                >
                  <Text style={[styles.textSign, {
                    color: '#fff'
                  }]}>Cancel</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>


          </View>
        </View>
      </Modal>

      <View>
        <ScrollView>
          <List style={{ marginBottom: 150 }}>
            <FlatList
              data={data}

              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <ListItem>
                  <Left>
                    <Text>Name: {item.user_name}</Text>
                  </Left>
                  <Right>
                    <View>
                      <Button bordered info>
                        <Icon name='pencil' size={10} onPress={() => {
                          seteditModalVisible(true);

                          setFormData({
                            ...formdata,
                            edit_user_id: item.user_id,
                            edit_user_name: item.user_name,
                            edit_email: item.email,
                            edit_password: item.password,
                            edit_type: item.type,
                          })

                        }} />
                      </Button>
                    </View>
                  </Right>
                { item.user_id!=1 ?
                  <Right>
                  
                    <Button outline danger onPress={() => deleteUserConfirm(item.user_id)}>
                      <Icon name='trash' />
                    </Button>
            
                  </Right>
                  :
                  <Right>
                  
                  <Button outline danger onPress={() => { alert('admin user can not be deleted!') }}>
                    <Icon name='trash' />
                  </Button>
          
                </Right>
                }

                </ListItem>
              )}
            />

          </List>

        </ScrollView>
      </View>
    </SafeAreaView>
  );



}


const { height } = Dimensions.get("screen");
const height_logo = height * 0.28;

const styles = StyleSheet.create({
  ddcontainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingBottom: 10,
    alignItems: 'flex-start' // if you want to fill rows left to right
  },
  dditem: {
    width: '100%', // is 50% of container width
    height: 50,
    paddingLeft: 5,
    paddingTop: 10,
    paddingBottom: 35
  },
  container: {
    flex: 1,
    padding: 20
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

  signIn: {
    width: 100,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    // borderRadius: 50,
    flexDirection: 'row',
    margin: 20
  },
  textSign: {
    color: 'white',
    fontWeight: 'bold'
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 0,
    width: 350,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
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
    backgroundColor: '#fff'
  },
  errorMsg: {
    color: '#FF0000',
    fontSize: 14,
  },
  button: {

    alignItems: 'flex-start',
    marginTop: 50,
    width: 100,
    flexDirection: 'row'
  },
  signIn: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    margin: 10
  },
  textSign: {
    fontSize: 18,
    fontWeight: 'bold'
  }
});

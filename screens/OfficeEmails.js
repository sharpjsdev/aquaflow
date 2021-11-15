import * as React from 'react';
import Header from './Header';
import { useState, useEffect } from 'react';
import { Modal, Pressable } from "react-native";
import { TextInput, Appbar, Title } from 'react-native-paper';
import { Button } from 'native-base';
import Toast from 'react-native-simple-toast';

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
import { useTheme, useIsFocused } from '@react-navigation/native';
import Realm from 'realm';
let realm;
import { useNavigation } from '@react-navigation/native';

export default function OfficeEmails({ route: { params }, navigation }) {


  const [office_id, setOfficeId] = useState();
  const isFocused = useIsFocused();
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



  useEffect(() => {

    if (isFocused) {
      const office_id = params.officeId;

      setOfficeId(office_id);

     var office_emails = realm.objects('office_emails').filtered('office_id =' + office_id);
      var office_details = realmo.objects('office_details').filtered('office_id =' + office_id);
      console.log(office_emails);
      console.log(office_details[0].office_name);
      setOfficeName(office_details[0].office_name);
       var office=office_details[0].office_name
      setData(office_emails);
    }

  }, [isFocused]);


  realm = new Realm({
    path: 'OfficeEmailDatabase.realm', schema: [
      {
        name: 'office_emails',
        properties: {
          office_email_id: { type: 'int', default: 0 },
          office_id: { type: 'int', default: 0 },
          office_email: 'string',
        },
      },
    ],
  });


  const { colors } = useTheme();
  const _goBack = () => navigation.goBack();
  const [modalVisible, setModalVisible] = useState(false);
  const [officeName, setOfficeName] = useState();
  const [editmodalVisible, seteditModalVisible] = useState(false);
  const [data, setData] = useState({
    check_textInputChange: false,
    secureTextEntry: true,
    isValidoffice: true,
    isValidPassword: true,
    isLoading: false,
  });

  const [formdata, setFormData] = useState({
    office_id: '',
    office_email: '',
    office_email_id:'',

    edit_office_id: '',
    edit_office_email_id:'',
    edit_office_email: '',


  });


 ///// Get All Office Emails /////


  const getAllOfficeEmails = async (office_id) => {
    var office_emails = realm.objects('office_emails').filtered('office_id =' + office_id);
    console.log(office_emails);
    setData(office_emails);
  }


   ///// Update Function /////

  const updateOfficeEmail = async (name, uid) => {

    if (!name) {
      Alert.alert('Wrong Input!', 'Name field cannot be empty.', [
        { text: 'Okay' }
      ]);

      return;
    }

    realm.write(() => {
      var ID = uid;
      if (
        realm.objects('office_emails').filtered('office_email_id =' + uid)
          .length > 0
      ) {

        var obj = realm
          .objects('office_emails')
          .filtered('office_email_id =' + uid);
        console.log('obj', obj);
        if (obj.length > 0) {
          obj[0].office_email = name;


        }
        var office_emails = realm.objects('office_emails').filtered('office_id =' + office_id);
        console.log(office_emails);
        setData(office_emails);
        setFormData('');
        seteditModalVisible(!editmodalVisible);
        Toast.show('Email Updated Successfuly...', Toast.SHORT, [
          'UIAlertController',
        ]);

      } else {
        alert('No Data For Deletion.');
      }
    });

  }

   ///// Delete All Office Emails /////

  const deleteConfirm = () => {

    Alert.alert(
      'Are you sure to delete All Emails?',
      'never recover',
      [{ text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
      {
        text: 'Ok',
        onPress: () => {
          realm.write(() => {
            //  var ID = this.state.input_office_id;
            if (
              realm.objects('office_emails').filtered('office_id =' + office_id)
                .length > 0
            ) {
              realm.delete(
                realm.objects('office_emails').filtered('office_id =' + office_id)
              );
              var office_emails = realm.objects('office_emails').filtered('office_id =' + office_id);
              console.log(office_emails);
              setData('');
              Toast.show('All Emails Deleted Successfuly...', Toast.SHORT, [
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


   ///// Delete Single Email /////

  const deleteOfficeConfirm = (uid) => {


    Alert.alert(
      'Are you sure to delete this Email?',
      'never recover',
      [{ text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
      {
        text: 'Ok',
        onPress: () => {
          realm.write(() => {
            var ID = uid;
            if (
              realm.objects('office_emails').filtered('office_email_id =' + uid)
                .length > 0
            ) {
              realm.delete(
                realm.objects('office_emails').filtered('office_email_id =' + uid)
              );
              var office_emails = realm.objects('office_emails').filtered('office_id =' + office_id);
              console.log(office_emails);
              setData(office_emails);
              Toast.show('Office Deleted Successfuly...', Toast.SHORT, [
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
      office_email: val,
      edit_office_email: val,
    });
  }


   /////Add New Office Email /////

  const addOfficeEmail = async (office_email, office_id) => {

    setData({
      ...data,
      isLoading: true,

    });

    if (!formdata.office_email) {
      Alert.alert('Wrong Input!', 'Email field cannot be empty.', [
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
            realm.objects('office_emails').sorted('office_email_id', true).length > 0
              ? realm.objects('office_emails').sorted('office_email_id', true)[0]
                .office_email_id + 1
              : 1;
          realm.create('office_emails', {
            office_email_id: ID,
            office_id: office_id,
            office_email: office_email,

          });

          Toast.show('Email Added Successfuly...', Toast.SHORT, [
            'UIAlertController',
          ]);
          getAllOfficeEmails(office_id);
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
        <Appbar.Content title={officeName} />
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

            <View style={styles.dditem}>
              <Text>Add Email for {officeName}</Text>


            </View>

            <View style={styles.action}>

              <TextInput
                placeholder="office Email"
                placeholderTextColor="#666666"
                style={[styles.textInput, {
                  color: colors.text
                }]}
                value={formdata.office_email}
                autoCapitalize="none"
                onChangeText={(val) => textInputChange1(val)}

              />
            </View>

            <View style={styles.button}>
              <TouchableOpacity
                style={styles.signIn}
                onPress={() => { addOfficeEmail(formdata.office_email, office_id) }}
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
            <View style={styles.dditem}>
              <Text>Add Email for {officeName}</Text>

            </View>
            <View style={styles.action}>
              <TextInput
                placeholder="office Email"
                placeholderTextColor="#666666"
                style={[styles.textInput, {
                  color: colors.text
                }]}
                value={formdata.edit_office_email}
                autoCapitalize="none"
                onChangeText={(val) => textInputChange1(val)}

              />
            </View>





            <View style={styles.button}>
              <TouchableOpacity
                style={styles.signIn}
                onPress={() => { updateOfficeEmail(formdata.edit_office_email, formdata.edit_office_email_id) }}
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
                    <Text>Email: {item.office_email}</Text>
                  </Left>
                  <Right>
                    <View>
                      <Button bordered info>
                        <Icon name='pencil' size={10} onPress={() => {
                          seteditModalVisible(true);

                          setFormData({
                            ...formdata,
                            edit_office_id: item.office_id,
                            edit_office_email_id: item.office_email_id,
                            edit_office_email: item.office_email,

                          })

                        }} />
                      </Button>
                    </View>
                  </Right>
                  <Right>

                    <Button outline danger onPress={() => deleteOfficeConfirm(item.office_email_id)}>
                      <Icon name='trash' />
                    </Button>
                  </Right>


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
    paddingBottom: 85
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

import * as React from 'react';
import Header from './Header';
import { useState, useEffect } from 'react';
import { TextInput, Appbar, Title } from 'react-native-paper';
import { Button } from 'native-base';
import Toast from 'react-native-simple-toast';
import DialogInput from 'react-native-dialog-input';
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
  Image
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import { Container, Content, List, ListItem, SwipeRow, Left, Right, Icon } from 'native-base';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '@react-navigation/native';


import Realm from 'realm';
let realm;


export default function Customer({ navigation }) {
  useEffect(() => {
    var customer_details = realm.objects('customer_details');
    console.log(customer_details);
    setData(customer_details);
  }, []);
  realm = new Realm({
    path: 'CustomerDatabase.realm', schema: [
      {
        name: 'customer_details',
        properties: {
          customer_id: { type: 'int', default: 0 },
          customer_name: 'string',
        },
      },
    ],
  });
  const _goBack = () => navigation.goBack();
  const [text, setText] = React.useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [data, setData] = useState();
  const [isDialogVisible, setDialogVisible] = useState(false);
  const [isEditDialogVisible, setEditDialogVisible] = useState(false);
  const [editCustomername, setEditCustomerName] = useState();
  const [editCustomerID, setEditCustomerID] = useState();
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const showDialog = async (val) => {

    setDialogVisible(val);
  }
  const showEditDialog = async (val) => {

    setEditDialogVisible(val);
  }


  ///// get all customer /////


  const getAllCustomers = async (name) => {
    var customer_details = realm.objects('customer_details');
    console.log(customer_details);
    setData(customer_details);
  }



  ///// add new customer /////


  const addCustomer = async (name) => {

    if (name.length == 0) {
      Alert.alert('Wrong Input!', 'Name field cannot be empty.', [
        { text: 'Okay' }
      ]);

      return;
    }
    console.log(name);
    realm.write(() => {
      var ID =
        realm.objects('customer_details').sorted('customer_id', true).length > 0
          ? realm.objects('customer_details').sorted('customer_id', true)[0]
            .customer_id + 1
          : 1;
      realm.create('customer_details', {
        customer_id: ID,
        customer_name: name,


      });
      setText("");
      setDialogVisible(false);
      Toast.show('Customer Added Successfuly...', Toast.SHORT, [
        'UIAlertController',
      ]);
      getAllCustomers();
    });

  }


  ///// Update customer /////


  const updateCustomer = async (name, uid) => {

    if (name.length == 0) {
      Alert.alert('Wrong Input!', 'Name field cannot be empty.', [
        { text: 'Okay' }
      ]);

      return;
    }
    console.log(name);
    realm.write(() => {
      var ID = uid;
      if (
        realm.objects('customer_details').filtered('customer_id =' + uid)
          .length > 0
      ) {

        var obj = realm
          .objects('customer_details')
          .filtered('customer_id =' + uid);
        console.log('obj', obj);
        if (obj.length > 0) {
          obj[0].customer_name = name;

        }
        var customer_details = realm.objects('customer_details');
        console.log(customer_details);
        setData(customer_details);
        setEditDialogVisible(false);
        Toast.show('Customer Updated Successfuly...', Toast.SHORT, [
          'UIAlertController',
        ]);

      } else {
        alert('No Data For Deletion.');
      }
    });

  }


  ///// delete all customer /////

  const deleteConfirm = () => {

    Alert.alert(
      'Are you sure to delete All Customers?',
      'never recover',
      [{ text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
      {
        text: 'Ok',
        onPress: () => {
          realm.write(() => {
            //  var ID = this.state.input_customer_id;
            if (
              realm.objects('customer_details')
                .length > 0
            ) {
              realm.delete(
                realm.objects('customer_details')
              );
              var customer_details = realm.objects('customer_details');
              console.log(customer_details);
              setData('');
              Toast.show('All Customer Deleted Successfuly...', Toast.SHORT, [
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

  ///// delete single customer /////

  const deleteCustomerConfirm = (uid) => {


    Alert.alert(
      'Are you sure to delete this Customer?',
      'never recover',
      [{ text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
      {
        text: 'Ok',
        onPress: () => {
          realm.write(() => {
            var ID = uid;
            if (
              realm.objects('customer_details').filtered('customer_id =' + uid)
                .length > 0
            ) {
              realm.delete(
                realm.objects('customer_details').filtered('customer_id =' + uid)
              );
              var customer_details = realm.objects('customer_details');
              console.log(customer_details);
              setData(customer_details);
              Toast.show('Customer Deleted Successfuly...', Toast.SHORT, [
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


  return (
    <SafeAreaView style={{ marginTop: 24 }}>


      <StatusBar
        animated={true}
        backgroundColor="#1c4468"
      />
      <Appbar.Header style={{ backgroundColor: '#1c4468', }}>
        <Appbar.BackAction onPress={_goBack} />
        <Appbar.Content title="Add Customer" />
        <Appbar.Action icon="delete" onPress={() => { deleteConfirm() }} />
        <Appbar.Action icon="plus-circle" onPress={() => { showDialog(true) }} />
      </Appbar.Header>

      <StatusBar backgroundColor='#1c4468' barStyle="light-content" />
      <DialogInput isDialogVisible={isDialogVisible}
        title={"Customer Name"}
        submitInput={(inputText) => { addCustomer(inputText) }}
        closeDialog={() => { showDialog(false) }}>
      </DialogInput>
      <DialogInput isDialogVisible={isEditDialogVisible}
        title={"Edit Customer Name"}
        initValueTextInput={editCustomername}
        submitInput={(inputText) => { updateCustomer(inputText, editCustomerID) }}
        closeDialog={() => { showEditDialog(false) }}>
      </DialogInput>
      <View>
        <ScrollView>
          <List style={{ marginBottom: 150 }}>
            <FlatList
              data={data}

              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <ListItem>
                  <Left>
                    <Text>Name: {item.customer_name}</Text>
                  </Left>
                  <Right>
                    <View>
                      <Button bordered info>
                        <Icon name='pencil' size={10} onPress={() => {
                          showEditDialog(true);
                          setEditCustomerName(item.customer_name)
                          setEditCustomerID(item.customer_id)
                        }} />
                      </Button>
                    </View>
                  </Right>
                  <Right>

                    <Button outline danger onPress={() => deleteCustomerConfirm(item.customer_id)}>
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
  button: {
    alignItems: 'flex-end',
    marginTop: -40
  },
  button1: {
    alignItems: 'flex-start',
    marginTop: 30
  },
  signIn: {
    width: 100,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    // borderRadius: 50,
    flexDirection: 'row'
  },
  textSign: {
    color: 'white',
    fontWeight: 'bold'
  }
});

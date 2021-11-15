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


export default function BookmarkScreen({ navigation }) {
  useEffect(() => {
    var user_details = realm.objects('user_details');
    console.log(user_details);
    setData(user_details);
  }, []);
  realm = new Realm({
    path: 'UserDatabase.realm', schema: [
      {
        name: 'user_details',
        properties: {
          user_id: { type: 'int', default: 0 },
          user_name: 'string',
        },
      },
    ],
  });
  const _goBack = () => navigation.goBack();
  const [text, setText] = React.useState('');

  const [data, setData] = useState();
  const [isDialogVisible, setDialogVisible] = useState(false);
  const [isEditDialogVisible, setEditDialogVisible] = useState(false);
  const [editUsername, setEditUsername] = useState();
  const [editUserID, setEditUserID] = useState();

  const showDialog = async (val) => {

    setDialogVisible(val);
  }
  const showEditDialog = async (val) => {

    setEditDialogVisible(val);
  }
  const getAllBooks = async (name) => {
    var user_details = realm.objects('user_details');
    console.log(user_details);
    setData(user_details);
  }
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
        realm.objects('user_details').sorted('user_id', true).length > 0
          ? realm.objects('user_details').sorted('user_id', true)[0]
            .user_id + 1
          : 1;
      realm.create('user_details', {
        user_id: ID,
        user_name: name,


      });
      setText("");
      setDialogVisible(false);
      Toast.show('Customer Added Successfuly...', Toast.SHORT, [
        'UIAlertController',
      ]);
      getAllBooks();
    });

  }

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
        realm.objects('user_details').filtered('user_id =' + uid)
          .length > 0
      ) {

        var obj = realm
          .objects('user_details')
          .filtered('user_id =' + uid);
        console.log('obj', obj);
        if (obj.length > 0) {
          obj[0].user_name = name;

        }
        var user_details = realm.objects('user_details');
        console.log(user_details);
        setData(user_details);
        setEditDialogVisible(false);
        Toast.show('Customer Updated Successfuly...', Toast.SHORT, [
          'UIAlertController',
        ]);

      } else {
        alert('No Data For Deletion.');
      }
    });

  }

  const deleteConfirm = () => {

    Alert.alert(
      'Are you sure to delete All Customers?',
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
              realm.objects('user_details').filtered('user_id =' + uid)
                .length > 0
            ) {
              realm.delete(
                realm.objects('user_details').filtered('user_id =' + uid)
              );
              var user_details = realm.objects('user_details');
              console.log(user_details);
              setData(user_details);
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
        initValueTextInput={editUsername}
        submitInput={(inputText) => { updateCustomer(inputText, editUserID) }}
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
                    <Text>Name: {item.user_name}</Text>
                  </Left>
                  <Right>
                    <View>
                      <Button bordered info>
                        <Icon name='pencil' size={10} onPress={() => {
                          showEditDialog(true);
                          setEditUsername(item.user_name)
                          setEditUserID(item.user_id)
                        }} />
                      </Button>
                    </View>
                  </Right>
                  <Right>

                    <Button outline danger onPress={() => deleteCustomerConfirm(item.user_id)}>
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

import * as React from 'react';
import { Appbar,Title } from 'react-native-paper';
import { Platform,SafeAreaView,StatusBar ,Text,View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Header = (props) => {
  const navigation = useNavigation();
  const _goBack = () => navigation.goBack();


  return (
    <SafeAreaView style={{marginTop: 24,backgroundColor:'#1c4468',}}>
            <StatusBar
        animated={true}
        backgroundColor="#1c4468"
         />
    <Appbar.Header style={{backgroundColor:'#1c4468',}}>
    <Appbar.BackAction onPress={_goBack} />
    <Appbar.Content title={props.title} />
  </Appbar.Header>
  </SafeAreaView >
  );
};

export default Header;
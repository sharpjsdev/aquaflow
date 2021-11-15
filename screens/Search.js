import * as React from 'react';
import { Appbar , Title} from 'react-native-paper';
import { Text,View } from 'react-native';
import Header from './Header';
const Seacrh = () => {
  const _goBack = () => console.log('Went back');

  const _handleSearch = () => console.log('Searching');

  const _handleMore = () => console.log('Shown more');

  return (
    <View style={{flex:1}}>
     <Header name="Search Screen" />
     <Text>Search Screen</Text>
    </View>
  );
};

export default Seacrh;
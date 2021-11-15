import * as React from 'react';
import { Appbar , Title} from 'react-native-paper';
import { StyleSheet, Text, View ,Button,PermissionsAndroid} from 'react-native';

	export default function DetailsScreen({navigation}) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Details Screen</Text>
      <Button title="Go to Details Screen..again" onPress={()=> navigation.push("Details")} />
      <Button title="Go to Details Home" onPress={()=> navigation.navigate("Home")} />
      <Button title="Go Back" onPress={()=> navigation.goBack()} />

    </View>
  );
}
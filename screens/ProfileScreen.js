import * as React from 'react';
import { Appbar , Title} from 'react-native-paper';
import { StyleSheet, Text,TouchableHighlight, View ,Button,PermissionsAndroid} from 'react-native';
import { createPDF } from '../lib/createPDF';

	export default function ProfileScreen({navigation}) {

    const [values, setData] = React.useState({
      guest: 'nadeem',
      date: '30-01-1991',
  });

  // const   createPDF= async() => { 
  //     let options = {
  //       html: '<h1>PDF TEST</h1>',
  //       fileName: 'test',
  //       directory: 'Documents',
  //     };
  
  //     let file = await RNHTMLtoPDF.convert(options)
  //     // console.log(file.filePath);
  //     alert(file.filePath);
  //   }

   const getPdfSource = async (data) => {
     console.log(data.guest);
      const file = await createPDF(data);
      const pdfSource = {
        uri: file.filePath
      };
      return pdfSource;
    };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Profile Screen</Text>
     <TouchableHighlight onPress={getPdfSource}>
          <Text>Create PDF</Text>
        </TouchableHighlight>
    </View>
  );
}
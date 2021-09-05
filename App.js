/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View, PermissionsAndroid
} from 'react-native';
import Clipboard from '@react-native-community/clipboard';

import RNFetchBlob from 'rn-fetch-blob'
import ytdl from "react-native-ytdl"




const App = () => {
  const [text, setText] = useState('')

  const copyURL = async () => {
    const text = await Clipboard.getString();
    console.log('==text', text)
    setText(text)
  }
  const downloadURL = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission Required',
          message:
            'Application needs access to your storage to download File',
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // Start downloading
        downloadFile();
      }
    } catch (e) {
      alert(JSON.stringify(e))
    }
  }
  const downloadFile = async () => {
    try {

      const youtubeURL = text;
      const urls = await ytdl(youtubeURL, { quality: 'highest' });
      console.log("======urls", urls[0].url)
      const downURL = urls[0].url
      const { config, fs } = RNFetchBlob
      let date = new Date()
      // console.log('===========fs', fs.dirs)
      let DownloadDir = fs.dirs.DownloadDir // this is the pictures directory. You can check the available directories in the wiki.
      let options = {
        fileCache: true,
        appendExt: '.mp4',
        addAndroidDownloads: {
          useDownloadManager: true, // setting it to true will use the device's native download manager and will be shown in the notification bar.
          notification: true,
          path: DownloadDir + "/video" + Math.floor(date.getTime() + date.getSeconds() / 2) + '.mp4', // this is the path where your downloaded file will live in
          description: 'Downloading video.'
        }
      }
      console.log('=========PictureDir', DownloadDir)
      config(options).fetch('GET', downURL).then((res) => {
        console.log('===========res', res)
      })
    } catch (e) {
      console.log(e)
      alert(JSON.stringify(e))
      throw e
    }

  }


  const Button = (props) => {
    return (
      <TouchableOpacity style={{ backgroundColor: '#50bcbf', margin: 20, width: '90%', height: '20%', justifyContent: 'center' }} onPress={props.onPress}>
        <Text style={{ fontSize: 30, textAlign: 'center', color: '#fff' }}>{props.buttonText}</Text>
      </TouchableOpacity>
    )
  }

  return (
    <SafeAreaView style={[{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }]}>
      <Button
        buttonText={'Click to paste the URL'}
        onPress={copyURL} />

      <View style={{ width: '80%' }}>
        <TextInput
          style={{
            height: 40,
            margin: 12,
            borderWidth: 1,
          }}
          onChangeText={(text) => setText(text)}
          value={text}
        />
      </View>
      <Button
        onPress={downloadURL}
        buttonText={'Download'} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;

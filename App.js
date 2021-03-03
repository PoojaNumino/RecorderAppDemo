import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import AudioRecorderPlayer, { AVEncoderAudioQualityIOSType, AVEncodingOption, AudioEncoderAndroidType, AudioSet, AudioSourceAndroidType, } from 'react-native-audio-recorder-player';
import {check, PERMISSIONS, RESULTS,request} from 'react-native-permissions';
import {MICROPHONE} from 'react-native-permissions';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    isLoggingIn: false,
    recordSecs: 0,
    recordTime: '00:00:00',
    currentPositionSec: 0,
    currentDurationSec: 0,
    playTime: '00:00:00',
    duration: '00:00:00',
    };
    this.audioRecorderPlayer = new AudioRecorderPlayer();
    this.audioRecorderPlayer.setSubscriptionDuration(0.01); // optional. Default is 0.1
    request(PERMISSIONS.IOS.MICROPHONE).then(response => {
      console.log(response);
      console.log('Added permission)');

    });
    check(PERMISSIONS.IOS.MICROPHONE)
  .then((result) => {
    switch (result) {
      case RESULTS.UNAVAILABLE:
        console.log('This feature is not available (on this device / in this context)');
        break;
      case RESULTS.DENIED:
        console.log('The permission has not been requested / is denied but requestable');
        break;
      case RESULTS.LIMITED:
        console.log('The permission is limited: some actions are possible');
        break;
      case RESULTS.GRANTED:
        console.log('The permission is granted');
        break;
      case RESULTS.BLOCKED:
        console.log('The permission is denied and not requestable anymore');
        break;
    }
  })
  .catch((error) => {
    // …
  });
  };
    

  handleClick() {
    alert('Button clicked!');
  };

  onStartRecord = async () => {
    const result = await this.audioRecorderPlayer.startRecorder();
    this.audioRecorderPlayer.addRecordBackListener((e) => {
      this.setState({
        recordSecs: e.current_position,
        recordTime: this.audioRecorderPlayer.mmssss(
          Math.floor(e.current_position),
        ),
      });
      return;
    });
    console.log(result);
  };
  
  onStopRecord = async () => {
    const result = await this.audioRecorderPlayer.stopRecorder();
    this.audioRecorderPlayer.removeRecordBackListener();
    this.setState({
      recordSecs: 0,
    });
    console.log(result);
  };
  
  onStartPlay = async () => {
    console.log('onStartPlay');
    const msg = await this.audioRecorderPlayer.startPlayer();
    console.log(msg);    
    this.audioRecorderPlayer.addPlayBackListener((e) => {
      this.setState({
        currentPositionSec: e.current_position,
        currentDurationSec: e.duration,
        playTime: this.audioRecorderPlayer.mmssss(Math.floor(e.current_position)),
        duration: this.audioRecorderPlayer.mmssss(Math.floor(e.duration)),
      });
      return;
    });
  };
  
  onPausePlay = async () => {
    await this.audioRecorderPlayer.pausePlayer();
  };
  
  onStopPlay = async () => {
    console.log('onStopPlay');
    this.audioRecorderPlayer.stopPlayer();
    this.audioRecorderPlayer.removePlayBackListener();
  };
  onResetPlayer = async () => {
    const reset = () => {
      recorderRef.current = new AudioRecorderPlayer();
      unlink(fileUrl); // unlink from react-native-fs
    }; 
   };


  render() {
    return (
      <View>
        <Text style={{ fontSize: 20, alignSelf: "center", top: 100 }}>Audio Recorder</Text>

        <View style={{ height: 100, marginTop: 200, alignSelf: "center" }}>

          <Text style={{ fontSize: 15, alignSelf: "center" }}>{this.state.recordTime}</Text>
          <View style={{ flexDirection: "row" }}>
            <Button title='Record' onPress={() => { this.onStartRecord() }} />
            <Button title='Stop' onPress={() => { this.onStopRecord() }} />
          </View>
        </View>

        <View style={{ height: 100, marginTop: 50, alignSelf: "center" }}>

        <Text style={{ fontSize: 15, alignSelf: "center"}}>{this.state.playTime} / {this.state.duration}</Text>
          <View style={{ flexDirection: "row" }}>
          <Button title='Play' onPress={() => { this.onStartPlay() }} />
          <Button title='Pause' onPress={() => { this.onPausePlay() }} />
          <Button title='Stop Play' onPress={() => { this.onStopPlay() }} />
          </View>
        </View>
        {/* <Button title='Reset Player' onPress={() => { this.onResetPlayer() }} /> */}

      </View>
      
    )
  }
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    flex: 1,
  }
});

export default App;

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity, Linking,} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';


type Props = {};
export default class App extends Component<Props> {

  onSuccess = (e) => {
    alert(e.data);
  }

  resetScanner = (s) => {
    this.scanner.reactivate();
  }

  render() {
    return (
      <View style={styles.container}>

        <QRCodeScanner
          ref={(node) => { this.scanner = node }}
          onRead={this.onSuccess.bind(this)}
          topContent={
            <Text style={styles.centerText}>
              Escaneie o QRCode
            </Text>
          }
          bottomContent={
            <TouchableOpacity style={styles.buttonTouchable} onPress = { this.resetScanner.bind(this) }>
              <Text style={styles.buttonText}>Resetar</Text>
            </TouchableOpacity>
          }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777',
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)',
  },
  buttonTouchable: {
    padding: 16,
  },
});

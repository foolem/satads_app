import React, {Component} from 'react';
import { Icon } from 'react-native-elements';
import FlashMessage from "react-native-flash-message";
import { showMessage } from "react-native-flash-message";
import {Platform, StyleSheet, Text, View, TouchableOpacity, Button} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import axios from 'axios';

export default class Scanner extends React.Component {
  constructor(props) {
    super(props);
  }

  onSuccess = (e) => {

    const request = axios({
      method: 'get',
      url: `https://satads-staging.herokuapp.com/api/v1/participantes/${e.data}/check_in/${this.props.type}/${this.props.itemId}`,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      params: {
        'access-token': this.props.auth.token,
        'uid': this.props.auth.uid,
        'client': this.props.auth.client
      }
    });

    request.then((response) => {
      if (response.status == 200) {
        showMessage({
          message: "Check-in realizado com sucesso!",
          type: "success",
          icon: "auto"
        });
      } else {
        showMessage({
          message: "Alguma coisa deu errado. Tente novamente",
          type: "warning",
          icon: "auto"
        });
      }
    });

  }

  resetScanner = () => {
    this.scanner.reactivate();
  }

  render() {
    return (
      <View style={ styles.container }>

        <QRCodeScanner
          ref={(node) => { this.scanner = node }}
          onRead={ this.onSuccess.bind(this) }
          topContent={
            <Text style={ styles.centerText }>
            Escaneie o QRCode
            </Text>
          }
          bottomContent={
            <TouchableOpacity
              style={ styles.buttonTouchable }
              onPress={() => this.resetScanner()}
            >
              <Icon
                name='repeat'
                type='feather'
                color={ '#381c7d' }
                size={ 30 }
              />
            </TouchableOpacity>
          }
          />
        <FlashMessage ref="scannerFlash" position="top" duration={2500} />
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

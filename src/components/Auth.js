import React from 'react';
import { Button, Text, View, TextInput, StyleSheet, Image, StatusBar, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { AsyncStorage } from "react-native"


export default class Auth extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      email: 'satads2018@gmail.com',
      password: 'integracao2018',
      auth: {
        uid: null,
        token: null,
        client: null,
      }
    }
  }

  componentDidMount = () => {
    this.handleLogin();
  }

  _storeData = async () => {
    try {
      await AsyncStorage.setItem('@satads_app:auth', JSON.stringify(this.state.auth));
    } catch (error) {
      alert('erro');
    }
  }

  handleLogin = () => {
    const request = axios({
      method: 'post',
      url: 'https://satads.herokuapp.com/api/v1/auth/sign_in',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      params: {
        email: this.state.email,
        password: this.state.password,
      }
    });

    request.then((response) => response.headers).
    then((headers) => {
      this.setState({
        auth: {
          token: headers['access-token'],
          uid: headers['uid'],
          client: headers['client']
        }
      }, () => {
        this._storeData();
      });
      this.props.navigation.navigate('Home');
    });
  }

  render() {
    return (
      <View style={ styles.whiteContainer }>
        <StatusBar
           backgroundColor="#5826a1"
           barStyle="light-content"
         />
        <View style={ styles.header }>
          <Image
            source={ require('../images/hashtag.png') }
            style={ styles.hashtag }
          />
        </View>
        <View style={ styles.loader }>
          <ActivityIndicator size={ 100 } color="#5826a1" />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  whiteContainer: {
    backgroundColor: '#fff',
    height: '100%',
  },
  header: {
    width: '100%',
    height: 70,
    backgroundColor: '#5826a1',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  hashtag: {
    width: 50,
    height: 50
  },
  loader: {
    paddingTop: 200
  }
});

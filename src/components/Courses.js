import React from 'react';
import { Icon } from 'react-native-elements';
import { Button, Text, View, TextInput, FlatList, StyleSheet, Image, StatusBar, TouchableOpacity, Dimensions } from 'react-native';
import { AsyncStorage } from "react-native";
import Modal from "react-native-modal";
import axios from 'axios';
import Scanner from './Scanner';

export default class Courses extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      auth: {
        token: null,
        uid: null,
        client: null,
      },
      modalVisible: false,
      itemId: null
    }
  }

  componentDidMount = () => {
    this._getAuth();
    this.getCourses();
  }

  _getAuth = async () => {
    const got_auth = await AsyncStorage.getItem('@satads_app:auth');
    const authentication = JSON.parse(got_auth);
    this.setState({
      auth: {
        token: authentication.token,
        uid: authentication.uid,
        client: authentication.client,
      }
    });
  }

  getCourses = () => {
    const request = axios({
      method: 'get',
      url: 'https://satads.herokuapp.com/api/v1/cursos',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      params: {
        'access-token': this.state.auth.token,
        'uid': this.state.auth.uid,
        'client': this.state.auth.client
      }
    });

    request.then((response) => {
      let courses = []

      let width = Dimensions.get('window').width
      let lastChar
      if (width > 320) {
        lastChar = 31
      } else {
        lastChar = 24
      }

      for (i = 0; i < response.data.length; i++) {
        let name = response.data[i].name.substring(0, lastChar)
        if (response.data[i].name.length > lastChar) {
          name += '...'
        }
        courses.push({key: response.data[i].id.toString(), name: name })
      }

      this.setState({
        courses: courses
      });

    });
  }

  toggleModal = () => {
    this.setState({
      modalVisible: !this.state.modalVisible
    })
  }

  handlePress = (id) => {
    this.setState({
      itemId: id,
    }, () => {
      this.toggleModal()
    })
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
            source={require('../images/hashtag.png')}
            style={ styles.hashtag }
          />
        </View>
        <FlatList
        contentContainerStyle={ styles.container }
          data={ this.state.courses }
          renderItem={({ item }) =>
            <View style={ styles.course }>
              <Text style={ styles.courseTitle }>{ item.name }</Text>
              <TouchableOpacity style={ styles.icon } onPress= { () => this.handlePress(item.key) }>
                <Icon
                  name='qrcode-scan'
                  type='material-community'
                  color={ '#381c7d' }
                  size={ 22 }
                />
              </TouchableOpacity>
            </View>
          }
        />
        <Modal
          isVisible={ this.state.modalVisible }
          animationIn= 'slideInRight'
          animationOut= 'slideOutLeft'
          onBackdropPress={ () => this.toggleModal() }
          onSwipe={ () => this.toggleModal() }
          swipeDirection="right"
        >
          <Scanner auth={ this.state.auth } itemId={ this.state.itemId } type="curso" />
        </Modal>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  whiteContainer: {
    backgroundColor: '#fff',
    height: '100%'
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
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  course: {
    minWidth: '90%',
    maxWidth: '95%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    color: '#000',
    backgroundColor: '#fff',
    borderRadius: 28,
    elevation: 3,
    paddingLeft: 15,
    marginHorizontal: 10,
    marginVertical: 15
  },
  courseTitle: {
    fontSize: 15,
  },
  icon: {
    paddingTop: 19,
    paddingRight: 19,
    paddingBottom: 19,
    paddingLeft: 5,
  }
});

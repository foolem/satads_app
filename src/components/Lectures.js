import React from 'react';
import { Icon } from 'react-native-elements';
import { Button, Text, View, TextInput, FlatList, StyleSheet, Image, StatusBar, TouchableOpacity, Dimensions, RefreshControl } from 'react-native';
import { AsyncStorage } from "react-native";
import Modal from "react-native-modal";
import axios from 'axios';
import Scanner from './Scanner';

export default class Lectures extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      auth: {
        token: null,
        uid: null,
        client: null,
      },
      modalVisible: false,
      itemId: null,
      lectures: null,
      refreshing: false
    }
  }

  componentDidMount = () => {
    this._getAuth();
    this.getLectures();
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

  getLectures = () => {
    const request = axios({
      method: 'get',
      url: 'https://satads.herokuapp.com/api/v1/palestras',
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
      let lectures = []
      let turn = ""
      let divided = false

      let width = Dimensions.get('window').width
      let lastChar
      if (width > 320) {
        lastChar = 31
      } else {
        lastChar = 25
      }

      for (i = 0; i < response.data.length; i++) {
        let name = response.data[i].name.substring(0, lastChar)
        if (response.data[i].name.length > lastChar) {
          name += '...'
        }

        if (divided == false && response.data[i].turn == 'night') {
          lectures.push({key: 'divisor' })
          lectures.push({key: response.data[i].id.toString(), name: name })
          divided = true
        } else {
          if (i == 0) {
            lectures.push({key: 'first' })
            lectures.push({key: response.data[i].id.toString(), name: name })
          } else {
            lectures.push({key: response.data[i].id.toString(), name: name })
          }
        }

      }

      this.setState({
        day: `Dia ${response.data[0].day}`,
      })

      this.setState({
        lectures: lectures
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

  lectureView = (item) => {
    if (item.key == "first") {
      return (<Text style={ styles.dividerTitle }> Tarde </Text>);
    } else
    if (item.key == "divisor") {
      return (<View><View style={ styles.dividerLine }></View>
              <Text style={ styles.dividerTitle }> Noite </Text></View>
      );
    } else {
      return (
        <View style={ styles.lecture }>
          <Text style={ styles.lectureTitle }>{ item.name }</Text>
            <TouchableOpacity style={ styles.icon } onPress= { () => this.handlePress(item.key) }>
              <Icon
              name='qrcode-scan'
              type='material-community'
              color={ '#381c7d' }
              size={ 22 }
              />
          </TouchableOpacity>
        </View>
      );
    }
  }

  onRefresh = () => {
    this.setState({ refreshing: true });
    this.getLectures();
    this.setState({ refreshing: false });
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
        <Text style={ styles.currentDay }> { this.state.day } </Text>
        <FlatList
        contentContainerStyle={ styles.container }
          data={ this.state.lectures }
          renderItem={ ({ item }) =>
            this.lectureView(item)
          }
          refreshControl={
            <RefreshControl
              refreshing={ this.state.refreshing }
              onRefresh={ () => this.onRefresh() }
            />
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
          <Scanner auth={ this.state.auth } itemId={ this.state.itemId } type="palestra" />
        </Modal>
      </View>
    );
  };
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
  currentDay: {
    textAlign: 'center',
    fontSize: 35,
    padding: 20,
    fontWeight: '100',
    color: '#5826a1',
  },
  hasNotLectures: {
    textAlign: 'center',
    fontSize: 25,
    paddingHorizontal: 30,
    paddingVertical: 60,
    fontWeight: '100',
  },
  container: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  lecture: {
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
  lectureTitle: {
    fontSize: 15,
  },
  icon: {
    paddingTop: 19,
    paddingRight: 19,
    paddingBottom: 19,
    paddingLeft: 5,
  },
  dividerLine: {
    marginVertical: 40,
    width: 280,
    height: 1,
    borderTopWidth: 1,
    borderColor: 'rgb(222, 222, 222)'
  },
  dividerTitle: {
    fontSize: 20,
    paddingBottom: 20,
    textAlign: 'center'
  }
});

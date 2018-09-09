import React from 'react';
import { createStackNavigator, createSwitchNavigator, createBottomTabNavigator } from 'react-navigation';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import { Icon } from 'react-native-elements';
import axios from 'axios';
import { AsyncStorage } from "react-native"
import Auth from './src/components/Auth';
import Lectures from './src/components/Lectures';
import Courses from './src/components/Courses';
import Scanner from './src/components/Scanner';

const AppStack = createMaterialBottomTabNavigator(
  {
    Palestras: {
      screen: Lectures,
      navigationOptions: () => ({
	      tabBarIcon: () => {
		      return <Icon
            name='microphone'
            type='material-community'
            color={ '#fff' }
            size={ 25 }
          />
        }
      })
    },
    Cursos: {
      screen: Courses,
      navigationOptions: () => ({
	      tabBarIcon: () => {
		      return <Icon
            name='book-open-page-variant'
            type='material-community'
            color={ '#fff' }
            size={ 25 }
          />
        }
      })
    }
  }, { barStyle: { backgroundColor: '#5826a1' } });

const RootStack = createSwitchNavigator(
  {
    Auth: Auth,
    Home: AppStack,
  },
  {
    initialRouteName: 'Auth',
  }
);

export default class App extends React.Component {
  render() {
    return <RootStack />;
  }
}

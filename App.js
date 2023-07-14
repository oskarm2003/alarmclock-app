import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, StatusBar, Platform } from 'react-native';
import { useState } from 'react';
import * as Font from "expo-font";
import Hello from './components/Hello';
import Alarms from './components/Alarms';
import CreateAlarm from './components/CreateAlarm';
import Ring from './components/Ring';
import Database from './components/Database';

const Stack = createNativeStackNavigator()

const opts = {
  headerStyle: {
    backgroundColor: '#ffffff',
  },
  headerTitleStyle: {
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  headerTintColor: '#000000'
}

export default function App() {

  //create database table
  Database.createTable()

  //asynchronous font loading and then updating component
  const fontLoader = async () => {
    await Font.loadAsync({
      'montserrat': require('./assets/fonts/montserrat.ttf'),
      'secular': require('./assets/fonts/secular.ttf')
    })
    setLoaded(true)
  }

  const [loaded, setLoaded] = useState(false)
  fontLoader()

  if (loaded) {
    return (
      <>
        <StatusBar />
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name='hello' component={Hello} options={opts} />
            <Stack.Screen name='alarms' component={Alarms} options={opts} />
            <Stack.Screen name='create alarm' component={CreateAlarm} options={opts} />
            <Stack.Screen name='ringing!' component={Ring} options={opts} />
          </Stack.Navigator>
        </NavigationContainer>
      </>)
  } else {
    return (
      <>
        <StatusBar />
        <ActivityIndicator size='large' color='#000000' style={{ flex: 1 }}></ActivityIndicator>
      </>
    )
  }
}

//import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Dimensions, Text, View } from 'react-native';
import Chat from './components/Chat';
import Start from './components/Start';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
//import { createBottomTabNavigator } from "@react-navigation/stack";
//import { Alert } from 'react-native';

const Stack = createStackNavigator();
var width = Dimensions.get("window").width;


export default class App extends React.Component {
  constructor(props) {
    super(props);
    
  }
 //alertMyText(input = [] ) {
  // Alert.alert(input.text) }

  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Screen1">
          <Stack.Screen
            name="Start"
            component={Start}
            options={{
              headerTransparent: true,
              headerTintColor: "#555",
              headerStyle: {
                backgroundColor: "#555",
              },
              headerTitleStyle: {
                color: "white",
              },
            }}
          />
          <Stack.Screen
            name="Chat"
            component={Chat}
            options={{
              headerTransparent: false,
              headerTintColor: "#555",
              headerStyle: {
                backgroundColor: "#222",
                // borderBottomColor: "#333",
                // borderBottomWidth: 2,
              },
              headerTitleStyle: {
                color: "#aaa",
                borderBottomColor: "#333",
                borderBottomWidth: 1,
                width: width / 1.48,
              },
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

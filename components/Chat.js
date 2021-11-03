import React from 'react';
import { View, Text, Button, ImageBackground, TextInput, StyleSheet} from 'react-native';


export default class Chat extends React.Component {
  render() {
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });

    return (
      <View style={{flex:1, justifyContent: 'center', alignItems: 'center', backgroundColor: "yellow"}}>
        <Button
        title="Go to Start"
        onPress={() => this.props.navigation.navigate("Start")}
        />
        <Text>Hello Screen2!</Text>
      </View>
    )
  }
}

// Styles for Chat view
const styles = StyleSheet.create({
  bgImage: {
    flex: 1,
    width: "100%",
    flexDirection: "column",
  },
  loadingMsg: {
    color: "#fff",
    textAlign: "center",
    margin: "auto",
    fontSize: 12,
    paddingVertical: 10,
  },
});
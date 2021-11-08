import React from 'react';
import { View, Platform, Text, Button, KeyboardAvoidingView, ImageBackground, TextInput, StyleSheet} from 'react-native';
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import firebase from 'firebase';
import firestore from 'firebase';




export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      lists: [],
      uid: 0,
      loggedInText: 'Please wait, you are getting logged in',
    };
    if (!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: "AIzaSyBaRJqzR1n4jS7yK9I5LdfZSXwvO77dLVI",
        authDomain: "chat-app-42a9d.firebaseapp.com",
        projectId: "chat-app-42a9d",
        storageBucket: "chat-app-42a9d.appspot.com",
        messagingSenderId: "684312775295",
        appId: "1:684312775295:web:d310c1aec8113849d00d4a"
      });
    } 
    
    this.referenceShoppinglistUser = null;
  }

  onCollectionUpdate = (querySnapshot) => {
    const lists = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      let data = doc.data();
      lists.push({
        name: data.name,
        items: data.items.toString(),
      });
    });
    this.setState({ 
      lists,
   });
  }

  addList() { 
    // add a new list to the collection
    this.referenceShoppingLists.add({
      name: 'TestList',
      items: ['eggs', 'pasta', 'veggies'],
      uid: this.state.uid,
    });
  }
renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#2f2f2fb8",
          },
          left: {
            backgroundColor: "#ffffffd9",
          },
        }}
      />
    );
  }
  render() {
    
    return (
      <View style={styles.container}>

        <Text>{this.state.loggedInText}</Text>

        <Text style={styles.text}>All Shopping lists</Text>
        <FlatList
            data={this.state.lists}
            renderItem={({ item }) => 
              <Text style={styles.item}>{item.name}: {item.items}</Text>}
          />

        <Button 
          onPress={() => {
            this.addList();
          }}
          title = "Add something"
        />
      </View>
    );
  }
  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
  }
  componentDidMount() {
    this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        firebase.auth().signInAnonymously();
      }
      this.setState({
        uid: user.uid,
        messages: [],
      });
      // listen for collection changes for current user
this.unsubscribeListUser = this.referenceShoppinglistUser.onSnapshot(this.onCollectionUpdate);
    });
  }
render() {
  //let name = this.props.route.previousState.params.name;
  //this.props.navigation.setOptions({ title: name });

    return (
      <View style={{ flex: 1 }}>
      <GiftedChat
      renderBubble={this.renderBubble.bind(this)}
      messages={this.state.messages}
      onSend={(messages) => this.onSend(messages)}
            user={{
              name: this.state.name,
              _id: this.state.user._id,
              avatar: this.state.user.avatar,
      }}
    />
        {Platform.OS === "android" ? (
          <KeyboardAvoidingView behavior="height" />
        ) : null}
      </View>
    );
  }
  componentWillUnmount() {
    // stop listening to authentication
    this.authUnsubscribe();
    // stop listening for changes
    this.unsubscribeListUser();
  }
}
  
  
  




// Styles for Chat view
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 40,      
  },
  item: {
    fontSize: 20,
    color: 'blue',
  },
  text: {
    fontSize: 30,
  }
});


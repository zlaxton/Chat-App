import React, { Component } from "react";
import { StyleSheet, View, Platform, KeyboardAvoidingView } from "react-native";
import {
  Bubble,
  GiftedChat,
  SystemMessage,
  InputToolbar,
} from "react-native-gifted-chat";
import MapView from "react-native-maps";
import CustomActions from "./CustomActions";
import firebase from "firebase/app";
//import "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      uid: 0,
      user: {
        _id: "",
        name: "",
        avatar: "",
      },
      isConnected: false,
      image: null,
      location: null,
    };

    // Firebase config details
    const firebaseConfig = {
      apiKey: "AIzaSyBaRJqzR1n4jS7yK9I5LdfZSXwvO77dLVI",
      authDomain: "chat-app-42a9d.firebaseapp.com",
      projectId: "chat-app-42a9d",
      storageBucket: "chat-app-42a9d.appspot.com",
      messagingSenderId: "684312775295",
      appId: "1:684312775295:web:d310c1aec8113849d00d4a",
    };
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    this.referenceChatMessages = firebase.firestore().collection("messages");
    this.referenceMessageUser = null;

    this.state = {
      messages: [],
      uid: 0,
      user: {
        _id: "",
        name: "",
      },
      isConnected: false,
      image: null,
      location: null,
    };
  }

  componentDidMount() {
    const { name } = this.props.route.params;
    this.props.navigation.setOptions({ title: `${name}` });

    // Check if user is online or offline
    NetInfo.fetch().then((connection) => {
      if (connection.isConnected) {
        this.setState({ isConnected: true });
        console.log("online");

        // listen to authentication events
        this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
          if (!user) {
            firebase.auth().signInAnonymously();
          }

          // Update user state with active user
          this.setState({
            uid: user.uid,
            messages: [],
            user: {
              _id: user.uid,
              name: name,
            },
          });
          // Create reference to the active users messages
          this.referenceMessagesUser = firebase
            .firestore()
            .collection("messages")
            .where("uid", "==", this.state.uid);
          // Listen for collection changes
          this.unsubscribe = this.referenceChatMessages
            .orderBy("createdAt", "desc")
            .onSnapshot(this.onCollectionUpdate);
        });
      } else {
        console.log("offline");
        this.setState({ isConnected: false });
        // Calls messeages from offline storage
        this.getMessages();
      }
    });
  }
  componentWillUnmount() {
    this.authUnsubscribe();
    this.authUnsubscribe();
  }

  //Loads messages from AsyncStorage
  async getMessages() {
    let messages = "";
    try {
      messages = (await AsyncStorage.getItem("messages")) || [];
      this.setState({
        messages: JSON.parse(messages),
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  //Delete messages from AsyncStorage
  async deleteMessages() {
    try {
      await AsyncStorage.removeItem("messages");
      this.setState({
        messages: [],
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  // Add messages to database
  addMessages() {
    const message = this.state.messages[0];
    // add a new messages to the collection
    this.referenceChatMessages.add({
      uid: this.state.uid,
      _id: message._id,
      createdAt: message.createdAt,
      text: message.text || null,
      user: message.user,
      image: message.image || null,
      location: message.location || null,
    });
  }

  // Save Messages to local storage
  async saveMessages() {
    try {
      await AsyncStorage.setItem(
        "messages",
        JSON.stringify(this.state.messages)
      );
    } catch (error) {
      console.log(error.message);
    }
  }

  // Funciton to send messages
  onSend(messages = []) {
    this.setState(
      (previousState) => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }),
      // Make sure to call addMessages so they get saved to the server
      () => {
        this.addMessages();
        // Calls function saves to local storage
        this.saveMessages();
      }
    );
  }

  // Retrieve current messages and store them in the state: messages
  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      let data = doc.data();
      messages.push({
        _id: data._id,
        createdAt: data.createdAt.toDate(),
        text: data.text || "",
        user: {
          _id: data.user._id,
          name: data.user.name,
        },
        image: data.image || null,
        location: data.location || null,
      });
    });
    this.setState({
      messages,
    });
  };

  // Sets System Message color
  renderSystemMessage(props) {
    let backgroundColor = this.props.route.params.backgroundColor;
    if (backgroundColor !== "#FFFFFF") {
      return (
        <SystemMessage
          {...props}
          textStyle={{ color: "#FFFFFF" }}
          timeTextStyle={{ color: "#FFFFFF" }}
        />
      );
    }
  }

  //If offline, dont render the input toolbar
  renderInputToolbar(props) {
    if (this.state.isConnected === false) {
    } else {
      return <InputToolbar {...props} />;
    }
  }

  // Sets message bubble color
  renderBubble(props) {
    let backgroundColor = this.props.route.params.backgroundColor;
    if (backgroundColor === "#FFFFFF") {
      return (
        <Bubble
          {...props}
          wrapperStyle={{
            right: { backgroundColor: "#2d63d3" },
            left: { backgroundColor: "#7e7e7e" },
          }}
          textProps={{
            style: { color: "white" },
          }}
          timeTextStyle={{
            right: { color: "#f0f0f0" },
            left: { color: "#f0f0f0" },
          }}
        />
      );
    } else {
      return (
        <Bubble
          {...props}
          wrapperStyle={{
            right: {
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            },
          }}
        />
      );
    }
  }

  renderCustomActions = (props) => <CustomActions {...props} />;

  // Renders Map view
  renderCustomView(props) {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{ width: 150, height: 100, borderRadius: 13, margin: 8 }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  }

  render() {
    // Brings params over from home screen name and background color selected
    let { backgroundColor } = this.props.route.params;

    return (
      <View style={[styles.bgcolor(backgroundColor), styles.container]}>
        <View style={styles.chatArea}>
          <GiftedChat
            messages={this.state.messages}
            renderSystemMessage={this.renderSystemMessage.bind(this)}
            renderInputToolbar={this.renderInputToolbar.bind(this)}
            renderBubble={this.renderBubble.bind(this)}
            renderActions={this.renderCustomActions}
            renderCustomView={this.renderCustomView}
            onSend={(messages) => this.onSend(messages)}
            isTyping={true}
            user={this.state.user}
          />
          {Platform.OS === "android" ? (
            <KeyboardAvoidingView behavior="height" />
          ) : null}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  // Brings over selected background color selected in home screen
  bgcolor: (backgroundColor) => ({
    backgroundColor: backgroundColor,
  }),
  chatArea: {
    flex: 1,
    width: "100%",
  },
});
export default Chat;

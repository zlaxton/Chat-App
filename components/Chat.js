import React, { Component } from "react";
import {
  StyleSheet,
  ImageBackground,
  Text,
  View,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import {
  Bubble,
  GiftedChat,
  SystemMessage,
  Day,
  InputToolbar,
} from "react-native-gifted-chat";
import MapView from "react-native-maps";
import CustomActions from "./CustomActions";
import firebase from "firebase";
import "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";





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

    this.refMessages = firebase.firestore().collection("messages");
    this.referenceShoppinglistUser = null;
  }
  
   /**
   * Lifecycle method that runs when the component is mounted
   */
  componentDidMount() {
    //get user name from start screen
    const { name } = this.props.route.params;
    //setting up the screen title
    this.props.navigation.setOptions({ title: name ? name : "Anonymous" });

    //check if device is online
    NetInfo.fetch().then((connection) => {
      if (connection.isConnected) {
        this.setState({ isConnected: true });

        //referencing message collection
        this.unsubscribe = this.refMessages
          .orderBy("createdAt", "desc")
          .onSnapshot(this.onCollectionUpdate);

        //authentication
        this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
          if (!user) {
            firebase.auth().signInAnonymously();
          }

          this.setState({
            uid: user.uid,
            messages: [],
            user: {
              _id: user.uid,
              name: name,
              avatar: "https://placeimg.com/140/140/any",
            },
          });

          //referencing messages of current user
          this.refMsgsUser = firebase
            .firestore()
            .collection("messages")
            .where("uid", "==", this.state.uid);
        });
        //saving messages locally to asyncStorage
        this.saveMessages();
      } else {
        this.setState({ isConnected: false });
        //obtaining messages from asyncStorage
        this.getMessages();
      }
    });

    //setting up system message with name of the user when they join the conversation
    const systemMsg = {
      _id: `sys-${Math.floor(Math.random() * 100000)}`,
      text: `${name ? name : "Anonymous"} joined the conversation 👋`,
      createdAt: new Date(),
      system: true,
    };
    this.refMessages.add(systemMsg);
  }

  /**
   * Lifecycle method that runs when component unmounts
   */
  componentWillUnmount() {
    const { name } = this.props.route.params;

    //unsubscribe from firestore updates
    this.authUnsubscribe();
    this.unsubscribe();

    //setting up system message with name of the user when they leave the conversation
    const systemMsg = {
      _id: `sys-${Math.floor(Math.random() * 100000)}`,
      text: `${name ? name : "Anonymous"} left the conversation 👋`,
      createdAt: new Date(),
      system: true,
    };
    this.refMessages.add(systemMsg);
  }

  /**
   * Updates the state when a new message with the snapshot
   * @param {*} snapshot
   * @function onCollectionUpdate
   */
  onCollectionUpdate = (snapshot) => {
    const messages = [];
    snapshot.forEach((doc) => {
      let data = { ...doc.data() };

      messages.push({
        _id: data._id,
        createdAt: data.createdAt.toDate(),
        text: data.text || "",
        system: data.system,
        user: data.user,
        image: data.image,
        location: data.location,
      });
    });

    this.setState({ messages });
  };

  /**
   * Retrieves messages from AsyncStorage
   * @function getMessages
   * @async
   */
  getMessages = async () => {
    let msg = "";
    try {
      msg = (await AsyncStorage.getItem("messages")) || [];
      this.setState({
        messages: JSON.parse(msg),
      });
    } catch (err) {
      console.error(err);
    }
  };

  /**
   * Saves messages to AsyncStorage
   * @function saveMessages
   * @async
   */
  saveMessages = async () => {
    try {
      await AsyncStorage.setItem(
        "messages",
        JSON.stringify(this.state.messages)
      );
    } catch (err) {
      console.error(err.message);
    }
  };

  /**
   * Deletes messages from AsyncStorage
   * @function deleteMessages
   * @async
   */
  deleteMessages = async () => {
    try {
      await AsyncStorage.removeItem("messages");
      this.setState({
        messages: [],
      });
    } catch (err) {
      console.error(err);
    }
  };

  /**
   * Uploads a new message to the Firebase DB
   * @function uploadMessage
   */
  uploadMessage = () => {
    const msg = this.state.messages[0];
    this.refMessages.add({
      uid: this.state.uid,
      _id: msg._id,
      text: msg.text || "",
      createdAt: msg.createdAt,
      user: this.state.user,
      image: msg.image || "",
      location: msg.location || null,
    });
  };

  /**
   * Updates the state by appending the last sent message to the rest
   * @param {*} messages the sent message
   * @function onSend
   */
  onSend(messages = []) {
    this.setState(
      (previousState) => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }),
      () => {
        this.uploadMessage();
        this.saveMessages();
      }
    );
  }

  /**
   * Renderes a customized chat bubble
   * @function renderBubble
   * @param {*} props
   * @returns a JSX element that rapresents a text bubble with custon bg color
   */
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

  /**
   * Renders a customized system message
   * @function renderSystemMessage
   * @param {*} props
   * @returns a JSX element that represents a customized System Message
   */
  renderSystemMessage(props) {
    return <SystemMessage {...props} textStyle={{ color: "#fff" }} />;
  }

  /**
   * Renders a customized date
   * @function renderDay
   * @param {*} props
   * @returns a JSX element that represents a customized date
   */
  renderDay(props) {
    return <Day {...props} textStyle={{ color: "#fff" }} />;
  }

  /**
   * Renders the input toolbar if the device is online
   * @function renderInputToolbar
   * @param {*} props
   * @returns a JSX element that represents the input toolbar
   */
  renderInputToolbar(props) {
    if (this.state.isConnected) {
      return <InputToolbar {...props} />;
    }
  }

  /**
   * Renders the + button in the input field that opens up a menu of choices
   * to send images or the location of the user
   * @function renderCustomActions
   * @param {*} props
   * @returns a JSX element that represents the + button
   */
  renderCustomActions(props) {
    return <CustomActions {...props} />;
  }

  /**
   * Renders a custom view based on the type of the message that was sent
   * @function renderCustomActions
   * @param {*} props
   * @returns
   */
  renderCustomView(props) {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          showsUserLocation={true}
          style={{ width: 250, height: 200, borderRadius: 13, margin: 3 }}
          region={{
            latitude: parseInt(currentMessage.location.latitude),
            longitude: parseInt(currentMessage.location.longitude),
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
  }

  render() {
    const { bgColor, bgImage } = this.props.route.params;

    return (
      <View
        style={{
          flex: 1,
          backgroundColor: bgColor ? bgColor : "#fff",
        }}
      >
        <ImageBackground
          source={bgImage}
          resizeMode="cover"
          style={styles.bgImage}
        >
          <GiftedChat
            renderBubble={this.renderBubble.bind(this)}
            renderSystemMessage={this.renderSystemMessage}
            renderUsernameOnMessage={true}
            renderDay={this.renderDay}
            renderInputToolbar={this.renderInputToolbar.bind(this)}
            renderActions={this.renderCustomActions}
            renderCustomView={this.renderCustomView}
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
        </ImageBackground>
      </View>
    );
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

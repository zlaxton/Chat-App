import React, { Component } from "react";
import {
  Image,
  View,
  Text,
  TextInput,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

export default class Start extends React.Component {
  constructor(props) {
    super(props);
    this.state = { name: "", colorSelectionBackground: "#757083" };
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ImageBackground
          style={styles.background}
          source={require("../assets/background.jpg")} // Photo by Brooke Cagle on Unsplash
        >
          <View style={styles.titleView}>
            <Text style={styles.title}>Chat App</Text>
          </View>
          <View style={styles.whiteBox}>
            <View style={styles.nameInputView}>
              <TextInput
                style={styles.nameInput}
                onChangeText={(name) => this.setState({ name })}
                value={this.state.name}
                placeholder="Type your name..."
              ></TextInput>
              <Image
                style={styles.icon}
                source={require("../assets/icon.png")}
              />
            </View>

            <View style={styles.colorSelection}>
              <Text style={styles.colorSelectionText}>
                Choose Background Color:
              </Text>
              <View style={styles.colorSelectionPalette}>
                <TouchableOpacity
                  style={styles.colorSelectionPalette1}
                  onPress={() =>
                    this.setState({ colorSelectionBackground: "#f2bf5e" })
                  }
                  // Adds accessibility features
                  accessible={true}
                  accessibilityLabel="color: #f2bf5e"
                  accessibilityHint="By clicking on this button, you can choose the chat room's background color."
                  accessibilityRole="Button"
                />
                <TouchableOpacity
                  style={styles.colorSelectionPalette2}
                  onPress={() =>
                    this.setState({ colorSelectionBackground: "#7da7d9" })
                  }
                  // Adds accessibility features
                  accessible={true}
                  accessibilityLabel="color: #7da7d9"
                  accessibilityHint="By clicking on this button, you can choose the chat room's background color."
                  accessibilityRole="Button"
                />
                <TouchableOpacity
                  style={styles.colorSelectionPalette3}
                  onPress={() =>
                    this.setState({ colorSelectionBackground: "#b3e0f2" })
                  }
                  // Adds accessibility features
                  accessible={true}
                  accessibilityLabel="color: #b3e0f2"
                  accessibilityHint="By clicking on this button, you can choose the chat room's background color."
                  accessibilityRole="Button"
                />
                <TouchableOpacity
                  style={styles.colorSelectionPalette4}
                  onPress={() =>
                    this.setState({ colorSelectionBackground: "#72b2a2" })
                  }
                  // Adds accessibility features
                  accessible={true}
                  accessibilityLabel="color: #72b2a2"
                  accessibilityHint="By clicking on this button, you can choose the chat room's background color."
                  accessibilityRole="Button"
                />
              </View>
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={() =>
                this.props.navigation.navigate("Chat", {
                  name: this.state.name,
                  colorSelectionBackground: this.state.colorSelectionBackground,
                })
              }
              // Adds accessibility features
              accessible={true}
              accessibilityLabel="Start Chatting"
              accessibilityHint="By clicking on this button, you can enter the chat room."
              accessibilityRole="Button"
            >
              <Text style={styles.buttonText}>Start Chatting</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  background: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },

  titleView: {
    flex: 0.6,
  },

  title: {
    fontSize: 45,
    fontWeight: "bold",
    color: "#000",
    height: 60,
  },
  whiteBox: {
    flexDirection: "column",
    justifyContent: "space-around",
    backgroundColor: "#FFFFFF",
    maxHeight: "44%",
    minHeight: 260,
    height: "44%",
    width: "88%",
    paddingLeft: "6%",
    paddingRight: "6%",
    top: "10%",
  },

  colorSelection: {
    height: 50,
  },

  nameInput: {
    fontSize: 16,
    fontWeight: "300",
    color: "#757083",
    opacity: 0.5,
    borderWidth: 1,
    borderColor: "#8a8697",
    borderRadius: 2,
    padding: 15,
    paddingLeft: 50,
  },

  colorSelectionText: {
    fontSize: 16,
    fontWeight: "300",
    color: "#757083",
    bottom: 10,
  },

  colorSelectionPalette: {
    flexDirection: "row",
    justifyContent: "space-around",
  },

  colorSelectionPalette1: {
    backgroundColor: "#f2bf5e",
    width: 50,
    height: 50,
    borderRadius: 25,
  },

  colorSelectionPalette2: {
    backgroundColor: "#7da7d9",
    width: 50,
    height: 50,
    borderRadius: 25,
  },

  colorSelectionPalette3: {
    backgroundColor: "#b3e0f2",
    width: 50,
    height: 50,
    borderRadius: 25,
  },

  colorSelectionPalette4: {
    backgroundColor: "#72b2a2",
    width: 50,
    height: 50,
    borderRadius: 25,
  },

  button: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: 60,
    backgroundColor: "#3089a2",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },

  icon: {
    position: "absolute",
    left: 0,
    top: 4,
    zIndex: -1,
    width: 50,
    height: 50,
  },
});

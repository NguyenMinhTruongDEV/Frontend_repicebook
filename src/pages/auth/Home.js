import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";


export default function Home({ navigation }) {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../../assets/detailed-woman-chef-logo.png")} // bạn thay bằng ảnh thật của bạn
        style={styles.logo}
      />
      <Text style={styles.title}>
        Cookmate AI 🍲🔍 | Find, Create & Enjoy Delicious Recipes!
      </Text>

      <Text style={styles.subtitle}>
        Generate delicious recipes in seconds with the power of AI! 🍔✨
      </Text>

      {/* Nút Login */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.buttonText}>Get Starts</Text>
      </TouchableOpacity>

      {/* Nút Register */}
      {/* <TouchableOpacity
        style={[styles.button, styles.registerBtn]}
        onPress={() => navigation.navigate("Register")}
      >
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f7931a", // màu cam
  },
  logo: {
    width: 350,
    height: 300,
    borderRadius: 75,
    // marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginBottom: 24,
  },
  button: {
    width: "80%",
    padding: 15,
    borderRadius: 8,
    backgroundColor: "green",
    marginVertical: 8,
  },
  registerBtn: {
    backgroundColor: "#007bff",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});

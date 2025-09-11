import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function SuccessOtp({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Check icon */}
      <View style={styles.iconWrapper}>
        <Ionicons name="checkmark-circle-outline" size={180} color="#FF6B00" />
      </View>

      {/* Title */}
      <Text style={styles.title}>Success!</Text>
      <Text style={styles.subtitle}>
        Congratulations! You have been{"\n"}successfully authenticated
      </Text>

      {/* Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          // Ví dụ: điều hướng sang Home
          if (navigation) navigation.navigate("Login");
        }}
      >
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 25,
  },
  iconWrapper: {
    marginBottom: 25,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 40,
  },
  button: {
    backgroundColor: "#FF6B00",
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
    width: "80%",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

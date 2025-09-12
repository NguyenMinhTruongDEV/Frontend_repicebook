
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { authApi } from "../../../api/api.js";
export default function ForgotPasswordScreen({ route, navigation }) {
  const [email, setEmail] = useState("");
  
  // Hàm kiểm tra định dạng email cơ bản
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email");
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert("Error", "Please enter a valid email address");
      return;
    }

    try {
      const res = await authApi.forgotPassword({ email });
      console.log("Forgot password response:", res.data);

      if (res.data) {
        Alert.alert("Success", res.data.message);
        navigation.navigate('ResetPasswordOtp'); // truyền email nếu cần
      } 
    } catch (error) {
      console.error("Error during forgot password:", error);
      Alert.alert("Error", "Failed to send OTP. Please try again.");
    }
  };
  return (
    <View style={styles.container}>
      {/* Hình minh họa */}
      <Image
        source={{
          uri: "https://cdn-icons-png.flaticon.com/512/3062/3062634.png", // ảnh demo, bạn có thể thay bằng local asset
        }}
        style={styles.image}
      />

      {/* Title */}
      <Text style={styles.title}>Forgot Password</Text>
      <Text style={styles.subtitle}>
        Enter email to send one time Password
      </Text>

      {/* Email */}
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Enter your email"
          style={styles.input}
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Ionicons name="create-outline" size={20} color="#888" />
      </View>


      {/* Button */}
      <TouchableOpacity onPress={handleForgotPassword} style={styles.button}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    backgroundColor: "#fff",
    justifyContent: "center"
  },
  image: {
    width: "100%",
    height: 180,
    resizeMode: "contain",
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 25,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    paddingVertical: 12,
  },
  inputBox: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 25,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#FF6B00",
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

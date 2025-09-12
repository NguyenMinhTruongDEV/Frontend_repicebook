import React, { useRef, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert } from "react-native";
import OTPTextInput from "react-native-otp-textinput";
import { Ionicons } from "@expo/vector-icons";
import { authApi } from "../../../api/api.js";
export default function ResetPasswordOTPScreen({ route, navigation }) {
  const otpInput = useRef(null);
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [hidePassword, setHidePassword] = useState(true);

  const handleConfirm = async () => {
    if (!otp || !email || !newPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      const payload = {
        email: email,
        code: otp,
        newPassword: newPassword,
      };

      console.log("Confirm OTP payload:", payload);

      const res = await authApi.resetPasswordOTP(payload);
      console.log("Confirm OTP response:", res.data);

      Alert.alert("Success", res.data.message || "Password reset successfully!");
      navigation.navigate("SuccessOtp");
    } catch (error) {
      console.log("Error confirming OTP:", error);
      Alert.alert("Error", "Invalid OTP or something went wrong.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password Code</Text>
      <Text style={styles.subtitle}>
        We have sent the Reset Password code to your email address
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

      {/* Email */}
      {/* Password */}
      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Password"
          secureTextEntry={hidePassword}
          style={styles.passwordInput}
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <TouchableOpacity
          onPress={() => setHidePassword(!hidePassword)}
        >
          <Ionicons
            name={hidePassword ? "eye-off" : "eye"}
            size={20}
            color="#666"
          />
        </TouchableOpacity>
      </View>

      <OTPTextInput
        ref={otpInput}
        handleTextChange={(val) => setOtp(val)}
        inputCount={6} // số ô nhập OTP
        tintColor="#FF6B00"
        offTintColor="#ddd"
        containerStyle={styles.otpContainer}
        textInputStyle={styles.otpInput}
      />

      <TouchableOpacity style={styles.button} onPress={handleConfirm}>
        <Text style={styles.buttonText}>Confirm</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 30,
  },
  otpContainer: {
    marginBottom: 40,
  },
  otpInput: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
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
  passwordContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 15,
  },
});

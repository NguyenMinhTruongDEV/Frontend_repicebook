import React, { useRef, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import OTPTextInput from "react-native-otp-textinput";

export default function OtpScreen({ route, navigation }) {
  const otpInput = useRef(null);
  const [otp, setOtp] = useState("");

  const handleConfirm = () => {
    console.log("OTP Entered: ", otp);
    // Xử lý xác thực OTP ở đây (API call, điều hướng, ...)
    navigation.navigate('SuccessOtp')
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verification Code</Text>
      <Text style={styles.subtitle}>
        We have sent the verification code to your email address
      </Text>

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
});

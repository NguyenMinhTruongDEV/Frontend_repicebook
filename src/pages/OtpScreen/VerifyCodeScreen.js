// import React, { useState } from "react";
// import { View, Text, TextInput, Button, StyleSheet } from "react-native";
// import { authApi } from "../../utils/axiosInstance.js";

// const VerifyCodeScreen = ({ route, navigation }) => {
//   const { email: emailFromRegister } = route.params || {};
//   const [email, setEmail] = useState(emailFromRegister || "");
//   const [code, setCode] = useState("");
//   const [err, setErr] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState("");

//   const handleVerify = async () => {
//     if (!email || !code) {
//       setErr("Vui lòng nhập email và mã OTP");
//       return;
//     }
//     setErr("");
//     setLoading(true);
//     try {
//       const res = await authApi.verifyEmail({ email, code });
//       console.log("Verify success:", res.data);

//       setSuccess("Xác nhận email thành công!");
//       setTimeout(() => {
//         navigation.replace("Login");
//       }, 1500);
//     } catch (e) {
//       console.log("Verify error:", e.response?.data || e.message);
//       setErr(e.response?.data?.message || "Mã OTP không hợp lệ");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Xác thực Email</Text>

//       {err ? <Text style={styles.error}>{err}</Text> : null}
//       {success ? <Text style={styles.success}>{success}</Text> : null}

//       <TextInput
//         style={styles.input}
//         placeholder="Email"
//         value={email}
//         autoCapitalize="none"
//         keyboardType="email-address"
//         onChangeText={setEmail}
//       />

//       <TextInput
//         style={styles.input}
//         placeholder="Mã OTP"
//         value={code}
//         keyboardType="number-pad"
//         onChangeText={setCode}
//       />

//       <Button
//         title={loading ? "Đang xác nhận..." : "Xác nhận"}
//         onPress={handleVerify}
//         disabled={loading}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20, justifyContent: "center" },
//   title: { fontSize: 22, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
//   input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 12, borderRadius: 6 },
//   error: { color: "red", marginBottom: 12, textAlign: "center" },
//   success: { color: "green", marginBottom: 12, textAlign: "center" },
// });

// export default VerifyCodeScreen;


import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { authApi } from "../../api/api.js";
export default function VerifyCodeScreen({ route, navigation }) {
  const { email } = route.params;
  const handleSendEmail = async () => {
    try {
      const result = await authApi.sentVerifyEmail();
      console.log("Verification email sent:", result);
      alert(result.data.message);
      navigation.navigate('OtpCode', { email })
    } catch (err) {
      console.log(err.response?.data);
      alert(err.response?.data?.message || "Gửi email thất bại, thử lại sau.");
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
      <Text style={styles.title}>OTP Verification</Text>
      <Text style={styles.subtitle}>
        Enter email and phone number to send one time Password
      </Text>

      {/* Email */}
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Enter your email"
          style={styles.input}
          keyboardType="email-address"
        />
        <Ionicons name="create-outline" size={20} color="#888" />
      </View>

      {/* Phone */}
      
        <TextInput
          placeholder="Phone number"
          style={styles.inputBox}
          keyboardType="phone-pad"
        />
      

      {/* Button */}
      <TouchableOpacity onPress={handleSendEmail} style={styles.button}>
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
    display: "none"
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
    display: "none"
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

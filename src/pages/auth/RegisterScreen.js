import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { authApi } from "../../api/api.js";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Social from "../../components/Social/Social.js";
export default function RegisterScreen({ navigation }) {
  const [hidePassword, setHidePassword] = useState(true);
  const [hideConfirmPassword, setHideConfirmPassword] = useState(true);
  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const register = async () => {
    if (password !== confirmPassword) {
      setErr("Mật khẩu nhập lại không khớp");
      return;
    }
    setErr("");
    setLoading(true);
    try {
      const res = await authApi.register({
        username,
        fullname,
        email,
        password,
        confirmPassword,
      });
      console.log("Register success:", res.data);
      // Sau khi đăng ký thành công → chuyển về Login
      
      const token = res.data?.data?.token || res.data?.token;

      console.log("Token:", token);
      console.log("Full URL:", res.config.url);

      if (!token) throw new Error("Token not found in response");

      await AsyncStorage.setItem("token", token);
      alert("Đăng Ký Thành Công");
      navigation.navigate("VerifyCode", { email: email});
      setUsername("");
      setFullname("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      
    } catch (e) {
      const backendErr = e.response?.data?.error;
      console.log("Error full:", backendErr.message);

      if (Array.isArray(backendErr)) {
        // Backend trả về mảng lỗi
        setErr(backendErr.join("\n"));
      } else {
        setErr(backendErr?.message || e.message || "Register failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello There!</Text>
      <Text style={styles.subtitle}>
        Join Us to Unlock a World of{"\n"}Shopping Delights!
      </Text>
      {err ? <Text style={styles.err}>{err}</Text> : null}

      {/* Name */}
      <TextInput
        placeholder="Enter name"
        style={styles.input}
        // placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />

      {/* FullName */}
      <TextInput
        placeholder="Full Name"
        style={styles.input}
        value={fullname}
        onChangeText={setFullname}
        autoCapitalize="none"
      />

      {/* Email */}
      <TextInput
        placeholder="Enter email"
        style={styles.input}
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      {/* Password */}
      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Password"
          secureTextEntry={hidePassword}
          style={styles.passwordInput}
          value={password}
          onChangeText={setPassword}
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

      <View style={styles.passwordContainer}>
        <TextInput
          secureTextEntry={hideConfirmPassword}
          style={styles.passwordInput}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity
          onPress={() => setHideConfirmPassword(!hideConfirmPassword)}
        >
          <Ionicons
            name={hideConfirmPassword ? "eye-off" : "eye"}
            size={20}
            color="#666"
          />
        </TouchableOpacity>
      </View>

      {/* Register button */}
      <TouchableOpacity onPress={register}
        disabled={loading} style={styles.registerBtn}>
        <Text style={styles.registerText}>{loading ? "Registering..." : "Register"}</Text>
      </TouchableOpacity>

      <Text style={styles.or}>─────── or continue with ───────</Text>

      {/* Social buttons */}
      <Social />

      {/* Already member */}
      <View style={styles.loginContainer}>
        <Text>Already a member? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginText}>Signin</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#F9F9F9",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
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
    marginBottom: 20,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 15,
  },
  registerBtn: {
    backgroundColor: "#FF6B00",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginBottom: 25,
  },
  registerText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  or: {
    color: "#666",
    marginBottom: 20,
  },
  
  loginContainer: {
    flexDirection: "row",
  },
  loginText: {
    color: "blue",
    fontWeight: "bold",
  },
  err: { color: "red", marginBottom: 8 },
});

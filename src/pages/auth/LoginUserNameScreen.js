
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Button
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi } from '../../api/api.js';
import { useDispatch } from 'react-redux';
import { setUser } from '../../slice/userSlice.js'; // ← import từ file slice bạn tạo
const LoginUserNameScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [hidePassword, setHidePassword] = useState(true);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const login = async () => {
    if (identifier && password) {
      setLoading(true);
      setErr("");
      try {
        const res = await authApi.login({ identifier: identifier, password });
        // console.log("Full URL:", res.config.baseURL + res.config.url);
        const userData = res.data.user;
        const token = res.data?.data?.token || res.data?.token;

        console.log("Token:", token);
        console.log("Full URL:", res.config.url);

        if (!token) throw new Error("Token not found in response");

        await AsyncStorage.setItem("token", token);
        // Lưu user vào Redux store
        dispatch(setUser(userData));
        // Điều hướng sang Home
        navigation.navigate("MainTabs");

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
    } else {
      setErr("Vui lòng điền đầy đủ thông tin")
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello Again!</Text>
      <Text style={styles.subtitle}>Welcome back you've been missed!</Text>
      {err ? <Text style={styles.err}>{err}</Text> : null}
      {/* Email */}
      <TextInput
        value={identifier}
        placeholder="Enter UserName"
        style={styles.input}
        keyboardType="email-address"
        onChangeText={setIdentifier}
        autoCapitalize='none'
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

      <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
        <Text style={styles.recover}>Forgot Password</Text>
      </TouchableOpacity>

      {/* Sign in button */}
      <TouchableOpacity style={styles.signInBtn} onPress={login} disabled={loading}>
        {/* <Button style={styles.signInText} title={loading ? 'Logging...' : 'Login'}
          onPress={login}
          disabled={loading} /> */}
        <Text style={styles.signInText}>{loading ? 'Logging...' : 'Login With UserName'}</Text>
      </TouchableOpacity>

      <Text style={styles.or}>─────── or continue with ───────</Text>

      {/* Social buttons */}
      <View style={styles.socialContainer}>
        <TouchableOpacity style={styles.socialBtn}>
          <Ionicons name="logo-google" size={24} color="red" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialBtn}>
          <Ionicons name="logo-apple" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialBtn}>
          <Ionicons name="logo-facebook" size={24} color="#1877F2" />
        </TouchableOpacity>
      </View>

      {/* Login With Email */}
      <View style={styles.registerContainer}>
        <Text>Not a member? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')} >
          <Text style={styles.registerText}>Login Email</Text>
        </TouchableOpacity>
      </View>
      {/* Register */}
      <View style={styles.registerContainer}>
        <Text>Not a member? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')} >
          <Text style={styles.registerText}>Register now</Text>
        </TouchableOpacity>
      </View>

      {/* Verityfi OTP */}
      <View style={styles.registerContainer}>
        <Text>Xác thực tài khoản? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('VerifyCode')} >
          <Text style={styles.registerText}>Verify Code</Text>
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
    marginBottom: 10,
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
    marginBottom: 10,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 15,
  },
  recover: {
    width: "100%",
    textAlign: "right",
    marginBottom: 20,
    color: "#666",
  },
  signInBtn: {
    backgroundColor: "#FF6B00",
    padding: 15,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginBottom: 25,
  },
  signInText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  or: {
    color: "#666",
    marginBottom: 20,
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "60%",
    marginBottom: 25,
  },
  socialBtn: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#fff",
    elevation: 2, // Android shadow
  },
  registerContainer: {
    flexDirection: "row",
  },
  registerText: {
    color: "blue",
    fontWeight: "bold",
  },
  err: {
    color: 'red',
    marginBottom: 8
  }
});

export default LoginUserNameScreen;
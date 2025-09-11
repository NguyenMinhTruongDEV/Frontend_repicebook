import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { authApi } from "../../api/api.js";

export default function EditProfilePassword({ navigation }) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [err, setErr] = useState("");
    const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      setErr("Please fill in all fields!");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErr("New password and confirm password do not match!");
      return;
    }

    setLoading(true);
    try {
      await authApi.editChangePassword({
        oldPassword,
        newPassword,
        confirmPassword,
      });

      Alert.alert("Success", "Password updated successfully!");
      navigation.goBack();
    } catch (e) {
      const backendErr = e.response?.data?.error;
      console.log("Error full:", backendErr.message);

      if (Array.isArray(backendErr)) {
        // Backend trả về mảng lỗi
        setErr(backendErr.join("\n"));
      } else {
        setErr(backendErr?.message || e.message || "Password failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Password Icon */}
      <View style={styles.iconContainer}>
        <Ionicons name="lock-closed" size={100} color="#FF6B00" />
      </View>
      {err ? <Text style={styles.err}>{err}</Text> : null}
      <Text style={styles.label}>Old Password</Text>
      <TextInput
        style={styles.input}
        value={oldPassword}
        onChangeText={setOldPassword}
        secureTextEntry
      />

      <Text style={styles.label}>New Password</Text>
      <TextInput
        style={styles.input}
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
      />

      <Text style={styles.label}>Confirm New Password</Text>
      <TextInput
        style={styles.input}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={styles.saveBtn}
        onPress={handleSave}
        disabled={loading}
      >
        <Text style={styles.saveText}>
          {loading ? "Saving..." : "Save Password"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff"
  },
  iconContainer: {
    alignItems: "center",
    marginVertical: 30,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#444"
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
  },
  saveBtn: {
    backgroundColor: "#FF6B00",
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 20,
  },
  saveText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16
  },
  err: {
    color: 'red',
    marginBottom: 8,
    textAlign: "center"
  }
});

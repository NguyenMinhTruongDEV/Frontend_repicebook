import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Alert,
  Button,
} from "react-native";
import { Picker } from "@react-native-picker/picker"; // npm install @react-native-picker/picker
import { recipesApi } from "../../api/api.js";

const DetailUserIDScreen = ({ route, navigation }) => {
  const { userId } = route.params;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState("");

  const fetchUserById = async () => {
    try {
      const res = await recipesApi.getUserById(userId);
      if (res.data.success) {
        setUser(res.data.data);
        setSelectedRole(res.data.data.role);
      } else {
        Alert.alert("Thông báo", "Không tìm thấy người dùng");
        navigation.goBack();
      }
    } catch (err) {
      console.error("Error fetching user:", err);
      Alert.alert("Lỗi", "Không thể lấy thông tin người dùng");
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserById();
  }, []);

  const changeStatus = async () => {
    try {
      const newStatus = user.status === "active" ? "blocked" : "active";
      await recipesApi.updateUserStatus(user._id, { status: newStatus });
      setUser({ ...user, status: newStatus });
      Alert.alert("Thành công", `Trạng thái đã được đổi thành "${newStatus}"`);
    } catch (err) {
      console.error("Error changing status:", err);
      Alert.alert("Lỗi", "Không thể đổi trạng thái");
    }
  };


  const changeRole = async () => {
    try {
      const newRole = selectedRole.toLowerCase();
      console.log("Changing role to:", newRole);
      await recipesApi.updateUserRole(user._id, { role: newRole });
      setUser({ ...user, role: newRole });
      Alert.alert("Thành công", `Role đã được đổi thành "${newRole}"`);
    } catch (err) {
      console.error("Error changing role:", err);
      Alert.alert("Lỗi", "Không thể đổi role");
    }
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!user) return null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: user.avatar }} style={styles.avatar} />
      <Text style={styles.fullname}>{user.fullname}</Text>
      <Text style={styles.username}>Username: {user.username}</Text>
      <Text style={styles.email}>Email: {user.email}</Text>
      <Text style={styles.status}>Status: {user.status}</Text>

      {/* Picker Role */}
      <View style={{ width: "80%", marginVertical: 10 }}>
        <Text style={{ marginBottom: 5 }}>Role:</Text>
        <Picker
          selectedValue={selectedRole}
          onValueChange={(itemValue) => setSelectedRole(itemValue)}
          style={{ backgroundColor: "#fff", borderRadius: 5 }}
        >
          <Picker.Item label="User" value="user" />
          <Picker.Item label="Admin" value="admin" />
          <Picker.Item label="Staff" value="staff" />
        </Picker>
        <View style={{ marginTop: 10 }}>
          <Button title="Cập nhật Role" onPress={changeRole} />
        </View>
      </View>

      {/* Button đổi trạng thái */}
      <View style={{ marginTop: 20, width: "80%" }}>
        <Button
          title={user.status === "active" ? "Đổi sang Inactive" : "Đổi sang Active"}
          onPress={changeStatus}
          color={user.status === "active" ? "orange" : "green"}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "#f9f9f9",
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
  },
  fullname: { fontSize: 22, fontWeight: "bold", marginBottom: 8 },
  username: { fontSize: 16, marginBottom: 4 },
  email: { fontSize: 16, marginBottom: 4 },
  status: { fontSize: 16, marginBottom: 4 },
});

export default DetailUserIDScreen;

import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  Linking,
  Platform
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";

import { authApi } from "../../api/api.js"; // API call
import { updateUser } from "../../slice/userSlice.js"; // Redux slice

export default function EditProfile() {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  // Lấy user từ Redux
  const user = useSelector((state) => state.user.data);

  // State để edit
  
  const [fullname, setFullname] = useState(user.fullname);
  const [email, setEmail] = useState(user.email);
  const [avatar, setAvatar] = useState(user.avatar);

  // Cập nhật state nếu Redux thay đổi
  useEffect(() => {
    
    setFullname(user.fullname);
    setEmail(user.email);
    setAvatar(user.avatar);
  }, [user]);

  // Chọn avatar (Camera, Thư viện, File khác)
  const pickAvatar = async () => {
    Alert.alert("Chọn ảnh", "Camera, Thư viện hoặc File?", [
      {
        text: "Camera",
        onPress: async () => {
          const { status } = await ImagePicker.requestCameraPermissionsAsync();
          if (status !== "granted") {
            Alert.alert("Quyền bị từ chối", "Cần bật quyền camera trong Settings.");
            return;
          }
          const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
          });
          if (!result.canceled && result.assets?.length > 0) {
            const uri = result.assets[0].uri;
            setAvatar(uri);
            // handleUpdateAvatar(uri); // upload ngay
          }
        },
      },
      {
        text: "Thư viện",
        onPress: async () => {
          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== "granted") {
            Alert.alert("Quyền bị từ chối", "Cần bật quyền thư viện trong Settings.");
            return;
          }
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
          });
          if (!result.canceled && result.assets?.length > 0) {
            const uri = result.assets[0].uri;
            setAvatar(uri);
            // handleUpdateAvatar(uri); // upload ngay
          }
        },
      },
      {
        text: "File khác",
        onPress: async () => {
          const result = await DocumentPicker.getDocumentAsync({
            type: "image/*",
            multiple: false,
          });
          if (!result.canceled && result.assets?.length > 0) {
            const uri = result.assets[0].uri;
            setAvatar(uri);
            // handleUpdateAvatar(uri); // upload ngay
          }
        },
      },
      { text: "Hủy", style: "cancel" },
    ]);
  };


  // Update profile thông tin cơ bản
  const handleSave = async () => {
    if (!fullname.trim() || !email.trim()) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin!");
      return;
    }

    try {
      const newData = { fullname, email };
      const res = await authApi.editProfile(newData);
      // { fullname: res.data.data.fullname, email: res.data.data.email }
      console.log("API response:", res.data);

      // ✅ Lấy user đúng path từ API
      const updatedUser = res.data.data.user;

      // Cập nhật Redux store
      dispatch(updateUser(updatedUser));

      Alert.alert("Thành công", "Cập nhật thông tin thành công!");
      navigation.goBack();
    } catch (err) {
      console.log(err);
      Alert.alert("Lỗi", "Không thể cập nhật thông tin!");
    }
  };

  // Update avatar
  const handleUpdateAvatar = async () => {
    if (!avatar) return;

    const formData = new FormData();
    const filename = avatar.split("/").pop();
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : "image/jpeg";

    formData.append("avatar", {
      uri: avatar,
      name: filename,
      type,
    });

    try {
      const res = await authApi.editAvatar(formData); // PUT/PATCH avatar
      // Cập nhật Redux
      dispatch(updateUser({ avatar: res.data.data.avatar }));
      Alert.alert("Thành công", "Avatar đã được cập nhật!");
    } catch (err) {
      console.error(err);
      Alert.alert("Lỗi", "Không thể cập nhật avatar!");
    }
  };

  return (
    <View style={styles.container}>
      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <Image source={avatar ? { uri: avatar } : require('../../../assets/adaptive-icon.png')} style={styles.avatar} />
        <TouchableOpacity onPress={pickAvatar} style={styles.editIcon}>
          <Ionicons name="camera" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Input fields */}
      <View style={styles.form}>
        <Text style={styles.label}>Fullname</Text>
        <TextInput
          style={styles.input}
          value={fullname ? fullname : '12'}
          onChangeText={setFullname}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email ? email : '12'}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      </View>

      {/* Buttons */}
      <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
        <Text style={styles.saveText}>Save Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.saveBtn} onPress={handleUpdateAvatar}>
        <Text style={styles.saveText}>Save Avatar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  avatarContainer: { alignItems: "center", marginVertical: 20 },
  avatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: "#FF6B00" },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: "38%",
    backgroundColor: "#FF6B00",
    padding: 6,
    borderRadius: 20,
  },
  form: { marginTop: 20 },
  label: { fontSize: 14, fontWeight: "bold", marginBottom: 5, color: "#444" },
  input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 10, padding: 12, marginBottom: 15, backgroundColor: "#f9f9f9" },
  saveBtn: { backgroundColor: "#FF6B00", paddingVertical: 15, borderRadius: 30, alignItems: "center", marginTop: 20 },
  saveText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});


import React from 'react';
import {
  View, Text, Image, TouchableOpacity, StyleSheet, ScrollView
} from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { setUser } from '../../slice/userSlice.js'; // ← 
export default function ProfileScreen({ navigation }) {
  const dispatch = useDispatch();
  const userProfile = useSelector(state => state.user.data);

  const logout = async () => {
    try {
      // 1. Xóa token
      await AsyncStorage.removeItem('token');

      // 2. Xóa user trong Redux
      dispatch(setUser(null));

      // 3. Chuyển sang Login
      navigation.replace('Login'); // replace để không thể back lại
    } catch (e) {
      console.error("Logout error:", e);
    }
  };

  const EditProfile = () => {
    navigation.navigate("EditProfile"); // Navigate tới màn hình EditProfile
  };

  const EditProfilePassword = () => {
    navigation.navigate("EditProfilePassword"); // Navigate tới màn hình EditProfilePassword
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        {userProfile ? (
          <>
            <Image
              source={{ uri: userProfile.avatar }}
              style={styles.avatar}
            />
            <Text style={styles.name}>{userProfile?.username}</Text>
            <Text style={styles.email}>{userProfile?.email}</Text>
          </>
        ) : <Text>Loading...</Text>}
      </View>

      {/* Menu */}
      <View style={styles.menuGroup}>
        <MenuItem
          icon={<Ionicons name="person" size={22} color="#FF6B81" />}
          title="Edit profile"
          onPress={EditProfile}
        />
        <MenuItem
          icon={<Ionicons name="stats-chart" size={22} color="#6C63FF" />}
          title="My stats"
        />
        <MenuItem
          icon={<Ionicons name="settings" size={22} color="#FF9F43" />}
          title="Settings"
        />
        <MenuItem
          icon={<Ionicons name="settings" size={22} color="#FF9F43" />}
          title="Password"
          onPress={EditProfilePassword} 
        />
        <MenuItem
          icon={<Ionicons name="people" size={22} color="#E84393" />}
          title="Invite a friend"
        />
      </View>

      <View style={styles.menuGroup}>
        <MenuItem
          icon={<MaterialIcons name="help-outline" size={22} color="#000" />}
          title="Help"
        />
        <MenuItem
          icon={<FontAwesome5 name="sign-out-alt" size={22} color="#555" />}
          title="Log out"
          onPress={logout}
        />
      </View>
    </ScrollView>
  );
}

const MenuItem = ({ icon, title, onPress }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={styles.menuLeft}>
      {icon}
      <Text style={styles.menuText}>{title}</Text>
    </View>
    <Ionicons name="chevron-forward" size={20} color="#888" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  header: { alignItems: "center", marginVertical: 30 },
  avatar: { width: 90, height: 90, borderRadius: 45, borderWidth: 3, borderColor: "#FF6B00" },
  name: { fontSize: 20, fontWeight: "bold", marginTop: 10 },
  email: { fontSize: 14, color: "#666", marginTop: 4 },
  menuGroup: { backgroundColor: "#fff", marginHorizontal: 20, borderRadius: 15, paddingVertical: 5, marginBottom: 20, shadowColor: "#000", shadowOpacity: 0.05, shadowOffset: { width: 0, height: 2 }, shadowRadius: 5, elevation: 2 },
  menuItem: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 15, borderBottomWidth: 1, borderBottomColor: "#eee" },
  menuLeft: { flexDirection: "row", alignItems: "center" },
  menuText: { fontSize: 16, marginLeft: 12 },
});


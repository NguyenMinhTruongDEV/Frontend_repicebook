// AllUserScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
  Alert
} from "react-native";
import { recipesApi } from "../../api/api.js";
import Icon from "react-native-vector-icons/MaterialIcons"; // hoặc FontAwesome


const AllUserScreen = ({route, navigation}) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await recipesApi.getAllUser(); // thay API đúng của bạn
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.userCard}>
      <TouchableOpacity
        style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
        onPress={() => navigation.navigate("DetailUserIDScreen", { userId: item._id })}
      >
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        <View style={styles.userInfo}>
          <Text style={styles.fullname}>{item.fullname}</Text>
          <Text style={styles.email}>{item.email}</Text>
          <Text style={styles.role}>Role: {item.role}</Text>
          <Text style={styles.status}>Status: {item.status}</Text>
        </View>
      </TouchableOpacity>

      {/* Icon xóa */}
      <TouchableOpacity
        onPress={() =>
          Alert.alert(
            "Xác nhận",
            `Bạn có chắc chắn muốn xóa ${item.fullname}?`,
            [
              { text: "Hủy", style: "cancel" },
              {
                text: "Xóa",
                style: "destructive",
                onPress: async () => {
                  try {
                    await recipesApi.deleteUserRole(item._id);
                    Alert.alert("Thành công", "Người dùng đã được xóa");
                    // refresh lại danh sách nếu cần
                    // Cập nhật state local để UI ngay lập tức
                    setUsers((prev) => prev.filter((u) => u._id !== item._id));
                  } catch (err) {
                    console.error("Delete user error:", err);
                    Alert.alert("Lỗi", "Không thể xóa người dùng");
                  }
                },
              },
            ]
          )
        }
      >
        <Icon name="delete" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={users}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    paddingHorizontal: 10,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  userCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginVertical: 6,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  userInfo: {
    marginLeft: 12,
    justifyContent: "center",
  },
  fullname: {
    fontSize: 16,
    fontWeight: "bold",
  },
  email: {
    fontSize: 14,
    color: "#555",
    marginTop: 2,
  },
  role: {
    fontSize: 14,
    color: "#333",
    marginTop: 2,
  },
  status: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
});

export default AllUserScreen;

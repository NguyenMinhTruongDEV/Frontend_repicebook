import React, { useRef, useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  Modal,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Button,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Alert,
  TextInput,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const RatingModal = ({
  visible,
  onClose,
  recipe,           // danh sách rating { _id, user, value, comment }
  currentUserId,
  newRating,
  setNewRating,
  newRatingComment,
  setNewRatingComment,
  handleAddRating,        // thêm rating mới
  handleDeleteRating,     // xóa rating nếu cần
}) => {
  const flatListRef = useRef(null);

  // Giữ nguyên thứ tự API trả về
  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Text style={{ fontWeight: "bold" }}>{item.user}</Text>
      <View style={{ flexDirection: "row" }}>
        {Array(item.stars) // tạo mảng độ dài = số sao
          .fill(0) // điền dummy
          .map((_, i) => (
            <Ionicons
              key={i}
              name="star" // chỉ hiện sao vàng
              size={20}
              color="#FFD700"
            />
          ))}
      </View>
      {item.comment && <Text>{item.comment}</Text>}
      {item.user === currentUserId && handleDeleteRating && (
        <TouchableOpacity
          onPress={() =>
            Alert.alert(
              "Xác nhận",
              "Bạn có chắc muốn xóa rating này?",
              [
                { text: "Hủy", style: "cancel" },
                {
                  text: "Xóa",
                  style: "destructive",
                  onPress: () => handleDeleteRating(),
                },
              ]
            )
          }
        >
          <Text style={{ fontSize: 12, color: "#fd0000ff" }}>Xóa</Text>
        </TouchableOpacity>
      )}
    </View>
  );


  return (

    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Ratings ({recipe?.ratings.length})</Text>
        </View>

        {/* Rating list */}
        <FlatList
          ref={flatListRef}
          data={recipe?.ratings}
          keyExtractor={(item, index) => (item._id ? item._id.toString() : index.toString())}
          renderItem={renderItem}
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 10 }}
          onContentSizeChange={() => {
            flatListRef.current?.scrollToEnd({ animated: true });
          }}
        />

        {/* Input + Send */}
        {handleAddRating && (
          <View style={styles.inputContainer}>
            <View style={{ flexDirection: "row", marginBottom: 8 }}>
              {[1, 2, 3, 4, 5].map((i) => (
                <TouchableOpacity key={i} onPress={() => setNewRating(i)}>
                  <Ionicons
                    name={i <= newRating ? "star" : "star-outline"}
                    size={30}
                    color="#FFD700"
                    style={{ marginHorizontal: 2 }}
                  />
                </TouchableOpacity>
              ))}
            </View>

            {/* Nhập comment */}
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 8,
                paddingHorizontal: 10,
                paddingVertical: 5,
                marginBottom: 8,
              }}
              placeholder="Viết bình luận..."
              value={newRatingComment}
              onChangeText={setNewRatingComment}
            />

            <Button
              title="Send"
              onPress={handleAddRating}
            />
          </View>
        )}

        {/* Close button */}
        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
          <Text style={{ fontSize: 16, color: "#333" }}>Close</Text>
        </TouchableOpacity>
      </View>

    </Modal>

  );
};

const styles = StyleSheet.create({
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  item: {
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#fff",
  },
  closeBtn: {
    position: "absolute",
    top: 10,
    right: 16,
    padding: 8,
    backgroundColor: "#eee",
    borderRadius: 20,
  },
});

export default RatingModal;

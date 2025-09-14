import React, { useRef, useState } from "react";
import { useSelector } from 'react-redux';
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
  handleUpdateRating,
  handleDeleteRating,     // xóa rating nếu cần
}) => {
  
  const userProfile = useSelector(state => state.user.data);
  const userId = userProfile ? userProfile.id : null;
  const flatListRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  // Giữ nguyên thứ tự API trả về
  const renderItem = ({ item }) => (
    <View style={styles.item}>
      {item.comment && <Text style={{ fontWeight: "bold", fontSize: 16 }}>{item.comment}</Text>}
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
      
      
      <Text >
        {new Date(item.updatedAt || item.createdAt || Date.now()).toLocaleString()}
        {String(item.user) === String(userId) && <Text> • của tôi</Text>}

      </Text>
      {item.user === currentUserId && (
        <View style={{ flexDirection: "row", justifyContent: "space-between", width: 100 }}>
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
          <TouchableOpacity
            onPress={() => {
              setNewRating(item.stars);
              setNewRatingComment(item.comment || "");
              setIsEditing(true);
              setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
              }, 200);
            }}
          >
            <Text style={{ color: "blue" }}>Cập nhật</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );


  return (

    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Ratings ({recipe?.ratings?.length || 0})</Text>
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


        {/* Input + Send / Update */}
        {handleAddRating && (
          <View style={styles.inputContainer}>
            {isEditing ? (
              <>
                {/* Chọn sao */}
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

                {/* Nút cập nhật */}
                <Button
                  title="Cập nhật"
                  onPress={async () => {
                    await handleUpdateRating(); // gọi hàm cha
                    setIsEditing(false);        // tắt edit mode
                  }}
                />
              </>
            ) : (
              // Nếu user chưa rating thì mới hiện form thêm mới
              !(recipe?.ratings || []).some(r => r.user === currentUserId) && (
                <>
                  {/* Chọn sao */}
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

                  {/* Nút gửi mới */}
                  <Button
                    title="Send"
                    onPress={handleAddRating}
                  />
                </>
              )
            )}
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

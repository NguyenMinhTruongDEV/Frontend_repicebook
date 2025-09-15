import React, { useRef } from "react";
import {
  Modal,
  View,
  Text,
  FlatList,
  TextInput,
  Button,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { useSelector } from 'react-redux';
const CommentModal = ({
  visible,
  onClose,
  recipe,
  currentUserId,
  newComment,
  setNewComment,
  handleAddComment,
  handleDeleteComment,
}) => {
  const flatListRef = useRef(null);
  const userProfile = useSelector(state => state.user.data);
  const userId = userProfile ? userProfile.id : null;
  return (
    <Modal
      visible={visible}     // ✅ đúng
      animationType="slide"
      transparent={false} // full màn hình
      style={styles.Modal}
    >
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        {/* Header */}
        <View
          style={{
            padding: 16,
            borderBottomWidth: 1,
            borderBottomColor: "#eee",
            backgroundColor: "#fff",
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            Comments ({recipe?.comments?.length || 0})
          </Text>
        </View>

        {/* Comment list */}
        <FlatList
          data={recipe?.comments || []}
          keyExtractor={(item, index) => (item._id ? item._id.toString() : index.toString())}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5} // số lượng batch render ngoài màn hình
          renderItem={({ item }) => (
            <View
              style={{
                marginHorizontal: 16,
                marginVertical: 8,
                padding: 10,
                backgroundColor: "#f9f9f9",
                borderRadius: 8,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 4 }}>
                <Text style={{ fontWeight: "bold", marginBottom: 4 }}>{item.content}</Text>
                {String(item.user) === String(userId) && <Text> • của tôi</Text>}
              </View>
              <View style={{ flexDirection: "row", columnGap: 20 }}>
                <Text style={{ fontSize: 12, color: "#999" }}>
                  {item.createdAt ? new Date(item.createdAt).toLocaleString() : ""}
                </Text>
                {item.user === currentUserId && (
                  <TouchableOpacity
                    onPress={() =>
                      Alert.alert(
                        "Xác nhận",
                        "Bạn có chắc muốn xóa comment này?",
                        [
                          { text: "Hủy", style: "cancel" },
                          { text: "Xóa", style: "destructive", onPress: () => handleDeleteComment(item._id) }
                        ]
                      )
                    }
                  >
                    <Text style={{ fontSize: 12, color: "#fd0000ff" }}>Xóa</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

          )}
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 10 }}
          onContentSizeChange={() => {
            flatListRef.current?.scrollToEnd({ animated: true });
          }}
        />

        {/* Input + Send + Close */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 16,
            paddingVertical: 10,
            borderTopWidth: 1,
            borderTopColor: "#eee",
            backgroundColor: "#fff",
          }}
        >
          <TextInput
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: "#ccc",
              borderRadius: 20,
              paddingHorizontal: 16,
              height: 40,
              backgroundColor: "#f0f0f0",
            }}
            placeholder="Add a comment..."
            value={newComment}
            onChangeText={setNewComment}
          />
          {/* <Button title="Send" onPress={handleAddComment} /> */}
          <TouchableOpacity style={styles.buttonSend} onPress={handleAddComment}>
            <Text style={styles.textSend}>Send</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={onClose}
          style={{
            position: "absolute",
            top: 10,
            right: 16,
            padding: 8,
            backgroundColor: "#eee",
            borderRadius: 20,
          }}
        >
          <Text style={{ fontSize: 16, color: "#333" }}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  )
}
const styles = StyleSheet.create({
  // Nút Send
  buttonSend: {
    backgroundColor: "#FF7F50", // cam nhạt
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 5,
  },
  textSend: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
})
export default CommentModal
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, View } from "react-native";
const Social = () => {
  return (
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
  )
}
const styles = StyleSheet.create({
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
})
export default Social;
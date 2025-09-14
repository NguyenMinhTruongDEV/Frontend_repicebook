import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";

import { Picker } from "@react-native-picker/picker";
import Icon from "react-native-vector-icons/MaterialIcons";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { recipesApi } from "../../api/api.js"; // import API

export default function UpdateRecipe({ route, navigation }) {
  const { id } = route.params; // recipe cần update
  const [recipe, setRecipe] = useState(null);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [difficulty, setDifficulty] = useState("Trung bình");
  const [servings, setServings] = useState("");
  const [prep, setPrep] = useState("");
  const [cook, setCook] = useState("");
  const [ingredients, setIngredients] = useState([{ name: "", quantity: "", unit: "" }]);
  const [steps, setSteps] = useState([""]);
  const [tags, setTags] = useState("");
  const [thumbnail, setThumbnail] = useState(null);

  const fetchRecipeById = async (recipeId) => {
    try {
      const res = await recipesApi.getDetails(recipeId);
      const data = res.data.data;

      setRecipe(data);           // lưu object recipe
      setTitle(data.title);
      setSummary(data.summary);
      setContent(data.content);
      setDifficulty(data.difficulty);
      setServings(String(data.servings));
      setPrep(String(data.time?.prep));
      setCook(String(data.time?.cook));
      setIngredients(data.ingredients);
      setSteps(data.steps);
      setTags(data.tags?.join(",") || "");
      setThumbnail(data.thumbnail || null);
    } catch (err) {
      console.error("Error fetching recipe detail:", err);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (id) {
      fetchRecipeById(id);
    }
  }, [id]);

  // --- Image picker cho thumbnail ---
  const pickImage = async () => {
    Alert.alert("Chọn ảnh", "Camera, Thư viện hoặc File khác?", [
      {
        text: "Camera",
        onPress: async () => {
          const { status } = await ImagePicker.requestCameraPermissionsAsync();
          if (status !== "granted") {
            Alert.alert("Quyền bị từ chối", "Bạn cần bật quyền camera trong Settings.");
            return;
          }
          const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
          });
          if (!result.canceled && result.assets?.length > 0) {
            setThumbnail(result.assets[0].uri);
          }
        },
      },
      {
        text: "Thư viện",
        onPress: async () => {
          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== "granted") {
            Alert.alert("Quyền bị từ chối", "Bạn cần bật quyền thư viện trong Settings.");
            return;
          }
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
          });
          if (!result.canceled && result.assets?.length > 0) {
            setThumbnail(result.assets[0].uri);
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
            setThumbnail(uri);
          }
        },
      },
      { text: "Hủy", style: "cancel" },
    ]);
  };

  // --- Add/remove ingredient ---
  const handleAddIngredient = () => setIngredients([...ingredients, { name: "", quantity: "", unit: "" }]);
  const handleRemoveIngredient = (idx) => {
    const list = [...ingredients];
    list.splice(idx, 1);
    setIngredients(list);
  };

  // --- Add/remove step ---
  const handleAddStep = () => setSteps([...steps, ""]);
  const handleRemoveStep = (idx) => {
    const list = [...steps];
    list.splice(idx, 1);
    setSteps(list);
  };

  // --- Handle update ---
  const handleUpdate = async () => {
    try {
      // 1️⃣ Validate form
      if (!title.trim() || !summary.trim() || !content.trim() || !difficulty || !servings) {
        Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin trước khi lưu!");
        return;
      }
      if (title.trim().length < 5) {
        Alert.alert("Lỗi", "Tiêu đề phải ít nhất 5 ký tự");
        return;
      }
      if (content.trim().length < 20) {
        Alert.alert("Lỗi", "Nội dung phải ít nhất 20 ký tự");
        return;
      }

      const difficultyOptions = ["Dễ", "Trung bình", "Khó"];
      if (!difficultyOptions.includes(difficulty)) {
        Alert.alert("Lỗi", "Độ khó phải là một trong: Dễ, Trung bình, Khó");
        return;
      }

      const emptyIngredient = ingredients.find(i => !i.name.trim() || !i.quantity || !i.unit.trim());
      if (emptyIngredient) {
        Alert.alert("Lỗi", "Nguyên liệu không được để trống!");
        return;
      }

      const emptyStep = steps.find(s => !s.trim());
      if (emptyStep) {
        Alert.alert("Lỗi", "Các bước không được để trống!");
        return;
      }

      const tagList = tags ? tags.split(",").map(t => t.trim()).filter(t => t.length > 0) : [];

      // 2️⃣ Tạo FormData
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("summary", summary.trim());
      formData.append("content", content.trim());
      formData.append("difficulty", difficulty);
      formData.append("servings", String(servings));
      formData.append("time[prep]", String(Number(prep) || 0));
      formData.append("time[cook]", String(Number(cook) || 0));
      formData.append("time[total]", String((Number(prep) || 0) + (Number(cook) || 0)));

      ingredients.forEach((i, index) => {
        formData.append(`ingredients[${index}][name]`, i.name.trim());
        formData.append(`ingredients[${index}][quantity]`, String(Number(i.quantity)));
        formData.append(`ingredients[${index}][unit]`, i.unit.trim());
      });

      steps.forEach((s, index) => {
        formData.append(`steps[${index}]`, s.trim());
      });

      tagList.forEach((t, index) => {
        formData.append(`tags[${index}]`, t);
      });

      // 3️⃣ Upload thumbnail (giống avatar)
      if (thumbnail && thumbnail !== recipe.thumbnail) {
        const filename = thumbnail.split("/").pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : "image/jpeg";

        console.log("👉 Thumbnail upload:", { uri: thumbnail, name: filename, type });

        formData.append("thumbnail", {
          uri: thumbnail,
          name: filename,
          type,
        });
      }


      // 4️⃣ Gọi API update (axiosInstance tự set headers)
      const res = await recipesApi.updateRecipes(id, formData);

      Alert.alert("Thành công", `Recipe "${res.data?.title || recipe.title}" đã được cập nhật!`);
      // Sau khi update thành công:

      navigation.goBack();
    } catch (err) {

      // console.error(err.response?.data || err.message);
      Alert.alert(
        "Lỗi",
        err.response?.data?.error?.message || "Không thể cập nhật recipe. Vui lòng thử lại!"
      );
    }
  };


  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 150 }}>
      <Text style={styles.label}>Thumbnail:</Text>
      {thumbnail && <Image source={thumbnail ? { uri: thumbnail } : require('../../../assets/adaptive-icon.png')} style={{ width: "100%", height: 200, marginBottom: 8 }} />}
      
      <View style={{ paddingVertical: 10, alignItems: "center" }}>
        <TouchableOpacity
          onPress={pickImage}
          activeOpacity={0.8}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#1890ff",
            paddingVertical: 12,
            paddingHorizontal: 25,
            borderRadius: 10,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}
        >
          <Icon name="photo-library" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>Chọn ảnh</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Tiêu đề:</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} />

      <Text style={styles.label}>Tóm tắt:</Text>
      <TextInput style={styles.input} value={summary} onChangeText={setSummary} />

      <Text style={styles.label}>Nội dung:</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        multiline
        value={content}
        onChangeText={setContent}
      />

      <Text style={styles.label}>Độ khó:</Text>
      <View style={styles.pickerContainer}>
        <Picker selectedValue={difficulty} onValueChange={setDifficulty}>
          <Picker.Item label="Dễ" value="Dễ" />
          <Picker.Item label="Trung bình" value="Trung bình" />
          <Picker.Item label="Khó" value="Khó" />
        </Picker>
      </View>

      <Text style={styles.label}>Số khẩu phần:</Text>
      <TextInput style={styles.input} value={servings} keyboardType="numeric" onChangeText={setServings} />

      <Text style={styles.label}>Thời gian chuẩn bị (phút):</Text>
      <TextInput style={styles.input} value={prep} keyboardType="numeric" onChangeText={setPrep} />

      <Text style={styles.label}>Thời gian nấu (phút):</Text>
      <TextInput style={styles.input} value={cook} keyboardType="numeric" onChangeText={setCook} />

      <Text style={styles.label}>Nguyên liệu:</Text>
      {ingredients.map((ing, idx) => (
        <View key={idx} style={styles.row}>
          <TextInput
            style={[styles.input, { flex: 2 }]}
            placeholder="Tên"
            value={ing.name}
            onChangeText={(text) => {
              const list = [...ingredients];
              list[idx].name = text;
              setIngredients(list);
            }}
          />
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Số lượng"
            keyboardType="numeric"
            value={String(ing.quantity)}
            onChangeText={(text) => {
              const list = [...ingredients];
              list[idx].quantity = text;
              setIngredients(list);
            }}
          />
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Đơn vị"
            value={ing.unit}
            onChangeText={(text) => {
              const list = [...ingredients];
              list[idx].unit = text;
              setIngredients(list);
            }}
          />
          {ingredients.length > 1 && (
            <TouchableOpacity onPress={() => handleRemoveIngredient(idx)}>
              <Text style={styles.remove}>Xóa</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
      

      <View style={{ paddingVertical: 10, alignItems: "center" }}>
        <TouchableOpacity
          onPress={handleAddIngredient}
          activeOpacity={0.8}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#52c41a",
            paddingVertical: 12,
            paddingHorizontal: 25,
            borderRadius: 10,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}
        >
          <Icon name="add-circle-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>Thêm nguyên liệu</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Các bước:</Text>
      {steps.map((step, idx) => (
        <View key={idx} style={styles.row}>
          <TextInput
            style={[styles.input, { flex: 4 }]}
            placeholder={`Bước ${idx + 1}`}
            value={step}
            onChangeText={(text) => {
              const list = [...steps];
              list[idx] = text;
              setSteps(list);
            }}
          />
          {steps.length > 1 && (
            <TouchableOpacity onPress={() => handleRemoveStep(idx)}>
              <Text style={styles.remove}>Xóa</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
      <View style={{ paddingVertical: 10, alignItems: "center" }}>
        <TouchableOpacity
          onPress={handleAddStep}
          activeOpacity={0.8}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#fa8c16", // màu cam nổi bật
            paddingVertical: 12,
            paddingHorizontal: 25,
            borderRadius: 10,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}
        >
          <Icon name="playlist-add" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>Thêm bước</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Tags (ngăn cách bằng dấu ,):</Text>
      <TextInput style={styles.input} value={tags} onChangeText={setTags} />

      <View style={{ paddingVertical: 10, alignItems: "center" }}>
        <TouchableOpacity
          onPress={handleUpdate}
          activeOpacity={0.8}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#28a745", // màu xanh lá
            paddingVertical: 14,
            paddingHorizontal: 25,
            borderRadius: 10,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}
        >
          <Icon name="update" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
            Cập nhật công thức
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#fff" },
  label: { fontSize: 16, fontWeight: "bold", marginTop: 12, marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 8,
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 8,
  },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 8, gap: 4 },
  remove: { color: "red", marginLeft: 4 },
});

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { recipesApi } from "../../api/api.js"; // chắc chắn import đúng

export default function CreateRecipe({ navigation }) {
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

  // Add/remove ingredient
  const handleAddIngredient = () => setIngredients([...ingredients, { name: "", quantity: "", unit: "" }]);
  const handleRemoveIngredient = (idx) => {
    const list = [...ingredients];
    list.splice(idx, 1);
    setIngredients(list);
  };

  // Add/remove step
  const handleAddStep = () => setSteps([...steps, ""]);
  const handleRemoveStep = (idx) => {
    const list = [...steps];
    list.splice(idx, 1);
    setSteps(list);
  };

  // Handle save
  const handleSave = async () => {
    // Validate required fields
    if (
      !title.trim() ||
      !summary.trim() ||
      !content.trim() ||
      !difficulty ||
      !servings ||
      ingredients.length === 0 ||
      steps.length === 0
    ) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin trước khi lưu!");
      return;
    }

    // Validate title/content length
    if (title.trim().length < 5) {
      Alert.alert("Lỗi", "Tiêu đề phải ít nhất 5 ký tự");
      return;
    }
    if (content.trim().length < 20) {
      Alert.alert("Lỗi", "Nội dung phải ít nhất 20 ký tự");
      return;
    }

    // Validate difficulty
    const difficultyOptions = ["Dễ", "Trung bình", "Khó"];
    if (!difficultyOptions.includes(difficulty)) {
      Alert.alert("Lỗi", "Độ khó phải là một trong: Dễ, Trung bình, Khó");
      return;
    }

    // Validate ingredients
    const emptyIngredient = ingredients.find(
      (i) => !i.name.trim() || !i.quantity || !i.unit.trim()
    );
    if (emptyIngredient) {
      Alert.alert("Lỗi", "Nguyên liệu không được để trống!");
      return;
    }

    // Validate steps
    const emptyStep = steps.find((s) => !s.trim());
    if (emptyStep) {
      Alert.alert("Lỗi", "Các bước không được để trống!");
      return;
    }

    // Prepare tags (remove empty)
    const tagList = tags
      ? tags.split(",").map((t) => t.trim()).filter((t) => t.length > 0)
      : [];

    // Prepare data
    const data = {
      title: title.trim(),
      summary: summary.trim(),
      content: content.trim(),
      difficulty,
      servings: Number(servings),
      time: {
        prep: Number(prep) || 0,
        cook: Number(cook) || 0,
        total: (Number(prep) || 0) + (Number(cook) || 0),
      },
      ingredients: ingredients.map((i) => ({
        name: i.name.trim(),
        quantity: Number(i.quantity),
        unit: i.unit.trim(),
      })),
      steps: steps.map((s) => s.trim()),
      tags: tagList,
    };

    // Send request
    try {
      const res = await recipesApi.createRecipes(data);
      console.log("Server response:", res.data);

      // Show success
      const recipeTitle = res.data?.title || res.data?.data?.title || "Recipe";
      Alert.alert("Thành công", `Recipe "${recipeTitle}" đã được lưu!`);

      // Reset form
      setTitle("");
      setSummary("");
      setContent("");
      setDifficulty("Trung bình");
      setServings("");
      setPrep("");
      setCook("");
      setIngredients([{ name: "", quantity: "", unit: "" }]);
      setSteps([""]);
      setTags("");
    } catch (err) {
      console.error(err.response?.data || err.message);
      Alert.alert(
        "Lỗi",
        err.response?.data?.error || "Không thể lưu recipe. Vui lòng thử lại!"
      );
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 150 }}>
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
        <Picker selectedValue={difficulty} onValueChange={(item) => setDifficulty(item)}>
          <Picker.Item label="Dễ" value="Dễ" />
          <Picker.Item label="Trung bình" value="Trung bình" />
          <Picker.Item label="Khó" value="Khó" />
        </Picker>
      </View>

      <Text style={styles.label}>Số khẩu phần:</Text>
      <TextInput
        style={styles.input}
        value={servings}
        keyboardType="numeric"
        onChangeText={setServings}
      />

      <Text style={styles.label}>Thời gian chuẩn bị (phút):</Text>
      <TextInput
        style={styles.input}
        value={prep}
        keyboardType="numeric"
        onChangeText={setPrep}
      />

      <Text style={styles.label}>Thời gian nấu (phút):</Text>
      <TextInput
        style={styles.input}
        value={cook}
        keyboardType="numeric"
        onChangeText={setCook}
      />

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
      <Button title="Thêm nguyên liệu" onPress={handleAddIngredient} />

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
      <Button title="Thêm bước" onPress={handleAddStep} />

      <Text style={styles.label}>Tags (ngăn cách bằng dấu ,):</Text>
      <TextInput style={styles.input} value={tags} onChangeText={setTags} />

      <Button title="Lưu công thức" onPress={handleSave} color="#28a745" />
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

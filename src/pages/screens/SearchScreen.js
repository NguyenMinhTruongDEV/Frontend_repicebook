import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, Image, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, ActivityIndicator, Button, Dimensions, ImageBackground } from 'react-native';
import { categories } from '../../data/categories.js';
import Icon from 'react-native-vector-icons/Ionicons';
import { recipesApi } from "../../api/api.js"
import Pagination from '../../components/Pagination/Pagination.js';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { useDebounce } from "../../hook/useDebounce.js"
import { Picker } from "@react-native-picker/picker";
import { useSelector } from "react-redux";
const { width } = Dimensions.get('window');

const SearchScreen = ({ navigation }) => {
  const userProfile = useSelector(state => state.user.data);
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 6; // số item mỗi trang
  const [loading, setLoading] = useState(true);
  const [difficulty, setDifficulty] = useState("");
  const [sort, setSort] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // debounce riêng cho search & difficulty
  const debouncedSearch = useDebounce(search, 100);
  const debouncedDifficulty = useDebounce(difficulty, 100);
  const debouncedSort = useDebounce(sort, 100);
  const debouncedCategory = useDebounce(selectedCategory, 100);

  const fetchPage = async (pageNum = 1) => {
    try {
      setLoading(true);

      let res;
      if (debouncedDifficulty) {
        // Có difficulty
        res = await recipesApi.listRecipesDifficulty(
          pageNum,
          limit,
          debouncedCategory,
          debouncedSort,
          debouncedSearch,
          debouncedDifficulty
        );
      } else {
        // Không có difficulty
        res = await recipesApi.listRecipes(
          pageNum,
          limit,
          debouncedCategory,
          debouncedSort,
          debouncedSearch
        );
      }

      const data = res.data?.data || res.data;
      const meta = res.data?.meta || {};

      const list = Array.isArray(data) ? data : data?.items || [];

      setRecipes(list);
      setPage(Number(meta.page) || pageNum);
      setTotalPages(Number(meta.totalPages) || 1);

    } catch (e) {
      if (e.response) {
        console.error("fetchPage error:", e.response.status, e.response.data);
      } else {
        console.error("fetchPage error:", e.message);
      }
    } finally {
      setLoading(false);
    }
  };

  // 1. Fetch khi màn hình focus lần đầu
  useFocusEffect(
    useCallback(() => {
      fetchPage(1);
    }, [])
  );

  // 2. Fetch lại khi search hoặc difficulty thay đổi
  useEffect(() => {
    fetchPage(1);
  }, [debouncedSearch, debouncedSort, debouncedDifficulty, debouncedCategory]);

  const renderPagination = () => (
    <Pagination
      page={page}
      totalPages={totalPages}
      onPageChange={fetchPage}
    />
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FF6B00" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          {/* Title */}
          <Text style={styles.titleHeader}>Make your own food,</Text>
          <Text style={styles.subtitleHeader}>stay at <Text style={{ color: '#F4A261' }}>home</Text></Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          <Image source={{ uri: userProfile.avatar }} style={styles.avatarHeader} />
        </TouchableOpacity>
      </View>



      {/* Search */}
      <View style={styles.searchContainer}>
        <TextInput style={styles.searchInput} placeholder="Search any recipe"
          value={search}
          onChangeText={text => setSearch(text)}
        />

        <Icon name="search" size={20} color="#555" style={styles.searchIcon} />
      </View>

      <View style={styles.containerQuery}>
        {/* Cấp dôdj */}
        <View style={styles.containerDifficulty}>
          <Text style={styles.label}>Chọn độ khó:</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={difficulty}   // giá trị đang được chọn
              onValueChange={(value) => setDifficulty(value)} // set vào state
              style={styles.picker}
            >
              <Picker.Item label="-- Chọn độ khó --" value="" />
              <Picker.Item label="Dễ" value="Dễ" />
              <Picker.Item label="Trung bình" value="Trung bình" />
              <Picker.Item label="Khó" value="Khó" />
            </Picker>
          </View>

          {/* Hiện value ra cho dễ debug */}
          <Text style={styles.result}>Bạn chọn: {difficulty}</Text>
        </View>
        {/* end Cấp độ */}
        {/* Sort */}
        <View style={styles.containerSort}>
          <Text style={styles.label}>Chọn Sort:</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={sort}   // giá trị đang được chọn
              onValueChange={(value) => setSort(value)} // set vào state
              style={styles.picker}
            >
              <Picker.Item label="-- Chọn thời gian --" value="" />
              <Picker.Item label="Mới Nhất" value="newest" />
              <Picker.Item label="Phổ Biến" value="popular" />
              <Picker.Item label="Lâu Nhất" value="oldest" />
            </Picker>
          </View>

          {/* Hiện value ra cho dễ debug */}
          <Text style={styles.result}>Bạn chọn: {difficulty}</Text>
        </View>
        {/* end Sort */}
      </View>

      {/* Categories */}
      <FlatList
        data={categories}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingVertical: 10 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.categoryItem,
              selectedCategory === item.value && { backgroundColor: "#ddd", padding: 5, borderRadius: 10 },
            ]}
            onPress={() => {
              const newCategory = selectedCategory === item.value ? "" : item.value;
              setSelectedCategory(newCategory);

            }}
          >
            <Image source={item.image} style={styles.categoryImage} />
            <Text>{item.name}</Text>
          </TouchableOpacity>
        )}
      />


      {/* Recipes */}
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>Recipes</Text>

        <TouchableOpacity
          style={styles.refreshButton}
          onPress={() => {
            setSearch("");
            setDifficulty("");
            setSelectedCategory("");
            setSort("");

          }}
        >
          <Text style={styles.refreshText}>Refresh</Text>
        </TouchableOpacity>
      </View>


      <FlatList
        data={recipes}
        numColumns={2}
        scrollEnabled={false} // đây là key
        keyExtractor={(item, index) => item._id || index.toString()}
        renderItem={({ item }) => (
          <>
            <TouchableOpacity onPress={() =>
              navigation.navigate("RecipeDetail", { id: item._id }) // 👈 truyền object recipe
            } style={styles.card}>
              <ImageBackground source={{ uri: item.thumbnail }} style={styles.image} imageStyle={styles.imageStyle}>
                <View style={styles.textContainer}>
                  <Text style={styles.title}>{item.title}</Text>
                  <Text style={styles.date}>Date {item.createdAt
                    ? new Date(item.createdAt).toLocaleString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                    : ""}</Text>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          </>
        )}
        ListFooterComponent={renderPagination}   // 👈 pagination nằm trong list
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 15 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 5 },
  avatarHeader: { width: 40, height: 40, borderRadius: 20 },
  bellHeader: { width: 24, height: 24 },
  titleHeader: { fontSize: 24, fontWeight: 'bold', marginTop: 20 },
  subtitleHeader: { fontSize: 24, marginBottom: 15 },
  searchContainer: {
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#F0F0F0',
  },

  searchInput: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    padding: 10
  },
  searchIcon: {
    marginLeft: 10,
    borderRadius: 360,
    borderWidth: 10,
    borderColor: "#fff"
  },
  categoryItem: { alignItems: 'center', marginRight: 15 },
  categoryImage: { width: 60, height: 60, borderRadius: 30, marginBottom: 5 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginVertical: 10 },
  recipeCard: {
    flex: 1,
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    columnGap: 20,
    marginHorizontal: 5
  },
  recipeImage: {
    width: 180,
    height: 150,
    borderRadius: 15,

  },
  recipeTitle: {
    marginTop: 5,
    fontWeight: 'bold'
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa'
  },


  label: { marginBottom: 10, fontSize: 16, fontWeight: "bold" },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    overflow: "hidden",
  },
  picker: { height: 50, width: "100%" },
  result: { marginTop: 15, fontSize: 16, color: "#555", display: "none" }, // ẩn tạm để khỏi lo,
  // Query
  containerQuery: {
    flexDirection: "row",
    justifyContent: "space-between",
    columnGap: 10
  },
  containerDifficulty: { width: "48%" },
  containerSort: { width: "48%" },
  // Refesh
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
    paddingHorizontal: 10,
    marginBottom: 20
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  refreshButton: {
    backgroundColor: "#ff9800",   // màu cam nhạt
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3, // Android shadow
  },
  refreshText: {
    color: "#fff",
    fontWeight: "bold",
  },
  // card
  card: {
    width: width * 0.43, // khoảng 45% chiều rộng màn hình
    height: 200,
    borderRadius: 15,
    overflow: 'hidden', // để bo tròn hình ảnh
    margin: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 5, // cho Android
  },
  image: {
    flex: 1,
    justifyContent: 'flex-end', // đẩy text xuống đáy
  },
  imageStyle: {
    borderRadius: 15,
  },
  textContainer: {
    backgroundColor: 'rgba(0,0,0,0.4)', // nền mờ phía sau text
    padding: 10,
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  date: {
    color: '#fff',
    fontSize: 12,
    marginTop: 2,
  },
  // end card
});
export default SearchScreen;

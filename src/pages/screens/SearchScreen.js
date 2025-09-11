import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, Image, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { recipesApi } from "../../api/api.js"
import Pagination from '../../components/Pagination/Pagination.js';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
const categories = [
  { id: '1', name: 'Beef', image: require('../../../assets/beef_pie.jpg') },
  { id: '2', name: 'Chicken', image: require('../../../assets/beef_pie.jpg') },
  { id: '3', name: 'Dessert', image: require('../../../assets/beef_pie.jpg') },
  { id: '4', name: 'Lamb', image: require('../../../assets/beef_pie.jpg') },
  { id: '5', name: 'Miscellaneous', image: require('../../../assets/beef_pie.jpg') },
];

const SearchScreen = ({ navigation }) => {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 6; // số item mỗi trang
  const [loading, setLoading] = useState(true);
  // // Hàm gọi API
  // useEffect(() => {
  //   const fetchRecipes = async () => {
  //     try {
  //       const response = await recipesApi.list(search); // search = "Nam" hoặc ""
  //       console.log("Recipes array:", response.data.data); // log ra mảng
  //       setRecipes(response.data.data);
  //     } catch (error) {
  //       console.error("Error fetching recipes:", error);
  //     }
  //   };

  //   fetchRecipes();
  // }, [search]);


  const fetchPage = async (pageNum = 1) => {
    try {
      setLoading(true);
      // truyền đúng tham số (q, page, limit)
      const res = await recipesApi.listRecipes(search, pageNum, limit);

      const data = res.data?.data || res.data;
      const meta = res.data?.meta || {};

      const list = Array.isArray(data) ? data : data?.items || [];

      setRecipes(list);

      setPage(Number(meta.page) || pageNum);
      setTotalPages(Number(meta.totalPages) || 1);
    } catch (e) {
      console.error("fetchPage error:", e);
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   fetchPage(1);
  // }, [search]);

  useFocusEffect(
    useCallback(() => {
      fetchPage(1); // tự động lấy lại khi màn hình focus
    }, [search])
  );
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
      {/* <View style={styles.header}>
        <Image source={require('../../../assets/beef_pie.jpg')} style={styles.avatar} />
        <TouchableOpacity>
          <Image source={require('../../../assets/beef_pie.jpg')} style={styles.bell} />
        </TouchableOpacity>
      </View> */}

      {/* Title */}
      <Text style={styles.title}>Make your own food,</Text>
      <Text style={styles.subtitle}>stay at <Text style={{ color: '#F4A261' }}>home</Text></Text>

      {/* Search */}
      <View style={styles.searchContainer}>
        <TextInput style={styles.searchInput} placeholder="Search any recipe"
          value={search}
          onChangeText={text => setSearch(text)}
        />

        <Icon name="search" size={20} color="#555" style={styles.searchIcon} />
      </View>

      {/* Categories */}
      <FlatList
        data={categories}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => item._id?.toString() || index.toString()}
        contentContainerStyle={{ paddingVertical: 10 }}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.categoryItem}>
            <Image source={item.image} style={styles.categoryImage} />
            <Text>{item.name}</Text>
          </TouchableOpacity>
        )}

      />

      {/* Recipes */}
      <Text style={styles.sectionTitle}>Recipes</Text>
      <FlatList
        data={recipes}
        numColumns={2}
        scrollEnabled={false} // đây là key
        keyExtractor={(item, index) => item._id || index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() =>
            navigation.navigate("RecipeDetail", { id: item._id }) // 👈 truyền object recipe
          } style={styles.recipeCard}>
            <Image source={{ uri: item.thumbnail }} style={styles.recipeImage} />
            <Text style={styles.recipeTitle}>{item.title}</Text>
          </TouchableOpacity>
        )}
        ListFooterComponent={renderPagination}   // 👈 pagination nằm trong list
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 15 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  bell: { width: 24, height: 24 },
  title: { fontSize: 24, fontWeight: 'bold', marginTop: 20 },
  subtitle: { fontSize: 24, marginBottom: 15 },
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
});
export default SearchScreen;

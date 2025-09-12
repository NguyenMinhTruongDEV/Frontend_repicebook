
import React, { useEffect, useState, useRef } from 'react';
import { ScrollView, TouchableOpacity, Text, Image, View, ActivityIndicator, StyleSheet, Dimensions, FlatList, SafeAreaView } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { recipesApi } from '../../api/api.js';
import Pagination from '../../components/Pagination/Pagination.js';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import Carousel from "react-native-reanimated-carousel";
const { width } = Dimensions.get("window");


const categories = [
  { id: "1", name: "Breakfast", icon: require('../../../assets/beef_pie.jpg') },
  { id: "2", name: "Beef", icon: require('../../../assets/beef_pie.jpg') },
  { id: "3", name: "Chicken", icon: require("../../../assets/beef_pie.jpg") },
  { id: "4", name: "Dessert", icon: require("../../../assets/beef_pie.jpg") },
  { id: "5", name: "All", icon: require("../../../assets/beef_pie.jpg") },
];

const topPicks = [
  {
    id: "1",
    name: "15-minute chicken & halloumi",
    image: require("../../../assets/beef_pie.jpg"),
    time: "15min",
    difficulty: "Easy",
    rating: 4.7,
    chef: "Chef Ogba",
  },
  {
    id: "2",
    name: "Ayam Percik",
    image: require("../../../assets/beef_pie.jpg"),
    time: "15min",
    difficulty: "Easy",
    rating: 4.0,
    chef: "Chef Ogba",
  },
];

// const desserts = [
//   {
//     id: '1',
//     name: 'Chocolate Cake',
//     difficulty: 'Medium',
//     time: '45 mins',
//     chef: 'John Doe',
//     rating: 4.8,
//     image: require("../../../assets/beef_pie.jpg"),
//   },
//   {
//     id: '2',
//     name: 'Strawberry Tart',
//     difficulty: 'Easy',
//     time: '30 mins',
//     chef: 'Jane Smith',
//     rating: 4.5,
//     image: require("../../../assets/beef_pie.jpg"),
//   },
// ];

const bannerData = [
  {
    id: '1',
    title: '20% Off Premium',
    subtitle: 'Limited time offer',
    description: 'Get access to exclusive recipes',
    image: require('../../../assets/beef_pie.jpg')
  },
  {
    id: '2',
    title: 'New Recipes',
    subtitle: 'Weekly updates',
    description: 'Fresh content every week',
    image: require('../../../assets/beef_pie.jpg')
  },
  {
    id: '3',
    title: 'Top Chefs',
    subtitle: 'Expert guidance',
    description: 'Learn from the best chefs',
    image: require('../../../assets/beef_pie.jpg')
  },
];

export default function HomeScreen({ navigation }) {
  const [topPicks, setTopPicks] = useState([]);

  const [desserts, setDesserts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5; // số item mỗi trang
  // desserts
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const fetchPage = async (pageNum = 1) => {
    try {
      setLoading(true);
      // truyền đúng tham số (q, page, limit)
      const res = await recipesApi.listRecipes("", pageNum, limit);

      const data = res.data?.data || res.data;
      const meta = res.data?.meta || {};

      const list = Array.isArray(data) ? data : data?.items || [];

      setDesserts(list);
      setTopPicks(list); // Giả sử topPicks lấy từ cùng API
      setPage(Number(meta.page) || pageNum);
      setTotalPages(Number(meta.totalPages) || 1);
    } catch (e) {
      console.error("fetchPage error:", e);
    } finally {
      setLoading(false);
    }
  };

 
 useFocusEffect(
    useCallback(() => {
      fetchPage(1); // tự động lấy lại khi màn hình focus
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FF6B00" />
      </View>
    );
  }
  const getAverageRating = (ratings = []) => {
    if (!ratings.length) return 0;
    const sum = ratings.reduce((acc, r) => acc + (r.stars || 0), 0);
    return (sum / ratings.length).toFixed(1); // làm tròn 1 chữ số thập phân
  };
  const renderHeader = () => (
    <SafeAreaView style={styles.containerHeader}>

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Welcome Back!</Text>
          <Text style={styles.userName}>Cristina Kiehn</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={24} color="#333" />
          <View style={styles.notificationBadge} />
        </TouchableOpacity>
      </View>
      <View style={styles.containerCarousel}>
        <Carousel
          loop
          width={width - 40}
          height={220}
          autoPlay={true}
          data={desserts}
          scrollAnimationDuration={1000}
          onSnapToItem={(index) => setCurrentIndex(index % desserts.length)} // 👈 fix lặp
          renderItem={({ item }) => (
            <View style={styles.cardCarousel}>
              <Image
                source={{ uri: item.thumbnail || "https://via.placeholder.com/200" }}
                style={styles.imageCarousel}
                resizeMode="cover"
              />
              <Text style={styles.titleCarousel}>{item.title}</Text>
            </View>
          )}
        />

        {/* Dot Indicator */}
        <View style={styles.dotContainerCarousel}>
          {desserts.map((_, index) => (
            <View
              key={index}
              style={[styles.dotCarousel, currentIndex === index && styles.activeDotCarousel]}
            />
          ))}
        </View>
      </View>

      {/* Simple ScrollView Carousel */}

      {/* Categories */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={categories}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.categoryItem} activeOpacity={0.8}>
              <View style={styles.categoryIconContainer}>
                <Image source={item.icon} style={styles.categoryIcon} />
              </View>
              <Text style={styles.categoryText}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
      <View>
        <Text onPress={() => navigation.navigate("CreateRecipe")} >
          Tạo công thức mới
        </Text>
      </View>
      {/* Top Picks */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Chicken Top Picks</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={topPicks}
          horizontal
          keyExtractor={item => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16 }}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} activeOpacity={0.9}>
              <Image source={{ uri: item.thumbnail }} style={styles.cardImage} />
              <TouchableOpacity style={styles.heartIcon}>
                <Ionicons name="heart-outline" size={20} color="#FF6B00" />
              </TouchableOpacity>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
                <View style={styles.cardMeta}>
                  <View style={styles.cardMetaItem}>
                    <Ionicons name="time-outline" size={12} color="#888" />
                    <Text style={styles.cardMetaText}>{item.time.total}</Text>
                  </View>
                  <View style={styles.cardMetaItem}>
                    <Ionicons name="speedometer-outline" size={12} color="#888" />
                    <Text style={styles.cardMetaText}>{item.difficulty}</Text>
                  </View>
                </View>
                <Text style={styles.cardChef}>By: {item.createdBy}</Text>
                <View style={styles.cardRatingContainer}>
                  <Ionicons name="star" size={14} color="#FFD700" />
                  <Text style={styles.cardRating}>{getAverageRating(item.ratings)}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Dessert Section Title */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>More Dessert</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.dessertItem} activeOpacity={0.9}>
      <Image source={{ uri: item.thumbnail }} style={styles.dessertImage} />
      <View style={styles.dessertInfo}>
        <Text style={styles.dessertName}>{item.title}</Text>
        <View style={styles.dessertMeta}>
          <View style={[styles.difficultyBadge,
          item.difficulty === 'Easy' ? styles.easyBadge : styles.mediumBadge]}>
            <Text style={[styles.difficultyText,
            item.difficulty === 'Easy' ? styles.easyText : styles.mediumText]}>
              {item.difficulty}
            </Text>
          </View>
          <Text style={styles.timeText}>{item.time.total}</Text>
        </View>
        <Text style={styles.chef}>By: {item.createdBy}</Text>
      </View>
      <View style={styles.dessertActions}>
        <TouchableOpacity style={styles.heartIconSmall}>
          <Ionicons name="heart-outline" size={20} color="#FF6B00" />
          <Text style={styles.rating}>{item?.likes?.length || 0}</Text>
        </TouchableOpacity>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={14} color="#FFD700" />
          <Text style={styles.rating}>{getAverageRating(item.ratings)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
  const renderPagination = () => (
      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={fetchPage}
      />
  );

  return (
    <>
      <FlatList
        data={desserts}
        keyExtractor={(item, index) => item.id || index}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderPagination}   // 👈 pagination nằm trong list
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 16,
    color: "#888",
    marginBottom: 4
  },
  userName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333"
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF6B00',
  },

  // Simple Carousel Styles
  containerCarousel: {
    alignItems: "center",
    marginVertical: 20,
  },
  cardCarousel: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: "#fff",
    overflow: "hidden", // để bo góc ảnh
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  imageCarousel: {
    width: "100%",
    height: 160,
  },
  titleCarousel: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    paddingVertical: 10,
  },
  dotContainerCarousel: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  dotCarousel: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    marginHorizontal: 4,
  },
  activeDotCarousel: {
    backgroundColor: "tomato",
    width: 10,
    height: 10,
  },
  // Section Styles
  section: {
    marginBottom: 24,

  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333"
  },
  seeAllText: {
    fontSize: 14,
    color: "#FF6B00",
    fontWeight: '600',
  },

  // Category Styles
  categoryItem: {
    alignItems: "center",
    marginRight: 20,
  },
  categoryIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20
  },
  categoryText: {
    fontSize: 12,
    color: "#666",
    fontWeight: '500',
  },

  // Card Styles
  card: {
    width: 220,
    marginRight: 16,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  cardImage: {
    width: "100%",
    height: 140
  },
  heartIcon: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  cardContent: {
    padding: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    lineHeight: 20,
  },
  cardMeta: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  cardMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  cardMetaText: {
    fontSize: 12,
    color: '#888',
    marginLeft: 4,
  },
  cardChef: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
  },
  cardRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardRating: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginLeft: 4,
  },

  // Dessert Styles
  dessertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dessertImage: {
    width: 80,
    height: 80,
    borderRadius: 12
  },
  dessertInfo: {
    flex: 1,
    marginLeft: 16
  },
  dessertName: {
    fontWeight: '600',
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
  },
  dessertMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: 12,
  },
  easyBadge: {
    backgroundColor: '#E8F5E8',
  },
  mediumBadge: {
    backgroundColor: '#FFF3E0',
  },
  difficultyText: {
    fontSize: 10,
    fontWeight: '600',
  },
  easyText: {
    color: '#2E7D2E',
  },
  mediumText: {
    color: '#F57C00',
  },
  timeText: {
    color: '#888',
    fontSize: 12,
  },
  chef: {
    color: '#666',
    fontSize: 12,
  },
  dessertActions: {
    alignItems: 'center',
  },
  heartIconSmall: {
    padding: 8,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    color: '#333',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 4,
  },
  // Pagination Styles
  pageButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#ccc",
    marginHorizontal: 4,
    borderRadius: 6,
    backgroundColor: "white",
  },
  pageActive: {
    backgroundColor: "#007bff",
  },
  pageText: {
    color: "#007bff",
  },
  pageTextActive: {
    color: "white",
  },
  pageDots: {
    alignSelf: "center",
    marginHorizontal: 4,
    color: "#666",
  },
  navButton: {
    paddingHorizontal: 8,
    justifyContent: "center",
  },
});
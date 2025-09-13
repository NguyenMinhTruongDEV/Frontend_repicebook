
import React, { useEffect, useState, useRef } from 'react';
import { ScrollView, TouchableOpacity, Text, Image, View, ActivityIndicator, StyleSheet, Dimensions, FlatList, SafeAreaView, Animated } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { recipesApi } from '../../api/api.js';
import Pagination from '../../components/Pagination/Pagination.js';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import Carousel from "react-native-reanimated-carousel";
import { APP_COLOR } from '../../utils/constant.js';
const { width } = Dimensions.get("window");
const numColumns = 2;
const cardMargin = 16;
const cardWidth = (width - cardMargin * (numColumns + 1)) / numColumns;


const cardMarginDesserts = 12;
const cardWidthDesserts = (width - cardMargin * (numColumns * 2)) / numColumns;


const BANNER_WIDTH = width * 0.9; // rộng 90% màn hình
const BANNER_HEIGHT = 250;
const staticBanner = {
  id: '1',
  title: '20% Off Premium',
  subtitle: 'Limited time offer',
  description: 'Get access to exclusive recipes',
  image: require('../../../assets/beef_pie.jpg'),
};
const categories = [
  { id: "1", name: "Breakfast", icon: require('../../../assets/beef_pie.jpg') },
  { id: "2", name: "Beef", icon: require('../../../assets/beef_pie.jpg') },
  { id: "3", name: "Chicken", icon: require("../../../assets/beef_pie.jpg") },
  { id: "4", name: "Dessert", icon: require("../../../assets/beef_pie.jpg") },
  { id: "5", name: "All", icon: require("../../../assets/beef_pie.jpg") },
];


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
  const scrollY = useRef(new Animated.Value(0)).current;

  const showButton = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [0, 1], // 0: ẩn, 1: hiện
    extrapolate: "clamp",
  });


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
          keyExtractor={(item, index) =>
            (item && item.id != null ? item.id.toString() : index.toString())
          }
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
          keyExtractor={(item, index) =>
            (item && item.id != null ? item.id.toString() : index.toString())
          }
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
                {/* <Text style={styles.cardChef}>By: {item.createdBy}</Text> */}
                <View style={styles.cardRatingContainer}>
                  <Ionicons name="star" size={14} color="#FFD700" />
                  <Text style={styles.cardRating}>{getAverageRating(item.ratings)}</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
      {/* Banner */}
      <View style={styles.bannerCard}>
        <Image source={staticBanner.image} style={styles.bannerImage} />
        <View style={styles.bannerText}>
          <Text style={styles.title}>{staticBanner.title}</Text>
          <Text style={styles.subtitle}>{staticBanner.subtitle}</Text>
          <Text style={styles.description}>{staticBanner.description}</Text>
        </View>
      </View>
      {/* end banner */}
      {/* Dessert Section Title */}
      <View style={styles.sectionDessert}>
        <View style={styles.sectionHeaderDessert}>
          <Text style={styles.sectionTitleDessert}>More Dessert</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllTextDessert}>See All</Text>
          </TouchableOpacity>
        </View>
      </View>

    </SafeAreaView>
  );
  const renderItem = ({ item }) => (
    // <View>
    //   <TouchableOpacity style={styles.cardDesserts} activeOpacity={0.9}>
    //     <Image source={{ uri: item.thumbnail }} style={styles.cardImage} />
    //     <TouchableOpacity style={styles.heartIcon}>
    //       <Ionicons name="heart-outline" size={20} color="#FF6B00" />
    //     </TouchableOpacity>
    //     <View style={styles.cardContent}>
    //       <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
    //       <View style={styles.cardMeta}>
    //         <View style={styles.cardMetaItem}>
    //           <Ionicons name="time-outline" size={12} color="#888" />
    //           <Text style={styles.cardMetaText}>{item.time.total}</Text>
    //         </View>
    //         <View style={styles.cardMetaItem}>
    //           <Ionicons name="speedometer-outline" size={12} color="#888" />
    //           <Text style={styles.cardMetaText}>{item.difficulty}</Text>
    //         </View>
    //       </View>
    //       <Text style={styles.cardChef}>By: {item.createdBy}</Text>
    //       <View style={styles.cardRatingContainer}>
    //         <Ionicons name="star" size={14} color="#FFD700" />
    //         <Text style={styles.cardRating}>{getAverageRating(item.ratings)}</Text>
    //       </View>
    //     </View>
    //   </TouchableOpacity>
    // </View>
    <View style={styles.cardDesserts}>
      <Image source={{ uri: item.thumbnail }} style={styles.imageDesserts} resizeMode="cover"/>
      <Text style={styles.titleDesserts} numberOfLines={2}>
        {item.title} {item.icon}
      </Text>
    </View>
  );

  const renderPagination = () => (
    <View>
      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={fetchPage}
      />
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <Animated.FlatList
        key={2} // 👉 bắt buộc đổi key nếu numColumns thay đổi
        data={desserts}
        keyExtractor={(item, index) =>
          (item && item._id != null ? item._id.toString() : index.toString())
        }
        renderItem={renderItem}
        numColumns={2} // 👉 chia 2 cột
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderPagination}   // 👈 pagination nằm trong list
        columnWrapperStyle={{ justifyContent: 'space-evenly' }} // căn giữa 2 item
        contentContainerStyle={{ paddingBottom: 24 }} // padding tổng thể + dưới
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
      />
      {/* Nút + luôn nổi */}
      <Animated.View
        style={[
          styles.floatingButton,
          { opacity: showButton } // ẩn/hiện mượt
        ]}
      >
        <TouchableOpacity onPress={() => navigation.navigate("CreateRecipe")}>
          <Text style={{ fontSize: 30, color: "white" }}>+</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  containerHeader: {
    
  },
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
  // cardDesserts
  cardDesserts: {
    width: cardWidthDesserts,
    // marginRight: cardMargin,
    // marginLeft: cardMargin,
    height: cardWidthDesserts * 1.2,
    marginBottom: 16,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  imageDesserts: {
    width: '100%',
    height: '100%',
  },
  titleDesserts: {
    padding: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  // end cardDesserts
  // Card Styles
  card: {
    width: cardWidth,
    marginRight: cardMargin,
    marginBottom: 2,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
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
  // Section Styles
  sectionDessert: {
    marginBottom: 10,
  },
  sectionHeaderDessert: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,

  },
  sectionTitleDessert: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333"
  },
  seeAllTextDessert: {
    fontSize: 14,
    color: "#FF6B00",
    fontWeight: '600',
  },

  // Dessert Styles
  dessertItem: {
    width: 160,
    margin: 8,
    borderRadius: 12,
    backgroundColor: '#fff',
    padding: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },

  dessertImage: {
    width: '100%',
    height: 120,
    borderRadius: 12,
  },

  dessertName: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
  },

  dessertMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },

  difficultyBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },

  easyBadge: { backgroundColor: '#E0F7FA' },
  mediumBadge: { backgroundColor: '#FFF3E0' },

  difficultyText: { fontSize: 12 },
  easyText: { color: '#00ACC1' },
  mediumText: { color: '#FF6B00' },

  timeText: { fontSize: 12, color: '#888' },

  chef: { marginTop: 4, fontSize: 12, color: '#666' },

  dessertActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },

  heartIconSmall: { flexDirection: 'row', alignItems: 'center' },
  ratingContainer: { flexDirection: 'row', alignItems: 'center' },
  rating: { marginLeft: 4, fontSize: 12, color: '#333' },
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
  floatingButton: {
    position: "absolute",
    bottom: 20,
    // left: width / 2 - 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: APP_COLOR.ORANGE,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  // Banner Card Styles
  bannerCard: {
    width: BANNER_WIDTH,
    height: BANNER_HEIGHT,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    alignSelf: 'center', // căn giữa màn hình
    marginVertical: 16,
  },
  bannerImage: {
    width: '100%',
    height: '60%',
  },
  bannerText: {
    padding: 12,
  },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#555', marginBottom: 4 },
  description: { fontSize: 12, color: '#777' },

  // End Banner Card Styles
});

import React, { useEffect, useState, useRef } from 'react';
import { ScrollView, TouchableOpacity, Text, Image, View, ActivityIndicator, StyleSheet, Dimensions, FlatList, SafeAreaView, Animated, ImageBackground } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { recipesApi } from '../../api/api.js';
import Pagination from '../../components/Pagination/Pagination.js';
import { categories } from '../../data/categories.js';
import { staticBanner, BannerCarousel } from '../../data/Banner.js';
import { useSelector } from "react-redux";
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import Carousel from "react-native-reanimated-carousel";
import { APP_COLOR } from '../../utils/constant.js';
const { width } = Dimensions.get("window");
const numColumns = 2;
const cardMargin = 16;
const cardWidth = (width - cardMargin * (numColumns + 1)) / numColumns;

const ITEM_WIDTH = (width - 40) / 2; // 2 cột, margin 20

const BANNER_WIDTH = width * 0.9; // rộng 90% màn hình
const BANNER_HEIGHT = 250;


export default function HomeScreen({ navigation }) {
  const userProfile = useSelector(state => state.user.data);
  const [topPicks, setTopPicks] = useState([]);

  const [desserts, setDesserts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 6; // số item mỗi trang
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
      const res = await recipesApi.list("", pageNum, limit);

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
  // ✅ Tính số sao trung bình, luôn return Number
  const getAverageRating = (ratings = []) => {
    if (!Array.isArray(ratings) || ratings.length === 0) return 0;
    const sum = ratings.reduce((acc, r) => acc + (r?.stars || 0), 0);
    return Number((sum / ratings.length).toFixed(1)); // làm tròn 1 chữ số thập phân
  };

  // ✅ Hiển thị sao theo rating (tối đa 5 sao)
  const renderStars = (rating) => {
    const avg = Math.round(rating); // làm tròn để hiển thị sao
    const filledStars = '⭐'.repeat(avg);
    const emptyStars = '☆'.repeat(5 - avg);
    return filledStars + emptyStars;
  };
  
  const renderHeader = () => (
    <SafeAreaView style={styles.containerHeader}>

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Welcome Back!</Text>
          <Text style={styles.userName}>{userProfile.username}</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate("Profile")} style={styles.notificationButton}>
         <Image source={{ uri: userProfile.avatar }} style={styles.avatarHeader} />
          {/* <View style={styles.notificationBadge} /> */}
        </TouchableOpacity>
      </View>
      {/* end header */}

      <View style={styles.containerCarousel}>
        <Carousel
          height={220}
          loop
          width={width}
          autoPlay={true}
          data={BannerCarousel}
          onSnapToItem={(index) => setCurrentIndex(index)}
          renderItem={({ item }) => (
            <ImageBackground
              source={item.image}
              style={styles.cardCarousel}
              imageStyle={{ borderRadius: 15 }}
            >
              <View style={styles.overlayCarousel}>
                <Text style={styles.titleCarousel}>{item.title}</Text>
                <Text style={styles.subtitleCarousel}>{item.subtitle}</Text>
                <TouchableOpacity style={styles.button}>
                  <Text style={styles.buttonTextCarousel}>{item.buttonText}</Text>
                </TouchableOpacity>
              </View>
            </ImageBackground>
          )}
        />
        <View style={styles.paginationCarousel}>
          {BannerCarousel.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dotCarousel,
                { opacity: index === currentIndex ? 1 : 0.3 },
              ]}
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
                <Image source={item.image} style={styles.categoryIcon} />
              </View>
              <Text style={styles.categoryText}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Top Picks */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recipe Top Picks</Text>
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
          contentContainerStyle={{
            paddingHorizontal: 13,
            columnGap: 13,
            marginBottom: 12
          }}
          renderItem={({ item }) => (
            <View style={styles.itemContainerPicks}>
              <View style={styles.contentPicks}>
                <Text onPress={() =>
                  navigation.navigate("RecipeDetail", { id: item._id }) // 👈 truyền object recipe
                } style={styles.titlePicks}>{item.title}</Text>
                <View style={styles.ratingPicks}>
                  <Text style={styles.starText}> 
                    {renderStars(getAverageRating(item.ratings))} ({getAverageRating(item.ratings)})
                  </Text>
                </View>
                <View style={styles.metaInfoPicks}>
                  <Text style={styles.authorPicks}>👨‍🍳 By Date {item.createdAt
                    ? new Date(item.createdAt).toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                    : ""}</Text>
                  <Text style={styles.timePicks}>🕒 {item.time?.total || '30min'}</Text>
                </View>
              </View>
              <View  style={styles.imageContainerPicks}>
                <Image source={{ uri: item.thumbnail }} style={styles.imagePicks} />
              </View>
            </View>
          )}
        />


      </View>
      {/* Banner */}
      <View style={styles.containerBanner}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Discount Offer</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.bannerCard}>
          <Image source={staticBanner.image} style={styles.bannerImage} />
          <View style={styles.bannerText}>
            <Text style={styles.title}>{staticBanner.title}</Text>
            <Text style={styles.subtitle}>{staticBanner.subtitle}</Text>
            <Text style={styles.description}>{staticBanner.description}</Text>
          </View>
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
    <>
      <TouchableOpacity onPress={() =>
        navigation.navigate("RecipeDetail", { id: item._id }) // 👈 truyền object recipe
      } style={styles.card} activeOpacity={0.9}>
        <Image  source={{ uri: item.thumbnail }} style={styles.cardImage} />
        <TouchableOpacity style={styles.heartIcon}>
          <Ionicons name="heart-outline" size={20} color="#FF6B00" />
        </TouchableOpacity>
        <View style={styles.cardContent}>
          <Text  style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
          <View style={styles.cardMeta}>
            <View style={styles.cardMetaItem}>
              <Ionicons name="time-outline" size={12} color="#888" />
              <Text  style={styles.cardMetaText}>{item.time.total}</Text>
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
    </>
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
        columnWrapperStyle={{ justifyContent: 'space-evenly', marginLeft: 18 }} // căn giữa 2 item
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
  avatarHeader: { width: 40, height: 40, borderRadius: 20 },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  // notificationBadge: {
  //   position: 'absolute',
  //   top: 8,
  //   right: 8,
  //   width: 8,
  //   height: 8,
  //   borderRadius: 4,
  //   backgroundColor: '#FF6B00',
  // },

  // Simple Carousel Styles
  containerCarousel: {
    marginHorizontal: 15,
  },
  
  // Sample Carousel Pagination
  cardCarousel: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
    padding: 13,
  },
  overlayCarousel: {
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 15,
    padding: 10,
  },
  titleCarousel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitleCarousel: {
    fontSize: 14,
    color: '#fff',
    marginVertical: 5,
  },
  buttonCarousel: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 15,
    alignSelf: 'flex-start',
  },
  buttonTextCarousel: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 12,
  },
  paginationCarousel: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  dotCarousel: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#333',
    marginHorizontal: 4,
  },
  // End Simple Carousel Styles
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
  
  itemContainerPicks: {
    width: ITEM_WIDTH,
    backgroundColor: '#ffffffff',
    borderRadius: 12,
    overflow: 'visible',
    marginTop: 60,
    paddingBottom: 40,
    shadowColor: '#ffffffff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    // Android shadow
    elevation: 5,
  },
  imagePicks: {

    width: 120,
    height: 120,
    borderRadius: 80, // = width/2 để tròn hoàn toàn
    alignSelf: 'center',
    marginTop: -50,

  },
  infoPicks: {
    padding: 10,
  },
  titlePicks: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  timePicks: {
    color: '#555',
    fontSize: 14,
  },
  ratingPicks: {
    position: 'absolute',
    top: -40,
    right: 35,
    backgroundColor: '#ffe1a6dd',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
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
    marginBottom: 15,
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
  containerBanner: {
    marginBottom: 0,
  },
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
    marginBottom: 30,
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
  // Top Picks Styles
  itemContainerPicks: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    width: 250,
    height: 120,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    alignItems: 'center',
  },
  contentPicks: {
    flex: 1,
    paddingRight: 12,
    justifyContent: 'center',
  },
  titlePicks: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
    lineHeight: 20,
  },
  ratingPicks: {
    marginBottom: 8,
  },
  starText: {
    fontSize: 12,
    color: '#FFB800',
  },
  metaInfoPicks: {
    gap: 4,
  },
  authorPicks: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  timePicks: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  imageContainerPicks: {
    width: 70,
    height: 70,
    borderRadius: 35,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
  },
  imagePicks: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  // End Top Picks Styles
});
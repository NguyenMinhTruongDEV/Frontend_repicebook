import React, { useEffect, useRef, useState } from "react";
import Icon from "react-native-vector-icons/MaterialIcons"
import CookingCarouselModal from '../Cook/CookingCarouselModal.js';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,

  FlatList,
  Alert,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { recipesApi } from "../../api/api";
import { useSelector } from "react-redux";
import CommentModal from "../../components/model/CommentModal";
import RatingModal from "../../components/model/RatingModal";
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

const RecipeDetail = ({ route, navigation }) => {
  const { id } = route.params;
  // 🔹 Lấy user từ Redux
  const user = useSelector(state => state.user.data);
  const currentUserId = user?.id;

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);


  const [ratingVisible, setRatingVisible] = useState(false); // quản lý hiển thị modal
  const [ratings, setRatings] = useState([]);
  const [newRating, setNewRating] = useState(0); // số sao mới chọn
  const [newRatingComment, setNewRatingComment] = useState("");
  // Coment
  const [commentVisible, setCommentVisible] = useState(false);
  const [newComment, setNewComment] = useState("");

  // End coment

  const [liked, setLiked] = useState(false);
  const [rated, setRated] = useState(false);
  const [commented, setCommented] = useState(false);

  // Cooking
 
  const [ingredients, setIngredients] = useState(
    recipe?.ingredients?.map(item => ({ ...item, amount: Number(item.amount) || 0 })) || []
  );
  useEffect(() => {
    if (recipe?.ingredients) {
      console.log("Length recipe",recipe?.ingredients)
      setIngredients(
        recipe.ingredients.map(item => ({
          ...item,
          amount: Number(item.amount) || 0
        }))
      );
    }
  }, [recipe]);
  const [modalVisible, setModalVisible] = useState(false);

  //  End Cooking


  const fetchRecipeById = async (recipeId) => {
    try {
      const res = await recipesApi.getDetails(recipeId);
      setRecipe(res.data.data);
      setRatings(res.data.data.ratings)
      setIsHidden(res.data.data.isHidden ?? false); // lấy từ API
      if (res?.data?.data?.likes) {
        setLiked(res?.data?.data?.likes == currentUserId)
      } else {
        setLiked(false)
      }

    } catch (err) {
      if (err.response?.status === 404) {
        Alert.alert("Thông báo", "Sản phẩm đã bị ẩn hoặc xóa");
        navigation.goBack(); // tên screen danh sách công thức
      } else {
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchRecipeById(id); // gọi API lấy dữ liệu mới
    }, [id])
  );

  useEffect(() => {
    fetchRecipeById(id); // fetch lại recipe khi comment thay đổi
  }, [newComment, newRatingComment, newRating]);

  useEffect(() => {
    if (recipe && currentUserId) {
      setLiked(Array.isArray(recipe.likes) && recipe.likes.includes(currentUserId));
    }
    // Commented
    setCommented(
      Array.isArray(recipe?.comments) &&
      recipe.comments.some(c => String(c.user) === String(currentUserId))
    );

    // Rated
    setRated(
      Array.isArray(recipe?.ratings) &&
      recipe.ratings.some(r => String(r.user) === String(currentUserId))
    );

  }, [recipe, currentUserId]);

  const handleLike = async () => {
    try {
      const res = await recipesApi.likeRecipes(id);
      const { liked, likes } = res.data.data;

      // ✅ cập nhật trạng thái like theo server
      setLiked(liked);

      // ✅ nếu bạn muốn update luôn số lượt like trong recipe
      setRecipe((prev) => ({
        ...prev,
        likes: Array.isArray(prev.likes)
          ? (liked
            ? [...prev.likes, currentUserId]           // user vừa like
            : prev.likes.filter((uid) => uid !== currentUserId)) // user bỏ like
          : []
      }));

      console.log("Like status:", liked, "Total likes:", likes);
    } catch (err) {
      console.log("Error:", err.response?.data || err);
    }
  };
  // Coments
  const flatListRef = useRef < FlatList > (null);
  const [canComment, setCanComment] = useState(true);


  const handleAddComment = async () => {
    const content = newComment.trim();
    if (!content || !canComment) return; // Không gửi comment rỗng hoặc spam

    try {
      setCanComment(false); // khóa gửi comment tạm thời

      // Gửi comment lên server
      const res = await recipesApi.commentRecipes(id, { content });

      const addedComment = res.data.data; // comment mới từ API

      // Update state cục bộ ngay
      setRecipe((prev) => ({
        ...prev,
        comments: [...(prev.comments || []), addedComment],
      }));

      setNewComment("");
      // Scroll xuống cuối
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 50);
    } catch (error) {
      // Log lỗi chi tiết
      if (error.response) {
        console.error("Failed to add comment:", error.response.status, error.response.data);
      } else {
        console.error("Failed to add comment:", error.message);
      }
    } finally {
      // Mở khóa gửi comment
      setCanComment(true);
    }
  };


  // Xóa comment
  const handleDeleteComment = async (commentId) => {
    try {
      await recipesApi.deleteCommentRecipes(id, commentId); // gọi API xóa
      // Cập nhật state cục bộ
      setRecipe((prev) => ({
        ...prev,
        comments: prev.comments.filter((c) => c._id !== commentId),
      }));
      alert("Xóa comment thành công")
    } catch (err) {
      console.log("Xóa comment thất bại:", err);
    }
  };
  // End Coment

  // Ratings
  // Thêm rating mới

  const [canRating, setCanRating] = useState(true);
  const handleAddRating = async () => {
    const content = newRatingComment.trim();
    if (!content || !canRating) return;

    try {
      setCanRating(false); // khoá spam

      const data = { value: newRating, content };
      const res = await recipesApi.ratingRecipes(id, data);
      const newRatingData = res.data.data;

      setRecipe((prev) => {
        // xóa rating cũ của user trước khi thêm
        const filtered = (prev.ratings || []).filter(r => r.user !== currentUserId);
        return {
          ...prev,
          ratings: [...filtered, newRatingData],
        };
      });
      console.log("Added new rating:", newRatingData);
      setNewRatingComment("");
      setNewRating(0);
      Alert.alert("Success", "You rated this recipe!");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to rate recipe");
    } finally {
      setLoading(false);
      setCanRating(true); // mở lại để lần sau còn rating
    }
  };

  // Xóa rating
  const handleDeleteRating = async () => {
    try {
      // Kiểm tra xem user có rating không
      const userRating = (recipe.ratings || []).find(
        (r) => r.user === currentUserId
      );

      if (!userRating) {
        console.log("User chưa có rating nào để xóa", currentUserId);
        return;
      }

      // Gọi API xóa rating: backend phải nhận userId hoặc recipeId + userId
      await recipesApi.deleteRatingRecipes(id);

      // Cập nhật state cục bộ
      setRecipe((prev) => ({
        ...prev,
        ratings: [...(prev.ratings || []).filter((r) => r.user !== currentUserId)],
      }));

      console.log("Xóa rating của user thành công:", id);
    } catch (err) {
      console.error("Xóa rating thất bại:", err.response?.data || err.message);
    }
  };

  // ✅ Update rating
  const handleUpdateRating = async () => {
    const content = newRatingComment.trim();
    if (!newRating || !content) {
      Alert.alert("Error", "Vui lòng nhập đủ số sao và bình luận");
      return;
    }

    try {
      const data = { value: newRating, content };
      const res = await recipesApi.UpdateRatingRecipes(id, data);
      const updatedRating = res.data.data;

      setRecipe((prev) => {
        const filtered = (prev.ratings || []).filter(r => r.user !== currentUserId);
        return { ...prev, ratings: [...filtered, updatedRating] };
      });

      setNewRating(0);
      setNewRatingComment("");
      Alert.alert("Success", "Rating đã được cập nhật!");
    } catch (error) {
      console.error("Update rating failed:", error.response?.data || error.message);
      Alert.alert("Error", "Không thể cập nhật rating");
    }
  };

  // End Ratings
  // Hide Recipe

  const [isHidden, setIsHidden] = useState(false);
  const handleToggleVisible = async () => {
    try {
      if (isHidden) {
        await recipesApi.unHideRecipe(recipe._id);
        Alert.alert("Thành công", `${recipe._id} Sản phẩm đã được hiển thị lại`);

      } else {
        await recipesApi.hideRecipe(recipe._id);
        Alert.alert("Thành công", `${recipe._id} Sản phẩm đã được ẩn`);

      }

      // Gọi lại API để sync
      fetchRecipeById(recipe._id);
    } catch (err) {
      console.log(err);
      Alert.alert("Lỗi", "Không thể cập nhật trạng thái sản phẩm");
    }
  };

  const handleDeleteRecipe = () => {
    Alert.alert(
      "Xác nhận",
      "Bạn có chắc chắn muốn xóa sản phẩm này?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            try {
              await recipesApi.deleteRecipe(id);
              Alert.alert("Thành công", "Sản phẩm đã được xóa");

              // Điều hướng thẳng về tab Search (theo navigator bạn gửi trước đó)
              navigation.navigate("MainTabs", { screen: "Search" });

              // Hoặc nếu muốn chắc chắn là danh sách công thức:
              // navigation.navigate("RecipesList");
            } catch (err) {
              console.error("Delete error:", err);
              Alert.alert("Lỗi", "Không thể xóa sản phẩm");
            }
          },
        },
      ]
    );
  };


  // End Hide Recipe
  if (loading)
    return (
      <ActivityIndicator size="large" color="#FFD84D" style={{ marginTop: 50 }} />
    );

  if (!recipe?._id)
    return <Text style={{ margin: 20 }}>Không tìm thấy món ăn</Text>;

  return (
    <SafeAreaView style={styles.container} contentContainerStyle={{ paddingBottom: 160 }}>
      <ScrollView>
        {/* Thumbnail + Overlay buttons */}
        <View>
          <Image source={{ uri: recipe.thumbnail }} style={styles.thumbnail} />

          {/* Overlay buttons */}
          <View style={styles.topButtons}>
            {/* Back button */}
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="#000" style={styles.iconBtn} />
            </TouchableOpacity>

            {/* Right buttons */}
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                onPress={handleLike}
                style={{ flexDirection: "row", alignItems: "center", position: "relative" }}
              >
                <Ionicons
                  name={liked ? "heart" : "heart-outline"}
                  size={24}
                  color={liked ? "red" : "gray"} // đỏ nếu đã like, xám nếu chưa
                  style={styles.iconBtn}
                />
                <Text
                  style={{
                    marginLeft: 5,
                    fontSize: 22,
                    color: "red",       // chữ màu đỏ
                    fontWeight: "900",  // in đậm cho nổi bật (tuỳ chọn)
                    position: "absolute",
                    top: -10,
                    right: 0
                  }}
                >
                  {Array.isArray(recipe?.likes) ? recipe?.likes?.length : 0}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setCommentVisible(true)}>
                <Ionicons
                  name={commented ? "chatbubble" : "chatbubble-outline"}
                  size={24}
                  color={commented ? "#007bff" : "gray"} // xanh khi đã comment
                  style={styles.iconBtn}
                />
                <Text
                  style={{
                    marginLeft: 5,
                    fontSize: 22,
                    color: "red",       // chữ màu đỏ
                    fontWeight: "900",  // in đậm cho nổi bật (tuỳ chọn)

                    position: "absolute",
                    top: -10,
                    right: 0
                  }}
                >
                  {Array.isArray(recipe.comments) ? recipe.comments.length : 0}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setRatingVisible(true)}
                style={{ flexDirection: "row", alignItems: "center", position: "relative" }}
              >
                <Ionicons
                  name={rated ? "star" : "star-outline"}
                  size={24}
                  color={rated ? "#ffbf00ff" : "gray"} // đỏ nếu đã like, xám nếu chưa
                  style={styles.iconBtn}
                />
                <Text
                  style={{
                    marginLeft: 5,
                    fontSize: 22,
                    color: "red",       // chữ màu đỏ
                    fontWeight: "900",  // in đậm cho nổi bật (tuỳ chọn)
                    position: "absolute",
                    top: -10,
                    right: 0
                  }}
                >
                  {Array.isArray(recipe.ratings) ? recipe.ratings.length : 0}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() =>
                navigation.navigate("UpdateRecipe", {
                  id: recipe._id,

                })
              }>
                <Ionicons
                  name="ellipsis-vertical"
                  size={24}
                  color="#000"
                  style={styles.iconBtn}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Title + Category */}
        <View style={styles.header}>
          <View>
            <View style={{ paddingVertical: 10 }}>
              <Text style={styles.title}>{recipe.title}</Text>

              {user?.role && (
                <Text style={styles.role}>{user.role}</Text>
              )}

              <Text style={styles.summary}>{recipe.summary || "Uncategorized"}</Text>

              {recipe.tags?.length > 0 && (
                <Text style={styles.category}>
                  #{recipe.tags.join(" - ")}
                </Text>
              )}
            </View>
            {/* Nếu là admin thì mới hiển thị các nút quản lý */}
            {user?.role === "admin" && (
              <View style={{ marginTop: 10, flexDirection: "row", justifyContent: "space-between" }}>
                {/* Nút Xóa sản phẩm */}
                <TouchableOpacity
                  onPress={handleDeleteRecipe}
                  style={{
                    flex: 1,
                    backgroundColor: "#ff4d4f",
                    paddingVertical: 12,
                    borderRadius: 10,
                    alignItems: "center",
                    marginRight: 8,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5
                  }}
                >
                  <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>Xóa sản phẩm</Text>
                </TouchableOpacity>

                {/* Nút Hiện/Ẩn sản phẩm */}
                <TouchableOpacity
                  onPress={handleToggleVisible}
                  style={{
                    flex: 1,
                    backgroundColor: recipe.isHidden ? "#52c41a" : "#faad14",
                    paddingVertical: 12,
                    borderRadius: 10,
                    alignItems: "center",
                    marginLeft: 8,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5
                  }}
                >
                  <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
                    {recipe.isHidden ? "Hiện sản phẩm" : "Ẩn sản phẩm"}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

          </View>

          
        </View>

        {/* Info row */}
        <View style={styles.infoRow}>
          <View style={styles.infoBox}>
            <View style={styles.iconWrapper}>
              <Ionicons name="time-outline" size={35} color="#000" />
            </View>
            <Text style={styles.infoText}>{recipe.time?.total ?? 0}{"\n"} Mins</Text>

          </View>

          <View style={styles.infoBox}>
            <View style={styles.iconWrapper}>
              <Ionicons name="people-outline" size={30} color="#000" />
            </View>
            <Text style={styles.infoText}>{recipe.servings}{"\n"} Servings</Text>
          </View>

          <View style={styles.infoBox}>
            <View style={styles.iconWrapper}>
              <Ionicons name="flame-outline" size={30} color="#000" />
            </View>
            <Text style={styles.infoText}>{recipe.calories ?? 0}{"\n"} Cal</Text>
          </View>

          <View style={styles.infoBox}>
            <View style={styles.iconWrapper}>
              <Ionicons name="layers-outline" size={30} color="#000" />
            </View>
            <Text style={styles.infoText}>{recipe.difficulty}</Text>
          </View>
        </View>

        {/* Ingredients */}
        <Text style={styles.sectionTitle}>Ingredients</Text>
        {recipe.ingredients?.map((item, index) => (
          <View key={index} style={styles.ingredientRow}>
            {/* Chấm tròn vàng */}
            <View style={styles.bullet} />

            {/* Text */}
            <Text style={styles.ingredientText}>
              <Text style={styles.ingredientBold}>{item.quantity}{item.unit} </Text>
              {item.name}
            </Text>
          </View>
        ))}
        {/* Steps */}
        <Text style={styles.sectionTitle}>Steps</Text>
        {recipe.steps?.map((step, index) => (
          <View key={index} style={styles.stepRow}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>{index + 1}</Text>
            </View>
            <Text style={styles.stepText}>{step}</Text>
          </View>
        ))}
        {/* Contents */}

        {/* Description từ content (HTML) */}
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.contentTitle}>{recipe.content}</Text>


        <CommentModal
          visible={commentVisible}       // phải truyền state visible
          onClose={() => setCommentVisible(false)}  // đóng modal
          recipe={recipe}
          currentUserId={currentUserId}
          newComment={newComment}
          setNewComment={setNewComment}
          handleAddComment={handleAddComment}
          handleDeleteComment={handleDeleteComment}
        />
        {/* RatingModal */}
        <RatingModal
          visible={ratingVisible}
          onClose={() => setRatingVisible(false)}
          recipe={recipe}
          currentUserId={currentUserId}
          newRating={newRating}
          setNewRating={setNewRating}
          newRatingComment={newRatingComment}
          setNewRatingComment={setNewRatingComment}
          handleAddRating={handleAddRating}
          handleUpdateRating={handleUpdateRating}
          handleDeleteRating={handleDeleteRating}
        />
      </ScrollView>
      
      
      {/* Cooking */}
      <View style={{ padding: 20, alignItems: "center" }}>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          activeOpacity={0.8}
          style={styles.startCookButton}
        >
          <Icon name="restaurant-menu" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>Start Cook</Text>
        </TouchableOpacity>

        {/* Modal */}
        <CookingCarouselModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          recipe={recipe}
        />
      </View>
    </SafeAreaView>
  );
};

export default RecipeDetail;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", marginBottom: 60 },
  thumbnail: {
    width: "100%",
    height: 220,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  topButtons: {
    position: "absolute",
    top: 40,
    left: 16,
    right: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconBtn: {
    backgroundColor: "rgba(255,255,255,0.8)",
    padding: 8,
    borderRadius: 20,
    marginLeft: 8,
  },
  header: { padding: 16 },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  role: {
    fontSize: 14,
    color: "#fa541c",
    marginBottom: 6,
  },
  summary: {
    fontSize: 16,
    color: "#555",
    marginBottom: 6,
  },
  category: {
    fontSize: 14,
    color: "#888",
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: 16,
    marginBottom: 16,

  },
 
  infoBox: {
    alignItems: "center",
    backgroundColor: "#FFD84D",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 30,
    minWidth: 70,
  },

  iconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#ffffffff",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffffff",
  },
  infoText: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: "600",
    color: "#000",
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 6,
  },
  contentTitle: {
    marginHorizontal: 25,
    marginTop: 2,
    marginBottom: 6,
  },
  ingredientRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 6,
  },
  bullet: {
    width: 13,
    height: 13,
    borderRadius: 50,
    backgroundColor: "#FFD84D",
    marginRight: 10,
  },
  ingredientText: {
    fontSize: 18,
    color: "#000",
  },
  ingredientBold: {
    fontWeight: "bold",
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginHorizontal: 16,
    marginBottom: 10,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#FFD84D",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  stepNumberText: {
    fontWeight: "bold",
    color: "#000",
  },
  stepText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    lineHeight: 22,
  },
  // Coments
  // Start Cook
  startCookButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fa541c",
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  }
  // End Start Cook
});

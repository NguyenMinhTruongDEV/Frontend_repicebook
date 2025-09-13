import axiosInstance from "../utils/axiosInstance.js"
// ======================== AUTH API ========================
export const authApi = {
  login: (data) => axiosInstance.post("/auth/login", data),
  register: (data) => axiosInstance.post("/auth/register", data),
  profile: () => axiosInstance.get("/users/profile"),
  editProfile: (data) => axiosInstance.put("/users/update-info", data),
  editChangePassword : (data) => axiosInstance.put("/users/change-password", data),
  editAvatar: (data) => axiosInstance.put("/users/avatar", data),
  // Sent Verify mail
  sentVerifyEmail: () => axiosInstance.post("/auth/verify/request"),
  // Verify mail otp
  verifyEmailOtp: (data) => axiosInstance.post("/auth/verify/confirm-code", data),
  forgotPassword: (data) => axiosInstance.post("/auth/forgot", data),
  resetPasswordOTP: (data) => axiosInstance.post("/auth/reset/code", data),
};

// ======================== RECIPES API ========================
export const recipesApi = {
  list: (q = "", page, limit) => axiosInstance.get("/recipes", { params: { q, page, limit } }),
  listRecipes: (q = "", page, limit) => axiosInstance.get("/recipes", { params: { q, page, limit } }), 
  updateRecipes: (id_recipe, data) => axiosInstance.put(`recipes/${id_recipe}`, data),
  createRecipes: (data) => axiosInstance.post("/recipes", data),
  getDetails: (id) => axiosInstance.get(`/recipes/${id}`),
  likeRecipes: (id) => axiosInstance.post(`/recipes/${id}/like`),
  ratingRecipes: (id_recipe, data) => axiosInstance.post(`/recipes/${id_recipe}/rate`, data),
  UpdateRatingRecipes: (id_recipe, data) => axiosInstance.put(`/recipes/${id_recipe}/rating`, data), 
  commentRecipes: (id, data) => axiosInstance.post(`/recipes/${id}/comments`, data),
  deleteCommentRecipes: (id_recipe, comment_id) => axiosInstance.delete(`/recipes/${id_recipe}/comments/${comment_id}`),
  deleteRatingRecipes: (id_recipe) => axiosInstance.delete(`recipes/${id_recipe}/rating`),
  // Admin
  hideRecipe: (id_recipe) => axiosInstance.patch(`/recipes/${id_recipe}/hide`),
  unHideRecipe: (id_recipe) => axiosInstance.patch(`/recipes/${id_recipe}/unhide`),
  deleteRecipe: (id_recipe) => axiosInstance.delete(`/recipes/${id_recipe}`),
  getAllUser: () => axiosInstance.get(`/users/`),
  // Get User By ID
  getUserById: (userId) => axiosInstance.get(`/users/${userId}`),
  // updateUserStatus
  updateUserStatus: (userId, data) => axiosInstance.put(`/users/${userId}/status`, data),
  // updateUserRole
  updateUserRole: (userId, data) => axiosInstance.put(`/users/${userId}/role`, data),
  // deleteUserRole
  deleteUserRole: (userId) => axiosInstance.delete(`/users/${userId}`),
};

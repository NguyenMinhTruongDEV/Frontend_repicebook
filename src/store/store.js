import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../slice/userSlice.js';
import recipeReducer from '../slice/recipeSlice.js'; // slice mới lưu công thức

export const store = configureStore({
  reducer: {
    user: userReducer,
    recipes: recipeReducer, // thêm slice recipes
  },
});

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  savedRecipes: [], // tất cả recipe đã lưu
};

const recipeSlice = createSlice({
  name: 'recipes',
  initialState,
  reducers: {
    addRecipe: (state, action) => {
      state.savedRecipes.push(action.payload);
    },
    removeRecipe: (state, action) => {
      state.savedRecipes = state.savedRecipes.filter(r => r.id !== action.payload);
    },
    setRecipes: (state, action) => {
      state.savedRecipes = action.payload;
    },
  },
});

export const { addRecipe, removeRecipe, setRecipes } = recipeSlice.actions;
export default recipeSlice.reducer;

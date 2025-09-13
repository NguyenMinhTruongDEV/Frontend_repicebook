import { createSelector } from 'reselect';

// Lấy userId
export const selectUserId = state => state.user.data?.id;

// Lấy tất cả recipes
export const selectSavedRecipes = state => state.recipes.savedRecipes;

// Lọc theo userId và memoized
export const selectRecipesByUser = createSelector(
  [selectSavedRecipes, selectUserId],
  (recipes, userId) => {
    if (!userId) return [];
    return recipes.filter(r => r.userId === userId);
  }
);

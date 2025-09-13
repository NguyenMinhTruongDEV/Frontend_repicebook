import AsyncStorage from '@react-native-async-storage/async-storage';
import { store } from '../store/store.js';
import { addRecipe } from './recipeSlice';

export const saveRecipe = async (recipe, numPeople) => {
  const state = store.getState();
  const user = state.user.data;

  if (!user?.id) {
    console.log('User chưa login, không lưu công thức');
    return;
  }

  const recipeToSave = {
    id: recipe.id ? recipe.id.toString() : new Date().getTime().toString(),
    ...recipe,
    userId: user.id,
    cookedFor: numPeople,
    cookedAt: new Date().toISOString(),
  };

  // Redux
  store.dispatch(addRecipe(recipeToSave));

  // AsyncStorage
  const saved = await AsyncStorage.getItem('savedRecipes');
  let recipes = saved ? JSON.parse(saved) : [];
  const exists = recipes.find(r => r.id === recipeToSave.id && r.userId === user.id);
  if (!exists) recipes.push(recipeToSave);
  await AsyncStorage.setItem('savedRecipes', JSON.stringify(recipes));

  console.log('Recipe saved for user:', user.id);
};

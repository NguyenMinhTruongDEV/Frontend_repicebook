import React from 'react';
import { View, Text, FlatList, Button, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { removeRecipe } from '../../slice/recipeSlice';
import { selectRecipesByUser } from '../../slice/selectors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SavedRecipesScreen = () => {
  const dispatch = useDispatch();
  const savedRecipes = useSelector(selectRecipesByUser);

  const handleDelete = async (id) => {
    Alert.alert(
      'Xóa công thức',
      'Bạn có chắc muốn xóa công thức này?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            // Redux
            dispatch(removeRecipe(id));

            // AsyncStorage
            const saved = await AsyncStorage.getItem('savedRecipes');
            let recipes = saved ? JSON.parse(saved) : [];
            recipes = recipes.filter(r => r.id !== id);
            await AsyncStorage.setItem('savedRecipes', JSON.stringify(recipes));
          },
        },
      ]
    );
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
        Công thức đã nấu của bạn
      </Text>

      <FlatList
        data={savedRecipes}
        keyExtractor={item => item.id ? item.id.toString() : (new Date().getTime() + Math.random()).toString()}
        renderItem={({ item }) => (
          <View style={{
            padding: 10,
            borderBottomWidth: 1,
            borderColor: '#ccc',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <View>
              <Text>Tên món ăn: {item.title}</Text>
              <Text>Số lượng người ăn: {item.cookedFor}</Text>
              <Text>Ngày nấu: {new Date(item.cookedAt).toLocaleDateString()}</Text>
            </View>
            <Button title="Xóa" color="red" onPress={() => handleDelete(item.id)} />
          </View>
        )}
        ListEmptyComponent={<Text>Bạn chưa nấu món ăn nào.</Text>}
      />
    </View>
  );
};

export default SavedRecipesScreen;

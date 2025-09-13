import React, { useRef, useState, useMemo, useCallback } from 'react';
import { Modal, View, FlatList, Button, Dimensions, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { addRecipe } from '../../slice/recipeSlice';
import { selectUserId } from '../../slice/selectors';

import StepIngredients from './StepIngredients';
import StepCooking from './StepCooking';
import StepTimeComplete from './StepTimeComplete';
import StepComplete from './StepComplete';

const { width } = Dimensions.get('window');
const PAGE_WIDTH = width - 40;

const CookingCarouselModal = ({ visible, onClose, recipe }) => {
  const dispatch = useDispatch();
  const userId = useSelector(selectUserId);

  const [numPeople, setNumPeople] = useState('1');
  const flatListRef = useRef();
  const [currentIndex, setCurrentIndex] = useState(0);

  const steps = useMemo(() => [
    { type: 'ingredients', ingredients: recipe.ingredients },
    ...recipe.steps.map(step => ({ type: 'cooking', step })),
    {
      type: 'timeComplete',
      prepTime: recipe.time?.prep || 0,
      cookTime: recipe.time?.cook || 0,
      recipePeople: recipe.defaultPeople || 1,
      numPeople: Number(numPeople) || 1,
    },
    { type: 'complete' },
  ], [recipe, numPeople]);

  const handleNext = async () => {
    const currentStep = steps[currentIndex];

    if (currentStep.type === 'ingredients') {
      if (!userId) {
        Alert.alert('Vui lòng đăng nhập để lưu công thức!');
      }
      if (isNaN(Number(numPeople)) || Number(numPeople) <= 0) {
        Alert.alert('Vui lòng nhập số người hợp lệ!');
        return;
      }
    }

    if (currentIndex < steps.length - 1) {
      const nextIndex = currentIndex + 1;
      flatListRef.current.scrollToIndex({ index: nextIndex, animated: true, viewPosition: 0 });
      setCurrentIndex(nextIndex);
    } else {
      // Hoàn thành → lưu recipe
      if (userId) {
        const recipeToSave = {
          id: recipe.id ? recipe.id.toString() : new Date().getTime().toString(),
          ...recipe,
          userId,
          cookedFor: Number(numPeople),
          cookedAt: new Date().toISOString(),
          ingredients: recipe.ingredients.map(i => ({
            ...i,
            quantity: (i.quantity * Number(numPeople)) / (recipe.defaultPeople || 1)
          })),
        };

        // Redux
        dispatch(addRecipe(recipeToSave));

        // AsyncStorage
        const saved = await AsyncStorage.getItem('savedRecipes');
        let recipes = saved ? JSON.parse(saved) : [];
        recipes.push(recipeToSave);
        await AsyncStorage.setItem('savedRecipes', JSON.stringify(recipes));
      }

      onClose();
      setCurrentIndex(0);
      setNumPeople('1');
    }
  };

  const renderItem = useCallback(({ item, index }) => {
    switch (item.type) {
      case 'ingredients':
        return (
          <View style={{ width: PAGE_WIDTH }}>
            <StepIngredients
              ingredients={item.ingredients}
              numPeople={numPeople}
              setNumPeople={setNumPeople}
              defaultPeople={recipe.defaultPeople || 1}
            />
          </View>
        );
      case 'cooking':
        return (
          <View style={{ width: PAGE_WIDTH }}>
            <StepCooking stepIndex={index - 1} step={item.step} />
          </View>
        );
      case 'timeComplete':
        return (
          <View style={{ width: PAGE_WIDTH }}>
            <StepTimeComplete
              prepTime={item.prepTime}
              cookTime={item.cookTime}
              recipePeople={item.recipePeople}
              numPeople={item.numPeople}
            />
          </View>
        );
      case 'complete':
        return (
          <View style={{ width: PAGE_WIDTH }}>
            <StepComplete />
          </View>
        );
      default:
        return null;
    }
  }, [numPeople, recipe.defaultPeople]);

  const getItemLayout = (_, index) => ({
    length: PAGE_WIDTH,
    offset: PAGE_WIDTH * index,
    index,
  });

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <FlatList
            ref={flatListRef}
            data={steps}
            horizontal
            pagingEnabled
            scrollEnabled={false}
            keyExtractor={(_, index) => index.toString()}
            renderItem={renderItem}
            showsHorizontalScrollIndicator={false}
            getItemLayout={getItemLayout}
          />
          <Button
            title={currentIndex === steps.length - 1 ? 'Hoàn thành' : 'Next'}
            onPress={handleNext}
          />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: 'white', margin: 20, padding: 20, borderRadius: 10, width: PAGE_WIDTH },
});

export default CookingCarouselModal;

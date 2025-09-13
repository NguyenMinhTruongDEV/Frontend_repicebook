import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const StepTimeComplete = ({ prepTime, cookTime, recipePeople, numPeople }) => {
  const nPeople = Number(numPeople) || 1;
  const rPeople = Number(recipePeople) || 1;
  const pTime = Number(prepTime) || 0;
  const cTime = Number(cookTime) || 0;

  const scaledCookTime = (cTime * nPeople) / rPeople;
  const totalTime = pTime + scaledCookTime;

  return (
    <View style={styles.page}>
      <Text style={styles.completed}>Thời gian chuẩn bị: {pTime} phút</Text>
      <Text style={styles.completed}>Thời gian nấu: {scaledCookTime.toFixed(0)} phút</Text>
      <Text style={styles.completed}>Tổng thời gian: {totalTime.toFixed(0)} phút</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  page: { paddingVertical: 20 },
  completed: { fontWeight: 'bold', fontSize: 16, color: 'blue', marginVertical: 5 },
});

export default memo(StepTimeComplete);

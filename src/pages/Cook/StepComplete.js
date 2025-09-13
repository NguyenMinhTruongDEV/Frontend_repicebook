import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const StepComplete = () => (
  <View style={styles.page}>
    <Text style={styles.completed}>🎉 Hoàn thành món ăn! 🎉</Text>
  </View>
);

const styles = StyleSheet.create({
  page: { paddingVertical: 20, alignItems: 'center' },
  completed: { fontWeight: 'bold', fontSize: 18, color: 'green' },
});

export default memo(StepComplete);

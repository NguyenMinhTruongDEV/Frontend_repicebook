import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const StepCooking = ({ stepIndex, step }) => (
  <View style={styles.page}>
    <Text style={styles.step}>Bước {stepIndex + 1}: {step}</Text>
    {/* <Text style={styles.text}>{step}</Text> */}
  </View>
);

const styles = StyleSheet.create({
  page: { paddingVertical: 20 },
  step: { fontWeight: 'bold', fontSize: 16, marginBottom: 5 },
  text: { fontSize: 14 },
});

export default memo(StepCooking);

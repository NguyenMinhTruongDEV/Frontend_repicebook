import React, { memo } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet } from 'react-native';

const StepIngredients = ({ ingredients, numPeople, setNumPeople }) => {
  const nPeople = Number(numPeople) || 1;

  const scaledIngredients = ingredients.map(item => ({
    ...item,
    amount: (Number(item.quantity || item.amount) || 0) * nPeople,
  }));

  return (
    <View style={styles.page}>
      <Text style={styles.title}>Nhập số lượng người:</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={String(numPeople)}
        onChangeText={setNumPeople}
      />
      <Text style={styles.title}>Nguyên liệu:</Text>
      <FlatList
        data={scaledIngredients}
        keyExtractor={(item, idx) => idx.toString()}
        renderItem={({ item }) => (
          <Text style={styles.item}>
            {item.name}: {item.amount} {item.unit}
          </Text>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  page: { paddingVertical: 20 },
  title: { fontWeight: 'bold', marginVertical: 10, fontSize: 16 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5, marginBottom: 10 },
  item: { marginVertical: 2, fontSize: 14 },
});

export default memo(StepIngredients);

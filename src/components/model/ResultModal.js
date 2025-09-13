import React from 'react';
import { View, Text, Modal, Button, StyleSheet } from 'react-native';

const ResultModal = ({ visible, onClose, ingredients }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Nguyên liệu chuẩn bị:</Text>
          {ingredients.length === 0 ? (
            <Text>Chưa có nguyên liệu</Text>
          ) : (
            ingredients.map((item, index) => (
              <Text key={index}>
                {item.name}: {item.amount} {item.unit}
              </Text>
            ))
          )}
          <Button title="Đóng" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
  },
});

export default ResultModal;

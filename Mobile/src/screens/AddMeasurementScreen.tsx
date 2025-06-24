import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

function AddMeasurementScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Adicionar Nova Medida</Text>
      <Text>Formulário para adicionar novas medidas virá aqui.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default AddMeasurementScreen;


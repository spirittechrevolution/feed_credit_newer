import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import COLORS from '../utils/colors';

/**
 * Badge de catégorie cliquable (actif: rouge, inactif: gris)
 * Props: label, active, onPress
 */
const CategoryChip = ({label, active = false, onPress}) => {
  return (
    <TouchableOpacity
      style={[styles.chip, active && styles.chipActive]}
      onPress={onPress}
      activeOpacity={0.8}>
      <Text style={[styles.text, active && styles.textActive]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.lightGrey,
    marginRight: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  text: {
    fontSize: 14,
    color: COLORS.grey,
    fontWeight: '500',
  },
  textActive: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
});

export default CategoryChip;

import React from 'react';
import {View, StyleSheet} from 'react-native';
import COLORS from '../utils/colors';

/**
 * Barre de progression rouge sur fond gris
 * Props: progress (0 à 1), style
 */
const ProgressBar = ({progress = 0, style}) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 1);
  return (
    <View style={[styles.track, style]}>
      <View style={[styles.bar, {width: `${clampedProgress * 100}%`}]} />
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    height: 6,
    backgroundColor: COLORS.border,
    borderRadius: 3,
    overflow: 'hidden',
    width: '100%',
  },
  bar: {
    height: 6,
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
});

export default ProgressBar;

import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import COLORS from '../utils/colors';

/**
 * Footer — barre de bas de page avec logo M2 Business
 */
const Footer = () => (
  <View style={styles.container}>
    <View style={styles.divider} />
    <View style={styles.content}>
      <View style={styles.logoBox}>
        <Text style={styles.logoM2}>M2</Text>
        <Text style={styles.logoBusiness}>BUSINESS</Text>
      </View>
      <Text style={styles.tagline}>Powered by M2 Business</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 10,
  },
  logoBox: {
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  logoM2: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1,
  },
  logoBusiness: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 2,
    marginLeft: 2,
  },
  tagline: {
    color: COLORS.grey,
    fontSize: 11,
  },
});

export default Footer;

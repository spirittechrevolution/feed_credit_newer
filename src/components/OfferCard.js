import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import COLORS from '../utils/colors';
import ProgressBar from './ProgressBar';
import ButtonPrimary from './ButtonPrimary';
import ButtonOutline from './ButtonOutline';

/**
 * Carte d'offre réutilisable
 * Props: offer (objet), onPress
 */
const OfferCard = ({offer, onPress}) => {
  const progress = offer.available / offer.max;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.95}>
      {/* En-tête: emoji + titre */}
      <View style={styles.header}>
        <Text style={styles.emoji}>{offer.emoji}</Text>
        <View style={styles.titleBlock}>
          <Text style={styles.title}>{offer.title}</Text>
          <Text style={styles.mode}>{offer.mode}</Text>
        </View>
      </View>

      {/* Prix */}
      <View style={styles.priceRow}>
        <View>
          <Text style={styles.priceLabel}>Au comptant</Text>
          <Text style={styles.priceCash}>{offer.priceCash.toLocaleString('fr-FR')} CFA</Text>
        </View>
        <View style={styles.divider} />
        <View>
          <Text style={styles.priceLabel}>À crédit</Text>
          <Text style={styles.priceCredit}>{offer.priceCredit.toLocaleString('fr-FR')} CFA</Text>
        </View>
      </View>

      {/* Places disponibles */}
      <View style={styles.placesRow}>
        <Text style={styles.placesText}>
          Places: <Text style={styles.placesBold}>{offer.available}/{offer.max}</Text>
        </Text>
        <Text style={styles.placesPercent}>{Math.round(progress * 100)}% rempli</Text>
      </View>
      <ProgressBar progress={progress} style={styles.progressBar} />

      {/* Bouton */}
      <ButtonPrimary
        title="VOIR L'OFFRE"
        onPress={onPress}
        style={styles.button}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  emoji: {
    fontSize: 36,
    marginRight: 12,
  },
  titleBlock: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  mode: {
    fontSize: 13,
    color: COLORS.grey,
    marginTop: 2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 10,
  },
  priceLabel: {
    fontSize: 12,
    color: COLORS.grey,
    marginBottom: 2,
  },
  priceCash: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  priceCredit: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  divider: {
    width: 1,
    height: 36,
    backgroundColor: COLORS.border,
    marginHorizontal: 16,
  },
  placesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  placesText: {
    fontSize: 13,
    color: COLORS.grey,
  },
  placesBold: {
    fontWeight: 'bold',
    color: COLORS.text,
  },
  placesPercent: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '600',
  },
  progressBar: {
    marginBottom: 14,
  },
  button: {
    paddingVertical: 11,
  },
});

export default OfferCard;

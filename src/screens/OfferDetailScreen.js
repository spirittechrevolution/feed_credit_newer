import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  Share,
  StatusBar,
} from 'react-native';
import COLORS from '../utils/colors';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {offerFeatures} from '../utils/mockData';
import ButtonPrimary from '../components/ButtonPrimary';
import ButtonOutline from '../components/ButtonOutline';
import ProgressBar from '../components/ProgressBar';
import {useCart} from '../context/CartContext';

/**
 * OfferDetailScreen — détail d'une offre avec onglets Description / Paiement
 */
const OfferDetailScreen = ({route, navigation}) => {
  const insets = useSafeAreaInsets();
  const {offer} = route.params;
  const [activeTab, setActiveTab] = useState('description');
  const progress = offer.available / offer.max;
  const {addToCart} = useCart();

  const handleShare = async () => {
    const message =
      `${offer.emoji} ${offer.title}\n` +
      `Comptant : ${offer.priceCash.toLocaleString('fr-FR')} CFA | Credit : ${offer.priceCredit.toLocaleString('fr-FR')} CFA\n` +
      `Modalite : ${offer.mode}\n` +
      `Disponibles : ${offer.available}/${offer.max}\n` +
      `Commandez sur FeedCredit !`;
    if (Platform.OS === 'web') {
      if (navigator.share) {
        navigator.share({title: offer.title, text: message}).catch(() => {});
      } else {
        window.alert(message);
      }
    } else {
      Share.share({message}).catch(() => {});
    }
  };

  const handleAddToCart = mode => {
    addToCart(offer, mode);
    Alert.alert(
      'Ajoute au panier',
      `${offer.title} ajoute au panier (${mode === 'credit' ? 'a credit' : 'au comptant'})`,
      [
        {text: 'Continuer', style: 'cancel'},
        {text: 'Voir le panier', onPress: () => navigation.navigate('Cart')},
      ],
    );
  };

  const handleBuyCash = () => {
    const message = `Confirmez l'achat de ${offer.title} pour ${offer.priceCash.toLocaleString('fr-FR')} CFA ?`;
    if (Platform.OS === 'web') {
      if (window.confirm(message)) {
        window.alert('Commande enregistrée !');
        navigation.navigate('Subscriptions');
      }
    } else {
      Alert.alert(
        'Achat au comptant',
        message,
        [
          {text: 'Annuler', style: 'cancel'},
          {
            text: 'Confirmer',
            onPress: () => {
              Alert.alert('Succès', 'Commande enregistrée !');
              navigation.navigate('Subscriptions');
            },
          },
        ],
      );
    }
  };

  const handleBuyCredit = () => {
    navigation.navigate('Payment', {offer, mode: 'credit'});
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />

      {/* ——— Header personnalisé ——— */}
      <View style={[styles.header, {paddingTop: insets.top + 8}]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detail de l'offre</Text>
        <TouchableOpacity onPress={handleShare} style={styles.shareBtn}>
          <Text style={styles.shareIcon}>↗</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        {/* ——— Image placeholder ——— */}
        <View style={styles.imagePlaceholder}>
          <Text style={styles.imagePlaceholderEmoji}>{offer.emoji}</Text>
        </View>

        <View style={styles.body}>
          {/* Titre et mode */}
          <Text style={styles.title}>{offer.title}</Text>
          <Text style={styles.mode}>📅 Modalité: {offer.mode}</Text>

          {/* Participants */}
          <View style={styles.participantsBox}>
            <View style={styles.participantsRow}>
              <Text style={styles.participantsLabel}>
                Participants: {offer.available}/{offer.max}
              </Text>
              <Text style={styles.participantsPercent}>
                {Math.round(progress * 100)}% rempli
              </Text>
            </View>
            <ProgressBar progress={progress} />
          </View>

          {/* ——— ONGLETS ——— */}
          <View style={styles.tabs}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'description' && styles.tabActive]}
              onPress={() => setActiveTab('description')}>
              <Text style={[styles.tabText, activeTab === 'description' && styles.tabTextActive]}>
                Description
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'payment' && styles.tabActive]}
              onPress={() => setActiveTab('payment')}>
              <Text style={[styles.tabText, activeTab === 'payment' && styles.tabTextActive]}>
                Paiement
              </Text>
            </TouchableOpacity>
          </View>

          {/* ——— DESCRIPTION ——— */}
          {activeTab === 'description' && (
            <View style={styles.tabContent}>
              <Text style={styles.description}>{offer.description}</Text>
              <View style={styles.infoRow}>
                {offerFeatures.map(feat => (
                  <View key={feat.id} style={styles.infoChip}>
                    <Text style={styles.infoChipIcon}>{feat.icon}</Text>
                    <Text style={styles.infoChipText}>{feat.label}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* ——— PAIEMENT ——— */}
          {activeTab === 'payment' && (
            <View style={styles.tabContent}>
              <View style={styles.priceTable}>
                <View style={styles.priceRow}>
                  <Text style={styles.priceKey}>Prix au comptant</Text>
                  <Text style={styles.priceVal}>
                    {offer.priceCash.toLocaleString('fr-FR')} CFA
                  </Text>
                </View>
                <View style={styles.priceDivider} />
                <View style={styles.priceRow}>
                  <Text style={styles.priceKey}>Prix à crédit</Text>
                  <Text style={[styles.priceVal, styles.priceCredit]}>
                    {offer.priceCredit.toLocaleString('fr-FR')} CFA
                  </Text>
                </View>
                <View style={styles.priceDivider} />
                <View style={styles.priceRow}>
                  <Text style={styles.priceKey}>Modalité</Text>
                  <Text style={styles.priceVal}>{offer.mode}</Text>
                </View>
                <View style={styles.priceDivider} />
                <View style={styles.priceRow}>
                  <Text style={styles.priceKey}>Montant total crédit</Text>
                  <Text style={[styles.priceVal, styles.priceTotal]}>
                    {offer.priceCredit.toLocaleString('fr-FR')} CFA
                  </Text>
                </View>
                <View style={styles.priceDivider} />
                <View style={styles.priceRow}>
                  <Text style={styles.priceKey}>Acompte requis</Text>
                  <Text style={styles.priceVal}>
                    {offer.deposit > 0
                      ? `${offer.deposit.toLocaleString('fr-FR')} CFA`
                      : 'Aucun (0%)'}
                  </Text>
                </View>
              </View>
              <View style={styles.infoNote}>
                <Text style={styles.infoNoteText}>
                  💡 Le paiement à crédit est soumis à votre score de confiance FeedCredit.
                </Text>
              </View>
            </View>
          )}

          {/* ——— BOUTONS D'ACTION ——— */}
          <View style={styles.actions}>
            <ButtonOutline
              title="AU COMPTANT"
              onPress={handleBuyCash}
              style={styles.actionBtn}
            />
            <ButtonPrimary
              title="A CREDIT"
              onPress={handleBuyCredit}
              style={styles.actionBtn}
            />
          </View>
          {/* Ajouter au panier */}
          <TouchableOpacity
            style={styles.cartBtn}
            onPress={() => handleAddToCart('credit')}>
            <Text style={styles.cartBtnText}>🛒 Ajouter au panier (credit)</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.cartBtn, styles.cartBtnCash]}
            onPress={() => handleAddToCart('cash')}>
            <Text style={[styles.cartBtnText, {color: COLORS.success}]}>🛒 Ajouter au panier (comptant)</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, overflow: 'hidden', backgroundColor: COLORS.background},
  scroll: {flex: 1},
  header: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  backBtn: {padding: 4},
  backIcon: {fontSize: 22, color: COLORS.white, fontWeight: 'bold'},
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerRight: {width: 30},
  shareBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareIcon: {fontSize: 18, color: COLORS.white, fontWeight: 'bold'},
  cartBtn: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: COLORS.primaryLight,
  },
  cartBtnCash: {
    borderColor: COLORS.success,
    backgroundColor: '#E8F5E9',
  },
  cartBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },
  imagePlaceholder: {
    backgroundColor: COLORS.primaryLight,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholderEmoji: {fontSize: 80},
  body: {padding: 20},
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 6,
  },
  mode: {
    fontSize: 14,
    color: COLORS.grey,
    marginBottom: 16,
  },
  participantsBox: {
    marginBottom: 20,
  },
  participantsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  participantsLabel: {fontSize: 13, color: COLORS.grey},
  participantsPercent: {fontSize: 13, color: COLORS.primary, fontWeight: '600'},
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabActive: {borderBottomColor: COLORS.primary},
  tabText: {fontSize: 14, color: COLORS.grey, fontWeight: '600'},
  tabTextActive: {color: COLORS.primary},
  tabContent: {marginBottom: 20},
  description: {
    fontSize: 15,
    color: COLORS.text,
    lineHeight: 22,
    marginBottom: 16,
  },
  infoRow: {flexDirection: 'row', flexWrap: 'wrap', gap: 10},
  infoChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGrey,
    borderRadius: 8,
    padding: 10,
  },
  infoChipIcon: {fontSize: 16, marginRight: 6},
  infoChipText: {fontSize: 12, color: COLORS.text, flexShrink: 1},
  priceTable: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    marginBottom: 14,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  priceDivider: {height: 1, backgroundColor: COLORS.border},
  priceKey: {fontSize: 14, color: COLORS.grey},
  priceVal: {fontSize: 14, fontWeight: 'bold', color: COLORS.text},
  priceCredit: {color: COLORS.primary},
  priceTotal: {color: COLORS.text, fontSize: 15},
  infoNote: {
    backgroundColor: '#FFF8E1',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.warning,
  },
  infoNoteText: {fontSize: 13, color: COLORS.text, lineHeight: 18},
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  actionBtn: {flex: 1, paddingVertical: 13},
});

export default OfferDetailScreen;

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import COLORS from '../utils/colors';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useCart} from '../context/CartContext';
import ButtonPrimary from '../components/ButtonPrimary';

const CartScreen = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const {cartItems, addToCart, removeFromCart, clearCart, totalAmount, totalItems} = useCart();

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    Alert.alert(
      'Confirmer la commande',
      `Total : ${totalAmount.toLocaleString('fr-FR')} CFA\n${totalItems} article(s)`,
      [
        {text: 'Annuler', style: 'cancel'},
        {
          text: 'Valider',
          onPress: () => {
            clearCart();
            Alert.alert(
              'Commande confirmee !',
              'Vos articles ont ete commandes avec succes.',
              [{text: 'OK', onPress: () => navigation.navigate('Subscriptions')}],
            );
          },
        },
      ],
    );
  };

  const renderItem = ({item}) => {
    const price = item.mode === 'credit' ? item.offer.priceCredit : item.offer.priceCash;
    const modeLabel = item.mode === 'credit' ? 'Credit' : 'Comptant';
    const modeBg = item.mode === 'credit' ? COLORS.primaryLight : '#E8F5E9';
    const modeColor = item.mode === 'credit' ? COLORS.primary : COLORS.success;

    return (
      <View style={styles.card}>
        <Text style={styles.cardEmoji}>{item.offer.emoji}</Text>
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle}>{item.offer.title}</Text>
          <View style={[styles.modeBadge, {backgroundColor: modeBg}]}>
            <Text style={[styles.modeText, {color: modeColor}]}>{modeLabel}</Text>
          </View>
          <Text style={styles.cardPrice}>
            {price.toLocaleString('fr-FR')} CFA / unite
          </Text>
        </View>
        <View style={styles.qtyBox}>
          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => removeFromCart(item.offer.id, item.mode)}>
            <Text style={styles.qtyBtnText}>−</Text>
          </TouchableOpacity>
          <Text style={styles.qty}>{item.qty}</Text>
          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => addToCart(item.offer, item.mode)}>
            <Text style={styles.qtyBtnText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />

      {/* Header */}
      <View style={[styles.header, {paddingTop: insets.top + 8}]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          Mon panier {totalItems > 0 ? `(${totalItems})` : ''}
        </Text>
        {cartItems.length > 0 && (
          <TouchableOpacity
            onPress={() =>
              Alert.alert('Vider le panier', 'Supprimer tous les articles ?', [
                {text: 'Annuler', style: 'cancel'},
                {text: 'Vider', style: 'destructive', onPress: clearCart},
              ])
            }
            style={styles.clearBtn}>
            <Text style={styles.clearBtnText}>🗑</Text>
          </TouchableOpacity>
        )}
        {cartItems.length === 0 && <View style={{width: 30}} />}
      </View>

      {cartItems.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>🛒</Text>
          <Text style={styles.emptyTitle}>Votre panier est vide</Text>
          <Text style={styles.emptySub}>
            Ajoutez des offres depuis l'ecran de detail
          </Text>
          <TouchableOpacity
            style={styles.shopBtn}
            onPress={() => navigation.navigate('Home')}>
            <Text style={styles.shopBtnText}>Voir les offres</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={item => `${item.offer.id}-${item.mode}`}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />

          {/* Footer total */}
          <View style={styles.footer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total estimatif</Text>
              <Text style={styles.totalAmount}>
                {totalAmount.toLocaleString('fr-FR')} CFA
              </Text>
            </View>
            <Text style={styles.totalHint}>
              Les articles a credit incluent les frais de service
            </Text>
            <ButtonPrimary
              title="COMMANDER"
              onPress={handleCheckout}
              style={styles.checkoutBtn}
            />
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: COLORS.background},
  header: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  backBtn: {padding: 4},
  backIcon: {fontSize: 22, color: COLORS.white, fontWeight: 'bold'},
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  clearBtn: {padding: 4},
  clearBtnText: {fontSize: 20},
  list: {padding: 16},
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 1,
    shadowRadius: 3,
  },
  cardEmoji: {fontSize: 36, marginRight: 12},
  cardInfo: {flex: 1},
  cardTitle: {fontSize: 15, fontWeight: '700', color: COLORS.text},
  modeBadge: {
    alignSelf: 'flex-start',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginTop: 4,
    marginBottom: 4,
  },
  modeText: {fontSize: 11, fontWeight: '600'},
  cardPrice: {fontSize: 13, color: COLORS.grey},
  qtyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGrey,
    borderRadius: 20,
    paddingHorizontal: 4,
  },
  qtyBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnText: {fontSize: 20, color: COLORS.primary, fontWeight: 'bold'},
  qty: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    minWidth: 24,
    textAlign: 'center',
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emptyEmoji: {fontSize: 64, marginBottom: 16},
  emptyTitle: {fontSize: 20, fontWeight: '700', color: COLORS.text, marginBottom: 8},
  emptySub: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  shopBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  shopBtnText: {color: COLORS.white, fontWeight: '700', fontSize: 15},
  footer: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    elevation: 8,
    shadowColor: COLORS.shadow,
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 1,
    shadowRadius: 4,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  totalLabel: {fontSize: 16, color: COLORS.textSecondary},
  totalAmount: {fontSize: 22, fontWeight: '800', color: COLORS.primary},
  totalHint: {fontSize: 11, color: COLORS.grey, marginBottom: 14},
  checkoutBtn: {marginTop: 0},
});

export default CartScreen;

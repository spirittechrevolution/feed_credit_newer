import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import COLORS from '../utils/colors';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ButtonPrimary from '../components/ButtonPrimary';

const METHODS = [
  {id: 'wave', label: 'Wave', emoji: '💙', recommended: true},
  {id: 'orange', label: 'Orange Money', emoji: '🟠', recommended: false},
  {id: 'manuel', label: 'Paiement manuel', emoji: '💵', recommended: false},
];

/**
 * PaymentScreen — paiement d'un crédit (depuis SubscriptionsScreen ou OfferDetailScreen)
 */
const PaymentScreen = ({route, navigation}) => {
  const insets = useSafeAreaInsets();
  const {subscription, offer} = route.params || {};
  const amount = subscription?.amount - subscription?.paid || offer?.priceCredit || 0;
  const title = subscription?.offerTitle || offer?.title || 'Commande';
  const dueDate = subscription?.nextDue || 'À définir';

  const [selectedMethod, setSelectedMethod] = useState('wave');
  const [customAmount, setCustomAmount] = useState(String(amount));
  const [loading, setLoading] = useState(false);

  const handlePay = () => {
    const payAmount = parseInt(customAmount, 10);
    if (!payAmount || payAmount <= 0) {
      Alert.alert('Erreur', 'Veuillez saisir un montant valide');
      return;
    }
    setLoading(true);
    // Simulation du paiement
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        '✅ Paiement confirmé',
        `${payAmount.toLocaleString('fr-FR')} CFA reçus via ${
          METHODS.find(m => m.id === selectedMethod)?.label
        }`,
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Subscriptions'),
          },
        ],
      );
    }, 1500);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />

      {/* Header */}
      <View style={[styles.header, {paddingTop: insets.top + 8}]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Paiement</Text>
        <View style={{width: 30}} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.body}>
          {/* ——— Détail produit ——— */}
          <View style={styles.detailCard}>
            <Text style={styles.sectionLabel}>Détail de la commande</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailKey}>Produit</Text>
              <Text style={styles.detailVal}>{title}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailKey}>Montant dû</Text>
              <Text style={[styles.detailVal, styles.amountHighlight]}>
                {amount.toLocaleString('fr-FR')} CFA
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailKey}>Échéance</Text>
              <Text style={styles.detailVal}>{dueDate}</Text>
            </View>
          </View>

          {/* ——— Montant à payer ——— */}
          <View style={styles.amountCard}>
            <Text style={styles.sectionLabel}>Montant à payer</Text>
            <View style={styles.amountInputRow}>
              <TextInput
                style={styles.amountInput}
                value={customAmount}
                onChangeText={setCustomAmount}
                keyboardType="numeric"
              />
              <Text style={styles.amountCurrency}>CFA</Text>
            </View>
            <Text style={styles.amountHint}>
              Vous pouvez payer un montant partiel (min. 1 000 CFA)
            </Text>
          </View>

          {/* ——— Méthodes de paiement ——— */}
          <View style={styles.methodsCard}>
            <Text style={styles.sectionLabel}>Méthode de paiement</Text>
            {METHODS.map(method => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.methodRow,
                  selectedMethod === method.id && styles.methodRowSelected,
                ]}
                onPress={() => setSelectedMethod(method.id)}>
                <View style={[
                  styles.radio,
                  selectedMethod === method.id && styles.radioSelected,
                ]}>
                  {selectedMethod === method.id && <View style={styles.radioDot} />}
                </View>
                <Text style={styles.methodEmoji}>{method.emoji}</Text>
                <Text style={styles.methodLabel}>{method.label}</Text>
                {method.recommended && (
                  <View style={styles.recommendBadge}>
                    <Text style={styles.recommendText}>Recommandé</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* ——— Récapitulatif ——— */}
          <View style={styles.summaryCard}>
            <Text style={styles.sectionLabel}>Récapitulatif</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailKey}>Montant payé</Text>
              <Text style={styles.detailVal}>
                {parseInt(customAmount || 0, 10).toLocaleString('fr-FR')} CFA
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailKey}>Méthode</Text>
              <Text style={styles.detailVal}>
                {METHODS.find(m => m.id === selectedMethod)?.label}
              </Text>
            </View>
          </View>

          {/* ——— Bouton PAYER ——— */}
          <ButtonPrimary
            title={`PAYER ${parseInt(customAmount || 0, 10).toLocaleString('fr-FR')} CFA`}
            onPress={handlePay}
            loading={loading}
            style={styles.payBtn}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: COLORS.background},
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
  body: {padding: 16},
  sectionLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: COLORS.grey,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  detailCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  detailKey: {fontSize: 14, color: COLORS.grey},
  detailVal: {fontSize: 14, fontWeight: '600', color: COLORS.text},
  amountHighlight: {color: COLORS.primary, fontSize: 16},
  amountCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
  },
  amountInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderRadius: 8,
    paddingHorizontal: 14,
    marginBottom: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
    paddingVertical: 12,
  },
  amountCurrency: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.grey,
    marginLeft: 8,
  },
  amountHint: {fontSize: 12, color: COLORS.grey},
  methodsCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
  },
  methodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 4,
  },
  methodRowSelected: {backgroundColor: COLORS.primaryLight},
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  radioSelected: {borderColor: COLORS.primary},
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  methodEmoji: {fontSize: 20, marginRight: 10},
  methodLabel: {flex: 1, fontSize: 15, color: COLORS.text, fontWeight: '500'},
  recommendBadge: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  recommendText: {fontSize: 11, color: COLORS.white, fontWeight: '600'},
  summaryCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  payBtn: {width: '100%', paddingVertical: 16, marginBottom: 20},
});

export default PaymentScreen;

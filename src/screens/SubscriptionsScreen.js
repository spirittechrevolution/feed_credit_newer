import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  StatusBar,
  RefreshControl,
} from 'react-native';
import COLORS from '../utils/colors';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {subscriptions, subscriptionFilters, subscriptionStatusConfig} from '../utils/mockData';
import ProgressBar from '../components/ProgressBar';
import ButtonPrimary from '../components/ButtonPrimary';
import Footer from '../components/Footer';

/**
 * SubscriptionsScreen — liste des commandes filtrées par statut
 */
const SubscriptionsScreen = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState(subscriptionFilters[0].id);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const filtered = subscriptions.filter(s => s.status === activeFilter);

  const renderItem = ({item}) => {
    const config = subscriptionStatusConfig[item.status];
    const paidProgress = item.amount > 0 ? item.paid / item.amount : 0;

    return (
      <View style={styles.card}>
        {/* En-tête carte */}
        <View style={styles.cardHeader}>
          <Text style={styles.cardEmoji}>{item.offerEmoji}</Text>
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle}>{item.offerTitle}</Text>
            <Text style={styles.cardDate}>Commande du {item.date}</Text>
          </View>
          <View style={[styles.statusBadge, {backgroundColor: config.bg}]}>
            <Text style={[styles.statusText, {color: config.color}]}>{config.label}</Text>
          </View>
        </View>

        {/* Montants */}
        <View style={styles.amountsRow}>
          <View>
            <Text style={styles.amountLabel}>Montant total</Text>
            <Text style={styles.amountValue}>{item.amount.toLocaleString('fr-FR')} CFA</Text>
          </View>
          <View style={styles.amountDivider} />
          <View>
            <Text style={styles.amountLabel}>Payé</Text>
            <Text style={[styles.amountValue, {color: COLORS.success}]}>
              {item.paid.toLocaleString('fr-FR')} CFA
            </Text>
          </View>
          <View style={styles.amountDivider} />
          <View>
            <Text style={styles.amountLabel}>Restant</Text>
            <Text style={[styles.amountValue, {color: COLORS.primary}]}>
              {(item.amount - item.paid).toLocaleString('fr-FR')} CFA
            </Text>
          </View>
        </View>

        {/* Barre de progression paiement */}
        <View style={styles.progressSection}>
          <View style={styles.progressLabel}>
            <Text style={styles.progressText}>Remboursement</Text>
            <Text style={styles.progressPercent}>{Math.round(paidProgress * 100)}%</Text>
          </View>
          <ProgressBar progress={paidProgress} />
        </View>

        {/* Prochaine échéance */}
        {item.nextDue && (
          <View style={styles.dueRow}>
            <Text style={styles.dueIcon}>📅</Text>
            <Text style={styles.dueText}>Prochaine échéance : <Text style={styles.dueBold}>{item.nextDue}</Text></Text>
          </View>
        )}

        {/* Boutons d'action */}
        {item.status === 'en_cours' && (
          <View style={styles.cardActions}>
            <ButtonPrimary
              title="PAYER"
              onPress={() => navigation.navigate('Payment', {subscription: item})}
              style={styles.actionBtnPay}
            />
            <TouchableOpacity
              style={styles.detailsBtn}
              onPress={() =>
                Alert.alert(
                  `${item.offerEmoji} ${item.offerTitle}`,
                  `📅 Commande du : ${item.date}\n💰 Montant total : ${item.amount.toLocaleString('fr-FR')} CFA\n✅ Payé : ${item.paid.toLocaleString('fr-FR')} CFA\n⏳ Restant : ${(item.amount - item.paid).toLocaleString('fr-FR')} CFA\n📆 Prochaine échéance : ${item.nextDue}\n🔄 Modalité : ${item.mode}`,
                )
              }>
              <Text style={styles.detailsBtnText}>DÉTAILS</Text>
            </TouchableOpacity>
          </View>
        )}
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
        <Text style={styles.headerTitle}>Mes commandes</Text>
        <View style={{width: 30}} />
      </View>

      {/* Filtres */}
      <View style={styles.filters}>
        {subscriptionFilters.map(f => (
          <TouchableOpacity
            key={f.id}
            style={[styles.filterTab, activeFilter === f.id && styles.filterTabActive]}
            onPress={() => setActiveFilter(f.id)}>
            <Text style={[styles.filterText, activeFilter === f.id && styles.filterTextActive]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Liste */}
      <FlatList
        data={filtered}
        keyExtractor={item => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyEmoji}>📭</Text>
            <Text style={styles.emptyText}>Aucune commande {activeFilter.toLowerCase()}</Text>
          </View>
        }
        ListFooterComponent={<Footer />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, overflow: 'hidden', backgroundColor: COLORS.background},
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
  filters: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  filterTabActive: {borderBottomColor: COLORS.primary},
  filterText: {fontSize: 13, color: COLORS.grey, fontWeight: '600'},
  filterTextActive: {color: COLORS.primary},
  list: {padding: 16},
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.07,
    shadowRadius: 5,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardEmoji: {fontSize: 30, marginRight: 10},
  cardInfo: {flex: 1},
  cardTitle: {fontWeight: 'bold', fontSize: 15, color: COLORS.text},
  cardDate: {fontSize: 12, color: COLORS.grey, marginTop: 2},
  statusBadge: {
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusText: {fontSize: 12, fontWeight: '600'},
  amountsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  amountLabel: {fontSize: 11, color: COLORS.grey, marginBottom: 2},
  amountValue: {fontWeight: 'bold', fontSize: 13, color: COLORS.text},
  amountDivider: {width: 1, height: 32, backgroundColor: COLORS.border, marginHorizontal: 12},
  progressSection: {marginBottom: 10},
  progressLabel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressText: {fontSize: 12, color: COLORS.grey},
  progressPercent: {fontSize: 12, color: COLORS.primary, fontWeight: '600'},
  dueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dueIcon: {fontSize: 14, marginRight: 6},
  dueText: {fontSize: 13, color: COLORS.grey},
  dueBold: {fontWeight: 'bold', color: COLORS.text},
  cardActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  actionBtnPay: {flex: 1, paddingVertical: 11},
  detailsBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
  },
  detailsBtnText: {
    color: COLORS.text,
    fontWeight: 'bold',
    fontSize: 14,
  },
  emptyBox: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyEmoji: {fontSize: 50, marginBottom: 12},
  emptyText: {fontSize: 15, color: COLORS.grey},
});

export default SubscriptionsScreen;

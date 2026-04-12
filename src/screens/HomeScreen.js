import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import COLORS from '../utils/colors';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {offers, subscriptions, notifications, categories, banner} from '../utils/mockData';
import OfferCard from '../components/OfferCard';
import CategoryChip from '../components/CategoryChip';

/**
 * HomeScreen — écran principal avec header, bannière, catégories, offres et crédits récents
 */
const HomeScreen = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const [activeCategory, setActiveCategory] = useState(categories[0].id);

  const unreadCount = notifications.filter(n => n.unread).length;

  const filteredOffers =
    activeCategory === 'all'
      ? offers
      : offers.filter(o => o.category === activeCategory);

  // Crédits récents (2 premiers abonnements en cours)
  const recentCredits = subscriptions.filter(s => s.status === 'en_cours').slice(0, 2);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />

      {/* ——— HEADER ——— */}
      <View style={[styles.header, {paddingTop: insets.top + 8}]}>
        <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.headerBtn}>
          <Text style={styles.headerIcon}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>FeedCredit</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Notifications')}
          style={styles.headerBtn}>
          <Text style={styles.headerIcon}>🔔</Text>
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        {/* ——— BANNIÈRE PROMOTIONNELLE ——— */}
        <View style={styles.banner}>
          <Text style={styles.bannerEmoji}>{banner.emoji}</Text>
          <View style={styles.bannerText}>
            <Text style={styles.bannerTitle}>{banner.title}</Text>
            <Text style={styles.bannerSub}>{banner.subtitle}</Text>
          </View>
        </View>

        {/* ——— CATÉGORIES ——— */}
        <View style={styles.section}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
            {categories.map(cat => (
              <CategoryChip
                key={cat.id}
                label={cat.label}
                active={activeCategory === cat.id}
                onPress={() => setActiveCategory(cat.id)}
              />
            ))}
          </ScrollView>
        </View>

        {/* ——— OFFRES ——— */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Offres disponibles</Text>
          {filteredOffers.length === 0 ? (
            <Text style={styles.empty}>Aucune offre dans cette catégorie</Text>
          ) : (
            filteredOffers.map(offer => (
              <OfferCard
                key={offer.id}
                offer={offer}
                onPress={() => navigation.navigate('OfferDetail', {offer})}
              />
            ))
          )}
        </View>

        {/* ——— MES CRÉDITS RÉCENTS ——— */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Mes crédits récents</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Subscriptions')}>
              <Text style={styles.seeAll}>Voir tout →</Text>
            </TouchableOpacity>
          </View>

          {recentCredits.length === 0 ? (
            <Text style={styles.empty}>Aucun crédit en cours</Text>
          ) : (
            recentCredits.map(sub => (
              <View key={sub.id} style={styles.creditCard}>
                <Text style={styles.creditEmoji}>{sub.offerEmoji}</Text>
                <View style={styles.creditInfo}>
                  <Text style={styles.creditTitle}>{sub.offerTitle}</Text>
                  <Text style={styles.creditDate}>Prochaine échéance : {sub.nextDue}</Text>
                </View>
                <View style={styles.creditAmountBox}>
                  <Text style={styles.creditAmount}>
                    {sub.amount.toLocaleString('fr-FR')} CFA
                  </Text>
                  <View style={[styles.statusBadge, styles.statusEnCours]}>
                    <Text style={styles.statusText}>En cours</Text>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
    backgroundColor: COLORS.background,
  },
  scroll: {flex: 1},
  header: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  headerBtn: {
    padding: 4,
    position: 'relative',
  },
  headerIcon: {
    fontSize: 24,
    color: COLORS.white,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
    letterSpacing: 0.5,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: COLORS.secondary,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  banner: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
  },
  bannerEmoji: {fontSize: 28, marginRight: 12},
  bannerText: {flex: 1},
  bannerTitle: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  bannerSub: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
    marginTop: 2,
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  chips: {
    paddingRight: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  seeAll: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  empty: {
    color: COLORS.grey,
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 20,
  },
  creditCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  creditEmoji: {fontSize: 28, marginRight: 12},
  creditInfo: {flex: 1},
  creditTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    color: COLORS.text,
  },
  creditDate: {
    fontSize: 12,
    color: COLORS.grey,
    marginTop: 3,
  },
  creditAmountBox: {alignItems: 'flex-end'},
  creditAmount: {
    fontWeight: 'bold',
    fontSize: 14,
    color: COLORS.text,
  },
  statusBadge: {
    marginTop: 4,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  statusEnCours: {backgroundColor: '#E3F2FD'},
  statusText: {
    fontSize: 11,
    color: '#1565C0',
    fontWeight: '600',
  },
  bottomSpacer: {height: 30},
});

export default HomeScreen;

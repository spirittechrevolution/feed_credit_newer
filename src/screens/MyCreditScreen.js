import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import COLORS from '../utils/colors';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {user, creditHistory, paymentHistory} from '../utils/mockData';
import ProgressBar from '../components/ProgressBar';
import Footer from '../components/Footer';

const STAR_COUNT = 4; // sur 5

/**
 * MyCreditScreen — score, plafond disponible, liste crédits, historique paiements
 */
const MyCreditScreen = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const creditUsedPercent = user.totalOwed / user.creditLimit;
  const availableCredit = user.creditLimit - user.totalOwed;

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />

      {/* Header */}
      <View style={[styles.header, {paddingTop: insets.top + 8}]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mon crédit</Text>
        <View style={{width: 30}} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        {/* ——— Score ——— */}
        <View style={styles.scoreCard}>
          <View style={styles.scoreTopRow}>
            <View>
              <Text style={styles.scoreLabel}>Score de confiance</Text>
              <View style={styles.starsRow}>
                {Array.from({length: 5}).map((_, i) => (
                  <Text key={i} style={[styles.star, i < STAR_COUNT && styles.starActive]}>
                    ★
                  </Text>
                ))}
                <Text style={styles.scorePoints}>{user.trustScore} pts</Text>
              </View>
              <Text style={styles.trustLevel}>{user.trustLevel}</Text>
            </View>
            <View style={styles.scoreCircle}>
              <Text style={styles.scoreCircleText}>{user.trustScore}</Text>
              <Text style={styles.scoreCircleSub}>/100</Text>
            </View>
          </View>
        </View>

        {/* ——— Plafond crédit ——— */}
        <View style={styles.limitCard}>
          <View style={styles.limitRow}>
            <View style={styles.limitBox}>
              <Text style={styles.limitLabel}>Total dû</Text>
              <Text style={[styles.limitValue, {color: COLORS.primary}]}>
                {user.totalOwed.toLocaleString('fr-FR')} CFA
              </Text>
            </View>
            <View style={styles.limitDivider} />
            <View style={styles.limitBox}>
              <Text style={styles.limitLabel}>Disponible</Text>
              <Text style={[styles.limitValue, {color: COLORS.success}]}>
                {availableCredit.toLocaleString('fr-FR')} CFA
              </Text>
            </View>
          </View>
          <View style={styles.limitProgressSection}>
            <View style={styles.limitProgressHeader}>
              <Text style={styles.limitProgressLabel}>
                Plafond utilisé: {Math.round(creditUsedPercent * 100)}%
              </Text>
              <Text style={styles.limitMax}>
                sur {user.creditLimit.toLocaleString('fr-FR')} CFA
              </Text>
            </View>
            <ProgressBar progress={creditUsedPercent} />
          </View>
          <View style={styles.echeanceRow}>
            <Text style={styles.echeanceIcon}>📅</Text>
            <Text style={styles.echeanceText}>
              Prochaine échéance : <Text style={styles.echeanceBold}>30/11/2025</Text>
            </Text>
          </View>
        </View>

        {/* ——— Liste des crédits ——— */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mes crédits actifs</Text>
          {creditHistory.map(credit => {
            const paidRatio = credit.paid / credit.amount;
            return (
              <View key={credit.id} style={styles.creditRow}>
                <View style={styles.creditInfo}>
                  <Text style={styles.creditTitle}>{credit.label}</Text>
                  <Text style={styles.creditDue}>Échéance : {credit.dueDate}</Text>
                  <ProgressBar progress={paidRatio} style={styles.creditBar} />
                </View>
                <View style={styles.creditAmounts}>
                  <Text style={styles.creditTotal}>
                    {credit.amount.toLocaleString('fr-FR')} CFA
                  </Text>
                  <Text style={styles.creditPaid}>
                    Payé : {credit.paid.toLocaleString('fr-FR')}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* ——— Historique paiements ——— */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Historique des paiements</Text>
          {paymentHistory.map(p => (
            <View key={p.id} style={styles.payRow}>
              <View style={styles.payIconBox}>
                <Text style={styles.payIcon}>💳</Text>
              </View>
              <View style={styles.payInfo}>
                <Text style={styles.payDate}>{p.date}</Text>
                <Text style={styles.payMethod}>{p.method}</Text>
              </View>
              <View style={styles.payRight}>
                <Text style={styles.payAmount}>
                  {p.amount.toLocaleString('fr-FR')} CFA
                </Text>
                <View style={styles.payStatusBadge}>
                  <Text style={styles.payStatusText}>✓ Confirmé</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
      <Footer />
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
  scoreCard: {
    backgroundColor: COLORS.primary,
    margin: 16,
    borderRadius: 16,
    padding: 20,
  },
  scoreTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scoreLabel: {color: 'rgba(255,255,255,0.8)', fontSize: 13, marginBottom: 8},
  starsRow: {flexDirection: 'row', alignItems: 'center', marginBottom: 6},
  star: {fontSize: 22, color: 'rgba(255,255,255,0.4)', marginRight: 2},
  starActive: {color: '#FFD700'},
  scorePoints: {marginLeft: 8, color: COLORS.white, fontWeight: 'bold', fontSize: 14},
  trustLevel: {color: 'rgba(255,255,255,0.9)', fontSize: 14, fontWeight: '600'},
  scoreCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreCircleText: {color: COLORS.white, fontSize: 26, fontWeight: 'bold'},
  scoreCircleSub: {color: 'rgba(255,255,255,0.7)', fontSize: 11},
  limitCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  limitRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  limitBox: {flex: 1, alignItems: 'center'},
  limitLabel: {fontSize: 12, color: COLORS.grey, marginBottom: 4},
  limitValue: {fontSize: 18, fontWeight: 'bold'},
  limitDivider: {width: 1, backgroundColor: COLORS.border},
  limitProgressSection: {marginBottom: 12},
  limitProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  limitProgressLabel: {fontSize: 13, color: COLORS.grey},
  limitMax: {fontSize: 12, color: COLORS.grey},
  echeanceRow: {flexDirection: 'row', alignItems: 'center'},
  echeanceIcon: {fontSize: 14, marginRight: 6},
  echeanceText: {fontSize: 13, color: COLORS.grey},
  echeanceBold: {fontWeight: 'bold', color: COLORS.text},
  section: {paddingHorizontal: 16, marginBottom: 16},
  sectionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  creditRow: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 14,
    flexDirection: 'row',
    marginBottom: 10,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  creditInfo: {flex: 1},
  creditTitle: {fontWeight: 'bold', fontSize: 14, color: COLORS.text, marginBottom: 4},
  creditDue: {fontSize: 12, color: COLORS.grey, marginBottom: 8},
  creditBar: {},
  creditAmounts: {alignItems: 'flex-end', justifyContent: 'center', marginLeft: 10},
  creditTotal: {fontWeight: 'bold', fontSize: 14, color: COLORS.text},
  creditPaid: {fontSize: 11, color: COLORS.success, marginTop: 2},
  payRow: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  payIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  payIcon: {fontSize: 20},
  payInfo: {flex: 1},
  payDate: {fontWeight: 'bold', fontSize: 14, color: COLORS.text},
  payMethod: {fontSize: 12, color: COLORS.grey, marginTop: 2},
  payRight: {alignItems: 'flex-end'},
  payAmount: {fontWeight: 'bold', fontSize: 15, color: COLORS.text},
  payStatusBadge: {
    marginTop: 4,
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  payStatusText: {fontSize: 11, color: COLORS.success, fontWeight: '600'},
  bottomSpacer: {height: 30},
});

export default MyCreditScreen;

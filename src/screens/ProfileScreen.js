import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
} from 'react-native';
import COLORS from '../utils/colors';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {user, profileMenuItems} from '../utils/mockData';
import {useAuth} from '../context/AuthContext';

/**
 * ProfileScreen — profil utilisateur, statistiques, menu et déconnexion
 */
const ProfileScreen = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const {logout} = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        {text: 'Annuler', style: 'cancel'},
        {
          text: 'Déconnecter',
          style: 'destructive',
          onPress: () => {
            logout();
            navigation.replace('Login');
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />

      {/* Header rouge */}
      <View style={[styles.profileHeader, {paddingTop: insets.top + 16}]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        {/* Avatar */}
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user.name.split(' ').map(n => n[0]).join('')}
          </Text>
        </View>
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userPhone}>{user.phone}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>
        <Text style={styles.memberSince}>Membre depuis {user.memberSince}</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        {/* ——— Statistiques ——— */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{user.ordersCount}</Text>
            <Text style={styles.statLabel}>Commandes</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={[styles.statValue, {color: COLORS.success}]}>
              {user.repaymentRate}%
            </Text>
            <Text style={styles.statLabel}>Remboursement</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={[styles.statValue, {color: COLORS.warning}]}>{user.lateCount}</Text>
            <Text style={styles.statLabel}>Retards</Text>
          </View>
        </View>

        {/* ——— Carte score ——— */}
        <View style={styles.scoreCard}>
          <View style={styles.scoreLeft}>
            <Text style={styles.scoreTitle}>Score de confiance</Text>
            <Text style={styles.scoreSub}>{user.trustLevel} — Acompte {user.depositRate}</Text>
          </View>
          <View style={styles.scoreCircle}>
            <Text style={styles.scoreNum}>{user.trustScore}</Text>
            <Text style={styles.scoreMax}>/100</Text>
          </View>
        </View>

        {/* ——— Menu ——— */}
        <View style={styles.menuCard}>
          {profileMenuItems.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              activeOpacity={0.7}
              onPress={() => item.screen && navigation.navigate(item.screen)}>
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ——— Déconnexion ——— */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>🚪 Déconnexion</Text>
        </TouchableOpacity>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, overflow: 'hidden', backgroundColor: COLORS.background},
  scroll: {flex: 1},
  profileHeader: {
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    paddingBottom: 28,
    paddingHorizontal: 16,
  },
  backBtn: {
    position: 'absolute',
    top: 16,
    left: 16,
    padding: 4,
  },
  backIcon: {fontSize: 22, color: COLORS.white, fontWeight: 'bold'},
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  avatarText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  userName: {fontSize: 20, fontWeight: 'bold', color: COLORS.white, marginBottom: 4},
  userPhone: {fontSize: 14, color: 'rgba(255,255,255,0.85)', marginBottom: 2},
  userEmail: {fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 4},
  memberSince: {fontSize: 12, color: 'rgba(255,255,255,0.65)'},
  statsRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.07,
    shadowRadius: 5,
    elevation: 3,
  },
  statBox: {flex: 1, alignItems: 'center'},
  statValue: {fontSize: 22, fontWeight: 'bold', color: COLORS.text},
  statLabel: {fontSize: 11, color: COLORS.grey, marginTop: 4, textAlign: 'center'},
  statDivider: {width: 1, backgroundColor: COLORS.border},
  scoreCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 12,
    padding: 16,
  },
  scoreLeft: {flex: 1},
  scoreTitle: {color: COLORS.white, fontWeight: 'bold', fontSize: 15, marginBottom: 4},
  scoreSub: {color: 'rgba(255,255,255,0.85)', fontSize: 13},
  scoreCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreNum: {color: COLORS.white, fontSize: 22, fontWeight: 'bold'},
  scoreMax: {color: 'rgba(255,255,255,0.7)', fontSize: 11},
  menuCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: COLORS.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 5,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuIcon: {fontSize: 20, marginRight: 14, width: 28, textAlign: 'center'},
  menuLabel: {flex: 1, fontSize: 15, color: COLORS.text},
  menuArrow: {fontSize: 20, color: COLORS.grey},
  logoutBtn: {
    margin: 16,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  logoutText: {color: COLORS.primary, fontWeight: 'bold', fontSize: 15},
  bottomSpacer: {height: 30},
});

export default ProfileScreen;

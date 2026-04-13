import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import {DrawerContentScrollView} from '@react-navigation/drawer';
import COLORS from '../utils/colors';
import {user, notifications} from '../utils/mockData';
import {useAuth} from '../context/AuthContext';

const MENU = [
  {icon: '🏠', label: 'Accueil', screen: 'Home'},
  {icon: '🛒', label: 'Mes commandes', screen: 'Subscriptions'},
  {icon: '💳', label: 'Mon crédit', screen: 'MyCredit'},
  {icon: '🔔', label: 'Notifications', screen: 'Notifications', badge: true},
  {icon: '⚙️', label: 'Paramètres', screen: null},
];

/**
 * DrawerContent — menu latéral avec photo, infos utilisateur et navigation
 */
const DrawerContent = props => {
  const {navigation} = props;
  const {logout} = useAuth();
  const unreadCount = notifications.filter(n => n.unread).length;

  const handleLogout = () => {
    const doLogout = () => {
      logout();
    };
    if (Platform.OS === 'web') {
      if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
        doLogout();
      }
    } else {
      Alert.alert(
        'Déconnexion',
        'Êtes-vous sûr de vouloir vous déconnecter ?',
        [
          {text: 'Annuler', style: 'cancel'},
          {text: 'Déconnecter', style: 'destructive', onPress: doLogout},
        ],
      );
    }
  };

  const navigate = screen => {
    if (!screen) {
      // Paramètres n'a pas de screen propre dans MENU → naviguer vers Settings
      navigation.navigate('AppStack', {screen: 'Settings'});
      navigation.closeDrawer();
      return;
    }
    navigation.navigate('AppStack', {screen});
    navigation.closeDrawer();
  };

  return (
    <DrawerContentScrollView {...props} style={styles.container}>
      {/* ——— En-tête utilisateur ——— */}
      <View style={styles.userSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user.name.split(' ').map(n => n[0]).join('')}
          </Text>
        </View>
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userPhone}>{user.phone}</Text>
        {/* Score */}
        <View style={styles.scoreBadge}>
          <Text style={styles.scoreBadgeText}>⭐ {user.trustScore} pts — {user.trustLevel}</Text>
        </View>
      </View>

      {/* ——— Séparateur ——— */}
      <View style={styles.divider} />

      {/* ——— Menu items ——— */}
      <View style={styles.menu}>
        {MENU.map((item, i) => (
          <TouchableOpacity
            key={i}
            style={styles.menuItem}
            onPress={() => navigate(item.screen)}
            activeOpacity={0.7}>
            <Text style={styles.menuIcon}>{item.icon}</Text>
            <Text style={styles.menuLabel}>{item.label}</Text>
            {item.badge && unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.divider} />

      {/* ——— Achat groupé ——— */}
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => Alert.alert('Bientôt', 'Achat groupé disponible prochainement !')}
        activeOpacity={0.7}>
        <Text style={styles.menuIcon}>👥</Text>
        <Text style={styles.menuLabel}>Achat groupé</Text>
        <View style={styles.comingSoonBadge}>
          <Text style={styles.comingSoonText}>Bientôt</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.divider} />

      {/* ——— Profil ——— */}
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => navigate('Profile')}
        activeOpacity={0.7}>
        <Text style={styles.menuIcon}>👤</Text>
        <Text style={styles.menuLabel}>Mon profil</Text>
      </TouchableOpacity>

      {/* ——— Déconnexion ——— */}
      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={handleLogout}
        activeOpacity={0.7}>
        <Text style={styles.logoutIcon}>🚪</Text>
        <Text style={styles.logoutText}>Déconnexion</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  userSection: {
    backgroundColor: COLORS.primary,
    padding: 20,
    paddingTop: 40,
    alignItems: 'center',
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  avatarText: {fontSize: 26, fontWeight: 'bold', color: COLORS.white},
  userName: {fontSize: 18, fontWeight: 'bold', color: COLORS.white, marginBottom: 4},
  userPhone: {fontSize: 13, color: 'rgba(255,255,255,0.8)', marginBottom: 10},
  scoreBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  scoreBadgeText: {color: COLORS.white, fontSize: 13, fontWeight: '600'},
  divider: {height: 1, backgroundColor: COLORS.border, marginVertical: 8},
  menu: {},
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 13,
  },
  menuIcon: {fontSize: 20, marginRight: 16, width: 28, textAlign: 'center'},
  menuLabel: {flex: 1, fontSize: 15, color: COLORS.text, fontWeight: '500'},
  badge: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  badgeText: {color: COLORS.white, fontSize: 11, fontWeight: 'bold'},
  comingSoonBadge: {
    backgroundColor: COLORS.secondary,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  comingSoonText: {color: COLORS.white, fontSize: 11, fontWeight: '600'},
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 13,
    marginTop: 8,
    marginBottom: 20,
  },
  logoutIcon: {fontSize: 20, marginRight: 16, width: 28, textAlign: 'center'},
  logoutText: {color: COLORS.primary, fontSize: 15, fontWeight: 'bold'},
});

export default DrawerContent;

import React, {useState} from 'react';
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
import {notifications as initNotifications} from '../utils/mockData';
import NotificationItem from '../components/NotificationItem';

/**
 * NotificationsScreen — liste avec bouton "Tout marquer comme lu"
 */
const NotificationsScreen = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const [notifs, setNotifs] = useState(initNotifications);

  const markAllRead = () => {
    setNotifs(notifs.map(n => ({...n, unread: false})));
  };

  const unreadCount = notifs.filter(n => n.unread).length;

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />

      {/* Header */}
      <View style={[styles.header, {paddingTop: insets.top + 8}]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{width: 30}} />
      </View>

      {/* Barre d'actions */}
      <View style={styles.actionBar}>
        <Text style={styles.unreadCount}>
          {unreadCount > 0 ? `${unreadCount} non lue(s)` : 'Tout est lu'}
        </Text>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={markAllRead}>
            <Text style={styles.markAllBtn}>Tout marquer comme lu</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Liste */}
      <FlatList
        data={notifs}
        keyExtractor={item => String(item.id)}
        renderItem={({item}) => (
          <NotificationItem
            notification={item}
            onPress={() => {
              // Marquer comme lu
              setNotifs(prev =>
                prev.map(n => (n.id === item.id ? {...n, unread: false} : n)),
              );
            }}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Text style={styles.emptyEmoji}>🔕</Text>
            <Text style={styles.emptyText}>Aucune notification</Text>
          </View>
        }
        contentContainerStyle={notifs.length === 0 && styles.emptyContainer}
      />
    </View>
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
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  unreadCount: {fontSize: 13, color: COLORS.grey},
  markAllBtn: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '600',
  },
  emptyContainer: {flex: 1, justifyContent: 'center'},
  emptyBox: {
    alignItems: 'center',
    marginTop: 80,
  },
  emptyEmoji: {fontSize: 50, marginBottom: 12},
  emptyText: {fontSize: 15, color: COLORS.grey},
});

export default NotificationsScreen;

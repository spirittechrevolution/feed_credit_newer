import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import COLORS from '../utils/colors';

// Couleurs et icônes selon le type de notification
const TYPE_CONFIG = {
  offer:   {color: COLORS.primary, dot: '🔴', bg: COLORS.primaryLight},
  reminder:{color: COLORS.warning,  dot: '🟡', bg: '#FFF8E1'},
  payment: {color: COLORS.success,  dot: '🟢', bg: '#F1F8E9'},
};

/**
 * Item de notification avec indicateur non-lu
 * Props: notification (objet), onPress
 */
const NotificationItem = ({notification, onPress}) => {
  const config = TYPE_CONFIG[notification.type] || TYPE_CONFIG.offer;

  return (
    <TouchableOpacity
      style={[styles.container, notification.unread && styles.unread]}
      onPress={onPress}
      activeOpacity={0.85}>
      <View style={[styles.iconBox, {backgroundColor: config.bg}]}>
        <Text style={styles.dot}>{config.dot}</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{notification.title}</Text>
          <Text style={styles.time}>{notification.time}</Text>
        </View>
        <Text style={styles.message} numberOfLines={2}>
          {notification.message}
        </Text>
      </View>
      {notification.unread && <View style={styles.badge} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  unread: {
    backgroundColor: COLORS.primaryLight,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  dot: {
    fontSize: 20,
  },
  content: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 14,
    color: COLORS.text,
  },
  time: {
    fontSize: 12,
    color: COLORS.grey,
  },
  message: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  badge: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
    marginLeft: 8,
  },
});

export default NotificationItem;

import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import COLORS from '../utils/colors';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {settingsOptions} from '../utils/mockData';

const SettingsScreen = ({navigation}) => {
  const insets = useSafeAreaInsets();

  // Initialiser l'etat depuis mockData
  const [settings, setSettings] = useState(() =>
    settingsOptions.map(s => ({...s})),
  );

  const toggleSwitch = id => {
    setSettings(prev =>
      prev.map(s => (s.id === id ? {...s, value: !s.value} : s)),
    );
  };

  const handleValueOption = item => {
    Alert.alert(
      item.label,
      `Valeur actuelle : ${item.value}`,
      [
        {text: 'Annuler', style: 'cancel'},
        {text: 'Modifier', onPress: () => {}},
      ],
    );
  };

  const sections = [
    {
      title: 'Notifications',
      ids: ['notif_push', 'notif_sms'],
    },
    {
      title: 'Confidentialite',
      ids: ['biometric', 'language'],
    },
    {
      title: 'Compte',
      ids: ['currency'],
    },
  ];

  // Grouper par section ou tout afficher si pas de section correspondante
  const grouped = sections
    .map(sec => ({
      ...sec,
      items: settings.filter(s => sec.ids.includes(s.id)),
    }))
    .filter(sec => sec.items.length > 0);

  // Items sans section
  const assigned = sections.flatMap(s => s.ids);
  const ungrouped = settings.filter(s => !assigned.includes(s.id));
  if (ungrouped.length > 0) {
    grouped.push({title: 'Autres', items: ungrouped});
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />

      {/* Header */}
      <View style={[styles.header, {paddingTop: insets.top + 8}]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Parametres</Text>
        <View style={{width: 30}} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        {grouped.map(section => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.card}>
              {section.items.map((item, index) => (
                <View
                  key={item.id}
                  style={[
                    styles.row,
                    index < section.items.length - 1 && styles.rowBorder,
                  ]}>
                  <View style={styles.rowLeft}>
                    <Text style={styles.rowIcon}>{item.icon || '⚙️'}</Text>
                    <Text style={styles.rowLabel}>{item.label}</Text>
                  </View>
                  {item.type === 'toggle' ? (
                    <Switch
                      value={item.value}
                      onValueChange={() => toggleSwitch(item.id)}
                      trackColor={{false: COLORS.border, true: COLORS.primaryLight}}
                      thumbColor={item.value ? COLORS.primary : COLORS.grey}
                    />
                  ) : (
                    <TouchableOpacity
                      style={styles.valueBtn}
                      onPress={() => handleValueOption(item)}>
                      <Text style={styles.valueText}>{item.value}</Text>
                      <Text style={styles.chevron}>›</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* Zone danger */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Zone de danger</Text>
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.row}
              onPress={() =>
                Alert.alert(
                  'Supprimer le compte',
                  'Cette action est irreversible. Toutes vos donnees seront effacees.',
                  [
                    {text: 'Annuler', style: 'cancel'},
                    {text: 'Supprimer', style: 'destructive', onPress: () => {}},
                  ],
                )
              }>
              <View style={styles.rowLeft}>
                <Text style={styles.rowIcon}>🗑️</Text>
                <Text style={[styles.rowLabel, {color: COLORS.error}]}>
                  Supprimer mon compte
                </Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{height: 32}} />
      </ScrollView>
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
  scroll: {flex: 1},
  section: {marginTop: 24, paddingHorizontal: 16},
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.grey,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 1,
    shadowRadius: 3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  rowLeft: {flexDirection: 'row', alignItems: 'center', flex: 1},
  rowIcon: {fontSize: 20, marginRight: 12},
  rowLabel: {fontSize: 15, color: COLORS.text},
  valueBtn: {flexDirection: 'row', alignItems: 'center'},
  valueText: {fontSize: 14, color: COLORS.grey, marginRight: 4},
  chevron: {fontSize: 20, color: COLORS.grey},
});

export default SettingsScreen;

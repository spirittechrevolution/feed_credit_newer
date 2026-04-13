import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Linking,
  Platform,
  Alert,
} from 'react-native';
import COLORS from '../utils/colors';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {faqItems} from '../utils/mockData';

const CONTACT_ITEMS = [
  {id: 'whatsapp', icon: '💬', label: 'WhatsApp', value: '+221 77 000 00 00'},
  {id: 'email', icon: '📧', label: 'Email', value: 'support@feedcredit.sn'},
  {id: 'phone', icon: '📞', label: 'Telephone', value: '+221 33 000 00 00'},
];

const HelpScreen = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const [openId, setOpenId] = useState(null);

  const toggle = id => setOpenId(prev => (prev === id ? null : id));

  const handleContact = item => {
    if (item.id === 'whatsapp') {
      const url = `whatsapp://send?phone=${item.value.replace(/\s/g, '')}`;
      Linking.canOpenURL(url).then(can => {
        if (can) {
          Linking.openURL(url);
        } else {
          Alert.alert('WhatsApp', 'WhatsApp n\'est pas installe sur ce telephone');
        }
      });
    } else if (item.id === 'email') {
      Linking.openURL('mailto:' + item.value);
    } else if (item.id === 'phone') {
      Linking.openURL('tel:' + item.value.replace(/\s/g, ''));
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />

      {/* Header */}
      <View style={[styles.header, {paddingTop: insets.top + 8}]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Aide & Support</Text>
        <View style={{width: 30}} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.heroEmoji}>🆘</Text>
          <Text style={styles.heroTitle}>Comment pouvons-nous vous aider ?</Text>
          <Text style={styles.heroSub}>
            Trouvez des reponses a vos questions ou contactez notre equipe.
          </Text>
        </View>

        {/* FAQ Accordeon */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Questions frequentes</Text>
          {faqItems.map((item, index) => (
            <View key={item.id || index} style={styles.faqCard}>
              <TouchableOpacity
                style={styles.faqQuestion}
                onPress={() => toggle(item.id || index)}
                activeOpacity={0.7}>
                <Text style={styles.faqQ}>{item.q}</Text>
                <Text style={[styles.faqChevron, openId === (item.id || index) && styles.faqChevronOpen]}>
                  ›
                </Text>
              </TouchableOpacity>
              {openId === (item.id || index) && (
                <View style={styles.faqAnswer}>
                  <Text style={styles.faqA}>{item.a}</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Contact */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nous contacter</Text>
          <View style={styles.card}>
            {CONTACT_ITEMS.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.contactRow, index < CONTACT_ITEMS.length - 1 && styles.rowBorder]}
                onPress={() => handleContact(item)}>
                <Text style={styles.contactIcon}>{item.icon}</Text>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactLabel}>{item.label}</Text>
                  <Text style={styles.contactValue}>{item.value}</Text>
                </View>
                <Text style={styles.chevron}>›</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Horaires */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Horaires du support</Text>
          <View style={styles.card}>
            <View style={styles.scheduleRow}>
              <Text style={styles.scheduleIcon}>📅</Text>
              <Text style={styles.scheduleText}>Lundi - Vendredi : 08h00 - 18h00</Text>
            </View>
            <View style={[styles.scheduleRow, styles.rowBorder]}>
              <Text style={styles.scheduleIcon}>📅</Text>
              <Text style={styles.scheduleText}>Samedi : 09h00 - 14h00</Text>
            </View>
            <View style={styles.scheduleRow}>
              <Text style={styles.scheduleIcon}>🔴</Text>
              <Text style={styles.scheduleText}>Dimanche : Ferme</Text>
            </View>
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
  hero: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 24,
    backgroundColor: COLORS.primaryLight,
    marginBottom: 8,
  },
  heroEmoji: {fontSize: 40, marginBottom: 10},
  heroTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 6,
  },
  heroSub: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 19,
  },
  section: {marginTop: 20, paddingHorizontal: 16},
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.grey,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
  },
  faqCard: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    marginBottom: 8,
    overflow: 'hidden',
    elevation: 1,
    shadowColor: COLORS.shadow,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 1,
    shadowRadius: 2,
  },
  faqQuestion: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
  },
  faqQ: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginRight: 8,
  },
  faqChevron: {
    fontSize: 22,
    color: COLORS.grey,
    transform: [{rotate: '0deg'}],
  },
  faqChevronOpen: {
    transform: [{rotate: '90deg'}],
  },
  faqAnswer: {
    backgroundColor: COLORS.lightGrey,
    paddingHorizontal: 14,
    paddingBottom: 14,
  },
  faqA: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 20,
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
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  rowBorder: {borderBottomWidth: 1, borderBottomColor: COLORS.border},
  contactIcon: {fontSize: 22, marginRight: 12},
  contactInfo: {flex: 1},
  contactLabel: {fontSize: 14, fontWeight: '600', color: COLORS.text},
  contactValue: {fontSize: 13, color: COLORS.grey, marginTop: 2},
  chevron: {fontSize: 20, color: COLORS.grey},
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  scheduleIcon: {fontSize: 18, marginRight: 12},
  scheduleText: {fontSize: 14, color: COLORS.text},
});

export default HelpScreen;

import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  TextInput,
} from 'react-native';
import COLORS from '../utils/colors';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {userAddresses} from '../utils/mockData';

const AddressesScreen = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const [addresses, setAddresses] = useState(userAddresses.map(a => ({...a})));
  const [showForm, setShowForm] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newAddress, setNewAddress] = useState('');

  const handleSetDefault = id => {
    setAddresses(prev =>
      prev.map(a => ({...a, default: a.id === id})),
    );
  };

  const handleDelete = id => {
    Alert.alert(
      'Supprimer l\'adresse',
      'Confirmer la suppression ?',
      [
        {text: 'Annuler', style: 'cancel'},
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => setAddresses(prev => prev.filter(a => a.id !== id)),
        },
      ],
    );
  };

  const handleAdd = () => {
    if (!newLabel.trim() || !newAddress.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }
    const newId = Date.now();
    setAddresses(prev => [
      ...prev,
      {id: newId, label: newLabel.trim(), address: newAddress.trim(), default: false},
    ]);
    setNewLabel('');
    setNewAddress('');
    setShowForm(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />

      {/* Header */}
      <View style={[styles.header, {paddingTop: insets.top + 8}]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mes adresses</Text>
        <TouchableOpacity
          onPress={() => setShowForm(v => !v)}
          style={styles.addBtn}>
          <Text style={styles.addBtnText}>{showForm ? '✕' : '+'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        style={styles.scroll}>

        {/* Formulaire ajout */}
        {showForm && (
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Nouvelle adresse</Text>
            <TextInput
              style={styles.input}
              placeholder="Libelle (ex: Domicile)"
              placeholderTextColor={COLORS.grey}
              value={newLabel}
              onChangeText={setNewLabel}
            />
            <TextInput
              style={[styles.input, {marginTop: 10}]}
              placeholder="Adresse complete"
              placeholderTextColor={COLORS.grey}
              value={newAddress}
              onChangeText={setNewAddress}
              multiline
            />
            <TouchableOpacity style={styles.saveBtn} onPress={handleAdd}>
              <Text style={styles.saveBtnText}>Enregistrer</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Liste des adresses */}
        {addresses.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>📍</Text>
            <Text style={styles.emptyText}>Aucune adresse enregistree</Text>
            <Text style={styles.emptyHint}>Appuyez sur + pour en ajouter une</Text>
          </View>
        ) : (
          addresses.map(item => (
            <View key={item.id} style={[styles.card, item.default && styles.cardDefault]}>
              <View style={styles.cardLeft}>
                <View style={styles.iconBox}>
                  <Text style={styles.iconText}>{item.default ? '📍' : '📌'}</Text>
                </View>
                <View style={styles.cardInfo}>
                  <View style={styles.labelRow}>
                    <Text style={styles.cardLabel}>{item.label}</Text>
                    {item.default && (
                      <View style={styles.defaultBadge}>
                        <Text style={styles.defaultBadgeText}>Par defaut</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.cardAddress}>{item.address}</Text>
                </View>
              </View>
              <View style={styles.cardActions}>
                {!item.default && (
                  <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => handleSetDefault(item.id)}>
                    <Text style={styles.actionBtnText}>✓</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={[styles.actionBtn, styles.deleteBtn]}
                  onPress={() => handleDelete(item.id)}>
                  <Text style={styles.deleteBtnText}>🗑</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

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
  addBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: {fontSize: 20, color: COLORS.white, fontWeight: 'bold'},
  scroll: {flex: 1},
  formCard: {
    margin: 16,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 1,
    shadowRadius: 3,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.text,
    backgroundColor: COLORS.background,
  },
  saveBtn: {
    marginTop: 14,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  saveBtnText: {color: COLORS.white, fontWeight: '700', fontSize: 15},
  empty: {
    alignItems: 'center',
    marginTop: 80,
  },
  emptyEmoji: {fontSize: 48, marginBottom: 12},
  emptyText: {fontSize: 16, color: COLORS.text, fontWeight: '600'},
  emptyHint: {fontSize: 13, color: COLORS.grey, marginTop: 6},
  card: {
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 1,
  },
  cardDefault: {
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  cardLeft: {flexDirection: 'row', alignItems: 'flex-start', flex: 1},
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    flexShrink: 0,
  },
  iconText: {fontSize: 18},
  cardInfo: {flex: 1},
  labelRow: {flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap'},
  cardLabel: {fontSize: 15, fontWeight: '700', color: COLORS.text, marginRight: 6},
  defaultBadge: {
    backgroundColor: COLORS.primaryLight,
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  defaultBadgeText: {fontSize: 11, color: COLORS.primary, fontWeight: '600'},
  cardAddress: {fontSize: 13, color: COLORS.textSecondary, marginTop: 3},
  cardActions: {flexDirection: 'row', alignItems: 'center', marginLeft: 8},
  actionBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
  actionBtnText: {fontSize: 16, color: COLORS.primary, fontWeight: 'bold'},
  deleteBtn: {backgroundColor: '#FFEBEE'},
  deleteBtnText: {fontSize: 16},
});

export default AddressesScreen;

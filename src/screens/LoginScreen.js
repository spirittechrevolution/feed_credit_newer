import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import COLORS from '../utils/colors';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ButtonPrimary from '../components/ButtonPrimary';
import InputField from '../components/InputField';
import {useAuth} from '../context/AuthContext';

/**
 * LoginScreen — onglets CONNEXION / INSCRIPTION
 */
const LoginScreen = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const {login, register, isLoading} = useAuth();
  const [tab, setTab] = useState('login'); // 'login' | 'register'

  // Champs connexion
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginErrors, setLoginErrors] = useState({});

  // Champs inscription
  const [regName, setRegName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm] = useState('');
  const [acceptCGU, setAcceptCGU] = useState(false);
  const [regErrors, setRegErrors] = useState({});

  /* ——— Validation connexion ——— */
  const validateLogin = () => {
    const errors = {};
    if (!loginPhone) errors.phone = 'Téléphone requis';
    if (!loginPassword) errors.password = 'Mot de passe requis';
    setLoginErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateLogin()) return;
    try {
      await login(loginPhone, loginPassword);
      navigation.navigate('OTP');
    } catch (e) {
      Alert.alert('Erreur', e.message);
    }
  };

  /* ——— Validation inscription ——— */
  const validateRegister = () => {
    const errors = {};
    if (!regName) errors.name = 'Nom complet requis';
    if (!regPhone) errors.phone = 'Téléphone requis';
    if (!regPassword) errors.password = 'Mot de passe requis';
    if (regPassword !== regConfirm) errors.confirm = 'Les mots de passe ne correspondent pas';
    if (!acceptCGU) errors.cgu = 'Veuillez accepter les CGU';
    setRegErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateRegister()) return;
    try {
      await register(regName, regPhone, regEmail, regPassword);
      navigation.navigate('OTP');
    } catch (e) {
      Alert.alert('Erreur', e.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled">

        {/* Logo */}
        <View style={[styles.header, {paddingTop: insets.top + 20}]}>
          <Text style={styles.logo}>🛒 FeedCredit</Text>
          <Text style={styles.subtitle}>Votre crédit alimentaire</Text>
        </View>

        {/* Onglets */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, tab === 'login' && styles.tabActive]}
            onPress={() => setTab('login')}>
            <Text style={[styles.tabText, tab === 'login' && styles.tabTextActive]}>
              CONNEXION
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, tab === 'register' && styles.tabActive]}
            onPress={() => setTab('register')}>
            <Text style={[styles.tabText, tab === 'register' && styles.tabTextActive]}>
              INSCRIPTION
            </Text>
          </TouchableOpacity>
        </View>

        {/* ——— CONNEXION ——— */}
        {tab === 'login' && (
          <View style={styles.form}>
            <InputField
              label="Téléphone"
              value={loginPhone}
              onChangeText={setLoginPhone}
              placeholder="+221 XX XXX XX XX"
              keyboardType="phone-pad"
              error={loginErrors.phone}
            />
            <InputField
              label="Mot de passe"
              value={loginPassword}
              onChangeText={setLoginPassword}
              placeholder="Votre mot de passe"
              secureTextEntry
              error={loginErrors.password}
            />
            <TouchableOpacity style={styles.forgotBtn}>
              <Text style={styles.forgotText}>Mot de passe oublié ?</Text>
            </TouchableOpacity>
            <ButtonPrimary
              title="SE CONNECTER"
              onPress={handleLogin}
              loading={isLoading}
              style={styles.submitBtn}
            />
          </View>
        )}

        {/* ——— INSCRIPTION ——— */}
        {tab === 'register' && (
          <View style={styles.form}>
            <InputField
              label="Nom complet"
              value={regName}
              onChangeText={setRegName}
              placeholder="Jean Diop"
              error={regErrors.name}
            />
            <InputField
              label="Téléphone"
              value={regPhone}
              onChangeText={setRegPhone}
              placeholder="+221 XX XXX XX XX"
              keyboardType="phone-pad"
              error={regErrors.phone}
            />
            <InputField
              label="Email (optionnel)"
              value={regEmail}
              onChangeText={setRegEmail}
              placeholder="jean@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <InputField
              label="Mot de passe"
              value={regPassword}
              onChangeText={setRegPassword}
              placeholder="Choisissez un mot de passe"
              secureTextEntry
              error={regErrors.password}
            />
            <InputField
              label="Confirmer le mot de passe"
              value={regConfirm}
              onChangeText={setRegConfirm}
              placeholder="Répétez votre mot de passe"
              secureTextEntry
              error={regErrors.confirm}
            />

            {/* Case CGU */}
            <TouchableOpacity
              style={styles.cguRow}
              onPress={() => setAcceptCGU(!acceptCGU)}>
              <View style={[styles.checkbox, acceptCGU && styles.checkboxActive]}>
                {acceptCGU && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.cguText}>
                J'accepte les{' '}
                <Text style={styles.cguLink}>Conditions Générales d'Utilisation</Text>
              </Text>
            </TouchableOpacity>
            {regErrors.cgu ? (
              <Text style={styles.errorText}>{regErrors.cgu}</Text>
            ) : null}

            <ButtonPrimary
              title="S'INSCRIRE"
              onPress={handleRegister}
              loading={isLoading}
              style={styles.submitBtn}
            />
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: {flex: 1},
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    paddingBottom: 40,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingBottom: 30,
    alignItems: 'center',
  },
  logo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 14,
    marginTop: 4,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.grey,
  },
  tabTextActive: {
    color: COLORS.primary,
  },
  form: {
    padding: 24,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: 20,
    marginTop: -8,
  },
  forgotText: {
    color: COLORS.primary,
    fontSize: 13,
  },
  submitBtn: {
    marginTop: 8,
    width: '100%',
  },
  cguRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 4,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  checkboxActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  checkmark: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  cguText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.text,
    lineHeight: 18,
  },
  cguLink: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginBottom: 8,
  },
});

export default LoginScreen;

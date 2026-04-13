import React, {useState, useEffect, useRef} from 'react';
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
  TextInput,
} from 'react-native';
import COLORS from '../utils/colors';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ButtonPrimary from '../components/ButtonPrimary';
import InputField from '../components/InputField';
import {useAuth} from '../context/AuthContext';

/**
 * LoginScreen â€” onglets CONNEXION / INSCRIPTION
 * Inscription en 3 etapes :
 *   1. Saisie numero -> envoi OTP
 *   2. Verification OTP
 *   3. Completion du profil
 */
const LoginScreen = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const {login, sendRegistrationOTP, verifyRegistrationOTP, register, isLoading} = useAuth();
  const [tab, setTab] = useState('login');

  // Connexion
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginErrors, setLoginErrors] = useState({});

  // Inscription - etat des etapes
  const [regStep, setRegStep] = useState(1); // 1 | 2 | 3

  // Etape 1 : telephone
  const [regPhone, setRegPhone] = useState('');
  const [regPhoneError, setRegPhoneError] = useState('');

  // Etape 2 : OTP
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpTimer, setOtpTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const otpInputs = useRef([]);

  // Etape 3 : profil
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm] = useState('');
  const [acceptCGU, setAcceptCGU] = useState(false);
  const [regErrors, setRegErrors] = useState({});

  // Timer OTP
  useEffect(() => {
    if (regStep !== 2) return;
    setOtpTimer(60);
    setCanResend(false);
    const interval = setInterval(() => {
      setOtpTimer(t => {
        if (t <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [regStep]);

  /* CONNEXION */
  const validateLogin = () => {
    const errors = {};
    if (!loginPhone) errors.phone = 'Telephone requis';
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

  /* INSCRIPTION - Etape 1 : telephone */
  const handleSendOTP = async () => {
    if (!regPhone || regPhone.length < 8) {
      setRegPhoneError('Veuillez saisir un numero valide');
      return;
    }
    setRegPhoneError('');
    try {
      await sendRegistrationOTP(regPhone);
      setRegStep(2);
    } catch (e) {
      Alert.alert('Erreur', e.message);
    }
  };

  /* INSCRIPTION - Etape 2 : OTP */
  const handleOtpChange = (text, index) => {
    if (!/^\d*$/.test(text)) return;
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    if (text && index < 5) {
      otpInputs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = async () => {
    const code = otp.join('');
    if (code.length < 6) {
      Alert.alert('Erreur', 'Veuillez saisir les 6 chiffres du code');
      return;
    }
    try {
      await verifyRegistrationOTP(regPhone, code);
      setRegStep(3);
    } catch (e) {
      Alert.alert('Code invalide', e.message);
      setOtp(['', '', '', '', '', '']);
      otpInputs.current[0]?.focus();
    }
  };

  const handleResendOTP = async () => {
    try {
      await sendRegistrationOTP(regPhone);
      setOtp(['', '', '', '', '', '']);
      setCanResend(false);
      setOtpTimer(60);
    } catch (e) {
      Alert.alert('Erreur', e.message);
    }
  };

  /* INSCRIPTION - Etape 3 : profil */
  const validateProfile = () => {
    const errors = {};
    if (!regName) errors.name = 'Nom complet requis';
    if (!regPassword) errors.password = 'Mot de passe requis';
    if (regPassword.length < 6) errors.password = 'Minimum 6 caracteres';
    if (regPassword !== regConfirm) errors.confirm = 'Les mots de passe ne correspondent pas';
    if (!acceptCGU) errors.cgu = 'Veuillez accepter les CGU';
    setRegErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateProfile()) return;
    try {
      await register(regName, regPhone, regEmail, regPassword);
      navigation.replace('MainDrawer');
    } catch (e) {
      Alert.alert('Erreur', e.message);
    }
  };

  /* RENDER */
  const stepLabels = ['Telephone', 'Verification', 'Profil'];

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {stepLabels.map((label, i) => {
        const step = i + 1;
        const done = step < regStep;
        const active = step === regStep;
        return (
          <React.Fragment key={step}>
            <View style={styles.stepItem}>
              <View style={[styles.stepCircle, active && styles.stepCircleActive, done && styles.stepCircleDone]}>
                {done
                  ? <Text style={styles.stepCheckmark}>âœ“</Text>
                  : <Text style={[styles.stepNum, active && styles.stepNumActive]}>{step}</Text>
                }
              </View>
              <Text style={[styles.stepLabel, active && styles.stepLabelActive]}>{label}</Text>
            </View>
            {i < 2 && <View style={[styles.stepLine, done && styles.stepLineDone]} />}
          </React.Fragment>
        );
      })}
    </View>
  );

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
          <Text style={styles.logo}>ðŸ›’ FeedCredit</Text>
          <Text style={styles.logoSub}>Votre credit alimentaire</Text>
        </View>

        {/* Onglets */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, tab === 'login' && styles.tabActive]}
            onPress={() => { setTab('login'); }}>
            <Text style={[styles.tabText, tab === 'login' && styles.tabTextActive]}>CONNEXION</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, tab === 'register' && styles.tabActive]}
            onPress={() => { setTab('register'); setRegStep(1); }}>
            <Text style={[styles.tabText, tab === 'register' && styles.tabTextActive]}>INSCRIPTION</Text>
          </TouchableOpacity>
        </View>

        {/* CONNEXION */}
        {tab === 'login' && (
          <View style={styles.form}>
            <InputField
              label="Telephone"
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
              <Text style={styles.forgotText}>Mot de passe oublie ?</Text>
            </TouchableOpacity>
            <ButtonPrimary
              title="SE CONNECTER"
              onPress={handleLogin}
              loading={isLoading}
              style={styles.submitBtn}
            />
          </View>
        )}

        {/* INSCRIPTION */}
        {tab === 'register' && (
          <View style={styles.form}>
            {renderStepIndicator()}

            {/* Etape 1 : Numero de telephone */}
            {regStep === 1 && (
              <View>
                <Text style={styles.stepTitle}>Entrez votre numero</Text>
                <Text style={styles.stepDesc}>
                  Nous vous enverrons un code de verification par SMS.
                </Text>
                <InputField
                  label="Numero de telephone"
                  value={regPhone}
                  onChangeText={setRegPhone}
                  placeholder="+221 XX XXX XX XX"
                  keyboardType="phone-pad"
                  error={regPhoneError}
                />
                <ButtonPrimary
                  title="ENVOYER LE CODE"
                  onPress={handleSendOTP}
                  loading={isLoading}
                  style={styles.submitBtn}
                />
              </View>
            )}

            {/* Etape 2 : Verification OTP */}
            {regStep === 2 && (
              <View style={styles.otpSection}>
                <Text style={styles.stepTitle}>Verification</Text>
                <Text style={styles.stepDesc}>
                  Code envoye au{'\n'}
                  <Text style={styles.phoneHighlight}>{regPhone}</Text>
                </Text>
                <TouchableOpacity onPress={() => setRegStep(1)} style={styles.changePhoneBtn}>
                  <Text style={styles.changePhoneText}>Changer de numero</Text>
                </TouchableOpacity>

                <View style={styles.otpRow}>
                  {otp.map((digit, i) => (
                    <TextInput
                      key={i}
                      ref={r => (otpInputs.current[i] = r)}
                      style={[styles.otpBox, digit ? styles.otpBoxFilled : null]}
                      value={digit}
                      onChangeText={t => handleOtpChange(t, i)}
                      onKeyPress={e => handleOtpKeyPress(e, i)}
                      keyboardType="number-pad"
                      maxLength={1}
                      selectTextOnFocus
                    />
                  ))}
                </View>

                <Text style={styles.timerText}>
                  {canResend
                    ? 'Vous pouvez renvoyer le code'
                    : `Renvoi disponible dans ${otpTimer}s`}
                </Text>
                {canResend && (
                  <TouchableOpacity onPress={handleResendOTP} style={styles.resendBtn}>
                    <Text style={styles.resendText}>Renvoyer le code</Text>
                  </TouchableOpacity>
                )}

                <ButtonPrimary
                  title="VERIFIER"
                  onPress={handleVerifyOTP}
                  loading={isLoading}
                  style={styles.submitBtn}
                />
              </View>
            )}

            {/* Etape 3 : Completion du profil */}
            {regStep === 3 && (
              <View>
                <Text style={styles.stepTitle}>Completez votre profil</Text>
                <Text style={styles.stepDesc}>
                  Numero verifie âœ… {regPhone}
                </Text>
                <InputField
                  label="Nom complet"
                  value={regName}
                  onChangeText={setRegName}
                  placeholder="Jean Diop"
                  error={regErrors.name}
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
                  placeholder="Minimum 6 caracteres"
                  secureTextEntry
                  error={regErrors.password}
                />
                <InputField
                  label="Confirmer le mot de passe"
                  value={regConfirm}
                  onChangeText={setRegConfirm}
                  placeholder="Repetez votre mot de passe"
                  secureTextEntry
                  error={regErrors.confirm}
                />
                <TouchableOpacity
                  style={styles.cguRow}
                  onPress={() => setAcceptCGU(!acceptCGU)}>
                  <View style={[styles.checkbox, acceptCGU && styles.checkboxActive]}>
                    {acceptCGU && <Text style={styles.checkmark}>âœ“</Text>}
                  </View>
                  <Text style={styles.cguText}>
                    {"J'accepte les "}
                    <Text style={styles.cguLink}>Conditions Generales d'Utilisation</Text>
                  </Text>
                </TouchableOpacity>
                {regErrors.cgu ? <Text style={styles.errorText}>{regErrors.cgu}</Text> : null}
                <ButtonPrimary
                  title="CREER MON COMPTE"
                  onPress={handleRegister}
                  loading={isLoading}
                  style={styles.submitBtn}
                />
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: {flex: 1},
  container: {flex: 1, backgroundColor: COLORS.background},
  content: {paddingBottom: 40},
  header: {
    backgroundColor: COLORS.primary,
    paddingBottom: 30,
    alignItems: 'center',
  },
  logo: {fontSize: 28, fontWeight: 'bold', color: COLORS.white},
  logoSub: {color: 'rgba(255,255,255,0.85)', fontSize: 14, marginTop: 4},
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
  tabActive: {borderBottomColor: COLORS.primary},
  tabText: {fontSize: 14, fontWeight: '600', color: COLORS.grey},
  tabTextActive: {color: COLORS.primary},
  form: {padding: 24},

  // Indicateur d'etapes
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
    marginTop: 4,
  },
  stepItem: {alignItems: 'center'},
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleActive: {borderColor: COLORS.primary, backgroundColor: COLORS.primary},
  stepCircleDone: {borderColor: COLORS.success, backgroundColor: COLORS.success},
  stepNum: {fontSize: 13, fontWeight: '700', color: COLORS.grey},
  stepNumActive: {color: COLORS.white},
  stepCheckmark: {fontSize: 14, fontWeight: 'bold', color: COLORS.white},
  stepLabel: {fontSize: 10, color: COLORS.grey, marginTop: 4, fontWeight: '500'},
  stepLabelActive: {color: COLORS.primary, fontWeight: '700'},
  stepLine: {width: 40, height: 2, backgroundColor: COLORS.border, marginBottom: 16},
  stepLineDone: {backgroundColor: COLORS.success},

  // Titres des etapes
  stepTitle: {fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginBottom: 6},
  stepDesc: {fontSize: 13, color: COLORS.grey, marginBottom: 20, lineHeight: 20},
  phoneHighlight: {fontWeight: 'bold', color: COLORS.primary},

  // OTP
  otpSection: {alignItems: 'center'},
  otpRow: {flexDirection: 'row', justifyContent: 'center', gap: 10, marginBottom: 20},
  otpBox: {
    width: 44,
    height: 52,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  otpBoxFilled: {borderColor: COLORS.primary},
  timerText: {fontSize: 13, color: COLORS.grey, marginBottom: 8, textAlign: 'center'},
  resendBtn: {marginBottom: 16},
  resendText: {color: COLORS.primary, fontSize: 14, fontWeight: '600'},
  changePhoneBtn: {marginBottom: 20, alignSelf: 'center'},
  changePhoneText: {color: COLORS.primary, fontSize: 13},

  // Connexion
  forgotBtn: {alignSelf: 'flex-end', marginBottom: 20, marginTop: -8},
  forgotText: {color: COLORS.primary, fontSize: 13},
  submitBtn: {marginTop: 8, width: '100%'},

  // CGU
  cguRow: {flexDirection: 'row', alignItems: 'center', marginBottom: 8, marginTop: 4},
  checkbox: {
    width: 22, height: 22, borderRadius: 4, borderWidth: 2,
    borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center', marginRight: 10,
  },
  checkboxActive: {backgroundColor: COLORS.primary, borderColor: COLORS.primary},
  checkmark: {color: COLORS.white, fontSize: 14, fontWeight: 'bold'},
  cguText: {flex: 1, fontSize: 13, color: COLORS.text, lineHeight: 18},
  cguLink: {color: COLORS.primary, fontWeight: '600'},
  errorText: {color: COLORS.error, fontSize: 12, marginBottom: 8},
});

export default LoginScreen;

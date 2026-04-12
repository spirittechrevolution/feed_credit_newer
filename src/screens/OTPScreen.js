import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  StatusBar,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import COLORS from '../utils/colors';
import ButtonPrimary from '../components/ButtonPrimary';
import {useAuth} from '../context/AuthContext';

/**
 * OTPScreen — saisie du code OTP à 6 chiffres avec timer de renvoi
 */
const OTPScreen = ({navigation}) => {
  const {verifyOTP, isLoading, otpPhone} = useAuth();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputs = useRef([]);

  // Compte à rebours 60s
  useEffect(() => {
    if (timer <= 0) {
      setCanResend(true);
      return;
    }
    const interval = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (text, index) => {
    // N'accepter que les chiffres
    if (!/^\d*$/.test(text)) return;
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    // Avancer au champ suivant automatiquement
    if (text && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length < 6) {
      Alert.alert('Erreur', 'Veuillez saisir les 6 chiffres du code');
      return;
    }
    try {
      await verifyOTP(code);
      navigation.replace('MainDrawer');
    } catch (e) {
      Alert.alert('Code invalide', e.message);
      setOtp(['', '', '', '', '', '']);
      inputs.current[0]?.focus();
    }
  };

  const handleResend = () => {
    setTimer(60);
    setCanResend(false);
    Alert.alert('Code renvoyé', `Un nouveau code a été envoyé au ${otpPhone}`);
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <StatusBar backgroundColor={COLORS.background} barStyle="dark-content" />
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>

        {/* Icône */}
        <View style={styles.iconBox}>
          <Text style={styles.iconEmoji}>💬</Text>
        </View>

      <Text style={styles.title}>Vérification</Text>
      <Text style={styles.subtitle}>
        Code envoyé au{'\n'}
        <Text style={styles.phone}>{otpPhone || '+221 78 XXX XX XX'}</Text>
      </Text>

      {/* Champs OTP */}
      <View style={styles.otpRow}>
        {otp.map((digit, i) => (
          <TextInput
            key={i}
            ref={ref => (inputs.current[i] = ref)}
            style={[styles.otpInput, digit && styles.otpInputFilled]}
            value={digit}
            onChangeText={text => handleChange(text, i)}
            onKeyPress={e => handleKeyPress(e, i)}
            keyboardType="numeric"
            maxLength={1}
            textAlign="center"
          />
        ))}
      </View>

      {/* Timer et renvoi */}
      <View style={styles.resendRow}>
        {canResend ? (
          <TouchableOpacity onPress={handleResend}>
            <Text style={styles.resendLink}>Renvoyer le code</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.timerText}>
            Renvoyer dans{' '}
            <Text style={styles.timerBold}>{timer}s</Text>
          </Text>
        )}
      </View>

      <ButtonPrimary
        title="VÉRIFIER"
        onPress={handleVerify}
        loading={isLoading}
        style={styles.btn}
      />

      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
        <Text style={styles.backText}>← Changer de numéro</Text>
      </TouchableOpacity>
    </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flexGrow: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 40,
  },
  iconBox: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  iconEmoji: {fontSize: 40},
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  phone: {
    fontWeight: 'bold',
    color: COLORS.text,
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 24,
  },
  otpInput: {
    width: 46,
    height: 56,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 10,
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    backgroundColor: COLORS.white,
  },
  otpInputFilled: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primaryLight,
  },
  resendRow: {
    marginBottom: 32,
  },
  timerText: {
    fontSize: 14,
    color: COLORS.grey,
  },
  timerBold: {
    fontWeight: 'bold',
    color: COLORS.text,
  },
  resendLink: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  btn: {
    width: '100%',
    marginBottom: 20,
  },
  backBtn: {
    padding: 8,
  },
  backText: {
    color: COLORS.grey,
    fontSize: 14,
  },
});

export default OTPScreen;

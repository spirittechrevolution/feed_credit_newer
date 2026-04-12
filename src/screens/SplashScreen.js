import React, {useEffect, useRef} from 'react';
import {View, Text, StyleSheet, Animated, StatusBar, Platform} from 'react-native';
import COLORS from '../utils/colors';

/**
 * SplashScreen — fond rouge, logo FeedCredit blanc, fade-out 2s → Onboarding
 */
const SplashScreen = ({navigation}) => {
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Attendre 1.5s puis faire un fade-out de 0.5s
    const timer = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: Platform.OS !== 'web',
      }).start(() => {
        navigation.replace('Onboarding');
      });
    }, 1500);

    return () => clearTimeout(timer);
  }, [navigation, opacity]);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      <Animated.View style={[styles.content, {opacity}]}>
        {/* Logo / Icône */}
        <View style={styles.logoCircle}>
          <Text style={styles.logoEmoji}>🛒</Text>
        </View>
        <Text style={styles.title}>FeedCredit</Text>
        <Text style={styles.tagline}>Achetez maintenant, payez plus tard</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logoEmoji: {
    fontSize: 50,
  },
  title: {
    fontSize: 38,
    fontWeight: 'bold',
    color: COLORS.white,
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 8,
    letterSpacing: 0.5,
  },
});

export default SplashScreen;

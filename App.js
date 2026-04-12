/**
 * FeedCredit — Application de crédit alimentaire
 * Compatible Expo (iOS / Android / Web)
 */

import 'react-native-gesture-handler';
import React from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {SafeAreaProvider} from 'react-native-safe-area-context';

// Contexte
import {AuthProvider} from './src/context/AuthContext';

// Écrans d'authentification
import SplashScreen from './src/screens/SplashScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import LoginScreen from './src/screens/LoginScreen';
import OTPScreen from './src/screens/OTPScreen';

// Écrans principaux
import HomeScreen from './src/screens/HomeScreen';
import OfferDetailScreen from './src/screens/OfferDetailScreen';
import SubscriptionsScreen from './src/screens/SubscriptionsScreen';
import PaymentScreen from './src/screens/PaymentScreen';
import MyCreditScreen from './src/screens/MyCreditScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';
import ProfileScreen from './src/screens/ProfileScreen';

// Navigation latérale
import DrawerContent from './src/navigation/DrawerContent';

import COLORS from './src/utils/colors';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// ─── Stack "App" imbriqué dans le Drawer ─────────────────────────────────────
const AppStack = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="OfferDetail" component={OfferDetailScreen} />
    <Stack.Screen name="Subscriptions" component={SubscriptionsScreen} />
    <Stack.Screen name="Payment" component={PaymentScreen} />
    <Stack.Screen name="MyCredit" component={MyCreditScreen} />
    <Stack.Screen name="Notifications" component={NotificationsScreen} />
    <Stack.Screen name="Profile" component={ProfileScreen} />
  </Stack.Navigator>
);

// ─── Drawer principal ─────────────────────────────────────────────────────────
const MainDrawer = () => (
  <Drawer.Navigator
    drawerContent={props => <DrawerContent {...props} />}
    screenOptions={{
      headerShown: false,
      drawerStyle: {width: 300},
    }}>
    <Drawer.Screen name="AppStack" component={AppStack} />
  </Drawer.Navigator>
);

// ─── Stack d'authentification ─────────────────────────────────────────────────
const AuthStack = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="Splash" component={SplashScreen} />
    <Stack.Screen name="Onboarding" component={OnboardingScreen} />
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="OTP" component={OTPScreen} />
    <Stack.Screen name="MainDrawer" component={MainDrawer} />
  </Stack.Navigator>
);

// ─── App principale ───────────────────────────────────────────────────────────
export default function App() {
  return (
    <SafeAreaProvider style={{flex: 1, overflow: 'hidden'}}>
      <AuthProvider>
        <NavigationContainer style={{flex: 1, overflow: 'hidden'}}>
          <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
          <AuthStack />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

/**
 * FeedCredit — Application de crédit alimentaire
 * Compatible Expo (iOS / Android / Web)
 */

import 'react-native-gesture-handler';
import React from 'react';
import {StatusBar, Platform} from 'react-native';

// Fix web scroll
if (Platform.OS === 'web' && typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent =
    'html,body{height:100%;overflow:hidden;margin:0}' +
    '#root{display:flex;flex-direction:column;height:100%}';
  document.head.appendChild(style);
}
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {SafeAreaProvider} from 'react-native-safe-area-context';

// Contextes
import {AuthProvider, useAuth} from './src/context/AuthContext';
import {CartProvider} from './src/context/CartContext';

// Écrans d'authentification
import SplashScreen from './src/screens/SplashScreen';
import OnboardingScreen from './src/screens/OnboardingScreen';
import LoginScreen from './src/screens/LoginScreen';

// Écrans principaux
import HomeScreen from './src/screens/HomeScreen';
import OfferDetailScreen from './src/screens/OfferDetailScreen';
import SubscriptionsScreen from './src/screens/SubscriptionsScreen';
import PaymentScreen from './src/screens/PaymentScreen';
import MyCreditScreen from './src/screens/MyCreditScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import AddressesScreen from './src/screens/AddressesScreen';
import HelpScreen from './src/screens/HelpScreen';
import CartScreen from './src/screens/CartScreen';

// Navigation latérale
import DrawerContent from './src/navigation/DrawerContent';

import COLORS from './src/utils/colors';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// ─── Stack App imbriqué dans le Drawer ───────────────────────────────────────
const AppStack = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="OfferDetail" component={OfferDetailScreen} />
    <Stack.Screen name="Subscriptions" component={SubscriptionsScreen} />
    <Stack.Screen name="Payment" component={PaymentScreen} />
    <Stack.Screen name="MyCredit" component={MyCreditScreen} />
    <Stack.Screen name="Notifications" component={NotificationsScreen} />
    <Stack.Screen name="Profile" component={ProfileScreen} />
    <Stack.Screen name="Settings" component={SettingsScreen} />
    <Stack.Screen name="Addresses" component={AddressesScreen} />
    <Stack.Screen name="Help" component={HelpScreen} />
    <Stack.Screen name="Cart" component={CartScreen} />
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

// ─── Stack d'entrée (Splash → Onboarding → Login) ────────────────────────────
const AuthStack = () => (
  <Stack.Navigator screenOptions={{headerShown: false}}>
    <Stack.Screen name="Splash" component={SplashScreen} />
    <Stack.Screen name="Onboarding" component={OnboardingScreen} />
    <Stack.Screen name="Login" component={LoginScreen} />
  </Stack.Navigator>
);

// ─── Navigateur racine conditionnel ──────────────────────────────────────────
const RootNavigator = () => {
  const {isAuthenticated} = useAuth();
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {isAuthenticated ? (
        <Stack.Screen name="Main" component={MainDrawer} />
      ) : (
        <Stack.Screen name="Auth" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
};

// ─── App principale ───────────────────────────────────────────────────────────
export default function App() {
  return (
    <SafeAreaProvider style={{flex: 1, overflow: 'hidden'}}>
      <AuthProvider>
        <CartProvider>
          <NavigationContainer style={{flex: 1, overflow: 'hidden'}}>
            <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
            <RootNavigator />
          </NavigationContainer>
        </CartProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

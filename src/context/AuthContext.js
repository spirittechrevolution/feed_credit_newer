import React, {createContext, useContext, useState} from 'react';

import {user as mockUser} from '../utils/mockData';
import {post} from '../utils/api';

// Contexte d'authentification global
const AuthContext = createContext(null);

export const AuthProvider = ({children}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [otpPhone, setOtpPhone] = useState('');
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);

  // Connexion simulée (mock)
  // Connexion réelle (API)
  const login = async (phone, password) => {
    setIsLoading(true);
    try {
      let phoneToSend = phone.trim();
      if (!phoneToSend.startsWith('+221')) {
        phoneToSend = '+221' + phoneToSend.replace(/^0+/, '');
      }
      const res = await post('auth/login', { phone: phoneToSend, password });
      setIsLoading(false);
      setOtpPhone(phoneToSend);
      setCurrentUser(res.user);
      setIsAuthenticated(true);
      setAccessToken(res.access_token);
      setRefreshToken(res.refresh_token);
      console.log('[LOGIN] user:', res.user);
      return res;
    } catch (e) {
      setIsLoading(false);
      throw e;
    }
  };

  // Envoi OTP pour inscription (API réelle)
  const sendRegistrationOTP = async phone => {
    setIsLoading(true);
    try {
      if (!phone || phone.length < 8) throw new Error('Numéro de téléphone invalide');
      let phoneToSend = phone.trim();
      if (!phoneToSend.startsWith('+221')) {
        phoneToSend = '+221' + phoneToSend.replace(/^0+/, '');
      }
      const res = await post('auth/register/send-otp', {phone: phoneToSend});
      setOtpPhone(phoneToSend);
      setIsLoading(false);
      return res;
    } catch (e) {
      setIsLoading(false);
      throw e;
    }
  };

  // Vérification OTP inscription (API réelle)
  const verifyRegistrationOTP = async (phone, code) => {
    setIsLoading(true);
    try {
      let phoneToSend = phone.trim();
      if (!phoneToSend.startsWith('+221')) {
        phoneToSend = '+221' + phoneToSend.replace(/^0+/, '');
      }
      const res = await post('auth/register/verify-otp', { phone: phoneToSend, otp: code });
      setIsLoading(false);
      return res;
    } catch (e) {
      setIsLoading(false);
      throw e;
    }
  };

  // Inscription réelle
  const register = async (
    name,
    phone,
    email,
    password,
    confirm_password,
    accept_terms,
    date_naissance = null,
  ) => {
    setIsLoading(true);
     let phoneToSend = phone.trim();
      if (!phoneToSend.startsWith('+221')) {
        phoneToSend = '+221' + phoneToSend.replace(/^0+/, '');
      }
    try {
      const res = await post('auth/register', {
        name,
        phone: phoneToSend,
        email,
        password,
        confirm_password: confirm_password || password,
        accept_terms: Boolean(accept_terms),
        date_naissance,
      });
      setIsLoading(false);
      setCurrentUser(res.user || { name, phone, email });
      setIsAuthenticated(true);
      return res;
    } catch (e) {
      setIsLoading(false);
      throw e;
    }
  };

  // Vérification OTP réelle (générique)
  const verifyOTP = async (phone, otp) => {
    setIsLoading(true);
    try {
      let phoneToSend = phone.trim();
      if (!phoneToSend.startsWith('+221')) {
        phoneToSend = '+221' + phoneToSend.replace(/^0+/, '');
      }
      const res = await post('auth/register/verify-otp', { phone: phoneToSend, otp });
      setIsLoading(false);
      setCurrentUser(res.user || { phone: phoneToSend });
      setIsAuthenticated(true);
      return res;
    } catch (e) {
      setIsLoading(false);
      throw e;
    }
  };

  // Déconnexion
  // Déconnexion réelle (API)
  const logout = async (refresh_token) => {
    setIsLoading(true);
    try {
      if (refresh_token) {
        await post('auth/logout', { refresh_token });
      }
    } catch (e) {
      // Optionnel : afficher une erreur ou ignorer
    } finally {
      setIsAuthenticated(false);
      setCurrentUser(null);
      setOtpPhone('');
      setAccessToken(null);
      setRefreshToken(null);
      setIsLoading(false);
      console.log('[LOGOUT] Utilisateur déconnecté');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        currentUser,
        isLoading,
        otpPhone,
        accessToken,
        refreshToken,
        login,
        sendRegistrationOTP,
        verifyRegistrationOTP,
        register,
        verifyOTP,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte auth
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'AuthProvider');
  }
  return context;
};

export default AuthContext;

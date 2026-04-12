import React, {createContext, useContext, useState} from 'react';
import {user as mockUser} from '../utils/mockData';

// Contexte d'authentification global
const AuthContext = createContext(null);

export const AuthProvider = ({children}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [otpPhone, setOtpPhone] = useState('');

  // Connexion simulée (mock)
  const login = async (phone, password) => {
    setIsLoading(true);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        setIsLoading(false);
        if (phone && password) {
          setOtpPhone(phone);
          resolve({success: true});
        } else {
          reject(new Error('Identifiants invalides'));
        }
      }, 1000);
    });
  };

  // Inscription simulée
  const register = async (name, phone, email, password) => {
    setIsLoading(true);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        setIsLoading(false);
        if (name && phone && password) {
          setOtpPhone(phone);
          resolve({success: true});
        } else {
          reject(new Error('Données invalides'));
        }
      }, 1200);
    });
  };

  // Vérification OTP simulée
  const verifyOTP = async otp => {
    setIsLoading(true);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        setIsLoading(false);
        if (otp === '123456' || otp.length === 6) {
          setCurrentUser(mockUser);
          setIsAuthenticated(true);
          resolve({success: true});
        } else {
          reject(new Error('Code OTP invalide'));
        }
      }, 1000);
    });
  };

  // Déconnexion
  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setOtpPhone('');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        currentUser,
        isLoading,
        otpPhone,
        login,
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

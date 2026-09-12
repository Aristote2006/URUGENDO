import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthModalContext = createContext();

export const AuthModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [authTab, setAuthTab] = useState('register'); // 'register' | 'login'

  const openAuth = (tab = 'register') => {
    setAuthTab(tab);
    setIsOpen(true);
  };

  const closeAuth = () => {
    setIsOpen(false);
  };

  const switchTab = (tab) => {
    setAuthTab(tab);
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        closeAuth();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <AuthModalContext.Provider
      value={{
        isOpen,
        authTab,
        openAuth,
        closeAuth,
        switchTab,
      }}
    >
      {children}
    </AuthModalContext.Provider>
  );
};

export const useAuthModal = () => {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error('useAuthModal must be used within an AuthModalProvider');
  }
  return context;
};


import React, { createContext, useState, useContext, ReactNode } from 'react';
import type { User } from '../types';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (name: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('lifeskills_user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const isAuthenticated = !!user;

  const login = (name: string) => {
    const newUser = { name };
    setUser(newUser);
    localStorage.setItem('lifeskills_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    // Clear all app-related data from localStorage to reset the state
    localStorage.removeItem('lifeskills_user');
    localStorage.removeItem('streak_data');
    localStorage.removeItem('daily_goal');
    localStorage.removeItem('mood_last_checked');
    localStorage.removeItem('mood_history');
    localStorage.removeItem('has_visited');
    localStorage.removeItem('lifeskills_calendar_events');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

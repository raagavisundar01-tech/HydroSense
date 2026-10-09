import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useClerk } from '@clerk/clerk-react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('hydrosense_token') || null);
  const [loading, setLoading] = useState(true);
  const clerk = useClerk();

  // Set axios auth header
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('hydrosense_token', token);
      fetchProfile();
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('hydrosense_token');
      setUser(null);
      setLoading(false);
    }
  }, [token]);

  const fetchProfile = async () => {
    try {
      const res = await axios.get('/api/auth/profile');
      setUser(res.data.user);
    } catch (err) {
      console.warn('Profile fetch failed, logging out:', err.message);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const res = await axios.post('/api/auth/login', { email, password });
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const register = async (userData) => {
    const res = await axios.post('/api/auth/register', userData);
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const logout = async () => {
    try {
      if (clerk && clerk.loaded) {
        await clerk.signOut();
      }
    } catch (e) {
      console.error('Clerk sign-out error:', e);
    }
    setToken(null);
    setUser(null);
    localStorage.removeItem('hydrosense_token');
  };

  const syncClerkUser = async (clerkUser, targetRole = 'resident') => {
    try {
      const email = clerkUser.primaryEmailAddress?.emailAddress || clerkUser.emailAddresses?.[0]?.emailAddress;
      const res = await axios.post('/api/auth/clerk-sync', {
        clerkId: clerkUser.id,
        email,
        name: clerkUser.fullName || `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || email.split('@')[0],
        avatar: clerkUser.imageUrl,
        role: targetRole
      });
      setToken(res.data.token);
      setUser(res.data.user);
      return res.data;
    } catch (err) {
      console.error('Clerk sync error:', err);
      throw err;
    }
  };

  // Quick switch role for seamless testing and demonstration
  const quickSwitchRole = async (targetRole) => {
    const credentials = {
      admin: { email: 'admin@hydrosense.io', password: 'admin123' },
      staff: { email: 'staff@hydrosense.io', password: 'staff123' },
      resident: { email: 'resident@hydrosense.io', password: 'resident123' }
    };
    const cred = credentials[targetRole] || credentials.resident;
    return await login(cred.email, cred.password);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, quickSwitchRole, syncClerkUser, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

interface UserData {
  _id: string;
  userId: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  token: string;
}

interface AuthContextType {
  user: UserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => ({ success: false }),
  signup: async () => ({ success: false }),
  loginWithGoogle: async () => ({ success: false }),
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('cardcraft_user');
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as UserData;
        // Validate token by calling profile endpoint
        fetch(`${API_BASE}/auth/profile`, {
          headers: { Authorization: `Bearer ${parsed.token}` },
        })
          .then((res) => {
            if (res.ok) {
              return res.json();
            }
            throw new Error('Token expired');
          })
          .then((profile) => {
            setUser({ ...parsed, ...profile, token: parsed.token });
          })
          .catch(() => {
            localStorage.removeItem('cardcraft_user');
            setUser(null);
          })
          .finally(() => setIsLoading(false));
      } catch {
        localStorage.removeItem('cardcraft_user');
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.message || 'Login failed' };
      }
      setUser(data);
      localStorage.setItem('cardcraft_user', JSON.stringify(data));
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Network error. Is the backend running?' };
    }
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.message || 'Registration failed' };
      }
      setUser(data);
      localStorage.setItem('cardcraft_user', JSON.stringify(data));
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Network error. Is the backend running?' };
    }
  }, []);

  const loginWithGoogle = useCallback(async () => {
    try {
      const { auth, signInWithPopup, googleProvider, db } = await import('@/lib/firebase');
      const { doc, getDoc, setDoc } = await import('firebase/firestore');

      const result = await signInWithPopup(auth, googleProvider);
      const fUser = result.user;

      if (!fUser) {
        throw new Error('Google authentication returned no user info');
      }

      // Store in Firestore: users/{uid}
      try {
        const userRef = doc(db, 'users', fUser.uid);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) {
          await setDoc(userRef, {
            name: fUser.displayName || '',
            email: fUser.email || '',
            photoURL: fUser.photoURL || '',
            provider: 'google',
            createdAt: new Date().toISOString()
          });
        }
      } catch (firestoreError) {
        console.error("Firestore storage error:", firestoreError);
        // Continue even if Firestore write fails
      }

      // Now authenticate with backend
      const res = await fetch(`${API_BASE}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fUser.displayName,
          email: fUser.email,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.message || 'Google authentication failed on backend' };
      }

      setUser(data);
      localStorage.setItem('cardcraft_user', JSON.stringify(data));
      return { success: true };
    } catch (error: any) {
      console.error(error);
      if (error.code === 'auth/popup-closed-by-user') {
        return { success: false, error: 'Sign-in cancelled: popup closed' };
      }
      if (error.code === 'auth/popup-blocked') {
        return { success: false, error: 'Popup blocked by browser. Please allow popups for this site.' };
      }
      return { success: false, error: error.message || 'Google Sign-in failed' };
    }
  }, []);

  const logout = useCallback(async () => {
    setUser(null);
    localStorage.removeItem('cardcraft_user');
    try {
      const { signOut, auth } = await import('@/lib/firebase');
      await signOut(auth);
    } catch (e) {
      console.error("Firebase logout error:", e);
    }
  }, []);

  // Firebase auth state listener to restore auth status if Firebase updates
  useEffect(() => {
    let unsubscribe: () => void = () => {};
    import('@/lib/firebase').then(({ auth }) => {
      const { onAuthStateChanged } = require('firebase/auth');
      unsubscribe = onAuthStateChanged(auth, async (fUser: any) => {
        // If Firebase indicates we are logged in, but we have no local state (or token validation is pending)
        // sync if appropriate. LocalStorage is the primary source of backend JWT.
      });
    }).catch(e => console.error(e));
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;

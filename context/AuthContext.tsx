import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { User } from '../types';
import { Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      // Check active sessions and sets the user
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ? { id: session.user.id, email: session.user.email || '' } : null);
        setLoading(false);
      });

      // Listen for changes on auth state (logged in, signed out, etc.)
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ? { id: session.user.id, email: session.user.email || '' } : null);
        setLoading(false);
      });

      return () => subscription.unsubscribe();
    } else {
      // Mock Auth for Demo Mode
      const storedUser = localStorage.getItem('nebula_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    }
  }, []);

  const signIn = async (email: string) => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: 'password-placeholder', // In a real app, pass password
      });
      if (error) throw error;
    } else {
      // Mock Sign In
      const mockUser = { id: 'demo-user-123', email };
      localStorage.setItem('nebula_user', JSON.stringify(mockUser));
      setUser(mockUser);
    }
  };
  
  // Adjusted for the demo: simple mock allows login with just email for simplicity in UI if no Supabase
  const signUp = async (email: string) => {
     if (isSupabaseConfigured && supabase) {
        // Implement real signup
     } else {
         await signIn(email);
     }
  }

  const signOut = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    } else {
      localStorage.removeItem('nebula_user');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, signUp }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

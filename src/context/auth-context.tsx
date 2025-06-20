'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db, firebaseError } from '@/lib/firebase/client';
import { Loader2, AlertTriangle } from 'lucide-react';

interface UserData {
  role: 'admin' | 'superadmin' | 'user';
  displayName: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  if (firebaseError || !auth || !db) {
    return (
        <div className="flex h-screen items-center justify-center bg-background p-4">
            <div className="w-full max-w-md rounded-lg border border-destructive bg-card p-6 text-center">
                <AlertTriangle className="mx-auto h-12 w-12 text-destructive" />
                <h1 className="mt-4 text-2xl font-bold text-destructive">Erreur de Configuration</h1>
                <p className="mt-2 text-card-foreground">
                    La connexion à Firebase a échoué.
                </p>
                <code className="mt-4 block rounded bg-muted p-2 text-left text-sm text-muted-foreground">
                    {firebaseError || "Impossible d'initialiser Firebase."}
                </code>
                 <p className="mt-4 text-sm text-muted-foreground">
                    Veuillez vérifier que vos clés Firebase sont correctement configurées dans le fichier <code>.env</code>.
                </p>
            </div>
        </div>
    )
  }

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoading(true);
      setUser(user);
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const unsubSnapshot = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            setUserData(docSnap.data() as UserData);
          } else {
            setUserData(null);
          }
          setLoading(false);
        });
        return () => unsubSnapshot();
      } else {
        setUserData(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [auth, db]);
  
  const value = { user, userData, loading, signOut };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

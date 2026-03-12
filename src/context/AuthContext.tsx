import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile as firebaseUpdateProfile,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebaseConfig';

export interface User {
  uid: string;
  name: string;
  email: string;
  cpf?: string;
  age?: number;
  phone?: string;
  photoURL?: string;
}

interface AuthContextData {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    cpf: string,
    age: number,
  ) => Promise<void>;
  updateUserProfile: (data: Partial<Pick<User, 'name' | 'phone' | 'age'>>) => Promise<void>;
  updatePhotoURL: (url: string) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Tenta carregar dados extras do Firestore (cpf, age, phone)
        try {
          const snap = await getDoc(doc(db, 'usuarios', firebaseUser.uid));
          const data = snap.exists() ? snap.data() : {};
          setUser({
            uid: firebaseUser.uid,
            name: (data.name ?? firebaseUser.displayName ?? firebaseUser.email?.split('@')[0] ?? 'Usuário'),
            email: firebaseUser.email ?? '',
            cpf: data.cpf,
            age: data.age,
            phone: data.phone,
            photoURL: data.photoURL,
          });
        } catch {
          // Sem permissão ainda (novo usuário antes do setDoc) — usa só o Auth
          const name = firebaseUser.displayName ?? firebaseUser.email?.split('@')[0] ?? 'Usuário';
          setUser({ uid: firebaseUser.uid, name, email: firebaseUser.email ?? '' });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  async function login(email: string, password: string) {
    await signInWithEmailAndPassword(auth, email, password);
  }

  async function register(
    name: string,
    email: string,
    password: string,
    cpf: string,
    age: number,
  ) {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    await firebaseUpdateProfile(credential.user, { displayName: name });
    setUser({ uid: credential.user.uid, name, email, cpf, age });
    try {
      await setDoc(doc(db, 'usuarios', credential.user.uid), {
        uid: credential.user.uid,
        name,
        email,
        cpf,
        age,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.warn('Firestore write failed:', err);
    }
  }

  async function updateUserProfile(data: Partial<Pick<User, 'name' | 'phone' | 'age'>>) {
    if (!user) return;
    if (data.name) {
      await firebaseUpdateProfile(auth.currentUser!, { displayName: data.name });
    }
    // Remove campos undefined — Firestore não aceita valores undefined
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([, v]) => v !== undefined),
    );
    await setDoc(doc(db, 'usuarios', user.uid), {
      ...cleanData,
      updatedAt: serverTimestamp(),
    }, { merge: true });
    setUser((prev) => (prev ? { ...prev, ...data } : prev));
  }

  async function logout() {
    await signOut(auth);
  }

  function updatePhotoURL(url: string) {
    setUser(prev => (prev ? { ...prev, photoURL: url } : prev));
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, updateUserProfile, updatePhotoURL, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export function translateFirebaseError(err: unknown): string {
  if (!(err instanceof FirebaseError)) return 'Ocorreu um erro inesperado.';
  switch (err.code) {
    case 'auth/email-already-in-use': return 'Este e-mail já está em uso.';
    case 'auth/invalid-email': return 'E-mail inválido.';
    case 'auth/weak-password': return 'A senha deve ter pelo menos 6 caracteres.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential': return 'E-mail ou senha incorretos.';
    case 'auth/too-many-requests': return 'Muitas tentativas. Tente novamente mais tarde.';
    case 'auth/network-request-failed': return 'Sem conexão com a internet.';
    case 'auth/operation-not-allowed': return 'Login por e-mail não está habilitado.';
    case 'permission-denied':
    case 'firestore/permission-denied': return 'Sem permissão. Verifique as regras do banco.';
    default: return `Ocorreu um erro (${err.code}). Tente novamente.`;
  }
}

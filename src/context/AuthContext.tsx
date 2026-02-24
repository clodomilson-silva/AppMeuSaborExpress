import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebaseConfig';

export interface User {
  uid: string;
  name: string;
  email: string;
}

interface AuthContextData {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // aguarda Firebase verificar sessão

  // Escuta mudanças de sessão ao iniciar o app
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const name =
          firebaseUser.displayName ?? firebaseUser.email?.split('@')[0] ?? 'Usuário';
        const email = firebaseUser.email ?? '';

        setUser({ uid: firebaseUser.uid, name, email });

        // Sincroniza o perfil no Firestore caso o documento não exista ainda
        try {
          const userRef = doc(db, 'usuarios', firebaseUser.uid);
          const snap = await getDoc(userRef);
          if (!snap.exists()) {
            await setDoc(userRef, {
              uid: firebaseUser.uid,
              name,
              email,
              createdAt: serverTimestamp(),
            });
          }
        } catch (e) {
          console.warn('Firestore sync failed:', e);
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
    // onAuthStateChanged cuida de atualizar o state
  }

  async function register(name: string, email: string, password: string) {
    // 1. Cria credencial no Firebase Authentication (passo crítico)
    const credential = await createUserWithEmailAndPassword(auth, email, password);

    // 2. Salva o displayName no perfil do Auth
    await updateProfile(credential.user, { displayName: name });

    // 3. Atualiza o estado local imediatamente (o usuário já está logado no Auth)
    setUser({ uid: credential.user.uid, name, email });

    // 4. Tenta salvar no Firestore — falha silenciosa para não bloquear o login
    try {
      await setDoc(doc(db, 'usuarios', credential.user.uid), {
        uid: credential.user.uid,
        name,
        email,
        createdAt: serverTimestamp(),
      });
    } catch (firestoreErr) {
      // Firestore write falhou (ex: regras de segurança), mas o usuário já está autenticado
      console.warn('Firestore write failed:', firestoreErr);
    }
  }

  async function logout() {
    await signOut(auth);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

// Helper para traduzir erros do Firebase para o português
export function translateFirebaseError(err: unknown): string {
  if (!(err instanceof FirebaseError)) return 'Ocorreu um erro inesperado.';
  switch (err.code) {
    // Auth
    case 'auth/email-already-in-use':
      return 'Este e-mail já está em uso.';
    case 'auth/invalid-email':
      return 'E-mail inválido.';
    case 'auth/weak-password':
      return 'A senha deve ter pelo menos 6 caracteres.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'E-mail ou senha incorretos.';
    case 'auth/too-many-requests':
      return 'Muitas tentativas. Tente novamente mais tarde.';
    case 'auth/network-request-failed':
      return 'Sem conexão com a internet.';
    case 'auth/operation-not-allowed':
      return 'Login por e-mail não está habilitado. Contate o suporte.';
    // Firestore
    case 'permission-denied':
    case 'firestore/permission-denied':
      return 'Sem permissão. Verifique as regras do banco de dados.';
    default:
      return `Ocorreu um erro (${err.code}). Tente novamente.`;
  }
}

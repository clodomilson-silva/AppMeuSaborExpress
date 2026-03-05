import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  cpf?: string;
  age?: number;
  phone?: string;
  photoURL?: string;
  createdAt?: any;
}

// ─── Ler perfil ───────────────────────────────────────────────────────────────

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, 'usuarios', uid));
  if (!snap.exists()) return null;
  return snap.data() as UserProfile;
}

// ─── Atualizar perfil ─────────────────────────────────────────────────────────

export async function updateUserProfile(
  uid: string,
  data: Partial<Pick<UserProfile, 'name' | 'phone' | 'age'>>,
): Promise<void> {
  await updateDoc(doc(db, 'usuarios', uid), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

// ─── Atualizar apenas a foto ──────────────────────────────────────────────────

export async function updateUserPhotoURL(
  uid: string,
  photoURL: string,
): Promise<void> {
  await updateDoc(doc(db, 'usuarios', uid), {
    photoURL,
    updatedAt: serverTimestamp(),
  });
}

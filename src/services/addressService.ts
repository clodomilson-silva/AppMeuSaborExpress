import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

export interface Address {
  id?: string;
  label?: string; // ex: "Casa", "Trabalho"
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  reference?: string;
}

const addressesPath = (uid: string) => collection(db, 'usuarios', uid, 'enderecos');
const addressPath = (uid: string, id: string) => doc(db, 'usuarios', uid, 'enderecos', id);

// ─── Listar ────────────────────────────────────────────────────────────────────

export async function getUserAddresses(uid: string): Promise<Address[]> {
  const q = query(addressesPath(uid), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Address, 'id'>) }));
}

// ─── Adicionar ────────────────────────────────────────────────────────────────

export async function addAddress(uid: string, data: Omit<Address, 'id'>): Promise<string> {
  const ref = await addDoc(addressesPath(uid), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

// ─── Atualizar ────────────────────────────────────────────────────────────────

export async function updateAddress(
  uid: string,
  addressId: string,
  data: Partial<Omit<Address, 'id'>>,
): Promise<void> {
  await updateDoc(addressPath(uid, addressId), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

// ─── Remover ──────────────────────────────────────────────────────────────────

export async function deleteAddress(uid: string, addressId: string): Promise<void> {
  await deleteDoc(addressPath(uid, addressId));
}

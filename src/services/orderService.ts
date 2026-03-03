import {
  collection,
  addDoc,
  doc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
  Unsubscribe,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { Order, CreateOrderPayload, OrderStatus } from '../types/order';

const ORDERS_COLLECTION = 'pedidos';

// ─── Criar pedido ─────────────────────────────────────────────────────────────

/**
 * Cria um novo pedido no Firestore com status inicial `pendente_pagamento`.
 * Salvo na coleção raiz `pedidos` (acessível por Cloud Functions e admin).
 */
export async function createOrder(payload: CreateOrderPayload): Promise<string> {
  const docRef = await addDoc(collection(db, ORDERS_COLLECTION), {
    ...payload,
    status: 'pendente_pagamento',
    paymentStatus: 'pendente',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

// ─── Atualizar status ─────────────────────────────────────────────────────────

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
): Promise<void> {
  const ref = doc(db, ORDERS_COLLECTION, orderId);
  await updateDoc(ref, { status, updatedAt: serverTimestamp() });
}

// ─── Listener em tempo real de um pedido ─────────────────────────────────────

/**
 * Escuta mudanças em tempo real de um pedido específico.
 * Útil para acompanhar o status enquanto o usuário está na tela de detalhes.
 */
export function subscribeToOrder(
  orderId: string,
  callback: (order: Order) => void,
): Unsubscribe {
  const ref = doc(db, ORDERS_COLLECTION, orderId);
  return onSnapshot(ref, (snap) => {
    if (snap.exists()) {
      callback({ id: snap.id, ...(snap.data() as Omit<Order, 'id'>) });
    }
  });
}

// ─── Listener em tempo real de todos os pedidos do usuário ───────────────────

/**
 * Escuta todos os pedidos do usuário, ordenados do mais recente ao mais antigo.
 * Usado pelo OrderContext e PedidosScreen.
 */
export function subscribeToUserOrders(
  userId: string,
  callback: (orders: Order[]) => void,
): Unsubscribe {
  const q = query(
    collection(db, ORDERS_COLLECTION),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
  );

  return onSnapshot(q, (snap) => {
    const orders = snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<Order, 'id'>),
    }));
    callback(orders);
  });
}

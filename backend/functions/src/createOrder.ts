import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { CreateOrderPayload } from './types';

/** 
 * Cria um pedido via Callable Function.
 * Validar dados no servidor garante integridade e permite regras de negócio.
 */
export const createOrder = functions.https.onCall(
  async (data: CreateOrderPayload, context) => {
    // 1. Verificar autenticação
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'Você precisa estar autenticado para criar um pedido.',
      );
    }

    // 2. Validações básicas
    if (!data.items || data.items.length === 0) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'O pedido deve ter ao menos um item.',
      );
    }

    if (!data.total || data.total <= 0) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Total do pedido inválido.',
      );
    }

    // 3. Recalcular total no servidor para evitar manipulação
    const calculatedTotal = data.items.reduce((sum, item) => {
      const addonTotal = (item.addons ?? []).reduce(
        (a: number, ad: { price: number }) => a + ad.price,
        0,
      );
      return sum + (item.price + addonTotal) * item.qty;
    }, 0);

    if (Math.abs(calculatedTotal - data.total) > 0.01) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Total inconsistente. Recarregue o app e tente novamente.',
      );
    }

    // 4. Persistir no Firestore
    const db = admin.firestore();
    const orderRef = await db.collection('pedidos').add({
      userId: context.auth.uid,
      items: data.items,
      total: calculatedTotal,
      deliveryFee: data.deliveryFee ?? 0,
      deliveryAddress: data.deliveryAddress ?? null,
      paymentMethod: data.paymentMethod,
      paymentStatus: 'pendente',
      status: 'pendente_pagamento',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { orderId: orderRef.id };
  },
);

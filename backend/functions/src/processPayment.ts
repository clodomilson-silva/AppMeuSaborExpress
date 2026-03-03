import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import Stripe from 'stripe';
import { MercadoPagoConfig, Preference } from 'mercadopago';

// ─── Tipos ─────────────────────────────────────────────────────────────────────

interface ProcessPaymentData {
  orderId: string;
  amount: number; // em centavos
  provider: 'mercadopago' | 'stripe';
  paymentMethodType: string;
}

interface ProcessPaymentResult {
  success: boolean;
  paymentId?: string;
  redirectUrl?: string;
  clientSecret?: string;
  error?: string;
}

// ─── Cloud Function ───────────────────────────────────────────────────────────

/**
 * Inicia o pagamento de um pedido.
 * As chaves secretas nunca chegam ao app — ficam somente aqui.
 * 
 * Configure com:
 *   firebase functions:config:set stripe.secret="sk_live_..." mercadopago.token="APP_USR-..."
 */
export const processPayment = functions.https.onCall(
  async (data: ProcessPaymentData, context): Promise<ProcessPaymentResult> => {
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'Não autenticado.');
    }

    const db = admin.firestore();
    const orderRef = db.collection('pedidos').doc(data.orderId);
    const orderSnap = await orderRef.get();

    if (!orderSnap.exists) {
      throw new functions.https.HttpsError('not-found', 'Pedido não encontrado.');
    }

    const order = orderSnap.data()!;

    // Garantir que o pedido pertence ao usuário autenticado
    if (order.userId !== context.auth.uid) {
      throw new functions.https.HttpsError('permission-denied', 'Acesso negado.');
    }

    try {
      if (data.provider === 'stripe') {
        return await handleStripe(data, orderRef);
      }

      if (data.provider === 'mercadopago') {
        return await handleMercadoPago(data, order, orderRef);
      }

      throw new functions.https.HttpsError('invalid-argument', 'Provider inválido.');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro inesperado.';
      console.error('[processPayment] Erro:', message);
      return { success: false, error: message };
    }
  },
);

// ─── Stripe ───────────────────────────────────────────────────────────────────

async function handleStripe(
  data: ProcessPaymentData,
  orderRef: admin.firestore.DocumentReference,
): Promise<ProcessPaymentResult> {
  const secretKey = functions.config().stripe?.secret;
  if (!secretKey) throw new Error('Chave Stripe não configurada.');

  const stripe = new Stripe(secretKey, { apiVersion: '2024-04-10' });

  const paymentIntent = await stripe.paymentIntents.create({
    amount: data.amount,
    currency: 'brl',
    metadata: { orderId: data.orderId },
    automatic_payment_methods: { enabled: true },
  });

  await orderRef.update({
    paymentId: paymentIntent.id,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return {
    success: true,
    paymentId: paymentIntent.id,
    clientSecret: paymentIntent.client_secret ?? undefined,
  };
}

// ─── MercadoPago ──────────────────────────────────────────────────────────────

async function handleMercadoPago(
  data: ProcessPaymentData,
  order: admin.firestore.DocumentData,
  orderRef: admin.firestore.DocumentReference,
): Promise<ProcessPaymentResult> {
  const accessToken = functions.config().mercadopago?.token;
  if (!accessToken) throw new Error('Token MercadoPago não configurado.');

  const client = new MercadoPagoConfig({ accessToken });
  const preference = new Preference(client);

  const mpItems = order.items.map((item: {
    name: string; price: number; qty: number;
  }) => ({
    id: data.orderId,
    title: item.name,
    unit_price: item.price,
    quantity: item.qty,
    currency_id: 'BRL',
  }));

  const result = await preference.create({
    body: {
      items: mpItems,
      external_reference: data.orderId,
      // Configure as URLs de retorno no Firebase Remote Config ou aqui
      back_urls: {
        success: `meusabor://checkout/success?orderId=${data.orderId}`,
        failure: `meusabor://checkout/failure?orderId=${data.orderId}`,
        pending: `meusabor://checkout/pending?orderId=${data.orderId}`,
      },
      auto_return: 'approved',
      statement_descriptor: 'Meu Sabor Express',
    },
  });

  const preferenceId = result.id ?? '';
  const redirectUrl = result.init_point ?? '';

  await orderRef.update({
    paymentId: preferenceId,
    paymentUrl: redirectUrl,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return {
    success: true,
    paymentId: preferenceId,
    redirectUrl,
  };
}

import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { PaymentIntent, PaymentResult } from '../types/payment';
import { initMercadoPagoPayment } from './paymentGateways/mercadopago';
import { initStripePayment } from './paymentGateways/stripe';

const ORDERS_COLLECTION = 'pedidos';

// ─── Orquestrador de pagamentos ───────────────────────────────────────────────

/**
 * Ponto de entrada único para iniciar um pagamento.
 * Roteia para o gateway correto baseado no `provider` da intent.
 *
 * Para pagamento em dinheiro, confirma o pedido diretamente sem chamar gateway.
 */
export async function initiatePayment(intent: PaymentIntent): Promise<PaymentResult> {
  if (intent.provider === 'cash') {
    return handleCashPayment(intent);
  }

  if (intent.provider === 'mercadopago') {
    return initMercadoPagoPayment(intent);
  }

  if (intent.provider === 'stripe') {
    return initStripePayment(intent);
  }

  return {
    success: false,
    provider: intent.provider,
    error: `Gateway "${intent.provider}" não suportado.`,
  };
}

// ─── Pagamento em dinheiro ────────────────────────────────────────────────────

async function handleCashPayment(intent: PaymentIntent): Promise<PaymentResult> {
  try {
    const ref = doc(db, ORDERS_COLLECTION, intent.orderId);
    await updateDoc(ref, {
      paymentStatus: 'pendente',
      status: 'em_preparo',
      paymentId: `cash_${Date.now()}`,
      updatedAt: serverTimestamp(),
    });

    return {
      success: true,
      provider: 'cash',
      paymentId: `cash_${intent.orderId}`,
    };
  } catch (error: any) {
    return {
      success: false,
      provider: 'cash',
      error: error?.message ?? 'Erro ao confirmar pedido em dinheiro.',
    };
  }
}

// ─── Confirmar pagamento após retorno do gateway ──────────────────────────────

/**
 * Chamado após o usuário retornar da URL de pagamento (ex: MercadoPago Checkout Pro).
 * Atualiza o paymentId no pedido enquanto aguarda o webhook confirmar o status.
 */
export async function attachPaymentId(
  orderId: string,
  paymentId: string,
  paymentUrl?: string,
): Promise<void> {
  const ref = doc(db, ORDERS_COLLECTION, orderId);
  await updateDoc(ref, {
    paymentId,
    ...(paymentUrl ? { paymentUrl } : {}),
    updatedAt: serverTimestamp(),
  });
}

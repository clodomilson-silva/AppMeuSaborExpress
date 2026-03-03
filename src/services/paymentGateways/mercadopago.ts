import { getFunctions, httpsCallable } from 'firebase/functions';
import { PaymentIntent, PaymentResult } from '../../types/payment';

/**
 * Adaptador MercadoPago.
 *
 * Chama a Cloud Function `processPayment` com provider `mercadopago`.
 * A Cloud Function usa a chave secreta do MercadoPago para criar uma
 * "preference" no Checkout Pro e retorna a URL de pagamento.
 *
 * O app abre essa URL via `Linking.openURL` ou WebView, e o MercadoPago
 * notifica o backend via webhook quando o pagamento for concluído.
 */
export async function initMercadoPagoPayment(
  intent: PaymentIntent,
): Promise<PaymentResult> {
  try {
    const functions = getFunctions();
    const processPayment = httpsCallable<PaymentIntent, PaymentResult>(
      functions,
      'processPayment',
    );

    const response = await processPayment({ ...intent, provider: 'mercadopago' });
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      provider: 'mercadopago',
      error: error?.message ?? 'Erro ao iniciar pagamento com MercadoPago.',
    };
  }
}

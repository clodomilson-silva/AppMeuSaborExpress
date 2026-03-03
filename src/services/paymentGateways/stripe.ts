import { getFunctions, httpsCallable } from 'firebase/functions';
import { PaymentIntent, PaymentResult } from '../../types/payment';

/**
 * Adaptador Stripe.
 *
 * Chama a Cloud Function `processPayment` com provider `stripe`.
 * A Cloud Function cria um PaymentIntent no Stripe usando a chave secreta
 * e retorna o `clientSecret` para o app confirmar o pagamento localmente
 * usando `@stripe/stripe-react-native` (confirmPayment).
 *
 * Instalar SDK Stripe quando necessário:
 *   npx expo install @stripe/stripe-react-native
 *   E configurar o StripeProvider no App.tsx com a chave pública.
 */
export async function initStripePayment(
  intent: PaymentIntent,
): Promise<PaymentResult> {
  try {
    const functions = getFunctions();
    const processPayment = httpsCallable<PaymentIntent, PaymentResult>(
      functions,
      'processPayment',
    );

    const response = await processPayment({ ...intent, provider: 'stripe' });
    return response.data;
  } catch (error: any) {
    return {
      success: false,
      provider: 'stripe',
      error: error?.message ?? 'Erro ao iniciar pagamento com Stripe.',
    };
  }
}

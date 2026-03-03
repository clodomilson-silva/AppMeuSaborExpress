// ─── Provider de pagamento ───────────────────────────────────────────────────

export type PaymentProvider = 'mercadopago' | 'stripe' | 'cash';

// ─── Método de pagamento ─────────────────────────────────────────────────────

export type PaymentMethodType =
  | 'credit_card'
  | 'debit_card'
  | 'pix'
  | 'boleto'
  | 'cash';

export interface PaymentMethod {
  provider: PaymentProvider;
  type: PaymentMethodType;
  /** Label amigável exibido na UI */
  label: string;
}

// ─── Métodos disponíveis no app ───────────────────────────────────────────────

export const AVAILABLE_PAYMENT_METHODS: PaymentMethod[] = [
  {
    provider: 'mercadopago',
    type: 'pix',
    label: 'Pix (MercadoPago)',
  },
  {
    provider: 'mercadopago',
    type: 'credit_card',
    label: 'Cartão de Crédito (MercadoPago)',
  },
  {
    provider: 'mercadopago',
    type: 'boleto',
    label: 'Boleto Bancário',
  },
  {
    provider: 'stripe',
    type: 'credit_card',
    label: 'Cartão Internacional (Stripe)',
  },
  {
    provider: 'cash',
    type: 'cash',
    label: 'Dinheiro na entrega',
  },
];

// ─── Intenção de pagamento ────────────────────────────────────────────────────

export interface PaymentIntent {
  orderId: string;
  amount: number; // em centavos
  provider: PaymentProvider;
  paymentMethodType: PaymentMethodType;
}

// ─── Resultado do pagamento ───────────────────────────────────────────────────

export interface PaymentResult {
  success: boolean;
  provider: PaymentProvider;
  /** ID da transação no gateway */
  paymentId?: string;
  /** URL para redirecionar o usuário (ex: MercadoPago Checkout Pro) */
  redirectUrl?: string;
  /** Client secret do Stripe para confirmar no app */
  clientSecret?: string;
  /** Mensagem de erro, se houver */
  error?: string;
}

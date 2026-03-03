import { Timestamp } from 'firebase/firestore';
import { PaymentMethod } from './payment';

// ─── Status do Pedido ─────────────────────────────────────────────────────────

export type OrderStatus =
  | 'pendente_pagamento'
  | 'pago'
  | 'em_preparo'
  | 'a_caminho'
  | 'entregue'
  | 'cancelado';

export type PaymentStatus = 'pendente' | 'aprovado' | 'recusado' | 'reembolsado';

// ─── Pipeline de status para exibição ────────────────────────────────────────

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pendente_pagamento: 'Aguardando Pagamento',
  pago: 'Pagamento Confirmado',
  em_preparo: 'Em Preparo',
  a_caminho: 'A Caminho',
  entregue: 'Entregue',
  cancelado: 'Cancelado',
};

export const ORDER_STATUS_PIPELINE: OrderStatus[] = [
  'pendente_pagamento',
  'pago',
  'em_preparo',
  'a_caminho',
  'entregue',
];

// ─── Item do Pedido ──────────────────────────────────────────────────────────

export interface OrderItemAddon {
  id: string;
  name: string;
  price: number;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  addons: OrderItemAddon[];
  observations?: string;
}

// ─── Endereço de entrega ─────────────────────────────────────────────────────

export interface DeliveryAddress {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  reference?: string;
}

// ─── Pedido ──────────────────────────────────────────────────────────────────

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  deliveryFee: number;
  deliveryAddress?: DeliveryAddress;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  /** ID da transação no gateway (ex: payment_intent do Stripe, preference_id do MP) */
  paymentId?: string;
  /** URL de checkout retornada pelo gateway (ex: MercadoPago Checkout Pro) */
  paymentUrl?: string;
  status: OrderStatus;
  estimatedDeliveryMinutes?: number;
  notes?: string;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}

// ─── Payload para criação ─────────────────────────────────────────────────────

export type CreateOrderPayload = Omit<
  Order,
  'id' | 'status' | 'paymentStatus' | 'paymentId' | 'paymentUrl' | 'createdAt' | 'updatedAt'
>;

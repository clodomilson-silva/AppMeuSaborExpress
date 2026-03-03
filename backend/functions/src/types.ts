/**
 * Tipos compartilhados entre Cloud Functions.
 * Espelham os tipos do app mobile (src/types/) sem dependência cruzada.
 */

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

export interface PaymentMethod {
  provider: 'mercadopago' | 'stripe' | 'cash';
  type: string;
  label: string;
}

export interface CreateOrderPayload {
  items: OrderItem[];
  total: number;
  deliveryFee: number;
  deliveryAddress?: DeliveryAddress;
  paymentMethod: PaymentMethod;
}

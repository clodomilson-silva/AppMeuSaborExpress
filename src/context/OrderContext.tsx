import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { Order } from '../types/order';
import { subscribeToUserOrders } from '../services/orderService';
import { useAuth } from './AuthContext';

// ─── Tipos ───────────────────────────────────────────────────────────────────

interface OrderContextData {
  orders: Order[];
  /** Pedido mais recente que ainda não foi entregue ou cancelado */
  activeOrder: Order | null;
  loading: boolean;
}

// ─── Context ─────────────────────────────────────────────────────────────────

const OrderContext = createContext<OrderContextData>({
  orders: [],
  activeOrder: null,
  loading: true,
});

// ─── Provider ─────────────────────────────────────────────────────────────────

export function OrderProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setOrders([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeToUserOrders(user.uid, (fetchedOrders) => {
      setOrders(fetchedOrders);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  const activeOrder =
    orders.find(
      (o) => o.status !== 'entregue' && o.status !== 'cancelado',
    ) ?? null;

  return (
    <OrderContext.Provider value={{ orders, activeOrder, loading }}>
      {children}
    </OrderContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useOrders() {
  return useContext(OrderContext);
}

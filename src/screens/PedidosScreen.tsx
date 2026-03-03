import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Timestamp } from 'firebase/firestore';
import { Colors, FontSize, FontWeight, Radius, Spacing } from '../theme';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Order, OrderStatus, ORDER_STATUS_LABELS, ORDER_STATUS_PIPELINE } from '../types/order';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_COLOR: Record<OrderStatus, string> = {
  pendente_pagamento: '#FFA726',
  pago: '#2196F3',
  em_preparo: '#FFC107',
  a_caminho: Colors.primary,
  entregue: '#4CAF50',
  cancelado: '#F44336',
};

const PAYMENT_STATUS_LABEL: Record<string, string> = {
  pendente: '⏳ Pagamento pendente',
  aprovado: '✅ Pago',
  recusado: '❌ Pagamento recusado',
  reembolsado: '↩️ Reembolsado',
};

const formatDate = (ts: Timestamp | null): string => {
  if (!ts) return '—';
  const d = ts.toDate();
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
};

// ─── Barra de progresso de status ────────────────────────────────────────────

function StatusPipeline({ status }: { status: OrderStatus }) {
  if (status === 'cancelado') {
    return (
      <View style={pipeStyles.cancelRow}>
        <Ionicons name="close-circle" size={14} color={STATUS_COLOR.cancelado} />
        <Text style={[pipeStyles.cancelText, { color: STATUS_COLOR.cancelado }]}>
          Pedido cancelado
        </Text>
      </View>
    );
  }
  const currentIdx = ORDER_STATUS_PIPELINE.indexOf(status);
  return (
    <View style={pipeStyles.row}>
      {ORDER_STATUS_PIPELINE.map((s, idx) => {
        const isCompleted = idx <= currentIdx;
        const isActive = idx === currentIdx;
        return (
          <React.Fragment key={s}>
            <View style={pipeStyles.step}>
              <View
                style={[
                  pipeStyles.dot,
                  isCompleted && { backgroundColor: STATUS_COLOR[status] },
                  isActive && pipeStyles.dotActive,
                ]}
              />
              <Text
                style={[
                  pipeStyles.label,
                  isActive && { color: STATUS_COLOR[status], fontWeight: FontWeight.bold },
                ]}
                numberOfLines={1}
              >
                {ORDER_STATUS_LABELS[s].split(' ')[0]}
              </Text>
            </View>
            {idx < ORDER_STATUS_PIPELINE.length - 1 && (
              <View
                style={[
                  pipeStyles.line,
                  idx < currentIdx && { backgroundColor: STATUS_COLOR[status] },
                ]}
              />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
}

const pipeStyles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start', marginVertical: Spacing.sm },
  step: { alignItems: 'center', width: 48 },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.border,
    marginBottom: 3,
  },
  dotActive: { width: 12, height: 12, borderRadius: 6 },
  label: { fontSize: 9, color: Colors.textMuted, textAlign: 'center' },
  line: { flex: 1, height: 1.5, backgroundColor: Colors.border, marginBottom: 10 },
  cancelRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginVertical: Spacing.sm },
  cancelText: { fontSize: FontSize.xs, fontWeight: FontWeight.medium },
});

// ─── Card de pedido ───────────────────────────────────────────────────────────

function OrderCard({ order }: { order: Order }) {
  const color = STATUS_COLOR[order.status] ?? Colors.primary;
  return (
    <View style={styles.orderCard}>
      {/* Cabeçalho */}
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>Pedido #{order.id.slice(-6).toUpperCase()}</Text>
        <View style={[styles.statusBadge, { backgroundColor: color + '22' }]}>
          <View style={[styles.statusDot, { backgroundColor: color }]} />
          <Text style={[styles.statusText, { color }]}>
            {ORDER_STATUS_LABELS[order.status]}
          </Text>
        </View>
      </View>

      <Text style={styles.orderDate}>{formatDate(order.createdAt)}</Text>

      {/* Pipeline visual de status */}
      <StatusPipeline status={order.status} />

      {/* Itens */}
      {order.items.map((item, i) => (
        <Text key={i} style={styles.orderItem}>
          • {item.qty}x {item.name}
        </Text>
      ))}

      {/* Rodapé */}
      <View style={styles.orderFooter}>
        <View>
          <Text style={styles.paymentStatusText}>
            {PAYMENT_STATUS_LABEL[order.paymentStatus] ?? ''}
          </Text>
          <Text style={styles.paymentMethodText}>
            {order.paymentMethod?.label ?? ''}
          </Text>
        </View>
        <Text style={styles.totalValue}>
          R$ {order.total.toFixed(2).replace('.', ',')}
        </Text>
      </View>
    </View>
  );
}

// ─── Tela principal ───────────────────────────────────────────────────────────

export default function PedidosScreen() {
  const tabBarHeight = useBottomTabBarHeight();
  const navigation = useNavigation<NavProp>();
  const { user } = useAuth();
  const { orders, loading } = useOrders();

  // ── Sem login ──────────────────────────────────────────────────────────────
  if (!user) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
        <View style={styles.header}>
          <Text style={styles.title}>Meus Pedidos</Text>
        </View>
        <View style={styles.emptyContainer}>
          <View style={styles.iconWrapper}>
            <Ionicons name="lock-closed-outline" size={48} color={Colors.textMuted} />
          </View>
          <Text style={styles.emptyTitle}>Faça login para ver seus pedidos</Text>
          <Text style={styles.emptySubtitle}>
            Seus pedidos ficam salvos na sua conta e podem ser acessados a qualquer momento.
          </Text>
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={() => navigation.navigate('Login')}
          >
            <Ionicons name="log-in-outline" size={18} color={Colors.white} />
            <Text style={styles.loginBtnText}>Entrar na conta</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.registerLink}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.registerLinkText}>Não tem conta? Cadastre-se</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  // ── Sem pedidos ────────────────────────────────────────────────────────────
  if (orders.length === 0) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
        <View style={styles.header}>
          <Text style={styles.title}>Meus Pedidos</Text>
        </View>
        <View style={styles.emptyContainer}>
          <View style={styles.iconWrapper}>
            <Ionicons name="receipt-outline" size={48} color={Colors.textMuted} />
          </View>
          <Text style={styles.emptyTitle}>Nenhum pedido ainda</Text>
          <Text style={styles.emptySubtitle}>
            Seus pedidos aparecerão aqui após a confirmação.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // ── Lista de pedidos ───────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <View style={styles.header}>
        <Text style={styles.title}>Meus Pedidos</Text>
      </View>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.list, { paddingBottom: tabBarHeight + Spacing.md }]}
        renderItem={({ item }) => <OrderCard order={item} />}
      />
    </SafeAreaView>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xxxl,
  },
  iconWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.backgroundCard,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  emptyTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.xxl,
  },
  loginBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xxxl,
    paddingVertical: Spacing.md,
    borderRadius: Radius.full,
    marginBottom: Spacing.md,
  },
  loginBtnText: { color: Colors.white, fontWeight: FontWeight.bold, fontSize: FontSize.md },
  registerLink: { paddingVertical: Spacing.sm },
  registerLinkText: {
    color: Colors.primaryLight,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
  },
  list: { padding: Spacing.lg, gap: Spacing.md },

  // Order card
  orderCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    gap: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  orderId: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.full,
    gap: 5,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: FontSize.xs, fontWeight: FontWeight.semiBold },
  orderDate: { fontSize: FontSize.xs, color: Colors.textMuted, marginBottom: Spacing.xs },
  orderItem: { fontSize: FontSize.sm, color: Colors.textSecondary },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: Spacing.md,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  paymentStatusText: { fontSize: FontSize.xs, color: Colors.textSecondary },
  paymentMethodText: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 1 },
  totalValue: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.primary },
});

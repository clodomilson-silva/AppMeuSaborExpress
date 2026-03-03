import React from 'react';
import {
  View, Text, FlatList, StyleSheet, StatusBar, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useOrders } from '../context/OrderContext';
import { ORDER_STATUS_LABELS, OrderStatus } from '../types/order';
import { Colors, FontSize, FontWeight, Radius, Spacing } from '../theme';

const STATUS_COLORS: Record<OrderStatus, string> = {
  pendente_pagamento: '#FF9800',
  pago: '#2196F3',
  em_preparo: '#9C27B0',
  a_caminho: '#03A9F4',
  entregue: '#4CAF50',
  cancelado: '#F44336',
};

function formatDate(ts: any): string {
  if (!ts) return '—';
  try {
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch {
    return '—';
  }
}

export default function HistoricoPedidosScreen() {
  const navigation = useNavigation();
  const { orders, loading } = useOrders();

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Histórico de Pedidos</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={Colors.primary} size="large" />
        </View>
      ) : orders.length === 0 ? (
        <View style={styles.center}>
          <Ionicons name="receipt-outline" size={56} color={Colors.textMuted} />
          <Text style={styles.emptyTitle}>Nenhum pedido ainda</Text>
          <Text style={styles.emptySubtitle}>Seus pedidos aparecerão aqui após a primeira compra.</Text>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={{ height: Spacing.sm }} />}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.orderId}>Pedido #{item.id.slice(-6).toUpperCase()}</Text>
                <View style={[styles.badge, { backgroundColor: STATUS_COLORS[item.status] + '22' }]}>
                  <Text style={[styles.badgeText, { color: STATUS_COLORS[item.status] }]}>
                    {ORDER_STATUS_LABELS[item.status]}
                  </Text>
                </View>
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.itemCount}>{item.items.length} item(s)</Text>
                <Text style={styles.date}>{formatDate(item.createdAt)}</Text>
              </View>
              <View style={styles.cardFooter}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>
                  R$ {item.total.toFixed(2).replace('.', ',')}
                </Text>
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: Radius.md,
    backgroundColor: Colors.backgroundCard,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: Colors.border,
  },
  headerTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: Spacing.xl },
  emptyTitle: {
    fontSize: FontSize.lg, fontWeight: FontWeight.bold,
    color: Colors.textPrimary, marginTop: Spacing.md,
  },
  emptySubtitle: {
    fontSize: FontSize.sm, color: Colors.textSecondary,
    textAlign: 'center', marginTop: Spacing.sm, lineHeight: 20,
  },
  list: { padding: Spacing.lg },
  card: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: Radius.lg, padding: Spacing.lg,
    borderWidth: 1, borderColor: Colors.border,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  orderId: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.textPrimary, fontFamily: 'monospace' },
  badge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20 },
  badgeText: { fontSize: FontSize.xs, fontWeight: FontWeight.bold },
  cardBody: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.sm },
  itemCount: { fontSize: FontSize.sm, color: Colors.textSecondary },
  date: { fontSize: FontSize.sm, color: Colors.textMuted },
  cardFooter: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderTopWidth: 1, borderTopColor: Colors.border, paddingTop: Spacing.sm,
  },
  totalLabel: { fontSize: FontSize.sm, color: Colors.textSecondary },
  totalValue: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.primary },
});

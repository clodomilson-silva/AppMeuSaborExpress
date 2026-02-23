import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { Colors, FontSize, FontWeight, Radius, Spacing } from '../theme';

interface Order {
  id: string;
  date: string;
  items: string[];
  total: number;
  status: 'Entregue' | 'Em preparo' | 'A caminho';
}

const mockOrders: Order[] = [
  {
    id: '#2498',
    date: '23 Fev 2026',
    items: ['Smash Burger Duplo', 'Coca-Cola 350ml'],
    total: 40.80,
    status: 'Entregue',
  },
  {
    id: '#2491',
    date: '21 Fev 2026',
    items: ['Combo Smash', 'Milkshake Ovomaltine'],
    total: 65.80,
    status: 'Entregue',
  },
];

const statusColor = (status: Order['status']) => {
  if (status === 'Entregue') return '#4CAF50';
  if (status === 'Em preparo') return '#FFC107';
  return Colors.primary;
};

export default function PedidosScreen() {
  const tabBarHeight = useBottomTabBarHeight();

  if (mockOrders.length === 0) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.header}>
          <Text style={styles.title}>Meus Pedidos</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Ionicons name="receipt-outline" size={64} color={Colors.textMuted} />
          <Text style={styles.emptyTitle}>Nenhum pedido ainda</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <View style={styles.header}>
        <Text style={styles.title}>Meus Pedidos</Text>
      </View>
      <FlatList
        data={mockOrders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.list, { paddingBottom: tabBarHeight + Spacing.md }]}
        renderItem={({ item }) => (
          <View style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <Text style={styles.orderId}>Pedido {item.id}</Text>
              <View style={[styles.statusBadge, { backgroundColor: statusColor(item.status) + '22' }]}>
                <View style={[styles.statusDot, { backgroundColor: statusColor(item.status) }]} />
                <Text style={[styles.statusText, { color: statusColor(item.status) }]}>
                  {item.status}
                </Text>
              </View>
            </View>
            <Text style={styles.orderDate}>{item.date}</Text>
            {item.items.map((name, i) => (
              <Text key={i} style={styles.orderItem}>• {name}</Text>
            ))}
            <View style={styles.orderFooter}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>R$ {item.total.toFixed(2).replace('.', ',')}</Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
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
  list: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  orderCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    gap: Spacing.xs,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  orderId: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.full,
    gap: 5,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semiBold,
  },
  orderDate: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginBottom: Spacing.xs,
  },
  orderItem: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.md,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  totalLabel: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    fontWeight: FontWeight.medium,
  },
  totalValue: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  emptyTitle: {
    fontSize: FontSize.lg,
    color: Colors.textMuted,
  },
});

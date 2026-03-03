import React from 'react';
import {
  View, Text, StyleSheet, StatusBar, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors, FontSize, FontWeight, Radius, Spacing } from '../theme';

export default function PagamentosScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pagamento</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.center}>
        <View style={styles.iconBg}>
          <Ionicons name="card-outline" size={48} color={Colors.primary} />
        </View>
        <Text style={styles.emptyTitle}>Nenhum pagamento realizado</Text>
        <Text style={styles.emptySubtitle}>
          O histórico de pagamentos aparece aqui após a conclusão de pedidos.
        </Text>

        {/* Métodos aceitos */}
        <View style={styles.methodsCard}>
          <Text style={styles.methodsTitle}>Métodos aceitos</Text>
          {[
            { icon: 'logo-paypal', label: 'Pix (MercadoPago)' },
            { icon: 'card', label: 'Cartão de Crédito / Débito' },
            { icon: 'document-text-outline', label: 'Boleto Bancário' },
            { icon: 'cash-outline', label: 'Dinheiro na entrega' },
          ].map((m) => (
            <View key={m.label} style={styles.methodRow}>
              <Ionicons name={m.icon as any} size={20} color={Colors.primary} />
              <Text style={styles.methodLabel}>{m.label}</Text>
            </View>
          ))}
        </View>
      </View>
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
  iconBg: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: Colors.backgroundCard,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.xl,
  },
  emptyTitle: {
    fontSize: FontSize.lg, fontWeight: FontWeight.bold,
    color: Colors.textPrimary, textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: FontSize.sm, color: Colors.textSecondary,
    textAlign: 'center', marginTop: Spacing.sm, lineHeight: 20,
  },
  methodsCard: {
    marginTop: Spacing.xl, width: '100%',
    backgroundColor: Colors.backgroundCard,
    borderRadius: Radius.lg, padding: Spacing.lg,
    borderWidth: 1, borderColor: Colors.border,
  },
  methodsTitle: {
    fontSize: FontSize.md, fontWeight: FontWeight.bold,
    color: Colors.textPrimary, marginBottom: Spacing.md,
  },
  methodRow: {
    flexDirection: 'row', alignItems: 'center',
    gap: Spacing.md, paddingVertical: Spacing.sm,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  methodLabel: { fontSize: FontSize.md, color: Colors.textPrimary },
});

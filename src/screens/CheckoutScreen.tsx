import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Alert,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Colors, FontSize, FontWeight, Radius, Spacing } from '../theme';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { RootStackParamList } from '../navigation/AppNavigator';
import { createOrder } from '../services/orderService';
import { initiatePayment } from '../services/paymentService';
import { attachPaymentId } from '../services/paymentService';
import {
  AVAILABLE_PAYMENT_METHODS,
  PaymentMethod,
} from '../types/payment';
import { DeliveryAddress } from '../types/order';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

// ─── Etapas ──────────────────────────────────────────────────────────────────

type Step = 'address' | 'payment' | 'summary';

const STEPS: { key: Step; label: string; icon: string }[] = [
  { key: 'address', label: 'Endereço', icon: 'location-outline' },
  { key: 'payment', label: 'Pagamento', icon: 'card-outline' },
  { key: 'summary', label: 'Resumo', icon: 'checkmark-circle-outline' },
];

// ─── Ícones por método de pagamento ──────────────────────────────────────────

const PAYMENT_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  pix: 'flash-outline',
  credit_card: 'card-outline',
  debit_card: 'card-outline',
  boleto: 'document-text-outline',
  cash: 'cash-outline',
};

// ─── Componente ───────────────────────────────────────────────────────────────

export default function CheckoutScreen() {
  const navigation = useNavigation<NavProp>();
  const { user } = useAuth();
  const { items, total, clearCart } = useCart();

  // Etapa atual
  const [step, setStep] = useState<Step>('address');

  // Endereço
  const [address, setAddress] = useState<DeliveryAddress>({
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: '',
    reference: '',
  });

  // Método de pagamento
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);

  // Estado geral
  const [loading, setLoading] = useState(false);

  // ── Validações ──────────────────────────────────────────────────────────────

  const isAddressValid =
    address.street.trim().length > 0 &&
    address.number.trim().length > 0 &&
    address.neighborhood.trim().length > 0 &&
    address.city.trim().length > 0;

  // ── Helpers ─────────────────────────────────────────────────────────────────

  function goToStep(next: Step) {
    if (next === 'payment' && !isAddressValid) {
      Alert.alert('Endereço incompleto', 'Preencha rua, número, bairro e cidade.');
      return;
    }
    if (next === 'summary' && !selectedMethod) {
      Alert.alert('Método de pagamento', 'Selecione como deseja pagar.');
      return;
    }
    setStep(next);
  }

  // ── Finalizar pedido ────────────────────────────────────────────────────────

  async function handlePlaceOrder() {
    if (!user || !selectedMethod) return;

    setLoading(true);
    try {
      // 1. Criar pedido no Firestore
      const orderId = await createOrder({
        userId: user.uid,
        items: items.map((i) => ({
          id: i.product.id,
          name: i.product.name,
          price: i.product.price,
          qty: i.qty,
          addons: i.addons.map((a) => ({ id: a.id, name: a.name, price: a.price })),
          observations: i.observations ?? '',
        })),
        total,
        deliveryFee: 0, // ajuste conforme regra de negócio
        deliveryAddress: address,
        paymentMethod: selectedMethod,
      });

      // 2. Iniciar pagamento
      const result = await initiatePayment({
        orderId,
        amount: Math.round(total * 100), // em centavos
        provider: selectedMethod.provider,
        paymentMethodType: selectedMethod.type,
      });

      if (!result.success) {
        Alert.alert('Erro no pagamento', result.error ?? 'Tente novamente.');
        setLoading(false);
        return;
      }

      // 3. Associar paymentId ao pedido (se retornado)
      if (result.paymentId) {
        await attachPaymentId(orderId, result.paymentId, result.redirectUrl);
      }

      // 4. Redirecionar para gateway (MercadoPago Checkout Pro, etc.)
      if (result.redirectUrl) {
        await Linking.openURL(result.redirectUrl);
      }

      // 5. Limpar carrinho e navegar para pedidos
      clearCart();
      Alert.alert(
        selectedMethod.provider === 'cash'
          ? '✅ Pedido confirmado!'
          : '🔗 Redirecionando para pagamento...',
        selectedMethod.provider === 'cash'
          ? 'Seu pedido foi recebido e está sendo preparado.'
          : 'Complete o pagamento e acompanhe o status do pedido.',
        [
          {
            text: 'Ver Pedidos',
            onPress: () => navigation.navigate('MainTabs'),
          },
        ],
      );
    } catch (e: any) {
      console.error('Erro ao finalizar pedido:', e);
      Alert.alert('Erro', 'Não foi possível processar o pedido. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  // ── Render ───────────────────────────────────────────────────────────────────

  const currentStepIndex = STEPS.findIndex((s) => s.key === step);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>Checkout</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Stepper */}
      <View style={styles.stepper}>
        {STEPS.map((s, idx) => {
          const isCompleted = idx < currentStepIndex;
          const isActive = idx === currentStepIndex;
          return (
            <React.Fragment key={s.key}>
              <View style={styles.stepItem}>
                <View
                  style={[
                    styles.stepCircle,
                    isCompleted && styles.stepCircleCompleted,
                    isActive && styles.stepCircleActive,
                  ]}
                >
                  {isCompleted ? (
                    <Ionicons name="checkmark" size={14} color={Colors.white} />
                  ) : (
                    <Ionicons
                      name={s.icon as keyof typeof Ionicons.glyphMap}
                      size={14}
                      color={isActive ? Colors.white : Colors.textMuted}
                    />
                  )}
                </View>
                <Text
                  style={[
                    styles.stepLabel,
                    isActive && styles.stepLabelActive,
                    isCompleted && styles.stepLabelCompleted,
                  ]}
                >
                  {s.label}
                </Text>
              </View>
              {idx < STEPS.length - 1 && (
                <View
                  style={[
                    styles.stepLine,
                    isCompleted && styles.stepLineCompleted,
                  ]}
                />
              )}
            </React.Fragment>
          );
        })}
      </View>

      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── ETAPA 1: Endereço ───────────────────────────────────────────── */}
        {step === 'address' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Endereço de entrega</Text>

            <View style={styles.inputRow}>
              <View style={[styles.inputGroup, { flex: 2 }]}>
                <Text style={styles.inputLabel}>Rua / Av.*</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Nome da rua"
                  placeholderTextColor={Colors.textMuted}
                  value={address.street}
                  onChangeText={(t) => setAddress((a) => ({ ...a, street: t }))}
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>Nº*</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: 123"
                  placeholderTextColor={Colors.textMuted}
                  value={address.number}
                  onChangeText={(t) => setAddress((a) => ({ ...a, number: t }))}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Complemento</Text>
              <TextInput
                style={styles.input}
                placeholder="Apto, bloco, casa..."
                placeholderTextColor={Colors.textMuted}
                value={address.complement}
                onChangeText={(t) => setAddress((a) => ({ ...a, complement: t }))}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Bairro*</Text>
              <TextInput
                style={styles.input}
                placeholder="Seu bairro"
                placeholderTextColor={Colors.textMuted}
                value={address.neighborhood}
                onChangeText={(t) => setAddress((a) => ({ ...a, neighborhood: t }))}
              />
            </View>

            <View style={styles.inputRow}>
              <View style={[styles.inputGroup, { flex: 2 }]}>
                <Text style={styles.inputLabel}>Cidade*</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Sua cidade"
                  placeholderTextColor={Colors.textMuted}
                  value={address.city}
                  onChangeText={(t) => setAddress((a) => ({ ...a, city: t }))}
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>UF</Text>
                <TextInput
                  style={styles.input}
                  placeholder="SP"
                  placeholderTextColor={Colors.textMuted}
                  value={address.state}
                  onChangeText={(t) => setAddress((a) => ({ ...a, state: t.toUpperCase() }))}
                  maxLength={2}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Ponto de referência</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: próximo à farmácia"
                placeholderTextColor={Colors.textMuted}
                value={address.reference}
                onChangeText={(t) => setAddress((a) => ({ ...a, reference: t }))}
              />
            </View>
          </View>
        )}

        {/* ── ETAPA 2: Método de pagamento ───────────────────────────────── */}
        {step === 'payment' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Como deseja pagar?</Text>
            {AVAILABLE_PAYMENT_METHODS.map((method) => {
              const isSelected =
                selectedMethod?.provider === method.provider &&
                selectedMethod?.type === method.type;
              return (
                <TouchableOpacity
                  key={`${method.provider}_${method.type}`}
                  style={[styles.methodCard, isSelected && styles.methodCardSelected]}
                  onPress={() => setSelectedMethod(method)}
                  activeOpacity={0.8}
                >
                  <View
                    style={[
                      styles.methodIcon,
                      isSelected && styles.methodIconSelected,
                    ]}
                  >
                    <Ionicons
                      name={PAYMENT_ICONS[method.type] ?? 'card-outline'}
                      size={20}
                      color={isSelected ? Colors.white : Colors.textSecondary}
                    />
                  </View>
                  <View style={styles.methodInfo}>
                    <Text
                      style={[
                        styles.methodLabel,
                        isSelected && styles.methodLabelSelected,
                      ]}
                    >
                      {method.label}
                    </Text>
                    <Text style={styles.methodProvider}>
                      via {method.provider === 'cash' ? 'entregador' : method.provider}
                    </Text>
                  </View>
                  {isSelected && (
                    <Ionicons name="checkmark-circle" size={22} color={Colors.primary} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* ── ETAPA 3: Resumo ─────────────────────────────────────────────── */}
        {step === 'summary' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Resumo do pedido</Text>

            {/* Itens */}
            <View style={styles.summaryCard}>
              <Text style={styles.summaryCardTitle}>🛍 Itens</Text>
              {items.map((item) => (
                <View key={item.product.id} style={styles.summaryRow}>
                  <Text style={styles.summaryItemName}>
                    {item.qty}x {item.product.name}
                  </Text>
                  <Text style={styles.summaryItemPrice}>
                    R${' '}
                    {(
                      (item.product.price +
                        item.addons.reduce((s, a) => s + a.price, 0)) *
                      item.qty
                    )
                      .toFixed(2)
                      .replace('.', ',')}
                  </Text>
                </View>
              ))}
              <View style={[styles.summaryRow, styles.summaryTotal]}>
                <Text style={styles.summaryTotalLabel}>Total</Text>
                <Text style={styles.summaryTotalValue}>
                  R$ {total.toFixed(2).replace('.', ',')}
                </Text>
              </View>
            </View>

            {/* Endereço */}
            <View style={styles.summaryCard}>
              <Text style={styles.summaryCardTitle}>📍 Entrega</Text>
              <Text style={styles.summaryText}>
                {address.street}, {address.number}
                {address.complement ? ` — ${address.complement}` : ''}
              </Text>
              <Text style={styles.summaryText}>
                {address.neighborhood}, {address.city} {address.state}
              </Text>
              {address.reference ? (
                <Text style={styles.summaryTextMuted}>Ref: {address.reference}</Text>
              ) : null}
            </View>

            {/* Pagamento */}
            <View style={styles.summaryCard}>
              <Text style={styles.summaryCardTitle}>💳 Pagamento</Text>
              <Text style={styles.summaryText}>{selectedMethod?.label}</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Barra de ação */}
      <View style={styles.actionBar}>
        {step !== 'address' && (
          <TouchableOpacity
            style={styles.backStepBtn}
            onPress={() =>
              setStep(step === 'summary' ? 'payment' : 'address')
            }
          >
            <Ionicons name="arrow-back" size={18} color={Colors.textSecondary} />
            <Text style={styles.backStepText}>Voltar</Text>
          </TouchableOpacity>
        )}

        {step !== 'summary' ? (
          <TouchableOpacity
            style={[styles.nextBtn, !isAddressValid && step === 'address' && styles.nextBtnDisabled]}
            onPress={() =>
              goToStep(step === 'address' ? 'payment' : 'summary')
            }
            activeOpacity={0.85}
          >
            <Text style={styles.nextBtnText}>Continuar</Text>
            <Ionicons name="arrow-forward" size={18} color={Colors.white} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.nextBtn, loading && styles.nextBtnDisabled]}
            onPress={handlePlaceOrder}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color={Colors.white} size="small" />
            ) : (
              <>
                <Ionicons name="checkmark-circle-outline" size={20} color={Colors.white} />
                <Text style={styles.nextBtnText}>
                  {selectedMethod?.provider === 'cash' ? 'Confirmar Pedido' : 'Ir para Pagamento'}
                </Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  flex: { flex: 1 },
  scrollContent: { paddingBottom: 32 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.backgroundCard,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },

  // Stepper
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    gap: 0,
  },
  stepItem: { alignItems: 'center', gap: 4 },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.backgroundCard,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  stepCircleCompleted: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  stepLabel: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    fontWeight: FontWeight.medium,
  },
  stepLabelActive: { color: Colors.primary, fontWeight: FontWeight.bold },
  stepLabelCompleted: { color: Colors.primary },
  stepLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
    marginBottom: 18,
    marginHorizontal: 4,
  },
  stepLineCompleted: { backgroundColor: Colors.primary },

  // Sections
  section: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg, gap: Spacing.sm },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },

  // Address Inputs
  inputRow: { flexDirection: 'row', gap: Spacing.sm },
  inputGroup: { gap: 6 },
  inputLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.textSecondary,
  },
  input: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
    height: 46,
  },

  // Payment methods
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.backgroundCard,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  methodCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '10',
  },
  methodIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.backgroundInput,
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodIconSelected: { backgroundColor: Colors.primary },
  methodInfo: { flex: 1 },
  methodLabel: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semiBold,
    color: Colors.textPrimary,
  },
  methodLabelSelected: { color: Colors.primary },
  methodProvider: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },

  // Summary cards
  summaryCard: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.sm,
  },
  summaryCardTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
  summaryItemName: { fontSize: FontSize.sm, color: Colors.textSecondary, flex: 1 },
  summaryItemPrice: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.textPrimary,
  },
  summaryTotal: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.sm,
    marginTop: Spacing.xs,
  },
  summaryTotalLabel: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  summaryTotalValue: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.extraBold,
    color: Colors.primary,
  },
  summaryText: { fontSize: FontSize.sm, color: Colors.textSecondary },
  summaryTextMuted: { fontSize: FontSize.xs, color: Colors.textMuted },

  // Action bar
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.background,
  },
  backStepBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  backStepText: { fontSize: FontSize.sm, color: Colors.textSecondary },
  nextBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    height: 52,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  nextBtnDisabled: { opacity: 0.6 },
  nextBtnText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },
});

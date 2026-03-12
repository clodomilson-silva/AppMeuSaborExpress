import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { Colors, FontSize, FontWeight, Radius, Spacing } from '../theme';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { RootStackParamList } from '../navigation/AppNavigator';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

export default function CarrinhoScreen() {
  const navigation = useNavigation<NavProp>();
  const tabBarHeight = useBottomTabBarHeight();
  const { user } = useAuth();
  const { items, total, updateQty, removeItem, clearCart } = useCart();

  const hasItems = items.length > 0;

  async function handleCheckout() {
    if (!user) {
      Alert.alert(
        'Login necessário',
        'Entre na sua conta para finalizar o pedido. Seus itens serão mantidos.',
        [
          { text: 'Agora não', style: 'cancel' },
          { text: 'Entrar', onPress: () => navigation.navigate('Login') },
        ],
      );
      return;
    }

    // Navega para o fluxo de checkout (endereço → pagamento → resumo)
    navigation.navigate('Checkout');
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Carrinho</Text>
        {hasItems && (
          <TouchableOpacity onPress={clearCart}>
            <Text style={styles.clearText}>Limpar</Text>
          </TouchableOpacity>
        )}
      </View>

      {hasItems ? (
        /* ---- Carrinho com itens ---- */
        <ScrollView
          style={styles.flex}
          contentContainerStyle={{ paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.itemList}>
            {items.map((item, idx) => (
              <View
                key={item.product.id}
                style={[styles.itemRow, idx < items.length - 1 && styles.itemBorder]}
              >
                {/* Info */}
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.product.name}</Text>
                  {item.addons.length > 0 && (
                    <Text style={styles.itemAddons}>
                      + {item.addons.map((a) => a.name).join(', ')}
                    </Text>
                  )}
                  <Text style={styles.itemPrice}>
                    R$ {((item.product.price + item.addons.reduce((s, a) => s + a.price, 0)) * item.qty)
                      .toFixed(2)
                      .replace('.', ',')}
                  </Text>
                </View>

                {/* Controles qty */}
                <View style={styles.qtyControls}>
                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => updateQty(item.product.id, item.qty - 1)}
                  >
                    <Ionicons
                      name={item.qty === 1 ? 'trash-outline' : 'remove'}
                      size={16}
                      color={item.qty === 1 ? Colors.error : Colors.textPrimary}
                    />
                  </TouchableOpacity>
                  <Text style={styles.qtyText}>{item.qty}</Text>
                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => updateQty(item.product.id, item.qty + 1)}
                  >
                    <Ionicons name="add" size={16} color={Colors.primary} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      ) : (
        /* ---- Carrinho vazio ---- */
        <View style={styles.emptyContainer}>
          <View style={styles.iconWrapper}>
            <Ionicons name="cart-outline" size={64} color={Colors.textMuted} />
          </View>
          <Text style={styles.emptyTitle}>Seu carrinho está vazio</Text>
          <Text style={styles.emptySubtitle}>
            Adicione itens do cardápio para continuar
          </Text>
          <TouchableOpacity
            style={styles.ctaBtn}
            onPress={() => navigation.navigate('MainTabs')}
          >
            <Ionicons name="restaurant-outline" size={18} color={Colors.white} />
            <Text style={styles.ctaBtnText}>Ver Cardápio</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ---- Rodapé de checkout ---- */}
      {hasItems && (
        <View style={[styles.checkoutBar, { paddingBottom: tabBarHeight + Spacing.md }]}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>
              R$ {total.toFixed(2).replace('.', ',')}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.checkoutBtn}
            onPress={handleCheckout}
            activeOpacity={0.85}
          >
            {user ? (
              <>
                <Ionicons name="checkmark-circle-outline" size={20} color={Colors.white} />
                <Text style={styles.checkoutBtnText}>Finalizar Pedido</Text>
              </>
            ) : (
              <>
                <Ionicons name="lock-closed-outline" size={20} color={Colors.white} />
                <Text style={styles.checkoutBtnText}>Entrar para Finalizar</Text>
              </>
            )}
          </TouchableOpacity>

          {!user && (
            <View style={styles.authNotice}>
              <Ionicons name="information-circle-outline" size={15} color={Colors.textMuted} />
              <Text style={styles.authNoticeText}>
                Você precisa estar logado para finalizar o pedido.{' '}
                <Text style={styles.authLink} onPress={() => navigation.navigate('Login')}>
                  Entrar
                </Text>{' '}
                ou{' '}
                <Text style={styles.authLink} onPress={() => navigation.navigate('Register')}>
                  Criar conta
                </Text>
              </Text>
            </View>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  flex: { flex: 1 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  clearText: {
    fontSize: FontSize.sm,
    color: Colors.error,
    fontWeight: FontWeight.medium,
  },

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
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.xxl,
  },
  ctaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.xxxl,
    paddingVertical: Spacing.md,
    borderRadius: Radius.full,
  },
  ctaBtnText: {
    color: Colors.white,
    fontWeight: FontWeight.bold,
    fontSize: FontSize.md,
  },

  itemList: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.md,
    backgroundColor: Colors.backgroundCard,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  itemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  itemInfo: { flex: 1, paddingRight: Spacing.md },
  itemName: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
    color: Colors.textPrimary,
  },
  itemAddons: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  itemPrice: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
    marginTop: 4,
  },

  qtyControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  qtyBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.backgroundInput,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    minWidth: 20,
    textAlign: 'center',
  },

  checkoutBar: {
    backgroundColor: Colors.backgroundCard,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  totalLabel: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
  },
  totalValue: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.extraBold,
    color: Colors.textPrimary,
  },
  checkoutBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  checkoutBtnText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.white,
    letterSpacing: 0.3,
  },
  authNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.xs,
    marginTop: Spacing.sm,
    paddingHorizontal: Spacing.xs,
  },
  authNoticeText: {
    flex: 1,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    lineHeight: 18,
  },
  authLink: {
    color: Colors.primaryLight,
    fontWeight: FontWeight.semiBold,
  },
});

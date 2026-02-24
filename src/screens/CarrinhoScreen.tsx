import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
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
import { RootStackParamList } from '../navigation/AppNavigator';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

// Simulação de itens no carrinho (futuramente virá de um CartContext)
const MOCK_ITEMS: { name: string; qty: number; price: number }[] = [
  // Deixe vazio para testar o estado de carrinho vazio,
  // ou adicione itens para ver o layout com produtos.
  // Exemplo:
  // { name: 'X-Burguer Especial', qty: 1, price: 29.9 },
  // { name: 'Coca-Cola 350ml', qty: 2, price: 7.5 },
];

export default function CarrinhoScreen() {
  const navigation = useNavigation<NavProp>();
  const tabBarHeight = useBottomTabBarHeight();
  const { user } = useAuth();

  const hasItems = MOCK_ITEMS.length > 0;
  const total = MOCK_ITEMS.reduce((acc, item) => acc + item.price * item.qty, 0);

  function handleCheckout() {
    if (!user) {
      // Usuário não autenticado → apresentar opção de login
      Alert.alert(
        'Login necessário',
        'Você precisa entrar na sua conta para finalizar o pedido.',
        [
          { text: 'Agora não', style: 'cancel' },
          {
            text: 'Entrar',
            onPress: () => navigation.navigate('Login'),
          },
        ],
      );
      return;
    }
    // Usuário autenticado → prosseguir com o pedido
    Alert.alert('Pedido confirmado!', 'Seu pedido foi recebido e está sendo preparado. 🍔');
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Carrinho</Text>
        {hasItems && (
          <TouchableOpacity>
            <Text style={styles.clearText}>Limpar</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Conteúdo */}
      {hasItems ? (
        /* ---- Carrinho com itens ---- */
        <View style={styles.flex}>
          <View style={styles.itemList}>
            {MOCK_ITEMS.map((item, idx) => (
              <View
                key={idx}
                style={[styles.itemRow, idx < MOCK_ITEMS.length - 1 && styles.itemBorder]}
              >
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemQty}>Qtd: {item.qty}</Text>
                </View>
                <Text style={styles.itemPrice}>
                  R$ {(item.price * item.qty).toFixed(2).replace('.', ',')}
                </Text>
              </View>
            ))}
          </View>
        </View>
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

      {/* ---- Rodapé de checkout (sempre visível quando tem itens) ---- */}
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

          {/* Aviso de login quando visitante */}
          {!user && (
            <View style={styles.authNotice}>
              <Ionicons name="information-circle-outline" size={15} color={Colors.textMuted} />
              <Text style={styles.authNoticeText}>
                Você precisa estar logado para finalizar o pedido.{' '}
                <Text
                  style={styles.authLink}
                  onPress={() => navigation.navigate('Login')}
                >
                  Entrar
                </Text>{' '}
                ou{' '}
                <Text
                  style={styles.authLink}
                  onPress={() => navigation.navigate('Register')}
                >
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

  // Header
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

  // Empty state
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

  // Item list
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
  itemInfo: { flex: 1 },
  itemName: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
    color: Colors.textPrimary,
  },
  itemQty: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  itemPrice: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
    marginLeft: Spacing.md,
  },

  // Checkout bar
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

  // Auth notice
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

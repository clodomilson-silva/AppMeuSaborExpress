import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { Colors, FontSize, FontWeight, Radius, Spacing } from '../theme';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { RootStackParamList } from '../navigation/AppNavigator';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

interface MenuItem {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  subtitle?: string;
  route: keyof RootStackParamList;
}

const menuItems: MenuItem[] = [
  { icon: 'location-outline', label: 'Endereços', subtitle: 'Gerenciar endereços de entrega', route: 'Enderecos' },
  { icon: 'receipt-outline', label: 'Histórico de Pedidos', subtitle: 'Ver todos os pedidos', route: 'HistoricoPedidos' },
  { icon: 'card-outline', label: 'Pagamento', subtitle: 'Métodos e histórico', route: 'Pagamentos' },
  { icon: 'settings-outline', label: 'Configurações', subtitle: 'Senha, notificações e mais', route: 'Configuracoes' },
];

export default function PerfilScreen() {
  const tabBarHeight = useBottomTabBarHeight();
  const { user, logout } = useAuth();
  const navigation = useNavigation<NavProp>();

  // ---- Estado de visitante (não logado) ----
  if (!user) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
        <View style={styles.header}>
          <Text style={styles.title}>Perfil</Text>
        </View>
        <View style={[styles.guestContainer, { paddingBottom: tabBarHeight + Spacing.xl }]}>
          <View style={styles.guestIconCircle}>
            <Ionicons name="person-outline" size={48} color={Colors.textMuted} />
          </View>
          <Text style={styles.guestTitle}>Você não está logado</Text>
          <Text style={styles.guestSubtitle}>
            Faça login ou crie uma conta para acompanhar seus pedidos e gerenciar seu perfil.
          </Text>
          <TouchableOpacity
            style={styles.guestBtnPrimary}
            onPress={() => navigation.navigate('Login')}
            activeOpacity={0.85}
          >
            <Ionicons name="log-in-outline" size={20} color={Colors.white} />
            <Text style={styles.guestBtnPrimaryText}>Entrar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.guestBtnSecondary}
            onPress={() => navigation.navigate('Register')}
            activeOpacity={0.8}
          >
            <Text style={styles.guestBtnSecondaryText}>Criar conta gratuita</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <View style={styles.header}>
        <Text style={styles.title}>Perfil</Text>
      </View>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: tabBarHeight + Spacing.md }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarWrapper}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={42} color={Colors.textMuted} />
            </View>
            <TouchableOpacity
              style={styles.editAvatarBtn}
              onPress={() => navigation.navigate('EditProfile')}
            >
              <Ionicons name="pencil" size={13} color={Colors.white} />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>Olá, {user?.name ?? 'Cliente'}!</Text>
          <Text style={styles.userEmail}>{user?.email ?? ''}</Text>
          {user?.cpf && (
            <Text style={styles.userMeta}>
              CPF: {user.cpf.slice(0, 3)}.***.***-{user.cpf.slice(-2)}
              {user.age ? `  ·  ${user.age} anos` : ''}
            </Text>
          )}
          <TouchableOpacity
            style={styles.editProfileBtn}
            onPress={() => navigation.navigate('EditProfile')}
            activeOpacity={0.8}
          >
            <Ionicons name="create-outline" size={15} color={Colors.primary} />
            <Text style={styles.editProfileBtnText}>Editar perfil</Text>
          </TouchableOpacity>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.label}
              style={[
                styles.menuItem,
                index < menuItems.length - 1 && styles.menuItemBorder,
              ]}
              activeOpacity={0.7}
              onPress={() => navigation.navigate(item.route as any)}
            >
              <View style={styles.menuLeft}>
                <View style={styles.menuIconBg}>
                  <Ionicons name={item.icon} size={20} color={Colors.primary} />
                </View>
                <View>
                  <Text style={styles.menuLabel}>{item.label}</Text>
                  {item.subtitle && (
                    <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
                  )}
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={logout} activeOpacity={0.8}>
          <Ionicons name="log-out-outline" size={20} color={Colors.error} />
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </ScrollView>
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
  content: {},
  avatarSection: {
    alignItems: 'center',
    paddingVertical: Spacing.xxxl,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginBottom: Spacing.md,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: Colors.backgroundCard,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  userMeta: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: 4,
    letterSpacing: 0.3,
  },
  editProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full ?? 999,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  editProfileBtnText: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    fontWeight: FontWeight.medium,
  },
  menuSection: {
    marginHorizontal: Spacing.lg,
    backgroundColor: Colors.backgroundCard,
    borderRadius: Radius.lg,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  menuIconBg: {
    width: 38,
    height: 38,
    borderRadius: Radius.sm,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
    color: Colors.textPrimary,
  },
  menuSubtitle: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: 1,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.xl,
    marginHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.backgroundCard,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: '#F4433622',
  },
  logoutText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semiBold,
    color: '#F44336',
  },
  // Guest state
  guestContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  guestIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.backgroundCard,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  guestTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  guestSubtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.xxxl,
  },
  guestBtnPrimary: {
    width: '100%',
    height: 50,
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  guestBtnPrimaryText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },
  guestBtnSecondary: {
    width: '100%',
    height: 50,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  guestBtnSecondaryText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semiBold,
    color: Colors.primary,
  },
});

import React from 'react';
import {
  View, Text, StyleSheet, StatusBar, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Colors, FontSize, FontWeight, Radius, Spacing } from '../theme';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

interface SettingItem {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  subtitle?: string;
  onPress: () => void;
  danger?: boolean;
}

export default function ConfiguracoesScreen() {
  const navigation = useNavigation<NavProp>();
  const { logout } = useAuth();

  const items: SettingItem[] = [
    {
      icon: 'key-outline',
      label: 'Alterar senha',
      subtitle: 'Enviar link de redefinição por e-mail',
      onPress: () => navigation.navigate('ForgotPassword'),
    },
    {
      icon: 'notifications-outline',
      label: 'Notificações',
      subtitle: 'Gerencie alertas de pedidos e promoções',
      onPress: () => navigation.navigate('Notificacoes'),
    },
    {
      icon: 'shield-checkmark-outline',
      label: 'Privacidade',
      subtitle: 'Gerenciar seus dados pessoais',
      onPress: () => navigation.navigate('Privacidade'),
    },
    {
      icon: 'help-circle-outline',
      label: 'Ajuda & Suporte',
      subtitle: 'Fale conosco',
      onPress: () => navigation.navigate('AjudaSuporte'),
    },
    {
      icon: 'log-out-outline',
      label: 'Sair da conta',
      onPress: logout,
      danger: true,
    },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Configurações</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.menuSection}>
          {items.map((item, index) => (
            <TouchableOpacity
              key={item.label}
              style={[styles.menuItem, index < items.length - 1 && styles.border]}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <View style={[styles.iconBg, item.danger && styles.iconBgDanger]}>
                <Ionicons
                  name={item.icon}
                  size={20}
                  color={item.danger ? Colors.error : Colors.primary}
                />
              </View>
              <View style={styles.itemInfo}>
                <Text style={[styles.itemLabel, item.danger && styles.dangerText]}>
                  {item.label}
                </Text>
                {item.subtitle && (
                  <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
                )}
              </View>
              {!item.danger && (
                <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.version}>Meu Sabor Express v1.0.0</Text>
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
  content: { flex: 1, padding: Spacing.lg },
  menuSection: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: Radius.lg,
    borderWidth: 1, borderColor: Colors.border,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, gap: Spacing.md,
  },
  border: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  iconBg: {
    width: 38, height: 38, borderRadius: Radius.sm,
    backgroundColor: Colors.background,
    alignItems: 'center', justifyContent: 'center',
  },
  iconBgDanger: { backgroundColor: '#F4433610' },
  itemInfo: { flex: 1 },
  itemLabel: { fontSize: FontSize.md, fontWeight: FontWeight.medium, color: Colors.textPrimary },
  dangerText: { color: Colors.error },
  itemSubtitle: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },
  version: {
    fontSize: FontSize.xs, color: Colors.textMuted,
    textAlign: 'center', marginTop: Spacing.xl,
  },
});

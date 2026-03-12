import React, { useState } from 'react';
import {
  View, Text, StyleSheet, StatusBar, TouchableOpacity, Switch, ScrollView, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import { Colors, FontSize, FontWeight, Radius, Spacing } from '../theme';

interface PrivToggle {
  icon: keyof typeof Ionicons.glyphMap;
  key: string;
  label: string;
  subtitle: string;
}

const PRIV_TOGGLES: PrivToggle[] = [
  {
    icon: 'location-outline',
    key: 'localizacao',
    label: 'Localização do aplicativo',
    subtitle: 'Usada para calcular frete e sugerir endereços próximos',
  },
  {
    icon: 'analytics-outline',
    key: 'analytics',
    label: 'Análise de uso',
    subtitle: 'Dados anônimos de navegação enviados para a interface web de gestão',
  },
];

const PRIV_ACTIONS = [
  {
    icon: 'document-text-outline' as keyof typeof Ionicons.glyphMap,
    label: 'Termos de uso',
    subtitle: 'Leia nossas condições de serviço',
  },
  {
    icon: 'shield-outline' as keyof typeof Ionicons.glyphMap,
    label: 'Política de privacidade',
    subtitle: 'Como usamos seus dados',
  },
  {
    icon: 'trash-outline' as keyof typeof Ionicons.glyphMap,
    label: 'Excluir minha conta',
    subtitle: 'Apaga todos os seus dados permanentemente',
    danger: true,
  },
];

export default function PrivacidadeScreen() {
  const navigation = useNavigation();

  const [prefs, setPrefs] = useState<Record<string, boolean>>({
    localizacao: true,
    analytics: true,
  });

  async function toggle(key: string) {
    const next = !prefs[key];

    if (key === 'localizacao' && !next) {
      // Informa o usuário que a desativação deve ser feita nas configurações do sistema
      Alert.alert(
        'Desativar localização',
        'Para revogar a permissão de localização, acesse as Configurações do seu dispositivo > Aplicativos > Meu Sabor Express > Permissões.',
        [{ text: 'Entendi', style: 'default' }],
      );
      return;
    }

    setPrefs(prev => ({ ...prev, [key]: next }));
  }

  const handleAction = (label: string) => {
    if (label === 'Excluir minha conta') {
      Alert.alert(
        'Excluir conta',
        'Esta ação é irreversível. Todos os seus dados, pedidos e informações pessoais serão apagados permanentemente.\n\nDeseja continuar?',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Excluir',
            style: 'destructive',
            onPress: () =>
              Alert.alert('Solicitação enviada', 'Entraremos em contato em até 5 dias úteis para confirmar a exclusão da sua conta.'),
          },
        ],
      );
    } else {
      Alert.alert(label, 'Este conteúdo será disponibilizado em breve.');
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacidade</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <View style={styles.banner}>
          <View style={styles.bannerIcon}>
            <Ionicons name="shield-checkmark" size={28} color={Colors.primary} />
          </View>
          <Text style={styles.bannerTitle}>Seus dados, seu controle</Text>
          <Text style={styles.bannerSub}>
            Gerencie como o Meu Sabor Express usa suas informações pessoais.
          </Text>
        </View>

        {/* Permissões */}
        <Text style={styles.sectionTitle}>Permissões e dados</Text>
        <View style={styles.card}>
          {PRIV_TOGGLES.map((item, idx) => (
            <View
              key={item.key}
              style={[styles.row, idx < PRIV_TOGGLES.length - 1 && styles.rowBorder]}
            >
              <View style={styles.iconBg}>
                <Ionicons name={item.icon} size={20} color={Colors.primary} />
              </View>
              <View style={styles.info}>
                <Text style={styles.label}>{item.label}</Text>
                <Text style={styles.sub}>{item.subtitle}</Text>
              </View>
              <Switch
                value={prefs[item.key]}
                onValueChange={() => toggle(item.key)}
                trackColor={{ false: Colors.border, true: Colors.primary + '55' }}
                thumbColor={prefs[item.key] ? Colors.primary : Colors.textMuted}
              />
            </View>
          ))}
        </View>

        {/* Documentos e conta */}
        <Text style={styles.sectionTitle}>Documentos e conta</Text>
        <View style={styles.card}>
          {PRIV_ACTIONS.map((item, idx) => (
            <TouchableOpacity
              key={item.label}
              style={[styles.row, idx < PRIV_ACTIONS.length - 1 && styles.rowBorder]}
              onPress={() => handleAction(item.label)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconBg, item.danger && styles.iconBgDanger]}>
                <Ionicons
                  name={item.icon}
                  size={20}
                  color={item.danger ? Colors.error : Colors.primary}
                />
              </View>
              <View style={styles.info}>
                <Text style={[styles.label, item.danger && styles.dangerText]}>{item.label}</Text>
                <Text style={styles.sub}>{item.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
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
  content: { padding: Spacing.lg, gap: Spacing.lg },
  banner: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: Radius.lg,
    borderWidth: 1, borderColor: Colors.border,
    padding: Spacing.xl,
    alignItems: 'center', gap: Spacing.sm,
  },
  bannerIcon: {
    width: 56, height: 56, borderRadius: Radius.xl,
    backgroundColor: Colors.primary + '18',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  bannerTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  bannerSub: { fontSize: FontSize.sm, color: Colors.textMuted, textAlign: 'center', lineHeight: 20 },
  sectionTitle: {
    fontSize: FontSize.sm, fontWeight: FontWeight.semiBold,
    color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.8,
    marginBottom: -Spacing.sm,
  },
  card: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: Radius.lg,
    borderWidth: 1, borderColor: Colors.border,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, gap: Spacing.md,
  },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  iconBg: {
    width: 38, height: 38, borderRadius: Radius.sm,
    backgroundColor: Colors.background,
    alignItems: 'center', justifyContent: 'center',
  },
  iconBgDanger: { backgroundColor: '#F4433610' },
  info: { flex: 1 },
  label: { fontSize: FontSize.md, fontWeight: FontWeight.medium, color: Colors.textPrimary },
  dangerText: { color: Colors.error },
  sub: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },
});


interface PrivItem {
  icon: keyof typeof Ionicons.glyphMap;
  key: string;
  label: string;
  subtitle: string;
  isToggle: boolean;
}

const PRIV_TOGGLES: PrivItem[] = [
  {
    icon: 'location-outline',
    key: 'localizacao',
    label: 'Compartilhar localização',
    subtitle: 'Usado para calcular frete e sugerir restaurantes próximos',
    isToggle: true,
  },
  {
    icon: 'analytics-outline',
    key: 'analytics',
    label: 'Análise de uso',
    subtitle: 'Ajuda a melhorar o app com dados anônimos',
    isToggle: true,
  },
  {
    icon: 'megaphone-outline',
    key: 'marketing',
    label: 'Comunicações de marketing',
    subtitle: 'Ofertas personalizadas com base no seu histórico',
    isToggle: true,
  },
];

const PRIV_ACTIONS = [
  {
    icon: 'document-text-outline' as keyof typeof Ionicons.glyphMap,
    label: 'Termos de uso',
    subtitle: 'Leia nossas condições de serviço',
  },
  {
    icon: 'shield-outline' as keyof typeof Ionicons.glyphMap,
    label: 'Política de privacidade',
    subtitle: 'Como usamos seus dados',
  },
  {
    icon: 'trash-outline' as keyof typeof Ionicons.glyphMap,
    label: 'Excluir minha conta',
    subtitle: 'Apaga todos os seus dados permanentemente',
    danger: true,
  },
];

export default function PrivacidadeScreen() {
  const navigation = useNavigation();

  const [prefs, setPrefs] = useState<Record<string, boolean>>({
    localizacao: true,
    analytics: true,
    marketing: false,
  });

  const toggle = (key: string) =>
    setPrefs(prev => ({ ...prev, [key]: !prev[key] }));

  const handleAction = (label: string) => {
    if (label === 'Excluir minha conta') {
      Alert.alert(
        'Excluir conta',
        'Esta ação é irreversível. Todos os seus dados, pedidos e informações pessoais serão apagados permanentemente.\n\nDeseja continuar?',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Excluir',
            style: 'destructive',
            onPress: () =>
              Alert.alert('Solicitação enviada', 'Entraremos em contato em até 5 dias úteis para confirmar a exclusão da sua conta.'),
          },
        ],
      );
    } else {
      Alert.alert(label, 'Este conteúdo será disponibilizado em breve.');
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacidade</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <View style={styles.banner}>
          <View style={styles.bannerIcon}>
            <Ionicons name="shield-checkmark" size={28} color={Colors.primary} />
          </View>
          <Text style={styles.bannerTitle}>Seus dados, seu controle</Text>
          <Text style={styles.bannerSub}>
            Gerencie como o Meu Sabor Express usa suas informações pessoais.
          </Text>
        </View>

        {/* Permissões */}
        <Text style={styles.sectionTitle}>Permissões e dados</Text>
        <View style={styles.card}>
          {PRIV_TOGGLES.map((item, idx) => (
            <View
              key={item.key}
              style={[styles.row, idx < PRIV_TOGGLES.length - 1 && styles.rowBorder]}
            >
              <View style={styles.iconBg}>
                <Ionicons name={item.icon} size={20} color={Colors.primary} />
              </View>
              <View style={styles.info}>
                <Text style={styles.label}>{item.label}</Text>
                <Text style={styles.sub}>{item.subtitle}</Text>
              </View>
              <Switch
                value={prefs[item.key]}
                onValueChange={() => toggle(item.key)}
                trackColor={{ false: Colors.border, true: Colors.primary + '55' }}
                thumbColor={prefs[item.key] ? Colors.primary : Colors.textMuted}
              />
            </View>
          ))}
        </View>

        {/* Ações legais */}
        <Text style={styles.sectionTitle}>Documentos e conta</Text>
        <View style={styles.card}>
          {PRIV_ACTIONS.map((item, idx) => (
            <TouchableOpacity
              key={item.label}
              style={[styles.row, idx < PRIV_ACTIONS.length - 1 && styles.rowBorder]}
              onPress={() => handleAction(item.label)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconBg, item.danger && styles.iconBgDanger]}>
                <Ionicons
                  name={item.icon}
                  size={20}
                  color={item.danger ? Colors.error : Colors.primary}
                />
              </View>
              <View style={styles.info}>
                <Text style={[styles.label, item.danger && styles.dangerText]}>{item.label}</Text>
                <Text style={styles.sub}>{item.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
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
  content: { padding: Spacing.lg, gap: Spacing.lg },
  banner: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: Radius.lg,
    borderWidth: 1, borderColor: Colors.border,
    padding: Spacing.xl,
    alignItems: 'center', gap: Spacing.sm,
  },
  bannerIcon: {
    width: 56, height: 56, borderRadius: Radius.xl,
    backgroundColor: Colors.primary + '18',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  bannerTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  bannerSub: { fontSize: FontSize.sm, color: Colors.textMuted, textAlign: 'center', lineHeight: 20 },
  sectionTitle: {
    fontSize: FontSize.sm, fontWeight: FontWeight.semiBold,
    color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: 0.8,
    marginBottom: -Spacing.sm,
  },
  card: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: Radius.lg,
    borderWidth: 1, borderColor: Colors.border,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, gap: Spacing.md,
  },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
  iconBg: {
    width: 38, height: 38, borderRadius: Radius.sm,
    backgroundColor: Colors.background,
    alignItems: 'center', justifyContent: 'center',
  },
  iconBgDanger: { backgroundColor: '#F4433610' },
  info: { flex: 1 },
  label: { fontSize: FontSize.md, fontWeight: FontWeight.medium, color: Colors.textPrimary },
  dangerText: { color: Colors.error },
  sub: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },
});

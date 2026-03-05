import React, { useState } from 'react';
import {
  View, Text, StyleSheet, StatusBar, TouchableOpacity, Switch, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors, FontSize, FontWeight, Radius, Spacing } from '../theme';

interface NotifItem {
  icon: keyof typeof Ionicons.glyphMap;
  key: string;
  label: string;
  subtitle: string;
}

const NOTIF_ITEMS: NotifItem[] = [
  {
    icon: 'receipt-outline',
    key: 'pedidos',
    label: 'Atualizações de pedidos',
    subtitle: 'Receba o status em tempo real do seu pedido',
  },
  {
    icon: 'pricetag-outline',
    key: 'promocoes',
    label: 'Promoções e ofertas',
    subtitle: 'Descontos exclusivos e cupons especiais',
  },
  {
    icon: 'star-outline',
    key: 'novidades',
    label: 'Novidades do cardápio',
    subtitle: 'Pratos novos e sazonais disponíveis',
  },
  {
    icon: 'mail-outline',
    key: 'email',
    label: 'Notificações por e-mail',
    subtitle: 'Resumos semanais e confirmações',
  },
  {
    icon: 'chatbubble-outline',
    key: 'chat',
    label: 'Mensagens do suporte',
    subtitle: 'Respostas da equipe de atendimento',
  },
];

export default function NotificacoesScreen() {
  const navigation = useNavigation();

  const [prefs, setPrefs] = useState<Record<string, boolean>>({
    pedidos: true,
    promocoes: true,
    novidades: false,
    email: true,
    chat: true,
  });

  const toggle = (key: string) =>
    setPrefs(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notificações</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <View style={styles.banner}>
          <View style={styles.bannerIcon}>
            <Ionicons name="notifications" size={28} color={Colors.primary} />
          </View>
          <Text style={styles.bannerTitle}>Fique por dentro de tudo</Text>
          <Text style={styles.bannerSub}>
            Escolha quais alertas deseja receber para não perder nenhuma novidade.
          </Text>
        </View>

        {/* Toggles */}
        <View style={styles.card}>
          {NOTIF_ITEMS.map((item, idx) => (
            <View
              key={item.key}
              style={[styles.row, idx < NOTIF_ITEMS.length - 1 && styles.rowBorder]}
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

        <Text style={styles.hint}>
          As notificações push dependem das permissões do seu dispositivo.
        </Text>
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
  info: { flex: 1 },
  label: { fontSize: FontSize.md, fontWeight: FontWeight.medium, color: Colors.textPrimary },
  sub: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },
  hint: {
    fontSize: FontSize.xs, color: Colors.textMuted,
    textAlign: 'center', lineHeight: 18,
  },
});

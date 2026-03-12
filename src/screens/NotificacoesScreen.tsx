import React from 'react';
import {
  View, Text, StyleSheet, StatusBar, TouchableOpacity, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors, FontSize, FontWeight, Radius, Spacing } from '../theme';

interface NotifType {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  subtitle: string;
}

const NOTIF_TYPES: NotifType[] = [
  {
    icon: 'receipt-outline',
    label: 'Status do pedido',
    subtitle: 'Confirmação, preparo, saída para entrega e entregue',
  },
  {
    icon: 'time-outline',
    label: 'Fila de espera',
    subtitle: 'Aviso quando seu pedido entrar ou sair da fila',
  },
  {
    icon: 'pricetag-outline',
    label: 'Promoções e ofertas',
    subtitle: 'Cupons e descontos enviados pela gestão',
  },
  {
    icon: 'star-outline',
    label: 'Novidades do cardápio',
    subtitle: 'Novos pratos e disponibilidade de itens',
  },
  {
    icon: 'chatbubble-outline',
    label: 'Suporte ao cliente',
    subtitle: 'Respostas da equipe de atendimento',
  },
];

export default function NotificacoesScreen() {
  const navigation = useNavigation();

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

        {/* Banner informativo */}
        <View style={styles.banner}>
          <View style={styles.bannerIcon}>
            <Ionicons name="cloud-outline" size={28} color={Colors.primary} />
          </View>
          <Text style={styles.bannerTitle}>Gerenciado via microserviço</Text>
          <Text style={styles.bannerSub}>
            As notificações são enviadas automaticamente pelo servidor e gerenciadas
            pela interface web de gestão. Nenhuma configuração local é necessária.
          </Text>
        </View>

        {/* Info card */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle-outline" size={18} color={Colors.primary} />
          <Text style={styles.infoText}>
            Certifique-se de que as notificações do app estão habilitadas nas
            configurações do seu dispositivo para receber os alertas em tempo real.
          </Text>
        </View>

        {/* Tipos de notificação */}
        <Text style={styles.sectionTitle}>Tipos de notificação</Text>
        <View style={styles.card}>
          {NOTIF_TYPES.map((item, idx) => (
            <View
              key={item.label}
              style={[styles.row, idx < NOTIF_TYPES.length - 1 && styles.rowBorder]}
            >
              <View style={styles.iconBg}>
                <Ionicons name={item.icon} size={20} color={Colors.primary} />
              </View>
              <View style={styles.info}>
                <Text style={styles.label}>{item.label}</Text>
                <Text style={styles.sub}>{item.subtitle}</Text>
              </View>
              <View style={styles.activeBadge}>
                <Text style={styles.activeBadgeText}>Ativo</Text>
              </View>
            </View>
          ))}
        </View>

        <Text style={styles.hint}>
          Para desativar um tipo específico de notificação, acesse a interface
          web de gestão ou entre em contato com o suporte.
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
  infoCard: {
    flexDirection: 'row',
    gap: Spacing.sm,
    backgroundColor: Colors.primary + '12',
    borderRadius: Radius.md,
    borderWidth: 1, borderColor: Colors.primary + '30',
    padding: Spacing.md,
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 20,
  },
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
  info: { flex: 1 },
  label: { fontSize: FontSize.md, fontWeight: FontWeight.medium, color: Colors.textPrimary },
  sub: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },
  activeBadge: {
    paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: Radius.full,
    backgroundColor: Colors.success + '20',
    borderWidth: 1, borderColor: Colors.success + '40',
  },
  activeBadgeText: {
    fontSize: FontSize.xs, fontWeight: FontWeight.semiBold, color: Colors.success,
  },
  hint: {
    fontSize: FontSize.xs, color: Colors.textMuted,
    textAlign: 'center', lineHeight: 18,
  },
});

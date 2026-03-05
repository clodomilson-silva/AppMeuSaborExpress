import React, { useState } from 'react';
import {
  View, Text, StyleSheet, StatusBar, TouchableOpacity, ScrollView,
  TextInput, Alert, Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Colors, FontSize, FontWeight, Radius, Spacing } from '../theme';

const FAQ_ITEMS = [
  {
    question: 'Como cancelo um pedido?',
    answer:
      'Você pode cancelar um pedido em até 5 minutos após a confirmação. Acesse "Meus Pedidos", selecione o pedido e toque em "Cancelar Pedido".',
  },
  {
    question: 'Meu pedido atrasou, o que faço?',
    answer:
      'Verifique o status em "Meus Pedidos". Se o prazo tiver sido ultrapassado, entre em contato pelo chat de suporte para acionar a equipe responsável.',
  },
  {
    question: 'Como solicito reembolso?',
    answer:
      'Em caso de problemas com o pedido, entre em contato via chat. Analisamos cada caso em até 48 horas úteis e o estorno é feito em 5–10 dias úteis.',
  },
  {
    question: 'Como altero meu endereço de entrega?',
    answer:
      'Acesse Perfil → Endereços e adicione ou edite seus endereços. Para pedidos em andamento, entre em contato com o suporte.',
  },
  {
    question: 'Posso usar mais de um cupom?',
    answer:
      'Apenas um cupom por pedido é permitido. Aplique o código no carrinho antes de finalizar a compra.',
  },
];

const CHANNELS = [
  {
    icon: 'chatbubbles-outline' as keyof typeof Ionicons.glyphMap,
    label: 'Chat ao vivo',
    subtitle: 'Atendimento seg–sex, 8h–20h',
    action: () => Alert.alert('Chat', 'O chat ao vivo estará disponível em breve.'),
  },
  {
    icon: 'mail-outline' as keyof typeof Ionicons.glyphMap,
    label: 'Enviar e-mail',
    subtitle: 'suporte@meusaborexpress.com.br',
    action: () => Linking.openURL('mailto:suporte@meusaborexpress.com.br'),
  },
  {
    icon: 'logo-whatsapp' as keyof typeof Ionicons.glyphMap,
    label: 'WhatsApp',
    subtitle: '(98) 99999-0000 – seg–sáb, 9h–18h',
    action: () => Linking.openURL('https://wa.me/5598999990000'),
  },
];

export default function AjudaSuporteScreen() {
  const navigation = useNavigation();
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<number | null>(null);

  const filtered = search.trim()
    ? FAQ_ITEMS.filter(
        f =>
          f.question.toLowerCase().includes(search.toLowerCase()) ||
          f.answer.toLowerCase().includes(search.toLowerCase()),
      )
    : FAQ_ITEMS;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ajuda & Suporte</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <View style={styles.banner}>
          <View style={styles.bannerIcon}>
            <Ionicons name="help-circle" size={28} color={Colors.primary} />
          </View>
          <Text style={styles.bannerTitle}>Como podemos ajudar?</Text>
          <Text style={styles.bannerSub}>
            Encontre respostas rápidas ou fale direto com nossa equipe.
          </Text>
        </View>

        {/* Canais de atendimento */}
        <Text style={styles.sectionTitle}>Fale conosco</Text>
        <View style={styles.card}>
          {CHANNELS.map((ch, idx) => (
            <TouchableOpacity
              key={ch.label}
              style={[styles.row, idx < CHANNELS.length - 1 && styles.rowBorder]}
              onPress={ch.action}
              activeOpacity={0.7}
            >
              <View style={styles.iconBg}>
                <Ionicons name={ch.icon} size={20} color={Colors.primary} />
              </View>
              <View style={styles.info}>
                <Text style={styles.label}>{ch.label}</Text>
                <Text style={styles.sub}>{ch.subtitle}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        {/* FAQ */}
        <Text style={styles.sectionTitle}>Perguntas frequentes</Text>

        {/* Barra de busca */}
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={18} color={Colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar dúvida..."
            placeholderTextColor={Colors.textMuted}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.card}>
          {filtered.length === 0 ? (
            <View style={styles.emptyFaq}>
              <Ionicons name="search-outline" size={30} color={Colors.textMuted} />
              <Text style={styles.emptyText}>Nenhuma pergunta encontrada</Text>
            </View>
          ) : (
            filtered.map((item, idx) => (
              <View key={idx} style={idx < filtered.length - 1 ? styles.rowBorder : undefined}>
                <TouchableOpacity
                  style={styles.faqHeader}
                  onPress={() => setExpanded(expanded === idx ? null : idx)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.faqQ}>{item.question}</Text>
                  <Ionicons
                    name={expanded === idx ? 'chevron-up' : 'chevron-down'}
                    size={18}
                    color={Colors.textMuted}
                  />
                </TouchableOpacity>
                {expanded === idx && (
                  <Text style={styles.faqA}>{item.answer}</Text>
                )}
              </View>
            ))
          )}
        </View>

        <Text style={styles.version}>Meu Sabor Express v1.0.0 · Central de Ajuda</Text>
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
  info: { flex: 1 },
  label: { fontSize: FontSize.md, fontWeight: FontWeight.medium, color: Colors.textPrimary },
  sub: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 2 },
  searchBox: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    backgroundColor: Colors.backgroundCard,
    borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.border,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    marginBottom: -Spacing.sm,
  },
  searchInput: {
    flex: 1, fontSize: FontSize.md, color: Colors.textPrimary,
    paddingVertical: 0,
  },
  faqHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, gap: Spacing.md,
  },
  faqQ: {
    flex: 1, fontSize: FontSize.md, fontWeight: FontWeight.medium,
    color: Colors.textPrimary,
  },
  faqA: {
    paddingHorizontal: Spacing.lg, paddingBottom: Spacing.md,
    fontSize: FontSize.sm, color: Colors.textMuted, lineHeight: 20,
  },
  emptyFaq: {
    alignItems: 'center', gap: Spacing.sm,
    paddingVertical: Spacing.xxl,
  },
  emptyText: { fontSize: FontSize.sm, color: Colors.textMuted },
  version: {
    fontSize: FontSize.xs, color: Colors.textMuted,
    textAlign: 'center', marginBottom: Spacing.sm,
  },
});

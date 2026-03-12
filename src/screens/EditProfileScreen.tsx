import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, StatusBar, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth, translateFirebaseError } from '../context/AuthContext';
import { Colors, FontSize, FontWeight, Radius, Spacing } from '../theme';

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const { user, updateUserProfile } = useAuth();

  const [name, setName] = useState(user?.name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [age, setAge] = useState(user?.age ? String(user.age) : '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  function maskPhone(v: string) {
    const d = v.replace(/\D/g, '').slice(0, 11);
    return d
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2');
  }

  async function handleSave() {
    if (!name.trim()) { setError('O nome não pode ficar vazio.'); return; }
    const ageNum = age ? parseInt(age, 10) : undefined;
    if (age && (isNaN(ageNum!) || ageNum! < 16 || ageNum! > 120)) {
      setError('Idade inválida.'); return;
    }
    setError(''); setLoading(true);
    try {
      await updateUserProfile({ name: name.trim(), phone: phone.trim() || undefined, age: ageNum });
      setSuccess(true);
      setTimeout(() => navigation.goBack(), 1200);
    } catch (e: any) {
      setError(translateFirebaseError(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Editar Perfil</Text>
            <View style={{ width: 40 }} />
          </View>

          <View style={styles.card}>
            {/* Nome */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nome completo</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="person-outline" size={18} color={Colors.textMuted} style={styles.icon} />
                <TextInput
                  style={styles.input} placeholder="Seu nome"
                  placeholderTextColor={Colors.textMuted} autoCapitalize="words"
                  value={name} onChangeText={setName}
                />
              </View>
            </View>

            {/* E-mail (somente leitura) */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>E-mail <Text style={styles.readOnly}>(não editável)</Text></Text>
              <View style={[styles.inputWrapper, styles.readOnlyWrapper]}>
                <Ionicons name="mail-outline" size={18} color={Colors.textMuted} style={styles.icon} />
                <Text style={[styles.input, { color: Colors.textMuted }]}>{user?.email}</Text>
              </View>
            </View>

            {/* CPF (somente leitura) */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>CPF <Text style={styles.readOnly}>(não editável)</Text></Text>
              <View style={[styles.inputWrapper, styles.readOnlyWrapper]}>
                <Ionicons name="id-card-outline" size={18} color={Colors.textMuted} style={styles.icon} />
                <Text style={[styles.input, { color: Colors.textMuted }]}>{user?.cpf ?? '—'}</Text>
              </View>
            </View>

            {/* Telefone */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Telefone</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="call-outline" size={18} color={Colors.textMuted} style={styles.icon} />
                <TextInput
                  style={styles.input} placeholder="(00) 00000-0000"
                  placeholderTextColor={Colors.textMuted} keyboardType="phone-pad"
                  value={phone} onChangeText={(t) => setPhone(maskPhone(t))} maxLength={15}
                />
              </View>
            </View>

            {/* Idade */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Idade</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="calendar-outline" size={18} color={Colors.textMuted} style={styles.icon} />
                <TextInput
                  style={styles.input} placeholder="Ex: 25"
                  placeholderTextColor={Colors.textMuted} keyboardType="numeric"
                  maxLength={3} value={age} onChangeText={setAge}
                />
              </View>
            </View>

            {!!error && (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle-outline" size={16} color={Colors.error} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}
            {success && (
              <View style={styles.successBox}>
                <Ionicons name="checkmark-circle-outline" size={16} color="#4CAF50" />
                <Text style={styles.successText}>Perfil atualizado!</Text>
              </View>
            )}

            <TouchableOpacity
              style={[styles.btn, loading && { opacity: 0.6 }]}
              onPress={handleSave} disabled={loading} activeOpacity={0.85}
            >
              {loading ? <ActivityIndicator color={Colors.white} /> : (
                <>
                  <Ionicons name="save-outline" size={20} color={Colors.white} />
                  <Text style={styles.btnText}>Salvar alterações</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  flex: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xl },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: Spacing.md,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: Radius.md,
    backgroundColor: Colors.backgroundCard,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: Colors.border,
  },
  headerTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  card: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: Radius.xl, padding: Spacing.xxl,
    borderWidth: 1, borderColor: Colors.border, marginTop: Spacing.md,
  },
  inputGroup: { marginBottom: Spacing.md },
  label: { fontSize: FontSize.sm, fontWeight: FontWeight.medium, color: Colors.textSecondary, marginBottom: Spacing.xs },
  readOnly: { color: Colors.textMuted, fontWeight: '400' },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.backgroundInput,
    borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.border,
    paddingHorizontal: Spacing.md, height: 48,
  },
  readOnlyWrapper: { opacity: 0.6 },
  icon: { marginRight: Spacing.sm },
  input: { flex: 1, fontSize: FontSize.md, color: Colors.textPrimary },
  errorBox: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.xs,
    backgroundColor: '#F4433618', borderRadius: Radius.sm,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    marginBottom: Spacing.md, borderWidth: 1, borderColor: '#F4433630',
  },
  errorText: { fontSize: FontSize.sm, color: Colors.error, flex: 1 },
  successBox: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.xs,
    backgroundColor: '#4CAF5018', borderRadius: Radius.sm,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    marginBottom: Spacing.md, borderWidth: 1, borderColor: '#4CAF5030',
  },
  successText: { fontSize: FontSize.sm, color: '#4CAF50', flex: 1 },
  btn: {
    backgroundColor: Colors.primary, borderRadius: Radius.md, height: 50,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: Spacing.sm, marginTop: Spacing.xs,
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35, shadowRadius: 8, elevation: 6,
  },
  btnText: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.white },
});

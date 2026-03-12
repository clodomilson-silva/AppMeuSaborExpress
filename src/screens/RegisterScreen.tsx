import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { useAuth, translateFirebaseError } from '../context/AuthContext';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Colors, FontSize, FontWeight, Radius, Spacing } from '../theme';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'Register'>;

// ─── Helpers de máscara ───────────────────────────────────────────────────────

function maskCPF(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

function isValidCPF(cpf: string): boolean {
  const digits = cpf.replace(/\D/g, '');
  if (digits.length !== 11) return false;
  if (/^(\d)\1+$/.test(digits)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(digits[i]) * (10 - i);
  let rest = (sum * 10) % 11;
  if (rest === 10 || rest === 11) rest = 0;
  if (rest !== parseInt(digits[9])) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(digits[i]) * (11 - i);
  rest = (sum * 10) % 11;
  if (rest === 10 || rest === 11) rest = 0;
  return rest === parseInt(digits[10]);
}

// ─── Componente ───────────────────────────────────────────────────────────────

export default function RegisterScreen() {
  const navigation = useNavigation<NavProp>();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cpf, setCpf] = useState('');
  const [age, setAge] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function handleCpfChange(text: string) {
    setCpf(maskCPF(text));
  }

  async function handleRegister() {
    if (!name.trim() || !email.trim() || !cpf.trim() || !age.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('Por favor, preencha todos os campos.');
      return;
    }
    if (!isValidCPF(cpf)) {
      setError('CPF inválido. Verifique e tente novamente.');
      return;
    }
    const ageNum = parseInt(age, 10);
    if (isNaN(ageNum) || ageNum < 16 || ageNum > 120) {
      setError('Idade inválida. Deve ser entre 16 e 120 anos.');
      return;
    }
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await register(name.trim(), email.trim(), password, cpf.trim(), ageNum);
      navigation.goBack();
    } catch (err) {
      setError(translateFirebaseError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Brand */}
          <View style={styles.brand}>
            <Image
              source={require('../../assets/logo.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
            <Text style={styles.appName}>Crie sua conta</Text>
            <Text style={styles.tagline}>Rápido e fácil, em menos de 1 minuto</Text>
          </View>

          {/* Card */}
          <View style={styles.card}>
            {/* Nome */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nome completo</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="person-outline" size={18} color={Colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="João Silva"
                  placeholderTextColor={Colors.textMuted}
                  autoCapitalize="words"
                  value={name}
                  onChangeText={setName}
                />
              </View>
            </View>

            {/* E-mail */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>E-mail</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="mail-outline" size={18} color={Colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="seu@email.com"
                  placeholderTextColor={Colors.textMuted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
            </View>

            {/* CPF e Idade - linha dupla */}
            <View style={styles.row}>
              <View style={[styles.inputGroup, styles.rowFlex]}>
                <Text style={styles.label}>CPF</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="id-card-outline" size={18} color={Colors.textMuted} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="000.000.000-00"
                    placeholderTextColor={Colors.textMuted}
                    keyboardType="numeric"
                    value={cpf}
                    onChangeText={handleCpfChange}
                    maxLength={14}
                  />
                </View>
              </View>

              <View style={[styles.inputGroup, styles.rowSmall]}>
                <Text style={styles.label}>Idade</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="calendar-outline" size={18} color={Colors.textMuted} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="25"
                    placeholderTextColor={Colors.textMuted}
                    keyboardType="numeric"
                    maxLength={3}
                    value={age}
                    onChangeText={setAge}
                  />
                </View>
              </View>
            </View>

            {/* Senha */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Senha</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={18} color={Colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, styles.inputFlex]}
                  placeholder="Mínimo 6 caracteres"
                  placeholderTextColor={Colors.textMuted}
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(v => !v)} style={styles.eyeBtn}>
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={18}
                    color={Colors.textMuted}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirmar Senha */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirmar senha</Text>
              <View style={[
                styles.inputWrapper,
                confirmPassword.length > 0 && password !== confirmPassword && styles.inputWrapperError,
              ]}>
                <Ionicons name="shield-checkmark-outline" size={18} color={Colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, styles.inputFlex]}
                  placeholder="Repita a senha"
                  placeholderTextColor={Colors.textMuted}
                  secureTextEntry={!showConfirm}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
                <TouchableOpacity onPress={() => setShowConfirm(v => !v)} style={styles.eyeBtn}>
                  <Ionicons
                    name={showConfirm ? 'eye-off-outline' : 'eye-outline'}
                    size={18}
                    color={Colors.textMuted}
                  />
                </TouchableOpacity>
              </View>
              {confirmPassword.length > 0 && password !== confirmPassword && (
                <Text style={styles.fieldError}>As senhas não coincidem</Text>
              )}
            </View>

            {/* Erro geral */}
            {!!error && (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle-outline" size={16} color={Colors.error} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {/* Botão */}
            <TouchableOpacity
              style={[styles.btnPrimary, loading && styles.btnDisabled]}
              onPress={handleRegister}
              activeOpacity={0.85}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <>
                  <Ionicons name="checkmark-circle-outline" size={20} color={Colors.white} />
                  <Text style={styles.btnPrimaryText}>Criar conta</Text>
                </>
              )}
            </TouchableOpacity>

            {/* Link Login */}
            <TouchableOpacity
              style={styles.loginLink}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <Text style={styles.loginLinkText}>
                Já tem conta?{' '}
                <Text style={styles.loginLinkHighlight}>Entrar</Text>
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.footer}>
            Ao criar uma conta, você concorda com os{' '}
            <Text style={styles.footerLink}>Termos de Uso</Text> e{' '}
            <Text style={styles.footerLink}>Política de Privacidade</Text>.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  flex: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  header: { marginBottom: Spacing.md },
  backBtn: {
    width: 40, height: 40,
    borderRadius: Radius.md,
    backgroundColor: Colors.backgroundCard,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: Colors.border,
  },
  brand: { alignItems: 'center', marginBottom: Spacing.xxl },
  logoImage: {
    width: 160,
    height: 100,
    marginBottom: Spacing.md,
  },
  appName: {
    fontSize: FontSize.xxl, fontWeight: FontWeight.extraBold,
    color: Colors.textPrimary, letterSpacing: 0.3,
  },
  tagline: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 4 },
  card: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: Radius.xl,
    padding: Spacing.xxl,
    borderWidth: 1, borderColor: Colors.border,
  },
  row: { flexDirection: 'row', gap: Spacing.sm },
  rowFlex: { flex: 2 },
  rowSmall: { flex: 1 },
  inputGroup: { marginBottom: Spacing.md },
  label: {
    fontSize: FontSize.sm, fontWeight: FontWeight.medium,
    color: Colors.textSecondary, marginBottom: Spacing.xs,
  },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: Colors.backgroundInput,
    borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.border,
    paddingHorizontal: Spacing.md, height: 48,
  },
  inputWrapperError: { borderColor: Colors.error },
  inputIcon: { marginRight: Spacing.sm },
  input: { flex: 1, fontSize: FontSize.md, color: Colors.textPrimary },
  inputFlex: { flex: 1 },
  eyeBtn: { padding: 4 },
  fieldError: { fontSize: FontSize.xs, color: Colors.error, marginTop: 4 },
  errorBox: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.xs,
    backgroundColor: '#F4433618',
    borderRadius: Radius.sm,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    marginBottom: Spacing.md,
    borderWidth: 1, borderColor: '#F4433630',
  },
  errorText: { fontSize: FontSize.sm, color: Colors.error, flex: 1 },
  btnPrimary: {
    backgroundColor: Colors.primary, borderRadius: Radius.md, height: 50,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: Spacing.sm, marginTop: Spacing.xs,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35, shadowRadius: 8, elevation: 6,
  },
  btnDisabled: { opacity: 0.6 },
  btnPrimaryText: {
    fontSize: FontSize.md, fontWeight: FontWeight.bold,
    color: Colors.white, letterSpacing: 0.5,
  },
  loginLink: { alignItems: 'center', marginTop: Spacing.lg, paddingVertical: Spacing.sm },
  loginLinkText: { fontSize: FontSize.sm, color: Colors.textSecondary },
  loginLinkHighlight: { color: Colors.primary, fontWeight: FontWeight.semiBold },
  footer: {
    fontSize: FontSize.xs, color: Colors.textMuted,
    textAlign: 'center', marginTop: Spacing.xl, lineHeight: 18,
  },
  footerLink: { color: Colors.primaryLight },
});

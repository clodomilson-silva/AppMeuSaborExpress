import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { addAddress, Address } from '../services/addressService';
import { Colors, FontSize, FontWeight, Radius, Spacing } from '../theme';

export default function AddAddressScreen() {
  const navigation = useNavigation();
  const { user } = useAuth();

  const [label, setLabel] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [complement, setComplement] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [reference, setReference] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function maskCep(v: string) {
    return v.replace(/\D/g, '').slice(0, 8).replace(/(\d{5})(\d)/, '$1-$2');
  }

  async function handleSave() {
    if (!street.trim() || !number.trim() || !neighborhood.trim() || !city.trim() || !state.trim() || !zipCode.trim()) {
      setError('Preencha todos os campos obrigatórios.');
      return;
    }
    if (!user) return;
    setError(''); setLoading(true);
    try {
      const data: Omit<Address, 'id'> = {
        label: label.trim() || undefined,
        street: street.trim(),
        number: number.trim(),
        complement: complement.trim() || undefined,
        neighborhood: neighborhood.trim(),
        city: city.trim(),
        state: state.trim().toUpperCase().slice(0, 2),
        zipCode: zipCode.trim(),
        reference: reference.trim() || undefined,
      };
      await addAddress(user.uid, data);
      navigation.goBack();
    } catch {
      setError('Erro ao salvar endereço. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  const Field = ({
    label: lbl, placeholder, value, onChangeText, keyboard = 'default', maxLen, autoCapitalize = 'sentences',
  }: any) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{lbl}</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={Colors.textMuted}
          keyboardType={keyboard}
          autoCapitalize={autoCapitalize}
          value={value}
          onChangeText={onChangeText}
          maxLength={maxLen}
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Novo Endereço</Text>
            <View style={{ width: 40 }} />
          </View>

          <View style={styles.card}>
            <Field label="Apelido (opcional)" placeholder='Ex: "Casa", "Trabalho"' value={label} onChangeText={setLabel} />

            <View style={styles.row}>
              <View style={[styles.inputGroup, styles.rowFlex]}>
                <Text style={styles.label}>Rua / Av. *</Text>
                <View style={styles.inputWrapper}>
                  <TextInput style={styles.input} placeholder="Rua das Flores" placeholderTextColor={Colors.textMuted} value={street} onChangeText={setStreet} />
                </View>
              </View>
              <View style={[styles.inputGroup, styles.rowSmall]}>
                <Text style={styles.label}>Número *</Text>
                <View style={styles.inputWrapper}>
                  <TextInput style={styles.input} placeholder="123" placeholderTextColor={Colors.textMuted} keyboardType="numeric" value={number} onChangeText={setNumber} maxLength={10} />
                </View>
              </View>
            </View>

            <Field label="Complemento (opcional)" placeholder="Apto 12, Bloco B" value={complement} onChangeText={setComplement} />
            <Field label="Bairro *" placeholder="Centro" value={neighborhood} onChangeText={setNeighborhood} />

            <View style={styles.row}>
              <View style={[styles.inputGroup, styles.rowFlex]}>
                <Text style={styles.label}>Cidade *</Text>
                <View style={styles.inputWrapper}>
                  <TextInput style={styles.input} placeholder="São Paulo" placeholderTextColor={Colors.textMuted} value={city} onChangeText={setCity} />
                </View>
              </View>
              <View style={[styles.inputGroup, styles.rowState]}>
                <Text style={styles.label}>UF *</Text>
                <View style={styles.inputWrapper}>
                  <TextInput style={styles.input} placeholder="SP" placeholderTextColor={Colors.textMuted} autoCapitalize="characters" maxLength={2} value={state} onChangeText={setState} />
                </View>
              </View>
            </View>

            <Field label="CEP *" placeholder="00000-000" value={zipCode} onChangeText={(t: string) => setZipCode(maskCep(t))} keyboard="numeric" maxLen={9} />
            <Field label="Ponto de referência (opcional)" placeholder="Próximo ao mercado" value={reference} onChangeText={setReference} />

            {!!error && (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle-outline" size={16} color={Colors.error} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <TouchableOpacity style={[styles.btn, loading && { opacity: 0.6 }]} onPress={handleSave} disabled={loading} activeOpacity={0.85}>
              {loading ? <ActivityIndicator color={Colors.white} /> : (
                <>
                  <Ionicons name="save-outline" size={20} color={Colors.white} />
                  <Text style={styles.btnText}>Salvar endereço</Text>
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
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: Spacing.md },
  backBtn: { width: 40, height: 40, borderRadius: Radius.md, backgroundColor: Colors.backgroundCard, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.border },
  headerTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  card: { backgroundColor: Colors.backgroundCard, borderRadius: Radius.xl, padding: Spacing.xl, borderWidth: 1, borderColor: Colors.border, marginTop: Spacing.sm },
  row: { flexDirection: 'row', gap: Spacing.sm },
  rowFlex: { flex: 3 },
  rowSmall: { flex: 1.5 },
  rowState: { flex: 1 },
  inputGroup: { marginBottom: Spacing.md },
  label: { fontSize: FontSize.sm, fontWeight: FontWeight.medium, color: Colors.textSecondary, marginBottom: Spacing.xs },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.backgroundInput, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.border, paddingHorizontal: Spacing.md, height: 48 },
  input: { flex: 1, fontSize: FontSize.md, color: Colors.textPrimary },
  errorBox: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, backgroundColor: '#F4433618', borderRadius: Radius.sm, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, marginBottom: Spacing.md, borderWidth: 1, borderColor: '#F4433630' },
  errorText: { fontSize: FontSize.sm, color: Colors.error, flex: 1 },
  btn: { backgroundColor: Colors.primary, borderRadius: Radius.md, height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 8, elevation: 6 },
  btnText: { fontSize: FontSize.md, fontWeight: FontWeight.bold, color: Colors.white },
});

import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, StatusBar,
  FlatList, Alert, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { getUserAddresses, deleteAddress, Address } from '../services/addressService';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Colors, FontSize, FontWeight, Radius, Spacing } from '../theme';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

export default function EnderecosScreen() {
  const navigation = useNavigation<NavProp>();
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAddresses = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getUserAddresses(user.uid);
      setAddresses(data);
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  }, [user]);

  useFocusEffect(useCallback(() => { fetchAddresses(); }, [fetchAddresses]));

  async function handleDelete(id: string) {
    Alert.alert('Remover endereço', 'Deseja remover este endereço?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover', style: 'destructive',
        onPress: async () => {
          if (!user) return;
          await deleteAddress(user.uid, id);
          setAddresses((prev) => prev.filter((a) => a.id !== id));
        },
      },
    ]);
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Endereços</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('AddAddress')}
        >
          <Ionicons name="add" size={22} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={Colors.primary} size="large" />
        </View>
      ) : addresses.length === 0 ? (
        <View style={styles.center}>
          <Ionicons name="location-outline" size={56} color={Colors.textMuted} />
          <Text style={styles.emptyTitle}>Nenhum endereço cadastrado</Text>
          <Text style={styles.emptySubtitle}>Adicione um endereço para facilitar seus pedidos.</Text>
          <TouchableOpacity style={styles.emptyBtn} onPress={() => navigation.navigate('AddAddress')}>
            <Text style={styles.emptyBtnText}>Adicionar endereço</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={addresses}
          keyExtractor={(item) => item.id!}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={{ height: Spacing.sm }} />}
          renderItem={({ item }) => (
            <View style={styles.addressCard}>
              <View style={styles.addressIcon}>
                <Ionicons name="location" size={22} color={Colors.primary} />
              </View>
              <View style={styles.addressInfo}>
                {item.label && <Text style={styles.addressLabel}>{item.label}</Text>}
                <Text style={styles.addressMain}>
                  {item.street}, {item.number}
                  {item.complement ? ` – ${item.complement}` : ''}
                </Text>
                <Text style={styles.addressSub}>
                  {item.neighborhood}, {item.city} – {item.state}
                </Text>
                <Text style={styles.addressSub}>CEP {item.zipCode}</Text>
              </View>
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => handleDelete(item.id!)}
              >
                <Ionicons name="trash-outline" size={18} color={Colors.error} />
              </TouchableOpacity>
            </View>
          )}
        />
      )}
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
  addBtn: {
    width: 40, height: 40, borderRadius: Radius.md,
    backgroundColor: Colors.backgroundCard,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: Colors.border,
  },
  headerTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.textPrimary },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: Spacing.xl },
  emptyTitle: { fontSize: FontSize.lg, fontWeight: FontWeight.bold, color: Colors.textPrimary, marginTop: Spacing.md },
  emptySubtitle: { fontSize: FontSize.sm, color: Colors.textSecondary, textAlign: 'center', marginTop: Spacing.sm, lineHeight: 20 },
  emptyBtn: {
    marginTop: Spacing.xl, paddingHorizontal: Spacing.xxl, paddingVertical: Spacing.md,
    backgroundColor: Colors.primary, borderRadius: Radius.md,
  },
  emptyBtnText: { color: Colors.white, fontWeight: FontWeight.bold, fontSize: FontSize.md },
  list: { padding: Spacing.lg },
  addressCard: {
    flexDirection: 'row', alignItems: 'flex-start',
    backgroundColor: Colors.backgroundCard,
    borderRadius: Radius.lg, padding: Spacing.md,
    borderWidth: 1, borderColor: Colors.border,
  },
  addressIcon: {
    width: 40, height: 40, borderRadius: Radius.sm,
    backgroundColor: Colors.background,
    alignItems: 'center', justifyContent: 'center',
    marginRight: Spacing.md,
  },
  addressInfo: { flex: 1 },
  addressLabel: { fontSize: FontSize.sm, fontWeight: FontWeight.bold, color: Colors.primary, marginBottom: 2 },
  addressMain: { fontSize: FontSize.md, fontWeight: FontWeight.medium, color: Colors.textPrimary },
  addressSub: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 1 },
  deleteBtn: { padding: Spacing.sm },
});

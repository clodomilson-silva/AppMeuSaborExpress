import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import * as Location from 'expo-location';
import { Colors, FontSize, FontWeight, Radius, Spacing } from '../theme';
import { categories } from '../data/categories';
import { mostOrdered, featured, promoProduct } from '../data/products';
import PromoBanner from '../components/PromoBanner';
import CategoryItem from '../components/CategoryItem';
import ProductCardLarge from '../components/ProductCardLarge';
import ProductCardSmall from '../components/ProductCardSmall';
import SearchBar from '../components/SearchBar';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Product } from '../data/products';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

type LocationState = 'loading' | 'granted' | 'denied' | 'error';

export default function HomeScreen() {
  const [search, setSearch] = useState('');
  const navigation = useNavigation<NavProp>();
  const tabBarHeight = useBottomTabBarHeight();

  const [locationState, setLocationState] = useState<LocationState>('loading');
  const [addressLine, setAddressLine] = useState('Obtendo localização...');
  const [cityLine, setCityLine] = useState('');

  const homeCategories = categories.filter(c => c.id !== 'all');

  const fetchLocation = useCallback(async () => {
    setLocationState('loading');
    setAddressLine('Obtendo localização...');
    setCityLine('');

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationState('denied');
        setAddressLine('Permissão negada');
        setCityLine('Toque para tentar novamente');
        return;
      }

      const coords = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const [place] = await Location.reverseGeocodeAsync({
        latitude: coords.coords.latitude,
        longitude: coords.coords.longitude,
      });

      if (place) {
        const street = place.street
          ? `${place.street}${place.streetNumber ? ', ' + place.streetNumber : ''}`
          : place.name ?? 'Endereço desconhecido';
        const city = [place.district, place.city, place.region]
          .filter(Boolean)
          .join(' - ');

        setAddressLine(street);
        setCityLine(city);
        setLocationState('granted');
      } else {
        setAddressLine('Localização obtida');
        setCityLine(`${coords.coords.latitude.toFixed(4)}, ${coords.coords.longitude.toFixed(4)}`);
        setLocationState('granted');
      }
    } catch {
      setLocationState('error');
      setAddressLine('Erro ao obter localização');
      setCityLine('Toque para tentar novamente');
    }
  }, []);

  useEffect(() => {
    fetchLocation();
  }, [fetchLocation]);

  const handleProductPress = (product: Product) => {
    navigation.navigate('ProductDetail', { product });
  };

  const isRetryable = locationState === 'denied' || locationState === 'error';

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: tabBarHeight + Spacing.md }]}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.addressRow}
            onPress={isRetryable ? fetchLocation : undefined}
            activeOpacity={isRetryable ? 0.7 : 1}
          >
            {locationState === 'loading' ? (
              <ActivityIndicator size="small" color={Colors.primary} style={styles.locationIcon} />
            ) : (
              <Ionicons
                name={isRetryable ? 'location-outline' : 'location'}
                size={18}
                color={isRetryable ? Colors.textMuted : Colors.primary}
                style={styles.locationIcon}
              />
            )}
            <View>
              <Text style={styles.deliverTo}>Entregar em</Text>
              <Text
                style={[
                  styles.address,
                  locationState === 'loading' && styles.addressLoading,
                  isRetryable && styles.addressError,
                ]}
                numberOfLines={1}
              >
                {addressLine}
              </Text>
              {cityLine ? (
                <Text style={styles.cityLine} numberOfLines={1}>
                  {cityLine}
                </Text>
              ) : null}
            </View>
          </TouchableOpacity>

          <View style={styles.brandBadge}>
            <Ionicons name="restaurant" size={20} color={Colors.primary} />
          </View>
        </View>

        {/* Search */}
        <SearchBar
          value={search}
          onChangeText={setSearch}
          placeholder="Buscar no cardápio..."
        />

        {/* Promo Banner */}
        <PromoBanner
          title={promoProduct.name}
          description="Burger + Batata + Refri por apenas"
          price={promoProduct.price}
          onPress={() => handleProductPress(promoProduct)}
        />

        {/* Categorias */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categorias</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesRow}
        >
          {homeCategories.map((cat) => (
            <CategoryItem
              key={cat.id}
              emoji={cat.emoji}
              name={cat.name}
              onPress={() => {}}
            />
          ))}
        </ScrollView>

        {/* Mais Pedidos */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Mais Pedidos</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>Ver tudo</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.gridRow}>
          {mostOrdered.map((product) => (
            <ProductCardLarge
              key={product.id}
              product={product}
              onPress={handleProductPress}
            />
          ))}
        </View>

        {/* Destaques */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Destaques</Text>
        </View>
        {featured.map((product) => (
          <ProductCardSmall
            key={product.id}
            product={product}
            onPress={handleProductPress}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flex: 1,
  },
  content: {},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    flex: 1,
    marginRight: Spacing.sm,
  },
  locationIcon: {
    marginTop: 2,
  },
  deliverTo: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  address: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semiBold,
    color: Colors.textPrimary,
    maxWidth: 220,
  },
  addressLoading: {
    color: Colors.textMuted,
    fontWeight: FontWeight.regular,
  },
  addressError: {
    color: Colors.textMuted,
  },
  cityLine: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    maxWidth: 220,
  },
  brandBadge: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: Colors.backgroundCard,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.primary + '55',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  seeAll: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    fontWeight: FontWeight.semiBold,
  },
  categoriesRow: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.lg,
    paddingBottom: Spacing.sm,
  },
  gridRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
});

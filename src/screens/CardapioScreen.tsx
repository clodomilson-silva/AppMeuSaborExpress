import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { Colors, FontSize, FontWeight, Spacing } from '../theme';
import { categories } from '../data/categories';
import { products, Product } from '../data/products';
import SearchBar from '../components/SearchBar';
import CategoryFilter from '../components/CategoryFilter';
import ProductCardSmall from '../components/ProductCardSmall';
import { RootStackParamList } from '../navigation/AppNavigator';
import { TabParamList } from '../navigation/TabNavigator';
import { useCategory } from '../context/CategoryContext';

type NavProp = NativeStackNavigationProp<RootStackParamList>;
type CardapioRouteProp = RouteProp<TabParamList, 'Cardapio'>;

export default function CardapioScreen() {
  const [search, setSearch] = useState('');
  const navigation = useNavigation<NavProp>();
  const route = useRoute<CardapioRouteProp>();
  const tabBarHeight = useBottomTabBarHeight();
  const { selectedCategory, setSelectedCategory } = useCategory();

  useEffect(() => {
    const incomingCategory = route.params?.categoryId;
    if (!incomingCategory) return;

    const isValid = categories.some((c) => c.id === incomingCategory);
    if (isValid) {
      setSelectedCategory(incomingCategory);
    }
  }, [route.params?.categoryId, setSelectedCategory]);

  useEffect(() => {
    const incomingSearch = route.params?.searchQuery;
    if (incomingSearch === undefined) return;
    setSearch(incomingSearch);
  }, [route.params?.searchQuery]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
      const matchesSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [search, selectedCategory]);

  const handleProductPress = (product: Product) => {
    navigation.navigate('ProductDetail', { product });
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      <View style={styles.headerBar}>
        <Text style={styles.title}>Cardápio</Text>
      </View>
      <SearchBar
        value={search}
        onChangeText={setSearch}
        placeholder="Buscar produto..."
      />
      <CategoryFilter
        categories={categories}
        selectedId={selectedCategory}
        onSelect={setSelectedCategory}
      />
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProductCardSmall product={item} onPress={handleProductPress} />
        )}
        style={styles.list}
        contentContainerStyle={{ paddingTop: Spacing.sm, paddingBottom: tabBarHeight + Spacing.md }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Nenhum produto encontrado</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerBar: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xs,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  list: {
    flex: 1,
  },
  empty: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    color: Colors.textMuted,
    fontSize: FontSize.md,
  },
});

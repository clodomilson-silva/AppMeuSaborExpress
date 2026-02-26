import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  StatusBar,
  Dimensions,
  ToastAndroid,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { Colors, FontSize, FontWeight, Radius, Spacing } from '../theme';
import AddonItem from '../components/AddonItem';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useCart } from '../context/CartContext';

type RouteType = RouteProp<RootStackParamList, 'ProductDetail'>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IMAGE_HEIGHT = SCREEN_WIDTH * 0.65;

export default function ProductDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteType>();
  const { product } = route.params;
  const { addItem } = useCart();

  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [observations, setObservations] = useState('');
  const [quantity, setQuantity] = useState(1);

  function handleAddToCart() {
    const chosenAddons = (product.addons || []).filter((a) =>
      selectedAddons.includes(a.id),
    );
    addItem(product, quantity, chosenAddons, observations);

    if (Platform.OS === 'android') {
      ToastAndroid.show('Item adicionado ao carrinho!', ToastAndroid.SHORT);
    } else {
      Alert.alert('Adicionado!', `${product.name} foi adicionado ao carrinho.`);
    }
    navigation.goBack();
  }

  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const addonTotal = (product.addons || [])
    .filter((a) => selectedAddons.includes(a.id))
    .reduce((sum, a) => sum + a.price, 0);

  const totalPrice = (product.price + addonTotal) * quantity;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product.imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.gradient} />
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={20} color={Colors.white} />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Name & Price */}
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.description}>{product.description}</Text>
          <Text style={styles.price}>
            R$ {product.price.toFixed(2).replace('.', ',')}
          </Text>

          {/* Adicionais */}
          {product.addons && product.addons.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Adicionais</Text>
              {product.addons.map((addon) => (
                <AddonItem
                  key={addon.id}
                  name={addon.name}
                  price={addon.price}
                  selected={selectedAddons.includes(addon.id)}
                  onPress={() => toggleAddon(addon.id)}
                />
              ))}
            </>
          )}

          {/* Observações */}
          <Text style={styles.sectionTitle}>Observações</Text>
          <TextInput
            style={styles.textArea}
            value={observations}
            onChangeText={setObservations}
            placeholder="Ex: sem cebola, molho à parte..."
            placeholderTextColor={Colors.textMuted}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            selectionColor={Colors.primary}
          />

          <View style={{ height: 120 }} />
        </View>
      </ScrollView>

      {/* Bottom Add to Cart */}
      <SafeAreaView edges={['bottom']} style={styles.bottomBar}>
        <View style={styles.qtyRow}>
          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => setQuantity(Math.max(1, quantity - 1))}
          >
            <Ionicons name="remove" size={18} color={Colors.white} />
          </TouchableOpacity>
          <Text style={styles.qtyText}>{quantity}</Text>
          <TouchableOpacity
            style={styles.qtyBtn}
            onPress={() => setQuantity(quantity + 1)}
          >
            <Ionicons name="add" size={18} color={Colors.white} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.addBtn} activeOpacity={0.85} onPress={handleAddToCart}>
          <Text style={styles.addBtnText}>
            Adicionar • R$ {totalPrice.toFixed(2).replace('.', ',')}
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flex: 1,
  },
  imageContainer: {
    width: '100%',
    height: IMAGE_HEIGHT,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: 'transparent',
    // Simulate a gradient using a very transparent overlay
  },
  backBtn: {
    position: 'absolute',
    top: 50,
    left: Spacing.lg,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: Spacing.lg,
  },
  productName: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.extraBold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  description: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  price: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.extraBold,
    color: Colors.primary,
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
    marginTop: Spacing.md,
  },
  textArea: {
    backgroundColor: Colors.backgroundCard,
    borderRadius: Radius.md,
    padding: Spacing.md,
    color: Colors.textPrimary,
    fontSize: FontSize.md,
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: 90,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.backgroundCard,
    borderRadius: Radius.md,
    padding: Spacing.xs,
  },
  qtyBtn: {
    width: 34,
    height: 34,
    borderRadius: Radius.sm,
    backgroundColor: Colors.backgroundInput,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.white,
    minWidth: 20,
    textAlign: 'center',
  },
  addBtn: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  addBtnText: {
    color: Colors.white,
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
  },
});

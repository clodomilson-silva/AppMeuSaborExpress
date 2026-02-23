import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
} from 'react-native';
import { Colors, FontSize, FontWeight, Radius, Spacing } from '../theme';
import { Product } from '../data/products';

const CARD_WIDTH = (Dimensions.get('window').width - Spacing.lg * 2 - Spacing.sm) / 2;

interface Props {
  product: Product;
  onPress: (product: Product) => void;
}

export default function ProductCardLarge({ product, onPress }: Props) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(product)}
      activeOpacity={0.85}
    >
      <Image
        source={{ uri: product.imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
        <Text style={styles.price}>R$ {product.price.toFixed(2).replace('.', ',')}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: Colors.backgroundCard,
    borderRadius: Radius.lg,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 130,
  },
  info: {
    padding: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  name: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semiBold,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  price: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },
});

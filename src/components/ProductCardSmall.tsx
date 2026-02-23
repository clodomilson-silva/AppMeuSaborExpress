import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { Colors, FontSize, FontWeight, Radius, Spacing } from '../theme';
import { Product } from '../data/products';

interface Props {
  product: Product;
  onPress: (product: Product) => void;
}

export default function ProductCardSmall({ product, onPress }: Props) {
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
        <Text style={styles.name} numberOfLines={1}>{product.name}</Text>
        <Text style={styles.description} numberOfLines={2}>{product.description}</Text>
        <Text style={styles.price}>R$ {product.price.toFixed(2).replace('.', ',')}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.backgroundCard,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  image: {
    width: 80,
    height: 80,
    margin: Spacing.sm,
    borderRadius: Radius.md,
  },
  info: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingRight: Spacing.md,
    justifyContent: 'center',
    gap: 3,
  },
  name: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semiBold,
    color: Colors.textPrimary,
  },
  description: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  price: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
    marginTop: 2,
  },
});

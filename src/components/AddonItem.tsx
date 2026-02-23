import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Colors, FontSize, FontWeight, Radius, Spacing } from '../theme';

interface Props {
  name: string;
  price: number;
  selected: boolean;
  onPress: () => void;
}

export default function AddonItem({ name, price, selected, onPress }: Props) {
  return (
    <TouchableOpacity
      style={[styles.container, selected && styles.containerSelected]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.name, selected && styles.nameSelected]}>{name}</Text>
      <View style={[styles.badge, selected && styles.badgeSelected]}>
        <Text style={[styles.priceText, selected && styles.priceSelected]}>
          + R$ {price.toFixed(2).replace('.', ',')}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.backgroundCard,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  containerSelected: {
    borderColor: Colors.primary,
    backgroundColor: '#2A1A0F',
  },
  name: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
    color: Colors.textPrimary,
  },
  nameSelected: {
    color: Colors.primary,
  },
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.sm,
    backgroundColor: Colors.backgroundInput,
  },
  badgeSelected: {
    backgroundColor: Colors.primary,
  },
  priceText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semiBold,
    color: Colors.textSecondary,
  },
  priceSelected: {
    color: Colors.white,
  },
});

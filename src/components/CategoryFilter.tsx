import React from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Colors, FontSize, FontWeight, Radius, Spacing } from '../theme';
import { Category } from '../data/categories';

interface Props {
  categories: Category[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export default function CategoryFilter({ categories, selectedId, onSelect }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
      // Permite que bordas e sombras dos pills não sejam cortadas verticalmente
      style={styles.scroll}
    >
      {categories.map((cat) => {
        const isSelected = cat.id === selectedId;
        return (
          <TouchableOpacity
            key={cat.id}
            style={[styles.pill, isSelected && styles.pillActive]}
            onPress={() => onSelect(cat.id)}
            activeOpacity={0.75}
          >
            <Text style={styles.emoji}>{cat.emoji}</Text>
            <Text
              style={[styles.label, isSelected && styles.labelActive]}
              numberOfLines={1}
            >
              {cat.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 0,           // não expande verticalmente além do necessário
    flexShrink: 0,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,  // mais espaço vertical para não cortar bordas
    gap: Spacing.sm,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundCard,
    paddingHorizontal: Spacing.md,
    paddingVertical: 9,           // altura confortável para o texto + bordas
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Colors.border,
    gap: 5,
    // Evita que o pill seja comprimido horizontalmente
    flexShrink: 0,
  },
  pillActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  emoji: {
    fontSize: 14,
    lineHeight: 18,
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  labelActive: {
    color: Colors.white,
    fontWeight: FontWeight.bold,
  },
});

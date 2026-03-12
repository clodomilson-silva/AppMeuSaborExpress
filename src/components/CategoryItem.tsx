import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, Radius, Spacing } from '../theme';

interface Props {
  icon: keyof typeof Ionicons.glyphMap;
  name: string;
  onPress: () => void;
  selected?: boolean;
}

function resolveIconName(
  icon: keyof typeof Ionicons.glyphMap,
  selected: boolean,
): keyof typeof Ionicons.glyphMap {
  if (!selected) return icon;

  const filledCandidate = String(icon).endsWith('-outline')
    ? String(icon).replace('-outline', '')
    : String(icon);

  return (filledCandidate in Ionicons.glyphMap
    ? filledCandidate
    : icon) as keyof typeof Ionicons.glyphMap;
}

export default function CategoryItem({ icon, name, onPress, selected = false }: Props) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.iconCircle, selected && styles.iconCircleActive]}>
        <Ionicons
          name={resolveIconName(icon, selected)}
          size={24}
          color={selected ? Colors.white : Colors.primary}
        />
      </View>
      <Text style={[styles.label, selected && styles.labelActive]}>{name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: 64,
    gap: Spacing.xs,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: Radius.full,
    backgroundColor: Colors.backgroundCard,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  iconCircleActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  label: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    textAlign: 'center',
    fontWeight: FontWeight.medium,
  },
  labelActive: {
    color: Colors.textPrimary,
    fontWeight: FontWeight.semiBold,
  },
});

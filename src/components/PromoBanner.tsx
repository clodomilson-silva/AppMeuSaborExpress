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
  tag?: string;
  title: string;
  description: string;
  price: number;
  onPress?: () => void;
}

export default function PromoBanner({ tag = 'PROMOÇÃO DO DIA', title, description, price, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.overlay} />
      <Text style={styles.tag}>{tag}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      <View style={styles.footer}>
        <Text style={styles.price}>R$ {price.toFixed(2).replace('.', ',')}</Text>
        <View style={styles.button}>
          <Text style={styles.buttonText}>Ver oferta</Text>
          <Ionicons name="arrow-forward" size={14} color={Colors.primary} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.md,
    backgroundColor: Colors.primary,
    borderRadius: Radius.lg,
    padding: Spacing.xl,
    overflow: 'hidden',
  },
  overlay: {
    position: 'absolute',
    right: -30,
    top: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  tag: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: 'rgba(255,255,255,0.75)',
    letterSpacing: 1.2,
    marginBottom: Spacing.xs,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.extraBold,
    color: Colors.white,
    marginBottom: Spacing.xs,
  },
  description: {
    fontSize: FontSize.sm,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: Spacing.lg,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.extraBold,
    color: Colors.white,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
  },
  buttonText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.primary,
  },
});

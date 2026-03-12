import { Ionicons } from '@expo/vector-icons';

export interface Category {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
}

export const categories: Category[] = [
  { id: 'all', name: 'Todos', icon: 'apps-outline' },
  { id: 'lanches', name: 'Lanches', icon: 'fast-food-outline' },
  { id: 'bebidas', name: 'Bebidas', icon: 'beer-outline' },
  { id: 'sobremesas', name: 'Sobremesas', icon: 'ice-cream-outline' },
  { id: 'combos', name: 'Combos', icon: 'gift-outline' },
  { id: 'porcoes', name: 'Porções', icon: 'restaurant-outline' },
];

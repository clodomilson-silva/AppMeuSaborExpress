export interface Category {
  id: string;
  name: string;
  emoji: string;
}

export const categories: Category[] = [
  { id: 'all', name: 'Todos', emoji: '🍽️' },
  { id: 'lanches', name: 'Lanches', emoji: '🍔' },
  { id: 'bebidas', name: 'Bebidas', emoji: '🥤' },
  { id: 'sobremesas', name: 'Sobremesas', emoji: '🎂' },
  { id: 'combos', name: 'Combos', emoji: '🎁' },
  { id: 'porcoes', name: 'Porções', emoji: '🍟' },
];

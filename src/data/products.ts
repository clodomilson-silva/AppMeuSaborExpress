export interface Addon {
  id: string;
  name: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  addons?: Addon[];
  isFeatured?: boolean;
  isMostOrdered?: boolean;
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Smash Burger Duplo',
    description: 'Dois smash de carne 90g, queijo cheddar, cebola caramelizada, picles e molho especial',
    price: 32.90,
    category: 'lanches',
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80',
    isFeatured: true,
    isMostOrdered: true,
    addons: [
      { id: 'a1', name: 'Molho barbecue', price: 2.00 },
      { id: 'a2', name: 'Cheddar extra', price: 4.00 },
      { id: 'a3', name: 'Bacon crocante', price: 5.00 },
    ],
  },
  {
    id: '2',
    name: 'X-Tudo Especial',
    description: 'Carne 150g, presunto, bacon, ovo, queijo, alface, tomate e molho da casa',
    price: 38.90,
    category: 'lanches',
    imageUrl: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&q=80',
    isMostOrdered: true,
    addons: [
      { id: 'a1', name: 'Cheddar extra', price: 4.00 },
      { id: 'a2', name: 'Ovo extra', price: 3.00 },
      { id: 'a3', name: 'Molho especial', price: 2.00 },
    ],
  },
  {
    id: '3',
    name: 'Chicken Crispy',
    description: 'Frango empanado crocante, maionese temperada, alface e tomate no pão brioche',
    price: 29.90,
    category: 'lanches',
    imageUrl: 'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400&q=80',
    isMostOrdered: true,
    addons: [
      { id: 'a1', name: 'Molho barbecue', price: 2.00 },
      { id: 'a2', name: 'Cheddar extra', price: 4.00 },
    ],
  },
  {
    id: '4',
    name: 'Coca-Cola 350ml',
    description: 'Coca-Cola lata gelada',
    price: 7.90,
    category: 'bebidas',
    imageUrl: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=400&q=80',
    isMostOrdered: true,
  },
  {
    id: '5',
    name: 'Suco Natural Laranja',
    description: 'Suco de laranja natural 400ml',
    price: 12.90,
    category: 'bebidas',
    imageUrl: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&q=80',
  },
  {
    id: '6',
    name: 'Milkshake Ovomaltine',
    description: 'Milkshake cremoso de Ovomaltine 500ml',
    price: 19.90,
    category: 'bebidas',
    imageUrl: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=400&q=80',
  },
  {
    id: '7',
    name: 'Brownie com Sorvete',
    description: 'Brownie de chocolate quente com sorvete de creme e calda de chocolate',
    price: 22.90,
    category: 'sobremesas',
    imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&q=80',
    isFeatured: true,
  },
  {
    id: '8',
    name: 'Petit Gateau',
    description: 'Bolinho de chocolate com interior cremoso, acompanha sorvete de baunilha',
    price: 24.90,
    category: 'sobremesas',
    imageUrl: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400&q=80',
  },
  {
    id: '9',
    name: 'Combo Smash',
    description: 'Smash Burger Duplo + Batata Frita + Coca-Cola 350ml',
    price: 45.90,
    category: 'combos',
    imageUrl: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=400&q=80',
    isFeatured: true,
    addons: [
      { id: 'a1', name: 'Molho barbecue', price: 2.00 },
      { id: 'a2', name: 'Cheddar extra', price: 4.00 },
    ],
  },
  {
    id: '10',
    name: 'Batata Frita Canoa',
    description: 'Batata canoa crocante porção grande com molho especial',
    price: 18.90,
    category: 'porcoes',
    imageUrl: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&q=80',
  },
];

export const promoProduct = products.find(p => p.id === '9')!;
export const mostOrdered = products.filter(p => p.isMostOrdered);
export const featured = products.filter(p => p.isFeatured);

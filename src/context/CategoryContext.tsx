import React, { createContext, ReactNode, useContext, useState } from 'react';

interface CategoryContextData {
  selectedCategory: string;
  setSelectedCategory: (categoryId: string) => void;
}

const CategoryContext = createContext<CategoryContextData>({} as CategoryContextData);

export function CategoryProvider({ children }: { children: ReactNode }) {
  const [selectedCategory, setSelectedCategory] = useState('all');

  return (
    <CategoryContext.Provider value={{ selectedCategory, setSelectedCategory }}>
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategory() {
  return useContext(CategoryContext);
}

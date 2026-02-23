import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import CardapioScreen from '../screens/CardapioScreen';
import CarrinhoScreen from '../screens/CarrinhoScreen';
import PedidosScreen from '../screens/PedidosScreen';
import PerfilScreen from '../screens/PerfilScreen';
import { Colors, FontSize } from '../theme';

export type TabParamList = {
  Inicio: undefined;
  Cardapio: undefined;
  Carrinho: undefined;
  Pedidos: undefined;
  Perfil: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

export default function TabNavigator() {
  const insets = useSafeAreaInsets();

  // Respeita a barra de navegação do sistema (botões voltar/home no Android,
  // home indicator no iPhone). Garante no mínimo 8px de padding.
  const tabBarPaddingBottom = Math.max(insets.bottom, 8);
  const tabBarHeight = 56 + tabBarPaddingBottom;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: [
          styles.tabBar,
          { paddingBottom: tabBarPaddingBottom, height: tabBarHeight },
        ],
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ focused, color }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';
          if (route.name === 'Inicio') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Cardapio') {
            iconName = focused ? 'restaurant' : 'restaurant-outline';
          } else if (route.name === 'Carrinho') {
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (route.name === 'Pedidos') {
            iconName = focused ? 'receipt' : 'receipt-outline';
          } else if (route.name === 'Perfil') {
            iconName = focused ? 'person' : 'person-outline';
          }
          return <Ionicons name={iconName} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Inicio" component={HomeScreen} options={{ tabBarLabel: 'Início' }} />
      <Tab.Screen name="Cardapio" component={CardapioScreen} options={{ tabBarLabel: 'Cardápio' }} />
      <Tab.Screen name="Carrinho" component={CarrinhoScreen} options={{ tabBarLabel: 'Carrinho' }} />
      <Tab.Screen name="Pedidos" component={PedidosScreen} />
      <Tab.Screen name="Perfil" component={PerfilScreen} options={{ tabBarLabel: 'Perfil' }} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.tabBarBg,
    borderTopColor: Colors.tabBarBorder,
    borderTopWidth: 1,
    paddingTop: 8,
  },
  tabLabel: {
    fontSize: FontSize.xs,
    marginTop: 2,
  },
});

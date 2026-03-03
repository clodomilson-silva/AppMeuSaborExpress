import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import EnderecosScreen from '../screens/EnderecosScreen';
import AddAddressScreen from '../screens/AddAddressScreen';
import HistoricoPedidosScreen from '../screens/HistoricoPedidosScreen';
import PagamentosScreen from '../screens/PagamentosScreen';
import ConfiguracoesScreen from '../screens/ConfiguracoesScreen';
import { useAuth } from '../context/AuthContext';
import { Product } from '../data/products';
import { Colors } from '../theme';

export type RootStackParamList = {
  MainTabs: undefined;
  ProductDetail: { product: Product };
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  Checkout: undefined;
  EditProfile: undefined;
  Enderecos: undefined;
  AddAddress: undefined;
  HistoricoPedidos: undefined;
  Pagamentos: undefined;
  Configuracoes: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="MainTabs"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="MainTabs" component={TabNavigator} />
        <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="Enderecos" component={EnderecosScreen} options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="AddAddress" component={AddAddressScreen} options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="HistoricoPedidos" component={HistoricoPedidosScreen} options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="Pagamentos" component={PagamentosScreen} options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="Configuracoes" component={ConfiguracoesScreen} options={{ animation: 'slide_from_right' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1, backgroundColor: Colors.background,
    alignItems: 'center', justifyContent: 'center',
  },
});

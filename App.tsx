import React from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  Text,
  TextInput,
  StyleSheet,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import {
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import {
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto';
import { AuthProvider } from './src/context/AuthContext';
import { CartProvider } from './src/context/CartContext';
import { OrderProvider } from './src/context/OrderContext';
import { CategoryProvider } from './src/context/CategoryContext';
import AppNavigator from './src/navigation/AppNavigator';

function toNumericWeight(fontWeight?: string): number {
  if (!fontWeight) return 400;
  if (fontWeight === 'normal') return 400;
  if (fontWeight === 'bold') return 700;

  const parsed = Number(fontWeight);
  return Number.isFinite(parsed) ? parsed : 400;
}

function resolveTextFamily(fontWeight?: string, fontSize?: number): string {
  const weight = toNumericWeight(fontWeight);
  const size = Number(fontSize ?? 0);

  // Poppins apenas para titulos: peso alto + tamanho de titulo.
  if (size >= 16 && weight >= 700) {
    return 'Poppins_700Bold';
  }

  if (size >= 16 && weight >= 600) {
    return 'Poppins_600SemiBold';
  }

  if (weight >= 700) {
    return 'Roboto_700Bold';
  }

  if (weight >= 500) {
    return 'Roboto_500Medium';
  }

  return 'Roboto_400Regular';
}

function applyGlobalTypography() {
  if ((Text as any).__globalTypographyPatched) return;

  const originalTextRender = (Text as any).render;
  (Text as any).render = function patchedTextRender(...args: any[]) {
    const origin = originalTextRender.apply(this, args);
    const flattened = StyleSheet.flatten(origin.props.style) ?? {};
    const hasCustomFamily = Boolean(flattened.fontFamily);
    const resolvedFamily = resolveTextFamily(flattened.fontWeight, flattened.fontSize);

    return React.cloneElement(origin, {
      style: [origin.props.style, !hasCustomFamily && { fontFamily: resolvedFamily }],
    });
  };

  const originalTextInputRender = (TextInput as any).render;
  (TextInput as any).render = function patchedTextInputRender(...args: any[]) {
    const origin = originalTextInputRender.apply(this, args);
    const flattened = StyleSheet.flatten(origin.props.style) ?? {};
    const hasCustomFamily = Boolean(flattened.fontFamily);

    return React.cloneElement(origin, {
      style: [origin.props.style, !hasCustomFamily && { fontFamily: 'Roboto_400Regular' }],
    });
  };

  (Text as any).__globalTypographyPatched = true;
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_600SemiBold,
    Poppins_700Bold,
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  applyGlobalTypography();

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <CartProvider>
          <CategoryProvider>
            <OrderProvider>
              <StatusBar style="light" />
              <AppNavigator />
            </OrderProvider>
          </CategoryProvider>
        </CartProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

import React, { useEffect, useRef } from 'react';
import {
  View,
  Animated,
  Image,
  Text,
  StyleSheet,
  StatusBar,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAuth } from '../context/AuthContext';
import { Colors, FontSize, FontWeight } from '../theme';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'Splash'>;

const { width } = Dimensions.get('window');

export default function SplashScreen() {
  const navigation = useNavigation<NavProp>();
  const { loading } = useAuth();
  const loadingRef = useRef(loading);
  useEffect(() => { loadingRef.current = loading; }, [loading]);

  // Animated values
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale  = useRef(new Animated.Value(0.55)).current;
  const nameOpacity = useRef(new Animated.Value(0)).current;
  const nameY       = useRef(new Animated.Value(22)).current;
  const sloganOpacity = useRef(new Animated.Value(0)).current;
  const dot1Opacity = useRef(new Animated.Value(0)).current;
  const dot2Opacity = useRef(new Animated.Value(0)).current;
  const dot3Opacity = useRef(new Animated.Value(0)).current;
  const screenOpacity = useRef(new Animated.Value(1)).current;

  const navigateAway = useRef(() => {
    Animated.timing(screenOpacity, {
      toValue: 0,
      duration: 350,
      useNativeDriver: true,
    }).start(() => {
      navigation.replace('MainTabs');
    });
  }).current;

  useEffect(() => {
    Animated.sequence([
      // Logo entra
      Animated.parallel([
        Animated.timing(logoOpacity, { toValue: 1, duration: 650, useNativeDriver: true }),
        Animated.spring(logoScale, { toValue: 1, friction: 6, tension: 45, useNativeDriver: true }),
      ]),
      // Nome do app sobe
      Animated.delay(80),
      Animated.parallel([
        Animated.timing(nameOpacity, { toValue: 1, duration: 380, useNativeDriver: true }),
        Animated.timing(nameY, { toValue: 0, duration: 380, useNativeDriver: true }),
      ]),
      // Slogan aparece
      Animated.delay(150),
      Animated.timing(sloganOpacity, { toValue: 1, duration: 380, useNativeDriver: true }),
      // Dots em cascata
      Animated.delay(200),
      Animated.timing(dot1Opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.timing(dot2Opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.timing(dot3Opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      // Espera mínima
      Animated.delay(800),
    ]).start(() => {
      const tryNavigate = () => {
        if (!loadingRef.current) {
          navigateAway();
        } else {
          setTimeout(tryNavigate, 120);
        }
      };
      tryNavigate();
    });
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: screenOpacity }]}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* Círculo decorativo de fundo (superior) */}
      <View style={styles.circleTop} />
      {/* Círculo decorativo de fundo (inferior) */}
      <View style={styles.circleBottom} />

      {/* Logo */}
      <Animated.Image
        source={require('../../assets/logo (1).png')}
        style={[
          styles.logo,
          { opacity: logoOpacity, transform: [{ scale: logoScale }] },
        ]}
        resizeMode="contain"
      />

      {/* Nome do app */}
      <Animated.Text
        style={[styles.appName, { opacity: nameOpacity, transform: [{ translateY: nameY }] }]}
      >
        Meu Sabor Express
      </Animated.Text>

      {/* Slogan */}
      <Animated.Text style={[styles.slogan, { opacity: sloganOpacity }]}>
        Sabor que chega na sua porta 
      </Animated.Text>

      {/* Dots de loading na parte inferior */}
      <View style={styles.dotsRow}>
        <Animated.View style={[styles.dot, { opacity: dot1Opacity }]} />
        <Animated.View style={[styles.dot, { opacity: dot2Opacity }]} />
        <Animated.View style={[styles.dot, { opacity: dot3Opacity }]} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  // Círculos decorativos semi-transparentes criam profundidade
  circleTop: {
    position: 'absolute',
    top: -width * 0.35,
    right: -width * 0.2,
    width: width * 0.85,
    height: width * 0.85,
    borderRadius: width * 0.425,
    backgroundColor: 'rgba(0,0,0,0.12)',
  },
  circleBottom: {
    position: 'absolute',
    bottom: -width * 0.4,
    left: -width * 0.25,
    width: width * 0.9,
    height: width * 0.9,
    borderRadius: width * 0.45,
    backgroundColor: 'rgba(0,0,0,0.10)',
  },

  logo: {
    width: width * 1.0,
    height: width * 0.65,
    marginBottom: 20,
  },

  appName: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.extraBold,
    color: '#FFFFFF',
    letterSpacing: 0.5,
    marginBottom: 8,
    textAlign: 'center',
  },

  slogan: {
    fontSize: FontSize.md,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    paddingHorizontal: 32,
  },

  dotsRow: {
    flexDirection: 'row',
    gap: 8,
    position: 'absolute',
    bottom: 64,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.65)',
  },
});

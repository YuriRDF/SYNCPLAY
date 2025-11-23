import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function WelcomeScreen({ navigation }) {
  return (
    <ImageBackground
      source={require('../src/img/banner.jpg')}
      style={localStyles.container}
      resizeMode="cover"
    >
      <LinearGradient
        colors={['rgba(10, 10, 11, 0.7)', 'rgba(26, 26, 46, 0.8)', 'rgba(10, 10, 11, 0.9)']}
        style={localStyles.overlay}
      >
        <View style={localStyles.content}>
          <Text style={localStyles.title}>Descubra, Compartilhe, e Conecte-se!</Text>

          <Text style={localStyles.description}>
            Compartilhe músicas, livros, filmes e jogos com amigos e descubra novas experiências que combinam com você
          </Text>

        <TouchableOpacity
          style={localStyles.signupButton}
          onPress={() => navigation.navigate('Signup')}
        >
          <Text style={localStyles.signupButtonText}>Cadastre-se</Text>
        </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            style={{ marginTop: 20 }}
          >
            <Text style={localStyles.loginText}>
              Já tem uma conta? <Text style={localStyles.loginTextBold}>Entrar</Text>
            </Text>
          </TouchableOpacity>
        </View>

        <View style={localStyles.footer} />
      </LinearGradient>
    </ImageBackground>
  );
}

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: SCREEN_WIDTH * 0.08,
    paddingBottom: SCREEN_HEIGHT * 0.05,
  },
  title: {
    fontSize: Math.min(28, SCREEN_WIDTH * 0.07),
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    marginBottom: SCREEN_HEIGHT * 0.02,
    letterSpacing: 0.5,
    lineHeight: Math.min(36, SCREEN_WIDTH * 0.09),
  },
  description: {
    fontSize: Math.min(16, SCREEN_WIDTH * 0.042),
    color: '#e0e0e0',
    textAlign: 'center',
    lineHeight: Math.min(24, SCREEN_WIDTH * 0.063),
    marginBottom: SCREEN_HEIGHT * 0.035,
    paddingHorizontal: SCREEN_WIDTH * 0.05,
  },
  signupButton: {
    backgroundColor: '#0db8ff',
    paddingVertical: SCREEN_HEIGHT * 0.02,
    paddingHorizontal: SCREEN_WIDTH * 0.15,
    borderRadius: 30,
    width: SCREEN_WIDTH * 0.8,
    alignItems: 'center',
    shadowColor: '#0db8ff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  signupButtonText: {
    color: '#0a0a0b',
    fontSize: Math.min(18, SCREEN_WIDTH * 0.047),
    fontWeight: '700',
  },
  loginText: {
    color: '#e0e0e0',
    fontSize: Math.min(15, SCREEN_WIDTH * 0.039),
    textAlign: 'center',
  },
  loginTextBold: {
    color: '#0db8ff',
    fontWeight: '700',
  },
  footer: {
    paddingBottom: SCREEN_HEIGHT * 0.03,
    alignItems: 'center',
  },
});

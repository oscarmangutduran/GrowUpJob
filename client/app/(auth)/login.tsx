import React, { useState } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useAuth } from '../../context/AuthContext';
import { ThemedText } from '../../components/themed-text';
import { ThemedView } from '../../components/themed-view';

export default function LoginScreen() {
  const { login, loginWithGoogle } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage('Por favor, completa todos los campos.');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);
    try {
      await login(email, password);
      router.replace('/(tabs)');
    } catch (error: any) {
      setErrorMessage(error.message || 'Error al iniciar sesión.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMessage('');
    setIsGoogleSubmitting(true);
    try {
      await loginWithGoogle();
      router.replace('/(tabs)');
    } catch (error: any) {
      setErrorMessage(error.message || 'Error al iniciar con Google.');
    } finally {
      setIsGoogleSubmitting(false);
    }
  };

  return (
    <LinearGradient
      colors={['#0f0c20', '#15102a', '#06030d']}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Tarjeta con efecto Glassmorphism */}
          <BlurView intensity={Platform.OS === 'ios' ? 30 : 40} tint="dark" style={styles.glassCard}>

            {/* Aura roja brillante de fondo */}
            <View style={styles.glowAura} />

            {/* Avatar circular con silueta de perfil */}
            <View style={styles.avatarWrapper}>
              <View style={styles.avatarCircle}>
                <Ionicons name="person" size={72} color="rgba(255, 255, 255, 0.4)" />
              </View>
            </View>

            {errorMessage ? (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={18} color="#ff453a" />
                <ThemedText style={styles.errorText}>{errorMessage}</ThemedText>
              </View>
            ) : null}

            {/* Input de Email (Subrayado minimalista) */}
            <View style={styles.inputWrapper}>
              <Ionicons name="mail" size={20} color="#ffffff" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email ID"
                placeholderTextColor="rgba(255, 255, 255, 0.6)"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            {/* Input de Contraseña (Subrayado minimalista) */}
            <View style={styles.inputWrapper}>
              <Ionicons name="lock-closed" size={20} color="#ffffff" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="rgba(255, 255, 255, 0.6)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                <Ionicons
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={20}
                  color="rgba(255, 255, 255, 0.6)"
                />
              </TouchableOpacity>
            </View>

            {/* Fila Opciones: Remember Me y Forgot Password */}
            <View style={styles.optionsRow}>
              <Pressable
                style={styles.checkboxContainer}
                onPress={() => setRememberMe(!rememberMe)}
              >
                <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                  {rememberMe && <Ionicons name="checkmark" size={12} color="#ffffff" />}
                </View>
                <ThemedText style={styles.checkboxLabel}>Recordarme</ThemedText>
              </Pressable>

              <TouchableOpacity onPress={() => alert('Próximamente...')}>
                <ThemedText style={styles.forgotText}>¿Olvidaste tu contraseña?</ThemedText>
              </TouchableOpacity>
            </View>

            {/* Botón de LOGIN con degradado circular/horizontal */}
            <TouchableOpacity
              onPress={handleLogin}
              disabled={isSubmitting || isGoogleSubmitting}
              style={styles.loginButtonContainer}
            >
              <LinearGradient
                colors={['#400321', '#1f0d3d', '#3b82f6']}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.loginButton}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <ThemedText style={styles.loginButtonText}>ENTRAR</ThemedText>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <ThemedText style={styles.dividerText}>continúa con</ThemedText>
              <View style={styles.dividerLine} />
            </View>

            {/* Botón de Google (Estilo Glassmorphic / Blanco) */}
            <TouchableOpacity
              style={styles.googleButton}
              onPress={handleGoogleLogin}
              disabled={isSubmitting || isGoogleSubmitting}
            >
              {isGoogleSubmitting ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <View style={styles.googleButtonContent}>
                  <Image source={require('../../assets/images/google-logo.png')} style={styles.googleIcon} />
                  <ThemedText style={styles.googleButtonText}>Google</ThemedText>
                </View>
              )}
            </TouchableOpacity>

            {/* Enlace de Registro */}
            <View style={styles.footer}>
              <ThemedText style={styles.footerText}>¿No tienes una cuenta? </ThemedText>
              <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
                <ThemedText style={styles.linkText}>
                  Regístrate aquí
                </ThemedText>
              </TouchableOpacity>
            </View>

          </BlurView>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    paddingVertical: 40,
  },
  glassCard: {
    borderRadius: 36,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: 40,
    paddingHorizontal: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
    overflow: 'hidden',
    backgroundColor: 'rgba(21, 16, 40, 0.45)', // Filtro translúcido oscuro
  },
  glowAura: {
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: '#ea4335',
    opacity: 0.18,
    position: 'absolute',
    top: -50,
    alignSelf: 'center',
    // Efecto de desenfoque suave para web
    ...Platform.select({
      web: {
        filter: 'blur(50px)',
      },
    }),
  },
  avatarWrapper: {
    alignItems: 'center',
    marginBottom: 36,
    zIndex: 1,
  },
  avatarCircle: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 69, 58, 0.15)',
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 69, 58, 0.25)',
  },
  errorText: {
    color: '#ff453a',
    fontSize: 13,
    flex: 1,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1.5,
    borderBottomColor: 'rgba(255, 255, 255, 0.35)',
    marginBottom: 24,
    height: 48,
    paddingHorizontal: 4,
  },
  inputIcon: {
    marginRight: 12,
    opacity: 0.9,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#ffffff',
    height: '100%',
    ...Platform.select({
      web: {
        outlineStyle: 'none' as any,
      },
    }),
  },
  eyeIcon: {
    padding: 6,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.65)',
    borderRadius: 4,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  checkboxLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 13,
  },
  forgotText: {
    color: 'rgba(255, 255, 255, 0.65)',
    fontSize: 13,
    fontStyle: 'italic',
  },
  loginButtonContainer: {
    width: '100%',
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 20,
  },
  loginButton: {
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.45)',
  },
  googleButton: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 24,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  googleButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  googleButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 28,
  },
  footerText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  linkText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
});

import React, { useState, useEffect } from 'react';
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
  ImageBackground,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import * as SecureStore from 'expo-secure-store';
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Cargar credenciales guardadas al iniciar la pantalla
  useEffect(() => {
    const loadCredentials = async () => {
      try {
        let savedEmail = '';
        let savedPassword = '';
        let remember = false;

        if (Platform.OS === 'web') {
          savedEmail = localStorage.getItem('saved_email') || '';
          savedPassword = localStorage.getItem('saved_password') || '';
          remember = localStorage.getItem('remember_me') === 'true';
        } else {
          savedEmail = await SecureStore.getItemAsync('saved_email') || '';
          savedPassword = await SecureStore.getItemAsync('saved_password') || '';
          remember = (await SecureStore.getItemAsync('remember_me')) === 'true';
        }

        if (remember) {
          setEmail(savedEmail);
          setPassword(savedPassword);
          setRememberMe(true);
        }
      } catch (error) {
        console.error('Error loading credentials:', error);
      }
    };

    loadCredentials();
  }, []);

  const saveCredentials = async (emailVal: string, passwordVal: string, remember: boolean) => {
    try {
      if (remember) {
        if (Platform.OS === 'web') {
          localStorage.setItem('saved_email', emailVal);
          localStorage.setItem('saved_password', passwordVal);
          localStorage.setItem('remember_me', 'true');
        } else {
          await SecureStore.setItemAsync('saved_email', emailVal);
          await SecureStore.setItemAsync('saved_password', passwordVal);
          await SecureStore.setItemAsync('remember_me', 'true');
        }
      } else {
        if (Platform.OS === 'web') {
          localStorage.removeItem('saved_email');
          localStorage.removeItem('saved_password');
          localStorage.removeItem('remember_me');
        } else {
          await SecureStore.deleteItemAsync('saved_email');
          await SecureStore.deleteItemAsync('saved_password');
          await SecureStore.deleteItemAsync('remember_me');
        }
      }
    } catch (error) {
      console.error('Error saving credentials:', error);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage('Por favor, rellena todos los campos.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      await login(email, password);
      await saveCredentials(email, password, rememberMe);
    } catch (error: any) {
      setErrorMessage(error.message || 'Credenciales incorrectas o error de servidor.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleSubmitting(true);
    setErrorMessage(null);
    try {
      await loginWithGoogle();
    } catch (error: any) {
      setErrorMessage(error.message || 'Error al iniciar con Google.');
    } finally {
      setIsGoogleSubmitting(false);
    }
  };

  const { width } = useWindowDimensions();
  const isLargeScreen = Platform.OS === 'web' && width >= 768;

  return (
    <ImageBackground
      source={require('../../assets/images/login_bg.png')}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <LinearGradient
        colors={['rgba(2, 6, 14, 0.85)', 'rgba(58, 8, 20, 0.85)', 'rgba(2, 6, 14, 0.85)']}
        style={[styles.overlayContainer, { flexDirection: isLargeScreen ? 'row' : 'column' }]}
      >
        {/* Sección izquierda (Fondo limpio visible en pantallas grandes) */}
        {isLargeScreen && <View style={styles.leftSection} />}

        {/* Línea divisoria vertical blanca (Visible en pantallas grandes) */}
        {isLargeScreen && <View style={styles.verticalDivider} />}

        {/* Sección derecha: Formulario de Login */}
        <View style={[styles.rightSection, { flex: isLargeScreen ? 0.9 : 1, paddingHorizontal: isLargeScreen ? '8%' : 24 }]}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardView}
          >
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
              <ThemedText style={styles.loginTitle}>Iniciar sesión</ThemedText>

              {errorMessage ? (
                <View style={styles.errorContainer}>
                  <Ionicons name="alert-circle" size={18} color="#ff453a" />
                  <ThemedText style={styles.errorText}>{errorMessage}</ThemedText>
                </View>
              ) : null}

              {/* Input de Email */}
              <ThemedText style={styles.inputLabel}>Correo electrónico</ThemedText>
              <View style={styles.inputCard}>
                <Ionicons name="mail-outline" size={20} color="#64748b" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Introduce tu correo electrónico"
                  placeholderTextColor="#94a3b8"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoComplete="off"
                  textContentType="none"
                />
              </View>

              {/* Input de Contraseña */}
              <ThemedText style={styles.inputLabel}>Contraseña</ThemedText>
              <View style={styles.inputCard}>
                <Ionicons name="shield-outline" size={20} color="#64748b" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Introduce tu contraseña"
                  placeholderTextColor="#94a3b8"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoComplete="off"
                  textContentType="none"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color="#64748b"
                  />
                </TouchableOpacity>
              </View>

              {/* Fila de opciones: Recordarme y ¿Olvidaste tu contraseña? */}
              <View style={styles.optionsRow}>
                <TouchableOpacity
                  style={styles.checkboxContainer}
                  onPress={() => setRememberMe(!rememberMe)}
                >
                  <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                    {rememberMe && <Ionicons name="checkmark" size={12} color="#ffffff" />}
                  </View>
                  <ThemedText style={styles.checkboxLabel}>Recordarme</ThemedText>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => alert('Recuperar contraseña')}>
                  <ThemedText style={styles.forgotText}>¿Olvidaste tu contraseña?</ThemedText>
                </TouchableOpacity>
              </View>

              {/* Botón de Iniciar Sesión */}
              <TouchableOpacity
                style={styles.loginButton}
                onPress={handleLogin}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <View style={styles.loginButtonContent}>
                    <ThemedText style={styles.loginButtonText}>Iniciar sesión</ThemedText>
                    <Ionicons name="arrow-forward" size={16} color="#ffffff" style={styles.buttonArrow} />
                  </View>
                )}
              </TouchableOpacity>

              {/* Divisor con texto */}
              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <ThemedText style={styles.dividerText}>O continuar con</ThemedText>
                <View style={styles.dividerLine} />
              </View>

              {/* Botones de Redes Sociales (Solo Google) */}
              <TouchableOpacity
                style={styles.googleCircleButton}
                onPress={handleGoogleLogin}
                disabled={isGoogleSubmitting}
              >
                {isGoogleSubmitting ? (
                  <ActivityIndicator size="small" color="#0f172a" />
                ) : (
                  <Image source={require('../../assets/images/google-logo.png')} style={styles.googleIcon} />
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
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlayContainer: {
    flex: 1,
    backgroundColor: 'rgba(2, 6, 14, 0.25)',
  },
  leftSection: {
    flex: 1.1,
  },
  verticalDivider: {
    width: 1.5,
    height: '65%',
    backgroundColor: 'rgba(197, 3, 55, 0.45)',
    alignSelf: 'center',
  },
  rightSection: {
    justifyContent: 'center',
  },
  keyboardView: {
    width: '100%',
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loginTitle: {
    fontSize: 34,
    color: '#ffffff',
    fontWeight: 'bold',
    marginBottom: 32,
    alignSelf: 'flex-start',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 69, 58, 0.12)',
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 69, 58, 0.2)',
  },
  errorText: {
    color: '#ff453a',
    fontSize: 13,
    flex: 1,
  },
  inputLabel: {
    fontSize: 13,
    color: '#ffffff',
    fontWeight: '600',
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  inputCard: {
    borderRadius: 12,
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#0f172a',
    height: '100%',
    backgroundColor: 'transparent',
    borderWidth: 0,
    ...Platform.select({
      web: {
        outlineStyle: 'none' as any,
        WebkitBoxShadow: '0 0 0px 1000px #ffffff inset' as any,
        transition: 'background-color 5000s ease-in-out 0s' as any,
        WebkitTextFillColor: '#0f172a' as any,
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
    marginBottom: 24,
    width: '100%',
    paddingHorizontal: 2,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 5,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  checkboxChecked: {
    backgroundColor: '#C50337',
    borderColor: '#C50337',
  },
  checkboxLabel: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 13,
  },
  forgotText: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 13,
    fontStyle: 'italic',
  },
  loginButton: {
    backgroundColor: '#C50337',
    borderRadius: 12,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    width: '100%',
  },
  loginButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  buttonArrow: {
    marginLeft: 6,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  dividerText: {
    marginHorizontal: 14,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  googleCircleButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 28,
  },
  googleIcon: {
    width: 20,
    height: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
  },
  footerText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.75)',
  },
  linkText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#C50337',
    textDecorationLine: 'underline',
  },
});

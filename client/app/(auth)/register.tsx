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
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useAuth } from '../../context/AuthContext';
import { ThemedText } from '../../components/themed-text';
import { ThemedView } from '../../components/themed-view';

export default function RegisterScreen() {
  const { register } = useAuth();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'trabajador' | 'empresa'>('trabajador');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleRegister = async () => {
    if (!name || !email || !password) {
      setErrorMessage('Por favor, completa todos los campos.');
      return;
    }

    if (password.length < 8) {
      setErrorMessage('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);
    try {
      await register(name, email, password, role);
      router.replace('/(tabs)');
    } catch (error: any) {
      setErrorMessage(error.message || 'Error al registrarse.');
    } finally {
      setIsSubmitting(false);
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
            
            {/* Aura azul brillante de fondo para el registro */}
            <View style={styles.glowAura} />

            {/* Avatar circular con silueta de perfil */}
            <View style={styles.avatarWrapper}>
              <View style={styles.avatarCircle}>
                <Ionicons name="person-add" size={64} color="rgba(255, 255, 255, 0.4)" />
              </View>
            </View>

            {errorMessage ? (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={18} color="#ff453a" />
                <ThemedText style={styles.errorText}>{errorMessage}</ThemedText>
              </View>
            ) : null}

            {/* Input de Nombre (Subrayado minimalista) */}
            <View style={styles.inputWrapper}>
              <Ionicons
                name={role === 'empresa' ? 'business' : 'person'}
                size={20}
                color="#ffffff"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder={role === 'empresa' ? 'Nombre de la empresa' : 'Nombre Completo'}
                placeholderTextColor="rgba(255, 255, 255, 0.6)"
                value={name}
                onChangeText={setName}
              />
            </View>

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

            {/* Selector de Rol */}
            <View style={styles.roleSelectorContainer}>
              <TouchableOpacity
                style={[styles.roleOption, role === 'trabajador' && styles.roleOptionActive]}
                onPress={() => setRole('trabajador')}
              >
                <Ionicons
                  name="person"
                  size={16}
                  color={role === 'trabajador' ? '#ffffff' : 'rgba(255, 255, 255, 0.5)'}
                  style={styles.roleIcon}
                />
                <ThemedText style={[styles.roleText, role === 'trabajador' && styles.roleTextActive]}>
                  Trabajador
                </ThemedText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.roleOption, role === 'empresa' && styles.roleOptionActive]}
                onPress={() => setRole('empresa')}
              >
                <Ionicons
                  name="business"
                  size={16}
                  color={role === 'empresa' ? '#ffffff' : 'rgba(255, 255, 255, 0.5)'}
                  style={styles.roleIcon}
                />
                <ThemedText style={[styles.roleText, role === 'empresa' && styles.roleTextActive]}>
                  Empresa
                </ThemedText>
              </TouchableOpacity>
            </View>

            {/* Botón de REGISTRO con degradado */}
            <TouchableOpacity
              onPress={handleRegister}
              disabled={isSubmitting}
              style={styles.registerButtonContainer}
            >
              <LinearGradient
                colors={['#400321', '#1f0d3d', '#3b82f6']}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.registerButton}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <ThemedText style={styles.registerButtonText}>SIGN UP</ThemedText>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Enlace para volver a Login */}
            <View style={styles.footer}>
              <ThemedText style={styles.footerText}>¿Ya tienes una cuenta? </ThemedText>
              <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                <ThemedText style={styles.linkText}>
                  Inicia sesión aquí
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
    backgroundColor: '#3b82f6',
    opacity: 0.18,
    position: 'absolute',
    top: -50,
    alignSelf: 'center',
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
  roleSelectorContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 14,
    padding: 4,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  roleOption: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 10,
  },
  roleOptionActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  roleIcon: {
    marginRight: 6,
  },
  roleText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 14,
    fontWeight: '600',
  },
  roleTextActive: {
    color: '#ffffff',
  },
  registerButtonContainer: {
    width: '100%',
    borderRadius: 24,
    overflow: 'hidden',
    marginTop: 12,
    marginBottom: 10,
  },
  registerButton: {
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
    letterSpacing: 2,
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

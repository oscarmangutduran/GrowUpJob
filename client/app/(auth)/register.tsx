import React, { useState } from 'react';
import {
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import styles from '../../css/registerStyles';
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
      colors={['#02060E', '#3a0814', '#02060E']}
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
                colors={['#C50337', '#02060E']}
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



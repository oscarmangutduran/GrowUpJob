import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight } from 'lucide-react-native';
import { BrandLogo, BrandText } from '../../components/common/BrandLogo';
import { LinkedinIcon } from '../../components/common/LinkedinIcon';
import { signInWithLinkedIn, signInWithGoogle, signInWithEmail } from '../../services/auth';

interface LoginScreenProps {
  onLoginSuccess: () => void;
  onNavigateToRegister: () => void;
}

export default function LoginScreen({ onLoginSuccess, onNavigateToRegister }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<'linkedin' | 'google' | null>(null);

  const handleEmailLogin = async () => {
    if (!email || !password) {
      Alert.alert('Campos requeridos', 'Por favor ingresa tu email y contraseña.');
      return;
    }

    try {
      setLoading(true);
      const { error } = await signInWithEmail(email, password);
      if (error) {
        Alert.alert('Error de acceso', error.message);
      } else {
        onLoginSuccess();
      }
    } catch (err: any) {
      Alert.alert('Error inesperado', err.message || 'No se pudo iniciar sesión.');
    } finally {
      setLoading(false);
    }
  };

  const handleLinkedInLogin = async () => {
    try {
      setSocialLoading('linkedin');
      const session = await signInWithLinkedIn();
      if (session) {
        onLoginSuccess();
      }
    } catch (err: any) {
      Alert.alert('Error con LinkedIn', err.message || 'No se pudo autenticar con LinkedIn.');
    } finally {
      setSocialLoading(null);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setSocialLoading('google');
      const session = await signInWithGoogle();
      if (session) {
        onLoginSuccess();
      }
    } catch (err: any) {
      Alert.alert('Error con Google', err.message || 'No se pudo autenticar con Google.');
    } finally {
      setSocialLoading(null);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Brand Header */}
        <View style={styles.brandRow}>
          <BrandLogo size={42} />
          <BrandText isDark={false} />
        </View>

        {/* Narrative Pill */}
        <View style={styles.pillContainer}>
          <Sparkles size={14} color="#2563eb" />
          <Text style={styles.pillText}>Plataforma Oficial de Empleo Profesional</Text>
        </View>

        <Text style={styles.title}>Iniciar sesión</Text>
        <Text style={styles.subtitle}>Ingresa tus credenciales para acceder a tu panel.</Text>

        {/* Social Logins */}
        <View style={styles.socialButtonsContainer}>
          {/* LinkedIn Button */}
          <TouchableOpacity
            style={styles.linkedinButton}
            onPress={handleLinkedInLogin}
            disabled={!!socialLoading}
          >
            {socialLoading === 'linkedin' ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <View style={styles.socialButtonContent}>
                <LinkedinIcon size={20} color="#ffffff" />
                <Text style={styles.linkedinButtonText}>Continuar con LinkedIn</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Google Button */}
          <TouchableOpacity
            style={styles.googleButton}
            onPress={handleGoogleLogin}
            disabled={!!socialLoading}
          >
            {socialLoading === 'google' ? (
              <ActivityIndicator color="#0f172a" size="small" />
            ) : (
              <View style={styles.socialButtonContent}>
                <Text style={styles.googleIconText}>G</Text>
                <Text style={styles.googleButtonText}>Continuar con Google</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>O CON EMAIL</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Input Fields */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>CORREO ELECTRÓNICO</Text>
          <View style={styles.inputContainer}>
            <Mail size={18} color="#94a3b8" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="ejemplo@correo.com"
              placeholderTextColor="#94a3b8"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>
        </View>

        <View style={styles.formGroup}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>CONTRASEÑA</Text>
            <TouchableOpacity>
              <Text style={styles.forgotPassword}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.inputContainer}>
            <Lock size={18} color="#94a3b8" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Tu contraseña"
              placeholderTextColor="#94a3b8"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
            >
              {showPassword ? <EyeOff size={18} color="#94a3b8" /> : <Eye size={18} color="#94a3b8" />}
            </TouchableOpacity>
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleEmailLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <View style={styles.submitButtonContent}>
              <Text style={styles.submitButtonText}>Acceder al portal</Text>
              <ArrowRight size={18} color="#ffffff" />
            </View>
          )}
        </TouchableOpacity>

        {/* Register navigation link */}
        <View style={styles.registerFooter}>
          <Text style={styles.registerPrompt}>¿Aún no tienes cuenta? </Text>
          <TouchableOpacity onPress={onNavigateToRegister}>
            <Text style={styles.registerLink}>Crear cuenta gratuita</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    padding: 24,
    paddingTop: 48,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  pillContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#dbeafe',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
    marginBottom: 16,
    gap: 6,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1d4ed8',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 24,
  },
  socialButtonsContainer: {
    gap: 12,
    marginBottom: 20,
  },
  linkedinButton: {
    backgroundColor: '#0A66C2',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  socialButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  linkedinButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  googleButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleIconText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ea4335',
  },
  googleButtonText: {
    color: '#1e293b',
    fontSize: 14,
    fontWeight: '600',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e2e8f0',
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 11,
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: 0.5,
  },
  formGroup: {
    marginBottom: 16,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  forgotPassword: {
    fontSize: 11,
    color: '#2563eb',
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    backgroundColor: '#f8fafc',
    paddingHorizontal: 14,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 14,
    color: '#0f172a',
  },
  eyeIcon: {
    padding: 6,
  },
  submitButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    elevation: 2,
  },
  submitButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  registerFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  registerPrompt: {
    fontSize: 13,
    color: '#64748b',
  },
  registerLink: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563eb',
  },
});

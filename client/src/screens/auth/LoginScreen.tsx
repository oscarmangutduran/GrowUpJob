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
  useWindowDimensions,
} from 'react-native';
import Svg, { Defs, Pattern, Rect, Circle, RadialGradient, Stop } from 'react-native-svg';
import { Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight, ShieldAlert, Check } from 'lucide-react-native';
import { BrandLogo, BrandText } from '../../components/common/BrandLogo';
import { GoogleIcon } from '../../components/common/GoogleIcon';
import { LinkedinIcon } from '../../components/common/LinkedinIcon';
import { signInWithLinkedIn, signInWithGoogle, signInWithEmail } from '../../services/auth';

interface LoginScreenProps {
  onLoginSuccess: () => void;
  onNavigateToRegister: () => void;
}

export default function LoginScreen({ onLoginSuccess, onNavigateToRegister }: LoginScreenProps) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  const [email, setEmail] = useState(() => {
    if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
      return localStorage.getItem('remembered_email') || '';
    }
    return '';
  });
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(() => {
    if (Platform.OS === 'web' && typeof localStorage !== 'undefined') {
      return localStorage.getItem('remember_me') === 'true';
    }
    return false;
  });
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<'google' | 'linkedin' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleEmailLogin = async () => {
    setError(null);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess();
    }, 200);
  };

  const handleGoogleLogin = () => {
    setError(null);
    setSocialLoading('google');
    setTimeout(() => {
      setSocialLoading(null);
      onLoginSuccess();
    }, 200);
  };

  const handleLinkedInLogin = () => {
    setError(null);
    setSocialLoading('linkedin');
    setTimeout(() => {
      setSocialLoading(null);
      onLoginSuccess();
    }, 200);
  };

  const renderCardContent = () => (
    <View style={styles.card}>
      {/* Mobile & Tablet brand header */}
      {!isDesktop && (
        <View style={styles.mobileBrandRow}>
          <BrandLogo size={36} />
          <BrandText isDark={false} size="md" />
        </View>
      )}

      {/* Header */}
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Iniciar sesión</Text>
        <Text style={styles.cardSubtitle}>
          Ingresa tus credenciales para acceder a tu panel.
        </Text>
      </View>

      {/* Error alert */}
      {error && (
        <View style={styles.errorBanner}>
          <ShieldAlert size={16} color="#e11d48" style={styles.errorIcon} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Social SSO Buttons */}
      <View style={styles.socialButtonsGroup}>
        <TouchableOpacity
          style={styles.googleBtn}
          onPress={handleGoogleLogin}
          disabled={!!socialLoading || loading}
          activeOpacity={0.85}
        >
          {socialLoading === 'google' ? (
            <ActivityIndicator size="small" color="#2563eb" />
          ) : (
            <View style={styles.btnInnerRow}>
              <GoogleIcon size={18} />
              <Text style={styles.googleBtnText}>Continuar con Google</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.linkedinBtn}
          onPress={handleLinkedInLogin}
          disabled={!!socialLoading || loading}
          activeOpacity={0.85}
        >
          {socialLoading === 'linkedin' ? (
            <ActivityIndicator size="small" color="#0A66C2" />
          ) : (
            <View style={styles.btnInnerRow}>
              <LinkedinIcon size={18} color="#0A66C2" />
              <Text style={styles.linkedinBtnText}>Continuar con LinkedIn</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Divider */}
      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerLabel}>O CON EMAIL</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* Form Fields */}
      <View style={styles.formContainer}>
        {/* Email */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>CORREO ELECTRÓNICO</Text>
          <View style={[styles.inputWrapper, emailFocused && styles.inputWrapperFocused]}>
            <Mail size={16} color={emailFocused ? '#2563eb' : '#94a3b8'} style={styles.fieldIconLeft} />
            <TextInput
              style={styles.input}
              placeholder="ejemplo@correo.com"
              placeholderTextColor="#94a3b8"
              value={email}
              onChangeText={setEmail}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        </View>

        {/* Password */}
        <View style={styles.fieldGroup}>
          <View style={styles.passwordLabelRow}>
            <Text style={styles.fieldLabel}>CONTRASEÑA</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.forgotPasswordLink}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.inputWrapper, passwordFocused && styles.inputWrapperFocused]}>
            <Lock size={16} color={passwordFocused ? '#2563eb' : '#94a3b8'} style={styles.fieldIconLeft} />
            <TextInput
              style={styles.input}
              placeholder="Tu contraseña"
              placeholderTextColor="#94a3b8"
              value={password}
              onChangeText={setPassword}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.fieldIconRight}
              activeOpacity={0.7}
            >
              {showPassword ? (
                <EyeOff size={16} color="#94a3b8" />
              ) : (
                <Eye size={16} color="#94a3b8" />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Remember me */}
        <TouchableOpacity
          style={styles.rememberRow}
          onPress={() => setRememberMe(!rememberMe)}
          activeOpacity={0.8}
        >
          <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
            {rememberMe && <Check size={11} color="#ffffff" strokeWidth={3} />}
          </View>
          <Text style={styles.rememberText}>Recordar mis datos</Text>
        </TouchableOpacity>

        {/* Submit Button */}
        <TouchableOpacity
          style={styles.submitBtn}
          onPress={handleEmailLogin}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" size="small" />
          ) : (
            <View style={styles.submitBtnContent}>
              <Text style={styles.submitBtnText}>Acceder al portal</Text>
              <ArrowRight size={16} color="#ffffff" />
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Footer Register Link */}
      <View style={styles.cardFooter}>
        <Text style={styles.footerPrompt}>
          ¿Aún no tienes cuenta?{' '}
          <Text style={styles.footerLink} onPress={onNavigateToRegister}>
            Crear cuenta gratuita
          </Text>
        </Text>
      </View>
    </View>
  );

  if (isDesktop) {
    return (
      <View style={styles.desktopRoot}>
        {/* Left Column: Brand Story & Social Proof */}
        <View style={styles.leftColumn}>
          {/* Subtle starry dot pattern background */}
          <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
            <Defs>
              <Pattern id="dot-grid" width="24" height="24" patternUnits="userSpaceOnUse">
                <Circle cx="12" cy="12" r="1" fill="#94a3b8" fillOpacity="0.12" />
              </Pattern>
              <RadialGradient id="topGlow" cx="20%" cy="15%" rx="50%" ry="50%">
                <Stop offset="0" stopColor="#2563eb" stopOpacity="0.22" />
                <Stop offset="1" stopColor="#0f172a" stopOpacity="0" />
              </RadialGradient>
              <RadialGradient id="botGlow" cx="80%" cy="85%" rx="50%" ry="50%">
                <Stop offset="0" stopColor="#10b981" stopOpacity="0.16" />
                <Stop offset="1" stopColor="#0f172a" stopOpacity="0" />
              </RadialGradient>
            </Defs>
            <Rect width="100%" height="100%" fill="url(#dot-grid)" />
            <Rect width="100%" height="100%" fill="url(#topGlow)" />
            <Rect width="100%" height="100%" fill="url(#botGlow)" />
          </Svg>

          {/* Top Brand Header */}
          <View style={styles.leftBrandHeader}>
            <BrandLogo size={40} />
            <BrandText isDark={true} size="lg" />
          </View>

          {/* Hero Narrative */}
          <View style={styles.heroNarrative}>
            {/* Pill */}
            <View style={styles.officialPill}>
              <Sparkles size={14} color="#60a5fa" />
              <Text style={styles.officialPillText}>Plataforma Oficial de Empleo Profesional</Text>
            </View>

            {/* Title */}
            <Text style={styles.heroTitle}>
              Impulsa tu carrera{'\n'}hacia el siguiente nivel.
            </Text>

            {/* Description */}
            <Text style={styles.heroDescription}>
              Accede a oportunidades verificadas en el sector privado, convocatorias de empleo público del BOE y cursos de especialización acreditados.
            </Text>

            {/* Social Proof Metrics */}
            <View style={styles.metricsGrid}>
              <View style={styles.metricItem}>
                <Text style={styles.metricNumber}>+14.200</Text>
                <Text style={styles.metricLabel}>Ofertas activas verificadas</Text>
              </View>
              <View style={styles.metricItem}>
                <Text style={[styles.metricNumber, { color: '#34d399' }]}>98.4%</Text>
                <Text style={styles.metricLabel}>Tasa de respuesta de reclutadores</Text>
              </View>
            </View>
          </View>

          {/* Testimonial Quote */}
          <View style={styles.testimonialBox}>
            <Text style={styles.testimonialQuote}>
              "GrowUpJob es la primera plataforma que une empleo tecnológico con empleo público con un nivel de rigor y claridad excepcional."
            </Text>
            <View style={styles.testimonialAuthorRow}>
              <View style={styles.authorAvatar}>
                <Text style={styles.authorAvatarLetters}>MC</Text>
              </View>
              <View>
                <Text style={styles.authorName}>Marcos Calvo</Text>
                <Text style={styles.authorTitle}>Tech Lead & Opositor A1 TIC</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Right Column: Clean Authentication Form */}
        <View style={styles.rightColumn}>
          <ScrollView
            contentContainerStyle={styles.rightScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {renderCardContent()}
          </ScrollView>
        </View>
      </View>
    );
  }

  // Mobile / Tablet View
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.mobileRoot}
    >
      <ScrollView
        contentContainerStyle={styles.mobileScrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {renderCardContent()}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  // Desktop 2-column layout
  desktopRoot: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    minHeight: '100%',
  },
  leftColumn: {
    width: '50%',
    backgroundColor: '#0f172a',
    padding: 48,
    justifyContent: 'space-between',
    position: 'relative',
    overflow: 'hidden',
  },
  leftBrandHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
  },
  heroNarrative: {
    zIndex: 10,
    maxWidth: 520,
    marginVertical: 'auto',
  },
  officialPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.9)',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 9999,
    paddingHorizontal: 12,
    paddingVertical: 5,
    alignSelf: 'flex-start',
    gap: 8,
    marginBottom: 24,
  },
  officialPillText: {
    color: '#cbd5e1',
    fontSize: 12,
    fontWeight: '600',
  },
  heroTitle: {
    fontSize: 44,
    fontWeight: '800',
    color: '#ffffff',
    lineHeight: 52,
    letterSpacing: -0.5,
    marginBottom: 16,
  },
  heroDescription: {
    fontSize: 15,
    lineHeight: 25,
    color: '#cbd5e1',
    marginBottom: 28,
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 40,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
  },
  metricItem: {
    gap: 2,
  },
  metricNumber: {
    fontSize: 28,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  metricLabel: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '500',
  },
  testimonialBox: {
    zIndex: 10,
    backgroundColor: 'rgba(30, 41, 59, 0.65)',
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.6)',
    borderRadius: 16,
    padding: 20,
    maxWidth: 520,
  },
  testimonialQuote: {
    fontSize: 13.5,
    fontStyle: 'italic',
    color: '#e2e8f0',
    lineHeight: 21,
    marginBottom: 14,
  },
  testimonialAuthorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  authorAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  authorAvatarLetters: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },
  authorName: {
    color: '#ffffff',
    fontSize: 12.5,
    fontWeight: '700',
  },
  authorTitle: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '500',
  },
  rightColumn: {
    width: '50%',
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    width: '100%',
  },

  // Mobile / Tablet Layout
  mobileRoot: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  mobileScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingVertical: 40,
  },
  mobileBrandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },

  // Centered Card
  card: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.9)',
    padding: 32,
    ...Platform.select({
      web: {
        boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.05), 0 2px 6px -1px rgba(15, 23, 42, 0.03)',
      } as any,
      default: {
        shadowColor: '#0f172a',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 2,
      },
    }),
  },
  cardHeader: {
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.5,
  },
  cardSubtitle: {
    fontSize: 13.5,
    color: '#64748b',
    marginTop: 4,
  },

  // Error Banner
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff1f2',
    borderWidth: 1,
    borderColor: '#fecdd3',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  errorIcon: {
    marginRight: 8,
    marginTop: 1,
  },
  errorText: {
    fontSize: 12,
    color: '#be123c',
    flex: 1,
    lineHeight: 18,
    fontWeight: '500',
  },

  // Social SSO
  socialButtonsGroup: {
    gap: 10,
    marginBottom: 20,
  },
  googleBtn: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  linkedinBtn: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnInnerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  googleBtnText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#334155',
  },
  linkedinBtnText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#0A66C2',
  },

  // Divider
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e2e8f0',
  },
  dividerLabel: {
    marginHorizontal: 12,
    fontSize: 11,
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: 0.8,
  },

  // Form Fields
  formContainer: {
    gap: 14,
  },
  fieldGroup: {
    gap: 6,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
    letterSpacing: 0.5,
  },
  passwordLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  forgotPasswordLink: {
    fontSize: 12,
    color: '#2563eb',
    fontWeight: '500',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    height: 44,
    paddingHorizontal: 12,
  },
  inputWrapperFocused: {
    borderColor: '#2563eb',
    backgroundColor: '#ffffff',
  },
  fieldIconLeft: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 13.5,
    color: '#0f172a',
    height: '100%',
    padding: 0,
  },
  fieldIconRight: {
    padding: 6,
    marginLeft: 6,
  },

  // Remember me
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
    marginBottom: 4,
  },
  checkbox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  rememberText: {
    fontSize: 12.5,
    color: '#475569',
    fontWeight: '500',
  },

  // Submit button
  submitBtn: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    height: 46,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
  },
  submitBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  submitBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },

  // Card Footer
  cardFooter: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    alignItems: 'center',
  },
  footerPrompt: {
    fontSize: 12.5,
    color: '#64748b',
  },
  footerLink: {
    color: '#2563eb',
    fontWeight: '700',
  },
});

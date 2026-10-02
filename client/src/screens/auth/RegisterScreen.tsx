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
import {
  Mail,
  Lock,
  User,
  Briefcase,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  ShieldAlert,
  Check,
} from 'lucide-react-native';
import { BrandLogo, BrandText } from '../../components/common/BrandLogo';
import { signUpWithEmail } from '../../services/auth';

interface RegisterScreenProps {
  onRegisterSuccess: () => void;
  onNavigateToLogin: () => void;
}

export default function RegisterScreen({ onRegisterSuccess, onNavigateToLogin }: RegisterScreenProps) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  const [role, setRole] = useState<'candidato' | 'empresa'>('candidato');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const [nameFocused, setNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmFocused, setConfirmFocused] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async () => {
    setError(null);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onRegisterSuccess();
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
        <Text style={styles.cardTitle}>Crear cuenta</Text>
        <Text style={styles.cardSubtitle}>
          Completa tus datos para empezar en minutos.
        </Text>
      </View>

      {/* Error alert */}
      {error && (
        <View style={styles.errorBanner}>
          <ShieldAlert size={16} color="#e11d48" style={styles.errorIcon} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Role Segmented Switch */}
      <View style={styles.roleGroup}>
        <Text style={styles.fieldLabel}>TIPO DE PERFIL</Text>
        <View style={styles.roleSegmentedContainer}>
          <TouchableOpacity
            style={[styles.roleTab, role === 'candidato' && styles.roleTabActive]}
            onPress={() => setRole('candidato')}
            activeOpacity={0.8}
          >
            <User
              size={14}
              color={role === 'candidato' ? '#0f172a' : '#64748b'}
              style={{ marginRight: 6 }}
            />
            <Text
              style={[
                styles.roleTabText,
                role === 'candidato' && styles.roleTabTextActive,
              ]}
            >
              Candidato / Profesional
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.roleTab, role === 'empresa' && styles.roleTabActive]}
            onPress={() => setRole('empresa')}
            activeOpacity={0.8}
          >
            <Briefcase
              size={14}
              color={role === 'empresa' ? '#0f172a' : '#64748b'}
              style={{ marginRight: 6 }}
            />
            <Text
              style={[
                styles.roleTabText,
                role === 'empresa' && styles.roleTabTextActive,
              ]}
            >
              Empresa / Empleador
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Form Fields */}
      <View style={styles.formContainer}>
        {/* Full Name */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>NOMBRE COMPLETO</Text>
          <View style={[styles.inputWrapper, nameFocused && styles.inputWrapperFocused]}>
            <User size={16} color={nameFocused ? '#2563eb' : '#94a3b8'} style={styles.fieldIconLeft} />
            <TextInput
              style={styles.input}
              placeholder="Ej. Ana Fernández Romero"
              placeholderTextColor="#94a3b8"
              value={name}
              onChangeText={setName}
              onFocus={() => setNameFocused(true)}
              onBlur={() => setNameFocused(false)}
              autoCapitalize="words"
            />
          </View>
        </View>

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
          <Text style={styles.fieldLabel}>CONTRASEÑA</Text>
          <View style={[styles.inputWrapper, passwordFocused && styles.inputWrapperFocused]}>
            <Lock size={16} color={passwordFocused ? '#2563eb' : '#94a3b8'} style={styles.fieldIconLeft} />
            <TextInput
              style={styles.input}
              placeholder="Mínimo 8 caracteres"
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

        {/* Confirm Password */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>CONFIRMAR CONTRASEÑA</Text>
          <View style={[styles.inputWrapper, confirmFocused && styles.inputWrapperFocused]}>
            <Lock size={16} color={confirmFocused ? '#2563eb' : '#94a3b8'} style={styles.fieldIconLeft} />
            <TextInput
              style={styles.input}
              placeholder="Repite tu contraseña"
              placeholderTextColor="#94a3b8"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              onFocus={() => setConfirmFocused(true)}
              onBlur={() => setConfirmFocused(false)}
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              style={styles.fieldIconRight}
              activeOpacity={0.7}
            >
              {showConfirmPassword ? (
                <EyeOff size={16} color="#94a3b8" />
              ) : (
                <Eye size={16} color="#94a3b8" />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Terms Checkbox */}
        <TouchableOpacity
          style={styles.termsRow}
          onPress={() => setAcceptTerms(!acceptTerms)}
          activeOpacity={0.8}
        >
          <View style={[styles.checkbox, acceptTerms && styles.checkboxChecked]}>
            {acceptTerms && <Check size={11} color="#ffffff" strokeWidth={3} />}
          </View>
          <Text style={styles.termsText}>
            Acepto los <Text style={styles.linkUnderline}>Términos de Uso</Text> y la{' '}
            <Text style={styles.linkUnderline}>Política de Privacidad</Text>.
          </Text>
        </TouchableOpacity>

        {/* Submit Button */}
        <TouchableOpacity
          style={styles.submitBtn}
          onPress={handleRegister}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" size="small" />
          ) : (
            <View style={styles.submitBtnContent}>
              <Text style={styles.submitBtnText}>
                {role === 'candidato' ? 'Crear cuenta profesional' : 'Crear cuenta de empresa'}
              </Text>
              <ArrowRight size={16} color="#ffffff" />
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Footer Login Link */}
      <View style={styles.cardFooter}>
        <Text style={styles.footerPrompt}>
          ¿Ya tienes cuenta?{' '}
          <Text style={styles.footerLink} onPress={onNavigateToLogin}>
            Inicia sesión aquí
          </Text>
        </Text>
      </View>
    </View>
  );

  if (isDesktop) {
    return (
      <View style={styles.desktopRoot}>
        {/* Left Column: Brand Story & Values */}
        <View style={styles.leftColumn}>
          {/* Starry dot pattern background */}
          <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
            <Defs>
              <Pattern id="reg-dot-grid" width="24" height="24" patternUnits="userSpaceOnUse">
                <Circle cx="12" cy="12" r="1" fill="#94a3b8" fillOpacity="0.12" />
              </Pattern>
              <RadialGradient id="regTopGlow" cx="20%" cy="15%" rx="50%" ry="50%">
                <Stop offset="0" stopColor="#2563eb" stopOpacity="0.22" />
                <Stop offset="1" stopColor="#0f172a" stopOpacity="0" />
              </RadialGradient>
              <RadialGradient id="regBotGlow" cx="80%" cy="85%" rx="50%" ry="50%">
                <Stop offset="0" stopColor="#10b981" stopOpacity="0.16" />
                <Stop offset="1" stopColor="#0f172a" stopOpacity="0" />
              </RadialGradient>
            </Defs>
            <Rect width="100%" height="100%" fill="url(#reg-dot-grid)" />
            <Rect width="100%" height="100%" fill="url(#regTopGlow)" />
            <Rect width="100%" height="100%" fill="url(#regBotGlow)" />
          </Svg>

          {/* Top Brand Header */}
          <View style={styles.leftBrandHeader}>
            <BrandLogo size={40} />
            <BrandText isDark={true} size="lg" />
          </View>

          {/* Narrative & Benefits */}
          <View style={styles.heroNarrative}>
            {/* Pill */}
            <View style={styles.officialPill}>
              <Sparkles size={14} color="#34d399" />
              <Text style={styles.officialPillText}>Únete a más de 50.000 profesionales</Text>
            </View>

            {/* Title */}
            <Text style={styles.heroTitle}>
              Crea tu perfil y{'\n'}potencia tus{'\n'}oportunidades.
            </Text>

            {/* Checklist */}
            <View style={styles.benefitsList}>
              {[
                'Alertas instantáneas de convocatorias de empleo público y oposiciones',
                'Ofertas privadas con salarios 100% transparentes',
                'Insignias técnicas validadas para destacar en el Top 5% de candidatos',
                'Proceso de inscripción ágil en 1 solo clic',
              ].map((benefit, i) => (
                <View key={i} style={styles.benefitRow}>
                  <CheckCircle2 size={16} color="#34d399" style={styles.checkIcon} />
                  <Text style={styles.benefitText}>{benefit}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Footer note */}
          <View style={styles.footerNote}>
            <Text style={styles.footerNoteText}>
              GrowUpJob cumple con los estándares europeos de protección de datos (RGPD) y verificación de identidad.
            </Text>
          </View>
        </View>

        {/* Right Column: Registration Form */}
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
    marginBottom: 24,
  },
  benefitsList: {
    gap: 14,
    paddingTop: 4,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  checkIcon: {
    marginTop: 2,
    flexShrink: 0,
  },
  benefitText: {
    fontSize: 14,
    color: '#cbd5e1',
    lineHeight: 20,
    flex: 1,
  },
  footerNote: {
    zIndex: 10,
    maxWidth: 520,
  },
  footerNoteText: {
    fontSize: 11.5,
    color: '#94a3b8',
    lineHeight: 18,
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
    marginBottom: 18,
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

  // Role Segmented Switch
  roleGroup: {
    marginBottom: 16,
  },
  roleSegmentedContainer: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginTop: 6,
  },
  roleTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 9,
  },
  roleTabActive: {
    backgroundColor: '#ffffff',
    ...Platform.select({
      web: {
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
      } as any,
      default: {
        elevation: 1,
      },
    }),
  },
  roleTabText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: '#64748b',
  },
  roleTabTextActive: {
    color: '#0f172a',
    fontWeight: '700',
  },

  // Form Fields
  formContainer: {
    gap: 13,
  },
  fieldGroup: {
    gap: 5,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
    letterSpacing: 0.5,
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

  // Terms checkbox
  termsRow: {
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
    marginTop: 1,
  },
  checkboxChecked: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  termsText: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 17,
    flex: 1,
  },
  linkUnderline: {
    color: '#2563eb',
    textDecorationLine: 'underline',
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

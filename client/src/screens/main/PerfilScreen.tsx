import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {
  User,
  FileText,
  Upload,
  Eye,
  CheckCircle2,
  Briefcase,
  GraduationCap,
  MapPin,
  Sparkles,
  LogOut,
  ExternalLink,
} from 'lucide-react-native';
import { supabase } from '../../services/supabase';
import { signOut } from '../../services/auth';
import { uploadUserCV } from '../../services/cvStorage';
import { Profile } from '../../types/database.types';

const MOCK_PROFILE: Profile = {
  id: 'usr-1',
  email: 'elena.morales@growupjob.com',
  name: 'Elena Morales García',
  headline: 'Full Stack Engineer & Cloud Architect',
  location: 'Madrid, España · Remoto global',
  anos_experiencia: '8+ años',
  match_global: 94,
  ofertas_hoy: 14,
  cv_title: 'CV_Elena_Morales_2026.pdf',
  cv_size: '1.2 MB',
  role: 'candidato',
};

const MOCK_APPLICATIONS = [
  {
    id: 'app-1',
    company: 'DevPulsar Tech',
    title: 'Senior React Developer',
    status: 'Finalista',
    notes: 'Resultado de prueba técnica: 89/100 (Top 3)',
  },
  {
    id: 'app-2',
    company: 'Frontend Inc.',
    title: 'Lead Full Stack Engineer',
    status: 'Entrevista',
    notes: 'Jueves 16:00 – 17:15 CET (Google Meet con CTO)',
  },
];

export default function PerfilScreen({ onLogout }: { onLogout?: () => void }) {
  const [profile, setProfile] = useState<Profile>(MOCK_PROFILE);
  const [uploading, setUploading] = useState(false);

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (data && !error) {
          setProfile(data);
        }
      }
    } catch (e) {
      console.warn('Fallback a perfil demo:', e);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUploadCV = async () => {
    try {
      setUploading(true);
      const res = await uploadUserCV(profile.id);
      if (res) {
        setProfile(prev => ({
          ...prev,
          cv_title: res.name,
          cv_size: res.size,
        }));
        Alert.alert('CV Actualizado', 'Tu currículum ha sido subido y re-indexado para los filtros ATS.');
      }
    } catch (err: any) {
      Alert.alert('Error', err.message || 'No se pudo subir el archivo.');
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    if (onLogout) onLogout();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header Profile Card */}
      <View style={styles.profileCard}>
        <View style={styles.avatarRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>EM</Text>
          </View>
          <View style={styles.profileDetails}>
            <View style={styles.nameRow}>
              <Text style={styles.profileName}>{profile.name}</Text>
              <CheckCircle2 size={16} color="#2563eb" />
            </View>
            <Text style={styles.headlineText}>{profile.headline}</Text>
            <View style={styles.locationRow}>
              <MapPin size={12} color="#64748b" />
              <Text style={styles.locationText}>{profile.location}</Text>
            </View>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{profile.anos_experiencia}</Text>
            <Text style={styles.statLabel}>Experiencia</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{profile.match_global}%</Text>
            <Text style={styles.statLabel}>Match medio</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{profile.ofertas_hoy}</Text>
            <Text style={styles.statLabel}>Consultas hoy</Text>
          </View>
        </View>
      </View>

      {/* CV Manager Card */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>CURRICULUM VITAE</Text>
          <View style={styles.atsBadge}>
            <Text style={styles.atsBadgeText}>Indexado ATS</Text>
          </View>
        </View>

        <View style={styles.cvRow}>
          <FileText size={24} color="#ef4444" />
          <View style={styles.cvInfo}>
            <Text style={styles.cvTitle}>{profile.cv_title || 'CV_Principal.pdf'}</Text>
            <Text style={styles.cvSize}>{profile.cv_size || '1.2 MB'} · Actualizado recientemente</Text>
          </View>
        </View>

        <View style={styles.cvActionsRow}>
          <TouchableOpacity
            style={styles.cvUploadButton}
            onPress={handleUploadCV}
            disabled={uploading}
          >
            {uploading ? (
              <ActivityIndicator color="#0f172a" size="small" />
            ) : (
              <>
                <Upload size={14} color="#0f172a" />
                <Text style={styles.cvUploadButtonText}>Actualizar</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.cvPreviewButton}>
            <Eye size={14} color="#ffffff" />
            <Text style={styles.cvPreviewButtonText}>Previsualizar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Active Candidacies Tracking */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>MIS CANDIDATURAS ACTIVAS</Text>
          <Text style={styles.countText}>{MOCK_APPLICATIONS.length} activas</Text>
        </View>

        {MOCK_APPLICATIONS.map((app) => (
          <View key={app.id} style={styles.appCard}>
            <View style={styles.appHeader}>
              <Text style={styles.appTitle}>{app.title}</Text>
              <View style={styles.appStatusPill}>
                <Text style={styles.appStatusText}>{app.status}</Text>
              </View>
            </View>
            <Text style={styles.appCompany}>{app.company}</Text>
            <Text style={styles.appNotes}>{app.notes}</Text>
          </View>
        ))}
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <LogOut size={16} color="#ef4444" />
        <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
    gap: 16,
  },
  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 16,
  },
  avatarRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
  },
  profileDetails: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  headlineText: {
    fontSize: 12,
    color: '#475569',
    marginTop: 2,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  locationText: {
    fontSize: 11,
    color: '#64748b',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 10,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
  },
  statLabel: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 2,
  },
  sectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94a3b8',
    letterSpacing: 0.5,
  },
  atsBadge: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  atsBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1d4ed8',
  },
  countText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#2563eb',
  },
  cvRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 10,
    padding: 12,
    gap: 12,
    marginBottom: 12,
  },
  cvInfo: {
    flex: 1,
  },
  cvTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  cvSize: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  cvActionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  cvUploadButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    paddingVertical: 10,
    gap: 6,
  },
  cvUploadButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
  },
  cvPreviewButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 10,
    gap: 6,
  },
  cvPreviewButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ffffff',
  },
  appCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 12,
    marginBottom: 8,
  },
  appHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  appTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  appStatusPill: {
    backgroundColor: '#dbeafe',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  appStatusText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1e40af',
  },
  appCompany: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  appNotes: {
    fontSize: 11,
    color: '#334155',
    marginTop: 6,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 12,
    paddingVertical: 14,
    gap: 8,
    marginTop: 8,
  },
  logoutButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ef4444',
  },
});

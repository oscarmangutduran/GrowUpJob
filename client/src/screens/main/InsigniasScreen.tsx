import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import {
  Award,
  ShieldCheck,
  Zap,
  TrendingUp,
  Brain,
  CheckCircle2,
  Lock,
  Play,
  Sparkles,
  ArrowRight,
} from 'lucide-react-native';

const MOCK_MISSIONS = [
  {
    id: 'm1',
    boost: '+15% VISIBILIDAD',
    category: 'Arquitectura de Código',
    title: 'Evaluación Práctica React & TypeScript',
    desc: 'Valida tus conocimientos sobre Hooks avanzados, patrones de diseño y tipado estricto.',
    duration: '15 minutos',
  },
  {
    id: 'm2',
    boost: '+20% VISIBILIDAD',
    category: 'Idioma Profesional',
    title: 'Competencia Oral de Inglés C1',
    desc: 'Entrevista interactiva de 3 preguntas situacionales de negocio con transcripción y análisis.',
    duration: '8 minutos',
  },
];

const MOCK_BADGES = [
  { id: 'b1', name: 'Cloud Architecture Pro', rank: 'Oro', status: 'obtenida' },
  { id: 'b2', name: 'Microservices & Docker', rank: 'Platino', status: 'obtenida' },
  { id: 'b3', name: 'System Design Patterns', rank: 'Plata', status: 'obtenida' },
  { id: 'b4', name: 'High Concurrency Go/Rust', rank: 'Bronce', status: 'en_progreso' },
];

export default function InsigniasScreen() {
  const [activeTab, setActiveTab] = useState<'misiones' | 'catalogo'>('misiones');

  const handleStartMission = (title: string) => {
    Alert.alert('Evaluación Técnica', `Iniciando prueba: ${title}.\nRecibirás tu feedback e insignia al completar el test.`);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Level Summary Banner */}
      <View style={styles.levelCard}>
        <View style={styles.levelTopRow}>
          <View style={styles.levelBadge}>
            <Sparkles size={10} color="#60a5fa" />
            <Text style={styles.levelBadgeText}>Nivel de Confianza · 4 de 5</Text>
          </View>
          <View style={styles.boostPill}>
            <TrendingUp size={12} color="#10b981" />
            <Text style={styles.boostPillText}>3.2x Mayor Visibilidad</Text>
          </View>
        </View>

        <Text style={styles.levelTitle}>Nivel 4: Candidato Destacado</Text>
        <Text style={styles.levelDesc}>
          Faltan solo 150 XP para desbloquear el Nivel 5: Experto Elite y la insignia de Liderazgo Técnico.
        </Text>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '85%' }]} />
          </View>
          <View style={styles.progressLabels}>
            <Text style={styles.progressValue}>850 / 1.000 XP acumulados</Text>
            <Text style={styles.progressPercent}>85%</Text>
          </View>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsRow}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'misiones' && styles.activeTab]}
          onPress={() => setActiveTab('misiones')}
        >
          <Text style={[styles.tabText, activeTab === 'misiones' && styles.activeTabText]}>
            Misiones para Aumentar Visibilidad
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'catalogo' && styles.activeTab]}
          onPress={() => setActiveTab('catalogo')}
        >
          <Text style={[styles.tabText, activeTab === 'catalogo' && styles.activeTabText]}>
            Insignias Validadas (3)
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      {activeTab === 'misiones' ? (
        <View style={styles.missionsList}>
          {MOCK_MISSIONS.map((m) => (
            <View key={m.id} style={styles.missionCard}>
              <View style={styles.missionTopRow}>
                <View style={styles.boostBadge}>
                  <Text style={styles.boostBadgeText}>{m.boost}</Text>
                </View>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryBadgeText}>{m.category}</Text>
                </View>
              </View>

              <Text style={styles.missionTitle}>{m.title}</Text>
              <Text style={styles.missionDesc}>{m.desc}</Text>

              <View style={styles.missionFooter}>
                <Text style={styles.durationText}>Duración estimada: {m.duration}</Text>
                <TouchableOpacity
                  style={styles.startButton}
                  onPress={() => handleStartMission(m.title)}
                >
                  <Text style={styles.startButtonText}>Iniciar Test</Text>
                  <Play size={12} color="#ffffff" fill="#ffffff" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.badgesGrid}>
          {MOCK_BADGES.map((b) => (
            <View key={b.id} style={styles.badgeCard}>
              <View style={styles.badgeIconBox}>
                <Award size={24} color={b.status === 'obtenida' ? '#f59e0b' : '#94a3b8'} />
              </View>
              <Text style={styles.badgeName}>{b.name}</Text>
              <View style={[styles.rankPill, b.status === 'obtenida' ? styles.rankPillObtained : styles.rankPillLocked]}>
                <Text style={[styles.rankText, b.status === 'obtenida' ? styles.rankTextObtained : styles.rankTextLocked]}>
                  {b.rank} · {b.status === 'obtenida' ? 'Verificada' : 'En progreso'}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}
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
  levelCard: {
    backgroundColor: '#0f172a',
    borderRadius: 16,
    padding: 18,
  },
  levelTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(37, 99, 235, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.4)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    gap: 4,
  },
  levelBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#93c5fd',
  },
  boostPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    gap: 4,
  },
  boostPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#34d399',
  },
  levelTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 4,
  },
  levelDesc: {
    fontSize: 12,
    color: '#94a3b8',
    lineHeight: 18,
    marginBottom: 16,
  },
  progressContainer: {
    gap: 6,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#1e293b',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 4,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressValue: {
    fontSize: 10,
    color: '#94a3b8',
  },
  progressPercent: {
    fontSize: 10,
    fontWeight: '700',
    color: '#60a5fa',
  },
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#ffffff',
    elevation: 2,
  },
  tabText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
    textAlign: 'center',
  },
  activeTabText: {
    color: '#0f172a',
    fontWeight: '700',
  },
  missionsList: {
    gap: 12,
  },
  missionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 16,
  },
  missionTopRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  boostBadge: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  boostBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#1d4ed8',
  },
  categoryBadge: {
    backgroundColor: '#f1f5f9',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  categoryBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#475569',
  },
  missionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 4,
  },
  missionDesc: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 18,
    marginBottom: 14,
  },
  missionFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 10,
  },
  durationText: {
    fontSize: 11,
    color: '#94a3b8',
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
  },
  startButtonText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ffffff',
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  badgeCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 14,
    alignItems: 'center',
  },
  badgeIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  badgeName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 6,
  },
  rankPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  rankPillObtained: {
    backgroundColor: '#ecfdf5',
  },
  rankPillLocked: {
    backgroundColor: '#f1f5f9',
  },
  rankText: {
    fontSize: 10,
    fontWeight: '700',
  },
  rankTextObtained: {
    color: '#047857',
  },
  rankTextLocked: {
    color: '#64748b',
  },
});

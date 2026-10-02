import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Search, SlidersHorizontal, Sparkles, ArrowRight, Bookmark, CheckCircle2, MapPin } from 'lucide-react-native';
import { supabase } from '../../services/supabase';
import { JobListing } from '../../types/database.types';

const MOCK_JOBS: JobListing[] = [
  {
    id: '1',
    title: 'Senior Full Stack Engineer',
    company: 'DevPulse Tech',
    location: '100% Remoto',
    salary: '48K – 60K €',
    modality: '100% Remoto',
    jornada: 'Completa',
    posted_at: 'Hace 2 horas',
    logo_color: '#2563eb',
    logo_initial: 'D',
    tags: ['React', 'Node.js', 'TypeScript', 'AWS'],
    verified: true,
    fast_apply: true,
  },
  {
    id: '2',
    title: 'Product Designer UI/UX',
    company: 'FinNova Bank',
    location: 'Híbrido Madrid',
    salary: '42K – 52K €',
    modality: 'Híbrido',
    jornada: 'Completa',
    posted_at: 'Hace 5 horas',
    logo_color: '#059669',
    logo_initial: 'F',
    tags: ['Figma', 'Design Systems', 'Mobile Apps'],
    verified: false,
    badge: 'Destacada',
  },
  {
    id: '3',
    title: 'Data Analyst / BI Specialist',
    company: 'Logistics Hub',
    location: 'Presencial Valencia',
    salary: '35K – 40K €',
    modality: 'Presencial',
    jornada: 'Completa',
    posted_at: 'Ayer',
    logo_color: '#4f46e5',
    logo_initial: 'L',
    tags: ['Python', 'SQL', 'PowerBI'],
    verified: false,
  },
];

const FILTER_PILLS = ['Todo', '100% Remoto', 'Híbrido', 'Presencial', 'Verificadas'];

export default function EmpleoScreen({ navigation }: any) {
  const [jobs, setJobs] = useState<JobListing[]>(MOCK_JOBS);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('Todo');

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('job_listings')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        setJobs(data);
      }
    } catch (e) {
      console.warn('Fallback a datos de demostración:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter(job => {
    const matchesSearch =
      !search ||
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase()) ||
      job.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));

    const matchesPill =
      activeFilter === 'Todo' ||
      (activeFilter === '100% Remoto' && job.modality === '100% Remoto') ||
      (activeFilter === 'Híbrido' && job.modality === 'Híbrido') ||
      (activeFilter === 'Presencial' && job.modality === 'Presencial') ||
      (activeFilter === 'Verificadas' && job.verified);

    return matchesSearch && matchesPill;
  });

  const renderJobCard = ({ item }: { item: JobListing }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={[styles.avatar, { backgroundColor: item.logo_color || '#2563eb' }]}>
          <Text style={styles.avatarText}>{item.logo_initial || item.company[0]}</Text>
        </View>
        <View style={styles.companyInfo}>
          <View style={styles.companyRow}>
            <Text style={styles.companyName}>{item.company}</Text>
            {item.verified && (
              <View style={styles.verifiedBadge}>
                <CheckCircle2 size={12} color="#2563eb" />
                <Text style={styles.verifiedText}>Verificada</Text>
              </View>
            )}
          </View>
          <Text style={styles.jobTitle}>{item.title}</Text>
        </View>
        <TouchableOpacity style={styles.bookmarkButton}>
          <Bookmark size={18} color="#94a3b8" />
        </TouchableOpacity>
      </View>

      {/* Salary & Modality Chips */}
      <View style={styles.metaRow}>
        <View style={styles.salaryChip}>
          <Text style={styles.salaryText}>{item.salary}</Text>
        </View>
        <View style={styles.modalityChip}>
          <MapPin size={12} color="#64748b" />
          <Text style={styles.modalityText}>{item.location}</Text>
        </View>
        <Text style={styles.jornadaText}>· {item.jornada}</Text>
      </View>

      {/* Tech Tags */}
      <View style={styles.tagsContainer}>
        {item.tags.map((tag, idx) => (
          <View key={idx} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>

      {/* Footer */}
      <View style={styles.cardFooter}>
        <Text style={styles.postedText}>Publicado {item.posted_at}</Text>
        <TouchableOpacity style={styles.applyButton}>
          <Text style={styles.applyButtonText}>Inscripción Directa</Text>
          <ArrowRight size={14} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchHeader}>
        <View style={styles.searchInputContainer}>
          <Search size={18} color="#94a3b8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Puesto, tecnología o empresa..."
            placeholderTextColor="#94a3b8"
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <SlidersHorizontal size={18} color="#334155" />
        </TouchableOpacity>
      </View>

      {/* Horizontal Pills */}
      <View style={styles.pillsRow}>
        {FILTER_PILLS.map(pill => (
          <TouchableOpacity
            key={pill}
            onPress={() => setActiveFilter(pill)}
            style={[styles.pill, activeFilter === pill && styles.activePill]}
          >
            <Text style={[styles.pillLabel, activeFilter === pill && styles.activePillLabel]}>
              {pill}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Hero Card */}
      <View style={styles.heroCard}>
        <View style={styles.heroTopRow}>
          <Text style={styles.heroPre}>ANÁLISIS DE MERCADO & PERFIL</Text>
          <View style={styles.affinityBadge}>
            <Sparkles size={10} color="#10b981" />
            <Text style={styles.affinityText}>98% Afinidad</Text>
          </View>
        </View>
        <Text style={styles.heroTitle}>Tu perfil técnico destaca en el Top 5% de candidatos</Text>
        <Text style={styles.heroDesc}>
          Tus insignias en Arquitectura Cloud y Microservicios han recibido 14 consultas esta semana.
        </Text>
      </View>

      {/* Job Feed */}
      <FlatList
        data={filteredJobs}
        keyExtractor={item => item.id}
        renderItem={renderJobCard}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchJobs} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  searchHeader: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 8,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0f172a',
  },
  filterButton: {
    width: 44,
    height: 44,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 6,
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  activePill: {
    backgroundColor: '#0f172a',
    borderColor: '#0f172a',
  },
  pillLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  activePillLabel: {
    color: '#ffffff',
  },
  heroCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#0f172a',
    borderRadius: 16,
    padding: 16,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  heroPre: {
    fontSize: 9,
    fontWeight: '800',
    color: '#94a3b8',
    letterSpacing: 0.5,
  },
  affinityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
    gap: 4,
  },
  affinityText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#34d399',
  },
  heroTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#ffffff',
    lineHeight: 20,
    marginBottom: 4,
  },
  heroDesc: {
    fontSize: 11,
    color: '#94a3b8',
    lineHeight: 16,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 12,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
  },
  companyInfo: {
    flex: 1,
  },
  companyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  companyName: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '600',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  verifiedText: {
    fontSize: 11,
    color: '#2563eb',
    fontWeight: '600',
  },
  jobTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
    marginTop: 2,
  },
  bookmarkButton: {
    padding: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  salaryChip: {
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  salaryText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#047857',
  },
  modalityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  modalityText: {
    fontSize: 11,
    color: '#64748b',
  },
  jornadaText: {
    fontSize: 11,
    color: '#94a3b8',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 14,
  },
  tag: {
    backgroundColor: '#f1f5f9',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 10,
  },
  postedText: {
    fontSize: 11,
    color: '#94a3b8',
  },
  applyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 4,
  },
  applyButtonText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ffffff',
  },
});

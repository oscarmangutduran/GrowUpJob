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
  Linking,
} from 'react-native';
import { Search, Landmark, Calendar, Users, ExternalLink, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react-native';
import { supabase } from '../../services/supabase';
import { PublicJob } from '../../types/database.types';

const MOCK_PUBLIC_JOBS: PublicJob[] = [
  {
    id: '1',
    titulo: 'Técnicos Superiores de Sistemas y Tecnologías (TIC A1)',
    organismo: 'Ministerio para la Transformación Digital',
    ambito: 'Estatal',
    tipo: 'Oposición Libre',
    plazas: 120,
    plazo: 'Hasta el 15 Octubre 2026',
    estado: 'Abierta',
    publicado: 'BOE 01/09/2026',
    badge: '120 Plazas',
    link: 'https://www.boe.es',
    descripcion: 'Convocatoria para el cuerpo superior de sistemas del estado.',
    requisitos: ['Grado o Máster Universitario', 'Nacionalidad española o UE'],
  },
  {
    id: '2',
    titulo: 'Gestión de Sistemas e Informática (TIC A2)',
    organismo: 'Secretaría General de Administración Digital',
    ambito: 'Estatal',
    tipo: 'Oposición Libre',
    plazas: 250,
    plazo: 'Hasta el 28 Octubre 2026',
    estado: 'Abierta',
    publicado: 'BOE 05/09/2026',
    badge: '250 Plazas',
    link: 'https://www.boe.es',
    descripcion: 'Puestos de análisis, gestión de bases de datos y desarrollo en AGE.',
    requisitos: ['Grado o Diplomatura'],
  },
  {
    id: '3',
    titulo: 'Técnico Especialista de Comunicaciones (C1)',
    organismo: 'Ministerio del Interior',
    ambito: 'Estatal',
    tipo: 'Concurso-Oposición',
    plazas: 80,
    plazo: 'Hasta el 5 Noviembre 2026',
    estado: 'Publicada',
    publicado: 'BOE 12/09/2026',
    badge: '80 Plazas',
    link: 'https://www.boe.es',
    descripcion: 'Operación de redes de emergencia y radioenlaces.',
    requisitos: ['Bachillerato o FP Superior'],
  },
];

const AMBITO_PILLS = ['Todos', 'Estatal', 'Autonómico', 'Local'];

export default function EmpleoPublicoScreen() {
  const [convocatorias, setConvocatorias] = useState<PublicJob[]>(MOCK_PUBLIC_JOBS);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedAmbito, setSelectedAmbito] = useState('Todos');

  const fetchPublicJobs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('public_jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        setConvocatorias(data);
      }
    } catch (e) {
      console.warn('Fallback a datos mock de empleo público:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublicJobs();
  }, []);

  const filteredConvocatorias = convocatorias.filter(item => {
    const matchesSearch =
      !search ||
      item.titulo.toLowerCase().includes(search.toLowerCase()) ||
      item.organismo.toLowerCase().includes(search.toLowerCase());

    const matchesAmbito =
      selectedAmbito === 'Todos' || item.ambito === selectedAmbito;

    return matchesSearch && matchesAmbito;
  });

  const renderItem = ({ item }: { item: PublicJob }) => (
    <View style={styles.card}>
      <View style={styles.cardTopRow}>
        <View style={styles.badgePlazas}>
          <Users size={12} color="#1e40af" />
          <Text style={styles.badgePlazasText}>{item.plazas} Plazas</Text>
        </View>
        <View style={[styles.statusBadge, item.estado === 'Abierta' ? styles.statusOpen : styles.statusPublished]}>
          <Text style={[styles.statusText, item.estado === 'Abierta' ? styles.statusOpenText : styles.statusPublishedText]}>
            {item.estado}
          </Text>
        </View>
      </View>

      <Text style={styles.cardTitle}>{item.titulo}</Text>
      <Text style={styles.organismoText}>{item.organismo}</Text>

      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Calendar size={13} color="#64748b" />
          <Text style={styles.metaText}>{item.plazo}</Text>
        </View>
        <Text style={styles.boeText}>{item.publicado}</Text>
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.tipoText}>{item.tipo} · {item.ambito}</Text>
        <TouchableOpacity
          style={styles.boeButton}
          onPress={() => Linking.openURL(item.link || 'https://www.boe.es')}
        >
          <Text style={styles.boeButtonText}>Consultar BOE</Text>
          <ExternalLink size={13} color="#2563eb" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header Info */}
      <View style={styles.headerInfo}>
        <View style={styles.officialPill}>
          <ShieldCheck size={14} color="#059669" />
          <Text style={styles.officialPillText}>Boletín Oficial del Estado (BOE)</Text>
        </View>
        <Text style={styles.headerTitle}>Convocatorias Oficiales</Text>
        <Text style={styles.headerSubtitle}>
          Plazas activas de la Administración Pública, requisitos y plazos de inscripción.
        </Text>
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Search size={18} color="#94a3b8" />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar oposición, organismo o especialidad..."
          placeholderTextColor="#94a3b8"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Ámbito Chips */}
      <View style={styles.chipsRow}>
        {AMBITO_PILLS.map(ambito => (
          <TouchableOpacity
            key={ambito}
            onPress={() => setSelectedAmbito(ambito)}
            style={[styles.chip, selectedAmbito === ambito && styles.activeChip]}
          >
            <Text style={[styles.chipText, selectedAmbito === ambito && styles.activeChipText]}>
              {ambito}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* List */}
      <FlatList
        data={filteredConvocatorias}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchPublicJobs} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  headerInfo: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  officialPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginBottom: 8,
    gap: 6,
  },
  officialPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#047857',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    marginHorizontal: 16,
    marginVertical: 10,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0f172a',
  },
  chipsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 10,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  activeChip: {
    backgroundColor: '#0f172a',
    borderColor: '#0f172a',
  },
  chipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  activeChipText: {
    color: '#ffffff',
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
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  badgePlazas: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    gap: 4,
  },
  badgePlazasText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1d4ed8',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusOpen: {
    backgroundColor: '#ecfdf5',
  },
  statusPublished: {
    backgroundColor: '#eff6ff',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  statusOpenText: {
    color: '#047857',
  },
  statusPublishedText: {
    color: '#1d4ed8',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
    lineHeight: 20,
    marginBottom: 4,
  },
  organismoText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#334155',
  },
  boeText: {
    fontSize: 11,
    color: '#94a3b8',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 10,
  },
  tipoText: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '500',
  },
  boeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  boeButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563eb',
  },
});

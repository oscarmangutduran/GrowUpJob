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
import { Search, BookOpen, Clock, Star, Award, ExternalLink, Sparkles } from 'lucide-react-native';
import { supabase } from '../../services/supabase';
import { Course } from '../../types/database.types';

const MOCK_COURSES: Course[] = [
  {
    id: '1',
    titulo: 'Especialización en Microservicios y Kubernetes Cloud Native',
    entidad: 'CloudTech Academy',
    duracion: '8 semanas',
    modalidad: 'Online',
    precio: 'Gratuito (Beca 100%)',
    es_gratuito: true,
    categoria: 'Cloud & DevOps',
    destacado: true,
    tags: ['Kubernetes', 'Docker', 'Go', 'AWS'],
    horas: 60,
    nivel: 'Avanzado',
    fecha_inicio: '15 Octubre 2026',
    link: '#',
    rating: 4.9,
    resenas: 310,
  },
  {
    id: '2',
    titulo: 'Diseño de Sistemas Distribuidos y Alta Concurrencia',
    entidad: 'Software Craftsman Institute',
    duracion: '6 semanas',
    modalidad: 'Online',
    precio: '350€',
    es_gratuito: false,
    categoria: 'Arquitectura de Software',
    destacado: false,
    tags: ['Kafka', 'Redis', 'System Design'],
    horas: 40,
    nivel: 'Intermedio-Avanzado',
    fecha_inicio: '1 Noviembre 2026',
    link: '#',
    rating: 4.8,
    resenas: 142,
  },
];

const MODALIDAD_PILLS = ['Todos', 'Online', 'Híbrido', 'Presencial', 'Becas 100%'];

export default function CursosScreen() {
  const [courses, setCourses] = useState<Course[]>(MOCK_COURSES);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedPill, setSelectedPill] = useState('Todos');

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        setCourses(data);
      }
    } catch (e) {
      console.warn('Fallback a datos mock de cursos:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(item => {
    const matchesSearch =
      !search ||
      item.titulo.toLowerCase().includes(search.toLowerCase()) ||
      item.entidad.toLowerCase().includes(search.toLowerCase()) ||
      item.categoria.toLowerCase().includes(search.toLowerCase());

    const matchesPill =
      selectedPill === 'Todos' ||
      (selectedPill === 'Becas 100%' && item.es_gratuito) ||
      item.modalidad === selectedPill;

    return matchesSearch && matchesPill;
  });

  const renderItem = ({ item }: { item: Course }) => (
    <View style={styles.card}>
      <View style={styles.cardTopRow}>
        <View style={styles.categoryPill}>
          <Text style={styles.categoryPillText}>{item.categoria}</Text>
        </View>
        <View style={styles.ratingRow}>
          <Star size={12} color="#f59e0b" fill="#f59e0b" />
          <Text style={styles.ratingText}>{item.rating || 4.8}</Text>
          <Text style={styles.resenasText}>({item.resenas || 120})</Text>
        </View>
      </View>

      <Text style={styles.courseTitle}>{item.titulo}</Text>
      <Text style={styles.entidadText}>{item.entidad}</Text>

      <View style={styles.metaRow}>
        <View style={styles.metaChip}>
          <Clock size={12} color="#64748b" />
          <Text style={styles.metaChipText}>{item.duracion} ({item.horas}h)</Text>
        </View>
        <View style={styles.metaChip}>
          <Text style={styles.metaChipText}>Nivel: {item.nivel}</Text>
        </View>
        <View style={[styles.priceChip, item.es_gratuito ? styles.freePriceChip : styles.paidPriceChip]}>
          <Text style={[styles.priceText, item.es_gratuito ? styles.freePriceText : styles.paidPriceText]}>
            {item.precio}
          </Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.fechaText}>Inicio: {item.fecha_inicio}</Text>
        <TouchableOpacity
          style={styles.enrollButton}
          onPress={() => item.link && item.link !== '#' && Linking.openURL(item.link)}
        >
          <Text style={styles.enrollButtonText}>Inscribirme</Text>
          <ExternalLink size={13} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header Info */}
      <View style={styles.headerInfo}>
        <View style={styles.badgePill}>
          <Award size={14} color="#2563eb" />
          <Text style={styles.badgePillText}>Certificaciones Profesionales</Text>
        </View>
        <Text style={styles.headerTitle}>Cursos y Especialización</Text>
        <Text style={styles.headerSubtitle}>
          Formación tecnológica y corporativa acreditada para impulsar tu perfil.
        </Text>
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Search size={18} color="#94a3b8" />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar curso, tecnología o entidad..."
          placeholderTextColor="#94a3b8"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Modalidad Chips */}
      <View style={styles.chipsRow}>
        {MODALIDAD_PILLS.map(pill => (
          <TouchableOpacity
            key={pill}
            onPress={() => setSelectedPill(pill)}
            style={[styles.chip, selectedPill === pill && styles.activeChip]}
          >
            <Text style={[styles.chipText, selectedPill === pill && styles.activeChipText]}>
              {pill}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* List */}
      <FlatList
        data={filteredCourses}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchCourses} />}
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
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginBottom: 8,
    gap: 6,
  },
  badgePillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1d4ed8',
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
    marginBottom: 8,
  },
  categoryPill: {
    backgroundColor: '#f1f5f9',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  categoryPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
  },
  resenasText: {
    fontSize: 11,
    color: '#94a3b8',
  },
  courseTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
    lineHeight: 20,
    marginBottom: 4,
  },
  entidadText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
  },
  metaChipText: {
    fontSize: 11,
    color: '#475569',
  },
  priceChip: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  freePriceChip: {
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  paidPriceChip: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  priceText: {
    fontSize: 11,
    fontWeight: '700',
  },
  freePriceText: {
    color: '#047857',
  },
  paidPriceText: {
    color: '#1d4ed8',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 10,
  },
  fechaText: {
    fontSize: 11,
    color: '#64748b',
  },
  enrollButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 4,
  },
  enrollButtonText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ffffff',
  },
});

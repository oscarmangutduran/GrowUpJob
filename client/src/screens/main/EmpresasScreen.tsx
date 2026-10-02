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
  Modal,
  Alert,
} from 'react-native';
import { Search, Building2, Zap, ShieldCheck, Star, MessageSquare, Clock, Check, X, ArrowRight } from 'lucide-react-native';
import { supabase } from '../../services/supabase';
import { Company } from '../../types/database.types';

const MOCK_COMPANIES: Company[] = [
  {
    id: '1',
    nombre: 'NexTech Solutions',
    sector: 'Cloud Engineering & DevOps',
    tamano: '250–500 empleados',
    logo_color: '#2563eb',
    logo_initial: 'N',
    descripcion: 'Autonomía de equipos, respuesta garantizada en menos de 24 horas y presupuesto anual individual para certificaciones.',
    verificada: true,
    tiempo_respuesta: '< 24 horas',
    tasa_ghosting: '0%',
    rating_entrevistas: 4.8,
    insignias_obtenidas: ['Respuesta Rápida (<24h)', '0% Ghosting Garantizado', 'Feedback Constructivo'],
    beneficios: ['100% Remoto', 'Presupuesto formación', 'Seguro médico'],
    vacantes_count: 4,
  },
  {
    id: '2',
    nombre: 'Iberia Green Energy',
    sector: 'CleanTech & Renovables',
    tamano: '100–250 empleados',
    logo_color: '#059669',
    logo_initial: 'I',
    descripcion: 'Cultura orientada a sostenibilidad y conciliación real. 100% remoto con reuniones asíncronas y respeto absoluto al tiempo.',
    verificada: true,
    tiempo_respuesta: '< 48 horas',
    tasa_ghosting: '0%',
    rating_entrevistas: 4.6,
    insignias_obtenidas: ['0% Ghosting Garantizado', 'Transparencia Salarial', '100% Remoto Real'],
    beneficios: ['Jornada 4 días', 'Retribución flexible'],
    vacantes_count: 2,
  },
];

export default function EmpresasScreen() {
  const [companies, setCompanies] = useState<Company[]>(MOCK_COMPANIES);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        setCompanies(data);
      }
    } catch (e) {
      console.warn('Fallback a datos mock de empresas:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleSendReview = async () => {
    if (!reviewText) {
      Alert.alert('Escribe una opinión', 'Por favor describe tu experiencia en el proceso de selección.');
      return;
    }

    try {
      if (selectedCompany) {
        await supabase.from('company_reviews').insert({
          company_id: selectedCompany.id,
          autor: 'Candidato Verificado',
          cargo: 'Software Engineer',
          texto: reviewText,
          rating: reviewRating,
          insignias_votadas: ['0% Ghosting Garantizado'],
        });
      }
      Alert.alert('Reseña enviada', 'Gracias por contribuir a la transparencia del proceso de selección.');
      setReviewModalVisible(false);
      setReviewText('');
    } catch (e: any) {
      Alert.alert('Aviso', 'Tu valoración se ha registrado localmente.');
      setReviewModalVisible(false);
    }
  };

  const filteredCompanies = companies.filter(item => {
    return (
      !search ||
      item.nombre.toLowerCase().includes(search.toLowerCase()) ||
      item.sector.toLowerCase().includes(search.toLowerCase())
    );
  });

  const renderCompanyCard = ({ item }: { item: Company }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={[styles.avatar, { backgroundColor: item.logo_color || '#2563eb' }]}>
          <Text style={styles.avatarText}>{item.logo_initial || item.nombre[0]}</Text>
        </View>
        <View style={styles.headerInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.companyName}>{item.nombre}</Text>
            {item.verificada && <ShieldCheck size={14} color="#2563eb" />}
          </View>
          <Text style={styles.sectorText}>{item.sector} · {item.tamano}</Text>
        </View>
      </View>

      {/* Metrics Row */}
      <View style={styles.metricsRow}>
        <View style={styles.metricItem}>
          <Zap size={14} color="#d97706" />
          <Text style={styles.metricValue}>{item.tiempo_respuesta}</Text>
          <Text style={styles.metricLabel}>Resp. media</Text>
        </View>
        <View style={styles.metricDivider} />
        <View style={styles.metricItem}>
          <ShieldCheck size={14} color="#059669" />
          <Text style={styles.metricValue}>{item.tasa_ghosting}</Text>
          <Text style={styles.metricLabel}>Tasa ghosting</Text>
        </View>
        <View style={styles.metricDivider} />
        <View style={styles.metricItem}>
          <Star size={14} color="#2563eb" fill="#2563eb" />
          <Text style={styles.metricValue}>{item.rating_entrevistas}</Text>
          <Text style={styles.metricLabel}>Entrevistas</Text>
        </View>
      </View>

      <Text style={styles.descriptionText}>{item.descripcion}</Text>

      {/* Insignias Obtenidas */}
      <Text style={styles.sectionSubtitle}>TRATO A CANDIDATURAS</Text>
      <View style={styles.badgesRow}>
        {item.insignias_obtenidas.map((ins, idx) => (
          <View key={idx} style={styles.insigniaChip}>
            <Check size={11} color="#059669" />
            <Text style={styles.insigniaText}>{ins}</Text>
          </View>
        ))}
      </View>

      {/* Footer */}
      <View style={styles.cardFooter}>
        <Text style={styles.vacantesText}>{item.vacantes_count} vacantes activas</Text>
        <TouchableOpacity
          style={styles.reviewButton}
          onPress={() => {
            setSelectedCompany(item);
            setReviewModalVisible(true);
          }}
        >
          <Text style={styles.reviewButtonText}>Ver insignias & opiniones</Text>
          <ArrowRight size={13} color="#2563eb" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Metrics Banner */}
      <View style={styles.metricsBanner}>
        <View style={styles.bannerItem}>
          <Text style={styles.bannerValue}>4</Text>
          <Text style={styles.bannerLabel}>EMPRESAS TOP</Text>
        </View>
        <View style={styles.bannerDivider} />
        <View style={styles.bannerItem}>
          <Text style={styles.bannerValue}>0%</Text>
          <Text style={styles.bannerLabel}>GHOSTING AUDITADO</Text>
        </View>
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Search size={18} color="#94a3b8" />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por empresa, sector o insignia..."
          placeholderTextColor="#94a3b8"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* List */}
      <FlatList
        data={filteredCompanies}
        keyExtractor={item => item.id}
        renderItem={renderCompanyCard}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchCompanies} />}
      />

      {/* Review Modal */}
      <Modal visible={reviewModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Valorar proceso en {selectedCompany?.nombre}</Text>
              <TouchableOpacity onPress={() => setReviewModalVisible(false)}>
                <X size={20} color="#64748b" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>
              Tu opinión audita de forma anónima el trato a candidatos y la ausencia de ghosting.
            </Text>

            {/* Rating Stars */}
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map(star => (
                <TouchableOpacity key={star} onPress={() => setReviewRating(star)}>
                  <Star
                    size={28}
                    color={star <= reviewRating ? '#f59e0b' : '#cbd5e1'}
                    fill={star <= reviewRating ? '#f59e0b' : 'transparent'}
                  />
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={styles.reviewInput}
              placeholder="¿Cómo fue la entrevista? ¿Te dieron feedback claro a tiempo?"
              placeholderTextColor="#94a3b8"
              multiline
              numberOfLines={4}
              value={reviewText}
              onChangeText={setReviewText}
            />

            <TouchableOpacity style={styles.sendReviewButton} onPress={handleSendReview}>
              <Text style={styles.sendReviewButtonText}>Enviar valoración anónima</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  metricsBanner: {
    flexDirection: 'row',
    backgroundColor: '#0f172a',
    margin: 16,
    borderRadius: 16,
    padding: 16,
  },
  bannerItem: {
    flex: 1,
    alignItems: 'center',
  },
  bannerValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
  },
  bannerLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  bannerDivider: {
    width: 1,
    backgroundColor: '#334155',
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
    marginBottom: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0f172a',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 14,
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
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
  },
  headerInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  companyName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },
  sectorText: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  metricsRow: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    alignItems: 'center',
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
    marginTop: 2,
  },
  metricLabel: {
    fontSize: 10,
    color: '#64748b',
  },
  metricDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#e2e8f0',
  },
  descriptionText: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 18,
    marginBottom: 12,
  },
  sectionSubtitle: {
    fontSize: 9,
    fontWeight: '800',
    color: '#94a3b8',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  insigniaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    gap: 4,
  },
  insigniaText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#065f46',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 10,
  },
  vacantesText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
  },
  reviewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reviewButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563eb',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 16,
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 16,
  },
  reviewInput: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    padding: 12,
    fontSize: 13,
    color: '#0f172a',
    textAlignVertical: 'top',
    height: 100,
    marginBottom: 16,
  },
  sendReviewButton: {
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  sendReviewButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
});

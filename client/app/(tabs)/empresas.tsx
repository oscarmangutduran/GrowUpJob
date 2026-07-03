import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, TextInput, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedText } from '../../components/themed-text';
import { ThemedView } from '../../components/themed-view';

interface Company {
  id: number;
  name: string;
  industry: string;
  size: string;
  description: string;
  jobsCount: number;
}

export default function EmpresasScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const mockCompanies: Company[] = [
    { id: 1, name: 'AppCreators', industry: 'Desarrollo de Software', size: '50-100 empleados', description: 'Empresa líder en el desarrollo de aplicaciones móviles nativas e híbridas.', jobsCount: 3 },
    { id: 2, name: 'Global Data', industry: 'Big Data & IA', size: '100-500 empleados', description: 'Servicios de análisis de datos e infraestructura inteligente en la nube.', jobsCount: 5 },
    { id: 3, name: 'Bussines Consult', industry: 'Consultoría TI', size: '500+ empleados', description: 'Consultoría estratégica para implantaciones ERP y transformación digital.', jobsCount: 2 },
    { id: 4, name: 'Pixel Art', industry: 'Diseño Gráfico y UI/UX', size: '10-50 empleados', description: 'Agencia boutique especializada en diseño de experiencias e identidad visual.', jobsCount: 1 },
    { id: 5, name: 'CodeDev', industry: 'Desarrollo de Software', size: '20-50 empleados', description: 'Factoría de software ágil especializada en Laravel, Vue y React.', jobsCount: 4 },
  ];

  const filteredCompanies = mockCompanies.filter(company => 
    company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    company.industry.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <LinearGradient
      colors={['#0f0c20', '#15102a', '#06030d']}
      style={styles.container}
    >
      <View style={styles.header}>
        <ThemedText type="subtitle" style={styles.headerTitle}>Empresas</ThemedText>
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchWrapper}>
          <Ionicons name="search" size={20} color="rgba(255, 255, 255, 0.5)" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar empresas, sectores..."
            placeholderTextColor="rgba(255, 255, 255, 0.5)"
            value={searchQuery}
            onChangeText={setSearchQuery}
            {...Platform.select({
              web: {
                outlineStyle: 'none' as any,
              },
              default: {},
            })}
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {filteredCompanies.length > 0 ? (
          filteredCompanies.map((company) => (
            <TouchableOpacity key={company.id} style={styles.companyCard} onPress={() => alert(`Detalles de ${company.name}`)}>
              <View style={styles.companyCardHeader}>
                <View style={styles.companyIconBg}>
                  <Ionicons name="business" size={24} color="#f59e0b" />
                </View>
                <View style={styles.companyTitleContainer}>
                  <ThemedText style={styles.companyName}>{company.name}</ThemedText>
                  <ThemedText style={styles.companyIndustry}>{company.industry}</ThemedText>
                </View>
              </View>

              <ThemedText style={styles.companyDescription}>{company.description}</ThemedText>

              <View style={styles.companyCardFooter}>
                <View style={styles.sizeBadge}>
                  <Ionicons name="people-outline" size={14} color="rgba(255, 255, 255, 0.5)" />
                  <ThemedText style={styles.sizeText}>{company.size}</ThemedText>
                </View>
                <ThemedText style={styles.activeJobsText}>{company.jobsCount} ofertas activas &rarr;</ThemedText>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={48} color="rgba(255, 255, 255, 0.2)" />
            <ThemedText style={styles.emptyText}>No se encontraron empresas.</ThemedText>
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  headerTitle: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  searchSection: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 10,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    height: 48,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#ffffff',
    fontSize: 15,
    height: '100%',
  },
  scrollContent: {
    padding: 24,
    gap: 16,
  },
  companyCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  companyCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 12,
  },
  companyIconBg: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  companyTitleContainer: {
    flex: 1,
  },
  companyName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  companyIndustry: {
    color: '#f59e0b',
    fontSize: 13,
    marginTop: 2,
  },
  companyDescription: {
    color: 'rgba(255, 255, 255, 0.65)',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
  },
  companyCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
    paddingTop: 12,
  },
  sizeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 6,
  },
  sizeText: {
    color: '#ffffff',
    fontSize: 12,
  },
  activeJobsText: {
    color: '#f59e0b',
    fontWeight: 'bold',
    fontSize: 13,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  emptyText: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 14,
    textAlign: 'center',
  },
});

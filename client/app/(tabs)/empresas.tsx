import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, TextInput, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import styles from '../../css/empresasStyles';
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
      colors={['#02060E', '#3a0814', '#02060E']}
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
            placeholderTextColor="rgba(15, 23, 42, 0.45)"
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
                  <Ionicons name="business" size={24} color="#C50337" />
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



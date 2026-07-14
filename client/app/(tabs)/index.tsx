import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, TextInput, Platform, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemedText } from '../../components/themed-text';
import { ThemedView } from '../../components/themed-view';
import { apiRequest } from '../../services/api';

interface Job {
  id: number;
  title: string;
  company_name: string;
  description: string;
  location: string;
  salary: string | null;
  type: string;
}

export default function EmpleoScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchJobs = async (search = '') => {
    try {
      const url = search ? `/job-listings?search=${encodeURIComponent(search)}` : '/job-listings';
      const response = await apiRequest(url);
      if (response.status === 'success' && response.listings) {
        setJobs(response.listings);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchJobs(searchQuery);
  }, [searchQuery]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchJobs(searchQuery);
  };

  return (
    <LinearGradient
      colors={['#02060E', '#3a0814', '#02060E']}
      style={styles.container}
    >
      <View style={styles.header}>
        <ThemedText type="subtitle" style={styles.headerTitle}>Empleo Privado</ThemedText>
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchWrapper}>
          <Ionicons name="search" size={20} color="rgba(255, 255, 255, 0.5)" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar puestos, empresas..."
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

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} tintColor="#ffffff" />
        }
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#C50337" />
          </View>
        ) : jobs.length > 0 ? (
          jobs.map((job) => (
              <TouchableOpacity key={job.id} style={styles.jobCard} onPress={() => alert(`Postularse a ${job.title}`)}>
                <View style={styles.jobCardHeader}>
                  <View style={styles.companyIconBg}>
                    <Ionicons name="briefcase" size={24} color="#C50337" />
                  </View>
                  <View style={styles.jobTitleContainer}>
                    <ThemedText style={styles.jobTitle}>{job.title}</ThemedText>
                    <ThemedText style={styles.companyName}>{job.company_name}</ThemedText>
                  </View>
                </View>

                <View style={styles.jobCardDetails}>
                  <View style={styles.detailRow}>
                    <Ionicons name="location-outline" size={16} color="rgba(255, 255, 255, 0.5)" />
                    <ThemedText style={styles.detailText}>{job.location}</ThemedText>
                  </View>
                  {job.salary ? (
                    <View style={styles.detailRow}>
                      <Ionicons name="cash-outline" size={16} color="rgba(255, 255, 255, 0.5)" />
                      <ThemedText style={styles.detailText}>{job.salary}</ThemedText>
                    </View>
                  ) : null}
                </View>

                <View style={styles.jobCardFooter}>
                  <View style={styles.typeBadge}>
                    <ThemedText style={styles.typeText}>{job.type}</ThemedText>
                  </View>
                  <ThemedText style={styles.postulateText}>Postularse &rarr;</ThemedText>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={48} color="rgba(255, 255, 255, 0.2)" />
              <ThemedText style={styles.emptyText}>No se encontraron ofertas de empleo.</ThemedText>
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
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#0f172a',
    fontSize: 15,
    height: '100%',
  },
  scrollContent: {
    padding: 24,
    gap: 16,
  },
  jobCard: {
    backgroundColor: 'rgba(2, 6, 14, 0.65)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(197, 3, 55, 0.25)',
  },
  jobCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 16,
  },
  companyIconBg: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(197, 3, 55, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  jobTitleContainer: {
    flex: 1,
  },
  jobTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  companyName: {
    color: '#C50337',
    fontSize: 13,
    marginTop: 2,
  },
  jobCardDetails: {
    gap: 8,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    color: 'rgba(255, 255, 255, 0.65)',
    fontSize: 13,
  },
  jobCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
    paddingTop: 12,
  },
  typeBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  typeText: {
    color: '#ffffff',
    fontSize: 12,
  },
  postulateText: {
    color: '#C50337',
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
});

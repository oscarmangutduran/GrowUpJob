import { StyleSheet, Platform } from 'react-native';

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
    flexDirection: 'row',
    gap: 12,
  },
  searchWrapper: {
    flex: 1,
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
    ...Platform.select({
      web: {
        outlineStyle: 'none' as any,
        borderWidth: 0,
      },
    }),
  },
  clearSearchButton: {
    padding: 4,
  },
  scrollContent: {
    padding: 24,
    gap: 16,
  },
  courseCard: {
    backgroundColor: 'rgba(2, 6, 14, 0.65)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(197, 3, 55, 0.25)',
  },
  courseCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 16,
  },
  providerIconBg: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(197, 3, 55, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  courseTitleContainer: {
    flex: 1,
  },
  courseTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  providerName: {
    color: '#C50337',
    fontSize: 13,
    marginTop: 2,
  },
  courseCardDetails: {
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
  courseCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
    paddingTop: 12,
  },
  categoryBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
    color: '#ffffff',
    fontSize: 12,
  },
  enrollText: {
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
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  filterButtonActive: {
    backgroundColor: '#C50337',
    borderColor: '#C50337',
  },
  filterPanel: {
    backgroundColor: 'rgba(2, 6, 14, 0.85)',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    gap: 16,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 16,
  },
  filterCol: {
    flex: 1,
    gap: 8,
  },
  filterLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 13,
    fontWeight: '600',
  },
  filterSelectorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  filterBadgeActive: {
    backgroundColor: '#C50337',
    borderColor: '#C50337',
  },
  filterBadgeText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    fontWeight: '500',
  },
  filterBadgeTextActive: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 44,
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.08)',
  },
  dropdownButtonText: {
    color: '#0f172a',
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  dropdownList: {
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.08)',
    marginTop: 4,
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(15, 23, 42, 0.04)',
  },
  dropdownItemText: {
    color: '#334155',
    fontSize: 13,
  },
  filterPanelActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
    paddingTop: 12,
  },
  clearFiltersButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  clearFiltersText: {
    color: '#C50337',
    fontSize: 13,
    fontWeight: '600',
  },
});

export default styles;

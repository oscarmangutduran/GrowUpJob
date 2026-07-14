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
  scrollContent: {
    padding: 24,
    gap: 20,
  },
  overviewCard: {
    backgroundColor: 'rgba(2, 6, 14, 0.65)',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(197, 3, 55, 0.25)',
  },
  trophyIcon: {
    marginBottom: 12,
  },
  overviewTitle: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  overviewSubtitle: {
    color: 'rgba(255, 230, 235, 0.65)',
    fontSize: 13,
    marginTop: 6,
    textAlign: 'center',
  },
  badgeList: {
    gap: 16,
  },
  badgeCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(2, 6, 14, 0.65)',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(197, 3, 55, 0.25)',
    gap: 16,
    alignItems: 'center',
  },
  badgeLockedCard: {
    opacity: 0.65,
  },
  iconBg: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeTextContainer: {
    flex: 1,
  },
  badgeHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
    flexWrap: 'wrap',
    gap: 6,
  },
  badgeTitle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  badgeLockedText: {
    color: 'rgba(255, 255, 255, 0.5)',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusTextUnlocked: {
    color: '#10b981',
    fontSize: 10,
    fontWeight: 'bold',
  },
  statusTextLocked: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 10,
    fontWeight: 'bold',
  },
  badgeDescription: {
    color: 'rgba(255, 230, 235, 0.65)',
    fontSize: 13,
    lineHeight: 18,
  },
});

export default styles;

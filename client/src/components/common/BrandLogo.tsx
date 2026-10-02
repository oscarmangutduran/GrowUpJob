import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Rect, Circle } from 'react-native-svg';

export function BrandLogo({ size = 36 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      {/* Background shape */}
      <Rect width="40" height="40" rx="10" fill="#1E293B" />
      {/* Growth bars */}
      <Rect x="9" y="23" width="5" height="9" rx="2.5" fill="#64748B" />
      <Rect x="17.5" y="16" width="5" height="16" rx="2.5" fill="#3B82F6" />
      <Rect x="26" y="9" width="5" height="23" rx="2.5" fill="#10B981" />
      {/* Dynamic trajectory dot */}
      <Circle cx="28.5" cy="6" r="2" fill="#34D399" />
    </Svg>
  );
}

export function BrandText({ isDark = false, size = 'md' }: { isDark?: boolean; size?: 'sm' | 'md' | 'lg' }) {
  const isLg = size === 'lg';
  return (
    <View style={styles.textContainer}>
      <View style={styles.row}>
        <Text style={[styles.mainText, isLg && styles.mainTextLg, { color: isDark ? '#ffffff' : '#0f172a' }]}>
          Grow<Text style={{ color: '#2563eb' }}>Up</Text><Text style={{ color: '#059669' }}>Job</Text>
        </Text>
        <View style={styles.proBadge}>
          <Text style={styles.proText}>PRO</Text>
        </View>
      </View>
      <Text style={[styles.subText, isLg && styles.subTextLg, { color: isDark ? '#94a3b8' : '#64748b' }]}>
        EMPLEO & CARRERA PROFESIONAL
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  textContainer: {
    marginLeft: 10,
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mainText: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  mainTextLg: {
    fontSize: 22,
  },
  proBadge: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 1,
    marginLeft: 6,
  },
  proText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1d4ed8',
    letterSpacing: 0.5,
  },
  subText: {
    fontSize: 8.5,
    fontWeight: '700',
    letterSpacing: 1.4,
    marginTop: 2,
  },
  subTextLg: {
    fontSize: 9.5,
  },
});

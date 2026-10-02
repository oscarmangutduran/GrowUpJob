import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Rect, Defs, LinearGradient, Stop } from 'react-native-svg';

export function BrandLogo({ size = 32 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <Defs>
        <LinearGradient id="g1" x1="0" y1="0" x2="0" y2="40" gradientUnits="userSpaceOnUse">
          <Stop stopColor="#0284c7" />
          <Stop offset="1" stopColor="#0369a1" />
        </LinearGradient>
        <LinearGradient id="g2" x1="0" y1="0" x2="0" y2="40" gradientUnits="userSpaceOnUse">
          <Stop stopColor="#2563eb" />
          <Stop offset="1" stopColor="#1d4ed8" />
        </LinearGradient>
        <LinearGradient id="g3" x1="0" y1="0" x2="0" y2="40" gradientUnits="userSpaceOnUse">
          <Stop stopColor="#10b981" />
          <Stop offset="1" stopColor="#059669" />
        </LinearGradient>
      </Defs>
      <Rect width="40" height="40" rx="10" fill="#0f172a" />
      <Rect x="8" y="20" width="5" height="12" rx="2.5" fill="url(#g1)" />
      <Rect x="17.5" y="13" width="5" height="19" rx="2.5" fill="url(#g2)" />
      <Rect x="27" y="8" width="5" height="24" rx="2.5" fill="url(#g3)" />
    </Svg>
  );
}

export function BrandText({ isDark = false }: { isDark?: boolean }) {
  return (
    <View style={styles.textContainer}>
      <View style={styles.row}>
        <Text style={[styles.mainText, { color: isDark ? '#ffffff' : '#0f172a' }]}>
          Grow<Text style={{ color: '#2563eb' }}>Up</Text>Job
        </Text>
        <View style={styles.proBadge}>
          <Text style={styles.proText}>PRO</Text>
        </View>
      </View>
      <Text style={[styles.subText, { color: isDark ? '#94a3b8' : '#64748b' }]}>
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
  proBadge: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 1,
    marginLeft: 6,
  },
  proText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#2563eb',
  },
  subText: {
    fontSize: 7.5,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginTop: 1,
  },
});

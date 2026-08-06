import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function App() {
  const [activeTab, setActiveTab] = useState('Overview');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* ================= APPLE & GOOGLE HYBRID HEADER ================= */}
      <View style={styles.header}>
        {/* Top Context & Workspace Bar */}
        <View style={styles.topNav}>
          <TouchableOpacity style={styles.workspacePill} activeOpacity={0.8}>
            <View style={styles.appleLogoIcon}>
              <Ionicons name="sparkles" size={12} color="#F5F5F7" />
            </View>
            <Text style={styles.workspaceTitle}>Workspace</Text>
            <Text style={styles.workspaceDivider}>/</Text>
            <Text style={styles.workspaceName}>Studio</Text>
            <Ionicons name="chevron-down-sharp" size={10} color="#86868B" />
          </TouchableOpacity>

          <View style={styles.headerActions}>
            {/* Google Search Pill */}
            <TouchableOpacity style={styles.searchPill} activeOpacity={0.8}>
              <Ionicons name="search" size={14} color="#86868B" />
              <Text style={styles.searchText}>Search</Text>
              <View style={styles.shortcutBadge}>
                <Text style={styles.shortcutText}>⌘K</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.profileAvatar} activeOpacity={0.8}>
              <Text style={styles.profileInitials}>S</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tab Switcher */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabBar}
        >
          {[
            { id: 'Overview', icon: 'grid-outline' },
            { id: 'Analytics', icon: 'analytics-outline' },
            { id: 'Deployments', icon: 'cloud-done-outline' },
            { id: 'Settings', icon: 'options-outline' },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                onPress={() => setActiveTab(tab.id)}
                style={[styles.tabChip, isActive && styles.tabChipActive]}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={tab.icon}
                  size={13}
                  color={isActive ? '#FFFFFF' : '#86868B'}
                />
                <Text style={[styles.tabChipText, isActive && styles.tabChipTextActive]}>
                  {tab.id}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Main Content Area */}
      <ScrollView contentContainerStyle={styles.canvas}>
        <View style={styles.appleCard}>
          <Text style={styles.cardHeaderTag}>SYSTEM VIEW</Text>
          <Text style={styles.cardTitle}>{activeTab}</Text>
          <Text style={styles.cardBody}>
            Designed with high contrast ratios, precision spatial hierarchy, and fluid interactive surfaces.
          </Text>
        </View>
      </ScrollView>

      {/* ================= APPLE-INSPIRED FOOTER ================= */}
      <View style={styles.footer}>
        {/* Top Status & System Indicator */}
        <View style={styles.footerStatusRow}>
          <View style={styles.appleBrandMark}>
            <Ionicons name="logo-apple" size={14} color="#F5F5F7" />
            <Text style={styles.appleBrandText}>Cloud Services</Text>
          </View>

          <View style={styles.materialStatusChip}>
            <View style={styles.statusPulseDot} />
            <Text style={styles.statusChipText}>Systems Normal</Text>
          </View>
        </View>

        {/* Footer Navigation Columns */}
        <View style={styles.footerGrid}>
          <View style={styles.footerCol}>
            <Text style={styles.colTitle}>Platform</Text>
            <TouchableOpacity><Text style={styles.colItem}>Compute</Text></TouchableOpacity>
            <TouchableOpacity><Text style={styles.colItem}>Storage</Text></TouchableOpacity>
            <TouchableOpacity><Text style={styles.colItem}>Network</Text></TouchableOpacity>
          </View>

          <View style={styles.footerCol}>
            <Text style={styles.colTitle}>Resources</Text>
            <TouchableOpacity><Text style={styles.colItem}>Documentation</Text></TouchableOpacity>
            <TouchableOpacity><Text style={styles.colItem}>API Reference</Text></TouchableOpacity>
            <TouchableOpacity><Text style={styles.colItem}>Support</Text></TouchableOpacity>
          </View>

          <View style={styles.footerCol}>
            <Text style={styles.colTitle}>Account</Text>
            <TouchableOpacity><Text style={styles.colItem}>Manage ID</Text></TouchableOpacity>
            <TouchableOpacity><Text style={styles.colItem}>Security</Text></TouchableOpacity>
            <TouchableOpacity><Text style={styles.colItem}>Billing</Text></TouchableOpacity>
          </View>
        </View>

        {/* Legal & Fine Print */}
        <View style={styles.footerLegal}>
          <Text style={styles.legalText}>
            Copyright © 2026 Inc. All rights reserved.
          </Text>
          <View style={styles.legalLinks}>
            <TouchableOpacity><Text style={styles.legalLink}>Privacy</Text></TouchableOpacity>
            <Text style={styles.legalDivider}>|</Text>
            <TouchableOpacity><Text style={styles.legalLink}>Terms</Text></TouchableOpacity>
            <Text style={styles.legalDivider}>|</Text>
            <TouchableOpacity><Text style={styles.legalLink}>Legal</Text></TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', // Pure Apple OLED Dark Mode
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  canvas: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  appleCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  cardHeaderTag: {
    color: '#0A84FF', // Apple San Francisco Blue
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  cardTitle: {
    color: '#F5F5F7',
    fontSize: 24,
    fontWeight: '600',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  cardBody: {
    color: '#86868B',
    fontSize: 14,
    lineHeight: 20,
  },

  /* HEADER STYLES */
  header: {
    backgroundColor: 'rgba(28, 28, 30, 0.85)', // Frosted look
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  workspacePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C2C2E',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20, // Google M3 Pill shape
    gap: 6,
  },
  appleLogoIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#0A84FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  workspaceTitle: {
    color: '#F5F5F7',
    fontSize: 12,
    fontWeight: '600',
  },
  workspaceDivider: {
    color: '#6E6E73',
    fontSize: 12,
  },
  workspaceName: {
    color: '#86868B',
    fontSize: 12,
    fontWeight: '500',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C2C2E',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    gap: 6,
  },
  searchText: {
    color: '#86868B',
    fontSize: 12,
  },
  shortcutBadge: {
    backgroundColor: '#3A3A3C',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
  },
  shortcutText: {
    color: '#86868B',
    fontSize: 9,
    fontWeight: '700',
  },
  profileAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#3A3A3C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitials: {
    color: '#F5F5F7',
    fontSize: 12,
    fontWeight: '600',
  },
  tabBar: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    gap: 8,
  },
  tabChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: 'transparent',
    gap: 6,
  },
  tabChipActive: {
    backgroundColor: '#3A3A3C',
  },
  tabChipText: {
    color: '#86868B',
    fontSize: 13,
    fontWeight: '500',
  },
  tabChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },

  /* FOOTER STYLES */
  footer: {
    backgroundColor: '#1C1C1E',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
  },
  footerStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  appleBrandMark: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  appleBrandText: {
    color: '#F5F5F7',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  materialStatusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2C2C2E',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    gap: 6,
  },
  statusPulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#30D158', // Apple Green
  },
  statusChipText: {
    color: '#86868B',
    fontSize: 11,
    fontWeight: '500',
  },
  footerGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  footerCol: {
    gap: 8,
  },
  colTitle: {
    color: '#F5F5F7',
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 2,
  },
  colItem: {
    color: '#86868B',
    fontSize: 12,
  },
  footerLegal: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    gap: 8,
  },
  legalText: {
    color: '#6E6E73',
    fontSize: 11,
  },
  legalLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legalLink: {
    color: '#86868B',
    fontSize: 11,
  },
  legalDivider: {
    color: '#3A3A3C',
    fontSize: 10,
  },
});
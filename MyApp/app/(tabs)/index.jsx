import React, { useMemo } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useExpenses } from '@/context/ExpensesContext';
import { useAuth } from '@/context/AuthContext';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Colors } from '@/constants/colors';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';

export default function DashboardScreen() {
  const { user } = useAuth();
  const { groups, expenses } = useExpenses();

  const totalSpent = useMemo(() => expenses.reduce((sum, e) => sum + e.amount, 0), [expenses]);
  const recentGroups = useMemo(() => groups.slice(0, 3), [groups]);
  const recentExpenses = useMemo(() => expenses.slice(0, 5), [expenses]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>

        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello,</Text>
            <Text style={styles.username}>{user?.name || 'Guest'}</Text>
          </View>
          <TouchableOpacity style={styles.notifBtn}>
            <IconSymbol name="bell.fill" size={20} color={Colors.text.primary} />
          </TouchableOpacity>
        </View>

        <AnimatedCard style={styles.summaryCard}>
          <LinearGradient
            colors={Colors.gradients.primary}
            style={styles.summaryGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View>
              <Text style={styles.summaryLabel}>Total Expenses</Text>
              <Text style={styles.summaryValue}>₹{totalSpent.toLocaleString()}</Text>
            </View>
            <View style={styles.summaryIcon}>
              <IconSymbol name="chart.bar.fill" size={24} color="#FFF" />
            </View>
          </LinearGradient>
        </AnimatedCard>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: Colors.success.light }]}>
              <IconSymbol name="arrow.down.left" size={20} color={Colors.success.dark} />
            </View>
            <Text style={styles.statLabel}>You are owed</Text>
            <Text style={[styles.statValue, { color: Colors.success.dark }]}>₹0</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: Colors.warning.light }]}>
              <IconSymbol name="arrow.up.right" size={20} color={Colors.warning.dark} />
            </View>
            <Text style={styles.statLabel}>You owe</Text>
            <Text style={[styles.statValue, { color: Colors.warning.dark }]}>₹0</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Groups</Text>
          <Link href="/groups" asChild>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </Link>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.groupsRow}>
          {recentGroups.length === 0 ? (
            <Text style={styles.emptyText}>No groups yet. Create one!</Text>
          ) : (
            recentGroups.map((group, index) => (
              <Link key={group.id} href={{ pathname: '/group-details', params: { id: group.id } }} asChild>
                <TouchableOpacity>
                  <AnimatedCard style={styles.groupCard} delay={index * 100}>
                    <View style={[styles.groupIcon, { backgroundColor: getGroupColor(group.type) + '20' }]}>
                      <Text style={{ fontSize: 24 }}>{getGroupIcon(group.type)}</Text>
                    </View>
                    <Text style={styles.groupName} numberOfLines={1}>{group.name}</Text>
                    <Text style={styles.groupMembers}>{group.members.length} members</Text>
                  </AnimatedCard>
                </TouchableOpacity>
              </Link>
            ))
          )}
        </ScrollView>

        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityList}>
          {recentExpenses.length === 0 ? (
            <Text style={styles.emptyText}>No expenses recorded yet.</Text>
          ) : (
            recentExpenses.map((expense, index) => (
              <AnimatedCard key={expense.id} style={styles.activityItem} delay={index * 50}>
                <View style={styles.activityIcon}>
                  <IconSymbol name="cart.fill" size={20} color={Colors.neutral[500]} />
                </View>
                <View style={styles.activityInfo}>
                  <Text style={styles.activityTitle}>{expense.description}</Text>
                  <Text style={styles.activityMeta}>Paid by {expense.payer}</Text>
                </View>
                <Text style={styles.activityAmount}>₹{expense.amount}</Text>
              </AnimatedCard>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

function getGroupIcon(type) {
  switch (type) {
    case 'trip': return '✈️';
    case 'home': return '🏠';
    case 'food': return '🍕';
    case 'couple': return '❤️';
    default: return '👥';
  }
}

function getGroupColor(type) {
  switch (type) {
    case 'trip': return Colors.primary.solid;
    case 'home': return Colors.secondary.main;
    case 'food': return Colors.warning.main;
    case 'couple': return Colors.danger.main;
    default: return Colors.neutral[400];
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 24,
    paddingTop: 60,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 16,
    color: Colors.text.secondary,
    fontWeight: '600',
  },
  username: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.text.primary,
  },
  notifBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryCard: {
    borderRadius: 24,
    marginBottom: 24,
    shadowColor: Colors.primary.solid,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  summaryGradient: {
    padding: 24,
    borderRadius: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  summaryValue: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: '800',
  },
  summaryIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFF',
    backgroundColor: Colors.card,
    padding: 16,
    borderRadius: 20,
    gap: 8,
    shadowColor: Colors.primary.solid,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 4,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.secondary,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  seeAll: {
    color: Colors.primary.solid,
    fontWeight: '600',
  },
  groupsRow: {
    gap: 16,
    paddingRight: 24,
    marginBottom: 32,
  },
  groupCard: {
    width: 140,
    padding: 16,
    backgroundColor: Colors.card,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  groupIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  groupName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  groupMembers: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  activityList: {
    gap: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.card,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 2,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  activityMeta: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  activityAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  emptyText: {
    color: Colors.text.muted,
    fontStyle: 'italic',
  },
});

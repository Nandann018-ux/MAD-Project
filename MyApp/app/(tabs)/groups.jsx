import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useExpenses } from '@/context/ExpensesContext';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Colors } from '@/constants/colors';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function GroupsScreen() {
  const { groups, addGroup } = useExpenses();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const router = useRouter();

  const handleCreateGroup = () => {
    if (newGroupName.trim()) {
      addGroup(newGroupName, ['You']);
      setNewGroupName('');
      setShowCreateForm(false);
    }
  };

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn}>
          <IconSymbol name="line.3.horizontal" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Groups</Text>
        <TouchableOpacity style={styles.iconBtn}>
          <IconSymbol name="magnifyingglass" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {showCreateForm && (
          <AnimatedCard style={styles.createForm}>
            <Text style={styles.formTitle}>New Group</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Name your group"
                placeholderTextColor={Colors.text.muted}
                value={newGroupName}
                onChangeText={setNewGroupName}
                autoFocus
              />
              <TouchableOpacity onPress={handleCreateGroup} style={styles.createBtnArrow}>
                <IconSymbol name="arrow.right" size={20} color="#FFF" />
              </TouchableOpacity>
            </View>
          </AnimatedCard>
        )}

        {groups.length === 0 ? (
          <View style={styles.emptyState}>
            <IconSymbol name="person.3.fill" size={48} color={Colors.neutral[600]} />
            <Text style={styles.emptyText}>No groups yet</Text>
          </View>
        ) : (
          <View style={styles.list}>
            {groups.map((item, index) => (
              <Link key={item.id} href={{ pathname: '/group-details', params: { id: item.id } }} asChild>
                <TouchableOpacity activeOpacity={0.9}>
                  <AnimatedCard style={styles.groupCard} delay={index * 50}>

                    <View style={[styles.cardImagePlaceholder, { backgroundColor: getGroupColor(item.type) }]}>
                      {item.image ? (
                        <Image source={{ uri: item.image }} style={styles.cardImage} />
                      ) : (
                        <IconSymbol name="person.3.fill" size={40} color="rgba(255,255,255,0.5)" />
                      )}
                    </View>

                    <View style={styles.cardContent}>
                      <Text style={styles.statusText}>
                        {index % 2 === 0 ? (
                          <Text style={{ color: Colors.success.main }}>You are owed ₹1,200</Text>
                        ) : (
                          <Text style={{ color: Colors.warning.main }}>You owe ₹550</Text>
                        )}
                      </Text>

                      <Text style={styles.groupName}>{item.name}</Text>
                      <Text style={styles.memberCount}>{item.members.length} members</Text>

                      <View style={styles.viewBtnContainer}>
                        <View style={styles.viewBtn}>
                          <Text style={styles.viewBtnText}>View Details</Text>
                        </View>
                      </View>
                    </View>
                  </AnimatedCard>
                </TouchableOpacity>
              </Link>
            ))}
          </View>
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowCreateForm(!showCreateForm)}
      >
        <IconSymbol name="plus" size={32} color="#FFF" />
      </TouchableOpacity>
    </View>
  );
}

function getGroupColor(type) {
  switch (type) {
    case 'trip': return Colors.primary.solid;
    case 'home': return Colors.secondary.main;
    case 'food': return Colors.warning.main;
    case 'couple': return Colors.danger.main;
    default: return Colors.neutral[700];
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  iconBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  createForm: {
    marginBottom: 24,
    padding: 20,
    backgroundColor: Colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.neutral[800],
  },
  formTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text.secondary,
    marginBottom: 16,
    textTransform: 'uppercase',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.text.primary,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[700],
  },
  createBtnArrow: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary.solid,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    gap: 12,
  },
  groupCard: {
    borderRadius: 16,
    backgroundColor: Colors.card,
    overflow: 'hidden',
    borderWidth: 0,
    flexDirection: 'row',
    height: 100,
  },
  cardImagePlaceholder: {
    width: 100,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardImage: {
    width: 100,
    height: '100%',
    resizeMode: 'cover',
  },
  cardContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  groupName: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 2,
  },
  memberCount: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  viewBtnContainer: {
    position: 'absolute',
    right: 12,
    bottom: 12,
  },
  viewBtn: {
    backgroundColor: Colors.neutral[800],
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  viewBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.secondary,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 16,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.text.muted,
  },
  fab: {
    position: 'absolute',
    bottom: 32,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary.solid,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary.solid,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
});

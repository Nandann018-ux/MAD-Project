
import React, { useState, useMemo } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { useExpenses } from '@/context/ExpensesContext';
import { Colors } from '@/constants/colors';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '@/context/AuthContext';

export default function ProfileScreen() {
  const { resetAllData, groups, computeBalances } = useExpenses();
  const { user, signOut, updateProfile } = useAuth();
  const [uploading, setUploading] = useState(false);

  const { totalOwed, totalOwe } = useMemo(() => {
    let owed = 0;
    let owe = 0;

    groups.forEach(group => {
      const balances = computeBalances(group.id);
      const myBal = balances['You'] || 0;
      if (myBal > 0) owed += myBal;
      else if (myBal < 0) owe += Math.abs(myBal);
    });

    return { totalOwed: owed, totalOwe: owe };
  }, [groups, computeBalances]);

  const handleReset = () => {
    Alert.alert(
      "Reset All Data",
      "Are you sure? This will delete all groups and expenses.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset & Logout",
          style: "destructive",
          onPress: () => {
            resetAllData();
            signOut();
          }
        }
      ]
    );
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled) {
        setUploading(true);

        await updateProfile({ image: result.assets[0].uri });
        setUploading(false);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
          <IconSymbol name="arrow.left" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity style={styles.iconBtn}>
          <IconSymbol name="gearshape" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        <View style={styles.profileSection}>
          <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
            {user?.image ? (
              <Image source={{ uri: user.image }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <IconSymbol name="person.fill" size={48} color={Colors.text.secondary} />
              </View>
            )}
            <View style={styles.editBadge}>
              <IconSymbol name="pencil" size={12} color="#FFF" />
            </View>
          </TouchableOpacity>
          <Text style={styles.name}>{user?.name || 'Guest User'}</Text>
          <Text style={styles.handle}>{user?.email || '@user'}</Text>
          <Text style={styles.memberSince}>Member since {new Date(user?.createdAt || Date.now()).getFullYear()}</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>You owe</Text>
            <Text style={styles.statValueNegative}>₹{totalOwe}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>You are owed</Text>
            <Text style={styles.statValuePositive}>₹{totalOwed}</Text>
          </View>
        </View>

        <View style={styles.menuContainer}>
          <MenuItem icon="person" label="Account Settings" />
          <MenuItem icon="creditcard" label="Payment Methods" />
          <MenuItem icon="bell" label="Notifications" />
          <MenuItem icon="questionmark.circle" label="Help & Support" />

          <TouchableOpacity style={styles.menuItem} onPress={signOut}>
            <View style={styles.menuItemLeft}>
              <IconSymbol name="rectangle.portrait.and.arrow.right" size={20} color={Colors.text.primary} />
              <Text style={styles.menuLabel}>Logout</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handleReset}>
            <View style={styles.menuItemLeft}>
              <IconSymbol name="trash" size={20} color={Colors.danger.main} />
              <Text style={[styles.menuLabel, { color: Colors.danger.main }]}>Reset App Data</Text>
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.inviteBtn}>
          <IconSymbol name="person.badge.plus" size={20} color="#000" />
          <Text style={styles.inviteBtnText}>Invite Friends</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

function MenuItem({ icon, label, onPress }) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuItemLeft}>
        <IconSymbol name={icon} size={20} color={Colors.text.primary} />
        <Text style={styles.menuLabel}>{label}</Text>
      </View>
      <IconSymbol name="chevron.right" size={16} color={Colors.text.primary} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  iconBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: Colors.card,
  },
  avatarPlaceholder: {
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.primary.solid,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.background,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  handle: {
    fontSize: 16,
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  memberSince: {
    fontSize: 12,
    color: Colors.text.muted,
  },
  statsContainer: {
    gap: 16,
    marginBottom: 32,
  },
  statCard: {
    backgroundColor: Colors.card,
    padding: 20,
    borderRadius: 16,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 8,
  },
  statValueNegative: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.warning.main,
  },
  statValuePositive: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.success.main,
  },
  menuContainer: {
    gap: 8,
    marginBottom: 32,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  menuLabel: {
    fontSize: 16,
    color: Colors.text.primary,
  },
  inviteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.secondary.main,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  inviteBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
});

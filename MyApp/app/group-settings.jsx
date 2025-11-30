import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput, Alert, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useExpenses } from '@/context/ExpensesContext';
import { Colors } from '@/constants/colors';
import { IconSymbol } from '@/components/ui/icon-symbol';
import * as ImagePicker from 'expo-image-picker';

export default function GroupSettingsScreen() {
    const { groupId } = useLocalSearchParams();
    const { groups, updateGroup, removeGroup, addMemberToGroup, removeMemberFromGroup } = useExpenses();
    const router = useRouter();

    const group = groups.find(g => g.id === groupId);
    const [name, setName] = useState(group?.name || '');
    const [newMember, setNewMember] = useState('');

    if (!group) return null;

    const handleSave = () => {
        updateGroup(groupId, { name });
        router.back();
    };

    const handleDeleteGroup = () => {
        Alert.alert(
            "Delete Group",
            "Are you sure? This cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => {
                        removeGroup(groupId);
                        router.replace('/(tabs)/groups');
                    }
                }
            ]
        );
    };

    const handleAddMember = () => {
        if (!newMember.trim()) return;
        if (group.members.includes(newMember.trim())) {
            Alert.alert("Error", "Member already exists");
            return;
        }
        addMemberToGroup(groupId, newMember.trim());
        setNewMember('');
    };

    const handleRemoveMember = (member) => {
        Alert.alert(
            "Remove Member",
            `Remove ${member} from group?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Remove",
                    style: "destructive",
                    onPress: () => removeMemberFromGroup(groupId, member)
                }
            ]
        );
    };

    const pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 0.5,
            });
            if (!result.canceled) {
                updateGroup(groupId, { image: result.assets[0].uri });
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to pick image');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
                    <IconSymbol name="arrow.left" size={24} color={Colors.text.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Group Settings</Text>
                <TouchableOpacity onPress={handleSave}>
                    <Text style={styles.saveBtnText}>Save</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>

                <TouchableOpacity style={styles.coverContainer} onPress={pickImage}>
                    <Image
                        source={{ uri: group.image || 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2832&auto=format&fit=crop' }}
                        style={styles.coverImage}
                    />
                    <View style={styles.editBadge}>
                        <IconSymbol name="camera.fill" size={16} color="#FFF" />
                    </View>
                </TouchableOpacity>

                <View style={styles.section}>
                    <Text style={styles.label}>Group Name</Text>
                    <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                        placeholder="Group Name"
                        placeholderTextColor={Colors.text.muted}
                    />
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>Members ({group.members.length})</Text>

                    {group.members.map((member, index) => (
                        <View key={index} style={styles.memberRow}>
                            <View style={styles.memberInfo}>
                                <View style={styles.memberAvatar}>
                                    <Text style={styles.memberAvatarText}>{member[0].toUpperCase()}</Text>
                                </View>
                                <Text style={styles.memberName}>{member}</Text>
                            </View>
                            {member !== 'You' && (
                                <TouchableOpacity onPress={() => handleRemoveMember(member)}>
                                    <IconSymbol name="trash" size={20} color={Colors.danger.main} />
                                </TouchableOpacity>
                            )}
                        </View>
                    ))}

                    <View style={styles.addMemberRow}>
                        <TextInput
                            style={styles.addMemberInput}
                            value={newMember}
                            onChangeText={setNewMember}
                            placeholder="Add new member..."
                            placeholderTextColor={Colors.text.muted}
                        />
                        <TouchableOpacity style={styles.addMemberBtn} onPress={handleAddMember}>
                            <IconSymbol name="plus" size={20} color="#FFF" />
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity style={styles.deleteBtn} onPress={handleDeleteGroup}>
                    <Text style={styles.deleteBtnText}>Delete Group</Text>
                </TouchableOpacity>

            </ScrollView>
        </View>
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
        borderBottomWidth: 1,
        borderBottomColor: Colors.neutral[800],
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.text.primary,
    },
    saveBtnText: {
        color: Colors.primary.solid,
        fontWeight: '700',
        fontSize: 16,
    },
    content: {
        padding: 20,
    },
    coverContainer: {
        height: 150,
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 24,
        position: 'relative',
    },
    coverImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    editBadge: {
        position: 'absolute',
        bottom: 12,
        right: 12,
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: 8,
        borderRadius: 20,
    },
    section: {
        marginBottom: 32,
    },
    label: {
        fontSize: 14,
        fontWeight: '700',
        color: Colors.text.secondary,
        marginBottom: 12,
        textTransform: 'uppercase',
    },
    input: {
        backgroundColor: Colors.card,
        padding: 16,
        borderRadius: 12,
        color: Colors.text.primary,
        fontSize: 16,
    },
    memberRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.neutral[800],
    },
    memberInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    memberAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.neutral[700],
        alignItems: 'center',
        justifyContent: 'center',
    },
    memberAvatarText: {
        color: '#FFF',
        fontWeight: '700',
    },
    memberName: {
        fontSize: 16,
        color: Colors.text.primary,
    },
    addMemberRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 16,
        gap: 12,
    },
    addMemberInput: {
        flex: 1,
        backgroundColor: Colors.card,
        padding: 12,
        borderRadius: 12,
        color: Colors.text.primary,
        fontSize: 16,
    },
    addMemberBtn: {
        backgroundColor: Colors.primary.solid,
        width: 48,
        height: 48,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    deleteBtn: {
        backgroundColor: 'rgba(251, 113, 133, 0.1)',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.danger.main,
        marginBottom: 40,
    },
    deleteBtnText: {
        color: Colors.danger.main,
        fontWeight: '700',
        fontSize: 16,
    },
});

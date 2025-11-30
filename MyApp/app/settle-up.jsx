import React, { useMemo, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useExpenses } from '@/context/ExpensesContext';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Colors } from '@/constants/colors';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { LinearGradient } from 'expo-linear-gradient';

export default function SettleUpScreen() {
    const { groupId } = useLocalSearchParams();
    const { groups, computeSettlements } = useExpenses();
    const [paidDebts, setPaidDebts] = useState([]);

    const group = useMemo(() => groups.find(g => g.id === groupId), [groups, groupId]);
    const settlements = useMemo(() => groupId ? computeSettlements(groupId) : [], [computeSettlements, groupId]);

    const handlePay = (index) => {
        setPaidDebts(prev => [...prev, index]);
    };

    if (!group) return null;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <IconSymbol name="arrow.left" size={24} color={Colors.text.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Who Owes Whom</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.groupName}>{group.name}</Text>

                {settlements.length === 0 ? (
                    <View style={styles.emptyState}>
                        <IconSymbol name="checkmark.circle.fill" size={64} color={Colors.success.main} />
                        <Text style={styles.emptyText}>All settled up!</Text>
                        <Text style={styles.emptySub}>No one owes anything in this group.</Text>
                    </View>
                ) : (
                    <View style={styles.list}>
                        {settlements.map((item, index) => {
                            const isPaid = paidDebts.includes(index);
                            return (
                                <AnimatedCard key={index} style={styles.card} delay={index * 100}>
                                    <View style={styles.row}>
                                        <View style={styles.person}>
                                            <View style={styles.avatar}>
                                                <Text style={styles.avatarText}>{item.from[0]}</Text>
                                            </View>
                                            <Text style={styles.name}>{item.from}</Text>
                                        </View>

                                        <View style={styles.arrowContainer}>
                                            <Text style={styles.amount}>₹{item.amount}</Text>
                                            <IconSymbol name="arrow.right" size={16} color={Colors.neutral[300]} />
                                        </View>

                                        <View style={styles.person}>
                                            <View style={[styles.avatar, { backgroundColor: Colors.secondary.light }]}>
                                                <Text style={[styles.avatarText, { color: '#FFF' }]}>{item.to[0]}</Text>
                                            </View>
                                            <Text style={styles.name}>{item.to}</Text>
                                        </View>
                                    </View>

                                    <TouchableOpacity
                                        style={[styles.payBtn, isPaid && styles.paidBtn]}
                                        onPress={() => !isPaid && handlePay(index)}
                                        activeOpacity={0.8}
                                    >
                                        {isPaid ? (
                                            <>
                                                <IconSymbol name="checkmark" size={16} color="#FFF" />
                                                <Text style={styles.payBtnText}>Paid</Text>
                                            </>
                                        ) : (
                                            <Text style={styles.payBtnText}>Mark as Paid</Text>
                                        )}
                                    </TouchableOpacity>
                                </AnimatedCard>
                            );
                        })}
                    </View>
                )}
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
        paddingHorizontal: 24,
        paddingBottom: 24,
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FFF',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.text.primary,
    },
    content: {
        padding: 24,
        paddingBottom: 100,
    },
    groupName: {
        fontSize: 14,
        fontWeight: '700',
        color: Colors.text.secondary,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 24,
        textAlign: 'center',
    },
    list: {
        gap: 16,
    },
    card: {
        backgroundColor: Colors.card,
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
    },
    label: {
        fontSize: 14,
        fontWeight: '700',
        color: Colors.text.secondary,
        marginBottom: 12,
        textTransform: 'uppercase',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.neutral[800],
    },
    rowLabel: {
        fontSize: 16,
        color: Colors.text.primary,
    },
    rowValue: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text.primary,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 32,
    },
    currency: {
        fontSize: 32,
        fontWeight: '700',
        color: Colors.text.primary,
        marginRight: 8,
    },
    input: {
        fontSize: 48,
        fontWeight: '700',
        color: Colors.text.primary,
        minWidth: 100,
        textAlign: 'center',
        backgroundColor: 'transparent',
    },
    person: {
        alignItems: 'center',
        gap: 8,
        flex: 1,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Colors.neutral[100],
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.text.secondary,
    },
    name: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.text.primary,
    },
    arrowContainer: {
        alignItems: 'center',
        gap: 4,
    },
    amount: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.text.primary,
    },
    payBtn: {
        backgroundColor: Colors.primary.solid,
        paddingVertical: 12,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 8,
    },
    paidBtn: {
        backgroundColor: Colors.success.main,
    },
    payBtnText: {
        color: '#FFF',
        fontWeight: '700',
        fontSize: 16,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 20,
        fontWeight: '700',
        color: Colors.text.primary,
        marginTop: 16,
    },
    emptySub: {
        fontSize: 16,
        color: Colors.text.secondary,
        marginTop: 8,
    },
});

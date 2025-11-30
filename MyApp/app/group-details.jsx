import React, { useMemo, useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useExpenses } from '@/context/ExpensesContext';
import { Colors } from '@/constants/colors';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function GroupDetailsScreen() {
    const { id } = useLocalSearchParams();
    const { groups, expenses, computeBalances } = useExpenses();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('All');

    const group = useMemo(() => groups.find((g) => g.id === id), [groups, id]);
    const groupExpenses = useMemo(() => expenses.filter((e) => e.groupId === id), [expenses, id]);
    const balances = useMemo(() => computeBalances(id), [expenses, id, computeBalances]);

    const myBalance = balances['You'] || 0;
    const totalGroupSpend = groupExpenses.reduce((sum, e) => sum + e.amount, 0);

    if (!group) return null;

    const filteredExpenses = useMemo(() => {
        if (activeTab === 'All') return groupExpenses;

        return groupExpenses;
    }, [groupExpenses, activeTab]);

    return (
        <View style={styles.container}>

            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
                    <IconSymbol name="arrow.left" size={24} color={Colors.text.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{group.name}</Text>
                <TouchableOpacity style={styles.iconBtn} onPress={() => router.push({ pathname: '/group-settings', params: { groupId: id } })}>
                    <IconSymbol name="ellipsis" size={24} color={Colors.text.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                <View style={styles.summaryCard}>
                    <View style={styles.summaryLeft}>
                        <Text style={[styles.summaryStatus, { color: myBalance >= 0 ? Colors.success.main : Colors.warning.main }]}>
                            {myBalance === 0 ? "You are settled up" : myBalance > 0 ? `You are owed ₹${myBalance}` : `You owe ₹${Math.abs(myBalance)}`}
                        </Text>
                        <Text style={styles.summaryTotal}>Total group spend: ₹{totalGroupSpend}</Text>
                    </View>
                    <View style={styles.avatars}>
                        {group.members.slice(0, 3).map((member, i) => (
                            <View key={i} style={[styles.avatarCircle, { marginLeft: i > 0 ? -12 : 0 }]}>
                                <View style={styles.avatarInner}>
                                    <Text style={styles.avatarText}>{member[0]}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>

                <View style={styles.balancesContainer}>
                    <Text style={styles.sectionTitle}>Balances</Text>
                    {Object.entries(balances).map(([member, amount]) => (
                        <View key={member} style={styles.balanceRow}>
                            <Text style={styles.balanceMember}>{member}</Text>
                            <Text style={[styles.balanceAmount, { color: amount >= 0 ? Colors.success.main : Colors.warning.main }]}>
                                {amount === 0 ? "Settled" : amount > 0 ? `gets ₹${amount}` : `owes ₹${Math.abs(amount)}`}
                            </Text>
                        </View>
                    ))}
                </View>

                <Text style={styles.dateHeader}>EXPENSES</Text>

                <View style={styles.list}>
                    {filteredExpenses.length > 0 ? (
                        filteredExpenses.map((expense) => (
                            <TouchableOpacity key={expense.id} onPress={() => router.push({ pathname: '/(tabs)/add-expense', params: { groupId: id, expenseId: expense.id } })}>
                                <ExpenseItem expense={expense} />
                            </TouchableOpacity>
                        ))
                    ) : (
                        <View style={{ alignItems: 'center', padding: 20 }}>
                            <Text style={{ color: Colors.text.secondary }}>No expenses yet</Text>
                        </View>
                    )}
                </View>
            </ScrollView>

            <View style={styles.bottomActions}>
                <TouchableOpacity style={styles.actionBtn} onPress={() => router.push({ pathname: '/(tabs)/add-expense', params: { groupId: id } })}>
                    <IconSymbol name="plus" size={20} color={Colors.text.primary} />
                    <Text style={styles.actionBtnText}>Add Expense</Text>
                </TouchableOpacity>
                <View style={styles.verticalDivider} />
                <TouchableOpacity style={styles.actionBtn} onPress={() => router.push({ pathname: '/settle-up', params: { groupId: id } })}>
                    <IconSymbol name="banknote" size={20} color={Colors.text.primary} />
                    <Text style={styles.actionBtnText}>Settle Up</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

function ExpenseItem({ expense }) {
    return (
        <View style={styles.expenseItem}>
            <View style={styles.expenseIconBox}>
                <IconSymbol name="doc.text" size={20} color={Colors.text.primary} />
            </View>
            <View style={styles.expenseContent}>
                <Text style={styles.expenseTitle}>{expense.description}</Text>
                <Text style={styles.expensePaid}>
                    <Text style={{ fontWeight: '700', color: Colors.text.primary }}>{expense.payer}</Text> paid ₹{expense.amount}
                </Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.expenseAmount}>₹{expense.amount}</Text>
                <Text style={styles.expenseDate}>{new Date(expense.date).toLocaleDateString()}</Text>
            </View>
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
        paddingBottom: 100,
    },
    summaryCard: {
        backgroundColor: Colors.card,
        padding: 20,
        borderRadius: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    summaryStatus: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 4,
    },
    summaryTotal: {
        fontSize: 14,
        color: Colors.text.secondary,
    },
    avatars: {
        flexDirection: 'row',
    },
    avatarCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.background,
        padding: 2,
    },
    avatarInner: {
        flex: 1,
        borderRadius: 18,
        backgroundColor: Colors.neutral[700],
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        color: '#FFF',
        fontWeight: '700',
    },
    balancesContainer: {
        marginBottom: 24,
        backgroundColor: 'rgba(255,255,255,0.03)',
        padding: 16,
        borderRadius: 12,
    },
    sectionTitle: {
        color: Colors.text.secondary,
        fontSize: 12,
        fontWeight: '700',
        marginBottom: 12,
        textTransform: 'uppercase',
    },
    balanceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    balanceMember: {
        color: Colors.text.primary,
        fontSize: 14,
    },
    balanceAmount: {
        fontSize: 14,
        fontWeight: '600',
    },
    dateHeader: {
        fontSize: 12,
        fontWeight: '700',
        color: Colors.text.secondary,
        marginBottom: 16,
        letterSpacing: 1,
    },
    list: {
        gap: 12,
    },
    expenseItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.card,
        padding: 16,
        borderRadius: 16,
        gap: 16,
    },
    expenseIconBox: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    expenseContent: {
        flex: 1,
    },
    expenseTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text.primary,
        marginBottom: 4,
    },
    expensePaid: {
        fontSize: 14,
        color: Colors.text.secondary,
    },
    expenseAmount: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.text.primary,
    },
    expenseDate: {
        fontSize: 12,
        color: Colors.text.muted,
    },
    bottomActions: {
        position: 'absolute',
        bottom: 40,
        left: 20,
        right: 20,
        height: 60,
        backgroundColor: Colors.card,
        borderRadius: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    actionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    actionBtnText: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.text.primary,
    },
    verticalDivider: {
        width: 1,
        height: 24,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
});

import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { useExpenses } from '@/context/ExpensesContext';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Colors } from '@/constants/colors';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { getCategoryById } from '@/constants/categories';

export default function HistoryScreen() {
    const { expenses } = useExpenses();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>History</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                {expenses.length === 0 ? (
                    <View style={styles.emptyState}>
                        <IconSymbol name="clock" size={64} color={Colors.neutral[300]} />
                        <Text style={styles.emptyText}>No history yet</Text>
                    </View>
                ) : (
                    <View style={styles.list}>
                        {expenses.map((item, index) => {
                            const cat = getCategoryById(item.category || 'other');
                            return (
                                <AnimatedCard key={item.id} style={styles.card} delay={index * 50}>
                                    <View style={styles.row}>
                                        <View style={[styles.iconBox, { backgroundColor: cat.color + '20' }]}>
                                            <Text style={{ fontSize: 20 }}>{cat.icon}</Text>
                                        </View>
                                        <View style={styles.info}>
                                            <Text style={styles.desc}>{item.description}</Text>
                                            <Text style={styles.meta}>
                                                {new Date(item.createdAt).toLocaleDateString()} • {item.payer}
                                            </Text>
                                        </View>
                                        <Text style={styles.amount}>₹{item.amount}</Text>
                                    </View>
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
        paddingTop: 60,
        paddingHorizontal: 24,
        paddingBottom: 24,
    },
    title: {
        fontSize: 34,
        fontWeight: '800',
        color: Colors.text.primary,
    },
    content: {
        padding: 24,
        paddingBottom: 100,
    },
    list: {
        gap: 12,
    },
    card: {
        backgroundColor: Colors.card,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    info: {
        flex: 1,
    },
    desc: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.text.primary,
        marginBottom: 4,
    },
    meta: {
        fontSize: 12,
        color: Colors.text.secondary,
    },
    amount: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.text.primary,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 100,
    },
    emptyText: {
        marginTop: 16,
        fontSize: 18,
        color: Colors.text.muted,
        fontWeight: '600',
    },
});

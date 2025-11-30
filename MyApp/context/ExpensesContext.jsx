import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, View, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

const ExpensesContext = createContext(undefined);

const GROUPS_KEY = 'smart-splitter.groups.v2';
const EXPENSES_KEY = 'smart-splitter.expenses.v2';

export const ExpensesProvider = ({ children }) => {
  const [groups, setGroups] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [groupsData, expensesData] = await Promise.all([
          AsyncStorage.getItem(GROUPS_KEY),
          AsyncStorage.getItem(EXPENSES_KEY)
        ]);
        if (groupsData) setGroups(JSON.parse(groupsData));
        if (expensesData) setExpenses(JSON.parse(expensesData));
      } catch (e) {
        console.error("Failed to load data", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      AsyncStorage.setItem(GROUPS_KEY, JSON.stringify(groups));
      AsyncStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
    }
  }, [groups, expenses, isLoading]);

  const addGroup = useCallback((name, members, type = 'other', image = null) => {
    const trimmedMembers = members.map(m => m.trim()).filter(Boolean);
    const uniqueMembers = Array.from(new Set(trimmedMembers));
    const newGroup = {
      id: uuidv4(),
      name: name.trim() || 'Group',
      members: uniqueMembers,
      type,
      image,
      createdAt: Date.now()
    };
    setGroups(prev => [newGroup, ...prev]);
  }, []);

  const updateGroup = useCallback((groupId, updates) => {
    setGroups(prev => prev.map(g => g.id === groupId ? { ...g, ...updates } : g));
  }, []);

  const removeGroup = useCallback((groupId) => {
    setGroups(prev => prev.filter(g => g.id !== groupId));
    setExpenses(prev => prev.filter(e => e.groupId !== groupId));
  }, []);

  const addMemberToGroup = useCallback((groupId, memberName) => {
    setGroups(prev => prev.map(g => {
      if (g.id === groupId) {
        if (g.members.includes(memberName)) return g;
        return { ...g, members: [...g.members, memberName] };
      }
      return g;
    }));
  }, []);

  const removeMemberFromGroup = useCallback((groupId, memberName) => {

    setGroups(prev => prev.map(g => {
      if (g.id === groupId) {
        return { ...g, members: g.members.filter(m => m !== memberName) };
      }
      return g;
    }));
  }, []);

  const addExpense = useCallback((groupId, description, amount, payer, category = 'other', splitBy = [], date = new Date(), receiptImage = null) => {
    if (!groupId || !amount || !payer) return;

    let involvedMembers = splitBy;
    if (!involvedMembers || involvedMembers.length === 0) {
      const group = groups.find(g => g.id === groupId);
      involvedMembers = group ? group.members : [];
    }

    const newExpense = {
      id: uuidv4(),
      groupId,
      description: description.trim() || 'Expense',
      amount: Math.max(0, Number(amount) || 0),
      payer,
      category,
      splitBy: involvedMembers,
      date: date.toISOString(),
      receiptImage,
      createdAt: Date.now(),
    };
    setExpenses(prev => [newExpense, ...prev]);
  }, [groups]);

  const updateExpense = useCallback((expenseId, updates) => {
    setExpenses(prev => prev.map(e => e.id === expenseId ? { ...e, ...updates } : e));
  }, []);

  const deleteExpense = useCallback((expenseId) => {
    setExpenses(prev => prev.filter(e => e.id !== expenseId));
  }, []);

  const resetAllData = useCallback(async () => {
    setGroups([]);
    setExpenses([]);
    await AsyncStorage.removeItem(GROUPS_KEY);
    await AsyncStorage.removeItem(EXPENSES_KEY);
  }, []);

  const getGroupById = useCallback((groupId) => groups.find(g => g.id === groupId), [groups]);
  const getExpensesByGroup = useCallback((groupId) => expenses.filter(e => e.groupId === groupId).sort((a, b) => new Date(b.date) - new Date(a.date)), [expenses]);

  const computeBalances = useCallback((groupId) => {
    const group = groups.find(g => g.id === groupId);
    if (!group) return {};

    const groupExpenses = expenses.filter(e => e.groupId === groupId);

    const balances = {};
    group.members.forEach(m => balances[m] = 0);

    for (const exp of groupExpenses) {
      const amount = Number(exp.amount);
      const payer = exp.payer;
      const involved = exp.splitBy || group.members;

      if (involved.length === 0) continue;

      const splitAmount = amount / involved.length;

      if (balances[payer] === undefined) balances[payer] = 0;
      balances[payer] += amount;

      for (const person of involved) {
        if (balances[person] === undefined) balances[person] = 0;
        balances[person] -= splitAmount;
      }
    }

    Object.keys(balances).forEach((key) => {
      balances[key] = Math.round(balances[key] * 100) / 100;
    });

    return balances;
  }, [groups, expenses]);

  const computeSettlements = useCallback((groupId) => {
    const balances = computeBalances(groupId);
    const creditors = [];
    const debtors = [];

    Object.entries(balances).forEach(([name, amt]) => {
      if (amt > 0.01) creditors.push({ name, amt });
      else if (amt < -0.01) debtors.push({ name, amt: -amt });
    });

    creditors.sort((a, b) => b.amt - a.amt);
    debtors.sort((a, b) => b.amt - a.amt);

    const settlements = [];
    let i = 0, j = 0;

    while (i < debtors.length && j < creditors.length) {
      const debtor = debtors[i];
      const creditor = creditors[j];

      const amount = Math.min(debtor.amt, creditor.amt);

      if (amount > 0) {
        settlements.push({
          from: debtor.name,
          to: creditor.name,
          amount: Math.round(amount * 100) / 100
        });
      }

      debtor.amt -= amount;
      creditor.amt -= amount;

      if (debtor.amt < 0.01) i++;
      if (creditor.amt < 0.01) j++;
    }

    return settlements;
  }, [computeBalances]);

  const value = useMemo(() => ({
    groups,
    expenses,
    isLoading,
    addGroup,
    updateGroup,
    removeGroup,
    addMemberToGroup,
    removeMemberFromGroup,
    addExpense,
    updateExpense,
    deleteExpense,
    getGroupById,
    getExpensesByGroup,
    computeBalances,
    computeSettlements,
    resetAllData,
  }), [groups, expenses, isLoading, addGroup, updateGroup, removeGroup, addMemberToGroup, removeMemberFromGroup, addExpense, updateExpense, deleteExpense, getGroupById, getExpensesByGroup, computeBalances, computeSettlements, resetAllData]);

  return <ExpensesContext.Provider value={value}>{children}</ExpensesContext.Provider>;
};

export function useExpenses() {
  const ctx = useContext(ExpensesContext);
  if (!ctx) throw new Error('useExpenses must be used within ExpensesProvider');
  return ctx;
};


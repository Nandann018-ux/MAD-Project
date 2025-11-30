import React, { useMemo, useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput, Modal, FlatList, Alert, Platform } from 'react-native';
import { useExpenses } from '@/context/ExpensesContext';
import { Colors } from '@/constants/colors';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { router, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function AddExpenseScreen() {
  const { groups, addExpense, updateExpense, deleteExpense, expenses } = useExpenses();
  const { groupId, expenseId } = useLocalSearchParams();

  const existingExpense = useMemo(() =>
    expenseId ? expenses.find(e => e.id === expenseId) : null
    , [expenseId, expenses]);

  const [selectedGroupId, setSelectedGroupId] = useState(groupId || groups[0]?.id || '');
  const [description, setDescription] = useState('');
  const [amountText, setAmountText] = useState('');
  const [payer, setPayer] = useState('');
  const [date, setDate] = useState(new Date());
  const [receiptImage, setReceiptImage] = useState(null);
  const [splitBy, setSplitBy] = useState([]);

  const [showPayerModal, setShowPayerModal] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showSplitModal, setShowSplitModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const selectedGroup = useMemo(() => groups.find(g => g.id === selectedGroupId), [groups, selectedGroupId]);
  const members = useMemo(() => selectedGroup?.members || [], [selectedGroup]);

  useEffect(() => {
    if (existingExpense) {
      setSelectedGroupId(existingExpense.groupId);
      setDescription(existingExpense.description);
      setAmountText(existingExpense.amount.toString());
      setPayer(existingExpense.payer);
      setDate(new Date(existingExpense.date));
      setReceiptImage(existingExpense.receiptImage);
      setSplitBy(existingExpense.splitBy || []);
    } else if (selectedGroup) {

      if (!payer) setPayer(selectedGroup.members[0] || 'You');
      if (splitBy.length === 0) setSplitBy(selectedGroup.members);
    }
  }, [existingExpense, selectedGroup]);

  useEffect(() => {
    if (selectedGroup && !existingExpense) {
      setSplitBy(selectedGroup.members);
      if (!selectedGroup.members.includes(payer)) {
        setPayer(selectedGroup.members[0] || 'You');
      }
    }
  }, [selectedGroupId]);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.5,
      });
      if (!result.canceled) {
        setReceiptImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const toggleSplitMember = (member) => {
    setSplitBy(prev => {
      if (prev.includes(member)) {

        if (prev.length === 1) {
          Alert.alert("Error", "At least one person must split the expense.");
          return prev;
        }
        return prev.filter(m => m !== member);
      } else {
        return [...prev, member];
      }
    });
  };

  const submit = () => {
    const amount = Number(amountText);
    if (!selectedGroupId) {
      Alert.alert("Error", "Please select a group");
      return;
    }
    if (!description.trim()) {
      Alert.alert("Error", "Please enter a description");
      return;
    }
    if (!amount || amount <= 0) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }
    if (splitBy.length === 0) {
      Alert.alert("Error", "Please select who splits this expense");
      return;
    }

    if (existingExpense) {
      updateExpense(existingExpense.id, {
        groupId: selectedGroupId,
        description,
        amount,
        payer,
        splitBy,
        date: date.toISOString(),
        receiptImage
      });
    } else {
      addExpense(selectedGroupId, description, amount, payer, 'food', splitBy, date, receiptImage);
    }

    router.back();
  };

  const handleDelete = () => {
    Alert.alert("Delete Expense", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete", style: "destructive", onPress: () => {
          deleteExpense(existingExpense.id);
          router.back();
        }
      }
    ]);
  };

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <IconSymbol name="xmark" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{existingExpense ? 'Edit Expense' : 'New Expense'}</Text>
        <TouchableOpacity onPress={submit}>
          <Text style={styles.saveBtnText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

        <TouchableOpacity style={styles.groupSelector} onPress={() => setShowGroupModal(true)} disabled={!!existingExpense}>
          <Text style={styles.groupSelectorLabel}>Group:</Text>
          <View style={styles.groupSelectorValueContainer}>
            <Text style={styles.groupSelectorValue}>{selectedGroup?.name || 'Select Group'}</Text>
            {!existingExpense && <IconSymbol name="chevron.down" size={14} color={Colors.text.secondary} />}
          </View>
        </TouchableOpacity>

        <View style={styles.amountContainer}>
          <Text style={styles.currencySymbol}>₹</Text>
          <TextInput
            style={styles.amountInput}
            value={amountText}
            onChangeText={setAmountText}
            placeholder="0.00"
            placeholderTextColor={Colors.neutral[600]}
            keyboardType="numeric"
            autoFocus={!existingExpense}
          />
        </View>

        <View style={styles.formCard}>

          <View style={styles.inputRow}>
            <IconSymbol name="doc.text" size={20} color={Colors.text.secondary} />
            <TextInput
              style={styles.input}
              placeholder="What was this for?"
              placeholderTextColor={Colors.text.muted}
              value={description}
              onChangeText={setDescription}
            />
          </View>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.row} onPress={() => setShowPayerModal(true)}>
            <View style={styles.rowLeft}>
              <IconSymbol name="creditcard" size={20} color={Colors.text.secondary} />
              <Text style={styles.rowLabel}>Paid by</Text>
            </View>
            <View style={styles.rowRight}>
              <Text style={styles.rowValueHighlight}>{payer}</Text>
              <IconSymbol name="chevron.right" size={16} color={Colors.text.muted} />
            </View>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.row} onPress={() => setShowSplitModal(true)}>
            <View style={styles.rowLeft}>
              <IconSymbol name="arrow.triangle.branch" size={20} color={Colors.text.secondary} />
              <Text style={styles.rowLabel}>Split between</Text>
            </View>
            <View style={styles.rowRight}>
              <Text style={styles.rowValueHighlight}>
                {splitBy.length === members.length ? 'Everyone' : `${splitBy.length} people`}
              </Text>
              <IconSymbol name="chevron.right" size={16} color={Colors.text.muted} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.formCard}>

          <TouchableOpacity style={styles.row} onPress={() => setShowDatePicker(true)}>
            <View style={styles.rowLeft}>
              <IconSymbol name="calendar" size={20} color={Colors.text.secondary} />
              <Text style={styles.rowLabel}>Date</Text>
            </View>
            <View style={styles.rowRight}>
              <Text style={styles.rowValue}>{date.toLocaleDateString()}</Text>
              <IconSymbol name="chevron.right" size={16} color={Colors.text.muted} />
            </View>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.row} onPress={pickImage}>
            <View style={styles.rowLeft}>
              <IconSymbol name="doc" size={20} color={Colors.text.secondary} />
              <Text style={styles.rowLabel}>{receiptImage ? 'Receipt Added' : 'Add receipt/photo'}</Text>
            </View>
            <View style={styles.rowRight}>
              {receiptImage ? (
                <IconSymbol name="checkmark.circle.fill" size={20} color={Colors.success.main} />
              ) : (
                <IconSymbol name="camera" size={20} color={Colors.text.secondary} />
              )}
            </View>
          </TouchableOpacity>
        </View>

        {existingExpense && (
          <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
            <Text style={styles.deleteBtnText}>Delete Expense</Text>
          </TouchableOpacity>
        )}

      </ScrollView>

      <Modal visible={showPayerModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Who paid?</Text>
            <FlatList
              data={members}
              keyExtractor={item => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.modalItem, payer === item && styles.modalItemActive]}
                  onPress={() => {
                    setPayer(item);
                    setShowPayerModal(false);
                  }}
                >
                  <Text style={[styles.modalItemText, payer === item && styles.modalItemTextActive]}>{item}</Text>
                  {payer === item && <IconSymbol name="checkmark" size={20} color={Colors.primary.solid} />}
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setShowPayerModal(false)}>
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={showSplitModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Split between</Text>
            <FlatList
              data={members}
              keyExtractor={item => item}
              renderItem={({ item }) => {
                const isSelected = splitBy.includes(item);
                return (
                  <TouchableOpacity
                    style={[styles.modalItem, isSelected && styles.modalItemActive]}
                    onPress={() => toggleSplitMember(item)}
                  >
                    <Text style={[styles.modalItemText, isSelected && styles.modalItemTextActive]}>{item}</Text>
                    {isSelected && <IconSymbol name="checkmark" size={20} color={Colors.primary.solid} />}
                  </TouchableOpacity>
                );
              }}
            />
            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setShowSplitModal(false)}>
              <Text style={styles.modalCloseText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={showGroupModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Group</Text>
            <FlatList
              data={groups}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.modalItem, selectedGroupId === item.id && styles.modalItemActive]}
                  onPress={() => {
                    setSelectedGroupId(item.id);
                    setShowGroupModal(false);
                  }}
                >
                  <Text style={[styles.modalItemText, selectedGroupId === item.id && styles.modalItemTextActive]}>{item.name}</Text>
                  {selectedGroupId === item.id && <IconSymbol name="checkmark" size={20} color={Colors.primary.solid} />}
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setShowGroupModal(false)}>
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}

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
  closeBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
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
  groupSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    gap: 8,
    padding: 8,
    backgroundColor: Colors.card,
    borderRadius: 20,
    alignSelf: 'center',
    paddingHorizontal: 16,
  },
  groupSelectorLabel: {
    color: Colors.text.secondary,
    fontSize: 14,
  },
  groupSelectorValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  groupSelectorValue: {
    color: Colors.text.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  amountContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  currencySymbol: {
    fontSize: 40,
    fontWeight: '700',
    color: Colors.success.main,
    marginRight: 4,
  },
  amountInput: {
    fontSize: 48,
    fontWeight: '700',
    color: Colors.success.main,
    minWidth: 100,
    textAlign: 'center',
  },
  formCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    marginBottom: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.text.primary,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rowLabel: {
    fontSize: 16,
    color: Colors.text.secondary,
  },
  rowValue: {
    fontSize: 16,
    color: Colors.text.secondary,
  },
  rowValueHighlight: {
    fontSize: 16,
    color: Colors.accent.main,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: Colors.neutral[800],
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.neutral[800],
  },
  modalItemActive: {
    backgroundColor: Colors.neutral[800],
    marginHorizontal: -24,
    paddingHorizontal: 24,
  },
  modalItemText: {
    fontSize: 16,
    color: Colors.text.secondary,
  },
  modalItemTextActive: {
    color: Colors.primary.solid,
    fontWeight: '600',
  },
  modalCloseBtn: {
    marginTop: 20,
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: Colors.neutral[800],
    borderRadius: 12,
  },
  modalCloseText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  deleteBtn: {
    backgroundColor: Colors.card,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
    borderWidth: 1,
    borderColor: Colors.danger.main,
  },
  deleteBtnText: {
    color: Colors.danger.main,
    fontWeight: '700',
    fontSize: 16,
  }
});

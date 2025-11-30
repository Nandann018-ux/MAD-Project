
export const EXPENSE_CATEGORIES = [
    { id: 'food', label: 'Food', icon: '🍽️', color: '#FF6B6B' },
    { id: 'travel', label: 'Travel', icon: '✈️', color: '#4ECDC4' },
    { id: 'shopping', label: 'Shopping', icon: '🛍️', color: '#FFE66D' },
    { id: 'entertainment', label: 'Entertainment', icon: '🎬', color: '#A8E6CF' },
    { id: 'bills', label: 'Bills', icon: '💡', color: '#95E1D3' },
    { id: 'other', label: 'Other', icon: '📝', color: '#C7CEEA' },
];

export function getCategoryById(id) {
    return EXPENSE_CATEGORIES.find(cat => cat.id === id) || EXPENSE_CATEGORIES[5];
}

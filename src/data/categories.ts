import { Category } from '../types/budget';

export const defaultCategories: Category[] = [
  // Income categories
  { id: '1', name: 'Salary', type: 'income', color: '#059669', icon: '💰' },
  { id: '2', name: 'Freelancing', type: 'income', color: '#0891b2', icon: '💼' },
  { id: '3', name: 'Investment', type: 'income', color: '#7c3aed', icon: '📈' },
  { id: '4', name: 'Business', type: 'income', color: '#dc2626', icon: '🏢' },
  { id: '5', name: 'Other Income', type: 'income', color: '#059669', icon: '💵' },

  // Expense categories
  { id: '6', name: 'Food & Dining', type: 'expense', color: '#ea580c', icon: '🍽️' },
  { id: '7', name: 'Transportation', type: 'expense', color: '#7c2d12', icon: '🚗' },
  { id: '8', name: 'Shopping', type: 'expense', color: '#be185d', icon: '🛍️' },
  { id: '9', name: 'Entertainment', type: 'expense', color: '#7c3aed', icon: '🎬' },
  { id: '10', name: 'Bills & Utilities', type: 'expense', color: '#dc2626', icon: '⚡' },
  { id: '11', name: 'Healthcare', type: 'expense', color: '#16a34a', icon: '🏥' },
  { id: '12', name: 'Education', type: 'expense', color: '#2563eb', icon: '📚' },
  { id: '13', name: 'Travel', type: 'expense', color: '#0891b2', icon: '✈️' },
  { id: '14', name: 'Other Expenses', type: 'expense', color: '#6b7280', icon: '📝' },
];
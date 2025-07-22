import { useState, useEffect } from 'react';
import { Transaction, Budget } from '../types/budget';
import { defaultCategories } from '../data/categories';

// Storage keys for consistent data management
const STORAGE_KEYS = {
  TRANSACTIONS: 'budgetmaster-transactions',
  BUDGETS: 'budgetmaster-budgets',
  SETTINGS: 'budgetmaster-settings',
} as const;

// Helper functions for safe localStorage operations
const saveToStorage = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultValue;
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return defaultValue;
  }
};

export const useBudget = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from localStorage on mount
  useEffect(() => {
    const loadData = () => {
      const savedTransactions = loadFromStorage(STORAGE_KEYS.TRANSACTIONS, []);
      const savedBudgets = loadFromStorage(STORAGE_KEYS.BUDGETS, []);
      
      setTransactions(savedTransactions);
      setBudgets(savedBudgets);
      setIsLoading(false);
    };

    loadData();

    // Listen for storage changes from other tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.TRANSACTIONS && e.newValue) {
        setTransactions(JSON.parse(e.newValue));
      } else if (e.key === STORAGE_KEYS.BUDGETS && e.newValue) {
        setBudgets(JSON.parse(e.newValue));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (!isLoading) {
      saveToStorage(STORAGE_KEYS.TRANSACTIONS, transactions);
    }
  }, [transactions]);

  useEffect(() => {
    if (!isLoading) {
      saveToStorage(STORAGE_KEYS.BUDGETS, budgets);
    }
  }, [budgets]);

  const addTransaction = (transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const clearAllData = () => {
    setTransactions([]);
    setBudgets([]);
    localStorage.removeItem(STORAGE_KEYS.TRANSACTIONS);
    localStorage.removeItem(STORAGE_KEYS.BUDGETS);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
  };

  const updateBudget = (budget: Omit<Budget, 'id' | 'spent'>) => {
    const spent = getSpentByCategory(budget.category, budget.period);
    const newBudget: Budget = {
      ...budget,
      id: budget.category,
      spent,
    };
    
    setBudgets(prev => {
      const existing = prev.find(b => b.category === budget.category);
      if (existing) {
        return prev.map(b => b.category === budget.category ? newBudget : b);
      }
      return [...prev, newBudget];
    });
  };

  const getSpentByCategory = (category: string, period: 'monthly' | 'weekly') => {
    const now = new Date();
    const startDate = new Date(now);
    
    if (period === 'monthly') {
      startDate.setMonth(now.getMonth(), 1);
    } else {
      startDate.setDate(now.getDate() - 7);
    }

    return transactions
      .filter(t => 
        t.type === 'expense' && 
        t.category === category && 
        new Date(t.date) >= startDate
      )
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getTotalIncome = () => {
    return transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getTotalExpenses = () => {
    return transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getRecentTransactions = (limit = 5) => {
    return transactions
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  };

  return {
    transactions,
    budgets,
    categories: defaultCategories,
    isLoading,
    addTransaction,
    deleteTransaction,
    clearAllData,
    updateBudget,
    getSpentByCategory,
    getTotalIncome,
    getTotalExpenses,
    getRecentTransactions,
  };
};
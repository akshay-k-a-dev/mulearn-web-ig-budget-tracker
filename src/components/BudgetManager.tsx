import React, { useState } from 'react';
import { Target, Plus, Edit3, Trash2 } from 'lucide-react';
import { useBudget } from '../hooks/useBudget';

export const BudgetManager: React.FC = () => {
  const { budgets, categories, updateBudget, getSpentByCategory } = useBudget();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    period: 'monthly' as 'monthly' | 'weekly',
  });

  const expenseCategories = categories.filter(cat => cat.type === 'expense');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.category || !formData.amount) {
      return;
    }

    updateBudget({
      category: formData.category,
      amount: parseFloat(formData.amount),
      period: formData.period,
    });

    setFormData({ category: '', amount: '', period: 'monthly' });
    setIsFormOpen(false);
    setEditingBudget(null);
  };

  const handleEdit = (budget: any) => {
    setFormData({
      category: budget.category,
      amount: budget.amount.toString(),
      period: budget.period,
    });
    setEditingBudget(budget.id);
    setIsFormOpen(true);
  };

  const handleCancel = () => {
    setFormData({ category: '', amount: '', period: 'monthly' });
    setIsFormOpen(false);
    setEditingBudget(null);
  };

  const getCategoryIcon = (categoryName: string) => {
    const category = categories.find(cat => cat.name === categoryName);
    return category?.icon || '📝';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Budget Management</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Set Budget</span>
        </button>
      </div>

      {/* Budget Form */}
      {isFormOpen && (
        <div className="bg-white rounded-lg shadow-sm p-6 border border-blue-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {editingBudget ? 'Edit Budget' : 'Set New Budget'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select Category</option>
              {expenseCategories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.icon} {category.name}
                </option>
              ))}
            </select>

            <input
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="Budget Amount"
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />

            <select
              value={formData.period}
              onChange={(e) => setFormData({ ...formData, period: e.target.value as 'monthly' | 'weekly' })}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="monthly">Monthly</option>
              <option value="weekly">Weekly</option>
            </select>

            <div className="flex space-x-2">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                {editingBudget ? 'Update' : 'Set Budget'}
              </button>
              {isFormOpen && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Budget List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {budgets.map((budget) => {
          const percentage = (budget.spent / budget.amount) * 100;
          const isOverBudget = percentage > 100;
          const remaining = budget.amount - budget.spent;
          
          return (
            <div key={budget.id} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getCategoryIcon(budget.category)}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{budget.category}</h3>
                    <p className="text-sm text-gray-500 capitalize">{budget.period}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleEdit(budget)}
                  className="text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <Edit3 className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Spent</span>
                  <span className={`font-medium ${isOverBudget ? 'text-red-600' : 'text-gray-900'}`}>
                    ${budget.spent.toFixed(2)}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Budget</span>
                  <span className="font-medium text-gray-900">${budget.amount.toFixed(2)}</span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      isOverBudget ? 'bg-red-500' : percentage > 75 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  ></div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    {isOverBudget ? 'Over budget' : 'Remaining'}
                  </span>
                  <span className={`text-sm font-medium ${
                    isOverBudget ? 'text-red-600' : remaining < budget.amount * 0.2 ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    ${Math.abs(remaining).toFixed(2)}
                  </span>
                </div>

                {isOverBudget && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-2">
                    <p className="text-xs text-red-600 text-center">
                      ⚠️ You've exceeded this budget by ${(budget.spent - budget.amount).toFixed(2)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {budgets.length === 0 && (
          <div className="col-span-full bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No budgets set</h3>
            <p className="text-gray-500 mb-4">Start managing your expenses by setting budgets for different categories</p>
            <button
              onClick={() => setIsFormOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Set Your First Budget</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
import React from 'react';
import { Download, Upload, Trash2, Info } from 'lucide-react';
import { useBudget } from '../hooks/useBudget';

export const Settings: React.FC = () => {
  const { transactions, budgets, clearAllData } = useBudget();

  const handleExportData = () => {
    const data = {
      transactions,
      budgets,
      exportDate: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `budget-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        // Validate data structure before importing
        if (!data.transactions || !Array.isArray(data.transactions)) {
          throw new Error('Invalid transactions data');
        }
        
        if (!data.budgets || !Array.isArray(data.budgets)) {
          throw new Error('Invalid budgets data');
        }
        
        if (data.transactions && Array.isArray(data.transactions)) {
          localStorage.setItem('budgetmaster-transactions', JSON.stringify(data.transactions));
        }
        
        if (data.budgets && Array.isArray(data.budgets)) {
          localStorage.setItem('budgetmaster-budgets', JSON.stringify(data.budgets));
        }
        
        alert('Data imported successfully! The page will reload to apply changes.');
        window.location.reload();
      } catch (error) {
        alert('Error importing data. Please check the file format and try again.');
        console.error('Import error:', error);
      }
    };
    reader.readAsText(file);
  };

  const handleClearData = () => {
    const confirmMessage = `Are you sure you want to clear all data? This will permanently delete:
    
• ${transactions.length} transactions
• ${budgets.length} budgets
• All settings and preferences

This action cannot be undone.`;
    
    if (confirm(confirmMessage)) {
      clearAllData();
      alert('All data has been cleared successfully.');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>

      {/* Data Management */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Data Management</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Export Data */}
          <div className="text-center p-6 border border-gray-200 rounded-lg">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Download className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Export Data</h3>
            <p className="text-sm text-gray-500 mb-4">Download your data as a JSON file</p>
            <button
              onClick={handleExportData}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
            >
              Export
            </button>
          </div>

          {/* Import Data */}
          <div className="text-center p-6 border border-gray-200 rounded-lg">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Upload className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Import Data</h3>
            <p className="text-sm text-gray-500 mb-4">Upload a previously exported JSON file</p>
            <label className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-sm cursor-pointer">
              Import
              <input
                type="file"
                accept=".json"
                onChange={handleImportData}
                className="hidden"
              />
            </label>
          </div>

          {/* Clear Data */}
          <div className="text-center p-6 border border-red-200 rounded-lg">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Trash2 className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Clear Data</h3>
            <p className="text-sm text-gray-500 mb-4">Remove all transactions and budgets</p>
            <button
              onClick={handleClearData}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors text-sm"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>

      {/* App Info */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Application Info</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900">Data Storage</h3>
              <p className="text-sm text-gray-500">Your data is stored locally in your browser</p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900">Statistics</h3>
              <div className="text-sm text-gray-500 space-y-1">
                <p>Total Transactions: {transactions.length}</p>
                <p>Active Budgets: {budgets.length}</p>
                <p>Data since: {transactions.length > 0 ? new Date(Math.min(...transactions.map(t => new Date(t.createdAt).getTime()))).toLocaleDateString() : 'No data'}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900">Features</h3>
              <ul className="text-sm text-gray-500 space-y-1">
                <li>• Track income and expenses</li>
                <li>• Set and monitor budgets</li>
                <li>• Categorize transactions</li>
                <li>• Export/import data</li>
                <li>• Real-time budget tracking</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start space-x-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900">Privacy Notice</h4>
              <p className="text-sm text-blue-700">
                All your financial data is stored locally in your browser. No data is sent to external servers. 
                Make sure to export your data regularly as a backup.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
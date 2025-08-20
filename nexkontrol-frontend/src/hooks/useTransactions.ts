import { useState, useEffect, useCallback, useMemo } from 'react';
import { apiService } from '../services/api';
import { type Transaction, type TransactionFormData, TransactionType } from '../types/Transaction';
import { useToast } from '../Context/ToastContext';

interface TransactionTotals {
  income: number;
  expense: number;
  balance: number;
}

interface UseTransactionsReturn {
  transactions: Transaction[];
  totals: TransactionTotals;
  isLoading: boolean;
  error: string | null;
  fetchTransactions: () => Promise<void>;
  createTransaction: (data: TransactionFormData) => Promise<void>;
  updateTransaction: (id: string, data: TransactionFormData) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  filteredTransactions: Transaction[];
  setDateRange: (startDate: string, endDate: string) => void;
  // Filtros
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedType: TransactionType | 'all';
  setSelectedType: (type: TransactionType | 'all') => void;
  clearFilters: () => void;
}

export const useTransactions = (): UseTransactionsReturn => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<{ startDate: string; endDate: string }>({
    startDate: '',
    endDate: '',
  });

  // Estados dos filtros
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<TransactionType | 'all'>('all');

  const { addToast } = useToast();

  // Calcular totais usando useMemo para performance
  const totals = useMemo((): TransactionTotals => {
    const income = transactions
      .filter((t) => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = transactions
      .filter((t) => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      income,
      expense,
      balance: income - expense,
    };
  }, [transactions]);

  // Filtrar transações por data e outros filtros
  const filteredTransactions = useMemo(() => {
    let filtered = transactions;

    // Filtro por data
    if (dateRange.startDate || dateRange.endDate) {
      filtered = filtered.filter((t) => {
        const tDate = new Date(t.date);
        const start = dateRange.startDate ? new Date(dateRange.startDate) : null;
        const end = dateRange.endDate ? new Date(dateRange.endDate) : null;

        return (!start || tDate >= start) && (!end || tDate <= end);
      });
    }

    // Filtro por busca
    if (searchTerm) {
      filtered = filtered.filter((t) =>
        t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por categoria
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((t) => t.categoryName === selectedCategory);
    }

    // Filtro por tipo
    if (selectedType !== 'all') {
      filtered = filtered.filter((t) => t.type === selectedType);
    }

    return filtered;
  }, [transactions, dateRange, searchTerm, selectedCategory, selectedType]);

  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const fetchedTransactions = await apiService.getTransactions();
      
      // Normalizar dados da API
      const normalizedTransactions = fetchedTransactions.map((t: any) => ({
        ...t,
        id: t.id || t.Id,
        amount: parseFloat(t.amount || t.Amount || 0),
        date: t.date || t.Date,
        description: t.description || t.Description || '',
        categoryName: t.categoryName || t.CategoryName || t.category || '-',
        type: typeof t.type === 'number' ? t.type : 
              t.type === 'Entrada' ? TransactionType.INCOME : 
              t.type === 'Saída' ? TransactionType.EXPENSE : 
              t.type === 'Income' ? TransactionType.INCOME : TransactionType.EXPENSE,
        status: typeof t.status === 'number' ? t.status : 
                t.status === 'Paid' ? 0 : 1,
        isRecurring: Boolean(t.isRecurring || t.IsRecurring),
        notes: t.notes || t.Notes || '',
      }));

      setTransactions(normalizedTransactions);
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Erro ao buscar transações';
      setError(errorMessage);
      addToast(errorMessage, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [addToast]);

  const createTransaction = useCallback(async (data: TransactionFormData) => {
    try {
      await apiService.createTransaction(data);
      await fetchTransactions(); // Recarregar transações
      addToast('Transação criada com sucesso!', 'success');
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Erro ao criar transação';
      addToast(errorMessage, 'error');
      throw error;
    }
  }, [fetchTransactions, addToast]);

  const updateTransaction = useCallback(async (id: string, data: TransactionFormData) => {
    try {
      await apiService.updateTransaction(id, data);
      await fetchTransactions(); // Recarregar transações
      addToast('Transação atualizada com sucesso!', 'success');
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Erro ao atualizar transação';
      addToast(errorMessage, 'error');
      throw error;
    }
  }, [fetchTransactions, addToast]);

  const deleteTransaction = useCallback(async (id: string) => {
    try {
      await apiService.deleteTransaction(id);
      await fetchTransactions(); // Recarregar transações
      addToast('Transação excluída com sucesso!', 'success');
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Erro ao excluir transação';
      addToast(errorMessage, 'error');
      throw error;
    }
  }, [fetchTransactions, addToast]);

  const handleSetDateRange = useCallback((startDate: string, endDate: string) => {
    setDateRange({ startDate, endDate });
  }, []);

  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedType('all');
    setDateRange({ startDate: '', endDate: '' });
  }, []);

  // Carregar transações ao inicializar
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return {
    transactions,
    totals,
    isLoading,
    error,
    fetchTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    filteredTransactions,
    setDateRange: handleSetDateRange,
    // Filtros
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    selectedType,
    setSelectedType,
    clearFilters,
  };
}; 
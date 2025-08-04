// src/components/ReportsExport.tsx
import { useState, useMemo } from 'react';
import { Download, FileText, BarChart3, Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle } from './ui/card';
import { CardContent } from './ui/cardContent';
import { TransactionType, type Transaction } from '../types/Transaction';
import { formatCurrency } from '../lib/utils';

interface ReportsExportProps {
  transactions: Transaction[];
  isLoading: boolean;
}

interface MonthlyData {
  month: string;
  income: number;
  expense: number;
  balance: number;
  transactionCount: number;
}

interface CategoryData {
  category: string;
  total: number;
  count: number;
  percentage: number;
}

export default function ReportsExport({ transactions, isLoading }: ReportsExportProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'30' | '90' | '180' | '365'>('30');
  const [selectedReport, setSelectedReport] = useState<'monthly' | 'category' | 'summary'>('summary');

  // Filtrar transações pelo período selecionado
  const filteredTransactions = useMemo(() => {
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(selectedPeriod));
    
    return transactions.filter(t => new Date(t.date) >= daysAgo);
  }, [transactions, selectedPeriod]);

  // Dados mensais
  const monthlyData = useMemo((): MonthlyData[] => {
    const months: { [key: string]: MonthlyData } = {};
    
    filteredTransactions.forEach(t => {
      const date = new Date(t.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
      
      if (!months[monthKey]) {
        months[monthKey] = {
          month: monthName,
          income: 0,
          expense: 0,
          balance: 0,
          transactionCount: 0
        };
      }
      
      if (t.type === TransactionType.INCOME) {
        months[monthKey].income += t.amount;
      } else {
        months[monthKey].expense += t.amount;
      }
      
      months[monthKey].balance = months[monthKey].income - months[monthKey].expense;
      months[monthKey].transactionCount++;
    });
    
    return Object.values(months).sort((a, b) => 
      new Date(a.month).getTime() - new Date(b.month).getTime()
    );
  }, [filteredTransactions]);

  // Dados por categoria
  const categoryData = useMemo((): CategoryData[] => {
    const categories: { [key: string]: CategoryData } = {};
    const totalExpenses = filteredTransactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + t.amount, 0);
    
    filteredTransactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .forEach(t => {
        if (!categories[t.categoryName]) {
          categories[t.categoryName] = {
            category: t.categoryName,
            total: 0,
            count: 0,
            percentage: 0
          };
        }
        
        categories[t.categoryName].total += t.amount;
        categories[t.categoryName].count++;
      });
    
    // Calcular porcentagens
    Object.values(categories).forEach(cat => {
      cat.percentage = totalExpenses > 0 ? (cat.total / totalExpenses) * 100 : 0;
    });
    
    return Object.values(categories)
      .sort((a, b) => b.total - a.total)
      .slice(0, 10); // Top 10 categorias
  }, [filteredTransactions]);

  // Resumo geral
  const summary = useMemo(() => {
    const income = filteredTransactions
      .filter(t => t.type === TransactionType.INCOME)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expense = filteredTransactions
      .filter(t => t.type === TransactionType.EXPENSE)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const balance = income - expense;
    const transactionCount = filteredTransactions.length;
    
    const avgTransaction = transactionCount > 0 ? (income + expense) / transactionCount : 0;
    
    return {
      income,
      expense,
      balance,
      transactionCount,
      avgTransaction
    };
  }, [filteredTransactions]);

  // Exportar para CSV
  const exportToCSV = () => {
    const headers = ['Data', 'Tipo', 'Descrição', 'Categoria', 'Valor', 'Status', 'Observações'];
    const csvContent = [
      headers.join(','),
      ...filteredTransactions.map(t => [
        t.date,
        t.type === TransactionType.INCOME ? 'Entrada' : 'Saída',
        `"${t.description}"`,
        t.categoryName,
        t.amount.toFixed(2),
        t.status === 0 ? 'Concluída' : 'Pendente',
        `"${t.notes || ''}"`
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `transacoes_${selectedPeriod}dias_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Exportar relatório em PDF (simulado)
  const exportToPDF = () => {
    // Aqui você pode integrar com uma biblioteca como jsPDF
    alert('Funcionalidade de PDF será implementada em breve!');
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Relatórios e Exportação
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-center">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Período</label>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value as any)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="30">Últimos 30 dias</option>
                <option value="90">Últimos 90 dias</option>
                <option value="180">Últimos 180 dias</option>
                <option value="365">Último ano</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Relatório</label>
              <select
                value={selectedReport}
                onChange={(e) => setSelectedReport(e.target.value as any)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="summary">Resumo Geral</option>
                <option value="monthly">Dados Mensais</option>
                <option value="category">Por Categoria</option>
              </select>
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={exportToCSV}
                className="flex items-center gap-2"
                variant="outline"
              >
                <Download className="w-4 h-4" />
                Exportar CSV
              </Button>
              <Button
                onClick={exportToPDF}
                className="flex items-center gap-2"
                variant="outline"
              >
                <FileText className="w-4 h-4" />
                Exportar PDF
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumo Geral */}
      {selectedReport === 'summary' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Entradas</p>
                  <p className="text-xl font-bold text-green-600">{formatCurrency(summary.income)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-red-600" />
                <div>
                  <p className="text-sm text-gray-600">Saídas</p>
                  <p className="text-xl font-bold text-red-600">{formatCurrency(summary.expense)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Saldo</p>
                  <p className={`text-xl font-bold ${summary.balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                    {formatCurrency(summary.balance)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Transações</p>
                  <p className="text-xl font-bold text-purple-600">{summary.transactionCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Dados Mensais */}
      {selectedReport === 'monthly' && (
        <Card>
          <CardHeader>
            <CardTitle>Dados Mensais</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Mês</th>
                    <th className="text-right p-2">Entradas</th>
                    <th className="text-right p-2">Saídas</th>
                    <th className="text-right p-2">Saldo</th>
                    <th className="text-right p-2">Transações</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyData.map((month, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-2 font-medium">{month.month}</td>
                      <td className="p-2 text-right text-green-600">{formatCurrency(month.income)}</td>
                      <td className="p-2 text-right text-red-600">{formatCurrency(month.expense)}</td>
                      <td className={`p-2 text-right font-medium ${month.balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                        {formatCurrency(month.balance)}
                      </td>
                      <td className="p-2 text-right text-gray-600">{month.transactionCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dados por Categoria */}
      {selectedReport === 'category' && (
        <Card>
          <CardHeader>
            <CardTitle>Top 10 Categorias (Gastos)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {categoryData.map((cat, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{cat.category}</p>
                      <p className="text-sm text-gray-600">{cat.count} transações</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-red-600">{formatCurrency(cat.total)}</p>
                    <p className="text-sm text-gray-600">{cat.percentage.toFixed(1)}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 
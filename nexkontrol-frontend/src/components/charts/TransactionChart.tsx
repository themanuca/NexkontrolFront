import React from 'react';
import { Card } from '../ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { type Transaction, TransactionType } from '../../types/Transaction';
import { formatCurrency } from '../../lib/utils';

interface TransactionChartProps {
  transactions: Transaction[];
}

const COLORS = ['#10B981', '#EF4444', '#3B82F6', '#F59E0B', '#8B5CF6', '#EC4899'];

const TransactionChart: React.FC<TransactionChartProps> = ({ transactions }) => {
  // Agrupar transações por categoria
  const categoryData = transactions.reduce((acc, transaction) => {
    const categoryName = transaction.categoryName || 'Sem categoria';
    const existingCategory = acc.find(item => item.name === categoryName);
    
    if (existingCategory) {
      existingCategory.value += transaction.amount;
    } else {
      acc.push({
        name: categoryName,
        value: transaction.amount,
        type: transaction.type === TransactionType.INCOME ? 'Entrada' : 'Saída'
      });
    }
    
    return acc;
  }, [] as Array<{ name: string; value: number; type: string }>);

  // Separar entradas e saídas
  const incomeData = categoryData.filter(item => item.type === 'Entrada');
  const expenseData = categoryData.filter(item => item.type === 'Saída');

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {formatCurrency(payload[0].value)}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {payload[0].payload.type}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Gráfico de Entradas */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
          Distribuição de Entradas
        </h3>
        {incomeData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={incomeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${((Number(percent ))* 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {incomeData.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
            Nenhuma entrada registrada
          </div>
        )}
      </Card>

      {/* Gráfico de Saídas */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">
          Distribuição de Saídas
        </h3>
        {expenseData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={expenseData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${((Number(percent ))* 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {expenseData.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
            Nenhuma saída registrada
          </div>
        )}
      </Card>
    </div>
  );
};

export default TransactionChart; 
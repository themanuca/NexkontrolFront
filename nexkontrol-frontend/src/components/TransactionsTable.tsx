// src/components/TransactionsTable.tsx
import React from "react";
import { Card } from "../components/ui/card";
import { cn, formatCurrency } from "../lib/utils";
import { type Transaction, TransactionType } from "../types/Transaction";
import { Edit, Trash2 } from "lucide-react";

interface Props {
  transactions: Transaction[];
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (transactionId: string) => void;
}

const TransactionsTable = React.memo<Props>(({ transactions, onEdit, onDelete }) => {
  return (
    <Card className="p-3 sm:p-6 mt-6">
      <h3 className="text-base sm:text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Transações Recentes</h3>
      <div className="overflow-x-auto">
        <table 
          className="w-full text-xs sm:text-sm text-left border-collapse min-w-[600px]"
          role="table"
          aria-label="Tabela de transações"
        >
          <thead>
            <tr className="text-gray-500 border-b border-gray-200 dark:border-gray-700">
              <th 
                className="py-2 sm:py-3 px-1 sm:px-2 font-medium"
                scope="col"
              >
                Data
              </th>
              <th 
                className="py-2 sm:py-3 px-1 sm:px-2 font-medium"
                scope="col"
              >
                Descrição
              </th>
              <th 
                className="py-2 sm:py-3 px-1 sm:px-2 font-medium hidden sm:table-cell"
                scope="col"
              >
                Categoria
              </th>
              <th 
                className="py-2 sm:py-3 px-1 sm:px-2 font-medium text-right"
                scope="col"
              >
                Valor
              </th>
              <th 
                className="py-2 sm:py-3 px-1 sm:px-2 font-medium text-center"
                scope="col"
              >
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr 
                key={t.id} 
                className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 focus-within:bg-gray-50 dark:focus-within:bg-gray-800"
                tabIndex={0}
                role="row"
              >
                <td className="py-2 sm:py-3 px-1 sm:px-2">
                  <time dateTime={t.date} className="text-xs sm:text-sm">
                    {new Date(t.date).toLocaleDateString("pt-BR")}
                  </time>
                </td>
                <td className="py-2 sm:py-3 px-1 sm:px-2">
                  <span className="text-xs sm:text-sm truncate block max-w-[150px] sm:max-w-none">
                    {t.description}
                  </span>
                </td>
                <td className="py-2 sm:py-3 px-1 sm:px-2 hidden sm:table-cell">
                  <span className="text-xs sm:text-sm">{t.categoryName ?? "-"}</span>
                </td>
                <td className={cn(
                  "py-2 sm:py-3 px-1 sm:px-2 text-right font-medium",
                  t.type === TransactionType.INCOME ? "text-green-600" : "text-red-600"
                )}>
                  <span aria-label={t.type === TransactionType.INCOME ? "Entrada" : "Saída"} className="text-xs sm:text-sm">
                    {t.type === TransactionType.INCOME ? "+" : "-"} {formatCurrency(t.amount)}
                  </span>
                </td>
                <td className="py-2 sm:py-3 px-1 sm:px-2 text-center">
                  <div className="flex items-center justify-center gap-1 sm:gap-2">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(t)}
                        className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                        aria-label="Editar transação"
                        title="Editar"
                      >
                        <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(t.id)}
                        className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                        aria-label="Excluir transação"
                        title="Excluir"
                      >
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr>
                <td 
                  colSpan={5} 
                  className="text-center py-4 text-gray-500 dark:text-gray-400"
                  role="cell"
                >
                  Nenhuma transação encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
});

TransactionsTable.displayName = 'TransactionsTable';

export default TransactionsTable;
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
    <Card className="p-6 mt-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Transações Recentes</h3>
      <div className="overflow-x-auto">
        <table 
          className="w-full text-sm text-left border-collapse"
          role="table"
          aria-label="Tabela de transações"
        >
          <thead>
            <tr className="text-gray-500 border-b border-gray-200">
              <th 
                className="py-3 px-2 font-medium"
                scope="col"
              >
                Data
              </th>
              <th 
                className="py-3 px-2 font-medium"
                scope="col"
              >
                Descrição
              </th>
              <th 
                className="py-3 px-2 font-medium"
                scope="col"
              >
                Categoria
              </th>
              <th 
                className="py-3 px-2 font-medium text-right"
                scope="col"
              >
                Valor
              </th>
              <th 
                className="py-3 px-2 font-medium text-center"
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
                className="border-b border-gray-100 hover:bg-gray-50 focus-within:bg-gray-50"
                tabIndex={0}
                role="row"
              >
                <td className="py-3 px-2">
                  <time dateTime={t.date}>
                    {new Date(t.date).toLocaleDateString("pt-BR")}
                  </time>
                </td>
                <td className="py-3 px-2">{t.description}</td>
                <td className="py-3 px-2">{t.categoryName ?? "-"}</td>
                <td className={cn(
                  "py-3 px-2 text-right font-medium",
                  t.type === TransactionType.INCOME ? "text-green-600" : "text-red-600"
                )}>
                  <span aria-label={t.type === TransactionType.INCOME ? "Entrada" : "Saída"}>
                    {t.type === TransactionType.INCOME ? "+" : "-"} {formatCurrency(t.amount)}
                  </span>
                </td>
                <td className="py-3 px-2 text-center">
                  <div className="flex items-center justify-center gap-2">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(t)}
                        className="p-1 text-gray-500 hover:text-blue-600 transition-colors"
                        aria-label="Editar transação"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(t.id)}
                        className="p-1 text-gray-500 hover:text-red-600 transition-colors"
                        aria-label="Excluir transação"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
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
                  className="text-center py-4 text-gray-500"
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
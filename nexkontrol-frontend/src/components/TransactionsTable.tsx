// src/components/TransactionsTable.tsx
import { Card } from "../components/ui/card";
import { cn, formatCurrency } from "../lib/utils";
import React from "react";

interface Transaction {
  id: string;
  amount: number;
  date: string;
  description: string;
  type: 0 | 1;
  category: {
    name: string;
  } | null;
}

interface Props {
  transactions: Transaction[];
}

export default function TransactionsTable({ transactions }: Props) {
  return (
    <Card className="p-6 mt-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Transações Recentes</h3>
      <div className="overflow-x-auto">
        {/* REMOVIDO WHITESPACE AQUI */}
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            {/* REMOVIDO WHITESPACE AQUI */}
            <tr className="text-gray-500 border-b border-gray-200">
              <th className="py-3 px-2 font-medium">Data</th>
              <th className="py-3 px-2 font-medium">Descrição</th>
              <th className="py-3 px-2 font-medium">Categoria</th>
              <th className="py-3 px-2 font-medium text-right">Valor</th>
            </tr>
          </thead>
          <tbody>
            {transactions.slice(0, 5).map((t) => (
              // REMOVIDO WHITESPACE AQUI
              <tr key={t.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-2">
                  {new Date(t.date).toLocaleDateString("pt-BR")}
                </td>
                <td className="py-3 px-2">{t.description}</td>
                <td className="py-3 px-2">{t.category?.name ?? "-"}</td>
                <td className={cn(
                  "py-3 px-2 text-right font-medium",
                  t.type === 0 ? "text-green-600" : "text-red-600"
                )}>
                  {t.type === 0 ? "+" : "-"} {formatCurrency(t.amount)}
                </td>
              </tr>
            ))}
            {transactions.length === 0 && (
              // REMOVIDO WHITESPACE AQUI
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-500">
                  Nenhuma transação encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
// src/pages/Dashboard.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { LogOut, PlusCircle, TrendingDown, TrendingUp, Wallet } from "lucide-react";

// Importações dos seus componentes de UI e utilitários
import { Button } from "../../components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "../../components/ui/dialog";

// Importações dos novos componentes específicos do Dashboard
import SummaryCard from "../../components/SummaryCard"; // Componente para os cards de resumo
import TransactionsTable from "../../components/TransactionsTable"; // Componente para a tabela de transações
import NewTransactionForm from "../../components/NewTransactionForm"; // Componente do formulário de nova transação
import { useNavigate } from "react-router-dom";
import { useToast } from "../../Context/ToastContext";

// Interface unificada para Transação (0 = Entrada, 1 = Saída)
interface Transaction {
  id: string;
  date: string;
  description: string;
  categoryName:string; // Categoria pode ser um objeto ou null
  type: 0 | 1; // 0 para Entrada, 1 para Saída
  amount: number;
  status:0 | 1;
  isRecurring: boolean;
  notes:string;
}

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totals, setTotals] = useState({ income: 0, expense: 0, balance: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar o modal
  const navigate = useNavigate();
  const { addToast } = useToast(); // <--- Use o hook useToast

  const fetchTransactions = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      addToast("Token de autenticação não encontrado.","error");
      // Redirecionar para a página de login ou exibir uma mensagem
      return;
    }
    try {
      const response = await axios.get("http://localhost:5091/api/transactions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const fetchedTransactions: Transaction[] = response.data.map((t: any) => ({
        ...t,
        // Garante que 'type' é 0 ou 1 e 'category' é um objeto com 'name'
        type: t.type === 'Entrada' ? 0 : (t.type === 'Saída' ? 1 : t.type), // Ajusta se a API retorna string
        category: t.category ? { id: t.categoryId, name: t.category } : null, // Adapta se a API retorna 'category' como string
      }));

      setTransactions(fetchedTransactions);

      const income = fetchedTransactions
        .filter((t: Transaction) => t.type === 0)
        .reduce((sum: number, t: Transaction) => sum + t.amount, 0);

      const expense = fetchedTransactions
        .filter((t: Transaction) => t.type === 1)
        .reduce((sum: number, t: Transaction) => sum + t.amount, 0);

      setTotals({ income, expense, balance: income - expense });

    } catch (error) {
      addToast("Erro ao buscar transações:", "error");
      handlerLogout();
    }
  };
  const handlerLogout = ()=>{
    navigate("/login");
    localStorage.removeItem("token");
  }
  useEffect(() => {
    fetchTransactions();
  }, []);

  // Handler para quando uma transação é adicionada com sucesso
  const handleTransactionSuccess = () => {
    fetchTransactions(); // Recarrega os dados
    setIsModalOpen(false); // Fecha o modal
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6 md:p-10 font-sans">
      <button onClick={handlerLogout} className="flex shadow-md transition-all duration-200 ease-in-out bg-gradient-to-r">
        <LogOut className="w-5 h-5"/>
      </button>
      <div className="max-w-6xl mx-auto">
        <header className="md:flex md:justify-between items-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-50">
            Painel de Controle
          </h1>
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            {/* O DialogTrigger com asChild deve ter APENAS UM filho */}
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2 px-6 py-3 rounded-xl shadow-md transition-all duration-200 ease-in-out bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white transform hover:scale-105">
                <PlusCircle className="w-5 h-5" /> Nova Transação
              </Button>
            </DialogTrigger>
            <DialogContent>
              <NewTransactionForm
                onSuccess={handleTransactionSuccess}
                onClose={() => setIsModalOpen(false)}
                isOpen={isModalOpen}
              />
            </DialogContent>
          </Dialog>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <SummaryCard
            title="Entradas"
            amount={totals.income}
            icon={TrendingUp}
            iconColorClass="text-green-600 dark:text-green-400"
          />
          <SummaryCard
            title="Saídas"
            amount={totals.expense}
            icon={TrendingDown}
            iconColorClass="text-red-600 dark:text-red-400"
          />
          <SummaryCard
            title="Saldo Total"
            amount={totals.balance}
            icon={Wallet}
            iconColorClass={totals.balance >= 0 ? "text-blue-600 dark:text-blue-400" : "text-red-600 dark:text-red-400"}
          />
        </section>

        <section>
          <TransactionsTable transactions={transactions} />
        </section>

        <section className="mt-10 bg-gray-100 dark:bg-gray-900 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
            Insights do NexKontrol (Em Breve)
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Nossa inteligência artificial analisará seus dados para oferecer sugestões personalizadas e relatórios inteligentes. Fique atento!
          </p>
        </section>
      </div>
    </div>
  );
}
// src/pages/Dashboard.tsx
import { useState } from "react";
import { LogOut, PlusCircle, TrendingDown, TrendingUp, Wallet, RefreshCw, BarChart3, Brain } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "../../components/ui/dialog";
import { subDays, format } from "date-fns";

import SummaryCard from "../../components/SummaryCard";
import TransactionsTable from "../../components/TransactionsTable";
import TransactionFilters from "../../components/TransactionFilters";
import TransactionChart from "../../components/charts/TransactionChart";
import NewTransactionForm from "../../components/NewTransactionForm";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import ReportsExport from "../../components/ReportsExport";
import AIInsights from "../../components/ai/AIInsights";
import AIChatbot from "../../components/ai/AIChatbot";
import { useAuthContext } from "../../Context/AuthContext";
import { useTransactions } from "../../hooks/useTransactions";
import { useAI } from "../../hooks/useAI";
import { SkeletonCard, SkeletonTable } from "../../components/ui/Skeleton";

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<any>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; transactionId: string | null }>({
    isOpen: false,
    transactionId: null
  });
  const [showReports, setShowReports] = useState(false);
  const { user, logout } = useAuthContext();
  const { 
    totals, 
    filteredTransactions, 
    setDateRange, 
    deleteTransaction,
    fetchTransactions,
    isLoading,
    // Filtros
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    selectedType,
    setSelectedType,
    clearFilters,
  } = useTransactions();

  // Hook de IA
  const {
    isAnalyzing,
    insights,
    chatMessages,
    isChatLoading,
    isAIEnabled,
    analyzeTransactions,
    sendChatMessage,
    clearChat,
    toggleAI,
  } = useAI();

  // Configurar data inicial (últimos 30 dias)
  const today = new Date();
  const thirtyDaysAgo = subDays(today, 30);
  const initialStartDate = format(thirtyDaysAgo, "yyyy-MM-dd");
  const initialEndDate = format(today, "yyyy-MM-dd");

  // Handler para quando uma transação é adicionada com sucesso
  const handleTransactionSuccess = async () => {
    setIsModalOpen(false);
    setEditingTransaction(null);
    
    // Aguardar um pouco e forçar recarregamento
    setTimeout(() => {
      fetchTransactions();
    }, 500);
  };

  // Handler para editar transação
  const handleEditTransaction = (transaction: any) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  // Handler para excluir transação
  const handleDeleteTransaction = (transactionId: string) => {
    setDeleteDialog({ isOpen: true, transactionId });
  };

  const confirmDelete = async () => {
    if (deleteDialog.transactionId) {
      try {
        await deleteTransaction(deleteDialog.transactionId);
      } catch (error) {
        // Erro já tratado no hook
      }
    }
  };

  // Extrair categorias únicas das transações
  const categories = Array.from(
    new Set(filteredTransactions.map(t => t.categoryName))
  ).map(name => ({ id: name, categoryName: name }));

  // Handlers de IA
  const handleAIAnalysis = async () => {
    if (filteredTransactions.length > 0) {
      await analyzeTransactions(filteredTransactions, {
        dateRange: {
          startDate: initialStartDate,
          endDate: initialEndDate,
        },
        analysisType: 'full',
      });
    }
  };

  const handleChatMessage = async (message: string) => {
    await sendChatMessage(message);
  };

  return (
    <div>
      <div className="shadow-md w-full text-base sm:text-lg flex bg-gray-100 justify-between items-center dark:bg-gray-800 p-4 sm:p-6 ease-in-out bg-gradient-to-r">
        <h2 className="text-gray-800 dark:text-gray-200 text-sm sm:text-base lg:text-lg truncate">
          Olá {user?.name}!
        </h2>
        <button 
          onClick={logout} 
          className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200 ease-in-out shadow-md text-sm sm:text-base"
        >
          <LogOut className="w-4 h-4 sm:w-5 sm:h-5"/>
          <span className="hidden sm:inline">Sair</span>
          <span className="sm:hidden">Sair</span>
        </button>
      </div>    
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-gray-50">
              Painel de Controle
            </h1>
            
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Button 
                onClick={fetchTransactions}
                disabled={isLoading}
                className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-xl shadow-md transition-all duration-200 ease-in-out bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white transform hover:scale-105 text-sm sm:text-base"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">{isLoading ? 'Carregando...' : 'Atualizar'}</span>
                <span className="sm:hidden">{isLoading ? '...' : 'Atualizar'}</span>
              </Button>
              
              <Button
                onClick={() => setShowReports(!showReports)}
                className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-xl shadow-md transition-all duration-200 ease-in-out bg-gradient-to-r from-purple-600 to-violet-700 hover:from-purple-700 hover:to-violet-800 text-white transform hover:scale-105 text-sm sm:text-base"
              >
                <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">{showReports ? 'Ocultar Relatórios' : 'Relatórios'}</span>
                <span className="sm:hidden">{showReports ? 'Ocultar' : 'Relatórios'}</span>
              </Button>

              <Button
                onClick={handleAIAnalysis}
                disabled={true}
                className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-xl shadow-md transition-all duration-200 ease-in-out bg-gradient-to-r from-orange-600 to-red-700 hover:from-orange-700 hover:to-red-800 text-white transform hover:scale-105 text-sm sm:text-base"
              >
                <Brain className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">{isAnalyzing ? 'Analisando...' : 'Análise IA'}</span>
                <span className="sm:hidden">{isAnalyzing ? '...' : 'IA'}</span>
              </Button>
              
              <Dialog open={isModalOpen} onOpenChange={(open) => {
                setIsModalOpen(open);
                if (!open) {
                  setEditingTransaction(null);
                }
              }}>
                <DialogTrigger asChild>
                  <Button className="flex items-center justify-center gap-2 px-3 sm:px-4 lg:px-6 py-2 sm:py-3 rounded-xl shadow-md transition-all duration-200 ease-in-out bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white transform hover:scale-105 text-sm sm:text-base">
                    <PlusCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline">Nova Transação</span>
                    <span className="sm:hidden">Nova</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <NewTransactionForm
                    onSuccess={handleTransactionSuccess}
                    onClose={() => {
                      setIsModalOpen(false);
                      setEditingTransaction(null);
                    }}
                    isOpen={isModalOpen}
                    editingTransaction={editingTransaction}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10">
          {isLoading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (
            <>
              <SummaryCard
                title="Entradas"
                value={totals.income}
                icon={<TrendingUp className="w-5 h-5 text-green-600" />}
                trend="up"
                className="text-green-600"
              />
              <SummaryCard
                title="Saídas"
                value={totals.expense}
                icon={<TrendingDown className="w-5 h-5 text-red-600" />}
                trend="down"
                className="text-red-600"
              />
              <SummaryCard
                title="Saldo Total"
                value={totals.balance}
                icon={<Wallet className="w-5 h-5" />}
                className={totals.balance >= 0 ? "text-blue-600" : "text-red-600"}
              />
            </>
          )}
        </section>

                 {/* Relatórios */}
         {showReports && (
           <section className="mb-10">
             <ReportsExport 
               transactions={filteredTransactions} 
               isLoading={isLoading} 
             />
           </section>
         )}

         {/* Gráficos */}
         <section className="mb-10">
           <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-6">
             Análise Visual
           </h2>
           {isLoading ? (
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
               <SkeletonCard />
               <SkeletonCard />
             </div>
           ) : (
             <TransactionChart transactions={filteredTransactions} />
           )}
         </section>

        <section>
          {/* Filtros */}
          <TransactionFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            selectedType={selectedType}
            onTypeChange={setSelectedType}
            categories={categories}
            onClearFilters={clearFilters}
          />

          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3 sm:gap-4 mb-4">
            <div className="w-full sm:w-auto">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Data Inicial</label>
              <input
                type="date"
                defaultValue={initialStartDate}
                onChange={(e) => setDateRange(e.target.value, initialEndDate)}
                className="w-full sm:w-auto px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500 text-sm sm:text-base"
                disabled={isLoading}
              />
            </div>
            
            <div className="w-full sm:w-auto">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Data Final</label>
              <input
                type="date"
                defaultValue={initialEndDate}
                onChange={(e) => setDateRange(initialStartDate, e.target.value)}
                className="w-full sm:w-auto px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500 text-sm sm:text-base"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            {isLoading ? (
              <SkeletonTable />
            ) : (
              <TransactionsTable 
                transactions={filteredTransactions}
                onEdit={handleEditTransaction}
                onDelete={handleDeleteTransaction}
              />
            )}
          </div>
        </section>

        {/* Seção de IA */}
        {isAIEnabled && (
          <section className="mt-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
                Análise Inteligente
              </h2>
              <button
                onClick={toggleAI}
                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                Desativar IA
              </button>
            </div>
            
            <AIInsights 
              insights={insights}
              isAnalyzing={isAnalyzing}
              onRefresh={handleAIAnalysis}
            />
          </section>
        )}

        {/* Seção de IA Desabilitada */}
        {!isAIEnabled && (
          <section className="mt-10 bg-gray-100 dark:bg-gray-900 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-800">
            <div className="text-center">
              <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
                IA Desabilitada
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Ative a inteligência artificial para receber insights personalizados sobre suas finanças.
              </p>
              <button
                onClick={toggleAI}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Brain className="w-4 h-4 mr-2" />
                Ativar IA
              </button>
            </div>
          </section>
        )}
      </div>
    </div>

    {/* Modal de Confirmação de Exclusão */}
    <ConfirmDialog
      isOpen={deleteDialog.isOpen}
      onClose={() => setDeleteDialog({ isOpen: false, transactionId: null })}
      onConfirm={confirmDelete}
      title="Excluir Transação"
      message="Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita."
      confirmText="Excluir"
      cancelText="Cancelar"
      type="danger"
      icon="delete"
    />

    {/* Chatbot de IA */}
    {isAIEnabled && (
      <AIChatbot
        messages={chatMessages}
        isChatLoading={isChatLoading}
        onSendMessage={handleChatMessage}
        onClearChat={clearChat}
      />
    )}
  </div>
  );
}
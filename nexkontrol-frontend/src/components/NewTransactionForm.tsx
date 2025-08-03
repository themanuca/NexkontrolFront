// src/components/NewTransactionForm.tsx
import React, { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { TrendingDown, TrendingUp } from "lucide-react";
import { DialogClose } from "../components/ui/dialog";
import type { Account } from "../types/Account";
import { useToast } from "../Context/ToastContext";
import { useTransactions } from "../hooks/useTransactions";
import { apiService } from "../services/api";
import { type TransactionFormData, TransactionType, TransactionStatus, RecurrenceInterval, type Category } from "../types/Transaction";

interface Props {
  onSuccess: () => void;
  onClose: () => void;
  isOpen: boolean;
  editingTransaction?: any; // Transação sendo editada (se houver)
}

export default function NewTransactionForm({ onSuccess, onClose, isOpen, editingTransaction }: Props) {
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [categoryId, setCategoryId] = useState("");
  const [accountId, setAccountId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<TransactionStatus>(TransactionStatus.PAID);
  const [isRecurring, setIsRecurring] = useState(false);
  const [notes, setNotes] = useState("");
  const [recurrenceInterval, setRecurrenceInterval] = useState<RecurrenceInterval | undefined>(undefined);

  // Estados para as listas de contas e categorias
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingDropdowns, setIsLoadingDropdowns] = useState(false);
  
  const { addToast } = useToast();
  const { createTransaction, updateTransaction } = useTransactions();
  
  const [valorCategoria, setValorCategoria] = useState("");
  const [isNewCategoruy, setIsNewCategoruy] = useState(false);

  const [valueAccount, setIsValueAccount] = useState("");
  const [isNewAccount, setIsNewAccount] = useState(false);
  const [isNewAccountType, setIsNewAccountType] = useState<number>(0);

  // Preencher formulário quando estiver editando
  useEffect(() => {
    if (editingTransaction && isOpen) {
      setAmount(editingTransaction.amount.toString());
      setType(editingTransaction.type);
      setDescription(editingTransaction.description);
      setDate(editingTransaction.date);
      setCategoryId(editingTransaction.categoryId || "");
      setAccountId(editingTransaction.accountId || "");
      setStatus(editingTransaction.status);
      setIsRecurring(editingTransaction.isRecurring);
      setNotes(editingTransaction.notes || "");
      setRecurrenceInterval(editingTransaction.recurrenceInterval);
    } else if (isOpen) {
      // Resetar formulário para nova transação
      setAmount("");
      setType(TransactionType.EXPENSE);
      setDescription("");
      setDate(new Date().toISOString().split("T")[0]);
      setCategoryId("");
      setAccountId("");
      setStatus(TransactionStatus.PAID);
      setIsRecurring(false);
      setNotes("");
      setRecurrenceInterval(undefined);
      setValorCategoria("");
      setIsNewCategoruy(false);
      setIsValueAccount("");
      setIsNewAccount(false);
      setIsNewAccountType(0);
    }
  }, [editingTransaction, isOpen]);

  useEffect(() => {
    if (isOpen && categories.length === 0) {
      const fetchDropdownData = async () => {
        setIsLoadingDropdowns(true);
        try {
          const [categoriesResponse, accountsResponse] = await Promise.all([
            apiService.getCategories(),
            apiService.getAccounts()
          ]);
          setCategories(categoriesResponse);
          setAccounts(accountsResponse);
        } catch (error) {
          addToast("Erro ao carregar dados de dropdown:", "error");
        } finally {
          setIsLoadingDropdowns(false);
        }
      };
      fetchDropdownData();
    }
  }, [isOpen, categories.length, accounts.length, addToast]);

  function handlerNewCategory() {
    setIsNewCategoruy(true);
  }

  async function handlerNewAccount() {
    setIsNewAccount(true);
  }

  async function ValidCreateAccount() {
    if (isNewAccount && valueAccount.length > 0 && isNewAccountType >= 0) {
      const accountdto = {
        name: valueAccount,
        InitialBalance: 0,
        type: isNewAccountType
      };
      try {
        const result = await apiService.createAccount(accountdto);
        setAccountId(result);
        setIsNewAccount(false);
        setIsValueAccount("");
        // Recarregar lista de contas
        const accountsResponse = await apiService.getAccounts();
        setAccounts(accountsResponse);
      } catch (err) {
        addToast("Erro ao cadastrar conta:", "error");
        setIsSubmitting(false);
        return;
      }
    }
  }

  async function ValidCreateCategory() {
    if (isNewCategoruy && valorCategoria.length > 0) {
      try {
        const result = await apiService.createCategory(valorCategoria);
        setCategoryId(result);
        setIsNewCategoruy(false);
        setValorCategoria("");
        // Recarregar lista de categorias
        const categoriesResponse = await apiService.getCategories();
        setCategories(categoriesResponse);
      } catch (error) {
        addToast("Erro ao cadastrar categoria:", "error");
        setIsSubmitting(false);
        return;
      }
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await ValidCreateCategory();
      await ValidCreateAccount();

      const data: TransactionFormData = {
        amount: parseFloat(amount),
        type,
        description,
        date,
        status,
        accountId,
        categoryId,
        isRecurring,
        notes: notes || undefined,
        recurrenceInterval: isRecurring ? recurrenceInterval : undefined,
      };

      console.log('Dados sendo enviados:', data);

      if (editingTransaction) {
        await updateTransaction(editingTransaction.id, data);
        addToast("Transação atualizada com sucesso!", "success");
      } else {
        await createTransaction(data);
        addToast("Transação criada com sucesso!", "success");
      }

      // Aguardar um pouco para garantir que o backend processou
      await new Promise(resolve => setTimeout(resolve, 300));

      onSuccess();
      onClose();
    } catch (error) {
      // Erro já tratado no hook
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 p-2">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-6 dark:text-white">
        {editingTransaction ? "Editar Transação" : "Nova Transação"}
      </h2>

      <div className="flex rounded-lg overflow-hidden border border-gray-300">
        <button
          type="button"
          onClick={() => setType(TransactionType.INCOME)}
          className={`flex-1 flex items-center justify-center gap-2 py-3 transition-all duration-200 ${
            type === TransactionType.INCOME ? "bg-green-600 text-white font-semibold" : "bg-gray-100 text-gray-700 hover:bg-green-100 hover:text-green-700"
          }`}
        >
          <TrendingUp className="w-5 h-5" /> Entrada
        </button>
        <button
          type="button"
          onClick={() => setType(TransactionType.EXPENSE)}
          className={`flex-1 flex items-center justify-center gap-2 py-3 transition-all duration-200 ${
            type === TransactionType.EXPENSE ? "bg-red-600 text-white font-semibold" : "bg-gray-100 text-gray-700 hover:bg-red-100 hover:text-red-700"
          }`}
        >
          <TrendingDown className="w-5 h-5" /> Saída
        </button>
      </div>

      <div>
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1 dark:text-white">Valor</label>
        <input
          type="number"
          id="amount"
          step="0.01"
          placeholder="0,00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-blue-500 focus:border-blue-500 text-lg font-semibold"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1 dark:text-white">Descrição</label>
        <input
          type="text"
          id="description"
          placeholder="Ex: Almoço no restaurante X"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div>
        <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1 dark:text-white">Categoria</label>
        <button 
          type="button" 
          onClick={handlerNewCategory} 
          className="text-blue-600 hover:text-blue-800 text-sm mb-2"
        >
          Adicionar Categoria
        </button>  

        {isNewCategoruy === false ? (
          <select
            id="categoryId"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700"
            required
            disabled={isLoadingDropdowns}
          >
            <option value="">{isLoadingDropdowns ? "Carregando Categorias..." : "Selecione a Categoria"}</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.categoryName}</option>
            ))}
          </select>
        ) : (
          <input 
            type="text" 
            value={valorCategoria} 
            onChange={e => setValorCategoria(e.target.value)} 
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700"
            placeholder="Nome da categoria"
          />
        )}
      </div>

      <div>
        <label htmlFor="accountId" className="block text-medium font-medium text-gray-700 mb-1 dark:text-white">Conta</label>
        <button 
          type="button" 
          disabled={isNewAccount} 
          onClick={handlerNewAccount} 
          className="text-blue-600 hover:text-blue-800 text-sm mb-2"
        >
          Adicionar Conta
        </button>  
        {isNewAccount === false ? (
          <select
            id="accountId"
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700"
            required
            disabled={isLoadingDropdowns}
          >
            <option value="">{isLoadingDropdowns ? "Carregando Contas..." : "Selecione a conta"}</option>
            {accounts.map((acc) => (
              <option key={acc.id} value={acc.id}>{acc.name}</option>
            ))}
          </select>
        ) : (
          <div className="space-y-2">
            <input 
              type="text" 
              placeholder="Nome da Conta" 
              value={valueAccount} 
              onChange={e => setIsValueAccount(e.target.value)} 
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700"
            />
            <select
              id="accountType"
              value={isNewAccountType}
              onChange={(e) => setIsNewAccountType(parseInt(e.target.value))}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700"
              required={valueAccount.length > 0}
            >
              <option value="">Selecione o tipo:</option>
              <option value="0">Banco</option>
              <option value="1">Cartão de crédito</option>
              <option value="2">Dinheiro</option>
              <option value="3">Pix</option>
            </select>
          </div>
        )}
      </div>

      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1 dark:text-white">Data</label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1 dark:text-white">Observações (opcional)</label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          rows={3}
          placeholder="Observações adicionais..."
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="isRecurring"
          checked={isRecurring}
          onChange={(e) => setIsRecurring(e.target.checked)}
          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="isRecurring" className="ml-2 block text-sm text-gray-900 dark:text-white">Transação Recorrente?</label>
      </div>

      {isRecurring && (
        <div>
          <label htmlFor="recurrenceInterval" className="block text-sm font-medium text-gray-700 mb-1 dark:text-white">Intervalo de Recorrência</label>
          <select
            id="recurrenceInterval"
            value={recurrenceInterval ?? ""}
            onChange={(e) => setRecurrenceInterval(parseInt(e.target.value) || undefined)}
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700"
            required={isRecurring}
          >
            <option value="">Selecione o Intervalo</option>
            <option value="0">Diário</option>
            <option value="1">Semanal</option>
            <option value="2">Mensal</option>
            <option value="3">Anual</option>
          </select>
        </div>
      )}

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1 dark:text-white">Status</label>
                 <select
           id="status"
           value={status}
           onChange={(e) => setStatus(parseInt(e.target.value) as TransactionStatus)}
           className="w-full border border-gray-300 p-3 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700"
           required
         >
           <option value={TransactionStatus.PAID}>Concluída</option>
           <option value={TransactionStatus.PENDING}>Pendente</option>
         </select>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <DialogClose asChild>
          <Button type="button" variant="outline">Cancelar</Button>
        </DialogClose>
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Salvando..." : (editingTransaction ? "Atualizar Transação" : "Salvar Transação")}
        </Button>
      </div>
    </form>
  );
}
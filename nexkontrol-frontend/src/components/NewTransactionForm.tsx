// src/components/NewTransactionForm.tsx
import React, { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { TrendingDown, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";
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

interface ValidationErrors {
  [key: string]: string | undefined;
  amount?: string;
  description?: string;
  categoryId?: string;
  accountId?: string;
  date?: string;
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
  
  // Estados de validação
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  
  const { addToast } = useToast();
  const { createTransaction, updateTransaction } = useTransactions();
  
  const [valorCategoria, setValorCategoria] = useState("");
  const [isNewCategoruy, setIsNewCategoruy] = useState(false);

  const [valueAccount, setIsValueAccount] = useState("");
  const [isNewAccount, setIsNewAccount] = useState(false);
  const [isNewAccountType, setIsNewAccountType] = useState<number>(0);

  // Função de validação
  const validateField = React.useCallback((field: string, value: any): string | undefined => {
    switch (field) {
      case 'amount':
        if (!value || value <= 0) return 'Valor deve ser maior que zero';
        if (isNaN(value)) return 'Valor deve ser um número válido';
        break;
      case 'description':
        if (!value || value.trim().length < 3) return 'Descrição deve ter pelo menos 3 caracteres';
        break;
      case 'categoryId':
        if (!value) return 'Selecione uma categoria';
        break;
      case 'accountId':
        if (!value) return 'Selecione uma conta';
        break;
      case 'date':
        if (!value) return 'Selecione uma data';
        const selectedDate = new Date(value);
        const today = new Date();
        if (selectedDate > today) return 'Data não pode ser futura';
        break;
    }
    return undefined;
  }, []);

  // Validar campo quando perde o foco
  const handleBlur = React.useCallback((field: string, value: any) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const error = validateField(field, value);
    setErrors(prev => ({ ...prev, [field]: error }));
  }, []);

  // Validar formulário completo
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    
    newErrors.amount = validateField('amount', parseFloat(amount));
    newErrors.description = validateField('description', description);
    newErrors.categoryId = validateField('categoryId', categoryId);
    newErrors.accountId = validateField('accountId', accountId);
    newErrors.date = validateField('date', date);

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  // Componente de campo com validação - usando useCallback para evitar re-renderizações
  const FormField = React.useCallback(({ 
    label, 
    field, 
    value, 
    onChange, 
    type = "text", 
    placeholder = "", 
    required = false,
    children 
  }: {
    label: string;
    field: string;
    value: any;
    onChange: (value: any) => void;
    type?: string;
    placeholder?: string;
    required?: boolean;
    children?: React.ReactNode;
  }) => {
    const hasError = touched[field] && errors[field];
    const isValid = touched[field] && !errors[field] && value;

         return (
       <div>
         <label htmlFor={field} className="block text-sm font-medium text-gray-700 mb-1 dark:text-white">
           {label} {required && <span className="text-red-500">*</span>}
         </label>
         {children || (
           <input
             type={type}
             id={field}
             value={value}
             onChange={(e) => onChange(e.target.value)}
             onBlur={() => handleBlur(field, value)}
             placeholder={placeholder}
             className={`w-full border p-2 sm:p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base dark:text-white ${
               hasError 
                 ? 'border-red-500 bg-red-50 dark:bg-red-900/20 dark:text-red-100' 
                 : isValid 
                 ? 'border-green-500 bg-green-50 dark:bg-green-900/20 dark:text-green-100' 
                 : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
             }`}
             required={required}
           />
         )}
         {hasError && (
           <div className="flex items-center gap-1 mt-1 text-red-600 dark:text-red-400 text-xs sm:text-sm">
             <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
             <span>{errors[field]}</span>
           </div>
         )}
         {isValid && (
           <div className="flex items-center gap-1 mt-1 text-green-600 dark:text-green-400 text-xs sm:text-sm">
             <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
             <span>Válido</span>
           </div>
         )}
       </div>
     );
  }, [touched, errors, handleBlur, validateField]);

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
      setErrors({});
      setTouched({});
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

  async function ValidCreateAccount(): Promise<boolean> {
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
        return true;
      } catch (err) {
        console.error('Erro ao criar conta:', err);
        addToast("Erro ao cadastrar conta:", "error");
        setIsSubmitting(false);
        return false;
      }
    }
    return true; // Se não há nova conta para criar, retorna true
  }

  async function ValidCreateCategory(): Promise<boolean> {
    if (isNewCategoruy && valorCategoria.length > 0) {
      try {
        const result = await apiService.createCategory(valorCategoria);
        setCategoryId(result);
        setIsNewCategoruy(false);
        setValorCategoria("");
        // Recarregar lista de categorias
        const categoriesResponse = await apiService.getCategories();
        setCategories(categoriesResponse);
        return true;
      } catch (error) {
        console.error('Erro ao criar categoria:', error);
        addToast("Erro ao cadastrar categoria:", "error");
        setIsSubmitting(false);
        return false;
      }
    }
    return true; // Se não há nova categoria para criar, retorna true
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    // Marcar todos os campos como tocados
    setTouched({
      amount: true,
      description: true,
      categoryId: true,
      accountId: true,
      date: true
    });

    // Validar formulário
    if (!validateForm()) {
      addToast("Por favor, corrija os erros no formulário", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      // Validar se as operações de criação foram bem-sucedidas
      const categoryCreated = await ValidCreateCategory();
      const accountCreated = await ValidCreateAccount();

      // Se alguma das operações falhou, parar aqui
      if (!categoryCreated || !accountCreated) {
        return;
      }

      // Validar se accountId e categoryId estão definidos
      if (!accountId || !categoryId) {
        addToast("Por favor, selecione uma conta e uma categoria", "error");
        return;
      }

      // Validar se os IDs são GUIDs válidos
      const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!guidRegex.test(accountId) || !guidRegex.test(categoryId)) {
        addToast("IDs de conta ou categoria inválidos", "error");
        return;
      }

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
    <form onSubmit={handleSubmit} className="space-y-4 p-3 sm:p-4 max-h-[90vh] overflow-y-auto">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 text-center mb-4 sm:mb-6 dark:text-white">
        {editingTransaction ? "Editar Transação" : "Nova Transação"}
      </h2>

      <div className="flex rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
        <button
          type="button"
          onClick={() => setType(TransactionType.INCOME)}
          className={`flex-1 flex items-center justify-center gap-1 sm:gap-2 py-2 sm:py-3 px-2 sm:px-3 text-sm sm:text-base transition-all duration-200 ${
            type === TransactionType.INCOME 
              ? "bg-green-600 text-white font-semibold" 
              : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-green-100 dark:hover:bg-green-900/20 hover:text-green-700 dark:hover:text-green-400"
          }`}
        >
          <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" /> 
          <span className="hidden sm:inline">Entrada</span>
          <span className="sm:hidden">Entrada</span>
        </button>
        <button
          type="button"
          onClick={() => setType(TransactionType.EXPENSE)}
          className={`flex-1 flex items-center justify-center gap-1 sm:gap-2 py-2 sm:py-3 px-2 sm:px-3 text-sm sm:text-base transition-all duration-200 ${
            type === TransactionType.EXPENSE 
              ? "bg-red-600 text-white font-semibold" 
              : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-400"
          }`}
        >
          <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5" /> 
          <span className="hidden sm:inline">Saída</span>
          <span className="sm:hidden">Saída</span>
        </button>
      </div>

      <FormField
        label="Valor"
        field="amount"
        value={amount}
        onChange={setAmount}
        type="number"
        placeholder="0,00"
        required
      />

      <FormField
        label="Descrição"
        field="description"
        value={description}
        onChange={setDescription}
        placeholder="Ex: Almoço no restaurante X"
        required
      />

             <div>
         <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1 dark:text-white">
           Categoria <span className="text-red-500">*</span>
         </label>
         <button 
           type="button" 
           onClick={handlerNewCategory} 
           className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-xs sm:text-sm mb-2"
         >
           Adicionar Categoria
         </button>  

         {isNewCategoruy === false ? (
           <select
             id="categoryId"
             value={categoryId}
             onChange={(e) => setCategoryId(e.target.value)}
             onBlur={() => handleBlur('categoryId', categoryId)}
             className={`w-full border p-2 sm:p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base dark:text-white ${
               touched.categoryId && errors.categoryId 
                 ? 'border-red-500 bg-red-50 dark:bg-red-900/20 dark:text-red-100' 
                 : touched.categoryId && !errors.categoryId && categoryId
                 ? 'border-green-500 bg-green-50 dark:bg-green-900/20 dark:text-green-100' 
                 : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
             }`}
             required
             disabled={isLoadingDropdowns}
           >
             <option value="">{isLoadingDropdowns ? "Carregando Categorias..." : "Selecione a Categoria"}</option>
             {categories.map((cat) => (
               <option key={cat.id} value={cat.id} className="dark:bg-gray-700 dark:text-white">{cat.categoryName}</option>
             ))}
           </select>
         ) : (
           <input 
             type="text" 
             value={valorCategoria} 
             onChange={e => setValorCategoria(e.target.value)} 
             className="w-full border border-gray-300 dark:border-gray-600 p-2 sm:p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm sm:text-base"
             placeholder="Nome da categoria"
           />
         )}
         {touched.categoryId && errors.categoryId && (
           <div className="flex items-center gap-1 mt-1 text-red-600 dark:text-red-400 text-xs sm:text-sm">
             <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
             <span>{errors.categoryId}</span>
           </div>
         )}
       </div>

             <div>
         <label htmlFor="accountId" className="block text-sm font-medium text-gray-700 mb-1 dark:text-white">
           Conta <span className="text-red-500">*</span>
         </label>
         <button 
           type="button" 
           disabled={isNewAccount} 
           onClick={handlerNewAccount} 
           className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-xs sm:text-sm mb-2"
         >
           Adicionar Conta
         </button>  
         {isNewAccount === false ? (
           <select
             id="accountId"
             value={accountId}
             onChange={(e) => setAccountId(e.target.value)}
             onBlur={() => handleBlur('accountId', accountId)}
             className={`w-full border p-2 sm:p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm sm:text-base dark:text-white ${
               touched.accountId && errors.accountId 
                 ? 'border-red-500 bg-red-50 dark:bg-red-900/20 dark:text-red-100' 
                 : touched.accountId && !errors.accountId && accountId
                 ? 'border-green-500 bg-green-50 dark:bg-green-900/20 dark:text-green-100' 
                 : 'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white'
             }`}
             required
             disabled={isLoadingDropdowns}
           >
             <option value="">{isLoadingDropdowns ? "Carregando Contas..." : "Selecione a conta"}</option>
             {accounts.map((acc) => (
               <option key={acc.id} value={acc.id} className="dark:bg-gray-700 dark:text-white">{acc.name}</option>
             ))}
           </select>
         ) : (
           <div className="space-y-2">
             <input 
               type="text" 
               placeholder="Nome da Conta" 
               value={valueAccount} 
               onChange={e => setIsValueAccount(e.target.value)} 
               className="w-full border border-gray-300 dark:border-gray-600 p-2 sm:p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm sm:text-base"
             />
             <select
               id="accountType"
               value={isNewAccountType}
               onChange={(e) => setIsNewAccountType(parseInt(e.target.value))}
               className="w-full border border-gray-300 dark:border-gray-600 p-2 sm:p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm sm:text-base"
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
         {touched.accountId && errors.accountId && (
           <div className="flex items-center gap-1 mt-1 text-red-600 dark:text-red-400 text-xs sm:text-sm">
             <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
             <span>{errors.accountId}</span>
           </div>
         )}
       </div>

      <FormField
        label="Data"
        field="date"
        value={date}
        onChange={setDate}
        type="date"
        required
      />

             <div>
         <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1 dark:text-white">Observações (opcional)</label>
         <textarea
           id="notes"
           value={notes}
           onChange={(e) => setNotes(e.target.value)}
           className="w-full border border-gray-300 dark:border-gray-600 p-2 sm:p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm sm:text-base"
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
           className="h-4 w-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:bg-gray-700"
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
             className="w-full border border-gray-300 dark:border-gray-600 p-2 sm:p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm sm:text-base"
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
           className="w-full border border-gray-300 dark:border-gray-600 p-2 sm:p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white text-sm sm:text-base"
           required
         >
           <option value={TransactionStatus.PAID}>Concluída</option>
           <option value={TransactionStatus.PENDING}>Pendente</option>
         </select>
       </div>

       <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4">
         <DialogClose asChild>
           <Button type="button" variant="outline" className="w-full sm:w-auto text-sm sm:text-base py-2 sm:py-3">
             Cancelar
           </Button>
         </DialogClose>
         <Button
           type="submit"
           disabled={isSubmitting}
           className="w-full sm:w-auto min-w-[120px] text-sm sm:text-base py-2 sm:py-3"
         >
           {isSubmitting ? (
             <div className="flex items-center gap-2">
               <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
               <span className="hidden sm:inline">Salvando...</span>
               <span className="sm:hidden">Salvando...</span>
             </div>
           ) : (
             editingTransaction ? "Atualizar Transação" : "Salvar Transação"
           )}
         </Button>
       </div>
    </form>
  );
}
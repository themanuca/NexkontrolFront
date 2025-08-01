// src/components/NewTransactionForm.tsx
import React, { useEffect, useState } from "react";
import axios from "axios"; // Usaremos axios diretamente
import { Button } from "../components/ui/button"; // Importe seu componente Button
import { TrendingDown, TrendingUp } from "lucide-react"; // Ícones para Entrada/Saída
import { DialogClose } from "../components/ui/dialog"; // Para o botão de fechar
import type { Account } from "../types/Account";
import { useToast } from "../Context/ToastContext";

interface Props {
  onSuccess: () => void;
  onClose: () => void; // Adicionado para fechar o modal programaticamente
  isOpen: boolean;
}

// Interface para os dados que o formulário enviará
interface TransactionFormData {
  amount: number;
  date: string; // YYYY-MM-DD
  description: string;
  notes?: string; // Opcional, se você for usar
  type: 0 | 1; // 0 para Entrada, 1 para Saída - Verifique se corresponde ao enum numérico no backend
  status: 0 | 1 | 2; // Exemplo: 0=Pendente, 1=Concluida, 2=Cancelada. Ajuste conforme seu enum TransactionStatus
  accountId: string; // Vai ser o GUID como string
  categoryId: string; // Vai ser o GUID como string
  isRecurring: boolean; // Novo campo obrigatório
  recurrenceInterval?: number; // Opcional, se for usar - ajuste conforme seu enum RecurrenceInterval
}

interface CategoryType{
  id:string;
  userId: string;
  categoryName:string;
  totalspent:number;
}

export default function NewTransactionForm({ onSuccess, onClose, isOpen }: Props) {
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<0 | 1>(1);
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [categoryId, setCategoryId] = useState("");
  const [accountId, setAccountId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<0 | 1>(0); 
  const [isRecurring, setIsRecurring] = useState(false);
  const [notes] = useState("");
  const [recurrenceInterval, setRecurrenceInterval] = useState<number | undefined>(undefined); // Se for usar recorrência

  // Estados para as listas de contas e categorias (populadas do backend)
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [isLoadingDropdowns, setIsLoadingDropdowns] = useState(false); // Novo estado para loading
  const api = import.meta.env.VITE_API_BASE_URL;
  const { addToast } = useToast();
  const [valorCategoria, setValorCategoria]=useState("");
  const [isNewCategoruy, setIsNewCategoruy] = useState(false);

  const [valueAccount, setIsValueAccount]=useState("");
  const [isNewAccount, setIsNewAccount] = useState(false);
  const [isNewAccountType, setIsNewAccountType]=useState<number>(0);
  
  useEffect(() => {
    if (isOpen && categories.length === 0) {
      const fetchDropdownData = async () => {
        setIsLoadingDropdowns(true);
        const token = localStorage.getItem("token");
        if (!token) {
          setIsLoadingDropdowns(false);
          addToast("Sua seção expirou.","error")
          return;
        }
        try {
          const categoriesResponse = await axios.get(`${api}/Category`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setCategories(categoriesResponse.data);
          const accountsResponse = await axios.get(`${api}/account`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setAccounts(accountsResponse.data);

        } catch (error) {
          addToast("Erro ao carregar dados de dropdown:", "error");
        } finally {
          setIsLoadingDropdowns(false);
        }
      };
      fetchDropdownData();
    }
  }, [isOpen, categories.length, accounts.length]);

  function handlerNewCategory(){
    setIsNewCategoruy(true);
  }
  async function handlerNewAccount(){
    setIsNewAccount(true);
  }

  async function ValidCreateAccount(){
    const token = localStorage.getItem("token");
    if(isNewAccount){
      if(valueAccount.length >0){
        if(isNewAccountType >= 0){
          var accountdto = {
            name:valueAccount,
            InitialBalance:0,
            type:isNewAccountType
          };
          try{
            var result = await axios.post(`${api}/account`,
              accountdto,{
              headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
              }
            })
            setAccountId(result.data)
          }catch(err){
            addToast("Erro ao cadastrar conta:", "error");
            setIsSubmitting(false);
            return;
          }
        }else{
          return;
        }
      }
      else{
        addToast("Erro ao cadastrar transição", "error");
        setIsSubmitting(false);
        return
      }

    }
  }
  async function ValidCreateCategory() {
    const token = localStorage.getItem("token");
    if(valorCategoria.length > 0){
      try{

       var result= await axios.post(`${api}/Category`,{categoryName:valorCategoria},{
        headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
        }})
        setCategoryId(result.data)
      }catch(error){
        addToast("Erro ao cadastrar categoria:", "error");
        setIsSubmitting(false);
        return
      }
    }
  }
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    const token = localStorage.getItem("token");
    if (!token) {
      addToast("Erro de autenticação: token não encontrado.","error");
      setIsSubmitting(false);
      return;
    }
    await ValidCreateCategory();
    await ValidCreateAccount();
    const data: TransactionFormData = {
      amount: parseFloat(amount),
      type,
      description,
      date,
      status, // Adicionado
      accountId,
      categoryId,
      isRecurring,
      notes: notes || undefined, // Envia `undefined` se estiver vazio, ou `notes` se preenchido
      recurrenceInterval: isRecurring ? recurrenceInterval : undefined, // **ADICIONADO
    };

    try {
      await axios.post(`${api}/transactions`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      onSuccess();
      addToast("Registro feito com sucesso.","success")
      onClose();
    } catch (error) {
      addToast("Erro ao cadastrar transação:", "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 p-2">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-6 dark:text-white">Nova Transação</h2>

      <div className="flex rounded-lg overflow-hidden border border-gray-300">
        <button
          type="button"
          onClick={() => setType(0)}
          className={`flex-1 flex items-center justify-center gap-2 py-3 transition-all duration-200 ${
            type === 0 ? "bg-green-600 text-white font-semibold" : "bg-gray-100 text-gray-700 hover:bg-green-100 hover:text-green-700"
          }`}
        >
          <TrendingUp className="w-5 h-5" /> Entrada
        </button>
        <button
          type="button"
          onClick={() => setType(1)}
          className={`flex-1 flex items-center justify-center gap-2 py-3 transition-all duration-200 ${
            type === 1 ? "bg-red-600 text-white font-semibold" : "bg-gray-100 text-gray-700 hover:bg-red-100 hover:text-red-700"
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
        <button type="button" onClick={handlerNewCategory} style={{ background: 'none', border: 'none', color: 'blue', cursor: 'pointer' }}>
          Adicionar Categoria
        </button>  

        { isNewCategoruy === false ? (
          <select
          id="categoryId"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700"
          required
          disabled={isLoadingDropdowns} // Desabilita enquanto carrega
        >
            <option value="">{isLoadingDropdowns ? "Carregando Categorias..." : "Selecione a Categoria"}</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.categoryName}</option>
            ))}
        </select>
        ):(
          <input type="text" value={valorCategoria} onChange={e => setValorCategoria(e.target.value)} 
          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700"/>
        )}
      </div>

      <div>
        <label htmlFor="accountId" className="block text-medium font-medium text-gray-700 mb-1 dark:text-white">Conta</label>
          <button type="button" disabled={isNewAccount} onClick={handlerNewAccount} style={{ background: 'none', border: 'none', color: 'blue', cursor: 'pointer' }}>
            Adicionar Conta
          </button>  
        {isNewAccount === false ?(
          <select
            id="accountId"
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700"
            // required
            disabled={isLoadingDropdowns}
          >
            <option value="">{isLoadingDropdowns? "Carregando Contas...":"Selecione a conta"}</option>
            {accounts.map((acc)=>(
              <option key={acc.id} value={acc.id}>{acc.name}</option>
            ))}
          </select>
          ):(
            <div>
              <input type="text" placeholder="Nome da Conta" value={valueAccount} onChange={e => setIsValueAccount(e.target.value)} 
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white"/>
            
              <select
                id="accountType"
                value={isNewAccountType}
                onChange={(e) => setIsNewAccountType(parseInt(e.target.value))}
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white"
                required={valueAccount.length > 0}
                >
                <option value="">Selecione o tipo:</option>
                <option value="0">Banco</option>
                <option value="1">Cartão de crédito</option>
                <option value="2">Dinheiro</option>
                <option value="3">Pix</option>
              </select>
            </div>
            
          )
        }
        
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
          <label htmlFor="recurrenceInterval" className="block text-sm font-medium text-gray-700 mb-1 dark:text-white">Intervalo de Recorrência</label>
          <select
            id="recurrenceInterval"
            value={recurrenceInterval ?? ""} // Usar '' para opção vazia
            onChange={(e) => setRecurrenceInterval(parseInt(e.target.value) || undefined)}
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-whitea dark:bg-gray-700"
            required={isRecurring}
          >
            <option value="">Selecione o Intervalo</option>
            <option value="0">Diário</option>
            <option value="1">Semanal</option>
            <option value="2">Mensal</option>
            <option value="3">Anual</option>
            {/* Adicione outras opções conforme seu enum RecurrenceInterval */}
          </select>
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
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1 dark:text-white">Status</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(parseInt(e.target.value) as 0 | 1)} // Adapte para seus valores de enum
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700"
            required
          >
            <option value="0">Pendente</option>
            <option value="1">Concluída</option>
          </select>
        </div>
      <div className="flex justify-end gap-3 pt-4">
        <DialogClose asChild><Button type="button" variant="outline">Cancelar</Button></DialogClose>
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Salvando..." : "Salvar Transação"}
        </Button>
      </div>
    </form>
  );
}
import { useState, useCallback, useMemo } from 'react';
import { apiService } from '../services/api';
import type { 
  AIAnalysis, 
  AIInsight, 
  AIAnalysisRequest,
} from '../types/AI';
import type { Transaction } from '../types/Transaction';

export function useAI() {
  // const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  // const [isAnalyzing, setIsAnalyzing] = useState(false);
  // const [insights, setInsights] = useState<AIInsight[]>([]);
  // const [chatMessages, setChatMessages] = useState<string>("");
  // const [isChatLoading, setIsChatLoading] = useState(false);
  // const [error, setError] = useState<string | null>(null);
  // const [isAIEnabled, setIsAIEnabled] = useState(true);

  const [analysis] = useState<AIAnalysis | null>(null);
  const [isAnalyzing] = useState(false);
  const [insights] = useState<AIInsight[]>([]);
  const [chatMessages, setChatMessages] = useState<string>("");
  const [isChatLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAIEnabled, setIsAIEnabled] = useState(true);


  // Análise de transações
  const analyzeTransactions = useCallback(async (
    transactions: Transaction[], 
    request?: AIAnalysisRequest
  ) => {
    if(transactions){

    }
    else if(request){

    }
    // if (!isAIEnabled) return;

    // setIsAnalyzing(true);
    // setError(null);

    // try {
    //   // Tentar usar a API de IA primeiro
    //   if (request) {
    //     const aiAnalysis = await aiService.analyzeTransactions(request);
    //     setAnalysis(aiAnalysis);
    //     setInsights(aiAnalysis.insights);
    //     return aiAnalysis;
    //   }
    // } catch (apiError) {
    //   console.warn('API de IA não disponível, usando análise local:', apiError);
      
    //   // Fallback para análise local
    //   const localInsights = aiService.generateBasicInsights(transactions);
    //   setInsights(localInsights);
      
    //   // Criar análise local
    //   const localAnalysis: AIAnalysis = {
    //     id: `local-${Date.now()}`,
    //     userId: 'local',
    //     financialScore: calculateFinancialScore(transactions),
    //     summary: generateLocalSummary(transactions),
    //     insights: localInsights,
    //     recommendations: generateLocalRecommendations(transactions),
    //     generatedAt: new Date().toISOString(),
    //     dateRange: request?.dateRange,
    //   };
      
    //   setAnalysis(localAnalysis);
    //   return localAnalysis;
    // } finally {
    //   setIsAnalyzing(false);
    // }
  }, [isAIEnabled]);

  // Chat com IA
  const sendChatMessage = useCallback(async (message: string) => {
    if (!isAIEnabled || message.length == 0) {
      return;
    }
    const aiAnalysis = await apiService.chatWithAI(message);
    setChatMessages(aiAnalysis.resposta);

  }, [isAIEnabled]);

  // Limpar chat
  const clearChat = useCallback(() => {
    setChatMessages("");
    setError(null);
  }, []);

  // Atualizar insights
  // const refreshInsights = useCallback(async (userId: string) => {
  //   try {
  //     const newInsights = await aiService.getInsights(userId);
  //     setInsights(newInsights);
  //   } catch (error) {
  //     console.warn('Erro ao atualizar insights:', error);
  //   }
  // }, []);

  // Toggle IA
  const toggleAI = useCallback(() => {
    setIsAIEnabled(prev => !prev);
  }, []);

  // Calcular score financeiro local
  // const calculateFinancialScore = (transactions: Transaction[]): number => {
  //   const expenses = transactions.filter(t => t.type === 'expense');
  //   const income = transactions.filter(t => t.type === 'income');
    
  //   const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
  //   const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);
    
  //   if (totalIncome === 0) return 0;
    
  //   const savingsRate = (totalIncome - totalExpenses) / totalIncome;
  //   const score = Math.max(0, Math.min(100, savingsRate * 100));
    
  //   return Math.round(score);
  // };

  // // Gerar resumo local
  // const generateLocalSummary = (transactions: Transaction[]): string => {
  //   const expenses = transactions.filter(t => t.type === 'expense');
  //   const income = transactions.filter(t => t.type === 'income');
    
  //   const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
  //   const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);
  //   const balance = totalIncome - totalExpenses;
    
  //   if (balance > 0) {
  //     return `Excelente! Você está com saldo positivo de R$ ${balance.toFixed(2)}. Continue assim!`;
  //   } else if (balance === 0) {
  //     return 'Seus gastos estão equilibrados com suas receitas. Bom controle financeiro!';
  //   } else {
  //     return `Atenção: Seus gastos estão R$ ${Math.abs(balance).toFixed(2)} acima das receitas.`;
  //   }
  // };

  // // Gerar recomendações locais
  // const generateLocalRecommendations = (transactions: Transaction[]): string[] => {
  //   const recommendations: string[] = [];
    
  //   const expenses = transactions.filter(t => t.type === 'expense');
  //   const income = transactions.filter(t => t.type === 'income');
    
  //   if (expenses.length > income.length * 2) {
  //     recommendations.push('Considere reduzir o número de transações de gastos');
  //   }
    
  //   const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
  //   const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);
    
  //   if (totalExpenses > totalIncome * 0.8) {
  //     recommendations.push('Tente manter seus gastos abaixo de 80% da sua renda');
  //   }
    
  //   if (recommendations.length === 0) {
  //     recommendations.push('Continue monitorando suas finanças regularmente');
  //   }
    
  //   return recommendations;
  // };

  // Valores computados
  const hasInsights = useMemo(() => insights.length > 0, [insights]);
  const hasAnalysis = useMemo(() => analysis !== null, [analysis]);
  const hasChatHistory = useMemo(() => chatMessages.length > 0, [chatMessages]);

  return {
    // Estado
    analysis,
    isAnalyzing,
    insights,
    chatMessages,
    isChatLoading,
    error,
    isAIEnabled,
    
    // Ações
    analyzeTransactions,
    sendChatMessage,
    clearChat,
    // refreshInsights,
    toggleAI,
    
    // Computados
    hasInsights,
    hasAnalysis,
    hasChatHistory,
  };
}

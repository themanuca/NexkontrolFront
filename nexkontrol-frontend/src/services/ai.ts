// import type { 
//   AIAnalysisRequest, 
//   AIAnalysis, 
//   AIChatRequest, 
//   AIChatResponse,
//   AIInsight 
// } from '../types/AI';
// import type { Transaction } from '../types/Transaction';

class AIService {
  private apiBaseUrl: string;

  constructor() {
    this.apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = localStorage.getItem('token');
    debugger
    const response = await fetch(`${this.apiBaseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Erro na requisição' }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async analyzeTransactions(request: string): Promise<string> {
    return this.makeRequest<string>('api/Analyze/ask-ia', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async chatWithAI(request: string): Promise<any> {
    return this.makeRequest<string>('/api/Analyze/ask-ia', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  // async getInsights(userId: string, limit: number = 10): Promise<AIInsight[]> {
  //   return this.makeRequest<AIInsight[]>(`/api/ai/insights?limit=${limit}`);
  // }

  // async getAnalysisHistory(userId: string): Promise<AIAnalysis[]> {
  //   return this.makeRequest<AIAnalysis[]>(`/api/ai/analysis-history`);
  // }

  // // Métodos auxiliares para preparar dados
  // prepareTransactionData(transactions: Transaction[]): any[] {
  //   return transactions.map(t => ({
  //     id: t.id,
  //     description: t.description,
  //     amount: t.amount,
  //     type: t.type,
  //     category: t.categoryName,
  //     date: t.date,
  //     account: t.accountName,
  //   }));
  // }

  // // Análise local básica (fallback quando API não disponível)
  // generateBasicInsights(transactions: Transaction[]): AIInsight[] {
  //   const insights: AIInsight[] = [];
    
  //   // Análise de gastos por categoria
  //   const spendingByCategory = transactions
  //     .filter(t => t.type === 'expense')
  //     .reduce((acc, t) => {
  //       acc[t.categoryName || 'Sem categoria'] = (acc[t.categoryName || 'Sem categoria'] || 0) + t.amount;
  //       return acc;
  //     }, {} as Record<string, number>);

  //   const topSpendingCategory = Object.entries(spendingByCategory)
  //     .sort(([,a], [,b]) => b - a)[0];

  //   if (topSpendingCategory) {
  //     insights.push({
  //       id: `insight-${Date.now()}-1`,
  //       type: 'spending',
  //       title: 'Categoria com Maior Gasto',
  //       description: `Sua maior categoria de gastos é "${topSpendingCategory[0]}" com R$ ${topSpendingCategory[1].toFixed(2)}`,
  //       severity: 'medium',
  //       category: topSpendingCategory[0],
  //       amount: topSpendingCategory[1],
  //       date: new Date().toISOString(),
  //       actionable: true,
  //       actionText: 'Revisar gastos nesta categoria',
  //     });
  //   }

  //   // Análise de tendência de gastos
  //   const recentTransactions = transactions
  //     .filter(t => t.type === 'expense')
  //     .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  //     .slice(0, 7);

  //   if (recentTransactions.length >= 7) {
  //     const avgAmount = recentTransactions.reduce((sum, t) => sum + t.amount, 0) / recentTransactions.length;
  //     insights.push({
  //       id: `insight-${Date.now()}-2`,
  //       type: 'trend',
  //       title: 'Média de Gastos Diários',
  //       description: `Sua média de gastos nos últimos 7 dias é R$ ${avgAmount.toFixed(2)}`,
  //       severity: 'low',
  //       amount: avgAmount,
  //       date: new Date().toISOString(),
  //       actionable: false,
  //     });
  //   }

  //   return insights;
  // }
}

export const aiService = new AIService();

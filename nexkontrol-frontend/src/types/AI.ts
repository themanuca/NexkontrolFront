export interface DateRange {
  startDate?: string;
  endDate?: string;
}

export interface AIAnalysisRequest {
  dateRange?: DateRange;
  categories?: string[];
  analysisType?: 'full' | 'spending' | 'income' | 'trends';
}

export interface AIInsight {
  id: string;
  type: 'spending' | 'income' | 'trend' | 'recommendation' | 'alert';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  category?: string;
  amount?: number;
  date: string;
  actionable: boolean;
  actionText?: string;
}

export interface AIAnalysis {
  id: string;
  userId: string;
  financialScore: number;
  summary: string;
  insights: AIInsight[];
  recommendations: string[];
  generatedAt: string;
  dateRange?: DateRange;
}

export interface AIChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  metadata?: {
    transactionId?: string;
    category?: string;
    amount?: number;
  };
}

export interface AIChatRequest {
  message: string;
  context?: {
    recentTransactions?: any[];
    currentBalance?: number;
    goals?: any[];
  };
}

export interface AIChatResponse {
  message: string;
  suggestions?: string[];
  relatedInsights?: AIInsight[];
}

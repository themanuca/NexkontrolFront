import React, { useState } from 'react';
import { TrendingUp, TrendingDown, AlertTriangle, Lightbulb, Target, BarChart3 } from 'lucide-react';
import { Card } from '../ui/card';
import { CardContent } from '../ui/cardContent';
import type { AIInsight } from '../../types/AI';
import { useAI } from '../../hooks/useAI';

interface AIInsightsProps {
  insights: AIInsight[];
  isAnalyzing?: boolean;
  onRefresh?: () => void;
}

  // const { 
  //   totals, 
  //   filteredTransactions, 
  // } = useTransactions();

  // // Hook de IA
  // const {
  //   sendChatMessage,
  // } = useAI();

const getInsightIcon = (type: AIInsight['type']) => {
  switch (type) {
    case 'spending': return <TrendingDown className="w-5 h-5 text-red-500" />;
    case 'income': return <TrendingUp className="w-5 h-5 text-green-500" />;
    case 'trend': return <BarChart3 className="w-5 h-5 text-blue-500" />;
    case 'recommendation': return <Lightbulb className="w-5 h-5 text-yellow-500" />;
    case 'alert': return <AlertTriangle className="w-5 h-5 text-orange-500" />;
    default: return <Target className="w-5 h-5 text-gray-500" />;
  }
};

const getSeverityColor = (severity: AIInsight['severity']) => {
  switch (severity) {
    case 'high': return 'border-l-4 border-l-red-500 bg-red-50 dark:bg-red-900/20';
    case 'medium': return 'border-l-4 border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
    case 'low': return 'border-l-4 border-l-green-500 bg-green-50 dark:bg-green-900/20';
    default: return 'border-l-4 border-l-gray-500 bg-gray-50 dark:bg-gray-900/20';
  }
};


export default function AIInsights({ insights, isAnalyzing = false, onRefresh }: AIInsightsProps) {

  // const { 
  // totals, 
  // filteredTransactions, 
  // } = useTransactions();

  // Hook de IA
  const {
  sendChatMessage,
  } = useAI();



  const [inputValue, setInputValue] = useState('');
  const [disable, setDisable] = useState(true);

  const handleChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setInputValue(event.target.value);
    setDisable(false);
  };
  const handlerSendMessageIA = async ()=>{
    if(inputValue.length > 0){
      handleChatMessage(inputValue)
    }
    }
  const handleChatMessage = async (message: string) => {
    await sendChatMessage(message);
  };


  if (isAnalyzing) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-400">Analisando suas finanças...</span>
        </div>
      </Card>
    );
  }

  if (insights.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Nenhum insight disponível
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Execute uma análise para receber insights personalizados sobre suas finanças.
          </p>
            <div>
              <input
                type="text"
                placeholder="Digite sua pergunta..."
                className="flex-1 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-500 text-sm"
                onChange={handleChange}
                value={inputValue}
              />
              <button onClick={handlerSendMessageIA} disabled={disable} className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <BarChart3 className="w-4 h-4 mr-2" />
                Analisar Transações
              </button>
            </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Insights de IA</h3>
        {onRefresh && (
          <button onClick={onRefresh} className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
            Atualizar
          </button>
        )}
      </div>

      <div className="grid gap-4">
        {insights.map((insight) => (
          <Card key={insight.id} className={`${getSeverityColor(insight.severity)}`}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">{getInsightIcon(insight.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">{insight.title}</h4>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(insight.date).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{insight.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm">
                      {insight.category && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          {insight.category}
                        </span>
                      )}
                      {insight.amount && (
                        <span className="font-medium text-gray-900 dark:text-gray-100">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(insight.amount)}
                        </span>
                      )}
                    </div>
                    {insight.actionable && insight.actionText && (
                      <button className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors">
                        {insight.actionText}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Loader2, Trash  } from 'lucide-react';
import { Card } from '../ui/card';
import type { AIChatMessage } from '../../types/AI';

interface AIChatbotProps {
  messages: string;
  isChatLoading: boolean;
  onSendMessage: (message: string) => void;
  onClearChat: () => void;
}

export default function AIChatbot({ messages, isChatLoading, onSendMessage, onClearChat }: AIChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() && !isChatLoading) {
      onSendMessage(inputMessage.trim());
      setInputMessage('');
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!isOpen) {
    return (
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 ease-in-out flex items-center justify-center z-50"
        aria-label="Abrir chat de IA"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 h-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 rounded-t-lg">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-blue-600" />
          <h3 className="font-medium text-gray-900 dark:text-gray-100">Assistente IA</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onClearChat}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            title="Limpar chat"
          >
            <Trash className="w-4 h-4" />
          </button>
          <button
            onClick={toggleChat}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            title="Fechar chat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            <Bot className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
            <p className="text-sm">Olá! Como posso ajudar com suas finanças hoje?</p>
          </div>
        ) : (
          <div>
            <p className="whitespace-pre-wrap">{messages}</p>
              <span className="text-xs mt-1 block 'text-gray-500 dark:text-gray-400' ">
            </span>

          </div>
          
          // messages.map((message) => (
          //   <div
          //     key={message.id}
          //     className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          //   >
          //     {message.role === 'assistant' && (
          //       <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
          //         <Bot className="w-3 h-3 text-blue-600 dark:text-blue-400" />
          //       </div>
          //     )}
              
          //     <div
          //       className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
          //         message.role === 'user'
          //           ? 'bg-blue-600 text-white'
          //           : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
          //       }`}
          //     >
          //       <p className="whitespace-pre-wrap">{message.content}</p>
          //       <span className={`text-xs mt-1 block ${
          //         message.role === 'user' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
          //       }`}>
          //         {formatTime(message.timestamp)}
          //       </span>
          //     </div>

          //     {message.role === 'user' && (
          //       <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
          //         <User className="w-3 h-3 text-gray-600 dark:text-gray-400" />
          //       </div>
          //     )}
          //   </div>
          // ))
        )}
        
        {isChatLoading && (
          <div className="flex gap-2 justify-start">
            <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
              <Bot className="w-3 h-3 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg">
              <Loader2 className="w-4 h-4 animate-spin text-gray-500 dark:text-gray-400" />
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
            disabled={isChatLoading}
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isChatLoading}
            className="px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}

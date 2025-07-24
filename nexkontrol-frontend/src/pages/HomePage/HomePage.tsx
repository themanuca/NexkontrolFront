// src/pages/HomePage.tsx
// Este componente representa a página inicial pública do NexKontrol.
// Ele serve como uma landing page para usuários não autenticados, convidando-os ao login.

import React from 'react';
import { Link } from 'react-router-dom'; // Para navegar para a página de login
import { Button } from '../../components/ui/button'; // Reutiliza seu componente de botão
import { LogIn } from 'lucide-react'; // Ícone para o botão de login

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-950 flex flex-col items-center justify-center p-6 font-sans">
      <div className="max-w-2xl text-center bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 md:p-12 transform hover:scale-105 transition-transform duration-300 ease-in-out">
        {/* Título principal da página inicial */}
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-gray-50 mb-6 leading-tight">
          Bem-vindo ao <span className="text-blue-600 dark:text-blue-400">NexKontrol</span>
        </h1>

        {/* Descrição breve do projeto */}
        <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8">
          Seu sistema intuitivo para organizar finanças, hábitos e conteúdos pessoais. Controle sua vida, otimize seu futuro.
        </p>

        {/* Botão de Login */}
        <Link to="/login"> {/* Link para a rota de login */}
          <Button className="flex items-center gap-3 px-8 py-4 text-lg rounded-full shadow-lg transition-all duration-300 ease-in-out bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white transform hover:scale-105">
            <LogIn className="w-6 h-6" />
            Acessar Minha Conta
          </Button>
        </Link>
      </div>

      {/* Rodapé ou informações adicionais (opcional) */}
      <footer className="mt-12 text-gray-600 dark:text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} NexKontrol. Todos os direitos reservados.
      </footer>
    </div>
  );
}

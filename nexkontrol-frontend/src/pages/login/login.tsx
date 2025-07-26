// src/pages/Login.tsx
// Componente da página de Login com suporte a tema claro/escuro.

import { useState } from "react";
import { login } from "../../api/auth"; // Importa a função de login (verifique o caminho)
import { Link, useNavigate } from "react-router-dom"; // Importa Link e useNavigate do React Router
import { useToast } from "../../Context/ToastContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error] = useState(""); // Estado para exibir mensagens de erro
  const navigate = useNavigate(); // Hook para navegação programática
  const { addToast } = useToast(); // <--- Use o hook useToast

  // Função para lidar com o envio do formulário de login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Previne o comportamento padrão de recarregar a página

    try {
      const res = await login(email, password); // Chama a API de login
      localStorage.setItem("token", res.token); // Armazena o token JWT no localStorage

      addToast("Login relizado com sucesso.","success");
      navigate("/dashboard"); // Redireciona para o dashboard após o login bem-sucedido
    } catch (err:any) {
      var res:string = err.response.data.error
      addToast(res,"error"); // Define a mensagem de erro em caso de falha
    }
  };

  return (
    // Contêiner principal da página de login, com fundo responsivo ao tema
    <div className="min-h-screen flex items-center justify-center bg-gray-300 dark:bg-gray-900">
      {/* Formulário de login */}
      <form
        onSubmit={handleSubmit}
        // Estilos do formulário: fundo, padding, bordas arredondadas, sombra e largura
        className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg w-80" // Ajustado para rounded-xl e shadow-lg
      >
        {/* Título do formulário */}
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">Login</h2> {/* Cor do texto ajustada */}

        {/* Exibe mensagem de erro se houver */}
        {error && <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>}

        {/* Campo de Email */}
        <input
          type="email"
          placeholder="Email"
          // Estilos do input: largura total, margem inferior, padding, borda, arredondado
          // Cores do texto e placeholder ajustadas para dark mode
          className="w-full mb-4 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Campo de Senha */}
        <input
          type="password"
          placeholder="Senha"
          // Estilos do input: largura total, margem inferior, padding, borda, arredondado
          // Cores do texto e placeholder ajustadas para dark mode
          className="w-full mb-4 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* Botão de Entrar */}
        <button
          type="submit"
          // Estilos do botão: largura total, fundo azul, texto branco, padding, arredondado
          // Efeito hover
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          Entrar
        </button>

        {/* Link para Fazer Cadastro */}
        <p className="text-sm text-center mt-4 text-gray-600 dark:text-gray-300"> {/* Cor do texto ajustada */}
          Ainda não tem conta?{" "}
          <Link to="/register" className="text-blue-600 dark:text-blue-400 hover:underline"> {/* Cor do link ajustada */}
            Fazer Cadastro
          </Link>
        </p>
      </form>
    </div>
  );
}

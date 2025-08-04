import { useState } from "react";
import { register } from "../../api/auth";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "../../Context/ToastContext";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    addToast("Carregando...", "info");
    try {
      const res = await register(name, email, password);
      localStorage.setItem("token", res.token);
      navigate("/dashboard");
    } catch (err) {
      addToast("Erro ao registrar. Tente novamente.","error");
    }finally{
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-300 dark:bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl shadow-md w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-6 text-center dark:text-gray-100">Cadastro</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <input
          type="text"
          placeholder="Nome"
          className="w-full mb-4 px-4 py-2 border rounded dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 px-4 py-2 border rounded dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Senha"
          className="w-full mb-4 px-4 py-2 border rounded dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors duration-200"
          disabled={isLoading}
        >
          Cadastrar
        </button>

        <p className="text-sm text-center mt-4 text-gray-600 dark:text-gray-300">
          Já tem conta?{" "}
          <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:underline">
            Fazer login
          </Link>
        </p>
      </form>
    </div>
  );
}

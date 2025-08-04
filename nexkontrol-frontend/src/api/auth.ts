import axios from "axios";

const API = import.meta.env.VITE_API_BASE_URL;

export async function register(name: string, email: string, password: string) {
  const response = await axios.post(`${API}/api/auth/register`, {
    name,
    email,
    password,
  });

  return response.data; // Deve conter o token, email, nome
}



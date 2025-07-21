import axios from "axios";

const API = "http://localhost:5000/api"; // Altere conforme necessário

export async function login(email: string, password: string) {
  const response = await axios.post(`${API}/auth/login`, {
    email,
    password,
  });

  return response.data; // Deve conter o token, email, nome
}

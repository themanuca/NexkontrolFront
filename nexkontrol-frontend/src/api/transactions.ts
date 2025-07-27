import axios from "axios";

const API = import.meta.env.VITE_API_BASE_URL; // ajuste se necessário

export async function getTransactions() {
  const token = localStorage.getItem("token");

  const response = await axios.get(`${API}/transactions`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data; // lista de transações
}

export async function createTransaction(data: any) {
  const token = localStorage.getItem("token");

  const response = await axios.post(`${API}/transactions`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

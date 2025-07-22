import axios from "axios";

const API = "http://localhost:5091/api"; // ajuste se necessário

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

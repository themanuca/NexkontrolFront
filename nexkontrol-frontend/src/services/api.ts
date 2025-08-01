import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { Transaction, TransactionFormData, Category } from '../types/Transaction';
import { Account } from '../types/Account';

// Interface para resposta de autenticação
export interface AuthResponse {
  token: string;
  name: string;
  email: string;
}

// Interface para dados de login
export interface LoginData {
  email: string;
  password: string;
}

// Interface para dados de registro
export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor para adicionar token automaticamente
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Interceptor para tratar erros de autenticação
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Só redirecionar se não estiver já na página de login
          if (window.location.pathname !== '/login') {
            localStorage.removeItem('token');
            localStorage.removeItem('userName');
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Métodos de autenticação
  async login(data: LoginData): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.api.post('/auth/login', data);
    return response.data;
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response: AxiosResponse<AuthResponse> = await this.api.post('/auth/register', data);
    return response.data;
  }

  // Métodos de transações
  async getTransactions(): Promise<Transaction[]> {
    const response: AxiosResponse<Transaction[]> = await this.api.get('/transactions');
    return response.data;
  }

  async createTransaction(data: TransactionFormData): Promise<Transaction> {
    const response: AxiosResponse<Transaction> = await this.api.post('/transactions', data);
    return response.data;
  }

  async updateTransaction(id: string, data: TransactionFormData): Promise<Transaction> {
    const response: AxiosResponse<Transaction> = await this.api.put(`/transactions/${id}`, data);
    return response.data;
  }

  async deleteTransaction(id: string): Promise<void> {
    await this.api.delete(`/transactions/${id}`);
  }

  // Métodos de categorias
  async getCategories(): Promise<Category[]> {
    const response: AxiosResponse<Category[]> = await this.api.get('/Category');
    return response.data;
  }

  async createCategory(categoryName: string): Promise<string> {
    const response: AxiosResponse<string> = await this.api.post('/Category', { categoryName });
    return response.data;
  }

  // Métodos de contas
  async getAccounts(): Promise<Account[]> {
    const response: AxiosResponse<Account[]> = await this.api.get('/account');
    return response.data;
  }

  async createAccount(data: { name: string; InitialBalance: number; type: number }): Promise<string> {
    const response: AxiosResponse<string> = await this.api.post('/account', data);
    return response.data;
  }

  // Método para validar token
  async validateToken(): Promise<boolean> {
    try {
      // Usar o endpoint de transações como validação, já que requer autenticação
      await this.api.get('/transactions');
      return true;
    } catch {
      return false;
    }
  }
}

export const apiService = new ApiService(); 
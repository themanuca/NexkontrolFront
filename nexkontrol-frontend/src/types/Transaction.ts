export interface Transaction {
  id: string;
  date: string;
  description: string;
  categoryName: string;
  type: TransactionType;
  amount: number;
  status: TransactionStatus;
  isRecurring: boolean;
  notes: string;
}

export enum TransactionType {
  INCOME = 0,  // Entrada
  EXPENSE = 1  // Saída
}

export enum TransactionStatus {
  PENDING = 0,
  COMPLETED = 1
}

export interface TransactionFormData {
  amount: number;
  date: string;
  description: string;
  notes?: string;
  type: TransactionType;
  status: TransactionStatus;
  accountId: string;
  categoryId: string;
  isRecurring: boolean;
  recurrenceInterval?: RecurrenceInterval;
}

export enum RecurrenceInterval {
  DAILY = 0,
  WEEKLY = 1,
  MONTHLY = 2,
  YEARLY = 3
}

export interface Category {
  id: string;
  userId: string;
  categoryName: string;
  totalSpent: number;
} 
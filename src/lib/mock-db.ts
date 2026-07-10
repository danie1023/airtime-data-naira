import { User, ConversionRequest, Transaction, WithdrawalRequest, SystemSettings, UserRole } from '../types';

const STORAGE_KEYS = {
  USERS: 'kctelecom_users',
  REQUESTS: 'kctelecom_requests',
  TRANSACTIONS: 'kctelecom_transactions',
  WITHDRAWALS: 'kctelecom_withdrawals',
  SETTINGS: 'kctelecom_settings',
  CURRENT_USER: 'kctelecom_current_user',
};

const defaultSettings: SystemSettings = {
  airtimeRate: 0.8,
  dataRate: 0.7,
};

const getFromStorage = <T>(key: string, defaultValue: T): T => {
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : defaultValue;
};

const saveToStorage = <T>(key: string, value: T) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const db = {
  // Auth
  getCurrentUser: (): User | null => getFromStorage<User | null>(STORAGE_KEYS.CURRENT_USER, null),
  setCurrentUser: (user: User | null) => saveToStorage(STORAGE_KEYS.CURRENT_USER, user),
  
  getUsers: (): User[] => getFromStorage<User[]>(STORAGE_KEYS.USERS, [
    {
      id: 'admin-1',
      name: 'Admin User',
      email: 'admin@kctelecom.com',
      password: 'adminpassword',
      role: 'admin',
      walletBalance: 0,
      commissionBalance: 0,
      createdAt: new Date().toISOString(),
    }
  ]),
  saveUsers: (users: User[]) => saveToStorage(STORAGE_KEYS.USERS, users),

  // Requests
  getRequests: (): ConversionRequest[] => getFromStorage<ConversionRequest[]>(STORAGE_KEYS.REQUESTS, []),
  saveRequests: (requests: ConversionRequest[]) => saveToStorage(STORAGE_KEYS.REQUESTS, requests),

  // Transactions
  getTransactions: (): Transaction[] => getFromStorage<Transaction[]>(STORAGE_KEYS.TRANSACTIONS, []),
  saveTransactions: (transactions: Transaction[]) => saveToStorage(STORAGE_KEYS.TRANSACTIONS, transactions),

  // Withdrawals
  getWithdrawals: (): WithdrawalRequest[] => getFromStorage<WithdrawalRequest[]>(STORAGE_KEYS.WITHDRAWALS, []),
  saveWithdrawals: (withdrawals: WithdrawalRequest[]) => saveToStorage(STORAGE_KEYS.WITHDRAWALS, withdrawals),

  // Settings
  getSettings: (): SystemSettings => getFromStorage<SystemSettings>(STORAGE_KEYS.SETTINGS, defaultSettings),
  saveSettings: (settings: SystemSettings) => saveToStorage(STORAGE_KEYS.SETTINGS, settings),
};

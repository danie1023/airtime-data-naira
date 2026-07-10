export type UserRole = 'user' | 'vendor' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  walletBalance: number;
  commissionBalance: number;
  createdAt: string;
}

export type RequestStatus = 'pending' | 'approved' | 'completed' | 'rejected';

export interface ConversionRequest {
  id: string;
  userId: string;
  user_id?: string;
  userName: string;
  type: 'airtime' | 'data';
  network: string;
  amount: number;
  phone: string;
  value: number;
  status: RequestStatus;
  createdAt: string;
  created_at?: string;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'deposit' | 'withdrawal' | 'conversion' | 'purchase' | 'commission';
  amount: number;
  status: 'pending' | 'success' | 'failed';
  description: string;
  createdAt: string;
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  bankDetails: string;
  status: RequestStatus;
  createdAt: string;
}

export interface SystemSettings {
  airtimeRate: number; // e.g. 0.8 for 80%
  dataRate: number; // e.g. 0.7 for 70%
}

export interface RechargePin {
  id: string;
  network: string;
  denomination: number;
  pin: string;
  serial: string;
  isUsed: boolean;
}

export interface Order {
  id: string;
  userId: string;
  type: 'recharge-pin';
  items: RechargePin[];
  totalAmount: number;
  createdAt: string;
}

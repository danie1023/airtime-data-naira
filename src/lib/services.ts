import { User, ConversionRequest, Transaction, WithdrawalRequest, SystemSettings } from '../types';
import { db } from './mock-db';
import { supabase } from '../integrations/supabase/client';
import { toast } from 'sonner';

// Helper to map DB profile row to User type
const mapProfileToUser = (profile: any): User => ({
  id: profile.id,
  name: profile.full_name || '',
  email: profile.email,
  role: profile.role as User['role'],
  walletBalance: Number(profile.wallet_balance) || 0,
  commissionBalance: Number(profile.commission_balance) || 0,
  createdAt: profile.created_at,
});

export const authService = {
  login: async (email: string, password: string): Promise<User | null> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .eq('password_hash', password)
      .single();

    if (error || !data) {
      return null;
    }

    const user = mapProfileToUser(data);
    db.setCurrentUser(user);
    return user;
  },

  register: async (name: string, email: string, password: string, role: 'user' | 'vendor' = 'user'): Promise<User | null> => {
    // Check if user already exists
    const { data: existing } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single();

    if (existing) return null;

    const { data, error } = await supabase
      .from('profiles')
      .insert([{
        email,
        full_name: name,
        password_hash: password,
        role,
        wallet_balance: 0,
        commission_balance: 0,
      }])
      .select()
      .single();

    if (error) {
      toast.error(error.message);
      return null;
    }

    const user = mapProfileToUser(data);
    db.setCurrentUser(user);
    return user;
  },

  logout: () => {
    db.setCurrentUser(null);
  }
};

export const walletService = {
  getBalance: async (userId: string): Promise<number> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('wallet_balance')
      .eq('id', userId)
      .single();

    if (error) return 0;
    return Number(data.wallet_balance) || 0;
  },

  addFunds: async (userId: string, amount: number, description: string) => {
    // Update wallet balance via direct select + update
    const { data: profile } = await supabase
      .from('profiles')
      .select('wallet_balance')
      .eq('id', userId)
      .single();

    if (profile) {
      const newBalance = Number(profile.wallet_balance) + amount;
      await supabase
        .from('profiles')
        .update({ wallet_balance: newBalance })
        .eq('id', userId);
    }

    // Record transaction
    await supabase
      .from('transactions')
      .insert([{
        user_id: userId,
        type: 'deposit',
        amount,
        status: 'success',
        description,
      }]);

    // Update local current user
    const currentUser = db.getCurrentUser();
    if (currentUser?.id === userId) {
      db.setCurrentUser({ ...currentUser, walletBalance: currentUser.walletBalance + amount });
    }
  },

  requestWithdrawal: async (userId: string, amount: number, bankDetails: string) => {
    const currentUser = db.getCurrentUser();
    if (!currentUser || currentUser.walletBalance < amount) return false;

    // Record withdrawal transaction
    await supabase
      .from('transactions')
      .insert([{
        user_id: userId,
        type: 'withdrawal',
        amount,
        status: 'pending',
        description: bankDetails,
      }]);

    // Deduct from wallet
    const newBalance = currentUser.walletBalance - amount;
    await supabase
      .from('profiles')
      .update({ wallet_balance: newBalance })
      .eq('id', userId);

    db.setCurrentUser({ ...currentUser, walletBalance: newBalance });

    return true;
  }
};

export const conversionService = {
  getAirtimeConversionRequests: async (userId: string): Promise<ConversionRequest[]> => {
    const { data, error } = await supabase
      .from('airtime_cash_requests')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      toast.error(error.message);
      return [];
    }

    return (data || []).map((d: any) => ({
      id: d.id,
      userId: d.user_id,
      userName: '',
      type: 'airtime' as const,
      network: d.network,
      amount: Number(d.airtime_amount),
      phone: d.phone_number,
      value: Number(d.expected_cash_amount),
      status: d.status.toLowerCase() as ConversionRequest['status'],
      createdAt: d.created_at,
    }));
  },

  getAllAirtimeRequests: async (): Promise<ConversionRequest[]> => {
    const { data, error } = await supabase
      .from('airtime_cash_requests')
      .select('*, profiles(full_name, email)')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error(error.message);
      return [];
    }

    return (data || []).map((d: any) => ({
      id: d.id,
      userId: d.user_id,
      userName: d.profiles?.full_name || '',
      type: 'airtime' as const,
      network: d.network,
      amount: Number(d.airtime_amount),
      phone: d.phone_number,
      value: Number(d.expected_cash_amount),
      status: d.status.toLowerCase() as ConversionRequest['status'],
      createdAt: d.created_at,
    }));
  },

  submitAirtimeToCashRequest: async (userId: string, network: string, amount: number, phone: string) => {
    // Get rate from DB
    const { data: settings } = await supabase
      .from('system_settings')
      .select('airtime_rate')
      .single();

    const rate = settings ? Number(settings.airtime_rate) : 0.8;
    const value = amount * rate;

    const { data, error } = await supabase
      .from('airtime_cash_requests')
      .insert([{
        user_id: userId,
        network: network,
        phone_number: phone,
        airtime_amount: amount,
        expected_cash_amount: value,
        status: 'Pending',
      }])
      .select();

    if (error) {
      toast.error(error.message);
      return null;
    }

    toast.success('Airtime-to-Cash request submitted successfully!');
    return data[0];
  },

  submitRequest: async (userId: string, type: 'airtime' | 'data', network: string, amount: number, phone: string) => {
    if (type === 'airtime') {
      return conversionService.submitAirtimeToCashRequest(userId, network, amount, phone);
    }
    // For data type, similar logic with data_rate
    const { data: settings } = await supabase
      .from('system_settings')
      .select('data_rate')
      .single();

    const rate = settings ? Number(settings.data_rate) : 0.7;
    const value = amount * rate;

    const { data, error } = await supabase
      .from('airtime_cash_requests')
      .insert([{
        user_id: userId,
        network: network,
        phone_number: phone,
        airtime_amount: amount,
        expected_cash_amount: value,
        status: 'Pending',
      }])
      .select();

    if (error) {
      toast.error(error.message);
      return null;
    }

    toast.success('Request submitted successfully!');
    return data[0];
  },

  approveRequest: async (requestId: string): Promise<boolean> => {
    const { data, error } = await supabase
      .from('airtime_cash_requests')
      .select('*')
      .eq('id', requestId)
      .single();

    if (error || !data) {
      toast.error(error?.message || 'Request not found');
      return false;
    }

    if (data.status !== 'Pending') {
      toast.info('This request has already been processed.');
      return false;
    }

    // Update status to Completed
    const { error: updateError } = await supabase
      .from('airtime_cash_requests')
      .update({ status: 'Completed' })
      .eq('id', requestId);

    if (updateError) {
      toast.error(updateError.message);
      return false;
    }

    // Add funds to user's wallet
    const userId = data.user_id;
    const cashAmount = Number(data.expected_cash_amount);

    await walletService.addFunds(userId, cashAmount, `Airtime conversion approved (${data.network})`);

    // Check if user is a vendor and add commission
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, commission_balance')
      .eq('id', userId)
      .single();

    if (profile?.role === 'vendor') {
      const commission = cashAmount * 0.02;
      const newCommissionBalance = Number(profile.commission_balance) + commission;

      await supabase
        .from('profiles')
        .update({ commission_balance: newCommissionBalance })
        .eq('id', userId);

      await supabase
        .from('transactions')
        .insert([{
          user_id: userId,
          type: 'commission',
          amount: commission,
          status: 'success',
          description: 'Commission for airtime conversion',
        }]);
    }

    toast.success('Request approved and funds added!');
    return true;
  },

  rejectRequest: async (requestId: string): Promise<boolean> => {
    const { error: updateError } = await supabase
      .from('airtime_cash_requests')
      .update({ status: 'Rejected' })
      .eq('id', requestId);

    if (updateError) {
      toast.error(updateError.message);
      return false;
    }

    toast.success('Request rejected.');
    return true;
  },

  getSettings: async (): Promise<SystemSettings> => {
    const { data, error } = await supabase
      .from('system_settings')
      .select('*')
      .single();

    if (error) {
      return { airtimeRate: 0.8, dataRate: 0.7 };
    }

    return {
      airtimeRate: Number(data.airtime_rate),
      dataRate: Number(data.data_rate),
    };
  },

  getUserTransactions: async (userId: string): Promise<Transaction[]> => {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      return [];
    }

    return (data || []).map((t: any) => ({
      id: t.id,
      userId: t.user_id,
      type: t.type as Transaction['type'],
      amount: Number(t.amount),
      status: t.status as Transaction['status'],
      description: t.description,
      createdAt: t.created_at,
    }));
  },
};

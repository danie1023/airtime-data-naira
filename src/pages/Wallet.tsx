import React, { useEffect, useState } from 'react';
import { User, Transaction, WithdrawalRequest } from '../types';
import { db } from '../lib/mock-db';
import { walletService } from '../lib/services';
import { 
  Wallet as WalletIcon, 
  ArrowUpRight, 
  ArrowDownLeft, 
  History, 
  Building, 
  CreditCard,
  CheckCircle2,
  Clock,
  XCircle
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';

interface WalletProps {
  user: User | null;
}

const Wallet: React.FC<WalletProps> = ({ user }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [bankDetails, setBankDetails] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setTransactions(db.getTransactions().filter(tx => tx.userId === user.id).reverse());
      setWithdrawals(db.getWithdrawals().filter(w => w.userId === user.id).reverse());
    }
  }, [user]);

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount < 1000) {
      toast.error('Minimum withdrawal is ₦1,000');
      return;
    }
    
    if (amount > user.walletBalance) {
      toast.error('Insufficient balance');
      return;
    }
    
    setLoading(true);
    setTimeout(() => {
      const success = walletService.requestWithdrawal(user.id, amount, bankDetails);
      if (success) {
        toast.success('Withdrawal request submitted!');
        setWithdrawAmount('');
        setBankDetails('');
        setWithdrawals(db.getWithdrawals().filter(w => w.userId === user.id).reverse());
      } else {
        toast.error('Failed to process withdrawal.');
      }
      setLoading(false);
    }, 1500);
  };

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount < 100) {
      toast.error('Minimum deposit is ₦100');
      return;
    }
    
    setLoading(true);
    toast.info('Redirecting to Paystack...');
    
    setTimeout(() => {
      walletService.addFunds(user.id, amount, 'Wallet Funding (Paystack)');
      toast.success(`Successfully funded wallet with ₦${amount}`);
      setDepositAmount('');
      setTransactions(db.getTransactions().filter(tx => tx.userId === user.id).reverse());
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">My Wallet</h1>
        <p className="text-zinc-500">Manage your funds and withdrawals.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Balance Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-gradient-to-br from-green-600 to-green-900 p-8 rounded-3xl shadow-xl border border-green-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <WalletIcon size={120} />
            </div>
            <p className="text-green-100/70 font-medium mb-1">Available Balance</p>
            <h2 className="text-4xl font-extrabold text-white">₦{user?.walletBalance.toLocaleString()}</h2>
            <div className="mt-8 flex gap-3">
              <div className="flex-1 bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
                <p className="text-[10px] text-green-100 uppercase font-bold">Income</p>
                <p className="text-sm font-bold text-white">₦0</p>
              </div>
              <div className="flex-1 bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/10">
                <p className="text-[10px] text-green-100 uppercase font-bold">Spent</p>
                <p className="text-sm font-bold text-white">₦0</p>
              </div>
            </div>
          </div>

          <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-2xl">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <CreditCard size={18} className="text-green-500" />
              Quick Deposit
            </h3>
            <form onSubmit={handleDeposit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="deposit">Amount (₦)</Label>
                <Input 
                  id="deposit" 
                  type="number" 
                  placeholder="5000" 
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="bg-black border-zinc-800"
                />
              </div>
              <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={loading}>
                Fund Wallet
              </Button>
            </form>
          </div>
        </div>

        {/* Action Tabs */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Building size={20} className="text-green-500" />
              Withdraw to Bank
            </h3>
            <form onSubmit={handleWithdraw} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount to Withdraw (₦)</Label>
                <Input 
                  id="amount" 
                  type="number" 
                  placeholder="2000" 
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="bg-black border-zinc-800"
                />
                <p className="text-[10px] text-zinc-500 italic">* Minimum withdrawal: ₦1,000</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bank">Bank Details (Bank, Account No, Name)</Label>
                <Input 
                  id="bank" 
                  type="text" 
                  placeholder="GTBank, 0123456789, John Doe" 
                  value={bankDetails}
                  onChange={(e) => setBankDetails(e.target.value)}
                  className="bg-black border-zinc-800"
                />
              </div>
              <Button type="submit" className="md:col-span-2 bg-green-600 hover:bg-green-700 py-6 text-lg" disabled={loading}>
                {loading ? 'Processing...' : 'Request Withdrawal'}
              </Button>
            </form>
          </div>

          <div className="bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-zinc-900 flex items-center justify-between">
              <h3 className="font-bold flex items-center gap-2">
                <History size={18} className="text-green-500" />
                Transaction History
              </h3>
            </div>
            <div className="divide-y divide-zinc-900">
              {transactions.length > 0 ? (
                transactions.map((tx) => (
                  <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-zinc-900/50">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        tx.type === 'deposit' || tx.type === 'commission' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                      }`}>
                        {tx.type === 'deposit' || tx.type === 'commission' ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{tx.description}</p>
                        <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">{tx.type} • {new Date(tx.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${tx.type === 'deposit' || tx.type === 'commission' ? 'text-green-500' : 'text-zinc-300'}`}>
                        {tx.type === 'deposit' || tx.type === 'commission' ? '+' : '-'}₦{tx.amount.toLocaleString()}
                      </p>
                      <span className="text-[10px] text-zinc-500 capitalize">{tx.status}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center text-zinc-500">No transactions recorded.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wallet;

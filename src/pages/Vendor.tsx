import React, { useEffect, useState } from 'react';
import { User, Transaction } from '../types';
import { db } from '../lib/mock-db';
import { 
  Store, 
  TrendingUp, 
  Users, 
  Wallet, 
  ArrowUpRight, 
  Gift,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';

interface VendorProps {
  user: User | null;
}

const Vendor: React.FC<VendorProps> = ({ user }) => {
  const [commissions, setCommissions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      const allTx = db.getTransactions();
      setCommissions(allTx.filter(tx => tx.userId === user.id && tx.type === 'commission').reverse());
    }
  }, [user]);

  const totalCommission = commissions.reduce((sum, tx) => sum + tx.amount, 0);

  const handleWithdrawCommission = () => {
    if (!user || user.commissionBalance <= 0) {
      toast.error('No commission balance to withdraw.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const users = db.getUsers();
      const updatedUsers = users.map(u => {
        if (u.id === user.id) {
          return { 
            ...u, 
            walletBalance: u.walletBalance + u.commissionBalance,
            commissionBalance: 0
          };
        }
        return u;
      });
      db.saveUsers(updatedUsers);
      
      const currentUser = db.getCurrentUser();
      if (currentUser) {
        db.setCurrentUser({
          ...currentUser,
          walletBalance: currentUser.walletBalance + currentUser.commissionBalance,
          commissionBalance: 0
        });
      }

      toast.success('Commission successfully moved to main wallet!');
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Vendor Dashboard</h1>
        <p className="text-zinc-500">Track your sales and earn commissions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-2xl relative overflow-hidden">
          <div className="absolute -top-4 -right-4 text-green-500/10 rotate-12">
            <Gift size={120} />
          </div>
          <p className="text-zinc-500 text-sm font-medium">Commission Balance</p>
          <h3 className="text-3xl font-extrabold mt-2 text-white">₦{user?.commissionBalance?.toLocaleString() || '0'}</h3>
          <Button 
            className="mt-6 w-full bg-green-600 hover:bg-green-700 font-bold"
            onClick={handleWithdrawCommission}
            disabled={loading}
          >
            Move to Wallet
          </Button>
        </div>

        <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-2xl">
          <p className="text-zinc-500 text-sm font-medium">Total Lifetime Earnings</p>
          <h3 className="text-3xl font-extrabold mt-2 text-white">₦{totalCommission.toLocaleString()}</h3>
          <div className="mt-6 flex items-center gap-2 text-green-500 text-xs font-bold">
            <TrendingUp size={14} />
            <span>+12.5% from last month</span>
          </div>
        </div>

        <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-2xl">
          <p className="text-zinc-500 text-sm font-medium">Active Customers</p>
          <h3 className="text-3xl font-extrabold mt-2 text-white">24</h3>
          <div className="mt-6 flex items-center gap-2 text-blue-500 text-xs font-bold">
            <Users size={14} />
            <span>5 new this week</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-zinc-900">
              <h3 className="font-bold flex items-center gap-2">
                <TrendingUp size={18} className="text-green-500" />
                Commission History
              </h3>
            </div>
            <div className="divide-y divide-zinc-900">
              {commissions.length > 0 ? (
                commissions.map((tx) => (
                  <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-zinc-900/50">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center">
                        <Gift size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{tx.description}</p>
                        <p className="text-[10px] text-zinc-500">{new Date(tx.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-500">+₦{tx.amount.toLocaleString()}</p>
                      <span className="text-[10px] text-zinc-500">Earned</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center text-zinc-500">No commissions earned yet.</div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 space-y-6">
            <h3 className="font-bold flex items-center gap-2">
              <Store size={18} className="text-blue-500" />
              Vendor Benefits
            </h3>
            <div className="space-y-4">
              {[
                'Earn 2% on Airtime conversion',
                'Earn 1.5% on Data conversion',
                '₦50 fixed on Bill payments',
                'Priority withdrawal approval',
                'Custom marketing materials'
              ].map((benefit, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-zinc-400">
                  <CheckCircle2 size={16} className="text-green-500 shrink-0" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Vendor;

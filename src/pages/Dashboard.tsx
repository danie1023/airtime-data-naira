import React, { useEffect, useState } from 'react';
import { User, Transaction, ConversionRequest } from '../types';
import { db } from '../lib/mock-db';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Zap, 
  Clock, 
  CheckCircle, 
  XCircle,
  TrendingUp,
  Plus
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface DashboardProps {
  user: User | null;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [requests, setRequests] = useState<ConversionRequest[]>([]);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    if (user) {
      const allTx = db.getTransactions();
      const userTx = allTx.filter(tx => tx.userId === user.id).slice(0, 5);
      setTransactions(userTx);

      const allReq = db.getRequests();
      const userReq = allReq.filter(req => req.userId === user.id).slice(0, 3);
      setRequests(userReq);

      const hour = new Date().getHours();
      if (hour < 12) setGreeting('Good Morning');
      else if (hour < 18) setGreeting('Good Afternoon');
      else setGreeting('Good Evening');
    }
  }, [user]);

  const stats = [
    { label: 'Wallet Balance', value: `₦${user?.walletBalance.toLocaleString()}`, icon: Wallet, color: 'text-green-500' },
    { label: 'Total Converted', value: '₦0', icon: TrendingUp, color: 'text-blue-500' },
    { label: 'Pending Requests', value: requests.filter(r => r.status === 'pending').length, icon: Clock, color: 'text-yellow-500' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold">{greeting}, {user?.name.split(' ')[0]}! 👋</h1>
        <p className="text-zinc-500">Welcome back to your KC TELECOM dashboard.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg bg-zinc-800 ${stat.color}`}>
                <stat.icon size={20} />
              </div>
            </div>
            <p className="text-zinc-500 text-sm font-medium">{stat.label}</p>
            <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link to="/convert">
          <Button variant="outline" className="w-full h-24 flex-col gap-2 border-zinc-800 hover:bg-zinc-900 text-zinc-300">
            <Zap className="text-yellow-500" />
            Convert Airtime
          </Button>
        </Link>
        <Link to="/vtu">
          <Button variant="outline" className="w-full h-24 flex-col gap-2 border-zinc-800 hover:bg-zinc-900 text-zinc-300">
            <Plus className="text-green-500" />
            Buy Data
          </Button>
        </Link>
        <Link to="/wallet">
          <Button variant="outline" className="w-full h-24 flex-col gap-2 border-zinc-800 hover:bg-zinc-900 text-zinc-300">
            <ArrowUpRight className="text-blue-500" />
            Withdraw
          </Button>
        </Link>
        <Link to="/vtu">
          <Button variant="outline" className="w-full h-24 flex-col gap-2 border-zinc-800 hover:bg-zinc-900 text-zinc-300">
            <TrendingUp className="text-purple-500" />
            Pay Bills
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Transactions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold">Recent Transactions</h3>
            <Link to="/wallet" className="text-sm text-green-500 hover:underline">View all</Link>
          </div>
          <div className="bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden">
            {transactions.length > 0 ? (
              <div className="divide-y divide-zinc-900">
                {transactions.map((tx) => (
                  <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-zinc-900/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        tx.type === 'deposit' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                      }`}>
                        {tx.type === 'deposit' ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{tx.description}</p>
                        <p className="text-xs text-zinc-500">{new Date(tx.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <p className={`font-bold ${tx.type === 'deposit' ? 'text-green-500' : 'text-zinc-300'}`}>
                      {tx.type === 'deposit' ? '+' : '-'}₦{tx.amount.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center text-zinc-500">
                <p>No transactions yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Conversion Status */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold">Active Conversions</h3>
            <Link to="/convert" className="text-sm text-green-500 hover:underline">Track all</Link>
          </div>
          <div className="bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden">
            {requests.length > 0 ? (
              <div className="divide-y divide-zinc-900">
                {requests.map((req) => (
                  <div key={req.id} className="p-4 flex items-center justify-between hover:bg-zinc-900/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center font-bold text-[10px] text-zinc-400">
                        {req.network}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{req.type === 'airtime' ? 'Airtime' : 'Data'} to Cash</p>
                        <p className="text-xs text-zinc-500">₦{req.amount.toLocaleString()} • {req.phone}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase inline-block ${
                        req.status === 'completed' ? 'bg-green-500/10 text-green-500' :
                        req.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                        'bg-red-500/10 text-red-500'
                      }`}>
                        {req.status}
                      </div>
                      <p className="text-sm font-bold mt-1">₦{req.value.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center text-zinc-500">
                <p>No conversion requests yet.</p>
                <Link to="/convert">
                  <Button variant="link" className="text-green-500 mt-2">Start your first conversion</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

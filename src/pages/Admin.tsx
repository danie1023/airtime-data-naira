import React, { useEffect, useState } from 'react';
import { User, ConversionRequest, WithdrawalRequest, SystemSettings } from '../types';
import { db } from '../lib/mock-db';
import { conversionService, walletService } from '../lib/services';
import { supabase } from '../integrations/supabase/client';
import { 
  ShieldCheck, 
  Users, 
  ArrowRightLeft, 
  Wallet, 
  Settings,
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink,
  Search
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'requests' | 'withdrawals' | 'users' | 'settings'>('requests');
  const [requests, setRequests] = useState<ConversionRequest[]>([]);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [settings, setSettings] = useState<SystemSettings>(db.getSettings());

  const refreshData = async () => {
    if (activeTab === 'requests') {
      const { data, error } = await supabase.from('airtime_cash_requests').select('*, users(name)').order('created_at', { ascending: false });
      if (error) {
        toast.error(error.message)
      } else {
        const mappedData = data.map(d => ({
            ...d,
            amount: d.airtime_amount, 
            value: d.expected_cash_amount, 
            phone: d.phone_number,
            status: d.status.toLowerCase(),
            type: 'airtime', 
            userName: d.users.name, 
        })) as ConversionRequest[];
        setRequests(mappedData);
      }
    }
    setWithdrawals(db.getWithdrawals().reverse());
    setUsers(db.getUsers());
    setSettings(db.getSettings());
  };

  useEffect(() => {
    refreshData();
  }, [activeTab]);

  const handleApproveRequest = async (id: string) => {
    const success = await conversionService.approveRequest(id);
    if (success) {
      toast.success('Request approved and funds moved!');
      refreshData();
    }
  };

  const handleRejectRequest = async (id: string) => {
    const success = await conversionService.rejectRequest(id);
    if (success) {
      toast.info('Request rejected.');
      refreshData();
    }
  };

  const handleApproveWithdrawal = (id: string) => {
    const allWithdrawals = db.getWithdrawals();
    const updated = allWithdrawals.map(w => w.id === id ? { ...w, status: 'completed' as const } : w);
    db.saveWithdrawals(updated);
    toast.success('Withdrawal marked as completed!');
    refreshData();
  };

  const handleUpdateSettings = (e: React.FormEvent) => {
    e.preventDefault();
    db.saveSettings(settings);
    toast.success('Rates updated successfully!');
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3">
            <ShieldCheck className="text-green-500" />
            Admin Control Center
          </h1>
          <p className="text-zinc-500">Manage platform operations and user requests.</p>
        </div>
        <div className="flex bg-zinc-950 p-1 rounded-xl border border-zinc-900">
          {[
            { id: 'requests', label: 'Conversions', icon: ArrowRightLeft },
            { id: 'withdrawals', label: 'Withdrawals', icon: Wallet },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === tab.id ? 'bg-zinc-900 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <tab.icon size={14} />
              <span className="hidden md:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {activeTab === 'requests' && (
          <div className="bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-zinc-900 flex justify-between items-center">
              <h3 className="font-bold">Conversion Requests</h3>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <Input placeholder="Search requests..." className="bg-black border-zinc-800 h-9 pl-9 text-xs w-64" />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-zinc-900/50 text-zinc-500 uppercase text-[10px] font-bold">
                  <tr>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Network/Type</th>
                    <th className="px-6 py-4">Amount/Value</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900">
                  {requests.map((req) => (
                    <tr key={req.id} className="hover:bg-zinc-900/30 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-medium">{req.userName}</p>
                        <p className="text-[10px] text-zinc-500">{req.phone}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-zinc-800 rounded text-[10px] font-bold">{req.network}</span>
                          <span className="capitalize text-zinc-400">{req.type}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold">₦{req.amount.toLocaleString()}</p>
                        <p className="text-[10px] text-green-500">₦{req.value.toLocaleString()} value</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                          req.status === 'completed' ? 'bg-green-500/10 text-green-500' :
                          req.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                          'bg-red-500/10 text-red-500'
                        }`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-zinc-500 text-xs">
                        {new Date(req.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {req.status === 'pending' && (
                          <div className="flex justify-end gap-2">
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-green-500 hover:bg-green-500/10" onClick={() => handleApproveRequest(req.id)}>
                              <CheckCircle size={18} />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:bg-red-500/10" onClick={() => handleRejectRequest(req.id)}>
                              <XCircle size={18} />
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                  {requests.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">No requests found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'withdrawals' && (
          <div className="bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-zinc-900">
              <h3 className="font-bold">Withdrawal Requests</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-zinc-900/50 text-zinc-500 uppercase text-[10px] font-bold">
                  <tr>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Bank Details</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900">
                  {withdrawals.map((w) => (
                    <tr key={w.id} className="hover:bg-zinc-900/30">
                      <td className="px-6 py-4 font-medium">{w.userName}</td>
                      <td className="px-6 py-4 font-bold text-red-400">₦{w.amount.toLocaleString()}</td>
                      <td className="px-6 py-4 text-xs text-zinc-400 max-w-xs truncate">{w.bankDetails}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                          w.status === 'completed' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'
                        }`}>
                          {w.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-zinc-500">
                        {new Date(w.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {w.status === 'pending' && (
                          <Button size="sm" className="bg-green-600 hover:bg-green-700 h-8" onClick={() => handleApproveWithdrawal(w.id)}>
                            Mark Paid
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {withdrawals.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">No withdrawals found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-zinc-900">
              <h3 className="font-bold">Registered Users</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-zinc-900/50 text-zinc-500 uppercase text-[10px] font-bold">
                  <tr>
                    <th className="px-6 py-4">Name/Email</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Wallet</th>
                    <th className="px-6 py-4">Joined</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-zinc-900/30">
                      <td className="px-6 py-4">
                        <p className="font-medium">{u.name}</p>
                        <p className="text-[10px] text-zinc-500">{u.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          u.role === 'admin' ? 'bg-red-500/10 text-red-500' :
                          u.role === 'vendor' ? 'bg-blue-500/10 text-blue-500' :
                          'bg-green-500/10 text-green-500'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-white">₦{u.walletBalance.toLocaleString()}</td>
                      <td className="px-6 py-4 text-xs text-zinc-500">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="sm" className="h-8 text-zinc-500">Manage</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-8 max-w-2xl">
            <h3 className="text-xl font-bold mb-6">Platform Settings</h3>
            <form onSubmit={handleUpdateSettings} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="airtime">Airtime Conversion Rate (%)</Label>
                  <Input 
                    id="airtime" 
                    type="number" 
                    step="0.01"
                    value={settings.airtimeRate * 100}
                    onChange={(e) => setSettings({ ...settings, airtimeRate: parseFloat(e.target.value) / 100 })}
                    className="bg-black border-zinc-800"
                  />
                  <p className="text-[10px] text-zinc-500 italic">User receives this % of airtime value.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="data">Data Conversion Rate (%)</Label>
                  <Input 
                    id="data" 
                    type="number" 
                    step="0.01"
                    value={settings.dataRate * 100}
                    onChange={(e) => setSettings({ ...settings, dataRate: parseFloat(e.target.value) / 100 })}
                    className="bg-black border-zinc-800"
                  />
                  <p className="text-[10px] text-zinc-500 italic">User receives this % of data market value.</p>
                </div>
              </div>
              <Button type="submit" className="bg-green-600 hover:bg-green-700 px-8">
                Save Changes
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
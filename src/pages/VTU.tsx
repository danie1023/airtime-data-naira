import React, { useState } from 'react';
import { User } from '../types';
import { db } from '../lib/mock-db';
import { 
  Smartphone, 
  Database, 
  Lightbulb, 
  Tv, 
  Dribbble, 
  CreditCard,
  CheckCircle2,
  Zap
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';
import { walletService } from '../lib/services';
import RechargePin from './RechargePin';

interface VTUProps {
  user: User | null;
}

const services = [
  { id: 'airtime', name: 'Buy Airtime', icon: Smartphone, color: 'text-blue-500' },
  { id: 'data', name: 'Buy Data', icon: Database, color: 'text-green-500' },
  { id: 'electricity', name: 'Electricity', icon: Lightbulb, color: 'text-yellow-500' },
  { id: 'cable', name: 'Cable TV', icon: Tv, color: 'text-purple-500' },
  { id: 'betting', name: 'Betting', icon: Dribbble, color: 'text-orange-500' },
  { id: 'card', name: 'PIN Printing', icon: CreditCard, color: 'text-pink-500' },
];

const VTU: React.FC<VTUProps> = ({ user }) => {
  const [activeService, setActiveService] = useState('airtime');
  const [amount, setAmount] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) {
      toast.error('Enter a valid amount');
      return;
    }

    if (user.walletBalance < amt) {
      toast.error('Insufficient wallet balance. Please fund your wallet.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      // Simulate purchase logic
      walletService.addFunds(user.id, -amt, `${activeService.toUpperCase()} Purchase`);
      toast.success(`${activeService.charAt(0).toUpperCase() + activeService.slice(1)} purchase successful!`);
      setAmount('');
      setPhone('');
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">VTU & Bill Payments</h1>
        <p className="text-zinc-500">Quickly pay for services directly from your wallet.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {services.map((service) => (
          <button
            key={service.id}
            onClick={() => setActiveService(service.id)}
            className={`p-6 rounded-2xl border transition-all flex flex-col items-center gap-3 ${
              activeService === service.id 
                ? 'bg-zinc-900 border-green-500 ring-1 ring-green-500' 
                : 'bg-zinc-950 border-zinc-900 hover:border-zinc-700'
            }`}
          >
            <div className={`p-3 rounded-xl bg-zinc-900 ${service.color}`}>
              <service.icon size={24} />
            </div>
            <span className="text-xs font-bold text-zinc-300">{service.name}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        { activeService === 'card' ? (
          <div className="lg:col-span-3">
            <RechargePin user={user} />
          </div>
        ) : (
          <>
            <div className="lg:col-span-2">
              <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-8">
                <h3 className="text-xl font-bold mb-6 capitalize">{activeService.replace('-', ' ')}</h3>
                
                <form onSubmit={handlePurchase} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="network">Network / Provider</Label>
                      <select className="w-full bg-black border border-zinc-800 rounded-lg h-10 px-3 text-sm focus:ring-1 focus:ring-green-500 outline-none">
                        <option>MTN Nigeria</option>
                        <option>GLO Nigeria</option>
                        <option>Airtel Nigeria</option>
                        <option>9mobile</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number / Account ID</Label>
                      <Input 
                        id="phone" 
                        placeholder="08012345678" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="bg-black border-zinc-800 h-10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount (₦)</Label>
                      <Input 
                        id="amount" 
                        type="number" 
                        placeholder="1000" 
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="bg-black border-zinc-800 h-10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Payment Method</Label>
                      <div className="h-10 px-4 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-2 text-green-500 text-sm font-bold">
                        <CheckCircle2 size={16} />
                        Wallet (₦{user?.walletBalance.toLocaleString()})
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 h-12 text-lg font-bold" disabled={loading}>
                      {loading ? 'Processing...' : `Pay ₦${amount || '0'}`}
                    </Button>
                  </div>
                </form>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 space-y-6">
                <h3 className="font-bold flex items-center gap-2">
                  <Zap size={18} className="text-yellow-500" />
                  Information
                </h3>
                <div className="space-y-4 text-sm text-zinc-500">
                  <div className="p-4 bg-zinc-900 rounded-xl space-y-2">
                    <p className="font-bold text-zinc-300">Fast Delivery</p>
                    <p>All VTU and bill payments are processed instantly. You will receive a confirmation SMS.</p>
                  </div>
                  <div className="p-4 bg-zinc-900 rounded-xl space-y-2">
                    <p className="font-bold text-zinc-300">24/7 Support</p>
                    <p>Having issues with your purchase? Contact our support team for immediate assistance.</p>
                  </div>
                  <p className="text-[10px] italic">* Commissions apply for vendors on all VTU purchases.</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VTU;

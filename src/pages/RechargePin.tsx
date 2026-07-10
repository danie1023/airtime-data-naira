import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Order } from '../types';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';
import { orderService } from '../lib/services';

interface RechargePinProps {
  user: User | null;
}

const denominations = [100, 200, 500, 1000];
const networks = ['MTN', 'GLO', 'Airtel', '9mobile'];

const RechargePin: React.FC<RechargePinProps> = ({ user }) => {
  const [network, setNetwork] = useState('MTN');
  const [denomination, setDenomination] = useState(100);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const totalCost = denomination * quantity;

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (user.walletBalance < totalCost) {
      toast.error('Insufficient balance');
      return;
    }

    setLoading(true);
    const order = await orderService.createRechargePinOrder(user.id, network, denomination, quantity, totalCost);

    if (order) {
      toast.success('Purchase successful! Generating your PINs...');
      navigate('/print-pins', { state: { order } });
    } else {
      // Error is handled in the service
    }

    setLoading(false);
  };

  return (
    <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-8">
      <h3 className="text-xl font-bold mb-6 capitalize">Recharge Card PIN Printing</h3>
      <form onSubmit={handlePurchase} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
                <Label htmlFor="network">Network</Label>
                <select id="network" value={network} onChange={(e) => setNetwork(e.target.value)} className="w-full bg-black border border-zinc-800 rounded-lg h-10 px-3 text-sm focus:ring-1 focus:ring-green-500 outline-none">
                    {networks.map(net => <option key={net} value={net}>{net}</option>)
                    }
                </select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="denomination">Denomination</Label>
                <select id="denomination" value={denomination} onChange={(e) => setDenomination(Number(e.target.value))} className="w-full bg-black border border-zinc-800 rounded-lg h-10 px-3 text-sm focus:ring-1 focus:ring-green-500 outline-none">
                    {denominations.map(denom => <option key={denom} value={denom}>₦{denom}</option>)
                    }
                </select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input id="quantity" type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} min={1} className="bg-black border-zinc-800 h-10" />
            </div>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl space-y-3">
            <div className="flex justify-between items-end">
                <span className="text-zinc-400 font-medium">Total Cost:</span>
                <span className="text-3xl font-extrabold text-white">₦{totalCost.toLocaleString()}</span>
            </div>
        </div>
        <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 h-12 text-lg font-bold" disabled={loading}>
          {loading ? 'Processing...' : `Pay ₦${totalCost.toLocaleString()}`}
        </Button>
      </form>
    </div>
  );
};

export default RechargePin;
import React, { useEffect, useState } from 'react';
import { User, ConversionRequest } from '../types';
import { db } from '../lib/mock-db';
import { conversionService } from '../lib/services';
import { 
  Zap, 
  Smartphone, 
  Database, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  HelpCircle,
  Phone
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';

interface ConvertProps {
  user: User | null;
}

const networks = [
  { name: 'MTN', color: 'bg-yellow-400 text-black', icon: 'M' },
  { name: 'GLO', color: 'bg-green-600 text-white', icon: 'G' },
  { name: 'Airtel', color: 'bg-red-600 text-white', icon: 'A' },
  { name: '9mobile', color: 'bg-emerald-800 text-white', icon: '9' },
];

const Convert: React.FC<ConvertProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'airtime' | 'data'>('airtime');
  const [network, setNetwork] = useState('');
  const [amount, setAmount] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState<ConversionRequest[]>([]);
  const settings = db.getSettings();

  const fetchRequests = async (currentUser: User) => {
    if (activeTab === 'airtime') {
      const airtimeRequests = await conversionService.getAirtimeConversionRequests(currentUser.id);
      const dataRequests = db.getRequests().filter(r => r.userId === currentUser.id && r.type === 'data').reverse();
      const combined = [...airtimeRequests, ...dataRequests].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setRequests(combined);
    } else {
      setRequests(db.getRequests().filter(r => r.userId === currentUser.id).reverse());
    }
  };

  useEffect(() => {
    if (user) {
      fetchRequests(user);
    }
  }, [user, activeTab]);

  const rate = activeTab === 'airtime' ? settings.airtimeRate : settings.dataRate;
  const expectedValue = amount ? parseFloat(amount) * rate : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!network) { toast.error('Please select a network'); return; }
    
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt < 500) {
      toast.error('Minimum conversion amount is ₦500');
      return;
    }

    if (phone.length < 11) {
      toast.error('Please enter a valid phone number');
      return;
    }

    setLoading(true);
    if (activeTab === 'airtime') {
      const request = await conversionService.submitAirtimeToCashRequest(user.id, network, amt, phone);
      if (request) {
        toast.success(`Airtime conversion request submitted!`);
        setAmount('');
        setPhone('');
        setNetwork('');
        if(user) fetchRequests(user);
      }
    } else {
      // Mock DB for data
      const request = conversionService.submitRequest(user.id, activeTab, network, amt, phone);
      if (request) {
        toast.success(`Data conversion request submitted!`);
        setAmount('');
        setPhone('');
        setNetwork('');
        if(user) fetchRequests(user);
      }
    }

    setLoading(false);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Convert Assets</h1>
        <p className="text-zinc-500">Turn your unused airtime or data into cash.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden">
            <div className="flex border-b border-zinc-900">
              <button
                onClick={() => setActiveTab('airtime')}
                className={`flex-1 py-4 font-bold transition-colors flex items-center justify-center gap-2 ${
                  activeTab === 'airtime' ? 'bg-zinc-900 text-green-500 border-b-2 border-green-500' : 'text-zinc-500'
                }`}
              >
                <Smartphone size={18} />
                Airtime to Cash
              </button>
              <button
                onClick={() => setActiveTab('data')}
                className={`flex-1 py-4 font-bold transition-colors flex items-center justify-center gap-2 ${
                  activeTab === 'data' ? 'bg-zinc-900 text-green-500 border-b-2 border-green-500' : 'text-zinc-500'
                }`}
              >
                <Database size={18} />
                Data to Cash
              </button>
            </div>

            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-3">
                  <Label>Select Network</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {networks.map((n) => (
                      <button
                        key={n.name}
                        type="button"
                        onClick={() => setNetwork(n.name)}
                        className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                          network === n.name 
                            ? 'bg-zinc-900 border-green-500 ring-1 ring-green-500' 
                            : 'border-zinc-800 bg-black hover:border-zinc-700'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${n.color}`}>
                          {n.icon}
                        </div>
                        <span className="text-xs font-medium">{n.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount (₦)</Label>
                    <Input 
                      id="amount" 
                      type="number" 
                      placeholder="e.g. 2000" 
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="bg-black border-zinc-800 h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                      <Input 
                        id="phone" 
                        type="tel" 
                        placeholder="08012345678" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="bg-black border-zinc-800 h-12 pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Current Conversion Rate:</span>
                    <span className="font-bold text-green-500">{(rate * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <span className="text-zinc-400 font-medium">You will receive:</span>
                    <span className="text-3xl font-extrabold text-white">₦{expectedValue.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                  <AlertCircle className="text-yellow-500 shrink-0 mt-0.5" size={16} />
                  <p className="text-[10px] text-yellow-200/70 leading-relaxed">
                    By clicking submit, you agree to transfer the specified {activeTab} to our designated number. 
                    Payment is processed within 5-30 minutes after verification.
                  </p>
                </div>

                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 h-14 text-lg font-bold rounded-xl" disabled={loading}>
                  {loading ? 'Processing...' : 'Submit Conversion Request'}
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* History / Status Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden flex flex-col h-full">
            <div className="p-6 border-b border-zinc-900">
              <h3 className="font-bold flex items-center gap-2">
                <Clock size={18} className="text-green-500" />
                Track My Requests
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto max-h-[600px] divide-y divide-zinc-900">
              {requests.length > 0 ? (
                requests.map((req) => (
                  <div key={req.id} className="p-6 hover:bg-zinc-900/50 transition-colors space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold uppercase px-2 py-0.5 bg-zinc-800 rounded text-zinc-400">
                            {req.network}
                          </span>
                          <span className="text-xs text-zinc-500 capitalize">{req.type}</span>
                        </div>
                        <p className="font-bold">₦{req.amount.toLocaleString()}</p>
                      </div>
                      <div className={`text-[10px] font-extrabold px-3 py-1 rounded-full uppercase ${
                        req.status === 'completed' ? 'bg-green-500/10 text-green-500' :
                        req.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                        'bg-red-500/10 text-red-500'
                      }`}>
                        {req.status}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-zinc-500">{new Date(req.createdAt).toLocaleString()}</span>
                      <span className="text-white font-medium">To: {req.phone}</span>
                    </div>

                    {req.status === 'pending' && (
                      <div className="pt-2">
                        <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-green-500 h-full w-1/3 animate-pulse" />
                        </div>
                        <p className="text-[9px] text-zinc-500 mt-1 italic text-center">Verifying transfer...</p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-12 text-center text-zinc-500 h-full flex flex-col items-center justify-center gap-4">
                  <HelpCircle size={48} className="opacity-20" />
                  <p>You haven't made any conversion requests yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Convert;
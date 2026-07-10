import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Order } from '../types';
import { supabase } from '../integrations/supabase/client';
import { db } from '../lib/mock-db';
import { Button } from '../components/ui/button';
import { ListOrdered, Printer, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const PurchaseHistory: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const user = db.getCurrentUser();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        toast.error(error.message);
      } else {
        const formattedOrders: Order[] = data.map(d => ({ 
            id: d.id, 
            userId: d.user_id, 
            type: d.type, 
            totalAmount: d.total_amount,
            createdAt: d.created_at,
            items: d.metadata.pins
        }));
        setOrders(formattedOrders);
      }
      setLoading(false);
    };

    fetchOrders();
  }, [user]);

  return (
    <div className="space-y-8">
        <div className="flex items-center gap-4">
            <Link to="/vtu">
                <Button variant="outline" size="icon" className="h-10 w-10"><ArrowLeft size={20}/></Button>
            </Link>
            <div>
                <h1 className="text-2xl font-bold">My Recharge PIN Orders</h1>
                <p className="text-zinc-500">View and reprint your past recharge card purchases.</p>
            </div>
        </div>

        <div className="bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-zinc-900/50 text-zinc-500 uppercase text-[10px] font-bold">
                        <tr>
                            <th className="px-6 py-4">Order ID</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Details</th>
                            <th className="px-6 py-4">Amount</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                     <tbody className="divide-y divide-zinc-900">
                        {loading ? (
                            <tr><td colSpan={5} className="text-center p-8 text-zinc-500">Loading history...</td></tr>
                        ) : orders.length > 0 ? (
                            orders.map((order) => (
                                <tr key={order.id} className="hover:bg-zinc-900/30 transition-colors">
                                    <td className="px-6 py-4 font-mono text-xs text-zinc-500">{order.id.substring(0,8)}...</td>
                                    <td className="px-6 py-4 text-zinc-400">{new Date(order.createdAt).toLocaleString()}</td>
                                    <td className="px-6 py-4 font-medium">{order.items[0].network} ₦{order.items[0].denomination} x {order.items.length}</td>
                                    <td className="px-6 py-4 font-bold">₦{order.totalAmount.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-right">
                                        <Link to="/print-pins" state={{ order }}>
                                            <Button variant="ghost" size="sm" className="text-green-500 hover:text-green-400"><Printer size={16} className="mr-2"/>Reprint</Button>
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan={5} className="text-center p-12 text-zinc-500">No orders found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
};

export default PurchaseHistory;
import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { Order } from '../types';
import { Button } from '../components/ui/button';
import { Printer, ArrowLeft } from 'lucide-react';

const PrintLayout: React.FC = () => {
  const location = useLocation();
  const order: Order | undefined = location.state?.order;

  if (!order) {
    return <Navigate to="/vtu" replace />;
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 bg-black text-white">
      <div className="flex justify-between items-center mb-8 print:hidden">
        <div>
          <Link to="/vtu" className="flex items-center gap-2 text-zinc-400 hover:text-white">
            <ArrowLeft size={18} />
            Back to VTU
          </Link>
          <h1 className="text-2xl font-bold mt-2">Print Recharge Vouchers</h1>
          <p className="text-zinc-500">Order ID: {order.id}</p>
        </div>
        <Button onClick={handlePrint} className="bg-green-600 hover:bg-green-700">
          <Printer size={18} className="mr-2" />
          Print
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 print:grid-cols-4 print:gap-2">
        {order.items.map((pin, index) => (
          <div 
            key={index}
            className="border-2 border-dashed border-zinc-700 rounded-lg p-3 text-center bg-zinc-950 flex flex-col justify-between aspect-[3/2] print:border-black print:bg-white print:text-black"
          >
            <div className="flex justify-between items-start">
                <div className={`text-lg font-bold ${ 
                    pin.network === 'MTN' ? 'text-yellow-400' : 
                    pin.network === 'GLO' ? 'text-green-500' : 
                    pin.network === 'Airtel' ? 'text-red-500' : 'text-emerald-500' 
                }`}>
                    {pin.network}
                </div>
                <div className="font-bold text-lg print:text-xl">
                    ₦{pin.denomination}
                </div>
            </div>
            
            <div className="my-2 print:my-1">
              <p className="text-xs text-zinc-500 print:hidden">PIN</p>
              <p className="font-mono font-bold text-lg md:text-xl tracking-wider print:text-lg">{pin.pin}</p>
            </div>

            <div>
                <p className="text-[8px] text-zinc-600 print:text-[7px]">S/N: {pin.serial}</p>
                <p className="text-[8px] text-zinc-600 print:text-[7px]">
                    To load, dial *{ getLoadingCode(pin.network) }*{pin.pin}#
                </p>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @media print {
          body { background-color: white; -webkit-print-color-adjust: exact; }
          .print\:hidden { display: none; }
          .print\:grid-cols-4 { grid-template-columns: repeat(4, 1fr); }
          .print\:gap-2 { gap: 0.5rem; }
          .print\:border-black { border-color: black; }
          .print\:bg-white { background-color: white; }
          .print\:text-black { color: black; }
          .print\:text-xl { font-size: 1.25rem; }
          .print\:text-lg { font-size: 1.125rem; }
          .print\:text-\[7px\] { font-size: 7px; }
          .print\:my-1 { margin-top: 0.25rem; margin-bottom: 0.25rem; }
        }
      `}</style>
    </div>
  );
};

export default PrintLayout;

function getLoadingCode(network: string): string {
    switch(network) {
        case 'MTN': return '555';
        case 'GLO': return '123';
        case 'Airtel': return '126';
        case '9mobile': return '222';
        default: return ''
    }
}
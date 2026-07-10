import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { User } from '../types';
import { authService } from '../lib/services';
import { 
  LayoutDashboard, 
  Wallet, 
  ArrowRightLeft, 
  Smartphone, 
  User as UserIcon, 
  LogOut, 
  ShieldCheck, 
  Store,
  Menu,
  History,
  X
} from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '../lib/utils';

interface LayoutProps {
  user: User | null;
  setUser: (user: User | null) => void;
}

const Layout: React.FC<LayoutProps> = ({ user, setUser }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    navigate('/');
  };

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'Wallet', icon: Wallet, path: '/wallet' },
    { label: 'Convert', icon: ArrowRightLeft, path: '/convert' },
    { label: 'VTU Services', icon: Smartphone, path: '/vtu' },
    { label: 'Purchase History', icon: History, path: '/purchase-history' },
    { label: 'Profile', icon: UserIcon, path: '/profile' },
  ];

  if (user?.role === 'admin') {
    navItems.push({ label: 'Admin Panel', icon: ShieldCheck, path: '/admin' });
  }

  if (user?.role === 'vendor') {
    navItems.push({ label: 'Vendor Shop', icon: Store, path: '/vendor' });
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-900 sticky top-0 z-50">
        <Link to="/dashboard" className="text-xl font-bold text-green-500">KC TELECOM</Link>
        <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-0 z-40 bg-black/95 md:bg-zinc-950 md:relative md:flex md:w-64 flex-col border-r border-zinc-800 transition-transform duration-300 md:translate-x-0",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 hidden md:block">
          <Link to="/dashboard" className="text-2xl font-bold text-green-500">KC TELECOM</Link>
        </div>

        <nav className="flex-1 px-4 space-y-2 py-8 md:py-0">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                location.pathname === item.path 
                  ? "bg-green-600 text-white" 
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
              )}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-zinc-800">
          <div className="flex items-center gap-3 px-4 py-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-green-500 font-bold">
              {user?.name?.[0].toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-zinc-500 capitalize">{user?.role}</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-zinc-400 hover:text-red-500 hover:bg-red-500/10"
            onClick={handleLogout}
          >
            <LogOut size={20} className="mr-3" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-20 md:pb-8">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;

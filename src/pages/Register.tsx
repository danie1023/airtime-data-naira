import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { authService } from '../lib/services';
import { User } from '../types';
import { toast } from 'sonner';
import { UserPlus } from 'lucide-react';

interface RegisterProps {
  setUser: (user: User | null) => void;
}

const Register: React.FC<RegisterProps> = ({ setUser }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'user' | 'vendor'>('user');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    (async () => {
      const user = await authService.register(name, email, password, role);
      if (user) {
        setUser(user);
        toast.success('Registration successful!');
        navigate('/dashboard');
      } else {
        toast.error('Email already exists or registration failed.');
      }
      setLoading(false);
    })();
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-zinc-950 border border-zinc-900 p-8 rounded-2xl">
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-bold text-green-500">KC TELECOM</Link>
          <h2 className="text-2xl font-bold mt-6 text-white">Create account</h2>
          <p className="text-zinc-500 mt-2">Start your journey with us</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input 
              id="name" 
              type="text" 
              placeholder="John Doe" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-black border-zinc-800 text-white"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="name@example.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-black border-zinc-800 text-white"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-black border-zinc-800 text-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Account Type</Label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setRole('user')}
                className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  role === 'user' 
                    ? 'bg-green-600/20 border-green-600 text-green-500' 
                    : 'bg-zinc-900 border-zinc-800 text-zinc-500'
                }`}
              >
                Standard User
              </button>
              <button
                type="button"
                onClick={() => setRole('vendor')}
                className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  role === 'vendor' 
                    ? 'bg-green-600/20 border-green-600 text-green-500' 
                    : 'bg-zinc-900 border-zinc-800 text-zinc-500'
                }`}
              >
                Vendor Account
              </button>
            </div>
            {role === 'vendor' && (
              <p className="text-[10px] text-zinc-500 mt-1 italic">
                * Vendors earn 2% commission on all successful conversions.
              </p>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full bg-green-600 hover:bg-green-700 text-white h-12 rounded-xl mt-4"
            disabled={loading}
          >
            {loading ? 'Creating account...' : <><UserPlus className="mr-2" size={20} /> Sign Up</>}
          </Button>
        </form>

        <p className="text-center text-zinc-500 mt-8">
          Already have an account?{' '}
          <Link to="/login" className="text-green-500 font-semibold hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

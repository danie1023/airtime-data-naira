import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { authService } from '../lib/services';
import { User } from '../types';
import { toast } from 'sonner';
import { LogIn } from 'lucide-react';

interface LoginProps {
  setUser: (user: User | null) => void;
}

const Login: React.FC<LoginProps> = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    (async () => {
      const user = await authService.login(email, password);
      if (user) {
        setUser(user);
        toast.success('Login successful!');
        navigate('/dashboard');
      } else {
        toast.error('Invalid credentials. Try admin@kctelecom.com / adminpassword');
      }
      setLoading(false);
    })();
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-zinc-950 border border-zinc-900 p-8 rounded-2xl">
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-bold text-green-500">
            KC TELECOM
          </Link>
          <h2 className="text-2xl font-bold mt-6 text-white">Welcome back</h2>
          <p className="text-zinc-500 mt-2">Log in to your account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
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
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                to="/forgot-password"
                className="text-xs text-green-500 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
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

          <Button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white h-12 rounded-xl"
            disabled={loading}
          >
            {loading ? (
              'Logging in...'
            ) : (
              <>
                <LogIn className="mr-2" size={20} /> Login
              </>
            )}
          </Button>
        </form>

        <p className="text-center text-zinc-500 mt-8">
          Don't have an account?{' '}
          <Link to="/register" className="text-green-500 font-semibold hover:underline">
            Sign up
          </Link>
        </p>

        <div className="mt-8 p-4 bg-zinc-900/50 rounded-lg border border-zinc-800 text-xs text-zinc-500">
          <p className="font-bold mb-1 text-zinc-400 uppercase">Demo Admin Access:</p>
          <p>Email: admin@kctelecom.com</p>
          <p>Password: adminpassword</p>
        </div>
      </div>
    </div>
  );
};

export default Login;

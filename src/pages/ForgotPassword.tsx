import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';
import { Mail, ArrowLeft } from 'lucide-react';
import { supabase } from '../integrations/supabase/client';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'https://5192bcb4.mydala.app/reset-password',
      });

      if (error) {
        console.error('Password reset error:', error);
        toast.error(error.message || 'Failed to send reset email');
        setLoading(false);
        return;
      }

      toast.success('Password reset link sent! Check your email.');
      setSubmitted(true);
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-zinc-950 border border-zinc-900 p-8 rounded-2xl text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
              <Mail className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Check your email</h2>
          <p className="text-zinc-500 mb-6">
            We've sent a password reset link to <span className="font-semibold text-zinc-400">{email}</span>
          </p>
          <p className="text-sm text-zinc-500 mb-6">
            Click the link in the email to reset your password. The link will expire in 24 hours.
          </p>

          <Link to="/login" className="w-full inline-block mb-4">
            <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
              Back to Login
            </Button>
          </Link>

          <button
            onClick={() => {
              setSubmitted(false);
              setEmail('');
            }}
            className="text-sm text-green-500 hover:underline"
          >
            Try another email
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-zinc-950 border border-zinc-900 p-8 rounded-2xl">
        <Link to="/login" className="flex items-center gap-2 text-zinc-500 hover:text-white mb-6 text-sm">
          <ArrowLeft size={16} />
          Back to Login
        </Link>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white">Forgot your password?</h2>
          <p className="text-zinc-500 mt-2">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
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

          <Button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white h-12 rounded-xl"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send reset link'}
          </Button>
        </form>

        <p className="text-center text-zinc-500 mt-8 text-sm">
          Remember your password?{' '}
          <Link to="/login" className="text-green-500 font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;

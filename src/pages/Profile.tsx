import React, { useState } from 'react';
import { User } from '../types';
import { db } from '../lib/mock-db';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';
import { User as UserIcon, Mail, Shield, Calendar } from 'lucide-react';

interface ProfileProps {
  user: User | null;
  setUser: (user: User | null) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, setUser }) => {
  const [name, setName] = useState(user?.name || '');
  const [loading, setLoading] = useState(false);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    setTimeout(() => {
      const users = db.getUsers();
      const updatedUsers = users.map(u => u.id === user.id ? { ...u, name } : u);
      db.saveUsers(updatedUsers);
      
      const updatedUser = { ...user, name };
      db.setCurrentUser(updatedUser);
      setUser(updatedUser);
      
      toast.success('Profile updated successfully!');
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Account Settings</h1>
        <p className="text-zinc-500">Manage your personal information and preferences.</p>
      </div>

      <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-8 space-y-8">
        <div className="flex items-center gap-6 pb-8 border-b border-zinc-900">
          <div className="w-20 h-20 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500 text-3xl font-bold">
            {user?.name?.[0].toUpperCase()}
          </div>
          <div>
            <h3 className="text-xl font-bold">{user?.name}</h3>
            <p className="text-zinc-500">{user?.email}</p>
            <div className="flex gap-2 mt-2">
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-green-600/20 text-green-500 rounded border border-green-500/20">
                {user?.role}
              </span>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-zinc-800 text-zinc-400 rounded">
                Verified
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <UserIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <Input 
                  id="name" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-black border-zinc-800 pl-10"
                />
              </div>
            </div>
            <div className="space-y-2 opacity-50">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <Input 
                  id="email" 
                  value={user?.email}
                  disabled
                  className="bg-black border-zinc-800 pl-10 cursor-not-allowed"
                />
              </div>
            </div>
            <div className="space-y-2 opacity-50">
              <Label htmlFor="role">Account Role</Label>
              <div className="relative">
                <Shield size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <Input 
                  id="role" 
                  value={user?.role}
                  disabled
                  className="bg-black border-zinc-800 pl-10 capitalize cursor-not-allowed"
                />
              </div>
            </div>
            <div className="space-y-2 opacity-50">
              <Label htmlFor="joined">Member Since</Label>
              <div className="relative">
                <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <Input 
                  id="joined" 
                  value={user ? new Date(user.createdAt).toLocaleDateString() : ''}
                  disabled
                  className="bg-black border-zinc-800 pl-10 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <Button type="submit" className="bg-green-600 hover:bg-green-700 px-8" disabled={loading}>
            {loading ? 'Saving...' : 'Update Profile'}
          </Button>
        </form>
      </div>

      <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-8">
        <h3 className="text-lg font-bold text-red-500 mb-2">Danger Zone</h3>
        <p className="text-zinc-500 text-sm mb-6">Once you delete your account, there is no going back. Please be certain.</p>
        <Button variant="outline" className="border-red-500/50 text-red-500 hover:bg-red-500/10">
          Delete My Account
        </Button>
      </div>
    </div>
  );
};

export default Profile;


import React, { useState } from 'react';
import { MOCK_USERS } from '../constants';
import { User, UserRole } from '../types';
import { Lock, Mail, Store } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password'); // Dummy default
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (user) {
      onLogin(user);
    } else {
      setError('Invalid email or password. Use "admin@system.com" or "john@system.com"');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-600 rounded-2xl shadow-lg mb-4">
            <Store className="text-white" size={40} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">StockMaster Pro</h1>
          <p className="text-slate-400">Enterprise Multi-Outlet Inventory System</p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Welcome Back</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@system.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium border border-red-100 text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-200 transition-all"
            >
              Sign In
            </button>
          </form>

          <div className="mt-8 border-t border-slate-100 pt-6">
            <p className="text-xs text-center text-slate-400 mb-3">DEMO ACCESS</p>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setEmail('admin@system.com')}
                className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 py-2 rounded-lg font-medium transition-colors"
              >
                Admin User
              </button>
              <button 
                onClick={() => setEmail('john@system.com')}
                className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 py-2 rounded-lg font-medium transition-colors"
              >
                Refiller User
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

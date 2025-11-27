import React, { useState } from 'react';
import { Button } from './Button';
import { AdminSettings } from '../types';
import { APP_TITLE } from '../constants';
import { Lock, User } from 'lucide-react';

interface AdminLoginProps {
  onLogin: () => void;
  settings: AdminSettings;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, settings }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === settings.username && password === settings.password) {
      onLogin();
    } else {
      setError('Oops! Username atau Password salah.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      
      <div className="text-center mb-8 max-w-3xl">
          <div className="inline-block p-4 mb-4 rounded-full bg-white border-4 border-yellow-400 shadow-lg transform rotate-[-3deg]">
             <span className="text-4xl">📚✨🚀</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-sky-600 mb-2 leading-tight drop-shadow-sm tracking-tight">
            {APP_TITLE}
          </h1>
          <p className="text-lg text-sky-800 font-bold bg-sky-100 inline-block px-4 py-1 rounded-full mt-2">
            Pintu Gerbang Pengetahuan
          </p>
      </div>

      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-[0_10px_0_rgb(56,189,248)] border-4 border-sky-200 relative overflow-hidden">
        
        {/* Decorative circles */}
        <div className="absolute -top-10 -right-10 w-24 h-24 bg-yellow-200 rounded-full opacity-50"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-green-200 rounded-full opacity-50"></div>

        <form className="mt-4 space-y-6 relative z-10" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-lg font-bold text-sky-700 mb-2">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-sky-400">
                  <User size={24} />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="block w-full pl-12 pr-4 py-4 border-2 border-sky-100 bg-sky-50 text-sky-900 rounded-2xl focus:outline-none focus:ring-4 focus:ring-yellow-300 focus:border-yellow-400 text-lg transition-all"
                  placeholder="Nama Pengguna"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-lg font-bold text-sky-700 mb-2">Password</label>
              <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-sky-400">
                  <Lock size={24} />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="block w-full pl-12 pr-4 py-4 border-2 border-sky-100 bg-sky-50 text-sky-900 rounded-2xl focus:outline-none focus:ring-4 focus:ring-yellow-300 focus:border-yellow-400 text-lg transition-all"
                  placeholder="Kata Sandi Rahasia"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="text-rose-600 font-bold text-center bg-rose-100 py-3 rounded-xl border-2 border-rose-200 animate-bounce">
                {error}
            </div>
          )}

          <div className="pt-2">
            <Button type="submit" variant="primary" className="w-full py-4 text-xl">
              🚀 Masuk Sekarang
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
import React, { useState } from 'react';
import { Button } from './Button';
import { AdminSettings } from '../types';
import { Save, Upload, Trash2 } from 'lucide-react';

interface AdminDashboardProps {
  settings: AdminSettings;
  onUpdateSettings: (newSettings: AdminSettings) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ settings, onUpdateSettings }) => {
  const [formState, setFormState] = useState<AdminSettings>(settings);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2000000) { // 2MB limit
          setMessage({ type: 'error', text: 'Ukuran file terlalu besar (Maks 2MB)' });
          return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormState(prev => ({ ...prev, logoUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(formState);
    setMessage({ type: 'success', text: 'Pengaturan berhasil disimpan!' });
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto p-8">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-6 pb-4 border-b">Pengaturan Kamus</h2>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Logo Section */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Logo Aplikasi</label>
            <div className="flex items-center space-x-6">
              <div className="shrink-0">
                {formState.logoUrl ? (
                  <img className="h-24 w-24 object-contain rounded-lg border border-slate-200" src={formState.logoUrl} alt="Current Logo" />
                ) : (
                  <div className="h-24 w-24 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200 border-dashed">
                    No Logo
                  </div>
                )}
              </div>
              <div className="flex-1">
                 <label className="block w-full">
                    <span className="sr-only">Choose logo</span>
                    <div className="flex gap-2">
                        <label className="cursor-pointer bg-white py-2 px-3 border border-slate-300 rounded-md shadow-sm text-sm leading-4 font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                             <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                             <span className="flex items-center gap-2"><Upload size={16}/> Upload Logo Baru</span>
                        </label>
                        {formState.logoUrl && (
                            <Button type="button" variant="danger" onClick={() => setFormState(s => ({...s, logoUrl: null}))}>
                                <Trash2 size={16} />
                            </Button>
                        )}
                    </div>
                  </label>
                  <p className="mt-1 text-xs text-slate-500">PNG, JPG, GIF up to 2MB</p>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-slate-900 mb-4">Keamanan Akun Admin</h3>
              <div className="grid grid-cols-1 gap-6">
                <div>
                    <label className="block text-sm font-medium text-slate-700">Username Admin</label>
                    <input
                        type="text"
                        value={formState.username}
                        onChange={(e) => setFormState({...formState, username: e.target.value})}
                        className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700">Password Baru</label>
                    <input
                        type="text" 
                        value={formState.password}
                        onChange={(e) => setFormState({...formState, password: e.target.value})}
                        className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                    />
                     <p className="mt-1 text-xs text-slate-500">Gunakan kombinasi yang aman.</p>
                </div>
              </div>
          </div>

          <div className="pt-4 flex justify-end">
            <Button type="submit">
               <Save size={18} className="mr-2" /> Simpan Perubahan
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
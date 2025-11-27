import React from 'react';
import { Settings, LogOut } from 'lucide-react';
import { APP_TITLE } from '../constants';
import { Button } from './Button';
import { AppView } from '../types';

interface HeaderProps {
  logoUrl: string | null;
  onNavigate: (view: AppView) => void;
  currentView: AppView;
  isAdminLoggedIn: boolean;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  logoUrl, 
  onNavigate, 
  currentView, 
  isAdminLoggedIn,
  onLogout
}) => {
  if (!isAdminLoggedIn) {
    return (
      <header className="bg-sky-400 shadow-[0_4px_0_rgb(14,165,233)] sticky top-0 z-50 py-4">
         <div className="max-w-7xl mx-auto px-4 flex justify-center items-center">
            {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="h-20 w-auto object-contain drop-shadow-md hover:scale-105 transition-transform" />
            ) : (
                <div className="bg-white text-sky-500 font-black px-6 py-2 rounded-full shadow-[0_4px_0_rgba(0,0,0,0.1)] text-xl md:text-2xl tracking-tight transform rotate-1">
                  KAMUS BELAJAR
                </div>
            )}
         </div>
      </header>
    );
  }

  return (
    <header className="bg-sky-400 shadow-[0_4px_0_rgb(14,165,233)] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          <div 
            className="flex items-center space-x-4 cursor-pointer group" 
            onClick={() => onNavigate(AppView.HOME)}
          >
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="h-16 w-auto object-contain rounded-xl border-2 border-white shadow-md group-hover:rotate-3 transition-transform" />
            ) : (
              <div className="h-14 w-14 bg-yellow-400 rounded-2xl flex items-center justify-center text-yellow-900 font-black text-2xl shadow-[0_4px_0_rgb(202,138,4)] border-2 border-yellow-300 group-hover:scale-110 transition-transform">
                UR
              </div>
            )}
            <div className="hidden md:block text-white">
               <h1 className="text-xl font-black leading-none tracking-tight drop-shadow-md">
                KAMUS BELAJAR
              </h1>
              <p className="text-sm font-bold text-sky-100 opacity-90">
                Umar Rasyid Al-Fatih
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
             {currentView === AppView.HOME ? (
               <Button 
                variant="secondary" 
                onClick={() => onNavigate(AppView.ADMIN_DASHBOARD)}
                title="Pengaturan"
                className="!py-2 !px-4 !text-sm"
              >
                <Settings size={20} className="mr-2" />
                <span className="hidden sm:inline">Pengaturan</span>
              </Button>
            ) : (
                <div className="bg-sky-500/50 px-4 py-2 rounded-xl text-white font-bold border-2 border-sky-300">
                    Mode Admin
                </div>
            )}

            <Button 
                variant="danger" 
                onClick={onLogout} 
                title="Keluar"
                className="!py-2 !px-4 !text-sm"
            >
                <LogOut size={18} className="mr-2" />
                <span className="hidden sm:inline">Keluar</span>
            </Button>
           
          </div>
        </div>
      </div>
      {currentView === AppView.HOME && (
         <div className="bg-sky-100 border-b-4 border-sky-200 text-sky-700 text-center py-3 text-sm font-extrabold tracking-wide uppercase">
            ✨ {APP_TITLE} ✨
         </div>
      )}
    </header>
  );
};
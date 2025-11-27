import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { TranslationPanel } from './components/TranslationPanel';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { AppView, AdminSettings } from './types';
import { DEFAULT_ADMIN_SETTINGS } from './constants';

const App: React.FC = () => {
  // Persistence for Admin Settings (simulating backend with localStorage)
  const [adminSettings, setAdminSettings] = useState<AdminSettings>(() => {
    const saved = localStorage.getItem('dictionary_admin_settings');
    return saved ? JSON.parse(saved) : DEFAULT_ADMIN_SETTINGS;
  });

  // Start at Login screen to protect the dictionary
  const [currentView, setCurrentView] = useState<AppView>(AppView.ADMIN_LOGIN);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  useEffect(() => {
    localStorage.setItem('dictionary_admin_settings', JSON.stringify(adminSettings));
  }, [adminSettings]);

  const handleAdminLogin = () => {
    setIsAdminLoggedIn(true);
    setCurrentView(AppView.HOME);
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    setCurrentView(AppView.ADMIN_LOGIN);
  };

  const handleUpdateSettings = (newSettings: AdminSettings) => {
    setAdminSettings(newSettings);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Only show Header if logged in (or we could show a simplified header for login) */}
      <Header 
        logoUrl={adminSettings.logoUrl}
        currentView={currentView}
        onNavigate={setCurrentView}
        isAdminLoggedIn={isAdminLoggedIn}
        onLogout={handleLogout}
      />

      <main className="flex-grow">
        {currentView === AppView.HOME && isAdminLoggedIn && (
          <TranslationPanel onNavigate={setCurrentView} />
        )}

        {currentView === AppView.ADMIN_LOGIN && (
          <AdminLogin 
            onLogin={handleAdminLogin}
            settings={adminSettings}
          />
        )}

        {currentView === AppView.ADMIN_DASHBOARD && isAdminLoggedIn && (
          <AdminDashboard 
            settings={adminSettings}
            onUpdateSettings={handleUpdateSettings}
            onNavigate={setCurrentView}
          />
        )}
      </main>

      <footer className="bg-white border-t border-slate-200 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-slate-500">
           <p className="text-sm font-medium">© {new Date().getFullYear()} Kamus Belajar Umar Rasyid Al-Fatih.</p>
           <p className="text-xs mt-1">Professional Translation & Listening Platform</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
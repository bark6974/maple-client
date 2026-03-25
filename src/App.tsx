import { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard'>('landing');

  // 로그인 상태면 대시보드로 자동 이동
  useEffect(() => {
    if (user) setCurrentView('dashboard');
    else setCurrentView('landing');
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (user && currentView === 'dashboard') {
    return <Dashboard onNavigateToHome={() => setCurrentView('landing')} />;
  }

  return (
    <LandingPage onNavigateToDashboard={() => setCurrentView('dashboard')} />
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;

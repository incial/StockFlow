
import React, { useState, useMemo, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { User, UserRole, StockEntry } from './types';
import { MOCK_USERS, INITIAL_STOCK_ENTRIES } from './constants';
import Login from './views/Login';
import AdminDashboard from './views/AdminDashboard';
import RefillerDashboard from './views/RefillerDashboard';
import Reports from './views/Reports';
import MainLayout from './components/MainLayout';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [entries, setEntries] = useState<StockEntry[]>(INITIAL_STOCK_ENTRIES);

  // Persistence mock
  useEffect(() => {
    const savedUser = localStorage.getItem('sm_user');
    if (savedUser) setCurrentUser(JSON.parse(savedUser));
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('sm_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('sm_user');
  };

  const addEntries = (newEntries: StockEntry[]) => {
    setEntries(prev => [...newEntries, ...prev]);
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <HashRouter>
      <MainLayout user={currentUser} onLogout={handleLogout}>
        <Routes>
          {currentUser.role === UserRole.ADMIN ? (
            <>
              <Route path="/" element={<AdminDashboard entries={entries} />} />
              <Route path="/reports" element={<Reports entries={entries} />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          ) : (
            <>
              <Route path="/" element={<RefillerDashboard user={currentUser} entries={entries} onAddEntries={addEntries} />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          )}
        </Routes>
      </MainLayout>
    </HashRouter>
  );
};

export default App;

import React from 'react';
import { User } from '../types';
import Sidebar from './Sidebar';
import { LayoutProvider, useLayout } from '../context/LayoutContext';
import { Menu } from 'lucide-react';

interface MainLayoutProps {
  user: User;
  onLogout: () => void;
  children: React.ReactNode;
}

// Separate internal component to consume context
const LayoutContent: React.FC<MainLayoutProps> = ({ user, onLogout, children }) => {
  const { isSidebarOpen, toggleSidebar, isMobile } = useLayout();

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar user={user} onLogout={onLogout} />

      {/* Main Content Wrapper */}
      <div 
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out ${
          // On mobile, content is always full width. On desktop, it shifts based on sidebar state.
          isMobile ? 'ml-0' : (isSidebarOpen ? 'ml-72' : 'ml-20')
        }`}
      >
        {/* Mobile Header for Sidebar Toggle */}
        {isMobile && (
          <div className="bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-30 flex items-center justify-between shadow-sm">
             <div className="flex items-center gap-3">
                <button 
                  onClick={toggleSidebar}
                  className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <Menu size={24} />
                </button>
                <span className="font-bold text-slate-800">StockFlow</span>
             </div>
             <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                {user.name.charAt(0)}
             </div>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8 overflow-x-hidden">
          <div className="max-w-7xl mx-auto animate-in fade-in duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

const MainLayout: React.FC<MainLayoutProps> = (props) => {
  return (
    <LayoutProvider>
      <LayoutContent {...props} />
    </LayoutProvider>
  );
};

export default MainLayout;

import React, { useState } from 'react';
import { Athlete } from '../types';
import { LayoutDashboard, GraduationCap, User, Settings, LogOut, Bell, ChevronLeft, ChevronRight, PanelLeftClose, PanelLeftOpen } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  athlete: Athlete;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, athlete }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Recruiting Funnel', icon: LayoutDashboard },
    { id: 'colleges', label: 'Colleges', icon: GraduationCap },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="flex h-screen bg-[#050505] text-gray-300 overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={`${
          isCollapsed ? 'w-20' : 'w-64'
        } border-r border-white/5 flex flex-col p-4 bg-[#080808] transition-all duration-300 ease-in-out relative`}
      >
        {/* Toggle Button */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-20 bg-blue-600 hover:bg-blue-500 text-white p-1 rounded-full border-4 border-[#050505] shadow-lg z-50 transition-colors"
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 px-2'} mb-10 overflow-hidden`}>
          <div className="w-8 h-8 min-w-[32px] bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white italic shadow-lg shadow-blue-900/20">R</div>
          {!isCollapsed && (
            <h1 className="text-xl font-extrabold tracking-tighter text-white animate-in fade-in slide-in-from-left-2 duration-300">
              RECRUITSTREAM
            </h1>
          )}
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                title={isCollapsed ? item.label : undefined}
                className={`w-full flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-3'} py-2.5 rounded-xl transition-all ${
                  activeTab === item.id 
                  ? 'bg-white/10 text-white font-medium shadow-inner' 
                  : 'hover:bg-white/5 text-gray-400 hover:text-gray-200'
                }`}
              >
                <Icon size={20} className="min-w-[20px]" />
                {!isCollapsed && (
                  <span className="whitespace-nowrap overflow-hidden animate-in fade-in duration-300">
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="pt-4 mt-4 border-t border-white/5 space-y-1">
          <button 
            onClick={() => setActiveTab('settings')}
            title={isCollapsed ? "Settings" : undefined}
            className={`w-full flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-3'} py-2.5 rounded-xl transition-all ${
              activeTab === 'settings' 
              ? 'bg-white/10 text-white font-medium shadow-inner' 
              : 'hover:bg-white/5 text-gray-400 hover:text-gray-200'
            }`}
          >
            <Settings size={20} className="min-w-[20px]" />
            {!isCollapsed && <span className="whitespace-nowrap overflow-hidden animate-in fade-in duration-300">Settings</span>}
          </button>
          <button 
            title={isCollapsed ? "Logout" : undefined}
            className={`w-full flex items-center ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-3'} py-2.5 rounded-xl hover:bg-white/5 text-red-400 transition-all`}
          >
            <LogOut size={20} className="min-w-[20px]" />
            {!isCollapsed && <span className="whitespace-nowrap overflow-hidden animate-in fade-in duration-300">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative">
        <header className="sticky top-0 z-10 bg-[#050505]/80 backdrop-blur-md px-8 py-4 border-b border-white/5 flex items-center justify-end">
          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-full hover:bg-white/5 transition-colors">
              <Bell size={20} className="text-gray-400" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-white/10">
              <div className="text-right">
                <p className="text-xs font-medium text-white">{athlete.name}</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Class of {athlete.class}</p>
              </div>
              <img 
                src={athlete.profileImage || "https://picsum.photos/seed/athlete1/100/100"} 
                className="w-10 h-10 rounded-full border border-white/10 shadow-lg object-cover" 
                alt="Profile" 
              />
            </div>
          </div>
        </header>

        <div className="p-8 max-w-[1600px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;

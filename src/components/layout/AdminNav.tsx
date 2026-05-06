import React from 'react';
import { LayoutDashboard, Activity, Users } from 'lucide-react';

interface AdminNavProps {
  activeTab?: 'content' | 'analytics' | 'prospect';
}

export const AdminNav = ({ activeTab }: AdminNavProps) => (
  <div className="flex space-x-6 mr-8 border-r border-white/10 pr-8">
    <a 
      href="/dashboard" 
      className={`text-sm font-medium flex items-center transition-colors ${activeTab === 'content' ? 'text-white font-bold' : 'text-gray-400 hover:text-white'}`}
    >
      <LayoutDashboard className="w-4 h-4 mr-2" /> Conteúdo
    </a>
    <a 
      href="/webdata" 
      className={`text-sm font-medium flex items-center transition-colors ${activeTab === 'analytics' ? 'text-white font-bold' : 'text-gray-400 hover:text-white'}`}
    >
      <Activity className="w-4 h-4 mr-2" /> Analytics
    </a>
    <a 
      href="/prospect" 
      className={`text-sm font-medium flex items-center transition-colors ${activeTab === 'prospect' ? 'text-white font-bold' : 'text-gray-400 hover:text-white'}`}
    >
      <Users className="w-4 h-4 mr-2" /> Prospecção
    </a>
  </div>
);

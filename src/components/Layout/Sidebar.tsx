import React from 'react';
import { 
  Home, 
  Send, 
  Inbox, 
  BarChart3, 
  Settings, 
  Users,
  Webhook
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'publisher', label: 'Publisher', icon: Send },
    { id: 'consumer', label: 'Consumer', icon: Inbox },
    { id: 'events', label: 'Events', icon: Webhook },
    { id: 'stats', label: 'Statistics', icon: BarChart3 },
    { id: 'admin', label: 'Admin', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="bg-gray-900 text-white w-64 min-h-screen p-4">
      <div className="flex items-center gap-3 mb-8">
        <Webhook className="h-8 w-8 text-blue-400" />
        <h1 className="text-xl font-bold">WebhookHub</h1>
      </div>
      
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeTab === item.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;
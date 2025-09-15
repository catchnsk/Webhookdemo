import React, { useState } from 'react';
import Sidebar from './components/Layout/Sidebar';
import Overview from './components/Dashboard/Overview';
import WebhookPublisher from './components/Publisher/WebhookPublisher';
import WebhookConsumer from './components/Consumer/WebhookConsumer';
import EventsMonitor from './components/Events/EventsMonitor';
import Statistics from './components/Stats/Statistics';
import Registration from './components/Admin/Registration';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Overview />;
      case 'publisher':
        return <WebhookPublisher />;
      case 'consumer':
        return <WebhookConsumer />;
      case 'events':
        return <EventsMonitor />;
      case 'stats':
        return <Statistics />;
      case 'admin':
        return <Registration />;
      case 'settings':
        return (
          <div className="p-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Settings</h2>
            <p className="text-gray-600">Configure your webhook system settings</p>
            <div className="mt-8 bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <p className="text-gray-500">Settings panel coming soon...</p>
            </div>
          </div>
        );
      default:
        return <Overview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 overflow-auto">
        {renderContent()}
      </div>
    </div>
  );
}

export default App;
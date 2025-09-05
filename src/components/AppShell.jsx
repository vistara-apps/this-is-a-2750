import React from 'react';
import { Shield, FileText, History, Settings, AlertTriangle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import DigitalCard from './DigitalCard';
import RecordingControls from './RecordingControls';
import InteractionHistory from './InteractionHistory';
import SettingsPanel from './SettingsPanel';
import OnboardingModal from './OnboardingModal';

export default function AppShell() {
  const { state, dispatch } = useAppContext();

  const tabs = [
    { id: 'rights', label: 'Rights', icon: Shield },
    { id: 'record', label: 'Record', icon: AlertTriangle },
    { id: 'history', label: 'History', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderActiveTab = () => {
    switch (state.ui.activeTab) {
      case 'rights':
        return <DigitalCard />;
      case 'record':
        return <RecordingControls />;
      case 'history':
        return <InteractionHistory />;
      case 'settings':
        return <SettingsPanel />;
      default:
        return <DigitalCard />;
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col bg-surface/10 backdrop-blur-sm">
      {/* Header */}
      <header className="p-4 text-center text-white">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Shield className="w-8 h-8 text-accent" />
          <h1 className="text-2xl font-bold">Pocket Protector</h1>
        </div>
        <p className="text-sm opacity-90">Your Rights, Always in Hand</p>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 pb-20">
        {renderActiveTab()}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-surface/95 backdrop-blur-sm border-t border-white/20">
        <div className="flex justify-around py-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = state.ui.activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => dispatch({ type: 'SET_ACTIVE_TAB', payload: tab.id })}
                className={`flex flex-col items-center py-2 px-4 rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'text-accent bg-accent/10' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Onboarding Modal */}
      {state.ui.showOnboarding && <OnboardingModal />}
    </div>
  );
}
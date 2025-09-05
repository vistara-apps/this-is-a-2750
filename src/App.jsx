import React, { useState, useEffect } from 'react';
import AppShell from './components/AppShell';
import DigitalCard from './components/DigitalCard';
import RecordingControls from './components/RecordingControls';
import AlertSystem from './components/AlertSystem';
import InteractionHistory from './components/InteractionHistory';
import { AppProvider } from './context/AppContext';

function App() {
  return (
    <AppProvider>
      <div className="min-h-screen gradient-bg">
        <AppShell />
      </div>
    </AppProvider>
  );
}

export default App;